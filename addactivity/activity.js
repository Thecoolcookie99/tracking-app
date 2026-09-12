//get the activity form elements
const form = document.querySelector('#activity-form');
const message = document.querySelector('#activity-message');
const dateInput = document.querySelector('#activitydate');
const statLogForm = document.querySelector('#stat-log-form');
const logMessage = document.querySelector('#log-message');

//turn a unix timestamp into a local calendar day key
function getActivityDay(dateunix) {
    const date = new Date(Number(dateunix) * 1000);
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

//calculate the number of consecutive days with an activity
function updateStreak(activities) {
    //use a set so multiple activities on one day count once
    const activityDays = new Set(activities.map((activity) => getActivityDay(activity.dateunix)));
    //check today and yesterday because a user may not have logged today's activity yet
    const today = new Date();
    const todayKey = getActivityDay(today.getTime() / 1000);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayKey = getActivityDay(yesterday.getTime() / 1000);

    if (!activityDays.has(todayKey) && !activityDays.has(yesterdayKey)) {
        //a gap after yesterday breaks the activity streak
        localStorage.setItem('streak', '0');
        return;
    }

    //start counting from today, or yesterday when today has no activity
    const currentDay = activityDays.has(todayKey) ? today : yesterday;
    let streak = 0;
    //walk backwards until the first missing calendar day
    while (activityDays.has(getActivityDay(currentDay.getTime() / 1000))) {
        streak += 1;
        currentDay.setDate(currentDay.getDate() - 1);
    }

    localStorage.setItem('streak', String(streak));
}

//set the activity date input to the current local time
const now = new Date();
now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
dateInput.value = now.toISOString().slice(0, 16);

//save a workout when the activity form is submitted
form.addEventListener('submit', (event) => {
    //keep the page from reloading
    event.preventDefault();

    //read all activity values from the form
    const formData = new FormData(form);
    const durationMinutes = Number(formData.get('durationminutes'));
    const distanceKilometers = Number(formData.get('distancemeters'));
    const activityDate = new Date(formData.get('activitydate'));
    if (!Number.isFinite(durationMinutes) || durationMinutes <= 0 || durationMinutes > 1440 ||
        !Number.isFinite(distanceKilometers) || distanceKilometers < 0 || distanceKilometers > 1000 ||
        Number.isNaN(activityDate.getTime()) || activityDate > new Date()) {
        message.textContent = 'Enter realistic activity details.';
        return;
    }
    const activity = {
        activity: formData.get('activity'),
        activityname: formData.get('activityname').trim(),
        activitydescription: formData.get('activitydescription').trim(),
        dateunix: Math.floor(activityDate.getTime() / 1000).toString(),
        durationsec: (durationMinutes * 60).toString(),
        distancemeters: Math.round(distanceKilometers * 1000).toString(),
        otherinfo: formData.get('otherinfo').trim()
    };
    //load previously saved activities from this browser
    const savedActivities = JSON.parse(localStorage.getItem('activities') || '[]');

    //put the newest activity at the beginning of the list
    savedActivities.unshift(activity);
    localStorage.setItem('activities', JSON.stringify(savedActivities));
    //recalculate the streak now that a new day may have been added
    updateStreak(savedActivities);
    //clear the form and show confirmation
    form.reset();
    dateInput.value = now.toISOString().slice(0, 16);
    message.textContent = 'Activity saved.';
});

//save a calorie or water entry from the logging form
statLogForm.addEventListener('submit', (event) => {
    //keep the page from reloading
    event.preventDefault();
    //load the existing stat log entries
    const logs = JSON.parse(localStorage.getItem('statLogs') || '[]');
    const stat = document.querySelector('#log-stat').value;
    const value = Number(document.querySelector('#log-value').value);
    const maximums = { sleep: 24, steps: 100000, water: 20000, calories: 10000 };
    const maximum = maximums[stat];
    if (!Number.isFinite(value) || value <= 0 || value > maximum) {
        logMessage.textContent = 'Enter a realistic stat value.';
        return;
    }
    //add the selected value with the current date
    logs.push({
        stat,
        value,
        date: new Date().toISOString()
    });
    //save the updated log for the home page
    localStorage.setItem('statLogs', JSON.stringify(logs));
    //reset the inputs and show confirmation
    statLogForm.reset();
    logMessage.textContent = 'Stat logged.';
});