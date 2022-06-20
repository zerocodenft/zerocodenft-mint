export default function ({ $axios, $config }, inject) {
	const cloudFns = $axios.create({})

	// console.log($config)

	cloudFns.setBaseURL($config.AZURE_FUNCTIONS_URL)

	inject('cloudFns', cloudFns)
}
