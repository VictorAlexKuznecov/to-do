const add = document.body.querySelector(".app__add-button"),
  list = document.body.querySelector(".app__list"),
  searchInput = document.getElementById("search"),
  locale = navigator.language,
  amountOfElements = document.querySelector(".app__number"),
  deleteAll = document.querySelector(".button__delete-all"),
  deleteLast = document.querySelector(".button__delete-last"),
  showAll = document.querySelector(".button__show-all"),
  showCompleted = document.querySelector(".button__show-completed"),
  completedNotes = document.querySelector(".app__completed"),
  deleteNote = document.querySelector(".item__delete"),
  searchIcon = document.querySelector(".app__search-icon"),
  toggleThemeCheckbox = document.querySelector(".checkbox__theme"),
  imageTheme = document.querySelector(".img__theme"),
  main = document.querySelector(".main"),
  appBody = document.querySelector(".app__body"),
  textMessageIncorrect = document.querySelector(".text-message-incorrect"),
  editButtons = document.querySelector(".app__buttons-edit"),
  btnSave = document.querySelector(".button-save"),
  btnCancel = document.querySelector(".button-cancel"),
  application = document.querySelector(".app");

let currentTime, taskDeadline, editingNumber;
let toDo = [];
/* -----------------test----------------- */

function setDate(arr) {
  localStorage.setItem("todos", JSON.stringify(arr));
}
function getDate() {
  if (localStorage.getItem("todos")) {
    toDo = JSON.parse(localStorage.getItem("todos"));
    getMessage(toDo);
    amountOfElements.textContent = toDo.length;
    updateCheckedItemCount();
  }
}
getDate();

// возвращает время
function formatDate(date) {
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const second = date.getSeconds();
  return `${hours}:${minutes < 10 ? "0" + minutes : minutes}:${
    second < 10 ? "0" + second : second
  } ${day} ${month}`;
}

function updateListWithNewNote() {
  list.innerHTML = "";
  let note = {
    message: searchInput.value,
    checked: false,
    date: formatDate(new Date()),
    dateNow: Date.now(),
    isVisible: true,
  };
  toDo.push(note);
  setDate(toDo);
  searchInput.value = "";
  amountOfElements.textContent = toDo.length;
  filterChecked(toDo);
  getMessage(toDo);
  removeButtonAfterDelay(toDo);
}
// удаление кнопки edit
function removeButtonAfterDelay(arr) {
  arr.forEach((item) => {
    currentTime = item.dateNow;
    taskDeadline = currentTime + 30000;
    setTimeout(() => {
      item.isVisible = false;
      list.innerHTML = "";
      getMessage(toDo);
    }, taskDeadline - currentTime);
    clearTimeout();
  });
}

// по нажатию enter
searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    if (searchInput.value.length < 4) {
      textMessageIncorrect.style.display = "block";
      searchInput.value = "";
    } else {
      updateListWithNewNote();
    }
  }
});

// убирает сообщение о некоректности введеных значений
searchInput.addEventListener("click", () => {
  if (textMessageIncorrect.style.display === "block") {
    textMessageIncorrect.style.display = "none";
  }
});
// click to add
add.addEventListener("click", () => {
  if (searchInput.value.length < 4) {
    textMessageIncorrect.style.display = "block";
    searchInput.value = "";
  } else {
    list.innerHTML = "";
    updateListWithNewNote();
  }
});

function createListItem(item, index) {
  return `
    <li class="app__item ${
      item.checked ? "active" : ""
    }" draggable="true" data-identifier=${index}>
    <input class="item__checkbox" type="checkbox" data-index=${index} ${
    item.checked ? "checked" : ""
  }/>
    <span class="item__checkbox-custom"></span>
    <div class = "item__content">
      <span class="item__text">${item.message}</span>
      <span class="item__date">${item.date}</span>
    </div>
    <img class="item__editing ${
      item.isVisible ? "" : "hidden"
    }" src="./image/edit.svg" data-editing=${index} alt="icon-editing" />
    <img class="item__delete" src="./image/delete.svg" data-indication=${index} alt="icon-delete" />
    </li>
    `;
}
// выводит сообщения
function getMessage(arr) {
  arr.forEach((item, index) => {
    list.insertAdjacentHTML("beforeend", createListItem(item, index));
  });
}

// выводит список выполненых дел
function updateCheckedItemCount() {
  completedNotes.innerHTML = toDo.filter((item) => item.checked).length;
}
// выполненные дела в конец списка
function filterChecked(arr) {
  arr.sort((a, b) => {
    return Number(a.checked) - Number(b.checked);
  });
  return arr;
}
// клик по списку дел
list.addEventListener("click", (event) => {
  if (event.target.classList.contains("item__checkbox")) {
    const indicator = Number(event.target.dataset.index);
    toDo[indicator].checked = !toDo[indicator].checked;
    list.innerHTML = "";
    updateCheckedItemCount();
    setDate(toDo);
    filterChecked(toDo);
    getMessage(toDo);
  }
  if (event.target.classList.contains("item__delete")) {
    const index = Number(event.target.dataset.indication);
    toDo.splice(index, 1);
    list.innerHTML = "";
    amountOfElements.textContent = toDo.length;
    updateCheckedItemCount();
    getMessage(toDo);
    setDate(toDo);
  }
  if (event.target.classList.contains("item__editing")) {
    editingNumber = Number(event.target.dataset.editing);
    searchInput.value = toDo[editingNumber].message;
    searchInput.focus();
    editButtons.style.display = "block";
  }
});
/* ----------------------- dragandDrop---------------------------------- */
list.addEventListener("mousedown", () => {
  const items = document.querySelectorAll(".app__item");
  let dragStartIndex;
  const dragOver = function (event) {
    event.preventDefault();
  };
  const dragStart = function () {
    dragStartIndex = Number(this.dataset.identifier);
  };
  const dragDrop = function () {
    const dragDropIndex = Number(this.dataset.identifier);
    let deleteElement = toDo.splice(dragStartIndex, 1);
    toDo.splice(dragDropIndex, 0, ...deleteElement);
    list.innerHTML = "";
    getMessage(toDo);
    setDate(toDo);
  };
  items.forEach((elem) => {
    elem.addEventListener("dragover", dragOver);
    elem.addEventListener("dragstart", dragStart);
    elem.addEventListener("drop", dragDrop);
  });
});

// click по кнопке сохранить
btnSave.addEventListener("click", () => {
  toDo[editingNumber].message = searchInput.value;
  toDo[editingNumber].date = formatDate(new Date());
  editButtons.style.display = "none";
  searchInput.value = "";
  list.innerHTML = "";
  updateCheckedItemCount();
  getMessage(toDo);
  setDate(toDo);
});

// click по кнопке отменить
btnCancel.addEventListener("click", () => {
  editButtons.style.display = "none";
  searchInput.value = "";
});

// клик по выполненым делам
showCompleted.addEventListener("click", () => {
  list.innerHTML = "";
  const completedArr = toDo.filter((item) => item.checked);
  completedArr.forEach((item, index) => {
    list.insertAdjacentHTML("beforeend", createListItem(item, index));
  });
  completedNotes.innerHTML = completedArr.length;
  setDate(completedArr);
});

showAll.addEventListener("click", () => {
  list.innerHTML = "";
  getMessage(toDo);
  setDate(toDo);
});

deleteLast.addEventListener("click", () => {
  list.innerHTML = "";
  toDo.pop();
  getMessage(toDo);
  setDate(toDo);
  amountOfElements.textContent = toDo.length;
  updateCheckedItemCount();
});

deleteAll.addEventListener("click", () => {
  list.innerHTML = "";
  completedNotes.innerHTML = 0;
  toDo.length = 0;
  setDate(toDo);
  amountOfElements.textContent = toDo.length;
});

searchIcon.addEventListener("click", () => {
  list.innerHTML = "";

  const filteredItems = toDo.filter(
    (item) => item.message === searchInput.value
  );
  filteredItems.forEach((item, index) => {
    list.insertAdjacentHTML("beforeend", createListItem(item, index));
  });
  searchInput.value = "";
  setDate(filteredItems);
});

// переключение темы
toggleThemeCheckbox.addEventListener("click", () => {
  main.classList.toggle("dark");
  if (main.classList.contains("dark")) {
    imageTheme.src = "./image/theme/sun.svg";
    application.style.background = "rgba(0, 0, 0, 0.96)";
    main.style.backgroundImage = 'url("../to-do/image/black-background.jpg")';
  } else {
    main.style.backgroundImage = 'url("../to-do/image/background.jpg")';
    imageTheme.src = "./image/theme/moon.png";
    application.style.background = "rgba(255, 253, 244, 0.96)";
  }
});

/* login */
const closeModal = document.querySelector(".btn-close"),
  loginModal = document.querySelector(".login"),
  wrapper = document.querySelector(".wrapper"),
  registerModal = document.querySelector(".register"),
  userEmail = document.querySelector(".input-email-register"),
  userPassword = document.querySelector(".input-password-register"),
  userName = document.querySelector(".input-user"),
  userEmailLogin = document.querySelector(".input-email-login"),
  userPasswordLogin = document.querySelector(".input-password-login"),
  inputCheckbox = document.querySelector(".input__checkbox"),
  btnLogin = document.querySelector(".btn-login"),
  btnRegister = document.querySelector(".btn-register"),
  registerLink = document.querySelector(".register__link"),
  hidePasswordIcon = document.querySelector(".icon-eye"),
  hidePasswordIconRegister = document.querySelector(".icon-eye-register"),
  passwordMessage = document.querySelector(".register__message"),
  strength = document.querySelector(".strength"),
  userGreeting = document.querySelector(".user-name"),
  loginLink = document.querySelector(".login__link");
let users = [];

function recordUser(arr) {
  localStorage.setItem("users", JSON.stringify(arr));
}
function readUser() {
  return JSON.parse(localStorage.getItem("users"));
}
registerLink.addEventListener("click", () => {
  loginModal.style.opacity = "0";
  registerModal.style.transform = "translateX(0px)";
});
loginLink.addEventListener("click", () => {
  loginModal.style.opacity = "1";
  registerModal.style.transform = "translateX(420px)";
});

btnRegister.addEventListener("click", (event) => {
  event.preventDefault();
  let emailValue = userEmail.value;
  const regexp = /\@/;
  if (
    emailValue.match(regexp) &&
    userPassword.value.length > 4 &&
    userName.value.length > 4
  ) {
    person = {
      user: userName.value,
      email: userEmail.value,
      password: userPassword.value,
    };

    users.push(person);
    recordUser(users);
    userPassword.value = "";
    userEmail.value = "";
    userName.value = "";
    loginModal.style.opacity = "1";
    registerModal.style.transform = "translateX(420px)";
  } else {
    registerModal.classList.add("error");
  }
});
registerModal.addEventListener("click", (event) => {
  if (event.target.classList.contains("input")) {
    registerModal.classList.remove("error");
  }
});
btnLogin.addEventListener("click", (event) => {
  event.preventDefault();
  const arr = readUser();
  const newArr = arr.filter((item) => item.email === userEmailLogin.value);
  userGreeting.textContent = arr[0].user;
  if (newArr.length === 0) {
    loginModal.classList.add("error");
  }
  if (
    newArr[0].email === userEmailLogin.value &&
    newArr[0].password === userPasswordLogin.value
  ) {
    wrapper.style.display = "none";
    application.style.display = "block";
    main.style.backgroundImage = 'url("../to-do/image/background.jpg")';
  }
});
hidePasswordIcon.addEventListener("click", () => {
  hidePasswordIcon.classList.toggle("visible");
  if (hidePasswordIcon.classList.contains("visible")) {
    userPasswordLogin.attributes.type.value = "text";
  } else {
    userPasswordLogin.attributes.type.value = "password";
  }
});
hidePasswordIconRegister.addEventListener("click", () => {
  hidePasswordIconRegister.classList.toggle("visible");
  if (hidePasswordIconRegister.classList.contains("visible")) {
    userPassword.attributes.type.value = "text";
  } else {
    userPassword.attributes.type.value = "password";
  }
});
userPassword.addEventListener("input", () => {
  if (userPassword.value.length > 0) {
    passwordMessage.style.display = "block";
  } else {
    passwordMessage.style.display = "none";
    userPassword.style.borderBottom = "2px solid #162938";
  }
  if (userPassword.value.length > 0 && userPassword.value.length <= 4) {
    passwordMessage.style.color = "red";
    userPassword.style.borderBottom = "2px solid red";
    strength.innerHTML = "weak";
  } else if (userPassword.value.length > 4 && userPassword.value.length < 8) {
    passwordMessage.style.color = "orange";
    userPassword.style.borderBottom = "2px solid orange";
    strength.innerHTML = "medium";
  } else if (userPassword.value.length >= 8) {
    passwordMessage.style.color = "green";
    userPassword.style.borderBottom = "2px solid green";
    strength.innerHTML = "strong";
  }
});
