// imports appright library (service I am using for password/database/email handling)
import { Client, Account, ID } from "appwrite";

// creates a client
const client = new Client()
    .setEndpoint("https://syd.cloud.appwrite.io/v1")
    .setProject("6a9a248200153112d9b5");

// sets account to the function account(client)
const account = new Account(client);

// create account function
// export means that other js files can use this
// async is needed as the function needs await
// function means that its a function
async function createAccount(email, password) {
    return await account.create({
        userId: ID.unique(),
        email: email,
        password: password
    });
}

//now we can call import createAccount 

useremail = document.getElementById('email')
userpassword = document.getElementById('password')

function submit() {
    console.log("oappa")
    console.log(useremail)
    console.log(userpassword)
}