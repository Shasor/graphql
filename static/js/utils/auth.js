import { state } from '../main.js';
import { graphqlQuery } from './api.js';
import { CreateLoadingBtn } from './others.js';
import { USER_AUDIT_QUERY, USER_INFO_QUERY, USER_MODULE_QUERY, USER_XP_LEVEL_QUERY, USER_XP_QUERY } from './queries.js';

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
  const loading = CreateLoadingBtn();
  document.body.appendChild(loading);
  if (!state.currentModule) {
    const modules = await graphqlQuery(USER_MODULE_QUERY);
    state.user.modules = modules.user[0].events;
    state.currentModule = state.user.modules[0].event.id;
  }
  state.user.info = await graphqlQuery(USER_INFO_QUERY);
  state.user.xp.up = state.user.info.user[0].totalUp;
  state.user.xp.down = state.user.info.user[0].totalDown;
  state.user.attrs = state.user.info.user[0].attrs;
  const xp = await graphqlQuery(USER_XP_QUERY(state.currentModule));
  state.user.xp.amount = xp.transaction_aggregate.aggregate.sum.amount;
  const level = await graphqlQuery(USER_XP_LEVEL_QUERY(state.user.info.user[0].login, state.currentModule));
  state.user.xp.level = level.event_user[0].level;
  const audits = await graphqlQuery(USER_AUDIT_QUERY(state.user.info.user[0].login, true));
  state.user.audits = audits.audit;
  loading.remove();
}
