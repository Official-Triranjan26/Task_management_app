const state = {
    taskList: [],
};
// console.log(state.taskList);
// const landingpage=()=>{
//     if(state.taskList.length==0){
//         return `
//             <div><h1>Welcome to Tasky !!</h1></div>
//         `;
//     }
// }


const taskContents = document.querySelector(".task_contents");
const taskModal = document.querySelector(".task_modal_body")

const htmlTaskContent = ({ id, title, description, type, url }) => `
    <div class='col-md-6 col-lg-4 my-3 ' id=${id} key=${id}>
        <div class="card shadow-sm task_card bg-dark text-warning" >
            <div class='card-header d-flex gap-2 justify-content-end task__card__header'>
                <button type='button' class='btn btn-outline-warning mr-2' name=${id} onclick="editTask.apply(this, arguments)">
                    <i class='fas fa-pencil-alt' name=${id}></i>
                </button>
                <button type='button' class='btn btn-outline-danger mr-2' name=${id} onclick="deleteTask.apply(this, arguments)">
                    <i class='fas fa-trash-alt' name=${id}></i>
                </button>
            </div>
            <div class='card-body'>
                ${
                    url
                    ? `<img width='100%' height='150px' style="object-fit: cover; object-position: center"  src=${url} alt='card image cap' class='card-image-top md-3 rounded-lg border border-warning' />`
                    : `
                    <img width='100%' height='150px!important' style="object-fit: cover; object-position: center" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbrHWzlFK_PWuIk1Jglo7Avt97howljIWwAA&usqp=CAU" alt='card image cap' class='place__holder__image border border-warning' />
                    `
                }
                <h4 class='task_card_title'>${title}</h4>
                <p class='description trim-3-lines text-warning text-opacity-50' data-gram_editor='false'>${description}</p>
                <div class='tags text-white d-flex flex-wrap'><span class=' badge text-bg-warning m-1'>${type}</span></div>
            </div>
            <div class='card-footer'>
                <button type='button' class='btn btn-outline-warning float-right' data-bs-toggle='modal' data-bs-target='#showTask'
                id=${id} 
                onclick='openTask.apply(this,arguments)'>Open Task</button>
            </div>
        </div>
    </div>
`;

const htmlModalContent = ({ id, title, description, url }) => {
    const date = new Date(parseInt(id));
    return `
        <div id =${id}>
        ${
            url
            ? `<img width='100%' style="object-fit: cover; object-position: center"  src=${url} alt='card image cap' class='image-fluid card-image-top md-3 rounded-lg' />`
            : `
            <img width='100%' style="object-fit: cover; object-position: center" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbrHWzlFK_PWuIk1Jglo7Avt97howljIWwAA&usqp=CAU" alt='card image cap' class='image-fluid place__holder__image ' />
            `
        }
        <strong class='text-sm text-muted'><span class="text-warning">Created on</span> ${date.toString()}</strong>
        <h2 class='my-3'>${title}</h2>
        <p class='lead'>${description}</p>
        </div>
        `;
}

const updateLocalStorage = () => {
    localStorage.setItem(
        "tasks",
        JSON.stringify({
            tasks: state.taskList
        })
    );
};

const loadInitialData = () => {
    const localStorageCopy = JSON.parse(localStorage.tasks);
  
    if (localStorageCopy) state.taskList = localStorageCopy.tasks;
  
    state.taskList.map((cardDate) => {
      taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardDate));
    });
    // landingpage();
   

  };

const handleSubmit = (event) => {
    const id = `${Date.now()}`;
    const input = {
        url: document.getElementById("imageUrl").value,
        title: document.getElementById("taskTitle").value,
        description: document.getElementById("taskDescription").value,
        type: document.getElementById("tags").value,
    };

    if (input.title === "" || input.description === "" || input.type === "") {
        return alert("Please fill all the fields !");
    }

    taskContents.insertAdjacentHTML(
        "beforeend",
        htmlTaskContent({
            ...input,
            id,
        })
    );

    state.taskList.push({ ...input, id });
    updateLocalStorage();
    alert("Task Added !!")
};

const openTask = (e) => {
    if (!e) e = window.event;
  
    const getTask = state.taskList.find(({ id }) => id === e.target.id);
    taskModal.innerHTML = htmlModalContent(getTask);
  };

const deleteTask =(e)=>{
    if(!e) e =window.event;
    confirm("You are Deleting a Task !!");
    const targetID=e.target.getAttribute("name");
    const type=e.target.tagName;
    const removeTask =state.taskList.filter(({id})=>id!==targetID);
     
    state.taskList=removeTask;
    updateLocalStorage();
    if(type==="BUTTON"){
        return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
            e.target.parentNode.parentNode.parentNode
        );
    }
    return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
        e.target.parentNode.parentNode.parentNode.parentNode
    );
    
};

const editTask=(e)=>{
    if(!e) e=window.event;
    const targetID=e.target.id;
    const type=e.target.tagName;
    let parentNode;
    let taskTitle;
    let taskDescription;
    let taskType;
    let submitButton;

    if (type === "BUTTON") {
        parentNode = e.target.parentNode.parentNode;
      } else {
        parentNode = e.target.parentNode.parentNode.parentNode;
      }
      taskTitle = parentNode.childNodes[3].childNodes[3];
      taskDescription = parentNode.childNodes[3].childNodes[5];
      taskType = parentNode.childNodes[3].childNodes[7].childNodes[0];
      submitButton = parentNode.childNodes[5].childNodes[1];

      console.log(taskType);
    
      taskTitle.setAttribute("contenteditable", "true");
      taskDescription.setAttribute("contenteditable", "true");
      taskType.setAttribute("contenteditable", "true");
    
      submitButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");
      submitButton.removeAttribute("data-bs-toggle");
      submitButton.removeAttribute("data-bs-target");
      submitButton.innerHTML = "Save Changes";
};


const saveEdit = (e) => {
    if (!e) e = window.event;
  
    const targetID = e.target.id;
    const parentNode = e.target.parentNode.parentNode;
    // console.log(parentNode.childNodes);
  
    const taskTitle = parentNode.childNodes[3].childNodes[3];
    const taskDescription = parentNode.childNodes[3].childNodes[5];
    const taskType = parentNode.childNodes[3].childNodes[7].childNodes[0];
    const submitButton = parentNode.childNodes[5].childNodes[1];
  
    const updateData = {
      taskTitle: taskTitle.innerHTML,
      taskDescription: taskDescription.innerHTML,
      taskType: taskType.innerHTML,
    };
  
    let stateCopy = state.taskList;
  
    stateCopy = stateCopy.map((task) =>
      task.id === targetID
        ? {
            id: task.id,
            title: updateData.taskTitle,
            description: updateData.taskDescription,
            type: updateData.taskType,
            url: task.url,
          }
        : task
    );
  
    state.taskList = stateCopy;
    updateLocalStorage();
  
    taskTitle.setAttribute("contenteditable", "false");
    taskDescription.setAttribute("contenteditable", "false");
    taskType.setAttribute("contenteditable", "false");
  
    submitButton.setAttribute("onclick", "openTask.apply(this, arguments)");
    submitButton.setAttribute("data-bs-toggle", "modal");
    submitButton.setAttribute("data-bs-target", "#showTask");
    submitButton.innerHTML = "Open Task";

    alert("Changes Saved Successfully ")
  };

  const searchTask = (e) => {
    if (!e) e = window.event;
  
    while (taskContents.firstChild) {
      taskContents.removeChild(taskContents.firstChild);
    }
  
    const resultData = state.taskList.filter(({ title }) => {
      return title.toLowerCase().includes(e.target.value.toLowerCase());
    });
  
    console.log(resultData);
  
    resultData.map((cardData) => {
      taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData));
    });
  };