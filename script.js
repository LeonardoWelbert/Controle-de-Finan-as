// armazenamento
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// elementos
const tbody = document.querySelector("tbody");
const desc = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const type = document.querySelector("#type");
const btnNew = document.querySelector("#btnNew");

const incomes = document.querySelector(".incomes");
const expenses = document.querySelector(".expenses");
const balance = document.querySelector(".balance");

let chart;


// --------------------
// renderizar tabela
// --------------------
function renderTransactions(){

tbody.innerHTML = "";

transactions.forEach(transaction => {

const tr = document.createElement("tr");

const icon = transaction.type === "income"
? "<i class='bx bxs-chevron-up-circle'></i>"
: "<i class='bx bxs-chevron-down-circle'></i>";

tr.innerHTML = `
<td>${transaction.desc}</td>

<td class="columnAmount">
R$ ${transaction.amount.toLocaleString("pt-BR",{minimumFractionDigits:2})}
</td>

<td>${transaction.date}</td>

<td class="columnType">${icon}</td>

<td class="columnAction">
<button class="delete">
<i class='bx bx-trash'></i>
</button>
</td>
`;

tr.querySelector(".delete").addEventListener("click", () => {

transactions = transactions.filter(t => t.id !== transaction.id);

saveData();
renderTransactions();
updateSummary();

});

tbody.appendChild(tr);

});

}


// --------------------
// adicionar transação
// --------------------
btnNew.addEventListener("click", () => {

if(desc.value === "" || amount.value === ""){
alert("Preencha todos os campos");
return;
}

const newTransaction = {

id: Date.now(),
desc: desc.value,
amount: Number(amount.value),
type: type.value,
date: new Date().toLocaleDateString("pt-BR")

};

transactions.push(newTransaction);

saveData();

renderTransactions();
updateSummary();

desc.value = "";
amount.value = "";

});


// --------------------
// salvar no localStorage
// --------------------
function saveData(){
localStorage.setItem("transactions", JSON.stringify(transactions));
}


// --------------------
// atualizar resumo
// --------------------
function updateSummary(){

let totalIncome = 0;
let totalExpense = 0;

transactions.forEach(t => {

if(t.type === "income"){
totalIncome += t.amount;
}else{
totalExpense += t.amount;
}

});

incomes.textContent = `R$ ${totalIncome.toLocaleString("pt-BR",{minimumFractionDigits:2})}`;
expenses.textContent = `R$ ${totalExpense.toLocaleString("pt-BR",{minimumFractionDigits:2})}`;
balance.textContent = `R$ ${(totalIncome-totalExpense).toLocaleString("pt-BR",{minimumFractionDigits:2})}`;

updateChart(totalIncome, totalExpense);

}


// --------------------
// gráfico
// --------------------
function updateChart(income, expense){

const ctx = document.getElementById("financeChart");

if(chart){
chart.destroy();
}

chart = new Chart(ctx,{
type:"doughnut",
data:{
labels:["Entradas","Saídas"],
datasets:[{
data:[income,expense],
backgroundColor:[
"#4CAF50",
"#F44336"
]
}]
},
options:{
responsive:true,
maintainAspectRatio:false
}
});

}


// --------------------
// inicializar sistema
// --------------------
renderTransactions();
updateSummary();