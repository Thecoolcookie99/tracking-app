//get the modules placeholder
const moduleGrid = document.querySelector('#activity-modules');
//get local saved activities from localstorage (would get from a server if was expanded)
const savedActivities = JSON.parse(localStorage.getItem('activities') || '[]');

//gets activities and users saved
const activities = await fetch(window.location.origin + '/json/activities.json').then((response) => response.json());
const savedBoxes = await fetch(window.location.origin + '/json/usersavedboxes.json').then((response) => response.json())

//joins activities from locally and json file into one array
const allActivities = [...savedActivities, ...activities];

//fancy way to just get each item rather than the number at the start
const boxConfiguration = Object.values(savedBoxes[0] || {});

//defines what the first part of each is as it must be 5 characters
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

//creates each module for each entry
function createModule(key, size) {
    const tile = document.createElement('section');
    tile.className = `dynamic-tile ${size === 'lrg' ? 'large' : 'small'}`;
    tile.dataset.module = key;
    return tile;
}

//adds the title of the module
function addTitle(tile, title) {
    const heading = document.createElement('p');
    heading.className = 'title';
    heading.textContent = title;
    tile.appendChild(heading);
    tile.appendChild(document.createElement('hr'));
}

//adds each element to each tile
function addText(tile, text) {
    const value = document.createElement('p');
    value.className = 'title';
    value.textContent = text;
    tile.appendChild(value);
}

function addWeeklyGraph(tile, values) {
    const graph = document.createElement('div');
    graph.className = 'weekly-graph';
    const maximum = Math.max(...values, 1);
    const maximumLabel = document.createElement('span');
    maximumLabel.className = 'weekly-maximum';
    maximumLabel.textContent = maximum;
    graph.appendChild(maximumLabel);

    values.forEach((value, index) => {
        const day = document.createElement('div');
        day.className = 'weekly-day';

        const bar = document.createElement('span');
        bar.className = 'weekly-bar';
        bar.style.height = `${Math.max((value / maximum) * 100, value > 0 ? 8 : 2)}%`;

        const label = document.createElement('span');
        label.className = 'weekly-day-label';
        label.textContent = ['M', 'T', 'W', 'T', 'F', 'S', 'S'][index] || '';

        day.appendChild(bar);
        day.appendChild(label);
        graph.appendChild(day);
    });

    tile.appendChild(graph);
}

//formats the duration to mm:ss
function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = String(seconds % 60).padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
}

// recent tile
function renderRecent(tile) {

    const recent = allActivities[0];
    addTitle(tile, recent ? recent.activityname : 'Recent activity');
    if (!recent) {
        addText(tile, 'No activities recorded');
        return;
    }

    //format the date correctly (screw you unix)
    const date = new Date(Number(recent.dateunix) * 1000);

    //add all elements
    addText(tile, recent.activity);
    addText(tile, date.toLocaleDateString('en-AU'));
    addText(tile, `Duration: ${formatDuration(Number(recent.durationsec))}`);
    if (tile.classList.contains('large')) {
        addText(tile, `Distance: ${Math.round(Number(recent.distancemeters) / 10) / 100}km`);
    }
}

//so this code basically is used for different weekly elements
async function renderWeekly(tile, key, title, unit) {
    //load the user's daily goal values
    const goals = JSON.parse(localStorage.getItem('goals') || '{}');
    //use locally logged values when the user has recorded this stat
    const savedLogs = JSON.parse(localStorage.getItem('statLogs') || '[]')
        .filter((log) => log.stat === key && Date.now() - new Date(log.date).getTime() < 7 * 24 * 60 * 60 * 1000);

    if (savedLogs.length > 0) {
        //total the recent local entries for the weekly summary
        const total = savedLogs.reduce((sum, log) => sum + Number(log.value), 0);
        addTitle(tile, title);
        addText(tile, `${Math.round(total * 100) / 100} ${unit} this week`);
        if (goals[key] !== undefined) addText(tile, `Daily goal: ${goals[key]} ${unit}`);
        return;
    }

    //fall back to the supplied weekly data when there are no local logs
    //gets the right json file for the data requested
    const response = await fetch(window.location.origin + `/json/${key}.json`);

    //gets the values for the entries not the first part
    const values = Object.values((await response.json())[0] || {}).map(Number);

    //calculate total for the week
    const total = values.reduce((sum, value) => sum + value, 0);

    //add each thing
    addTitle(tile, title);
    addText(tile, `${Math.round(total * 100) / 100} ${unit} this week`);
    if (goals[key] !== undefined) addText(tile, `Daily goal: ${goals[key]} ${unit}`);
    if (tile.classList.contains('large')) {
        //show the average and graph only on large tiles
        addText(tile, `Average: ${Math.round((total / Math.max(values.length, 1)) * 100) / 100} ${unit}`);
        addWeeklyGraph(tile, values);
    }
}

//display the sign-in streak popup prepared by the login page
function showSignInStreakPopup() {
    //read the one-time popup value
    const streak = localStorage.getItem('pendingSignInStreak');
    if (!streak) return;

    //consume the value so refreshing home does not show it again
    localStorage.removeItem('pendingSignInStreak');
    //build the popup without requiring extra html on every page
    const popup = document.createElement('div');
    popup.className = 'streak-popup';
    popup.innerHTML = `<div class="streak-popup-content" role="dialog" aria-labelledby="streak-popup-title">
        <button class="streak-popup-close" type="button" aria-label="Close">&times;</button>
        <p class="title" id="streak-popup-title">Sign-in streak</p>
        <p>You have signed in for <strong>${streak} day${streak === '1' ? '' : 's'}</strong> in a row.</p>
    </div>`;
    //add the popup to the current page
    document.body.appendChild(popup);
    //close when the close button or the backdrop is clicked
    popup.querySelector('.streak-popup-close').addEventListener('click', () => popup.remove());
    popup.addEventListener('click', (event) => {
        if (event.target === popup) popup.remove();
    });
}

//check for a pending popup as soon as home loads
showSignInStreakPopup();

//render the json entry
function renderSingle(tile, key, title, field, suffix) {
    //use the locally calculated activity streak when available
    const savedValue = key === 'streak' ? localStorage.getItem('streak') : null;

    if (savedValue !== null) {
        //render the local streak without waiting for the demo json file
        addTitle(tile, title);
        addText(tile, `${savedValue}${suffix}`);
        return;
    }

    //fall back to the original json value
    //gets json data
    fetch(window.location.origin + `/json/${key}.json`)
        //then displays it on the module
        .then((response) => response.json())
        .then((data) => {
            addTitle(tile, title);
            addText(tile, `${data[0]?.[field] || 0}${suffix}`);
        });

}

//actually create the element in html
function renderAddActivity(tile) {
    addTitle(tile, 'Add activity');
    const link = document.createElement('a');
    link.className = 'module-link';
    link.href = '../addactivity/';
    link.textContent = 'Create a workout';
    tile.appendChild(link);
}

//special entry for social rile
function renderSocial(tile) {
    fetch(window.location.origin + '/json/friends.json')
        .then((response) => response.json())
        .then((friends) => {
            addTitle(tile, 'Social');
            addText(tile, `${friends.length} friends`);
            if (tile.classList.contains('large')) {
                const link = document.createElement('a');
                link.className = 'module-link';
                link.href = '../social/';
                link.textContent = 'View friends';
                tile.appendChild(link);
            }
        });
}

for (const configuredBox of boxConfiguration) {
    //read the configured module name and tile size
    //split the value at the slash to get the size AND type
    const [configuredKey, configuredSize = 'sml'] = configuredBox.split('/');
    const key = moduleAliases[configuredKey];
    if (!key) continue;

    console.log(configuredSize)

    //create and attach the configured tile
    //create module
    const tile = createModule(key, configuredSize);
    moduleGrid.appendChild(tile);

    //render the selected module using its configured size
    if (configuredSize === 'sml') {
        if (key === 'recent') renderRecent(tile);
        if (key === 'sleep') renderWeekly(tile, 'sleep', 'Sleep', 'hours');
        if (key === 'steps') renderWeekly(tile, 'steps', 'Steps', 'steps');
        if (key === 'water') renderWeekly(tile, 'water', 'Water', 'ml');
        if (key === 'calories') renderWeekly(tile, 'calories', 'Calories', 'cal');
        if (key === 'addact') renderAddActivity(tile);
        if (key === 'streak') renderSingle(tile, 'streak', 'Streak', 'streak', ' days');
        if (key === 'social') renderSocial(tile);
    } else {
        if (key === 'recent') renderRecent(tile);
        if (key === 'sleep') renderWeekly(tile, 'sleep', 'Sleep', 'hours');
        if (key === 'steps') renderWeekly(tile, 'steps', 'Steps', 'steps');
        if (key === 'water') renderWeekly(tile, 'water', 'Water', 'ml');
        if (key === 'calories') renderWeekly(tile, 'calories', 'Calories', 'cal');
        if (key === 'addact') renderAddActivity(tile);
        if (key === 'streak') renderSingle(tile, 'streak', 'Streak', 'streak', ' days');
        if (key === 'social') renderSocial(tile);
    }
}
