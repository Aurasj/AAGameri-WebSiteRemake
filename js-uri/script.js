const toggleButton = document.getElementsByClassName('toggle-button')[0]
const navbarLinks = document.getElementsByClassName('navbar-links')[0]

toggleButton.addEventListener('click', () => {
    navbarLinks.classList.toggle('active')
})


async function fetchGitHubProfile() {
    const response = await fetch("https://api.github.com/users/aurasj");
    const data = await response.json();
  
    document.getElementById("github-profile").innerHTML = `
      <img src="${data.avatar_url}" alt="GitHub Profile Picture" width="100">
      <h3 class="profile-name">${data.name}</h3>
      <p class="profile-bio">${data.bio}</p>
      <a href="${data.html_url}" target="_blank" class="profile-link">View GitHub Profile</a>
    `;
  }
  
async function fetchSpecificRepo(username, repoName, elementId) {
    try {
      const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
      
      if (!response.ok) {
        throw new Error("Repository not found");
      }
  
      const repo = await response.json();
  
      // Populate the specified HTML element with repository details
      document.getElementById(elementId).innerHTML = `
        <h3><a href="${repo.html_url}" target="_blank" class="repo-link">${repo.name}</a></h3>
        <p>${repo.description || "No description available."}</p>
        <p><strong>Language:</strong> ${repo.language || "N/A"}</p>
        <p><strong>Last Updated:</strong> ${new Date(repo.updated_at).toLocaleDateString()}</p>
      `;
    }catch (error) {
        document.getElementById(elementId).innerHTML = `<p>Error: ${error.message}</p>`;
      }
    }
  
fetchGitHubProfile();
fetchSpecificRepo("Aurasj", "Horror-Multiplayer", "repo-card-1"); 
fetchSpecificRepo("Aurasj", "SteamP2PTransport-MLAPI-UNITY-TEST", "repo-card-2"); 
fetchSpecificRepo("Macaron-s1", "chat-facapp", "repo-card-3"); 

document.addEventListener("DOMContentLoaded", function() {
    const btn = document.getElementById('showContactFormBtn');
    const form = document.getElementById('contactForm');

    btn.addEventListener('click', () => {
        if (form.style.display === 'none' || form.style.display === '') {
            form.style.display = 'block';
            btn.style.display = 'none'; // ascunde butonul după click
        } else {
            form.style.display = 'none';
        }
    });
});
document.addEventListener("DOMContentLoaded", function() {
    const btn = document.getElementById('showContactFormBtn');
    const form = document.getElementById('contactForm');
    const cancelBtn = document.getElementById('cancelFormBtn');

    btn.addEventListener('click', () => {
        form.style.display = 'block';
        btn.style.display = 'none'; // ascunde butonul "Contact"
    });

    cancelBtn.addEventListener('click', () => {
        form.style.display = 'none';
        btn.style.display = 'inline-block'; // arata din nou butonul
    });
});
