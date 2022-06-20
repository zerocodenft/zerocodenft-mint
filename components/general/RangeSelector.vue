<template>
    <b-form-input
        :value="value"
        @input="onInput"
        size="lg"
        type="range"
        :min="min"
        :max="max"
        :step="step">
    </b-form-input>
</template>

<script>
export default {
    data() {
        return {
            value: 1
        }
    },
    props: {
        max: {
            type: Number,
            default: 1
        },
        min: {
            type: Number,
            default: 1
        },
        step: {
            type: Number,
            default: 1
        },
    },
    methods: {
        onInput(val) {
            this.value = val
            this.$emit('onChange', +val)
        }
    }
}
</script>