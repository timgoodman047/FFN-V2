const LEAGUE_ID = "1352723400459563008";
 
async function loadStandings() {
 
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
owner?.display_name,
 
wins:
roster.settings.wins,
 
losses:
roster.settings.losses,
 
pf:
roster.settings.fpts || 0
};
 
});
 
teams.sort((a,b)=>{
 
if(b.wins !== a.wins)
return b.wins-a.wins;
 
return b.pf-a.pf;
 
});
 
document.getElementById("standings").innerHTML =
teams.map((team,index)=>
`
<div class="team">
#${index+1}
${team.team}
(${team.wins}-${team.losses})
</div>
`
).join("");
 
}
 
loadStandings();
