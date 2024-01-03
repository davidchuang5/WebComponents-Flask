import { LitElement, html } from 'lit';
import { AddBook } from './addBook.js';
import { deleteBook } from './deleteBook.js';

export class GetData extends LitElement {
  static get properties() {
    return {
      data: { type: Array },
      books: { type: Array },
      authors: { type: Array },
    };
  }

  constructor() {
    super();
    this.data = [];
    this.books = [];
    this.authors = [];
  }

  connectedCallback() {
    super.connectedCallback();
    document.getElementById('add-book').addEventListener('data-changes', handleBookAdded);
    document.getElementById('delete-book').addEventListener('delete-book', handleBookDeleted);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.getElementById('add-book').removeEventListener('data-changes', this.handleBookAdded);
    document.getElementById('delete-book').removeEventListener('delete-book', handleBookDeleted);
  }

  handleBookAdded(e) {
    const data = e.detail;
    const lastBook = data[data.length - 1];
    console.log('detail', data);
    this.books = [...this.books, html`<li>${lastBook}</li>`];
    //this.dispatchEvent(new CustomEvent('data-changes', { detail: this.data }));
    this.requestUpdate();
  }

  handleBookDeleted(e) {
    const data = e.detail;
    console.log('detail', data);
    this.books = data.map((bookName) => {
      return html`<li>${bookName}</li>`;
    });
  }

  async connectedCallback() {
    super.connectedCallback();
    // this.addEventListener('rerender', this.handleBookAdded);
    const path = 'http://127.0.0.1:5000/fetchBooks';
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error('Network response not ok');
      }
      console.log('response', response);
      const data = await response.json();
      console.log('data', data);
      this.books = data.map((bookName) => {
        return html`<li>${bookName}</li>`;
      });
      // this.dispatchEvent(new CustomEvent('data-changes', { detail: this.data }));
      console.log('this.books', this.books);
    } catch (error) {
      console.error('Error fetching');
    }
  }

  render() {
    return html`
      <div>
        <h1>Books</h1>
        <ul>
          ${this.books}
        </ul>
      </div>
      <add-book id="add-book" @data-changes=${this.handleBookAdded}></add-book>
      <delete-book id="delete-book" @delete-book=${this.handleBookDeleted}></delete-book>
    `;
  }
}

customElements.define('get-data', GetData);
