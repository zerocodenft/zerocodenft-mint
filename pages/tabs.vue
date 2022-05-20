<template>
	<div class="zc-background">
		<b-tabs
			content-class="mt-3"
			justified
			active-nav-item-class="font-weight-bold">
			<b-tab title="Mint" active class="tab px-3 pb-2 border-0">
				<Mint />
			</b-tab>
			<b-tab
				v-if="$siteConfig.smartContract.hasWhitelist"
				title="Whitelist"
				lazy
				class="tab px-3 pb-2 border-0">
				<WhitelistCheck />
			</b-tab>
		</b-tabs>
		<PoweredByZeroCode v-if="!$siteConfig.isAttributionHidden" />
	</div>
</template>

<script>
export default {
    layout: 'no-headers',
}
</script>

<style lang="scss">
.nav-link.active {
	background-color: var(--pageBackground, $pageBackground) !important;
	color: var(--pageTextColor, $pageTextColor) !important;
}
.tab {
	border-bottom: 1px solid lightgray;
}
</style>
