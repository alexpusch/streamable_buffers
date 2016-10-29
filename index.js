// Writer = require('./lib/writer.js')

// const buffers = [];

// const n = 10e5;


// for(let i = 0; i < n; i++){
//   let buffer = Buffer.alloc(3 * 4)
//   buffer.writeUInt32BE(i)
//   buffer.writeUInt32BE(i)
//   buffer.writeUInt32BE(i)

//   buffers.push(buffer);
// }

// Writer.writeFile('test.bin', buffers)


const StreamableBufferReader = require('./lib/reader')
const fs = require('fs')

s = fs.createReadStream('test.bin')
  .pipe(new StreamableBufferReader())
  // .pipe(process.stdout)

s.on('data', function(buffer){
  console.log('data', buffer.readUInt32BE(0))
})

