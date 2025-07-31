// This is the script that i'm using to automate the clock in and out on time.
// so i stop having to click the clock in and out buttons manually.
// it's not perfect, but it works, no more oversleeping and overtime. :^)
// i'm not sure if it's the best way to do it, but it works.

require('dotenv').config();
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const cron = require('node-cron');

const SITE_URL = process.env.SITE_URL;
const PASSWORD = process.env.PASSWORD;
const NAME = process.env.NAME || 'User';

// === SCHEDULE TIMES ===
// Set times here in 12-hour format (h:mm:ss AM/PM)
const CLOCK_IN_TIME_12H = '8:29:44 AM';
const CLOCK_OUT_TIME_12H = '4:29:44 PM';

function parse12HourTo24Hour(timeStr) {
  // timeStr: 'h:mm:ss AM/PM'
  const [time, ampm] = timeStr.trim().split(/\s+/);
  let [hour, minute, second] = time.split(':').map(Number);
  if (ampm.toUpperCase() === 'PM' && hour !== 12) hour += 12;
  if (ampm.toUpperCase() === 'AM' && hour === 12) hour = 0;
  return [hour, minute, second];
}

function time12hToCron(timeStr) {
  const [hour, minute, second] = parse12HourTo24Hour(timeStr);
  return `${second} ${minute} ${hour} * * *`;
}

const CLOCK_IN_CRON = time12hToCron(CLOCK_IN_TIME_12H);
const CLOCK_OUT_CRON = time12hToCron(CLOCK_OUT_TIME_12H);

// For display, just use the 12-hour format variables
const CLOCK_IN_TIME_DISPLAY = CLOCK_IN_TIME_12H;
const CLOCK_OUT_TIME_DISPLAY = CLOCK_OUT_TIME_12H;

function logMessage(message) {
  const logLine = `${new Date().toISOString()} - ${message}\n`;
  fs.appendFileSync('automation.log', logLine);
}

// Prevent sleep functionality
let caffeinateProcess = null;

function preventSleep() {
  try {
    // Start caffeinate to prevent sleep
    caffeinateProcess = spawn('caffeinate', ['-i']);
    console.log('🛡️  Sleep prevention enabled - Mac will stay awake');
    logMessage('Sleep prevention enabled');
  } catch (e) {
    console.error('Failed to prevent sleep:', e);
  }
}

function allowSleep() {
  try {
    if (caffeinateProcess) {
      caffeinateProcess.kill();
      caffeinateProcess = null;
      console.log('😴 Sleep prevention disabled - Mac can sleep normally');
      logMessage('Sleep prevention disabled');
    }
  } catch (e) {
    console.error('Failed to allow sleep:', e);
  }
}

// Input lock functionality
function lockInput() {
  try {
    execSync(`osascript -e 'tell application "System Events" to set UI elements enabled to false'`);
    console.log('🔒 Input locked - mouse and keyboard disabled');
    logMessage('Input locked during automation');
  } catch (e) {
    console.error('Failed to lock input:', e);
  }
}

function unlockInput() {
  try {
    execSync(`osascript -e 'tell application "System Events" to set UI elements enabled to true'`);
    console.log('🔓 Input unlocked - mouse and keyboard re-enabled');
    logMessage('Input unlocked after automation');
  } catch (e) {
    console.error('Failed to unlock input:', e);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down automation...');
  unlockInput();
  allowSleep();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down automation...');
  unlockInput();
  allowSleep();
  process.exit(0);
});

if (!SITE_URL || !PASSWORD) {
  console.error('Please set SITE_URL and PASSWORD in your .env file.');
  process.exit(1);
}

function runAutomation() {
  const appleScript = `
  tell application "Safari"
      activate
      make new document
      delay 0.5
      set URL of front document to "${SITE_URL}"
  end tell

  delay 5 -- wait for page to load and password field to be focused

  tell application "System Events"
      tell process "Safari"
          set frontmost to true
          delay 0.5
          keystroke "${PASSWORD}"
          keystroke return
          delay 5
          keystroke tab
          keystroke tab
          keystroke tab
          keystroke tab
          keystroke tab
          delay 0.5
          keystroke return -- press Enter after tabbing 5 times
      end tell
  end tell

  -- delay 1
  -- tell application "Safari"
  --     close front window
  -- end tell
  `;

  fs.writeFileSync('auto_script.scpt', appleScript);

  try {
    execSync('osascript auto_script.scpt', { stdio: 'inherit' });
    console.log('✅ Automation completed successfully');
  } catch (e) {
    console.error('❌ AppleScript execution failed:', e);
  } finally {
    console.log('🔓 Unlocking input...');
    unlockInput();
  }
}

function getNextEventTime(targetTime12h) {
  const now = new Date();
  const [time, ampm] = targetTime12h.trim().split(/\s+/);
  let [hour, minute, second] = time.split(':').map(Number);
  if (ampm.toUpperCase() === 'PM' && hour !== 12) hour += 12;
  if (ampm.toUpperCase() === 'AM' && hour === 12) hour = 0;
  const next = new Date(now);
  next.setHours(hour, minute, second, 0);
  if (next <= now) {
    // If the time has already passed today, set for tomorrow
    next.setDate(next.getDate() + 1);
  }
  return next;
}

function formatCountdown(ms) {
  if (ms < 0) ms = 0;
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function showCountdown() {
  setInterval(() => {
    const now = new Date();
    const nextClockIn = getNextEventTime(CLOCK_IN_TIME_12H);
    const nextClockOut = getNextEventTime(CLOCK_OUT_TIME_12H);
    const msToClockIn = nextClockIn - now;
    const msToClockOut = nextClockOut - now;
    process.stdout.write(
      `\rNext clock-in:  ${formatCountdown(msToClockIn)}  |  Next clock-out:  ${formatCountdown(msToClockOut)}      `
    );
  }, 1000);
}

// Start sleep prevention when automation starts
preventSleep();

showCountdown();

// Schedule for clock in and clock out times
cron.schedule(CLOCK_IN_CRON, () => {
  const msg = `Hey ${NAME}, you're clocked in!`;
  console.log(msg);
  logMessage(msg);
  
  // Lock input 5 seconds before automation
  console.log('⏰ Clock-in automation starting in 5 seconds...');
  setTimeout(() => {
    console.log('🔒 Locking input for clock-in automation...');
    lockInput();
    runAutomation();
  }, 5000);
}); // CLOCK IN: " + CLOCK_IN_TIME_DISPLAY

cron.schedule(CLOCK_OUT_CRON, () => {
  const msg = `Hey ${NAME}, you're clocked out!`;
  console.log(msg);
  logMessage(msg);
  
  // Lock input 5 seconds before automation
  console.log('⏰ Clock-out automation starting in 5 seconds...');
  setTimeout(() => {
    console.log('🔒 Locking input for clock-out automation...');
    lockInput();
    runAutomation();
  }, 5000);
}); // CLOCK OUT: " + CLOCK_OUT_TIME_DISPLAY

console.log(`Automation scheduled for ${CLOCK_IN_TIME_DISPLAY} and ${CLOCK_OUT_TIME_DISPLAY} every day.`);
console.log('💤 Sleep prevention is active - your Mac will stay awake'); 