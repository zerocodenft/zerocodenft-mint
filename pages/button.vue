<template>
	<div class="p-1">
		<div v-if="showCountdown">
			<Countdown :date="dropDate" />
		</div>
        <div v-else>
            <h6 v-if="!$siteConfig.isCounterHidden" class="pt-1 text-center">
                Minted: {{ mintedCount }}/{{ collectionSize }}
            </h6>
            <MintButtonV2 :soldOut="soldOut" />
            <div v-if="!$siteConfig.isAttributionHidden" class="text-center pt-2">
                <b-link
                    class="text-muted zerocode-link text-monospace"
                    href="https://zerocodenft.com"
                    target="_blank">
                    Powered by Zero Code NFT
                </b-link>
            </div>
        </div>
	</div>
</template>

<script>
import MintMixin from '@/mixins/mint'

export default {
    layout: 'no-headers',
    mixins: [MintMixin],
    head() {
		return this.$siteConfig.widgetBotConfig ?
		{
			script: [
			{
				src: 'https://cdn.jsdelivr.net/npm/@widgetbot/crate@3',
				async: true,
				defer: true,
					callback: () => {
                        console.log(this.$siteConfig.widgetBotConfig)
						new Crate({
							...this.$siteConfig.widgetBotConfig,
						})
					},
				},
			],
		}
		: {}
	}
}
</script>

<style lang="scss">

</style>
