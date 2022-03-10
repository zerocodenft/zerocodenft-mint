import siteConfigLocal from '@/siteConfig.json'

export default async ({env, $cloudFns, $axios}, inject) => {

    let siteConfig = {}
    
    try {
        // const { data: websiteConfig } = await $cloudFns.get('/siteconfig', { params: { websiteId: env.WEBSITE_ID }} )
        const { data } = await $axios.get(`/websites/${env.WEBSITE_ID}/config`)
        console.info({data})

        const { iconURL, backgroundImageURL } = data
        data.iconURL = iconURL || siteConfigLocal.iconURL
        data.backgroundImageURL = backgroundImageURL || siteConfigLocal.backgroundImageURL

        siteConfig = data
    } catch (err) {
        console.log('Error getting config', err)
        siteConfig = siteConfigLocal
    }

    inject('siteConfig', siteConfig)
}
