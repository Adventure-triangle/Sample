async function loadActivities() {
  const list = await api('/api/public/activities');
  const box = document.getElementById('liveActivities');
  box.innerHTML = '';
  list.forEach(a => {
    const card = el(`
      <div class="card">
        <img src="${(a.images && a.images[0]) || 'https://picsum.photos/seed/' + a._id + '/600/300'}" style="width:100%; border-radius:12px; height:160px; object-fit:cover;"/>
        <h3>${a.title}</h3>
        <div class="small">${a.category || ''} • ${a.difficulty || ''}</div>
        <div class="small">$${a.price} ${a.currency || ''}</div>
        <div style="margin-top:8px;">
          <button class="btn" onclick="openBook('${a._id}', '${a.title}', ${a.price || 0})">Book</button>
        </div>
      </div>
    `);
    box.appendChild(card);
  });
}

async function openBook(id, title, price) {
  const date = prompt(`Choose date (YYYY-MM-DD) for ${title}`);
  if (!date) return;
  const slots = parseInt(prompt('How many slots?'), 10) || 1;
  const name = prompt('Your name?') || 'Guest';
  const email = prompt('Your email?') || 'guest@example.com';
  const resp = await api('/api/booking/create', { method: 'POST', body: { activityId: id, customerName: name, customerEmail: email, date, slots } });
  if (resp.error) return alert(resp.error);
  if (confirm(`Pay $${resp.booking.amount}?`)) {
    const p = await api('/api/booking/pay/' + resp.booking._id, { method: 'POST' });
    alert(p.message + ' Ref: ' + p.booking.paymentRef);
  }
}

loadActivities();
