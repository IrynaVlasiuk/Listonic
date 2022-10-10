import {ToDoList} from "./ToDoListClass.js";
import {Task} from "./TaskClass.js";

export class List extends ToDoList {
    id;
    name;
    tasks = [];
    counter = 1;

    constructor(id, name) {
        super();
        this.id = id;
        this.name = name;
    }

    set id(value) {
        this._id = value;
    }

    get id() {
        return this._id;
    }

    action(e) {
        const target = e.target;
        if (e.key === 'Enter') {
            if (target.classList.contains('new-list-item')) {
                this.add();
            }
        }

        if (target.classList.contains('list__item')) {
            this.id = target.dataset.listId;

            this.displayAllTasks(target);
        }

        if (target.classList.contains('todo__action')) {
            const action = target.dataset.action;
            switch(action) {
                case "add":
                    this.id = target.parentNode.previousSibling.dataset.listId;

                    this.displayAllTasks(target.parentNode.previousSibling);
                    break;
                case "copy":
                    this.copy(target.parentNode.previousSibling);
                    this.save();
                    break;
                case "delete":
                    this.remove(target.parentNode.previousSibling);
                    break;
                case "clear-all-tasks":
                    this.clearAllTasks(target.parentNode.previousSibling);
                    break;
            }
        }
    }

    add () {
        const elemText = document.querySelector(".new-list-item");

        if (!elemText.value.length) {
            return;
        }
        this.name = elemText.value;
        elemText.value = '';

        this.addNewItemToLocalStorage();
        this.create();

        this.counter++;

        this.save();
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

    clearAllTasks(list) {
        let toDoListFromStorage = this.toDoListFromLocalStorage();
        let objIndex = toDoListFromStorage.findIndex((obj => Number(obj.list_id) == Number(list.dataset.listId)));

        toDoListFromStorage[objIndex].tasks = [];

        this.setToDoListToLocalStorage(toDoListFromStorage);

        this.displayAllTasks();
    }

    displayAllTasks() {
        const tasksListItemsElement = document.querySelector(".tasks__items");
        tasksListItemsElement.innerHTML = '';

        const tasksListOutput = document.querySelector(".list__tasks_output");
        tasksListOutput.classList.add("display");
        tasksListOutput.querySelector(".new-task-item").dataset.listId = this.id;

        const toDoList = JSON.parse(localStorage.getItem("todo")) || [];

        let clickedList = toDoList.filter(list => list.list_id == this.id);

        clickedList[0].tasks.forEach((task) => {
            let relatedTask = new Task(task.name, task.status, task.listId, task.id);
            relatedTask.create(task);
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