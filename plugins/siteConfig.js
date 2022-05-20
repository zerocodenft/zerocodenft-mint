import siteConfigLocal from '@/siteConfig.json'

export default async ({ redirect, route, $cloudFns, $axios }, inject) => {
    
    let siteConfig = siteConfigLocal

    // inject('siteConfig', siteConfig)
    // return

    if(route.path === '/error') {
        inject('siteConfig', siteConfig)
        return
    }
    
    const siteId = route.query['siteId'] || localStorage.getItem('siteId')
    localStorage.setItem('siteId', siteId)
    if(!siteId) {
        redirect('/error?type=missingConfig')
    }
        
    try {
        const { data } = await $cloudFns.get('/siteconfig', { params: { websiteId: siteId } })
        siteConfig = data
    }
    catch(err1) {
        try {
            // fallback in case cloud function is not working
            const { data } = await $axios.get(`/websites/${siteId}/config`)
            siteConfig = data
        } catch(err2) {
            redirect('/error?type=missingConfig')
        }
    }
    const { iconURL, backgroundImageURL } = siteConfig

    siteConfig.iconURL = iconURL || siteConfigLocal.iconURL
    siteConfig.backgroundImageURL = backgroundImageURL || siteConfigLocal.backgroundImageURL

    inject('siteConfig', siteConfig)
}
