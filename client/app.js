import { LitElement, html } from 'lit';
import { GetData } from './getData.js';
// import { AddBook } from './addBook.js';

export class TopLevel extends LitElement {
  static get properties() {
    return {
      data: { type: Array },
    };
  }

  constructor() {
    super();
    this.data = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('data-change', this.handleDataChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('data-change', this.handleDataChange);
  }

  handleDataChange(e) {
    this.data = e.detail;
  }
  // handleDataChange(e) {
  //   this.data = produce(this.data, (draft) => {
  //     draft = e.detail.data;
  //   });
  // }

  render() {
    return html`<div>
      <get-data @data-changes=${this.handleDataChange}></get-data>
    </div>`;
  }
}

customElements.define('top-level', TopLevel);
