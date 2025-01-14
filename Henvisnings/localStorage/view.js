function updateView(){
    app.innerHTML = /*HTML*/`
    <h1>Clicker</h1>
    <h2>${clickerCount}</h2>
    <button onclick="clickerCounter()">Pet me</button>
    <button onclick="printUsers()">Print users</button>
    <div id="printDiv"> </div>
    `;
}

function printUsers(){
    listOfUsers = localStorage.getItem("users");

    listOfUsers = JSON.parse(listOfUsers);

    let html = "";
    for(user of listOfUsers){
        html += /*HTML*/ `
        <div> ${user.username} </div>
        <div> ${user.password} </div>`
    }
    document.getElementById('printDiv').innerHTML = html;
}