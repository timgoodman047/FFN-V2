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
rosterId: roster.roster_id,
 
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
 
// TOP 5 BY RECORD
 
const topFive =
[...teams]
.sort((a,b)=>{
 
if(b.wins !== a.wins){
return b.wins - a.wins;
}
 
return b.pf - a.pf;
 
})
.slice(0,5);
 
// BOTTOM 5 BY PF
 
const bottomFive =
[...teams]
.filter(team =>
!topFive.some(
t => t.team === team.team
)
)
.sort(
(a,b)=>b.pf-a.pf
);
 
const standings = [
...topFive,
...bottomFive
];
 
document.getElementById(
"standings"
).innerHTML =
standings.map((team,index)=>`
<div class="team">
#${index+1}
<br>
<strong>${team.team}</strong>
<br>
${team.wins}-${team.losses}
<br>
PF ${team.pf.toFixed(2)}
</div>
`).join("");
 
document.getElementById(
"powerRankings"
).innerHTML =
standings.map((team,index)=>`
<div class="team">
#${index+1}
${team.team}
</div>
`).join("");
 
const sacko =
[...teams]
.sort((a,b)=>a.pf-b.pf)
.slice(0,3);
 
document.getElementById(
"dressTracker"
).innerHTML =
sacko.map((team,index)=>`
<div class="team">
${index+1}. ${team.team}
<br>
PF ${team.pf.toFixed(2)}
</div>
`).join("");
 
document.getElementById(
"owners"
).innerHTML =
standings.map(team=>`
<div class="team">
${team.owner}
<br>
<strong>${team.team}</strong>
</div>
`).join("");
 
// Temporary projections
 
const projections = standings.slice(0,6);
 
let matchupHTML = "";
 
for(let i = 0; i < projections.length; i += 2){
 
const teamA = projections[i];
const teamB = projections[i+1];
 
if(!teamA || !teamB) continue;
 
const projA =
(
teamA.pf /
Math.max(
teamA.wins + teamA.losses,
1
)
).toFixed(1);
 
const projB =
(
teamB.pf /
Math.max(
teamB.wins + teamB.losses,
1
)
).toFixed(1);
 
const total =
Number(projA) +
Number(projB);
 
const winA =
(
Number(projA) / total * 100
).toFixed(0);
 
const winB =
(
Number(projB) / total * 100
).toFixed(0);
 
matchupHTML += `
<div class="matchup">
 
<strong>${teamA.team}</strong>
 
<br>
 
Projection:
${projA}
 
<br>
 
Win %:
${winA}%
 
<hr>
 
VS
 
<hr>
 
<strong>${teamB.team}</strong>
 
<br>
 
Projection:
${projB}
 
<br>
 
Win %:
${winB}%
 
</div>
`;
}
 
document.getElementById(
"matchups"
).innerHTML =
matchupHTML;
 
document.getElementById(
"news"
).innerHTML =
`
<strong>League Leader:</strong>
${standings[0].team}
 
<br><br>
 
<strong>Dress Tracker Favorite:</strong>
${sacko[0].team}
 
<br><br>
 
Weekly projections are now active.
`;
 
}
catch(error){
 
console.error(error);
 
document.getElementById(
"news"
).innerHTML =
"Unable to load league data.";
 
}
 
}
 
loadLeague();
loadLeague();
