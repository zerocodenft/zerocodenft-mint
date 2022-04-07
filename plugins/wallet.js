import Vue from 'vue'
import { ethers } from 'ethers'
import MetaMaskOnboarding from '@metamask/onboarding'
import { getCurrency, CHAINID_CONFIG_MAP } from '@/utils/metamask'

export default (ctx, inject) => {

    // console.log(new Vue().$bvModal)

    const wallet = Vue.observable({
        account: null,
        accountCompact: 'Connect Wallet',
        network: null,
        balance: null,
        provider: null,
        web3Modal: null,

        get hexChainId() {
            return '0x' + this.network?.chainId?.toString(16)
        },
        get networkName() {
            return this.network?.name
        },
        get chainId() {
            return this.network?.chainId
        },

        async connect() {
            // if(!MetaMaskOnboarding.isMetaMaskInstalled()) {
            //     const onboarding = new MetaMaskOnboarding()
            //     onboarding.startOnboarding()
            //     return
            // }
            if(!this.web3Modal) throw Error("Web3 modal is not initialized")
        
            const instance = await this.web3Modal.connect()
            this.provider = new ethers.providers.Web3Provider(instance)

            this.provider.on('accountsChanged', ([newAddress]) => {
                console.info('accountsChanged', newAddress)
                this.setAccount(newAddress)
            })
            this.provider.on('chainChanged', async (chainId) => {
                console.info('chainChanged', chainId)
                this.init()
            })

            this.network = await this.provider.getNetwork()
            const [account] = await this.provider.listAccounts()

            console.info('wallet connected', {account})
            !!account && this.setAccount(account)
        },

        disconnect() {
            this.web3Modal.clearCachedProvider()
            wallet.account = null
            wallet.accountCompact = 'Connect Wallet'
            wallet.balance = null
        },

        async setAccount(newAccount) {
            if(newAccount) {
                this.account = newAccount
                this.accountCompact = `${newAccount.substring(0, 4)}...${newAccount.substring(newAccount.length - 4)}`

                const balance = (await this.provider.getBalance(newAccount)).toString()
                this.balance = `${(+ethers.utils.formatEther(balance)).toFixed(3)} ${getCurrency(this.network.chainId)}`
            }
            else {
                this.disconnect()
            }
        },

        async switchNetwork(chainId) {

            if(!chainId || this.chainId === chainId || this.hexChainId === chainId) {
                return
            }

            const config = CHAINID_CONFIG_MAP[chainId]

			try {
				await this.provider.send('wallet_switchEthereumChain', [
					{ chainId: config.chainId },
				])

                await this.init()

                // create a small delay to let the wallet reset to new network
                return new Promise((resolve) => {
                    setTimeout(() => resolve(), 1000)
                })
			} catch (err) {
				// This error code indicates that the chain has not been added to MetaMask.
				if (err.code === 4902) {
                    await this.provider.send('wallet_addEthereumChain', [config])
                } else {
                    throw err
                }
			}
		},

        async requestSignature(nonce) {
            const signer = this.provider.getSigner()
            const msg = `Hi there from the Zero Code NFT! Sign this unique ID to sign in: ${nonce}`
            return signer.signMessage(msg)
        }
    })

    inject('wallet', wallet)
}