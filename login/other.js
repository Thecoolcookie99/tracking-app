//check the submitted login details
async function submit() {
    //read the username and password fields
    const user = document.getElementById('username').value
    const password = document.getElementById('password').value
    //hash credentials before comparing them with the stored user record
    const hasheduser = await hash(user)
    const hashedpassword = await hash(password)

    //load the registered users
    const data = await fetch(window.location.origin + '/json/users.json').then(r => r.json());
    const userexists = data.some(u => u.id === hasheduser)

    var userpassword = ''
    if (userexists === false) {
        //stop when the username is not registered
        alert("Incorrect password/username")
        return
    } else {
        var userpassword = data.filter(u => u.id === hasheduser)[0].password
    };
    if (hashedpassword !== userpassword) {
        //stop when the password does not match
        alert('Incorrect password/username')
        return
    };
    
    //save the authenticated session in local storage
    localStorage.setItem('username', user);
    localStorage.setItem('hashedusername', hasheduser);
    localStorage.setItem('hashedpassword', hashedpassword);
    localStorage.setItem('loggedin', 1);
    //update the daily sign-in streak before opening home
    updateSignInStreak();
    window.location.replace(window.location.origin + '/home/index.html')
    return
};

//create a local calendar key without time information
function getDateKey(date) {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

//update the sign-in streak and prepare the home popup
function updateSignInStreak() {
    const today = new Date();
    const todayKey = getDateKey(today);
    const lastSignIn = localStorage.getItem('lastSignInDate');
    let streak = Number(localStorage.getItem('signInStreak') || 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    //compare today's login with the previous login date
    if (lastSignIn !== todayKey) {
        //continue yesterday's streak or start a new one
        streak = lastSignIn === getDateKey(yesterday) ? streak + 1 : 1;
        localStorage.setItem('lastSignInDate', todayKey);
        localStorage.setItem('signInStreak', String(streak));
    }

    //show the current streak after every successful login
    localStorage.setItem('pendingSignInStreak', String(streak));
}

//hash text with SHA-256 for credential comparison
async function hash(input) {
  const encoder = new TextEncoder(); const data = encoder.encode(input); const buffer = await crypto.subtle.digest('SHA-256', data); const array = Array.from(new Uint8Array(buffer)); return array.map(b => b.toString(16).padStart(2, '0')).join('');
}