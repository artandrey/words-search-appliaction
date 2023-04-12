import FormComponent from '../reusable-components/FormComponent.js';
import addEnterInteractionForTabindexedLabels from '../util/add-enter-interaction-for-tabindexed-labels.js';
import Component from '../util/Component.js';
import CrossWindowTextShareService from '../util/CrossWindowTextShareService.js';
import redirection from '../util/redirection.js';

addEnterInteractionForTabindexedLabels();

class FileIndicationText extends Component {
  #fileInformation = null;
  constructor(id) {
    super(id);
  }

  setFileInfo(name, size) {
    this.#fileInformation = { name, size };

    this.#updateFileInformation();
  }

  resetFileInfo() {
    this.#fileInformation = null;
    this.#updateFileInformation();
  }

  #updateFileInformation() {
    this.element.textContent = this.#fileInformation
      ? `File ${this.#fileInformation.name} selected (${this.#fileInformation.size}bite)`
      : 'Nothing selected';
  }
}

class FileInput extends Component {
  constructor(id, options) {
    super(id, options);

    const { indicationId } = this.options;
    this.indicationTextComponent = new FileIndicationText(indicationId);
    this.element.addEventListener('change', this.#handleChange.bind(this));
    window.addEventListener(
      'load',
      () => {
        const file = this.element.files[0];
        if (file) this.indicationTextComponent.setFileInfo(file.name, file.size);
      },
      { once: true }
    );
  }

  #handleChange(event) {
    const file = event.target.files[0];
    if (!file) {
      this.indicationTextComponent.resetFileInfo();
      return;
    }
    this.indicationTextComponent.setFileInfo(file.name, file.size);
  }
}

class UserInputForm extends FormComponent {
  async onSubmit(formData) {
    const inputMode = formData.get('input-mode');
    let text = '';
    if (inputMode === 'text') {
      text = formData.get('text');
    } else if (inputMode === 'file') {
      text = await this.#convertFileToText(formData.get('file'));
    }

    text.trim();

    if (!text) {
      alert('You must enter something before countinue');
      return;
    }

    const textShareService = new CrossWindowTextShareService('value');

    textShareService.saveText(text);

    redirection('./search-page.html');
  }

  #convertFileToText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (event) => {
        reject(event);
      };

      reader.readAsText(file);
    });
  }
}

new UserInputForm('text-form');
new FileInput('file-input', { indicationId: 'filename' });
