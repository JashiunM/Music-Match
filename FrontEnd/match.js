console.log("match.js loaded");

function generateMergedPlaylist(commonGenres) {
    let pool = [];
    
    // 1. Gather all songs from the genres they both liked
    commonGenres.forEach(genre => {
        if (musicData[genre]) {
            pool = pool.concat(musicData[genre]);
        }
    });

    // 2. Shuffle the pool
    const shuffled = pool.sort(() => 0.5 - Math.random());

    // 3. Take up to 20 songs
    return shuffled.slice(0, 20);
}

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

        // 1. Get the Current User
        const currentUser = await getCurrentUser();

        // 2. Fetch ALL real users from the server
        const response = await fetch("/potential-matches");
        const allUsers = await response.json();

        // 3. Filter out the current user so they don't match with themselves
        const potentialMatches = allUsers.filter(user => user.email !== currentUser.email);

        // 4. Check if anyone else exists
        if (potentialMatches.length === 0) {
            alert("No other users found! Try again once more people join.");
            return;
        }

        // 5. Pick a random REAL user
        const randomIndex = Math.floor(Math.random() * potentialMatches.length);
        const randomMatch = potentialMatches[randomIndex];

        // 6. Compare genres (Using the logic you already wrote)
        // Note: Real users have a 'genres' array from your info.html
        const commonGenres = currentUser.genres.filter(genre =>
            randomMatch.genres.includes(genre)
        );

        const matchData = {
            name: randomMatch.name,
            age: randomMatch.age,
            city: randomMatch.city,
            bio: randomMatch.bio,
            img: randomMatch.profilePic || "https://api.dicebear.com/7.x/adventurer/svg?seed=default", 
            genres: randomMatch.genres,
            commonGenres: commonGenres,
            matchPercent: Math.floor((commonGenres.length / currentUser.genres.length) * 100)
        };

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
        const topIcon = document.getElementById("profile-icon");
        if (topIcon) topIcon.src = user.profilePic;
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

    
    const playlistContainer = document.getElementById("playlist-container");

    if (matchData.matchPercent > 33) {
        // Show a button or the playlist itself
        const btn = document.createElement("button");
        btn.textContent = "Create Merged Playlist";
        btn.className = "btn-playlist";
    
        btn.onclick = () => {
            const playlist = generateMergedPlaylist(matchData.commonGenres);
            displayPlaylist(playlist);
        };
    
        playlistContainer.appendChild(btn);
    } else {
        const message = document.createElement("p");
            message.textContent = "💔 Bad Match: Not enough shared genres for a playlist.";
            
            message.className = "bad-match-msg";

            playlistContainer.appendChild(message);
    }
}

function displayPlaylist(playlist) {
    const songListDiv = document.getElementById("song-list");
    if (!songListDiv) return;

    songListDiv.innerHTML = "";
    songListDiv.className = "card playlist-card"; 

    const title = document.createElement("h2");
    title.textContent = "Your Shared 20-Song Mix";
    title.style.color = "#ff6f91";
    title.style.marginBottom = "1.5rem";
    songListDiv.appendChild(title);

    const ol = document.createElement("ol");
    // Style the list to be centered but left-aligned text
    ol.style.textAlign = "left";
    ol.style.display = "inline-block";
    ol.style.paddingLeft = "20px";

    playlist.forEach(song => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${song.title}</strong> — ${song.artist}`;
        li.style.marginBottom = "10px";
        li.style.fontSize = "0.95rem";
        ol.appendChild(li);
    });

    songListDiv.appendChild(ol);
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

const musicData = {
    "Rock": [
        { "title": "Stairway to Heaven", "artist": "Led Zeppelin" },
        { "title": "Bohemian Rhapsody", "artist": "Queen" },
        { "title": "Smells Like Teen Spirit", "artist": "Nirvana" },
        { "title": "Hotel California", "artist": "Eagles" },
        { "title": "Comfortably Numb", "artist": "Pink Floyd" },
        { "title": "Gimme Shelter", "artist": "The Rolling Stones" },
        { "title": "Free Bird", "artist": "Lynyrd Skynyrd" },
        { "title": "Sweet Child o' Mine", "artist": "Guns N' Roses" },
        { "title": "A Day in the Life", "artist": "The Beatles" },
        { "title": "Back in Black", "artist": "AC/DC" },
        { "title": "All Along the Watchtower", "artist": "Jimi Hendrix Experience" },
        { "title": "Don't Stop Believin'", "artist": "Journey" },
        { "title": "Livin' on a Prayer", "artist": "Bon Jovi" },
        { "title": "Dream On", "artist": "Aerosmith" },
        { "title": "Baba O'Riley", "artist": "The Who" },
        { "title": "Dreams", "artist": "Fleetwood Mac" },
        { "title": "Enter Sandman", "artist": "Metallica" },
        { "title": "Smoke on the Water", "artist": "Deep Purple" },
        { "title": "Like a Rolling Stone", "artist": "Bob Dylan" },
        { "title": "Light My Fire", "artist": "The Doors" },
        { "title": "Born to Run", "artist": "Bruce Springsteen" },
        { "title": "We Will Rock You", "artist": "Queen" },
        { "title": "Paint It, Black", "artist": "The Rolling Stones" },
        { "title": "More Than a Feeling", "artist": "Boston" },
        { "title": "Layla", "artist": "Derek and the Dominos" },
        { "title": "Thunderstruck", "artist": "AC/DC" },
        { "title": "House of the Rising Sun", "artist": "The Animals" },
        { "title": "Californication", "artist": "Red Hot Chili Peppers" },
        { "title": "Where the Streets Have No Name", "artist": "U2" },
        { "title": "In the End", "artist": "Linkin Park" },
        { "title": "Paranoid", "artist": "Black Sabbath" },
        { "title": "You Really Got Me", "artist": "The Kinks" },
        { "title": "Creep", "artist": "Radiohead" },
        { "title": "Welcome to the Jungle", "artist": "Guns N' Roses" },
        { "title": "Bittersweet Symphony", "artist": "The Verve" },
        { "title": "Blitzkrieg Bop", "artist": "Ramones" },
        { "title": "Carry On Wayward Son", "artist": "Kansas" },
        { "title": "Losing My Religion", "artist": "R.E.M." },
        { "title": "Every Breath You Take", "artist": "The Police" },
        { "title": "Jump", "artist": "Van Halen" }
    ],
  "Rap": [
  { "title": "Lose Yourself", "artist": "Eminem" },
  { "title": "HUMBLE.", "artist": "Kendrick Lamar" },
  { "title": "SICKO MODE", "artist": "Travis Scott" },
  { "title": "God's Plan", "artist": "Drake" },
  { "title": "DNA.", "artist": "Kendrick Lamar" },
  { "title": "Mask Off", "artist": "Future" },
  { "title": "Rockstar", "artist": "Post Malone ft. 21 Savage" },
  { "title": "Life Is Good", "artist": "Future ft. Drake" },
  { "title": "Lucid Dreams", "artist": "Juice WRLD" },
  { "title": "Goosebumps", "artist": "Travis Scott" },
  { "title": "XO TOUR Llif3", "artist": "Lil Uzi Vert" },
  { "title": "The Box", "artist": "Roddy Ricch" },
  { "title": "Bad and Boujee", "artist": "Migos ft. Lil Uzi Vert" },
  { "title": "Money Longer", "artist": "Lil Uzi Vert" },
  { "title": "No Role Modelz", "artist": "J. Cole" },
  { "title": "Middle Child", "artist": "J. Cole" },
  { "title": "Alright", "artist": "Kendrick Lamar" },
  { "title": "Hotline Bling", "artist": "Drake" },
  { "title": "Laugh Now Cry Later", "artist": "Drake ft. Lil Durk" },
  { "title": "What's Next", "artist": "Drake" },
  { "title": "Industry Baby", "artist": "Lil Nas X ft. Jack Harlow" },
  { "title": "First Class", "artist": "Jack Harlow" },
  { "title": "Super Gremlin", "artist": "Kodak Black" },
  { "title": "F.N.F. (Let's Go)", "artist": "GloRilla" },
  { "title": "Pushin P", "artist": "Gunna ft. Future & Young Thug" },
  { "title": "Drip Too Hard", "artist": "Lil Baby & Gunna" },
  { "title": "Yes Indeed", "artist": "Lil Baby ft. Drake" },
  { "title": "Freestyle", "artist": "Lil Baby" },
  { "title": "Suge", "artist": "DaBaby" },
  { "title": "BOP", "artist": "DaBaby" },
  { "title": "RAPSTAR", "artist": "Polo G" },
  { "title": "Pop Out", "artist": "Polo G ft. Lil Tjay" },
  { "title": "Look Alive", "artist": "BlocBoy JB ft. Drake" },
  { "title": "Plain Jane", "artist": "A$AP Ferg" },
  { "title": "Praise The Lord (Da Shine)", "artist": "A$AP Rocky" },
  { "title": "Powerglide", "artist": "Rae Sremmurd" },
  { "title": "Black Beatles", "artist": "Rae Sremmurd" },
  { "title": "Tunnel Vision", "artist": "Kodak Black" },
  { "title": "Love Sosa", "artist": "Chief Keef" },
  { "title": "GUMMO", "artist": "6ix9ine" }
],
  "Pop": [
  { "title": "Blinding Lights", "artist": "The Weeknd" },
  { "title": "Shape of You", "artist": "Ed Sheeran" },
  { "title": "Levitating", "artist": "Dua Lipa" },
  { "title": "Uptown Funk", "artist": "Mark Ronson ft. Bruno Mars" },
  { "title": "Happy", "artist": "Pharrell Williams" },
  { "title": "Shake It Off", "artist": "Taylor Swift" },
  { "title": "Rolling in the Deep", "artist": "Adele" },
  { "title": "Someone Like You", "artist": "Adele" },
  { "title": "Bad Guy", "artist": "Billie Eilish" },
  { "title": "Stay", "artist": "The Kid LAROI & Justin Bieber" },
  { "title": "Peaches", "artist": "Justin Bieber ft. Daniel Caesar & Giveon" },
  { "title": "Watermelon Sugar", "artist": "Harry Styles" },
  { "title": "As It Was", "artist": "Harry Styles" },
  { "title": "Anti-Hero", "artist": "Taylor Swift" },
  { "title": "Cruel Summer", "artist": "Taylor Swift" },
  { "title": "Firework", "artist": "Katy Perry" },
  { "title": "Roar", "artist": "Katy Perry" },
  { "title": "Teenage Dream", "artist": "Katy Perry" },
  { "title": "Call Me Maybe", "artist": "Carly Rae Jepsen" },
  { "title": "Sorry", "artist": "Justin Bieber" },
  { "title": "What Do You Mean?", "artist": "Justin Bieber" },
  { "title": "Senorita", "artist": "Shawn Mendes & Camila Cabello" },
  { "title": "Havana", "artist": "Camila Cabello ft. Young Thug" },
  { "title": "Closer", "artist": "The Chainsmokers ft. Halsey" },
  { "title": "We Found Love", "artist": "Rihanna ft. Calvin Harris" },
  { "title": "Diamonds", "artist": "Rihanna" },
  { "title": "Umbrella", "artist": "Rihanna ft. Jay-Z" },
  { "title": "Tik Tok", "artist": "Kesha" },
  { "title": "Counting Stars", "artist": "OneRepublic" },
  { "title": "Radioactive", "artist": "Imagine Dragons" },
  { "title": "Believer", "artist": "Imagine Dragons" },
  { "title": "Thunder", "artist": "Imagine Dragons" },
  { "title": "Bad Romance", "artist": "Lady Gaga" },
  { "title": "Poker Face", "artist": "Lady Gaga" },
  { "title": "Just Dance", "artist": "Lady Gaga" },
  { "title": "Take On Me", "artist": "a-ha" },
  { "title": "I Wanna Dance with Somebody", "artist": "Whitney Houston" },
  { "title": "Billie Jean", "artist": "Michael Jackson" },
  { "title": "Thriller", "artist": "Michael Jackson" },
  { "title": "Don't Start Now", "artist": "Dua Lipa" }
],
  "Country": [
  { "title": "Tennessee Whiskey", "artist": "Chris Stapleton" },
  { "title": "Wagon Wheel", "artist": "Darius Rucker" },
  { "title": "Take Me Home, Country Roads", "artist": "John Denver" },
  { "title": "Before He Cheats", "artist": "Carrie Underwood" },
  { "title": "Jolene", "artist": "Dolly Parton" },
  { "title": "The Gambler", "artist": "Kenny Rogers" },
  { "title": "Friends in Low Places", "artist": "Garth Brooks" },
  { "title": "Ring of Fire", "artist": "Johnny Cash" },
  { "title": "Man! I Feel Like a Woman!", "artist": "Shania Twain" },
  { "title": "Die a Happy Man", "artist": "Thomas Rhett" },
  { "title": "H.O.L.Y.", "artist": "Florida Georgia Line" },
  { "title": "Cruise", "artist": "Florida Georgia Line" },
  { "title": "Body Like a Back Road", "artist": "Sam Hunt" },
  { "title": "Humble and Kind", "artist": "Tim McGraw" },
  { "title": "Live Like You Were Dying", "artist": "Tim McGraw" },
  { "title": "Chicken Fried", "artist": "Zac Brown Band" },
  { "title": "Colder Weather", "artist": "Zac Brown Band" },
  { "title": "Need You Now", "artist": "Lady A" },
  { "title": "Pontoon", "artist": "Little Big Town" },
  { "title": "Girl Crush", "artist": "Little Big Town" },
  { "title": "Blue Ain't Your Color", "artist": "Keith Urban" },
  { "title": "Somebody Like You", "artist": "Keith Urban" },
  { "title": "Speechless", "artist": "Dan + Shay" },
  { "title": "Tequila", "artist": "Dan + Shay" },
  { "title": "Beautiful Crazy", "artist": "Luke Combs" },
  { "title": "Hurricane", "artist": "Luke Combs" },
  { "title": "Forever After All", "artist": "Luke Combs" },
  { "title": "Sand in My Boots", "artist": "Morgan Wallen" },
  { "title": "Whiskey Glasses", "artist": "Morgan Wallen" },
  { "title": "7 Summers", "artist": "Morgan Wallen" },
  { "title": "The Bones", "artist": "Maren Morris" },
  { "title": "My Church", "artist": "Maren Morris" },
  { "title": "Drunk on You", "artist": "Luke Bryan" },
  { "title": "Play It Again", "artist": "Luke Bryan" },
  { "title": "Country Girl (Shake It for Me)", "artist": "Luke Bryan" },
  { "title": "God's Country", "artist": "Blake Shelton" },
  { "title": "Austin", "artist": "Blake Shelton" },
  { "title": "When It Rains It Pours", "artist": "Luke Combs" },
  { "title": "The Devil Went Down To Georgia", "artist": "The Charlies Daniels Band" },
  { "title": "One Man Band", "artist": "Old Dominion" }
],
  "Jazz": [
  { "title": "So What", "artist": "Miles Davis" },
  { "title": "Take Five", "artist": "Dave Brubeck" },
  { "title": "My Favorite Things", "artist": "John Coltrane" },
  { "title": "What a Wonderful World", "artist": "Louis Armstrong" },
  { "title": "Feeling Good", "artist": "Nina Simone" },
  { "title": "Fly Me to the Moon", "artist": "Frank Sinatra" },
  { "title": "Autumn Leaves", "artist": "Bill Evans" },
  { "title": "All of Me", "artist": "Billie Holiday" },
  { "title": "Blue in Green", "artist": "Miles Davis" },
  { "title": "Round Midnight", "artist": "Thelonious Monk" },
  { "title": "A Love Supreme, Pt. I – Acknowledgement", "artist": "John Coltrane" },
  { "title": "Take the A Train", "artist": "Duke Ellington" },
  { "title": "Sing, Sing, Sing", "artist": "Benny Goodman" },
  { "title": "It Don't Mean a Thing (If It Ain't Got That Swing)", "artist": "Duke Ellington" },
  { "title": "Strange Fruit", "artist": "Billie Holiday" },
  { "title": "Misty", "artist": "Erroll Garner" },
  { "title": "In a Sentimental Mood", "artist": "Duke Ellington & John Coltrane" },
  { "title": "My Funny Valentine", "artist": "Chet Baker" },
  { "title": "Cheek to Cheek", "artist": "Ella Fitzgerald & Louis Armstrong" },
  { "title": "Summertime", "artist": "Ella Fitzgerald & Louis Armstrong" },
  { "title": "Watermelon Man", "artist": "Herbie Hancock" },
  { "title": "Cantaloupe Island", "artist": "Herbie Hancock" },
  { "title": "Birdland", "artist": "Weather Report" },
  { "title": "Spain", "artist": "Chick Corea" },
  { "title": "Freddie Freeloader", "artist": "Miles Davis" },
  { "title": "Moanin'", "artist": "Art Blakey & The Jazz Messengers" },
  { "title": "Goodbye Pork Pie Hat", "artist": "Charles Mingus" },
  { "title": "Stolen Moments", "artist": "Oliver Nelson" },
  { "title": "Song for My Father", "artist": "Horace Silver" },
  { "title": "The Girl from Ipanema", "artist": "Stan Getz & João Gilberto" },
  { "title": "Desafinado", "artist": "Stan Getz & João Gilberto" },
  { "title": "Blue Train", "artist": "John Coltrane" },
  { "title": "Naima", "artist": "John Coltrane" },
  { "title": "West End Blues", "artist": "Louis Armstrong" },
  { "title": "I Got Rhythm", "artist": "Ella Fitzgerald" },
  { "title": "April in Paris", "artist": "Count Basie" },
  { "title": "Harlem Nocturne", "artist": "Earle Hagen" },
  { "title": "Take the Coltrane", "artist": "Duke Ellington & John Coltrane" },
  { "title": "A Night in Tunisia", "artist": "Dizzy Gillespie" },
  { "title": "Straight, No Chaser", "artist": "Thelonious Monk" }
],
  "EDM": [
  { "title": "Levels", "artist": "Avicii" },
  { "title": "Wake Me Up", "artist": "Avicii" },
  { "title": "Fade Into Darkness", "artist": "Avicii" },
  { "title": "Titanium", "artist": "David Guetta ft. Sia" },
  { "title": "Without You", "artist": "David Guetta ft. Usher" },
  { "title": "Animals", "artist": "Martin Garrix" },
  { "title": "Scared to Be Lonely", "artist": "Martin Garrix & Dua Lipa" },
  { "title": "Don't You Worry Child", "artist": "Swedish House Mafia" },
  { "title": "Greyhound", "artist": "Swedish House Mafia" },
  { "title": "Clarity", "artist": "Zedd ft. Foxes" },
  { "title": "Stay the Night", "artist": "Zedd ft. Hayley Williams" },
  { "title": "Closer", "artist": "The Chainsmokers ft. Halsey" },
  { "title": "Something Just Like This", "artist": "The Chainsmokers & Coldplay" },
  { "title": "Roses", "artist": "The Chainsmokers ft. ROZES" },
  { "title": "Lean On", "artist": "Major Lazer & DJ Snake" },
  { "title": "Turn Down for What", "artist": "DJ Snake & Lil Jon" },
  { "title": "Taki Taki", "artist": "DJ Snake ft. Selena Gomez, Ozuna, Cardi B" },
  { "title": "Where Are Ü Now", "artist": "Skrillex & Diplo ft. Justin Bieber" },
  { "title": "Bangarang", "artist": "Skrillex" },
  { "title": "First of the Year (Equinox)", "artist": "Skrillex" },
  { "title": "Get Lucky", "artist": "Daft Punk ft. Pharrell Williams" },
  { "title": "One More Time", "artist": "Daft Punk" },
  { "title": "Around the World", "artist": "Daft Punk" },
  { "title": "Summer", "artist": "Calvin Harris" },
  { "title": "I'm Not Alone", "artist": "Calvin Harris" },
  { "title": "Feel So Close", "artist": "Calvin Harris" },
  { "title": "Intoxicated", "artist": "Martin Solveig & GTA" },
  { "title": "Booyah", "artist": "Showtek ft. We Are Loud & Sonny Wilson" },
  { "title": "Tsunami", "artist": "DVBBS & Borgeous" },
  { "title": "Reload", "artist": "Sebastian Ingrosso & Tommy Trash" },
  { "title": "Calling (Lose My Mind)", "artist": "Sebastian Ingrosso & Alesso" },
  { "title": "If I Lose Myself (Remix)", "artist": "Alesso vs OneRepublic" },
  { "title": "Years", "artist": "Alesso ft. Matthew Koma" },
  { "title": "Silhouettes", "artist": "Avicii" },
  { "title": "Opus", "artist": "Eric Prydz" },
  { "title": "Strobe", "artist": "deadmau5" },
  { "title": "Ghosts n Stuff", "artist": "deadmau5 ft. Rob Swire" },
  { "title": "Language", "artist": "Porter Robinson" },
  { "title": "Sad Machine", "artist": "Porter Robinson" },
  { "title": "Firestone", "artist": "Kygo ft. Conrad Sewell" }
]
}
