<template>
	<b-overlay :show="isBusy">
		<b-button
			v-if="soldOut"
			:disabled="!$siteConfig.marketplaceURL"
			:href="$siteConfig.marketplaceURL"
			target="_blank"
			>SOLD OUT</b-button
		>
		<b-button
			v-else
			class="font-weight-bold"
			block
			variant="light"
			size="lg"
			@click="mint"
			>MINT</b-button
		>
		<b-button
			variant="link"
			class="text-white mt-1"
			:disabled="isBusy"
			v-show="$wallet.isConnected && $wallet.canDisconnect"
			@click="$wallet.disconnect"
			>Disconnect Wallet</b-button
		>
	</b-overlay>
</template>

<script>
import { SALE_STATUS, getHexProof, checkWhitelisted } from '@/utils'
import { ethers } from 'ethers'
import { getExplorerUrl } from '@/utils/metamask'

export default {
	name: 'MintButton',
	props: {
		mintCount: Number,
		soldOut: Boolean,
	},
	data() {
		return {
			isBusy: false,
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
				firstXFree
			} = this.$siteConfig.smartContract

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
					this.$bvToast.toast('Minting is currently PAUSED', {
						title: 'Mint',
						variant: 'warning',
					})
					return
				}

				const isPresale = saleStatus === SALE_STATUS.Presale

				if (isPresale) {
					const addressToCheck = ethers.utils.getAddress(this.$wallet.account)
					const wl = whitelist.map((a) => ethers.utils.getAddress(a))
					const isWhitelisted = checkWhitelisted(wl, addressToCheck)
					console.log({ isWhitelisted })

					if (!isWhitelisted) {
						this.$bvToast.toast(
							`Address ${this.$wallet.accountCompact} is not whitelisted`,
							{
								title: 'Mint',
								variant: 'danger',
							}
						)
						return
					}
				}

				let txResponse

				const buyPrice = isPresale
					? +ethers.utils.formatEther(await signedContract.PRESALE_MINT_PRICE())
					: +ethers.utils.formatEther(await signedContract.MINT_PRICE())

				let total = this.mintCount * buyPrice

				if(firstXFree > 0) {					
					const mintedCount = +(await signedContract.totalSupply())
					if(mintedCount < firstXFree) {
						total = 0
						const overflow = mintedCount + this.mintCount - firstXFree
						if(overflow > 0) {
							this.mintCount -= overflow
						}
						console.log({mintedCount, overflow, mintCount: this.mintCount})
					}
				}

				const value = ethers.utils.parseEther(total.toString())

				console.log({
					buyPrice,
					total,
				})

				const gasPrice = await this.$wallet.provider.getGasPrice()
				console.log(`GAS PRICE: ${ethers.utils.formatUnits(gasPrice, 'gwei')} gwei`)

				if (hasWhitelist) {
					const hexProof = getHexProof(whitelist, this.$wallet.account)
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

				txResponse.wait().then(async (res) => {
					// console.log({ res });
					this.$emit('minted', +(await signedContract.totalSupply()))
					const msg = [
						this.createToastMessage(
							txResponse.hash,
							'Mint transaction confirmed!',
							targetChainId
						),
					]
					this.$bvToast.toast(msg, {
						title: 'Mint',
						variant: 'success',
					})
				})

				const msg = [
					this.createToastMessage(
						txResponse.hash,
						'Mint successful!',
						targetChainId
					),
				]
				this.$bvToast.toast(msg, {
					title: 'Mint',
					variant: 'success',
				})
			} catch (err) {
				console.error({ err })
				const { data, reason, message, code, method, error } = err
				this.$bvToast.toast(
					error?.message || data?.message || reason || message || 'Minting failed',
					{
						title: 'Mint',
						variant: 'danger',
					}
				)
			} finally {
				this.isBusy = false
			}
		},
		createToastMessage(hash, msg, chainId) {
			const h = this.$createElement
			return h('div', [
				h('div', [`${msg} `]),
				h(
					'b-link',
					{
						props: {
							target: '_blank',
							href: `${getExplorerUrl(chainId)}/tx/${hash}`,
						},
					},
					['View on block explorer >']
				),
			])
		},
	},
}
</script>
