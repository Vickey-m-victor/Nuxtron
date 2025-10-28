/**
 * CMS module composable for handling content management data
 * This will be auto-imported and available in all CMS module pages
 */
export const useCmsData = () => {
  const cmsData = ref({
    totalPosts: 3,
    totalPages: 4,
    totalMedia: 12,
    lastBackup: new Date().toISOString()
  })

  const getCmsStats = () => {
    return {
      postsPublished: 2,
      postsDraft: 1,
      pagesPublished: 3,
      pagesDraft: 1,
      mediaSize: '32.4 MB'
    }
  }

  const updateCmsData = (newData: any) => {
    cmsData.value = { ...cmsData.value, ...newData }
  }

  return {
    cmsData: readonly(cmsData),
    getCmsStats,
    updateCmsData
  }
}
