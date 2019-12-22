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



// 左侧栏目增加监听，加入左边的list
const listsContainer = document.querySelector('[data-lists]')
listsContainer.addEventListener('click',(event)=>{
    console.log(event);
})

//左侧栏目：输入的内容，要呈现在li标签中
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')

//创造新的List对象
function createList(name) {
    return { id: Date.now().toString(), name: name, tasks: [] }
  }


const myLists = [];

function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(myLists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
  }



newListForm.addEventListener('submit',(event)=>{
    //为什么是submit，就知道我回车的时候就知道我要@@@@@@@@@@@@@@@@
    e.preventDefault()
    //获取
    const inputContent = newListInput.value;
    if (listName !== null && listName !== '') {
        const newList = document.createList(inputContent);
        myLists.push(newList)//储存起来
        newListInput.value = null
    }
    save()//为什么这么储存
    render();//为什么不是直接renderMylist?
})

//渲染左侧数据
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
  



//
//
//
//
//
//
//
//
//