const LEAGUE_ID = "1352723400459563008";
 
async function loadLeague() {
 
const users = await fetch(
`https://api.sleeper.app/v1/league/${LEAGUE_ID}/users`
).then(r => r.json());
 
const rosters = await fetch(
`https://api.sleeper.app/v1/league/${LEAGUE_ID}/rosters`
).then(r => r.json());
 
let teams = rosters.map(roster => {
 
const owner = users.find(
u => u.user_id === roster.owner_id
);
 
return {
team:
owner?.metadata?.team_name ||
owner?.display_name ||
"Unknown",
 
wins: roster.settings.wins,
losses: roster.settings.losses,
pf: roster.settings.fpts || 0
};
});
 
teams.sort((a,b)=>{
 
if(b.wins !== a.wins){
return b.wins-a.wins;
}
 
return b.pf-a.pf;
 
});
 
document.getElementById("standings").innerHTML =
teams.map((t,i)=>`
<div class="team">
#${i+1} ${t.team}
(${t.wins}-${t.losses})
</div>
`).join("");
 
document.getElementById("powerRankings").innerHTML =
teams.map((t,i)=>`
<div class="team">
#${i+1} ${t.team}
</div>
`).join("");
 
}
 
loadLeague();
