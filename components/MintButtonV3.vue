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
				<b-button v-else class="mint-button font-weight-bold border-0" @click="mint"
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
import { getHexProof } from '@/utils'
import { SALE_STATUS, ANALYTICS_EVENTS } from '@/constants'
import { init } from '@web3-onboard/vue'
import injectedModule from '@web3-onboard/injected-wallets'

const injected = injectedModule()
const infuraKey = '<INFURA_KEY>'
const rpcUrl = `https://mainnet.infura.io/v3/${infuraKey}`

const web3Onboard = init({
  wallets: [injected],
  chains: [
    {
      id: '0x1',
      token: 'ETH',
      label: 'Ethereum Mainnet',
      rpcUrl
    }
  ]
})

console.log(web3Onboard)

export default {
	props: {
		soldOut: Boolean,
		mintCount: {
			type: Number,
			default: 1,
		},
	},
	setup() {
	},
	data() {
		return {
			isBusy: false,
			message: {},
		}
	},
	methods: {
		async getWL() {
			const { id, whitelist } = this.$siteConfig.smartContract
			let wlData = []
			try {
				const { data } = await this.$axios.get(
					`/smartcontracts/${id}/whitelist`
				)
				wlData = data
			} catch {
				wlData = whitelist
			}

			// return wlData.map((a) => ethers.utils.getAddress(a))
			return wlData
		},
		async mint() {
			const {
				chainId: targetChainId,
				hasWhitelist,
				name
			} = this.$siteConfig.smartContract

			this.message = {}

			try {

                await web3Onboard.connectWallet()
				
			} catch (err) {
				console.error(err)

				if (!err || err.message === 'JSON RPC response format is invalid') {
					return
				}

				const { data, reason, message, code, method, error } = err
				const text =
					error?.message || data?.message || reason || message || 'Minting failed'
				this.message = {
					variant: 'danger',
					text,
				}

				this.$gtag('event', ANALYTICS_EVENTS.CheckoutError, {
					name,
					walletAddress: `address_${this.$wallet.account}`, // prefix address_ cause gtag converts hex address into digits
					message: text
				})

				// this.$wallet.rawProvider.user?.deposit()
			} finally {
				this.isBusy = false
			}
		},
		async calcTotal(mintCount, saleStatus) {
			const buyPrice =
					saleStatus === SALE_STATUS.Presale
						? await this.$smartContract.PRESALE_MINT_PRICE()
						: await this.$smartContract.MINT_PRICE()

			const calcTotalFunc = this.$smartContract.interface.fragments.find(f => f.name === 'calcTotal')

			if(calcTotalFunc) {
				// calc total needs msg.sender so call has to be signed
				const signedContract = this.$smartContract.connect(
					this.$wallet.provider.getSigner()
				)
				const needsBuyPrice = calcTotalFunc.inputs.length > 1 //for backwards compatibility

				const total = needsBuyPrice 
					? await signedContract.calcTotal(mintCount, buyPrice)
					: await signedContract.calcTotal(mintCount)

				return ethers.utils.formatEther(total)
			} else {
				// backwards compatibility
				const firstXFree = this.$siteConfig.smartContract.firstXFree
				const priceInEth = +ethers.utils.formatEther(buyPrice)
				let total = mintCount * priceInEth

				if (firstXFree > 0) {
					const mintedCount = +(await this.$smartContract.totalSupply())
					if (firstXFree > mintedCount) {
						const freeLeft = firstXFree - mintedCount
						const difference = freeLeft - mintCount
						if (difference < 0) {
							total = Math.abs(difference) * priceInEth
						} else {
							total = 0
						}
						console.log('FIRSTXFREE >> ', { mintedCount, difference, mintCount })
					}
				}

				return total.toString()
			}
		},
	},
}
</script>
