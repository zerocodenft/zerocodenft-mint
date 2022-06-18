<template>
	<div
		class="p-1 zc-background">
		<Mint />
		<PoweredByZeroCode v-if="!$siteConfig.smartContract.isAttributionHidden">
			Powered by Zero Code NFT
		</PoweredByZeroCode>
	</div>
</template>

<script>
export default {
	layout: 'no-headers',
}
</script>
