// Armazenamento Geral
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Elementos do DOM
const tbody = document.querySelector("tbody");
const desc = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const type = document.querySelector("#type");
const btnNew = document.querySelector("#btnNew");
const monthInput = document.querySelector("#month");

const incomes = document.querySelector(".incomes");
const expenses = document.querySelector(".expenses");
const balance = document.querySelector(".balance");

let chart;

// --- CONFIGURAÇÃO INICIAL DO MÊS ---

const dateNow = new Date();
monthInput.value = `${dateNow.getFullYear()}-${String(dateNow.getMonth() + 1).padStart(2, '0')}`;

function getFilteredTransactions() {
    return transactions.filter(t => t.monthRef === monthInput.value);
}

function renderTransactions() {
    tbody.innerHTML = "";
    const filtered = getFilteredTransactions();

    filtered.forEach(transaction => {
        const tr = document.createElement("tr");

        const icon = transaction.type === "income"
            ? "<i class='bx bxs-chevron-up-circle'></i>"
            : "<i class='bx bxs-chevron-down-circle'></i>";

        tr.innerHTML = `
            <td>${transaction.desc}</td>
            <td class="columnAmount">
                R$ ${transaction.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </td>
            <td>${transaction.date}</td>
            <td class="columnType">${icon}</td>
            <td class="columnAction">
                <button class="delete" onclick="deleteItem(${transaction.id})">
                    <i class='bx bx-trash'></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function deleteItem(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveData();
    init();
}

function updateSummary() {
    const filtered = getFilteredTransactions();
    
    let totalIncome = 0;
    let totalExpense = 0;

    filtered.forEach(t => {
        if (t.type === "income") totalIncome += t.amount;
        else totalExpense += t.amount;
    });

    const totalBalance = totalIncome - totalExpense;

    incomes.textContent = `R$ ${totalIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
    expenses.textContent = `R$ ${totalExpense.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
    balance.textContent = `R$ ${totalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

    updateChart(totalIncome, totalExpense);
}

function updateChart(income, expense) {
    const ctx = document.getElementById("financeChart");
    if (chart) chart.destroy();


    if (income === 0 && expense === 0) return;

    chart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Entradas", "Saídas"],
            datasets: [{
                data: [income, expense],
                backgroundColor: ["#2e7d32", "#d32f2f"],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

function saveData() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// --- EVENTOS ---

btnNew.addEventListener("click", () => {
    if (desc.value === "" || amount.value === "" || amount.value <= 0) {
        alert("Preencha os campos corretamente!");
        return;
    }

    const newTransaction = {
        id: Date.now(),
        desc: desc.value,
        amount: Number(amount.value),
        type: type.value,

        monthRef: monthInput.value, 
        date: new Date().toLocaleDateString("pt-BR")
    };

    transactions.push(newTransaction);
    saveData();
    init();

    desc.value = "";
    amount.value = "";
});


monthInput.addEventListener("change", () => {
    init();
});

// --- INICIALIZAÇÃO ---
function init() {
    renderTransactions();
    updateSummary();
}

init();
