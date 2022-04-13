// [[1,3],[2,4],[2,4],[10,11]]

//  [[1,4],[10,11]]
//  并集

const input = [
  [1, 3],
  [2, 4],
  [2, 4],
  [10, 11]
];

function fn(arr) {
  const result = [];

  for (let index = 0; index < arr.length; index++) {
    const item = arr[index];
    if (result.length === 0) {
      result.push(item);
      continue;
    }

    result.forEach((pre) => {
      // 1,3
      const [pre1, pre2] = pre;
      // 2,4
      const [cur1, cur2] = item;

      if (pre2 > cur1) {
        const tmp = [Math.min(pre1, cur1), Math.max(pre2, cur2)];
        result.pop();
        result.push(tmp);
      } else {
        result.push(item);
      }
    });
  }
  return result;
}

console.log(fn(input));
