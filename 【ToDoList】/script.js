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

//
const LOCAL_STORAGE_LIST_KEY = 'task.myLists' //浏览器本地储存的Key
let myLists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [] //从浏览器取值 getItem
//Mylist的数据类型到底是什么@@@@@@@@@

const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'//选中list的ID
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)


function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] }
}

function createTask(name) {
  return { id: Date.now().toString(), name: name, completeStatus: false }
}


//左侧任务清单
listsContainer.addEventListener('click', e => {
  console.log(e.target.dataset);
  if (e.target.tagName.toLowerCase() === 'li') {
    selectedListId = e.target.dataset.listId 
    //获取选中list的id，并且已经存入浏览器
    // DOMStringMap？？？@@@@@@@存在一个ID在__proto__上面
    saveAndRender()
  }
})

//左侧添加新的list
newListForm.addEventListener('submit', e => {
  e.preventDefault()
  
  const listName = newListInput.value
  if (listName !== null && listName !== '') 
  {
    const list = createList(listName) //创建右侧的list
    newListInput.value = null
    myLists.push(list) //储存起来
  } 
  // console.log(JSON.stringify（myLists);
  saveAndRender()
})

function saveAndRender() {
  save()
  render()
}

//保存功能
function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(myLists)) //为什么要变形@@@@@
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}

//清理所有内容
function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

//渲染左侧的内容
function renderMyLists() {
  myLists.forEach(list => {
    const li = document.createElement('li')
    li.dataset.listId = list.id //这是啥？大致就是循环赋值一个listId@@@@@@@@@@@@@@
    li.classList.add("list-name")//新增的li也是有class的
    li.innerText = list.name

    //这是渲染选中的效果
    if (list.id === selectedListId) {
      li.classList.add('active-list')
    }
    listsContainer.appendChild(li)
  })
}

function renderTasks(selectedMyList) {
  //这个方法渲染左边选中的list
  selectedMyList.tasks.forEach(task => {
    //渲染1 模板
    //渲染2 模板中含有的CheckBox
    //渲染3 模板中含有的lable
    const addOneTask = document.importNode(taskTemplate.content, true) //制造了一个模板
    const checkbox = addOneTask.querySelector('input')
    checkbox.id = task.id
    checkbox.checked = task.completeStatus //选中状态由于完成度决定


    const label = addOneTask.querySelector('label') //选中模板中的label
    label.htmlFor = task.id //衔接
    label.append(task.name)
    tasksContainer.appendChild(addOneTask)
  })
}

function render() {
  //这个是渲染所有的的内容

  clearElement(listsContainer)//清理：清理数据，否则累加渲染
  renderMyLists()//渲染左边的lists

  const selectedList = myLists.find(list => list.id === selectedListId)//定义选择的list

  if (selectedListId == null) {
    listDisplayContainer.style.display = 'none'//如果没有选中的list，那么什么都不显示
  } else {
    listDisplayContainer.style.display = 'block' 
    listTitleElement.innerText = selectedList.name //这是右边的显示细节区域
    renderTaskCount(selectedList)
    clearElement(tasksContainer)//清理：清理数据，否则累加渲染
    renderTasks(selectedList)
  }
}


//右侧清单
tasksContainer.addEventListener('click', event => {
  
  if (event.target.tagName.toLowerCase() === 'input') {
    const selectedList = myLists.find(list => list.id === selectedListId)

    const selectedTask = selectedList.tasks.find(task => task.id === event.target.id)//ID哪里来的@@@@@@
    selectedTask.completeStatus = event.target.checked
    save() //为什么保存，还不render@@@@@@@@@
    renderTaskCount(selectedList) //计算任务数目的
  }
})

//清理完成的任务
clearCompleteTasksButton.addEventListener('click', e => {
  const selectedList = myLists.find(list => list.id === selectedListId)
  selectedList.tasks = selectedList.tasks.filter(task => !task.completeStatus)
  saveAndRender()
})

//删除整个list
deleteListButton.addEventListener('click', e => {
  myLists = myLists.filter(list => list.id !== selectedListId)
  selectedListId = null
  //项目围绕这个selectedListId为核心变化@@@@
  saveAndRender()
})


function renderTaskCount(selectedList) {
  const incompleteTaskCount = selectedList.tasks.filter(task => !task.completeStatus).length
  const taskString = incompleteTaskCount === 1 ? "task" : "tasks"
  listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`
}




//添加新的任务
newTaskForm.addEventListener('submit', e => {
  e.preventDefault()
  const taskName = newTaskInput.value
  if (taskName == null || taskName === '') return //啥都不return。。。。
  const myTask = createTask(taskName)
  newTaskInput.value = null
  const selectedList = myLists.find(list => list.id === selectedListId)
  selectedList.tasks.push(myTask)
  saveAndRender()
})

render()