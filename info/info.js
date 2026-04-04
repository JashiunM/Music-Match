const form = document.getElementById("form");
const result = document.getElementById("result");
const bio = document.getElementById("bio");
const bioCount = document.getElementById("bioCount");

const picPreview = document.getElementById("picPreview");
const picOptions = document.getElementById("picOptions");

// ---------- Avatar Picker ----------
picPreview.addEventListener("click", () => {
  picOptions.style.display = picOptions.style.display === "block" ? "none" : "block";
});

picOptions.querySelectorAll("img").forEach(img => {
  img.addEventListener("click", () => {
    picPreview.src = img.src;
    picOptions.style.display = "none";
  });
});

// ---------- Bio Character Count ----------
bio.addEventListener("input", () => {
  bioCount.textContent = `${bio.value.length} / 100`;
});

// ---------- Top 3 Music Genres ----------
const genres = ["Rap", "Rock", "Pop", "Jazz", "EDM", "Country"];
const genre1 = document.getElementById("genre1");
const genre2 = document.getElementById("genre2");
const genre3 = document.getElementById("genre3");

function populateDropdown(dropdown, options) {
  dropdown.innerHTML = '<option value="">Select</option>';
  options.forEach(opt => {
    const option = document.createElement("option");
    option.value = opt;
    option.textContent = opt;
    dropdown.appendChild(option);
  });
}

// Populate initially
populateDropdown(genre1, genres);
populateDropdown(genre2, genres);
populateDropdown(genre3, genres);

function updateDropdowns() {
  const selected1 = genre1.value;
  const selected2 = genre2.value;

  const options2 = genres.filter(g => g !== selected1);
  const options3 = genres.filter(g => g !== selected1 && g !== selected2);

  populateDropdown(genre2, options2);
  populateDropdown(genre3, options3);

  if (options2.includes(selected2)) genre2.value = selected2;
}

genre1.addEventListener("change", updateDropdowns);
genre2.addEventListener("change", updateDropdowns);

// ---------- Submit Form ----------
form.addEventListener("submit", function(e) {
  e.preventDefault();
  const data = {
    profilePic: picPreview.src,
    name: document.getElementById("name").value,
    age: document.getElementById("age").value,
    gender: document.getElementById("gender").value,
    city: document.getElementById("city").value,
    height: document.getElementById("height").value,
    bio: bio.value,
    genres: [
      genre1.value,
      genre2.value,
      genre3.value
    ]
  };
  console.log(data);
  result.textContent = "Profile created!";
});