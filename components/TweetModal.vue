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
import { OS_SUPPORTED_CHAINS } from '../constants'
import { isChainSupportedByOS } from '../utils/index'

export default {
	props: {
		images: Array,
		mintCount: {
			type: Number,
			default: 1,
		},
	},
	setup(_, { root }) {
		const {
			marketplaceURL,
			smartContract: {
				address,
				chainId,
				isAttributionHidden,
				name: smartContractName,
			},
		} = root.$siteConfig
		return {
			address,
			chainId,
			isAttributionHidden,
			marketplaceURL,
			smartContractName,
		}
	},
	async created() {
		console.log({murl:this.marketplaceURL})
		if (!this.marketplaceURL) {
			try {
				if (!isChainSupportedByOS(this.chainId)) {
					return
				}
				let marketplaceLink = 'https://opensea.io/collection/'
				let url = `https://api.opensea.io/api/v1/asset_contract/${this.address}`
				let options = {
					headers: {
						'X-API-KEY': this.$config.OPENSEA_API_KEY,
					},
				}
				if (
					[
						OS_SUPPORTED_CHAINS.EthereumTestnet,
						OS_SUPPORTED_CHAINS.PolygonTestnet,
						OS_SUPPORTED_CHAINS.KlaytnTestnet,
					].includes(this.chainId)
				) {
					//testnet chains
					url = `https://testnets-api.opensea.io/api/v1/asset_contract/${this.address}`
					marketplaceLink = 'https://testnets.opensea.io/collection/'
					delete options['headers']
				}
				const { data } = await this.$axios.get(url, options)
				if (data.collection) {
					this.marketplaceURL = `${marketplaceLink}${data.collection.slug}`
				} else if (this.chainId === OS_SUPPORTED_CHAINS.EthereumTestnet) {
					this.marketplaceURL = `https://goerli.pixxiti.com/collections/${this.address.toLowerCase()}`
				}
			} catch (err) {
				console.error(err)
			}
		}
	},
	computed: {
		compTitle() {
			let title = `I've just minted ${this.mintCount} NFTs from ${this.smartContractName} NFT Collection.`
			if (!this.isAttributionHidden) {
				title += ' Powered by @zero_code_nft!'
			}
			return title
		},
		compHashTags() {
			let tags = [this.smartContractName, 'nocode', 'nft', 'mint']
			if (!this.isAttributionHidden) {
				tags.unshift('zerocodenft')
			}
			return tags
		},
	},
}
</script>

<style></style>
