mostrarConteudo('task-form');

function mostrarConteudo(conteudo) {
    const taskFormContainer = document.getElementById('task-form-container');
    const taskList = document.getElementById('task-list');
    const completedTasks = document.getElementById('completed-tasks');

    taskFormContainer.style.display = 'none';
    taskList.style.display = 'none';
    completedTasks.style.display = 'none';

    if (conteudo === 'task-form') {
        taskFormContainer.style.display = 'block';
    } else if (conteudo === 'task-list') {
        taskList.style.display = 'block';
    } else if (conteudo === 'completed-tasks') {
        completedTasks.style.display = 'block';
    }
}

function addTask() {
    const title = document.getElementById('task-title').value;
    const priority = document.getElementById('priority').value;
    const assignee = document.getElementById('assignee').value;
    const dueDate = document.getElementById('due-date').value;
    const description = document.getElementById('description').value;
    const checklistInput = document.getElementById('checklist').value;

    const checklistItems = checklistInput.split(',').map(item => item.trim());

    if (title && priority && assignee && dueDate) {
        const taskContainer = document.getElementById('tasks-container');

        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task');

        let taskContent = `
            <h3>${title}</h3>
            <p>Prioridade: ${traduzirPrioridade(priority)}</p>
            <p>Responsável: ${assignee}</p>
            <p>Data de Vencimento: ${dueDate}</p>
            <p>Descrição: ${description}</p>
        `;

        if (checklistItems.length > 0) {
            taskContent += '<h4>Checklist:</h4>';
            taskContent += '<ul>';
            checklistItems.forEach(item => {
                taskContent += `<li>${item}</li>`;
            });
            taskContent += '</ul>';
        }

        taskContent += '<button class="edit-button" onclick="openEditModal(this.parentNode)">Editar</button>';
        taskContent += '<button class="complete-button" onclick="completeTask(this.parentNode)">Concluir</button>';

        taskDiv.innerHTML = taskContent;
        taskContainer.appendChild(taskDiv);

        document.getElementById('task-form').reset();

        saveTasksToLocalStorage();
    } else {
        alert('Por favor, preencha todos os campos obrigatórios.');
    }
}

function traduzirPrioridade(priority) {
    switch (priority) {
        case 'high':
            return 'Alta';
        case 'medium':
            return 'Média';
        case 'low':
            return 'Baixa';
        default:
            return priority;
    }
}

function clearLocalStorage() {
    if (confirm("Tem certeza que deseja limpar todas as tarefas armazenadas?")) {
        localStorage.removeItem('tasks');
        localStorage.removeItem('completedTasks');

        location.reload();
    }
}

function openEditModal(taskDiv) {
    const taskInfo = taskDiv.querySelectorAll('p');
    const checklist = taskDiv.querySelector('ul');

    const title = taskDiv.querySelector('h3').innerText;
    const priority = taskInfo[0].innerText.split(": ")[1];
    const assignee = taskInfo[1].innerText.split(": ")[1];
    const dueDate = taskInfo[2].innerText.split(": ")[1];
    const description = taskInfo[3].innerText.split(": ")[1];

    const checklistItems = [];
    if (checklist) {
        const checklistItemsNodes = checklist.querySelectorAll('li');
        checklistItemsNodes.forEach(item => {
            checklistItems.push(item.innerText);
        });
    }

    const editForm = document.getElementById('edit-task-form');
    editForm.innerHTML = `
        <label for="edit-task-title">Título da Tarefa:</label>
        <input type="text" id="edit-task-title" name="edit-task-title" value="${title}" required>

        <label for="edit-priority">Prioridade:</label>
        <select id="edit-priority" name="edit-priority">
            <option value="Alta" ${priority === 'Alta' ? 'selected' : ''}>Alta</option>
            <option value="Média" ${priority === 'Média' ? 'selected' : ''}>Média</option>
            <option value="Baixa" ${priority === 'Baixa' ? 'selected' : ''}>Baixa</option>
        </select>

        <label for="edit-assignee">Responsável:</label>
        <input type="text" id="edit-assignee" name="edit-assignee" value="${assignee}">

        <label for="edit-due-date">Data de Vencimento:</label>
        <input type="date" id="edit-due-date" name="edit-due-date" value="${dueDate}">

        <label for="edit-description">Descrição:</label>
        <textarea id="edit-description" name="edit-description">${description}</textarea>

        <label for="edit-checklist">Checklist (separe os itens por vírgulas):</label>
        <input type="text" id="edit-checklist" name="edit-checklist" value="${checklistItems.join(', ')}">

        <button type="button" onclick="saveChanges('${title}', '${dueDate}')">Salvar</button>
        <button type="button" onclick="deleteTask('${title}')">Excluir</button>
    `;

    const editModal = document.getElementById('edit-task-modal');
    editModal.style.display = 'block';
}

function closeEditModal() {
    const editModal = document.getElementById('edit-task-modal');
    editModal.style.display = 'none';
}

function saveChanges(originalTitle, originalDueDate) {
    const newTitle = document.getElementById('edit-task-title').value;
    const newPriority = document.getElementById('edit-priority').value;
    const newAssignee = document.getElementById('edit-assignee').value;
    const newDueDate = document.getElementById('edit-due-date').value;
    const newDescription = document.getElementById('edit-description').value;
    const newChecklistInput = document.getElementById('edit-checklist').value;

    const newChecklistItems = newChecklistInput.split(',').map(item => item.trim());

    const tasksContainer = document.getElementById('tasks-container');
    const tasks = tasksContainer.getElementsByClassName('task');

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const taskTitle = task.querySelector('h3').innerText;

        if (taskTitle === originalTitle) {
            task.querySelector('h3').innerText = newTitle;
            task.querySelector('p:nth-of-type(1)').innerText = `Prioridade: ${newPriority}`;
            task.querySelector('p:nth-of-type(2)').innerText = `Responsável: ${newAssignee}`;
            task.querySelector('p:nth-of-type(3)').innerText = `Data de Vencimento: ${newDueDate}`;
            task.querySelector('p:nth-of-type(4)').innerText = `Descrição: ${newDescription}`;

            const checklist = task.querySelector('ul');
            if (checklist) {
                checklist.innerHTML = '';
                newChecklistItems.forEach(item => {
                    const listItem = document.createElement('li');
                    listItem.innerText = item;
                    checklist.appendChild(listItem);
                });
            }

            closeEditModal();

            saveTasksToLocalStorage();
            
            break;
        }
    }
}

function deleteTask(originalTitle) {
    const confirmDelete = confirm("Tem certeza que deseja excluir esta tarefa?");
    if (confirmDelete) {
        const tasksContainer = document.getElementById('tasks-container');
        const tasks = tasksContainer.getElementsByClassName('task');

        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            const taskTitle = task.querySelector('h3').innerText;

            if (taskTitle === originalTitle) {
                task.remove();

                closeEditModal();

                saveTasksToLocalStorage();

                break;
            }
        }
    }
}

function completeTask(taskDiv) {
    const completedContainer = document.getElementById('completed-container');
    const taskContent = taskDiv.innerHTML;

    const completedDiv = document.createElement('div');
    completedDiv.classList.add('completed-task');
    completedDiv.innerHTML = taskContent;

    const buttons = completedDiv.querySelectorAll('button');
    buttons.forEach(button => {
        button.remove();
    });

    completedContainer.appendChild(completedDiv);

    taskDiv.remove();

    saveTasksToLocalStorage();
}

function saveTasksToLocalStorage() {
    const tasksContainer = document.getElementById('tasks-container');
    const completedContainer = document.getElementById('completed-container');

    const tasksHTML = tasksContainer.innerHTML;
    const completedHTML = completedContainer.innerHTML;

    localStorage.setItem('tasks', tasksHTML);
    localStorage.setItem('completedTasks', completedHTML);
}

function loadTasksFromLocalStorage() {
    const tasksContainer = document.getElementById('tasks-container');
    const completedContainer = document.getElementById('completed-container');

    const tasksHTML = localStorage.getItem('tasks');
    const completedHTML = localStorage.getItem('completedTasks');

    tasksContainer.innerHTML = tasksHTML || '';
    completedContainer.innerHTML = completedHTML || '';
}

loadTasksFromLocalStorage();


