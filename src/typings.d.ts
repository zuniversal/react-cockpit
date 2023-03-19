declare module '*.jpeg'
declare module '*.jpg'
declare module '*.png'
declare module '*.svg'
declare module '*.module.less' {
  const classes: { readonly [key: string]: string }
  export default classes
}
