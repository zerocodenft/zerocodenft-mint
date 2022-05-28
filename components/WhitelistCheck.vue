<template>
	<b-form novalidate @submit.prevent="checkWhitelisted">
		<b-form-group label="Enter Address or ENS name">
			<b-form-input v-model="address" @input="onInput" ></b-form-input>
			<b-form-invalid-feedback :state="isWhitelisted">
				Address {{ resolvedAddress }} is NOT whitelisted
			</b-form-invalid-feedback>
			<b-form-valid-feedback :state="isWhitelisted">
				Address {{ resolvedAddress }} is whitelisted
			</b-form-valid-feedback>
		</b-form-group>
        <div class="text-center">
            <b-button
                class="mint-button font-weight-bold border-0"
                :disabled="!address"
                @click="checkWhitelisted"
                >Check</b-button
            >
        </div>
	</b-form>
</template>

<script>
import { ethers } from 'ethers'
import { CHAINID_CONFIG_MAP } from '@/utils/metamask'
import { checkWhitelisted } from '@/utils'

export default {
    data() {
        return {
            address: this.$wallet.account,
            isWhitelisted: null,
            resolvedAddress: ''
        }
    },
    created() {
        const chainId = this.$siteConfig.smartContract.chainId
        const providerUrl = CHAINID_CONFIG_MAP[chainId.toString()].rpcUrls[0]
        this.provider = new ethers.providers.StaticJsonRpcProvider(providerUrl)
    },
    watch: {
        '$wallet.account': function(newVal, oldVal) {
            this.address = newVal
        }
    },
    methods: {
        onInput(){
            this.isWhitelisted = null
            this.resolvedAddress = null
        },
        async checkWhitelisted() {
            try {
                if(!this.address) return
                
                if(!ethers.utils.isAddress(this.address)) {
                    throw new Error("Provided address format is invalid (bad checksum)")
                }
    
                let addressToCheck = this.address
                if(addressToCheck.endsWith('.eth')){
                    addressToCheck = await this.provider.resolveName(this.address)
                    this.resolvedAddress = addressToCheck
                    console.info(`Address resolved to ${addressToCheck}`)
                }
                else {
                    addressToCheck = ethers.utils.getAddress(this.address)
                }
                
                const { id, whitelist } = this.$siteConfig.smartContract

                let wlData = whitelist
                try { 
                    const { data } = await this.$axios.get(`/smartcontracts/${id}/whitelist`)
                    wlData = data
                } catch {}

                const wl = wlData.map(a => ethers.utils.getAddress(a))
                // console.log('whitelisted', checkWhitelisted(wl, '0x629149b974987fac5dcda210ddb6cc60a0ac7e1b'))
                this.isWhitelisted = checkWhitelisted(wl, addressToCheck)
            } catch (err) {
                console.error(err)
                this.$bvToast.toast(
					err.message || 'Check failed',
					{
						title: 'Whitelist',
						variant: 'danger',
					}
				)
            }
        }
    }
}
</script>