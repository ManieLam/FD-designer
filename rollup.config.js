// import resolve from 'rollup-plugin-node-resolve'
// import commonjs from 'rollup-plugin-commonjs'
// import babel from 'rollup-plugin-babel'
// import externals from "rollup-plugin-node-externals"
// import { terser } from 'rollup-plugin-terser'
// import { eslint } from 'rollup-plugin-eslint'

module.exports = {
  input: './src/canvasParse.js',
  // TODO 修改为动态批量canvas处理成js
  output: {
    name: 'FDCanvasParse',
    file: './public/exportParse/FDCanvasParse.js',
    format: 'es'
  }
  // plugins: [
  // externals({devDeps: false}), // devDependencies 类型的依赖就不用加到 externals 了。
  //   resolve(), // 这样 Rollup 能找到 `ms`
  //   commonjs(), // 这样 Rollup 能转换 `ms` 为一个ES模块
  //   eslint(),
  //   babel(),
  //   terser()
  // ]
}
