declare const __webpack_init_sharing__: any
declare const __webpack_share_scopes__: any
declare const window: any

const cache: Record<string, Promise<any>> = {}

/**
 * exposeKey: ./App
 * moduleName: example-app
 * moduleUrl: http://localhost:8082/example-app.js
 */
export async function dynamicImportModule({
  exposeKey,
  moduleName,
  moduleUrl,
}: {
  exposeKey: string
  moduleUrl: string
  moduleName: string
}) {
  const cacheKey = moduleUrl
  if (!cache[cacheKey]) {
    cache[cacheKey] = new Promise(async (resolve, reject) => {
      try {
        await __webpack_init_sharing__('default')

        await new Promise<void>((resolve, reject) => {
          const element = document.createElement('script')

          element.src = moduleUrl
          element.type = 'text/javascript'
          element.async = true

          element.onload = () => {
            element.parentElement.removeChild(element)
            resolve()
          }

          element.onerror = (err) => {
            element.parentElement.removeChild(element)
            reject(err)
          }

          document.head.appendChild(element)
        })

        const container = window[moduleName]
        console.log(`${cacheKey} init type ${typeof container.init}`)
        await container.init(__webpack_share_scopes__.default)

        const factory = await container.get(exposeKey)
        resolve(factory())
      } catch (e) {
        reject(e)
      }
    })
  }

  return await cache[cacheKey]
}
