<template>
	<div>
		<div class="text-center mb-2">
			<b-overlay :show="isBusy" z-index="2">
				<b-button
					v-if="soldOut"
					class="mint-button font-weight-bold border-0"
					:disabled="!$siteConfig.marketplaceURL"
					:href="$siteConfig.marketplaceURL"
					target="_blank"
					>SOLD OUT</b-button
				>
				<b-button
					v-else
					class="mint-button font-weight-bold border-0"
					@click="mint"
					>Mint [{{ mintCount }}]</b-button
				>
				<b-button
					variant="link"
					class="text-light mt-1"
					:disabled="isBusy"
					v-show="$wallet.isConnected && $wallet.canDisconnect"
					@click="() => $wallet.disconnect()"
					>Disconnect Wallet</b-button
				>
			</b-overlay>
		</div>
		<b-alert
			:show="message.show || !!message.text"
			:variant="message.variant"
			dismissible
			class="text-center">
			{{ message.text }}
		</b-alert>
	</div>
</template>

<script>
import { ethers } from 'ethers'
import { getHexProof, checkWhitelisted } from '@/utils'
import { SALE_STATUS } from '@/constants'

export default {
	props: {
		soldOut: Boolean,
		mintCount: {
			type: Number,
			default: 1,
		},
	},
	data() {
		return {
			isBusy: false,
			message: {},
		}
	},
	methods: {
		async mint() {
			const {
				chainId: targetChainId,
				hasWhitelist,
				whitelist,
				firstXFree,
			} = this.$siteConfig.smartContract

			this.message = {}

			try {
				
				if (!this.$wallet.isConnected) {
					await this.$wallet.connect()
				}

				if (this.$wallet.chainId !== +targetChainId) {
					await this.$wallet.switchNetwork(targetChainId)
				}

				this.isBusy = true

				const saleStatus = await this.$smartContract.saleStatus()

				if (saleStatus === SALE_STATUS.Paused) {
					this.message = {
						variant: 'warning',
						text: 'Minting is currently PAUSED',
					}
					return
				}

				const isPresale = saleStatus === SALE_STATUS.Presale

				if (isPresale) {

					let wlData = whitelist
					try { 
						const smId = this.$siteConfig.smartContract.id
						const { data } = await this.$axios.get(`/smartcontracts/${smId}/whitelist`)
						wlData = data
					} catch {}

					const addressToCheck = ethers.utils.getAddress(this.$wallet.account)
					const wl = wlData.map((a) => ethers.utils.getAddress(a))
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
					? +ethers.utils.formatEther(await this.$smartContract.PRESALE_MINT_PRICE())
					: +ethers.utils.formatEther(await this.$smartContract.MINT_PRICE())

				let total = this.mintCount * buyPrice

				if (firstXFree > 0) {
					const mintedCount = +(await this.$smartContract.totalSupply())
					if (firstXFree > mintedCount) {
						const freeLeft = firstXFree - mintedCount
						const difference = freeLeft - this.mintCount
						if(difference < 0) {
							total = Math.abs(difference) * buyPrice
						} else {
							total = 0
						}
						console.log('FIRSTXFREE >> ', { mintedCount, difference, mintCount: this.mintCount })
					}
				}

				const value = ethers.utils.parseEther(total.toString())
				const gasPrice = await this.$wallet.provider.getGasPrice()

				console.log({
					buyPrice,
					total,
					gasPrice: `${ethers.utils.formatUnits(gasPrice, 'gwei')} gwei`
				})

				const signedContract = this.$smartContract.connect(
					this.$wallet.provider.getSigner()
				)

				if (hasWhitelist) {
					const hexProof = getHexProof(whitelist, this.$wallet.account)
					// console.log(merkleTree.verify(hexProof, this.$wallet.account, merkleTree.getRoot()))
					txResponse = await signedContract.redeem(hexProof, this.mintCount, {
						value,
						gasPrice,
					})
				} else {
					txResponse = await signedContract.mint(this.mintCount, {
						value,
						gasPrice,
					})
				}

				console.log({ txResponse })

				this.message = {
					variant: 'success',
					text: 'Mint successful!',
					show: 5,
				}

				txResponse.wait().then(async (res) => {
					// console.log({ res });
					this.message = {
						variant: 'success',
						text: 'Mint confirmed! 🎉',
					}
				})
			} catch (err) {
				console.error(err)

				if(!err || err.message === 'JSON RPC response format is invalid') {
					return
				}

				const { data, reason, message, code, method, error } = err
				const text =
					error?.message || data?.message || reason || message || 'Minting failed'
				this.message = {
					variant: 'danger',
					text,
				}

				// this.$wallet.rawProvider.user?.deposit()
			} finally {
				this.isBusy = false
			}
		},
	},
}
</script>

