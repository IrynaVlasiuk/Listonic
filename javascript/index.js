class List {
    id;
    name;
    tasks = [];
    counter = 0;

    constructor(id, name) {
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
             const tasksListOutput = document.querySelector(".list__tasks_output");
             const toDoList = JSON.parse(localStorage.getItem("todo")) || [];
             const listId = e.target.dataset.listId;
             let tasks;

             toDoList.forEach((list) => {
                 if(list.list_id == listId) {
                     tasks = list.tasks;
                 }
             });

             tasks.forEach((task) => {
                 new Task(task.name, task.status);
             });
        }
    }

    update() {

    }

    add () {
        this.counter++;
        const elemText = document.querySelector('.new-list-item');
        this.name = elemText.value;
        this.id = this.counter;

        if (!elemText.value.length) {
            return;
        }
        document.querySelector('.list__items').insertAdjacentHTML('beforeend', this.create(elemText.value));
        elemText.value = '';
    }

    create(value, listId) {
        listId = listId ? listId : this.id;

        return `<li class="list__item" data-list-id="${listId}">${value}<span class="dots"></span></li>`;
    }

    copy() {

    }

    delete() {

    }

    init = function () {
        //localStorage.clear();
        const fromStorage = JSON.parse(localStorage.getItem('todo'));

        if (fromStorage) {
            for(const obj of fromStorage) {
                document.querySelector('.list__items')
                    .insertAdjacentHTML('beforeend', this.create(obj.list_name, obj.list_id));
            }

        }
        //document.querySelector('.todo__options').addEventListener('change', this.update);
        document.addEventListener('keypress', this.action.bind(this));
        document.addEventListener('click', this.action.bind(this));
    }

    save = () => {
        let newList = {'list_id': this.id, 'list_name': this.name, 'tasks': []};
        let allLists = JSON.parse(localStorage.getItem("todo")) || [];

        allLists.push(newList);
        localStorage.setItem('todo', JSON.stringify(allLists));
    }
}

let list = new List();
list.init();

document.querySelectorAll(".list__item", "::after")
    .forEach((el) => {
            el.addEventListener("mouseover", e =>  e.target.querySelector(".dots").classList.add("dots-hover"));
            el.addEventListener('mouseleave', e =>  e.target.querySelector(".dots").classList.remove("dots-hover"));
        });

class Task {
    name;
    status;

    constructor(name, status) {
        this.name = name;
        this.status = status;
    }

    add () {

    }

    update () {

    }

    delete () {

    }
}