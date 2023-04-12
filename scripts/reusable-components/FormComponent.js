import Component from '../util/Component.js';

class FormComponent extends Component {
  constructor(id, options) {
    super(id, options);
    this.element.addEventListener('submit', this.#handleFormSubmit.bind(this));
  }

  // This method may be overriden
  onSubmit(formData, target) {}

  #handleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    this.onSubmit(formData, event.target);
  }
}

export default FormComponent;
