function clickerCounter(){
    localStorage.setItem("clicks", ++clickerCount);

    localStorage.setItem("users", JSON.stringify(users));
    updateView();
}