<template>
	<web3-modal-vue
		ref="web3modal"
		:theme="theme"
		:provider-options="providerOptions" />
</template>

<script>
import Web3ModalVue from 'web3modal-vue'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Fortmatic from "fortmatic";
import { CHAINID_CONFIG_MAP } from '@/utils/metamask'

const wcConfig = {
	package: WalletConnectProvider,
	options: {
		rpc: Object.entries(CHAINID_CONFIG_MAP)
			.filter(([k, _]) => !isNaN(k))
			.reduce((acc, val) => {
				const [key, value] = val
				const rpcUrl = value.rpcUrls[0]
				acc[key] = rpcUrl
				return acc
			}, {})
	}
}

export default {
	components: {
		Web3ModalVue,
	},
	data() {
		return {
			theme: 'light',
			providerOptions: {
				walletconnect: wcConfig
			},
		}
	},
	created() {
		const chainId = this.$siteConfig.smartContract.chainId
		const supportsFortmatic = [4,1,80001,137,97,56].includes(+chainId) //supported chains

		if(supportsFortmatic) {
			const rpcUrlMap = {
				'80001': 'https://testnet2.matic.network',
				'137': 'https://alpha.ethereum.matic.network',
				'4': 'https://rinkeby.infura.io/v3/98302611de2949f1bd81e48d0b52d279',
				'1': 'https://mainnet.infura.io/v3/98302611de2949f1bd81e48d0b52d279'
			}

			this.providerOptions.fortmatic = {
				package: Fortmatic,
				options: {
					key: this.$config.FORTMATIC_KEY,
					network: {
						chainId: chainId,
						rpcUrl: rpcUrlMap[chainId]
					}
				}
			}
		}
		if (
			window.matchMedia &&
			window.matchMedia('(prefers-color-scheme: dark)').matches
		) {
			this.theme = 'dark'
		}
	},
	mounted() {
		this.$nextTick(async () => {
			const web3modal = this.$refs.web3modal
			// console.log(web3modal)
			// web3modal.onClose(console.log('onClose'))
			// web3modal.onConnect(() => console.log('on connect'))
			this.$wallet.web3Modal = web3modal
			if (web3modal.cachedProvider) {
				await this.$wallet.connect()
			}
		})
	}
}
</script>
