<template>
	<div
		class="zc-container d-flex justify-content-center align-items-center"
		:style="{
			backgroundImage: `url(&quot;${$siteConfig.backgroundImageURL}&quot;)`,
			backgroundSize: '100% 100%',
		}">
		<b-jumbotron
			:header="$siteConfig.title"
			:lead="$siteConfig.description"
			class="shadow text-center jumbo py-4"
			bg-variant="dark"
			text-variant="white">
			<div v-if="showCountdown">
				<Countdown :date="dropDate" />
			</div>
			<div v-else>
				<h4 v-if="!$siteConfig.isCounterHidden" class="pt-2 text-light">
					Minted: {{ mintedCount }}/{{ collectionSize }}
				</h4>
				<b-form-spinbutton
					class="mx-auto my-3"
					v-model="mintCount"
					min="1"
					:max="
						$siteConfig.smartContract.maxTokensPerTransaction ||
						$siteConfig.smartContract.collectionSize
					">
				</b-form-spinbutton>
				<MintButton :mintCount="mintCount" :soldOut="soldOut" @minted="onMinted" />
			</div>
		</b-jumbotron>
	</div>
</template>

<script>
import MintMixin from '@/mixins/mint'

export default {
	mixins: [MintMixin],
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
	data() {
		return {
			mintCount: 1,
		}
	},
	methods: {
		onMinted(val) {
			this.mintedCount = val
		},
	},
}
</script>

<style lang="scss" scoped>

.backdrop-blur {
	// backdrop-filter: blur(1px);
}
</style>
