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
	</b-overlay>
</template>

<script>
import { SALE_STATUS, getMerkeTree } from '@/utils'
import { ethers } from 'ethers'
import { getExplorerUrl } from '@/utils/metamask'

export default {
    name: "MintButton",
    props: {
		mintCount: Number,
        soldOut: Boolean
    },
    data() {
        return {
			isBusy: false
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

				if(isPresale) {
					const addrToCheck = ethers.utils.getAddress(this.$wallet.account)
					const isWhitelisted = whitelist.includes(addrToCheck)
					console.log({ isWhitelisted })

					if (!isWhitelisted) {
						this.$bvToast.toast('Your wallet address is not whitelisted', {
							title: 'Mint',
							variant: 'danger',
						})
						return
					}
				}

				let txResponse

				const buyPrice = isPresale
					? +ethers.utils.formatEther(await signedContract.PRESALE_MINT_PRICE())
					: +ethers.utils.formatEther(await signedContract.MINT_PRICE())

				const total = this.$props.mintCount * buyPrice
				const value = ethers.utils.parseEther(total.toString())

				console.log({ 
					buyPrice,
					total,
					value
				})

				if (hasWhitelist) {
					const merkleTree = getMerkeTree(whitelist)
					const hexProof = merkleTree.getHexProof(ethers.utils.keccak256(this.$wallet.account))
					// console.log(merkleTree.verify(hexProof, this.$wallet.account, merkleTree.getRoot()))
					txResponse = await signedContract.redeem(hexProof, this.$props.mintCount, {
						value,
					})
				} else {
					txResponse = await signedContract.mint(this.$props.mintCount, {
						value,
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
							href: `${getExplorerUrl(
								chainId
							)}/tx/${hash}`,
						},
					},
					['View on block explorer >']
				),
			])
		},
	},
}
</script>
