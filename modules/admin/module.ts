// admin Module Configuration for Nuxt
export default defineNuxtModule({
  meta: {
    name: 'admin',
    configKey: 'admin'
  },
  setup(options, nuxt) {
    console.log('admin module loaded')
  }
})
