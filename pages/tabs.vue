<template>
	<div>
		<div v-if="showCountdown">
			<Countdown :date="dropDate" />
		</div>
		<div v-else>
			<b-tabs
				content-class="mt-3"
				justified
				active-nav-item-class="font-weight-bold text-zerocodenft">
				<b-tab title="Mint" active class="tab px-3 pb-2 border-0">
					<div>
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
				</b-tab>
				<b-tab
					v-if="$siteConfig.smartContract.hasWhitelist"
					title="Whitelist"
					lazy
					class="tab px-3 pb-2 border-0">
					<WhitelistCheck />
				</b-tab>
			</b-tabs>
		</div>
	</div>
</template>

<script>
import MintMixin from '@/mixins/mint'

export default {
    layout: 'no-headers',
    mixins: [MintMixin],
}
</script>

<style lang="scss">
.tab {
	border-bottom: 1px solid lightgray;
}
</style>
