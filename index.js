class User{
    constructor(email, password){
        this.email = email
        this.password = password
    }
}


document.getElementById("Login_Button").onclick = function(){
    const email = document.getElementById("Email_Input").value
    const password = document.getElementById("Password_Input").value

    let testUser = new User(email, password)

    console.log(testUser.email)
    console.log(testUser.password)
}

document.getElementById("Create_Button").onclick = function(){
    window.location.href = "create account.html"
}