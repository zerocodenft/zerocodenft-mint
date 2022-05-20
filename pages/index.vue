<template>
	<div
		class="zc-container d-flex justify-content-center align-items-center"
		:style="{
			backgroundImage: `url(&quot;${$siteConfig.backgroundImageURL}&quot;)`
		}">
		<b-jumbotron
			:header="$siteConfig.title"
			:lead="$siteConfig.description"
			class="shadow text-center jumbo py-4"
			bg-variant="dark"
			text-variant="white">
			<Mint />
		</b-jumbotron>
	</div>
</template>

<script>
import WidgetBotMixin from '@/mixins/widgetBot'

export default {
	mixins: [WidgetBotMixin],
}
</script>

<style lang="scss" scoped>
// .backdrop-blur {
// 	backdrop-filter: blur(1px);
// }
</style>
