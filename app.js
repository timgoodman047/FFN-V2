const LEAGUE_ID = "1352723400459563008";
 
async function loadLeague() {
 
try {
 
const users = await fetch(
`https://api.sleeper.app/v1/league/${LEAGUE_ID}/users`
).then(r => r.json());
 
const rosters = await fetch(
`https://api.sleeper.app/v1/league/${LEAGUE_ID}/rosters`
).then(r => r.json());
 
const league = await fetch(
`https://api.sleeper.app/v1/league/${LEAGUE_ID}`
).then(r => r.json());
 
const currentWeek =
league.settings?.leg || 1;
 
const matchups = await fetch(
`https://api.sleeper.app/v1/league/${LEAGUE_ID}/matchups/${currentWeek}`
).then(r => r.json());
 
const teams = rosters.map(roster => {
 
const owner = users.find(
user => user.user_id === roster.owner_id
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
 
// Standings
 
teams.sort((a,b)=>{
 
if(b.wins !== a.wins)
return b.wins-a.wins;
 
return b.pf-a.pf;
 
});
 
document.getElementById("standings").innerHTML =
teams.map((team,index)=>`
<div class="team">
#${index+1}
${team.team}
<br>
${team.wins}-${team.losses}
</div>
`).join("");
 
// Rankings
 
document.getElementById("powerRankings").innerHTML =
teams.map((team,index)=>`
<div class="team">
#${index+1}
${team.team}
</div>
`).join("");
 
// Dress Tracker
 
const sacko =
[...teams]
.sort((a,b)=>{
 
if(a.wins !== b.wins)
return a.wins-b.wins;
 
return a.pf-b.pf;
 
})
.slice(0,3);
 
document.getElementById("dressTracker").innerHTML =
sacko.map((team,index)=>`
<div class="team">
${index+1}. ${team.team}
</div>
`).join("");
 
// Owners
 
document.getElementById("owners").innerHTML =
teams.map(team => `
<div class="team">
${team.owner}
<br>
<strong>${team.team}</strong>
</div>
`).join("");
 
// Weekly Matchups
 
const matchupGroups = {};
 
matchups.forEach(m => {
 
if(!matchupGroups[m.matchup_id]){
 
matchupGroups[m.matchup_id] = [];
 
}
 
matchupGroups[m.matchup_id].push(m);
 
});
 
const matchupHTML = [];
 
Object.values(matchupGroups).forEach(group => {
 
if(group.length === 2){
 
const teamA = teams.find(
t=>t.rosterId===group[0].roster_id
);
 
const teamB = teams.find(
t=>t.rosterId===group[1].roster_id
);
 
matchupHTML.push(`
<div class="matchup">
 
<strong>${teamA?.team}</strong>
 
vs
 
<strong>${teamB?.team}</strong>
 
</div>
`);
 
}
 
});
 
document.getElementById("matchups").innerHTML =
matchupHTML.join("");
 
// News
 
document.getElementById("news").innerHTML = `
<strong>League Leader:</strong>
${teams[0].team}
<br><br>
 
<strong>Dress Tracker Favorite:</strong>
${sacko[0].team}
<br><br>
 
Current standings, rankings, and matchups are updating directly from Sleeper.
`;
 
}
catch(error){
 
console.error(error);
 
document.getElementById("standings").innerHTML =
"Error loading data.";
 
}
 
}
 
loadLeague();
