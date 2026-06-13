'use strict';

const el = {
  h1Title: document.querySelector('.title'),
  balanceBtn: document.getElementById('set-balance-btn'),
  addExpenseBtn: document.getElementById('add-btn'),
  balanceAmount: document.querySelector('.money-balance'),
  balanceUI: document.querySelector('.balanceAmount'),
  expenseDescription: document.getElementById('description'),
  expenseAmount: document.getElementById('amount'),
  expenseUI: document.getElementById('transaction-list'),
  amountSpent: document.querySelector('.amount-spent'),
  reset: document.getElementById('reset-btn'),
};

let balance = Number(localStorage.getItem('savedBalance')) || 0;
const transactions =
  JSON.parse(localStorage.getItem('savedTransactions')) || [];

const addBalance = function (e) {
  e.preventDefault();
  if (Number(el.balanceAmount.value) > 0) {
    balance += Number(el.balanceAmount.value);
    el.h1Title.textContent = `Expense Tracker`;
    el.balanceAmount.value = '';
  } else {
    el.h1Title.textContent = `Balance can't be less than 0`;
    el.balanceAmount.value = '';
  }
  localStorage.setItem('savedBalance', balance);
  updateCalc();
};

el.balanceBtn.addEventListener('click', addBalance);

const updateCalc = function () {
  const totalSpent = transactions.reduce((acc, mov) => acc + mov.cost, 0);
  const remainingBalance = balance - totalSpent;

  el.amountSpent.textContent = `Total Spent $${totalSpent}`;
  el.balanceUI.textContent = remainingBalance;
  return remainingBalance;
};

const updateExpenseUI = function (mov) {
  el.expenseUI.innerHTML = '';
  // Update UI
  mov.forEach(mov => {
    const html = `
      <li>
        <span>Description: ${mov.description}</span> 
        <span>Amount: $${mov.cost}</span>
      </li>
    `;
    el.expenseUI.insertAdjacentHTML('afterbegin', html);
  });
};

const addExpense = function () {
  const expense = el.expenseDescription.value;
  const amount = Number(el.expenseAmount.value);
  //Check for valid input and valid expense
  const remaining = updateCalc();
  if (!expense || !amount) return;
  else if (amount > remaining || amount < 0)
    return (el.h1Title.textContent = `Not enough funds`);

  const expenses = {
    description: expense,
    cost: amount,
  };

  transactions.push(expenses);
  updateExpenseUI(transactions);
  updateCalc();

  const storedData = JSON.stringify(transactions);
  localStorage.setItem('savedTransactions', storedData);

  el.h1Title.textContent = 'Expense Tracker';
  el.expenseDescription.value = '';
  el.expenseAmount.value = '';
};

el.addExpenseBtn.addEventListener('click', addExpense);

const resetApp = function () {
  balance = 0;
  transactions.length = 0;
  localStorage.clear();
  updateExpenseUI(transactions);
  updateCalc();
};

el.reset.addEventListener('click', resetApp);

updateExpenseUI(transactions);
updateCalc();
