<template>
	<div class="d-flex flex-column">
		<Countdown v-if="showCountdown" :date="dropDate" />
		<div else>
            <b-button
                variant="link"
                class="text-light"
                v-show="$wallet.isConnected && $wallet.canDisconnect"
                @click="$wallet.disconnect"
                >Disconnect Wallet</b-button
            >
			<h5 v-if="!$siteConfig.isCounterHidden" class="pt-2 text-center">
				Minted: {{ mintedCount }}/{{ collectionSize }}
			</h5>
            <!-- <div v-if="mintMax > 1">
                <div v-if="$siteConfig.mintCountSelector === MINT_SELECTOR_TYPE.SpinButton" class="mb-2">
                </div>
                <div v-else-if="$siteConfig.mintCountSelector === MINT_SELECTOR_TYPE.Range" class="d-flex">
                    <RangeSelector :max="mintMax" @onChange="onSelectedCountChange" />
                    <h5 class="pl-3 font-weight-bold">{{ mintCount }}</h5>
                </div>
            </div> -->
            <SpinButton :max="mintMax" @onChange="onSelectedCountChange" />
            <br/>
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
			mintedCountIntervalId: null,
            saleStatus: null
		}
	},
    async created() {
		try {
            const { 
				isCounterHidden
			} = this.$siteConfig
            const { collectionSize } = this.$siteConfig.smartContract

            this.collectionSize = collectionSize
            
            const hasSaleStatus = typeof this.$smartContract.saleStatus === 'function'
            if(hasSaleStatus) {
                this.saleStatus = await this.$smartContract.saleStatus()
            }

			const hasTotalSupply = typeof this.$smartContract.totalSupply === 'function'
			if(isCounterHidden || !hasTotalSupply) {
				return
			}
            
            this.mintedCount = +(await this.$smartContract.totalSupply())

            // this.mintedCountIntervalId = setInterval(async () => {
            //     this.mintedCount = +(await this.$smartContract.totalSupply())
            //     console.info('mintedCount updated', this.mintedCount)
            // }, 5000)
            
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
        mintMax() {
            const { maxTokensPerTransaction, maxTokensPerPersonOnWhitelist, collectionSize } = this.$siteConfig.smartContract

            return this.saleStatus === SALE_STATUS.Whitelist 
                ? maxTokensPerPersonOnWhitelist
                : maxTokensPerTransaction || collectionSize
        }
	},
    methods: {
        onSelectedCountChange(val) {
            console.log('onSelectedCountChange', val)
            this.mintCount = val
        }
    }
}
</script>
