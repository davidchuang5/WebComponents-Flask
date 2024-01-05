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
  }

  connectedCallback() {
    super.connectedCallback();
    document.getElementById('add-book').addEventListener('data-changes', handleBookAdded);
    document.getElementById('delete-book').addEventListener('delete-book', handleNewList);
    document.getElementById('edit-book').addEventListener('edit-book', handleNewList);
    // this.addEventListener give the component access
    // Window.addEventListener gives global access
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.getElementById('add-book').removeEventListener('data-changes', handleBookAdded);
    document.getElementById('delete-book').removeEventListener('delete-book', handleNewList);
    document.getElementById('edit-book').removeEventListener('edit-book', handleNewList);
  }

  handleBookAdded(e) {
    const data = e.detail;
    const lastBook = data[data.length - 1];
    console.log('detail', data);
    //this.books = [...this.books, html`<li>${lastBook}</li>`]; //Without Immer we need to use a shallow copy
    this.books = produce(this.books, (draft) => {
      draft.push(lastBook);
    });
    // this.requestUpdate(); This is not needed because changing properties triggers Lit to rerender
  }

  // handleNewList(e) {
  //   const data = e.detail;
  //   console.log('detail', data);

  //   this.books = produce(this.books, (draft) => {
  //     draft.length = 0; // Emptying the previous array
  //     data.forEach((book) => {
  //       draft.push(html`<li>${book}</li>`);
  //     });
  //   });
  //   // this.books = data.map((bookName) => {
  //   //   return html`<li>${bookName}</li>`;
  //   // });
  // }

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

  renderBooks() {
    this.books.map((book) => {
      html`<li>${book}</li>`;
    });
  }

  render() {
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

customElements.define('get-data', GetData);
