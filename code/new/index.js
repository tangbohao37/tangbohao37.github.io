const myNew = function (context, ...args) {
  let obj = {};
  obj.__proto__ = context.prototype;
  context.apply(obj, args);
  return obj;
};

function person(name, age) {
  this.name = name;
  this.age = age;
}

let p = myNew(person, '布兰', 12);
console.log(p); // { name: '布兰', age: 12 }
