export class ToDoList {
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
            return  JSON.parse(toDoListFromLocalStorage);
        }

        return [];
    }
}