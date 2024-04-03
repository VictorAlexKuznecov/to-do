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
  toggleTheme = document.querySelector(".app__theme"),
  imageTheme = document.querySelector(".img__theme"),
  main = document.querySelector(".main"),
  application = document.querySelector(".app");

let toDo = [];
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
  };
  toDo.push(note);
  setDate(toDo);
  searchInput.value = "";
  getMessage(toDo);
  amountOfElements.textContent = toDo.length;
}
// click to add
add.addEventListener("click", () => {
  updateListWithNewNote();
});
// по нажатию enter
searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    updateListWithNewNote();
  }
});
function createListItem(item, index) {
  return `
    <li class="app__item ${item.checked ? "active" : ""}">
      <input class="item__checkbox" type="checkbox" data-index=${index} ${
    item.checked ? "checked" : ""
  }/>
      <span class="item__text">${item.message}</span>
      <span class="item__date">${item.date}</span>
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
// клик по списку дел
list.addEventListener("click", (event) => {
  if (event.target.classList.contains("item__checkbox")) {
    const indicator = Number(event.target.dataset.index);
    toDo[indicator].checked = !toDo[indicator].checked;
    list.innerHTML = "";
    updateCheckedItemCount();
    getMessage(toDo);
    setDate(toDo);
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
toggleTheme.addEventListener("click", () => {
  application.classList.toggle("dark");
  if (application.classList.contains("dark")) {
    imageTheme.src = "./image/theme/sun.svg";
    main.style.backgroundImage = "url('../to-do/image/black-background.jpg')";
    main.style.backgroundRepeat = "no-repeat";
    main.style.backgroundPosition = "center";
    main.style.backgroundSize = "cover";
    main.style.transition = "all ease 1s";
  } else {
    imageTheme.src = "./image/theme/moon.png";
    main.style.backgroundImage = 'url("../to-do/image/background.jpg")';
    main.style.backgroundRepeat = "no-repeat";
    main.style.backgroundPosition = "center";
    main.style.backgroundSize = "cover";
    main.style.transition = "all ease 1s";
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
});
btnLogin.addEventListener("click", (event) => {
  event.preventDefault();
  const arr = readUser();
  const newArr = arr.filter((item) => item.email === userEmailLogin.value);
  if (
    newArr[0].email === userEmailLogin.value &&
    newArr[0].password === userPasswordLogin.value
  ) {
    wrapper.style.opacity = "0";
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
