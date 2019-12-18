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

    renderMyLists();
})

//渲染左侧数据
const renderMyLists=()=>{
//myLists中的内容＞循环变成li标签＞塞入ul中
    myLists.forEach(element => {
        var li=document.createElement('li');
        li.value = element;
        li.dataset.listId = list.id //每一个新增的li，都注入ID
        li.classList.add("list-name")//新增的li也是有class的
        。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
        listsContainer.appendChild(li);
    });
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