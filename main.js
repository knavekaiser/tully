"use strict";
let employees = {};
let workers = {};
let production = {};
const tableWrapper = document.querySelector(".table_wrapper"),
  nameTag = document.querySelector(".nameTag"),
  empList = document.querySelector("#employee .tbody tbody"),
  taskList = document.querySelector("#tasks .tbody tbody"),
  workerList = document.querySelector("#workers .tbody tbody"),
  workerPayment = document.querySelector("#workers_payments .tbody tbody"),
  payment_right = document.querySelector("#payments .right .tbody tbody"),
  payment_left = document.querySelector("#payments .left .tbody tbody"),
  productionList = document.querySelector("#production .tbody tbody"),
  productionDetail = document.querySelector("#production_detail .tbody tbody"),
  form_login = document.querySelector("#loginForm"),
  form_emp = document.querySelector("#form_employee"),
  form_task = document.querySelector("#form_task"),
  form_worker = document.querySelector("#form_worker"),
  form_worker_payment = document.querySelector("#form_worker_payment"),
  form_bill = document.querySelector("#form_bill"),
  form_payment = document.querySelector("#form_payment"),
  showPass = document.querySelector(".passDiv ion-icon"),
  formsSpan = document.querySelector(".forms span"),
  btnSidebar = document.querySelector(".btn_sidebar"),
  section_li = document.querySelector(".section_li"),
  sections = document.querySelector(".sections"),
  fiscal_li = document.querySelector(".fiscal_li"),
  fiscalYears = document.querySelector(".fiscalYear"),
  monthFilter = document.querySelector("select.month_filter"),
  lots_li = document.querySelector(".lots_li"),
  dashboard_li = document.querySelector(".dashboard_li"),
  backup = document.querySelector(".backup_li"),
  backupOptions = document.querySelector(".backup_options"),
  upload_li = document.querySelector(".upload_li"),
  fileInput = document.querySelector("input.upload"),
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
let section = "employees",
  person,
  fiscalYear = "2020-21",
  month = "",
  edit = false,
  itemsToAdd = document.querySelector(
    `${section === "production" ? "#form_bill" : "#form_task"} .itemsToAdd`
  );

function changeNameTag(name) {
  nameTag.textContent = name.toUpperCase();
  nameTag.parentElement.style.transform = `translateX(-${
    window.innerWidth >= 500 ? 50 : 100
  }%) translateY(-75%)`;
  document.querySelector("header a div h1").classList.add("disabled");
  nameTag.classList.remove("disabled");
}
function restoreNameTag() {
  nameTag.parentElement.style.transform = `translateX(-${
    window.innerWidth >= 500 ? 50 : 100
  }%) translateY(-25%)`;
  nameTag.classList.add("disabled");
  document.querySelector("header a div h1").classList.remove("disabled");
}

btnSidebar.addEventListener("click", () => {
  if (
    section === "employees" ||
    section === "workers" ||
    section === "production" ||
    section === "payments" ||
    section === "wages"
  ) {
    toggleSidebar();
    if (netlifyIdentity.currentUser() !== null) {
      if (btnSidebar.children[0].classList.contains("unsaved")) {
        if (section === "employees" || section === "task") {
          updateCloud("emp", netlifyIdentity.currentUser());
        } else if (section === "workers" || section === "workerPayments") {
          updateCloud("wor", netlifyIdentity.currentUser());
        } else if (section === "production") {
          updateCloud("pro", netlifyIdentity.currentUser());
        }
      }
    }
  } else {
    showPrimaryList();
    itemsToAdd.innerHTML = "";
    addAddmore("", "", "", "");
  }
});
function showPrimaryList() {
  window.history.pushState("index", "the title", `/`);
  restoreNameTag();
  section === "task" && ((section = "employees"), updateEmpList());
  section === "workerPayments" && ((section = "workers"), updateWorkerList());
  section === "production_detail" && (section = "production");
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
  if (e.keyCode === 8 && netlifyIdentity.currentUser() !== null) {
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
form_worker_payment.addEventListener("submit", (e) => {
  e.preventDefault();
  addWorkerPayment();
  updateWorkerPayment();
  hideForm();
  edit = false;
  btnSidebar.children[0].classList.add("unsaved");
});
form_bill.addEventListener("submit", (e) => {
  e.preventDefault();
  addProduct();
  updateProduction();
  hideForm();
  edit = false;
  btnSidebar.children[0].classList.add("unsaved");
});
form_payment.addEventListener("submit", (e) => {
  e.preventDefault();
  section === "wages" && addWageLedger();
  section === "payments" && addPaymentLedger();
  updateLS();
  updatePayment();
  hideForm();
  edit = false;
  btnSidebar.children[0].classList.add("unsaved");
});
lots_li.addEventListener("click", (e) => {
  document.querySelector(".contractors_li").click();
  person = "lots";
  showEmpTasks(e);
  toggleSidebar();
  toggleSidebar();
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
let lastDay = "";
form_bill
  .querySelector('input[name="dress_name"]')
  .addEventListener("keyup", (e) => {
    if (form_bill.querySelector('input[name="dress_name"]').value === "-") {
      form_bill
        .querySelector('input[name="qnt"]')
        .setAttribute("disabled", true);
      form_bill
        .querySelector('input[name="cost"]')
        .setAttribute("disabled", true);
      form_bill
        .querySelector('input[name="ref"]')
        .setAttribute("disabled", true);
    } else {
      form_bill.querySelector('input[name="qnt"]').removeAttribute("disabled");
      form_bill.querySelector('input[name="cost"]').removeAttribute("disabled");
      form_bill.querySelector('input[name="ref"]').removeAttribute("disabled");
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
      employee[0] === "iron" && tr.classList.add("iron");
      lastDay &&
        document
          .querySelector("#employee .thead thead td:nth-child(2)")
          .setAttribute(
            "data-date",
            `${lastDay.split(":")[0].split("-")[2]}-${
              lastDay.split(":")[0].split("-")[1]
            }`
          );
      createTd(employee[0], tr, "name");
      if (employees[employee[0]][lastDay]) {
        createTd(
          employees[employee[0]][lastDay].paid.toLocaleString("en-IN"),
          tr,
          "lastPay"
        );
      } else {
        createTd(0, tr, "lastPay");
      }
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

function addProduct() {
  let date =
    form_bill.querySelector('input[name="date"]').value + ":" + fiscalYear;
  !(date in production) && (production[date] = []);
  let itemToAdd = [...itemsToAdd.children],
    index = production[date].length === 0 ? 0 : production[date].length;
  production[date].push({
    ref: +form_bill.querySelector('input[name="ref"]').value || 0,
    img: uploadImg.dataset.url || "",
    products: [],
  });

  itemToAdd.forEach((item, i) => {
    if (item.querySelector('input[name="dress_name"]').value.length > 0) {
      production[date][index].products.push({
        dress: item.querySelector('input[name="dress_name"]').value,
        qnt: +item.querySelector('input[name="qnt"]').value,
        cost: +item.querySelector('input[name="cost"]').value,
        wage: +item.querySelector('input[name="wage"]').value,
      });
    }
  });
  updateLS();
  form_bill.querySelector('input[name="ref"]').value = "";
  itemsToAdd.innerHTML = "";
  addAddmore("", "", "", "");
}
function addPaymentLedger() {
  let date =
    form_payment.querySelector('input[name="date"]').value + ":" + fiscalYear;
  !(date in production.payments) &&
    (production.payments[date] = { fabric: [] });
  let account = form_payment.querySelector('input[name="for"]').value,
    amount = +form_payment.querySelector('input[name="fabric"]').value;
  production.payments[date].fabric.push({ [account]: amount });
  form_payment.querySelector('input[name="fabric"]').value = "";
}
function addWageLedger() {
  let date =
    form_payment.querySelector('input[name="date"]').value + ":" + fiscalYear;
  !(date in production.payments) && (production.payments[date] = {});
  production.payments[date].wage = +form_payment.querySelector(
    'input[name="wage"]'
  ).value;
  form_payment.querySelector('input[name="wage"]').value = "";
}

function updateProduction() {
  productionList.innerHTML = "";
  const dates = [];
  Object.keys(production).forEach((item, i) => {
    const regex = RegExp(/\d{4}-\d{2}-\d{2}:\d{4}-\d{2}/g);
    regex.test(item) && dates.push(item);
  });
  dates.sort((a, b) =>
    new Date(a.split(":")[0]) < new Date(b.split(":")[0]) ? -1 : 1
  );
  dates.forEach((date) => {
    if (fiscalYear === "All time") {
      createProduction(date);
    } else {
      date.split(":")[1] === fiscalYear && createProduction(date);
    }
  });
  displayAddBtn(productionList);
}
function createProduction(date) {
  const tr = document.createElement("tr");
  tr.classList.add("infoRow");
  let dateFormatted = formatDate(date);
  createTd(`${dateFormatted}`, tr, `${date} date`, production[date].length);
  production[date].forEach((bill) => {
    createTd(`${bill.ref}`, tr, `ref`);
    const products = bill.products || [];
    let total = { qnt: 0, cost: 0 };
    products.forEach((product) => {
      total.qnt += product.qnt;
      total.cost += product.qnt * product.cost - product.qnt * product.wage;
    });
    if (products.length === 1) {
      createTd(products[0].dress, tr, "dressName");
      createTd(products[0].qnt.toLocaleString("en-IN"), tr, "qnt");
      createTd(
        (
          products[0].qnt * products[0].cost -
          products[0].qnt * products[0].wage
        ).toLocaleString("en-IN"),
        tr,
        "total"
      );
    } else {
      createTd("Multiple Items", tr, "dressName");
      createTd(total.qnt.toLocaleString("en-IN"), tr, "qnt");
      createTd(total.cost.toLocaleString("en-IN"), tr, "total");
    }
    products.length > 0 && productionList.appendChild(tr);
  });
}
function showProductionDetail(e) {
  if (
    !e.target.classList.contains("date") &&
    e.target.parentElement.children[0].classList.contains("date")
  ) {
    let date = e.target.parentElement.children[0].className.split(" ")[0];
    section = "production_detail";
    changeNameTag("Hossain garments");
    tableWrapper.style.left = "-100%";
    updateProductionDetail(production[date][getIndex(target, line)]);
    btnSidebar.classList.add("back");
  }
}
function updateProductionDetail(bill) {
  productionDetail.innerHTML = "";
  document.querySelector("#production_detail .banner .ref").textContent =
    bill.ref;
  document
    .querySelector("#production_detail a.ref")
    .setAttribute("href", bill.img);
  document.querySelector(
    "#production_detail .banner .date"
  ).textContent = `Date: ${target.textContent.split(":")[0].split("-")[2]}-${
    target.textContent.split(":")[0].split("-")[1]
  }-${target.textContent.split(":")[0].split("-")[0].slice(-2)}`;
  let totalProduct = 0,
    totalDeduction = 0,
    deductions = [];
  bill.products.forEach((item, i) => {
    const tr = document.createElement("tr");
    createTd(item.dress, tr, "dressName");
    createTd(item.qnt, tr, "qnt");
    createTd(item.cost.toLocaleString("en-IN"), tr, "cost");
    createTd((item.qnt * item.cost).toLocaleString("en-IN"), tr, "total");
    productionDetail.appendChild(tr);
    totalProduct += item.qnt * item.cost;
    deductions.push(item.qnt * item.wage);
  });

  if (bill.products.length > 1) {
    const hr = document.createElement("hr");
    productionDetail.appendChild(hr);
    const tl = document.createElement("tr");
    productionDetail.appendChild(tl);
    createTd(totalProduct.toLocaleString("en-IN"), tl, "total");
  }

  const hr1 = document.createElement("hr");
  productionDetail.appendChild(hr1);

  bill.products.forEach((item, i) => {
    const dd = document.createElement("tr");
    createTd("Deduction", dd, "dressName deduction");
    createTd(item.qnt, dd, "qnt");
    createTd(item.wage.toLocaleString("en-IN"), dd, "cost");
    createTd(
      `- ${(item.qnt * item.wage).toLocaleString("en-IN")}`,
      dd,
      "total"
    );
    productionDetail.appendChild(dd);
    totalDeduction += item.qnt * item.wage;
  });
  const hr2 = document.createElement("hr");
  productionDetail.appendChild(hr2);
  const gr = document.createElement("tr");
  createTd(
    (totalProduct - totalDeduction).toLocaleString("en-IN"),
    gr,
    "total"
  );
  productionDetail.appendChild(gr);
}

function addAddmore(dressName = "", qnt = "", group = "", className = "") {
  const itemToAdd = document.createElement("div");
  itemToAdd.classList.add("itemToAdd");
  className && itemToAdd.classList.add(className);
  if (section === "task") {
    itemToAdd.innerHTML = `
<input type="text" name="dress_name" maxlength="25" placeholder="Add more item" value="${dressName}"/>
<input type="number" name="qnt" placeholder="Pcs." min="0" value="${qnt}" ${
      dressName.length === 0 && "disabled"
    }/>
<select class="groups" name="group" placeholder="group" ${
      dressName.length === 0 && "disabled"
    }>
<option value="" hidden >Group</option>
${
  person !== "iron"
    ? `<option value="S" ${group === "S" && "SELECTED"}>Small</option>
<option value="L" ${group === "L" && "SELECTED"}>Large</option>
<option value="F" ${group === "F" && "SELECTED"}>Fancy</option>
<option value="1" ${group === "1" && "SELECTED"}>One Pc.</option>`
    : `<option value="iS" ${group === "iS" && "SELECTED"}>Iron Small</option>
<option value="iL" ${group === "iL" && "SELECTED"}>Iron Large</option>`
}
</select>
`;
  } else {
    itemToAdd.innerHTML = `
<input type="text" name="dress_name" maxlength="25" placeholder="Item" value="${dressName}"/>
<input type="number" name="qnt" placeholder="Pcs." min="0" value="${qnt}" ${
      dressName.length === 0 && "disabled"
    }/>
<input type="number" name="cost" placeholder="Cost" min="0" value="${group}" required ${
      dressName.length === 0 && "disabled"
    }/>
<input type="number" name="wage" placeholder="Wage" min="0" value="${className}" required ${
      dressName.length === 0 && "disabled"
    }/>
`;
  }
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
    const [qntInput, groupInput, wageInput, ref] = [
      e.target.parentElement.children[1],
      e.target.parentElement.children[2],
      e.target.parentElement.children[3],
      form_bill.querySelector('input[name="ref"]'),
    ];
    if (e.target.value === "-") {
      qntInput.removeAttribute("required");
      qntInput.setAttribute("disabled", true);
      groupInput.removeAttribute("required");
      groupInput.setAttribute("disabled", true);
      wageInput.removeAttribute("required");
      wageInput.setAttribute("disabled", true);
      ref.removeAttribute("required");
      ref.setAttribute("disabled", true);
      [...e.target.parentElement.parentElement.children].length > 1 &&
        (e.target.value = "");
    } else {
      if (e.target.value.length > 0) {
        e.target.setAttribute("required", "true");
        qntInput.removeAttribute("disabled");
        qntInput.setAttribute("required", "true");
        groupInput.removeAttribute("disabled");
        groupInput.setAttribute("required", "true");
        wageInput && wageInput.removeAttribute("disabled");
        wageInput && wageInput.setAttribute("required", "true");
        ref.removeAttribute("disabled");
        ref.setAttribute("required", "true");
        !items.parentElement.nextElementSibling &&
          addAddmore("", "", "", "semi");
      } else {
        document.querySelector(".semi") &&
          document.querySelector(".semi").remove();
        if ([...e.target.parentElement.parentElement.children].length > 1) {
          e.target.removeAttribute("required");
          qntInput.removeAttribute("required");
          groupInput.removeAttribute("required");
          wageInput.removeAttribute("required");
          qntInput.setAttribute("disabled", true);
          groupInput.setAttribute("disabled", true);
          wageInput.setAttribute("disabled", true);
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
  let date =
    form_task.querySelector('input[name="date"]').value + ":" + fiscalYear;
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
  itemsToAdd.innerHTML = "";
  addAddmore("", "", "", "");
  form_task.querySelector('input[name="recieved"]').value = "";
}
function updateTaskList() {
  taskList.innerHTML = "";
  const date = Object.keys(employees[person]),
    tasks = [];
  date.sort((a, b) =>
    new Date(a.split(":")[0]) < new Date(b.split(":")[0]) ? -1 : 1
  );
  date.forEach((day) => {
    employees[person][day] && tasks.push(employees[person][day]);
  });
  date.forEach((item, i) => {
    if (fiscalYear === "All time") {
      createTask(date[i], tasks, i);
    } else {
      date[i].split(":")[1] === fiscalYear && createTask(date[i], tasks, i);
    }
  });
  displayAddBtn(taskList);
}
function addWorkerPayment() {
  let start = form_worker_payment.querySelector('input[type="date"].start'),
    end = form_worker_payment.querySelector('input[type="date"].end'),
    payment = form_worker_payment.querySelector('input[type="number"]');
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
function updateWorkerPayment() {
  workerPayment.innerHTML = "";
  let paid = workers[person].paid,
    abs = workers[person].abs;
  paid.sort((a, b) => (new Date(a.date) < new Date(b.date) ? -1 : 1));
  paid.forEach((payment) => {
    const tr = document.createElement("tr"),
      dateFormatted = `${payment.date.split("-")[2]}-${
        payment.date.split("-")[1]
      }-${payment.date.split("-")[0].slice(-2)}`;
    tr.classList.add("infoRow");
    createTd(dateFormatted, tr, `${payment.date} date`);
    createTd(payment.paid, tr, "payment");
    workerPayment.appendChild(tr);
  });
  if (abs.length > 0) {
    abs.sort((a, b) => (new Date(a) < new Date(b) ? -1 : 1));
    const tr = document.createElement("tr");
    tr.classList.add("abs");
    tr.classList.add("infoRow");
    createTd(
      `Absent ${abs.length > 1 ? "(" + abs.length + " days)" : ""}`,
      tr,
      "absences",
      abs.length
    );
    abs.forEach((day) => {
      createTd(
        `${days[new Date(day).getDay()]}, ${day.split("-")[2]}-${
          day.split("-")[1]
        }-${day.split("-")[0]}`,
        tr,
        "abs_date"
      );
    });
    workerPayment.appendChild(tr);
  }
  displayAddBtn(workerPayment);
}
const grandTotal = { production: 0, paid: 0 };
function updatePayment() {
  payment_right.innerHTML = "";
  payment_left.innerHTML = "";
  grandTotal.production = 0;
  grandTotal.paid = 0;

  let dates = [],
    payDates = [];
  Object.keys(production).forEach((date) => {
    const regex = RegExp(/\d{4}-\d{2}-\d{2}:\d{4}-\d{2}/g);
    regex.test(date) && dates.push(date);
  });
  sortDate(dates);
  dates.forEach((date) => paymentDateFilter(displayProductLedger, date));

  Object.keys(production.payments).forEach((date) => payDates.push(date));
  sortDate(payDates);
  payDates.forEach((date) => paymentDateFilter(displayPaymentLedger, date));

  const tr_production = document.createElement("tr");
  tr_production.classList.add("production");
  createTd(
    grandTotal.production.toLocaleString("en-IN"),
    tr_production,
    "total"
  );
  payment_left.appendChild(tr_production);
  const tr_recieved = document.createElement("tr");
  tr_recieved.classList.add("recieved");
  createTd("Recieved", tr_recieved);
  createTd(grandTotal.paid.toLocaleString("en-IN"), tr_recieved, "total");
  payment_right.appendChild(tr_recieved);
  const tr_due = document.createElement("tr");
  tr_due.classList.add("due");
  createTd("Due", tr_due);
  createTd(
    (grandTotal.production - grandTotal.paid).toLocaleString("en-IN"),
    tr_due,
    "total"
  );
  payment_right.appendChild(tr_due);
  displayAddBtn(payment_right);
}

function displayProductLedger(date) {
  production[date].forEach((bill, i) => {
    const tr = document.createElement("tr");
    createTd(production[date][i].ref, tr, "ref");
    createTd(formatDate(date), tr, `date`);
    let total = { qnt: 0, cost: 0 };
    bill.products.forEach((product) => {
      total.qnt += product.qnt;
      total.cost +=
        section === "payments"
          ? product.qnt * product.cost - product.qnt * product.wage
          : product.qnt * product.wage;
    });
    createTd(total.qnt.toLocaleString("en-IN"), tr, "qnt");
    createTd(total.cost.toLocaleString("en-IN"), tr, "total");
    grandTotal.production += total.cost;
    payment_left.appendChild(tr);
  });
}
function displayPaymentLedger(date) {
  const tr = document.createElement("tr"),
    fabric = production.payments[date].fabric,
    wage = production.payments[date].wage;
  if ((section === "payments" && !fabric) || (section === "wages" && !wage))
    return;
  tr.classList.add("infoRow");
  createTd(
    formatDate(date),
    tr,
    `${date} date`,
    `${section === "payments" && fabric.length > 1 ? fabric.length : 0}`
  );
  if (section === "payments") {
    fabric.forEach((payment) => {
      createTd(Object.keys(payment), tr, "for");
      createTd(Object.values(payment).toLocaleString("en-IN"), tr, "total");
      grandTotal.paid += Object.values(payment)[0];
    });
  } else {
    createTd(wage.toLocaleString("en-IN"), tr, "total");
    grandTotal.paid += wage;
  }
  (section === "payments" && fabric.length > 0) ||
  (section === "wages" && wage > 0)
    ? payment_right.appendChild(tr)
    : false;
}

function displayAddBtn(element) {
  netlifyIdentity.currentUser() !== null &&
    fiscalYear !== "All time" &&
    (element.innerHTML += `
    <tr id="btn_tr">
    <td class="btn_row add">
    <button id="td_btn" type="submit" onClick="showForm()" name="button">
    </button>
    ${
      section === "employees"
        ? `<div class="label"><ion-icon name="person-add-outline"></ion-icon><p>Add more people...</p></div>`
        : `<div class="label"> <ion-icon name="add-outline"></ion-icon> <p>${
            person !== "lots"
              ? `${
                  section === "payments" || section === "wages"
                    ? "Add payment."
                    : "Add more tasks..."
                }`
              : "Add more lots..."
          }</p></div>`
    }
    </td>
    </tr>
    `);
}
function createTask(date, tasks, i) {
  const tr = document.createElement("tr");
  tr.classList.add("infoRow");
  let dateFormatted = formatDate(date);
  createTd(`${dateFormatted}`, tr, `${date} date`, tasks[i].tasks.length);
  tasks[i].tasks.forEach((task, j) => {
    createTd(task.dress, tr, "dressName");
    createTd(task.qnt.toLocaleString("en-IN"), tr, "qnt");
    createTd(task.group, tr, "grp");
    if (person !== "lots") {
      createTd(
        (task.qnt > 0 ? task.qnt * priceCheck(task.group) : 0).toLocaleString(
          "en-IN"
        ),
        tr,
        "total"
      );
    }
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
    tasks[i].tasks.forEach((item, i) => item.qnt > 0 && (pcsInLot += item.qnt));
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
  tdClass && tdClass.split(" ").forEach((cls) => td.classList.add(cls));
  (span || span === 0) &&
    (td.style.gridRow = `1 / span ${span > 0 ? span : 1}`);
  data && td.setAttribute("data-content", data);
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
    case "iS":
      return 2.5;
      break;
    case "iL":
      return 4;
      break;
    default:
  }
}
function getDaysInBetween(from, to) {
  return Math.abs((new Date(from) - new Date(to)) / 1000 / 60 / 60 / 24);
}
function getTotal(days, what) {
  let total = 0;
  days.forEach((day) => {
    if (fiscalYear === "All time") {
      if (what === "production") {
        day[1].tasks.forEach((task) => {
          total += task.qnt > 0 ? task.qnt * priceCheck(task.group) : 0;
        });
      } else {
        total += day[1].paid;
      }
    } else {
      if (day[0].split(":")[1] === fiscalYear) {
        if (what === "production") {
          day[1].tasks.forEach((task) => {
            total += task.qnt > 0 ? task.qnt * priceCheck(task.group) : 0;
          });
        } else {
          total += day[1].paid;
        }
      }
    }
  });
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
function formatDate(date) {
  return `${date.split(":")[0].split("-")[2]}-${
    date.split(":")[0].split("-")[1]
  }-${date.split(":")[0].split("-")[0].slice(-2)}`;
}

function updateLS() {
  localStorage.setItem("employees", JSON.stringify(employees));
  localStorage.setItem("workers", JSON.stringify(workers));
  localStorage.setItem("production", JSON.stringify(production));
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
    popUpTimer = setTimeout(() => {
      if (section === "production") {
        !line.classList.contains("date") && showPopup(e);
      } else {
        showPopup(e);
      }
    }, 600);
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
      if (section === "production" || section === "payments") {
        !line.classList.contains("date") && showPopup(e);
      } else {
        showPopup(e);
      }
      return;
    }
  }
  duration += new Date().getTime() - startTime;
  clearTimeout(popUpTimer);
  if (duration <= 350) {
    section === "employees" && e.target.tagName !== "BUTTON" && showEmpTasks(e);
    section === "workers" && e.target.tagName !== "BUTTON" && showPayments(e);
    section === "production" &&
      e.target.tagName !== "BUTTON" &&
      showProductionDetail(e);
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
    popUpTimer = setTimeout(() => {
      if (section === "production") {
        !line.classList.contains("date") && showPopup(e);
      } else {
        showPopup(e);
      }
    }, 600);
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
    section === "employees" && e.target.tagName !== "BUTTON" && showEmpTasks(e);
    section === "workers" && e.target.tagName !== "BUTTON" && showPayments(e);
    section === "production" &&
      e.target.tagName !== "BUTTON" &&
      showProductionDetail(e);
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
    section = "workerPayments";
    tableWrapper.style.left = "-100%";
    window.history.pushState("index", "the title", `/${person}`);
    updateWorkerPayment();
    btnSidebar.classList.add("back");
    changeNameTag(person);
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
    }
  } else {
    section = "task";
    tableWrapper.style.left = "-100%";
    updateTaskList();
    btnSidebar.classList.add("back");
    window.history.pushState("index", "the title", `/${person}`);
  }
  changeNameTag(person);
}
function showPopup(e) {
  section === "employees" ||
  section === "workers" ||
  (section === "workerPayments" &&
    target.parentElement.classList.contains("abs"))
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
  let date = target.className.split(" ")[0],
    index = getIndex(target, line);
  if (section === "task") {
    itemsToAdd.innerHTML = "";
    let itemToEdit = employees[person][target.className.split(" ")[0]];
    form_task.querySelector('input[name="date"]').value = date.split(":")[0];
    itemToEdit.tasks.forEach((item) => {
      addAddmore(item.dress, item.qnt, item.group);
    });
    person !== "lots" &&
      (form_task.querySelector('input[name="recieved"]').value =
        itemToEdit.paid);
  } else if (section === "production") {
    let productsToEdit = production[date][index].products;
    itemsToAdd.innerHTML = "";
    form_bill.querySelector('input[name="date"]').value = date.split(":")[0];
    form_bill.querySelector('input[name="ref"]').value =
      production[date][index].ref;
    production[date][index].img.length > 0 &&
      uploadImg.setAttribute("data-url", production[date][index].img);
    productsToEdit.forEach((product) => {
      addAddmore(product.dress, product.qnt, product.cost, product.wage);
    });
  } else if (section === "payments") {
    const date = target.className.split(" ")[0];
    const itemToEdit = production.payments[date].fabric[index];
    form_payment.querySelector(
      'input[type="date"]'
    ).value = target.className.split(" ")[0].split(":")[0];
    form_payment.querySelector("input[name='for']").value = Object.keys(
      itemToEdit
    )[0];
    form_payment.querySelector("input[name='fabric']").value = Object.values(
      itemToEdit
    )[0];
  } else if (section === "wages") {
    form_payment.querySelector(
      'input[type="date"]'
    ).value = target.className.split(" ")[0].split(":")[0];
    form_payment.querySelector("input[name='wage']").value =
      production.payments[target.className.split(" ")[0]].wage;
  } else if (
    line.classList.contains("date") ||
    line.classList.contains("payment")
  ) {
    form_worker_payment.querySelector('input[type="number"]').value =
      target.nextElementSibling.textContent;
    form_worker_payment.querySelector(
      'input[type="date"]'
    ).value = target.className.split(" ")[0].split(":")[0];
  }
}
function popUp_delete() {
  if (section === "employees") {
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
  } else if (section === "production") {
    let date = target.className.split(" ")[0];
    if (production[date].length === 1) {
      delete production[date];
    } else {
      production[date].splice(getIndex(target, line), 1);
    }
    updateProduction();
  } else if (section === "payments") {
    let date = target.className.split(" ")[0];
    if (production.payments[date].wage) {
      if (production.payments[date].wage === 0) {
        production.payments[date].fabric.length === 1
          ? delete production.payments[date]
          : production.payments[date].fabric.splice(getIndex(target, line), 1);
      } else {
        production.payments[date].fabric.length === 1
          ? (production.payments[date].fabric = [])
          : production.payments[date].fabric.splice(getIndex(target, line), 1);
      }
    } else {
      production.payments[date].fabric.length === 1
        ? delete production.payments[date]
        : production.payments[date].fabric.splice(getIndex(target, line), 1);
    }
    updatePayment();
  } else if (section === "wages") {
    let date = target.className.split(" ")[0];
    if (production.payments[date].fabric) {
      production.payments[date].fabric.length === 0
        ? delete production.payments[date]
        : (production.payments[date].wage = 0);
    } else {
      delete production.payments[date];
    }
    updatePayment();
  } else if (section === "workers") {
    delete_prompt.querySelector(
      "p"
    ).textContent = `Are you sure you want to delete ${target.textContent}?`;
    delete_prompt.classList.add("active");
  } else if (section === "workerPayments") {
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
    updateWorkerPayment();
  }
  btnSidebar.children[0].classList.add("unsaved");
  updateLS();
}
delete_prompt.addEventListener("click", (e) => {
  if (section === "employees") {
    if (e.target.textContent === "YES") {
      btnSidebar.children[0].classList.add("unsaved");
      delete employees[target.textContent];
      updateEmpList();
      updateLS();
    }
  } else if (section === "workers") {
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
  let lists = [...target.parentElement.children],
    elementCount = 4;
  lists[lists.length - 1].classList.contains("paid") && lists.pop();
  section === "payments" && (elementCount = 2);
  lists.shift();
  if (lists.length % elementCount === 0) {
    return Math.ceil((lists.indexOf(line) + 1) / elementCount) - 1;
  }
}
let clearAllTimer;
clearAll.addEventListener("mousedown", (e) => {
  e.preventDefault();
  clearAllTimer = setTimeout(() => {
    localStorage.clear();
    employees = {};
    workers = {};
    updateEmpList();
    updateCloud("emp", netlifyIdentity.currentUser());
    updateCloud("pro", netlifyIdentity.currentUser());
    updateCloud("wor", netlifyIdentity.currentUser());
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
      if (raw.search(`let ${section} = {`) >= 0) {
        if (netlifyIdentity.currentUser() !== null) {
          switch (section) {
            case "employees":
              employees = JSON.parse(raw.replace("let employees = ", ""));
              updateEmpList();
              break;
            case "workers":
              workers = JSON.parse(raw.replace("let workers = ", ""));
              updateWorkerList();
              break;
            case "production":
              production = JSON.parse(raw.replace("let production = ", ""));
              updateProduction();
              break;
          }
        }
        updateLS();
        btnSidebar.children[0].classList.add("unsaved");
        toggleSidebar();
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
  let raw = `${
    e.target.textContent === "App Backup" ? `let ${section} = ` : ""
  }${section === "employees" ? JSON.stringify(employees) : ""}${
    section === "workers" ? JSON.stringify(workers) : ""
  }${section === "production" ? JSON.stringify(production) : ""}`;
  let blob = new Blob([raw], { type: "application/json" });
  let uri = URL.createObjectURL(blob);
  download(uri, e.target.textContent);
  backupOptions.classList.remove("active");
});
function download(url, type) {
  let date = new Date();
  let a = document.createElement("a");
  a.href = url;
  a.download = `TULLY-${
    type === "App Backup" ? "Backup" : "Raw"
  }-${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}-${section}`;
  a.click();
}

let url = "/.netlify/functions/fetchData";

function updateCloud(dir, userStatus) {
  let body = {};
  switch (dir) {
    case "emp":
      body = employees;
      break;
    case "pro":
      body = production;
      break;
    case "wor":
      body = workers;
  }
  fetch(url, {
    method: "PUT",
    headers: {
      from: dir,
      warning: JSON.stringify(userStatus),
    },
    body: JSON.stringify(body),
  }).then((res) => {
    res.status === 200 && btnSidebar.children[0].classList.remove("unsaved");
  });
}
function getFromCloud(dir, userStatus) {
  const fetchData = async () =>
    await (
      await fetch(url, {
        headers: { from: dir, warning: JSON.stringify(userStatus) },
      })
    ).json();
  fetchData().then((data) => {
    if (dir === "emp") {
      localStorage.setItem("employees", JSON.stringify(data.record));
      employees = JSON.parse(localStorage.getItem("employees"));
      updateDashboard();
      updateEmpList();
    } else if (dir === "pro") {
      localStorage.setItem("production", JSON.stringify(data.record));
      production = JSON.parse(localStorage.getItem("production"));
      updateProduction();
    } else {
      localStorage.setItem("workers", JSON.stringify(data.record));
      workers = JSON.parse(localStorage.getItem("workers"));
      updateEmpList();
    }
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
    if (name !== "lots" && name !== "iron") {
      for (const day in employees[name]) {
        if (fiscalYear === "All time") {
          !([day] in data) && (data[day] = { tasks: [], paid: 0 });
          Object.keys(employees[name][day]).forEach((task, k) => {
            task === "paid"
              ? (data[day].paid += employees[name][day][task])
              : data[day].tasks.push(...employees[name][day][task]);
          });
        } else {
          if (day.split(":")[1] === fiscalYear) {
            if (!([day] in data) && day.split(":")[1] === fiscalYear) {
              data[day] = { tasks: [], paid: 0 };
            }
            Object.keys(employees[name][day]).forEach((task, k) => {
              task === "paid"
                ? (data[day].paid += employees[name][day][task])
                : data[day].tasks.push(...employees[name][day][task]);
            });
          }
        }
      }
    }
  }

  //sorts dates
  Object.keys(data).forEach((days) => dates.push(days));
  dates.sort((a, b) =>
    new Date(a.split(":")[0]) < new Date(b.split(":")[0]) ? -1 : 1
  );
  lastDay = dates[dates.length - 1];
  // Puts data in diffrent groups
  Object.keys(data).forEach((days, i) => {
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
          if (fiscalYear === "All time") {
            return item.split("-")[2] + "-" + item.split("-")[1];
          } else {
            if (item.split(":")[1] === fiscalYear) {
              return (
                item.split(":")[0].split("-")[2] +
                "-" +
                item.split(":")[0].split("-")[1] +
                "-" +
                item.split(":")[0].split("-")[0]
              );
            }
          }
        }),
      ],
      datasets: [
        {
          fill: false,
          label: "Production, " + fiscalYear,
          data: [...production],
          borderWidth: 3,
          borderColor: ["rgba(90, 165, 227, 1)"],
        },
        {
          fill: false,
          label: "Payments, " + fiscalYear,
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

section_li.addEventListener("click", (e) => {
  sections.classList.toggle("active");
});
fiscal_li.addEventListener("click", (e) => {
  fiscalYears.classList.toggle("active");
});
fiscalYears.addEventListener("click", (e) => {
  fiscal_li.querySelector("p:last-child").textContent = e.target.textContent;
  fiscalYear = e.target.textContent;
  fiscalYears.classList.remove("active");
  updateEmpList();
  updateProduction();
  updatePayment();
});
fiscal_li.querySelector("p:last-child").textContent = "2020-21";
monthFilter.addEventListener("change", (e) => {
  month = monthFilter.value;
  updatePayment();
});
function sortDate(dates) {
  return dates.sort((a, b) =>
    new Date(a.split(":")[0]) < new Date(b.split(":")[0]) ? -1 : 1
  );
}
function paymentDateFilter(fun, date) {
  const monthToShow = date.split(":")[0].split("-")[1],
    yearToShow = date.split(":")[1];
  if (fiscalYear === "All time") {
    month === "all" ? fun(date) : monthToShow === month && fun(date);
  } else if (yearToShow === fiscalYear) {
    month === "all" ? fun(date) : monthToShow === month && fun(date);
  }
}
