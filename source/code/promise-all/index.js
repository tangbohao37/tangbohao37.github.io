Promise.MyAll = function (list) {
  let count = 0;
  let result = [];
  return new Promise((resolve, reject) => {
    for (let index = 0; index < list.length; index++) {
      const p = list[index];
      p.then((res) => {
        result[index] = res;
        count++;
        count === list.length && resolve(result);
      });
    }
  });
};

const p1 = new Promise((resolve, reject) => {
  console.log(1);
  resolve(1);
});
const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log(2);
    resolve(2);
  }, 1000);
});
const p3 = new Promise((resolve, reject) => {
  console.log(3);
  resolve(3);
});
Promise.MyAll([p1, p2, p3]).then((res) => {
  console.log(res);
});

/**
1
3
2
[ 1, 2, 3 ]
 */
