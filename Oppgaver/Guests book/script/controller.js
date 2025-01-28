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


function editMessage(guestsId){
    let guestList = getGuestsFromLocalStorage();
    console.log("Edit message function: ", guestList)
    var guestIndex = guestList.findIndex(guest => guest.id === guestsId);
    guestList[guestIndex].editMode = true;
    localStorage.setItem('guestsTest', JSON.stringify(guestList));
    console.log("Edit mode changed for guest with id: ", guestIndex);
    updateView();
}


function updateChanges(guestsId){
    const inputUpdatedMessage = document.getElementById('editMessageWithInput');
    console.log("Input updated message: ", inputUpdatedMessage.value);
    let savedGuests = getGuestsFromLocalStorage();
    const guestIndex = savedGuests.findIndex(guest => guest.id === guestsId);
    console.log("guestsIndex: ", guestIndex);
    savedGuests[guestIndex].message = inputUpdatedMessage.value;
    console.log("saved guests: ", savedGuests);
    savedGuests[guestIndex].editMode = false;
    localStorage.setItem('guestsTest', JSON.stringify(savedGuests));
    updateView();
}

function findByMessage(){
    var searchInputValue = document.getElementById('search').value;
    console.log("Search input value: ", searchInputValue);

    let savedGuests = getGuestsFromLocalStorage();
    console.log("Saved guests: ", savedGuests);

    const searchResult = savedGuests.filter(guest => guest.message.toLowerCase().includes(searchInputValue.toLowerCase()));
    console.log("Search result: ", searchResult);

    updateView(searchResult);

    // let showMessageDiv = document.getElementById('messages');
    //     updateView();
    // showMessageDiv.innerHTML = '';

    // searchResult.forEach(entry => {
    //     const searchResult = createHTMLRow(entry);
    //    showMessageDiv.innerHTML += `${searchResult}`;
    // });
    // let createCancelButton = document.createElement('button');
    // createCancelButton.innerHTML = "Cancel search";
    // createCancelButton.addEventListener('click', function(){
    //     searchInputValue = '';
    // })
    
}

function removeGuestsEntry(guestId){
        console.log("Remove entry");
        let savedGuests = getGuestsFromLocalStorage();
        console.log("Saved guests: ", savedGuests);
        const guestIndex = savedGuests.findIndex(guest => guest.id === guestId);
        savedGuests.splice(guestIndex, 1);
        console.log("Saved guests after splice: ", savedGuests);
        localStorage.setItem('guestsTest', JSON.stringify(savedGuests));
        updateView();
}

document.addEventListener('DOMContentLoaded', (event) => {
    updateView();
});