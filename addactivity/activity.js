const form = document.querySelector('#activity-form');
const message = document.querySelector('#activity-message');
const dateInput = document.querySelector('#activitydate');

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
    form.reset();
    dateInput.value = now.toISOString().slice(0, 16);
    message.textContent = 'Activity saved.';
});