
const logger = new Logger();


const obviousQuestion = {
	id: 0,
	question: 'Is the sky blue?',
	description: 'An obvious question that you know the answer to.'
}

const referenceQuestion = {
	id: 1,
	question: 'Is this word the word for yes?',
	description: "Ask an overlord information on a word's meaning."
}

const randomOverlordIdentityQuestion = {
	id: 3,
	question: 'Is that the Overlord who answers randomly?',
	description: 'Used to determine the identity of the randomly answering one.'
}

const othersAreTruthfulOverlord = {
	id: 4,
	question: 'Is one of the other overlords the one who tells the truth?',
	description: 'Both Tee and Eff will answer "No" to this one.'
}

const othersAreLyingOverlord = {
	id: 5,
	question: 'Is one of the other overlords the one who always lies?',
	description: 'Both Tee and Eff will answer "Yes" to this one.'
}

const isUluWordYes = {
	id: 6,
	question: "Is the word Ulu the word for 'Yes'?",
	description: 'Tee will always answer Ulu to this, Eff will answer Ozo.',
};

$(document).ready(function(){

	$("#run-button").click(() => {
		playOneRound(strategy3);
	});

	$("#run-many-times-button").click(() => {
		playManyRounds(strategy3);
	});
});

const setTimer = (timerElement, time) => {
	timerElement.html(`The program took ${time} milliseconds to run.<br>`);
}

function playManyRounds(strategyFunction) {
	logger.clear();

	const t0 = performance.now();

	for (let i = 0; i < 10000; i++) {
		strategyFunction();
	}

	const numberOfGames = logger.getNumberOfGames();
	const numberOfWonGames = logger.getNumberOfWonGames();

	$("#solution-log").html(
		`games: ${numberOfGames}, won: ${numberOfWonGames}, winrate: ${(numberOfWonGames / numberOfGames) * 100}%`
	);

	const map = logger.getAnswersToOverlordsMap();

	console.log(map);

	const t1 = performance.now();

	setTimer($("#timer"), t1 - t0);
}

function playOneRound(strategyFunction) {
	const t0 = performance.now();
	const solutionLogElement = $('#solution-log');

	solutionLogElement.text('');

	$('#analysis').text('');

	//$('#note-text').html('<b>Scroll all the way down to view the whole solution.</b>');
	strategyFunction((logText) => solutionLogElement.append(`${logText} <br><br>`));

	//console.log(logger.getLog());
	console.log(logger.getAnswersToOverlordsMap());

	const t1 = performance.now();

	setTimer($('#timer'), t1 - t0);
}

/**
 * Return random integer. Zero included, max excluded.
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const strategy3 = (printFunction = () => {}) => {
  runSolutionWithFunction(getSolution3, printFunction);
};

const runSolutionWithFunction = (solutionFunction, printFunction = () => {}) => {
	printFunction("Starting program..");

	const wordPronunciations = shuffle(["Ozo", "Ulu"]);

	const wordForTrue = new Word(wordPronunciations[0], true);
	const wordForfalse = new Word(wordPronunciations[1], false);

	const overlords = shuffle([
	new TruthfulOverlord(0, "Tee", wordForTrue, wordForfalse),
	new LyingOverlord(1, "Eff", wordForTrue, wordForfalse),
	new RandomOverlord(2, "Arr", wordForTrue, wordForfalse),
	]);

	const idolOfTee = new Idol(0, "Idol of Tee");
	const idolOfEff = new Idol(1, "Idol of Eff");
	const idolOfArr = new Idol(2, "Idol of Arr");

	const [overlord1, overlord2, overlord3] = overlords;

	const questionsAndAnswers = [];

	const gameLog = {
	questionsAndAnswers,
	overlords,
	wordForTrue,
	wordForfalse,
	};

	solutionFunction(
	{
		overlord1,
		overlord2,
		overlord3,
		idolOfTee,
		idolOfEff,
		idolOfArr,
		questionsAndAnswers,
		printFunction
	});

	printFunction(
	"<br><p>Idols presented. What is your verdict, o' Overlords?..</p><br><br><br><br><br>"
	);

	printFunction(overlord1.getOpinion());
	printFunction(overlord2.getOpinion());
	printFunction(overlord3.getOpinion());

	printFunction(`The word Ulu means ${wordForTrue.getPronunciation() == "Ulu" ? true : false}, the word Ozo means  ${wordForTrue.getPronunciation() == "Ozo" ? true : false}`);

	gameLog.victory =
	overlord1.isPleased() && overlord2.isPleased() && overlord3.isPleased();

	logger.addLog(gameLog);

	printFunction("Program finished.");
};


const getSolution2 = ({overlord1, overlord2, overlord3, idolOfTee, idolOfEff, idolOfArr, questionsAndAnswers, printFunction, mapping}) =>{
	printFunction(obviousQuestion.question);
	
	const anwerOfLord1Question1 = overlord1.getAnswer(obviousQuestion.id, null);
	printFunction(`Overlord 1: ${anwerOfLord1Question1.getPronunciation()}`);
	
	questionsAndAnswers.push({
		question: obviousQuestion,
		orderNumber: 0,
		addressedTo:0,
		answer: anwerOfLord1Question1.getPronunciation()
	});

	printFunction(referenceQuestion.question);
	const anwerOfLord2Question2 = overlord2.getAnswer(referenceQuestion.id, {wordReference1: anwerOfLord1Question1});
	printFunction(`Overlord 2: ${anwerOfLord2Question2.getPronunciation()}`);

	questionsAndAnswers.push({
		question: referenceQuestion,
		orderNumber: 1,
		addressedTo: 1,
		answer: anwerOfLord2Question2.getPronunciation()
	});
	let answerOfLord1Question3;
	let answerOfLord2Question3;
	let answerOfLord3Question3;


	const question3 = randomOverlordIdentityQuestion;
	
	printFunction(question3.question);
	
	const references = {overlordReference: overlord1};
	
	answerOfLord1Question3 = overlord1.getAnswer(question3.id, references)
	printFunction(`Overlord 1: ${answerOfLord1Question3.getPronunciation()}`);
	
	answerOfLord2Question3 = overlord2.getAnswer(question3.id, references)
	printFunction(`Overlord 2: ${answerOfLord2Question3.getPronunciation()}`);
	
	answerOfLord3Question3 = overlord3.getAnswer(question3.id, references)
	printFunction(`Overlord 3: ${answerOfLord3Question3.getPronunciation()}`);
		
	questionsAndAnswers.push({
		question: referenceQuestion,
		orderNumber: 2,
		addressedTo:2,
		answer: answerOfLord3Question3.getPronunciation()
	});
	
	presentIdolsBasedOnAnswers(
	{
		anwerOfLord1Question1,
		anwerOfLord2Question2,
		answerOfLord3Question3,
		overlord1,
		overlord2,
		overlord3,
		idolOfTee,
		idolOfEff,
		idolOfArr,
		mapping
	}
  );
}

const getSolution3 = (
	{
	overlord1,
	overlord2,
	overlord3,
	idolOfTee,
	idolOfEff,
	idolOfArr,
	questionsAndAnswers,
	printFunction}) => {

	printFunction(isUluWordYes.question);
	const anwerOfLord1Question1 = overlord1.getAnswer(isUluWordYes.id);
	printFunction(getOverlordDebugAnswer(1, overlord1, anwerOfLord1Question1));

	questionsAndAnswers.push({
		question: isUluWordYes,
		orderNumber: 0,
		addressedTo: 0,
		answer: anwerOfLord1Question1.getPronunciation(),
	});

	printFunction(othersAreLyingOverlord.question);
	const anwerOfLord2Question2 = overlord2.getAnswer(othersAreLyingOverlord.id);
	printFunction(getOverlordDebugAnswer(2, overlord2, anwerOfLord2Question2));

	questionsAndAnswers.push({
		question: othersAreLyingOverlord,
		orderNumber: 1,
		addressedTo: 1,
		answer: anwerOfLord2Question2.getPronunciation(),
	});

	let answerOfLord3Question3;

	printFunction(isUluWordYes.question);

	answerOfLord3Question3 = overlord3.getAnswer(isUluWordYes.id);
	printFunction(getOverlordDebugAnswer(3, overlord3, answerOfLord3Question3));

	questionsAndAnswers.push(
	{
		question: isUluWordYes,
		orderNumber: 2,
		addressedTo:2,
		answer: answerOfLord3Question3.getPronunciation()
	});

	if (anwerOfLord1Question1.getPronunciation() == 'Ozo'){
	
		if (anwerOfLord2Question2.getPronunciation()=='Ozo'){
			if (answerOfLord3Question3.getPronunciation() =='Ozo'){
				//Ozo,Ozo,Ozo
				overlord1.giveIdol(idolOfTee);
				overlord2.giveIdol(idolOfEff);
				overlord3.giveIdol(idolOfArr);
			} else {
				//Ozo,Ozo,Ulu
				overlord1.giveIdol(idolOfEff);
				overlord2.giveIdol(idolOfTee);
				overlord3.giveIdol(idolOfArr);
			}
		} else {
			if (answerOfLord3Question3.getPronunciation() =='Ozo'){
				//Ozo,Ulu,Ozo
				overlord1.giveIdol(idolOfEff);
				overlord2.giveIdol(idolOfTee);
				overlord3.giveIdol(idolOfArr);
			} else {
				//Ozo,Ulu,Ulu
				overlord1.giveIdol(idolOfEff);
				overlord2.giveIdol(idolOfTee);
				overlord3.giveIdol(idolOfArr);
			}
		}
		
	} else {
		if (anwerOfLord2Question2.getPronunciation()=='Ozo'){
			if (answerOfLord3Question3.getPronunciation() =='Ozo'){
				//Ulu,Ozo,Ozo
				overlord1.giveIdol(idolOfTee);
				overlord2.giveIdol(idolOfEff);
				overlord3.giveIdol(idolOfArr);
			} else {
				//Ulu,Ozo,Ulu
				overlord1.giveIdol(idolOfTee);
				overlord2.giveIdol(idolOfEff);
				overlord3.giveIdol(idolOfArr);
			}
		} else {
			if (answerOfLord3Question3.getPronunciation() =='Ozo'){
				//Ulu,Ulu,Ozo
				overlord1.giveIdol(idolOfTee);
				overlord2.giveIdol(idolOfEff);
				overlord3.giveIdol(idolOfArr);
			} else {
				//Ulu,Ulu,Ulu
				overlord1.giveIdol(idolOfTee);
				overlord2.giveIdol(idolOfEff);
				overlord3.giveIdol(idolOfArr);
			}
		}	
	}	if (anwerOfLord1Question1.getPronunciation() == 'Ozo'){
	
		if (anwerOfLord2Question2.getPronunciation()=='Ozo'){
			if (answerOfLord3Question3.getPronunciation() =='Ozo'){
				//Ozo,Ozo,Ozo
				overlord1.giveIdol(idolOfEff);
				overlord2.giveIdol(idolOfTee);
				overlord3.giveIdol(idolOfArr);
			} else {
				//Ozo,Ozo,Ulu
				overlord1.giveIdol(idolOfEff);
				overlord2.giveIdol(idolOfTee);
				overlord3.giveIdol(idolOfArr);
			}
		} else {
			if (answerOfLord3Question3.getPronunciation() =='Ozo'){
				//Ozo,Ulu,Ozo
				overlord1.giveIdol(idolOfEff);
				overlord2.giveIdol(idolOfTee);
				overlord3.giveIdol(idolOfArr);
			} else {
				//Ozo,Ulu,Ulu
				overlord1.giveIdol(idolOfEff);
				overlord2.giveIdol(idolOfTee);
				overlord3.giveIdol(idolOfArr);
			}
		}
		
	} else {
		if (anwerOfLord2Question2.getPronunciation()=='Ozo'){
			if (answerOfLord3Question3.getPronunciation() =='Ozo'){
				//Ulu,Ozo,Ozo
				overlord1.giveIdol(idolOfTee);
				overlord2.giveIdol(idolOfEff);
				overlord3.giveIdol(idolOfArr);
			} else {
				//Ulu,Ozo,Ulu
				overlord1.giveIdol(idolOfTee);
                overlord2.giveIdol(idolOfEff);
                overlord3.giveIdol(idolOfArr);
			}
		} else {
			if (answerOfLord3Question3.getPronunciation() =='Ozo'){
				//Ulu,Ulu,Ozo
				overlord1.giveIdol(idolOfTee);
				overlord2.giveIdol(idolOfEff);
				overlord3.giveIdol(idolOfArr);
			} else {
				//Ulu,Ulu,Ulu
				overlord1.giveIdol(idolOfTee);
				overlord2.giveIdol(idolOfEff);
				overlord3.giveIdol(idolOfArr);
			}
		}	
	}
};

/**
0 Tee, Eff, Arr
1 Tee, Arr, Eff
2 Eff, Tee, Arr
3 Eff, Arr, Tee
4 Arr, Tee, Eff
5 Arr, Eff, Tee
*/
const presentIdols = (presentationId, {overlord1, overlord2, overlord3, idolOfTee, idolOfEff, idolOfArr}) => {
	switch (presentationId){
		case 0:
			overlord1.giveIdol(idolOfTee);
			overlord2.giveIdol(idolOfEff);
			overlord3.giveIdol(idolOfArr);
			break;
		case 1:
			overlord1.giveIdol(idolOfTee);
			overlord2.giveIdol(idolOfArr);
			overlord3.giveIdol(idolOfEff);
			break;
		case 2:
			overlord1.giveIdol(idolOfEff);
			overlord2.giveIdol(idolOfTee);
			overlord3.giveIdol(idolOfArr);
			break;
		case 3:
			overlord1.giveIdol(idolOfEff);
			overlord2.giveIdol(idolOfArr);
			overlord3.giveIdol(idolOfTee);
			break;
		case 4:
			overlord1.giveIdol(idolOfArr);
			overlord2.giveIdol(idolOfTee);
			overlord3.giveIdol(idolOfEff);
			break;
		case 5:
			overlord1.giveIdol(idolOfArr);
			overlord2.giveIdol(idolOfEff);
			overlord3.giveIdol(idolOfTee);
			break;
	}
}

function getOverlordDebugAnswer(overlordOrderNumber = 0, overlordObject, answerToQuestion) {

	const showSpoilers = false;

	return showSpoilers
	? `Overlord ${overlordOrderNumber} (${overlordObject.getName()}): ${answerToQuestion.getPronunciation()} (${answerToQuestion.getEnglishTranslation()})`
	: `Overlord ${overlordOrderNumber}: ${answerToQuestion.getPronunciation()}`;
}

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}