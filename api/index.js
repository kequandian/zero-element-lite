let puppeteer = require("puppeteer")
let path = require("path")
let {guid} = require('../tool/tools')
let fs = require("fs")
let send = require("koa-send")

// 检查文件夹是否存在
let isFolder = async(url) =>{
    let res = await new Promise((resolve,reject)=>{
        fs.access(path.resolve("./"+url),(err)=>{
            if(err) resolve(false)
            else resolve(true)
        })
    })
    return res
}

// 自动创建文件夹
let mkdirWithPdf = async(url) =>{
    let folderName = path.join("./"+url)
    fs.mkdir(folderName,{recursive:true},(err)=>{
        if(err) console.log("创建文件夹失败")
    })
}

// 校检url
let isHttp = (url) =>{
    let status
    if(url.indexOf("http")===0){
        status = true
    }else{
        status = false
    }
    // console.log(status)
    return status
}


// 转换pdf模块
let toPdf = async(url,options) =>{
    const {
        folder,
        pdfName = guid(),
        format = "A4"
    } = options
    let TheUrl;
    let Message
    if(url){
        if(isHttp(url)){
            TheUrl = url
        }else{
            TheUrl = path.resolve("./"+url)
        }
        
        let browser = await puppeteer.launch({headless:true})
        let page = await browser.newPage()
        await page.goto(TheUrl,{waitUntil:"networkidle0"})
        let existsFolder = await isFolder(folder)
        if(!existsFolder){
            await mkdirWithPdf(options.folder)
        }
        fs.writeFileSync(path.resolve(`./${folder}/${pdfName}.pdf`),"")
        await page.pdf({path:`./${folder}/${pdfName}.pdf`,format:format,printBackground:true})
        await browser.close();
        Message = {code:200,msg:"转换成功！",data:{
            "pdf":`${folder}/${pdfName}.pdf`,
            "name":`${pdfName}.pdf`,
            "format":format,
            "source":`${url}`
        }}
    }else{
        Message = {code:500,msg:"请输入正确的路径！"}
    }
    return Message
}

let UrlToPdf = async(ctx)=>{
    let body = ctx.request.header
    // console.log(body)
    let options = {
        folder:body["c_base_folder"]||"/pdf",
        pdfName:body["c_base_pdfname"],
        format:body["c_base_format"]
    }
    let message = await toPdf(body["c_base_url"],options)
    ctx.response.body=message
}

// 下载PDF
let downloadPdf = async(ctx,name) =>{
    const url = `pdf/${name}`
    ctx.attachment(path.resolve(url))
    await send(ctx,url)
}

module.exports={UrlToPdf,downloadPdf}
