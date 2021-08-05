Function.prototype.myBind = function (context) {
  let fn = this; // 保存 this 即当前调用的 fn

  // arguments 是一个独立的对象， 虽然长得像数组但他不是数组。 这里提供2种方式
  // 1.通过 call 取值
  // let args = Array.prototype.slice.call(arguments, 1); // 提取参数
  // 2.转为数组
  let params = Array.from(arguments).slice(1);
  // 当然也可以在定义函数时 使用  function (context,...args) {}
  // args = args ?? [];

  // 这里建议不写死参数 。因为无法判断 目标函数到底有多少参数
  return function () {
    // if (this instanceof newFn) {
    //   return new fn(...arguments, ...params);
    // }
    return fn.apply(context, [...params, ...arguments]);
  };
};

// 测试
var a = 2;
function fn() {
  let a = 1;
  console.log(this.a);
  console.log(...arguments);
}

let obj = {
  a: 3,
};

const _fn = fn.myBind(obj, [4, 5]);
_fn(6, 7, 8, 9); //  3   [ 4, 5 ] 6 7 8 9

let fn2 = {
  fn: function fn() {
    let a = 1;
    console.log(this.a);
    console.log(...arguments);
  },
};

const _fn2 = fn2.fn.bind(obj, [4, 5]);
_fn2(6, 7, 8, 9); //  //  3   [ 4, 5 ] 6 7 8 9
