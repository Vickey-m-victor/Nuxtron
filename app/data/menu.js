/*
 * Main and demo navigation arrays
 *
 * 'to' attribute points to the route name, not the path url
 */

export default {
  main: [
    {
      name: "Dashboard",
      to: "/",
      icon: "si si-speedometer",
    },
    {
      name: "About",
      to: "/about",
      icon: "si si-info",
    },
    {
      name: "Home",
      to: "/dashboard",
      icon: "si si-home",
    }, 
    {
      name: "Profiles",
      to: "/admin/profiles",
      icon: "si si-user",
    },
    // You can also set an external link to your main navigation and it will render as a link
    // {
    //   name: "Link Name",
    //   to: "https://example.com",
    //   icon: "si si-link",
    //   target: "_blank", // You can also set its target property
    // },

    {
      name: "User Interface",
      heading: true,
    },
    {
      name: "CMS",
      icon: "si si-energy",
      subActivePaths: "/cms",
      sub: [
        {
          name: "Media",
          to: "/cms/media",
        },
        {
          name: "Pages",
          to: "/cms/pages",
        },
        {
          name: "Posts",
          to: "/cms/posts",
        },
       
      ],
    },


    {
      name: "Pages",
      heading: true,
    },
    {
      name: "Blog",
      icon: "si si-lock",
      subActivePaths: "/blog",
      sub: [
        {
          name: "Alerts",
          to: "/blog",
        },
       
      ],
    },

  ],

};
