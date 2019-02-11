const fs = require('fs')

let timeDifference = 8
let date = new Date(+new Date() + timeDifference * 60 * 60 * 1000).toISOString()
let tmpDate = new Date()
let yyyy = String(tmpDate.getFullYear()).padStart(4,0)
let mm = String(tmpDate.getMonth() + 1).padStart(2,0)
let dd = String(tmpDate.getDate()).padStart(2,0)

let yyyymmdd = `${yyyy}-${mm}-${dd}`
let title = process.argv[2]

let template = `---
path: '/${title}'
date: '${date}'
title: '${title}'
tags: ['tag']
---`

fs.mkdirSync(`./src/pages/${yyyymmdd}-${title}`)

fs.appendFile(`./src/pages/${yyyymmdd}-${title}/index.md`, template, err => {
  if (err) throw err
  console.log('数据已追加到文件')
})
