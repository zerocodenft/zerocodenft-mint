import siteConfigLocal from '@/siteConfig.json'

export default async ({env, redirect, route, $cloudFns, $axios}, inject) => {
    
    let siteConfig = siteConfigLocal

    if(route.path === '/error') {
        inject('siteConfig', siteConfig)
        return
    }
    
    const siteId = route.query['siteId'] || localStorage.getItem('siteId')
    localStorage.setItem('siteId', siteId)
    if(!siteId) {
        // alert("Site configuration is missing!")
        redirect('/error?type=missingConfig')
    }
    
    try {
        // const { data: websiteConfig } = await $cloudFns.get('/siteconfig', { params: { websiteId: env.WEBSITE_ID }} )
        const { data } = await $axios.get(`/websites/${siteId}/config`)
        const { iconURL, backgroundImageURL } = data

        data.iconURL = iconURL || siteConfigLocal.iconURL
        data.backgroundImageURL = backgroundImageURL || siteConfigLocal.backgroundImageURL

        siteConfig = data
    } catch (err) {
        // console.error('Error getting config', {err})
        redirect('/error?type=missingConfig')
    }

    inject('siteConfig', siteConfig)
}
