<template>
	<b-tabs
		content-class="mt-3"
		justified
		active-nav-item-class="font-weight-bold text-zerocodenft">
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
</template>

<script>
export default {
    layout: 'no-headers',
}
</script>

<style lang="scss">
.tab {
	border-bottom: 1px solid lightgray;
}
</style>
