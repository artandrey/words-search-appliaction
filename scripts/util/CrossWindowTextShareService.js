class CrossWindowTextShareService {
  constructor(key) {
    this.key = key;
  }

  saveText(text) {
    sessionStorage.setItem(this.key, text);
  }

  getText() {
    return sessionStorage.getItem(this.key);
  }

  isTextAvailable() {
    const text = this.getText();
    return !!text;
  }
}

export default CrossWindowTextShareService;
