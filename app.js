console.log("app.js loaded");
 
async function testSleeper() {
 
try {
 
const response = await fetch(
"https://api.sleeper.app/v1/league/1352723400459563008/users"
);
 
const users = await response.json();
 
console.log(users);
 
document.getElementById("standings").innerHTML =
`<div class="team">
✅ Sleeper API Connected
<br>
Users Found: ${users.length}
</div>`;
 
} catch (error) {
 
console.error(error);
 
document.getElementById("standings").innerHTML =
`<div class="team">
❌ API Error
</div>`;
 
}
 
}
 
testSleeper();
