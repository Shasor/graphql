const DOMAIN = 'zone01normandie.org'; // remplace par le vrai domaine
const GRAPHQL_URL = `https://${DOMAIN}/api/graphql-engine/v1/graphql`;
const SIGNIN_URL = `https://${DOMAIN}/api/auth/signin`;

export async function signin(usernameOrEmail, password) {
  const basicAuth = btoa(`${usernameOrEmail}:${password}`);
  const res = await fetch(SIGNIN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Invalid credentials');
  }
  const jwt = await res.json();
  if (!jwt) {
    throw new Error('No JWT returned');
  }
  return jwt;
}

export async function graphqlQuery(token, query) {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error('GraphQL request failed');
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}
