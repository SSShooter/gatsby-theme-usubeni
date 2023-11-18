const fs = require('fs')

// Fetch command line arguments
const args = process.argv.slice(2) // Remove default first two parameters

// Define parameters and their default values
const expectedArgs = {
  '-t': null, // title
  '-d': null, // date
  '-f': false, // create file
}

// Iterate through provided arguments
for (let i = 0; i < args.length; i++) {
  const arg = args[i]

  if (expectedArgs.hasOwnProperty(arg)) {
    // Check for boolean-type parameters (parameters that do not require values)
    if (typeof expectedArgs[arg] === 'boolean') {
      expectedArgs[arg] = true // Enable this functionality
    } else {
      // If not a boolean-type parameter, check if the next argument exists as its value
      const value = args[i + 1]
      if (!value || value.startsWith('-')) {
        console.error('Error: Missing argument value -', arg)
        console.log('Correct usage: node myfile.js -t <value for t> -f -d')
        process.exit(1) // Terminate due to parameter error
      }
      expectedArgs[arg] = value // Store parameter value
      i++ // Skip the next argument (value)
    }
  } else {
    console.error('Error: Invalid argument -', arg)
    console.log('Correct usage: node myfile.js -t <value for t> -f -d')
    process.exit(1) // Terminate due to invalid parameter
  }
}

console.log('Provided parameters:', expectedArgs)

const title = expectedArgs['-t'] || 'new-post'
let date = expectedArgs['-d']
  ? new Date(+new Date(expectedArgs['-d'])).toISOString()
  : new Date(+new Date()).toISOString()
let tmpDate = new Date()
let yyyy = String(tmpDate.getFullYear()).padStart(4, 0)
let mm = String(tmpDate.getMonth() + 1).padStart(2, 0)
let dd = String(tmpDate.getDate()).padStart(2, 0)

let yyyymmdd = `${yyyy}-${mm}-${dd}`

let template = `---
slug: '/${title}'
date: '${date}'
title: ''
tags: ['tag']
released: true
hidden: false
description: 'description'
---`

const isCreateFile = expectedArgs['-f']
const name = `${yyyymmdd}-${title}`
if (isCreateFile) {
  fs.appendFile(`./src/pages/${name}.md`, template, (err) => {
    if (err) throw err
    console.log('New file is created')
  })
} else {
  fs.mkdirSync(`./src/pages/${name}`)
  fs.appendFile(`./src/pages/${name}/index.md`, template, (err) => {
    if (err) throw err
    console.log('New file is created')
  })
}
