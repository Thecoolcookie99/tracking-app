const form = document.querySelector('#friend-settings');
const message = document.querySelector('#settings-message');
const showFriends = document.querySelector('#show-friends');
const showFriendActivity = document.querySelector('#show-friend-activity');
const goalsForm = document.querySelector('#goals-form');
const goalsMessage = document.querySelector('#goals-message');
const statLogForm = document.querySelector('#stat-log-form');
const logMessage = document.querySelector('#log-message');
const signOut = document.querySelector('#sign-out');

const defaultGoals = { sleep: 8, steps: 10000, water: 2000, calories: 2000 };
const savedGoals = JSON.parse(localStorage.getItem('goals') || JSON.stringify(defaultGoals));

for (const stat of Object.keys(defaultGoals)) {
    document.querySelector(`#${stat}-goal`).value = savedGoals[stat] ?? defaultGoals[stat];
}

showFriends.checked = localStorage.getItem('showFriends') !== 'false';
showFriendActivity.checked = localStorage.getItem('showFriendActivity') !== 'false';

form.addEventListener('submit', (event) => {
    event.preventDefault();
    localStorage.setItem('showFriends', showFriends.checked);
    localStorage.setItem('showFriendActivity', showFriendActivity.checked);
    message.textContent = 'Settings saved.';
});

goalsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const goals = {};
    for (const stat of Object.keys(defaultGoals)) {
        goals[stat] = Number(document.querySelector(`#${stat}-goal`).value);
    }
    localStorage.setItem('goals', JSON.stringify(goals));
    goalsMessage.textContent = 'Goals saved.';
});

statLogForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const logs = JSON.parse(localStorage.getItem('statLogs') || '[]');
    logs.push({
        stat: document.querySelector('#log-stat').value,
        value: Number(document.querySelector('#log-value').value),
        date: new Date().toISOString()
    });
    localStorage.setItem('statLogs', JSON.stringify(logs));
    statLogForm.reset();
    logMessage.textContent = 'Stat logged.';
});

signOut.addEventListener('click', () => {
    localStorage.removeItem('loggedin');
    localStorage.removeItem('username');
    localStorage.removeItem('hashedusername');
    localStorage.removeItem('hashedpassword');
    window.location.replace('../login/');
});
