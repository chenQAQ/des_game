'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod-cdn.conf')
const writeJson = require('write-json')
const QiniuPlugin = require('qiniu-webpack-plugin')
const utils = require('./utils')


const spinner = ora('building for production...')
spinner.start()

let cdn_ver = require('./cdn.json').version

let addVer = (ver)=>{
	let ar = ver.split('.')
	ar[2] = parseInt(ar[2]) + 1
	return ar.join('.')
}

let verNow = addVer(cdn_ver)

webpackConfig.plugins.push(new QiniuPlugin({
  ACCESS_KEY: 'E5sYahBxp7RfMECLXhCUZJD3U_BTKYGsPDS4NLFd',
  SECRET_KEY: 'mlO3FEmRX-S_9XPCf9WrkvzgnpZ8IlmHeiVrIDQF',
  bucket: 'vue',
  path: `answer/${verNow}/`
}))

webpackConfig.output.publicPath = `//kuyi.shengws.com/answer/${verNow}/`
// webpackConfig.output.filename = utils.assetsPath('js/[name].js')
// webpackConfig.output.chunkFilename = utils.assetsPath('js/[id].js')

// console.log(webpackConfig.plugins)
// console.log(typeof webpackConfig.plugins)
// console.log(Object.keys(webpackConfig.plugins))
// webpackConfig.plugins.filter((el)=>{
//   console.log(el)
// })
// return

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  console.log('run build')
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }
    console.log('verNow,',verNow)

    writeJson.promise(path.join(__dirname, './cdn.json'), {
      version: verNow
    }).then(function() {
      // do stuff
      console.log('write cdn.json ok')
    })

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
