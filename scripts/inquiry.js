$(document).ready(function() {
    const fadeSpeed = 2000;
    const sleepDuration = fadeSpeed;
    const responses = [
        "Jeg skal fortælle dig.",
    ];

    const questions = new Map();
    questions.set("Hvem er du?", "about");
    questions.set("hvem er du?", "about");
    questions.set("Hvem er du", "about");
    questions.set("hvem er du", "about");

    let answerContent = $("#user-inquiry-content");

    let questionField = $("#user-question-field");
    let questionCanvas = $("#user-question-canvas");
    let questionCanvasColor = questionCanvas.css("border-color");
    let questionEraseBtn = $("#question-erase");
    let questionEraseBtnColor = questionEraseBtn.css("border-color");

    let welcomeText = $("#alice-ask");
    let responseText = $("#alice-tell");

    let writingTimeout = 3; // in seconds
    let writingTimer = 0;
    let writingTimerSet = false;

    let questionCanvasContext = new handwriting.Canvas(document.getElementById("user-question-canvas"));
    questionCanvasContext.setLineWidth(2);
    questionCanvasContext.setOptions(
        {
            language: "da",
            numOfReturn: 1
        }
    );

    questionCanvasContext.setCallBack(function(data, err) {
        if (err) {
            throw err;
        } else {
            let question = questions.get(data[0]);
            console.log(data);
            if (question !== undefined) {
                $.get("inquires/" + question + ".html", function(answer) {
                    answerQuestion(answer); 
                });
            }
        }
    });

    questionCanvasContext.setInputCallBack(function() {
        resetTimeoutCountdown();
    });

    let askedBefore = false;
    async function answerQuestion(answer) {
        if (askedBefore) {
            answerContent.fadeOut(fadeSpeed);
            await sleep(sleepDuration);
            responseText.fadeOut(fadeSpeed);
            await sleep(sleepDuration);
        }
        responseText.text(responses[Math.floor(Math.random() * responses.length)]);
        answerContent.empty();
        answerContent.append(answer);
        responseText.fadeIn(fadeSpeed);
        await sleep(sleepDuration);
        answerContent.fadeIn(sleepDuration);
        await sleep(sleepDuration);
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
        questionEraseBtn.stop();
        questionCanvas.css("border-color", questionCanvasColor);
        questionCanvas.animate({borderColor:"transparent"}, writingTimeout * 1000);
        questionEraseBtn.css("color", questionEraseBtnColor);
        questionEraseBtn.animate({color:"black"}, writingTimeout * 1000);
        writingTimer = writingTimeout;
        if (!writingTimerSet) {
            writingTimerSet = true;
            beginTimeoutCountdown();
        }
    }
});