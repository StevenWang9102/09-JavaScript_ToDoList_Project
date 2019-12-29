const listsContainer = document.querySelector("[data-lists]");
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");
const deleteListButton = document.querySelector("[data-delete-list-button]");
const listDisplayContainer = document.querySelector(
  "[data-list-display-container]"
);
const listTitleElement = document.querySelector("[data-list-title]");
const listCountElement = document.querySelector("[data-list-count]");
const tasksContainer = document.querySelector("[data-tasks]");
const taskTemplate = document.getElementById("task-template");
const newTaskForm = document.querySelector("[data-new-task-form]");
const newTaskInput = document.querySelector("[data-new-task-input]");
const clearCompleteTasksButton = document.querySelector(
  "[data-clear-complete-tasks-button]"
);

//---------------- 数据结构部分 ----------------
const LOCAL_STORAGE_LIST_KEY = "task.myLists"; //此处啥意思
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId";

let myLists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

//创造新的List对象
function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] };
}

function createTask(name) {
  return { id: Date.now().toString(), name: name, completeStatus: false }; //为什么需要id？？
}
//----------------- 左侧渲染功能【完成】 ----------------
function renderMyLists() {
  myLists.forEach(list => {
    const li = document.createElement("li");
    li.dataset.listId = list.id; //这是啥？大致就是循环赋值一个listId
    li.classList.add("list-name");
    li.innerText = list.name;
    if (list.id === selectedListId) {
      li.classList.add("active-list");
    }
    listsContainer.appendChild(li);
  });
}

//----------------- 左侧添加新列表功能 ----------------
newListForm.addEventListener("submit", e => {
  //为什么是submit，就知道我回车的时候就知道我要@@@@@@@@@@@@@@@@
  //左侧添加新的list
  e.preventDefault();
  const listName = newListInput.value;
  if (listName !== null && listName !== "") {
    const list = createList(listName); //创建右侧的list
    newListInput.value = null;
    myLists.push(list); //储存起来
  }
  saveToBrower();
  renderAll();
});

//----------------- 保存功能 ----------------
function saveToBrower() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(myLists));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}

//----------------- 清除列表数组 ----------------
clearAll = container => {
  while (container.hasChildNodes()) {
    //当elem下还存在子节点时 循环继续
    container.removeChild(container.firstChild);
  }
};

//----------------- 左侧列表点击事件 ----------------
listsContainer.addEventListener("click", e => {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedListId = e.target.dataset.listId;
  }
  //渲染右侧列表
  saveToBrower();
  renderAll();
});


//----------------- 右侧列表渲染 ----------------
function renderTasks(selectedMyList) {
  //这个方法渲染左边选中的list
  selectedMyList.tasks.forEach(task => {
    //渲染1 模板
    //渲染2 模板中含有的CheckBox
    //渲染3 模板中含有的lable
    const addTaskDetails = document.importNode(taskTemplate.content, true); //制造了一个模板
    //注意这个addOneTask是一个DOM对象，不是普通的对象
    // console.log(taskTemplate);

    const checkbox = addTaskDetails.querySelector("input");
    checkbox.id = task.id;
    checkbox.checked = task.completeStatus; //选中状态由于完成度决定

    const label = addTaskDetails.querySelector("label"); //选中模板中的label
    label.htmlFor = task.id; //衔接·
    label.append(task.name);
    tasksContainer.appendChild(addTaskDetails);
  });
}

//----------------- 删除按钮 ----------------
deleteListButton.addEventListener("click", function(e) {
  myLists = myLists.filter(list => list.id !== selectedListId); 
  // 清空选中的list
  selectedListId = null;
  // 重新渲染全局
  renderAll();
});


//----------------- 右侧列表：添加新的任务，只是添加一行任务-----------------
newTaskForm.addEventListener('submit', e => {
  e.preventDefault()
  clearAll(tasksContainer)

  // console.log(e);

  const selectedList = myLists.find(list => list.id === selectedListId)
  const taskName = newTaskInput.value
  
  if (taskName !== null && taskName !== ''){
    // console.log('没进来？');
    const myTask = createTask(taskName) 
    newTaskInput.value = null
    selectedList.tasks.push(myTask)  
}
  console.log(selectedList.tasks);
  saveToBrower();
  renderAll();
})

//右侧清单：添加划除-删除事件
tasksContainer.addEventListener('click', event => {
  console.log(event.target.name);
  
  if (event.target.tagName.toLowerCase() === 'input') {
    const selectedList = myLists.find(list => list.id === selectedListId)
    const selectedTask = selectedList.tasks.find(task => task.id === event.target.id)//ID哪里来的@@@@@@
    selectedTask.completeStatus = event.target.checked
    saveToBrower() //为什么保存，还不render@@@@@@@@@
    renderTaskCount(selectedList) //计算任务数目的
  }
})

//----------------- 删除选中 ----------------
clearCompleteTasksButton.addEventListener('click', e => {
  const selectedList = myLists.find(list => list.id === selectedListId)
  selectedList.tasks = selectedList.tasks.filter(task => !task.completeStatus)
  saveToBrower() // saveAndRender()
  renderAll()
})

////////////////////////---------------进行并且梳理到这里：一定要跑起来看功能----------------------//
////////////////////////---------------进行并且梳理到这里：一定要跑起来看功能----------------------//


//----------------- 全局渲染 ----------------
function renderAll() {
  //清除目前的所有内容，以便于重新渲染myList，其实主要是清空浏览器
  clearAll(listsContainer);
  clearAll(tasksContainer);

  //重新渲染左边列表
  const selectedList = myLists.find(list => list.id === selectedListId); //定义选择的list

  renderMyLists();
  renderTasks(selectedList);
  //应该包含渲染右侧名头
  listTitleElement.innerHTML = selectedList.name
  // 为什么不是放在renderTasks函数中呢？？？@@@@@@@@@@@@@@
  
}

renderAll();

