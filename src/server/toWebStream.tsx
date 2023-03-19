import contentType from 'content-type'
import { IncomingMessage } from 'http'
import httpError from 'http-errors'
import { Http2ServerRequest } from 'http2'

import { Readable } from 'stream'
import type { Inflate, Gunzip } from 'zlib'
import zlib from 'zlib'
import{ Response, Request } from 'undici'
import { TransformStream, ReadableStream } from 'web-streams-polyfill/ponyfill'
Object.assign(globalThis, { TransformStream, ReadableStream, Response, Request })

function toWeb(nodeStream) {
  // Assumes the nodeStream has not ended/closed

  if (Readable.toWeb) {
    return Readable.toWeb(nodeStream)
  }

  var destroyed = false
  var listeners = {}

  function start(controller) {
    listeners['data'] = onData
    listeners['end'] = onData
    listeners['end'] = onDestroy
    listeners['close'] = onDestroy
    listeners['error'] = onDestroy
    for (var name in listeners) nodeStream.on(name, listeners[name])

    nodeStream.pause()

    function onData(chunk) {
      if (destroyed) return
      controller.enqueue(chunk)
      nodeStream.pause()
    }

    function onDestroy(err) {
      if (destroyed) return
      destroyed = true

      for (var name in listeners)
        nodeStream.removeListener(name, listeners[name])

      if (err) controller.error(err)
      else controller.close()
    }
  }

  function pull() {
    if (destroyed) return
    nodeStream.resume()
  }

  function cancel() {
    destroyed = true

    for (var name in listeners) nodeStream.removeListener(name, listeners[name])

    nodeStream.push(null)
    nodeStream.pause()
    if (nodeStream.destroy) nodeStream.destroy()
    else if (nodeStream.close) nodeStream.close()
  }

  return new ReadableStream({ start: start, pull: pull, cancel: cancel })
}

function decompressed(
  req: IncomingMessage,
  encoding: string
): IncomingMessage | Inflate | Gunzip {
  switch (encoding) {
    case 'identity':
      return req
    case 'deflate':
      return req.pipe(zlib.createInflate())
    case 'gzip':
      return req.pipe(zlib.createGunzip())
  }
  throw httpError(415, `Unsupported content-encoding "${encoding}".`)
}

export function toWebStream(req: IncomingMessage | Http2ServerRequest) {
  if (req instanceof IncomingMessage) {
    const typeInfo = contentType.parse(req)

    const charset = typeInfo.parameters.charset?.toLowerCase() ?? 'utf-8'

    if (!charset.startsWith('utf-')) {
      throw httpError(415, `Unsupported charset "${charset.toUpperCase()}".`)
    }

    const contentEncoding = req.headers['content-encoding']
    const encoding =
      typeof contentEncoding === 'string'
        ? contentEncoding.toLowerCase()
        : 'identity'
    const stream = decompressed(req, encoding)

    return toWeb(stream)
  } else {
    return toWeb(req)
  }
}
