<template>
	<div class="text-center">
		<b-link
			class="text-muted zerocode-link text-monospace"
			@click.prevent="onLinkClick"
			href="https://zerocodenft.com"
			target="_blank">
			<slot></slot>
		</b-link>
	</div>
</template>

<script>
import { ANALYTICS_EVENTS } from '@/constants'
export default {
	methods: {
		onLinkClick() {
			// const { id, name } = this.$siteConfig.smartContract
			// this.$gtag('event', ANALYTICS_EVENTS.ZeroCodeLinkClicked, {
			// 	name,
			// 	scId: id,
			// 	// prefix address_ cause gtag converts hex address into digits
			// 	walletAddress: `address_${this.$wallet.account}`
			// })
			window.open('https://zerocodenft.com', '_blank')
		}
	}
}
</script>
