

⠀⠀⠀⠀⠀⢀⡴⠋⠉⠛⠒⣄⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢸⠏⠀⠀⣶⡄⠀⠀⣛⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣿⠃⠀⠀⠀⠀⡤⠋⠠⠉⠡⢤⢀⠀
⠀⠀⠀⠀⢿⠀⠀⠀⠀⠀⢉⣝⠲⠤⣄⣀⣀⠌
⠀⠀⠀⠀⡏⠀⠀⠀⠀⠀⢸⠁⠀⠀⠀⠀⠀⠀
⠀⠀⠀⡴⠃⠀⠀⠀⠀⠀⠸⡄⠀⠀⠀⠀⠀⠀
⢀⠖⠋⠀⠀⠀⠀⠀⠀⠀⠀⠘⣆⠀⠀⠀⠀⠀
⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢳⠀

Auto Clock Me 🕒
A Node.js script that automates clocking in and out on a website using Safari on macOS. It uses node-cron for scheduling and node-notifier for desktop notifications to prevent missed punches.

Features
Automated Scheduling: Set daily clock-in and clock-out times.

Desktop Notifications: Get native macOS notifications on task completion.

Secure Credentials: Uses a .env file to protect your site URL and password.

Timezone Aware: Configure the schedule to run in a specific timezone.

Logging: Tracks all executed tasks in automation.log.

Prerequisites
Node.js (includes npm)

macOS (required for AppleScript automation)

⚙️ Setup & Installation
Clone the Repository

git clone [https://github.com/AkinSu/safari_auto-clock-me.git](https://github.com/AkinSu/safari_auto-clock-me.git)
cd safari_auto-clock-me

Create .env File
cp .env.example .env  

Install Dependencies
In the project directory, run:

npm install

▶️ Usage
To start the script, run the following command from the project root:

npm start

The script will run in the background and execute tasks at the scheduled times.

🗓️ Customizing the Schedule
To change the schedule, edit the time and timezone constants in safari_automation.js and restart the script.

// Set times here in 12-hour format (h:mm:ss AM/PM)
const CLOCK_IN_TIME_12H = '7:15:00 AM'; 
const CLOCK_OUT_TIME_12H = '4:30:00 PM';

// Find your timezone here: [https://en.wikipedia.org/wiki/List_of_tz_database_time_zones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
const TIMEZONE = 'America/Chicago'; 

⚠️ Important: macOS Permissions
The script requires macOS Automation permissions to function.

Go to System Settings > Privacy & Security > Automation.

Find your terminal app (Terminal, iTerm, etc.).

Enable the checkboxes for Safari and System Events.

The script will fail without these permissions.

🛠️ Built With
Node.js

node-cron

node-notifier

dotenv

License
This project is licensed under the MIT License.


⠀⠀⠀ 