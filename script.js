const moduleGrid = document.querySelector('#activity-modules');
const savedActivities = JSON.parse(localStorage.getItem('activities') || '[]');

const [activities, savedBoxes] = await Promise.all([
    fetch(window.location.origin + '/json/activities.json').then((response) => response.json()),
    fetch(window.location.origin + '/json/usersavedboxes.json').then((response) => response.json())
]);

const allActivities = [...savedActivities, ...activities];
const boxConfiguration = Object.values(savedBoxes[0] || {});

const moduleAliases = {
    recent: 'recent',
    sleep_: 'sleep',
    steps_: 'steps',
    addact: 'addact',
    streak: 'streak',
    social: 'social',
    water_: 'water',
    calori: 'calories'
};

function createModule(key, size) {
    const tile = document.createElement('section');
    tile.className = `dynamic-tile ${size === 'lrg' || size === 'rlg' ? 'large' : 'small'}`;
    tile.dataset.module = key;
    return tile;
}

function addTitle(tile, title) {
    const heading = document.createElement('p');
    heading.className = 'title';
    heading.textContent = title;
    tile.appendChild(heading);
    tile.appendChild(document.createElement('hr'));
}

function addText(tile, text) {
    const value = document.createElement('p');
    value.className = 'title';
    value.textContent = text;
    tile.appendChild(value);
}

function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = String(seconds % 60).padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
}

function renderRecent(tile) {
    const recent = allActivities[0];
    addTitle(tile, recent ? recent.activityname : 'Recent activity');
    if (!recent) {
        addText(tile, 'No activities recorded');
        return;
    }

    const date = new Date(Number(recent.dateunix) * 1000);
    addText(tile, recent.activity);
    addText(tile, date.toLocaleDateString('en-AU'));
    addText(tile, `Duration: ${formatDuration(Number(recent.durationsec))}`);
    addText(tile, `Distance: ${Math.round(Number(recent.distancemeters) / 10) / 100}km`);
}

async function renderWeekly(tile, key, title, unit) {
    const response = await fetch(window.location.origin + `/json/${key}.json`);
    const values = Object.values((await response.json())[0] || {}).map(Number);
    const total = values.reduce((sum, value) => sum + value, 0);
    addTitle(tile, title);
    addText(tile, `${Math.round(total * 100) / 100} ${unit} this week`);
    addText(tile, `Average: ${Math.round((total / Math.max(values.length, 1)) * 100) / 100} ${unit}`);
}

function renderSingle(tile, key, title, field, suffix) {
    fetch(window.location.origin + `/json/${key}.json`)
        .then((response) => response.json())
        .then((data) => {
            addTitle(tile, title);
            addText(tile, `${data[0]?.[field] || 0}${suffix}`);
        });
}

function renderAddActivity(tile) {
    addTitle(tile, 'Add activity');
    const link = document.createElement('a');
    link.className = 'module-link';
    link.href = '../addactivity/';
    link.textContent = 'Create a workout';
    tile.appendChild(link);
}

function renderSocial(tile) {
    fetch(window.location.origin + '/json/friends.json')
        .then((response) => response.json())
        .then((friends) => {
            addTitle(tile, 'Social');
            addText(tile, `${Object.keys(friends[0] || {}).length} friends`);
            const link = document.createElement('a');
            link.className = 'module-link';
            link.href = '../social/';
            link.textContent = 'View friends';
            tile.appendChild(link);
        });
}

for (const configuredBox of boxConfiguration) {
    const [configuredKey, configuredSize = 'sml'] = configuredBox.split('/');
    const key = moduleAliases[configuredKey];
    if (!key) continue;

    const tile = createModule(key, configuredSize);
    moduleGrid.appendChild(tile);

    if (key === 'recent') renderRecent(tile);
    if (key === 'sleep') renderWeekly(tile, 'sleep', 'Sleep', 'hours');
    if (key === 'steps') renderWeekly(tile, 'steps', 'Steps', 'steps');
    if (key === 'water') renderWeekly(tile, 'water', 'Water', 'ml');
    if (key === 'calories') renderWeekly(tile, 'calories', 'Calories', 'cal');
    if (key === 'addact') renderAddActivity(tile);
    if (key === 'streak') renderSingle(tile, 'streak', 'Streak', 'streak', ' days');
    if (key === 'social') renderSocial(tile);
}
