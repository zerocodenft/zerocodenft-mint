<template>
			<b-modal id='TwitterNftShareModal' title='Congratulations 🎉' centered @hidden="$emit('hidden')">
         <div class="text-center">
        You've successfully minted {{mintCount}} NFTs from {{$siteConfig.smartContract.name}} NFT collection.
      </div>
      <div class="row d-flex justify-content-center">
      <div class="col-6 my-2" v-for="(data,i) in images" :key="i">
        <h5>{{data.name}}</h5>
        <b-img-lazy width="200px" blank-color="black" blank-width="200px"  :src="data.imageSrc" />
      </div>
      </div>
     
<template slot="modal-footer">
  <ShareNetwork
              ref="twitterShare"
              network="twitter"
              :url="$siteConfig.url + '\n'"
              :title="compTitle"
              hashtags="zerocodenft,nocode,nft,mint"
            >
              <b-icon icon="twitter"></b-icon> Tweet
            </ShareNetwork>
  </template>
    </b-modal>
</template>

<script >
export default {
  props: {
    images: Array,
    mintCount: {
      type: Number,
      default:1
    }
  },
  computed: {
    compTitle() {
      return `I've just minted ${this.mintCount} NFTs from ${this.$siteConfig.smartContract.name} NFT Collection.\n Mint one for yourself.`
    }
  },
}
</script>

<style>

</style>