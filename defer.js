const isloggedin = localStorage.getItem("loggedin");
const hasheduser = localStorage.getItem("hashedusername")
const hashedpassword = localStorage.getItem("hashedpassword")

function defer() {
    if (window.location.pathname !== '/login/') {
        if (window.location.pathname !== '/signup/') {
            window.location.replace(window.location.origin + "/login")
        }
    }
}

if (isloggedin === "1") {

    const data = await fetch(window.location.origin + '/json/users.json').then(r => r.json());
    const taken = data.some(u => u.id === hasheduser)

    if (taken === true) {
        const pass = data.filter(u => u.id === hasheduser)[0].password
        if (pass === hashedpassword) {
            if (window.location.href === window.location.origin + '/login/') {
                document.location.replace("../settings")
            };
            if (window.location.href === window.location.origin + '/signup/') {
                document.location.replace("../settings")
            }
        } else {
            defer()
        }
    } else{
        defer()
    }
} else {
    defer()
}
