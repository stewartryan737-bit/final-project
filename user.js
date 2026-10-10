const TEAM_URL = "https://www.thesportsdb.com/api/v1/json/3/lookupteam.php?id=";
const SCHEDULE_URL = "https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=4391&s=2026";
const postListEl = document.querySelector(".post-list");
const teamDetailEl = document.querySelector(".team-detail");
let teamId = localStorage.getItem("id");

async function main() {
  if (!teamId) {
    teamDetailEl.textContent = "Select an NFL team to view its schedule.";
    return;
  }

  try {
    const [teamsResponse, scheduleResponse] = await Promise.all([fetch(`${TEAM_URL}${encodeURIComponent(teamId)}`), fetch(SCHEDULE_URL)]);
    if (!teamsResponse.ok || !scheduleResponse.ok) throw new Error("Unable to load NFL data");
    const teamsData = await teamsResponse.json();
    const scheduleData = await scheduleResponse.json();
    const team = teamsData.teams?.[0];
    if (!team) throw new Error("Team not found");

    const games = (scheduleData.events || []).filter((event) =>
      String(event.idHomeTeam) === String(teamId) || String(event.idAwayTeam) === String(teamId),
    );
    renderTeam(team, games);
  } catch (error) {
    console.error("Unable to load team schedule:", error);
    teamDetailEl.textContent = "Unable to load this team. Please try again.";
    postListEl.textContent = "";
  }
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[character]));
}

function renderTeam(team, games) {
  const logo = team.strTeamBadge;
  teamDetailEl.innerHTML = `<div class="team-detail__heading">
    ${logo ? `<img class="team-logo team-logo--large" src="${escapeHtml(logo)}" alt="">` : ""}
    <div><p class="eyebrow">Selected team</p><h1>${escapeHtml(team.strTeam)}</h1>
    <p>${escapeHtml(team.strLeague || "NFL")} · ${escapeHtml(team.strStadium || "Stadium unavailable")}</p></div>
  </div>`;

  postListEl.innerHTML = games.length
    ? games.map((game) => gameHTML(game, team.id)).join("")
    : `<p class="empty">No 2026 schedule entries were found for this team.</p>`;
}

function gameHTML(game, selectedTeamId) {
  const isHome = String(game.idHomeTeam) === String(selectedTeamId);
  const opponent = isHome ? game.strAwayTeam : game.strHomeTeam;
  const selectedScore = isHome ? game.intHomeScore : game.intAwayScore;
  const opponentScore = isHome ? game.intAwayScore : game.intHomeScore;
  const date = game.dateEvent ? new Date(`${game.dateEvent}T${game.strTime || "00:00:00"}`).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }) : "TBD";
  const time = game.strTime || "Time TBD";
  const score = selectedScore && opponentScore ? `${selectedScore} - ${opponentScore}` : "Scheduled";
  return `<div class="post">
    <div class="post__title">${escapeHtml(date)} · ${escapeHtml(time)}</div>
    <p class="post__body"><b>${isHome ? "Home" : "Away"} vs ${escapeHtml(opponent || "Opponent")}</b><br>${escapeHtml(score)}</p>
  </div>`;
}

function onSearchChange(event) {
  teamId = event.target.value.trim();
  if (teamId) {
    localStorage.setItem("id", teamId);
    main();
  }
}

main();
