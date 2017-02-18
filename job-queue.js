global.bearer = '';
var kue = require('kue');
var jobs = kue.createQueue();
var request = require('request');
var OAuth2 = require('oauth').OAuth2;
var _ = require('underscore');
var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017/test';
var dbRef;
var maxId = '';
MongoClient.connect(mongoUrl, function(err, db) {
    dbRef = db;
    dbRef.createCollection('tweets');
});


var jobsQueue = function newJob(name) {
    name = name || 'Default_Name';
    var job = jobs.create('newJob', {
        name: name
    });

    job.on('complete', function () {
        setInterval(function(){
            jobs.create('newJob',{name: name}).save();
        },60000);
    }).on('failed', function () {

    });

    job.save();
}
const API_URL = 'https://api.twitter.com/1.1/search/tweets.json?q=%23';
const CONSUMER_KEY = "LMAAy4X1a8YuonIxyfYKXF9TC";
const CONSUMER_SECRET = "Yw2TK8jkrXOMqs6H15r5uDNjRdL5B7AZAgHkOc7Ui6cvgjKPMY";

var options = {
    headers: {
        Authorization: 'Bearer '
    }
};

function getToken(tag) {
    var oauth2 = new OAuth2(CONSUMER_KEY, CONSUMER_SECRET, 'https://api.twitter.com/', null, 'oauth2/token', null);
    oauth2.getOAuthAccessToken('', {
            'grant_type': 'client_credentials'
        },
        function (e, access_token, refresh_token, results) {
            global.bearer = access_token;
            options.url = API_URL+tag+"&lang=en";
            options.headers.Authorization += access_token;
            callApi(tag);
        });
}
function callApi(tag){
    if(maxId){
        options.url = options.url+'&since_id='+maxId;
    }
    request(options, function (err, response, body) {
        parseData(body,tag);
    });
}

var insertDocuments = function(results) {
  var collection = dbRef.collection('tweets');
  if(collection){  
    collection.insertMany(results,function(err,result){
    });
  }
}

var getData = function(tag){
    var collection = dbRef.collection('tweets');
    if(collection){
        var data = collection.find({'hash_tag': tag}).sort({'id':-1}).limit(50).toArray();
        data.then(function(result){
           if(result && result.length > 0){
               maxId = result[0].id;
           }
        },function(err){

        });
        return data;
    }
    return [];
}

function parseData(body,tag) {
    var statuses = JSON.parse(body).statuses;
    if(statuses && statuses.length){
        var results = _.map(statuses,function(status){
            var obj = _.pick(status, 'created_at','id','text','user','favorited','retweeted','favorite_count','retweet_count');
            obj.hash_tag = tag;
            return obj;
        });
        if(results.length > 0){
            insertDocuments(results);
        }
    }
}

jobs.process('newJob', function (job, done) {
    /* carry out all the job function here */
    var name = job.data.name;
    if (global.bearer) {
        options.url = API_URL+name+"&lang=en";
        callApi(name);
    } else {
        getToken(name);
    }
    done && done();
});

module.exports = {
    jobsQueue,getData
};