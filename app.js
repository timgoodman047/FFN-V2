const LEAGUE_ID = "1352723400459563008";
 
async function loadLeague() {
 
try {
 
const usersResponse = await fetch(
`https://api.sleeper.app/v1/league/${LEAGUE_ID}/users`
);
 
const rostersResponse = await fetch(
`https://api.sleeper.app/v1/league/${LEAGUE_ID}/rosters`
);
 
const leagueResponse = await fetch(
`https://api.sleeper.app/v1/league/${LEAGUE_ID}`
);
 
const users = await usersResponse.json();
const rosters = await rostersResponse.json();
const league = await leagueResponse.json();
 
const currentWeek =
league.settings?.leg || 1;
 
const matchupsResponse = await fetch(
`https://api.sleeper.app/v1/league/${LEAGUE_ID}/matchups/${currentWeek}`
);
 
const matchupData =
await matchupsResponse.json();
 
const teams = rosters.map(roster => {
 
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
(
(roster.settings?.fpts_decimal || 0)
/ 100
)
 
};
 
});
 
// -----------------------
// STANDINGS
// -----------------------
 
const topFive =
[...teams]
.sort((a,b)=>{
 
if(b.wins !== a.wins){
return b.wins - a.wins;
}
 
return b.pf - a.pf;
 
})
.slice(0,5);
 
const bottomFive =
[...teams]
.filter(team =>
!topFive.some(
t => t.team === team.team
)
)
.sort((a,b)=>b.pf-a.pf);
 
const standings =
[
...topFive,
...bottomFive
];
 
document.getElementById("standings")
.innerHTML =
standings.map((team,index)=>`
<div class="team">
 
#${index+1}
 
<br>
 
<strong>
${team.team}
</strong>
 
<br>
 
${team.wins}-${team.losses}
 
<br>
 
PF:
${team.pf.toFixed(2)}
 
</div>
`).join("");
 
// -----------------------
// POWER RANKINGS
// -----------------------
 
document.getElementById(
"powerRankings"
).innerHTML =
standings.map((team,index)=>`
<div class="team">
 
#${index+1}
 
${team.team}
 
</div>
`).join("");
 
// -----------------------
// DRESS TRACKER
// -----------------------
 
const sacko =
[...teams]
.sort(
(a,b)=>a.pf-b.pf
)
.slice(0,3);
 
document.getElementById(
"dressTracker"
).innerHTML =
sacko.map((team,index)=>`
<div class="team">
 
${index+1}. ${team.team}
 
<br>
 
PF:
${team.pf.toFixed(2)}
 
</div>
`).join("");
 
// -----------------------
// OWNERS
// -----------------------
 
document.getElementById("owners")
.innerHTML =
teams.map(team => `
<div class="team">
 
${team.owner}
 
<br>
 
<strong>
${team.team}
</strong>
 
</div>
`).join("");
 
// -----------------------
// WEEKLY MATCHUPS
// -----------------------
 
const matchupGroups = {};
 
matchupData.forEach(matchup => {
 
if (!matchupGroups[matchup.matchup_id]) {
 
matchupGroups[
matchup.matchup_id
] = [];
 
}
 
matchupGroups[
matchup.matchup_id
].push(matchup);
 
});
 
let matchupHTML = "";
 
Object.values(matchupGroups)
.forEach(group => {
 
if(group.length === 2){
 
const teamA =
teams.find(
t =>
t.rosterId ===
group[0].roster_id
);
 
const teamB =
teams.find(
t =>
t.rosterId ===
group[1].roster_id
);
 
matchupHTML +=
 
`
<div class="matchup">
 
<strong>
${teamA?.team || "TBD"}
</strong>
 
<br>
 
vs
 
<br>
 
<strong>
${teamB?.team || "TBD"}
</strong>
 
</div>
`;
 
}
 
});
 
document.getElementById(
"matchups"
).innerHTML =
matchupHTML;
 
// -----------------------
// NEWS
// -----------------------
 
document.getElementById("news")
.innerHTML =
`
<strong>
League Leader:
</strong>
 
${standings[0].team}
 
<br><br>
 
<strong>
Dress Tracker Favorite:
</strong>
 
${sacko[0].team}
 
<br><br>
 
Weekly matchup center is now live.
`;
 
}
catch(error){
 
console.error(error);
 
document.getElementById("news")
.innerHTML =
"Error loading league data.";
 
}
 
}
 
loadLeague();
loadLeague();
