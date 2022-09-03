<template>
	<b-modal
		id="TwitterNftShareModal"
		title="Congratulations 🎉"
		centered
		@hidden="$emit('hidden')"
		hide-footer
	>
		<div class="text-center">
			You've successfully minted {{ mintCount }} NFT{{
				mintCount > 1 ? 's' : ''
			}}
			from {{ $siteConfig.smartContract.name }} NFT collection.
			<br />
			<ShareNetwork
				ref="twitterShare"
				network="twitter"
				:url="marketplaceURL + '\n'"
				:title="compTitle"
				:hashtags="compHashTags.toString()"
			>
				<b-img src="@/assets/img/logos/twitter.svg" width="32px" />
				<span>
					Share on Twitter!
				</span>
			</ShareNetwork>
		</div>
		<div class="row d-flex justify-content-center">
			<div class="col-6 my-2" v-for="(data, i) in images" :key="i">
				<h6 class="text-muted text-center">{{ data.name }}</h6>
				<b-img-lazy
					class="rounded border border-success"
					width="200px"
					blank-color="black"
					blank-width="200px"
					:src="data.imageSrc"
				/>
			</div>
		</div>
	</b-modal>
</template>

<script>
export default {
	props: {
		images: Array,
		mintCount: {
			type: Number,
			default: 1,
		},
	},
	data() {
		return {
			marketplaceURL: this.$siteConfig.marketplaceURL,
		}
	},
	async created() {
		if (!this.marketplaceURL) {
			try {
				const isSupportedByOS = [5, 1, 80001, 137, 1001, 8217].includes(
					this.$siteConfig.smartContract.chainId
				)
				if (!isSupportedByOS) {
					return
				}
				let marketplaceLink = 'https://opensea.io/collection/'
				let url = `https://api.opensea.io/api/v1/asset_contract/${this.$siteConfig.smartContract.address}`
				let options = {
					headers: {
						'X-API-KEY': process.env.OPENSEA_API_KEY,
					},
				}
				if ([5, 80001, 1001].includes(this.$siteConfig.smartContract.chainId)) {
					url = `https://testnets-api.opensea.io/api/v1/asset_contract/${this.$siteConfig.smartContract.address}`
					marketplaceLink = 'https://testnets.opensea.io/collection/'
					delete options['headers']
				}
				const { data } = await this.$axios.get(url, options)
				if (data.collection) {
					this.marketplaceURL = `${marketplaceLink}${data.collection.slug}`
				} else if (this.$siteConfig.smartContract.chainId === 5) {
					this.marketplaceURL = `https://goerli.pixxiti.com/collections/${this.$siteConfig.smartContract.address.toLowerCase()}`
				}
			} catch (err) {
				console.error(err)
			}
		}
	},
	computed: {
		compTitle() {
			let title = `I've just minted ${this.mintCount} NFTs from ${this.$siteConfig.smartContract.name} NFT Collection.`
			if (!this.$siteConfig.smartContract.isAttributionHidden) {
				title += ' Powered by @zero_code_nft!'
			}
			return title
		},
		compHashTags() {
			let tags = [this.$siteConfig.smartContract.name, 'nocode', 'nft', 'mint']
			if (!this.$siteConfig.smartContract.isAttributionHidden) {
				tags.unshift('zerocodenft')
			}
			return tags
		},
	},
}
</script>

<style></style>
