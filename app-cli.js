const prompt = require('prompt');
const request = require('request');

const API_URL = "http://localhost:1337/";
const QUIZ_API_URL = `${API_URL}quiz`;
const CHECK_ANSWER_API_URL = `${API_URL}check-answer`;

prompt.start();

var finalPopQuiz;
request(QUIZ_API_URL, function (err, response, body) {
    var popQuiz = JSON.parse(body);
    var randomPopQuiz = Math.floor(Math.random() * Math.floor(popQuiz.length));
    console.log(randomPopQuiz);
    finalPopQuiz = popQuiz[randomPopQuiz];
    console.log(finalPopQuiz._id);
    console.log(finalPopQuiz.question + "\n");
    console.log(finalPopQuiz.answers.forEach(element => {
        console.log(element.selection + ". " + element.value + "\n");
    }))
})

setTimeout(function () {
    prompt.get(['answer'], function (err, result) {

        if (err) {
            throw new Error('error in cli');
        }
        //console.log("Your answer: ", result.answer);

        var inputAnswer = {
            answer: result.answer,
            id: finalPopQuiz._id,
        }
        request({
            url: CHECK_ANSWER_API_URL,
            method: "POST",
            json: inputAnswer
        }, function (err, resp, body) {
            console.log(body.result);
            if (body.result === true) {
                console.log("BINGO!");
            } else {
                console.log("WRONG!!");
            };
            process.exit(1);
        })

    });
}, 1000)

