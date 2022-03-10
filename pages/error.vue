<template>
    <div id="container" class="d-flex justify-content-center align-items-center">
        <h1>{{ msg }} </h1>
    </div>
</template>

<script>
export default {
    computed: {
        msg() {
            const errorType = this.$route.query['type'];
            switch(errorType) {
                case 'missingConfig': return "Mint page configuration is missing"
                default: return "Unknown error occurred"
            }
        }
    }
}
</script>

<style scoped>
#container {
	overflow: hidden;
	min-height: calc(100vh - 164px);
}
</style>