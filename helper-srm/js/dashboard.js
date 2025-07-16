// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Initialize dashboard
    initDashboard();
    // Initialize To-Do List
    initTodoList();
});

function initDashboard() {
    // Add smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add hover effects to cards
    const cards = document.querySelectorAll('.access-card, .stat-card, .activity-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add click analytics (optional)
    const accessCards = document.querySelectorAll('.access-card');
    accessCards.forEach(card => {
        card.addEventListener('click', function() {
            const cardTitle = this.querySelector('h3').textContent;
            console.log(`Navigating to: ${cardTitle}`);
        });
    });

    // Add loading animation
    const mainContent = document.querySelector('.main-content');
    mainContent.style.opacity = '0';
    mainContent.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        mainContent.style.transition = 'all 0.6s ease';
        mainContent.style.opacity = '1';
        mainContent.style.transform = 'translateY(0)';
    }, 100);

    // Animate stats on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.welcome-section, .quick-access, .recent-activity');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
    
    .stat-card:hover {
        animation: pulse 0.6s ease-in-out;
    }
`;
document.head.appendChild(style);

// To-Do List Functionality for Smart Study Planner
function initTodoList() {
    const todoInput = document.getElementById('todoInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const categorySelect = document.getElementById('categorySelect');
    const addTodoBtn = document.getElementById('addTodoBtn');
    const todoList = document.getElementById('todoList');
    const totalTasksElem = document.getElementById('totalTasks');
    const completedTasksElem = document.getElementById('completedTasks');
    const pendingTasksElem = document.getElementById('pendingTasks');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');

    // Check if elements exist (in case todo section is not present)
    if (!todoInput || !addTodoBtn || !todoList) {
        return;
    }

    let todos = JSON.parse(localStorage.getItem('studyTodos')) || [];
    let currentFilter = 'all';

    function saveTodos() {
        localStorage.setItem('studyTodos', JSON.stringify(todos));
    }

    function updateStats() {
        const total = todos.length;
        const completed = todos.filter(t => t.completed).length;
        const pending = total - completed;
        
        if (totalTasksElem) totalTasksElem.textContent = total;
        if (completedTasksElem) completedTasksElem.textContent = completed;
        if (pendingTasksElem) pendingTasksElem.textContent = pending;
    }

    function createTodoItem(todo) {
        const item = document.createElement('div');
        item.className = 'todo-item';
        if (todo.completed) item.classList.add('completed');
        item.dataset.id = todo.id;

        const checkbox = document.createElement('div');
        checkbox.className = 'todo-checkbox';
        if (todo.completed) checkbox.classList.add('checked');
        checkbox.title = 'Mark as completed';
        checkbox.addEventListener('click', () => {
            todo.completed = !todo.completed;
            saveTodos();
            renderTodos(currentFilter);
        });

        const content = document.createElement('div');
        content.className = 'todo-content';

        const text = document.createElement('div');
        text.className = 'todo-text';
        text.textContent = todo.text;

        const meta = document.createElement('div');
        meta.className = 'todo-meta';

        const priorityBadge = document.createElement('span');
        priorityBadge.className = 'priority-badge priority-' + todo.priority;
        priorityBadge.textContent = todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1);

        const categoryBadge = document.createElement('span');
        categoryBadge.className = 'category-badge';
        categoryBadge.textContent = todo.category.charAt(0).toUpperCase() + todo.category.slice(1);

        meta.appendChild(priorityBadge);
        meta.appendChild(categoryBadge);

        content.appendChild(text);
        content.appendChild(meta);

        const actions = document.createElement('div');
        actions.className = 'todo-actions-item';

        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.title = 'Edit task';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.addEventListener('click', () => {
            const newText = prompt('Edit task:', todo.text);
            if (newText !== null && newText.trim() !== '') {
                todo.text = newText.trim();
                saveTodos();
                renderTodos(currentFilter);
            }
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.title = 'Delete task';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this task?')) {
                todos = todos.filter(t => t.id !== todo.id);
                saveTodos();
                renderTodos(currentFilter);
            }
        });

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        item.appendChild(checkbox);
        item.appendChild(content);
        item.appendChild(actions);

        return item;
    }

    function renderTodos(filter) {
        todoList.innerHTML = '';
        let filteredTodos = todos;

        if (filter === 'pending') {
            filteredTodos = todos.filter(t => !t.completed);
        } else if (filter === 'completed') {
            filteredTodos = todos.filter(t => t.completed);
        } else if (filter === 'high') {
            filteredTodos = todos.filter(t => t.priority === 'high');
        }

        if (filteredTodos.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <i class="fas fa-clipboard-list"></i>
                <h3>No tasks found</h3>
                <p>Add your first study task to get started!</p>
            `;
            todoList.appendChild(emptyState);
        } else {
            filteredTodos.forEach(todo => {
                const todoItem = createTodoItem(todo);
                todoList.appendChild(todoItem);
            });
        }

        updateStats();
    }

    function addTodo() {
        const text = todoInput.value.trim();
        const priority = prioritySelect.value;
        const category = categorySelect.value;

        if (text === '') {
            alert('Please enter a task description.');
            todoInput.focus();
            return;
        }

        const newTodo = {
            id: Date.now(),
            text,
            priority,
            category,
            completed: false,
            createdAt: new Date().toISOString()
        };

        todos.unshift(newTodo); // Add to beginning of array
        saveTodos();
        renderTodos(currentFilter);
        
        // Reset form
        todoInput.value = '';
        prioritySelect.value = 'medium';
        categorySelect.value = 'study';
        todoInput.focus();
    }

    // Event Listeners
    addTodoBtn.addEventListener('click', addTodo);

    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            renderTodos(currentFilter);
        });
    });

    if (clearCompletedBtn) {
        clearCompletedBtn.addEventListener('click', () => {
            const completedCount = todos.filter(t => t.completed).length;
            if (completedCount === 0) {
                alert('No completed tasks to clear.');
                return;
            }
            if (confirm(`Are you sure you want to clear ${completedCount} completed task(s)?`)) {
                todos = todos.filter(t => !t.completed);
                saveTodos();
                renderTodos(currentFilter);
            }
        });
    }

    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            if (todos.length === 0) {
                alert('No tasks to clear.');
                return;
            }
            if (confirm('Are you sure you want to clear all tasks? This action cannot be undone.')) {
                todos = [];
                saveTodos();
                renderTodos(currentFilter);
            }
        });
    }

    // Initial render
    renderTodos(currentFilter);
    
    // Focus on input field
    setTimeout(() => {
        todoInput.focus();
    }, 500);
}
