import Vue from 'vue'
import { ethers } from 'ethers'
import { getCurrency, CHAINID_CONFIG_MAP } from '@/utils/metamask'

export default (ctx, inject) => {

    const wallet = Vue.observable({
        account: null,
        accountCompact: 'Connect Wallet',
        network: null,
        balance: null,
        provider: null,
        web3Modal: null,
        walletName: null,
        isMetamask: false,
        canDisconnect: false,

        get hexChainId() {
            return '0x' + this.network?.chainId?.toString(16)
        },
        get networkName() {
            return this.network?.name
        },
        get chainId() {
            return this.network?.chainId
        },
        get isConnected() {
            return this.account !== null
        },

        async init(instance) {
            this.provider = new ethers.providers.Web3Provider(instance)
            // console.log(this.provider.provider)
            this.network = await this.provider.getNetwork()
            const [account] = await this.provider.listAccounts()
            await this.setAccount(account)
        },

        async connect() {
            if(!this.web3Modal) throw new Error("Web3 modal is not initialized. Please contact support.")
        
            const instance = await this.web3Modal.connect()
            // console.log(instance, instance.isMetaMask)

            this.canDisconnect = typeof instance.disconnect === 'function'            
            this.isMetamask = instance.isMetaMask || instance.walletMeta?.name === 'MetaMask'
            this.walletName = instance.walletMeta?.name
            
            instance.on('accountsChanged', ([newAddress]) => {
                console.info('accountsChanged', newAddress)
                this.setAccount(newAddress)
            })
            instance.on('chainChanged', async (chainId) => {
                console.info('chainChanged', chainId)
                await this.init(instance)
            })

            await this.init(instance)
        },

        disconnect() {
            if(wallet.canDisconnect) {
                wallet.provider.provider.disconnect()
            }
            wallet.web3Modal?.clearCachedProvider()
            wallet.account = null
            wallet.accountCompact = 'Connect Wallet'
            wallet.balance = null
        },

        async setAccount(newAccount) {
            if(newAccount) {
                this.account = newAccount
                this.accountCompact = `${newAccount.substring(0, 4)}...${newAccount.substring(newAccount.length - 4)}`

                // console.log('here', this, this.provider)
                const balance = (await this.provider.getBalance(newAccount)).toString()
                this.balance = `${(+ethers.utils.formatEther(balance)).toFixed(3)} ${getCurrency(this.network.chainId)}`
            }
            else {
                this.disconnect()
            }
        },

        async switchNetwork(chainId) {

            if(!this.isMetamask) {
                throw new Error('Selected wallet/account is not supported on this blockchain')
            }

            if(!chainId || this.chainId === chainId || this.hexChainId === chainId) {
                return
            }

            const config = CHAINID_CONFIG_MAP[chainId]

			try {
				await this.provider.send('wallet_switchEthereumChain', [
					{ chainId: config.chainId },
				])

                // return this.provider.ready 
                // create a small delay to let the wallet reset to new network
                return new Promise((resolve) => {
                    setTimeout(() => resolve(), 1000)
                })
			} catch (err) {
                console.error('switchNetwork', {err})

                if(err?.message === 'JSON RPC response format is invalid') return

				// This error code indicates that the chain has not been added to MetaMask.
				if (err.code === 4902 || err.message.endsWith('Try adding the chain using wallet_addEthereumChain first.')) {
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