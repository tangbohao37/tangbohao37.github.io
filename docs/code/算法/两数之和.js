// var twoSum = function (nums, target) {
//   const cache = {};
//   let tmp = [];
//   for (let i = 0; i < nums.length; i++) {
//     const num = nums[i]; // 2 7
//     const targetNum = target - num; // 7 2
//     const m = cache[num];
//     if (m !== undefined) {
//       tmp = [i, m];
//     } else {
//       cache[targetNum] = i; // {7:0}
//     }
//   }
//   return tmp;
// };

// console.log(twoSum([2, 7, 11, 15], 9));

const messageChannel = new MessageChannel();

messageChannel.port1.onmessage = function () {
  console.log("message chanel");
};

messageChannel.port2.postMessage("message ");

requestAnimationFrame(() => {
  console.log("rAF");
});
requestIdleCallback(() => {
  console.log("idle");
});
setTimeout(() => {
  console.log("timeout");
}, 0);

Promise.resolve().then(() => {
  console.log("micro");
});
