Promise.MyRace = function (list) {
  return new Promise((resolve, reject) => {
    for (let index = 0; index < list.length; index++) {
      const p = list[index];
      p.then((res) => {
        return resolve(res);
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
  setTimeout(() => {
    console.log(3);
    resolve(3);
  }, 2000);
});
Promise.MyRace([p1, p2, p3]).then((res) => {
  console.log("接收数据", res);
});
