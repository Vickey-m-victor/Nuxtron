/**
 * Menu Composable
 * Handles dynamic menu loading from backend with fallback to hardcoded menus
 */

import staticMenu from '@/data/menu'

/**
 * Convert backend menu format to OneUI menu format
 * Backend format: { label, icon, route, submenus? }
 * OneUI format: { name, icon, to, sub? }
 */
function convertBackendMenuToOneUI(backendMenus: any): any[] {
  const converted: any[] = []

  // Process each module's menus (e.g., iam, admin, etc.)
  Object.keys(backendMenus).forEach(moduleKey => {
    const moduleMenus = backendMenus[moduleKey]
    
    if (!Array.isArray(moduleMenus)) {
      return
    }

    // Add module heading
    converted.push({
      name: moduleKey.toUpperCase(),
      heading: true
    })

    // Convert each menu item
    moduleMenus.forEach((item: any) => {
      const menuItem: any = {
        name: item.label,
        icon: item.icon ? `si si-${item.icon}` : 'si si-circle'
      }

      // Handle route
      if (item.route && item.route !== '#') {
        menuItem.to = `/${item.route}`
      }

      // Handle submenus
      if (item.submenus && Array.isArray(item.submenus)) {
        menuItem.sub = item.submenus.map((submenu: any) => ({
          name: submenu.label,
          to: submenu.route && submenu.route !== '#' ? `/${submenu.route}` : '#'
        }))
        
        // Set subActivePaths for submenu active state
        if (item.route && item.route !== '#') {
          menuItem.subActivePaths = `/${item.route}`
        }
      }

      converted.push(menuItem)
    })
  })

  return converted
}

/**
 * Get menu items (backend menus + hardcoded menus)
 */
export const useMenu = () => {
  const authStore = useAuthStore()

  /**
   * Get complete menu structure
   * Priority: Backend menus first, then hardcoded menus
   */
  const getMenuItems = computed(() => {
    const menuItems: any[] = []



    // 1. Add hardcoded menus (fallback or additional items)
    if (staticMenu.main && staticMenu.main.length > 0) {
      // Add separator if we have backend menus
      if (menuItems.length > 0) {
        menuItems.push({
          name: 'Application',
          heading: true
        })
      }
      
      menuItems.push(...staticMenu.main)
    }

        // 2. Add backend menus if available
    if (authStore.user.menus && Object.keys(authStore.user.menus).length > 0) {
      const backendMenus = convertBackendMenuToOneUI(authStore.user.menus)
      menuItems.push(...backendMenus)
    }

    // 3. If no backend menus and no hardcoded menus, return default
    if (menuItems.length === 0) {
      return [
        {
          name: 'Dashboard',
          to: '/dashboard',
          icon: 'si si-speedometer'
        }
      ]
    }

    return menuItems
  })

  /**
   * Get only backend menus
   */
  const getBackendMenus = computed(() => {
    if (!authStore.user.menus || Object.keys(authStore.user.menus).length === 0) {
      return []
    }
    return convertBackendMenuToOneUI(authStore.user.menus)
  })

  /**
   * Get only hardcoded menus
   */
  const getStaticMenus = computed(() => {
    return staticMenu.main || []
  })

  /**
   * Check if user has backend menus
   */
  const hasBackendMenus = computed(() => {
    return authStore.user.menus && Object.keys(authStore.user.menus).length > 0
  })

  return {
    getMenuItems,
    getBackendMenus,
    getStaticMenus,
    hasBackendMenus
  }
}
