import Vue from 'vue'
import getSiteMeta from '@/utils/siteMeta'

export default {
	head() {
		const scripts = []
		const { title, description, iconURL, configs } = this.$siteConfig
		const { widgetBot, analytics } = JSON.parse(configs || '{}')

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

		// mock $gtag function in case script gets blocked
		Vue.prototype.$gtag = function() {}

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
					if(gtagId) {
						gtag('config', gtagId, { 'debug_mode': this.$config.GTAG_DEBUG })
					}
				}
			},
		})

		return {
			meta: [
				...getSiteMeta({
					title,
					description,
					mainImage: iconURL || require('@/assets/img/zerocodenft.svg')
				})
			],
			script: scripts
		}
	},
}
