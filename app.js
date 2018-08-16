const express = require('express');
const bodyParser = require('body-parser');

var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(bodyParser.json({limit: '50mb'}));

app.use('/', router);

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

router.get('/quiz', function(req, res) {
    var acopyPopQuiz = Object.assign({}, popQuiz);
    delete acopyPopQuiz.correctAnswer;
    res.json(acopyPopQuiz);
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

app.listen(1337, function() {
    console.log("running on 1337");
})