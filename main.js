"use strict";
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
let employees = {};
let workers = {};
let production = { payments: {} };
let costs = [];
const tableWrapper = $(".table_wrapper"),
  nameTag = $(".nameTag"),
  empList = $("#employee .tbody tbody"),
  taskList = $("#tasks .tbody tbody"),
  workerList = $("#workers .tbody tbody"),
  workerPayment = $("#workers_payments .tbody tbody"),
  productionList = $("#production .tbody tbody"),
  productionDetail = $("#production_detail .tbody tbody"),
  costList = $("#cost .tbody tbody"),
  costDetail = $("#cost_detail .tbody tbody"),
  summery = $("#summery .tbody tbody"),
  payment_right = $("#payments .right .tbody tbody"),
  payment_left = $("#payments .left .tbody tbody"),
  form_login = $("#loginForm"),
  form_emp = $("#form_employee"),
  form_task = $("#form_task"),
  form_worker = $("#form_worker"),
  form_worker_payment = $("#form_worker_payment"),
  form_bill = $("#form_bill"),
  form_cost = $("#form_cost"),
  form_payment = $("#form_payment"),
  form_date_filter = $("#form_date_filter"),
  showPass = $(".passDiv ion-icon"),
  formsSpan = $(".forms span"),
  btnSidebar = $(".btn_sidebar"),
  section_li = $(".section_li"),
  sections = $(".sections"),
  fiscal_li = $(".fiscal_li"),
  fiscalYears = $(".fiscalYear"),
  monthFilter = $("select.month_filter"),
  lots_li = $(".lots_li"),
  dashboard_li = $(".dashboard_li"),
  backup = $(".backup_li"),
  backupOptions = $(".backup_options"),
  upload_li = $(".upload_li"),
  fileInput = $("input.upload"),
  clearAll = $(".clear"),
  logout = $(".logout"),
  cls_dashboard = $(".cls_dashboard"),
  dashboard = $(".dashboard"),
  weekProduction = $(".thisWeek .production"),
  weekPaid = $(".thisWeek .paid"),
  weekLot = $(".thisWeek .lot"),
  yearProduction = $(".thisYear .production"),
  yearPaid = $(".thisYear .paid"),
  yearValue = $(".thisYear .value"),
  popUp = $(".popUp"),
  delete_prompt = $(".delete_prompt");
let section = "employees",
  person,
  fiscalYear = "2021-22",
  dateRange = {
    from: new Date(`1800-01-01:00:00`),
    to: new Date("2200-12-31:00:00"),
  },
  edit = false,
  itemsToAdd = $("#form_task .itemsToAdd");

function changeNameTag(name) {
  nameTag.textContent = name.toUpperCase();
  nameTag.parentElement.style.transform = `translateX(-${
    window.innerWidth >= 500 ? 50 : 100
  }%) translateY(-75%)`;
  $("header a div h1").classList.add("disabled");
  nameTag.classList.remove("disabled");
}
function restoreNameTag() {
  nameTag.parentElement.style.transform = `translateX(-${
    window.innerWidth >= 500 ? 50 : 100
  }%) translateY(-25%)`;
  nameTag.classList.add("disabled");
  $("header a div h1").classList.remove("disabled");
}

btnSidebar.addEventListener("click", () => {
  if (
    section === "employees" ||
    section === "workers" ||
    section === "cost" ||
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
        } else if (section === "cost" || section === "costDetail") {
          updateCloud("cos", netlifyIdentity.currentUser());
        } else if (
          section === "production" ||
          section === "wages" ||
          section === "payments"
        ) {
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
  section == "costDetail" && (section = "cost");
  tableWrapper.style.left = "0";
  btnSidebar.classList.remove("back");
  person = "";
  form_task_recieved.removeAttribute("hidden");
  form_task_recieved.setAttribute("required", true);
  form_task.classList.remove("lots");
  setTimeout(() => {
    $("#tasks").classList.remove("lots");
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
  updateLS();
});
form_task.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask();
  updateTaskList();
  hideForm();
  edit = false;
  updateLS();
});
form_worker.addEventListener("submit", (e) => {
  e.preventDefault();
  addWorker();
  updateWorkerList();
  hideForm();
  edit = false;
  updateLS();
});
form_worker_payment.addEventListener("submit", (e) => {
  e.preventDefault();
  addWorkerPayment();
  updateWorkerPayment();
  hideForm();
  edit = false;
  updateLS();
});
form_bill.addEventListener("submit", (e) => {
  e.preventDefault();
  addProduct();
  updateProduction();
  hideForm();
  edit = false;
  updateLS();
});
form_cost.addEventListener("submit", (e) => {
  e.preventDefault();
  addCost();
  updateCost();
  hideForm();
  edit = false;
  updateLS();
});
form_payment.addEventListener("submit", (e) => {
  e.preventDefault();
  section === "wages" && addWageLedger();
  section === "payments" && addPaymentLedger();
  updateLS();
  updatePayment();
  hideForm();
  edit = false;
});
form_date_filter.addEventListener("submit", (e) => {
  e.preventDefault();
  let start = form_date_filter.querySelector('input[type="date"].start').value,
    end = form_date_filter.querySelector('input[type="date"].end').value;
  dateRange.from = new Date(start);
  dateRange.to = new Date(end);
  (section === "payments" || section === "wages") && updatePayment();
  section === "employees" && updateEmpList();
  section === "production" && updateProduction();
  section === "task" && updateTaskList();
  hideForm();
});
lots_li.addEventListener("click", (e) => {
  $(".contractors_li").click();
  person = "lots";
  showEmpTasks(e);
  toggleSidebar();
  toggleSidebar();
  form_task.classList.add("lots");
  form_task.querySelector('input[name="recieved"]').removeAttribute("required");
  form_task
    .querySelector('input[name="recieved"]')
    .setAttribute("hidden", true);
  $("#tasks").classList.add("lots");
});

let lastDay = "";
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
  form_worker.querySelector("input[type='text']").value = "";
  form_worker.querySelector("input[type='number']").value = "";
}
function addEmp() {
  employees[form_emp.querySelector("input").value] = {};
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
        $("#employee .thead thead td:nth-child(2)").setAttribute(
          "data-date",
          `${lastDay.split(":")[0].split("-")[2]}-${
            lastDay.split(":")[0].split("-")[1]
          }`
        );
      const lastWeek = employees[employee[0]][lastDay];
      createTd(employee[0], tr, "name");
      if (lastWeek) {
        createTd(
          lastWeek.paid.toLocaleString("en-IN"),
          tr,
          "lastPay",
          null,
          lastWeek?.tasks.map((item) => `${item.group} ${item.qnt}`)
        );
      } else {
        createTd(0, tr, "lastPay");
      }
      createTd(
        getTotal(days, "production").toLocaleString("en-IN"),
        tr,
        "product",
        null,
        Object.entries(getTotal(days, "qnt")).join("; ").replaceAll(",", " ")
      );
      createTd(
        getTotal(days, "paid").toLocaleString("en-IN"),
        tr,
        "payment",
        null,
        (getTotal(days, "production") - getTotal(days, "paid")).toLocaleString(
          "en-IN"
        )
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
  let date = form_bill_date.value + ":" + fiscalYear;
  !(date in production) && (production[date] = []);
  edit && production[date].splice(getIndex(target, line), 1);
  let itemToAdd = [...itemsToAdd.children],
    index = production[date].length;
  production[date].push({
    ref: +form_bill_ref.value || 0,
    img:
      form_bill.querySelector("input[type='file']").getAttribute("data-url") ||
      "",
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
  form_bill.querySelector('input[name="ref"]').value = "";
  itemsToAdd.innerHTML = "";
  addAddmore("", "", "", "");
  form_bill.querySelector("input[type='file']").removeAttribute("data-url");
}
function addPaymentLedger() {
  let date =
    form_payment.querySelector('input[name="date"]').value + ":" + fiscalYear;
  if (!(date in production.payments)) {
    production.payments[date] = { fabric: [] };
  } else if (!("fabric" in production.payments[date])) {
    production.payments[date].fabric = [];
  }
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
  const dates = Object.keys(production).filter((date) =>
    RegExp(/\d{4}-\d{2}-\d{2}:\d{4}-\d{2}/g).test(date)
  );
  sortDate(dates);
  dates.forEach((date) => dateFilter(createProduction, date));
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
    // TODO: have a look
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
  $("#production_detail .banner .ref").textContent = bill.ref;
  document
    .querySelector("#production_detail a.ref")
    .setAttribute("href", bill.img);
  $("#production_detail .banner .date").textContent = `Date: ${
    target.textContent.split(":")[0].split("-")[2]
  }-${
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

function addCost() {
  const newCost = {
    lotNo: +form_cost.querySelector("input[name='lotNo']").value,
    id: `${new Date().getTime()}`,
    img:
      form_cost.querySelector("input[type='file']").getAttribute("data-url") ||
      "",
    date: form_cost_date.value + ":" + fiscalYear,
    dress: form_cost_dress.value,
    lotSize: +form_cost.querySelector('input[name="lotSize"]').value,
    materials: [],
    delivery: form_cost.querySelector("input[name='delivery']").value,
  };
  form_cost.querySelectorAll(".itemToAdd").forEach((item) => {
    if (item.querySelector('input[name="material"]').value.length > 0) {
      newCost.materials.push({
        mat: item.querySelector('input[name="material"]').value,
        qnt: +item.querySelector('input[name="qnt"]').value,
        cost: +item.querySelector('input[name="cost"]').value,
      });
    }
  });
  itemsToAdd.innerHTML = "";
  addAddmore("", "", "", "");
  edit &&
    (costs = costs.filter(
      (item) => item.id !== target.parentElement.getAttribute("data-id")
    ));
  costs.push(newCost);
  form_cost.querySelector("input[type='file']").removeAttribute("data-url");
}
function showCostDetail(e) {
  if (e.target.parentElement.classList.contains("infoRow")) {
    section = "costDetail";
    const id = e.target.parentElement.getAttribute("data-id");
    updateCostDetail(costs.filter((item) => item.id === id)[0]);
    tableWrapper.style.left = "-100%";
    btnSidebar.classList.add("back");
  }
}
function calculateCost(item) {
  return Math.ceil(
    item.materials.reduce((a, c) => a + c.cost * c.qnt, 0) / item.lotSize
  );
}
function updateCost() {
  costList.innerHTML = "";
  costs.forEach((item, i) => {
    const tr = document.createElement("tr");
    tr.classList.add("infoRow");
    tr.setAttribute("data-id", item.id);
    createTd(item.lotNo, tr, "lot");
    createTd(item.delivery, tr, "delivery");
    createTd(item.dress, tr, "name");
    createTd(item.lotSize, tr, "lotSize");
    createTd(calculateCost(item), tr, "total");
    costList.appendChild(tr);
  });
  displayAddBtn(costList);
}
function updateCostDetail(item) {
  costDetail.innerHTML = "";
  let total = 0;
  item.materials.forEach((item) => {
    const tr = document.createElement("tr");
    createTd(item.mat, tr, "mat");
    createTd(item.qnt, tr, "qnt");
    createTd(item.cost, tr, "cost");
    createTd((item.qnt * item.cost).toLocaleString("en-IN"), tr, "total");
    total += item.qnt * item.cost;
    costDetail.appendChild(tr);
  });
  const totalMaterialCost = document.createElement("tr");
  createTd("Total material cost", totalMaterialCost, "perUnit");
  createTd(total.toLocaleString("en-IN"), totalMaterialCost, "total");
  costDetail.appendChild(totalMaterialCost);
  const lotSize = document.createElement("tr");
  createTd(`Per unit (${item.lotSize})`, lotSize, "perUnit");
  createTd(
    `৳ ${Math.ceil(total / item.lotSize).toLocaleString("en-IN")}`,
    lotSize,
    "total"
  );
  costDetail.appendChild(lotSize);
  if (item.img) {
    const img = document.createElement("tr");
    const td = document.createElement("td");
    const a = document.createElement("a");
    a.setAttribute("href", item.img);
    a.textContent = "img";
    td.appendChild(a);
    td.style.gridColumnEnd = "-1";
    td.style.textAlign = "right";
    img.appendChild(td);
    costDetail.appendChild(img);
  }
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
  } else if (section === "cost") {
    itemToAdd.innerHTML = `
<input type="text" name="material" maxlength="25" placeholder="Material" value="${dressName}"/>
<input type="number" name="qnt" placeholder="Qnt" step="0.01" min="0" value="${qnt}" ${
      dressName.length === 0 && "disabled"
    }/>
<input type="number" name="cost" placeholder="Price" step="0.01" min="0" value="${group}" required ${
      dressName.length === 0 && "disabled"
    }/>
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
    .querySelector("input:first-child")
    .addEventListener("focus", (e) => {
      className && e.target.parentElement.classList.remove(className);
    });
  itemtoAddEventListener();
}
function itemtoAddEventListener() {
  let items = itemsToAdd
    .querySelector(".itemToAdd:last-child")
    .querySelector("input:first-child");
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
        $(".semi") && $(".semi").remove();
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
  for (var i = [...itemsToAdd.children].length; i > 1; i--) {
    [...itemsToAdd.children][i - 1].remove();
  }
  itemsToAdd.innerHTML = "";
  addAddmore("", "", "", "");
  form_task.querySelector('input[name="recieved"]').value = "";
}
function updateTaskList() {
  taskList.innerHTML = "";
  const dates = Object.keys(employees[person]);
  sortDate(dates);
  dates.forEach((day) => dateFilter(createTask, day));
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
  end.value = "";
  payment.value = "";
}
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function updateWorkerPayment() {
  //need some lookup
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

function addHr(element) {
  const hr = document.createElement("hr");
  element.appendChild(hr);
}
function updatePayment() {
  payment_right.innerHTML = "";
  payment_left.innerHTML = "";
  grandTotal.production = 0;
  grandTotal.paid = 0;
  let dates = [],
    payDates = [],
    previousWage = previousWageConst,
    previousWagePayments = 0,
    previousProduction = 0,
    previousProductionPayments = 0;
  Object.keys(production).forEach((date) => {
    const regex = RegExp(/\d{4}-\d{2}-\d{2}:\d{4}-\d{2}/g);
    regex.test(date) && dates.push(date);
  });
  sortDate(dates);
  dates.forEach((date) => {
    dateFilter(displayProductLedger, date);
    const from = new Date(dateRange.from);
    // from.setFullYear(new Date(date.split(":")[0]).getFullYear());
    if (monthFilter.value !== "all") {
      // console.log(new Date(date.split(":")[0] + ":00:00"), from);
      if (new Date(date.split(":")[0] + ":00:00") < from) {
        // console.log(new Date(date.split(":")[0] + ":00:00"), from);
        const bills = production[date];
        bills.forEach((bill) => {
          bill.products.forEach((product) => {
            previousWage += product.qnt * product.wage;
            previousProduction +=
              product.qnt * product.cost - product.qnt * product.wage;
          });
        });
      }
    }
  });

  Object.keys(production.payments).forEach((date) => {
    payDates.push(date);
    if (monthFilter.value !== "all") {
      if (new Date(date.split(":")[0] + ":00:00") < dateRange.from) {
        console.log("this also ran");
        if (production.payments[date].wage) {
          previousWagePayments += production.payments[date].wage;
        }
        if (production.payments[date].fabric) {
          previousProductionPayments += production.payments[date].fabric.reduce(
            (a, c) => a + +Object.values(c),
            0
          );
        }
      }
    }
  });

  sortDate(payDates);
  payDates.forEach((date) => dateFilter(displayPaymentLedger, date));

  const tr_production = document.createElement("tr");
  tr_production.classList.add("production");
  createTd("", tr_production);
  createTd(grandTotal.production.toLocaleString("en-IN"), tr_production);
  payment_left.appendChild(tr_production);

  const tr_recieved = document.createElement("tr");
  tr_recieved.classList.add("recieved");
  createTd("Recieved", tr_recieved);
  createTd(grandTotal.paid.toLocaleString("en-IN"), tr_recieved);
  payment_right.appendChild(tr_recieved);

  const tr_due = document.createElement("tr");
  tr_due.classList.add("due");
  createTd("Due", tr_due);
  if (section === "payments") {
    createTd(
      (grandTotal.production - grandTotal.paid).toLocaleString("en-IN"),
      tr_due
    );
  } else {
    if (monthFilter.value === "all") {
      createTd(
        (grandTotal.production + previousWage - grandTotal.paid).toLocaleString(
          "en-IN"
        ),
        tr_due
      );
    } else {
      createTd(
        (grandTotal.production - grandTotal.paid).toLocaleString("en-IN"),
        tr_due
      );
    }
  }
  payment_right.appendChild(tr_due);

  displayAddBtn(payment_right);
  if (section === "payments") {
    addHr(payment_right);
    addHr(payment_right);

    const previousTr = document.createElement("tr");
    createTd("Previous", previousTr, "previous");
    createTd(
      (
        previous +
        previousProductionPayments -
        previousProduction
      ).toLocaleString("en-IN"),
      previousTr,
      "previous"
    );
    payment_right.appendChild(previousTr);
    const recieved_production = document.createElement("tr");
    createTd("Recieved", recieved_production, "recieved");
    createTd(
      "+ " + grandTotal.paid.toLocaleString("en-IN"),
      recieved_production,
      "previous"
    );
    payment_right.appendChild(recieved_production);

    addHr(payment_right);

    const total = document.createElement("tr");
    createTd("Total", total);
    createTd(
      (
        previous +
        previousProductionPayments -
        previousProduction +
        grandTotal.paid
      ).toLocaleString("en-IN"),
      total
    );
    payment_right.appendChild(total);
    const totalProduction = document.createElement("tr");
    createTd("Total production", totalProduction, "production");
    createTd(
      "- " + grandTotal.production.toLocaleString("en-IN"),
      totalProduction
    );
    payment_right.appendChild(totalProduction);

    addHr(payment_right);

    const totalToDate = document.createElement("tr");
    createTd("Todate", totalToDate, "production");
    createTd(
      (
        previous +
        previousProductionPayments -
        previousProduction +
        grandTotal.paid -
        grandTotal.production
      ).toLocaleString("en-IN"),
      totalToDate
    );
    payment_right.appendChild(totalToDate);
  } else {
    if (monthFilter.value !== "all") {
      const wageTodate = document.createElement("tr");
      createTd("Previous wage", wageTodate);
      createTd(
        "+ " + (previousWage - previousWagePayments).toLocaleString("en-IN"),
        wageTodate
      );
      payment_left.appendChild(wageTodate);

      addHr(payment_left);

      const totalWage = document.createElement("tr");
      createTd("Total", totalWage);
      createTd(
        (
          previousWage -
          previousWagePayments +
          grandTotal.production
        ).toLocaleString("en-IN"),
        totalWage
      );
      payment_left.appendChild(totalWage);

      const thisMonthWage = document.createElement("tr");
      createTd("This month", thisMonthWage);
      createTd(grandTotal.paid.toLocaleString("en-IN"), thisMonthWage);
      payment_left.appendChild(thisMonthWage);

      addHr(payment_left);

      const current = document.createElement("tr");
      current.classList.add("recieved");
      createTd("Current", current);
      createTd(
        (
          previousWage -
          previousWagePayments +
          grandTotal.production -
          grandTotal.paid
        ).toLocaleString("en-IN"),
        current
      );
      payment_left.appendChild(current);
    }
  }
}

function displayProductLedger(date) {
  production[date].forEach((bill, i) => {
    const tr = document.createElement("tr");
    createTd(formatDate(date), tr, `date`, "", production[date][i].ref);
    let total = { qnt: 0, cost: 0 };
    bill.products.forEach((product) => {
      total.qnt += product.qnt;
      total.cost +=
        section === "payments"
          ? product.qnt * product.cost - product.qnt * product.wage
          : product.qnt * product.wage;
    });
    createTd(
      total.cost.toLocaleString("en-IN"),
      tr,
      "total",
      "",
      total.qnt.toLocaleString("en-IN")
    );
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
      createTd(
        Object.values(payment).toLocaleString("en-IN"),
        tr,
        "total",
        "",
        Object.keys(payment)
      );
      grandTotal.paid += Object.values(payment)[0];
    });
  } else {
    createTd(
      wage.toLocaleString("en-IN"),
      tr,
      section === "payments" ? "total" : "taka"
    );
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
        : ""
    }
    ${
      section === "task"
        ? `<div class="label"> <ion-icon name="add-outline"></ion-icon> <p>Add more tasks...</p>`
        : ""
    }
    ${
      section === "payments" || section === "wages"
        ? `<div class="label"> <ion-icon name="add-outline"></ion-icon> <p>Add payment</p>`
        : ""
    }
    ${
      section === "production"
        ? `<div class="label"> <ion-icon name="add-outline"></ion-icon> <p>Add production</p>`
        : ""
    }
    ${
      section === "cost"
        ? `<div class="label"> <ion-icon name="add-outline"></ion-icon> <p>Add Item</p>`
        : ""
    }
    </td>
    </tr>
    `);
}
function createTask(date) {
  const tr = document.createElement("tr");
  tr.classList.add("infoRow");
  let dateFormatted = formatDate(date),
    tasks = employees[person][date].tasks;
  createTd(`${dateFormatted}`, tr, `${date} date`, tasks.length);
  tasks.forEach((task) => {
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
      employees[person][date].paid.toLocaleString("en-IN"),
      tr,
      `paid`,
      tasks.length
    );
  } else {
    let pcsInLot = 0;
    tasks.forEach((item, i) => item.qnt > 0 && (pcsInLot += item.qnt));
    createTd(pcsInLot.toLocaleString("en-IN"), tr, `total`, tasks.length);
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
  let total = null;
  days.forEach((day) => {
    if (dateFilter("", day[0])) {
      if (what === "production") {
        day[1].tasks.forEach((task) => {
          total += task.qnt > 0 ? task.qnt * priceCheck(task.group) : 0;
        });
      } else if (what === "qnt") {
        if (total === null) total = {};
        day[1].tasks.forEach((task) => {
          if (total && total[task.group]) {
            total[task.group] += task.qnt;
          } else {
            total[task.group] = task.qnt;
          }
        });
      } else {
        total += day[1].paid;
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
  localStorage.setItem("costs", JSON.stringify(costs));
  btnSidebar.children[0].classList.add("unsaved");
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
    if (e.target.parentElement.classList.contains("infoRow")) {
      section === "employees" && showEmpTasks(e);
      section === "workers" && showPayments(e);
      section === "production" && showProductionDetail(e);
      section === "cost" && showCostDetail(e);
    }
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
    if (e.target.parentElement.classList.contains("infoRow")) {
      section === "employees" && showEmpTasks(e);
      section === "workers" && showPayments(e);
      section === "production" && showProductionDetail(e);
      section === "cost" && showCostDetail(e);
    }
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
    form_task_date.value = date.split(":")[0];
    itemToEdit.tasks.forEach((item) => {
      addAddmore(item.dress, item.qnt, item.group);
    });
    person !== "lots" && (form_task_recieved.value = itemToEdit.paid);
  } else if (section === "production") {
    itemsToAdd.innerHTML = "";
    let productsToEdit = production[date][index].products;
    form_bill_date.value = date.split(":")[0];
    form_bill_ref.value = production[date][index].ref;
    production[date][index].img.length > 0 &&
      uploadImg.setAttribute("data-url", production[date][index].img);
    productsToEdit.forEach((product) => {
      addAddmore(product.dress, product.qnt, product.cost, product.wage);
    });
  } else if (section === "cost") {
    itemsToAdd.innerHTML = "";
    const costId = target.parentElement.getAttribute("data-id");
    const costToEdit = costs.filter((item) => item.id === costId)[0];
    form_cost_lotNo.value = costToEdit.lotNo;
    form_cost_date.value = costToEdit.date.split(":")[0];
    form_cost_dress.value = costToEdit.dress;
    form_cost.querySelector("input[name='lotSize']").value = costToEdit.lotSize;
    costToEdit.materials.forEach((item) => {
      addAddmore(item.mat, item.qnt, item.cost);
    });
  } else if (section === "payments") {
    const date = target.className.split(" ")[0];
    const itemToEdit = production.payments[date].fabric[index];
    form_payment_date.value = date.split(":")[0];
    form_payment_for.value = Object.keys(itemToEdit)[0];
    form_payment_fabric.value = Object.values(itemToEdit)[0];
  } else if (section === "wages") {
    form_payment_date.value = date.split(":")[0];
    form_payment_wage.value = production.payments[date].wage;
  } else if (
    line.classList.contains("date") ||
    line.classList.contains("payment")
  ) {
    form_worker_payment.querySelector('input[type="number"]').value =
      target.nextElementSibling.textContent;
    form_worker_payment.querySelector('input[type="date"]').value = date.split(
      ":"
    )[0];
  }
}
function popUp_delete() {
  let date = target.className.split(" ")[0];
  if (section === "employees") {
    delete_prompt.querySelector(
      "p"
    ).textContent = `Are you sure you want to delete ${target.textContent}?`;
    delete_prompt.classList.add("active");
  } else if (section === "task") {
    if (
      employees[person][date].tasks.length === 1 ||
      line.classList.contains("infoRow") ||
      line.classList.contains("date") ||
      line.classList.contains("paid")
    ) {
      delete employees[person][date];
    } else {
      employees[person][date].tasks.splice(getIndex(target, line), 1);
    }
    updateTaskList();
  } else if (section === "production") {
    if (production[date].length === 1) {
      delete production[date];
    } else {
      production[date].splice(getIndex(target, line), 1);
    }
    updateProduction();
  } else if (section === "cost") {
    costs = costs.filter(
      (item) => item.id !== target.parentElement.getAttribute("data-id")
    );
    updateCost();
  } else if (section === "payments") {
    //needs work
    let wage = production.payments[date].wage,
      fabric = production.payments[date].fabric;
    if (wage) {
      if (wage === 0) {
        fabric.length <= 1
          ? delete production.payments[date]
          : fabric.splice(getIndex(target, line), 1);
      } else {
        fabric.splice(getIndex(target, line), 1);
      }
    } else {
      fabric.length <= 1
        ? delete production.payments[date]
        : fabric.splice(getIndex(target, line), 1);
    }
    updatePayment();
  } else if (section === "wages") {
    let fabric = production.payments[date].fabric;
    if (fabric) {
      fabric.length === 0
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
    } else if (line.classList.contains("absences")) {
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
    updateWorkerPayment();
  }
  updateLS();
}
delete_prompt.addEventListener("click", (e) => {
  if (e.target.textContent === "YES") {
    if (section === "employees") {
      delete employees[target.textContent];
      updateEmpList();
      updateLS();
    } else if (section === "workers") {
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
function clearAllData() {
  localStorage.clear();
  employees = {};
  workers = {};
  production = {};
  costs = {};
  updateCloud("emp", netlifyIdentity.currentUser());
  updateCloud("pro", netlifyIdentity.currentUser());
  updateCloud("wor", netlifyIdentity.currentUser());
  updateCloud("cos", netlifyIdentity.currentUser());
  section === "employees" && updateEmpList();
  section === "workers" && updateWorkerList();
  section === "production" && updateProduction();
  section === "payments" || (section === "wages" && updatePayment());
}
clearAll.addEventListener("mousedown", (e) => {
  e.preventDefault();
  clearAllTimer = setTimeout(() => {
    clearAllData();
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
    clearAllData();
    clearAll.querySelector("span").classList.remove("active");
  }, 2000);
  clearAll.querySelector("span").classList.add("active");
});
clearAll.addEventListener("touchend", (e) => {
  clearTimeout(clearAllTimer);
  clearAll.querySelector("span").classList.remove("active");
});

upload_li.addEventListener("click", (e) => fileInput.click());
fileInput.addEventListener("change", (e) => {
  let file = fileInput.files[0];
  if (file) {
    let fr = new FileReader();
    fr.onload = function () {
      let raw = fr.result;
      if (raw.search(`let ${section} = `) >= 0) {
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
            case "payments":
              production = JSON.parse(raw.replace("let production = ", ""));
              updateProduction();
              break;
            case "wages":
              production = JSON.parse(raw.replace("let production = ", ""));
              updateProduction();
              break;
            case "cost":
              costs = JSON.parse(raw.replace("let cost = ", ""));
              updateCost();
          }
        }
        updateLS();
        toggleSidebar();
      } else {
        alert("PLease Select a valid file.");
      }
    };
    fr.readAsText(file);
  }
});
backup.addEventListener("click", () =>
  backupOptions.classList.toggle("active")
);
backupOptions.addEventListener("click", (e) => {
  let raw = `${
    e.target.textContent === "App Backup" ? `let ${section} = ` : ""
  }${section === "employees" ? JSON.stringify(employees) : ""}${
    section === "workers" ? JSON.stringify(workers) : ""
  }${section === "production" ? JSON.stringify(production) : ""}${
    section === "cost" ? JSON.stringify(costs) : ""
  }`;
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
    case "cos":
      body = costs;
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
      updateEmpList();
    } else if (dir === "pro") {
      localStorage.setItem("production", JSON.stringify(data.record));
      production = JSON.parse(localStorage.getItem("production"));
      updateProduction();
    } else if (dir === "cos") {
      localStorage.setItem("costs", JSON.stringify(data.record));
      costs = JSON.parse(localStorage.getItem("costs"));
      updateCost();
    } else {
      localStorage.setItem("workers", JSON.stringify(data.record));
      workers = JSON.parse(localStorage.getItem("workers"));
      updateEmpList();
    }
    updateDashboard();
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
    contractorProduction = [],
    lastWeekLot = { s: 0, l: 0, f: 0, one: 0 };
  // Crunches main data!
  for (const name in employees) {
    if (name !== "lots" && name !== "iron") {
      for (const day in employees[name]) {
        const today = day.split(":")[0];
        if (dateRange.from > new Date(today)) {
          form_date_filter
            .querySelector('input[type="date"].start')
            .setAttribute("min", today);
          form_date_filter
            .querySelector('input[type="date"].end')
            .setAttribute("min", today);
        }
        if (dateRange.to < new Date(today)) {
          form_date_filter
            .querySelector('input[type="date"].start')
            .setAttribute("max", today);
          form_date_filter
            .querySelector('input[type="date"].end')
            .setAttribute("max", today);
          form_date_filter.querySelector(
            'input[type="date"].start'
          ).value = today;
          form_date_filter.querySelector(
            'input[type="date"].end'
          ).value = today;
        }
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
  sortDate(dates);
  lastDay = dates[dates.length - 1];
  // Puts data in diffrent groups
  const monthFilterValues = [];
  Object.keys(data).forEach((days, i) => {
    !monthFilterValues.includes(days.slice(0, 7)) &&
      monthFilterValues.push(days.slice(0, 7));
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
    contractorProduction.push(dailyProd);
  });
  const productionFlattened = { ...production, ...production.payments };
  delete productionFlattened.payments;
  Object.keys(production).forEach((day, i) => {
    if (day !== "payments") {
      !monthFilterValues.includes(day.slice(0, 7)) &&
        monthFilterValues.push(day.slice(0, 7));
    }
  });
  Object.keys(production.payments).forEach((day, i) => {
    !monthFilterValues.includes(day.slice(0, 7)) &&
      monthFilterValues.push(day.slice(0, 7));
  });

  monthFilter.innerHTML = "";
  const optionAll = document.createElement("option");
  optionAll.textContent = "All";
  optionAll.value = "all";
  monthFilter.appendChild(optionAll);
  const optionCustom = document.createElement("option");
  optionCustom.textContent = "Custom";
  optionCustom.value = "custom";
  monthFilter.appendChild(optionCustom);
  monthFilterValues.forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = `${months[+item.slice(5, 7) - 1]} ${item.slice(0, 4)}`;
    monthFilter.appendChild(option);
  });

  let selectedDate = dates[dates.length - 1];
  for (const date in employees.lots) {
    if (date === selectedDate) {
      employees.lots[selectedDate].tasks.forEach((item) => {
        if (item.qnt > 0) {
          if (item.group === "S") {
            lastWeekLot.s += item.qnt;
          } else if (item.group === "L") {
            lastWeekLot.l += item.qnt;
          } else if (item.group === "1") {
            lastWeek.one += item.qnt;
          } else if (item.group === "F") {
            lastWeekLot.f += item.qnt;
          }
        }
      });
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
          data: [...contractorProduction],
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

  const thisWeek = {
    production: { s: 0, l: 0, f: 0, one: 0 },
    paid: 0,
    deu: 0,
  };
  data[selectedDate].tasks.forEach((task, i) => {
    if (task.qnt !== "-") {
      if (task.group === "S") {
        thisWeek.production.s += task.qnt;
      } else if (task.group === "L") {
        thisWeek.production.l += task.qnt;
      } else if (task.group === "1") {
        thisWeek.production.one += task.qnt;
      } else if (task.group === "F") {
        thisWeek.production.f += task.qnt;
      }
    }
    thisWeek.paid = data[dates[dates.length - 1]].paid;
  });
  let thisWeekProductionTotal = 0;
  let thisWeekProductionDetail = "";
  Object.entries(thisWeek.production).forEach((task, i) => {
    thisWeekProductionTotal += task[1];
    task[1] > 0 &&
      (thisWeekProductionDetail += `${task[0].toUpperCase()} - ${task[1]}, `);
    i + 1 === Object.keys(thisWeek.production).length &&
      (thisWeekProductionDetail += "\nProduction");
  });
  weekProduction.querySelector(
    "h3"
  ).textContent = thisWeekProductionTotal.toLocaleString("en-IN");
  weekProduction.querySelector("p").textContent = thisWeekProductionDetail;
  weekPaid.querySelector("h3").textContent = thisWeek.paid.toLocaleString(
    "en-IN"
  );
  let totalInLot = 0;
  let totalLots = "";
  Object.entries(lastWeekLot).forEach((size, i) => {
    totalInLot += size[1];
    size[1] > 0 && (totalLots += `${size[0].toUpperCase()} - ${size[1]}, `);
    i + 1 === Object.keys(lastWeekLot).length && (totalLots += "\nLots");
  });
  weekLot.querySelector("h3").textContent = totalInLot.toLocaleString();
  weekLot
    .querySelector("h3")
    .setAttribute("data-diff", totalInLot - thisWeekProductionTotal);
  if (totalInLot - thisWeekProductionTotal > 0) {
    weekLot.querySelector("h3").classList.add("green");
  } else if (totalInLot - thisWeekProductionTotal < 0) {
    weekLot.querySelector("h3").classList.add("red");
  } else {
    weekLot.querySelector("h3").classList.add("none");
  }
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
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
//-3223207
const previous = 3437231;
const previousWageConst = 217345;
let currents = [];
function getSummery(i, previous) {
  const days = Object.entries(production).filter((item) => {
    return +item[0].split(":")[0].split("-")[1] - 1 === i;
  });
  const payDays = Object.entries(production.payments).filter((item) => {
    return +item[0].split(":")[0].split("-")[1] - 1 === i;
  });
  let product = 0;
  let wage = 0;
  let fabricPayment = 0;
  let wagePayment = 0;
  let current = 0;
  days.forEach((day) => {
    day[1].forEach((bill) => {
      bill.products.forEach((item) => {
        product += item.qnt * item.cost - item.qnt * item.wage;
        wage += item.qnt * item.wage;
      });
    });
  });
  payDays.forEach((payDay) => {
    if (payDay[1].fabric) {
      payDay[1].fabric.forEach(
        (pay) => (fabricPayment += +Object.values(pay)[0])
      );
    }
    payDay[1].wage && (wagePayment += payDay[1].wage);
  });
  current = Math.abs(previous) + fabricPayment + wagePayment - (product + wage);
  return {
    product: product,
    wage: wage,
    fabricPayment: fabricPayment,
    wagePayment: wagePayment,
    current: current,
  };
}
function updateSummery() {
  let current_month = -Math.abs(previous - previousWageConst);
  const currentYear = defaultDateValue().split("-")[0];
  $$(".year_filter option").forEach((item) => {
    if (item.textContent === currentYear) {
      item.setAttribute("selected", "true");
    }
  });
  summery.innerHTML = "";
  const prev = document.createElement("tr");
  prev.classList.add("prev");
  createTd(current_month.toLocaleString("en-IN"), prev);
  summery.appendChild(prev);
  for (var i = 0; i < months.length; i++) {
    const data = getSummery(i, current_month);
    if (data.current !== current_month) {
      const tr = document.createElement("tr");
      data.current > current_month && tr.classList.add("decrease");
      data.current < current_month && tr.classList.add("increase");
      createTd(months[i], tr, "month");
      createTd(data.product.toLocaleString("en-IN"), tr);
      createTd(data.wage.toLocaleString("en-IN"), tr);
      createTd(data.fabricPayment.toLocaleString("en-IN"), tr);
      createTd(data.wagePayment.toLocaleString("en-IN"), tr);
      createTd(data.current.toLocaleString("en-IN"), tr);
      summery.appendChild(tr);
    }
    current_month = data.current;
  }
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
  updateDashboard();
  (section === "payments" || section === "wages") && updatePayment();
});
fiscal_li.querySelector("p:last-child").textContent = "2020-21";
monthFilter.addEventListener("change", (e) => {
  if (monthFilter.value === "all") {
    dateRange.from = new Date(`1800-01-01:00:00`);
    dateRange.to = new Date("2200-12-31:00:00");
  } else if (monthFilter.value === "custom") {
    showDateFilterForm();
  } else {
    dateRange.from = new Date(`${monthFilter.value}-01:00:00`);
    dateRange.to = new Date(
      `${monthFilter.value}-${new Date(
        2001,
        dateRange.from.getMonth() + 1,
        0
      ).getDate()}:00:00`
    );
  }
  (section === "payments" || section === "wages") && updatePayment();
  section === "employees" && updateEmpList();
  section === "production" && updateProduction();
  section === "task" && updateTaskList();
});

function sortDate(dates) {
  return dates.sort((a, b) =>
    new Date(a.split(":")[0]) < new Date(b.split(":")[0]) ? -1 : 1
  );
}
function dateFilter(fun, date) {
  let run = false;
  const from = new Date(dateRange.from),
    to = new Date(dateRange.to),
    yearToShow = date.split(":")[1],
    dateToShow = new Date(date.split(":")[0] + ":00:00");
  to.setFullYear(dateToShow.getFullYear());
  from.setFullYear(dateToShow.getFullYear());
  if (dateToShow >= from && dateToShow <= to) {
    if (fiscalYear === "All time") {
      run = true;
    } else if (fiscalYear === yearToShow) {
      run = true;
    }
  }
  run && fun && fun(date);
  return run;
}
