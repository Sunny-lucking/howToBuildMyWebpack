  # 手写webpack核心原理
  ## 一、核心打包原理
  ### 1.1 打包的主要流程如下
  1. 需要读到入口文件里面的内容。
  2. 分析入口文件，递归的去读取模块所依赖的文件内容，生成AST语法树。
  3. 根据AST语法树，生成浏览器能够运行的代码
  ### 1.2 具体细节
  1. 获取主模块内容
  2. 分析模块
     - 安装@babel/parser包（转AST）
  3. 对模块内容进行处理
     - 安装@babel/traverse包（遍历AST）
     - 安装@babel/core和@babel/preset-env包   （es6转ES5）
  4. 递归所有模块
  5. 生成最终代码
  
  ## 二、基本准备工作
  
  我们先建一个项目
  
  项目目录暂时如下：
  
![](https://imgkr.cn-bj.ufileos.com/7c3daf8f-4b96-40a0-ae9a-2c14a8258c6b.png)

>已经把项目放到 **github**：https://github.com/Sunny-lucking/howToBuildMyWebpack。 可以卑微地要个star吗

  我们创建了add.js文件和minus.js文件,然后 在index.js中引入，再将index.js文件引入index.html。
  

  
  代码如下:
  
add.js
```
export default (a,b)=>{
  return a+b;
}
```
minus.js

```js
export const minus = (a,b)=>{
    return a-b
}
```
index.js

```js
import add from "add"
import {minus} from "./minus";

const sum = add(1,2);
const division = minus(2,1);

console.log(sum);
console.log(division);
```
index.html

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<script src="./src/index.js"></script>
</body>
</html>
```

现在我们打开index.html。你猜会发生什么？？？显然会报错，因为浏览器还不能识别import语法

![](https://imgkr.cn-bj.ufileos.com/3397e5a7-5654-4df2-9c37-86038cd145df.png)

不过没关系，因为我们本来就是要来解决这些问题的。
