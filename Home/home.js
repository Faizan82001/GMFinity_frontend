let movieData = [];
const apiUrl = JSON.parse(localStorage.getItem("config")).apiUrl;
const frontEndUrl = JSON.parse(localStorage.getItem("config")).frontEndUrl;

function fetchSearchResults() {
    const searchInput = document.getElementById("search-input").value;
    const searchYear = document.getElementById("search-year").value;
    const token = localStorage.getItem("token");

    const apiCall = `${apiUrl}/movie?name=${searchInput}&year=${searchYear}`
    fetch(apiCall, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(token)}`,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.Response === "True") {
                displayMovieDetails(data);
                movieData = data;
            }
        })
        .catch((error) => {
            showToast(error.error);
        });
}

function displayMovieDetails(movieData) {
    const movieTitleElement = document.querySelector(".movie-title");
    const moviePosterElement = document.querySelector(".movie-poster");
    const imdbRatingElement = document.querySelector(".imdb-rating");
    const releasedElement = document.querySelector(".released");
    const runtimeElement = document.querySelector(".runtime");
    const genreElement = document.querySelector(".genre");
    const directorElement = document.querySelector(".director");
    const actorsElement = document.querySelector(".actors");
    const plotElement = document.querySelector(".plot");

    movieTitleElement.textContent = movieData.Title;
    moviePosterElement.src = movieData.Poster;
    imdbRatingElement.textContent = `IMDb Rating: ${movieData.imdbRating}`;
    releasedElement.textContent = `Released: ${movieData.Released}`;
    runtimeElement.textContent = `Runtime: ${movieData.Runtime}`;
    genreElement.textContent = `Genre: ${movieData.Genre}`;
    directorElement.textContent = `Director: ${movieData.Director}`;
    actorsElement.textContent = `Actors: ${movieData.Actors}`;
    plotElement.textContent = `Plot: ${movieData.Plot}`;
}

function handleSearch() {
    const searchInput = document.getElementById("search-input");
    const searchQuery = searchInput.value;
    if (searchQuery) {
        fetchSearchResults();
    } else {
        hideMovieBox();
    }
}

function hideMovieBox() {
    const movieBox = document.querySelector(".movie-box");
    movieBox.style.display = "none";
}

function showMovieBox() {
    const movieBox = document.querySelector(".movie-box");
    movieBox.style.display = "block";
}

document.getElementById("search-input").addEventListener("input", function () {
    handleSearch();
    if (this.value.trim() === "") {
        hideMovieBox();
    } else {
        showMovieBox();
    }
});

document.getElementById("search-year").addEventListener("input", function () {
    handleSearch();
});

document
    .getElementById("search-button")
    .addEventListener("click", handleSearch);

function fetchPublicPlaylists() {
    const apiCall = `${apiUrl}/playlists/public-playlists`;
    const token = localStorage.getItem("token");
    fetch(apiCall, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(token)}`,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            displayPublicPlaylists(data);
        })
        .catch((error) => {
            console.error("API call failed:", error);
        });
}

function displayPublicPlaylists(playlistsData) {
    const publicPlaylistsSection = document.querySelector(".public-playlists");
    publicPlaylistsSection.innerHTML = "";

    if (playlistsData.length === 0) {
        const noData = document.createElement("h2");
        noData.classList.add("no-data");
        noData.textContent = "No Public PlayLists";
        publicPlaylistsSection.append(noData);
    } else {
        playlistsData.forEach((playlist) => {
            const playlistCard = document.createElement("div");
            playlistCard.classList.add("playlist-card");

            playlistCard.addEventListener("click", () => {
                sessionStorage.setItem("playlistId", playlist._id);
                window.location.href = `${frontEndUrl}/playlist.html?name=${playlist.name}`;
            });
            const playlistTitle = document.createElement("h3");
            playlistTitle.textContent = playlist.name;
            playlistCard.appendChild(playlistTitle);

            const createdBy = document.createElement("p");
            createdBy.textContent = `Created by: ${playlist.user.username}`;
            playlistCard.appendChild(createdBy);

            const itemCount = document.createElement("p");
            itemCount.textContent = `Movies in Playlist: ${playlist.items.length}`;
            playlistCard.appendChild(itemCount);

            const viewPlaylistIcon = document.createElement("span");
            viewPlaylistIcon.classList.add("view-playlist-icon");
            viewPlaylistIcon.innerHTML = "&#8250;";
            viewPlaylistIcon.setAttribute("data-tooltip", "View Playlist");
            playlistCard.appendChild(viewPlaylistIcon);

            publicPlaylistsSection.appendChild(playlistCard);
        });
    }
}

fetchPublicPlaylists();

function closeSidebarOnClickOutside(event) {
    const sidebar = document.getElementById("sidebar");
    const playlistsButton = document.querySelector(".navbar-playlists");

    if (
        !sidebar.contains(event.target) &&
        !playlistsButton.contains(event.target)
    ) {
        sidebar.classList.remove("open");
        document.removeEventListener("click", closeSidebarOnClickOutside);
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("open");

    if (sidebar.classList.contains("open")) {
        fetchPlaylists();
        document.addEventListener("click", closeSidebarOnClickOutside);
    } else {
        document.removeEventListener("click", closeSidebarOnClickOutside);
    }
}

function fetchPlaylists() {
    const apiCall = `${apiUrl}/playlists`;
    const token = localStorage.getItem("token");
    fetch(apiCall, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(token)}`,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            displayPlaylistsToAdd(data);
            displayPlaylists(data);
        })
        .catch((error) => {
            console.error("API call failed:", error);
        });
}

function displayPlaylists(playlistsData) {
    const playlistList = document.getElementById("playlist-list");
    playlistList.innerHTML = "";

    playlistsData.forEach((playlist) => {
        const playlistItem = document.createElement("div");
        playlistItem.classList.add("playlist-item");

        playlistItem.addEventListener("click", () => {
            sessionStorage.setItem("playlistId", playlist._id);
            window.location.href = `${frontEndUrl}/playlist.html?name=${playlist.name}`;
        });

        const playlistName = document.createElement("span");
        playlistName.textContent = playlist.name;
        playlistItem.appendChild(playlistName);

        const itemCount = document.createElement("p");
        itemCount.textContent = `Movies in Playlist: ${playlist.items.length}`;
        playlistItem.appendChild(itemCount);

        playlistList.appendChild(playlistItem);
    });
}

const createPlaylistButton = document.getElementById("createPlaylistButton");
const closeModalButton = document.getElementById("closeModal");
const createPlaylistModal = document.getElementById("createPlaylistModal");
const playlistForm = document.getElementById("playlistForm");

createPlaylistButton.addEventListener("click", () => {
    createPlaylistModal.style.display = "flex";
    toggleSidebar();
});

closeModalButton.addEventListener("click", () => {
    createPlaylistModal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === createPlaylistModal) {
        createPlaylistModal.style.display = "none";
    }
});

const playlistNameInput = document.getElementById("playlistName");
const publicToggleInput = document.getElementById("publicToggle");
document
    .getElementById("playlistName")
    .addEventListener("input", validatePlaylistName);
let isValid = false;

function validatePlaylistForm(e) {
    e.preventDefault();
    const playlistName = playlistNameInput.value.trim();
    const isPublic = publicToggleInput.checked;
    validatePlaylistName();
    if (!isValid) {
        return false;
    }
    createPlaylistApi(playlistName, isPublic);
    return true;
}

function createPlaylistApi(playlistName, isPublic) {
    const apiCall = `${apiUrl}/playlists/playlist`;
    const token = localStorage.getItem("token");
    const data = {
        name: playlistName,
        isPublic,
    };
    fetch(apiCall, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(token)}`,
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((responseData) => {
            if (responseData["error"]) {
                showToast(responseData.error);
            }
            if (responseData["playlist"]) {
                showToast(responseData.message);
                createPlaylistModal.style.display = "none";
                document.getElementById("playlistForm").reset();
                fetchPublicPlaylists();
                fetchPlaylists();
            }
        })
        .catch((error) => {
            showToast(error.error);
        });
}

function validatePlaylistName() {
    const playlistName = document.getElementById("playlistName").value.trim();
    if (playlistName === "") {
        showError("playlistName", "Playlist Name is required");
        isValid = false;
    } else {
        hideError("playlistName");
        isValid = true;
    }
}

function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    errorElement.textContent = message;
}

function hideError(fieldId) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    errorElement.textContent = "";
}

function showToast(message) {
    const toastElement = document.getElementById("toast");
    toastElement.textContent = message;
    toastElement.classList.add("show");
    setTimeout(() => {
        toastElement.classList.remove("show");
    }, 3000);
}

function openPlaylistModal() {
    const playlistModal = document.getElementById("playlistModal");
    playlistModal.style.display = "flex";
    fetchPlaylists();
}

function displayPlaylistsToAdd(data) {
    const playlistContainer = document.getElementById("playlistContainer");
    playlistContainer.innerHTML = "";

    data.forEach((playlist) => {
        const playlistItem = document.createElement("div");
        playlistItem.classList.add("playlist-item");

        const playlistName = document.createElement("span");
        playlistName.textContent = playlist.name;

        const addButton = document.createElement("button");

        addButton.textContent = "Add";
        addButton.setAttribute("data-playlist-id", playlist._id);
        addButton.addEventListener("click", () => {
            addToPlaylist(playlist._id, movieData, addButton);
        });

        playlistItem.appendChild(playlistName);
        playlistItem.appendChild(addButton);
        playlistContainer.appendChild(playlistItem);
    });
}

function addToPlaylist(playlistId, movieData, addButton) {
    const apiCall = `${apiUrl}/playlists/add-to-playlist`;
    const token = localStorage.getItem("token");
    const data = {
        playlistId,
        movieData,
    };
    fetch(apiCall, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(token)}`,
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((responseData) => {
            if (responseData.message && addButton.textContent === "Add") {
                addButton.textContent = "Added ✔";
                addButton.style.backgroundColor = "green";
                addButton.style.color = "white";
                addButton.style.border = "2px solid green";
                addButton.disabled = true;
                fetchPublicPlaylists();
                showToast(responseData.message);
                setTimeout(() => {
                    playlistModal.style.display = "none";
                }, 1000);
            } else {
                showToast(responseData.error);
            }
        })
        .catch((error) => {
            showToast(error.error);
        });
}

const closePlaylistModalButton = document.getElementById("closePlaylistModal");

closePlaylistModalButton.addEventListener("click", function () {
    playlistModal.style.display = "none";
});

window.addEventListener("click", function (event) {
    if (event.target === playlistModal) {
        playlistModal.style.display = "none";
    }
});
