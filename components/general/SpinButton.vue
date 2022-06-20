<template>
    <b-form-spinbutton
        :value="value"
        @input="onInput"
        :min="min"
        :max="max"
        :step="step">
    </b-form-spinbutton>
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