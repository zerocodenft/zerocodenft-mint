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
				<b-button variant="link" class="text-light" @click="() => this.isSidebarOpen = !this.isSidebarOpen">
					<b-img src="@/assets/img/wallet.svg" width="25px" />
				</b-button>
			</b-navbar-nav>
		</b-collapse>
		<b-sidebar
			v-model="isSidebarOpen"
			@shown="onShown"
			id="sidebarWallet"
			title="Wallet"
			right
			backdrop
			z-index="100">
			<b-list-group flush>
				<b-list-group-item button @click="showWalletsModal">
					Connect Wallet
				</b-list-group-item>
				<template v-if="$wallet.isConnected">
					<b-list-group-item button @click="copyToClipboard">
						Address: {{ $wallet.accountCompact }}
					</b-list-group-item>
					<b-list-group-item>Balance: {{ balance }}</b-list-group-item>
					<b-list-group-item class="text-capitalize">Network: {{ $wallet.networkName }}</b-list-group-item>
					<b-list-group-item class="fm-deposit-btn" v-if="isFortmatic" button @click="onDeposit">Fortmatic Deposit</b-list-group-item>
				</template>
			</b-list-group>
		</b-sidebar>
	</b-navbar>
</template>

<script>
import { WALLET_TYPE } from '@/constants'
import { copyToClipboard } from '@/utils'

export default {
	data() {
		return {
			balance: 0,
			isSidebarOpen: false
		}
	},
	computed: {
		isFortmatic() {
			return this.$wallet.type === WALLET_TYPE.Fortmatic
		}
	},
	methods: {
		copyToClipboard,
		async onShown() {
			if(this.isFortmatic) {
				const isUserLoggedIn = await this.$wallet.rawProvider.user?.isLoggedIn()

				if(!isUserLoggedIn) {
					this.$wallet.rawProvider.user?.login().then(async () => {
						await fm.user.isLoggedIn()
					})
				}
			}
			this.balance = await this.$wallet.getBalance()
		},
		onDeposit() {
			this.$wallet.rawProvider.user?.deposit()
		},
		async showWalletsModal() {
			this.isSidebarOpen = false
			await this.$wallet.connect()
		}
	}
}
</script>

<style lang="scss" scoped>
	.fm-deposit-btn {
		background-color: #8859EC;
		color: white;
	}
</style>