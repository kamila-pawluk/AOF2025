//view.js
function updateView(){
    const startPage = document.getElementById("startPage");
    if (startPage) {
        startPage.style.display = "none";
    }
    app.innerHTML = "";

    app.innerHTML = /*HTML*/`
     <h1 style="margin-left: 45%;">Quiz</h1>
        <div id="question-container" class="questionContainer">
            <output id="questionOutput"></output>
        </div>
        <div class="timerDiv">
          <p> Timer: <output id="timer"></output> </p>  </div>

        <div id="answersContainer" class="answersContainer">
            <table>
                <tr>
                    <td>
                        <input type="radio" name="answer" id="answer1">
                    </td>
                    <td>
                        <label for="answer">Answer 1</label>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="radio" name="answer" id="answer2">
                    </td>
                    <td>
                        <label for="answer">Answer 2</label>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="radio" name="answer" id="answer3">
                    </td>
                    <td>
                        <label for="answer">Answer 3</label>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="radio" name="answer" id="answer4">
                    </td>
                    <td>
                        <label for="answer4">Answer 4</label>
                    </td>
                </tr>
            </table> 
            
        </div><br/>

        <div>
            <button id="submit-button" class="submitButton">Submit</button>
            <button id="next-button" class="submitButton" style="opacity: 1">Next question</button>
        </div> <br/>

        <div id="result-container" class="answerCorrectness">
        </div>
    `;
    startQuiz();
}