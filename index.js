let movie = "avengers";

async function main() {
  const inputEl = document.querySelector("#movie-input");
  const searchTerm = inputEl ? inputEl.value : movie;
  if (!searchTerm) return;

  const movies = await fetch(
    `https://www.omdbapi.com/?s=${searchTerm}&apikey=f2f5394e`,
  );
  const moviesData = await movies.json();
  const movieListEl = document.querySelector(".movie-list");

  let results = moviesData.Search ?? [];
  const genre = document.querySelector("#genre-filter")?.value;
  if (genre) {
    const details = await Promise.all(
      results.map((m) =>
        fetch(`https://www.omdbapi.com/?i=${m.imdbID}&apikey=f2f5394e`).then(
          (r) => r.json(),
        ),
      ),
    );
    results = results.filter((m, i) =>
      (details[i].Genre ?? "").split(", ").includes(genre),
    );
  }

  const moviesHTML = results
    .map(
      (movie) => `<article class="movie-card">
        <div class="movie-card__poster">
          ${
            movie.Poster !== "N/A"
              ? `<img src="${movie.Poster}" alt="Poster for ${movie.Title}" loading="lazy">`
              : `<div class="movie-card__poster-fallback">Poster unavailable</div>`
          }
        </div>
        <div class="movie-card__details">
          <h3>${movie.Title}</h3>
          <p class="movie-card__year">${movie.Year}</p>
        </div>
      </article>`,
    )
    .join("");
  movieListEl.innerHTML = moviesHTML;
}
main();

function onSearchChange(event) {
  movie = event.target.value;
  main();
}

function openMenu() {
  document.body.classList.add("menu--open");
}

function closeMenu() {
  document.body.classList.remove("menu--open");
}
