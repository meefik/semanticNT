/**
 * Инициализируем плеер, грузим вопросы, формируем массив
 */
function init(){
    var params = {
        allowScriptAccess: "always"
        //, wmode: "opaque"
    };

    var atts = { id: "ytapiplayer" };
    swfobject.embedSWF("http://www.youtube.com/apiplayer?enablejsapi=1&version=3",
            "ytapiplayer", "640", "480", "8", null, null, params, atts);

    $.ajax({
        url : "/" + document.location.hash.substr(1, document.location.hash.length),
        type: "GET",
        dataType: "html",
        success:function(h) {
            quiz = eval(h);
            videoId = quiz[0].ytId;

        }
    });

}

function onYouTubePlayerReady(playerId) {
    ytapiplayer = document.getElementById("ytapiplayer");
    ytapiplayer.cueVideoById(videoId);

    //После возобновления проигрывания
    if (sec != 0){
        ytapiplayer.seekTo(sec, false);
        ytapiplayer.playVideo();
    }
    timer = setInterval("checkSeconds()", 100);

    ytapiplayer.addEventListener("onStateChange", "onStateChange");


    ytapiplayer.getOptions("cc");
    //checkSeconds();
}

function onStateChange(){
    $("#totalTime").html(secToMin(ytapiplayer.getDuration()));
}

function play(){
    ytapiplayer.playVideo();
}

function showQuiz(quizId){
    ytapiplayer.pauseVideo();
    sec = ytapiplayer.getCurrentTime();
    $("#quiz").show();

    $("#ytapiplayer").height(0);
    $("#ytapiplayer").width(0);

    clearInterval(timer);

    curQuest = quiz[0].questions[quizId];


    $("#question").html(curQuest.question);
    $("#variants").html("");
    for (var i = 0; i < curQuest.variants.length; i++){
        $("#variants").html($("#variants").html() +
            "" +
            "<label class='radio' style='margin-top: 5px'>" +
            "<input type='radio' class = 'optionsRadios' name='optionsRadios' id='var'" + (i + 1) + ">" +
            curQuest.variants[i] +  "</label>" +
            ""
        )
    }

    $("#play").attr("disabled", "disabled");
    $("#pause").attr("disabled", "disabled");

    initQ();
}

function initQ(){
    $("#continue").hide();

    $("#message").html("&nbsp;")
    $("#skip").show();
    $("#submit").show();
    $("#message").removeClass("alert-success");
    $("#message").removeClass("alert-error");
    $("#message").removeClass("alert");
}

function hideQuiz(){
//    document.getElementById("quiz").style.visibility = "hidden";
//
//    document.getElementById("win").style.display = "block";

    $("#quiz").hide();
    $("#ytapiplayer").height(480);
    $("#ytapiplayer").width(640);
    ytapiplayer.playVideo();
    //init();

    timer = setInterval("checkSeconds()", 100);

    initQ();

    $("#play").removeAttr("disabled");
    $("#pause").removeAttr("disabled");
}

function pause(){
    ytapiplayer.pauseVideo();
}

function secToMin(sec){
    var time = Math.floor(sec / 60) + ':';
    var min = sec % 60;

    if (min < 10){
        time += "0" + min;
    } else {
        time += min;
    }

    return time;
}

function checkSeconds(){
    var cur = ytapiplayer.getCurrentTime();
    var total = ytapiplayer.getDuration();

    var secNorm = cur - (cur%1);



    $("#time").html(secToMin(secNorm));
//   if ((cur + 1) > total){
//        return;
//    }

    for (var i = 0; i < quiz[0].questions.length; i++){
        if (((cur - 0.1) < quiz[0].questions[i].time) && ((cur + 0.1) > quiz[0].questions[i].time)){
            //alert("111");
            if (old < (cur - 0.1)){
                showQuiz(i);
                old = cur;
            }

            //alert();
        }
    }

}

function checkQuiz(){
    var rightNum = curQuest.right;

    var radios = $(".optionsRadios");
    var win = false;

    for (var i = 0; i < radios.length; i++){
        if (radios[i].checked){
            if ((i + 1) == rightNum){
                win = true;
            }
        }
    }
    $("#message").addClass("alert");
    if (win){
        $("#continue").show();

        $("#message").html("Right answer!")
        $("#skip").hide();
        $("#submit").hide();


        $("#message").addClass("alert-success");
        $("#message").removeClass("alert-error");

    } else {
        $("#message").html("Incorrect!");
        $("#message").removeClass("alert-success");
        $("#message").addClass("alert-error");
    }
}