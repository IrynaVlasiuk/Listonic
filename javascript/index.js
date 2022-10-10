import {List} from './classes/ListClass.js';
import {Task} from './classes/TaskClass.js';

let list = new List();
list.init();

let task = new Task();
task.init();

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
