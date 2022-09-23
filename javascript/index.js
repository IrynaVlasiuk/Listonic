class ToDoList {
    fieldsDropDown = [
        {"delete": "Delete"},
        {"copy": "Copy"},
        {"clear-all-tasks": "Clear All Tasks"},
        {"add": "Add"}
    ];

    createDropdownMenu() {
        let dropDownElement = document.createElement("div");
        dropDownElement.classList.add("dropdown-content");
        this.fieldsDropDown.forEach((field) => {
            const key = Object.keys(field).toString();
            const value = Object.values(field).toString()
            dropDownElement.insertAdjacentHTML("afterbegin", "<p class='todo__action' data-action='"+ key +"'>" + value + "</p>");
        });

        return dropDownElement;
    }

    setToDoListToLocalStorage(toDoList) {
        localStorage.setItem('todo', JSON.stringify(toDoList));
    }

    toDoListFromLocalStorage() {
        const toDoListFromLocalStorage = localStorage.getItem('todo');

        if(toDoListFromLocalStorage) {
            return JSON.parse(toDoListFromLocalStorage);
        }

        return [];
    }

    add (selector) {
        const elemText = document.querySelector(selector);
        this.name = elemText.value;

        if (!elemText.value.length) {
            return;
        }
        elemText.value = '';
    }
}

class List extends ToDoList {
    id;
    name;
    tasks = [];
    counter = 1;

    constructor(id, name) {
        super();
        this.id = id;
        this.name = name;
    }

    action(e) {
        const target = e.target;
        if (e.key === 'Enter') {
            if (target.classList.contains('new-list-item')) {
               this.add();
               this.save();
            }
        }

        if (target.classList.contains('list__item')) {
            this.displayAllTasks(target);
        }

        if (target.classList.contains('todo__action')) {
            const action = target.dataset.action;
            switch(action) {
                case "add":
                    this.displayAllTasks(target.parentNode.previousSibling);
                    break;
                case "copy":
                    this.copy(target.parentNode.previousSibling);
                    this.save();
                    break;
                case "delete":
                    this.remove(target.parentNode.previousSibling);
                   // window.setTimeout(() => target.parentNode.classList.toggle("show"), 100);
                    break;
                case "clear-all-tasks":
                    this.clearAllTasks(target.parentNode.previousSibling);
                    break;
            }
        }
    }

    add () {
        super.add(".new-list-item");

        this.addNewItemToLocalStorage();

        this.create();

        this.counter++;
    }

    create(value, listId) {
        listId = listId ? listId : this.id;

        let liItemList = document.createElement("li");

        liItemList.classList.add("list__item");
        liItemList.dataset.listId = listId;
        liItemList.innerText = value ? value : this.name;
        liItemList.insertAdjacentHTML("beforeend", "<span class='dots'></span>");

        document.querySelector('.list__items').append(liItemList);
        document.querySelector('.list__items').append(super.createDropdownMenu());

        return liItemList.innerHTML;
    }

    copy(item) {
        this.name = item.innerText;

        this.addNewItemToLocalStorage();

        this.create();

        this.counter++;
    }

    remove(item) {
        let listId = item.dataset.listId;
        let allLists = this.toDoListFromLocalStorage();

        let newToDoList = allLists.filter( el => Number(el.list_id) !== Number(listId) );

        this.setToDoListToLocalStorage(newToDoList);

        item.remove();
    }

    init () {
       // localStorage.clear();

        const fromStorage = this.toDoListFromLocalStorage();

        if (fromStorage) {
            for(const obj of fromStorage) {
                this.create(obj.list_name, obj.list_id);
            }
        }

        document.addEventListener('keypress', this.action.bind(this));
        document.addEventListener('click', this.action.bind(this));
    }

    save () {
        let newList = {'list_id': this.id, 'list_name': this.name, 'tasks':[]};
        let allLists = this.toDoListFromLocalStorage();

        allLists.push(newList);
        this.setToDoListToLocalStorage(allLists);
    }

    addNewTasks() {

    }

    clearAllTasks(task) {
        const listId = task.dataset.listId;
        let toDoListFromStorage = this.toDoListFromLocalStorage();
        let objIndex = toDoListFromStorage.findIndex((obj => obj.list_id == listId));

        toDoListFromStorage[objIndex].tasks = [];

        this.setToDoListToLocalStorage(toDoListFromStorage);
    }

    displayAllTasks(target) {
        const tasksListOutput = document.querySelector(".list__tasks_output");
        tasksListOutput.classList.add("display");
        const toDoList = JSON.parse(localStorage.getItem("todo")) || [];
        const listId = target.dataset.listId;

        let clickedList = toDoList.filter(list => list.list_id == listId);

        clickedList[0].tasks.forEach((task) => {
            new Task(task.name, task.status);
        });
    }

    addNewItemToLocalStorage() {
        let toDoListFromStorage = this.toDoListFromLocalStorage();
        if(toDoListFromStorage.length > 0) {
            const [lastItem] = toDoListFromStorage.slice(-1);
            this.id = lastItem.list_id + 1;
        } else {
            this.id = this.counter;
        }
    }
}

let list = new List();
list.init();

document.querySelectorAll(".dots")
    .forEach((el) => {
        el.addEventListener("mouseover", e => {
            e.target.classList.add("dots-hover");
        });
        el.addEventListener('mouseleave', e => {
            e.target.classList.remove("dots-hover");
        });
    });

document.addEventListener("click", (e) => {
    document.querySelectorAll(".dropdown-content").forEach(el => el.classList.remove("show"));
    if (e.target.classList.contains('dots')) {
        e.target.parentNode.nextSibling.style.top = Number(e.target.parentNode.getBoundingClientRect().top) - 75 + "px";
        e.target.parentNode.nextSibling.classList.add("show");
    }
});

class Task extends ToDoList {
    name;
    status;

    constructor(name, status) {
        super();
        this.name = name;
        this.status = status;
    }

    action(e) {
        const target = e.target;
        if (e.key === 'Enter') {
            if (target.classList.contains('new-task-item')) {
                this.add();
                this.save();
            }
        }
    }

    add() {
        super.add(".new-task-item");
        this.addNewTaskToListToLocalStorage();

        this.create();
    }

    save () {

    }

    update () {

    }

    create() {

    }

    delete () {

    }

    addNewTaskToListToLocalStorage() {
        let toDoListFromStorage = this.toDoListFromLocalStorage();
        if(toDoListFromStorage.length > 0) {

        }
    }
}