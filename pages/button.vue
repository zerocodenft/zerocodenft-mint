<template>
	<div class="p-1">
        <Mint />
        <PoweredByZeroCode v-if="!$siteConfig.isAttributionHidden" />
	</div>
</template>

<script>
export default {
    layout: 'no-headers',
}
</script>

<style lang="scss"></style>
