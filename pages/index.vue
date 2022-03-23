<template>
	<b-container id="container" fluid>
		<b-row id="landing" :style='{
			"backgroundImage": `url("${$siteConfig.backgroundImageURL}")`,
			"backgroundSize": "100% 100%"
		}'>
			<b-col
				class="d-flex align-items-center justify-content-center backdrop-blur">
				<b-jumbotron
					:header="$siteConfig.title"
					:lead="$siteConfig.description"
					class="shadow text-center jumbo"
					bg-variant="dark"
					text-variant="white">
					<div v-if="showCountdown">
						<Countdown :date="dropDate" />
					</div>
					<div v-else>
						<h4 v-if="!this.$siteConfig.smartContract.isCounterHidden" class="pt-2 text-light">
							Minted: {{ mintedCount }}/{{ collectionSize }}
						</h4>
						<b-form-spinbutton
							class="mx-auto my-3"
							v-model="mintCount"
							min="1"
							:max="$siteConfig.smartContract.maxTokensPerTransaction || $siteConfig.smartContract.collectionSize"
						>
						</b-form-spinbutton>
						<MintButton :mintCount="mintCount" :soldOut="soldOut" @minted="onMinted" />
					</div>
				</b-jumbotron>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
import MintMixin from '@/mixins/mint'

export default {
	mixins: [MintMixin],
	data() {
		return {
			mintCount: 1,
		}
	},
	methods: {
		onMinted(val) {
			this.mintedCount = val
		}
	}
}
</script>

<style lang="scss" scoped>
#container {
	overflow: hidden;
	min-height: calc(100vh - 164px);
}

#landing {
	min-height: inherit;
}

.backdrop-blur {
	backdrop-filter: blur(1px);
}

.jumbo {
	max-width: 60%;
	overflow-wrap: break-word;
}

@media (max-width: 600px) {
	.jumbo {
		max-width: 100%;
	}
	.display-3 {
		font-size: 3rem;
	}
}
</style>
