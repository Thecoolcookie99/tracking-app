//get the friend settings controls
const form = document.querySelector('#friend-settings');
const message = document.querySelector('#settings-message');
const showFriends = document.querySelector('#show-friends');
const showFriendActivity = document.querySelector('#show-friend-activity');
const goalsForm = document.querySelector('#goals-form');
const goalsMessage = document.querySelector('#goals-message');
const signOut = document.querySelector('#sign-out');

//provide sensible daily targets for a new user
const defaultGoals = { sleep: 8, steps: 10000, water: 2000, calories: 2000 };
//load saved goals, or use the defaults when none exist
const savedGoals = JSON.parse(localStorage.getItem('goals') || JSON.stringify(defaultGoals));

//fill each goal input with its saved value
for (const stat of Object.keys(defaultGoals)) {
    document.querySelector(`#${stat}-goal`).value = savedGoals[stat] ?? defaultGoals[stat];
}

//restore the user's friend visibility preferences
showFriends.checked = localStorage.getItem('showFriends') !== 'false';
showFriendActivity.checked = localStorage.getItem('showFriendActivity') !== 'false';

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
