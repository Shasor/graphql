import { state } from '../main.js';

export function saveModule(value) {
  localStorage.setItem('current_module', value);
}

export function loadModule() {
  return localStorage.getItem('current_module');
}

export function removeModule() {
  localStorage.removeItem('current_module');
}

export function isModuleValid(value) {
  if (!value) return false;
  if (!state.user.modules.some((v) => v.event.id == value)) return false;
  return true;
}
