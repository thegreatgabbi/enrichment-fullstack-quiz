const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const ObjectId = require('mongodb').ObjectId;
const path = require('path');

// "mongodb://mguser:password123@ds121982.mlab.com:21982/gabbi-db";
const mongodb_url = process.env.MONGODB_URL;
const dbName = "gabbi-db";

var app = express();

// config stuff: https://expressjs.com/en/api.html#app.set
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// init router
var router = express.Router();

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json({ limit: '50mb' }));

app.use('/', router);

MongoClient.connect(mongodb_url,
    { useNewUrlParser: true },
    function (err, client) {
        assert.equal(null, err);
        console.log("Connecting to mongodb...");
        const db = client.db(dbName);
        var quizCollection = db.collection('quiz');

        var popQuiz = {
            question: "What is my name?",
            answers: [
                { selection: "a", value: "Kenneth" },
                { selection: "b", value: "Lisa" },
                { selection: "c", value: "Lisa" },
                { selection: "d", value: "Lisa" }
            ],
            correctAnswer: "a"
        };

        router.post('/newQuiz', function (req, res, next) {
            var newPopQuizForm = req.body;

            var newPopQuiz = {
                question: newPopQuizForm.question,
                answers: [],
                correctAnswer: newPopQuizForm.correctAnswer
            }

            newPopQuiz.answers.push({ selection: 'a', value: newPopQuizForm.answer1 })
            newPopQuiz.answers.push({ selection: 'b', value: newPopQuizForm.answer2 })
            newPopQuiz.answers.push({ selection: 'c', value: newPopQuizForm.answer3 })
            newPopQuiz.answers.push({ selection: 'd', value: newPopQuizForm.answer4 })

            quizCollection.insertOne(newPopQuiz, function (err, result) {
                console.log(result);
                res.redirect('/list-quizes');
            });
        })

        router.post('/editQuiz', function (req, res, next) {
            var editPopQuizForm = req.body;

            var editPopQuiz = {
                question: editPopQuizForm.question,
                answers: [],
                correctAnswer: editPopQuizForm.correctAnswer
            }

            editPopQuiz.answers.push({ selection: 'a', value: editPopQuizForm.answer1 })
            editPopQuiz.answers.push({ selection: 'b', value: editPopQuizForm.answer2 })
            editPopQuiz.answers.push({ selection: 'c', value: editPopQuizForm.answer3 })
            editPopQuiz.answers.push({ selection: 'd', value: editPopQuizForm.answer4 })
            
            console.log("edited:", editPopQuiz);
            console.log("body:", req.body);
            
            var oid = new ObjectId(editPopQuizForm.id);
            quizCollection.update(
                { _id: oid },
                editPopQuiz
            );
            res.redirect('/list-quizes');
            
        })

        router.get('/show-newQuizform', function (req, res, next) {
            res.render('newQuiz', {});
        })

        router.get('/show-EditQuiz/:id', function (req, res, next) {
            var oid = new ObjectId(req.params.id);
            quizCollection.findOne({ _id: oid }, function (err, result) {
                console.log(JSON.stringify(result));
                res.render('editQuiz', { editQuiz: result });
            })
        })

        router.get('/show-DeleteQuiz/:id', function (req, res, next) {
            var oid = new ObjectId(req.params.id);
            quizCollection.remove({ _id: oid }, function (err, result) {
                console.log(JSON.stringify(result));
                res.redirect('/list-quizes');
            })
        })

        router.get('/list-quizes', function (req, res, next) {
            quizCollection.find({}).project({ correctAnswer: 0 }).toArray(function (err, result) {
                console.log("from mongodb");
                console.log(JSON.stringify(result));
                res.render('listQuiz', { quizes: result });
            });
        })

        router.get('/quiz', function (req, res) {
            quizCollection.find({}).project({ correctAnswer: 0 }).toArray(function (err, result) {
                console.log("from mongodb");
                console.log(JSON.stringify(result));
                res.json(result);
            });
        })

        router.post('/check-answer', function (req, res) {
            var answer = req.body;
            var isCorrect = false;

            console.log("ID", answer.id);

            var oid = new ObjectId(answer.id);
            quizCollection.findOne({ _id: oid }, function (err, result) {

                console.log(JSON.stringify(result));
                if (result.correctAnswer === answer.answer) {
                    console.log("CORRECT");
                    isCorrect = true;
                } else {
                    console.log("INCORRECT");
                }
                console.log("correct?", isCorrect);
                res.json({ result: isCorrect });
            })
        })
    })

// 1337
app.listen(process.env.PORT, function () {
    console.log("running on " + process.env.PORT);
})