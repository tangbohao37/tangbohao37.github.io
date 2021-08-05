const person = {
  isHuman: false,
  printIntroduction: function () {
    console.log(`My name is ${this.name}. Am I human? ${this.isHuman}`);
  },
};

Object.prototype.MyCreate = function (context) {
  let obj = {};

  obj.__proto__ = context;
  return obj;
};

const me = Object.create(person);
me.name = 'Matthew'; // "name" is a property set on "me", but not on "person"
me.isHuman = true; // inherited properties can be overwritten
console.log(me);
me.printIntroduction();
// expected output: "My name is Matthew. Am I human? true"

const me2 = Object.MyCreate(person);

me2.name = 'Matthew'; // "name" is a property set on "me", but not on "person"
me2.isHuman = true; // inherited properties can be overwritten
console.log(me);
me2.printIntroduction();
