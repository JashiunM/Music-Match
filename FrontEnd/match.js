console.log("Js Loaded");
const users = [
    { name: "Javiun", img: "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex" },
    { name: "Ava", img: "https://api.dicebear.com/7.x/adventurer/svg?seed=Jordan" },
    { name: "Liam", img: "https://api.dicebear.com/7.x/adventurer/svg?seed=Taylor" },
    { name: "Sophia", img: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sophia" },
    { name: "Noah", img: "https://api.dicebear.com/7.x/adventurer/svg?seed=Noah" }
];

const genres = ["Rap", "Rock", "Pop", "Jazz", "EDM"];

function generateMatch() {
    const randomIndex = Math.floor(Math.random() * users.length);
    const user = users[randomIndex];

    const scores = {};
    genres.forEach(genre => {
        scores[genre] = Math.floor(Math.random() * 101);
    });

    const matchData = {
        name: user.name,
        img: user.img,
        scores: scores
    };

    localStorage.setItem("musicMatchUser", JSON.stringify(matchData));
    window.location.href = "FrontEnd/match.html";
}

function loadMatch() {
    const matchData = JSON.parse(localStorage.getItem("musicMatchUser"));

    if (!matchData) return;

    const img = document.getElementById("profile-img");
    const name = document.getElementById("profile-name");
    const rap = document.getElementById("rap-score");
    const rock = document.getElementById("rock-score");
    const pop = document.getElementById("pop-score");
    const jazz = document.getElementById("jazz-score");
    const edm = document.getElementById("edm-score");

    if (img) img.src = matchData.img;
    if (name) name.textContent = matchData.name;
    if (rap) rap.textContent = "Rap: " + matchData.scores.Rap;
    if (rock) rock.textContent = "Rock: " + matchData.scores.Rock;
    if (pop) pop.textContent = "Pop: " + matchData.scores.Pop;
    if (jazz) jazz.textContent = "Jazz: " + matchData.scores.Jazz;
    if (edm) edm.textContent = "EDM: " + matchData.scores.EDM;
}

document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-button");

    if (startButton) {
        startButton.addEventListener("click", generateMatch);
    }

    loadMatch();
});