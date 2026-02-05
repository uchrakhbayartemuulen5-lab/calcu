const huree = document.createElement("div");
huree.classList.add("hur");

const main = document.createElement("div");
main.classList.add("main");
main.innerText = "0";
huree.appendChild(main);

const box = document.createElement("div");
box.classList.add("hairtsag");

function makeBtn(text, extraClass = "") {
  const b = document.createElement("button");
  b.classList.add("ur");
  if (extraClass) b.classList.add(extraClass);
  b.innerText = text;
  return b;
}

const buttons = [
  "AC",
  "+",
  "-",
  "%",
  "7",
  "8",
  "9",
  "x",
  "4",
  "5",
  "6",
  "/",
  "1",
  "2",
  "3",
  "=",
  "0",
  ".",
];

buttons.forEach((t) => {
  const btn = t === "0" ? makeBtn(t, "zero") : makeBtn(t);
  box.appendChild(btn);
});

huree.appendChild(box);
document.body.appendChild(huree);

let expr = "";
let justSolved = false;

const isOperator = (ch) => ["+", "-", "*", "/", "%"].includes(ch);

function render() {
  main.innerText = expr.length ? expr : "0";
}

function appendValue(v) {
  if (justSolved && !["+", "-", "x", "/", "%"].includes(v)) {
    expr = "";
  }
  justSolved = false;

  if (v === "x") v = "*";

  if (!expr && (v === "*" || v === "/" || v === "%")) return;

  const last = expr[expr.length - 1];
  if (last && isOperator(last) && isOperator(v)) {
    expr = expr.slice(0, -1) + v;
    render();
    return;
  }

  if (v === ".") {
    const parts = expr.split(/[\+\-\*\/\%]/);
    const lastNum = parts[parts.length - 1];
    if (lastNum.includes(".")) return;
    if (lastNum === "") expr += "0";
  }

  expr += v;
  render();
}

function clearAll() {
  expr = "";
  justSolved = false;
  render();
}

function evaluateExpr() {
  if (!expr) return;

  while (expr.length && isOperator(expr[expr.length - 1])) {
    expr = expr.slice(0, -1);
  }
  if (!expr) return;

  try {
    if (!/^[0-9+\-*/%.]+$/.test(expr)) throw new Error("Bad input");

    const result = Function(`"use strict"; return (${expr});`)();

    if (!Number.isFinite(result)) throw new Error("Math error");

    const pretty =
      Math.abs(result) % 1 !== 0
        ? Number(result.toFixed(10)).toString()
        : result.toString();

    expr = pretty;
    justSolved = true;
    render();
  } catch {
    main.innerText = "Error";
    expr = "";
    justSolved = false;
  }
}

box.querySelectorAll("button.ur").forEach((btn) => {
  btn.addEventListener("click", () => {
    const v = btn.innerText.trim();

    if (v === "AC") return clearAll();
    if (v === "=") return evaluateExpr();

    appendValue(v);
  });
});

document.addEventListener("keydown", (e) => {
  const k = e.key;

  if (k === "Escape") return clearAll();
  if (k === "Enter" || k === "=") return evaluateExpr();

  if ("0123456789".includes(k)) return appendValue(k);
  if (k === ".") return appendValue(".");
  if (k === "+") return appendValue("+");
  if (k === "-") return appendValue("-");
  if (k === "*") return appendValue("x");
  if (k === "/") return appendValue("/");
  if (k === "%") return appendValue("%");
});
