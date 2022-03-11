var Folder = function (name) {
  this.name = name;
  this.files = [];
  this.parent = null;
};

Folder.prototype.add = function (file) {
  file.parent = this;
  this.files.push(file);
};

Folder.prototype.remove = function () {
  if (!this.parent) {
    return;
  }
  for (let i = 0; i < this.files.length; i++) {
    const file = this.files[i];
    if (file === this) {
      this.files.splice(i, 1);
    }
  }
};

Folder.prototype.scan = function () {
  console.log("开始扫描文件夹", this.name);

  // for (let i = 0; i < this.files.length; i++) {
  //   const file = this.files[i];
  //   file.scan()
  // }

  for (let i = 0, file, files = this.files; (file = files[i++]); ) {
    file.scan();
  }
};

File = function (name) {
  this.name = name;
  this.parent = null;
};
File.prototype.remove = function () {
  if (!this.parent) {
    return;
  }
  for (let i = 0; i < this.parent.files.length; i++) {
    const file = this.parent.files[i];
    if (file === this) {
      this.parent.files.splice(i, 1);
    }
  }
};
File.prototype.add = function () {
  throw new Error("文件下不能创建文件");
};

File.prototype.scan = function () {
  console.log("开始扫描文件", this.name);
};

// 测试
var rootFolder = new Folder("root folder");

var folder1 = new Folder("folder1");

var file1 = new File("file1");
var file2 = new File("file2");

var innerFolder = new Folder("inner folder");
var innerFile = new File("inner file");

rootFolder.add(folder1);
folder1.add(innerFolder);
folder1.add(file1);
folder1.add(file2);

innerFolder.add(innerFile);

file2.remove();

rootFolder.scan();


// 结果
// 开始扫描文件夹 root folder
// 开始扫描文件夹 folder1
// 开始扫描文件夹 inner folder
// 开始扫描文件 inner file
// 开始扫描文件 file1
