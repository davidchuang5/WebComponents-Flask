import { html, LitElement, css } from 'lit';

export class editBook extends LitElement {
  static properties() {
    return {
      books: { type: Array },
    };
  }

  static get styles() {
    return css`
      form {
        display: flex;
        justify-content: center;
        flex-direction: row;
        width: 200px;
      }

      input,
      button {
        margin-bottom: 1rem;
        margin-right: 1rem;
        margin-left: 1rem;
        padding: 0.5rem;
        font-size: 12px;
      }

      button {
        background-color: brown;
        color: white;
        cursor: pointer;
      }

      button:hover {
        background-color: darkbrown;
      }
    `;
  }

  constructor() {
    super();
    this.books = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.updateComplete.then(() => {
      const shadowRoot = this.shadowRoot;
      const form = shadowRoot.getElementById('editForm');
      form.addEventListener('submit', this.handleSubmit);
    });
  }

  // Edit logic here
  handleSubmit = async (e) => {
    // Grab user input
    const bookSelection = e.target.selectBook.value;
    const bookEdit = e.target.nameChange.value;
    const frontEndData = {
      oldTitle: bookSelection,
      newTitle: bookEdit,
    };
    // send it to the backend
    try {
      const response = await fetch('http://127.0.0.1:5000/edit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(frontEndData),
      });
      // receive the response and package it up to send in detail with a custom event
      const backEndData = await response.json();
      console.log('backEndData', backEndData);
      this.dispatchEvent(new CustomEvent('edit-book'), { detail: backEndData });
    } catch (error) {
      console.error('Book does not exist or incorrectly spelled', error);
    }
  };

  render() {
    return html` <div>
      <form id="editForm">
        <input id="selectBook" type="text" placeholder="Book Name" />
        <input id="nameChange" type="text" placeholder="Edit Here" />
        <button type="submit" @submit=${this.handleSubmit}>Edit Book</button>
      </form>
    </div>`;
  }
}

customElements.define('edit-book', editBook);
