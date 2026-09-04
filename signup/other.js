async function submit() {
    const user = document.getElementById('username').value
    const password = document.getElementById('password').value
    const hasheduser = await hash(user)
    const hashedpassword = await hash(password)

    const data = await fetch(window.location.origin + '/json/users.json').then(r => r.json());
    const taken = data.some(u => u.id === hasheduser)

    if (taken) {
        alert('username already taken')
        return
    };
    if (password.length < 10) {
        alert('Password must be at least 10 chars')
        return
    };
    
    alert('User successfully created!')
    localStorage.setItem('username', user);
    localStorage.setItem('hashedusername', hasheduser);
    localStorage.setItem('hashedpassword', hashedpassword);
    localStorage.setItem('loggedin', 1);
    window.location.replace('../home/index.html')
    return
};

async function hash(input) {
  const encoder = new TextEncoder(); const data = encoder.encode(input); const buffer = await crypto.subtle.digest('SHA-256', data); const array = Array.from(new Uint8Array(buffer)); return array.map(b => b.toString(16).padStart(2, '0')).join('');
}