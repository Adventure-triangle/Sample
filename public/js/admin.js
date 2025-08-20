async function guardAdmin() {
  const me = await api('/api/auth/me');
  if (!me.user || me.user.role !== 'admin') {
    alert('Please login as admin'); location.href = '/login.html';
  }
}

async function loadReview() {
  const list = await api('/api/admin/review-activities');
  const box = document.getElementById('reviewList');
  box.innerHTML = '';
  list.forEach(a => {
    const card = el(`
      <div class="card">
        <img src="${(a.images && a.images[0]) || 'https://picsum.photos/seed/' + a._id + '/600/300'}" style="width:100%; border-radius:12px; height:140px; object-fit:cover;"/>
        <h3>${a.title}</h3>
        <div class="small">Partner: ${a.partnerId?.email || ''}</div>
        <div class="badge status-${a.status}">${a.status}</div>
        <div style="margin-top:8px; display:flex; gap:8px; flex-wrap:wrap;">
          <button class="btn success" onclick="approve('${a._id}')">Approve (Go LIVE)</button>
          <button class="btn danger" onclick="reject('${a._id}')">Reject</button>
        </div>
      </div>
    `);
    box.appendChild(card);
  });
}

async function approve(id) {
  const res = await api('/api/admin/activities/' + id + '/approve', { method: 'POST' });
  alert(res.message || 'Approved');
  loadReview(); loadStats();
}

async function reject(id) {
  const res = await api('/api/admin/activities/' + id + '/reject', { method: 'POST' });
  alert(res.message || 'Rejected');
  loadReview(); loadStats();
}

async function loadStats() {
  const s = await api('/api/admin/stats');
  document.getElementById('stats').innerHTML = `
    <div>Total Activities: <strong>${s.totalActivities}</strong></div>
    <div>Live Activities: <strong>${s.liveActivities}</strong></div>
    <div>Total Bookings: <strong>${s.totalBookings}</strong></div>
    <div>Total Revenue: <strong>$${s.totalRevenue}</strong></div>
  `;

  const bookings = await api('/api/admin/bookings');
  const tbody = document.getElementById('bookingsBody'); tbody.innerHTML = '';
  bookings.forEach(b => {
    const tr = el(`<tr>
      <td>${b.activityId}</td><td>${b.customerName} (${b.customerEmail})</td>
      <td>${b.date}</td><td>${b.slots}</td><td>$${b.amount}</td><td>${b.paid ? 'Yes' : 'No'}</td>
    </tr>`);
    tbody.appendChild(tr);
  });

  const users = await api('/api/admin/users');
  const ub = document.getElementById('usersBody'); ub.innerHTML = '';
  users.forEach(u => {
    const tr = el(`<tr><td>${u.name||''}</td><td>${u.email}</td><td>${u.role}</td><td>${new Date(u.createdAt).toLocaleString()}</td></tr>`);
    ub.appendChild(tr);
  });
}

guardAdmin().then(() => { loadReview(); loadStats(); });
