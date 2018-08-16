const prompt = require('prompt');
const request = require('request');

const API_URL = "http://localhost:1337/";
const QUIZ_API_URL = `${API_URL}quiz`;
const CHECK_ANSWER_API_URL = `${API_URL}check-answer`;

prompt.start();

request(QUIZ_API_URL, function (err, response, body) {
    var popQuiz = JSON.parse(body);
    console.log(popQuiz.question + "\n");
    console.log(popQuiz.answers.forEach(element => {
        console.log(element.selection + ". " + element.value + "\n"); 
    }))
})

setTimeout(function() {
    prompt.get(['answer'], function(err, result) {

        if(err) {
            throw new Error('error in cli');
        }
        //console.log("Your answer: ", result.answer);

        var inputAnswer = {
            answer: result.answer
        }
        request({
            url: CHECK_ANSWER_API_URL,
            method: "POST",
            json: inputAnswer
        }, function(err, resp, body) {
            if (body.result) {
                console.log("BINGO!");
            } else {
                console.log("WRONG!!");
            };
            process.exit(1);
        })

    });
}, 1000)

