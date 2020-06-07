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
  getFromCloud(netlifyIdentity.currentUser());
  welcomeScreen.classList.add("done");
  setTimeout(() => {
    welcomeScreen.remove();
    portrait.classList.remove("forward");
  }, 2000);
});

logout.addEventListener("click", () => {
  netlifyIdentity.logout();
  localStorage.clear();
  window.history.pushState("index", "the title", `/`);
  location.reload();
});
const login_user = form_login.querySelector('input[name="username"]'),
  login_pass = form_login.querySelector('input[name="password"]');
form_login.addEventListener("submit", (e) => {
  e.preventDefault();
  const url = "/.netlify/functions/fetchViwerData";

  fetch(url, { headers: { from: login_user.value, warning: login_pass.value } })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        throw res.status;
      }
    })
    .then((data) => {
      employees[login_user.value] = data;
      login_user.classList.add("currect");
      login_pass.classList.add("currect");
      updateEmpList();
      welcomeScreen.classList.add("done");
      setTimeout(() => {
        welcomeScreen.remove();
        portrait.classList.remove("forward");
      }, 2000);
      document.querySelector(".btn_sidebar").remove();
      document.querySelector(".popUp_wrapper").remove();
      document.querySelector(".forms").remove();
      document.querySelector("h3.nameTag").addEventListener("click", (e) => {
        e.preventDefault();
        tableWrapper.style.left = "0";
        showEmpList();
        section = "employee";
      });
    })
    .catch((err) => {
      if (err === 403) {
        login_user.classList.add("wrongInput");
        login_pass.classList.add("wrongInput");
      } else {
        console.log(err);
      }
    });
});
let passwordShown = false;
showPass.addEventListener("click", () => {
  if (!passwordShown) {
    showPass.setAttribute("name", "eye-outline");
    form_login
      .querySelector('input[name="password"]')
      .setAttribute("type", "text");
  } else {
    showPass.setAttribute("name", "eye-off-outline");
    form_login
      .querySelector('input[name="password"]')
      .setAttribute("type", "password");
  }
  passwordShown = !passwordShown;
});

window.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".netlify-identity-login") &&
    (document.querySelector(".netlify-identity-login").textContent =
      "Management");
});
