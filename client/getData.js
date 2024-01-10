import { LitElement, html, css } from 'lit';
import { AddBook } from './addBook.js';
import { deleteBook } from './deleteBook.js';
import { editBook } from './editBook.js';
import { produce } from 'immer';

export class GetData extends LitElement {
  static get properties() {
    return {
      data: { type: Array },
      books: { type: Array },
      authors: { type: Array },
    };
  }
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
        background-color: #f0f0f0;
        border-radius: 1rem;
      }

      h1 {
        margin-bottom: 2rem;
      }

      ul {
        list-style: none;
        padding: 0;
      }

      li {
        margin-bottom: 1rem;
      }
    `;
  }

  constructor() {
    super();
    this.data = [];
    this.books = [];
    this.authors = [];
    this.isLoading = false;
  }

  // connectedCallback() {
  //   super.connectedCallback();
  //   document.getElementById('add-book').addEventListener('data-changes', handleBookAdded);
  //   document.getElementById('delete-book').addEventListener('delete-book', handleNewList);
  //   document.getElementById('edit-book').addEventListener('edit-book', handleNewList);

  // }
  // disconnectedCallback() {
  //   super.disconnectedCallback();
  //   document.getElementById('add-book').removeEventListener('data-changes', handleBookAdded);
  //   document.getElementById('delete-book').removeEventListener('delete-book', handleNewList);
  //   document.getElementById('edit-book').removeEventListener('edit-book', handleNewList);
  // }

  // this.addEventListener give the component access
  // Window.addEventListener gives global access
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('data-changes', this.handleBookAdded.bind(this));
    this.addEventListener('delete-book', this.handleNewList.bind(this));
    this.addEventListener('edit-book', this.handleNewList.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('data-changes', this.handleBookAdded);
    this.removeEventListener('delete-book', this.handleNewList);
    this.removeEventListener('edit-book', this.handleNewList);
  }

  handleBookAdded(e) {
    const data = e.detail;
    const lastBook = data[data.length - 1];
    console.log('detail', data);
    //this.books = [...this.books, html`<li>${lastBook}</li>`]; //Without Immer we need to use a shallow copy
    this.books = produce(this.books, (draft) => {
      draft.push(lastBook);
    });
  }

  handleNewList(e) {
    const data = e.detail;
    console.log('detail', data);

    this.books = produce(this.books, (draft) => {
      draft.length = 0; // Emptying the previous array
      data.forEach((book) => {
        draft.push(book);
      });
    });
  }

  async connectedCallback() {
    super.connectedCallback();
    this.isLoading = true;
    const path = 'http://127.0.0.1:5000/fetchBooks';
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error('Network response not ok');
      }
      console.log('response', response);
      const data = await response.json();
      console.log('data', data);

      this.books = produce(this.books, (draft) => {
        for (let i = 0; i < data.length; i++) {
          draft.push(data[i]);
        }
      });

      console.log('this.books', this.books);
    } catch (error) {
      console.error('Error fetching');
    }
    this.isLoading = false;
  }

  renderBooks() {
    return this.books.map((book) => {
      return html`<li>${book}</li>`;
    });
  }

  render() {
    if (this.isLoading) {
      console.log('isLoading');
      return html`<p>Loading...</p>`;
    } else {
      console.log('Loaded');
      return html`
        <div>
          <h1>Books</h1>
          <ul>
            ${this.renderBooks()}
          </ul>
        </div>
        <add-book id="add-book" @data-changes=${this.handleBookAdded}></add-book>
        <delete-book id="delete-book" @delete-book=${this.handleNewList}></delete-book>
        <edit-book id="edit-book" @edit-book=${this.handleNewList}></edit-book>
      `;
    }
  }
}

customElements.define('get-data', GetData);
