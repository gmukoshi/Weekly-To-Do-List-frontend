document.addEventListener('DOMContentLoaded', ()=> {
  const apiUrl = 'https://weekly-to-do-list4.onrender.com/tasks';
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const weekDiv = document.getElementById('week');
  const taskInput = document.getElementById('taskInput');
  const daySelect = document.getElementById('daySelect');

  // Render day sections
  days.forEach(day => {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'day';
    dayDiv.innerHTML = `
      <h2>${day}</h2>
      <ul id="${day}-list"></ul>
    `;
    weekDiv.appendChild(dayDiv);
  });

  // Handle Add Activity button  
  function addActivity () {
    const text = taskInput.value.trim();
    const day = daySelect.value;
      
    if (text === '') {
      alert("Please enter an activity.");
      return;
    }

    const newTask = {
      text,
      day,
      completed: false
    };

    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    })
      .then(res => res.json())
      .then(task => {
        renderTask(task);
        taskInput.value = '';
      });
  };

  // Add support for Enter key
  taskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault(); // prevent form-like behavior
      addActivity();      //  call the add function
    }
  });

  // Fetch and render tasks from db.json
  function fetchTasks() {
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => data.forEach(task => renderTask(task)));
  }

  // Render a task into the appropriate day's list
  function renderTask(task) {
    const list = document.getElementById(`${task.day}-list`);
        if (!list) return;

    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');

    const span = document.createElement('span');
    span.textContent = task.text;
    span.style.flexGrow = 1;

    // Toggle completion on click
    span.addEventListener('click', () => {
      const updated = !task.completed;
      li.classList.toggle('completed');

      fetch(`${apiUrl}/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: updated })
      }).then(() => {
        task.completed = updated;
      });
    });

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '❌';
    deleteBtn.className = 'delete';
    deleteBtn.addEventListener('click', () => {
      fetch(`${apiUrl}/${task.id}`, {
        method: 'DELETE'
      }).then(() => {
        li.remove();
      });
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  }
  // Initial load
  window.addActivity = addActivity;
  fetchTasks();
});


