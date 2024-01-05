import { LitElement, html } from 'lit';
import { GetData } from './getData.js';
import { NavBar } from './navBar.js';
import { enableMapSet } from 'immer';

enableMapSet();

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

  render() {
    return html`<div>
      <nav-bar></nav-bar>
      <get-data @data-changes=${this.handleDataChange}></get-data>
    </div>`;
  }
}

customElements.define('top-level', TopLevel);
