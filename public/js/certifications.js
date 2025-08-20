async function loadCerts() {
  const list = await api('/api/cert/all');
  const box = document.getElementById('certList');
  box.innerHTML = '';
  list.forEach(c => {
    const card = el(`
      <div class="card">
        <img src="${c.image || 'https://picsum.photos/seed/' + c._id + '/600/300'}" style="width:100%; border-radius:12px; height:160px; object-fit:cover;"/>
        <h3>${c.title}</h3>
        <div class="small">${c.description || ''}</div>
        <div class="small">${c.duration || ''} • $${c.price || 0}</div>
        <div style="margin-top:8px;">
          <button class="btn" onclick="enroll('${c._id}')">Enroll</button>
        </div>
      </div>
    `);
    box.appendChild(card);
  });
}

async function enroll(id) {
  const res = await api('/api/cert/enroll/' + id, { method: 'POST' });
  alert(res.message || 'Enrolled');
}

loadCerts();
