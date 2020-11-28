const innerContainer = $(".innerContainer"),
  sidebarSpan = $(".sidebar_span"),
  welcomeScreen = $(".welcomeScreen"),
  tableContainer = $(".table_container"),
  sidebar = $(".sidebar"),
  form_task_date = form_task.querySelector("input[name='date']"),
  form_task_recieved = form_task.querySelector("input[name='recieved']"),
  form_payment_for = form_payment.querySelector("input[name='for']"),
  form_payment_date = form_payment.querySelector("input[name='date']"),
  form_payment_wage = form_payment.querySelector("input[name='wage']"),
  form_payment_fabric = form_payment.querySelector("input[name='fabric']"),
  form_bill_date = form_bill.querySelector('input[name="date"]'),
  form_bill_ref = form_bill.querySelector('input[name="ref"]'),
  form_cost_lotNo = form_cost.querySelector('input[name="lotNo"]'),
  form_cost_dress = form_cost.querySelector('input[name="dress_name"]'),
  form_cost_date = form_cost.querySelector('input[type="date"]');

let sidebarOpen = false;

function toggleSidebar() {
  !sidebarOpen
    ? ((innerContainer.style.left = "0"),
      sidebarSpan.classList.add("active"),
      btnSidebar.classList.add("side_back"))
    : ((innerContainer.style.left = `${
        window.innerWidth <= 480 ? -9.7 : -9
      }rem`),
      sections.classList.remove("active"),
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

formsSpan.addEventListener("click", () => hideForm());
function showForm() {
  clearTimeout(formClearTimeout);
  formsSpan.classList.add("active");
  $(".forms").style.display = "block";
  if (section === "employees") {
    setTimeout(() => form_emp.classList.toggle("hidden"), 0);
    setTimeout(() => {
      form_emp.querySelector('input[name="employee"]').focus();
    }, 500);
  } else if (section === "task") {
    setTimeout(() => form_task.classList.toggle("hidden"), 0);
    setTimeout(() => {
      form_task.querySelector('input[name="dress_name"]').focus();
    }, 500);
  } else if (section === "workers") {
    setTimeout(() => form_worker.classList.toggle("hidden"), 0);
    setTimeout(() => {
      form_worker.querySelector('input[name="worker"]').focus();
    }, 500);
  } else if (section === "workerPayments") {
    setTimeout(() => form_worker_payment.classList.toggle("hidden"), 0);
    setTimeout(() => {
      form_worker_payment.querySelector('input[name="recieved"]').focus();
    }, 500);
  } else if (section === "production") {
    setTimeout(() => form_bill.classList.toggle("hidden"), 0);
    setTimeout(() => form_bill_ref.focus(), 500);
  } else if (section === "cost") {
    setTimeout(() => form_cost.classList.toggle("hidden"), 0);
    setTimeout(() => form_cost_dress.focus(), 500);
  } else if (section === "payments" || section === "wages") {
    setTimeout(() => form_payment.classList.toggle("hidden"), 0);
    setTimeout(
      () =>
        section === "payments"
          ? form_payment_fabric.focus()
          : form_payment_wage.focus(),
      500
    );
  }
  itemsToAdd.children.length <= 1 &&
    ((itemsToAdd.innerHTML = ""), addAddmore("", "", "", ""));
}
function showDateFilterForm() {
  clearTimeout(formClearTimeout);
  formsSpan.classList.add("active");
  $(".forms").style.display = "block";
  setTimeout(() => form_date_filter.classList.toggle("hidden"), 0);
  // setTimeout(() => {
  //   form_date_filter.querySelector('input[name="employee"]').focus();
  // }, 500);
}
let formClearTimeout;
function hideForm() {
  edit = false;
  form_emp.classList.add("hidden");
  form_task.classList.add("hidden");
  form_worker.classList.add("hidden");
  form_worker_payment.classList.add("hidden");
  form_bill.classList.add("hidden");
  form_cost.classList.add("hidden");
  form_payment.classList.add("hidden");
  form_date_filter.classList.add("hidden");
  formsSpan.classList.remove("active");
  formClearTimeout = setTimeout(() => {
    form_emp.reset();
    form_worker.reset();
    form_cost.reset();
    defaultDateValue();
    $(".forms").style.display = "none";
  }, 500);
}

window.oncontextmenu = () => false;
const about = $(".about p"),
  portrait = $(".portrait"),
  root = document.documentElement;
portrait.addEventListener("click", () => {
  portrait.classList.add("forward");
  setTimeout(() => portrait.classList.remove("forward"), 1000);
});

root.style.setProperty("--portrait-height", `${portrait.clientWidth * 1.71}px`);

about.addEventListener("click", () => portrait.classList.toggle("active"));

function defaultDateValue() {
  let date = new Date(),
    dateFormatted = `${date.getFullYear()}-${
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1
    }-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;
  form_task_date.value = dateFormatted;
  form_worker.querySelector('input[type="date"]').value = dateFormatted;
  form_worker_payment.querySelector(
    'input[type="date"].start'
  ).value = dateFormatted;
  form_worker_payment.querySelector(
    'input[type="date"].end'
  ).value = dateFormatted;
  form_bill_date.value = dateFormatted;
  form_payment_date.value = dateFormatted;
  form_cost_date.value = dateFormatted;
  return dateFormatted;
}
defaultDateValue();

form_worker_payment
  .querySelector('input[type="date"].start')
  .addEventListener("change", (e) => {
    form_worker_payment.querySelector(
      'input[type="date"].end'
    ).value = form_worker_payment.querySelector(
      'input[type="date"].start'
    ).value;
  });

const loginForm = $("#loginForm"),
  username = loginForm.querySelector('input[name="username"]'),
  password = loginForm.querySelector('input[name="password"]');

window.onpopstate = function (e) {
  e.preventDefault();
  section !== "employees" && showPrimaryList();
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
  getFromCloud("emp", netlifyIdentity.currentUser());
  getFromCloud("pro", netlifyIdentity.currentUser());
  getFromCloud("cos", netlifyIdentity.currentUser());
  getFromCloud("wor", netlifyIdentity.currentUser());
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
      $(".popUp_wrapper").remove();
      $(".forms").remove();
      $(".dashboard").remove();
      $(".delete_prompt").remove();
      $("#workers").remove();
      $("#workers_payments").remove();
      $("#production").remove();
      $("#production_detail").remove();
      $("#cost").remove();
      $("#cost_detail").remove();
      $("#payments").remove();
      $("#summery").remove();
      monthFilter.remove();
      $(".year_filter").remove();
      sections.remove();
      section_li.remove();
      lots_li.remove();
      dashboard_li.remove();
      backup.remove();
      backupOptions.remove();
      upload_li.remove();
      clearAll.remove();
      $("h3.nameTag").addEventListener("click", (e) => {
        e.preventDefault();
        tableWrapper.style.left = "0";
        showPrimaryList();
        section = "employees";
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
  $(".netlify-identity-login") &&
    ($(".netlify-identity-login").textContent = "Management");
});

sections.addEventListener("click", (e) => {
  let target = e.target.tagName === "P" ? e.target.parentElement : e.target;
  tableWrapper.querySelectorAll("section").forEach((section) => {
    section.style.display = "none";
  });
  restoreNameTag();
  $(".year_filter").style.display = "none";
  if (target.classList.contains("workers_li")) {
    tableWrapper.querySelector("#workers").style.display = "grid";
    tableWrapper.querySelector("#workers_payments").style.display = "grid";
    section = "workers";
    section_li.textContent = "Workers";
    updateWorkerList();
  } else if (target.classList.contains("contractors_li")) {
    tableWrapper.querySelector("#employee").style.display = "grid";
    tableWrapper.querySelector("#tasks").style.display = "grid";
    section = "employees";
    section_li.textContent = "Contractors";
    itemsToAdd = $("#form_task .itemsToAdd");
    updateEmpList();
  } else if (target.classList.contains("bill_li")) {
    tableWrapper.querySelector("#production").style.display = "grid";
    tableWrapper.querySelector("#production_detail").style.display = "grid";
    section = "production";
    section_li.textContent = "Bills";
    itemsToAdd = $("#form_bill .itemsToAdd");
    changeNameTag("Bills");
    updateProduction();
  } else if (target.classList.contains("cost_li")) {
    tableWrapper.querySelector("#cost").style.display = "grid";
    tableWrapper.querySelector("#cost_detail").style.display = "grid";
    section = "cost";
    section_li.textContent = "Cost";
    itemsToAdd = $("#form_cost .itemsToAdd");
    changeNameTag("Costs");
    updateCost();
  } else if (
    target.classList.contains("production_li") ||
    target.classList.contains("wages_li")
  ) {
    tableWrapper.querySelector("#payments").style.display = "grid";
    if (target.classList.contains("production_li")) {
      section = "payments";
      section_li.textContent = "Production";
      form_payment_for.style.display = "block";
      form_payment_for.setAttribute("required", true);
      form_payment_fabric.style.display = "block";
      form_payment_fabric.setAttribute("required", true);
      form_payment_wage.style.display = "none";
      form_payment_wage.removeAttribute("required");
      changeNameTag("Production");
    } else {
      section = "wages";
      form_payment_wage.style.display = "block";
      form_payment_wage.setAttribute("required", true);
      form_payment_fabric.style.display = "none";
      form_payment_fabric.removeAttribute("required");
      form_payment_for.style.display = "none";
      form_payment_for.removeAttribute("required");
      section_li.textContent = "Wages";
      changeNameTag("Wages");
    }
    updatePayment();
  } else if (target.classList.contains("summery_li")) {
    tableWrapper.querySelector("#summery").style.display = "grid";
    $(".year_filter").style.display = "block";
    changeNameTag("Summery");
    updateSummery();
  }
  sections.classList.remove("active");
  resizeWindow();
  toggleSidebar();
  itemtoAddEventListener();
});

document.querySelectorAll("form input[type='file']").forEach((element) => {
  const uploadImgBtn = element.nextElementSibling;
  uploadImgBtn.addEventListener("click", () => element.click());
  element.addEventListener("change", () =>
    handleImgUplaod(element, uploadImgBtn)
  );
});
function handleImgUplaod(uploadImg, uploadImgBtn) {
  if (uploadImg.files) {
    const formdata = new FormData();
    formdata.append("image", uploadImg.files[0]);
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: "Client-ID 057a33e6c517454",
      },
      body: formdata,
      redirect: "follow",
    };
    uploadImgBtn.classList.add("uploading");
    uploadImgBtn.setAttribute("disabled", true);
    form_bill
      .querySelector("button[type='submit']")
      .setAttribute("disabled", true);
    fetch("https://api.imgur.com/3/image", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        uploadImg.setAttribute("data-url", result.data.link);
        uploadImgBtn.classList.remove("uploading");
        uploadImgBtn.classList.add("uploaded");
        setTimeout(() => uploadImgBtn.classList.remove("uploaded"), 4000);
        uploadImgBtn.removeAttribute("disabled");
        form_bill
          .querySelector("button[type='submit']")
          .removeAttribute("disabled");
      })
      .catch((error) => {
        uploadImgBtn.classList.remove("uploading");
        uploadImgBtn.classList.add("uploadFailed");
        uploadImgBtn.removeAttribute("disabled");
        form_bill
          .querySelector("button[type='submit']")
          .removeAttribute("disabled");
      });
  }
}
