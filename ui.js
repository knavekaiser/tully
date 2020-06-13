const innerContainer = document.querySelector(".innerContainer"),
  sidebarSpan = document.querySelector(".sidebar_span"),
  welcomeScreen = document.querySelector(".welcomeScreen"),
  tableContainer = document.querySelector(".table_container"),
  sidebar = document.querySelector(".sidebar");
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
function resizeWindow() {
  let vh = window.innerHeight * 0.01;
  document.body.style.setProperty("--vh", `${vh}px`);
  tableContainer.style.width = `${
    innerContainer.clientWidth - sidebar.clientWidth
  }px`;
  document
    .querySelectorAll(".tbody")
    .forEach(
      (tbody) => (tbody.style.height = `${innerContainer.clientHeight - 94}px`)
    );
}

window.addEventListener("resize", () => resizeWindow());
resizeWindow();

formsSpan.addEventListener("click", () => {
  hideForm();
});
function showForm() {
  clearTimeout(formClearTimeout);
  formsSpan.classList.add("active");
  document.querySelector(".forms").style.display = "block";
  if (section === "employee") {
    setTimeout(() => form_emp.classList.toggle("hidden"), 0);
    setTimeout(() => {
      form_emp.querySelector('input[name="employee"]').focus();
    }, 500);
  } else if (section === "task") {
    setTimeout(() => form_task.classList.toggle("hidden"), 0);
    setTimeout(() => {
      form_task.querySelector('input[name="dress_name"]').focus();
    }, 500);
  } else if (section === "worker") {
    setTimeout(() => form_worker.classList.toggle("hidden"), 0);
    setTimeout(() => {
      form_worker.querySelector('input[name="worker"]').focus();
    }, 500);
  } else if (section === "payments") {
    setTimeout(() => form_payment.classList.toggle("hidden"), 0);
    setTimeout(() => {
      form_payment.querySelector('input[name="recieved"]').focus();
    }, 500);
  }
}
let formClearTimeout;
function hideForm() {
  edit = false;
  form_emp.classList.add("hidden");
  form_task.classList.add("hidden");
  form_worker.classList.add("hidden");
  form_payment.classList.add("hidden");
  formsSpan.classList.remove("active");
  formClearTimeout = setTimeout(() => {
    form_emp.reset();
    form_worker.reset();
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
  form_worker.querySelector('input[type="date"]').value = dateFormatted;
  form_payment.querySelector('input[type="date"].start').value = dateFormatted;
  form_payment.querySelector('input[type="date"].end').value = dateFormatted;
  return dateFormatted;
}
defaultDateValue();
form_payment
  .querySelector('input[type="date"].start')
  .addEventListener("change", (e) => {
    form_payment.querySelector(
      'input[type="date"].end'
    ).value = form_payment.querySelector('input[type="date"].start').value;
  });

const loginForm = document.querySelector("#loginForm"),
  username = loginForm.querySelector('input[name="username"]'),
  password = loginForm.querySelector('input[name="password"]');

window.onpopstate = function (e) {
  e.preventDefault();
  section !== "employee" && showPrimaryList();
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
  login_user.value = "";
  login_pass.value = "";
  netlifyIdentity.close();
  getFromCloud(netlifyIdentity.currentUser());
  getFromCloud_worker(netlifyIdentity.currentUser());
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
login_user.addEventListener("keyup", () =>
  login_user.classList.remove("wrongInput")
);
login_pass.addEventListener("keyup", () =>
  login_pass.classList.remove("wrongInput")
);
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
      document.querySelector(".popUp_wrapper").remove();
      document.querySelector(".forms").remove();
      workers_li.remove();
      lots_li.remove();
      dashboard_li.remove();
      backup_li.remove();
      backupOptions.remove();
      upload_li.remove();
      clear.remove();
      document.querySelector("h3.nameTag").addEventListener("click", (e) => {
        e.preventDefault();
        tableWrapper.style.left = "0";
        showPrimaryList();
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

workers_li.addEventListener("click", () => {
  if (
    tableWrapper.querySelector("#employee").getBoundingClientRect().width > 0
  ) {
    tableWrapper.querySelector("#employee").style.display = "none";
    tableWrapper.querySelector("#tasks").style.display = "none";
    tableWrapper.querySelector("#workers").style.display = "grid";
    tableWrapper.querySelector("#workers_payments").style.display = "grid";
    updateWorkerList();
    section = "worker";
  } else {
    tableWrapper.querySelector("#employee").style.display = "grid";
    tableWrapper.querySelector("#tasks").style.display = "grid";
    tableWrapper.querySelector("#workers").style.display = "none";
    tableWrapper.querySelector("#workers_payments").style.display = "none";
    section = "employee";
  }
  toggleSidebar();
  resizeWindow();
});

function updateTestData() {
  fetch("https://api.jsonbin.io/v3/b/5ecff70d79382f568bcea8c6/1", {
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key":
        "$2b$10$aEycq511HDsvlIxZW5Q44upAnU0Fx4Lgq3wlZkA8gl/zOi9rZKOj2",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      employees = data.record;
      localStorage.setItem("employees", JSON.stringify(employees));
      const emp = JSON.parse(localStorage.getItem("employees"));
      const corrected = {};
      employees = corrected;
      Object.entries(emp).forEach((employee) => {
        corrected[employee[0]] = {};
        Object.entries(emp[employee[0]]).forEach((day, i) => {
          corrected[employee[0]][`${day[0]}:2019-20`] =
            emp[employee[0]][day[0]];
        });
      });
      localStorage.setItem("employees", JSON.stringify(employees));
    });
}
