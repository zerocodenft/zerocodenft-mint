<template>
	<div class="d-flex flex-column">
		<Countdown v-if="showCountdown" :date="dropDate" />
		<div else>
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
            mintMax: 1,
			mintedCount: 0,
			collectionSize: 0,
			mintedCountIntervalId: null,
            saleStatus: null
		}
	},
    async created() {
		try {
            const { 
				isCounterHidden
			} = this.$siteConfig
            const { maxTokensPerTransaction, maxTokensPerPersonOnWhitelist, collectionSize } = this.$siteConfig.smartContract

            this.collectionSize = collectionSize
            
            const hasSaleStatus = typeof this.$smartContract.saleStatus === 'function'
            if(hasSaleStatus) {
                this.saleStatus = await this.$smartContract.saleStatus()
            }

            this.mintMax = this.saleStatus === SALE_STATUS.Whitelist 
                ? maxTokensPerPersonOnWhitelist
                : maxTokensPerTransaction || collectionSize

			const hasTotalSupply = typeof this.$smartContract.totalSupply === 'function'
			if(isCounterHidden || !hasTotalSupply) {
				return
			} else {
                this.mintedCount = +(await this.$smartContract.totalSupply())
                this.mintedCountIntervalId = setInterval(async () => {
                    this.mintedCount = +(await this.$smartContract.totalSupply())
                    console.group('Updates')
                    console.info('Minted count:', this.mintedCount)
                    console.groupEnd()
                }, 10000)
            }
		} catch (err) {
			console.error({err})
		}
	},
    beforeDestroy() {
        this.mintedCountIntervalId = null
    },
	computed: {
        dropDate() {
            const { dropDate, dropTimeZone } = this.$siteConfig
			return dayjs.utc(dropDate).tz(dropTimeZone).format()
		},
        showCountdown() {
            return new Date(this.dropDate) > new Date()
        },
        soldOut() {
			return this.mintedCount >= this.collectionSize
		},
	},
    methods: {
        onSelectedCountChange(val) {
            this.mintCount = val
        }
    }
}
</script>
