const LEAGUE_ID = "1352723400459563008";
 
async function loadLeague() {
 
try {
 
const usersResponse = await fetch(
"https://api.sleeper.app/v1/league/" + LEAGUE_ID + "/users"
);
 
const rostersResponse = await fetch(
"https://api.sleeper.app/v1/league/" + LEAGUE_ID + "/rosters"
);
 
const users = await usersResponse.json();
const rosters = await rostersResponse.json();
 
let teams = rosters.map(roster => {
 
const owner =
users.find(
u => u.user_id === roster.owner_id
);
 
return {
 
rosterId:
roster.roster_id,
 
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
 
// TOP 5 = RECORD
 
const topFive = [...teams]
.sort((a, b) => {
 
if (b.wins !== a.wins) {
return b.wins - a.wins;
}
 
return b.pf - a.pf;
})
.slice(0, 5);
 
// BOTTOM 5 = POINTS FOR
 
const bottomFive = [...teams]
.filter(
team =>
!topFive.some(
t => t.team === team.team
)
)
.sort((a, b) => b.pf - a.pf);
 
const finalStandings = [
...topFive,
...bottomFive
];
 
document.getElementById("standings").innerHTML =
finalStandings.map((team, index) => `
<div class="team">
#${index + 1}
<strong>${team.team}</strong>
<br>
Record: ${team.wins}-${team.losses}
<br>
PF: ${team.pf.toFixed(2)}
</div>
`).join("");
 
document.getElementById("powerRankings").innerHTML =
finalStandings.map((team, index) => `
<div class="team">
#${index + 1} ${team.team}
</div>
`).join("");
 
const sacko =
[...teams]
.sort((a, b) => a.pf - b.pf)
.slice(0, 3);
 
document.getElementById("dressTracker").innerHTML =
sacko.map((team, index) => `
<div class="team">
${index + 1}. ${team.team}
<br>
PF: ${team.pf.toFixed(2)}
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
 
document.getElementById("matchups").innerHTML =
`
<div class="matchup">
Weekly Matchup Integration Coming Next
</div>
`;
 
document.getElementById("news").innerHTML =
`
<strong>League Leader:</strong>
${finalStandings[0].team}
<br><br>
 
<strong>Dress Tracker Favorite:</strong>
${sacko[0].team}
<br><br>
 
Standings are live. Bottom five teams are ranked by Points For per league rules.
`;
 
}
catch (error) {
 
console.error(error);
 
document.getElementById("news").innerHTML =
"Unable to load Sleeper data.";
 
}
 
}
 
loadLeague();
`
loadLeague();
