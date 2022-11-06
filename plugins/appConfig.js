// load tenant configuration

export default async function ({ redirect, $cloudFns, $axios }, inject) {
	let appConfigs = null

	try {
		const { data } = await $axios.get('/configs')
		appConfigs = data
	} catch (err1) {
		try {
			// fallback in case server is not working
			const { data } = await $cloudFns.get('/appconfig')
			appConfigs = data
		} catch (err2) {
			redirect('/error?type=missingConfig')
		}
	}
	// Create a custom axios instance

	const appConfig = {
		configs: appConfigs,
		get: function (key) {
			return this.configs.find((x) => x.key === key)
		},
	}

	appConfigs.reduce((acc, val) => {
		acc[val.key] = val.value
		return acc
	}, appConfig)

	inject('appConfig', Object.freeze(appConfig))
}
