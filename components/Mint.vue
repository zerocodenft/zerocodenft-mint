<template>
	<div class="d-flex flex-column">
		<Countdown v-if="showCountdown" :date="dropDate" />
		<div v-if="!showCountdown">
			<h5 v-if="!$siteConfig.isCounterHidden" class="pt-2 text-center">
				Minted: {{ mintedCount }}/{{ collectionSize }}
			</h5>
            <div v-if="mintMax > 1" class="mb-2">
                <div v-if="$siteConfig.mintCountSelectorType === MINT_SELECTOR_TYPE.Range" class="d-flex mb-2">
                    <RangeSelector :max="mintMax" @onChange="onSelectedCountChange" />
                    <h5 class="pl-3 font-weight-bold">{{ mintCount }}</h5>
                </div>
                <div v-else>
                    <SpinButton :max="mintMax" @onChange="onSelectedCountChange" />
                </div>
            </div>
			<MintButtonV2 :mintCount="mintCount" :soldOut="soldOut" />
		</div>
	</div>
</template>

<script>
import { MINT_SELECTOR_TYPE, SALE_STATUS } from '@/constants'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)

export default {
    data() {
		return {
            MINT_SELECTOR_TYPE,
            mintCount: 1,
			mintedCount: 0,
			collectionSize: 0,
			intervalId: null,
            saleStatus: SALE_STATUS.Paused
		}
	},
    async created() {
		try {
            const { 
				isCounterHidden,
                smartContract
			} = this.$siteConfig

            this.collectionSize = smartContract.collectionSize
            this.saleStatus = await this.$smartContract.saleStatus()
            // this.mintMax = this.saleStatus === SALE_STATUS.Whitelist 
            //     ? maxTokensPerPersonOnWhitelist
            //     : maxTokensPerTransaction || collectionSize

			// const hasTotalSupply = typeof this.$smartContract.totalSupply === 'function'

            this.mintedCount = +(await this.$smartContract.totalSupply())

            if(!this.$nuxt.context.isDev) {
                this.intervalId = setInterval(async () => {
                    console.group('Updates')
    
                    this.saleStatus = await this.$smartContract.saleStatus()
                    console.info('Sale status', SALE_STATUS[this.saleStatus])
    
                    if(!isCounterHidden) {
                        this.mintedCount = +(await this.$smartContract.totalSupply())
                        console.info('Minted count:', this.mintedCount)
                    }
    
                    console.groupEnd()
    
                    if(this.soldOut) {
                        clearInterval(this.intervalId)
                    }
                }, 10000)
            }

		} catch (err) {
			console.error({err})
		}
	},
    beforeDestroy() {
        this.intervalId = null
    },
	computed: {
        dropDate() {
            const { dropDate, dropTimeZone } = this.$siteConfig
			return dayjs.utc(dropDate).tz(dropTimeZone).format()
		},
        showCountdown() {
            // console.log(this.dropDate, new Date(this.dropDate) > new Date())
            return new Date(this.dropDate) > new Date()
        },
        soldOut() {
			return this.mintedCount >= this.collectionSize
		},
        mintMax() {
            const { maxTokensPerTransaction, maxTokensPerPersonOnWhitelist, collectionSize } = this.$siteConfig.smartContract

            return this.saleStatus === SALE_STATUS.Presale 
                ? maxTokensPerPersonOnWhitelist
                : maxTokensPerTransaction || collectionSize
        }
	},
    methods: {
        onSelectedCountChange(val) {
            this.mintCount = val
        }
    }
}
</script>
