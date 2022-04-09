import { ethers } from 'ethers'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)

export default {
	data() {
		return {
			mintedCount: 0,
			collectionSize: 0,
			dropDate: null,
			mintedCountIntervalId: null
		}
	},
	mounted() {
		const {
			chainId: targetChainId,
			abi,
			address,
			collectionSize,
		} = this.$siteConfig.smartContract
		
		const { 
			dropDate,
			dropTimeZone,
			isCounterHidden
		} = this.$siteConfig

		this.collectionSize = collectionSize
		this.dropDate = dayjs.utc(dropDate).tz(dropTimeZone).format()
		try {
			// give some time for wallet plugin to init
			setTimeout(async () => {
				if (this.showCountdown || !this.$wallet.provider) return

				if (this.$wallet.chainId !== +targetChainId) {
					await this.$wallet.switchNetwork(targetChainId)
				}

				const nftContract = new ethers.Contract(address, abi, this.$wallet.provider)
				this.collectionSize = +(await nftContract.COLLECTION_SIZE())
				
				if(!isCounterHidden) {
					this.mintedCountIntervalId = setInterval(async () => {
						this.mintedCount = +(await nftContract.totalSupply())
					}, 6000)
				}
			}, 2000)
		} catch (err) {
			console.error({ err })
		}
	},
    computed: {
		showCountdown() {
			return new Date(this.$siteConfig.dropDate) > new Date() 
		},
		soldOut() {
			return this.mintedCount >= this.collectionSize
		}
	},
	watch: {
		'$wallet.provider': async function (newVal, oldVal) {
			const {
				abi,
				address,
			} = this.$siteConfig.smartContract

			const { 
				isCounterHidden
			} = this.$siteConfig

			console.log('watch', newVal)

			if(isCounterHidden) {
				return
			}

			if(newVal === null && this.mintedCountIntervalId !== null) {
				clearInterval(this.mintedCountIntervalId)
				this.mintedCountIntervalId = null
				return
			}

			if(newVal !== null) {
				const nftContract = new ethers.Contract(address, abi, newVal)
				this.mintedCount = +(await nftContract.totalSupply()) // set immediately, dont wait for the interval
				this.mintedCountIntervalId = setInterval(async () => {
					this.mintedCount = +(await nftContract.totalSupply())
				}, 6000)
			}
		}
	}
}