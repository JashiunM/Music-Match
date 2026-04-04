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
form.addEventListener("submit", async function(e) {
  e.preventDefault();

  // 1. Gather all the data from the inputs
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

  try {
    // 2. Send the data to the server's new '/save-profile' route
    const response = await fetch('/save-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      // 3. Success! Show a message and move to the home page
      result.textContent = "Profile created successfully!";
      result.style.color = "green";
      
      // Wait 1 second so they can see the success message, then redirect
      setTimeout(() => {
        window.location.href = "/home";
      }, 1000);
      
    } else {
      result.textContent = "Error saving profile. Please try again.";
      result.style.color = "red";
    }
  } catch (error) {
    console.error("Fetch error:", error);
    result.textContent = "Server connection failed.";
  }
});