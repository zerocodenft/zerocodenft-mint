export default {
    beforeMount() {

        // console.log(this.$siteConfig.stylesConfig)
        if(!this.$siteConfig.stylesConfig) return
        
        const styles = typeof this.$siteConfig.stylesConfig === 'string' 
            ? JSON.parse(this.$siteConfig.stylesConfig || "{}") 
            : this.$siteConfig.stylesConfig
            
        Object.entries(styles)
            .filter(([_,v]) => v !== null)
            .forEach(([k,v]) => {
                if(k === 'pageBackground' && this.$siteConfig.backgroundImageURL) {
                    v = this.$siteConfig.backgroundImageURL
                }
                if(typeof v === 'string' && v.startsWith('http')) {
                    v = `url('${v}')`
                }
                document.documentElement.style.setProperty(`--${k}`, v);
        })

    }
}