
const logger = new Logger();


const obviousQuestion = {
	id: 0,
	question: 'Is the sky blue?',
	description: 'An obvious question that you know the answer to.'
}

const referenceQuestion = {
	id: 1,
	question: 'Was the answer to the last question a yes?',
	description: "Ask an overlord information on another's answer."
}

const answerComparisonQuestion = {
	id: 2,
	question: 'Were the last two answers a yes?',
	description: 'Asks the overlord to compare two answers'
}


const randomOverlordIdentityQuestion = {
	id:3,
	question: 'Is the first in line the Overlord who answers randomly?',
	description: 'Used to determine the identity of the randomly answering one.'
}

$(document).ready(function(){

	$("#run-button").click(() => {
		const t0 = performance.now();
		const solutionLogElement = $('#solution-log');

		solutionLogElement.text('');
		$('#analysis').text('');

		//$('#note-text').html('<b>Scroll all the way down to view the whole solution.</b>');

		runSolution( logText => solutionLogElement.append(`${logText} <br><br>`) );

		//console.log(logger.getLog());
		console.log(logger.getAnswersToOverlordsMap());

		const t1 = performance.now();

		setTimer($('#timer'), t1 - t0);
	});
	$("#run-best-button").click(() => {
		const t0 = performance.now();
		const solutionLogElement = $("#solution-log");

		solutionLogElement.text("");
		$("#analysis").text("");

		//$('#note-text').html('<b>Scroll all the way down to view the whole solution.</b>');

		runFortySixPercentSolution(getBestSolutionMapping(), (logText) =>
		solutionLogElement.append(`${logText} <br><br>`)
		);

		//console.log(logger.getLog());
		console.log(logger.getAnswersToOverlordsMap());

		const t1 = performance.now();

		setTimer($("#timer"), t1 - t0);
    });
	$("#run-many-times-button").click(() => {
		logger.clear();

		const t0 = performance.now();

		/*
		Here are interesting mappings that I have found:
		[1,3,4,2,4,1,5,0] : 0% winrate. Always loses. Why and how it can always lose is worthy of investigating
		[2, 1, 0, 5, 5, 0, 1, 2] default mapping that I have determined. About 33% winrate
		*/
		const mapping = getRandomizedMapping();

		console.log("The mapping is: " + mapping);

		for (let i = 0; i < 10000; i++) {
			runSolutionWithMapping(mapping);
		}

		const numberOfGames = logger.getNumberOfGames();
		const numberOfWonGames = logger.getNumberOfWonGames();

		$("#solution-log").html(
			`The mapping is: ${mapping} <br>
			<br>
			games: ${numberOfGames}, won: ${numberOfWonGames}, winrate: ${(numberOfWonGames / numberOfGames) * 100}%`
		);

		const map = logger.getAnswersToOverlordsMap();

		console.log(map);

		const t1 = performance.now();

		setTimer($("#timer"), t1 - t0);
	});

	$("#run-best-solution-button").click(() => {
		logger.clear();

		const t0 = performance.now();

		const mapping = getBestSolutionMapping();

		console.log("The mapping is: " + mapping);

		for (let i = 0; i < 10000; i++) {
			runFortySixPercentSolution(mapping);
		}

		const numberOfGames = logger.getNumberOfGames();
		const numberOfWonGames = logger.getNumberOfWonGames();

		$("#solution-log").html(
			`The mapping is: ${mapping} <br>
			<br>
			games: ${numberOfGames}, won: ${numberOfWonGames}, winrate: ${(numberOfWonGames / numberOfGames) * 100}%`
		);

		const map = logger.getAnswersToOverlordsMap();

		console.log(map);

		const t1 = performance.now();

		setTimer($("#timer"), t1 - t0);
	});
	$("#run-best-solution-with-random-mapping-button").click(() => {
		logger.clear();

		const t0 = performance.now();

		const mapping = getRandomizedMapping();

		console.log("The mapping is: " + mapping);

		for (let i = 0; i < 10000; i++) {
			runFortySixPercentSolution(mapping);
		}

		const numberOfGames = logger.getNumberOfGames();
		const numberOfWonGames = logger.getNumberOfWonGames();

		$("#solution-log").html(
		`The mapping is: ${mapping} <br>
			<br>
			games: ${numberOfGames}, won: ${numberOfWonGames}, winrate: ${
			(numberOfWonGames / numberOfGames) * 100
		}%`
		);

		const map = logger.getAnswersToOverlordsMap();

		console.log(map);

		const t1 = performance.now();

		setTimer($("#timer"), t1 - t0);
    });
});

const getBestSolutionMapping = () => [2, 4, 1, 0, 5, 1, 4, 3];

const setTimer = (timerElement, time) => {
	timerElement.html(`The program took ${time} milliseconds to run.<br>`);
}

/**
 * Return random integer. Zero included, max excluded.
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const runSolution = (printFunction = ()=>{}) => {
	runSolutionWithMapping([2, 1, 0, 5, 5, 0, 1, 2], printFunction);
}

const runFortySixPercentSolution = (mapping = [2, 4, 1, 0, 5, 1, 4, 3], printFunction = () => {}) => {
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

	getFortySixPercentSolution({
		overlord1,
		overlord2,
		overlord3,
		idolOfTee,
		idolOfEff,
		idolOfArr,
		questionsAndAnswers,
		printFunction,
	}, mapping);

	printFunction(
	"<br><p>Idols presented. What is your verdict, o' Overlords?..</p><br><br><br><br><br>"
	);

	printFunction(overlord1.getOpinion());
	printFunction(overlord2.getOpinion());
	printFunction(overlord3.getOpinion());

	gameLog.victory =
	overlord1.isPleased() && overlord2.isPleased() && overlord3.isPleased();

	logger.addLog(gameLog);

	printFunction("Program finished.");
};

const runSolutionWithMapping = (mapping, printFunction = () => {}) => {
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

	getSolution2(
    {
      overlord1,
      overlord2,
      overlord3,
      idolOfTee,
      idolOfEff,
      idolOfArr,
      questionsAndAnswers,
      printFunction,
    }, mapping);

	printFunction(
	"<br><p>Idols presented. What is your verdict, o' Overlords?..</p><br><br><br><br><br>"
	);

	printFunction(overlord1.getOpinion());
	printFunction(overlord2.getOpinion());
	printFunction(overlord3.getOpinion());

	gameLog.victory =
	overlord1.isPleased() && overlord2.isPleased() && overlord3.isPleased();

	logger.addLog(gameLog);

	printFunction("Program finished.");
};


const getSolution2 = ({overlord1, overlord2, overlord3, idolOfTee, idolOfEff, idolOfArr, questionsAndAnswers, printFunction}, mapping) =>{
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
	},
	mapping
  );
}

const getFortySixPercentSolution = (
	{
	overlord1,
	overlord2,
	overlord3,
	idolOfTee,
	idolOfEff,
	idolOfArr,
	questionsAndAnswers,
	printFunction,
	}, mapping = [2, 4, 1, 0, 5, 1, 4, 3]) => {
	printFunction(obviousQuestion.question);

	const anwerOfLord1Question1 = overlord1.getAnswer(obviousQuestion.id, null);
	printFunction(`Overlord 1: ${anwerOfLord1Question1.getPronunciation()}`);

	questionsAndAnswers.push({
	question: obviousQuestion,
	orderNumber: 0,
	addressedTo: 0,
	answer: anwerOfLord1Question1.getPronunciation(),
	});

	printFunction(referenceQuestion.question);
	const anwerOfLord2Question2 = overlord2.getAnswer(referenceQuestion.id, {
		wordReference1: anwerOfLord1Question1,
	});
	printFunction(`Overlord 2: ${anwerOfLord2Question2.getPronunciation()}`);

	questionsAndAnswers.push({
		question: referenceQuestion,
		orderNumber: 1,
		addressedTo: 1,
		answer: anwerOfLord2Question2.getPronunciation(),
	});
	let answerOfLord1Question3;
	let answerOfLord2Question3;
	let answerOfLord3Question3;

	if (anwerOfLord1Question1.getPronunciation() == anwerOfLord2Question2.getPronunciation()){

		printFunction(answerComparisonQuestion.question);

		const references = {wordReference1: anwerOfLord1Question1, wordReference2:anwerOfLord2Question2};

		answerOfLord1Question3 = overlord1.getAnswer(answerComparisonQuestion.id, references)
		printFunction(`Overlord 1: ${answerOfLord1Question3.getPronunciation()}`);

		answerOfLord2Question3 = overlord2.getAnswer(answerComparisonQuestion.id, references)
		printFunction(`Overlord 2: ${answerOfLord2Question3.getPronunciation()}`);

		answerOfLord3Question3 = overlord3.getAnswer(answerComparisonQuestion.id, references)
		printFunction(`Overlord 3: ${answerOfLord3Question3.getPronunciation()}`);
		questionsAndAnswers.push({
			question: answerComparisonQuestion,
			orderNumber: 2,
			addressedTo: 0,
			answer: answerOfLord1Question3.getPronunciation()
		},
		{
			question: answerComparisonQuestion,
			orderNumber: 2,
			addressedTo:1,
			answer: answerOfLord2Question3.getPronunciation()
		},
		{
			question: answerComparisonQuestion,
			orderNumber: 2,
			addressedTo:2,
			answer: answerOfLord3Question3.getPronunciation()
		});
	} else { 
		printFunction(referenceQuestion.question);

		const references = {wordReference1: anwerOfLord2Question2};

		answerOfLord1Question3 = overlord1.getAnswer(referenceQuestion.id, references)
		printFunction(`Overlord 1: ${answerOfLord1Question3.getPronunciation()}`);

		answerOfLord2Question3 = overlord2.getAnswer(referenceQuestion.id, references)
		printFunction(`Overlord 2: ${answerOfLord2Question3.getPronunciation()}`);

		answerOfLord3Question3 = overlord3.getAnswer(referenceQuestion.id, references)
		printFunction(`Overlord 3: ${answerOfLord3Question3.getPronunciation()}`);

		questionsAndAnswers.push({
			question: answerComparisonQuestion,
			orderNumber: 2,
			addressedTo: 0,
			answer: answerOfLord1Question3.getPronunciation()
		},
		{
			question: answerComparisonQuestion,
			orderNumber: 2,
			addressedTo:1,
			answer: answerOfLord2Question3.getPronunciation()
		},
		{
			question: answerComparisonQuestion,
			orderNumber: 2,
			addressedTo:2,
			answer: answerOfLord3Question3.getPronunciation()
		});
	}

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
	},
	mapping);
};

/**
 * 
 * @param {answes of the questions, along with the overlord objects and the three idols used to identify them} param0 
 * @param {*} mapping 
 */
const presentIdolsBasedOnAnswers = ({anwerOfLord1Question1, anwerOfLord2Question2, answerOfLord3Question3, overlord1, overlord2, overlord3, idolOfTee, idolOfEff, idolOfArr}, mapping) => {

	if (anwerOfLord1Question1.getPronunciation() == 'Ozo'){
	
		if (anwerOfLord2Question2.getPronunciation()=='Ozo'){
			if (answerOfLord3Question3.getPronunciation() =='Ozo'){
				//Ozo,Ozo,Ozo
				presentIdols(mapping[0], {overlord1, overlord2, overlord3, idolOfTee, idolOfEff, idolOfArr});
			} else {
				//Ozo,Ozo,Ulu
				presentIdols(mapping[1], {overlord1, overlord2, overlord3, idolOfTee, idolOfEff, idolOfArr});
			}
		} else {
			if (answerOfLord3Question3.getPronunciation() =='Ozo'){
				//Ozo,Ulu,Ozo
				presentIdols(mapping[2], {overlord1, overlord2, overlord3, idolOfTee, idolOfEff, idolOfArr});
			} else {
				//Ozo,Ulu,Ulu
				presentIdols(mapping[3], {overlord1, overlord2, overlord3, idolOfTee, idolOfEff, idolOfArr});
			}
		}
		
	} else {
		if (anwerOfLord2Question2.getPronunciation()=='Ozo'){
			if (answerOfLord3Question3.getPronunciation() =='Ozo'){
				//Ulu,Ozo,Ozo
				presentIdols(mapping[4], {overlord1, overlord2, overlord3, idolOfTee, idolOfEff, idolOfArr});
			} else {
				//Ulu,Ozo,Ulu
				presentIdols(mapping[5], {overlord1, overlord2, overlord3, idolOfTee, idolOfEff, idolOfArr});
			}
		} else {
			if (answerOfLord3Question3.getPronunciation() =='Ozo'){
				//Ulu,Ulu,Ozo
				presentIdols(mapping[6], {overlord1, overlord2, overlord3, idolOfTee, idolOfEff, idolOfArr});
			} else {
				//Ulu,Ulu,Ulu
				presentIdols(mapping[7], {overlord1, overlord2, overlord3, idolOfTee, idolOfEff, idolOfArr});
			}
		}	
	}
}

/**
 * Returns an array that is 8 elements long containing numbers between 0 to 5 .
 * Used to map answers into an order of the overlords. 
 * It is 8 elements long because there are 8 possible combinations of answers that the overlords could say ("Ozo,Ozo,Ozo", "Ozo,Ozo,Ulu" etc.).
 * Numbers from 0 to 5 must appear once in the mapping list (there is a total of 6 different possible orders for the overlords).
 * I don't know yet what the remaining two numbers are so I am selecting them randomly.
 * @returns 
 */
const getRandomizedMapping = () => {
	let array = [];
	array.push(0,1,2,3,4,5, getRandomInt(6), getRandomInt(6));

	shuffle(array);
	return array;
}

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