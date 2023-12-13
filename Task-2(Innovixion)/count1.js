const targetDate = "2024-01-01T00:00:00";
function getTimeSegmentElements(segmentElement){4
    const segmentDisplay = segmentElement.querySelector('.segment-display');
    const segmentDisplayTop = segmentDisplay.querySelector('.segment-display_top');
    const segmentDisplayBottom = segmentDisplay.querySelector('.segment-display_bottom');
    const segmentOverlay = segmentDisplay.querySelector('.segment-overlay');
    const segementOverlayTop = segmentDisplay.querySelector('.segment-overlay_top');
    const segementOverlayBottom = segmentDisplay.querySelector('.segment-overlay_bottom');
    return{
        segmentDisplayTop,
        segmentDisplayBottom,
        segmentOverlay,
        segementOverlayTop,
        segementOverlayBottom,
    }
}

function updateSemgmentValues(displayElement, overlayElement, value){
    displayElement.textContent = value;
    overlayElement.textContent = value;
}

function updateTimeSegment(segmentElement, timeValue){
    const segmentElements = getTimeSegmentElements(segmentElement);

    if(parseInt (segmentElements.segmentDisplayTop.textContent, 10) === timeValue){
        return;
    }

    segmentElements.segmentOverlay.classList.add('flip');
    updateSemgmentValues(
        segmentElements.segmentDisplayTop,
        segmentElements.segementOverlayBottom,
        timeValue
    );
    function finishAnimation() {
        segmentElements.segmentOverlay.classList.remove('flip');
        updateSemgmentValues(
            segmentElements.segmentDisplayBottom,
            segmentElements.segementOverlayTop,
            timeValue
        );
        this.removeEventListener('animationend', finishAnimation);
    }
    segmentElements.segmentOverlay.addEventListener('animationend', finishAnimation);
}

function updateTimeSection(sectionID, timeValue){
    const firstNumber = Math.floor(timeValue / 10);
    const secondNumber = timeValue % 10;

    const sectionElement = document.getElementById(sectionID);
    const timesegments = sectionElement.querySelectorAll('.time-segment');
    updateTimeSegment(timesegments[0], firstNumber);
    updateTimeSegment(timesegments[1], secondNumber);
}

function getTimeRemaining(targetDateTime){
    const nowTime = Date.now();
    const secondsRemaining = Math.floor((targetDateTime - nowTime) / 1000);

    const complete = nowTime >= targetDateTime;

    if(complete){
        return{
            complete,
            seconds: 0,
            minutes: 0,
            hours: 0,
            days: 0,
        }
    }

    const days = Math.floor(secondsRemaining / (60 * 60 * 24));
    const hours = Math.floor((secondsRemaining % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((secondsRemaining % (60 * 60)) / 60);
    const seconds = secondsRemaining % 60;

    return {
        seconds,
        minutes,
        hours,
        days
    };
}
function updateAllSegments() {
    const targetTimeStamp = new Date(targetDate).getTime();
    const timeRemainingBits = getTimeRemaining(targetTimeStamp);

    updateTimeSection('seconds', timeRemainingBits.seconds);
    updateTimeSection('minutes', timeRemainingBits.minutes);
    updateTimeSection('hours', timeRemainingBits.hours);
    updateTimeSection('days', timeRemainingBits.days);
    
    return timeRemainingBits.complete;
}

const countdownTimer = setInterval(() => {
    const isComplete = updateAllSegments();

    if(isComplete){
        clearInterval(countdownTimer);
    }
}, 1000);
updateAllSegments();