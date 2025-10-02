const items = [
  ['બોરીંગ ફૂટ', 120, 110], ['કેસિંગ પાઇપ ISO or atlas', 120, 70],
  ['સ્ટેનર પાઇપ નંગ', 3, 90], ['સોલ્યુશન અને સ્ક્રૂ', 1, 200],
  ['ગાવલ સ્ટેનર વાળા પાઇપ', 1, 3500], ['ટેમ્પો અને ટ્રેક્ટર ભાડુ', 1, 0],
  ['સબમરસિબલ પંપ', 1, 8900], ['સ્ટાર્ટર', 1, 900],
  ['ISI & HDPE પાઇપ', 30, 45], ['ISI કેબલ મીટર 1.5MM', 36, 45],
  ['સ્ટેપ નિપલ', 2, 100], ['બોરકેપ', 1, 220],
  ['ગે. નિપલ & પરચૂરણ', 1, 200], ['નોન રિટન વાલ', 1, 250],
  ['પાટા કામ', 1, 0], ['પંપ ઉતારવાની મજૂરી', 1, 500],
  ['ખાડો ખોદવાની મજૂરી', 1, 1500]
];

function populateItems() {
  const container = document.getElementById('quoteContainer');
  container.innerHTML = '';
  items.forEach(([name, qty, rate]) => {
    const div = document.createElement('div');
    div.className = 'item-card';
    div.innerHTML = `
      <h3>${name}</h3>
      <div class="item-fields">
        <input type="number" value="${qty}" onchange="calculateTotals()">
        <input type="number" value="${rate}" onchange="calculateTotals()">
        <span class="amount">₹ ${(qty * rate).toFixed(2)}</span>
        <button class="remove-btn" onclick="this.closest('.item-card').remove(); calculateTotals();">X</button>
      </div>`;
    container.appendChild(div);
  });
  calculateTotals();
}

function calculateTotals() {
  let total = 0;
  document.querySelectorAll('.item-card').forEach(card => {
    const qty = parseFloat(card.querySelectorAll('input')[0].value) || 0;
    const rate = parseFloat(card.querySelectorAll('input')[1].value) || 0;
    const amt = qty * rate;
    card.querySelector('.amount').textContent = `₹ ${amt.toFixed(2)}`;
    total += amt;
  });
  document.getElementById('totalDisplay').innerText = `ટોટલ: ₹ ${total.toFixed(2)}`;
  const name = document.getElementById('customerName').value;
  const date = document.getElementById('quoteDate').value;
  document.getElementById('quoteTitle').innerText = `કસ્ટમર: ${name} - ${date}`;
}

function resetQuotation() {
  const today = new Date();
  document.getElementById('quoteDate').value =
    `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
  document.getElementById('customerName').value = "UBHEL";
  populateItems();
}

function downloadPDF() {
  calculateTotals();
  html
