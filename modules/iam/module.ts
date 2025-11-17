// iam Module Configuration for Nuxt
export default defineNuxtModule({
  meta: {
    name: 'iam',
    configKey: 'iam'
  },
  setup(options, nuxt) {
    console.log('iam module loaded')
  }
})
