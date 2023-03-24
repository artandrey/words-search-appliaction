import Component from '../util/Component.js';
import CrossWindowTextShareService from '../util/CrossWindowTextShareService.js';
import redirection from '../util/redirection.js';

const textShareService = new CrossWindowTextShareService('value');

if (!textShareService.isTextAvailable()) {
  redirection('/');
}

class TextComponentWithMarkFunctionality extends Component {
  #markWord = null;
  #text = null;

  constructor(id, text) {
    super(id);
    this.setText(text);
    this.#displayText();
  }

  setMarkWord(word) {
    this.#markWord = word;
    this.#displayText();
  }

  setText(text) {
    this.#text = text;
    this.#displayText();
  }

  #displayText() {
    if (!this.#markWord) {
      this.element.textContent = this.#text;
      return;
    }
  }
}

const textComponent = new TextComponentWithMarkFunctionality(
  'text-content',
  textShareService.getText()
);
