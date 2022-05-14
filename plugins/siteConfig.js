import siteConfigLocal from '@/siteConfig.json'

export default async ({ redirect, route, $cloudFns, $axios }, inject) => {
    
    let siteConfig = siteConfigLocal

    if(route.path === '/error') {
        inject('siteConfig', siteConfig)
        return
    }
    
    const websiteId = route.query['siteId'] || localStorage.getItem('siteId')
    localStorage.setItem('websiteId', websiteId)
    if(!websiteId) {
        redirect('/error?type=missingConfig')
    }
    
    let siteData
    
    try {
        const { data } = await $cloudFns.get('/siteconfig', { params: { websiteId } })
        siteData = data
    }
    catch(err1) {
        try {
            // fallback in case cloud function is not working
            const { data } = await $axios.get(`/websites/${websiteId}/config`)
            siteData = data
        } catch(err2) {
            redirect('/error?type=missingConfig')
        }
    }
    const { iconURL, backgroundImageURL } = siteData

    siteData.iconURL = iconURL || siteConfigLocal.iconURL
    siteData.backgroundImageURL = backgroundImageURL || siteConfigLocal.backgroundImageURL

    siteConfig = siteData

    inject('siteConfig', siteConfig)
}
