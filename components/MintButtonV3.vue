<template>
	<div class="text-center">
		<BrydgeWidget v-bind="brydgeProps" />
		<b-overlay :show="isBusy" z-index="2" rounded>
			<b-button
				v-if="soldOut"
				class="mint-button font-weight-bold border-0"
				:disabled="!$siteConfig.marketplaceURL"
				:href="$siteConfig.marketplaceURL"
				target="_blank"
				>SOLD OUT</b-button
			>
			<b-button
				v-else-if="!isConnected"
				class="mint-button font-weight-bold border-0"
				@click="connect"
				>Connect Wallet</b-button
			>
			<b-button v-else class="mint-button font-weight-bold border-0" @click="mint"
				>Mint [{{ mintCount }}]</b-button
			>
		</b-overlay>
		<b-alert
			:show="message.show || !!message.text"
			:variant="message.variant"
			dismissible
			@dismissed="message = {}"
			class="mt-2">
			{{ message.text }}
		</b-alert>
		<b-button
			v-if="$route.name === 'button'"
			variant="link"
			class="mt-2 text-decoration-none"
			:disabled="isBusy"
			v-show="isConnected"
			@click="disconnectConnectedWallet"
			>Disconnect Wallet</b-button
		>
	</div>
</template>

<script>
import { ethers } from 'ethers'
import { getHexProof, wait } from '@/utils'
import { SALE_STATUS, ANALYTICS_EVENTS } from '@/constants'
import { CHAINID_CONFIG_MAP } from '@/utils/metamask'
import { BrydgeWidget } from '@brydge-network/widget'
import { useOnboard } from '@web3-onboard/vue'
import { ref, computed } from '@vue/composition-api'

export default {
	props: {
		soldOut: Boolean,
		mintCount: {
			type: Number,
			default: 1,
		},
	},
	components: {
		BrydgeWidget,
	},
	setup(_, { root }) {
		const { name: smartContractName, chainId, address, mintPrice } = root.$siteConfig.smartContract
		const hexChainId = `0x${chainId.toString(16)}`

		const {
			connectedWallet,
			connectedChain,
			connectingWallet,
			connectWallet,
			setChain,
			disconnectConnectedWallet,
		} = useOnboard()
		const isMinting = ref(false)
		const message = ref({})
		const isBusy = computed(() => isMinting.value || connectingWallet.value)
		const isConnected = computed(() => connectedWallet.value !== null)
		// const isCorrectChain = computed(() => connectedChain.value?.id === hexChainId.value)
		const walletAddress = computed(
			() => connectedWallet.value?.accounts[0]?.address
		)
		const walletProvider = computed(
			() =>
				new ethers.providers.Web3Provider(connectedWallet.value?.provider, 'any')
		)

		const checkChain = async () => {
			if (connectedChain.value?.id !== hexChainId) {
				await setChain({
					chainId: hexChainId,
				})
				await wait(1000) // to allow chains to properly switch
			}
			return connectedChain.value?.id === hexChainId
		}

		const connect = async () => {
			await connectWallet()
			if (isConnected.value) {
				root.$gtag('event', ANALYTICS_EVENTS.WalletConnected, {
					smartContractName,
					walletAddress: `address_${walletAddress.value}`, // prefix address_ cause gtag converts hex address into digits
				})
				await checkChain()
			}
		}

		const chainConfig = CHAINID_CONFIG_MAP[chainId.toString()]
		// const calldata = root.$smartContract.interface.encodeFunctionData('mint')

		const brydgeProps = {
			jsonRpcEndpoints: {
				[chainId]: chainConfig.rpcUrls[0], //accept native token by default
				43114: 'https://api.avax.network/ext/bc/C/rpc', //also avax
				250: 'https://rpc.ftm.tools' // also ftm
			},
			provider: root.$smartContract.provider,
			outputTokenAddress: 'NATIVE',
			price: mintPrice,
			title: smartContractName,
			destinationChainId: chainId,
			calls: [
				{
					_to: address,
					_value: 0, // this is calucated by calling smart contract's 'calcTotal' function, need to know # of tokens user wants to mint
					_calldata: '', // this will depend on current sales phase e.g. whitelist only vs public, etc.
				},
			],
			onConnectWallet: connect
		}

		console.log({brydgeProps})

		return {
			isBusy,
			isConnected,
			isMinting,
			message,
			walletAddress,
			walletProvider,
			connectedWallet,
			connectedChain,
			connectingWallet,
			chainConfig,
			brydgeProps,
			connect,
			checkChain,
			disconnectConnectedWallet,
		}
	},
	methods: {
		async getWL() {
			let { id, whitelist } = this.$siteConfig.smartContract
			try {
				const { data } = await this.$axios.get(`/smartcontracts/${id}/whitelist`)
				whitelist = data
			} catch {}

			// return wlData.map((a) => ethers.utils.getAddress(a))
			return whitelist
		},
		async mint() {
			const { hasWhitelist, name: smartContractName } =
				this.$siteConfig.smartContract

			this.message = {}

			try {
				const success = await this.checkChain()
				if (!success) {
					throw new Error('Chain switch request failed')
				}

				this.isMinting = true

				const saleStatus = await this.$smartContract.saleStatus()

				this.$gtag('event', ANALYTICS_EVENTS.CheckoutBegin, {
					name: smartContractName,
					walletAddress: `address_${this.walletAddress}`, // prefix address_ cause gtag converts hex address into digits
					saleStatus: SALE_STATUS[saleStatus],
					quantity: this.mintCount,
				})

				let txResponse

				const signedContract = this.$smartContract.connect(
					this.walletProvider.getSigner()
				)

				const total = await signedContract.calcTotal(this.mintCount)
				console.info({
					total: ethers.utils.formatEther(total),
				})

				const txOverrides = {
					value: total.toString(),
				}

				const provider = this.$smartContract.provider

				const { baseFeePerGas = ethers.BigNumber.from('0') } =
					await provider.getBlock('latest')
				// console.info(block, baseFeePerGas)

				// const feeData = await provider.getFeeData()
				// console.log(feeData)

				// const{ gasPrice, maxFeePerGas, maxPriorityFeePerGas } = feeData
				// console.info({
				// 	baseFeePerGas: ethers.utils.formatUnits(baseFeePerGas, 'gwei'),
				// 	gasPrice: ethers.utils.formatUnits(gasPrice, 'gwei'),
				// 	maxFeePerGas: ethers.utils.formatUnits(maxFeePerGas, 'gwei'),
				// 	maxPriorityFeePerGas: ethers.utils.formatUnits(maxPriorityFeePerGas, 'gwei')
				// })

				// EIP-1559 support check
				if (baseFeePerGas.toNumber() === 0) {
					console.info('EIP-1559 not supported, using gasPrice instead')
					txOverrides.gasPrice = await provider.getGasPrice()
				}

				if (hasWhitelist) {
					let hexProof
					if (saleStatus === SALE_STATUS.Presale) {
						const whitelist = await this.getWL()
						hexProof = getHexProof(whitelist, this.walletAddress)
					} else {
						hexProof = []
					}
					txResponse = await signedContract.redeem(
						hexProof,
						this.mintCount,
						txOverrides
					)
				} else {
					txResponse = await signedContract.mint(this.mintCount, txOverrides)
				}

				console.log({ txResponse })

				this.$gtag('event', ANALYTICS_EVENTS.CheckoutComplete, {
					name: smartContractName,
					walletAddress: `address_${this.walletAddress}`, // prefix address_ cause gtag converts hex address into digits
					saleStatus: SALE_STATUS[saleStatus],
					quantity: this.mintCount,
					total: ethers.utils.parseEther(txOverrides.value),
				})

				this.message = {
					variant: 'success',
					text: 'Transaction accepted!',
					show: 5,
				}

				txResponse.wait().then(async (res) => {
					// console.log({ res });
					this.message = {
						variant: 'success',
						text: 'Mint confirmed! 🎉',
						show: 10,
					}
				})
			} catch (err) {
				console.error(err, err.message)

				if (!err || err.message === 'JSON RPC response format is invalid') {
					return
				}

				const { data, reason, message, code, method, error } = err
				const text =
					reason || message || error?.message || data?.message || 'Minting failed'

				this.message = {
					variant: 'danger',
					text,
				}

				this.$gtag('event', ANALYTICS_EVENTS.CheckoutError, {
					name: smartContractName,
					walletAddress: `address_${this.walletAddress}`, // prefix address_ cause gtag converts hex address into digits
					message: text,
				})
			} finally {
				this.isMinting = false
			}
		},
	},
}
</script>
