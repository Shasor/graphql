export function saveJWT(token) {
  localStorage.setItem('jwt_token', token);
}

export function loadJWT() {
  return localStorage.getItem('jwt_token');
}

export function removeJWT() {
  localStorage.removeItem('jwt_token');
}

export function isJwtValid(token) {
  if (!token) return false;
  const payload = parseJWT(token);
  if (!payload) return false;
  // Check expiration (exp) if present
  if (payload.exp && Date.now() >= payload.exp * 1000) return false;
  return true;
}

// Décodage basique (payload seulement)
export function parseJWT(token) {
  if (!token) return null;
  const payload = token.split('.')[1];
  if (!payload) return null;
  try {
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}
