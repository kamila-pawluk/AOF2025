 function updateView(page){
    model.app.currentPage = page;
   

    switch(page){
        case 'MainPage': {
             mainPageView();
             break;
        }
        case 'AboutPage': {
             aboutPageView();
             break;
        }
        case 'BookingPage': {
            //  bookingPageView();
             break;
        }
        case 'ContactPage': {
            //  contactPageView();
             break;
        }
        case 'FacebookFeedPage': {
            //  facebookFeedPageView();
             break;
        }
        case 'NewsFeedPage': {
            //  newsFeedPageView();
             break;
        }
        case 'ResourcePage': {
            //  resourcePageView();
             break;
        }
        case 'ServicesAndActivityPage': {
            //  serviceAndActivityPageView();
             break;
            
        } default:
        return "Failed to load page";
             
    
 }
}