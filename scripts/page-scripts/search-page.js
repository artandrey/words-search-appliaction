import Component from '../util/Component.js';
import CrossWindowTextShareService from '../util/CrossWindowTextShareService.js';
import redirection from '../util/redirection.js';
import FormComponent from '../reusable-components/FormComponent.js';
import isStringStartsWithAvoidingCase from '../util/is-string-substring.js';
import createElement from '../util/create-element.js';
import ObservableInput from '../reusable-components/ObservableInput.js';
import debounce from '../util/debounce.js';
import TextProcessor from '../util/TextProcessor.js';
import TableComponent from '../reusable-components/TableComponent.js';
import addEnterInteractionForTabindexedLabels from '../util/add-enter-interaction-for-tabindexed-labels.js';
import oddEvenMap from '../util/odd-even-map.js';

addEnterInteractionForTabindexedLabels();

const textShareService = new CrossWindowTextShareService('value');

if (!textShareService.isTextAvailable()) {
  redirection('/');
}

const textProsessor = new TextProcessor(textShareService.getText());

console.log(textProsessor.splitByWordIncludingIt('cs'));

class TextComponentWithMarkFunctionality extends Component {
  #markWord = null;
  #text = null;

  constructor(id, text) {
    super(id);
    this.setText(text);
    this.#displayText();
  }

  setMarkWord(word) {
    this.#markWord = word;
    this.#displayText();
  }

  setText(text) {
    this.#text = text;
    this.#displayText();
  }

  #createMarkedTextMarkup(text, markWord) {
    return oddEvenMap(new TextProcessor(text).splitByWordIncludingIt(markWord), (paragraphPart, isOdd) =>
      isOdd
        ? paragraphPart
        : createElement(
            'mark',
            {
              'data-scroll-to': true,
            },
            paragraphPart
          )
    );
  }

  #displayText() {
    this.element.replaceChildren(
      ...this.#text
        .split(/\n\s|\n/)
        .map((paragraph) =>
          createElement('p', undefined, this.#markWord ? this.#createMarkedTextMarkup(paragraph, this.#markWord) : paragraph)
        )
    );

    document.querySelector('[data-scroll-to]')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }
}

class SearchForm extends FormComponent {
  onResolvedSubmit = null;
  onSubmit(formData) {
    const word = formData.get('search-query');
    this.onResolvedSubmit && this.onResolvedSubmit(word);
  }
}

class SuggectionsFilter {
  #suggestions = new Set();
  #searchQuery = null;

  setSuggestions(suggestions) {
    this.#suggestions = new Set(suggestions);
  }

  getSuggestionsArray() {
    return [...this.#suggestions];
  }

  setSearchQuery(searchQuery) {
    this.#searchQuery = searchQuery;
  }

  getFilteredList() {
    return this.#searchQuery
      ? this.getSuggestionsArray().filter((suggestion) => isStringStartsWithAvoidingCase(suggestion, this.#searchQuery))
      : [];
  }
}

class SuggestionsList extends Component {
  #suggestionsFilter = new SuggectionsFilter();

  constructor(id, options) {
    super(id, options);
    this.#suggestionsFilter.setSuggestions(this.options.suggestions);
    this.element.addEventListener('change', this.#handleSuggestionSelect.bind(this));
  }

  setSearchQuery(searchQuery) {
    this.#suggestionsFilter.setSearchQuery(searchQuery);
    this.#displayElements();
  }

  #handleSuggestionSelect(event) {
    this.onSuggesionSelect(event.target.value);
  }

  //this method may be overriden
  onSuggesionSelect(value) {}

  #displayElements() {
    const filteredItems = this.#suggestionsFilter.getFilteredList();
    const elements = filteredItems
      .sort((a, b) => a.length - b.length)
      .map((suggestion) =>
        createElement(
          'li',
          {
            class: 'suggestion-item',
          },
          createElement(
            'label',
            {
              tabindex: 0,
            },
            [
              createElement('input', {
                class: 'hidden',
                value: suggestion,
                type: 'radio',
                name: this.element.id,
              }),
              suggestion,
            ]
          )
        )
      );
    this.element.replaceChildren(...elements);
  }
}

class InputWithSuggestions {
  #input;
  #suggestionsList;
  constructor(inputId, suggestionListId, { suggestions = [] }) {
    this.#input = new ObservableInput(inputId);
    this.#suggestionsList = new SuggestionsList(suggestionListId, {
      suggestions,
    });

    this.#input.onValueInput = debounce(this.search.bind(this), 250);
    this.#suggestionsList.onSuggesionSelect = (value) => {
      this.#input.setInputValue(value, true);
      this.#suggestionsList.setSearchQuery(null);
      this.#input.element.focus();
    };
  }

  search(value) {
    this.#suggestionsList.setSearchQuery(value);
  }
}

class WordsCountTable extends TableComponent {
  constructor(id, wordsCount) {
    super(id, {
      heading: ['Words', 'Count'],
      rows: Object.entries(wordsCount),
    });
  }
}

const wordsCountTable = new WordsCountTable('words-count-table', textProsessor.getWordsInstancesCount());
const textComponent = new TextComponentWithMarkFunctionality('text-content', textShareService.getText());
const inputWithSuggestions = new InputWithSuggestions('search-input', 'suggestions-list', {
  suggestions: textProsessor.getSingleInstanceWords(),
});
const searchForm = new SearchForm('search-form');
searchForm.onResolvedSubmit = (value) => {
  textComponent.setMarkWord(value);
  inputWithSuggestions.search(null);
};

// for chcecking words in different locales
// /\b[\p{L}]+\b/ugi
