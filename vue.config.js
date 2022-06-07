module.exports = {
  // publicPath: process.env.IS_ELECTRON ? "app://." : process.env.BASE_URL,
  // publicPath: process.env.NODE_ENV === "production" ? "/Frontend/" : "/",
  // outputDir: "docs",
  // devServer: {
  // 	https: true,
  // 	hotOnly: false,
  // },
  pwa: {
    name: 'Interactive Kiosk',
    themeColor: '#538fff',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'public/service-worker.js',
    },
  },
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "@/variables.scss";`,
      },
    },
  },
  pluginOptions: {
    electronBuilder: {
      chainWebpackRendererProcess(config) {
        config.plugins.delete('workbox');
        config.plugins.delete('pwa');
      },
    },
  },
  // configureWebpack: {
  // 	target: "electron-renderer",
  // },
};
