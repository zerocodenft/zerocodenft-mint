const {
	API_URL,
	AZURE_FUNCTIONS_URL,
	FORTMATIC_KEY,
	GTAG_DEBUG,
	OPENSEA_API_KEY,
} = process.env

export default {
	// Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
	ssr: false,

	alias: {
		'@ledgerhq/devices': '@ledgerhq/devices/lib-es', //https://github.com/LedgerHQ/ledger-live/issues/763
	},

	server: {
		port: 9001,
	},

	cli: {
		badgeMessages: ['Zero Code NFT 😎'],
	},

	publicRuntimeConfig: {
		API_URL,
		AZURE_FUNCTIONS_URL,
		FORTMATIC_KEY,
		GTAG_DEBUG,
		OPENSEA_API_KEY,
	},

	// Target: https://go.nuxtjs.dev/config-target
	target: 'static',

	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		htmlAttrs: {
			lang: 'en',
		},
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' }, // mobile responsive https://search.google.com/test/mobile-friendly
			{ name: 'format-detection', content: 'telephone=no' },
		],
	},

	// Global CSS: https://go.nuxtjs.dev/config-css
	//css: ['@/assets/main.scss'],
	css: ['@/assets/styles/main.scss'],

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [
		'@/plugins/cloudFns',
		'@/plugins/appConfig',
		'@/plugins/siteConfig',
		'@/plugins/wallet',
		'@/plugins/smartContract',
		'@/plugins/walletV3',
		{ src: '@/plugins/vuePlugins', mode: 'client' },
	],

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: ['@/components', '@/components/general'],

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [],

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [
		// https://go.nuxtjs.dev/bootstrap
		'bootstrap-vue/nuxt',
		'@nuxtjs/sitemap',
		'@nuxtjs/axios',
		'@nuxtjs/style-resources',
		'vue-social-sharing/nuxt',
	],

	axios: {
		baseURL: API_URL,
	},

	bootstrapVue: {
		icons: false,
	},

	styleResources: {
		scss: ['./assets/styles/_variables.scss', './assets/styles/_defaults.scss'],
	},

	sitemap: {
		hostname: 'https://mint.zerocodenft.com',
		exclude: ['/admin/**'],
		defaults: {
			changefreq: 'daily',
			priority: 1,
			lastmod: new Date(),
		},
	},

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {
		transpile: ['web3modal-vue'],
		standalone: true,
		extend(config) {
			config.module.rules.push({
				test: /\.mjs$/,
				include: /node_modules/,
				type: 'javascript/auto',
			})
		},
	},
}
