// 注意是2个参数。 不能用  ...args
Function.prototype.myApply = function (context, args) {
  let fn = this;
  context['fn'] = fn;
  args = args ?? [];
  const res = context.fn(...args);
  return res;
};

// 一摸一样 就改了下参数
Function.prototype.myCall = function (context, ...args) {
  let fn = this;
  context['fn'] = fn;
  args = args ?? [];
  const res = context.fn(...args);
  return res;
};

var a = 2;
function fn() {
  let a = 1;
  return { a: this.a, args: arguments };
}

let obj = {
  a: 3,
};

console.log('my apply:', fn.myApply(obj, [1, 2, 3]));
console.log('origin apply:', fn.apply(obj, [1, 2, 3]));
// my apply: { a: 3, args: [Arguments] { '0': 1, '1': 2, '2': 3 } }
// origin apply: { a: 3, args: [Arguments] { '0': 1, '1': 2, '2': 3 } }

// ---

console.log('my call:', fn.myCall(obj, 1, 2, 3));
console.log('origin call:', fn.call(obj, 1, 2, 3));
// my call: { a: 3, args: [Arguments] { '0': 1, '1': 2, '2': 3 } }
// origin call: { a: 3, args: [Arguments] { '0': 1, '1': 2, '2': 3 } }
