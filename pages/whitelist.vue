<template>
	<b-container id="container" fluid>
		<b-row id="landing" :style='{
			"backgroundImage": `url("${$siteConfig.backgroundImageURL}")`,
			"backgroundSize": "100% 100%"
		}'>
			<b-col
				class="d-flex align-items-center justify-content-center backdrop-blur">
				<b-jumbotron
					:header="$siteConfig.title"
					class="shadow text-center"
					lead="Check whitelisted status"
					bg-variant="dark"
					text-variant="white">
					<WhitelistCheck />
				</b-jumbotron>
			</b-col>
		</b-row>
	</b-container>
</template>


<style scoped>
#container {
	overflow: hidden;
	min-height: calc(100vh - 164px);
}

#landing {
	min-height: inherit;
}
</style>
