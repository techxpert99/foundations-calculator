const DISPLAY_SIZE = 10;

let display;
let cursor;
let stack;
let dot;
let clearbit;

function display_setup() {
    display = document.querySelector('#display');
    for(let i = 0; i < DISPLAY_SIZE; i++) {
        let e = document.createElement('div');
        e.style.flex = "1 1 0";
        e.style.alignContent = "center";
        e.style.textAlign = "center";
        e.style.fontFamily = "monospace";
        e.style.fontSize = "48px";
        e.style.fontWeight = 1000;
        display.appendChild(e);
    }
    stack = [];
    dot = false;
    display = Array.from(document.querySelectorAll('#display>div'));
    display_clear(true);
}

function display_clear(zero) {
    display.forEach((n,i) => n.textContent = "");
    if(zero) {
        display[0].textContent = "0";
        display[0].style.color = "red";
    }
    cursor = 0;
    dot = false;
    clearbit = zero;
}

function display_push(c) {
    if(clearbit)
        display_clear(false);
    if(cursor === DISPLAY_SIZE)
        return;
    if(c == '.') {
        if(!dot) dot = true;
        else return;
    }
    display[cursor].style.color = "black";
    display[cursor++].textContent = c;
}

function display_pop() {
    if(cursor === 0)
        return;
    --cursor;
    if(display[cursor].textContent == ".")
        dot = false;
    display[cursor].textContent = "";
}

function display_get() {
    return display.reduce((a,n) => a + n.textContent, "");
}

function display_set(value) {
    display_clear();
    String(value).split('').forEach(c => display_push(c));
}

function calculate() {
    if(stack.length != 2)
        return;
    let b = +display_get();
    let op = stack.pop();
    let a = +stack.pop();
    let res;
    switch(op) {
        case "+":
            res = a + b;
            break;
        case '-':
            res = a - b;
            break;
        case "*":
            res = a * b;
            break;
        case "/":
            res = a / b;
            break;
    }
    display_set(res);
    clearbit = isNaN(res) || !isFinite(res);
}

function command_handler(cmd) {
    switch(cmd) {
        case "CLR":
        case "c":
        case "C":
            display_clear();
            break;
        case "DEL":
        case "Backspace":
            display_pop();
            break;
        case "+":
        case "-":
        case "*":
        case "/":
            if(stack.length)
                break;
            stack.push(display_get());
            stack.push(cmd);
            display_clear(false);
            break;
        case "=":
        case "Enter":
            calculate();
            break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
        case ".":
            display_push(cmd);
            break;
    }
}

function click_handler(e) {
    if(Array.from(e.target.classList).includes("key"))
        command_handler(e.target.id);
}

function keydown_handler(e) {
    command_handler(e.key);
}

display_setup();
document.addEventListener('click',click_handler);
document.addEventListener('keydown',keydown_handler);