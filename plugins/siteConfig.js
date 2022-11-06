import siteConfigLocal from '@/siteConfig.json'

export default async ({ redirect, route, $cloudFns, $axios, app }, inject) => {
	let siteConfig
	const siteId = route.query['siteId'] || localStorage.getItem('siteId')
	if (siteId) {
		localStorage.setItem('siteId', siteId)
	}

	if (app.context.isDev && !siteId) {
		siteConfig = {
			...siteConfigLocal,
			configs: JSON.stringify(siteConfigLocal.configs),
			stylesConfig: JSON.stringify(siteConfigLocal.stylesConfig),
		}
	} else {
		// if (route.path === '/error') {
		// 	inject('siteConfig', siteConfig)
		// 	return
		// }

		if (!siteId) {
			redirect('/error?type=missingConfig')
		}

		try {
			const { data } = await $axios.get(`/websites/${siteId}/config`)
			siteConfig = data
		} catch (err1) {
			try {
				// fallback in case server is not working
				const { data } = await $cloudFns.get('/siteconfig', {
					params: { websiteId: siteId },
				})
				siteConfig = data
			} catch (err2) {
				redirect('/error?type=missingConfig')
			}
		}
	}

	inject('siteConfig', siteConfig)
}
