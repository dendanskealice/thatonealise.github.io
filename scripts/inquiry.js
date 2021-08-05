$(document).ready(function() {
    const fadeSpeed = 2000;
    const sleepDuration = fadeSpeed / 2;

    const responses = [
        "Let me tell you.",
        "I will tell you.",
        "Very well.",
        "If you so desire.",
        "As you wish.",
        "So be it.",
        "Alright."
    ];

    let inquiry = $("#user-inquiry-button");
    let inquiryText = $("#user-inquiry-text");
    let inquiryForm = $("#user-inquiry-form");
    let inquiryContent = $("#user-inquiry-content");
    let inquires = $("#user-inquires");
    let foreword = $("#alice-ask");
    let postscript = $("#alice-tell");
    let lastInquiry = null;
    let gotFirstResponse = false;

    foreword.hide();
    postscript.hide();
    inquiryContent.hide();
    inquiryForm.hide();

    fadeDialogue(foreword, inquiryForm);

    inquiry.click(function() {
        dropdown(inquires);
        $(this).toggleClass("open");
    });
  
    $(".user-inquiry").click(function() {
        let selected = $(this);
        selected.hide();

        inquiryText.text(selected.text());

        if (lastInquiry !== null) {
            lastInquiry.show();
        }
        lastInquiry = selected;

        $(this).toggleClass("open");
        dropdown(inquires);

        $.get( "inquires/" + selected.attr("id") + ".html", function(page) {
            if (!gotFirstResponse) {
                gotFirstResponse = true;
                inquiryContent.empty();
                inquiryContent.append(page);
                postscript.text(responses[Math.floor(Math.random() * responses.length)]);
                fadeDialogue(postscript, inquiryContent);
            } else {
                fadeDialogue(postscript, inquiryContent, onFadeMidpointReached(page), gotFirstResponse);
            } 
        });
    });

    async function fadeDialogue(request, response, onMidpointReached = null, fadeOutAndIn = false)
    {
        if (fadeOutAndIn) {
            request.fadeToggle(fadeSpeed);
            await sleep(sleepDuration);
            response.fadeToggle(fadeSpeed);
        }
        
        request.fadeToggle(fadeSpeed);
        await sleep(sleepDuration);
        
        if (onMidpointReached !== null) {
            onMidpointReached();
        }

        response.fadeToggle(fadeSpeed);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function dropdown(content = null, speed = 100) {
        content.fadeToggle(speed);
    }

    function onFadeMidpointReached(page) {
        postscript.text(responses[Math.floor(Math.random() * responses.length)]);
        inquiryContent.empty();
        inquiryContent.append(page);
    }
});