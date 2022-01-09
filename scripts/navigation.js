$(document).ready(function() {
    class Roadmap {
        constructor(title, confirmations, rejections, questions) {
            this.title = title;
            this.confirmations = confirmations;
            this.rejections = rejections;
            this.questions = questions;
        }
    }

    const fadeSpeed = 2000;
    const sleepDuration = fadeSpeed;
    const writingTimeout = 3; // in seconds
    const questionField = $("#user-question-field");
    const questionCanvas = $("#user-question-canvas");
    const questionCanvasColor = questionCanvas.css("border-color");
    const questionEraseBtn = $("#question-erase");
    const answerContent = $("#user-inquiry-content");
    const welcomeText = $("#alice-ask");
    const responseText = $("#alice-tell");

    let languageUsed = window.localStorage.getItem("language");
    if (languageUsed === null) {
        languageUsed = "en";
        window.localStorage.setItem("language", languageUsed);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getLocalizedPath(path) {
        return "content/" + languageUsed + "/" + path;
    }

    $.get(getLocalizedPath("roadmap.txt"), function(rawRoadmap) {
        if (rawRoadmap !== null) {
            let sections = rawRoadmap.split("\r\n*\r\n");

            let title = sections[0]; // Localised title.
            let rejections = sections[1].split("\r\n");
            let confirmations = sections[2].split("\r\n");
            let questions = new Map();

            // Deserialise questions.
            let lines = sections[3].split("\r\n");
            for (const line of lines) {
                let pair = line.split('=');
                let question = pair[0];
                let response = pair[1];
                questions.set(question, response);
            }

            let roadmap = new Roadmap(title, confirmations, rejections, questions);
            let writingTimer = 0;
            let writingTimerSet = false;
            let lastQuestion = "";

            let questionCanvasContext = new handwriting.Canvas(document.getElementById("user-question-canvas"));
            questionCanvasContext.setLineWidth(2);
            questionCanvasContext.setCallBack(function(data,err) { getAnswer(data, err); });
            questionCanvasContext.setInputCallBack(function() { resetTimeoutCountdown() });
            questionCanvasContext.setOptions(
                {
                    language: languageUsed,
                    numOfReturn: 1
                }
            );

            document.title = roadmap.title;

            let askedBefore = false;
            async function answerQuestion(answer) {
                if (askedBefore) {
                    answerContent.fadeOut(fadeSpeed);
                    await sleep(sleepDuration);
                    responseText.fadeOut(fadeSpeed);
                    await sleep(sleepDuration);
                }

                if (answer !== null) {
                    responseText.text(roadmap.confirmations[Math.floor(Math.random() * roadmap.confirmations.length)]);
                    answerContent.empty();
                    answerContent.append(answer);
                    responseText.fadeIn(fadeSpeed);
                    await sleep(sleepDuration);
                    answerContent.fadeIn(sleepDuration);
                    await sleep(sleepDuration);
                } else {
                    responseText.text(roadmap.rejections[Math.floor(Math.random() * roadmap.rejections.length)]);
                    responseText.fadeIn(fadeSpeed);
                    await sleep(sleepDuration);
                }

                if (!askedBefore) {
                    askedBefore = true;
                }
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
                            $.get(getLocalizedPath("responses/" + question + ".html"), function(answer) {
                                answerQuestion(answer);
                                lastQuestion = question;
                            });
                        } else {
                            answerQuestion(null);
                        }
                    }
                }
            }
        }
    }).fail(function() {

    });
});