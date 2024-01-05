import { LitElement, html, css } from 'lit';

export class AddBook extends LitElement {
  static get properties() {
    return {
      book: { type: String },
      author: { type: String },
      genre: { type: String },
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
    this.book = '';
    this.author = '';
    this.genre = '';
  }

  connectedCallback() {
    super.connectedCallback();
    this.updateComplete.then(() => {
      const shadowRoot = this.shadowRoot;
      console.log('shadowRoot', shadowRoot);
      const form = shadowRoot.getElementById('add-book-form');
      console.log('form', form);
      form.addEventListener('submit', this.handleFormSubmit);
    });
  }

  handleFormSubmit = async (e) => {
    e.preventDefault();
    const bookName = e.target.bookInput.value;
    const authorName = e.target.authorInput.value;
    const genreName = e.target.genreInput.value;
    console.log(bookName, authorName, genreName);
    const bookData = { name: bookName, author: authorName, genre: genreName };
    try {
      const response = await fetch('http://127.0.0.1:5000/addBook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });
      const data = await response.json();
      console.log('data', data);
      console.log('response is ok', response);
      this.dispatchEvent(new CustomEvent('data-changes', { detail: data }));
    } catch (error) {
      console.error('Error adding book', error);
    }
  };

  render() {
    return html`
      <div>
        <form id="add-book-form">
          <input id="bookInput" type="text" placeholder="Book" />
          <input id="authorInput" type="text" placeholder="Author" />
          <input id="genreInput" type="text" placeholder="Genre" />
          <button type="submit" @submit=${this.handleFormSubmit}>Add Book</button>
        </form>
      </div>
    `;
  }
}

customElements.define('add-book', AddBook);
