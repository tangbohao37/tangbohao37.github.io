function Stack() {
    this.dataSource = [];
    this.top = 0;
    this.push = push;
    this.pop = pop;
    this.len = len;
    this.peek = peek;
}

function push(element) {
    this.dataSource[this.top++] = element;
}

function pop() {
    return this.dataSource[--this.top];
}

function peek() {
    return this.dataSource[this.top - 1];
}

function clear() {
    this.top = 0;
}

function len() {
    return this.top;
}

// 进制转换
function convert(num, base) {
    var stack = new Stack();
    var res = '';
    do {
        stack.push(num % base);
        num = Math.floor(num / base);
    } while (num > 0);
    while (stack.len() > 0) {
        res += stack.pop();
    }
    return res;
}
// console.log(convert(10, 2)) // 1010

// 表达式匹配  如：2+500-(451-100  匹配缺失的括号位置
function format(reg) {
    let stack = new Stack();
    let _reg = reg.split('');
    for (let index = 0; index < _reg.length; index++) {
        const element = _reg[index];
        switch (element) {
            case '{':
                stack.push(element);
                break;
            case '[':
                stack.push(element);
                break;
            case '(':
                stack.push(element);
                break;
            case '}':
                if ('{' === stack.peek()) {
                    stack.pop();
                } else {
                    console.log(`第${index}位缺少${stack.peek()}的结束符`);
                    return;
                }
                break;
            case ']':
                if ('[' === stack.peek()) {
                    stack.pop();
                } else {
                    console.log(`第${index}位缺少${stack.peek()}的结束符`);
                    return;
                }
                break;
            case ')':
                if ('(' === stack.peek()) {
                    stack.pop();
                } else {
                    console.log(`第${index}位缺少${stack.peek()}的结束符`);
                    return;
                }
                break;
            default:
                break;
        }
    }
    console.log('无错误');
}
// let reg = "1+2*[(5-1+]5)"
// format(reg)

/**
 *  一个算数表达式的后缀如下：
 *  op1 op2 operator
 *  设计一个函数将中缀表达式转换为后缀表达式，然后利用栈对该表达式求值
 */
function getOpPriority(op) {
    switch (op) {
        case '+':
            return 1;
        case '-':
            return 1;
        case '*':
            return 2;
        case '/':
            return 2;
        default:
            break;
    }
}

function change(reg) {
    let numStack = new Stack();
    let opStack = new Stack();
    let _reg = reg.split('');
    let regChange = '';
    for (let index = 0; index < _reg.length; index++) {
        let element = _reg[index].trim();
        if (element && !isNaN(element)) {
            // 如果是数字 进入数字栈
            numStack.push(element);
            regChange += element;
        } else {
            // 如果是符号 则进入符号栈
            regChange += element;
            if (getOpPriority(element)) {
            }
            opStack.push(element);
        }
    }
    console.log(regChange);
}
let reg = '1+(2-3)+5*7';
/**  57*123-++
 * 5    /
 * 4    *
 * 3    )
 * 2    -
 * 1    )
 *      +
 */
// change(reg);

// 一盒糖果，里面有红(1)黄(2)白(3)三种糖果， 在不改变其他糖果叠放顺序的情况下，将黄色糖果移除
let suger = [1, 2, 3, 1, 2, 3, 1, 2, 3];
function removeSuger(list) {
    let stack = new Stack();
    for (let index = list.length - 1; index >= 0; index--) {
        const element = list[index];
        if (element !== 2) {
            stack.push(element);
        }
    }
    let arr = [];
    do {
        arr.push(stack.pop());
    } while (stack.len() > 0);
    return arr;
}
let res = removeSuger(suger);
console.log(res);
