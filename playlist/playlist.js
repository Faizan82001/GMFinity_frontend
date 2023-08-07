const apiUrl = JSON.parse(localStorage.getItem("config")).apiUrl;
const frontEndUrl = JSON.parse(localStorage.getItem("config")).frontEndUrl;

function goToHomePage() {
    window.location.href = `${frontEndUrl}/Home/home.html`;
}

const currentUrl = window.location.href;
const urlParams = new URLSearchParams(currentUrl.split("?")[1]);
const playlistName = urlParams.get("name");
const playlistId = sessionStorage.getItem("playlistId");

function fetchItemsFromPlaylist(playlistName) {
    const apiCall = `${apiUrl}/playlists/playlist/${playlistName}`;
    const token = localStorage.getItem("token");
    fetch(apiCall, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(token)}`,
        },
    })
        .then((response) => response.json())
        .then((responseData) => {
            if (responseData["error"]) {
                showToast(responseData.error);
            } else {
                displayMovieList(responseData);
            }
        })
        .catch((error) => {
            showToast(error.error);
        });
}

fetchItemsFromPlaylist(playlistName);

function displayMovieList(movieList) {
    const movieContainer = document.getElementById("movie-container");
    movieContainer.innerHTML = "";

    if (movieList.length === 0) {
        const noData = document.createElement("h2");
        noData.classList.add("no-data");
        noData.textContent = "No Movies in the Playlist";
        movieContainer.append(noData);
    } else {
        movieList.forEach((movie) => {
            const movieBox = document.createElement("div");
            movieBox.classList.add("movie-box");

            const movieHeader = document.createElement("div");
            movieHeader.classList.add("movie-header");

            const movieTitle = document.createElement("h2");
            movieTitle.classList.add("movie-title");
            movieTitle.textContent = movie.Title;

            const heartIcon = document.createElement("span");
            heartIcon.classList.add("heart-icon");
            heartIcon.innerHTML = "&#x2764;&#xfe0f;";
            heartIcon.style.color = "red";
            heartIcon.setAttribute("data-tooltip", "Remove From Playlist")
            heartIcon.addEventListener("click", () =>
                removeFromPlaylist(playlistId, movie.imdbID)
            );

            movieHeader.appendChild(movieTitle);
            movieHeader.appendChild(heartIcon);

            const movieContent = document.createElement("div");
            movieContent.classList.add("movie-content");

            const moviePoster = document.createElement("img");
            moviePoster.classList.add("movie-poster");
            moviePoster.src = movie.Poster;
            moviePoster.alt = "Could not load image at the moment!!";

            const movieDetails = document.createElement("div");
            movieDetails.classList.add("movie-details");

            const imdbRating = document.createElement("p");
            imdbRating.classList.add("imdb-rating");
            imdbRating.textContent = `IMDb Rating: ${movie.imdbRating}`;

            const released = document.createElement("p");
            released.classList.add("released");
            released.textContent = `Released: ${movie.Released}`;

            const runtime = document.createElement("p");
            runtime.classList.add("runtime");
            runtime.textContent = `Runtime: ${movie.Runtime}`;

            const genre = document.createElement("p");
            genre.classList.add("genre");
            genre.textContent = `Genre: ${movie.Genre}`;

            const director = document.createElement("p");
            director.classList.add("director");
            director.textContent = `Director: ${movie.Director}`;

            const actors = document.createElement("p");
            actors.classList.add("actors");
            actors.textContent = `Actors: ${movie.Actors}`;

            const plot = document.createElement("p");
            plot.classList.add("plot");
            plot.textContent = `Plot: ${movie.Plot}`;

            movieDetails.appendChild(imdbRating);
            movieDetails.appendChild(released);
            movieDetails.appendChild(runtime);
            movieDetails.appendChild(genre);
            movieDetails.appendChild(director);
            movieDetails.appendChild(actors);
            movieDetails.appendChild(plot);

            movieContent.appendChild(moviePoster);
            movieContent.appendChild(movieDetails);

            movieBox.appendChild(movieHeader);
            movieBox.appendChild(movieContent);

            movieContainer.appendChild(movieBox);
        });
    }
}

function removeFromPlaylist(playlistId, movieId) {
    const apiCall = `${apiUrl}/playlists/remove-from-playlist`;
    const token = localStorage.getItem("token");
    const data = {
        playlistId,
        movieId,
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
            if (responseData.message) {
                showToast(responseData.message);
                fetchItemsFromPlaylist(playlistName);
            } else {
                showToast(responseData.error);
            }
        })
        .catch((error) => {});
}

function sharePlaylist() {
    const url = window.location.href;
    const input = document.createElement("input");
    input.value = url;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    showToast("Page URL copied to clipboard!");
}

function showToast(message) {
    const toastElement = document.getElementById("toast");
    toastElement.textContent = message;
    toastElement.classList.add("show");
    setTimeout(() => {
        toastElement.classList.remove("show");
    }, 3000);
}
