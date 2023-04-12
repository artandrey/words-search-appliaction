import memoize from './memoize.js';

class TextProcessor {
  #text = '';

  static ACCEPTEBLE_CHARACTERS = `[!-.]|[:;\?«»\\s]`;

  constructor(text) {
    this.#text = text;
    this.getWords = memoize(this.getWords.bind(this));
    this.getWordsInstancesCount = memoize(this.getWordsInstancesCount.bind(this));
    this.getSingleInstanceWords = memoize(this.getSingleInstanceWords.bind(this));
  }

  getWords() {
    const wordRegex = new RegExp(
      `(?<=${TextProcessor.ACCEPTEBLE_CHARACTERS}|^)[\\p{L}']{2,}(?=${TextProcessor.ACCEPTEBLE_CHARACTERS}|$)`,
      'gui'
    );
    const mathcedStrings = this.#text.match(wordRegex);
    return Array.from(mathcedStrings);
  }

  getWordsInstancesCount() {
    const wordsCount = {};
    this.getWords().forEach((word) => {
      const lowerCaseWord = word.toLowerCase();
      if (lowerCaseWord in wordsCount) {
        wordsCount[lowerCaseWord]++;
      } else {
        wordsCount[lowerCaseWord] = 1;
      }
    });
    return wordsCount;
  }

  getSingleInstanceWords() {
    return Array.from(new Set(this.getWords().map((matchedString) => matchedString.toLowerCase())));
  }

  splitByWordIncludingIt(word) {
    const selectedWordRegex = new RegExp(
      `(?<=${TextProcessor.ACCEPTEBLE_CHARACTERS}|^)(${word})(?=${TextProcessor.ACCEPTEBLE_CHARACTERS}|$)`,
      'gui'
    );
    return this.#text.split(selectedWordRegex);
  }
}

export default TextProcessor;
