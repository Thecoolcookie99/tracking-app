const form = document.querySelector('#friend-settings');
const message = document.querySelector('#settings-message');
const showFriends = document.querySelector('#show-friends');
const showFriendActivity = document.querySelector('#show-friend-activity');

showFriends.checked = localStorage.getItem('showFriends') !== 'false';
showFriendActivity.checked = localStorage.getItem('showFriendActivity') !== 'false';

form.addEventListener('submit', (event) => {
    event.preventDefault();
    localStorage.setItem('showFriends', showFriends.checked);
    localStorage.setItem('showFriendActivity', showFriendActivity.checked);
    message.textContent = 'Settings saved.';
});
