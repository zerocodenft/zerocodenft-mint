<template>
	<b-container id="container" fluid>
		<b-row id="landing" :style='{
			"backgroundImage": `url("${$siteConfig.backgroundImageURL}")`,
			"backgroundSize": "100% 100%"
		}'>
			<b-col
				class="d-flex align-items-center justify-content-center backdrop-blur">
				<b-jumbotron
					:header="$siteConfig.title"
					class="shadow text-center"
					lead="Check whitelisted status"
					bg-variant="dark"
					text-variant="white">
					<b-form novalidate @submit.prevent="checkWhitelisted">
						 <b-form-group
                            label='Address or ENS name'
                        >
                            <b-form-input
                                v-model="address"
                                @input="onInput"
                            ></b-form-input>
                            <b-form-invalid-feedback :state="isWhitelisted">
                                Address {{ resolvedAddress }} is NOT whitelisted
                            </b-form-invalid-feedback>
                            <b-form-valid-feedback :state="isWhitelisted">
                                Address {{ resolvedAddress }} is whitelisted
                            </b-form-valid-feedback>
                        </b-form-group>
                        <b-button block variant="success" :disabled="!address" @click="checkWhitelisted">Check</b-button>
					</b-form>
				</b-jumbotron>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
import { ethers } from 'ethers'

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
    
                this.isWhitelisted = this.$siteConfig.smartContract.whitelist.includes(addressToCheck)
            } catch (err) {
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

<style scoped>
#container {
	overflow: hidden;
	min-height: calc(100vh - 164px);
}

#landing {
	min-height: inherit;
}
</style>
