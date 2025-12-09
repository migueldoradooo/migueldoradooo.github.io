const displayEl = document.getElementById('display');
const historyEl = document.getElementById('history');
let current = '0';
let previous = null;
let operator = null;
let justCalculated = false;

function update() {
  displayEl.textContent = current;
  historyEl.textContent = previous !== null ? `${previous} ${operator || ''}` : '';
}

function inputDigit(d) {
  if (justCalculated) {
    current = (d === '.') ? '0.' : d;
    justCalculated = false;
    return;
  }
  if (d === '.') {
    if (!current.includes('.')) current += '.';
  } else {
    current = (current === '0') ? d : current + d;
  }
}

function chooseOperator(op) {
  if (op === '%') return percent();
  if (op === 'sqrt') return sqrt();
  if (operator && !justCalculated) compute();
  previous = current;
  operator = op;
  current = '0';
}

function compute() {
  if (operator == null || previous == null) return;
  const a = parseFloat(previous);
  const b = parseFloat(current);
  let result = 0;
  switch (operator) {
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '*': result = a * b; break;
    case '/': result = b === 0 ? 'Error' : a / b; break;
  }
  current = (result === 'Error') ? result : String(roundAcc(result, 12));
  previous = null; operator = null; justCalculated = true;
}

function roundAcc(num, places) {
  if (!isFinite(num)) return 'Error';
  const p = Math.pow(10, places);
  return Math.round((num + Number.EPSILON) * p) / p;
}

function clearAll() {
  current = '0';
  previous = null;
  operator = null;
  justCalculated = false;
}

function backspace() {
  if (justCalculated) { clearAll(); return; }
  current = current.length > 1 ? current.slice(0, -1) : '0';
}

function percent() {
  current = String(parseFloat(current) / 100);
  justCalculated = true;
}

function sqrt() {
  const v = parseFloat(current);
  current = v < 0 ? 'Error' : String(Math.sqrt(v));
  justCalculated = true;
}

// Manejo de clicks
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => {
    const a = btn.dataset.action;
    if (!isNaN(a)) { inputDigit(a); update(); return; }
    if (a === '.') { inputDigit(a); update(); return; }
    if (a === 'clear') { clearAll(); update(); return; }
    if (a === 'back') { backspace(); update(); return; }
    if (a === '=') { compute(); update(); return; }
    chooseOperator(a);
    update();
  });
});

// Atajos de teclado
window.addEventListener('keydown', (e) => {
  const k = e.key;
  if ((/\\d/).test(k)) { inputDigit(k); update(); e.preventDefault(); return; }
  if (k === '.') { inputDigit('.'); update(); e.preventDefault(); return; }
  if (k === 'Enter' || k === '=') { compute(); update(); e.preventDefault(); return; }
  if (k === 'Backspace') { backspace(); update(); e.preventDefault(); return; }
  if (k === 'Escape') { clearAll(); update(); return; }
  if (k === '+' || k === '-' || k === '*' || k === '/') { chooseOperator(k); update(); e.preventDefault(); return; }
  if (k === '%') { percent(); update(); e.preventDefault(); return; }
});

update();

