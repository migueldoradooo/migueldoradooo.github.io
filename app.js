/* ==========================================
   APP.JS — TaskFlow Todo Application
   ==========================================
   
   Este archivo contiene toda la lógica de la aplicación.
   Funciona en modo DEMO (localStorage) por defecto.
   
   🔥 Para conectar con Firebase, busca los comentarios
      marcados con 🔥 y sigue las instrucciones.
   ========================================== */

// ==========================================
// ESTADO DE LA APLICACIÓN
// ==========================================
let tasks = [];
let currentFilter = 'todas';
let currentUser = null;
let selectedPriority = 'baja';

// ==========================================
// INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initAuthTabs();
    initAuthForms();
    initTogglePassword();
    initAddTaskForm();
    initPrioritySelector();
    initFilterTabs();
    initSearch();
    initLogout();
    initClearCompleted();
    updateDateTime();

    // Comprobar si hay sesión guardada (modo demo)
    // 🔥 FIREBASE: Cuando conectes Firebase, elimina esta línea
    //    y usa auth.onAuthStateChanged() en firebase-config.js
    checkDemoSession();
});

// ==========================================
// AUTENTICACIÓN — TABS
// ==========================================
function initAuthTabs() {
    const tabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            hideAuthError();

            if (target === 'login') {
                loginForm.classList.add('active');
                registerForm.classList.remove('active');
            } else {
                loginForm.classList.remove('active');
                registerForm.classList.add('active');
            }
        });
    });
}

// ==========================================
// AUTENTICACIÓN — FORMULARIOS
// ==========================================
function initAuthForms() {
    // Login
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const btn = document.getElementById('login-btn');

        if (!email || !password) {
            showAuthError('Por favor, completa todos los campos.');
            return;
        }

        btn.classList.add('loading');
        hideAuthError();

        try {
            // ╔════════════════════════════════════════════════╗
            // ║  🔥 FIREBASE: Reemplaza la línea de abajo     ║
            // ║  con: await firebaseLogin(email, password);    ║
            // ╚════════════════════════════════════════════════╝
            await demoLogin(email, password);
        } catch (error) {
            showAuthError(error.message);
        } finally {
            btn.classList.remove('loading');
        }
    });

    // Register
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const btn = document.getElementById('register-btn');

        if (!name || !email || !password) {
            showAuthError('Por favor, completa todos los campos.');
            return;
        }

        if (password.length < 6) {
            showAuthError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        btn.classList.add('loading');
        hideAuthError();

        try {
            // ╔════════════════════════════════════════════════════════╗
            // ║  🔥 FIREBASE: Reemplaza la línea de abajo             ║
            // ║  con: await firebaseRegister(name, email, password);   ║
            // ╚════════════════════════════════════════════════════════╝
            await demoRegister(name, email, password);
        } catch (error) {
            showAuthError(error.message);
        } finally {
            btn.classList.remove('loading');
        }
    });

    // Google Login
    document.getElementById('google-login-btn').addEventListener('click', async () => {
        try {
            // ╔════════════════════════════════════════════════════╗
            // ║  🔥 FIREBASE: Reemplaza la línea de abajo         ║
            // ║  con: await firebaseGoogleLogin();                 ║
            // ╚════════════════════════════════════════════════════╝
            await demoGoogleLogin();
        } catch (error) {
            showAuthError(error.message);
        }
    });

    document.getElementById('google-register-btn').addEventListener('click', async () => {
        try {
            // ╔════════════════════════════════════════════════════╗
            // ║  🔥 FIREBASE: Reemplaza la línea de abajo         ║
            // ║  con: await firebaseGoogleLogin();                 ║
            // ╚════════════════════════════════════════════════════╝
            await demoGoogleLogin();
        } catch (error) {
            showAuthError(error.message);
        }
    });
}

// ==========================================
// AUTENTICACIÓN — TOGGLE PASSWORD
// ==========================================
function initTogglePassword() {
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.parentElement.querySelector('input');
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            btn.innerHTML = isPassword
                ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
                : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
        });
    });
}

// ==========================================
// DEMO AUTH (sin Firebase — funciona localmente)
// ==========================================
async function demoLogin(email, password) {
    // Simular delay de red
    await new Promise(r => setTimeout(r, 800));

    // Verificar credenciales guardadas en localStorage
    const users = JSON.parse(localStorage.getItem('taskflow_users') || '[]');
    const user = users.find(u => u.email === email);

    if (!user) {
        throw new Error('No existe una cuenta con este correo.');
    }
    if (user.password !== password) {
        throw new Error('La contraseña es incorrecta.');
    }

    currentUser = { name: user.name, email: user.email };
    localStorage.setItem('taskflow_session', JSON.stringify(currentUser));
    showApp(currentUser);
}

async function demoRegister(name, email, password) {
    await new Promise(r => setTimeout(r, 800));

    const users = JSON.parse(localStorage.getItem('taskflow_users') || '[]');

    if (users.find(u => u.email === email)) {
        throw new Error('Ya existe una cuenta con este correo.');
    }

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('taskflow_users', JSON.stringify(users));

    currentUser = { name, email };
    localStorage.setItem('taskflow_session', JSON.stringify(currentUser));
    showApp(currentUser);
}

async function demoGoogleLogin() {
    await new Promise(r => setTimeout(r, 500));
    // Simular login con Google (en modo demo crea un usuario genérico)
    currentUser = { name: 'Usuario Google', email: 'usuario@gmail.com' };
    localStorage.setItem('taskflow_session', JSON.stringify(currentUser));
    showApp(currentUser);
}

function checkDemoSession() {
    const session = localStorage.getItem('taskflow_session');
    if (session) {
        currentUser = JSON.parse(session);
        showApp(currentUser);
    }
}

// ==========================================
// MOSTRAR / OCULTAR PANTALLAS
// ==========================================
function showApp(user) {
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('app-screen').classList.remove('hidden');

    // Actualizar info del usuario
    document.getElementById('user-name').textContent = user.name || user.email;
    document.getElementById('user-avatar').textContent = (user.name || user.email).charAt(0).toUpperCase();

    // Actualizar saludo
    updateGreeting(user.name || 'Usuario');

    // Cargar tareas
    // 🔥 FIREBASE: Reemplaza loadTasksFromLocal() con:
    //    firestoreListenTasks((tasks) => { ... });
    loadTasksFromLocal();
    renderTasks();
}

function showAuth() {
    document.getElementById('auth-screen').classList.remove('hidden');
    document.getElementById('app-screen').classList.add('hidden');
    currentUser = null;
}

// ==========================================
// LOGOUT
// ==========================================
function initLogout() {
    document.getElementById('logout-btn').addEventListener('click', async () => {
        // ╔════════════════════════════════════════════════╗
        // ║  🔥 FIREBASE: Añade antes de las líneas       ║
        // ║  de abajo: await firebaseLogout();             ║
        // ╚════════════════════════════════════════════════╝
        localStorage.removeItem('taskflow_session');
        tasks = [];
        showAuth();
        showToast('Sesión cerrada correctamente', 'info');
    });
}

// ==========================================
// AUTH ERROR DISPLAY
// ==========================================
function showAuthError(message) {
    const errorEl = document.getElementById('auth-error');
    errorEl.textContent = message;
    errorEl.classList.add('visible');
}

function hideAuthError() {
    const errorEl = document.getElementById('auth-error');
    errorEl.classList.remove('visible');
}

// ==========================================
// GESTIÓN DE TAREAS
// ==========================================
function initAddTaskForm() {
    document.getElementById('add-task-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('task-input');
        const category = document.getElementById('task-category').value;
        const text = input.value.trim();

        if (!text) return;

        const task = {
            id: generateId(),
            text: text,
            priority: selectedPriority,
            category: category,
            completed: false,
            createdAt: new Date().toISOString()
        };

        // ╔════════════════════════════════════════════════════════╗
        // ║  🔥 FIREBASE: Añade aquí para guardar en Firestore:   ║
        // ║  task.id = await firestoreAddTask(task);               ║
        // ╚════════════════════════════════════════════════════════╝

        tasks.unshift(task);
        saveTasksToLocal();
        renderTasks();

        input.value = '';
        input.focus();

        showToast('Tarea añadida correctamente', 'success');
    });
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;

        // ╔════════════════════════════════════════════════════════════╗
        // ║  🔥 FIREBASE: Añade aquí:                                 ║
        // ║  firestoreToggleTask(id, task.completed);                  ║
        // ╚════════════════════════════════════════════════════════════╝

        saveTasksToLocal();
        renderTasks();

        if (task.completed) {
            showToast('¡Tarea completada! 🎉', 'success');
        }
    }
}

function deleteTask(id) {
    const taskEl = document.querySelector(`[data-task-id="${id}"]`);
    if (taskEl) {
        taskEl.classList.add('removing');
        setTimeout(() => {
            tasks = tasks.filter(t => t.id !== id);

            // ╔══════════════════════════════════════════════════╗
            // ║  🔥 FIREBASE: Añade aquí:                        ║
            // ║  firestoreDeleteTask(id);                         ║
            // ╚══════════════════════════════════════════════════╝

            saveTasksToLocal();
            renderTasks();
            showToast('Tarea eliminada', 'info');
        }, 350);
    }
}

function initClearCompleted() {
    document.getElementById('clear-completed-btn').addEventListener('click', () => {
        const completed = tasks.filter(t => t.completed);
        if (completed.length === 0) {
            showToast('No hay tareas completadas para limpiar', 'info');
            return;
        }

        // ╔══════════════════════════════════════════════════════╗
        // ║  🔥 FIREBASE: Añade aquí:                            ║
        // ║  firestoreClearCompleted();                           ║
        // ╚══════════════════════════════════════════════════════╝

        tasks = tasks.filter(t => !t.completed);
        saveTasksToLocal();
        renderTasks();
        showToast(`${completed.length} tarea(s) eliminada(s)`, 'success');
    });
}

// ==========================================
// PRIORIDAD
// ==========================================
function initPrioritySelector() {
    const buttons = document.querySelectorAll('.priority-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedPriority = btn.dataset.priority;
        });
    });
}

// ==========================================
// FILTROS
// ==========================================
function initFilterTabs() {
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.filter;
            renderTasks();
        });
    });
}

// ==========================================
// BÚSQUEDA
// ==========================================
function initSearch() {
    document.getElementById('search-input').addEventListener('input', () => {
        renderTasks();
    });
}

// ==========================================
// RENDERIZADO DE TAREAS
// ==========================================
function renderTasks() {
    const container = document.getElementById('task-list');
    const emptyState = document.getElementById('empty-state');
    const searchQuery = document.getElementById('search-input').value.toLowerCase().trim();

    // Filtrar tareas
    let filtered = tasks.filter(task => {
        // Filtro de estado
        if (currentFilter === 'pendientes' && task.completed) return false;
        if (currentFilter === 'completadas' && !task.completed) return false;

        // Filtro de búsqueda
        if (searchQuery && !task.text.toLowerCase().includes(searchQuery)) return false;

        return true;
    });

    // Actualizar estadísticas
    updateStats();

    // Renderizar
    if (filtered.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        container.innerHTML = filtered.map(task => createTaskHTML(task)).join('');
    }
}

function createTaskHTML(task) {
    const categoryEmoji = {
        general: '📋',
        trabajo: '💼',
        personal: '🏠',
        estudio: '📚',
        salud: '💪'
    };

    const priorityClass = {
        baja: 'low',
        media: 'medium',
        alta: 'high'
    };

    const timeAgo = getTimeAgo(task.createdAt);

    return `
        <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
            <label class="task-checkbox">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task.id}')">
                <div class="checkmark">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                </div>
            </label>
            <div class="task-content">
                <span class="task-text">${escapeHTML(task.text)}</span>
                <div class="task-meta">
                    <span class="task-category">${categoryEmoji[task.category] || '📋'} ${capitalize(task.category)}</span>
                    <span class="task-priority-indicator ${priorityClass[task.priority]}">${task.priority}</span>
                    <span class="task-time">${timeAgo}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="task-action-btn" onclick="deleteTask('${task.id}')" title="Eliminar tarea">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
}

// ==========================================
// ESTADÍSTICAS
// ==========================================
function updateStats() {
    const total = tasks.length;
    const done = tasks.filter(t => t.completed).length;
    const pending = total - done;

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-done').textContent = done;
    document.getElementById('stat-pending').textContent = pending;
}

// ==========================================
// FECHA Y SALUDO
// ==========================================
function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = now.toLocaleDateString('es-ES', options);
    document.getElementById('date-display').textContent = capitalize(dateStr);
}

function updateGreeting(name) {
    const hour = new Date().getHours();
    let greeting;

    if (hour < 12) greeting = 'Buenos días';
    else if (hour < 19) greeting = 'Buenas tardes';
    else greeting = 'Buenas noches';

    document.getElementById('greeting').textContent = `${greeting}, ${name} 👋`;
}

// ==========================================
// ALMACENAMIENTO LOCAL (modo demo)
// ==========================================
// 🔥 FIREBASE: Cuando uses Firestore, estas funciones
//    ya no serán necesarias. Las tareas se guardarán en la nube.

function saveTasksToLocal() {
    const key = `taskflow_tasks_${currentUser?.email || 'guest'}`;
    localStorage.setItem(key, JSON.stringify(tasks));
}

function loadTasksFromLocal() {
    const key = `taskflow_tasks_${currentUser?.email || 'guest'}`;
    const saved = localStorage.getItem(key);
    tasks = saved ? JSON.parse(saved) : [];
}

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');

    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icons[type]}</span>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==========================================
// UTILIDADES
// ==========================================
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getTimeAgo(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Ahora mismo';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `Hace ${Math.floor(diff / 86400)}d`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}
