Streamable Buffers
==================
The purpose Streamable Buffers is to create and stream arrays of binary data.

- Stream binary data out of an readable data stream (files, network)
- Write binary data into writeable stream
- Does not care about structure of binary data
- ~~Stream binary data to browser~~ WIP

# examples:

## Stream binary array into a file
```javascript
const fs = require('fs')
const StreamableBuffers = require('streamable_buffers')

const fileStream = fs.createWriteStream('data.bin')
const dataStream = StreamableBuffers.getCreatorStream()

dataStream.pipe(fileStream)

dataStream.add(Buffer.from([1,2]))
dataStream.add(Buffer.from([1,2]))
dataStream.add(Buffer.from([1,2]))

dataStream.done()
```

## Stream binary array out of a file
```javascript
const fs = require('fs')
const StreamableBuffers = require('streamable_buffers')

const dataStream = fs.createReadStream('data.bin').pipe(StreamableBuffers.getReaderStream())

dataStream.on('data', (buffer) => {
  // read buffer
})
```

## Node.js API

### Streamablebuffers.getCreatorStream()
creates a CreatorStream

### CreatorStream
A readable stream that emits a streamable buffer. As this is a streamable buffer you can pipe it into a writable stream, such as file or network writable streams

### creatorStream.add(buffer)
Adds a buffer to the outgoing streamable buffer

### Streamablebuffers.getReaderStream()
creates a ReaderStream

### ReaderStream
A Duplex stream that reader from a readable stream such as a file or network readable streams and emits the binary array items.
