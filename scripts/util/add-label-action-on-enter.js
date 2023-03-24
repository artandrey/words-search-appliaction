const addLabelActionOnEnter = (label) => {
    label?.addEventListener('keypress', event => {
        if (event.key === 'Enter') {
            document.getElementById(label.getAttribute('for'))?.click();
        }
    });
}

export default addLabelActionOnEnter;