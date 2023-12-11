import { LitElement, html } from 'lit';

export class GetData extends LitElement {
  static get properties() {
    return {
      data: { type: String },
    };
  }

  constructor() {
    super();
  }

  async connectedCallback() {
    super.connectedCallback();
    const path = 'http://127.0.0.1:5000/test';
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error('Network response not ok');
      }
      console.log('response', response);
      const data = await response.text();
      console.log('data', data);
      this.data = data;
    } catch (error) {
      console.error('Error fetching');
    }
  }

  render() {
    return html`
      <div>
        <p>${this.data}</p>
      </div>
    `;
  }
}

customElements.define('get-data', GetData);
