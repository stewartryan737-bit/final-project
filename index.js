const TEAMS_URL = "https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=NFL";
const UserListEl = document.querySelector(".user-list");

async function main() {
  try {
    const response = await fetch(TEAMS_URL);
    if (!response.ok) throw new Error(`Failed to load teams (${response.status})`);
    const data = await response.json();
    const teams = data.teams || [];
    if (!teams.length) throw new Error("The API returned no NFL teams");
    UserListEl.innerHTML = teams
      .sort((first, second) => first.strTeam.localeCompare(second.strTeam))
      .map((team) => teamHTML(team))
      .join("");
  } catch (error) {
    console.error("Unable to load NFL teams:", error);
    UserListEl.innerHTML = `<p class="error">Unable to load NFL teams. Please refresh and try again.</p>`;
  }
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[character]));
}

function showTeamSchedule(id) {
  localStorage.setItem("id", id);
  window.location.href = "user.html";
}

function teamHTML(team) {
  const logo = team.strTeamBadge;
  return `<div class="user">
    <div class="user-card" onclick="showTeamSchedule('${escapeHtml(team.idTeam)}')">
      <div class="user-card__container">
        ${logo ? `<img class="team-logo" src="${escapeHtml(logo)}" alt="">` : ""}
        <h3>${escapeHtml(team.strTeam)}</h3>
        <p><b>Location:</b> ${escapeHtml(team.strLocation)}</p>
        <p><b>Stadium:</b> ${escapeHtml(team.strStadium)}</p>
        <p><b>League:</b> ${escapeHtml(team.strLeague || "NFL")}</p>
      </div>
    </div>
  </div>`;
}

main();
