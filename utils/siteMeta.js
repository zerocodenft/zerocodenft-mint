const type = 'website'
const twitterCard = 'summary_large_image'

export default ({ logoURL, frontEndURL, companyName, description }) => {
	return [
		{
			property: 'og:site_name',
			content: companyName,
		},
		{
			hid: 'image',
			property: 'image',
			content: logoURL,
		},
		{
			hid: 'title',
			property: 'title',
			content: companyName,
		},
		{
			hid: 'description',
			name: 'description',
			content: description,
		},
		{
			hid: 'og:type',
			property: 'og:type',
			content: type,
		},
		{
			hid: 'og:url',
			property: 'og:url',
			content: frontEndURL,
		},
		{
			hid: 'og:title',
			property: 'og:title',
			content: companyName,
		},
		{
			hid: 'og:description',
			property: 'og:description',
			content: description,
		},
		{
			hid: 'og:image',
			property: 'og:image',
			content: logoURL,
		},
		{
			hid: 'twitter:card',
			name: 'twitter:card',
			content: twitterCard,
		},
		{
			hid: 'twitter:url',
			name: 'twitter:url',
			content: frontEndURL,
		},
		{
			hid: 'twitter:title',
			name: 'twitter:title',
			content: companyName,
		},
		{
			hid: 'twitter:description',
			name: 'twitter:description',
			content: description,
		},
		{
			hid: 'twitter:image',
			name: 'twitter:image',
			content: logoURL,
		},
	]
}
