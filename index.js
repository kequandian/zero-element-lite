let koa = require("koa")
let route = require("koa-route")
let koaBody = require("koa-body")
let path = require('path')
let {config} = require("./config/index.js")

let app = new koa()
app.use(koaBody());

let api = require('./api/index')

app.use(route.post('/pdf/transform',api.UrlToPdf))

console.log("服务器开启,端口是"+config.ports)
app.listen(config.ports)