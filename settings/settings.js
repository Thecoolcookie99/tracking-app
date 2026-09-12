//get the friend settings controls
const form = document.querySelector('#friend-settings');
const profileForm = document.querySelector('#profile-form');
const profileMessage = document.querySelector('#profile-message');
const message = document.querySelector('#settings-message');
const showFriends = document.querySelector('#show-friends');
const showFriendActivity = document.querySelector('#show-friend-activity');
const goalsForm = document.querySelector('#goals-form');
const goalsMessage = document.querySelector('#goals-message');
const signOut = document.querySelector('#sign-out');

//load the saved profile details
const profile = JSON.parse(localStorage.getItem('profile') || '{}');
document.querySelector('#profile-name').value = profile.name || '';
document.querySelector('#profile-email').value = profile.email || '';
document.querySelector('#profile-age').value = profile.age || '';
document.querySelector('#profile-weight').value = profile.weight || '';

//provide sensible daily targets for a new user
const defaultGoals = { sleep: 8, steps: 10000, water: 2000, calories: 2000, streak: 7 };
//load saved goals, or use the defaults when none exist
const savedGoals = JSON.parse(localStorage.getItem('goals') || JSON.stringify(defaultGoals));

//fill each goal input with its saved value
for (const stat of Object.keys(defaultGoals)) {
    document.querySelector(`#${stat}-goal`).value = savedGoals[stat] ?? defaultGoals[stat];
}

//restore the user's friend visibility preferences
showFriends.checked = localStorage.getItem('showFriends') !== 'false';
showFriendActivity.checked = localStorage.getItem('showFriendActivity') !== 'false';

//save profile details locally
profileForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const updatedProfile = {
        name: document.querySelector('#profile-name').value.trim(),
        email: document.querySelector('#profile-email').value.trim(),
        age: Number(document.querySelector('#profile-age').value),
        weight: Number(document.querySelector('#profile-weight').value)
    };
    if (updatedProfile.age < 13 || updatedProfile.age > 120 || updatedProfile.weight < 1 || updatedProfile.weight > 500) return;
    localStorage.setItem('profile', JSON.stringify(updatedProfile));
    profileMessage.textContent = 'Profile saved.';
});

//save friend preferences
form.addEventListener('submit', (event) => {
    //keep the settings page from reloading
    event.preventDefault();
    localStorage.setItem('showFriends', showFriends.checked);
    localStorage.setItem('showFriendActivity', showFriendActivity.checked);
    message.textContent = 'Settings saved.';
});

//save the daily goals entered by the user
goalsForm.addEventListener('submit', (event) => {
    //keep the settings page from reloading
    event.preventDefault();
    const goals = {};
    //read every supported stat goal from its input
    for (const stat of Object.keys(defaultGoals)) {
        goals[stat] = Number(document.querySelector(`#${stat}-goal`).value);
    }
    localStorage.setItem('goals', JSON.stringify(goals));
    goalsMessage.textContent = 'Goals saved.';
});

//save the widgets shown on the home page
const widgetForm = document.querySelector('#widget-settings');
const widgetMessage = document.querySelector('#widget-message');
const widgetOptions = [...document.querySelectorAll('#widget-settings input[type="checkbox"]')];
const savedWidgets = JSON.parse(localStorage.getItem('enabledWidgets') || 'null');
for (const option of widgetOptions) option.checked = savedWidgets === null || savedWidgets.includes(option.value);
widgetForm.addEventListener('submit', (event) => {
    event.preventDefault();
    localStorage.setItem('enabledWidgets', JSON.stringify(widgetOptions.filter((option) => option.checked).map((option) => option.value)));
    widgetMessage.textContent = 'Widgets saved.';
});

//sign out without removing the user's activity and goal data
signOut.addEventListener('click', () => {
    //remove only authentication values
    localStorage.removeItem('loggedin');
    localStorage.removeItem('username');
    localStorage.removeItem('hashedusername');
    localStorage.removeItem('hashedpassword');
    //send the signed-out user to the login page
    window.location.replace('../login/');
});
