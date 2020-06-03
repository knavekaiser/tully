let vh = window.innerHeight * 0.01;
const innerContainer = document.querySelector(".innerContainer"),
  sidebarSpan = document.querySelector(".sidebar span"),
  welcomeScreen = document.querySelector(".welcomeScreen");
let sidebarOpen = false;

function toggleSidebar() {
  !sidebarOpen
    ? ((innerContainer.style.left = "0"),
      sidebarSpan.classList.add("active"),
      btnSidebar.classList.add("side_back"))
    : ((innerContainer.style.left = `${
        window.innerWidth <= 480 ? -9.7 : -9
      }rem`),
      sidebarSpan.classList.remove("active"),
      portrait.classList.remove("active"),
      fiscalYears.classList.remove("active"),
      backupOptions.classList.remove("active"),
      btnSidebar.classList.remove("side_back"));
  sidebarOpen = !sidebarOpen;
}
sidebarSpan.addEventListener("click", toggleSidebar);
document.body.style.setProperty("--vh", `${vh}px`);
document.querySelector(".table_container").style.width = `${
  document.querySelector(".innerContainer").clientWidth -
  document.querySelector(".sidebar").clientWidth
}px`;
let scrollbarPosition =
  document.querySelector(".innerContainer").clientHeight -
  (document.querySelector("header").clientHeight +
    document.querySelector(".thead").clientHeight);
employee.querySelector(".tbody").style.height = `${scrollbarPosition}px`;
tasks.querySelector(".tbody").style.height = `${scrollbarPosition}px`;
window.addEventListener("resize", () => {
  let vh = window.innerHeight * 0.01;
  document.body.style.setProperty("--vh", `${vh}px`);
  let scrollbarPosition =
    document.querySelector(".innerContainer").clientHeight -
    (document.querySelector("header").clientHeight +
      document.querySelector(".thead").clientHeight);
  employee.querySelector(".tbody").style.height = `${scrollbarPosition}px`;
  tasks.querySelector(".tbody").style.height = `${scrollbarPosition}px`;
  document.querySelector(".table_container").style.width = `${
    document.querySelector(".innerContainer").clientWidth -
    document.querySelector(".sidebar").clientWidth
  }px`;
});

formsSpan.addEventListener("click", () => {
  hideForm();
});
function showForm() {
  clearTimeout(formClearTimeout);
  formsSpan.classList.add("active");
  if (section === "employee") {
    document.querySelector(".forms").style.display = "block";
    setTimeout(() => form_emp.classList.toggle("hidden"), 0);
    setTimeout(() => {
      form_emp.querySelector('input[name="employee"]').focus();
    }, 500);
  } else {
    document.querySelector(".forms").style.display = "block";
    setTimeout(() => form_task.classList.toggle("hidden"), 0);
    setTimeout(() => {
      form_task.querySelector('input[name="dress_name"]').focus();
    }, 500);
  }
}
let formClearTimeout;
function hideForm() {
  edit = false;
  form_emp.classList.add("hidden");
  form_task.classList.add("hidden");
  formsSpan.classList.remove("active");
  formClearTimeout = setTimeout(() => {
    form_emp.reset();
    form_emp.reset();
    document.querySelector(".forms").style.display = "none";
    for (var i = [...itemsToAdd.children].length; i > 1; i--) {
      [...itemsToAdd.children][i - 1].children[0].value.length === "" &&
        [...itemsToAdd.children][i - 1].remove();
    }
  }, 500);
}

window.oncontextmenu = function () {
  return false;
};

const about = document.querySelector(".about p"),
  portrait = document.querySelector(".portrait"),
  root = document.documentElement;
portrait.addEventListener("click", () => {
  portrait.classList.add("forward");
  setTimeout(() => portrait.classList.remove("forward"), 1000);
});

root.style.setProperty("--portrait-height", `${portrait.clientWidth * 1.71}px`);

about.addEventListener("click", () => {
  portrait.classList.toggle("active");
});

function defaultDateValue() {
  let date = new Date(),
    dateFormatted = `${date.getFullYear()}-${
      date.getMonth() < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
    }-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;
  form_task.querySelector('input[type="date"]').value = dateFormatted;
}
defaultDateValue();

const loginForm = document.querySelector("#loginForm"),
  username = loginForm.querySelector('input[name="username"]'),
  password = loginForm.querySelector('input[name="password"]');

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (username.value === "admin" && password.value === "samplePass") {
    username.classList.add("currect");
    password.classList.add("currect");
    getFromCloud();
    welcomeScreen.classList.add("done");
    setTimeout(() => {
      welcomeScreen.remove();
      portrait.classList.remove("forward");
    }, 2000);
  } else {
    username.value = "";
    password.value = "";
    username.focus();
    username.classList.add("wrongInput");
    password.classList.add("wrongInput");
    setTimeout(() => {
      username.classList.remove("wrongInput");
      password.classList.remove("wrongInput");
    }, 350);
  }
});

window.onpopstate = function (e) {
  e.preventDefault();
  section !== "employee" && showEmpList();
  formsSpan.clientWidth > 0 && hideForm();
  cls_dashboard.clientWidth > 0 && cls_dashboard.click();
  sidebarSpan.classList.contains("active") && btnSidebar.click();
};
window.addEventListener("beforeunload", function (e) {
  if (btnSidebar.children[0].classList.contains("unsaved")) {
    e.preventDefault();
    e.returnValue = "";
  }
});

const user = netlifyIdentity.currentUser();
netlifyIdentity.on("login", (user) => {
  netlifyIdentity.close();
  getFromCloud();
  welcomeScreen.classList.add("done");
  setTimeout(() => {
    welcomeScreen.remove();
    portrait.classList.remove("forward");
  }, 2000);
});
welcomeScreen.classList.add("done");
setTimeout(() => {
  welcomeScreen.remove();
  portrait.classList.remove("forward");
}, 2000);

const { GREETING } = process.env;

exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: GREETING,
  };
};