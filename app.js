// app.js - Lógica principal eCom_task
import { triggerConfetti } from './confetti.js';

// 1. ESTADO DE LA APLICACIÓN
let tasks = [];
let selectedStatusFilter = 'all';
let selectedCategoryFilter = 'all';
let searchQuery = '';
let sortBy = 'created';
let activeCategoryInput = 'work'; // Categoría seleccionada por defecto al crear

// Configuración de Categorías
const CATEGORIES = {
  work: { id: 'work', name: 'Trabajo', color: '#2967A3', icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 .621-.504 1.125-1.125 1.125H4.875A1.125 1.125 0 0 1 3.75 18.4V14.15m16.5 0c0-1.286-.733-2.425-1.89-3.005l-2.116-1.058a2.25 2.25 0 0 0-2.011 0l-2.118 1.058a2.25 2.25 0 0 1-2.011 0L7.004 9.087a2.25 2.25 0 0 0-2.011 0L2.876 10.14c-1.157.58-1.89 1.72-1.89 3.005m19.5 0a3 3 0 0 1-3 9H4.875a3 3 0 0 1-3-9m15-6V5.625c0-.621-.504-1.125-1.125-1.125h-9c-.621 0-1.125.504-1.125 1.125V8.25M12 12h.008v.008H12V12Z" /></svg>` },
  personal: { id: 'personal', name: 'Personal', color: '#18A0D8', icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>` },
  shopping: { id: 'shopping', name: 'Compras', color: '#f59e0b', icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>` },
  health: { id: 'health', name: 'Salud', color: '#10b981', icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>` },
  ideas: { id: 'ideas', name: 'Ideas', color: '#a855f7', icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.467 5.99 5.99 0 0 0-1.925 3.546 5.974 5.974 0 0 1-2.133-1A3.75 3.75 0 0 0 12 18Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 21H14.25M12 14.25V18M12 8.25V6m0 12.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Zm0-12.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>` }
};

// 2. REFERENCIAS AL DOM
const elements = {
  taskInput: document.getElementById('taskInput'),
  priorityInput: document.getElementById('priorityInput'),
  dueDateInput: document.getElementById('dueDateInput'),
  categoryChips: document.getElementById('categoryChips'),
  addTaskBtn: document.getElementById('addTaskBtn'),
  searchInput: document.getElementById('searchInput'),
  sortSelect: document.getElementById('sortSelect'),
  todoListContainer: document.getElementById('todoListContainer'),
  emptyState: document.getElementById('emptyState'),
  greetingText: document.getElementById('greetingText'),
  dateText: document.getElementById('dateText'),
  
  // Progress Ring
  progressCircle: document.querySelector('.progress-ring__circle'),
  progressText: document.getElementById('progressText'),
  progressStatsText: document.getElementById('progressStatsText'),
  
  // Sidebar
  sidebarCategories: document.getElementById('sidebarCategories'),
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  
  // Badges
  badgeAll: document.getElementById('badgeAll'),
  badgeActive: document.getElementById('badgeActive'),
  badgeCompleted: document.getElementById('badgeCompleted'),
  
  // Secciones / Filtros Especiales
  taskFormSection: document.getElementById('taskFormSection'),
  standardListSection: document.getElementById('standardListSection'),
  meetingModeSection: document.getElementById('meetingModeSection'),
  
  // Contenedores del Modo Reunión
  meetingDoneList: document.getElementById('meetingDoneList'),
  meetingTodoList: document.getElementById('meetingTodoList'),
  meetingDoneCount: document.getElementById('meetingDoneCount'),
  meetingTodoCount: document.getElementById('meetingTodoCount'),
  btnCopyReport: document.getElementById('btnCopyReport'),
  
  // Lista de botones filtros del sidebar
  filterBtns: [
    document.getElementById('btnFilterAll'),
    document.getElementById('btnFilterActive'),
    document.getElementById('btnFilterCompleted'),
    document.getElementById('btnFilterMeeting')
  ]
};

// CÍRCULO DE PROGRESO - Configuración del stroke-dasharray
const CIRCUMFERENCE = 2 * Math.PI * 50; // radio = 50, C = 314.16

// 3. INICIALIZACIÓN
function init() {
  // Cargar Tareas desde localStorage
  const savedTasks = localStorage.getItem('auratask_tasks');
  if (savedTasks) {
    try {
      tasks = JSON.parse(savedTasks);
    } catch (e) {
      console.error('Error parseando tareas almacenadas', e);
      tasks = [];
    }
  }

  // Establecer saludo dinámico y fecha
  setGreetingAndDate();
  
  // Inyectar Chips de categoría en el Formulario
  renderCategoryChips();
  
  // Renderizar Categorías en Sidebar
  renderSidebarCategories();

  // Configurar Tema Inicial (Light / Dark)
  setupTheme();

  // Registrar Event Listeners
  setupEventListeners();

  // Renderizar Vista Inicial
  render();
}

// 4. FUNCIONES DE VISTA Y CONTROL DE TIEMPO
function setGreetingAndDate() {
  const now = new Date();
  const hours = now.getHours();
  let greeting = '¡Hola!';
  
  if (hours >= 6 && hours < 12) {
    greeting = '¡Buenos días!';
  } else if (hours >= 12 && hours < 19) {
    greeting = '¡Buenas tardes!';
  } else {
    greeting = '¡Buenas noches!';
  }
  
  elements.greetingText.textContent = greeting;

  // Formatear Fecha
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = now.toLocaleDateString('es-ES', options);
  elements.dateText.textContent = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}

// 5. CAMBIO DE TEMA (CLARO/OSCURO)
function setupTheme() {
  const savedTheme = localStorage.getItem('auratask_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.body.classList.add('dark-mode');
    updateThemeButtonText(true);
  } else {
    document.body.classList.remove('dark-mode');
    updateThemeButtonText(false);
  }
}

function toggleTheme() {
  const isDarkMode = document.body.classList.toggle('dark-mode');
  localStorage.setItem('auratask_theme', isDarkMode ? 'dark' : 'light');
  updateThemeButtonText(isDarkMode);
}

function updateThemeButtonText(isDark) {
  const textSpan = elements.themeToggleBtn.querySelector('span');
  textSpan.textContent = isDark ? 'Modo Oscuro' : 'Modo Claro';
}

// Helper para verificar si una fecha cae en la última semana
function isWithinLast7Days(dateString) {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);
  return date >= sevenDaysAgo && date <= today;
}

// 6. CATEGORÍAS EN FORMULARIO (CHIPS)
function renderCategoryChips() {
  elements.categoryChips.innerHTML = '';
  
  Object.values(CATEGORIES).forEach(cat => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `chip-btn ${cat.id === activeCategoryInput ? 'active' : ''}`;
    btn.innerHTML = `${cat.icon} <span>${cat.name}</span>`;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.category-chips .chip-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategoryInput = cat.id;
    });
    elements.categoryChips.appendChild(btn);
  });
}

// Categorías en Sidebar
function renderSidebarCategories() {
  elements.sidebarCategories.innerHTML = '';
  
  // Agregar opción "Todas"
  const allBtn = document.createElement('button');
  allBtn.className = `filter-btn ${selectedCategoryFilter === 'all' ? 'active' : ''}`;
  allBtn.innerHTML = `
    <div class="category-dot" style="background: var(--color-sky-blue);"></div>
    <span>Todas las áreas</span>
  `;
  allBtn.addEventListener('click', () => {
    selectedCategoryFilter = 'all';
    updateCategoryActiveStates();
    render();
  });
  elements.sidebarCategories.appendChild(allBtn);

  // Inyectar categorías reales
  Object.values(CATEGORIES).forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `filter-btn ${selectedCategoryFilter === cat.id ? 'active' : ''}`;
    btn.dataset.category = cat.id;
    
    const count = tasks.filter(t => t.category === cat.id).length;
    
    btn.innerHTML = `
      <div class="category-dot" style="background: ${cat.color};"></div>
      <span>${cat.name}</span>
      <span class="filter-badge">${count}</span>
    `;
    
    btn.addEventListener('click', () => {
      selectedCategoryFilter = cat.id;
      updateCategoryActiveStates();
      render();
    });
    
    elements.sidebarCategories.appendChild(btn);
  });
}

function updateCategoryActiveStates() {
  const buttons = elements.sidebarCategories.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    if (selectedCategoryFilter === 'all' && !btn.dataset.category) {
      btn.classList.add('active');
    } else if (btn.dataset.category === selectedCategoryFilter) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// 7. EVENT LISTENERS
function setupEventListeners() {
  // Crear Tarea
  elements.addTaskBtn.addEventListener('click', addTask);
  elements.taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask();
  });

  // Filtros de Estado y Modo Reunión
  elements.filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedStatusFilter = btn.dataset.filter;
      render();
    });
  });

  // Buscador
  elements.searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    render();
  });

  // Ordenar
  elements.sortSelect.addEventListener('change', (e) => {
    sortBy = e.target.value;
    render();
  });

  // Tema
  elements.themeToggleBtn.addEventListener('click', toggleTheme);

  // Copiar reporte de sincronización
  elements.btnCopyReport.addEventListener('click', copyMeetingReport);
}

// 8. ACCIONES DE GESTIÓN DE TAREAS
function addTask() {
  const text = elements.taskInput.value.trim();
  if (!text) return;

  const priority = elements.priorityInput.value;
  const dueDate = elements.dueDateInput.value;
  
  const newTask = {
    id: 'task_' + Date.now() + Math.random().toString(36).substr(2, 4),
    text: text,
    completed: false,
    category: activeCategoryInput,
    priority: priority,
    dueDate: dueDate || null,
    createdAt: new Date().toISOString(),
    completedAt: null
  };

  tasks.push(newTask);
  saveTasks();
  
  elements.taskInput.value = '';
  elements.dueDateInput.value = '';
  
  const formCard = document.querySelector('.task-form-card');
  formCard.style.transform = 'scale(0.99)';
  setTimeout(() => formCard.style.transform = 'scale(1)', 100);

  render();
}

function toggleTask(id) {
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) return;

  const prevStatus = tasks[taskIndex].completed;
  tasks[taskIndex].completed = !tasks[taskIndex].completed;
  tasks[taskIndex].completedAt = tasks[taskIndex].completed ? new Date().toISOString() : null;
  
  saveTasks();

  if (!prevStatus && tasks[taskIndex].completed) {
    triggerConfetti();
  }

  render();
}

function deleteTask(id) {
  const taskElement = document.querySelector(`[data-id="${id}"]`);
  if (taskElement) {
    taskElement.classList.add('fade-out');
    setTimeout(() => {
      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
      render();
    }, 300);
  } else {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    render();
  }
}

function startEditTask(id, titleSpan) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  const currentText = task.text;
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'task-edit-input';
  input.value = currentText;
  
  titleSpan.replaceWith(input);
  input.focus();

  const save = () => {
    const newText = input.value.trim();
    if (newText && newText !== currentText) {
      task.text = newText;
      saveTasks();
    }
    render();
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') save();
    if (e.key === 'Escape') render();
  });

  input.addEventListener('blur', save);
}

function saveTasks() {
  localStorage.setItem('auratask_tasks', JSON.stringify(tasks));
  renderSidebarCategories();
}

// 9. PROCESO DE RENDERIZADO PRINCIPAL
function render() {
  // Aplicar Filtro de Categoría y Búsqueda global a las tareas del renderizado
  let globalFilteredTasks = [...tasks];
  
  if (selectedCategoryFilter !== 'all') {
    globalFilteredTasks = globalFilteredTasks.filter(t => t.category === selectedCategoryFilter);
  }
  if (searchQuery) {
    globalFilteredTasks = globalFilteredTasks.filter(t => t.text.toLowerCase().includes(searchQuery));
  }

  // --- MODO REUNIÓN ---
  if (selectedStatusFilter === 'meeting') {
    // 1. Mostrar/Ocultar secciones
    elements.taskFormSection.style.display = 'none';
    elements.standardListSection.style.display = 'none';
    elements.meetingModeSection.style.display = 'block';

    // 2. Filtrar tareas para las dos columnas
    // Columna 1: Cumplido (Semana Anterior) -> Completadas en los últimos 7 días
    const completedLastWeek = globalFilteredTasks.filter(t => t.completed && isWithinLast7Days(t.completedAt));
    
    // Columna 2: Por Hacer (Esta Semana) -> Todas las pendientes activas
    const pendingThisWeek = globalFilteredTasks.filter(t => !t.completed);

    // Ordenar las columnas para la presentación
    // Pendientes por prioridad, completadas por fecha de finalización
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    pendingThisWeek.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
    completedLastWeek.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

    // 3. Renderizar Columna Cumplidas
    elements.meetingDoneList.innerHTML = '';
    if (completedLastWeek.length === 0) {
      elements.meetingDoneList.innerHTML = `<div class="empty-state" style="padding: 30px 10px; border-style: dotted;"><p style="font-size: 13px;">Sin tareas completadas recientemente.</p></div>`;
    } else {
      completedLastWeek.forEach(task => {
        elements.meetingDoneList.appendChild(createTaskCardDOM(task));
      });
    }
    elements.meetingDoneCount.textContent = `${completedLastWeek.length} ${completedLastWeek.length === 1 ? 'tarea completada' : 'tareas completadas'}`;

    // 4. Renderizar Columna Pendientes
    elements.meetingTodoList.innerHTML = '';
    if (pendingThisWeek.length === 0) {
      elements.meetingTodoList.innerHTML = `<div class="empty-state" style="padding: 30px 10px; border-style: dotted;"><p style="font-size: 13px;">¡Felicidades! No hay pendientes.</p></div>`;
    } else {
      pendingThisWeek.forEach(task => {
        elements.meetingTodoList.appendChild(createTaskCardDOM(task));
      });
    }
    elements.meetingTodoCount.textContent = `${pendingThisWeek.length} ${pendingThisWeek.length === 1 ? 'tarea pendiente' : 'tareas pendientes'}`;

  } else {
    // --- VISTA ESTÁNDAR ---
    // 1. Mostrar/Ocultar secciones
    elements.taskFormSection.style.display = 'block';
    elements.standardListSection.style.display = 'block';
    elements.meetingModeSection.style.display = 'none';

    // 2. Filtrar por estado de tarea en vista estándar
    let displayTasks = [...globalFilteredTasks];
    if (selectedStatusFilter === 'active') {
      displayTasks = displayTasks.filter(t => !t.completed);
    } else if (selectedStatusFilter === 'completed') {
      displayTasks = displayTasks.filter(t => t.completed);
    }

    // 3. Ordenar
    if (sortBy === 'created') {
      displayTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'due') {
      displayTasks.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    } else if (sortBy === 'priority') {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      displayTasks.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
    }

    // 4. Renderizar en el DOM
    elements.todoListContainer.innerHTML = '';
    
    if (displayTasks.length === 0) {
      elements.emptyState.style.display = 'flex';
    } else {
      elements.emptyState.style.display = 'none';
      displayTasks.forEach(task => {
        elements.todoListContainer.appendChild(createTaskCardDOM(task));
      });
    }
  }

  // 5. Actualizar Estadísticas Generales del Sidebar
  updateDashboardStats();
}

// Crear Elemento DOM de la Tarea
function createTaskCardDOM(task) {
  const card = document.createElement('div');
  card.className = `task-card ${task.completed ? 'completed' : ''}`;
  card.dataset.id = task.id;

  let priorityColor = '#3b82f6';
  let priorityBg = 'rgba(59, 130, 246, 0.1)';
  let priorityLabel = 'Baja';

  if (task.priority === 'high') {
    priorityColor = '#ef4444';
    priorityBg = 'rgba(239, 68, 68, 0.1)';
    priorityLabel = 'Alta';
  } else if (task.priority === 'medium') {
    priorityColor = '#f59e0b';
    priorityBg = 'rgba(245, 158, 11, 0.1)';
    priorityLabel = 'Media';
  }

  card.style.setProperty('--priority-color', priorityColor);
  card.style.setProperty('--priority-bg-color', priorityBg);

  const cat = CATEGORIES[task.category] || CATEGORIES.work;

  let dueDateHTML = '';
  if (task.dueDate) {
    const dueDateObj = new Date(task.dueDate + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isOverdue = dueDateObj < today && !task.completed;
    
    const dateOptions = { month: 'short', day: 'numeric' };
    const formattedDueDate = dueDateObj.toLocaleDateString('es-ES', dateOptions);
    
    dueDateHTML = `
      <span class="task-due-date ${isOverdue ? 'overdue' : ''}">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
        ${isOverdue ? 'Vencido: ' : ''}${formattedDueDate}
      </span>
    `;
  }

  card.innerHTML = `
    <div class="checkbox-wrapper">
      <input type="checkbox" class="real-checkbox" ${task.completed ? 'checked' : ''}>
      <div class="custom-checkbox">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
    </div>
    
    <div class="task-details">
      <span class="task-title-text">${task.text}</span>
      <div class="task-meta-info">
        <span class="task-badge task-badge-category">
          ${cat.name}
        </span>
        <span class="task-badge task-badge-priority">
          ${priorityLabel}
        </span>
        ${dueDateHTML}
      </div>
    </div>
    
    <div class="task-actions">
      <button class="action-btn btn-edit" title="Editar tarea">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>
      <button class="action-btn btn-delete" title="Eliminar tarea">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  `;

  // Listeners
  const checkbox = card.querySelector('.real-checkbox');
  checkbox.addEventListener('change', () => toggleTask(task.id));

  const deleteBtn = card.querySelector('.btn-delete');
  deleteBtn.addEventListener('click', () => deleteTask(task.id));

  const editBtn = card.querySelector('.btn-edit');
  const titleSpan = card.querySelector('.task-title-text');
  editBtn.addEventListener('click', () => startEditTask(task.id, titleSpan));

  return card;
}

// 10. ACTUALIZAR ESTADÍSTICAS
function updateDashboardStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active = total - completed;

  elements.badgeAll.textContent = total;
  elements.badgeActive.textContent = active;
  elements.badgeCompleted.textContent = completed;

  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  elements.progressText.textContent = `${percentage}%`;
  elements.progressStatsText.textContent = `${completed} de ${total} completadas`;

  const offset = CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE;
  elements.progressCircle.style.strokeDashoffset = offset;
}

// 11. COPIAR REPORTE (Slack/Teams)
function copyMeetingReport() {
  // Aplicar filtros de categoría/búsqueda si están activos para generar el reporte personalizado
  let reportTasks = [...tasks];
  if (selectedCategoryFilter !== 'all') {
    reportTasks = reportTasks.filter(t => t.category === selectedCategoryFilter);
  }
  if (searchQuery) {
    reportTasks = reportTasks.filter(t => t.text.toLowerCase().includes(searchQuery));
  }

  // Filtrar
  const completedLast7Days = reportTasks.filter(t => t.completed && isWithinLast7Days(t.completedAt));
  const pending = reportTasks.filter(t => !t.completed);

  // Ordenar por prioridad
  const priorityWeight = { high: 3, medium: 2, low: 1 };
  const priorityLabel = { high: 'Alta', medium: 'Media', low: 'Baja' };
  pending.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);

  // Construir mensaje
  let text = `📊 *REPORTE DE SINCRONIZACIÓN SEMANAL - eCom_task*\n`;
  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  text += `📅 Generado: _${new Date().toLocaleDateString('es-ES', options)}_\n\n`;

  // Sección Completadas
  text += `✅ *CUMPLIDO (Semana Anterior):*\n`;
  if (completedLast7Days.length === 0) {
    text += `_No se registraron tareas completadas en los últimos 7 días._\n`;
  } else {
    completedLast7Days.forEach(t => {
      const cat = CATEGORIES[t.category]?.name || 'Otros';
      text += `• [x] *(${cat})* ${t.text}\n`;
    });
  }

  text += `\n`;

  // Sección Pendientes
  text += `📅 *POR HACER (Esta Semana):*\n`;
  if (pending.length === 0) {
    text += `_¡No hay tareas pendientes asignadas!_\n`;
  } else {
    pending.forEach(t => {
      const cat = CATEGORIES[t.category]?.name || 'Otros';
      const prio = priorityLabel[t.priority] || 'Baja';
      let dateStr = '';
      if (t.dueDate) {
        const dueDateObj = new Date(t.dueDate + 'T00:00:00');
        dateStr = ` (Vence: ${dueDateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })})`;
      }
      text += `• [ ] *(${cat})* ${t.text} _[Prioridad ${prio}]_${dateStr}\n`;
    });
  }

  // Copiar al portapapeles
  navigator.clipboard.writeText(text).then(() => {
    // Retroalimentación visual en el botón
    const btnSpan = elements.btnCopyReport.querySelector('span');
    const originalText = btnSpan.textContent;
    btnSpan.textContent = '¡Reporte Copiado!';
    elements.btnCopyReport.style.borderColor = 'var(--color-success)';
    elements.btnCopyReport.style.color = 'var(--color-success)';
    
    setTimeout(() => {
      btnSpan.textContent = originalText;
      elements.btnCopyReport.style.borderColor = '';
      elements.btnCopyReport.style.color = '';
    }, 2000);
  }).catch(err => {
    console.error('Error al copiar al portapapeles', err);
    alert('No se pudo copiar automáticamente. Por favor, inténtalo de nuevo.');
  });
}

// Ejecutar init al cargar
window.addEventListener('DOMContentLoaded', init);
