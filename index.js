var express = require('express');
var app = express();
var jobsQueue = require('./job-queue').jobsQueue;
var getData = require('./job-queue').getData;
var path = require('path');

app.get('/tags/:tag',function(req,res){
     var params = req.params;
     getData(params.tag).then(function(response){
         res.header('Access-Control-Allow-Origin', req.headers.origin || "*");
         res.send(JSON.stringify({data: response}));
         jobsQueue(params.tag);
     },function(err){
         res.send({error: err});
         jobsQueue(params.tag);
     });
});

app.listen(4000, function () {
  console.log('listening on port 4000');
});