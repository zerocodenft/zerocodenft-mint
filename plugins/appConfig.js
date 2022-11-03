export default async function ({ $axios }, inject) {
	// Create a custom axios instance
	const { data: appConfigs } = await $axios.get('/configs')

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
