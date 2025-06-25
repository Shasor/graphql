const app = document.body;

export function showLogin() {
  app.innerHTML = '';
  const loginForm = document.createElement('login-form');
  loginForm.addEventListener('login-success', () => {
    showProfile();
  });
  app.appendChild(loginForm);
}

export function showProfile() {
  app.innerHTML = '';
  const profilePage = document.createElement('profile-page');
  profilePage.addEventListener('logout', () => {
    showLogin();
  });
  app.appendChild(profilePage);
}
