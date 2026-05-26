const form = document.getElementById('form');
const nameInput = document.getElementById('nameInput');
const list = document.getElementById('list');

const {
  db,
  colRef,
  q,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  serverTimestamp
} = window.AGENDA_DB || {};

if (!window.AGENDA_DB) {
  console.error('Firebase no está inicializado. Comprueba que agenda.html contiene la configuración de Firebase.');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  if (!name || !addDoc) return;
  try {
    await addDoc(colRef, { name, createdAt: serverTimestamp() });
    nameInput.value = '';
  } catch (err) {
    console.error('Error añadiendo documento:', err);
  }
});

if (onSnapshot && q) {
  onSnapshot(q, (snapshot) => {
    list.innerHTML = '';
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const li = document.createElement('li');
      const span = document.createElement('span');
      span.textContent = data.name || '';
      const del = document.createElement('button');
      del.textContent = 'Eliminar';
      del.addEventListener('click', async () => {
        try {
          await deleteDoc(doc(db, 'agenda', docSnap.id));
        } catch (err) { console.error(err); }
      });
      li.appendChild(span);
      li.appendChild(del);
      list.appendChild(li);
    });
  });
} else {
  console.warn('No se ha establecido la sincronización en tiempo real porque la base de datos no está lista.');
}
