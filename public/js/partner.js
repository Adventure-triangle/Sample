async function submitActivity() {
  const payload = {
    address: {
      line1: document.getElementById('line1').value,
      city: document.getElementById('city').value,
      state: document.getElementById('state').value,
      country: document.getElementById('country').value,
      pincode: document.getElementById('pincode').value
    },
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    category: document.getElementById('category').value,
    difficulty: document.getElementById('difficulty').value,
    minAge: Number(document.getElementById('minAge').value || 0),
    maxGroupSize: Number(document.getElementById('maxGroupSize').value || 0),
    price: Number(document.getElementById('price').value || 0),
    currency: document.getElementById('currency').value,
    images: (document.getElementById('images').value || '').split(',').map(x => x.trim()).filter(Boolean)
  };
  const res = await api('/api/partner/activities', { method: 'POST', body: payload });
  if (res.error) return alert(res.error);
  alert('Submitted! Now request review from your activity card.');
  loadMyActivities();
}

async function loadMyActivities() {
  const list = await api('/api/partner/activities');
  const box = document.getElementById('myActivities');
  box.innerHTML = '';
  list.forEach(a => {
    const card = el(`
      <div class="card">
        <img src="${(a.images && a.images[0]) || 'https://picsum.photos/seed/' + a._id + '/600/300'}" style="width:100%; border-radius:12px; height:140px; object-fit:cover;"/>
        <h3>${a.title || '(untitled)'}</h3>
        <div class="small">${a.category || ''} • ${a.difficulty || ''}</div>
        <div class="badge status-${a.status}">${a.status}</div>
        <div style="margin-top:8px; display:flex; gap:8px; flex-wrap:wrap;">
          <button class="btn" onclick="requestReview('${a._id}')">Go Live (Send to Admin)</button>
        </div>
      </div>
    `);
    box.appendChild(card);
  });
}

async function requestReview(id) {
  const res = await api('/api/partner/activities/' + id + '/request-review', { method: 'POST' });
  alert(res.message || 'Sent');
  loadMyActivities();
}

// Bank
async function saveBank() {
  const payload = {
    accountHolder: document.getElementById('accountHolder').value,
    accountNumber: document.getElementById('accountNumber').value,
    ifsc: document.getElementById('ifsc').value,
    bankName: document.getElementById('bankName').value,
    branch: document.getElementById('branch').value
  };
  const res = await api('/api/partner/bank', { method: 'POST', body: payload });
  alert('Saved bank details');
}

async function loadBank() {
  const res = await api('/api/partner/bank');
  if (!res || !res.accountHolder) return;
  document.getElementById('accountHolder').value = res.accountHolder || '';
  document.getElementById('accountNumber').value = res.accountNumber || '';
  document.getElementById('ifsc').value = res.ifsc || '';
  document.getElementById('bankName').value = res.bankName || '';
  document.getElementById('branch').value = res.branch || '';
}

// Certifications
async function createCert() {
  const payload = {
    title: document.getElementById('certTitle').value,
    description: document.getElementById('certDesc').value,
    duration: document.getElementById('certDuration').value,
    price: Number(document.getElementById('certPrice').value || 0),
    image: document.getElementById('certImage').value
  };
  const res = await api('/api/partner/certifications', { method: 'POST', body: payload });
  alert('Certification created (pending). Ask admin to approve in DB or via API /api/cert/approve/:id');
  loadMyCerts();
}

async function loadMyCerts() {
  const list = await api('/api/partner/certifications');
  const box = document.getElementById('myCerts');
  box.innerHTML = '';
  list.forEach(c => {
    const card = el(`
      <div class="card">
        <img src="${c.image || 'https://picsum.photos/seed/' + c._id + '/600/300'}" style="width:100%; border-radius:12px; height:140px; object-fit:cover;"/>
        <h3>${c.title}</h3>
        <div class="small">${c.duration || ''}</div>
        <div class="badge status-${c.status}">${c.status}</div>
      </div>
    `);
    box.appendChild(card);
  });
}

async function guardPartner() {
  const me = await api('/api/auth/me');
  if (!me.user || (me.user.role !== 'partner' && me.user.role !== 'admin')) {
    alert('Please login as partner'); location.href = '/login.html';
  }
}

guardPartner().then(() => { loadMyActivities(); loadBank(); loadMyCerts(); });
