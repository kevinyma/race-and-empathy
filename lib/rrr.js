/**
 * Created by dongwookyoon on 6/25/15.
 */


var draw_ctx;
var recordings = [];

var postToDbsServer = function(op, msg) {
    var SERVER_DBS_URL = '/dbs';
    return new Promise(function(resolve, reject) {
        var url = SERVER_DBS_URL + '?op=' + op;
        var posting = $.post(url, msg);
        posting.success(function(resp) {
            resolve(resp);
        });
        posting.fail(function(err) {
            reject(err)
        });
    });
};

var refreshDatabase = function() {
    $('#database_ul').empty();
    postToDbsServer('GetRrrDatabase')
        .then(function(resp) {
            for (var i = 0; i < resp.length; ++i) {
                var s = resp[i];
                s = s.substring(s.indexOf('_') + 1, s.length - 4);
                var date_str = new Date(parseInt(s));

                var $li = $('<li></li>');
                $('#database_ul').append($li);

                var $a = $('<a>' + date_str + '</a>');
                $a.attr('href', resp[i]);
                $a.attr('target', '_blank');
                $li.append($a);

                //console.log(date_str, s);
            }
        })
        .catch(function(err) {
            console.error(err);
        });
};

var uploadAudioBlob = function(blob) {

    var putBlobWithSas = function(url, sas, blob) {
        return new Promise(function(resolve, reject) {
            var blob_reader = new FileReader();
            blob_reader.onloadend = function(evt) {
                if (evt.target.readyState === FileReader.DONE) {
                    var requestData = new Uint8Array(evt.target.result);
                    $.ajax({
                        url: url + '?' + sas,
                        type: 'PUT',
                        data: requestData,
                        processData: false,
                        beforeSend: function(xhr) {
                            xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
                        },
                        xhr: function() {
                            var xhr = new window.XMLHttpRequest();
                            xhr.upload.addEventListener(
                                'load',
                                function(e) {
                                    resolve(url);
                                },
                                false
                            );
                            return xhr;
                        },
                        error: reject
                    });
                }
            };
            blob_reader.readAsArrayBuffer(blob);
        });
    };
 
    var uniqueTag = $('#image').attr("alt");
    if (uniqueTag=='test'){
        uniqueTag = "clip0" + Math.floor(Math.random() * 9);
        //console.log("uniqueTag");
    }
    var fname = 'rrr_' + (new Date()).getTime() + '_' + uniqueTag;
    return postToDbsServer('GetRrrUploadSas', {
            fname: fname
        })
        .then(function(resp) {
            return putBlobWithSas(resp.url, resp.sas, blob);
        });

};


window.onload = function() {
    draw_ctx = document.getElementById("playbar").getContext("2d");
    requestAnimFrame(drawPlaybar);
    
    r2.audioRecorder.Init("../../").catch(
        function(err) {
            alert(err.message);
        }
    );
};

var clickRecordingStart = function() {
    $('#recording_circle').fadeIn('slow', function () {
        fadeItIn();
    });
    var aud = document.getElementById('audio');
    aud.currentTime=0;
    aud.pause();

    $('#recording').show();
    $('#recording-mode').show();
    $('#playing').delay(200).fadeOut(640);
    $('#done-recording').hide();
    r2.audioRecorder.BgnRecording();
};

var audioBlob;

var clickRecordingStop = function() {
    //restore record button states 
    $("#recording_start_btn").children().show();
    $("#recording_start_btn_own").children().show();
    $("#recording_start_btn").removeClass('transform-active');
    $("#recording_start_btn_own").removeClass('transform-active');

    setTimeout(doneRecording, 2200);
    r2.audioRecorder.EndRecording(
        function(url, blob) {
            $("#recording_start_btn").prop("disabled", false);

            recordings.push({
                id: recordings.length,
                url: url
            });

            $("#playbar").mousedown(playbarMouseDown);
            audioBlob = blob;
            

        }
    );
};

var upload = function(blob){
     uploadAudioBlob(blob)
                .then(function(url) {
                    // console.log(url);
                })
                .catch(function(err) {
                    console.error(err);
                });
    
}


var playbarMouseDown = function(event) {
    if (recordings.length === 0) {
        return;
    }

    var recording = recordings[recordings.length - 1];
    var time = r2.audioPlayer.getDuration() * event.offsetX / $("#playbar").width();
    r2.audioPlayer.play(recording.id, recording.url, time);
};

var drawPlaybar = function() {
    requestAnimFrame(drawPlaybar);

    var w = $("#playbar").width();
    var h = $("#playbar").height();
    draw_ctx.fillStyle = "gray";
    draw_ctx.fillRect(0, 0, w, h);

    var progress = w * r2.audioPlayer.getPlaybackTime() / r2.audioPlayer.getDuration();

    draw_ctx.fillStyle = "red";
    draw_ctx.fillRect(0, 0, progress, h);
};

// render timer
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 30); // 30fps
        };
})();



refreshDatabase();

//initialize popup
$(document).ready(function() {
    $('#standalone').popup({
        color: 'white',
        opacity: 1,
        transition: '0.3s',
        scrolllock: true
    });

    $('#fade').popup({
        transition: 'all 0.3s',
        scrolllock: true // optional
    });
});

// helpers
var hideAll = function() {
    $('#playing').hide();
    $('#recording').hide();
    $('#done-recording').hide();
    $('#confirm-delete').hide();
    $('#confirm-submit').hide();
    $('#back-to-menu').hide();
    $('#success-mode').hide();
    $('#commenting').hide();
    $('#confirm-comment').hide();

    $('.hp_range').hide();

}

var audioComplete = function() {
    $('.record-comment').addClass('low_opacity_active');
    $('.record-comment').prop( "disabled", false );
    $('.record').addClass('low_opacity_active');
    $('.record').prop( "disabled", false );
    $('#playing').fadeIn(250);

}

var pauseOrPlay = function() {

    var aud = document.getElementById('audio');
    if (aud.paused){
        aud.play();
    } else {
        aud.pause();
    }
}

//button actions
var replay = function() {
    var aud = document.getElementById('audio');
    aud.pause();
    aud.currentTime=0;
    setTimeout(function () {      
       aud.play();
    }, 150);


}

var backToMenu = function(){
    document.getElementById('audio').pause();
    $('.hp_range').css('cssText', 'width: 0px !important');
    hideAll();
}

var stopRecording = function(){
    $('#recording-mode').fadeOut(200);
    $('#success-mode').delay(80).fadeIn(200);
    clickRecordingStop();
}

var doneRecording = function(){
    $('#recording').fadeOut(200);
    $('#done-recording').delay(160).fadeIn(200);
}

var deleteRecording = function(){
    $('#done-recording').fadeOut(200);
    $('#confirm-delete').delay(160).fadeIn(200);
    $('#confirm-delete').delay(1200).fadeOut(240);
    hideAll();
    $('#playing').delay(2200).fadeIn(240);

}
   
var submitRecording = function(){
    $('#done-recording').fadeOut(200);
    $('#confirm-submit').delay(160).fadeIn(200);
    $('#confirm-submit').delay(1200).fadeOut(240);
    hideAll();
    $('#playing').delay(2200).fadeIn(240);
    // setTimeout(closePopup, 6000);
   
    upload(audioBlob);
}

var comment = function(){
    console.log("hey!");
    $('#playing').fadeOut(200);
    $('#commenting').delay(80).fadeIn(200);

}

var submitComment = function(){
    var uniqueTag = $('#image').attr("alt");
    if (uniqueTag=='test'){
        uniqueTag = "clip0" + Math.floor(Math.random() * 9);
        //console.log("uniqueTag");
    }
    var comment = $("#comment-text-box").val()
    postToDbsServer('UploadRrrJson', {json:{
        type:uniqueTag,
        data:comment
    }})

    $('#commenting').fadeOut(200);
    $('#confirm-comment').delay(160).fadeIn(200);
    $('#confirm-comment').delay(1800).fadeOut(200);
    hideAll();
    $('#playing').delay(2400).fadeIn(200);
}



var recordOwnStory = function(){
    $('#image').attr("alt","null");
    clickRecordingStart();
}

var closePopup = function(){
    $(".close").click();

}

$(document).ready(function() {
    $('#recording_circle').hide();
    $('#recording_circle').css('color','#e60000');
            //hide all states
            hideAll();
            $('#playing').show();

            $("#collaborators").on('click', function() {
                $(".about-section").hide();
                $(".audio-section").hide();
                $(".collaborators-section").show();
                 var audio = document.getElementById("audio");
                 audio.pause();
            })

             $("#about").on('click', function() {
                $(".about-section").show();
                $(".audio-section").hide();
                $(".collaborators-section").hide();
                 var audio = document.getElementById("audio");
                 audio.pause();
            })
            $(".gallery-section").on('click', '.thumbnail', function() {
                $(".about-section").hide();
                $(".audio-section").show();
                $(".collaborators-section").hide();
                hideAll();

                //reset all phase states

                $('.record').removeClass('transform-active');
                $('.record').children().show();
                $('.record').removeClass('low_opacity_active');
                $('.record').prop( "disabled", true );


                $('.record-comment').removeClass('transform-active');
                $('.record-comment').removeClass('low_opacity_active');
                $('.record-comment').prop( "disabled", true );

                
                $('#playing').show();
                var audio = document.getElementById("audio");
                var src = $(this).find("a").attr("href");
                $('audio').attr("src", src);

                $('.hp_range').css('cssText', 'width: 0px');
                audio.addEventListener("timeupdate", function() {
                    var currentTime = audio.currentTime;
                    var duration = audio.duration;
                    $('.hp_range').stop(true,true).animate({'width':(currentTime +.25)/duration*100+'%'},250,'linear');
                });
                audio.load();




                //set one second delay before audio plays
                setTimeout(function(){
                   audio.play();

                }, 1000);

                
                var imgAlt = $(this).find(".resource").find("img").attr("alt");
                var imgSrc = $(this).find(".resource").find("img").attr("src");
                $('#image').attr("alt",imgAlt);
                $('#image').attr("src",imgSrc);


            $(".record").on('click', function() {
                $(this).children().fadeOut(240);
                $(this).addClass('transform-active');
            })

            //pauses audio when user clicks on grey area
            $("#fade_wrapper").on('click', function() {
                document.getElementById('audio').pause();
            })

            });
        });

var audio = document.getElementById("audio");

                

function fadeItIn() {
    $('#recording_circle').fadeIn(1300, function () {
        fadeItOut();
    });
}

function fadeItOut() {
    $('#recording_circle').fadeOut(1300, function () {
        fadeItIn();
    });
}


