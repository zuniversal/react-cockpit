import { toWebStream } from './toWebStream'
import { BlobWriter, ZipReader } from '@zip.js/zip.js'
import fs from 'fs'
import http from 'http'
import path from 'path'

const publicDir = path.resolve(__dirname, './public')

http
  .createServer(async (req, res) => {
    if (req.method?.toUpperCase() !== 'POST') {
      res.end('ok')
      return
    }

    try {
      const readable = toWebStream(req)
      const zipReader = new ZipReader({ readable })
      const files = await zipReader.getEntries()
      const statsFile = files.find((item) => item.filename === 'stats.json')
      const indexHtml = files.find((item) => item.filename === 'index.html')
      if (!statsFile || !indexHtml) {
        throw new Error('Invalid')
      }
      for (const file of files) {
        const { filename } = file
        const fullFilename = path.resolve(publicDir, `./${filename}`)
        const dirname = path.dirname(fullFilename)
        await fs.promises.mkdir(dirname, { recursive: true })

        const blobWriter = new BlobWriter()
        const blob = await file.getData(blobWriter)
        await fs.promises.writeFile(
          fullFilename,
          Buffer.from(await blob.arrayBuffer())
        )
      }

      await zipReader.close()
      res.end('ok')
    } catch (e) {
      console.log(e)
      res.statusCode = 400
      res.end(e.message)
    }
  })
  .listen(8091, () => {
    console.log('Server listening on port 8091')
  })

export {}
