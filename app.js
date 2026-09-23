const LEAGUE_ID = "1352723400459563008";
 
async function loadLeague() {
try {
 
const users = await fetch(
`https://api.sleeper.app/v1/league/${LEAGUE_ID}/users`
).then(r => r.json());
 
const rosters = await fetch(
`https://api.sleeper.app/v1/league/${LEAGUE_ID}/rosters`
).then(r => r.json());
 
const teams = rosters.map(roster => {
 
const owner =
users.find(
u => u.user_id === roster.owner_id
);
 
return {
team:
owner?.metadata?.team_name ||
owner?.display_name ||
"Unknown",
 
owner:
owner?.display_name ||
"Unknown",
 
wins:
roster.settings?.wins || 0,
 
losses:
roster.settings?.losses || 0,
 
points:
(roster.settings?.fpts || 0) +
((roster.settings?.fpts_decimal || 0) / 100)
};
 
});
 
// STANDINGS
 
teams.sort((a, b) => {
 
if (b.wins !== a.wins)
return b.wins - a.wins;
 
return b.points - a.points;
 
});
 
document.getElementById("standings")
.innerHTML =
teams.map((team, index) => `
<div class="team">
#${index + 1}
<strong>${team.team}</strong>
<br>
${team.wins}-${team.losses}
</div>
`).join("");
 
// POWER RANKINGS
 
document.getElementById(
"powerRankings"
).innerHTML =
teams.map((team, index) => `
<div class="team">
#${index + 1}
${team.team}
</div>
`).join("");
 
// DRESS TRACKER
 
const sacko =
[...teams]
.sort((a, b) => {
 
if (a.wins !== b.wins)
return a.wins - b.wins;
 
return a.points - b.points;
 
})
.slice(0, 3);
 
document.getElementById(
"dressTracker"
).innerHTML =
sacko.map((team, index) => `
<div class="team">
${index + 1}.
${team.team}
</div>
`).join("");
 
// NEWS
 
document.getElementById("news")
.innerHTML = `
<strong>Current Leader:</strong>
${teams[0].team}
<br><br>
 
<strong>Sacko Watch:</strong>
${sacko[0].team}
currently sits at the top of the Dress Tracker.
<br><br>
 
Live standings are updating directly from Sleeper.
`;
 
}
catch (error) {
 
console.error(error);
 
document.getElementById("standings")
.innerHTML =
"Unable to load Sleeper data.";
 
}
}
 
loadLeague();
