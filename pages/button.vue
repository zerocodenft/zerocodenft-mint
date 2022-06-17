<template>
	<div
		class="p-1 zc-background">
		<Mint />
		<PoweredByZeroCode v-if="!$siteConfig.smartContract.isAttributionHidden" />
	</div>
</template>

<script>
export default {
	layout: 'no-headers',
}
</script>
