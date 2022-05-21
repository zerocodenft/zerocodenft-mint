<template>
	<b-navbar toggleable="lg" class="zc-navbar">
		<b-navbar-brand to="/" class="zc-text">
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
				<b-button
					variant="link"
					@click="() => (this.isSidebarOpen = !this.isSidebarOpen)">
						<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
							width="25px" height="25px" viewBox="0 0 969.486 969.486" style="enable-background:new 0 0 969.486 969.486;"
							xml:space="preserve">
						<g>
							<g>
								<path d="M806.582,235.309L766.137,87.125l-137.434,37.51L571.451,9.072L114.798,235.309H0v725.105h907.137V764.973h62.35v-337.53
									h-62.352V235.309H806.582z M718.441,170.63l17.654,64.68h-52.561h-75.887h-126.19l111.159-30.339l66.848-18.245L718.441,170.63z
									M839.135,892.414H68V522.062v-129.13v-10.233v-69.787v-9.602h35.181h27.538h101.592h409.025h75.889h37.43h35.242h35.244h13.994
									v51.272v72.86h-15.357h-35.244h-87.85H547.508h-55.217v27.356v75.888v8.758v35.244v35.244v155.039h346.846v127.441H839.135z
									M901.486,696.973h-28.352h-34H560.291V591.375v-35.244v-35.244v-23.889v-1.555h3.139h90.086h129.129h56.492h34h4.445h23.904
									V696.973z M540.707,100.191l21.15,42.688l-238.955,65.218L540.707,100.191z" :fill="$siteConfig.stylesConfig.pageTextColor || '#fff'"/>
								<polygon points="614.146,564.57 614.146,576.676 614.146,631.152 680.73,631.152 680.73,564.57 658.498,564.57 		"/>
							</g>
						</g>
						</svg>
						<!-- <b-img src="@/assets/img/wallet.svg" width="25px" /> -->
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
					<b-list-group-item class="text-capitalize"
						>Network: {{ $wallet.networkName }}</b-list-group-item
					>
					<b-list-group-item button @click="() => this.$wallet.disconnect()"
						>Disconnect Wallet</b-list-group-item
					>
					<b-list-group-item
						class="fm-deposit-btn"
						v-if="isFortmatic"
						button
						@click="onDeposit"
						>Fortmatic Deposit</b-list-group-item
					>
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
			isSidebarOpen: false,
		}
	},
	computed: {
		isFortmatic() {
			return this.$wallet.type === WALLET_TYPE.Fortmatic
		},
	},
	methods: {
		copyToClipboard,
		async onShown() {
			if (this.isFortmatic) {
				const isUserLoggedIn = await this.$wallet.rawProvider.user?.isLoggedIn()

				if (!isUserLoggedIn) {
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
		},
	},
}
</script>
