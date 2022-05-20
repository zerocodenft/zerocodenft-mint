<template>
	<div>
		<div class="text-center mb-2">
			<b-overlay :show="isBusy">
				<b-button
					v-if="soldOut"
					class="bg-gradient-primary border-0"
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
					@click="$wallet.disconnect"
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
				if (!this.$wallet.account) {
					await this.$wallet.connect()
				}

				if (this.$wallet.chainId !== +targetChainId) {
					await this.$wallet.switchNetwork(targetChainId)
				}

				this.isBusy = true

				const signedContract = this.$smartContract.connect(
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
					const wl = whitelist.map((a) => ethers.utils.getAddress(a))
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

				let total = this.mintCount * buyPrice

				if (firstXFree > 0) {
					const mintedCount = +(await signedContract.totalSupply())
					if (mintedCount < firstXFree) {
						total = 0
						const overflow = mintedCount + this.mintCount - firstXFree
						if (overflow > 0) {
							this.mintCount -= overflow
						}
						console.log({ mintedCount, overflow, mintCount: this.mintCount })
					}
				}

				const value = ethers.utils.parseEther(total.toString())

				console.log({
					buyPrice,
					total,
					value,
				})

				const gasPrice = await this.$wallet.provider.getGasPrice()
				console.log(`GAS PRICE: ${ethers.utils.formatUnits(gasPrice, 'gwei')} gwei`)

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
				if (!err) return

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

