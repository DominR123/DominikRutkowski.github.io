class Todo {
  constructor() {
    this.tasks = this.loadTasks();
    this.todoList = document.querySelector('.todo-list');
    this.addBtn = document.querySelector('.add-button');
    this.textInput = document.querySelector('.todo-add input[type="text"]');
    this.dateInput = document.querySelector('.todo-add input[type="date"]');
    this.searchInput = document.querySelector('.search-input');
    this.filter = '';

    this.draw();

    this.addBtn.addEventListener('click', (e) => this.handleAdd(e));
    this.todoList.addEventListener('click', (e) => this.handleListClick(e));
    this.todoList.addEventListener('blur', (e) => this.handleBlur(e), true);
    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => this.handleSearch());
    }
  }

  isValidTask(text, date) {
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

  loadTasks() {
    return JSON.parse(localStorage.getItem('tasks') || '[]');
  }
  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  draw() {
    // Usuwanie starych elementów
    this.todoList.querySelectorAll('.todo-item').forEach(el => el.remove());

    let filteredTasks = this.tasks;
    if (this.filter && this.filter.length >= 2) {
      filteredTasks = this.tasks.filter(task => task.text.toLowerCase().includes(this.filter.toLowerCase()));
    }

    filteredTasks.forEach((task, idx) => {
      const item = document.createElement('div');
      item.className = 'todo-item';

      let displayText = task.text;
      if (this.filter && this.filter.length >= 2) {
        const re = new RegExp(`(${this.filter})`, 'gi');
        displayText = task.text.replace(re, '<mark>$1</mark>');
      }

      item.innerHTML = `
        <span class="todo-checkbox"><input type="checkbox"></span>
        <span class="todo-text" data-idx="${idx}">${displayText}</span>
        <span class="todo-date" data-idx="${idx}">${task.date || ''}</span>
        <button class="delete-button" data-idx="${idx}">Usuń</button>
      `;
      const addForm = this.todoList.querySelector('.todo-add');
      this.todoList.insertBefore(item, addForm);
    });
  }

  handleAdd(e) {
    e.preventDefault();
    const text = this.textInput.value.trim();
    const date = this.dateInput.value;

    if (!this.isValidTask(text, date)) {
      alert("Zadanie musi mieć 3-255 znaków, a data nie może być z przeszłości.");
      return;
    }

    this.tasks.push({ text, date });
    this.saveTasks();
    this.draw();

    this.textInput.value = '';
    this.dateInput.value = '';
  }

  handleListClick(e) {
    // Usuwanie
    if (e.target.classList.contains('delete-button')) {
      const idx = e.target.getAttribute('data-idx');
      this.tasks.splice(idx, 1);
      this.saveTasks();
      this.draw();
      return;
    }

    if (e.target.classList.contains('todo-text')) {
      const span = e.target;
      const idx = span.getAttribute('data-idx');
      const oldValue = span.innerText;
      const input = document.createElement('input');
      input.type = 'text';
      input.value = oldValue;
      input.className = 'todo-edit-input';
      input.setAttribute('data-idx', idx);
      span.replaceWith(input);
      input.focus();

      input.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') input.blur();
      });
    }

    if (e.target.classList.contains('todo-date')) {
      const span = e.target;
      const idx = span.getAttribute('data-idx');
      const oldValue = span.innerText;
      const input = document.createElement('input');
      input.type = 'date';
      input.value = oldValue || '';
      input.className = 'todo-edit-date';
      input.setAttribute('data-idx', idx);
      span.replaceWith(input);
      input.focus();

      input.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') input.blur();
      });
    }
  }

  handleBlur(e) {
    if (e.target.classList.contains('todo-edit-input')) {
      const idx = e.target.getAttribute('data-idx');
      const newValue = e.target.value.trim();
      if (this.isValidTask(newValue, this.tasks[idx].date)) {
        this.tasks[idx].text = newValue;
        this.saveTasks();
        this.draw();
      } else {
        alert('Tekst musi mieć 3-255 znaków');
        this.draw();
      }
    }
    if (e.target.classList.contains('todo-edit-date')) {
      const idx = e.target.getAttribute('data-idx');
      const newDate = e.target.value;
      if (this.isValidTask(this.tasks[idx].text, newDate)) {
        this.tasks[idx].date = newDate;
        this.saveTasks();
        this.draw();
      } else {
        alert('Data musi być pusta lub w przyszłości');
        this.draw();
      }
    }
  }

  handleSearch() {
    this.filter = this.searchInput.value.trim();
    this.draw();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.todo = new Todo();
});
