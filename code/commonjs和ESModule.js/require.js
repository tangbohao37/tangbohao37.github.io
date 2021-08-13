function require(id) {
  // 缓存已加载的模块
  const cache = Module._cache[id];

  //  已经加载过 则直接取走 exports
  if (cache) {
    return cache.exports;
  }

  // 创建 module
  const module = { exports: {}, loaded: false };

  Module._cache[id] = module;

  // 加载文件
  runInThisContext(wrapper('module.exports = 123'))(
    module.exports,
    require,
    module,
    __filename,
    __dirname,
  );

  // 加载完成标记
  module.loaded = true;

  return module.exports;
}
