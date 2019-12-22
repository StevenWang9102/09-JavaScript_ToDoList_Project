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


//---------------- 数据结构部分 ----------------
const LOCAL_STORAGE_LIST_KEY = 'task.myLists' //此处啥意思
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'

let myLists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)

//创造新的List对象
function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] }
}

//----------------- 左侧渲染功能【完成】 ----------------
function renderMyLists() {
  myLists.forEach(list => {
    const li = document.createElement('li')
    li.dataset.listId = list.id //这是啥？大致就是循环赋值一个listId
    li.classList.add("list-name")
    li.innerText = list.name
    if (list.id === selectedListId) {
      li.classList.add('active-list')
    }
    listsContainer.appendChild(li)
  })
}


//----------------- 左侧添加新列表功能 ----------------
newListForm.addEventListener('submit',e=>{ //为什么是submit，就知道我回车的时候就知道我要@@@@@@@@@@@@@@@@
//左侧添加新的list
  e.preventDefault()
  const listName = newListInput.value
  if (listName !== null && listName !== '') 
  {
    const list = createList(listName) //创建右侧的list
    newListInput.value = null
    myLists.push(list) //储存起来
  } 
  saveToBrower()  
  renderAll()
})
 

//----------------- 保存功能 ----------------
function saveToBrower() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(myLists))
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}


//----------------- 清除列表数组 ----------------
clearALl =(container)=>{
  while(container.hasChildNodes()) //当elem下还存在子节点时 循环继续
  {
    container.removeChild(container.firstChild);
  }
}

//----------------- 左侧列表点击事件 ----------------
listsContainer.addEventListener('click', e => {
  if(e.target.tagName.toLowerCase()==='li'){
    selectedListId = e.target.dataset.listId
  }
  //渲染右侧列表
  saveToBrower()  
  renderAll()
})


////////////////////////---------------进行并且梳理到这里：一定要跑起来----------------------//
////////////////////////---------------进行并且梳理到这里：一定要跑起来----------------------//
////////////////////////---------------进行并且梳理到这里：一定要跑起来----------------------//
////////////////////////---------------进行并且梳理到这里：一定要跑起来----------------------//


//----------------- 右侧列表渲染 ----------------
function renderTasks(selectedList) {
  
  console.log(selectedList.name);
  
  //渲染任务名称
  listTitleElement.innerHTML = selectedList.name
  
  //引入模板
  //模板的label改变
  //模板的

}




//----------------- 删除按钮 ----------------
deleteListButton.addEventListener('click', function(){
  // 首先在myList中删除这个选中的元素
  // 清空选中的list
  // 重新渲染全局
})



//----------------- 全局渲染 ----------------
function renderAll() {
    //清除目前的所有内容，以便于重新渲染myList
    clearALl(listsContainer)
    //重新渲染左边列表
    const selectedList = myLists.find(list => list.id === selectedListId)//定义选择的list

    renderMyLists(selectedList)
    console.log(selectedList.name);

  }




renderAll()