function Stack() {
    this.dataSource = []
    this.top = 0
    this.push = push
    this.pop = pop
    this.len = len
    this.peek = peek
}

function push(element) {
    this.dataSource[this.top++] = element
}

function pop() {
    return this.dataSource[--this.top]
}

function peek() {
    return this.dataSource[this.top - 1]
}

function clear() {
    this.top = 0
}

function len() {
    return this.top
}

// 进制转换
function convert(num, base) {
    var stack = new Stack()
    var res = '';
    do {
        stack.push(num % base)
        num = Math.floor(num / base)
    } while (num > 0);
    while (stack.len() > 0) {
        res += stack.pop();
    }
    return res
}
// console.log(convert(10, 2)) // 1010

// 表达式匹配  如：2+500-(451-100  匹配缺失的括号位置
function format(reg) {
    let stack = new Stack()
    let _reg = reg.split("")
    for (let index = 0; index < _reg.length; index++) {
        const element = _reg[index];
        switch (element) {
            case "{":
                stack.push(element);
                break;
            case "[":
                stack.push(element);
                break;
            case "(":
                stack.push(element);
                break;
            case "}":
                if ("{" === stack.peek()) {
                    stack.pop()
                } else {
                    console.log(`第${index}位缺少${stack.peek()}的结束符`)
                    return
                }
                break;
            case "]":
                if ("[" === stack.peek()) {
                    stack.pop()
                } else {
                    console.log(`第${index}位缺少${stack.peek()}的结束符`)
                    return
                }
                break;
            case ")":
                if ("(" === stack.peek()) {
                    stack.pop()
                } else {
                    console.log(`第${index}位缺少${stack.peek()}的结束符`)
                    return
                }
                break;
            default:
                break;
        }
    }
    console.log("无错误")
}
// let reg = "1+2*[(5-1+]5)"
// format(reg)

/**
 *  一个算数表达式的后缀如下：
 *  op1 op2 operator
 *  设计一个函数将中缀表达式转换为后缀表达式，然后利用栈对该表达式求值
 */
function change(reg) {
    let numStack = new Stack();
    let opStack = new Stack();
    let _reg = reg.split("")
    for (let index = 0; index < _reg.length; index++) {
        let element = _reg[index].trim();
        if (element && Number.isNaN(element)) {
            // 如果是数字
            numStack.push(element)
        } else {
            opStack.push(element)
        }
    }
    let changedReg = ""
    let op1 = op2 = op = ""
    do {
        let tmp = ""
        do {
            tmp = opStack.pop()
            if (tmp === "(") {
                op += opStack.pop()
            }
        } while (opStack.len() === 0 || tmp === ")");
        op1 = numStack.pop()
        changedReg += op1
        op2 = numStack.pop()
        changedReg += op2
        changedReg += op
    } while (numStack.len() === 0 || opStack.len() === 0);
    console.log(changedReg)
}
function computed(op1, op2, operator) {
    return eval("${op1}${operator}${op2}")
}
let reg = "1+(2-3)*4/5"
change(reg)