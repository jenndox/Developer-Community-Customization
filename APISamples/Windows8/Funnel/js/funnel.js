var companyName = "devcommunity";

// Colors for Widgets
var lightFunnelColor = "#ECB78D";
var funnelColor = "#DC6D13";
var darkFunnelColor = "#462409";

var lightBubbleColor = "#BEAFE0";
var bubbleColor = "#7A53CF";
var darkBubbleColor = "#2D1E4E";

var bgTextColor = "#D7FFB2";
var lightTextColor = "#7BDD1F";
var textColor = "#508F14";
var darkTextColor = "#2C500B";

var numberFont = "bold 26px Helvetica";

var noneCount = 0;
var pendingCount = 0;
var activeCount = 0;
var completeCount = 0;
var maxBubbles = 20;

var noneBubbleLocations = new Array();
var pendingBubbleLocations = new Array();
var activeBubbleLocations = new Array();
var completeBubbleLocations = new Array();

var noneCounter = 0, pendingCounter = 0, activeCounter = 0, completeCounter = 0;

function outlineFunnel(ctx, height, width, initialX, initialY) {
    ctx.moveTo(initialX, initialY);
    ctx.lineTo(initialX + width / 2 - 15, initialY + height - 20);
    ctx.lineTo(initialX + width / 2 - 15, initialY + height);
    ctx.quadraticCurveTo(initialX + width / 2, initialY + height + 5, initialX + width / 2 + 10, initialY + height);
    ctx.lineTo(initialX + width / 2 + 10, initialY + height - 20);
    ctx.lineTo(initialX + width, initialY);
    ctx.quadraticCurveTo(initialX + width / 2, initialY + 10, initialX, initialY);
    ctx.quadraticCurveTo(initialX + width / 2, initialY - 10, initialX + width, initialY);
}

function setupStyle(ctx, initialX, initialY, width, height, colorStop) {
    var lineargradient = ctx.createLinearGradient(0, 0, initialX + width, initialY + height);
    lineargradient.addColorStop(0, lightFunnelColor);
    lineargradient.addColorStop(colorStop, funnelColor);
    lineargradient.addColorStop(1, darkFunnelColor);
    ctx.fillStyle = lineargradient;
    ctx.strokeStyle = darkFunnelColor;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
}

function drawFunnel(bubbleCount) {
    var canvas = document.getElementById('GSLabFunnel');
    if (canvas != null && canvas.getContext) {
        var ctx = canvas.getContext('2d');
        noneCount = bubbleCount;

        // Funnel
        var initialX = 15, initialY = 10;
        var height = 60, width = 70;
        setupStyle(ctx, initialX, initialY, width, height, 0.5);

        ctx.beginPath();
        outlineFunnel(ctx, height, width, initialX, initialY);
        ctx.stroke();

        ctx.beginPath();
        outlineFunnel(ctx, height, width, initialX, initialY);
        ctx.fill();

        ctx.beginPath();
        outlineFunnel(ctx, height, width, initialX, initialY);
        ctx.clip();

        var x = 0, y = 0;
        // draw circles
        ctx.strokeStyle = darkBubbleColor;
        ctx.fillStyle = lightBubbleColor;
        ctx.lineWidth = 2;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        for (var j = 0; j < Math.min(noneCount, maxBubbles) ; j++) {
            x = initialX + Math.floor(Math.random() * width);
            y = initialY + Math.floor(Math.random() * height);
            noneBubbleLocations[j] = [x, y];

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2, false);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2, false);
            ctx.fill();
        }

        noneCounter = 1;
        setInterval(redrawFunnel, 150);
    }
}

function redrawFunnel() {
    var canvas = document.getElementById('GSLabFunnel');
    if (canvas != null && canvas.getContext) {
        var ctx = canvas.getContext('2d');

        // Funnel
        var initialX = 15, initialY = 10;
        var height = 60, width = 70;
        setupStyle(ctx, initialX, initialY, width, height, 0.5);

        ctx.beginPath();
        outlineFunnel(ctx, height, width, initialX, initialY);
        ctx.fill();

        // draw circles
        ctx.strokeStyle = darkBubbleColor;
        ctx.fillStyle = lightBubbleColor;
        ctx.lineWidth = 2;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        for (var j = 0; j < Math.min(noneCount, maxBubbles) ; j++) {
            offset = Math.floor(Math.random() * 3);
            x = noneBubbleLocations[j][0] + pendingCounter;
            y = noneBubbleLocations[j][1] - offset;
            if (y < initialY) {
                y = height + initialY;
            }
            noneBubbleLocations[j] = [x, y];

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2, false);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2, false);
            ctx.fill();
        }
        noneCounter = 0 - noneCounter;
    }
}

function outlineTestTube(ctx, height, width, initialX, initialY) {
    ctx.moveTo(initialX, initialY);
    ctx.quadraticCurveTo(initialX - 3, initialY + 5, initialX, initialY + 5);
    ctx.lineTo(initialX, initialY + height);
    ctx.quadraticCurveTo(initialX + width / 2, initialY + height + 20, initialX + width, initialY + height);
    ctx.lineTo(initialX + width, initialY + 5);
    ctx.quadraticCurveTo(initialX + width + 3, initialY, initialX + width, initialY);
    ctx.quadraticCurveTo(initialX + width / 2, initialY + 5, initialX, initialY);
}

function drawTestTube(bubbleCount) {
    var canvas = document.getElementById('GSLabTestTube');
    if (canvas != null && canvas.getContext) {
        var ctx = canvas.getContext('2d');
        // Test Tube
        var initialX = 20, initialY = 7;
        var height = 60, width = 30;
        pendingCount = bubbleCount;
        setupStyle(ctx, initialX, initialY, width, height, 0.75);

        ctx.beginPath();
        outlineTestTube(ctx, height, width, initialX, initialY);
        ctx.stroke();


        ctx.beginPath();
        outlineTestTube(ctx, height, width, initialX, initialY);
        ctx.fill();

        ctx.beginPath();
        outlineTestTube(ctx, height, width, initialX, initialY);
        ctx.clip();

        var x = 0, y = 0;
        // draw circles
        ctx.strokeStyle = darkBubbleColor;
        ctx.fillStyle = lightBubbleColor;
        ctx.lineWidth = 2;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        for (var j = 0; j < Math.min(pendingCount, maxBubbles) ; j++) {
            x = initialX + Math.floor(Math.random() * width);
            y = initialY + Math.floor(Math.random() * height);
            pendingBubbleLocations[j] = [x, y];

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2, false);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2, false);
            ctx.fill();
        }

        pendingCounter = 1;
        setInterval(redrawTestTube, 200);
    }
}

function redrawTestTube() {
    var canvas = document.getElementById('GSLabTestTube');
    if (canvas != null && canvas.getContext) {
        var ctx = canvas.getContext('2d');
        // Test Tube
        var initialX = 20, initialY = 7;
        var height = 60, width = 30;
        setupStyle(ctx, initialX, initialY, width, height, 0.75);

        ctx.beginPath();
        outlineTestTube(ctx, height, width, initialX, initialY);
        ctx.fill();

        // draw circles
        ctx.strokeStyle = darkBubbleColor;
        ctx.fillStyle = lightBubbleColor;
        ctx.lineWidth = 2;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        for (var j = 0; j < Math.min(pendingCount, maxBubbles) ; j++) {
            offset = Math.floor(Math.random() * 3);
            x = pendingBubbleLocations[j][0] + pendingCounter;
            y = pendingBubbleLocations[j][1] - offset;
            if (y < initialY) {
                y = height + initialY;
            }
            pendingBubbleLocations[j] = [x, y];

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2, false);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2, false);
            ctx.fill();
        }

        pendingCounter = 0 - pendingCounter;
    }
}

function outlineBeaker(ctx, height, width, initialX, initialY) {
    ctx.moveTo(initialX + width / 2 - 15, initialY);
    ctx.lineTo(initialX + width / 2 - 15, initialY + 20);
    ctx.lineTo(initialX + 5, initialY + height - 5);
    ctx.quadraticCurveTo(initialX, initialY + height, initialX + 10, initialY + height + 5);
    ctx.quadraticCurveTo(initialX + width / 2, initialY + height + 20, initialX + width - 5, initialY + height + 5);
    ctx.quadraticCurveTo(initialX + width, initialY + height, initialX + width - 2, initialY + height - 5);
    ctx.lineTo(initialX + width / 2 + 10, initialY + 20);
    ctx.lineTo(initialX + width / 2 + 10, initialY);
    ctx.quadraticCurveTo(initialX + width / 2, initialY + 5, initialX + width / 2 - 15, initialY);
    ctx.quadraticCurveTo(initialX + width / 2, initialY - 5, initialX + width / 2 + 10, initialY);
}

function drawBeaker(bubbleCount) {
    var canvas = document.getElementById('GSLabBeaker');
    if (canvas != null && canvas.getContext) {
        var ctx = canvas.getContext('2d');
        // Beaker
        var initialX = 15, initialY = 7;
        var height = 55, width = 70;
        activeCount = bubbleCount;
        setupStyle(ctx, initialX, initialY, width, height, 0.65)

        ctx.beginPath();
        outlineBeaker(ctx, height, width, initialX, initialY);
        ctx.stroke();


        ctx.beginPath();
        outlineBeaker(ctx, height, width, initialX, initialY);
        ctx.fill();

        ctx.beginPath();
        outlineBeaker(ctx, height, width, initialX, initialY);
        ctx.clip();

        var x = 0, y = 0;
        // draw circles
        ctx.strokeStyle = darkBubbleColor;
        ctx.fillStyle = lightBubbleColor;
        ctx.lineWidth = 2;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        for (var j = 0; j < Math.min(activeCount, maxBubbles) ; j++) {
            x = initialX + Math.floor(Math.random() * width);
            y = initialY + Math.floor(Math.random() * height);
            activeBubbleLocations[j] = [x, y];
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2, false);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2, false);
            ctx.fill();
        }

        activeCounter = 1;
        setInterval(redrawBeaker, 50);
    }
}

function redrawBeaker() {
    var canvas = document.getElementById('GSLabBeaker');
    if (canvas != null && canvas.getContext) {
        var ctx = canvas.getContext('2d');
        // Beaker
        var initialX = 15, initialY = 7;
        var height = 55, width = 70;
        setupStyle(ctx, initialX, initialY, width, height, 0.65);

        ctx.beginPath();
        outlineBeaker(ctx, height, width, initialX, initialY);
        ctx.fill();

        // draw circles
        ctx.strokeStyle = darkBubbleColor;
        ctx.fillStyle = lightBubbleColor;
        ctx.lineWidth = 2;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        for (var j = 0; j < Math.min(activeCount, maxBubbles) ; j++) {
            offset = Math.floor(Math.random() * 3);
            x = activeBubbleLocations[j][0] + activeCounter;
            y = activeBubbleLocations[j][1] - offset;
            if (y < initialY) {
                y = height + initialY;
            }
            activeBubbleLocations[j] = [x, y];
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2, false);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2, false);
            ctx.fill();
        }
        activeCounter = 0 - activeCounter;
    }
}

function outlineRocket(ctx, height, width, initialX, initialY) {
    ctx.moveTo(initialX + width / 2, initialY);
    ctx.lineTo(initialX, initialY + width / 2);
    ctx.lineTo(initialX, initialY + height);
    ctx.quadraticCurveTo(initialX + width / 2, initialY + height + 7, initialX + width, initialY + height);
    ctx.lineTo(initialX + width, initialY + width / 2);
    ctx.lineTo(initialX + width / 2, initialY);
}

function drawRocket(bubbleCount) {
    var canvas = document.getElementById('GSLabRocket');
    if (canvas != null && canvas.getContext) {
        var ctx = canvas.getContext('2d');
        // Rocket
        var initialX = 15, initialY = 7;
        var height = 65, width = 30;
        completeCount = bubbleCount;
        setupStyle(ctx, initialX, initialY, width, height, 0.75);

        ctx.beginPath();
        outlineRocket(ctx, height, width, initialX, initialY);
        ctx.lineWidth = 10;
        ctx.moveTo(initialX, initialY + height / 2 + 7);
        ctx.lineTo(initialX - 10, initialY + height / 2 + 17);
        ctx.lineTo(initialX - 10, initialY + height);
        ctx.moveTo(initialX + width, initialY + height / 2 + 7);
        ctx.lineTo(initialX + width + 10, initialY + height / 2 + 17);
        ctx.lineTo(initialX + width + 10, initialY + height);
        ctx.stroke();

        ctx.beginPath();
        outlineRocket(ctx, height, width, initialX, initialY);
        ctx.fill();

        ctx.beginPath();
        outlineRocket(ctx, height, width, initialX, initialY);
        ctx.clip();

        var x = 0, y = 0;
        // draw circles
        ctx.strokeStyle = darkBubbleColor;
        ctx.fillStyle = lightBubbleColor;
        ctx.lineWidth = 2;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        for (var j = 0; j < Math.min(completeCount, maxBubbles) ; j++) {
            // Use random location
            x = initialX + Math.floor(Math.random() * width);
            y = initialY + Math.floor(Math.random() * height);
            completeBubbleLocations[j] = [x, y];
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2, false);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2, false);
            ctx.fill();
        }

        completeCounter = 1;
        setInterval(redrawRocket, 175);
    }
}

function redrawRocket() {
    var canvas = document.getElementById('GSLabRocket');
    if (canvas != null && canvas.getContext) {
        var ctx = canvas.getContext('2d');
        // Rocket
        var initialX = 15, initialY = 7;
        var height = 65, width = 30;
        setupStyle(ctx, initialX, initialY, width, height, 0.75);

        ctx.beginPath();
        outlineRocket(ctx, height, width, initialX, initialY);
        ctx.fill();

        var offset = 0;
        // draw circles
        ctx.strokeStyle = darkBubbleColor;
        ctx.fillStyle = lightBubbleColor;
        ctx.lineWidth = 2;

        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        for (var j = 0; j < Math.min(completeCount, maxBubbles) ; j++) {
            offset = Math.floor(Math.random() * 3);
            x = completeBubbleLocations[j][0] + completeCounter;
            y = completeBubbleLocations[j][1] - offset;
            if (y < initialY) {
                y = height + initialY;
            }
            completeBubbleLocations[j] = [x, y];
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2, false);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2, false);
            ctx.fill();
        }
        completeCounter = 0 - completeCounter;
    }
}

function handlerNone(results) {
    results = JSON.parse(results);

    // None
    jQuery('#funnelLabel').html('No Status:<br>' + results.total);
    drawFunnel(results.total);

    if (results.total > 0) {
        var count = results.total;
        var htmlToAdd = '<div class="detailTitle">None:</div>';
        if (results.total > 10) {
            count = 10;
            htmlToAdd = '<div class="detailTitle">None top ten:</div>';
        }
        for (var i = 0; i < count; i++) {
            htmlToAdd = htmlToAdd + '<a href="' + results.data[i].at_sfn + '">' + results.data[i].subject + '</a><br>';
        }
        htmlToAdd = htmlToAdd + '<br>';
        jQuery('#noneDetails').html(htmlToAdd);
    }
}

function handlerPending(results) {
    results = JSON.parse(results);

    // Pending
    jQuery('#testTubeLabel').html('Pending:<br>' + results.total);
    drawTestTube(results.total);

    if (results.total > 0) {
        var count = results.total;
        var htmlToAdd = '<div class="detailTitle">Pending:</div>';
        if (results.total > 10) {
            count = 10;
            htmlToAdd = '<div class="detailTitle">Pending top ten:</div>';
        }
        for (var i = 0; i < count; i++) {
            htmlToAdd = htmlToAdd + '<a href="' + results.data[i].at_sfn + '">' + results.data[i].subject + '</a><br>';
        }
        htmlToAdd = htmlToAdd + '<br>';
        jQuery('#pendingDetails').html(htmlToAdd);
    }
}

function handlerActive(results) {
    results = JSON.parse(results);

    // Active
    jQuery('#beakerLabel').html('Active:<br>' + results.total);
    drawBeaker(results.total);
    if (results.total > 0) {
        var count = results.total;
        var htmlToAdd = '<div class="detailTitle">Active:</div>';
        if (results.total > 10) {
            count = 10;
            htmlToAdd = '<div class="detailTitle">Active top ten:</div>';
        }
        for (var i = 0; i < count; i++) {
            htmlToAdd = htmlToAdd + '<a href="' + results.data[i].at_sfn + '">' + results.data[i].subject + '</a><br>';
        }
        htmlToAdd = htmlToAdd + '<br>';
        jQuery('#activeDetails').html(htmlToAdd);
    }
}

function handlerComplete(results) {
    results = JSON.parse(results);

    // Complete
    jQuery('#rocketLabel').html('Complete:<br>' + results.total);
    drawRocket(results.total);
    if (results.total > 0) {
        var count = results.total;
        var htmlToAdd = '<div class="detailTitle">Complete:</div>';
        if (results.total > 10) {
            count = 10;
            htmlToAdd = '<div class="detailTitle">Complete top ten:</div>';
        }
        for (var i = 0; i < count; i++) {
            htmlToAdd = htmlToAdd + '<a href="' + results.data[i].at_sfn + '">' + results.data[i].subject + '</a><br>';
        }
        htmlToAdd = htmlToAdd + '<br>';
        jQuery('#completeDetails').html(htmlToAdd);
    }
}

function prepareData() {
    var today = new Date();
    var lastWeek = new Date(today.getTime() - 1000 * 60 * 60 * 24 * 7);
    var timeStamp = lastWeek.getTime() / 1000;

    jQuery("#titleText").html("What's Cooking in the " + companyName + " Laboratory?");

    var options = {
        type: "GET",
        url: "http://api.getsatisfaction.com/companies/" + companyName + "/topics.json?status=none&sort=most_me_toos&active_since=" + timeStamp
    };

    WinJS.xhr(options).done(
  function completed(request) {
      // handle completed download.
      handlerNone(request.response);
  },
  function error(request) {
      // handle error conditions.
      alert("error");
  }
);

    options = {
        type: "GET",
        url: "http://api.getsatisfaction.com/companies/" + companyName + "/topics.json?status=pending&sort=most_me_toos&active_since=" + timeStamp
    };

    WinJS.xhr(options).done(
  function completed(request) {
      // handle completed download.
      handlerPending(request.response);
  },
  function error(request) {
      // handle error conditions.
      alert("error");
  }
);

    options = {
        type: "GET",
        url: "http://api.getsatisfaction.com/companies/" + companyName + "/topics.json?status=active&sort=most_me_toos&active_since=" + timeStamp
    };

    WinJS.xhr(options).done(
  function completed(request) {
      // handle completed download.
      handlerActive(request.response);
  },
  function error(request) {
      // handle error conditions.
      alert("error");
  }
);

    options = {
        type: "GET",
        url: "http://api.getsatisfaction.com/companies/" + companyName + "/topics.json?status=complete,rejected&sort=most_me_toos&active_since=" + timeStamp
    };

    WinJS.xhr(options).done(
  function completed(request) {
      // handle completed download.
      handlerComplete(request.response);
  },
  function error(request) {
      // handle error conditions.
      alert("error");
  }
);
};

jQuery(document).ready(function () {
    var communityButton = document.getElementById("startTheLab");
    startTheLab.addEventListener("click", buttonClickHandler, false);

});

function buttonClickHandler(eventInfo) {
    companyName = document.getElementById("communityInput").value;
    prepareData();
    jQuery("#canvasHome").show();
}