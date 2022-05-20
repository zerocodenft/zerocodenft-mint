export default {
    beforeMount() {

        if(this.$siteConfig.backgroundImageURL) {
            document.documentElement.style.setProperty('--pageBackground', `url('${this.$siteConfig.backgroundImageURL}')`);
        }

        // console.log(this.$siteConfig.stylesConfig)
        if(!this.$siteConfig.stylesConfig) return
        
        const styles = typeof this.$siteConfig.stylesConfig === 'string' 
            ? JSON.parse(this.$siteConfig.stylesConfig || "{}") 
            : this.$siteConfig.stylesConfig
            
        Object.entries(styles).forEach(([k,v]) => {
            if(v) {
                document.documentElement.style.setProperty(`--${k}`, v);
            }
        })

    }
}