import { LoginForm } from './components/LoginForm.js';
import { ProfilePage } from './components/ProfilePage.js';
import { showLogin, showProfile } from './utils/auth.js';
import { isJwtValid, loadJWT, removeJWT } from './utils/jwt.js';

document.addEventListener('DOMContentLoaded', () => {
  const jwt = loadJWT();
  if (isJwtValid(jwt)) {
    showProfile();
  } else {
    removeJWT();
    showLogin();
  }
});

customElements.define('login-form', LoginForm);
customElements.define('profile-page', ProfilePage);
