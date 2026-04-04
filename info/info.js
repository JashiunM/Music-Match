const form = document.getElementById("form");
const result = document.getElementById("result");
const bio = document.getElementById("bio");
const bioCount = document.getElementById("bioCount");

const picPreview = document.getElementById("picPreview");
const picOptions = document.getElementById("picOptions");

// Toggle dropdown
picPreview.addEventListener("click", () => {
  picOptions.style.display = picOptions.style.display === "block" ? "none" : "block";
});

// Select avatar
picOptions.querySelectorAll("img").forEach(img => {
  img.addEventListener("click", () => {
    picPreview.src = img.src;
    picOptions.style.display = "none"; // close dropdown
  });
});

// Bio character count
bio.addEventListener("input", () => {
  bioCount.textContent = `${bio.value.length} / 100`;
});

// Submit form
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
      document.getElementById("genre1").value,
      document.getElementById("genre2").value,
      document.getElementById("genre3").value
    ]
  };
  console.log(data);
  result.textContent = "Profile created!";
});