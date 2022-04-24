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
			collectionSize,
		} = this.$siteConfig.smartContract
		
		const { 
			dropDate,
			dropTimeZone,
		} = this.$siteConfig

		this.collectionSize = collectionSize
		this.dropDate = dayjs.utc(dropDate).tz(dropTimeZone).format()
		
		console.info('drop date', this.dropDate)
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
		'$wallet.network': async function (newVal, oldVal) {
			const {
				chainId,
				abi,
				address,
			} = this.$siteConfig.smartContract

			const { 
				isCounterHidden
			} = this.$siteConfig

			console.log('watch', abi)
			const hasTotalSupply = !!(abi || []).find(x => x.name === 'totalSupply')

			if(isCounterHidden || !hasTotalSupply) {
				return
			}

			// console.log('mintedCountIntervalId', this.mintedCountIntervalId, this.$wallet.provider, this.$wallet.chainId, +chainId)

			if(this.mintedCountIntervalId !== null && (this.$wallet.provider === null || this.$wallet.chainId !== +chainId)) {
				clearInterval(this.mintedCountIntervalId)
				this.mintedCountIntervalId = null
				return
			}

			if(this.$wallet.provider !== null && this.$wallet.chainId === +chainId) {
				const nftContract = new ethers.Contract(address, abi, this.$wallet.provider)
				this.mintedCount = +(await nftContract.totalSupply()) // set immediately
				this.mintedCountIntervalId = setInterval(async () => {
					this.mintedCount = +(await nftContract.totalSupply())
					console.log('mintedCount', this.mintedCount)
				}, 6000)
			}
		}
	}
}