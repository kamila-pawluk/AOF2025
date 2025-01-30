function updateView(){
    let page = model.app.currentPage;

    if(page == "mainPage"){
        mainPageView();
    } else if(page == "aboutUsPage"){
        aboutUsPageView();
    } else if(page == "activitiesPage"){
        activitiesPageView();
    } else if(page == "bookingPage"){
        bookingPageView();
    } else if(page == "resourcesPage"){
        resourcesPageView();
    } else if(page == "contactPage"){
        contactPageView();
    }
}