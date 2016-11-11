const SIZE_OF_INT = 4

class StreamableBuffers{
  constructor(xhr){
    this.xhr = xhr
    this.pos = 0
    xhr.addEventListener("progress", (e) => {
      if(!xhr.response) return

      let data = new DataView(xhr.response)

      if(!this.totalElements) {
        this.totalElements = data.getUint32(0)
        this.pos += SIZE_OF_INT
      }

      while(data.byteLength - this.pos >= valueOrDefault(this.currentElementSize, SIZE_OF_INT)) {
        if(!this.currentElementSize){
          this.currentElementSize = data.getUint32(this.pos);
          this.pos += SIZE_OF_INT
        } else if(data.byteLength - this.pos >= this.currentElementSize){
          const buffer = data.buffer.slice(this.pos, this.pos + this.currentElementSize)
          this.pos += this.currentElementSize
          this.currentElementSize = undefined
          this.onDataCallback(buffer)
        }
      }
    })
  }

  start(url) {
    this.xhr.open("GET", url)
    // this.xhr.responseType = "arraybuffer"
    // this.xhr.responseType = "stream"
    this.xhr.send()
  }

  onData(callback) {
    this.onDataCallback = callback
  }

  static fetch(url) {
    var xhr = new XMLHttpRequest()
    var streamableBuffers = new StreamableBuffers(xhr)
    streamableBuffers.start(url)

    return streamableBuffers;
  }
}

function valueOrDefault(value, defaultValue) {
  if(value)
    return value
  else
    return defaultValue
}

export default StreamableBuffers
