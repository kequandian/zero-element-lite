rm -rf ./pdf-cli
# 初始化命令
echo "开始初始化"
echo "开始下载工具"
git clone git@gitee.com:aedge/AE_PdfTransform.git --single-branch pdf-cli
cd pdf-cli
echo "准备安装"
npm i
echo "安装工具完成"
