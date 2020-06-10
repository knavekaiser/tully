"use strict";
let employees = {};
let workers = {};
const tableWrapper = document.querySelector(".table_wrapper"),
  nameTag = document.querySelector(".nameTag"),
  empList = document.querySelector("#employee .tbody tbody"),
  taskList = document.querySelector("#tasks .tbody tbody"),
  workerList = document.querySelector("#workers .tbody tbody"),
  paymentList = document.querySelector("#workers_payments .tbody tbody"),
  form_login = document.querySelector("#loginForm"),
  form_emp = document.querySelector("#form_employee"),
  form_task = document.querySelector("#form_task"),
  form_worker = document.querySelector("#form_worker"),
  form_payment = document.querySelector("#form_payment"),
  showPass = document.querySelector(".passDiv ion-icon"),
  itemsToAdd = form_task.querySelector(".itemsToAdd"),
  formsSpan = document.querySelector(".forms span"),
  btnSidebar = document.querySelector(".btn_sidebar"),
  workers_li = document.querySelector(".workers_li"),
  fiscal_li = document.querySelector(".fiscal_li"),
  fiscalYears = document.querySelector(".fiscalYear"),
  lots_li = document.querySelector(".lots_li"),
  dashboard_li = document.querySelector(".dashboard_li"),
  backup = document.querySelector(".backup_li"),
  backupOptions = document.querySelector(".backup_options"),
  upload_li = document.querySelector(".upload_li"),
  fileInput = document.querySelector('input[type="file"]'),
  clearAll = document.querySelector(".clear"),
  logout = document.querySelector(".logout"),
  cls_dashboard = document.querySelector(".cls_dashboard"),
  dashboard = document.querySelector(".dashboard"),
  weekProduction = document.querySelector(".thisWeek .production"),
  weekPaid = document.querySelector(".thisWeek .paid"),
  weekLot = document.querySelector(".thisWeek .lot"),
  yearProduction = document.querySelector(".thisYear .production"),
  yearPaid = document.querySelector(".thisYear .paid"),
  yearValue = document.querySelector(".thisYear .value"),
  popUp = document.querySelector(".popUp"),
  delete_prompt = document.querySelector(".delete_prompt");
let section = "employee",
  person,
  fiscalYear = {
    from: "-",
    to: "-",
  },
  edit = false;

function chageNameTag() {
  nameTag.textContent = person.toUpperCase();
  nameTag.parentElement.style.transform = `translateX(-${
    window.innerWidth >= 500 ? 50 : 100
  }%) translateY(-75%)`;
  document.querySelector("header a div h1").classList.add("disabled");
  nameTag.classList.remove("disabled");
}
btnSidebar.addEventListener("click", () => {
  if (netlifyIdentity.currentUser() !== null) {
    section === "employee" || section === "worker"
      ? toggleSidebar()
      : showEmpList();
    if (btnSidebar.children[0].classList.contains("unsaved")) {
      section === "employee" ||
        (section === "task" && updateCloud(netlifyIdentity.currentUser()));
      section === "worker" ||
        (section === "payments" &&
          updateCloud_worker(netlifyIdentity.currentUser()));
    }
  }
});
function showEmpList() {
  window.history.pushState("index", "the title", `/`);
  nameTag.parentElement.style.transform = `translateX(-${
    window.innerWidth >= 500 ? 50 : 100
  }%) translateY(-25%)`;
  nameTag.classList.add("disabled");
  document.querySelector("header a div h1").classList.remove("disabled");
  section === "task" && ((section = "employee"), updateEmpList());
  section === "payments" && ((section = "worker"), updateWorkerList());
  tableWrapper.style.left = "0";
  btnSidebar.classList.remove("back");
  person = "";
  form_task.querySelector('input[name="recieved"]').removeAttribute("hidden");
  form_task
    .querySelector('input[name="recieved"]')
    .setAttribute("required", true);
  form_task.classList.remove("lots");
  setTimeout(() => {
    document.querySelector("#tasks").classList.remove("lots");
  }, 450);
}
document.addEventListener("keyup", (e) => {
  if (e.keyCode === 8) {
    if (formsSpan.getBoundingClientRect().height > 0) {
    } else {
      if (dashboard.classList.contains("active")) {
        cls_dashboard.click();
      } else {
        btnSidebar.click();
      }
    }
  }
});
form_emp.addEventListener("submit", (e) => {
  e.preventDefault();
  !(form_emp.querySelector('input[name="employee"]').value in employees)
    ? (addEmp(), updateEmpList(), hideForm())
    : alert("Add a diffrent name!");
  btnSidebar.children[0].classList.add("unsaved");
});
form_task.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask();
  updateTaskList();
  hideForm();
  edit = false;
  btnSidebar.children[0].classList.add("unsaved");
});
form_worker.addEventListener("submit", (e) => {
  e.preventDefault();
  addWorker();
  updateWorkerList();
  hideForm();
  edit = false;
  btnSidebar.children[0].classList.add("unsaved");
});
form_payment.addEventListener("submit", (e) => {
  e.preventDefault();
  addPayment();
  updatePaymentList();
  hideForm();
  edit = false;
  btnSidebar.children[0].classList.add("unsaved");
});
lots_li.addEventListener("click", (e) => {
  toggleSidebar();
  person = "lots";
  showEmpTasks(e);
  form_task.classList.add("lots");
  form_task.querySelector('input[name="recieved"]').removeAttribute("required");
  form_task
    .querySelector('input[name="recieved"]')
    .setAttribute("hidden", true);
  document.querySelector("#tasks").classList.add("lots");
});

form_task
  .querySelector('input[name="dress_name"]')
  .addEventListener("keyup", (e) => {
    if (form_task.querySelector('input[name="dress_name"]').value === "-") {
      form_task
        .querySelector('input[name="qnt"]')
        .setAttribute("disabled", true);
      form_task
        .querySelector('select[name="group"]')
        .setAttribute("disabled", true);
    } else {
      form_task.querySelector('input[name="qnt"]').removeAttribute("disabled");
      form_task
        .querySelector('select[name="group"]')
        .removeAttribute("disabled");
    }
  });

function addWorker() {
  let personToAdd = form_worker.querySelector("input[type='text']").value;
  workers[personToAdd] = {
    join: form_worker.querySelector("input[type='date']").value,
    salary: form_worker.querySelector("input[type='number']").value,
    paid: [],
    abs: [],
  };
  updateLS();
  form_worker.querySelector("input[type='text']").value = "";
  form_worker.querySelector("input[type='number']").value = "";
}
function addEmp() {
  employees[form_emp.querySelector("input").value] = {};
  updateLS();
  form_emp.reset();
}
function updateEmpList() {
  empList.innerHTML = "";
  Object.entries(employees).forEach((employee, i) => {
    if (employee[0] !== "lots") {
      const tr = document.createElement("tr"),
        days = Object.entries(employee[1]);
      tr.classList.add("infoRow");
      createTd(employee[0], tr, "name");
      createTd(getTotal(days, "production").toLocaleString("en-IN"), tr);
      createTd(getTotal(days, "paid").toLocaleString("en-IN"), tr);
      createTd(
        (getTotal(days, "production") - getTotal(days, "paid")).toLocaleString(
          "en-IN"
        ),
        tr
      );
      empList.appendChild(tr);
    }
  });
  displayAddBtn(empList);
}
function updateWorkerList() {
  workerList.innerHTML = "";
  Object.entries(workers).forEach((worker, i) => {
    const person = workers[worker[0]];
    const tr = document.createElement("tr");
    tr.classList.add("infoRow");
    createTd(
      worker[0],
      tr,
      "name",
      "span",
      `${person.join.split("-")[2]}-${
        person.join.split("-")[1]
      }-${person.join.split("-")[0].slice(-2)}, ${person.salary}`
    );
    createTd(
      calculateSalary(
        person.salary,
        person.join,
        defaultDateValue(),
        person.abs
      ).toLocaleString("en-IN"),
      tr
    );
    createTd(getWorkerTotal(person).toLocaleString("en-IN"), tr);
    createTd(
      (
        calculateSalary(
          person.salary,
          person.join,
          defaultDateValue(),
          person.abs
        ) - getWorkerTotal(person)
      ).toLocaleString("en-IN"),
      tr
    );
    workerList.appendChild(tr);
  });
  displayAddBtn(workerList);
}
function addAddmore(dressName = "", qnt = "", group = "", className = "") {
  const itemToAdd = document.createElement("div");
  itemToAdd.classList.add("itemToAdd");
  className && itemToAdd.classList.add(className);

  itemToAdd.innerHTML = `
<input
type="text"
name="dress_name"
maxlength="25"
placeholder="Add more item"
value="${dressName}"/>
<input
type="number"
name="qnt"
placeholder="Pcs."
min="0"
value="${qnt}" disabled/>
<select class="groups" name="group" placeholder="group" disabled>
<option value="" hidden >Group</option>
<option value="S" ${group === "S" && "SELECTED"}>Small</option>
<option value="L" ${group === "L" && "SELECTED"}>Large</option>
<option value="F" ${group === "F" && "SELECTED"}>Fancy</option>
<option value="1" ${group === "1" && "SELECTED"}>One Pc.</option>
</select>
`;
  itemsToAdd.appendChild(itemToAdd);
  itemsToAdd
    .querySelector(".itemToAdd:last-child")
    .querySelector("input[name='dress_name']")
    .addEventListener("focus", (e) => {
      className && e.target.parentElement.classList.remove(className);
    });
  itemtoAddEventListener();
}
function itemtoAddEventListener() {
  let items = itemsToAdd
    .querySelector(".itemToAdd:last-child")
    .querySelector("input[name='dress_name']");
  items.addEventListener("keyup", (e) => {
    const [qntInput, groupInput] = [
      e.target.parentElement.children[1],
      e.target.parentElement.children[2],
    ];
    if (e.target.value === "-") {
      qntInput.removeAttribute("required");
      groupInput.removeAttribute("required");
      qntInput.setAttribute("disabled", true);
      groupInput.setAttribute("disabled", true);
      [...e.target.parentElement.parentElement.children].length > 1 &&
        (e.target.value = "");
    } else {
      if (e.target.value.length > 0) {
        e.target.setAttribute("required", "true");
        qntInput.removeAttribute("disabled");
        groupInput.removeAttribute("disabled");
        qntInput.setAttribute("required", "true");
        groupInput.setAttribute("required", "true");
        !items.parentElement.nextElementSibling &&
          addAddmore("", "", "", "semi");
      } else {
        document.querySelector(".semi") &&
          document.querySelector(".semi").remove();
        if ([...e.target.parentElement.parentElement.children].length > 1) {
          e.target.removeAttribute("required");
          qntInput.removeAttribute("required");
          groupInput.removeAttribute("required");
          qntInput.setAttribute("disabled", true);
          groupInput.setAttribute("disabled", true);
        }
      }
    }
  });
  items.addEventListener("blur", (e) => {
    if ([...e.target.parentElement.parentElement.children].length > 1) {
      e.target.value.length === 0 &&
        e.target.parentElement.classList.add("semi");
    }
  });
}
itemtoAddEventListener();

function addTask() {
  let date = form_task.querySelector('input[name="date"]').value;
  !(date in employees[person]) &&
    (employees[person][date] = { tasks: [], paid: 0 });
  if (
    itemsToAdd.children[0].querySelector('input[name="dress_name"]').value ===
    "-"
  ) {
    employees[person][date].tasks.push({ dress: "-", qnt: "-", group: "-" });
  } else {
    let itemToAdd = [...itemsToAdd.children];
    employees[person][date].tasks = [];
    itemToAdd.forEach((item, i) => {
      if (item.querySelector('input[name="dress_name"]').value.length > 0) {
        employees[person][date].tasks.push({
          dress: item.querySelector('input[name="dress_name"]').value,
          qnt: +item.querySelector('input[name="qnt"]').value,
          group: item.querySelector('select[name="group"]').value,
        });
      }
    });
  }
  if (person !== "lots") {
    employees[person][date].paid = +form_task.querySelector(
      'input[name="recieved"]'
    ).value;
  } else {
    delete employees[person][date].paid;
  }
  updateLS();
  for (var i = [...itemsToAdd.children].length; i > 1; i--) {
    [...itemsToAdd.children][i - 1].remove();
  }
  itemsToAdd.querySelector('input[name="dress_name"]').value = "";
  itemsToAdd.querySelector('input[name="qnt"]').value = "";
  itemsToAdd.querySelector('select[name="group"]').value = "";
  form_task.querySelector('input[name="recieved"]').value = "";
}
function updateTaskList() {
  taskList.innerHTML = "";
  const date = Object.keys(employees[person]),
    tasks = [];
  date.sort((a, b) => (new Date(a) < new Date(b) ? -1 : 1));
  date.forEach((day) => {
    employees[person][day] && tasks.push(employees[person][day]);
  });
  date.forEach((item, i) => {
    if (new Date(fiscalYear.from) == "Invalid Date") {
      createTasks(date, tasks, item, i);
    } else {
      if (
        new Date(item) >= new Date(fiscalYear.from) &&
        new Date(item) <= new Date(fiscalYear.to)
      ) {
        createTasks(date, tasks, item, i);
      }
    }
  });
  displayAddBtn(taskList);
}
function addPayment() {
  let start = form_payment.querySelector('input[type="date"].start'),
    end = form_payment.querySelector('input[type="date"].end'),
    payment = form_payment.querySelector('input[type="number"]');
  if (payment.value > 0) {
    workers[person].paid.push({ date: start.value, paid: payment.value });
  } else {
    for (
      var i = new Date(start.value);
      i <= new Date(end.value);
      i.setDate(i.getDate() + 1)
    ) {
      !workers[person].abs.includes(
        `${i.getFullYear()}-${
          i.getMonth() < 10 ? "0" + (i.getMonth() + 1) : i.getMonth() + 1
        }-${i.getDate() < 10 ? "0" + i.getDate() : i.getDate()}`
      ) &&
        workers[person].abs.push(
          `${i.getFullYear()}-${
            i.getMonth() < 10 ? "0" + (i.getMonth() + 1) : i.getMonth() + 1
          }-${i.getDate() < 10 ? "0" + i.getDate() : i.getDate()}`
        );
    }
  }
  updateLS();
  end.value = "";
  payment.value = "";
}
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function updatePaymentList() {
  paymentList.innerHTML = "";
  workers[person].paid.forEach((payment) => {
    const tr = document.createElement("tr");
    tr.classList.add("infoRow");
    createTd(
      `${payment.date.split("-")[2]}-${
        payment.date.split("-")[1]
      }-${payment.date.split("-")[0].slice(-2)}`,
      tr,
      `${payment.date} date`
    );
    createTd(payment.paid, tr, "payment");
    paymentList.appendChild(tr);
  });
  if (workers[person].abs.length > 0) {
    const tr = document.createElement("tr");
    tr.classList.add("abs");
    tr.classList.add("infoRow");
    createTd(
      `Absent ${
        workers[person].abs.length > 1
          ? "(" + workers[person].abs.length + " days)"
          : ""
      }`,
      tr,
      "absences",
      workers[person].abs.length
    );
    workers[person].abs.forEach((day) => {
      createTd(
        `${days[new Date(day).getDay()]}, ${day.split("-")[2]}-${
          day.split("-")[1]
        }-${day.split("-")[0]}`,
        tr,
        "abs_date"
      );
    });
    paymentList.appendChild(tr);
  }
  displayAddBtn(paymentList);
}

function displayAddBtn(element) {
  netlifyIdentity.currentUser() !== null &&
    (element.innerHTML += `
  <tr id="btn_tr">
    <td class="btn_row add">
      <button id="td_btn" type="submit" onClick="showForm()" name="button">
      </button>
      ${
        section === "employee"
          ? `<div class="label"><ion-icon name="person-add-outline"></ion-icon><p>Add more people...</p></div>`
          : `<div class="label"> <ion-icon name="add-outline"></ion-icon> <p>${
              person !== "lots" ? "Add more tasks..." : "Add more lots..."
            }</p></div>`
      }
    </td>
  </tr>
  `);
}
function createTasks(date, tasks, item, i) {
  const tr = document.createElement("tr");
  tr.classList.add("infoRow");
  createTd(
    `${date[i].split("-")[2]}-${date[i].split("-")[1]}-${date[i]
      .split("-")[0]
      .slice(-2)}`,
    tr,
    `${date[i]} date`,
    tasks[i].tasks.length
  );
  tasks[i].tasks.forEach((task, j) => {
    createTd(task.dress, tr, "dressName");
    createTd(task.qnt.toLocaleString("en-IN"), tr, "qnt");
    createTd(task.group, tr, "grp");
    person !== "lots" &&
      createTd(
        (task.qnt > 0 ? task.qnt * priceCheck(task.group) : 0).toLocaleString(
          "en-IN"
        ),
        tr,
        "total"
      );
  });
  if (person !== "lots") {
    createTd(
      tasks[i].paid.toLocaleString("en-IN"),
      tr,
      `paid`,
      tasks[i].tasks.length
    );
  } else {
    let pcsInLot = 0;
    tasks[0].tasks.forEach((item, i) => item.qnt > 0 && (pcsInLot += item.qnt));
    createTd(
      pcsInLot.toLocaleString("en-IN"),
      tr,
      `total`,
      tasks[i].tasks.length
    );
  }
  taskList.appendChild(tr);
}
function createTd(textContent, parent, tdClass, span, data) {
  const td = document.createElement("td");
  !!tdClass && tdClass.split(" ").forEach((cls) => td.classList.add(cls));
  !!span && (td.style.gridRow = `1 / span ${span}`);
  !!data && td.setAttribute("data-content", data);
  td.textContent = textContent;
  parent.appendChild(td);
}
function priceCheck(group) {
  switch (group) {
    case "1":
      return 20;
      break;
    case "S":
      return 24;
      break;
    case "L":
      return 36;
      break;
    case "F":
      return 43;
      break;
    default:
  }
}
function getDaysInBetween(from, to) {
  return Math.abs((new Date(from) - new Date(to)) / 1000 / 60 / 60 / 24);
}
function getTotal(days, what) {
  let total = 0;
  if (new Date(fiscalYear.from) == "Invalid Date") {
    days.forEach((day) => {
      if (what === "production") {
        day[1].tasks.forEach((task) => {
          total += task.qnt > 0 ? task.qnt * priceCheck(task.group) : 0;
        });
      } else {
        total += day[1].paid;
      }
    });
  } else {
    days.forEach((day) => {
      if (
        new Date(day[0]) >= new Date(fiscalYear.from) &&
        new Date(day[0]) <= new Date(fiscalYear.to)
      ) {
        if (what === "production") {
          day[1].tasks.forEach((task) => {
            total += task.qnt > 0 ? task.qnt * priceCheck(task.group) : 0;
          });
        } else {
          total += day[1].paid;
        }
      }
    });
  }
  return total;
}
function getWorkerTotal(worker) {
  let total = 0;
  worker.paid.forEach((pay) => (total += +pay.paid));
  return total;
}
function calculateSalary(salary, start, end, abs) {
  let total = 0;
  const startDate = new Date(
      +start.split("-")[0],
      +start.split("-")[1] - 1,
      +start.split("-")[2]
    ),
    endDate = new Date(
      +end.split("-")[0],
      +end.split("-")[1] - 1,
      +end.split("-")[2]
    );
  for (var d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    !abs.includes(
      `${d.getFullYear()}-${
        d.getMonth() < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1
      }-${d.getDate() < 10 ? "0" + d.getDate() : d.getDate()}`
    ) &&
      (total += salary / new Date(d.getYear(), d.getMonth() + 1, 0).getDate());
  }
  return Math.round(total);
}

function updateLS() {
  localStorage.setItem("employees", JSON.stringify(employees));
  localStorage.setItem("workers", JSON.stringify(workers));
}

let clearTaskTimer,
  startTime,
  endTime,
  isDown,
  duration,
  popUpTimer,
  target,
  line;
tableWrapper.addEventListener("mousedown", (e) => {
  isDown = true;
  duration = 0;
  e.stopPropagation();
  e.preventDefault();
  startTime = new Date().getTime();
  if (
    e.target.classList.contains("infoRow") ||
    e.target.parentElement.classList.contains("infoRow")
  ) {
    popUpTimer = setTimeout(() => showPopup(e), 600);
    line = e.target;
    target =
      line.tagName === "TD" ? line.parentElement.children[0] : line.children[0];
  }
});
tableWrapper.addEventListener("mouseup", (e) => {
  isDown = false;
  e.preventDefault();
  if (e.which === 3) {
    if (
      e.target.classList.contains("infoRow") ||
      e.target.parentElement.classList.contains("infoRow")
    ) {
      clearTimeout(popUpTimer);
      showPopup(e);
      return;
    }
  }
  duration += new Date().getTime() - startTime;
  clearTimeout(popUpTimer);
  if (duration <= 350) {
    section === "employee" && e.target.tagName !== "BUTTON" && showEmpTasks(e);
    section === "worker" && e.target.tagName !== "BUTTON" && showPayments(e);
  }
});
tableWrapper.addEventListener("mousemove", (e) => {
  if (isDown) {
    duration = 1000;
    clearTimeout(popUpTimer);
  }
});
tableWrapper.addEventListener("touchstart", (e) => {
  duration = 0;
  e.target.hasAttribute("id", "td_btn") &&
    e.target.parentElement.parentElement.classList.add("active");
  e.target.tagName === "BUTTON" && e.preventDefault();
  startTime = new Date().getTime();
  if (
    e.target.classList.contains("infoRow") ||
    e.target.parentElement.classList.contains("infoRow")
  ) {
    popUpTimer = setTimeout(() => showPopup(e), 600);
    line = e.target;
    target =
      line.tagName === "TD" ? line.parentElement.children[0] : line.children[0];
    e.target.parentElement.classList.add("active");
  }
});
tableWrapper.addEventListener("touchmove", (e) => {
  duration = 1000;
  clearTimeout(popUpTimer);
});
tableWrapper.addEventListener("touchend", (e) => {
  e.target.hasAttribute("id", "td_btn") &&
    (showForm(),
    e.target.parentElement.parentElement.classList.remove("active"));
  e.target.parentElement.classList.remove("active");
  e.target.tagName === "BUTTON" && e.preventDefault();
  duration += new Date().getTime() - startTime;
  clearTimeout(popUpTimer);
  if (duration <= 350) {
    section === "employee" && e.target.tagName !== "BUTTON" && showEmpTasks(e);
    section === "worker" && e.target.tagName !== "BUTTON" && showPayments(e);
  }
});

function showPayments(e) {
  if (
    e.target.classList.contains("name") ||
    e.target.parentElement.children[0].classList.contains("name")
  ) {
    person = e.target.classList.contains("name")
      ? e.target.textContent
      : e.target.parentElement.children[0].textContent;
    section = "payments";
    tableWrapper.style.left = "-100%";
    window.history.pushState("index", "the title", `/${person}`);
    updatePaymentList();
    btnSidebar.classList.add("back");
    chageNameTag();
  }
}
function showEmpTasks(e) {
  if (person !== "lots") {
    if (
      e.target.classList.contains("name") ||
      e.target.parentElement.children[0].classList.contains("name")
    ) {
      person = e.target.classList.contains("name")
        ? e.target.textContent
        : e.target.parentElement.children[0].textContent;
      section = "task";
      tableWrapper.style.left = "-100%";
      window.history.pushState("index", "the title", `/${person}`);
      updateTaskList();
      btnSidebar.classList.add("back");
      chageNameTag();
    }
  } else {
    section = "task";
    tableWrapper.style.left = "-100%";
    updateTaskList();
    chageNameTag();
    btnSidebar.classList.add("back");
    window.history.pushState("index", "the title", `/${person}`);
  }
}
function viewTask(user) {
  person = user;
  section = "task";
  tableWrapper.style.left = "-100%";
  updateTaskList();
  btnSidebar.classList.add("back");
  chageNameTag();
}
function showPopup(e) {
  section === "employee" ||
  section === "worker" ||
  (section === "payments" && target.parentElement.classList.contains("abs"))
    ? (popUp.children[0].children[0].style.display = "none")
    : popUp.children[0].children[0].removeAttribute("style");
  popUp.parentElement.classList.add("active");
  popUp.classList.remove("hide");
  if (e.type === "touchstart") {
    popUp.style.left = `${Math.max(
      Math.min(e.touches[0].clientX - 38.151, window.innerWidth - 90),
      15
    )}px`;
    popUp.style.top = `${
      e.touches[0].clientY -
      (popUp.children[0].children[0].hasAttribute("style") ? 55 : 90)
    }px`;
    popUp.style.transformOrigin = `50% 100%`;
  } else {
    if (e.x + 77.03 <= window.innerWidth) {
      popUp.style.left = `${e.x}px`;
      popUp.style.transformOrigin = `0 0`;
    } else {
      popUp.style.left = `${e.x - 77.03}px`;
      popUp.style.transformOrigin = `100% 100%`;
    }
    if (e.y + getPopupY() <= window.innerHeight) {
      popUp.style.top = `${e.y}px`;
      popUp.style.transformOrigin = `${
        e.x + 77.03 <= window.innerWidth ? 0 : 100
      }% 0`;
    } else {
      popUp.style.top = `${e.y - getPopupY()}px`;
      popUp.style.transformOrigin = `${
        e.x + 77.03 <= window.innerWidth ? 0 : 100
      }% 100%`;
    }
  }
  popUp.style.display = "block";
}
function getPopupY() {
  return popUp.children[0].children[0].hasAttribute("style") ? 35 : 70;
}

function hidePopup(e) {
  popUp.classList.add("hide");
  popUp.parentElement.classList.remove("active");
  setTimeout(() => (popUp.style.display = "none"), 300);
}
popUp.addEventListener("mouseup", (e) => {
  e.target.classList.contains("edit") ? popUp_edit() : popUp_delete();
  hidePopup();
});
popUp.parentElement.addEventListener("click", (e) => {
  e.stopPropagation();
  hidePopup();
});

function popUp_edit() {
  edit = true;
  showForm();
  if (section === "task") {
    let itemToEdit = employees[person][target.className.split(" ")[0]],
      date = target.className.split(" ")[0];
    itemsToAdd.innerHTML = "";
    form_task.querySelector('input[name="date"]').value = date;
    itemToEdit.tasks.forEach((item) => {
      addAddmore(item.dress, item.qnt, item.group);
    });
    person !== "lots" &&
      (form_task.querySelector('input[name="recieved"]').value =
        itemToEdit.paid);
  } else {
    if (line.classList.contains("date") || line.classList.contains("payment")) {
      form_payment.querySelector('input[type="number"]').value =
        target.nextElementSibling.textContent;
      form_payment.querySelector(
        'input[type="date"]'
      ).value = target.className.split(" ")[0];
    }
  }
}
function popUp_delete() {
  if (section === "employee") {
    delete_prompt.querySelector(
      "p"
    ).textContent = `Are you sure you want to delete ${target.textContent}?`;
    delete_prompt.classList.add("active");
  } else if (section === "task") {
    if (
      employees[person][target.className.split(" ")[0]].tasks.length === 1 ||
      line.classList.contains("infoRow") ||
      line.classList.contains("date") ||
      line.classList.contains("paid")
    ) {
      delete employees[person][target.className.split(" ")[0]];
    } else {
      employees[person][target.className.split(" ")[0]].tasks.splice(
        getIndex(target, line),
        1
      );
    }
    updateTaskList();
  } else if (section === "worker") {
    delete_prompt.querySelector(
      "p"
    ).textContent = `Are you sure you want to delete ${target.textContent}?`;
    delete_prompt.classList.add("active");
  } else if (section === "payments") {
    if (line.classList.contains("date") || line.classList.contains("payment")) {
      if (!line.parentElement.classList.contains("abs")) {
        workers[person].paid.forEach((pay, i) => {
          pay.date === target.className.split(" ")[0] &&
            workers[person].paid.splice(i, 1);
        });
      }
    } else if (
      line.classList.contains("absences") ||
      line.classList.contains("abs_date")
    ) {
      if (line.classList.contains("absences")) {
        workers[person].abs = [];
      } else if (line.classList.contains("abs_date")) {
        workers[person].abs.forEach((day, i) => {
          if (
            day ===
            `${line.textContent.split(" ")[1].split("-")[2]}-${
              line.textContent.split(" ")[1].split("-")[1]
            }-${line.textContent.split(" ")[1].split("-")[0]}`
          ) {
            workers[person].abs.splice(i, 1);
          }
        });
      }
    }
    updatePaymentList();
  }
  btnSidebar.children[0].classList.add("unsaved");
  updateLS();
}
delete_prompt.addEventListener("click", (e) => {
  if (section === "employee") {
    if (e.target.textContent === "YES") {
      btnSidebar.children[0].classList.add("unsaved");
      delete employees[target.textContent];
      updateEmpList();
      updateLS();
    }
  } else if (section === "worker") {
    if (e.target.textContent === "YES") {
      btnSidebar.children[0].classList.add("unsaved");
      delete workers[target.textContent];
      updateWorkerList();
      updateLS();
    }
  }
  delete_prompt.classList.remove("active");
});

function getIndex(target, line) {
  let lists = [...target.parentElement.children];
  lists.pop();
  lists.shift();
  if (lists.length % 4 === 0) {
    let index = Math.ceil((lists.indexOf(line) + 1) / 4) - 1;
    return index;
  }
}
let clearAllTimer;
clearAll.addEventListener("mousedown", (e) => {
  e.preventDefault();
  clearAllTimer = setTimeout(() => {
    localStorage.clear();
    employees = {};
    workers = {};
    section === "worker" && workers_li.click();
    updateEmpList();
    updateCloud(netlifyIdentity.currentUser());
    updateCloud_worker(netlifyIdentity.currentUser());
    clearAll.querySelector("span").classList.remove("active");
  }, 2000);
  clearAll.querySelector("span").classList.add("active");
});
clearAll.addEventListener("mouseup", (e) => {
  clearTimeout(clearAllTimer);
  clearAll.querySelector("span").classList.remove("active");
});
clearAll.addEventListener("touchstart", (e) => {
  e.preventDefault();
  clearAllTimer = setTimeout(() => {
    localStorage.clear();
    employees = {};
    updateEmpList();
    clearAll.querySelector("span").classList.remove("active");
  }, 2000);
  clearAll.querySelector("span").classList.add("active");
});
clearAll.addEventListener("touchend", (e) => {
  clearTimeout(clearAllTimer);
  clearAll.querySelector("span").classList.remove("active");
});

upload_li.addEventListener("click", (e) => {
  fileInput.click();
});
fileInput.addEventListener("change", (e) => {
  let file = fileInput.files[0];
  if (file) {
    let fr = new FileReader();
    fr.onload = function () {
      let raw = fr.result;
      if (raw.search("let employees = {") >= 0) {
        netlifyIdentity.currentUser() !== null &&
          (employees = JSON.parse(raw.replace("let employees = ", "")));
        updateLS();
        toggleSidebar();
        updateEmpList();
      } else {
        alert("PLease Select a valid file.");
      }
    };
    fr.readAsText(file);
  }
});
backup.addEventListener("click", () => {
  backupOptions.classList.toggle("active");
});
backupOptions.addEventListener("click", (e) => {
  let prefix = "let employees = ";
  let raw =
    e.target.textContent === "App Backup"
      ? prefix.concat(JSON.stringify(employees))
      : JSON.stringify(employees);
  let blob = new Blob([raw], { type: "application/json" });
  let uri = URL.createObjectURL(blob);
  !e.target.classList.contains("active") && download(uri, e.target.textContent);
  backupOptions.classList.remove("active");
});
function download(url, type) {
  let a = document.createElement("a");
  a.href = url;
  a.download = `WORKPLACE-${
    type === "App Backup" ? "Backup" : "Raw"
  }-${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`;
  a.click();
}

let url = "/.netlify/functions/fetchData";

function updateCloud(userStatus) {
  fetch(url, {
    method: "PUT",
    headers: {
      warning: JSON.stringify(userStatus),
    },
    body: JSON.stringify(employees),
  }).then((res) => {
    res.status === 200 && btnSidebar.children[0].classList.remove("unsaved");
  });
}
function getFromCloud(userStatus) {
  const fetchData = async () =>
    await (
      await fetch(url, { headers: { warning: JSON.stringify(userStatus) } })
    ).json();
  fetchData().then((data) => {
    localStorage.setItem("employees", JSON.stringify(data.record));
    employees = JSON.parse(localStorage.getItem("employees"));
    updateEmpList();
  });
}

function updateCloud_worker(userStatus) {
  fetch("/.netlify/functions/fetchWorkerData", {
    method: "PUT",
    headers: {
      warning: JSON.stringify(userStatus),
    },
    body: JSON.stringify(workers),
  }).then((res) => {
    res.status === 200 && btnSidebar.children[0].classList.remove("unsaved");
  });
}
function getFromCloud_worker(userStatus) {
  const fetchData = async () =>
    await (
      await fetch("/.netlify/functions/fetchWorkerData", {
        headers: { warning: JSON.stringify(userStatus) },
      })
    ).json();
  fetchData().then((data) => {
    localStorage.setItem("workers", JSON.stringify(data.record));
    workers = JSON.parse(localStorage.getItem("workers"));
    updateEmpList();
  });
}

dashboard_li.addEventListener("click", (e) => {
  dashboard.classList.add("active");
  updateDashboard();
  setTimeout(() => {
    dashboard.style.transform = "scale(1)";
    dashboard.style.opacity = "1";
    dashboard.style.pointerEvents = "all";
  }, 50);
});
cls_dashboard.addEventListener("click", () => {
  dashboard.style.transform = "scale(.9)";
  dashboard.style.opacity = "0";
  dashboard.style.pointerEvents = "none";
  setTimeout(() => {
    dashboard.classList.remove("active");
  }, 300);
});
function updateDashboard() {
  const data = {},
    allPayments = [],
    groupS = {
      detail: [],
      total: 0,
    },
    groupL = {
      detail: [],
      total: 0,
    },
    groupF = {
      detail: [],
      total: 0,
    },
    group1 = {
      detail: [],
      total: 0,
    },
    dates = [],
    production = [],
    pcsInLot = [];
  // Crunches main data!
  for (const name in employees) {
    if (name !== "lots") {
      for (const day in employees[name]) {
        !([day] in data) && (data[day] = { tasks: [], paid: 0 });
        Object.keys(employees[name][day]).forEach((task, k) => {
          task === "paid"
            ? (data[day].paid += employees[name][day][task])
            : data[day].tasks.push(...employees[name][day][task]);
        });
      }
    }
  }
  //sorts dates
  Object.keys(data).forEach((days) => dates.push(days));
  dates.sort((a, b) => (new Date(a) < new Date(b) ? -1 : 1));

  // Puts data in diffrent groups
  Object.keys(data).forEach((days, i) => {
    if (new Date(fiscalYear.from) == "Invalid Date") {
      let arr = data[dates[i]].tasks;
      allPayments.push(data[dates[i]].paid);
      let dailyProd = 0;
      arr.forEach((task) => {
        if (task.qnt !== "-") {
          switch (task.group) {
            case "S":
              groupS.total += task.qnt;
              break;
            case "L":
              groupL.total += task.qnt;
              break;
            case "F":
              groupF.total += task.qnt;
              break;
            case "1":
              group1.total += task.qnt;
              break;
            default:
          }
        }
        dailyProd +=
          parseInt(task.qnt) > 0 ? task.qnt * priceCheck(task.group) : 0;
      });
      production.push(dailyProd);
    } else {
      if (
        new Date(days) >= new Date(fiscalYear.from) &&
        new Date(days) <= new Date(fiscalYear.to)
      ) {
        let arr = data[dates[i]].tasks;
        allPayments.push(data[dates[i]].paid);
        let dailyProd = 0;
        arr.forEach((task) => {
          if (task.qnt !== "-") {
            switch (task.group) {
              case "S":
                groupS.total += task.qnt;
                break;
              case "L":
                groupL.total += task.qnt;
                break;
              case "F":
                groupF.total += task.qnt;
                break;
              case "1":
                group1.total += task.qnt;
                break;
              default:
            }
          }
          dailyProd +=
            parseInt(task.qnt) > 0 ? task.qnt * priceCheck(task.group) : 0;
        });
        production.push(dailyProd);
      }
    }
  });

  let selectedDate = dates[dates.length - 1];
  for (const date in employees.lots) {
    if (date === selectedDate) {
      employees.lots[selectedDate].tasks.forEach(
        (item) => item.qnt > 0 && pcsInLot.push(item)
      );
    }
  }
  var ctx = document.getElementById("chart").getContext("2d");
  var myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [
        ...dates.map((item) => {
          if (new Date(fiscalYear.from) == "Invalid Date") {
            return item.split("-")[2] + "-" + item.split("-")[1];
          } else {
            if (
              new Date(item) >= new Date(fiscalYear.from) &&
              new Date(item) <= new Date(fiscalYear.to)
            ) {
              return item.split("-")[2] + "-" + item.split("-")[1];
            }
          }
        }),
      ],
      datasets: [
        {
          fill: false,
          label: "Production, 2019-2020",
          data: [...production],
          borderWidth: 3,
          borderColor: ["rgba(90, 165, 227, 1)"],
        },
        {
          fill: false,
          label: "Payments, 2019-2020",
          data: [...allPayments],
          borderWidth: 3,
          borderColor: ["rgba(255, 99, 132, 1)"],
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              callback: (value) => "৳ " + value.toLocaleString("en-IN"),
            },
          },
        ],
      },
    },
  });

  const thisWeek = { production: 0, paid: 0, deu: 0 };
  data[selectedDate].tasks.forEach((task, i) => {
    thisWeek.production += task.qnt !== "-" && task.qnt;
    thisWeek.paid = data[dates[dates.length - 1]].paid;
  });
  weekProduction.querySelector(
    "h3"
  ).textContent = thisWeek.production.toLocaleString("en-IN");
  weekPaid.querySelector("h3").textContent = thisWeek.paid.toLocaleString(
    "en-IN"
  );
  let totalInLot = 0;
  let totalLots = "";
  pcsInLot.forEach((lot) => {
    totalInLot += lot.qnt;
    totalLots += lot.group + "-";
    totalLots += lot.qnt + ",  ";
  });
  weekLot.querySelector("h3").textContent = totalInLot.toLocaleString();
  weekLot.querySelector("p").textContent = totalLots;

  yearProduction.querySelector("h3").textContent = (
    groupS.total +
    groupL.total +
    groupF.total +
    group1.total
  ).toLocaleString("en-IN");
  yearPaid.querySelector("h3").textContent = allPayments
    .reduce((a, c) => a + c, 0)
    .toLocaleString("en-IN");
  yearValue.querySelector("h3").textContent = (
    groupS.total * priceCheck("S") +
    groupL.total * priceCheck("L") +
    groupF.total * priceCheck("F") +
    group1.total * priceCheck("1") -
    allPayments.reduce((a, c) => a + c, 0)
  ).toLocaleString("en-IN");
}

fiscal_li.addEventListener("click", (e) => {
  fiscalYears.classList.toggle("active");
});
fiscalYears.addEventListener("click", (e) => {
  if (e.target.textContent === "All time") {
    fiscalYear.from = "-";
    fiscalYear.to = "-";
    fiscal_li.querySelector("p:last-child").textContent = "Fiscal Yr.";
  } else {
    if (e.target.textContent === "2019-2020") {
      fiscalYear.from = "2019-09-05";
      fiscalYear.to = "2020-05-31";
    } else if (e.target.textContent === "2020-2021") {
      fiscalYear.from = "2020-06-01";
      fiscalYear.to = "2021-05-19";
    }
    fiscal_li.querySelector("p:last-child").textContent =
      e.target.textContent.split("-")[0] +
      "-" +
      e.target.textContent.split("-")[1].slice(-2);
  }
  fiscalYears.classList.remove("active");
  updateEmpList();
});
