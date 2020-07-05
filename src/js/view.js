import { compareAsc, format } from 'date-fns';
import { todoController } from './controller';
import { todoModel } from './model';
import { id } from 'date-fns/locale';

const todoView = (() => {
  let wrapper = document.querySelector('.container');
  let list = document.querySelector('.projects-list');
  let single = document.querySelector('.projects-container');

/* *************************************************************************
  REMOVE PROJECT
************************************************************************* */
  const removeProjects = (type = '') => {
    let projects = document.getElementsByClassName('cont-projects');
    while(projects[0]) {
      projects[0].parentNode.removeChild(projects[0]);
    }
    if (type == 'del') {
      clearList();
    }
  }

/* *************************************************************************
  REMOVE TASK
************************************************************************* */
const removeTask = (type = '', line = '', id = '') => {
  if (type == 'new') {
    let projects = document.getElementById('el-new');
    projects.parentNode.removeChild(projects);
  } else if(type == 'del') {
    let projects = document.getElementById('el' + id);
    projects.parentNode.removeChild(projects);
  } else if (type == 'editc') {
    let projects = document.getElementById('el-edit' + id);
    projects.parentNode.removeChild(projects);
  } else {
    let projects = document.getElementById('el-edit' + id);
    projects.parentNode.removeChild(projects);
    let projects1 = document.getElementById('el' + id);
    projects1.parentNode.removeChild(projects1);
  }
}

/* *************************************************************************
  CLEAR PROJECT LIST
************************************************************************** */
  const clearList = () => {
    let list = document.getElementsByClassName('projects');
      while(list[0]) {
        list[0].parentNode.removeChild(list[0]);
      }
  }

/* *************************************************************************
  RENDER EDIT PROJECT
************************************************************************** */
  const renderEditProject = (type, array, tasks) => {
    let id = '', name = '', desc = '';
    if (type == 'edit') {
      id = array.id;
      name = array.name;
      desc = array.desc;
    }
    let project = document.createElement('div');
    project.setAttribute('class', 'cont-projects');
    project.setAttribute('id', id)
    single.appendChild(project);
    let taskDiv = document.createElement('div');
    taskDiv.setAttribute('class', 'task-item');
    renderElement(taskDiv, 'label', 'title', 'Title: ');
    renderElement(taskDiv, 'input', 
                  ['type', 'placeholder', 'id', 'name', 'value'],
                  ['text', 'enter project title', 'name' + id, 'title', name]);
    project.appendChild(taskDiv);

    let taskDesc = document.createElement('div');
    taskDesc.setAttribute('class', 'task-item');
    renderElement(taskDesc, 'label', 'description', 'Description: ');
    renderElement(taskDesc, 'textarea', [ 'placeholder', 'id', 'name', 'rows', 'cols'],
                  ['enter project description', 'desc' + id, 'description', 3, 25], desc);
    project.appendChild(taskDesc);

    let btnDiv = document.createElement('div');
    btnDiv.setAttribute('class', 'project-btns');

    let btnSave = document.createElement('button');
    btnSave.setAttribute('class', 'project-btn low');
    btnSave.innerHTML = `<i class='cap-icon ci-save'></i>`

    let btnCancel = document.createElement('button');
    btnCancel.setAttribute('class', 'project-btn high');
    btnCancel.innerHTML = `<i class='cap-icon ci-times'></i>`
  
    btnDiv.appendChild(btnSave);
    btnDiv.appendChild(btnCancel);
    project.appendChild(btnDiv);

    btnCancel.addEventListener('click', function (event) {
      todoController.selectedProject(array, tasks, 'add');
      removeProjects();
    });
    btnSave.addEventListener('click', function (event) {
      let id = project.id;
      let name = document.getElementById('name'+project.id);
      name = name.value;
      let desc = document.getElementById('desc'+project.id);
      desc = desc.value;
      todoController.editProject(id, name, desc)
      if (type == 'edit') {
        todoController.updateProject(id, name, desc, '', array, tasks);
      } else {
        todoController.updateProject(id, name, desc, 'add');
      }
    });
  }

/* *************************************************************************
  RENDER PROJECT
************************************************************************** */
  const renderProject = (array, tasks, type = '') => {
    
    let project = document.createElement('div');
    if (type !== '') {
      project.setAttribute('class', 'cont-projects');
      project.setAttribute('id', 'con' + array.id);
    } else {
      project.setAttribute('class', 'projects');
      project.setAttribute('id', 'pro' + array.id);
    }

    let projectDet = document.createElement('div');
    projectDet.setAttribute('class', 'projects-det');
    projectDet.setAttribute('id', 'prodet' + array.id);

    renderElement(projectDet, 'h3', '', `<span>Title : </span> ${array.name}`);
    renderElement(projectDet, 'p', '', `<span>Description : </span> ${array.desc}`);

    let btnNew = document.querySelector('#new-project');
    btnNew.addEventListener('click', function (event) {
      todoController.editProject('add');
    });

    let btnDiv = document.createElement('div');
    btnDiv.setAttribute('class', 'project-btns');
    
    if (!type) {
      list.appendChild(project);

      projectDet.addEventListener('click', function (event) {
        todoController.selectedProject(array, tasks);
        clearClass();
        projectDet.classList.add('pro-det');
      });

      project.appendChild(projectDet);
    } else {
      let btnEdit = document.createElement('button');
      btnEdit.setAttribute('class', 'project-btn medium');
      btnEdit.innerHTML = `<i class="cap-icon ci-pencil"></i>`

      let btnAdd = document.createElement('button');
      btnAdd.setAttribute('class', 'project-btn low');
      btnAdd.innerHTML = `<i class='cap-icon ci-plus'></i>`;

      let btnDel = document.createElement('button');
      btnDel.setAttribute('class', 'project-btn high');
      btnDel.innerHTML = `<i class="cap-icon ci-trash"></i>`;

      single.appendChild(project);
  
      btnDiv.appendChild(btnAdd);
      btnDiv.appendChild(btnEdit);
      btnDiv.appendChild(btnDel);

      btnEdit.addEventListener('click', function (event) {
        todoController.editProject('edit', array, tasks)
      });
      btnDel.addEventListener('click', function (event) {
        todoController.delProject(array.id);
      });
      btnAdd.addEventListener('click', function (event) {
        todoController.editTask('add', array);
      });

      projectDet.appendChild(btnDiv);
      project.appendChild(projectDet);
      let projectTasks = document.createElement('div');
      projectTasks.setAttribute('id', 'contasks' + array.id);
      project.appendChild(projectTasks);
    }

  };

  const clearClass = () => {
    var elems = document.querySelectorAll(".projects-det");
    [].forEach.call(elems, function(el) {
        el.classList.remove("pro-det");
    });
  }

/* *************************************************************************
  RENDER TASKS
************************************************************************** */
  const renderTasks = (id, tasks) => {
    let project = document.getElementById('contasks' + id);
    let task = document.createElement('div');
    task.setAttribute('class', 'tasks');
    task.setAttribute('id', 'el' + tasks.id);

    if (tasks.priority == 1) {
      task.classList.add('low');
    } else if (tasks.priority == 2) {
      task.classList.add('medium');
    } else {
      task.classList.add('high');
    }

    renderElement(task, 'input', 
                  ['type', 'placeholder', 'id', 'name', 'value'],
                  ['checkbox', '', 'status' + tasks.id, 'status', tasks.status]);
    renderElement(task, 'h3', '', `<span> </span> ${tasks.title}`);

    let btnDiv = document.createElement('div');
    btnDiv.setAttribute('class', 'project-btns');

    let btnEdit = document.createElement('button');
    btnEdit.setAttribute('class', 'project-btn medium');
    btnEdit.innerHTML = `<i class='cap-icon ci-pencil'></i>`

    let btnDel = document.createElement('button');
    btnDel.setAttribute('class', 'project-btn high');
    btnDel.innerHTML = `<i class="cap-icon ci-trash"></i>`;

    project.appendChild(task);
    btnDiv.appendChild(btnEdit);
    btnDiv.appendChild(btnDel);
    task.appendChild(btnDiv);
    if (tasks.status) document.getElementById('status' + tasks.id).checked = true;

    btnEdit.addEventListener('click', function (event) {
      todoController.editTask('edit', id, tasks)
    });
    btnDel.addEventListener('click', function (event) {
      todoController.delTask('del', id, tasks.id);
    });

    checkStatus(tasks);

    let chkStatus = document.getElementById('status' + tasks.id);
    chkStatus.addEventListener('click', function(event) {
      checkStatus(tasks);
    })
  };

/* *************************************************************************
  RENDER TASK
************************************************************************** */
  const renderTask = (projectId, tasks, type = '') => {
    let id = '', title = '', description = '', dueDate = '', priority = '', status = '';
    if (type == 'edit') {
      id = tasks.id;
      title = tasks.title;
      description = tasks.description;
      dueDate = tasks.dueDate;
      priority = tasks.priority;
      status = tasks.status;
    }
    let project = document.getElementById('con' + projectId);

    let task = document.createElement('div');
    task.setAttribute('class', 'task');
    
    if (!type) {
      let taskExists = document.getElementById('el-new');
      if (taskExists) { return };
      task.setAttribute('id', 'el-new' );
    } else {
      let taskExists1 = document.getElementById('el-edit' + tasks.id);
      if (taskExists1) { return };
      task.setAttribute('id', 'el-edit' + tasks.id);
    }

    if (tasks.priority == 1) {
      task.classList.add('low');
    } else if (tasks.priority == 2) {
      task.classList.add('medium');
    } else {
      task.classList.add('high');
    }

    let taskDiv = document.createElement('div');
    taskDiv.setAttribute('class', 'task-item');
    renderElement(taskDiv, 'label', 'title', 'Title: ');
    renderElement(taskDiv, 'input', 
                  ['type', 'placeholder', 'id', 'name', 'value'],
                  ['text', 'enter task title', 'title' + tasks.id, 'title', tasks.title]);
    task.appendChild(taskDiv);

    let taskDesc = document.createElement('div');
    taskDesc.setAttribute('class', 'task-item');
    renderElement(taskDesc, 'label', 'description', 'Description: ');
    renderElement(taskDesc, 'textarea', [ 'placeholder', 'id', 'name', 'rows', 'cols'],
                  ['enter task description', 'description' + tasks.id, 'description', 3, 15], tasks.description);
    task.appendChild(taskDesc);

    let taskDate = document.createElement('div');
    taskDate.setAttribute('class', 'task-item');
    renderElement(taskDate, 'label', 'dueDate', 'Due Date: ')
    renderElement(taskDate, 'input', ['type', 'placeholder', 'id', 'name', 'value'],
                  ['date', 'enter task date', 'dueDate' + tasks.id, 'dueDate', tasks.dueDate]);
    task.appendChild(taskDate);

    let taskPriority = document.createElement('div');
    taskPriority.setAttribute('class', 'task-item-radio');
    renderElement(taskPriority, 'p', '', 'Priority: ');
    renderElement(taskPriority, 'input', ['type', 'placeholder', 'id', 'name', 'value'], 
                  ['radio', 'enter task title', 'high' + tasks.id, 'priority' + tasks.id, 'low']);
    renderElement(taskPriority, 'label', 'high' + tasks.id, ' Low');
    renderElement(taskPriority, 'input', ['type', 'placeholder', 'id', 'name', 'value'], 
                  ['radio', 'enter task title', 'medium' + tasks.id, 'priority' + tasks.id, 'medium']);
    renderElement(taskPriority, 'label', 'medium' + tasks.id, ' Medium');
    renderElement(taskPriority, 'input', ['type', 'placeholder', 'id', 'name', 'value'], 
                  ['radio', 'enter task title', 'low' + tasks.id, 'priority' + tasks.id, 'high']);
    renderElement(taskPriority, 'label', 'low' + tasks.id, ' High');
    task.appendChild(taskPriority);

    let taskStatus = document.createElement('div');
    taskStatus.setAttribute('class', 'task-item-radio');
    renderElement(taskStatus, 'p', '', 'Finished: ');
    
    renderElement(taskStatus, 'input', ['type', 'placeholder', 'id', 'name', 'value'], 
                  ['checkbox', 'enter task title', 'open' + tasks.id, 'status' + tasks.id, 'open']);
    task.appendChild(taskStatus);

    let btnDiv = document.createElement('div');
    btnDiv.setAttribute('class', 'project-btns');

    let btnSave = document.createElement('button');
    btnSave.setAttribute('class', 'project-btn low');
    btnSave.innerHTML = `<i class='cap-icon ci-save'></i>`

    let btnCancel = document.createElement('button');
    btnCancel.setAttribute('class', 'project-btn high');
    btnCancel.innerHTML = `<i class='cap-icon ci-times'></i>`
  
    btnDiv.appendChild(btnSave);
    btnDiv.appendChild(btnCancel);
    task.appendChild(btnDiv);
    
    btnCancel.addEventListener('click', function (event) {
      type == 'edit' ? removeTask('editc', '-', tasks.id) : removeTask('new', '-', tasks.id);
    });

    btnSave.addEventListener('click', function (event) {
      let id = tasks.id;
      let title = document.getElementById('title'+tasks.id);
      title = title.value;
      let description = document.getElementById('description'+tasks.id);
      description = description.value;
      let dueDate = document.getElementById('dueDate'+tasks.id);
      dueDate = dueDate.value;
      let priority = priorityCheck;
      let status = statusCheck;
      if (title != 'undefined') {
        if (type == 'edit') {
          todoController.updateTask(projectId, id, title, description, dueDate, priority, status, '', tasks);
        } else {
          todoController.updateTask(projectId, id, title, description, dueDate, priority, status, 'add');
        }
      }
    });
    
    project.appendChild(task);
    checkStatus(tasks, 'edit');
    checkPriority(tasks);
    
    let statusCheck = false;
    let chkStatus = document.getElementById('open' + tasks.id);
    chkStatus.addEventListener('click', function(event) {
      checkStatus(tasks);
      statusCheck = chkStatus.checked;
    });

    let priorityCheck = 1;
    if (type == 'edit') { priorityCheck = priority };
    let chkHigh = document.getElementById('high' + tasks.id);
    chkHigh.addEventListener('click', function(event) {
      priorityCheck = 1;
    });
    let chkMedium = document.getElementById('medium' + tasks.id);
    chkMedium.addEventListener('click', function(event) {
      priorityCheck = 2;
    });
    let chkLow = document.getElementById('low' + tasks.id);
    chkLow.addEventListener('click', function(event) {
      priorityCheck = 3;
    });
  };

/* *************************************************************************
  RENDER ELEMENT
************************************************************************** */
  const renderElement = (taskDiv, type, attr, value, text = '', state = '') => {
    let element = document.createElement(type);
    if (type == 'p') { element.textContent = value; };
    if (type == 'label') {
      element.htmlFor = attr;
      element.innerHTML = value;
    } else {
      for (let i = 0; i < attr.length; i++) {
        element.setAttribute(attr[i], value[i]);
      }
    }
    element.classList.add('task-element');
    if (!attr) { element.innerHTML = value; };
    if (text != '') {
      element.textContent = text;
    };
    taskDiv.appendChild(element);
  }

/* *************************************************************************
  CHECK
************************************************************************* */
  const checkStatus = (tasks, type = '') => {
      if (tasks.status) {
        if (type == 'edit') {
          document.getElementById('open' + tasks.id).checked = true;
        }
        let deco = document.getElementById('el' + tasks.id);
        deco.style.textDecoration = 'line-through';
    } else {
      //document.getElementById('el' + tasks.id).style.textDecoration = 'none';
    }
  }

  const checkPriority = (tasks, type = '') => {
    if (type == 'add') {
      document.getElementById('low' + tasks.id).checked = true;
    } else {
      if (tasks.priority == 1) {
        document.getElementById('high' + tasks.id).checked = true;
      } else if (tasks.priority == 2) {
        document.getElementById('medium' + tasks.id).checked = true;
      } else {
        document.getElementById('low' + tasks.id).checked = true;
      }
    }
  } 

  return {
    renderProject, renderTask, renderTasks, removeProjects, renderEditProject, removeTask, clearList
  };
})();

export {todoView}