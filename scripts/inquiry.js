$(document).ready(function() {
    const fadeSpeed = 2000;
    const sleepDuration = fadeSpeed;
    const responses = [
        "Jeg skal fortælle dig.",
    ];

    let writingTimeout = 3; // in seconds
    let writingTimer = 0;
    let writingTimerSet = false;

    const questions = new Map();
    questions.set("Hvem er du?", "about");
    questions.set("hvem er du?", "about");
    questions.set("Hvem er du", "about");
    questions.set("hvem er du", "about");

    let lastQuestion = "";

    let questionField = $("#user-question-field");
    let questionCanvas = $("#user-question-canvas");
    let questionCanvasColor = questionCanvas.css("border-color");
    let questionEraseBtn = $("#question-erase");

    let answerContent = $("#user-inquiry-content");

    let welcomeText = $("#alice-ask");
    let responseText = $("#alice-tell");

    let questionCanvasContext = new handwriting.Canvas(document.getElementById("user-question-canvas"));
    questionCanvasContext.setLineWidth(2);
    questionCanvasContext.setCallBack(function(data,err) { getAnswer(data, err); });
    questionCanvasContext.setInputCallBack(function() { resetTimeoutCountdown() });
    questionCanvasContext.setOptions(
        {
            language: "da",
            numOfReturn: 1
        }
    );

    let askedBefore = false;
    async function answerQuestion(answer) {
        if (askedBefore) {
            answerContent.fadeOut(fadeSpeed);
            await sleep(sleepDuration);
            responseText.fadeOut(fadeSpeed);
            await sleep(sleepDuration);
        }

        if (answer !== null) {
            responseText.text(responses[Math.floor(Math.random() * responses.length)]);
            answerContent.empty();
            answerContent.append(answer);
            responseText.fadeIn(fadeSpeed);
            await sleep(sleepDuration);
            answerContent.fadeIn(sleepDuration);
            await sleep(sleepDuration);
        } else {
            responseText.text("Jeg forstår ikke hvad du siger.");
            responseText.fadeIn(fadeSpeed);
            await sleep(sleepDuration);
        }

        if (!askedBefore) {
            askedBefore = true;
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    questionEraseBtn.click(function() {
        questionCanvasContext.erase();
    });

    welcomeUser();
    async function welcomeUser() {
        responseText.hide();
        welcomeText.hide();
        responseText.hide();
        answerContent.hide();
        questionField.hide();
        welcomeText.fadeIn(fadeSpeed);
        await sleep(sleepDuration);
        questionField.fadeIn(fadeSpeed);
    }

    async function beginTimeoutCountdown() {
        while (writingTimer > 0) {
            writingTimer--;
            await sleep(1000);
        }
        writingTimerSet = false;
        questionCanvasContext.recognize();
    }

    function resetTimeoutCountdown() {
        questionCanvas.stop();
        questionCanvas.css("border-color", questionCanvasColor);
        questionCanvas.animate({borderColor:"transparent"}, writingTimeout * 1000);
        writingTimer = writingTimeout;
        if (!writingTimerSet) {
            writingTimerSet = true;
            beginTimeoutCountdown();
        }
    }

    function getAnswer(data, err) {
        if (err) {
            answerQuestion(null);
        } else {
            let question = questions.get(data[0]);
            console.log(data);
            if (question !== lastQuestion) {
                if (question !== undefined) {
                    $.get("inquires/" + question + ".html", function(answer) {
                        answerQuestion(answer);
                        lastQuestion = question;
                    });
                } else {
                    answerQuestion(null);
                }
            }
        }
    }
});