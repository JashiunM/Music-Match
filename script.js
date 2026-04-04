// Music Match - Dating Website JavaScript

class MusicMatch {
  constructor() {
    this.currentUser = null;
    this.users = JSON.parse(localStorage.getItem('musicMatchUsers')) || [];
    this.init();
  }

  init() {
    const form = document.getElementById('profileForm');
    form.addEventListener('submit', this.handleProfileSubmit.bind(this));

    // Load existing user if they have a profile
    this.loadCurrentUser();
  }

  handleProfileSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const userData = {
      id: Date.now().toString(),
      name: document.getElementById('name').value.trim(),
      age: parseInt(document.getElementById('age').value),
      gender: document.getElementById('gender').value,
      preference: document.getElementById('preference').value,
      city: document.getElementById('city').value.trim(),
      height: document.getElementById('height').value.trim(),
      bio: document.getElementById('bio').value.trim(),
      createdAt: new Date().toISOString()
    };

    // Validate required fields
    if (!this.validateProfile(userData)) {
      alert('Please fill in all required fields.');
      return;
    }

    // Save user
    this.saveUser(userData);
    this.currentUser = userData;

    // Show matches
    this.showMatches();

    // Hide form and show matches
    document.getElementById('profileForm').style.display = 'none';
    document.getElementById('matches').style.display = 'block';
  }

  validateProfile(userData) {
    return userData.name &&
           userData.age >= 18 &&
           userData.gender &&
           userData.preference &&
           userData.city;
  }

  saveUser(userData) {
    // Remove existing user if updating
    this.users = this.users.filter(user => user.id !== userData.id);

    // Add new user
    this.users.push(userData);

    // Save to localStorage
    localStorage.setItem('musicMatchUsers', JSON.stringify(this.users));
    localStorage.setItem('currentUserId', userData.id);
  }

  loadCurrentUser() {
    const currentUserId = localStorage.getItem('currentUserId');
    if (currentUserId) {
      this.currentUser = this.users.find(user => user.id === currentUserId);
      if (this.currentUser) {
        this.showMatches();
        document.getElementById('profileForm').style.display = 'none';
        document.getElementById('matches').style.display = 'block';
      }
    }
  }

  showMatches() {
    const matchesList = document.getElementById('matchesList');
    const matches = this.findMatches();

    if (matches.length === 0) {
      matchesList.innerHTML = '<p>No matches found yet. Be the first to join!</p>';
      return;
    }

    matchesList.innerHTML = matches.map(match => this.createMatchCard(match)).join('');
  }

  findMatches() {
    if (!this.currentUser) return [];

    return this.users
      .filter(user => user.id !== this.currentUser.id)
      .filter(user => this.isCompatible(user))
      .map(user => ({
        ...user,
        compatibilityScore: this.calculateCompatibility(user)
      }))
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, 10); // Show top 10 matches
  }

  isCompatible(otherUser) {
    // Basic compatibility check
    if (this.currentUser.preference === 'everyone') return true;
    if (otherUser.preference === 'everyone') return true;
    return this.currentUser.preference === otherUser.gender && otherUser.preference === this.currentUser.gender;
  }

  calculateCompatibility(otherUser) {
    let score = 0;

    // Age compatibility (90% weight) - prefer similar ages
    const ageDiff = Math.abs(this.currentUser.age - otherUser.age);
    const ageScore = Math.max(0, 90 - ageDiff * 3);
    score += ageScore;

    // City bonus (10% weight) for shared location
    if (this.currentUser.city.toLowerCase() === otherUser.city.toLowerCase()) {
      score += 10;
    }

    return Math.round(score);
  }

  createMatchCard(match) {
    return `
      <div class="match-card">
        <h3>${match.name}, ${match.age}</h3>
        <p><strong>Location:</strong> ${match.city}</p>
        ${match.bio ? `<p><strong>About:</strong> ${match.bio}</p>` : ''}
        <span class="match-percentage">${match.compatibilityScore}% Match</span>
      </div>
    `;
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MusicMatch();
});