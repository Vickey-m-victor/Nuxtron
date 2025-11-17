// reporting Module Configuration for Nuxt
export default defineNuxtModule({
  meta: {
    name: 'reporting',
    configKey: 'reporting'
  },
  setup(options, nuxt) {
    console.log('reporting module loaded')
  }
})
