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
 
const owner = users.find(
user => user.user_id === roster.owner_id
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
 
pf:
(roster.settings?.fpts || 0) +
((roster.settings?.fpts_decimal || 0) / 100)
 
};
 
});
 
teams.sort((a, b) => {
 
if (b.wins !== a.wins)
return b.wins - a.wins;
 
return b.pf - a.pf;
 
});
 
document.getElementById("standings").innerHTML =
teams.map((team, index) => `
<div class="team">
#${index + 1}
${team.team}
<br>
${team.wins}-${team.losses}
</div>
`).join("");
 
document.getElementById("powerRankings").innerHTML =
teams.map((team, index) => `
<div class="team">
#${index + 1}
${team.team}
</div>
`).join("");
 
document.getElementById("owners").innerHTML =
teams.map(team => `
<div class="team">
${team.owner}
<br>
<strong>${team.team}</strong>
</div>
`).join("");
 
const sacko =
[...teams]
.sort((a, b) => {
 
if (a.wins !== b.wins)
return a.wins - b.wins;
 
return a.pf - b.pf;
 
})
.slice(0, 3);
 
document.getElementById("dressTracker").innerHTML =
sacko.map((team, index) => `
<div class="team">
${index + 1}. ${team.team}
</div>
`).join("");
 
document.getElementById("news").innerHTML = `
<strong>League Leader:</strong>
${teams[0].team}
<br><br>
 
<strong>Sacko Favorite:</strong>
${sacko[0].team}
<br><br>
 
Power Rankings and Standings are updating live from Sleeper.
`;
 
}
catch (error) {
 
console.error(error);
 
document.getElementById("standings").innerHTML =
"Unable to load Sleeper data.";
 
}
 
}
 
loadLeague();
