let startTime, updatedTime, difference, tInterval;
let savedTime = 0;
let running = false;
let timestampCount = 0;

const timeDisplay = document.getElementById('time');
const clockDisplay = document.getElementById('clock');
const logList = document.getElementById('logList');
const startStopBtn = document.getElementById('startStopBtn');

startStopBtn.addEventListener('click', toggleStartStop);
document.getElementById('timestampBtn').addEventListener('click', logTimestamp);
document.getElementById('clearLogBtn').addEventListener('click', clearLog);
document.getElementById('saveLogBtn').addEventListener('click', saveLog);

function toggleStartStop() {
    if (!running) {
        start();
        startStopBtn.textContent = 'Stop';
        document.getElementById('saveLogBtn').disabled = true; // ปิดปุ่ม Save Log เมื่อกด Start
    } else {
        stop();
        startStopBtn.textContent = 'Start';
        document.getElementById('saveLogBtn').disabled = false; // เปิดปุ่ม Save Log เมื่อกด Stop
        document.getElementById('clearLogBtn').style.display = 'inline-block'; // แสดงปุ่ม Clear Log เมื่อกด Stop
    }
}

function start() {
    if (!running) {
        startTime = new Date().getTime() - savedTime;
        tInterval = setInterval(updateTime, 1);
        running = true;
        logAction('Started');
        disableSaveLogBtn(true); // ปิดปุ่ม Save Log เมื่อเริ่มการทำงาน
    }
}

function logTimestamp() {
    if (running) {
        logAction('Timestamp', true);
    }
}

function stop() {
    if (running) {
        logAction('Stopped');
        clearInterval(tInterval);
        savedTime = 0;
        running = false;
        timeDisplay.innerHTML = "00:00:00";
        disableSaveLogBtn(false); // เปิดปุ่ม Save Log เมื่อหยุดการทำงาน
        document.getElementById('clearLogBtn').style.display = 'inline-block'; // แสดงปุ่ม Clear Log เมื่อหยุดการทำงาน
    }
}

function updateTime() {
    updatedTime = new Date().getTime();
    difference = updatedTime - startTime;

    let hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((difference % (1000 * 60)) / 1000);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    timeDisplay.innerHTML = hours + ':' + minutes + ':' + seconds;
}

function logAction(action, withInput = false) {
    const stopwatchTime = timeDisplay.innerHTML;
    const currentTime = new Date();
    const clockTime = currentTime.toTimeString().split(' ')[0];
    timestampCount++;
    const listItem = document.createElement('li');
    listItem.className = 'log-item';
    listItem.innerHTML = `
        <span>${timestampCount}. ${action} at ${stopwatchTime} (Clock: ${clockTime})</span>
        ${withInput ? '<input type="text" placeholder="Enter details...">' : ''}
    `;
    logList.appendChild(listItem);
}

function clearLog() {
    logList.innerHTML = '';
    timestampCount = 0;
}

function saveLog() {
    const logItems = logList.getElementsByTagName('li');
    let logText = '';
    for (let item of logItems) {
        const spanText = item.querySelector('span').textContent;
        const input = item.querySelector('input');
        const inputText = input ? input.value : '';
        logText += `${spanText} - ${inputText}\n`;
    }
    const blob = new Blob([logText], { type: 'text/plain' });
    const anchor = document.createElement('a');
    anchor.download = 'log.txt';
    anchor.href = window.URL.createObjectURL(blob);
    anchor.target = '_blank';
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}

