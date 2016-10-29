Streamable Buffers
==================
The purpose Streamable Buffers is to create and stream arrays of binary data.

- Stream binary data out of an readable data stream (files, network)
- Write binary data into writeable stream
- Stream binary data to browser
- Does not care about structure of binary data

# examples:

## Stream binary array into a file
```javascript
const fs = require('fs')
const StreamableBuffers = require('streamable_buffers')

const fileStream = fs.createWriteStream('data.bin')
const dataStram = StreamableBuffers.getCreatorStream()

dataStream.pipe(fileStream)

dataStream.add(Buffer.from([1,2]))
dataStream.add(Buffer.from([1,2]))
dataStream.add(Buffer.from([1,2]))

stream.done()
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

## Stream binary array to a browser client
```javascript
StreamableBuffers
  .fetch('https:/example.com/data.bin')
  .onData((buffer) => {
    //read buffer
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

## browser API

### StreamableBuffers.fetch(url)
Initiate an XmlHttpRequest to receive the requested url

### StreamableBuffers.fetch(url).onData(callback)
As soon as the request initiated by fetch receive enough bytes, the callback passed to onData is called. This callback receives an arrayBuffer containing the current binary element.
