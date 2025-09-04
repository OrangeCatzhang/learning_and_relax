/******/ (() => { // webpackBootstrap
/*!********************************!*\
  !*** ./src/content/content.ts ***!
  \********************************/
console.log("Content script loaded.");
const OVERLAY_ID = 'work-reminder-overlay';
// Function to show the overlay
function showOverlay() {
    // Remove existing overlay if any
    const existingOverlay = document.getElementById(OVERLAY_ID);
    if (existingOverlay) {
        existingOverlay.remove();
    }
    const overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
    overlay.style.color = 'white';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.flexDirection = 'column';
    overlay.style.zIndex = '99999999'; // Ensure it's on top
    overlay.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    const message = document.createElement('h1');
    message.style.fontSize = '5rem';
    message.style.fontWeight = 'bold';
    message.innerText = '该休息啦！';
    const countdown = document.createElement('p');
    countdown.style.fontSize = '3rem';
    let timeLeft = 15;
    countdown.innerText = `${timeLeft}s`;
    const intervalId = setInterval(() => {
        timeLeft--;
        countdown.innerText = `${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(intervalId);
            // The overlay will be removed by a message from the background script
        }
    }, 1000);
    overlay.appendChild(message);
    overlay.appendChild(countdown);
    document.body.appendChild(overlay);
}
// Function to hide the overlay
function hideOverlay() {
    const overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
    }
}
// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === 'show_overlay') {
        showOverlay();
        sendResponse({ success: true });
    }
    else if (message.command === 'hide_overlay') {
        hideOverlay();
        sendResponse({ success: true });
    }
});

/******/ })()
;
//# sourceMappingURL=content.js.map