import { LitElement, html, css } from 'lit';

export class deleteBook extends LitElement {
  static get properties() {
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
    //logic for accessing the shadow root form and adding an event listener to it
    super.connectedCallback();
    this.updateComplete.then(() => {
      const shadowRoot = this.shadowRoot;
      const form = shadowRoot.getElementById('delete-book-form');
      form.addEventListener('submit', this.handleFormSubmit);
    });
  }

  handleFormSubmit = async (e) => {
    e.preventDefault();
    //logic for deleting book from database
    const book = e.target.bookName.value;
    const bookData = { name: book };
    try {
      const response = await fetch('http://127.0.0.1:5000/deleteBook', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });
      const data = await response.json();
      console.log('data', data);
      this.dispatchEvent(new CustomEvent('delete-book', { detail: data }));
    } catch (error) {
      console.error('Could not delete', error);
    }
  };

  render() {
    return html` <div>
      <form id="delete-book-form">
        <input id="bookName" type="text" placeholder="Book Name" />
        <button type="submit" @submit=${this.handleFormSubmit}>Delete Book</button>
      </form>
    </div>`;
  }
}

customElements.define('delete-book', deleteBook);
