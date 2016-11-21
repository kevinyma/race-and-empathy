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

postToDbsServer('GetRrrJson')
    .then(function(resp){
        console.log('downloaded data:', JSON.stringify(resp, null, 4));
        $('pre').html(resp);
    })
    .catch(function(err){
        console.error(err);
    });

var refreshDatabase = function() {
    $('pre').empty();
    postToDbsServer('GetRrrJson')
    .then(function(resp){
        console.log('downloaded data:', JSON.stringify(resp, null, 4));
        $('pre').html(resp);
    })
    .catch(function(err){
        console.error(err);
    });
    
};



