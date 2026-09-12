const friendList = document.querySelector('#friend-list');
const showFriends = localStorage.getItem('showFriends') !== 'false';
const showFriendActivity = localStorage.getItem('showFriendActivity') !== 'false';
const friendForm = document.querySelector('#friend-form');
const friendMessage = document.querySelector('#friend-message');
const storedFriends = JSON.parse(localStorage.getItem('friends') || '[]');
const blockedFriends = JSON.parse(localStorage.getItem('blockedFriends') || '[]');

//add a simple local friend profile
friendForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.querySelector('#friend-username').value.trim();
    const friend = {
        displayname: username,
        username,
        status: 'New friend'
    };
    if (!friend.username || storedFriends.some((item) => item.username === friend.username)) return;
    storedFriends.push(friend);
    localStorage.setItem('friends', JSON.stringify(storedFriends));
    friendForm.reset();
    friendMessage.textContent = 'Friend added.';
    window.location.reload();
});

if (!showFriends) {
    const message = document.createElement('p');
    message.className = 'title';
    message.textContent = 'Friends are hidden in settings.'; 
    friendList.appendChild(message);
} else {
    const friends = [
        ...(await fetch(window.location.origin + '/json/friends.json').then((response) => response.json())),
        ...storedFriends
    ].filter((friend) => !blockedFriends.includes(friend.username));

    friends.forEach((friend) => {
        const item = document.createElement('section');
        item.className = 'friend-item';

        const name = document.createElement('p');
        name.className = 'title';
        name.textContent = friend.displayname;
        item.appendChild(name);

        const username = document.createElement('p');
        username.className = 'friend-username';
        username.textContent = `@${friend.username}`;
        item.appendChild(username);

        if (showFriendActivity) {
            const status = document.createElement('p');
            status.className = 'friend-status';
            status.textContent = friend.status;
            item.appendChild(status);
        }

        const actions = document.createElement('div');
        actions.className = 'friend-actions';
        const report = document.createElement('button');
        report.textContent = 'Report';
        report.onclick = () => localStorage.setItem('reported_' + friend.username, 'true');
        const block = document.createElement('button');
        block.textContent = 'Block';
        block.onclick = () => {
            blockedFriends.push(friend.username);
            localStorage.setItem('blockedFriends', JSON.stringify(blockedFriends));
            item.remove();
        };
        actions.append(report, block);
        item.appendChild(actions);

        friendList.appendChild(item);
    });
}
