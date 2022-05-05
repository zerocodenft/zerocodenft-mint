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
	async mounted() {
		const {
			abi,
			address,
			collectionSize
		} = this.$siteConfig.smartContract
		
		const { 
			dropDate,
			dropTimeZone,
		} = this.$siteConfig

		this.collectionSize = collectionSize
		this.dropDate = dayjs.utc(dropDate).tz(dropTimeZone).format()

		const alchemyProvider = new ethers.providers.AlchemyProvider()
		const nftContract = new ethers.Contract(address, abi, alchemyProvider)
		try {
			this.mintedCount = +(await nftContract.totalSupply())
			console.log('mintedCount', this.mintedCount)
		} catch {}

	},
    computed: {
		showCountdown() {
			return new Date(this.dropDate) > new Date() 
		},
		soldOut() {
			return this.mintedCount >= this.collectionSize
		}
	},
	watch: {
		'$wallet.provider': async function (newVal, oldVal) {
			const {
				chainId,
				abi,
				address,
			} = this.$siteConfig.smartContract

			const { 
				isCounterHidden
			} = this.$siteConfig

			console.log('watch', {newVal, oldVal})

			const hasTotalSupply = Array.isArray(abi) 
				? abi.find(x => x.name === 'totalSupply')
				: JSON.parse(abi).find(x => x.name === 'totalSupply')

			if(isCounterHidden || !hasTotalSupply) {
				return
			}

			if(this.mintedCountIntervalId !== null && (newVal === null || this.$wallet.chainId !== +chainId)) {
				clearInterval(this.mintedCountIntervalId)
				this.mintedCountIntervalId = null
				return
			}

			if(newVal !== null && this.$wallet.chainId === +chainId) {
				// this.mintedCount = +(await nftContract.totalSupply()) // set immediately, dont wait for the interval
				this.mintedCountIntervalId = setInterval(async () => {
					const nftContract = new ethers.Contract(address, abi, this.$wallet.provider)
					this.mintedCount = +(await nftContract.totalSupply())
				}, 6000)
			}
		}
	}
}