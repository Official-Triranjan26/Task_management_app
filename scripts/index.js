const state = {
    taskList: [],
};


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
                    ? `<img width='100%' height='150px' style="object-fit: cover; object-position: center"  src=${url} alt='card image cap' class='card-image-top md-3 rounded-lg' />`
                    : `
                    <img width='100%' height='150px!important' style="object-fit: cover; object-position: center" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbrHWzlFK_PWuIk1Jglo7Avt97howljIWwAA&usqp=CAU" alt='card image cap' class='place__holder__image ' />
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