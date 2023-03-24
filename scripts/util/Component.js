class Component {
    constructor(id, options = {}) {
        this.options = options;
        this.element = document.getElementById(id);
    }
}

export default Component;