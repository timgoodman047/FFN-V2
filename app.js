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
 
// LEAGUE INFO
 
const leagueResponse =
await fetch(
`https://api.sleeper.app/v1/league/${LEAGUE_ID}`
);
 
const league =
await leagueResponse.json();
 
const currentWeek =
league.settings?.leg || 1;
 
// MATCHUPS
 
const matchupsResponse =
await fetch(
`https://api.sleeper.app/v1/league/${LEAGUE_ID}/matchups/${currentWeek}`
);
 
const matchupData =
await matchupsResponse.json();
 
// BUILD TEAM OBJECTS
 
const teams = rosters.map(roster => {
 
const owner =
users.find(
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
Number(roster.settings?.fpts || 0) +
(
Number(
roster.settings?.fpts_decimal || 0
) / 100
)
 
};
 
});
 
// =====================================
// STANDINGS
// Top 5 = Record
// Bottom 5 = Points For
// =====================================
 
const topFive =
[...teams]
.sort((a, b) => {
 
if (b.wins !== a.wins) {
return b.wins - a.wins;
}
 
return b.pf - a.pf;
 
})
.slice(0, 5);
 
const bottomFive =
[...teams]
.filter(
team =>
!topFive.some(
t => t.team === team.team
)
)
.sort(
(a, b) => b.pf - a.pf
);
 
const standings =
[
...topFive,
...bottomFive
];
 
document.getElementById("standings").innerHTML =
standings.map((team, index) => `
<div class="team">
#${index + 1}
<br>
<strong>${team.team}</strong>
<br>
Record: ${team.wins}-${team.losses}
<br>
PF: ${team.pf.toFixed(2)}
</div>
`).join("");
 
// =====================================
// POWER RANKINGS
// =====================================
 
document.getElementById(
"powerRankings"
).innerHTML =
standings.map((team, index) => `
<div class="team">
#${index + 1}
${team.team}
</div>
`).join("");
 
// =====================================
// DRESS TRACKER
// Lowest PF
// =====================================
 
const sacko =
[...teams]
.sort(
(a, b) =>
a.pf - b.pf
)
.slice(0, 3);
 
document.getElementById(
"dressTracker"
).innerHTML =
sacko.map((team, index) => `
<div class="team">
${index + 1}. ${team.team}
<br>
PF:
${team.pf.toFixed(2)}
</div>
`).join("");
 
// =====================================
// OWNERS
// =====================================
 
const ownersElement =
document.getElementById(
"owners"
);
 
if (ownersElement) {
 
ownersElement.innerHTML =
standings.map(team => `
<div class="team">
${team.owner}
<br>
<strong>
${team.team}
</strong>
</div>
`).join("");
 
}
 
// =====================================
// WEEKLY MATCHUPS
// WITH PROJECTIONS
// =====================================
 
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
 
if (group.length === 2) {
 
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
 
if (!teamA || !teamB) return;
 
const projA =
(
teamA.pf /
Math.max(
teamA.wins +
teamA.losses,
1
)
).toFixed(1);
 
const projB =
(
teamB.pf /
Math.max(
teamB.wins +
teamB.losses,
1
)
).toFixed(1);
 
const total =
Number(projA) +
Number(projB);
 
const winA =
(
Number(projA) /
total *
100
).toFixed(0);
 
const winB =
(
Number(projB) /
total *
100
).toFixed(0);
 
const favorite =
Number(projA) >
Number(projB)
? teamA.team
: teamB.team;
 
matchupHTML +=
`
<div class="matchup">
 
<strong>
${teamA.team}
</strong>
 
<br>
 
Projection:
${projA}
 
<br>
 
Win %:
${winA}%
 
<hr>
 
VS
 
<hr>
 
<strong>
${teamB.team}
</strong>
 
<br>
 
Projection:
${projB}
 
<br>
 
Win %:
${winB}%
 
<hr>
 
Favorite:
<strong>
${favorite}
</strong>
 
</div>
`;
 
}
 
});
 
const matchupElement =
document.getElementById("matchups");
 
if (matchupElement) {
 
matchupElement.innerHTML =
matchupHTML;
 
}
 
// =====================================
// NEWS NETWORK
// =====================================
 
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
 
Weekly matchups and projections
are now live.
 
<br><br>
 
Current #1 team:
${standings[0].team}
continued to set the pace for
the league.
`;
 
}
catch (error) {
 
console.error(error);
 
document.getElementById(
"news"
).innerHTML =
"Error loading Sleeper data.";
 
}
 
}
 
loadLeague();
