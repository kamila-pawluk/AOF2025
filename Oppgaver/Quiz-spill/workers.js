// //workers.js 
let timeLeft = 20; 

function countdown() {
    if (timeLeft >= 0) {
        postMessage(timeLeft);
        timeLeft--;
        setTimeout(countdown, 1000);
    } else {
        postMessage("timeout");
    }
}

countdown();

let timerWorker;
let timerStarted = false;

function startWorker() {
    if (timerStarted) return;

    timerWorker = new Worker("workers.js");
    console.log("Worker started");
    timerStarted = true;

    timerWorker.onmessage = function(event) {
        const timerOutput = document.getElementById("timer");

        if (event.data === "timeout") {
            disableRadioButtons();
            if(timerOutput){
                timerOutput.innerText = "Time is up!";
            }
            stopWorker();
        } else {
            if(timerOutput){
                timerOutput.innerText = event.data;
            }
        }
    };
}

function stopWorker() {
    if (timerWorker) {
        timerWorker.terminate();
        timerWorker = undefined;
        timerStarted = false;
    }
}

function resetWorker() {
    stopWorker();
}

function disableRadioButtons() {
    const radioButtons = document.querySelectorAll('input[name="answer"]');
    radioButtons.forEach(button => {
        button.disabled = true;
    });
}



