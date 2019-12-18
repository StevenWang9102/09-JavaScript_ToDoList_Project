const listsContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteListButton = document.querySelector('[data-delete-list-button]')
const listDisplayContainer = document.querySelector('[data-list-display-container]')
const listTitleElement = document.querySelector('[data-list-title]')
const listCountElement = document.querySelector('[data-list-count]')
const tasksContainer = document.querySelector('[data-tasks]')
const taskTemplate = document.getElementById('task-template')
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')
const clearCompleteTasksButton = document.querySelector('[data-clear-complete-tasks-button]')

const LOCAL_STORAGE_LIST_KEY = 'task.myLists' //此处啥意思
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'
let myLists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)


function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] }
}

function createTask(name) {
  return { id: Date.now().toString(), name: name, complete: false }
}

//左侧清单
listsContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'li') {
    selectedListId = e.target.dataset.listId
    saveAndRender()
  }
})

//右侧清单
tasksContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'input') {
    const selectedList = myLists.find(list => list.id === selectedListId) //为啥用ID
    const selectedTask = selectedList.tasks.find(task => task.id === e.target.id) // 存在tasks属性？
    selectedTask.complete = e.target.checked
    save()
    renderTaskCount(selectedList) //计算任务数目的
  }
})

//清理完成的任务
clearCompleteTasksButton.addEventListener('click', e => {
  const selectedList = myLists.find(list => list.id === selectedListId)
  selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
  saveAndRender()
})

//删除整个list
deleteListButton.addEventListener('click', e => {
  myLists = myLists.filter(list => list.id !== selectedListId)
  selectedListId = null
  //项目围绕这个selectedListId为核心变化@@@@
  saveAndRender()
})

//添加新的list
newListForm.addEventListener('submit', e => {
  e.preventDefault()
  const listName = newListInput.value
  if (listName == null || listName === '') return
  //return啥都没有？？@@@@@@@@@@@
  const list = createList(listName)
  newListInput.value = null
  myLists.push(list) //储存起来
  saveAndRender()
})

//添加新的任务
newTaskForm.addEventListener('submit', e => {
  e.preventDefault()
  const taskName = newTaskInput.value
  if (taskName == null || taskName === '') return
  //啥都不return。。。。

  const myTask = createTask(taskName)
  newTaskInput.value = null
  const selectedList = myLists.find(list => list.id === selectedListId)
  selectedList.tasks.push(myTask)//为什么有tasks??
  console.log(selectedList);
  saveAndRender()
})

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(myLists))
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}

//清理所有内容
function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}


//渲染右侧的内容
function renderMyLists() {
  myLists.forEach(list => {
    const createNewList = document.createElement('li')
    createNewList.dataset.listId = list.id //这是啥？大致就是循环赋值一个listId
    createNewList.classList.add("list-name")
    createNewList.innerText = list.name
    if (list.id === selectedListId) {
      createNewList.classList.add('active-list')
    }
    listsContainer.appendChild(createNewList)
  })
}

//---------------------进行到这里-----------------//
function render() {
  clearElement(listsContainer)//清空左侧清单中的所有内容
  renderMyLists()

  const selectedList = myLists.find(list => list.id === selectedListId)
  if (selectedListId == null) {
    listDisplayContainer.style.display = 'none'
  } else {
    listDisplayContainer.style.display = ''
    listTitleElement.innerText = selectedList.name
    renderTaskCount(selectedList)
    clearElement(tasksContainer)
    renderTasks(selectedList)
  }
}

function saveAndRender() {
  save()
  render()
}

function renderTasks(selectedList) {
  selectedList.tasks.forEach(task => {
    const taskElement = document.importNode(taskTemplate.content, true)
    const checkbox = taskElement.querySelector('input')
    checkbox.id = task.id
    checkbox.checked = task.complete
    const label = taskElement.querySelector('label')
    label.htmlFor = task.id
    label.append(task.name)
    tasksContainer.appendChild(taskElement)
  })
}

function renderTaskCount(selectedList) {
  const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length
  const taskString = incompleteTaskCount === 1 ? "task" : "tasks"
  listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`
}

render()