<template>
	<div class="text-center">
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
			<b-dropdown
				v-else-if="isConnected && isMetaMask && !isMobile"
				split
				block
				split-class="split-mint-button font-weight-bold border-0"
				menu-class="w-100 text-center"
				toggle-class="split-mint-toggle"
				:text="`Mint [${mintCount}]`"
				@click="mint"
			>
				<b-dropdown-item @click="reconnectMetamask"
					>Select Different Wallet</b-dropdown-item
				>
				<b-dropdown-item @click="disconnectConnectedWallet"
					>Disconnect</b-dropdown-item
				>
			</b-dropdown>

			<b-button
				v-else
				class="mint-button font-weight-bold border-0"
				@click="mint"
				>Mint [{{ mintCount }}]</b-button
			>
		</b-overlay>
		<b-alert
			:show="message.show || !!message.text"
			:variant="message.variant"
			dismissible
			@dismissed="message = {}"
			class="mt-2"
		>
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
		<TweetModal
			:images="mintedTokens"
			:mintCount="mintCount"
			@hidden="handleTweetModalHide"
		></TweetModal>
	</div>
</template>

<script>
import { ethers } from 'ethers'
import { getHexProof, wait } from '@/utils'
import { SALE_STATUS, ANALYTICS_EVENTS } from '@/constants'
import { useOnboard } from '@web3-onboard/vue'
import { ref, computed, watch } from '@vue/composition-api'
import { mapMutations } from 'vuex'
export default {
	props: {
		soldOut: Boolean,
		mintCount: {
			type: Number,
			default: 1,
		},
	},
	setup(_, { root }) {
		const mintedTokens = ref([])
		const { name: smartContractName, chainId } = root.$siteConfig.smartContract
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
		const isMetaMask = computed(
			() => connectedWallet.value?.label === 'MetaMask'
		)
		const walletAddress = computed(
			() => connectedWallet.value?.accounts[0]?.address
		)
		const walletProvider = computed(
			() =>
				new ethers.providers.Web3Provider(
					connectedWallet.value?.provider,
					'any'
				)
		)
		const isMobile = computed(() => {
			let check = false
			;(function (a) {
				if (
					/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
						a
					) ||
					/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
						a.substr(0, 4)
					)
				)
					check = true
			})(navigator.userAgent || navigator.vendor || window.opera)
			return check
		})

		function reconnectMetamask() {
			walletProvider.value
				.send('wallet_requestPermissions', [{ eth_accounts: {} }])
				.catch(console.error)
		}

		// const accountCenter$ = root.$onboard.state.select('accountCenter')
		// const { unsubscribe: unsubscribeAC } = accountCenter$.subscribe(
		// 	async ({expanded}) => {
		// 		console.log(expanded)
		// 		if(expanded) {
		// 			const { label, accounts } = connectedWallet.value
		// 			if(label === 'MetaMask' && accounts?.length > 0) {

		// 				const permissions = await walletProvider.value.send('wallet_getPermissions')
		// 				const { value: connectedMMWallets } = permissions[0].caveats.find(x => x.type === 'restrictReturnedAccounts')
		// 				console.log(connectedWallet.value, connectedMMWallets)
		// 				root.$onboard.state.actions.updateWallet(label, { // updateWallet is not exposed
		// 					accounts: accounts.filter(a => connectedMMWallets.includes(a.address))
		// 				})
		// 			}
		// 		}
		// 	}
		// )

		watch(connectedWallet, async (newVal, oldVal) => {
			// connected wallet emits twice hence this check
			try {
				const isRedundant =
					newVal?.label === oldVal?.label &&
					JSON.stringify(newVal?.accounts) === JSON.stringify(oldVal?.accounts)

				if (!newVal || isRedundant) return

				const { label, accounts } = newVal

				if (label === 'MetaMask') {
					const [{ address: primaryWallet }] = accounts
					const [activeWallet] = await walletProvider.value.listAccounts()

					// console.log({
					// 	primaryWallet,
					// 	activeWallet,
					// })

					const normalizedPrimaryWallet = ethers.utils.getAddress(primaryWallet)
					const noramlizedActiveWallet = ethers.utils.getAddress(activeWallet)

					const permissions = await walletProvider.value.send(
						'wallet_getPermissions'
					)
					const { value: connectedMMWallets } = permissions[0].caveats.find(
						(x) => x.type === 'restrictReturnedAccounts'
					)

					const isConnectedInMM =
						connectedMMWallets
							.map((a) => ethers.utils.getAddress(a))
							.find((a) => a === normalizedPrimaryWallet) !== undefined

					const isActive = normalizedPrimaryWallet === noramlizedActiveWallet

					const shouldRequest = !isConnectedInMM || !isActive

					if (shouldRequest) {
						await walletProvider.value.send('wallet_requestPermissions', [
							{ eth_accounts: {} },
						])
					}
				}
			} catch (e) {
				console.error(e)
			}
		})

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
			connect,
			checkChain,
			disconnectConnectedWallet,
			reconnectMetamask,
			isMetaMask,
			mintedTokens,
			isMobile,
		}
	},
	methods: {
		...mapMutations(['setBusy']),
		async getWL() {
			let { id, whitelist } = this.$siteConfig.smartContract
			try {
				const { data } = await this.$axios.get(
					`/smartcontracts/${id}/whitelist`
				)
				whitelist = data
			} catch {}

			return whitelist
		},
		async mint() {
			const {
				hasWhitelist,
				name: smartContractName,
			} = this.$siteConfig.smartContract

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
				console.log('signedContract: ', signedContract)

				const total = await signedContract.calcTotal(this.mintCount)
				console.info({
					total: ethers.utils.formatEther(total),
				})

				const txOverrides = {
					value: total.toString(),
				}

				const provider = this.$smartContract.provider

				const {
					baseFeePerGas = ethers.BigNumber.from('0'),
				} = await provider.getBlock('latest')
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

				const txReceipt = await txResponse.wait()
				this.message = {
					variant: 'success',
					text: 'Mint confirmed! 🎉',
					show: 10,
				}
				await this.$onboard.state.actions.updateBalances([this.walletAddress])
				let events = txReceipt.events.slice(0, 3)
				this.setBusy({ isBusy: true })
				const tokenURIPromises = events.map((e) =>
					signedContract.tokenURI(e.args.tokenId)
				)
				const tokenURIs = await Promise.all(tokenURIPromises)

				const metadataPromises = tokenURIs.map((uri) =>
					fetch('https://ipfs.io/ipfs/' + uri.replace('ipfs://', ''))
				)
				const metadataResponses = await Promise.all(metadataPromises)

				for (const res of metadataResponses) {
					if (!res.ok) {
						console.log(res.statusText)
						return
					}
					const json = await res.json()
					this.mintedTokens.push({
						name: json.name,
						imageSrc:
							'https://ipfs.io/ipfs/' + json.image.replace('ipfs://', ''),
					})
				}
				this.setBusy({ isBusy: false })
				this.$bvModal.show('TwitterNftShareModal')
				this.$confetti.start({
					particles: [{ type: 'rect' }],
				})
			} catch (err) {
				console.error(err, err.message)

				if (!err || err.message === 'JSON RPC response format is invalid') {
					return
				}

				const { data, reason, message, error } = err
				const text =
					reason ||
					message ||
					error?.message ||
					data?.message ||
					'Minting failed'

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
				this.setBusy({ isBusy: false })
			}
		},
		handleTweetModalHide() {
			this.$confetti.stop()
			this.mintedTokens = []
		},
	},
}
</script>
