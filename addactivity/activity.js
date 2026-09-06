const form = document.querySelector('#activity-form');
const message = document.querySelector('#activity-message');
const dateInput = document.querySelector('#activitydate');

function getActivityDay(dateunix) {
    const date = new Date(Number(dateunix) * 1000);
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function updateStreak(activities) {
    const activityDays = new Set(activities.map((activity) => getActivityDay(activity.dateunix)));
    const today = new Date();
    const todayKey = getActivityDay(today.getTime() / 1000);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayKey = getActivityDay(yesterday.getTime() / 1000);

    if (!activityDays.has(todayKey) && !activityDays.has(yesterdayKey)) {
        localStorage.setItem('streak', '0');
        return;
    }

    const currentDay = activityDays.has(todayKey) ? today : yesterday;
    let streak = 0;
    while (activityDays.has(getActivityDay(currentDay.getTime() / 1000))) {
        streak += 1;
        currentDay.setDate(currentDay.getDate() - 1);
    }

    localStorage.setItem('streak', String(streak));
}

const now = new Date();
now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
dateInput.value = now.toISOString().slice(0, 16);

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const durationMinutes = Number(formData.get('durationminutes'));
    const durationSeconds = Number(formData.get('durationseconds'));
    const distanceKilometers = Number(formData.get('distancemeters'));
    const activity = {
        activity: formData.get('activity'),
        activityname: formData.get('activityname').trim(),
        activitydescription: formData.get('activitydescription').trim(),
        dateunix: Math.floor(new Date(formData.get('activitydate')).getTime() / 1000).toString(),
        durationsec: (durationMinutes * 60 + durationSeconds).toString(),
        distancemeters: Math.round(distanceKilometers * 1000).toString(),
        otherinfo: formData.get('otherinfo').trim()
    };
    const savedActivities = JSON.parse(localStorage.getItem('activities') || '[]');

    savedActivities.unshift(activity);
    localStorage.setItem('activities', JSON.stringify(savedActivities));
    updateStreak(savedActivities);
    form.reset();
    dateInput.value = now.toISOString().slice(0, 16);
    message.textContent = 'Activity saved.';
});