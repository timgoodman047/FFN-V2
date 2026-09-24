const LEAGUE_ID = "1352723400459563008";
 
async function loadLeague() {
 
try {
 
// USERS
 
const usersResponse =
await fetch(
`https://api.sleeper.app/v1/league/${LEAGUE_ID}/users`
);
 
const users =
await usersResponse.json();
 
// ROSTERS
 
const rostersResponse =
await fetch(
`https://api.sleeper.app/v1/league/${LEAGUE_ID}/rosters`
);
 
const rosters =
await rostersResponse.json();
 
// BUILD TEAMS
 
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
Number(roster.settings?.fpts || 0) +
(
Number(
roster.settings?.fpts_decimal || 0
) / 100
)
 
};
 
});
 
console.log("Teams", teams);
 
// STANDINGS
 
const topFive =
[...teams]
.sort((a,b)=>{
 
if (b.wins !== a.wins) {
 
return b.wins - a.wins;
 
}
 
return b.pf - a.pf;
 
})
.slice(0,5);
 
const bottomFive =
[...teams]
.filter(
team =>
!topFive.some(
t => t.team === team.team
)
)
.sort(
(a,b)=>b.pf-a.pf
);
 
const standings =
[
...topFive,
...bottomFive
];
 
// STANDINGS CARD
 
document.getElementById("standings")
.innerHTML =
standings.map(
(team,index)=>`
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
 
// POWER RANKINGS
 
document.getElementById(
"powerRankings"
).innerHTML =
standings.map(
(team,index)=>`
<div class="team">
 
#${index+1}
 
${team.team}
 
</div>
`
).join("");
 
// DRESS TRACKER
 
const sacko =
[...teams]
.sort(
(a,b)=>a.pf-b.pf
)
.slice(0,3);
 
document.getElementById(
"dressTracker"
).innerHTML =
sacko.map(
(team,index)=>`
<div class="team">
 
${index+1}.
 
${team.team}
 
<br>
 
PF:
${team.pf.toFixed(2)}
 
</div>
`
).join("");
 
// OWNERS
 
const ownersElement =
document.getElementById("owners");
 
if(ownersElement){
 
ownersElement.innerHTML =
standings.map(
team=>`
<div class="team">
 
${team.owner}
 
<br>
 
<strong>
${team.team}
</strong>
 
</div>
`
).join("");
 
}
 
// MATCHUPS PLACEHOLDER
 
const matchupsElement =
document.getElementById(
"matchups"
);
 
if(matchupsElement){
 
matchupsElement.innerHTML =
`
<div class="team">
Weekly Matchup Center
Coming Next Phase
</div>
`;
}
 
// NEWS
 
document.getElementById("news")
.innerHTML =
`
<strong>
Current Leader:
</strong>
 
${standings[0].team}
 
<br><br>
 
<strong>
Dress Tracker Favorite:
</strong>
 
${sacko[0].team}
 
<br><br>
 
Live standings successfully loaded from Sleeper.
`;
 
}
catch(error){
 
console.error(error);
 
document.getElementById("news")
.innerHTML =
"Error loading league.";
 
}
 
}
 
loadLeague();
