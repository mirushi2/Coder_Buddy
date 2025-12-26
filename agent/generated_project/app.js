// app.js – Core logic for ColorfulTodo
// This script is loaded with <script src="app.js" defer> (non‑module).
// All functionality is encapsulated in an IIFE to avoid polluting the global scope,
// except for the exported TodoStore which is attached to window for convenience.

(() => {
  // =============================
  // 1. Data Model & Persistence
  // =============================
  class Todo {
    /**
     * @param {Object} param0
     * @param {string} param0.id
     * @param {string} param0.title
     * @param {Date|null} param0.dueDate
     * @param {boolean} param0.completed
     * @param {number} param0.order
     */
    constructor({ id, title, dueDate = null, completed = false, order = Date.now() }) {
      this.id = id;
      this.title = title;
      this.dueDate = dueDate instanceof Date ? dueDate : dueDate ? new Date(dueDate) : null;
      this.completed = Boolean(completed);
      this.order = order;
    }
  }

  const TodoStore = (() => {
    let todos = [];
    const STORAGE_KEY = 'todos';

    const load = () => {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const arr = JSON.parse(raw);
          todos = arr.map((obj) => new Todo({
            id: obj.id,
            title: obj.title,
            dueDate: obj.dueDate ? new Date(obj.dueDate) : null,
            completed: obj.completed,
            order: obj.order,
          }));
          // sort by order (ascending)
          todos.sort((a, b) => a.order - b.order);
        } catch (e) {
          console.error('Failed to parse stored todos', e);
          todos = [];
        }
      }
    };

    const save = () => {
      const data = todos.map((t) => ({
        id: t.id,
        title: t.title,
        dueDate: t.dueDate ? t.dueDate.toISOString() : null,
        completed: t.completed,
        order: t.order,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    };

    const add = (todo) => {
      todos.push(todo);
      todos.sort((a, b) => a.order - b.order);
      save();
    };

    const update = (updatedTodo) => {
      const idx = todos.findIndex((t) => t.id === updatedTodo.id);
      if (idx !== -1) {
        todos[idx] = updatedTodo;
        save();
      }
    };

    const remove = (id) => {
      todos = todos.filter((t) => t.id !== id);
      save();
    };

    const reorder = (idArray) => {
      // idArray reflects the new visual order.
      todos = idArray.map((id, index) => {
        const t = todos.find((todo) => todo.id === id);
        if (t) t.order = index; // simple numeric order
        return t;
      }).filter(Boolean);
      save();
    };

    const getAll = () => [...todos]; // shallow copy

    const getById = (id) => todos.find((t) => t.id === id);

    // expose public API
    return { load, save, add, update, remove, reorder, getAll, getById };
  })();

  // Export for potential external use (e.g., testing)
  window.TodoStore = TodoStore;

  // =============================
  // 2. UI Rendering
  // =============================
  const renderTodoItem = (todo) => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    if (todo.completed) li.classList.add('completed');
    li.dataset.id = todo.id;
    li.draggable = true; // enable DnD on the whole item (handle will be the drag source)

    // Drag handle
    const dragHandle = document.createElement('span');
    dragHandle.className = 'drag-handle';
    dragHandle.title = 'Drag to reorder';
    dragHandle.innerHTML = '\u2630'; // simple hamburger icon
    li.appendChild(dragHandle);

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'toggle-complete';
    checkbox.checked = todo.completed;
    li.appendChild(checkbox);

    // Content wrapper
    const contentDiv = document.createElement('div');
    contentDiv.className = 'content';

    const titleSpan = document.createElement('span');
    titleSpan.className = 'title';
    titleSpan.contentEditable = true;
    titleSpan.spellcheck = false;
    titleSpan.textContent = todo.title;
    titleSpan.title = 'Click to edit';
    contentDiv.appendChild(titleSpan);

    if (todo.dueDate) {
      const dueBadge = document.createElement('span');
      dueBadge.className = 'due-date';
      dueBadge.textContent = todo.dueDate.toLocaleDateString();
      contentDiv.appendChild(dueBadge);
    }

    li.appendChild(contentDiv);

    // Action buttons container
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'actions';

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'edit-btn';
    editBtn.title = 'Edit';
    editBtn.innerHTML = '\u270E'; // pencil
    actionsDiv.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete-btn';
    deleteBtn.title = 'Delete';
    deleteBtn.innerHTML = '\u2716'; // cross
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(actionsDiv);

    // ------------------- Event Listeners -------------------
    // Toggle complete
    checkbox.addEventListener('change', handleToggleComplete);

    // Edit (blur)
    titleSpan.addEventListener('blur', handleEditTodo);
    // Optional: press Enter while editing should blur
    titleSpan.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        titleSpan.blur();
      }
    });

    // Edit button – focus the title span
    editBtn.addEventListener('click', () => titleSpan.focus());

    // Delete button
    deleteBtn.addEventListener('click', handleDeleteTodo);

    // Drag‑and‑Drop handlers (attached to the handle)
    dragHandle.addEventListener('dragstart', handleDragStart);
    dragHandle.addEventListener('dragend', handleDragEnd);
    // The drop target is the <li> itself
    li.addEventListener('dragover', handleDragOver);
    li.addEventListener('drop', handleDrop);

    return li;
  };

  const renderTodoList = (todos) => {
    const listEl = document.getElementById('todo-list');
    listEl.innerHTML = '';
    const fragment = document.createDocumentFragment();
    todos.forEach((todo) => {
      const li = renderTodoItem(todo);
      fragment.appendChild(li);
    });
    listEl.appendChild(fragment);
  };

  const updateFilterButtons = (activeFilter) => {
    const filters = {
      all: document.getElementById('filter-all'),
      active: document.getElementById('filter-active'),
      completed: document.getElementById('filter-completed'),
    };
    Object.entries(filters).forEach(([key, btn]) => {
      const isActive = key === activeFilter;
      btn.setAttribute('aria-pressed', isActive);
      if (isActive) btn.classList.add('active'); else btn.classList.remove('active');
    });
  };

  // =============================
  // 3. Event Handlers (CRUD)
  // =============================
  const handleAddTodo = (event) => {
    event.preventDefault();
    const titleInput = document.getElementById('new-todo-title');
    const dueInput = document.getElementById('new-todo-due');
    const title = titleInput.value.trim();
    if (!title) return;
    const dueDate = dueInput.value ? new Date(dueInput.value) : null;
    const todo = new Todo({
      id: crypto.randomUUID(),
      title,
      dueDate,
      completed: false,
      order: Date.now(),
    });
    TodoStore.add(todo);
    titleInput.value = '';
    dueInput.value = '';
    applyFilter(); // re‑render based on current filter
  };

  const handleToggleComplete = (event) => {
    const li = event.target.closest('.todo-item');
    if (!li) return;
    const id = li.dataset.id;
    const todo = TodoStore.getById(id);
    if (!todo) return;
    todo.completed = event.target.checked;
    TodoStore.update(todo);
    li.classList.toggle('completed', todo.completed);
  };

  const handleEditTodo = (event) => {
    const span = event.target;
    const li = span.closest('.todo-item');
    const id = li.dataset.id;
    const todo = TodoStore.getById(id);
    if (!todo) return;
    const newTitle = span.textContent.trim();
    if (newTitle && newTitle !== todo.title) {
      todo.title = newTitle;
      TodoStore.update(todo);
    } else {
      // revert UI to stored title if empty
      span.textContent = todo.title;
    }
  };

  const handleDeleteTodo = (event) => {
    const li = event.target.closest('.todo-item');
    if (!li) return;
    const id = li.dataset.id;
    // animate removal
    li.classList.add('exit');
    li.addEventListener('animationend', () => {
      TodoStore.remove(id);
      applyFilter();
    }, { once: true });
  };

  // =============================
  // 4. Filtering
  // =============================
  let currentFilter = 'all'; // 'all' | 'active' | 'completed'

  const applyFilter = () => {
    const all = TodoStore.getAll();
    let filtered;
    switch (currentFilter) {
      case 'active':
        filtered = all.filter((t) => !t.completed);
        break;
      case 'completed':
        filtered = all.filter((t) => t.completed);
        break;
      default:
        filtered = all;
    }
    renderTodoList(filtered);
    updateFilterButtons(currentFilter);
  };

  // =============================
  // 5. Drag‑and‑Drop Reordering
  // =============================
  let draggedId = null;

  const handleDragStart = (event) => {
    const li = event.target.closest('.todo-item');
    if (!li) return;
    draggedId = li.dataset.id;
    event.dataTransfer.setData('text/plain', draggedId);
    event.dataTransfer.effectAllowed = 'move';
    li.classList.add('dragging');
  };

  const handleDragEnd = (event) => {
    const li = event.target.closest('.todo-item');
    if (li) li.classList.remove('dragging');
    document.querySelectorAll('.drag-over').forEach((el) => el.classList.remove('drag-over'));
    draggedId = null;
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // necessary for drop to fire
    const li = event.currentTarget; // the <li> we are over
    if (li.dataset.id !== draggedId) {
      li.classList.add('drag-over');
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const targetLi = event.currentTarget;
    const targetId = targetLi.dataset.id;
    if (!draggedId || draggedId === targetId) return;

    // Remove visual cue
    targetLi.classList.remove('drag-over');

    // Build new order based on current DOM after insertion point.
    const listEl = document.getElementById('todo-list');
    const items = Array.from(listEl.querySelectorAll('.todo-item'));
    // Determine where to insert dragged element.
    const draggedEl = listEl.querySelector(`.todo-item[data-id="${draggedId}"]`);
    if (!draggedEl) return;

    // Insert before the target if dragging downwards, otherwise after.
    const draggedIndex = items.indexOf(draggedEl);
    const targetIndex = items.indexOf(targetLi);
    if (draggedIndex < targetIndex) {
      listEl.insertBefore(draggedEl, targetLi.nextSibling);
    } else {
      listEl.insertBefore(draggedEl, targetLi);
    }

    // After DOM rearranged, capture the new order of ids.
    const newOrder = Array.from(listEl.querySelectorAll('.todo-item')).map((el) => el.dataset.id);
    TodoStore.reorder(newOrder);
    applyFilter(); // re‑render to reflect any visual changes (order class updates)
  };

  // =============================
  // 6. Theme Switching
  // =============================
  const THEME_KEY = 'theme';
  const toggleTheme = () => {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
    // Update aria‑pressed for accessibility
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.setAttribute('aria-pressed', next === 'dark');
  };

  const applyStoredTheme = () => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) {
      document.documentElement.setAttribute('data-theme', stored);
      const btn = document.getElementById('theme-toggle');
      if (btn) btn.setAttribute('aria-pressed', stored === 'dark');
    }
  };

  // =============================
  // 7. Keyboard Shortcuts
  // =============================
  const handleKeyDown = (event) => {
    const activeEl = document.activeElement;
    // Enter on title input should submit form (default already does when inside form),
    // but we ensure it triggers the submit handler.
    if (event.key === 'Enter' && activeEl.id === 'new-todo-title') {
      event.preventDefault();
      document.getElementById('todo-form').requestSubmit();
      return;
    }

    // Ctrl + ArrowDown / ArrowUp – move focus between todo items
    if (event.ctrlKey && !event.shiftKey && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      const items = Array.from(document.querySelectorAll('.todo-item'));
      if (!items.length) return;
      const currentIdx = items.findIndex((el) => el.contains(activeEl));
      let nextIdx;
      if (event.key === 'ArrowDown') {
        nextIdx = currentIdx + 1 < items.length ? currentIdx + 1 : 0;
      } else {
        nextIdx = currentIdx - 1 >= 0 ? currentIdx - 1 : items.length - 1;
      }
      const target = items[nextIdx].querySelector('.title');
      if (target) target.focus();
      event.preventDefault();
    }

    // Ctrl+Shift+L – toggle light/dark mode
    if (event.ctrlKey && event.shiftKey && (event.key === 'L' || event.key === 'l')) {
      toggleTheme();
      event.preventDefault();
    }
  };

  // =============================
  // 8. Initialization
  // =============================
  document.addEventListener('DOMContentLoaded', () => {
    // Load persisted data
    TodoStore.load();
    // Apply stored theme before rendering UI
    applyStoredTheme();

    // Initial render (full list)
    currentFilter = 'all';
    applyFilter();

    // Bind form submit
    const form = document.getElementById('todo-form');
    form.addEventListener('submit', handleAddTodo);

    // Filter buttons
    document.getElementById('filter-all').addEventListener('click', () => {
      currentFilter = 'all';
      applyFilter();
    });
    document.getElementById('filter-active').addEventListener('click', () => {
      currentFilter = 'active';
      applyFilter();
    });
    document.getElementById('filter-completed').addEventListener('click', () => {
      currentFilter = 'completed';
      applyFilter();
    });

    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', toggleTheme);

    // Global shortcuts
    document.addEventListener('keydown', handleKeyDown);
  });
})();
