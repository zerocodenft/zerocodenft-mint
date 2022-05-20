export default {
    beforeMount() {
        // console.log(this.$siteConfig.stylesConfig)
        if(!this.$siteConfig.stylesConfig) return
        const styles = JSON.parse(this.$siteConfig.stylesConfig || "{}")
        Object.entries(styles).forEach(([k,v]) => {
            if(v) {
                document.documentElement.style.setProperty(`--${k}`, v);
            }
        })
    }
}