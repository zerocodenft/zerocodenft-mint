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
					<div class="text-center">
						<b-button size="sm" variant="link" v-show="$wallet.isConnected && $wallet.canDisconnect" @click="$wallet.disconnect">Disconnect Wallet</b-button>
					</div>
					<div>
						<h6 v-if="!$siteConfig.isCounterHidden" class="pt-1 text-center">
							Minted: {{ mintedCount }}/{{ collectionSize }}
						</h6>
						<b-form-input
							v-model="mintCount"
							class="mb-2"
							size="lg"
							type="range"
							min="1"
							:max="
								$siteConfig.smartContract.maxTokensPerTransaction ||
								$siteConfig.smartContract.collectionSize
							"
							step="1">
						</b-form-input>
						<b-alert :show="!!message.text" :variant="message.variant" dismissible class="text-center">
							{{ message.text }}
						</b-alert>
						<div class="text-center">
							<b-overlay :show="isBusy">
								<b-button
									v-if="soldOut"
									class="bg-gradient-primary border-0"
									:disabled="!$siteConfig.marketplaceURL"
									:href="$siteConfig.marketplaceURL"
									target="_blank"
									>SOLD OUT</b-button
								>
								<b-button v-else class="bg-gradient-primary border-0" block @click="mint"
									>Mint [{{ mintCount }}]</b-button
								>
							</b-overlay>
						</div>
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
					class="tab px-3 pb-2">
					<WhitelistCheck />
				</b-tab>
			</b-tabs>
		</div>
	</div>
</template>

<script>
import MintMixin from '@/mixins/mint'
import { ethers } from 'ethers'
import { SALE_STATUS, getHexProof, checkWhitelisted } from '@/utils'

export default {
	layout: 'tabs',
	mixins: [MintMixin],
	data() {
		return {
			mintCount: 1,
			isBusy: false,
			message: {},
		}
	},
	methods: {
		async mint() {
			const {
				chainId: targetChainId,
				address,
				hasWhitelist,
				abi,
				whitelist,
			} = this.$siteConfig.smartContract

            this.message = {}

			try {
				if (!this.$wallet.account) {
					await this.$wallet.connect()
				}

				if (this.$wallet.chainId !== +targetChainId) {
					await this.$wallet.switchNetwork(targetChainId)
				}

				this.isBusy = true

				const signedContract = new ethers.Contract(
					address,
					abi,
					this.$wallet.provider.getSigner()
				)
				const saleStatus = await signedContract.saleStatus()

				if (saleStatus === SALE_STATUS.Paused) {
					this.message = {
						variant: 'warning',
						text: 'Minting is currently PAUSED',
					}
					return
				}

				const isPresale = saleStatus === SALE_STATUS.Presale

				if (isPresale) {
					const addressToCheck = ethers.utils.getAddress(this.$wallet.account)
					const wl = whitelist.map(a => ethers.utils.getAddress(a))
					const isWhitelisted = checkWhitelisted(wl, addressToCheck)
					console.log({ isWhitelisted })

					if (!isWhitelisted) {
						this.message = {
							variant: 'danger',
							text: `Address ${this.$wallet.accountCompact} is not whitelisted`,
						}
						return
					}
				}

				let txResponse

				const buyPrice = isPresale
					? +ethers.utils.formatEther(await signedContract.PRESALE_MINT_PRICE())
					: +ethers.utils.formatEther(await signedContract.MINT_PRICE())

				const total = this.mintCount * buyPrice
				const value = ethers.utils.parseEther(total.toString())

				console.log({
					buyPrice,
					total,
					value,
				})

				let txOverrides = {}

				if(chainId === '137') {
					// polygon requires 30 gwei min gas fee to combat spam
					// https://medium.com/stakingbits/polygon-minimum-gas-fee-is-now-30-gwei-to-curb-spam-8bd4313c83a2

					const gasPrice = await this.$wallet.provider.getGasPrice()
					console.log(ethers.utils.formatUnits(gasPrice, "gwei"))
					txOverrides = {
						gasPrice
					}
				}

				if (hasWhitelist) {
					const hexProof = getHexProof(whitelist, this.$wallet.account)
					// console.log(merkleTree.verify(hexProof, this.$wallet.account, merkleTree.getRoot()))
					txResponse = await signedContract.redeem(hexProof, this.mintCount, {
						value,
						...txOverrides
					})
				} else {
					txResponse = await signedContract.mint(this.mintCount, {
						value,
						...txOverrides
					})
				}

				console.log({ txResponse })

				txResponse.wait().then(async (res) => {
					// console.log({ res });
					this.mintedCount = Number(await signedContract.totalSupply())
					this.message = {
						variant: 'success',
						text: 'Mint confirmed!',
					}
				})

				this.message = {
					variant: 'success',
					text: 'Mint successful!',
				}
			} catch (err) {
				console.error(err)
				if(!err) return
				const { data, reason, message, code, method, error } = err
				const text =
					error?.message || data?.message || reason || message || 'Minting failed'
				this.message = {
					variant: 'danger',
					text,
				}
			} finally {
				this.isBusy = false
			}
		},
	},
}
</script>

<style lang="scss">
.tab {
	border-bottom: 1px solid lightgray;
}
.zerocode-link {
	&:hover {
		background: linear-gradient(
			100.07deg,
			#db6f3d -28.71%,
			#9534de 36.75%,
			#5fb9e6 103.59%
		);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
}
</style>
