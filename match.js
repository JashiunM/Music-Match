const names = ["Kaden", "Ava", "Jake", "Mia", "Liam"];
const genres = ["Rap", "Rock", "Pop", "Jazz", "EDM"];
const button = document.getElementById("Match_Button");

function generateMatch() {
    const name = names[Math.floor(Math.random() * names.length)];

    console.log(name);

    genres.forEach(genre => {
        const score = Math.floor(Math.random() * 101);
        console.log(genre + ": " + score);
    });
}

// run immediately
generateMatch();