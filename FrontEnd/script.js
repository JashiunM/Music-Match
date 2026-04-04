async function login() {
    const username = document.getElementById("Email_Input").value;
    const password = document.getElementById("Password_Input").value;

    const res = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    console.log(data);

    if (data.success) {
        alert("Login successful");
    } else {
        alert(data.message);
    }
}

document.getElementById("Login_Button").addEventListener("click", login);
