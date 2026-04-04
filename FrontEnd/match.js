console.log("match.js loaded");

const fakeMatches = [
    {
        name: "Ava",
        age: "22",
        city: "Dallas",
        bio: "love concerts and late night drives",
        img: "https://api.dicebear.com/7.x/adventurer/svg?seed=Ava",
        genres: ["Rap", "Pop", "EDM", "Jazz", "Country"]
    },
    {
        name: "Liam",
        age: "24",
        city: "Plano",
        bio: "gym, music, food",
        img: "https://api.dicebear.com/7.x/adventurer/svg?seed=Liam",
        genres: ["Rock", "Country", "Rap", "EDM", "Pop"]
    },
    {
        name: "Sophia",
        age: "21",
        city: "Austin",
        bio: "coffee and playlists all day",
        img: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sophia",
        genres: ["Pop", "Jazz", "EDM", "Country", "Rap"]
    }
];

function getRandomGenres(genresArray, count = 3) {
    const shuffled = [...genresArray].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

async function getCurrentUser() {
    console.log("Fetching /current-user...");
    const response = await fetch("/current-user");
    console.log("Response status:", response.status);

    if (!response.ok) {
        const text = await response.text();
        console.log("Bad response body:", text);
        throw new Error("Failed to fetch current user");
    }

    const user = await response.json();
    console.log("Fetched user:", user);
    return user;
}

async function generateMatch() {
    try {
        console.log("generateMatch started");

        const currentUser = await getCurrentUser();
        console.log("currentUser.genres =", currentUser.genres);

        if (!currentUser || !currentUser.genres || !Array.isArray(currentUser.genres)) {
            throw new Error("Current user genres missing or invalid");
        }

        const randomIndex = Math.floor(Math.random() * fakeMatches.length);
        const randomMatch = fakeMatches[randomIndex];
        console.log("randomMatch =", randomMatch);

        if (!randomMatch.genres || !Array.isArray(randomMatch.genres)) {
            throw new Error("Fake match genres missing");
        }

        const selectedGenres = getRandomGenres(randomMatch.genres, 3);
        console.log("selectedGenres =", selectedGenres);

        const commonGenres = currentUser.genres.filter(genre =>
            selectedGenres.includes(genre)
        );
        console.log("commonGenres =", commonGenres);

        const matchData = {
            name: randomMatch.name,
            age: randomMatch.age,
            city: randomMatch.city,
            bio: randomMatch.bio,
            img: randomMatch.img,
            genres: selectedGenres,
            commonGenres: commonGenres,
            matchPercent: Math.floor((commonGenres.length / 3) * 100)
        };

        console.log("Saving matchData:", matchData);
        localStorage.setItem("musicMatchUser", JSON.stringify(matchData));

        window.location.href = "FrontEnd/match.html";
    } catch (error) {
        console.error("Error generating match:", error);
        alert("Could not generate match.");
    }
}
async function loadCurrentUserCard() {
    try {
        const response = await fetch("/current-user");
        const user = await response.json();

        console.log("Loaded current user:", user);

        const img = document.getElementById("user-img");
        const name = document.getElementById("user-name");
        const age = document.getElementById("user-age");
        const city = document.getElementById("user-city");
        const bio = document.getElementById("user-bio");
        const genres = document.getElementById("user-genres");

        if (img) img.src = user.profilePic;
        if (name) name.textContent = user.name;
        if (age) age.textContent = "Age: " + user.age;
        if (city) city.textContent = "City: " + user.city;
        if (bio) bio.textContent = user.bio;
        if (genres) genres.textContent = "Your genres: " + user.genres.join(", ");

    } catch (error) {
        console.error("Error loading current user:", error);
    }
}
function loadMatch() {
    const matchData = JSON.parse(localStorage.getItem("musicMatchUser"));
    console.log("Loaded matchData:", matchData);

    if (!matchData) return;

    const img = document.getElementById("profile-img");
    const name = document.getElementById("profile-name");
    const age = document.getElementById("profile-age");
    const city = document.getElementById("profile-city");
    const bio = document.getElementById("profile-bio");
    const genres = document.getElementById("match-genres");
    const common = document.getElementById("common-genres");
    const percent = document.getElementById("match-percent");

    if (img) img.src = matchData.img;
    if (name) name.textContent = matchData.name;
    if (age) age.textContent = "Age: " + matchData.age;
    if (city) city.textContent = "City: " + matchData.city;
    if (bio) bio.textContent = matchData.bio;
    if (genres) genres.textContent = "Their genres: " + matchData.genres.join(", ");
    if (common) {
        common.textContent = matchData.commonGenres.length > 0
            ? "Matching genres: " + matchData.commonGenres.join(", ")
            : "No matching genres";
    }
    if (percent) percent.textContent = "Match Score: " + matchData.matchPercent + "%";
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded");

    const startButton = document.getElementById("start-button");

    if (startButton) {
        startButton.addEventListener("click", generateMatch);
    }

    loadCurrentUserCard(); // LEFT CARD
    loadMatch();           // RIGHT CARD
});