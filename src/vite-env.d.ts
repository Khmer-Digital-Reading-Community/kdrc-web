// Tells TypeScript that any file ending in .vue is a Vue component
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}