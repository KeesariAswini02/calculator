 (function(){
      const displayEl = document.getElementById('display');
      const historyEl = document.getElementById('history');
      const modeEl = document.getElementById('mode');

      let current = '0';
      let operator = null; // '+', '-', '*', '/'
      let previous = null; // previous number as string
      let waitingForNew = false; // after operator pressed

      function updateScreen(){
        displayEl.textContent = current;
        historyEl.textContent = previous ? (previous + (operator ? (' ' + operator) : '')) : '';
      }

      function clearAll(){ current = '0'; operator = null; previous = null; waitingForNew = false; updateScreen(); }
      function backspace(){
        if(waitingForNew) return;
        if(current.length === 1 || (current.length===2 && current.startsWith('-'))){ current='0'; }
        else current = current.slice(0,-1);
        updateScreen();
      }

      function inputDigit(digit){
        if(waitingForNew){ current = digit === '.' ? '0.' : digit; waitingForNew = false; updateScreen(); return; }
        if(digit === '.'){
          if(current.includes('.')) return;
          current += '.';
        } else {
          if(current === '0') current = digit; else current += digit;
        }
        updateScreen();
      }

      function handleOperator(op){
        if(operator && !waitingForNew){ // compute previous op
          compute();
        }
        operator = op;
        previous = current;
        waitingForNew = true;
        updateScreen();
      }

      function compute(){
        if(!operator || previous === null) return;
        const a = parseFloat(previous);
        const b = parseFloat(current);
        let result = 0;
        switch(operator){
          case '+': result = a + b; break;
          case '-': result = a - b; break;
          case '*': result = a * b; break;
          case '/': result = b === 0 ? NaN : a / b; break;
        }
       
        if(!isFinite(result)){
          current = 'Error';
        } else {
         
          current = parseFloat(result.toFixed(12)).toString();
        }
        operator = null; previous = null; waitingForNew = false; updateScreen();
      }
      function percent(){
        const val = parseFloat(current);
        if(isNaN(val)) return;
        current = (val / 100).toString();
        updateScreen();
      }

      // Buttons
      document.querySelectorAll('[data-num]').forEach(btn => {
        btn.addEventListener('click', e => inputDigit(btn.getAttribute('data-num')));
      });
      document.querySelectorAll('[data-op]').forEach(btn => {
        btn.addEventListener('click', e => handleOperator(btn.getAttribute('data-op')));
      });
      document.getElementById('clear').addEventListener('click', clearAll);
      document.getElementById('back').addEventListener('click', backspace);
      document.getElementById('percent').addEventListener('click', percent);
      document.getElementById('equals').addEventListener('click', compute);

    
      window.addEventListener('keydown', (e) => {
        if(e.key >= '0' && e.key <= '9') { inputDigit(e.key); e.preventDefault(); }
        else if(e.key === '.') { inputDigit('.'); e.preventDefault(); }
        else if(e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') { handleOperator(e.key); e.preventDefault(); }
        else if(e.key === 'Enter' || e.key === '=') { compute(); e.preventDefault(); }
        else if(e.key === 'Backspace') { backspace(); e.preventDefault(); }
        else if(e.key === 'Escape') { clearAll(); e.preventDefault(); }
        else if(e.key === '%') { percent(); e.preventDefault(); }
      });

     
      modeEl.textContent = 'Standard';

    
      clearAll();
    })();