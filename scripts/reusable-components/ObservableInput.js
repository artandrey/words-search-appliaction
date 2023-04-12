import Component from '../util/Component.js';

class ObservableInput extends Component {
  constructor(id, options) {
    super(id, options);
    this.element.addEventListener('input', this.#handleInput.bind(this));
  }

  // this method may be overriden
  onValueInput(value) {}

  #handleInput(event) {
    const { trim } = this.options;
    const value = event.target.value;
    this.onValueInput(trim ? value.trim() : value);
  }

  setInputValue(value, silent = false) {
    this.element.value = value;
    if (!silent) this.onValueInput(value);
  }
}

export default ObservableInput;
