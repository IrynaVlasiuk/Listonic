import {ToDoList} from "./ToDoListClass.js";

export class Task extends ToDoList {
    name;
    status;
    listId;
    id;
    counter = 1;

    constructor(name, status, listId) {
        super();
        this.name = name;
        this.status = status;
        this.listId = listId;
    }

    action(e) {
        const target = e.target;
        if (e.key === 'Enter') {
            this.name = e.target.value;
            if (target.classList.contains('new-task-item')) {
                this.add();
            }
        }

        if (target.classList.contains('delete')) {
            this.delete(target.parentNode.parentNode);
        }
    }

    add() {
        const elemText = document.querySelector(".new-task-item");

        if (!elemText.value.length) {
            return;
        }
        this.name = elemText.value;
        elemText.value = '';

        this.id = this.counter;
        this.listId = elemText.dataset.listId;

        this.create(this);
        this.save();

        this.counter++;
    }

    save () {
        let toDoListFromStorageArray = this.toDoListFromLocalStorage();
        this.status = "active";

        let toDoListObjIndex = toDoListFromStorageArray.findIndex((obj => obj.list_id == this.listId));
        toDoListFromStorageArray[toDoListObjIndex].tasks.push(this);

        this.setToDoListToLocalStorage(toDoListFromStorageArray);
    }

    create(task) {
        let liItemList = document.createElement("li");

        liItemList.classList.add("task__item");
        liItemList.innerText = task.name;
        liItemList.dataset.listId = task.listId;
        liItemList.dataset.taskId = task.id;
        liItemList.insertAdjacentHTML("beforeend", "<span class='delete-icon'><img src='../images/icons/delete.png' class='delete'></span>");

        document.querySelector('.tasks__items').append(liItemList);
        document.querySelector('.tasks__items').append(super.createDropdownMenu());

        return liItemList.innerHTML;
    }

    init() {
        document.addEventListener('keypress', this.action.bind(this));
        document.addEventListener('click', this.action.bind(this));
    }

    delete (targetTask) {
        let listId = targetTask.dataset.listId;
        let taskId = targetTask.dataset.taskId;

        let toDoListFromStorageArray = this.toDoListFromLocalStorage();

        let toDoListObjIndex = toDoListFromStorageArray.findIndex((obj => obj.list_id == listId));

        let newToDoList = toDoListFromStorageArray[toDoListObjIndex].tasks.filter( el => Number(el.id) !== Number(taskId) );

        toDoListFromStorageArray[toDoListObjIndex].tasks = newToDoList;

        this.setToDoListToLocalStorage(toDoListFromStorageArray);

        targetTask.remove();
    }
}