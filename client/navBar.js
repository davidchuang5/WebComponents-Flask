import { html, LitElement, css } from 'lit';

export class NavBar extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: row;
        justify-content: center;
      }

      button {
        border-radius: 5px;
        padding: 2rem;
        margin-left: 5px;
        margin-right: 5px;
      }
    `;
  }

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  render() {
    return html` <div>
      <button id="bookButton">Books</button>
      <button id="authorButton">Authors</button>
      <button id="genreButton">Genres</button>
      <div></div>
    </div>`;
  }
}

customElements.define('nav-bar', NavBar);
