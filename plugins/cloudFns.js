export default function ({ $axios, $config }, inject) {
	const cloudFns = $axios.create({
		baseURL: $config.AZURE_FUNCTIONS_URL
	})

	inject('cloudFns', cloudFns)
}
