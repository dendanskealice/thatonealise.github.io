$(document).ready(function() {
    const fadeSpeed = 2000;
    const sleepDuration = fadeSpeed;
    const responses = [
        "Let me tell you.",
        "Jeg skal fortælle dig.",
        "Very well.",
        "If you so desire.",
        "As you wish.",
        "So be it.",
        "Alright."
    ];

    let answerContent = $("#user-inquiry-content");
    let welcomeText = $("#alice-ask");
    let responseText = $("#alice-tell");
    let questionField = $("#user-question-field");

    let writingTimeout = 10;
    let writingTimer = 0;
    let writingTimerSet = false;

    let questionCanvas = new handwriting.Canvas(document.getElementById("user-question-canvas"));
    
    questionCanvas.setLineWidth(2);

    questionCanvas.setOptions(
        {
            language: "da",
            numOfReturn: 1
        }
    );

    questionCanvas.setCallBack(function(data, err) {
        if(err) throw err;
        else console.log(data);
    });

    questionCanvas.setInputCallBack(function() {
        writingTimer = writingTimeout;
        if (!writingTimerSet) {
            writingTimerSet = true;
            beginTimeoutCountdown();
        }
    });

    let askedBefore = false;
    async function changeInquiry(answer) {
        questionBtn.prop("disabled", true);
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
        questionBtn.prop("disabled", false);
        if (!askedBefore) {
            askedBefore = true;
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
  
    /*
    $(".user-question").click(function() {
        $.get("inquires/" + selectedQuestion.attr("id") + ".html", function(inquiry) {
            changeInquiry(inquiry); 
        });
    });
    */

    $("#question-erase").click(function() {
        questionCanvas.erase();
    });

    $("#question-submit").click(function() {
        questionCanvas.recognize();
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
    }
});