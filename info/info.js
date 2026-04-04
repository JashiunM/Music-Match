const form = document.getElementById("form");
const result = document.getElementById("result");

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    age: document.getElementById("age").value,
    gender: document.getElementById("gender").value,
    city: document.getElementById("city").value,
    height: document.getElementById("height").value,
    bio: document.getElementById("bio").value,
    genres: [
      document.getElementById("genre1").value,
      document.getElementById("genre2").value,
      document.getElementById("genre3").value
    ]
  };

  console.log(data);
  result.textContent = "Profile created!";
});