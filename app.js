const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const mongodb_url="mongodb://mguser:password123@ds121982.mlab.com:21982/gabbi-db";
const dbName="gabbi-db";

var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(bodyParser.json({limit: '50mb'}));

app.use('/', router);

MongoClient.connect(mongodb_url, function(err, client) {
    assert.equal(null, err);
    console.log("Connecting to mongodb...");
    const db = client.db(dbName);
    var quizCollection = db.collection('quiz');

    var popQuiz = {
        question: "What is my name?",
        answers: [
            {selection: "a", value: "Kenneth"},
            {selection: "b", value: "Lisa"},
            {selection: "c", value: "Lisa"},
            {selection: "d", value: "Lisa"}
        ],
        correctAnswer: "a"
    };

    router.get('/testmg', function(req, res, next) {
        db.collection('quiz').insertOne(popQuiz, function(err, result) {
            console.log(result);
            client.close();
        });
        res.json({});
    })
    
    router.get('/quiz', function(req, res) {
        quizCollection.find({}).toArray(function(err, result) {
            console.log("from mongodb");
            console.log(JSON.stringify(result));
            res.json(result);
        });
    })
    
    router.post('/check-answer', function(req, res) {
        var answer = req.body;
        var isCorrect = false;
        if (popQuiz.correctAnswer === answer.answer) {
            console.log("CORRECT");
            isCorrect = true;
        } else {
            console.log("INCORRECT");
        }
    
        res.json({result: isCorrect});
    })
})

app.listen(1337, function() {
    console.log("running on 1337");
})