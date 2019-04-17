/*控制播放栏隐藏于显示*/
/*var su = document.querySelector('footer');
var div = document.querySelector(".hidde");
div.addEventListener("mouseenter", function () {
    su.style.display = "block";
})
div.addEventListener("mouseleave", function () {
    su.style.display = "none";
})*/
/*播放列表显示与隐藏*/
var slist = document.querySelector('.list');
var flag;
var song_list = document.querySelector('.s-list');
slist.addEventListener("click", function () {
    if (flag) {
        /*song_list.style.display = 'none';*/
        $(song_list).animate({
            bottom:-500
        },300)
    } else {
        /*song_list.style.display = 'block';*/
        $(song_list).animate({
            bottom:46
        },300)
    }
    flag=!flag;
});
(function () {
    /*音乐数据*/
    var data = localStorage.getItem('mList')?
        JSON.parse(localStorage.getItem('mList')):[];//播放数组  读取浏览器缓存
    var searchData=[]//搜索数组

    //获取元素
    var start = document.querySelector('.start');//开始
    var audio = document.querySelector('audio');
    var a_song = document.querySelector('.a-song');//歌名
    var s_singer = document.querySelector('.s_singer');//歌手名
    var playlist = document.querySelector('.playList');//播放列表
    var logoimg = document.querySelector('footer .bars .logo img');
    var prev = document.querySelector('.prev');
    var snext = document.querySelector('.next');
    var nowtime = document.querySelector('.Now_Time');
    var totalT = document.querySelector('.totalTime');
    var divNow = document.querySelector('.nowTime');
    var ctrl_bar = document.querySelector('.ctrl-bar');
    var ctrlbtn = document.querySelector('.ctrl-btn');
    var playMode = document.querySelector('.mode');
    var list_num = document.querySelector('.list-num');
    var model_info=document.querySelector('.model-info');
    var search=document.querySelector('.section');
    var ctrl_voice=document.querySelector('.ctrl-voice');
    var voice=document.querySelector('.voice');
    var delp=document.querySelector('.delp');
    var ptop=document.querySelector('.pTop');
    //删除播放列表
    delp.addEventListener('click',function () {
        data=[];
        localStorage.setItem('mList',JSON.stringify(data));
        data = localStorage.getItem('mList')?
            JSON.parse(localStorage.getItem('mList')):[];
        updatePlayList();
        listNum();
    })


    //变量
    var index = 0;//控制当前播放歌曲
    var rotateDeg = 0;//控制封面专辑旋转度数
    var timer = null;//定时器
    var moderIndex = 0;//播放模式 0；列表循环；1：单曲循环；2：随机播放
    var songnum = 0;//获取播放列表的歌曲个数

    //动态输出播放列表
    function updatePlayList() {
        var str = '';//用来拼接播放项
        for (var i = 0; i < data.length; i++) {
            str += '<li>';
            str += '<span class="left">' + data[i].name + '</span>';
            str += '<span class="right">';
            for(var j=0;j<data[i].ar.length;j++){
                str+=data[i].ar[j].name+'  ';
            }
            str+='<a>删除</a>'
            str += '</li>';
        }
        playlist.innerHTML = str;
    }
    updatePlayList();



    //选中播放列表中播放的歌曲
    function checkPlayList() {
        var lis = document.querySelectorAll('.s-list li');
        //先干掉所有其他的在添加
        if(lis.length){
            for (var i = 0; i < lis.length; i++) {
                lis[i].className = '';
            }
            lis[index].className = "active";
        }

    }

    //页面加载初始化方法
    function init() {
        //初始化播放列表
        if(data[index]!=null){
            rotateDeg = 0;
            audio.src ='http://music.163.com/song/media/outer/url?id='+data[index].id+'.mp3';
            logoimg.src = data[index].al.picUrl;
            checkPlayList();
            a_song.innerHTML = data[index].name;
            for(var i=0;i<data[index].ar.length;i++){
                s_singer.innerHTML =data[index].ar[i].name;
            }
        }

    }

    //初始化时间格式
    function formatTime(time) {
        return time > 9 ? time : '0' + time;
    }

    init();
    //音乐暂停播放
    //加载播放数量
    function listNum() {
        songnum = data.length;
        list_num.innerHTML = songnum;
    }
    listNum();
    //播放
    function play() {
        audio.play();
        start.style.backgroundPositionY = '-167px';
        clearInterval(timer);
        timer = setInterval(function () {
            //设置专辑的转动
            rotateDeg++;
            logoimg.style.transform = 'rotate(' + rotateDeg + 'deg)';
        }, 30)
    }

    //暂停
    function end() {
        audio.pause();
        start.style.backgroundPositionY = '-206px';
        clearInterval(timer);
    }

    //去不重复的随机数
    function getRandomNum(num, arr) {
        var randomNum = Math.floor(Math.random() * arr.length);
        if (randomNum == num) {
            randomNum = getRandomNum();
        }
        return randomNum;
    }
    //显示播放模式
    function info(str){
        $(model_info).fadeIn();
        model_info.innerHTML=str;
        clearInterval(timer);
        timer=setTimeout(function () {
            $(model_info).fadeOut();
        },1000)
    }
    //添加浏览器缓存
    $('.searchList').on('click','li',function () {
        var searchIndex=$(this).index();//获取你点击的索引值
        data.push(searchData[searchIndex]);
        localStorage.setItem('mList',JSON.stringify(data));//设置本地缓存
        //设置本地缓存更新
        data = localStorage.getItem('mList')?
            JSON.parse(localStorage.getItem('mList')):[];
        updatePlayList();
        listNum();
    });

    function invoice(str){
        $(ctrl_voice).fadeIn();
        ctrl_voice.innerHTML=str+'%';
        clearInterval(timer);
        timer=setTimeout(function () {
            $(ctrl_voice).fadeOut();
        },1000)
    }
    var volume1=0.5;
    //滑轮滚动控制音量
    $(voice).on('mousewheel DOMMouseScroll',onMouseScroll);
    function onMouseScroll(e){
        e.preventDefault();
        var wheel=e.originalEvent.wheelDelta||-e.originalEvent.detail;
        var dalta=Math.max(-1,Math.min(1,wheel));
        if(dalta<0){
            console.log('向下滚动');
            volume1-=0.1;
            volume1=volume1>=0?volume1:0;
            console.log(volume1);
            audio.volume=volume1;
            invoice(volume1.toFixed(2)*100);
        }else{
            volume1+=0.1;
            volume1=volume1>1?1:volume1;
            audio.volume=volume1;
            console.log('向上滚动');
            console.log(volume1);
            invoice(volume1.toFixed(2)*100);
        }
    }
     function Ptop() {
         $(ptop).fadeIn();
         clearInterval(timer);
         timer=setTimeout(function () {
             $(ptop).fadeOut();
         },1000)
     }
     function Pbottom() {
         $('.pBottom').fadeIn();
         clearInterval(timer);
         timer=setTimeout(function () {
             $('.pBottom').fadeOut();
         },1000)
     }
    //滑轮控制播放列表
    var he=0;
    $(playlist).on('mousewheel DOMMouseScroll',onPlayList);
    function onPlayList(e){
        e.preventDefault();
        var wheel=e.originalEvent.wheelDelta||-e.originalEvent.detail;
        var dalta=Math.max(-1,Math.min(1,wheel));
        if(dalta<0){
            console.log('向下滚动');
            var num=data.length-10;
            he-=30;
            he=he<-(num*31)?-(num*31):he;
            playlist.style.marginTop =he+ 'px';
            var he1=Math.abs(he);

            var num2=num*31;
            if(he1===num2){
                Pbottom();
            }
        }else{
            he+=30;
            he=he>40?40:he;
            playlist.style.marginTop = he+ 'px';
            if(he==40){
                Ptop();
            }
        }
    }

    //输入框Enter键搜索
    search.addEventListener('keydown',function (e) {
        if(e.keyCode===13){
            $.ajax({
                url:'https://api.imjad.cn/cloudmusic/',//请求地址
                data:{
                    type:'search',//搜索
                    s:search.value//获取输入框的值
                },
                type:'get',//get请求
                //请求成功后触发
                success:function (result) {
                    searchData=result.result.songs;
                    //将搜索成功的数据添加到列表里
                    var str='';
                    for(var i=0;i<searchData.length;i++){
                        str+='<li>';
                        str+='<span class="song left">'+searchData[i].name+'</span>';
                        str+='<span class="song right">';
                        for(var j=0;j<searchData[i].ar.length;j++){
                            str+=searchData[i].ar[j].name+'  ';
                        }
                        str+='</span>';
                        str+='</li>'
                    }
                    $('.searchList').html(str);
                },
                //将搜索失败的数据添加到列表里
                error:function (err) {
                    console.log(err);
                }
            });
            this.value='';//按下回车情况搜索栏
        }
    })
    //设置播放模式
    playMode.addEventListener('click', function () {
        moderIndex++;
        moderIndex = moderIndex > 2 ? 0 : moderIndex;
        switch (moderIndex) {
            case 0:
                playMode.style.backgroundPositionX = -3 + 'px'
                playMode.style.backgroundPositionY = -343 + 'px';
                info('循序播放');
                break;
            case 1:
                playMode.style.backgroundPositionX = -67 + 'px'
                playMode.style.backgroundPositionY = -343 + 'px';
                info('单曲循环');
                break;
            case 2:
                playMode.style.backgroundPositionX = -67 + 'px'
                playMode.style.backgroundPositionY = -247 + 'px';
                info('随机播放');
                break;
        }
    })

    //点击某个歌曲是播放这首歌曲
    $(playlist).on('click','li',function (e) {
        var inde =$(this).index();
        //删除单个
        if(e.target.localName==='a'){
            data.splice(inde,1);
            localStorage.setItem(
                'mList',JSON.stringify(data)
            );
            data = localStorage.getItem('mList')?
                JSON.parse(localStorage.getItem('mList')):[];
            updatePlayList();
            listNum();
            index-=index>0?index:0;
        }else{
            index=inde;
            init();
            play();
        }

    });

    start.addEventListener('click', function () {
        //当歌曲暂停的时候为true
        if (audio.paused) {
            play();
        } else {
            end();
        }
    })
    //下一曲
    snext.addEventListener('click', function () {
        index++;
        index = index > data.length - 1 ? 0 : index;
        init();
        play();
    })
    //上一曲
    prev.addEventListener('click', function () {
        index--;
        index = index < 0 ? data.length - 1 : index;
        init();
        play();
    })
    //canplay可以播放歌曲
    audio.addEventListener('canplay', function () {
        var totalTime = audio.duration;
        var totalBarWidth = ctrl_bar.clientWidth;//获取进度条总长度
        var totalM = parseInt(totalTime / 60);//分钟
        var totalS = parseInt(totalTime % 60);//秒
        totalT.innerHTML = formatTime(totalM) + ':' + formatTime(totalS);//显示歌曲总时间
        //timeupdate实时更新
        audio.addEventListener('timeupdate', function () {
            var currenttime = audio.currentTime;
            var currentM = parseInt(currenttime / 60);
            var currentS = parseInt(currenttime % 60);
            nowtime.innerHTML = formatTime(currentM) + ':' + formatTime(currentS);//歌曲正在进行时间
            var nowBar = currenttime / totalTime * totalBarWidth;//获取当前进度条宽度
            divNow.style.width = nowBar + 'px';//进度条
            ctrlbtn.style.left = nowBar - 8 + 'px';//进度条圆
            //audio.ended检查歌曲是否播放完毕
            if (audio.ended) {
                //检查播放模式
                switch (moderIndex) {
                    case 0:
                        //触发下一曲的点击事件
                        var e = document.createEvent("MouseEvents");//创建鼠标Event对象
                        e.initEvent("click", true, true);//初始化成点击
                        snext.dispatchEvent(e);//触发
                        break;
                    case 1:
                        init();
                        play();
                        break;
                    case 2:
                        //取随机数
                        index = getRandomNum(index, data);
                        init();
                        play();
                        break;
                }
            }
        })
        ctrl_bar.addEventListener('click', function (e) {
            var mouseX = e.offsetX;//获取鼠标点击进度条时距离总进度条最左边的距离
            var nowTimes = mouseX / totalBarWidth * totalTime;//通过宽度计算时间
            audio.currentTime = nowTimes;//修改时间为你点击地方的时间
        })
    })
    //搜索列表点击播放
    $('.searchList').on('click','li',function () {
        index=data.length-1;
        init();
        play();
    })

})();


