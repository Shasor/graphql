import { removeJWT } from '../utils/jwt.js';

export class ProfilePage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.querySelector('#logoutBtn').addEventListener('click', () => {
      removeJWT();
      this.dispatchEvent(new CustomEvent('logout', { bubbles: true }));
    });
  }

  render() {
    this.innerHTML = `
      <div class="min-h-screen flex flex-col items-center bg-gray-100 p-6">
        <h1 class="text-3xl font-bold mb-6">Welcome !</h1>
        <button id="logoutBtn" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
          Logout
        </button>
      </div>
    `;
  }
}
