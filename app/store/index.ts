import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {

  state: () => ({
    // App vital details
    app: {
      body:'',
        name: "OneUI Vue Edition",
        version: "1.0.0",
        copyright: new Date().getFullYear(),
      },
    // Default layout options
    layout: {
        header: true,
        sidebar: true,
        footer: true,
      },
      // Default template settings
    // Various of them are also set in each layout variation under layouts/variations/ folder
    settings: {
        colorTheme: "", // 'amethyst', 'city', 'flat', 'modern', 'smooth'
        darkModeSystem: true,
        sidebarLeft: true,
        sidebarMini: false,
        sidebarDark: true,
        sidebarVisibleDesktop: true,
        sidebarVisibleMobile: false,
        headerFixed: true,
        headerDark: true,
        sideTransitions: true,
      },
  }),
  actions: {
    
    // Sets the layout, useful for setting different layouts (under layouts/variations/)
    setLayout(payload: { header: boolean; sidebar: boolean; footer: boolean; }) {
      this.layout.header = payload.header;
      this.layout.sidebar = payload.sidebar;
      this.layout.footer = payload.footer;
    },
    // Sets sidebar mini mode (on, off, toggle)
    sidebarMini(payload: { mode: string; }) {
      if (window.innerWidth > 991) {
        if (payload.mode === "on") {
          this.settings.sidebarMini = true;
        } else if (payload.mode === "off") {
          this.settings.sidebarMini = false;
        } else if (payload.mode === "toggle") {
          this.settings.sidebarMini = !this.settings.sidebarMini;
        }
      }
    },
    // Sets sidebar visibility (open, close, toggle)
    sidebar(payload: { mode: string; }) {
      if (payload.mode === "open") {
        this.settings.sidebarVisibleMobile = true;
      } else if (payload.mode === "close") {
        this.settings.sidebarVisibleMobile = false;
      } else if (payload.mode === "toggle") {
        this.settings.sidebarVisibleMobile = !this.settings.sidebarVisibleMobile;
      }
    },
    // Sets header mode (fixed, static, toggle)
    header(payload: { mode: string; }) {
      if (payload.mode === "fixed") {
        this.settings.headerFixed = true;
      } else if (payload.mode === "static") {
        this.settings.headerFixed = false;
      } else if (payload.mode === "toggle") {
        this.settings.headerFixed = !this.settings.headerFixed;
      }
    },
    // Sets header style (dark, light, toggle)
    headerStyle(payload: { mode: string; }) {
      if (payload.mode === "dark") {
        this.settings.headerDark = true;
      } else if (payload.mode === "light") {
        this.settings.headerDark = false;
      } else if (payload.mode === "toggle") {
        this.settings.headerDark = !this.settings.headerDark;
      }
    },
    // Sets side transitions
    setSideTransitions(payload: { transitions: any; }) {
      this.settings.sideTransitions = payload.transitions;
    },
    
  },
})