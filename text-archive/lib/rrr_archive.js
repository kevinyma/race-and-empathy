/**
 * Created by dongwookyoon on 6/25/15.
 */


var draw_ctx;
var recordings = [];

var postToDbsServer = function(op, msg){
    var SERVER_DBS_URL = '/dbs';
    return new Promise(function(resolve, reject){
        var url = SERVER_DBS_URL + '?op=' + op;
        var posting = $.post(url, msg);
        posting.success(function(resp){
            resolve(resp);
        });
        posting.fail(function(err){
            reject(err)
        });
    });
};

postToDbsServer('GetRrrJson')
    .then(function(resp){
        console.log('downloaded data:', resp);
    })
    .catch(function(err){
        console.error(err);
    });


var refreshDatabase = function(){
    console.log('refresh');
    $('#database_ul').empty();
    postToDbsServer('GetRrrDatabase')
        .then(function(resp){
            for(var i = 0; i < resp.length; ++i){
                var s = resp[i];
                s = s.substring(s.indexOf('_')+1, s.length-4);
                var date_str = new Date(parseInt(s));

                var $li = $('<li></li>');
                $('#database_ul').append($li);

                var $dl = $('<a>'+date_str+'</a>');
                $dl.attr('href', resp[i]);
                $dl.attr('target', '_blank');
                $li.append($dl);

                var $play = $('<button>play</button>');
                $play.attr('name', resp[i]);
                $play.attr('class', 'play');
                $play.attr('onclick', 'playThis(this.name)');
                $li.append($play);



                console.log(date_str, s);
            }
        })
        .catch(function(err){
            console.error(err);
        });
};

var playThis = function(thisName){
    var audioLink = $(this).attr("name");
    var audio = document.getElementById("audio");
    audio.src = thisName;
      audio.load();
      audio.play();
}

var uploadAudioBlob = function(blob){


    var putBlobWithSas = function(url, sas, blob){
        return new Promise(function(resolve, reject){
            var blob_reader = new FileReader();
            blob_reader.onloadend = function(evt){
                if (evt.target.readyState === FileReader.DONE) {
                    var requestData = new Uint8Array(evt.target.result);
                    $.ajax({
                        url: url+'?'+sas,
                        type: 'PUT',
                        data: requestData,
                        processData: false,
                        beforeSend: function(xhr) {
                            xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
                        },
                        xhr: function(){
                            var xhr = new window.XMLHttpRequest();
                            xhr.upload.addEventListener(
                                'load',
                                function(e){
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


    var fname = 'rrr_'+(new Date()).getTime();
    return postToDbsServer('GetUploadSas', {fname:fname})
        .then(function(resp){
            return putBlobWithSas(resp.url, resp.sas, blob);
        });

};


window.onload = function(){
    draw_ctx = document.getElementById("playbar").getContext("2d");
    requestAnimFrame(drawPlaybar);
    $("#recording_stop_btn").prop("disabled",true);
    r2.audioRecorder.Init("../../").catch(
        function(err){
            alert(err.message);
        }
    );
};

var clickRecordingStart = function(){
    $("#recording_start_btn").prop("disabled",true);
    $("#recording_stop_btn").prop("disabled",false);
    r2.audioRecorder.BgnRecording();
};

var clickRecordingStop = function(){
    r2.audioRecorder.EndRecording(
        function(url, blob){
            $("#recording_start_btn").prop("disabled",false);
            $("#recording_stop_btn").prop("disabled",true);

            recordings.push({id:recordings.length, url:url});

            $("#playbar").mousedown(playbarMouseDown);

            uploadAudioBlob(blob)
                .then(function(url){
                    refreshDatabase();
                    console.log(url);
                })
                .catch(function(err){
                    console.error(err);
                });
        }
    );
};

var playbarMouseDown = function(event){
    if(recordings.length === 0){return;}

    var recording = recordings[recordings.length-1];
    var time = r2.audioPlayer.getDuration()*event.offsetX/$("#playbar").width();
    r2.audioPlayer.play(recording.id, recording.url, time);
};

var drawPlaybar = function(){
    requestAnimFrame(drawPlaybar);

    var w = $("#playbar").width();
    var h = $("#playbar").height();
    draw_ctx.fillStyle = "gray";
    draw_ctx.fillRect(0, 0, w, h);

    var progress = w*r2.audioPlayer.getPlaybackTime()/r2.audioPlayer.getDuration();

    draw_ctx.fillStyle = "red";
    draw_ctx.fillRect(0, 0, progress, h);
};

// render timer
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000/30); // 30fps
        };
})();

refreshDatabase();