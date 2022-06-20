<template>
	<div
		class="
			d-flex
			justify-content-center
			align-items-center
			zc-container zc-background
		">
		<b-jumbotron
			:header="$siteConfig.title"
			:lead="$siteConfig.description"
			class="shadow text-center jumbo py-4"
			bg-variant="dark">
			<Mint />
			<PoweredByZeroCode v-if="!$siteConfig.smartContract.isAttributionHidden">
				Powered by Zero Code NFT
			</PoweredByZeroCode>
		</b-jumbotron>
	</div>
</template>

<style lang="scss" scoped>
// .backdrop-blur {
// 	backdrop-filter: blur(1px);
// }
</style>
