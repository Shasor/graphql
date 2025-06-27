import { LoginForm } from './components/LoginForm.js';
import { ProfilePage } from './components/ProfilePage.js';
import { Section } from './components/Section.js';
import { showLogin, showProfile } from './utils/auth.js';
import { isJwtValid, loadJWT, removeJWT } from './utils/jwt.js';

export const state = {
  currentModule: null,
  userModules: null,
  userInfo: null,
  userAttrs: null,
  userXP: null,
  userXPlevel: null,
};

document.addEventListener('DOMContentLoaded', () => {
  const jwt = loadJWT();
  if (isJwtValid(jwt)) {
    showProfile();
  } else {
    removeJWT();
    showLogin();
  }
});

customElements.define('c-form', LoginForm);
customElements.define('c-profile', ProfilePage);
customElements.define('c-section', Section);
