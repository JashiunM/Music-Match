const button = document.getElementById("Login_Button");
console.log("JS LOADED");
button.addEventListener("click", function () {
    const email = document.getElementById("Email_Input").value;
    const password = document.getElementById("Password_Input").value;

    // simple test login
    if (email === "test" && password === "1234") {
        window.location.href = "FrontEnd/home.html"; // go to next page
    } else {
        alert("Wrong login");
    }
});