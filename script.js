//get recent activity
const data = await fetch(window.location.origin + '/json/activities.json').then(r => r.json());
const rec_act = data[0];

//get stats from recent activity
const rec_act_type = rec_act.activity;
const rec_act_date = new Date(rec_act.dateunix * 1000);
const rec_act_duration = rec_act.durationsec;
const rec_act_metres = rec_act.distancemeters;

//calculates kilometers from meters
const rec_act_km = Math.round(rec_act_metres / 10) / 100;

//gets elements to replace
const titleele = document.querySelector('#rectitle');
const timeele = document.querySelector('#rectime');
const durationele = document.querySelector('#recduration');
const distele = document.querySelector('#recdistance');

//got chatgpt to HELP me with (not do) this, it just makes it so the length is displayed in the right format
const day = rec_act_date.getDate().toString().padStart(2, '0');
const month = rec_act_date.toLocaleString('en-AU', { month: 'short' });
const hours = rec_act_date.getHours().toString().padStart(2, '0');
const minutes = rec_act_date.getMinutes().toString().padStart(2, '0');

const formattedDate = `${day} ${month}, ${hours}:${minutes}`;

// Duration
const durationHours = Math.floor(rec_act_duration / 3600);
const durationMinutes = Math.floor((rec_act_duration % 3600) / 60);

// seconds variable        // convert to string and pad with extra 0 if needed
const seconds = (rec_act_duration % 60).toString().padStart(2, '0');

let duration;

//chatgpt helped with this as well. it just checks if there is hours, if there is it shows hours, if not it doesnt
if (durationHours > 0) {
    duration = `${durationHours}:${durationMinutes.toString().padStart(2, '0')}:${seconds}`;
} else {
    duration = `${durationMinutes}:${seconds}`;
}

// replace placeholders
titleele.textContent = rec_act_type;
timeele.textContent = formattedDate;
durationele.textContent = duration;
distele.textContent = `${rec_act_km}km`;