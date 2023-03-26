const fs = require('fs')

let title = process.argv[2]
let DATE = process.argv[3]

let timeDifference = 8
let date = DATE
  ? new Date(+new Date(DATE) + timeDifference * 60 * 60 * 1000).toISOString()
  : new Date(+new Date() + timeDifference * 60 * 60 * 1000).toISOString()
let tmpDate = new Date()
let yyyy = String(tmpDate.getFullYear()).padStart(4, 0)
let mm = String(tmpDate.getMonth() + 1).padStart(2, 0)
let dd = String(tmpDate.getDate()).padStart(2, 0)

let yyyymmdd = `${yyyy}-${mm}-${dd}`

let template = `---
path: '/${title}'
slug: '${title}'
date: '${date}'
title: ''
tags: ['tag']
released: true
hidden: false
description: 'description'
---`

fs.mkdirSync(`./src/pages/${DATE || yyyymmdd}-${title}`)

fs.appendFile(
  `./src/pages/${DATE || yyyymmdd}-${title}/index.md`,
  template,
  err => {
    if (err) throw err
    console.log('New file is created')
  }
)
