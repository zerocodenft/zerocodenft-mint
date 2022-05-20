<template>
  <div>
    <Nuxt/>
    <Web3Modal />
  </div>
</template>

<script>
console.group('Powered by www.zerocodenft.com')
console.info(
	'%cDrop Your NFT collection with ZERO coding skills!',
	`background: linear-gradient(100.07deg, #DB6F3D -28.71%, #9534DE 36.75%, #5FB9E6 103.59%);
  color:white;
  font-weight:bold;`
)
console.groupEnd()

import StylesMixin from '@/mixins/styles'
import WidgetBotMixin from '@/mixins/widgetBot'

export default {
  mixins: [StylesMixin, WidgetBotMixin]
}

</script>