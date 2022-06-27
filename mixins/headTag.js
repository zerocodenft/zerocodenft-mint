import Vue from 'vue'

export default {
	head() {
		const scripts = []

		const { widgetBot, analytics } = JSON.parse(this.$siteConfig.configs || '{}')

		// https://widgetbot.io/
		const { server, channel } = widgetBot || {}
		scripts.push({
			hid: 'widgetbot',
			src: 'https://cdn.jsdelivr.net/npm/@widgetbot/crate@3',
			async: true,
			defer: true,
			once: true,
			skip: !server || !channel,
			callback: () => {
				new Crate({
					server,
					channel,
				})
			},
		})

		const isBraveBrowser = typeof navigator.brave !== 'undefined'
		console.info({isBraveBrowser})

		if(isBraveBrowser) {
			// mock $gtag function since Brave blocks GA script
			Vue.prototype.$gtag = function() {}
		}

		// analytics
		scripts.push({
			hid: 'gtag',
			src: `https://www.googletagmanager.com/gtag/js?id=${this.$config.GTAG_ID}`,
			async: true,
			once: true,
			skip: isBraveBrowser,
			callback: () => {
				window.dataLayer = window.dataLayer || []

				function gtag() {
					dataLayer.push(arguments)
				}
				Vue.prototype.$gtag = gtag

				gtag('js', new Date())
				gtag('config', this.$config.GTAG_ID, { 'debug_mode': this.$config.GTAG_DEBUG })

				// add user defined gtag
				if(analytics) {
					const { gtagId } = analytics
					console.log({ gtagId })
					if(gtagId) {
						gtag('config', gtagId, { 'debug_mode': this.$config.GTAG_DEBUG })
					}
				}
			},
		})

		return {
			script: scripts,
		}
	},
}
