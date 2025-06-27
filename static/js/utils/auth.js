import { state } from '../main.js';
import { graphqlQuery } from './api.js';
import { USER_INFO_QUERY, USER_MODULE_QUERY, USER_XP_LEVEL_QUERY, USER_XP_QUERY } from './queries.js';

const app = document.body;

export function showLogin() {
  app.innerHTML = '';
  const loginForm = document.createElement('c-form');
  loginForm.addEventListener('login-success', () => {
    showProfile();
  });
  app.appendChild(loginForm);
}

export async function showProfile() {
  app.innerHTML = '';
  await loadState();
  const profilePage = document.createElement('c-profile');
  profilePage.addEventListener('logout', () => {
    showLogin();
  });
  app.appendChild(profilePage);
}

export async function loadState() {
  const modules = await graphqlQuery(USER_MODULE_QUERY);
  state.userModules = modules.user[0].events;
  if (!state.currentModule) state.currentModule = state.userModules[0].event.id;
  state.userInfo = await graphqlQuery(USER_INFO_QUERY);
  state.userAttrs = state.userInfo.user[0].attrs;
  const xp = await graphqlQuery(USER_XP_QUERY(state.currentModule));
  state.userXP = xp.transaction_aggregate.aggregate.sum.amount;
  const level = await graphqlQuery(USER_XP_LEVEL_QUERY(state.userInfo.user[0].login, state.currentModule));
  state.userXPlevel = level.event_user[0].level;
}
