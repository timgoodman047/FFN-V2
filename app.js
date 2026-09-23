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
u => u.user_id === roster.owner_id
);
 
return {
team:
owner?.metadata?.team_name ||
owner?.display_name ||
"Unknown",
 
wins:
roster.settings.wins,
 
losses:
roster.settings.losses,
 
points:
roster.settings.fpts || 0
};
 
});
 
teams.sort((a, b) => {
 
if (b.wins !== a.wins) {
return b.wins - a.wins;
}
 
return b.points - a.points;
 
});
 
document.getElementById(
"standings"
).innerHTML = teams.map(
(t, i) =>
`<div class="team">
#${i + 1}
${t.team}
(${t.wins}-${t.losses})
</div>`
).join("");
 
document.getElementById(
"powerRankings"
).innerHTML = teams.map(
(t, i) =>
`<div class="team">
#${i + 1}
${t.team}
</div>`
).join("");
 
const sacko =
[...teams]
.sort((a, b) => {
 
if (a.wins !== b.wins) {
return a.wins - b.wins;
}
 
return a.points - b.points;
 
})
.slice(0, 3);
 
document.getElementById(
"dressTracker"
).innerHTML =
sacko.map(
(t, i) =>
`<div class="team">
${i + 1}. ${t.team}
</div>`
).join("");
 
document.getElementById(
"news"
).innerHTML =
`
Current league leader:
<strong>${teams[0].team}</strong>
<br><br>
Current Sacko favorite:
<strong>${sacko[0].team}</strong>
`;
 
}
catch (error) {
 
console.error(error);
 
document.getElementById(
"standings"
).innerHTML =
"Unable to load Sleeper data.";
 
}
 
}
 
loadLeague();
