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

    let questionBtn = $("#user-inquiry-button");
    let questionText = $("#user-inquiry-text");
    let questionForm = $("#user-inquiry-form");
    let answerContent = $("#user-inquiry-content");
    let questions = $("#user-questions");
    let welcomeText = $("#alice-ask");
    let responseText = $("#alice-tell");

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
    questionCanvas.mouseUp(function(e) {
        console.log("test");
    })

    let askedBefore = false;
    let lastInquiry = null;

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

    questionBtn.click(function() {
        questions.fadeToggle(100);
        questionBtn.toggleClass("open");
    });
  
    $(".user-question").click(function() {
        let selectedQuestion = $(this);
        selectedQuestion.hide();
        questionText.text(selectedQuestion.text());

        if (lastInquiry !== null) {
            lastInquiry.show();
        }
        lastInquiry = selectedQuestion;
        questionBtn.toggleClass("open");
        questions.fadeToggle(100);

        $.get("inquires/" + selectedQuestion.attr("id") + ".html", function(inquiry) {
            changeInquiry(inquiry); 
        });
    });

    welcomeUser();
    async function welcomeUser() {
        responseText.hide();
        welcomeText.hide();
        questionForm.hide();
        responseText.hide();
        answerContent.hide();
        welcomeText.fadeIn(fadeSpeed);
        await sleep(sleepDuration);
        questionForm.fadeIn(fadeSpeed);
    }
});