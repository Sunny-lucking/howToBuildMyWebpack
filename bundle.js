const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')
const getModuleInfo = (file)=>{
    const body = fs.readFileSync(file,'utf-8')
    const ast = parser.parse(body,{
        sourceType:'module' //表示我们要解析的是ES模块
    });
    const deps = {}
    traverse(ast,{
        ImportDeclaration({node}){
            const dirname = path.dirname(file)
            const abspath = "./" + path.join(dirname,node.source.value)
            deps[node.source.value] = abspath
        }
    })
    const {code} = babel.transformFromAst(ast,null,{
        presets:["@babel/preset-env"]
    })
    const moduleInfo = {file,deps,code}
    return moduleInfo
}
const parseModules = (file) =>{
    const entry =  getModuleInfo(file)
    const temp = [entry]
    const depsGraph = {}
    for (let i = 0;i<temp.length;i++){
        const deps = temp[i].deps
        if (deps){
            for (const key in deps){
                if (deps.hasOwnProperty(key)){
                    temp.push(getModuleInfo(deps[key]))
                }
            }
        }
    }
    temp.forEach(moduleInfo=>{
        depsGraph[moduleInfo.file] = {
            deps:moduleInfo.deps,
            code:moduleInfo.code
        }
    })
    return depsGraph
}
const bundle = (file) =>{
    const depsGraph = JSON.stringify(parseModules(file))
    return `(function (graph) {
        function require(file) {
            function absRequire(relPath) {
                return require(graph[file].deps[relPath])
            }
            var exports = {};
            (function (require,exports,code) {
                eval(code)
            })(absRequire,exports,graph[file].code)
            return exports
        }
        require('${file}')
    })(${depsGraph})`

}
const content = bundle('./src/index.js')

console.log(content);

//写入到我们的dist目录下
fs.mkdirSync('./dist');
fs.writeFileSync('./dist/bundle.js',content)
