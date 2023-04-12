import Component from '../util/Component.js';

class ObservableInput extends Component {
  constructor(id, options) {
    super(id, options);
    this.element.addEventListener('input', this.#handleInput.bind(this));
  }

  // this method may be overriden
  onValueInput(value) {}

  #handleInput(event) {
    this.onValueInput(event.target.value);
  }

  setInputValue(value, silent = false) {
    this.element.value = value;
    if (!silent) this.onValueInput(value);
  }
}

export default ObservableInput;
