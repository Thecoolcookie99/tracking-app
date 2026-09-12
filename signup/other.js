async function submit() {
    const user = document.getElementById('username').value
    const profile = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        age: Number(document.getElementById('age').value),
        weight: Number(document.getElementById('weight').value)
    };
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
    if (!profile.name || !profile.email || profile.age < 13 || profile.age > 120 || profile.weight < 1 || profile.weight > 500) {
        alert('Enter valid profile details')
        return
    };
    
    alert('User successfully created!')
    localStorage.setItem('username', user);
    localStorage.setItem('hashedusername', hasheduser);
    localStorage.setItem('hashedpassword', hashedpassword);
    localStorage.setItem('profile', JSON.stringify(profile));
    localStorage.setItem('loggedin', 1);
    window.location.replace('../home/index.html')
    return
};

async function hash(input) {
  const encoder = new TextEncoder(); const data = encoder.encode(input); const buffer = await crypto.subtle.digest('SHA-256', data); const array = Array.from(new Uint8Array(buffer)); return array.map(b => b.toString(16).padStart(2, '0')).join('');
}