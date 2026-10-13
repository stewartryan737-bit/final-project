let movie = "avengers";
//

async function main() {
  const inputEl = document.querySelector("#movie-input");
  const searchTerm = inputEl ? inputEl.value : movie;
  if (!searchTerm) return;

  const movies = await fetch(
    `https://www.omdbapi.com/?s=${searchTerm}&apikey=f2f5394e`
  );
  const moviesData = await movies.json();
  const movieListEl = document.querySelector(".movie-list");
  
  const moviesHTML = (moviesData.Search ?? [])
  .map((movie) => `<div class="movie-card">
    <div class="movie__card--container">
      <h3>${movie.Title}</h3>
      <p><b>Poster:</b> <img src="${movie.Poster}" alt="${movie.Title}"></p>
      <p><b>Title:</b> ${movie.Title}</p>
      <p><b>Year:</b> ${movie.Year}</p>
    </div>
  </div>`)
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
