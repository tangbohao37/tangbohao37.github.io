const say = require('./a');
const object = {
  name: '小唐同学',
};

console.log('b 模块中打印 say', say); // 这个时候由于 a.js 虽然打上了 cache 标记  还没有加载完成 loaded =false 所以这个时候是 {}
console.log('加载 b 文件');

setTimeout(() => {
  console.log('异步中的', say);
}, 0);
module.exports = function () {
  return object;
};
