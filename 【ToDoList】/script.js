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
  console.log(event);

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
  console.log(e);
  
  const listName = newListInput.value
  if (listName !== null && listName !== '') 
  {
    const list = createList(listName)
    newListInput.value = null
    myLists.push(list) //储存起来
  } // return之后，遇到一个没输入之后就不再继续检测；
  
  saveAndRender()
})

//添加新的任务
newTaskForm.addEventListener('submit', e => {
  e.preventDefault()
  const taskName = newTaskInput.value
  if (taskName == null || taskName === '') return //啥都不return。。。。
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
    const li = document.createElement('li')
    li.dataset.listId = list.id //这是啥？大致就是循环赋值一个listId
    li.classList.add("list-name")//新增的li也是有class的
    li.innerText = list.name
    if (list.id === selectedListId) {
      li.classList.add('active-list')
    }
    listsContainer.appendChild(li)
  })
}

function render() {
  //这个是渲染所有的的内容

  clearElement(listsContainer)//清空左侧清单中的所有内容
  renderMyLists()//渲染左边的

  const selectedList = myLists.find(list => list.id === selectedListId)//定义选择的list

  if (selectedListId == null) {
    listDisplayContainer.style.display = 'none'
  } else {
    listDisplayContainer.style.display = ''
    listTitleElement.innerText = selectedList.name //这是右边的显示细节区域
    renderTaskCount(selectedList)
    clearElement(tasksContainer)//清理？？？为什么要清理
    renderTasks(selectedList)
  }
}

function saveAndRender() {
  save()
  render()
}

//----------------------------进行到这里---------------------//
function renderTasks(selectedList) {
  //这个方法渲染左边选中的list
  selectedList.tasks.forEach(task => { //啥意思 .tasks
    const taskElement = document.importNode(taskTemplate.content, true) //制造了一个模板
    const checkbox = taskElement.querySelector('input')
    checkbox.id = task.id
    checkbox.checked = task.complete //选中状态由于完成度决定
    const label = taskElement.querySelector('label') //选中模板中的label
    label.htmlFor = task.id //衔接
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