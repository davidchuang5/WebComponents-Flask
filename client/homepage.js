import { LitElement, html } from 'lit';

export class SimpleGreeting extends LitElement {
  static properties = {
    name: {},
  };

  constructor() {
    super();
    this.name = 'Hello from the frontend';
  }

  render() {
    return html`<h1>${this.name}!</h1>`;
  }
}

customElements.define('simple-greeting', SimpleGreeting);
