import { state } from '../main.js';
import { graphqlQuery } from './api.js';
import { isModuleValid, loadModule, removeModule } from './current_module.js';
import { CreateLoadingBtn } from './others.js';
import { USER_AUDIT_QUERY, USER_INFO_QUERY, USER_MODULE_QUERY, USER_XP_LEVEL_QUERY, USER_XP_PER_PROJECT_QUERY, USER_XP_QUERY } from './queries.js';

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
  await updateState();
  const profilePage = document.createElement('c-profile');
  profilePage.addEventListener('logout', () => {
    showLogin();
  });
  app.appendChild(profilePage);
}

export async function updateState(changeModule = false) {
  const loading = CreateLoadingBtn();
  document.body.appendChild(loading);
  // user modules
  if (!state.user.modules) await fetchUserModules();
  // currentModule for module selection on profile page
  const module = loadModule();
  if (isModuleValid(module)) state.currentModule = module;
  else {
    removeModule();
    state.currentModule = state.user.modules[0].event.id;
  }
  // user info, attrs & xp up and down
  if (!state.user.info) await fetchUserInfo();
  if (changeModule || !state.user.xp.amount) await fetchUserXpAmount();
  // user xp level
  if (changeModule || !state.user.xp.level) await fetchUserXpLevel();
  // user audit
  if (!state.user.audits) await fetchUserAudit();
  if (changeModule || !state.user.xp.project) await fetchUserXpPerProject();
  loading.remove();
}

export async function fetchUserModules() {
  const modules = await graphqlQuery(USER_MODULE_QUERY);
  state.user.modules = modules.user[0].events;
}

export async function fetchUserInfo() {
  const info = await graphqlQuery(USER_INFO_QUERY);
  state.user.info = info.user[0];
  state.user.xp.up = state.user.info.totalUp;
  state.user.xp.down = state.user.info.totalDown;
  state.user.attrs = state.user.info.attrs;
}

export async function fetchUserXpAmount() {
  const xp = await graphqlQuery(USER_XP_QUERY(state.currentModule));
  state.user.xp.amount = xp.transaction_aggregate.aggregate.sum.amount;
}

export async function fetchUserXpLevel() {
  const level = await graphqlQuery(USER_XP_LEVEL_QUERY(state.user.info.login, state.currentModule));
  state.user.xp.level = level.event_user[0].level;
}

export async function fetchUserAudit() {
  const audits = await graphqlQuery(USER_AUDIT_QUERY(state.user.info.login, true));
  state.user.audits = audits.audit;
}

export async function fetchUserXpPerProject() {
  const xpPerProject = await graphqlQuery(USER_XP_PER_PROJECT_QUERY(state.currentModule));
  state.user.xp.project = xpPerProject.transaction;
}
