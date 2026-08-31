const GITHUB_API_BASE_URL = "https://api.github.com";
const GITHUB_CACHE_DURATION_MS = 5 * 60 * 1000;
const GITHUB_CACHE_PREFIX = "aagameri.github-cache.v1:";
const GITHUB_LINK_HOSTS = new Set(["github.com"]);
const GITHUB_IMAGE_HOSTS = new Set([
  "avatars.githubusercontent.com",
  "github.com",
  "github.githubassets.com"
]);

function getSafeHttpsUrl(value, allowedHosts) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && allowedHosts.has(url.hostname) ? url.href : null;
  } catch {
    return null;
  }
}

function createTextElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  element.textContent = text;
  return element;
}

function showMessage(container, message) {
  if (container) {
    container.replaceChildren(createTextElement("p", "", message));
  }
}

function readGitHubCache(path, allowExpired = false) {
  try {
    const cachedValue = localStorage.getItem(`${GITHUB_CACHE_PREFIX}${path}`);
    if (!cachedValue) {
      return null;
    }

    const cached = JSON.parse(cachedValue);
    const isValid = cached && typeof cached.savedAt === "number" && cached.data;
    const isFresh = isValid && Date.now() - cached.savedAt < GITHUB_CACHE_DURATION_MS;
    return isValid && (allowExpired || isFresh) ? cached.data : null;
  } catch {
    return null;
  }
}

function writeGitHubCache(path, data) {
  try {
    localStorage.setItem(
      `${GITHUB_CACHE_PREFIX}${path}`,
      JSON.stringify({ savedAt: Date.now(), data })
    );
  } catch {
    // The page still works when browser storage is disabled or full.
  }
}

async function fetchGitHubJson(path) {
  const freshCache = readGitHubCache(path);
  if (freshCache) {
    return freshCache;
  }

  try {
    const response = await fetch(`${GITHUB_API_BASE_URL}${path}`, {
      headers: { Accept: "application/vnd.github+json" }
    });

    if (!response.ok) {
      throw new Error(`GitHub API request failed with status ${response.status}`);
    }

    const data = await response.json();
    writeGitHubCache(path, data);
    return data;
  } catch (error) {
    const expiredCache = readGitHubCache(path, true);
    if (expiredCache) {
      return expiredCache;
    }
    throw error;
  }
}

async function fetchGitHubProfile() {
  const container = document.getElementById("github-profile");
  if (!container) {
    return;
  }

  try {
    const data = await fetchGitHubJson("/users/aurasj");
    const fragment = document.createDocumentFragment();
    const avatarUrl = getSafeHttpsUrl(data.avatar_url, GITHUB_IMAGE_HOSTS);

    if (avatarUrl) {
      const image = document.createElement("img");
      image.src = avatarUrl;
      image.alt = "GitHub Profile Picture";
      image.width = 100;
      image.height = 100;
      image.loading = "lazy";
      image.decoding = "async";
      fragment.append(image);
    }

    fragment.append(
      createTextElement("h3", "profile-name", data.name || data.login || "Aurasj"),
      createTextElement("p", "profile-bio", data.bio || "No biography available.")
    );

    const profileUrl = getSafeHttpsUrl(data.html_url, GITHUB_LINK_HOSTS);
    if (profileUrl) {
      const link = createTextElement("a", "profile-link", "View GitHub Profile");
      link.href = profileUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      fragment.append(link);
    }

    container.replaceChildren(fragment);
  } catch (error) {
    console.error("Could not load the GitHub profile.", error);
    showMessage(container, "GitHub profile is temporarily unavailable.");
  }
}

async function fetchSpecificRepo(username, repoName, elementId) {
  const container = document.getElementById(elementId);
  if (!container) {
    return;
  }

  try {
    const repo = await fetchGitHubJson(
      `/repos/${encodeURIComponent(username)}/${encodeURIComponent(repoName)}`
    );
    const fragment = document.createDocumentFragment();
    const heading = document.createElement("h3");
    const repoUrl = getSafeHttpsUrl(repo.html_url, GITHUB_LINK_HOSTS);

    if (repoUrl) {
      const link = createTextElement("a", "repo-link", repo.name || repoName);
      link.href = repoUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      heading.append(link);
    } else {
      heading.textContent = repo.name || repoName;
    }

    const language = document.createElement("p");
    language.append(
      createTextElement("strong", "", "Language:"),
      ` ${repo.language || "N/A"}`
    );

    const updatedDate = new Date(repo.updated_at);
    const formattedDate = Number.isNaN(updatedDate.getTime())
      ? "N/A"
      : updatedDate.toLocaleDateString();
    const lastUpdated = document.createElement("p");
    lastUpdated.append(
      createTextElement("strong", "", "Last Updated:"),
      ` ${formattedDate}`
    );

    fragment.append(
      heading,
      createTextElement("p", "", repo.description || "No description available."),
      language,
      lastUpdated
    );
    container.replaceChildren(fragment);
  } catch (error) {
    console.error(`Could not load ${username}/${repoName}.`, error);
    showMessage(container, "Repository information is temporarily unavailable.");
  }
}

function initializeNavigation() {
  const toggleButton = document.querySelector(".toggle-button");
  const navbarLinks = document.querySelector(".navbar-links");
  if (!toggleButton || !navbarLinks) {
    return;
  }

  const setNavigationOpen = (isOpen) => {
    navbarLinks.classList.toggle("active", isOpen);
    toggleButton.setAttribute("aria-expanded", String(isOpen));
  };

  const toggleNavigation = () => {
    setNavigationOpen(!navbarLinks.classList.contains("active"));
  };

  toggleButton.addEventListener("click", toggleNavigation);
  toggleButton.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleNavigation();
    }
  });

  navbarLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setNavigationOpen(false));
  });
}

function initializeContactForm() {
  const button = document.getElementById("showContactFormBtn");
  const form = document.getElementById("contactForm");
  const cancelButton = document.getElementById("cancelFormBtn");
  if (!button || !form || !cancelButton) {
    return;
  }

  button.addEventListener("click", () => {
    form.style.display = "block";
    button.style.display = "none";
  });

  cancelButton.addEventListener("click", () => {
    form.style.display = "none";
    button.style.display = "inline-block";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation();
  initializeContactForm();
  void fetchGitHubProfile();
  void fetchSpecificRepo("Aurasj", "Horror-Multiplayer", "repo-card-1");
  void fetchSpecificRepo("Aurasj", "SteamP2PTransport-MLAPI-UNITY-TEST", "repo-card-2");
  void fetchSpecificRepo("Macaron-s1", "chat-facapp", "repo-card-3");
});
