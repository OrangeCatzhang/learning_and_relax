/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/background/service-worker.ts":
/*!******************************************!*\
  !*** ./src/background/service-worker.ts ***!
  \******************************************/
/***/ (function() {

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
console.log("Service Worker loaded.");
const MAIN_TIMER_ALARM = 'mainTimer';
const WORK_REST_ALARM = 'workRestAlarm';
// --- Utility Functions ---
function getRandomWorkInterval() {
    return Math.floor(Math.random() * (5 - 3 + 1) + 3);
}
function sendMessageToActiveTab(message) {
    return __awaiter(this, void 0, void 0, function* () {
        const [tab] = yield chrome.tabs.query({ active: true, lastFocusedWindow: true });
        if (tab && tab.id) {
            try {
                yield chrome.tabs.sendMessage(tab.id, message);
            }
            catch (e) {
                console.error("Could not send message to content script:", e);
            }
        }
    });
}
// --- Alarm Management ---
chrome.alarms.onAlarm.addListener((alarm) => __awaiter(void 0, void 0, void 0, function* () {
    const storage = yield chrome.storage.local.get();
    if (!storage.isRunning)
        return;
    if (alarm.name === WORK_REST_ALARM) {
        if (storage.isResting) {
            yield chrome.storage.local.set({ isResting: false });
            yield sendMessageToActiveTab({ command: 'hide_overlay' });
            chrome.notifications.create({ type: 'basic', iconUrl: 'icon128.svg', title: '休息结束', message: '继续保持专注！' });
            chrome.alarms.create(WORK_REST_ALARM, { delayInMinutes: getRandomWorkInterval() });
        }
        else {
            yield chrome.storage.local.set({ isResting: true });
            yield sendMessageToActiveTab({ command: 'show_overlay' });
            chrome.notifications.create({ type: 'basic', iconUrl: 'icon128.svg', title: '该休息啦！', message: '放松15秒，看看远处。' });
            chrome.alarms.create(WORK_REST_ALARM, { delayInMinutes: 15 / 60 });
        }
    }
    else if (alarm.name === MAIN_TIMER_ALARM) {
        // This alarm now primarily checks if the total time has expired.
        const elapsedSeconds = Math.floor((Date.now() - storage.startTime) / 1000);
        if (elapsedSeconds >= storage.totalDuration * 60) {
            stopTimer();
            chrome.notifications.create({ type: 'basic', iconUrl: 'icon128.svg', title: '工作结束', message: '恭喜你，完成了本次专注工作！' });
        }
    }
}));
// --- Timer Control Functions ---
function stopTimer() {
    chrome.alarms.clearAll();
    chrome.storage.local.set({ isRunning: false }); // No need to reset other values
    sendMessageToActiveTab({ command: 'hide_overlay' });
    chrome.action.setBadgeText({ text: '' });
    console.log("Timer stopped and all alarms cleared.");
}
// --- Message Listener ---
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === 'start') {
        const totalMinutes = message.totalMinutes || 60;
        chrome.storage.local.set({
            isRunning: true,
            isResting: false,
            totalDuration: totalMinutes,
            startTime: Date.now(), // Store the precise start time
        }, () => {
            chrome.alarms.create(MAIN_TIMER_ALARM, { periodInMinutes: 1 });
            chrome.alarms.create(WORK_REST_ALARM, { delayInMinutes: getRandomWorkInterval() });
            chrome.action.setBadgeText({ text: 'ON' });
            chrome.action.setBadgeBackgroundColor({ color: '#4688F1' });
            sendResponse({ success: true });
        });
        return true;
    }
    else if (message.command === 'stop') {
        stopTimer();
        sendResponse({ success: true });
    }
    else if (message.command === 'get_status') {
        chrome.storage.local.get().then(storage => {
            if (storage.isRunning) {
                const elapsedSeconds = Math.floor((Date.now() - storage.startTime) / 1000);
                const timeLeft = (storage.totalDuration * 60) - elapsedSeconds;
                sendResponse(Object.assign(Object.assign({}, storage), { timeLeft }));
            }
            else {
                sendResponse(storage);
            }
        });
        return true;
    }
});
// Initialize state on installation
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        isRunning: false,
        isResting: false,
        totalDuration: 60,
        startTime: 0,
    });
    chrome.action.setBadgeText({ text: '' });
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/background/service-worker.ts"]();
/******/ 	
/******/ })()
;
//# sourceMappingURL=service-worker.js.map