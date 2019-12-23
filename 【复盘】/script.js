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
clearALl = container => {
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

// function renderTasks(selectedMyList) {
//   //渲染任务名称：答案里面没有这句@@@@@@@@@
//   listTitleElement.innerHTML = selectedList.name;

//   selectedMyList.tasks.forEach(task => {
//     //在内存整出来模板节点
//     const addOneTask = document.importNode(taskTemplate.content, true); //制造了一个模板

//     //模板中的CheckBox
//     const checkbox = addOneTask.querySelector("input");
//     console.log(checkbox);//这是一个什么对象
//     checkbox.id = task.id;
//     checkbox.checked = task.completeStatus; //选中状态由于完成度决定  //现在需要：右侧列表总的细节

//     //模板中的
//     const label = addOneTask.querySelector("label");
//     label.htmlFor = task.id;
//     label.append(task.name)
//     //label中添加一个task
//     //还要干啥
//     tasksContainer.appendChild(addOneTask)
//   });
// }

//----------------- 右侧列表渲染 ----------------
function renderTasks(selectedMyList) {
  //这个方法渲染左边选中的list
  selectedMyList.tasks.forEach(task => {
    //渲染1 模板
    //渲染2 模板中含有的CheckBox
    //渲染3 模板中含有的lable
    const addTaskDetails = document.importNode(taskTemplate.content, true); //制造了一个模板
    //注意这个addOneTask是一个DOM对象，不是普通的对象
    console.log(taskTemplate);

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

// //----------------- 右侧：添加新的内容 ----------------
// newTaskForm.addEventListener('submit', e => {
//     e.preventDefault()
//     //首先确认找到li标签
//       const selectedList = myLists.find(list => list.id === selectedListId); //定义选择的list 【正确】
//       //赋值一次:input中的内容，赋值给TM谁？应该渲染的数组中 添加一个
//       const newTask = createTask(e.target.value) //这是一个对象{} //【正确】
//       selectedList.tasks.push(newTask) //数组中存放很多对象？【正确】
//       //全局渲染
//       newTaskInput.value = null
//       saveToBrower()
//       renderAll();
// })

//右侧列表：添加新的任务，只是添加一行任务
newTaskForm.addEventListener('submit', e => {
  e.preventDefault()
  const taskName = newTaskInput.value
  if (taskName !== null && !taskName === ''){
    const myTask = createTask(taskName) 
    newTaskInput.value = null
    const selectedList = myLists.find(list => list.id === selectedListId)
    selectedList.tasks.push(myTask)}
  saveAndRender()
})


////////////////////////---------------进行并且梳理到这里：一定要跑起来看功能----------------------//
////////////////////////---------------进行并且梳理到这里：一定要跑起来看功能----------------------//
////////////////////////---------------进行并且梳理到这里：一定要跑起来看功能----------------------//



//----------------- 全局渲染 ----------------
function renderAll() {
  //清除目前的所有内容，以便于重新渲染myList
  clearALl(listsContainer);
  //重新渲染左边列表
  const selectedList = myLists.find(list => list.id === selectedListId); //定义选择的list

  renderMyLists();
  renderTasks(selectedList);
  // console.log(selectedList.name);
}

renderAll();

