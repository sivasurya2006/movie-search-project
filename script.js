
const API_BASE_URL = "https://www.omdbapi.com/";
const apiKeyInput = document.querySelector("#apiKeyInput");
const saveKeyButton = document.querySelector("#saveKeyButton");
const searchForm = document.querySelector("#searchForm");
const movieInput = document.querySelector("#movieInput");
const yearInput = document.querySelector("#yearInput");
const typeSelect = document.querySelector("#typeSelect");
const statusCard = document.querySelector("#statusCard");
const resultsHead = document.querySelector("#resultsHead");
const resultsTitle = document.querySelector("#resultsTitle");
const resultsCount = document.querySelector("#resultsCount");
const movieGrid = document.querySelector("#movieGrid");
const modalBackdrop = document.querySelector("#modalBackdrop");
const closeModalButton = document.querySelector("#closeModalButton");

const modalFields = {
  poster: document.querySelector("#modalPoster"),
  meta: document.querySelector("#modalMeta"),
  title: document.querySelector("#modalTitle"),
  plot: document.querySelector("#modalPlot"),
  rating: document.querySelector("#modalRating"),
  runtime: document.querySelector("#modalRuntime"),
  genre: document.querySelector("#modalGenre"),
  director: document.querySelector("#modalDirector"),
  actors: document.querySelector("#modalActors"),
  boxOffice: document.querySelector("#modalBoxOffice"),
};

apiKeyInput.value = localStorage.getItem("omdbApiKey") || "";

saveKeyButton.addEventListener("click", () => {
  const key = apiKeyInput.value.trim();

  if (!key) {
    localStorage.removeItem("omdbApiKey");
    showStatus("API key removed.", "success");
    return;
  }

  localStorage.setItem("omdbApiKey", key);
  showStatus("API key saved in this browser.", "success");
});

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const apiKey = getApiKey();
  const title = movieInput.value.trim();

  if (!apiKey) {
    showStatus("Enter your OMDb API key first.", "error");
    apiKeyInput.focus();
    return;
  }

  if (!title) {
    showStatus("Enter a movie name to search.", "error");
    movieInput.focus();
    return;
  }

  await searchMovies(title, apiKey);
});

movieGrid.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-imdb-id]");

  if (!button) {
    return;
  }

  const apiKey = getApiKey();
  await showMovieDetails(button.dataset.imdbId, apiKey);
});

closeModalButton.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", (event) => {
  if (event.target === modalBackdrop) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

async function searchMovies(title, apiKey) {
  showStatus("Searching movies...");
  resultsHead.classList.add("hidden");
  movieGrid.innerHTML = "";

  const params = new URLSearchParams({
    apikey: apiKey,
    s: title,
  });

  if (yearInput.value) {
    params.set("y", yearInput.value);
  }

  if (typeSelect.value) {
    params.set("type", typeSelect.value);
  }

  try {
    const data = await fetchOmdb(params);

    if (data.Response === "False") {
      throw new Error(data.Error || "No movies found.");
    }

    renderMovies(data.Search || []);
    resultsTitle.textContent = `Results for "${title}"`;
    resultsCount.textContent = `${Number(data.totalResults).toLocaleString("en")} found`;
    resultsHead.classList.remove("hidden");
    statusCard.classList.add("hidden");
  } catch (error) {
    showStatus(error.message, "error");
  }
}

async function showMovieDetails(imdbId, apiKey) {
  showStatus("Loading movie details...");

  try {
    const data = await fetchOmdb(
      new URLSearchParams({
        apikey: apiKey,
        i: imdbId,
        plot: "full",
      })
    );

    if (data.Response === "False") {
      throw new Error(data.Error || "Movie details unavailable.");
    }

    renderModal(data);
    statusCard.classList.add("hidden");
    modalBackdrop.classList.remove("hidden");
  } catch (error) {
    showStatus(error.message, "error");
  }
}

async function fetchOmdb(params) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}?${params.toString()}`);
  } catch (error) {
    throw new Error("Network blocked or internet unavailable. Check your connection and try again.");
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (data?.Error) {
      throw new Error(data.Error);
    }

    throw new Error(
      `OMDb request failed (${response.status}). Check whether your API key is active.`
    );
  }

  return data;
}

function renderMovies(movies) {
  movieGrid.innerHTML = movies
    .map(
      (movie) => `
        <article class="movie-card">
          <div class="poster-wrap">
            ${renderPoster(movie.Poster, movie.Title)}
          </div>
          <div class="movie-body">
            <h2 class="movie-title">${escapeHtml(movie.Title)}</h2>
            <div class="movie-meta">
              <span>${escapeHtml(movie.Year)}</span>
              <span>${escapeHtml(formatType(movie.Type))}</span>
            </div>
            <button type="button" data-imdb-id="${escapeHtml(movie.imdbID)}">
              Details
            </button>
          </div>
        </article>
      `
    )
    .join("");
}

function renderModal(movie) {
  modalFields.poster.outerHTML = renderModalPoster(movie.Poster, movie.Title);
  modalFields.poster = document.querySelector("#modalPoster");
  modalFields.meta.textContent = `${movie.Year} • ${movie.Rated || "Not Rated"} • ${
    movie.Type || "Title"
  }`;
  modalFields.title.textContent = movie.Title;
  modalFields.plot.textContent = movie.Plot || "Plot unavailable.";
  modalFields.rating.innerHTML = `<span class="rating-pill">${movie.imdbRating || "N/A"}</span>`;
  modalFields.runtime.textContent = movie.Runtime || "N/A";
  modalFields.genre.textContent = movie.Genre || "N/A";
  modalFields.director.textContent = movie.Director || "N/A";
  modalFields.actors.textContent = movie.Actors || "N/A";
  modalFields.boxOffice.textContent = movie.BoxOffice || "N/A";
}

function renderPoster(poster, title) {
  if (!poster || poster === "N/A") {
    return `<div class="poster-placeholder">${escapeHtml(title)}</div>`;
  }

  return `<img src="${escapeHtml(poster)}" alt="${escapeHtml(title)} poster" />`;
}

function renderModalPoster(poster, title) {
  if (!poster || poster === "N/A") {
    return `<div id="modalPoster" class="modal-poster poster-placeholder">${escapeHtml(
      title
    )}</div>`;
  }

  return `<img id="modalPoster" class="modal-poster" src="${escapeHtml(
    poster
  )}" alt="${escapeHtml(title)} poster" />`;
}

function getApiKey() {
  return apiKeyInput.value.trim() || localStorage.getItem("omdbApiKey") || "";
}

function showStatus(message, type = "") {
  statusCard.textContent = message;
  statusCard.className = `status-card ${type}`.trim();
}

function closeModal() {
  modalBackdrop.classList.add("hidden");
}

function formatType(type) {
  if (!type) {
    return "Title";
  }

  return type.charAt(0).toUpperCase() + type.slice(1);
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}