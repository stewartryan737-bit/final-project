let movie = "avengers";

async function main() {
  const inputEl = document.querySelector("#movie-input");
  const searchTerm = inputEl ? inputEl.value : movie;
  if (!searchTerm) return;

  const yearFilter = document.querySelector("#year-filter");
  yearFilter.max = String(new Date().getFullYear());
  if (!yearFilter.checkValidity()) {
    yearFilter.reportValidity();
    return;
  }
  const year = yearFilter.value;
  const movieListEl = document.querySelector(".movie-list");
  const pages = year ? [1, 2, 3, 4, 5] : [1];
  const pageData = await Promise.all(
    pages.map((p) =>
      fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}${year ? `&y=${year}` : ""}&page=${p}&apikey=f2f5394e`,
      ).then((r) => r.json()),
    ),
  );

  let results = pageData.flatMap((d) => d.Search ?? []);
  if (year) {
    results = results.filter((movie) => movie.Year === year);
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
  movieListEl.innerHTML =
    moviesHTML || `<p class="no-results">No movies found.</p>`;
}
main();

function onSearchChange(event) {
  movie = event.target.value;
  main();
}

const bannerImg = document.querySelector(".banner__img");
if (bannerImg) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        bannerImg.classList.add("in-view");
        observer.disconnect();
      }
    },
    { threshold: 0.3 },
  );
  observer.observe(document.querySelector("#footer__banner"));
}

function openMenu() {
  document.body.classList.add("menu--open");
}

function closeMenu() {
  document.body.classList.remove("menu--open");
}
