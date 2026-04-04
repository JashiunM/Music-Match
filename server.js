const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
let currentUser = null; // This will act as our "Session"

// --- CHANGE 1: Move these lines below the 'const app' line ---
app.use(express.static(__dirname)); 
app.use('/Assets', express.static(path.join(__dirname, 'FrontEnd', 'Assets')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/info', express.static(path.join(__dirname, 'info')));

app.get('/potential-matches', (req, res) => {
    fs.readFile('savingUsers.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send("Error reading users");
        const allUsers = JSON.parse(data);
        
        // We'll assume your session/logic knows who is logged in.
        // For now, let's just send the whole list and filter on the frontend.
        res.json(allUsers);
    });
});

app.get('/current-user', (req, res) => {
    if (currentUser) {
        res.json(currentUser);
    } else {
        res.status(404).send("No one is logged in");
    }
});

app.get('/info-page', (req, res) => {
    // This points to the 'info' folder and then the 'info.html' file
    res.sendFile(path.join(__dirname, 'info', 'info.html'));
});

// Add this near your other app.get routes
app.get('/home', (req, res) => {
    // Points to the FrontEnd folder specifically
    res.sendFile(path.join(__dirname, 'FrontEnd', 'home.html'));
});

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
            currentUser = newUser;
            res.redirect('/info-page');
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
            //if login successful redirect them to 
            currentUser = foundUser;
            res.redirect('/home');
        } else {
            // If not, tell them it's wrong
            res.send(`
                <script>
                    alert("Incorrect email or password. Please try again.");
                    window.location.href = "/"; // This sends them back to the login page
                </script>
            `);
        }
    });
});
// --- NEW CODE ENDS HERE ---

app.post('/save-profile', (req, res) => {
    const profileData = req.body;
    fs.readFile('savingUsers.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send("Error reading file");
        let users = JSON.parse(data);

        // Find the index of the person who is actually logged in
        const index = users.findIndex(u => u.email === currentUser.email);

        if (index !== -1) {
            // Update both the list and our active session variable
            users[index] = { ...users[index], ...profileData };
            currentUser = users[index]; 

            fs.writeFile('savingUsers.json', JSON.stringify(users, null, 2), (err) => {
                if (err) return res.status(500).send("Error saving data");
                res.sendStatus(200);
            });
        } else {
            res.status(400).send("User session not found");
        }
    });
});
/*
app.get("/current-user", (req, res) => {
    fs.readFile("savingUsers.json", "utf8", (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not read user file" });
        }

        try {
            const users = JSON.parse(data);

            if (!users.length) {
                return res.status(404).json({ error: "No user found" });
            }

            const user = users[0];

            res.json({
                firstname: user.firstname,
                lastname: user.lastname,
                name: user.name,
                email: user.email,
                profilePic: user.profilePic,
                age: user.age,
                gender: user.gender,
                city: user.city,
                height: user.height,
                bio: user.bio,
                genres: user.genres
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Invalid JSON" });
        }
    });
});
*/

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});