import React, { useState } from 'react';
import './Calculator.scss';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const handleNumberClick = (num) => {
    if (waitingForNewValue) {
      setDisplay(String(num));
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const handleDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperation = (op) => {
    const currentValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(currentValue);
    } else if (operation) {
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }

    setOperation(op);
    setWaitingForNewValue(true);
  };

  const calculate = (prev, current, op) => {
    switch (op) {
      case '+':
        return prev + current;
      case '-':
        return prev - current;
      case '*':
        return prev * current;
      case '/':
        return prev / current;
      case '%':
        return prev % current;
      default:
        return current;
    }
  };

  const handleEquals = () => {
    const currentValue = parseFloat(display);

    if (operation && previousValue !== null) {
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const handleSquareRoot = () => {
    const currentValue = parseFloat(display);
    const result = Math.sqrt(currentValue);
    setDisplay(String(result));
    setWaitingForNewValue(true);
  };

  const handleSquare = () => {
    const currentValue = parseFloat(display);
    const result = currentValue * currentValue;
    setDisplay(String(result));
    setWaitingForNewValue(true);
  };

  const handleCube = () => {
    const currentValue = parseFloat(display);
    const result = currentValue * currentValue * currentValue;
    setDisplay(String(result));
    setWaitingForNewValue(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleToggleSign = () => {
    const currentValue = parseFloat(display);
    setDisplay(String(currentValue * -1));
  };

  return (
    <div className="calculator-container">
      <div className="calculator">
        <div className="display">{display}</div>
        <div className="buttons-grid">
          <button className="btn btn-function" onClick={handleClear}>
            AC
          </button>
          <button className="btn btn-function" onClick={handleBackspace}>
            ←
          </button>
          <button className="btn btn-function" onClick={handleToggleSign}>
            +/-
          </button>
          <button className="btn btn-operation" onClick={() => handleOperation('/')}>
            ÷
          </button>
          <button className="btn btn-number" onClick={() => handleNumberClick(7)}>
            7
          </button>
          <button className="btn btn-number" onClick={() => handleNumberClick(8)}>
            8
          </button>
          <button className="btn btn-number" onClick={() => handleNumberClick(9)}>
            9
          </button>
          <button className="btn btn-operation" onClick={() => handleOperation('*')}>
            ×
          </button>
          <button className="btn btn-number" onClick={() => handleNumberClick(4)}>
            4
          </button>
          <button className="btn btn-number" onClick={() => handleNumberClick(5)}>
            5
          </button>
          <button className="btn btn-number" onClick={() => handleNumberClick(6)}>
            6
          </button>
          <button className="btn btn-operation" onClick={() => handleOperation('-')}>
            −
          </button>
          <button className="btn btn-number" onClick={() => handleNumberClick(1)}>
            1
          </button>
          <button className="btn btn-number" onClick={() => handleNumberClick(2)}>
            2
          </button>
          <button className="btn btn-number" onClick={() => handleNumberClick(3)}>
            3
          </button>
          <button className="btn btn-operation" onClick={() => handleOperation('+')}>
            +
          </button>
          <button className="btn btn-number" onClick={() => handleNumberClick(0)}>
            0
          </button>
          <button className="btn btn-number" onClick={handleDecimal}>
            .
          </button>
          <button className="btn btn-equals" onClick={handleEquals}>
            =
          </button>
          <button className="btn btn-operation" onClick={() => handleOperation('%')}>
            %
          </button>
          <button className="btn btn-square-root" onClick={handleSquareRoot}>
            √
          </button>
          <button className="btn btn-square" onClick={handleSquare}>
            x²
          </button>
          <button className="btn btn-cube" onClick={handleCube}>
            x³
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;