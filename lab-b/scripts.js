// Funkcja walidująca zadanie
function isValidTask(text, date) {
  if (text.length < 3 || text.length > 255) return false;
  if (date) {
    const today = new Date();
    const inputDate = new Date(date);
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);
    if (inputDate < today) return false;
  }
  return true;
}

// Pobierz zadania z localStorage
function getTasks() {
  return JSON.parse(localStorage.getItem('tasks') || '[]');
}

// Zapisz zadania do localStorage
function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Renderuj listę zadań
function renderTasks(filter = '') {
  const tasks = getTasks();
  const todoList = document.querySelector('.todo-list');
  // Usuń wszystko oprócz formularza dodawania
  todoList.querySelectorAll('.todo-item').forEach(el => el.remove());

  // Filtrowanie i wyróżnianie (opcjonalnie, jeśli chcesz dodać wyszukiwarkę)
  let filteredTasks = tasks;
  if (filter && filter.length >= 2) {
    filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(filter.toLowerCase()));
  }

  filteredTasks.forEach((task, idx) => {
    const item = document.createElement('div');
    item.className = 'todo-item';

    // Wyróżnianie frazy jeśli jest filtr
    let displayText = task.text;
    if (filter && filter.length >= 2) {
      const re = new RegExp(`(${filter})`, 'gi');
      displayText = task.text.replace(re, '<mark>$1</mark>');
    }

    item.innerHTML = `
      <span class="todo-checkbox"><input type="checkbox"></span>
      <span class="todo-text" contenteditable="true">${displayText}</span>
      <span class="todo-date">${task.date || ''}</span>
      <button class="delete-button" data-idx="${tasks.indexOf(task)}">Usuń</button>
    `;
    // Wstaw przed formularzem dodawania
    const addForm = todoList.querySelector('.todo-add');
    todoList.insertBefore(item, addForm);
  });

  // Blokowanie entera w każdym polu edycji
  document.querySelectorAll('.todo-text').forEach(el => {
    el.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderTasks();

  const addBtn = document.querySelector('.add-button');
  addBtn.addEventListener('click', function (e) {
    e.preventDefault();
    const textInput = document.querySelector('.todo-add input[type="text"]');
    const dateInput = document.querySelector('.todo-add input[type="date"]');
    const text = textInput.value.trim();
    const date = dateInput.value;

    if (!isValidTask(text, date)) {
      alert("Zadanie musi mieć 3-255 znaków, a data nie może być z przeszłości.");
      return;
    }

    const tasks = getTasks();
    tasks.push({ text, date });
    saveTasks(tasks);
    renderTasks();

    textInput.value = '';
    dateInput.value = '';
  });

  // Usuwanie zadania
  document.querySelector('.todo-list').addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-button')) {
      const idx = e.target.getAttribute('data-idx');
      const tasks = getTasks();
      tasks.splice(idx, 1);
      saveTasks(tasks);
      renderTasks();
    }
  });

  // Edycja zadania (na blur)
  document.querySelector('.todo-list').addEventListener('blur', function(e) {
    if (e.target.classList.contains('todo-text')) {
      const idx = Array.from(document.querySelectorAll('.todo-text')).indexOf(e.target);
      const tasks = getTasks();
      // Usuwamy znaczniki <mark> jeśli były
      const text = e.target.innerText.trim();
      tasks[idx].text = text;
      saveTasks(tasks);
      renderTasks();
    }
  }, true);

  // Wyszukiwarka
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const filter = searchInput.value.trim();
      renderTasks(filter);
    });
  }
});
