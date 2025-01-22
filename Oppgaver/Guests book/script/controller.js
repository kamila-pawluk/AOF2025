//controller.js
function addGuest() {
    const nameInput = document.getElementById('name');
    const messageInput = document.getElementById('message');
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();
    const date = new Date().toLocaleDateString();

    const newGuest = {
        id: Date.now(),
        name: name,
        message: message,
        date: date,
        editMode: false
    };
   
    let savedGuests = JSON.parse(localStorage.getItem('guestsTest')) || [];
    console.log("Is Array:", Array.isArray(savedGuests));

    savedGuests.push(newGuest);
    localStorage.setItem('guestsTest',JSON.stringify(savedGuests));

    document.getElementById('name').value = '';
    document.getElementById('message').value = '';

    alert('Thank you for signing our guest book!');
}

function getGuestsFromLocalStorage(){
    return JSON.parse(localStorage.getItem('guestsTest')) || [];
}

function findByMessage(){
}

function removeGuest(){
    var guestsArray = getGuestsFromLocalStorage();
}

document.addEventListener('DOMContentLoaded', (event) => {
    updateView();
});