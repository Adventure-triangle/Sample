async function api(url, { method='GET', body } = {}) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) console.error('API error', data);
  return data;
}

async function logout() {
  await api('/api/auth/logout', { method: 'POST' });
  location.reload();
}

function el(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstChild;
}
