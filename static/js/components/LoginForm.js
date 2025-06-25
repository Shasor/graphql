import { signin } from '../utils/api.js';
import { saveJWT } from '../utils/jwt.js';

export class LoginForm extends HTMLElement {
  constructor() {
    super();
    this.error = null;
  }

  connectedCallback() {
    this.render();
    this.querySelector('form').addEventListener('submit', this.onSubmit.bind(this));
  }

  async onSubmit(e) {
    e.preventDefault();
    this.error = null;

    const usernameOrEmail = this.querySelector('#username').value.trim();
    const password = this.querySelector('#password').value;
    this.render();
    try {
      const jwt = await signin(usernameOrEmail, password);
      saveJWT(jwt);
      // Dispatch event to notify parent about successful login
      this.dispatchEvent(new CustomEvent('login-success', { bubbles: true }));
    } catch (err) {
      this.error = err.message;
      this.render();
    }
  }

  render() {
    this.innerHTML = `
      <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <form class="bg-white p-6 rounded shadow-md w-full max-w-sm" novalidate>
          <h2 class="text-2xl font-bold mb-4 text-center">Login</h2>
          <label for="username" class="block mb-1 font-semibold">Username or Email</label>
          <input id="username" type="text" required
            class="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          
          <label for="password" class="block mb-1 font-semibold">Password</label>
          <input id="password" type="password" required
            class="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          
          ${this.error ? `<p class="text-red-600 mb-4">${this.error}</p>` : ''}
          <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
            Sign In
          </button>
        </form>
      </div>
    `;
  }
}
