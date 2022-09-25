class Logger {
	
	#gameId = 0;
	#log = [];
	
	constructor() {
		
	}
	addLog(gameLogObject){
		gameLogObject.id = this.#gameId;
		this.#log.push(gameLogObject);
		this.#gameId ++;
	}
	
	getNumberOfGames(){
		return this.#log.length;
	}
	
	getNumberOfWonGames(){
		return this.#log.filter(game => game.victory).map(game => game.victory).length;
	}
	
	getLog(){
		return this.#log;
	}
	
	
	clear(){
		return this.#log = [];
	}

	getAnswersToOverlordsMap(){
		const statistics = new Map();
		
		this.#log.forEach(gameLog => {
			const answers = [gameLog.questionsAndAnswers[0].answer, gameLog.questionsAndAnswers[1].answer, gameLog.questionsAndAnswers[gameLog.questionsAndAnswers.length-1].answer];
			
			const answersString = answers.join();
			
			const overlordsNames = gameLog.overlords.map(o => o.getName()).join();
			
			if (statistics.has(answersString)){
				const answers = statistics.get(answersString);
				const entry = answers.find(answer => answer.overlordsNames == overlordsNames);
				
				if (entry){
					entry.count++;
				} else {
					answers.push({"overlordsNames": overlordsNames, count: 1});
				}
			} else {
				statistics.set(answersString, [{"overlordsNames": overlordsNames, count: 1}]);
			}
		
		});

		return new Map([...statistics.entries()].sort()); //Sorting the keys so that they will always appear in a specific order.
	}
}


class Word {
	constructor(pronunciation, meaning) {
		this.pronunciation = pronunciation;
		this.meaning = meaning === true;
	}
	
	getPronunciation() {
		return this.pronunciation;
	}

	getEnglishTranslation() {
		return this.meaning == true ? "Yes" : "No";
	}

	getMeaning() {
		return this.meaning;
	}
}

class Idol{
	constructor(id, name) {
		this.id = id;
		this.name = name;
	}
	
	getId(){
		return this.id;
	}
	
	getName(){
		return this.name;
	}
}

class Overlord {
	constructor(id, name, trueWord, falseWord) {
		this.id = id;
		this.name = name;
		this.trueWord = trueWord;
		this.falseWord = falseWord;
	}
	
	giveIdol(idol){
		this.idol = idol;
		this.pleased = this.idol.getId() === this.id;
	}

	getId(){
		return this.id;
	}

	getName(){
		return this.name;
	}

	getTrueAnswer (){
		return this.trueWord;
	}

	getFalseAnswer (){
		return this.falseWord;
	}

	getAnswer(id, {wordReference1, wordReference2}) {
		throw new Exception('Not supported');

	}
	
	getOpinion(){
		if (this.idol == null){
			return 'Give me an idol, you fool. I am displeased!';
		}
		
		return `I am ${this.name}. You gave me the ${this.idol.name}. I am ${this.pleased ? 'pleased': 'displeased'}!`;
	}
	
	isPleased(){
		return this.pleased == true;
	}
}

class TruthfulOverlord extends Overlord {
	constructor(id, name, trueWord, falseWord) {
		super(id, name, trueWord, falseWord);
	}

	getAnswer(id, references) {
		const {wordReference1, wordReference2, overlordReference } = references || {};
		
		if (id == obviousQuestion.id){
			return this.getTrueAnswer();
			
		} else if (id == referenceQuestion.id){
		
			if (wordReference1.getMeaning() == true) {
				return this.getTrueAnswer();
			} else if (wordReference1.getMeaning() == false){
				return this.getFalseAnswer();
			}
		} else if (id == answerComparisonQuestion.id) {
			if (wordReference1.getMeaning() == true && wordReference2.getMeaning() === true) {
				return this.getTrueAnswer();
			}
			return this.getFalseAnswer();
		} else if (id == randomOverlordIdentityQuestion.id) {
			if (overlordReference instanceof RandomOverlord) {
				return this.getTrueAnswer();
			}
			return this.getFalseAnswer();
		}
		
		return new Word('Hmm?', undefined); //If this answer is reached, something is wrong with my code.
	}
}

class LyingOverlord extends Overlord {
	constructor(id, name, trueWord, falseWord) {
		super(id, name, trueWord, falseWord);
	}

	getAnswer(id, references) {
		const {wordReference1, wordReference2, overlordReference } = references || {};
		
		if (id == obviousQuestion.id){
			return this.getFalseAnswer();
			
		} else if (id == referenceQuestion.id){

			if (wordReference1.getMeaning() == true) {
				return this.getFalseAnswer();
			} else if (wordReference1.getMeaning() == false){
				return this.getTrueAnswer();
			}
		} else if (id == answerComparisonQuestion.id) {
			if (wordReference1.getMeaning() == true && wordReference2.getMeaning() === true) {
				return this.getFalseAnswer();
			}
			return this.getTrueAnswer();
		} else if (id == randomOverlordIdentityQuestion.id) {
			if (overlordReference instanceof RandomOverlord) {
				return this.getFalseAnswer();
			}
			return this.getTrueAnswer();
		}
		return new Word('Hmm?', undefined);
	}
}

class RandomOverlord extends Overlord {
	constructor(id, name, trueWord, falseWord) {
		super(id, name, trueWord, falseWord);
	}

	getAnswer() {
		const randomizer = getRandomInt(2);
		return randomizer == 0 ? this.getTrueAnswer() : this.getFalseAnswer();
	}
}
