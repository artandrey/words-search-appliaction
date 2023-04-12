const addEnterInteractionForTabindexedLabels = () => {
  addEventListener('keypress', (event) => {
    if (event.target.nodeName === 'LABEL' && event.target.hasAttribute('tabindex')) {
      if (event.key === 'Enter') {
        const forValue = event.target.getAttribute('for');
        forValue ? document.getElementById(forValue)?.click() : event.target.querySelector('input')?.click();
      }
    }
  });
};

export default addEnterInteractionForTabindexedLabels;
