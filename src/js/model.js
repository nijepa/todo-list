import { todoController } from "./controller";

const todoModel = (() => {
 

  const todoData = {
    allData: [{id: 0, name: 'Example project', desc: 'Description of example project', todos: []}, {id: 1, name: 'Another example project', desc: 'Project with some tasks', todos:[
              {id: 0, title: 'Example task', description: 'Active task, medium priority', dueDate: '2020-02-09', priority: 2, status: false},
              {id: 1, title: 'Another example task', description: 'Finished task, high priority', dueDate: '2020-02-06', priority: 1, status: true}]}]
  };

  const currentProject = [];

  function todoProject (id, name, desc)  {
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.todos = [];
  };

  function todoTask (id, title, description, dueDate, priority, status) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.status = false;
  };

  const populateStorage = () => {
    localStorage.setItem('allData', JSON.stringify(todoData.allData));
	};

  const editProject = (id, name, desc, type = '') => {
    if (!type) {
      let objIndex = todoData.allData.findIndex((obj => obj.id == id));

      todoData.allData[objIndex].name = name;
      todoData.allData[objIndex].desc = desc;

      populateStorage();

      return todoData.allData[todoData.allData[objIndex]];
    } else {
      let newProject = new todoProject(todoData.allData.length + 1, name, desc)
      todoData.allData.push(newProject);

      populateStorage();

      return todoData.allData[todoData.allData.length - 1];
    }
  };

  const deleteProject = (id) => {
    let removeIndex = todoData.allData.map(function(item) { return item.id; })
                      .indexOf(id);
    ~removeIndex && todoData.allData.splice(removeIndex, 1);
    todoController.createProject(todoData.allData);
    populateStorage();
    //return todosProjects, todosTasks;
  }

  const editTask = (projectId, id, title, description, dueDate, priority, status, type = '') => {
    if (!type) {
      //let objIndex = todoData.allData.findIndex((obj => obj.id == projectId));
      let proIndex = todoData.allData.findIndex((obj => obj.id == projectId));
      let editIndex = todoData.allData[proIndex].todos.map((item) => {return item.id});
      const index = editIndex.indexOf(id);
      todoData.allData[proIndex].todos[index].title = title;
      todoData.allData[proIndex].todos[index].description = description;
      todoData.allData[proIndex].todos[index].dueDate = dueDate;
      todoData.allData[proIndex].todos[index].status = status;
      todoData.allData[proIndex].todos[index].priority = priority;

      populateStorage();

      return todoData.allData[proIndex].todos[index];
    } else {
      let objIndex = todoData.allData.findIndex((obj => obj.id == projectId));
      let newProject = new todoTask(todoData.allData[objIndex].todos.length + 1, title, description, dueDate, priority, status)
      todoData.allData[objIndex].todos.push(newProject);

      populateStorage();

      return todoData.allData[objIndex].todos[todoData.allData[objIndex].todos.length - 1];
    }
  };

  const deleteTask = (projectId, id) => {
    let proIndex = todoData.allData.findIndex((obj => obj.id == projectId));
    let removeIndex = todoData.allData[proIndex].todos.map((item) => {return item.id});
    const index = removeIndex.indexOf(id);
          
    ~removeIndex && todoData.allData[proIndex].todos.splice(index, 1);
    populateStorage();
    //return todosProjects, todosTasks;
  }

  const getStorage = (dataType) => {
		if (!localStorage.getItem('allData')) {
			populateStorage();
		}
    todoData.allData = JSON.parse(localStorage.getItem('allData'));
    return todoData.allData;
	};

  const init = () => {
		console.log('App started');
    const allLists = getStorage();
		if (allLists.length === 0) {
		} else {
      return allLists.sort((a, b) => (a.id > b.id) ? 1*-1 : -1*-1);
		}
	};

  return {
    init, todoData,
    editProject, deleteProject, 
    editTask, deleteTask,
    getStorage
  };
})();

export {todoModel}