var currentQuestion = null;
var questionIdElement = document.querySelector(".question-id");
var categoryElement = document.querySelector(".category-name");
var elementQuestion = document.querySelector(".real-question");
var questionContainer = document.querySelector(".question");
var answerContainer = document.querySelector(".answer");
var correctAnswer = document.querySelector(".correct"); 
var incorrectAnswer = document.querySelector(".incorrect");
var nextQuestion = document.querySelector(".next-quiz");
var score = 0;
var totalQuestions = 0;
var userAnswer = [];


function getQuestion() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			currentQuestion = JSON.parse(this.responseText)[0];
			callback();
		}
	}
	document.querySelector(".total-amount").innerHTML = totalQuestions;
	totalQuestions += 1;

	questionContainer.innerHTML = "";
	answerContainer.innerHTML = "";

	xhttp.open("GET", "https://jservice.io/api/random", true);
	xhttp.send();
}
getQuestion();

function callback() {
	questionIdElement.textContent = currentQuestion.id;
	categoryElement.textContent = currentQuestion.category.title;
	elementQuestion.textContent = currentQuestion.question;
	userAnswer = [];
	console.log(currentQuestion, questionIdElement);
	createLetters(currentQuestion.answer);
}

function createLetters(answer) {
	var lettersArray = answer.split("");
	lettersArray = addIds(lettersArray);
	lettersArray = shuffleArray(lettersArray);
	for (var i = 0; i < lettersArray.length; i++) {
		var letterElement = document.createElement("div"); 
		letterElement.className += "letter"; 
		letterElement.textContent = lettersArray[i].letter; 
		letterElement.id = lettersArray[i].id;
		questionContainer.appendChild(letterElement); 
		letterElement.onclick = function(event){
			if (event.target.parentElement === answerContainer) {
				questionContainer.appendChild(event.target);
				removeLetterFromAnswer(event.target.id);
				resetState();
			} else {
				answerContainer.appendChild(event.target);
				addLetterToAnswer(event.target.id, event.target.textContent);
				if (checkCorrectAnswer()) {
					addCorrectState();
				}
				else if (userAnswer.length == currentQuestion.answer.length){
					addIncorrectState();
				}
				else {
					resetState();
				}
			}
		}
	}
}

function addLetterToAnswer (id, letter){
	userAnswer.push({
		id: id,
		letter: letter
	})
	console.log(checkCorrectAnswer ());
}
function removeLetterFromAnswer (id){
	var index = userAnswer.findIndex(function(element){
		return element.id == id;
	})
	userAnswer.splice(index, 1);
	console.log(checkCorrectAnswer ());
}
function addIds(array){
	var result = [];
	for (var i=0; i < array.length; i++) {
		var object = {
			letter:array[i], 
			id:i
		}
		result.push(object);
	}
	return result;
}

function checkCorrectAnswer () {
	console.log()
	var answerString = userAnswer.reduce(function(previousValue, currentValue){
		console.log(previousValue, currentValue.letter)
		return (previousValue.letter || previousValue)  + currentValue.letter;
		
	}, "");
	console.log(answerString)
	return answerString == currentQuestion.answer;
}

function shuffleArray(array) {
	return array.sort(function(item1, item2) {
		return 0.5 - Math.random();
	})
} 

function addCorrectState (){
	console.log(correctAnswer)
	correctAnswer.classList.remove("hidden");
	nextQuestion.classList.remove("hidden");
	questionContainer.classList.add("hidden");
}

function addIncorrectState () {
	console.log(incorrectAnswer)
	incorrectAnswer.classList.remove("hidden");
}

function resetState (){
	console.log('resetState')
	correctAnswer.classList.add("hidden");
	nextQuestion.classList.add("hidden");
	incorrectAnswer.classList.add("hidden");
}

function reset() {
	var skipQuestion = document.querySelector(".skip-quiz");
	skipQuestion.onclick = function(){
		resetState ();
		getQuestion();
	}
}
reset();

function addNextQevent() {
	nextQuestion.onclick = function(){
		score += 1;
		document.querySelector(".correct-answers").innerHTML = score;
		questionContainer.classList.remove("hidden");
		resetState ();
		getQuestion();
	}
}
addNextQevent();

