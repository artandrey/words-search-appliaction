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

class DropableFileArea extends Component {
  constructor(id, options) {
    super(id, options);
    this.element.addEventListener('dragenter', this.handleDragEtner.bind(this));
    this.element.addEventListener('dragover', this.handleDragOver.bind(this));
    this.element.addEventListener('dragleave', this.handleDragLeave.bind(this));
    this.element.addEventListener('drop', this.handleDrop.bind(this));
  }

  handleDragLeave() {
    this.element.classList.remove('active');
  }

  handleDragEtner() {
    this.element.classList.add('active');
  }

  handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    this.element.classList.remove('active');

    const files = event.dataTransfer.files;
    if (!this.#checkFiels(files)) {
      alert('Invalid file format');
      return;
    }

    this.onFileSelect(files);
  }

  //this method may be overriden
  onFileSelect(files) {}

  #checkFiels(files) {
    const { single, format } = this.options;
    if (!files.length) return false;
    if (single && files.length !== 1) return false;
    if (format) {
      return [...files].every((file) => file.type === format);
    }
    return true;
  }

  handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();

    event.dataTransfer.dropEffect = 'copy';
  }
}

class FileInput extends Component {
  constructor(id, options) {
    super(id, options);

    const { indicationId, dropableAreaId } = this.options;
    this.indicationTextComponent = new FileIndicationText(indicationId);
    this.dropableArea = new DropableFileArea(dropableAreaId, {
      single: true,
      format: 'text/plain',
    });

    this.dropableArea.onFileSelect = this.#handleFileDroped.bind(this);

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

  #handleFileDroped(fileList) {
    this.#onFileSelect(fileList);
  }

  #onFileSelect(fileList) {
    this.element.files = fileList;
    const file = fileList[0];
    this.indicationTextComponent.setFileInfo(file.name, file.size);
  }

  #handleChange(event) {
    const file = event.target.files[0];
    if (!file) {
      this.indicationTextComponent.resetFileInfo();
      return;
    }
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
new FileInput('file-input', { indicationId: 'filename', dropableAreaId: 'file-dropable-area' });
