import addLabelActionOnEnter from "./add-label-action-on-enter.js";

const addEnterInteractionForTabindexedLabels = () => {
    document.querySelectorAll('[for][tabindex]').forEach(el => addLabelActionOnEnter(el));
}

export default addEnterInteractionForTabindexedLabels;