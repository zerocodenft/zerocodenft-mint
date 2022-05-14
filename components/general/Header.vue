<template>
		<b-navbar toggleable="lg" type="dark" variant="dark" class="header">
			<b-navbar-brand to="/">
				{{ $siteConfig.title }}
				<!-- <b-img src="logo.svg" alt="logo" width="60px" /> -->
			</b-navbar-brand>

			<b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

			<b-collapse id="nav-collapse" is-nav>
				<b-navbar-nav>
					<b-nav-item
						v-if="$siteConfig.smartContract.hasWhitelist"
						class="text-center"
						to="/whitelist"
						>Whitelist</b-nav-item
					>
				</b-navbar-nav>

				<!-- Right aligned nav items -->
				<b-navbar-nav class="ml-auto">
					<!-- <b-button
						variant="light"
						:disabled="!!$wallet.account"
						@click="onWalletConnect">
						<strong>{{ $wallet.accountCompact }}</strong>
					</b-button> -->
				</b-navbar-nav>
			</b-collapse>
		</b-navbar>
</template>

<style lang="scss" scoped>
.header {
	height: $header-height
}
</style>