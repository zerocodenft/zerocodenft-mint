export default {
	head() {
		const scripts = []

		const botConfig = JSON.parse(this.$siteConfig.widgetBotConfig || '{}')
		const { server, channel } = botConfig
		if (server && channel) {
			scripts.push({
				src: 'https://cdn.jsdelivr.net/npm/@widgetbot/crate@3',
				async: true,
				defer: true,
				callback: () => {
					new Crate({
						...botConfig,
					})
				},
			})
		}
		
		return {
			script: scripts,
		}
	},
}
