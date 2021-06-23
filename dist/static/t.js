const base64 = require('base64')

let encode = base64(JSON.stringify('abcdefg'))
console.log(encode)