<template>
	<div
		class="zc-container d-flex justify-content-center align-items-center"
		:style="{
			backgroundImage: `url(&quot;${$siteConfig.backgroundImageURL}&quot;)`,
			backgroundSize: '100% 100%',
		}">
		>
		<b-jumbotron
			:header="$siteConfig.title"
			class="shadow text-center py-4"
			lead="Check whitelisted status"
			bg-variant="dark"
			text-variant="white">
			<WhitelistCheck />
		</b-jumbotron>
	</div>
</template>
