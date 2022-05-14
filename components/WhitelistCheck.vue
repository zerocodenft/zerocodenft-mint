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
		<b-button
			block
			variant="light"
			:disabled="!address"
			@click="checkWhitelisted"
			>Check</b-button
		>
	</b-form>
</template>

<script>
import { ethers } from 'ethers'
import { checkWhitelisted } from '@/utils'

export default {
    data() {
        return {
            address: this.$wallet.account,
            isWhitelisted: null,
            resolvedAddress: ''
        }
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
                if (!this.$wallet.account) {
                    await this.$wallet.connect()
                }
    
                let addressToCheck = this.address
                if(addressToCheck.endsWith('.eth')){
                    addressToCheck = await this.$wallet.provider.resolveName(this.address)
                    this.resolvedAddress = addressToCheck
                    console.info(`Address resolved to ${addressToCheck}`)
                }
                else {
                    addressToCheck = ethers.utils.getAddress(this.address)
                }

                const wl = this.$siteConfig.smartContract.whitelist.map(a => ethers.utils.getAddress(a))
                // console.log('whitelisted', checkWhitelisted(wl, '0x629149b974987fac5dcda210ddb6cc60a0ac7e1b'))
                this.isWhitelisted = checkWhitelisted(wl, addressToCheck)
            } catch (err) {
                console.error(err)
                this.$bvToast.toast(
					'Check failed',
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