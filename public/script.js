const form = document.getElementById('contact-form');
const tableBody = document.querySelector('#contacts-table tbody');

async function fetchContacts() {
  const res = await fetch('/api/contacts');
  const contacts = await res.json();

  tableBody.innerHTML = '';
  contacts.forEach(({ id, name, phone }) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${name}</td>
      <td>${phone}</td>
      <td><button class="delete-btn" data-id="${id}">Eliminar</button></td>
    `;
    tableBody.appendChild(row);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const phone = form.phone.value.trim();

  if (!name || !phone) {
    alert('Por favor completa todos los campos');
    return;
  }

  const res = await fetch('/api/contacts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, phone })
  });

  if (res.ok) {
    form.reset();
    fetchContacts();
  } else {
    alert('Error al agregar contacto');
  }
});

tableBody.addEventListener('click', async (e) => {
  if (!e.target.classList.contains('delete-btn')) return;

  const id = e.target.dataset.id;
  if (!confirm('¿Eliminar contacto?')) return;

  const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
  if (res.ok) {
    fetchContacts();
  } else {
    alert('Error al eliminar contacto');
  }
});

// Carga inicial de contactos
fetchContacts();
