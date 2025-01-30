function mainPageView(){
    app.innerHTML = /*HTML*/`
    
    <main> 
    <section class="hero">
        <h1>Velkommen til HUB-Phønix</h1>
        <p> some text</p>
    </section>
</main>

<div class="presentation">
 <div class="pictureDiv">
    <img src="./Assets/building HUB Phonix.png" alt="building of HUB Phønix" class="pictureOfBuilding">
 </div>
 <div class="textDiv">
    <h2>Vision and purpose</h2>
    <article>Text about vision and purpose of HUB Phonix</article>
 </div>
</div>    

<div class="partnersDiv">
    <h3>Our partners:</h3>
    <div class="partners1">
        <div id="partnersChild1">
        <img src="" alt="Visit Fredrikstad&Hvaler Logo">
        Visit Fredrikstad&Hvaler
        </div>    
        <div id="partnersChild2">
        <img src="" alt="AOF Østfold Logo">
        AOF Østfold
        </div>     
    </div>  
    <div class="partners2">
        <div id="partnersChild3">
        <img src="" alt="Håpets Katedral Logo">
        Håpets Katedral
        </div>    
        <div id="partnersChild4">
        <img src="" alt="IDG Fredrikstad Community Hub Logo">
        IDG Fredrikstad Community Hub
        </div>     
    </div> 
    <button>Find out more about our partners</button> 
</div> `;

model.app.currentPage = "mainPage";
updateView();
}