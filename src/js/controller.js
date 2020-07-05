import { todoModel } from "./model";
import { todoView } from "./view";

const todoController = (() => {
  
  const createProject = (project, tasks) => {
    for (let i = 0; i < project.length; i++) {
      let id = project.map(a => a.id);
      todoView.renderProject(project[i]);
    }
  };

  function updateProject(id, name, desc, type = '', array, tasks) {
    if (type == '') {
      todoModel.editProject(id, name, desc);
      selectedProject(array, tasks, 'edit');
    } else {
      let newProject = todoModel.editProject(id, name, desc, 'add');
      selectedProject(newProject, '', 'add');
    }
  }

  function selectedProject(project, tasks, type = '') {
    todoView.removeProjects();
    todoView.renderProject(project, tasks, 'selected');
    if (!type) {
      if (tasks !== '') {
        createTask(project.id, project.todos);
      }
    } else if (type == 'add') {
      todoView.clearList();
      createProject(todoModel.todoData.allData.sort((a, b) => (a.id > b.id) ? 1*-1 : -1*-1));
    } else {
      todoView.clearList();
      createProject(todoModel.todoData.allData.sort((a, b) => (a.id > b.id) ? 1*-1 : -1*-1));
    }
  }

  function editProject(type, project = '', tasks = '') {
    todoView.removeProjects();
    todoView.renderEditProject(type, project, tasks);
  }

  function delProject(id) {
    todoView.removeProjects('del');
    todoModel.deleteProject(id);
  }

  const createTask = (id, task) => {
    for (let i = 0; i < task.length; i++) {
      todoView.renderTasks(id, task[i]);
    }
  };
  
  function updateTask(projectId, id, title, description, dueDate, priority, status, type = '', array, tasks) {
    if (type == '') {
      let updatedTask = todoModel.editTask(projectId, id, title, description, dueDate, priority, status);
      todoView.removeTask('edit', '-', id)
      todoView.renderTasks(projectId, updatedTask);
    } else {
      let newProject = todoModel.editTask(projectId, id, title, description, dueDate, priority, status, 'add');
      todoView.removeTask('new', '-');
      todoView.renderTasks(projectId, newProject);
    }
  }

  function editTask(projectId, project = '', tasks = '') {
    if (projectId == 'edit') {
      todoView.renderTask(project, tasks, 'edit');
    } else {
      todoView.renderTask(project.id, project.todos);
    }
  }

  function delTask(type = '', projectId, id) {
    todoView.removeTask('del', '', id);
    todoModel.deleteTask(projectId, id);
  }

  return {
    createProject, createTask, selectedProject, editProject, 
    delProject, updateProject, editTask, updateTask, delTask
  };
})();

export {todoController}