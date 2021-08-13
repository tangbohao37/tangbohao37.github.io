// 包装函数
function wrapper(script) {
  return `(function (exports, require, module, __filename, __dirname) {
    ${script}
  })`;
}

// 使用wrapper
const fun = wrapper(`
  let name = '小唐同学';
  console.log(name)
  module.exports = function sayName() {
    return name;
  };
`);

console.log(fun); // fun 这个时候返回的是一个字符串  还不能执行

// 大概是这个样子
// runInThisContext(fun)(module.exports, require, module, __filename, __dirname);

function runInThisContext(fun) {
  eval(fun);
}
