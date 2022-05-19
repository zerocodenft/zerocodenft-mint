export default {
    head() {
		return this.$siteConfig.widgetBotConfig
			? {
					script: [
						{
							src: 'https://cdn.jsdelivr.net/npm/@widgetbot/crate@3',
							async: true,
							defer: true,
							callback: () => {
								console.log(
									'this.$siteConfig.widgetBotConfig',
									this.$siteConfig.widgetBotConfig
								)
								new Crate({
									...this.$siteConfig.widgetBotConfig,
								})
							},
						},
					],
			  }
			: {}
	},
}