
const data = await fetch('../activities.json').then(r => r.json());
const rec_act = data[0]

const rec_act_type = rec_act["activity"]
const rec_act_date = Date(rec_act["dateunix"] * 1000)
const rec_act_duration = rec_act["durationsec"]
const rec_act_metres = rec_act["distancemeters"]

const titleele = document.querySelector('#rectitle')
const timeele = document.querySelector('#rectime')
const durationele = document.querySelector('#recduration')
const distele = document.querySelector('#recdistance')

const hours = Math.floor(rec_act_duration / 360);
const minutes = Math.floor(rec_act_duration / 60);
const seconds = (rec_act_duration % 60).toString().padStart(2, '0');

titleele.innerHTML = rec_act_type;
timeele.innerHTML = rec_act_date;
durationele.innerHTML =  `${minutes}:${seconds}`;
distele.innerHTML = rec_act_metres;