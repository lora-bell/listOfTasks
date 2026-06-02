function selectLine(line: HTMLElement): void{
    if(line.classList.contains("row")){
            line.classList.toggle("active")
    }       
}

function addRow(table: HTMLTableElement, array: string[], name: string = "row"): void{
    const line = document.createElement("tr")
    line.classList.add(name)
    for(const elem of array){
        const cell = document.createElement("th")        
        cell.textContent = elem
        line.append(cell)
    }
    line.addEventListener("click", () => selectLine(line))
    line.addEventListener("dblclick", () => line.remove())

    table.append(line)
}

const root = document.querySelector("#root") as HTMLElement

const form = document.createElement("form")

const persons: {title: string, text: string}[] = [
    {title: "lastName", text: "Фамилия"},
    {title: "name", text: "Имя"},
    {title: "task", text: "Тема задания"}
]

for(const person of persons){
    const input = document.createElement("input")
    input.setAttribute("type", "text")
    input.setAttribute("name", person.title)
    input.setAttribute("id", person.title)
    const label = document.createElement("label")
    label.setAttribute("for", person.title)
    label.textContent = person.text
    const field = document.createElement("div")
    field.classList.add("field")
    field.append(label, input)
    form.append(field)
}

const formStatus = document.createElement("select")
formStatus.setAttribute("type", "text")
formStatus.setAttribute("name", "status")
formStatus.setAttribute("id", "status")
for(const item of ["выполнено", "не выполнено"]){
    const option = document.createElement("option")
    option.textContent = item
    formStatus.append(option)
}
const labelStatus = document.createElement("label")
labelStatus.setAttribute("for", "status")
labelStatus.textContent = "Статус выполнения"

const fieldStatus = document.createElement("div")
fieldStatus.classList.add("field")
fieldStatus.append(labelStatus, formStatus)

const formSubmit = document.createElement("div")
const divSubmit = document.createElement("input")
divSubmit.setAttribute("type", "submit")
divSubmit.setAttribute("value", "Добавить")
formSubmit.append(divSubmit)
formSubmit.setAttribute("id", "form-submit")

form.append(fieldStatus, formSubmit)

function checkForm(event: Event): void{
    event.preventDefault();

    const lastNameInput = document.querySelector('#lastName') as HTMLInputElement;
    const lastName = lastNameInput.value;

    const nameInput = document.querySelector('#name') as HTMLInputElement;
    const name = nameInput.value;

    const taskInput = document.querySelector('#task') as HTMLInputElement;
    const task = taskInput.value;

    const statusInput = document.querySelector('#status') as HTMLInputElement;
    const status = statusInput.value;

    if(lastName.trim().length > 0 &&
        name.trim().length > 0 &&
        task.trim().length > 0){
            fillingError.remove()
            addRow(table, [lastName, name, task, status])
            form.reset()
    }else{
        formSubmit.append(fillingError)
    }
}

const fillingError = document.createElement("span")
fillingError.innerText = "Чтобы добавить запись заполните все поля"
fillingError.classList.add("filling-error")

form.addEventListener('submit',(event) => checkForm(event))

const table = document.createElement("table")
addRow(table, ["Фамилия", "Имя", "Тема задания", "Статус"], "heading")
addRow(table, ["Иванов", "Иван", "Структуры данных", "выполнено"])
addRow(table, ["Кузнецов", "Александр", "Алгоритмы", "не выполнено"])

const filterButton = document.createElement("button")
filterButton.textContent = "Показать невыполненные задания"
filterButton.classList.add("filter-button")

function filterTable(filterButton: HTMLButtonElement): void{
    const completed = table.querySelectorAll(".row")
    completed.forEach(elem => {
        if(elem.classList.contains("row") && elem.lastChild?.textContent == "выполнено"){
            elem.classList.toggle("invisible")
        }        
    })
    
    filterButton.textContent = filterButton.classList.contains("tasks-hidden") ? "Показать невыполненные задания" : "Показать все задания"

    filterButton.classList.toggle("tasks-hidden")

}

filterButton.addEventListener("click", () => filterTable(filterButton))

root.append(form, filterButton, table)

