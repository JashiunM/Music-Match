const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// --- CHANGE 1: Move these lines below the 'const app' line ---
app.use(express.static(__dirname)); 
app.use('/Assets', express.static(path.join(__dirname, 'FrontEnd', 'Assets')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- CHANGE 2: Keep the blue page as the Home Page ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); 
});

// --- CHANGE 3: Fix the door name to match your index.js button ---
app.get('/register-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'create account.html'));
});

// The "Register" Route
app.post('/register', (req, res) => {
    const newUser = req.body;

    // 1. Read the existing users from the JSON file
    fs.readFile('savingUsers.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Server Error");
        }

        const users = JSON.parse(data);

        // 2. Add the new user to the list
        users.push(newUser);

        // 3. Write the updated list back to the file
        fs.writeFile('savingUsers.json', JSON.stringify(users, null, 2), (err) => {
            if (err) return res.status(500).send("Error saving user");
            res.send("<h1>Registration Successful!</h1><a href='/'>Go Back</a>");
        });
    });
});

// --- NEW CODE STARTS HERE: The Login Check ---
app.post('/login-check', (req, res) => {
    const { email, password } = req.body;

    fs.readFile('savingUsers.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Server Error");
        }

        const users = JSON.parse(data);

        // This searches the JSON array for a user with the matching email AND password
        const foundUser = users.find(u => u.email === email && u.password === password);

        if (foundUser) {
            // If we found them, say hello!
            res.send(`<h1>Welcome back, ${foundUser.firstname}!</h1><a href="/">Go Home</a>`);
        } else {
            // If not, tell them it's wrong
            res.send("<h1>Incorrect email or password.</h1><a href='/'>Try again</a>");
        }
    });
});
// --- NEW CODE ENDS HERE ---

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});