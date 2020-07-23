// 获取主入口文件
const fs = require('fs')
const getModuleInfo = (file)=>{
    const body = fs.readFileSync(file,'utf-8')
    console.log(body);
}
getModuleInfo("./src/index.js")
