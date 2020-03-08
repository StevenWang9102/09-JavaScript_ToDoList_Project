const listsContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteListButton = document.querySelector('[data-delete-list-button]')
const rightListDisplayContainer = document.querySelector('[data-list-display-container]')
const rightListTitle = document.querySelector('[data-list-title]')
const listCountElement = document.querySelector('[data-list-count]')
const tasksContainer = document.querySelector('[data-tasks]')
const taskTemplate = document.getElementById('task-template')
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')
const clearCompleteTasksButton = document.querySelector('[data-clear-complete-tasks-button]')

// ------------------------- Local Storage -------------------------------
const LIST_KEYS = 'task.myLists' 
let myLists = JSON.parse(localStorage.getItem(LIST_KEYS)) || [] 

const SELECTED_LIST_ID = 'task.selectedListId' //pick the ID of selected list
let selectedListId = localStorage.getItem(SELECTED_LIST_ID)


// ------------------------- Task Creator ---------------------------------
function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] }
}

function createTask(name) {
  return { id: Date.now().toString(), name: name, completeStatus: false }
}


// listen to left container when user click <li>.
listsContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'li') {
    selectedListId = e.target.dataset.listId 
    saveAndRender()
  }
})

// when click 'submit', create new form on the right.
newListForm.addEventListener('submit', e => {
  e.preventDefault()
  const listName = newListInput.value
  if (listName !== null && listName !== '') 
  {
    const list = createList(listName) // create right form
    newListInput.value = null
    myLists.push(list) // save in my list
  } 
  saveAndRender()
})

// save data and rerender.
function saveAndRender() {
  saveToBrowser()
  renderAll()
}

// save on browser local storage
function saveToBrowser() {
  localStorage.setItem(LIST_KEYS, JSON.stringify(myLists))
  localStorage.setItem(SELECTED_LIST_ID, selectedListId)
}

// clear all nodes
function clearAllElement(element) {
  while (element.hasChildNodes()) {
    element.removeChild(element.firstChild)
  }
}

// Render left lists
function renderMyLists() {
  myLists.forEach(list => {
    const li = document.createElement('li')
    li.dataset.listId = list.id  // add id
    li.classList.add("list-name") // add class
    li.innerText = list.name
    if (list.id === selectedListId) li.classList.add('active-list')
    listsContainer.appendChild(li)
  })
}

// Render right tasks
function renderTasks(selectedMyList) {
  selectedMyList.tasks.forEach(task => {
    const addTaskDetails = document.importNode(taskTemplate.content, true) 
    // inject the templete in html 

    const checkbox = addTaskDetails.querySelector('input')
    checkbox.id = task.id
    checkbox.checked = task.completeStatus

    const label = addTaskDetails.querySelector('label')
    label.htmlFor = task.id
    label.append(task.name)
    tasksContainer.appendChild(addTaskDetails)
  })
}

// Render all content
function renderAll() {
  clearAllElement(listsContainer)
  renderMyLists()

  const selectedList = myLists.find(list => list.id === selectedListId)

  if (selectedListId == null) {
    rightListDisplayContainer.style.display = 'none'
  } else {
    rightListDisplayContainer.style.display = 'block' 
    rightListTitle.innerText = selectedList.name 
    incompleteTaskCount(selectedList)
    clearAllElement(tasksContainer)
    renderTasks(selectedList)
  }
}


// Right list : delete input that you click
tasksContainer.addEventListener('click', event => {  
  if (event.target.tagName.toLowerCase() === 'input') {
    const selectedList = myLists.find(list => list.id === selectedListId)
    const selectedTask = selectedList.tasks.find(task => task.id === event.target.id)
    selectedTask.completeStatus = event.target.checked
    saveToBrowser() 
    incompleteTaskCount(selectedList) 
  }
})


// Clean Complete Tasks
clearCompleteTasksButton.addEventListener('click', e => {
  const selectedList = myLists.find(list => list.id === selectedListId)
  selectedList.tasks = selectedList.tasks.filter(task => !task.completeStatus)
  saveAndRender()
})

// Delete list 
deleteListButton.addEventListener('click', e => {
  myLists = myLists.filter(list => list.id !== selectedListId)
  selectedListId = null
  saveAndRender()
})


function incompleteTaskCount(selectedList) {
  const incompleteTaskCount = selectedList.tasks.filter(task => !task.completeStatus).length
  const taskString = incompleteTaskCount === 1 ? "task" : "tasks"
  listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`
}


// Right form add task
newTaskForm.addEventListener('submit', e => {
  e.preventDefault()
  const taskName = newTaskInput.value
  if (taskName !== null && taskName !== ''){
    const myTask = createTask(taskName)
    newTaskInput.value = null
    const selectedList = myLists.find(list => list.id === selectedListId)
    selectedList.tasks.push(myTask)}
  saveAndRender()
})

renderAll()