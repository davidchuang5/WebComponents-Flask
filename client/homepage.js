// import { LitElement, html } from 'lit';

// export class SimpleGreeting extends LitElement {
//   static get properties() {
//     return {
//       name: {},
//       data: { type: String },
//     };
//   }

//   constructor() {
//     super();
//     this.name = 'Hello from the frontend';
//   }

//   async connectedCallback() {
//     super.connectedCallback();
//     const path = 'http://127.0.0.1:5000';
//     try {
//       const response = await fetch(path);
//       if (!response.ok) {
//         throw new Error('Network response not ok for /endpoint');
//       }
//       const data = await response.text();
//       this.data = data;
//       console.log('data', this.data);
//     } catch (error) {
//       console.error('Error fetching /endpoint', error);
//     }
//   }

//   render() {
//     return html`<div>
//       <h1>${this.name}!</h1>
//       <br />
//       <p>${this.data}</p>
//     </div>`;
//   }
// }

// customElements.define('simple-greeting', SimpleGreeting);
