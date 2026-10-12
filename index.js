async function main() {
  const movies = await fetch(
    "http://www.omdbapi.com/?s=avengers&apikey=f2f5394e",
  );
  const moviesData = await movies.json();
  const movieListEl = document.querySelector(".movie-list")
  
  movieListEl.innerHTML = (moviesData.Search ?? [])
  .map((movie) => `<div class="movie-card">
    <div class="movie__card--container">
      <h3>${movie.Title}</h3>
      <p><b>Poster:</b> <img src="${movie.Poster}" alt="${movie.Title}"></p>
      <p><b>Title:</b> ${movie.Title}</p>
      <p><b>Year:</b> ${movie.Year}</p>
    </div>
  </div>`)
  .join("");
   document.querySelector(".movie-list").innerHTML += moviesHTML;
}
main();

function openMenu() {
  document.body.classList += "menu--open";
}

function closeMenu() {
  document.body.classList.remove("menu--open");
}
