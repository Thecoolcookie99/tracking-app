const friendList = document.querySelector('#friend-list');
const showFriends = localStorage.getItem('showFriends') !== 'false';
const showFriendActivity = localStorage.getItem('showFriendActivity') !== 'false';

if (!showFriends) {
    const message = document.createElement('p');
    message.className = 'title';
    message.textContent = 'Friends are hidden in settings.';
    friendList.appendChild(message);
} else {
    const friends = await fetch(window.location.origin + '/json/friends.json').then((response) => response.json());

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

        friendList.appendChild(item);
    });
}
