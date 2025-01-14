function decodeHtmlEntities(text) {
  const tempElement = document.createElement('textarea');
  tempElement.innerHTML = text;
  return tempElement.value;
}

async function initializeApp() {
  displayLoadingState();
  try {
    await fetchQuizData();
    displayStartState();
  } catch (error) {
    displayErrorState(error);
  }
}

function displayLoadingState() {
  const loadingPage = document.getElementById("loadingPage");
  const startPage = document.getElementById("startPage");
  loadingPage.style.display = "block";
  startPage.style.display = "none";
}

async function fetchQuizData() {
  await GetData();
}

function displayStartState() {
  const loadingPage = document.getElementById("loadingPage");
  const startPage = document.getElementById("startPage");
  loadingPage.style.display = "none";
  startPage.style.display = "block";
}

function displayErrorState(error) {
  console.error('An error occurred while fetching the data:', error);
  const loadingPage = document.getElementById("loadingPage");
  const startPage = document.getElementById("startPage");
  loadingPage.textContent = "An error occurred while fetching the data. Please try again later.";
  startPage.style.display = "block";
}

function displayQuestion(questionData, questionIndex) {
  const questionContainer = document.getElementById("question-container");
  if (!questionContainer) {
    console.error("Couldn't find element question-container.");
    return;
  }
  questionContainer.innerHTML = "";
  const questionText = createQuestionElement(questionData, questionIndex);
  questionContainer.appendChild(questionText);
  displayAnswers(questionData);
}

function createQuestionElement(questionData, questionIndex) {
  const questionText = document.createElement("h2");
  questionText.textContent = `Question ${questionIndex + 1}: ${decodeHtmlEntities(questionData.question)}`;
  return questionText;
}

function displayAnswers(questionData) {
  const answersContainer = document.getElementById("answersContainer");
  if (!answersContainer) {
    console.error("Couldn't find element answersContainer.");
    return;
  }
  answersContainer.innerHTML = "";
  const allAnswers = shuffleAnswers(questionData);
  createAnswerElements(allAnswers, answersContainer, questionData.correct_answer);
}

function shuffleAnswers(questionData) {
  const allAnswers = [...questionData.incorrect_answers, questionData.correct_answer];
  return allAnswers.sort(() => Math.random() - 0.5);
}

function createAnswerElements(allAnswers, container, correctAnswer) {
  allAnswers.forEach((answer, index) => {
    const answerDiv = createAnswerDiv(answer, index);
    container.appendChild(answerDiv);
  });
  setupSubmitButton(correctAnswer);
}

function createAnswerDiv(answer, index) {
  const answerDiv = document.createElement("div");
  const radioButton = createRadioButton(answer, index);
  const label = createLabel(answer, index);
  answerDiv.appendChild(radioButton);
  answerDiv.appendChild(label);
  return answerDiv;
}

function createRadioButton(answer, index) {
  const radioButton = document.createElement("input");
  radioButton.type = "radio";
  radioButton.name = "answer";
  radioButton.value = answer;
  radioButton.id = `answer${index + 1}`;
  return radioButton;
}

function createLabel(answer, index) {
  const label = document.createElement("label");
  label.textContent = decodeHtmlEntities(answer);
  label.setAttribute('for', `answer${index + 1}`);
  return label;
}

let points = 0;

function setupSubmitButton(correctAnswer) {
  const submit = document.getElementById("submit-button");
  if (submit) {
    submit.onclick = () => handleSubmission(correctAnswer);
  }
}

function handleSubmission(correctAnswer) {
  const selectedAnswer = document.querySelector('input[name="answer"]:checked');
  if (!selectedAnswer) {
    alert("Please select an answer.");
    return;
  }
  checkAnswer(selectedAnswer.value, correctAnswer);
  stopWorker();
}

function checkAnswer(selectedAnswer, correctAnswer) {
  const resultContainer = document.getElementById("result-container");
  if (!resultContainer) return;
  resultContainer.innerHTML = "";
  const resultText = createResultText(selectedAnswer === correctAnswer, correctAnswer);
  resultContainer.appendChild(resultText);
}

function createResultText(isCorrect, correctAnswer) {
  const resultText = document.createElement("p");
  if (isCorrect) {
    resultText.textContent = "Correct answer!";
    resultText.style.color = "green";
    points++;
  } else {
    resultText.textContent = `Wrong answer. Correct answer is: ${correctAnswer}`;
    resultText.style.color = "red";
  }
  return resultText;
}

async function startQuiz() {
  hideStartButton();
  startWorker();
  try {
    const questions = await loadQuestions();
    if (!questions) return;
    initializeQuiz(questions);
  } catch (error) {
    handleQuizError(error);
  }
}

function hideStartButton() {
  document.getElementById("startButton").style.display = "none";
}

async function loadQuestions() {
  const data = JSON.parse(localStorage.getItem('quizData'));
  if (!data?.results?.length) {
    alert('An error occurred while fetching the data. Please try again later.');
    return null;
  }
  return data.results;
}

function initializeQuiz(questions) {
  let currentQuestionIndex = 0;
  displayQuestion(questions[currentQuestionIndex], currentQuestionIndex);
  setupNextButton(questions, currentQuestionIndex);
}

function setupNextButton(questions, currentQuestionIndex) {
  const nextButton = document.getElementById("next-button");
  const resultContainer = document.getElementById("result-container");
  nextButton.style.display = "block";
  nextButton.onclick = () => handleNextQuestion(questions, ++currentQuestionIndex, resultContainer);
}

function handleNextQuestion(questions, index, resultContainer) {
  if (index < questions.length) {
    displayQuestion(questions[index], index);
    resultContainer.innerHTML = "";
    startWorker();
  } else {
    endQuiz();
  }
}

function endQuiz() {
  alert(`End of quiz! You got ${points} points!`);
  points = 0;
  window.location.reload();
}

function handleQuizError(error) {
  console.error('An error occurred while fetching the data:', error);
  alert('An error occurred while fetching the data. Please try again later.');
}

document.addEventListener("DOMContentLoaded", initializeApp);



// function displayQuestion(questionData, questionIndex) {
//     const questionContainer = document.getElementById("question-container");
//     if (!questionContainer) {
//         console.error("Couldn't find element question-container.");
//         return;
//       }
//     questionContainer.innerHTML = "";
  
//     const questionText = document.createElement("h2");
//     questionText.textContent = `Question ${questionIndex + 1}:
//      ${decodeHtmlEntities(questionData.question)}`;
//     questionContainer.appendChild(questionText);
//     displayAnswers(questionData);
// }

// function displayAnswers(questionData){
//     const answersContainer = document.getElementById("answersContainer");
//     if (!answersContainer) {
//     console.error("Couldn't find element answersContainer.");
//     return;
//     }
//     answersContainer.innerHTML = "";

//     const allAnswers = [...questionData.incorrect_answers, questionData.correct_answer];
//     allAnswers.sort(() => Math.random() - 0.5);

//     allAnswers.forEach((answer, index) => {
//         const answerDiv = document.createElement("div");

//         const radioButton = document.createElement("input");
//         radioButton.type = "radio";
//         radioButton.name = "answer";
//         radioButton.value = answer; 
//         radioButton.id = `answer${index + 1}`;
        
//         const label = document.createElement("label");
//         label.textContent = decodeHtmlEntities(answer); 
//         label.setAttribute('for', `answer${index + 1}`); 

//         answerDiv.appendChild(radioButton);
//         answerDiv.appendChild(label);
//         answersContainer.appendChild(answerDiv);

//         const submit = document.getElementById("submit-button");
//         if(submit){
//            submit.onclick = function(){
//             const selectedAnswer = document.querySelector('input[name="answer"]:checked');
//             if (!selectedAnswer) {
//                 alert("Please select an answer.");
//                 return;
//             }
//             checkAnswer(selectedAnswer.value, questionData.correct_answer);
//             stopWorker();
//         }
//         }
//     });
// }
  

//     let points = 0;

// function checkAnswer(selectedAnswer, correctAnswer) {
//     const resultContainer = document.getElementById("result-container");
//     if (!resultContainer) {
//         console.error("Couldn't find element result-container.");
//         return;
//       }
//     resultContainer.innerHTML = ""; 
  
//     const resultText = document.createElement("p");
//     if (selectedAnswer === correctAnswer) {
//       resultText.textContent = "Correct answer!";
//       resultText.style.color = "green";
//       points++;
//     } else {
//       resultText.textContent = `Wrong answer. Correct answer is: ${correctAnswer}`;
//       resultText.style.color = "red";
//     }
//     resultContainer.appendChild(resultText);
// }
  
// async function startQuiz() {
//     document.getElementById("startButton").style.display = "none";
//     const resultContainer = document.getElementById("result-container");
//     console.log("startQuiz called");
//     startWorker();

//     try{
//     let data = localStorage.getItem('quizData');
//     data = JSON.parse(data);
//     console.log("Data after GetData call: ", data);
//     if (!data || !data.results || data.results.length === 0) {
//         alert('An error occurred while fetching the data. Please try again later.');
//         return;
//     }

//     const questions = data.results;
  
//     let currentQuestionIndex = 0;
//     displayQuestion(questions[currentQuestionIndex], currentQuestionIndex);
  
//     const nextButton = document.getElementById("next-button");
//     nextButton.style.display = "block";

//     nextButton.addEventListener("click", () => {
//       currentQuestionIndex++;
//       if (currentQuestionIndex < questions.length) {
//         displayQuestion(questions[currentQuestionIndex], currentQuestionIndex);
//         resultContainer.innerHTML = ""; 
//         startWorker();
//       } else {
//         alert(`End of quiz! You got ${points} points!`);
//         points = 0;
//         window.location.reload();
//       }
//     });
//   } catch (error) {
//     console.error('An error occurred while fetching the data:', error);
//     alert('An error occurred while fetching the data. Please try again later.');
//   }
// }




// controller.js
// function decodeHtmlEntities(text) {
//   const tempElement = document.createElement('textarea');
//   tempElement.innerHTML = text;
//   return tempElement.value;
// }

// async function initializeApp() {
//   displayLoadingState();
//   try {
//       await fetchQuizData();
//       displayStartState();
//   } catch (error) {
//       displayErrorState(error);
//   }
// }

// function displayLoadingState() {
//   const loadingPage = document.getElementById("loadingPage");
//   const startPage = document.getElementById("startPage");
//   loadingPage.style.display = "block";
//   startPage.style.display = "none";
// }

// async function fetchQuizData() {
//   await GetData();
// }

// function displayStartState() {
//   const loadingPage = document.getElementById("loadingPage");
//   const startPage = document.getElementById("startPage");
//   loadingPage.style.display = "none";
//   startPage.style.display = "block";
// }

// function displayErrorState(error) {
//   console.error('An error occurred while fetching the data:', error);
//   const loadingPage = document.getElementById("loadingPage");
//   const startPage = document.getElementById("startPage");
//   loadingPage.textContent = "An error occurred while fetching the data. Please try again later.";
//   startPage.style.display = "block";
// }

// document.addEventListener("DOMContentLoaded", initializeApp);

// function displayQuestion(questionData, questionIndex) {
//   clearQuestionContainer();
//   renderQuestionText(questionData, questionIndex);
//   displayAnswers(questionData);
// }

// function clearQuestionContainer() {
//   const questionContainer = document.getElementById("question-container");
//   if (!questionContainer) {
//       console.error("Couldn't find element question-container.");
//       return;
//   }
//   questionContainer.innerHTML = "";
// }

// function renderQuestionText(questionData, questionIndex) {
//   const questionContainer = document.getElementById("question-container");
//   const questionText = document.createElement("h2");
//   questionText.textContent = `Question ${questionIndex + 1}: ${decodeHtmlEntities(questionData.question)}`;
//   questionContainer.appendChild(questionText);
// }

// function displayAnswers(questionData) {
//   const answersContainer = getAnswersContainer();
//   if (!answersContainer) return;
//   clearAnswersContainer(answersContainer);
//   const allAnswers = [...questionData.incorrect_answers, questionData.correct_answer].sort(() => Math.random() - 0.5);
//   renderAnswerOptions(allAnswers, questionData.correct_answer, answersContainer);
// }

// function getAnswersContainer() {
//   return document.getElementById("answersContainer");
// }

// function clearAnswersContainer(answersContainer) {
//   answersContainer.innerHTML = "";
// }

// function renderAnswerOptions(allAnswers, correctAnswer, answersContainer) {
//   allAnswers.forEach((answer, index) => {
//       const answerDiv = createAnswerDiv(answer, index);
//       answersContainer.appendChild(answerDiv);
//   });
//   setupSubmitButton(correctAnswer);
// }

// function createAnswerDiv(answer, index) {
//   const answerDiv = document.createElement("div");
//   const radioButton = createRadioButton(index);
//   const label = createLabel(answer, index);
//   answerDiv.appendChild(radioButton);
//   answerDiv.appendChild(label);
//   return answerDiv;
// }

// function createRadioButton(index) {
//   const radioButton = document.createElement("input");
//   radioButton.type = "radio";
//   radioButton.name = "answer";
//   radioButton.id = `answer${index + 1}`;
//   return radioButton;
// }

// function createLabel(answer, index) {
//   const label = document.createElement("label");
//   label.textContent = decodeHtmlEntities(answer);
//   label.setAttribute('for', `answer${index + 1}`);
//   return label;
// }

// function setupSubmitButton(correctAnswer) {
//   const submit = document.getElementById("submit-button");
//   if (submit) {
//       submit.onclick = function () {
//           handleAnswerSubmission(correctAnswer);
//       };
//   }
// }

// function handleAnswerSubmission(correctAnswer) {
//   const selectedAnswer = document.querySelector('input[name="answer"]:checked');
//   if (!selectedAnswer) {
//       alert("Please select an answer.");
//       return;
//   }
//   checkAnswer(selectedAnswer.value, correctAnswer);
//   stopWorker();
// }

// let points = 0;

// function checkAnswer(selectedAnswer, correctAnswer) {
//   const resultContainer = getResultContainer();
//   if (!resultContainer) return;
//   clearResultContainer(resultContainer);
//   const resultText = createResultText(selectedAnswer, correctAnswer);
//   resultContainer.appendChild(resultText);
// }

// function getResultContainer() {
//   return document.getElementById("result-container");
// }

// function clearResultContainer(resultContainer) {
//   resultContainer.innerHTML = "";
// }

// function createResultText(selectedAnswer, correctAnswer) {
//   const resultText = document.createElement("p");
//   if (selectedAnswer === correctAnswer) {
//       resultText.textContent = "Correct answer!";
//       resultText.style.color = "green";
//       points++;
//   } else {
//       resultText.textContent = `Wrong answer. Correct answer is: ${correctAnswer}`;
//       resultText.style.color = "red";
//   }
//   return resultText;
// }

// async function startQuiz() {
//   hideStartButton();
//   resetResultContainer();
//   startWorker();
//   try {
//       const questions = await fetchQuestions();
//       if (!questions) return;
//       let currentQuestionIndex = 0;
//       displayQuestion(questions[currentQuestionIndex], currentQuestionIndex);
//       setupNextButton(questions, currentQuestionIndex);
//   } catch (error) {
//       handleQuizError(error);
//   }
// }

// function hideStartButton() {
//   document.getElementById("startButton").style.display = "none";
// }

// function resetResultContainer() {
//   const resultContainer = document.getElementById("result-container");
//   console.log("startQuiz called");
// }

// async function fetchQuestions() {
//   const data = getQuizDataFromLocalStorage();
//   if (!data || !data.results || data.results.length === 0) {
//       alert('An error occurred while fetching the data. Please try again later.');
//       return null;
//   }
//   return data.results;
// }

// function getQuizDataFromLocalStorage() {
//   const data = localStorage.getItem('quizData');
//   return JSON.parse(data);
// }
// let currentQuestionIndex = 0;

// function setupNextButton(questions) {
//   const nextButton = document.getElementById("next-button");
//   nextButton.style.display = "block";
//   let currentQuestionIndex = initialQuestionIndex;
//   nextButton.onclick = () => handleNextButtonClick(questions, initialQuestionIndex, () => {
//     currentQuestionIndex++;
//   });
// }   //TODO fix it

// function handleNextButtonClick(questions, currentQuestionIndex, incrementIndexCallback) {
//   incrementIndexCallback();

//   if (currentQuestionIndex < questions.length) {
//       displayQuestion(questions[currentQuestionIndex], currentQuestionIndex);
//       resetResultContainer();
//       startWorker();
//   } else {
//       endQuiz();
//   }
// }

// function handleQuizError(error) {
//   console.error('An error occurred while fetching the data:', error);
//   alert('An error occurred while fetching the data. Please try again later.');
// }

// function endQuiz() {
//   alert(`End of quiz! You got ${points} points!`);
//   points = 0;
//   window.location.reload();
// }