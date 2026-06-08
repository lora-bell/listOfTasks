import { TaskStatusEnum } from "./constants.js";
function openAccordion() {
    accordion.classList.toggle("open-accordion");
    if (accordion.classList.contains("open-accordion")) {
        accordionSpan.textContent = "△";
        accordion.append(accordionContent);
    }
    else {
        accordionSpan.textContent = "▽";
        accordionContent.remove();
    }
}
function checkForm(event, table) {
    event.preventDefault();
    const lastNameInput = document.querySelector('#lastName');
    const lastName = lastNameInput.value;
    const nameInput = document.querySelector('#name');
    const name = nameInput.value;
    const taskInput = document.querySelector('#task');
    const task = taskInput.value;
    const statusInput = document.querySelector('#status');
    const status = statusInput.value;
    if (lastName.trim().length > 0 &&
        name.trim().length > 0 &&
        task.trim().length > 0) {
        fillingError.remove();
        addRow(table, [lastName, name, task, status]);
        form.reset();
    }
    else {
        formSubmit.append(fillingError);
    }
}
function addRow(table, array, name = "row") {
    const line = document.createElement("tr");
    line.classList.add(name);
    for (const elem of array) {
        const cell = document.createElement("th");
        cell.textContent = elem;
        const statusStrings = allStatuses.map(s => String(s));
        if (statusStrings.includes(elem)) {
            cell.classList.add("status-cell");
            const statusText = document.createElement("span");
            statusText.textContent = cell.textContent;
            statusText.classList.add("status-text");
            if (statusText.textContent === TaskStatusEnum.DONE)
                statusText.classList.add("task-done");
            const iconEdit = document.createElement("span");
            iconEdit.classList.add("icon-edit");
            iconEdit.textContent = "✏️";
            cell.innerHTML = "";
            cell.append(statusText, iconEdit);
            cell.addEventListener("click", (event) => {
                event.stopPropagation();
                editStatus(tasksTable, statusText, allStatuses, filterButton);
            });
        }
        line.append(cell);
    }
    line.addEventListener("click", () => selectLine(line));
    line.addEventListener("dblclick", () => line.remove());
    filterButton.textContent = "Показать невыполненные задания";
    filterButton.classList.remove("tasks-hidden");
    table.append(line);
    updateTable(table, filterButton);
}
function updateTable(table, button) {
    const completed = table.querySelectorAll(".row");
    completed.forEach(elem => {
        let statusText = elem.querySelector(".status-text");
        if (statusText.textContent === TaskStatusEnum.DONE) {
            statusText.classList.add("task-done");
            if (button.classList.contains("tasks-hidden")) {
                elem.classList.add("invisible");
            }
            else {
                elem.classList.remove("invisible");
            }
        }
        else {
            statusText.classList.remove("task-done");
            elem.classList.remove("invisible");
        }
    });
}
function filterTable(table, button) {
    button.classList.toggle("tasks-hidden");
    button.textContent = button.classList.contains("tasks-hidden") ? "Показать все задания" : "Показать невыполненные задания";
    updateTable(table, button);
}
function selectLine(line) {
    if (line.classList.contains("row")) {
        line.classList.toggle("active");
    }
}
function editStatus(table, status, statuses, button) {
    const statusCell = status.closest(".status-cell");
    if (statusCell.querySelector("select"))
        return;
    const statusChoice = document.createElement("select");
    statusChoice.size = 4;
    for (const item of statuses) {
        const option = document.createElement("option");
        option.textContent = item;
        if (item === status.textContent)
            option.selected = true;
        statusChoice.append(option);
    }
    statusCell.prepend(statusChoice);
    status.style.display = "none";
    statusChoice.addEventListener("change", (event) => {
        event.stopPropagation();
        status.classList.remove("task-done");
        status.textContent = event.target.value;
        status.style.display = "";
        statusChoice.remove();
        updateTable(table, button);
    });
}
const root = document.querySelector("#root");
const allStatuses = Object.values(TaskStatusEnum);
// Инструкция с аккордеоном
const accordion = document.createElement("div");
accordion.classList.add("accordion");
const accordionHeader = document.createElement("div");
accordionHeader.classList.add("accordion-header");
accordionHeader.textContent = "Инструкция к таблице";
const accordionSpan = document.createElement("span");
accordionSpan.classList.add("accordion-span");
accordionSpan.textContent = "▽"; // ˅ ˄ ▽ △
accordionHeader.append(accordionSpan);
accordion.append(accordionHeader);
const accordionContent = document.createElement("div");
accordionContent.classList.add("accordion-content");
accordionContent.innerHTML = `
    <hr/>
    <h3>Добавление записей (Create)</h3>
    <p>При заполнении всех полей и нажатии кнопки "Добавить" - новая строка появляется в таблице.</p>
    <p>Если поля не заполнены - показывается сообщение об ошибке: "Чтобы добавить запись заполните все поля".</p>

    <h3>Просмотр и фильтрация записей (Read)</h3>
    <p>Все добавленные записи отображаются в таблице.</p>
    <p>Строки можно фильтровать с помощью кнопки:</p>
    <ul>
        <li><strong>"Показать невыполненные задания"</strong> — скрываются записи со статусом <strong>готово</strong>, текст кнопки меняется на <strong>"Показать все задания"</strong>.</li>
        <li><strong>"Показать все задания"</strong> — все скрытые записи возвращаются, текст кнопки меняется обратно.</li>
    </ul>

    <h3>Редактирование записей (Update)</h3>
    <p>Ячейка <strong>"Статус"</strong> содержит текст и иконку карандаша ✏️.</p>
    <p>При клике на ячейку появляется выпадающий список со статусами: <strong>новая</strong>, <strong>проверка</strong>, <strong>доработка</strong>, <strong>готово</strong>.</p>
    <p>После выбора статус обновляется, строка с <strong>готово</strong> выделяется зелёным цветом.</p>

    <h3>Удаление записей (Delete)</h3>
    <p>При двойном клике по строке запись удаляется из таблицы.</p>

    <h3>Визуальные эффекты</h3>
    <p>При наведении на строку вся строка меняет фон на светло-серый.</p>
    <p>При клике по строке строка меняет фон на тёмно-серый.</p>

    <h3>Адаптивная вёрстка</h3>
    <p>При необходимости таблица получает горизонтальную полосу прокрутки.</p>
    <p>На мобильных устройствах форма адаптируется под размер экрана.</p>
`;
accordion.addEventListener("click", () => openAccordion());
// Форма для заполнения записи в таблице
const form = document.createElement("form");
const persons = [
    { title: "lastName", text: "Фамилия" },
    { title: "name", text: "Имя" },
    { title: "task", text: "Тема задания" }
];
for (const person of persons) {
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("name", person.title);
    input.setAttribute("id", person.title);
    const label = document.createElement("label");
    label.setAttribute("for", person.title);
    label.textContent = person.text;
    const field = document.createElement("div");
    field.classList.add("field");
    field.append(label, input);
    form.append(field);
}
const formStatus = document.createElement("select");
formStatus.setAttribute("type", "text");
formStatus.setAttribute("name", "status");
formStatus.setAttribute("id", "status");
for (const item of allStatuses) {
    const option = document.createElement("option");
    option.textContent = item;
    formStatus.append(option);
}
const labelStatus = document.createElement("label");
labelStatus.setAttribute("for", "status");
labelStatus.textContent = "Статус выполнения";
const fieldStatus = document.createElement("div");
fieldStatus.classList.add("field");
fieldStatus.append(labelStatus, formStatus);
const formSubmit = document.createElement("div");
const divSubmit = document.createElement("input");
divSubmit.setAttribute("type", "submit");
divSubmit.setAttribute("value", "Добавить");
formSubmit.append(divSubmit);
formSubmit.setAttribute("id", "form-submit");
form.append(fieldStatus, formSubmit);
const fillingError = document.createElement("span");
fillingError.innerText = "Чтобы добавить запись заполните все поля";
fillingError.classList.add("filling-error");
form.addEventListener('submit', (event) => checkForm(event, tasksTable));
// Таблица с записями
const filterButton = document.createElement("button");
filterButton.textContent = "Показать невыполненные задания";
filterButton.classList.add("filter-button");
filterButton.addEventListener("click", () => filterTable(tasksTable, filterButton));
const tasksTable = document.createElement("table");
addRow(tasksTable, ["Фамилия", "Имя", "Тема задания", "Статус"], "heading");
addRow(tasksTable, ["Иванов", "Иван", "Структуры данных", TaskStatusEnum.DONE]);
addRow(tasksTable, ["Кузнецов", "Александр", "Алгоритмы", TaskStatusEnum.NEW]);
addRow(tasksTable, ["Петрова", "Мария", "Стилизация", TaskStatusEnum.REVIEW]);
const tableWrapper = document.createElement("div");
tableWrapper.className = "table-wrapper";
tableWrapper.append(tasksTable);
root.append(accordion, form, filterButton, tableWrapper);
