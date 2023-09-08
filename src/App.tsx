import { useState } from "react";
import "./App.css";
import { buttonPad } from "./Constants";

function App() {
  const [answer, setAnswer] = useState("0");
  const [expression, setExpression] = useState("0");

  const et = expression.trim();

  const isOperator = (symbol: string) => {
    return /[*/+-]/.test(symbol);
  };

  const buttonPress = (symbol: string) => {
    if (symbol === "clear") {
      setAnswer("0");
      setExpression("");
    } else if (symbol === "negative") {
      if (answer === "") return;
      setAnswer(
        answer.toString().charAt(0) === "-" ? answer.slice(1) : "-" + answer
      );
    } else if (symbol === "percentage") {
      if (answer === "") return;
      setAnswer((parseFloat(answer) / 100).toString());
    } else if (isOperator(symbol)) {
      setExpression(et + " " + symbol + " ");
    } else if (symbol === "=") {
      calculate();
    } else if (symbol === "0") {
      if (expression.charAt(0) !== "0") {
        setExpression(expression + symbol);
      }
    } else if (symbol === ".") {
      const lastNumber = expression.split(/[-+*/]/g).pop();
      if (lastNumber?.includes(".")) return;
      setExpression(expression + symbol);
    } else {
      if (expression.charAt(0) === "0") {
        setExpression(expression.slice(1) + symbol);
      } else {
        setExpression(expression + symbol);
      }
    }
  };

  const calculate = () => {
    if (et.trim() === "") {
      return;
    }

    // Periksa apakah karakter terakhir adalah operator
    if (isOperator(et.charAt(et.length - 1))) {
      return;
    }

    // Memecah ekspresi menjadi bagian-bagian
    const parts = et.split(" ");
    const newParts = [];

    for (let i = parts.length - 1; i >= 0; i--) {
      if (["*", "/", "+", "-"].includes(parts[i])) {
        newParts.unshift(parts[i]);
        let j = 0;
        let k = i - 1;
        while (isOperator(parts[k])) {
          k--;
          j++;
        }
        i -= j;
      } else {
        newParts.unshift(parts[i]);
      }
    }

    const newExpression = newParts.join(" ");

    // Evaluasi ekspresi menggunakan eval() dan tangani kesalahan jika ada
    try {
      const result = eval(newExpression);
      if (typeof result === "number") {
        setAnswer(result.toString());
      } else {
        setAnswer("Error");
      }
    } catch (error) {
      setAnswer("Error");
    }

    setExpression("");
  };

  return (
    <div className="container">
      <div className="calc-logo">
        <img src="/calc-logo.png" alt="logo" />
        <p>Calculator App</p>
      </div>
      <div id="calculator">
        <div id="display" className="display">
          <div id="answer">{answer}</div>
          <div id="expression">{expression}</div>
        </div>
        {buttonPad.map((btn) => (
          <button
            id={btn.btnId}
            key={btn.btnId}
            onClick={() => buttonPress(btn.btnOnPress)}
            className={btn.btnStyle}
          >
            {btn.btnLabel}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
