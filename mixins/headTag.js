export default {
	head() {
		const scripts = []

		const { widgetBotConfig, analytics } = this.$siteConfig

		// https://widgetbot.io/
		const { server, channel } = JSON.parse(widgetBotConfig || '{}')
		if (server && channel) {
			scripts.push({
				src: 'https://cdn.jsdelivr.net/npm/@widgetbot/crate@3',
				async: true,
				defer: true,
				callback: () => {
					new Crate({
						server,
						channel,
					})
				},
			})
		}

		// analytics
		scripts.push({
			src: `https://www.googletagmanager.com/gtag/js?id=${this.$config.GTAG_ID}`,
			async: true,
			callback: () => {
				window.dataLayer = window.dataLayer || []

				function gtag() {
					dataLayer.push(arguments)
				}
				window.gtag = gtag

				gtag('js', new Date())
				gtag('config', this.$config.GTAG_ID, { 'debug_mode': process.env.NODE_ENV !== 'production'})

				// add user defined gtag
				const { gtagId } = JSON.parse(analytics || '{}')
				console.log({ gtagId })
				if(gtagId) {
					gtag('config', gtagId)
				}
			},
		})

		return {
			script: scripts,
		}
	},
}
