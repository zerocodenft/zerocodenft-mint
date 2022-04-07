<template>
    <web3-modal-vue
        ref="web3modal"
        :theme="theme"
        :provider-options="providerOptions"
    />
</template>

<script>
import Web3ModalVue from "web3modal-vue"
import WalletConnectProvider from "@walletconnect/web3-provider"
import { CHAINID_CONFIG_MAP } from '@/utils/metamask'

const rpc = Object.entries(CHAINID_CONFIG_MAP)
    .filter(([k,_]) => !isNaN(k))
    .reduce((acc, val) => {
        const [key, value] = val
        const rpcUrl = value.rpcUrls[0]
        acc[key] = rpcUrl
        return acc
    }, {})

export default {
  components: {
    Web3ModalVue
  },
  data() {
    return {
      theme: 'light',
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: "98302611de2949f1bd81e48d0b52d279",
            rpc
          }
        }
      },
      number: 0,
      balance: 0,
    }
  },
  created() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.theme = 'dark'
    }
  },
  mounted() {
    this.$nextTick(async () => {
      const web3modal = this.$refs.web3modal
      this.$wallet.web3Modal = web3modal
      if (web3modal.cachedProvider) {
        await this.$wallet.connect()
      }
    })
  },
  methods: {
    async connect() {
      await this.$wallet.connect()
    },
  }
}
</script>