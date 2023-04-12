import Component from '../util/Component.js';
import createElement from '../util/create-element.js';

class TableComponent extends Component {
  constructor(id, options) {
    super(id, options);
    this.#displayTable();
  }

  #createTableHeading() {
    return createElement(
      'thead',
      undefined,
      createElement(
        'tr',
        undefined,
        this.options.heading.map((title) => createElement('th', undefined, title))
      )
    );
  }

  #createTableBody() {
    return createElement(
      'tbody',
      undefined,
      this.options.rows.map((row) =>
        createElement(
          'tr',
          undefined,
          row.map((content) => createElement('td', undefined, content))
        )
      )
    );
  }

  #displayTable() {
    const table = createElement('table', undefined, [this.#createTableHeading(), this.#createTableBody()]);
    this.element.replaceChildren(table);
  }
}

export default TableComponent;
