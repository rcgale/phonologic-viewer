// @ts-ignore
import {defineComponent} from "../../_vue/vue.esm-browser.js";

export default defineComponent({
    props: ['modelValue'],
    emits: ['update:modelValue', 'upload'],
    data() {
        return {
            loading: false,
            ref: `file-ref`,
        }
    },
    methods: {
        async uploadFile() {
            // @ts-ignore
            this.loading = true;
            // @ts-ignore
            const file: File = this.$refs[this.ref].files[0];

            // @ts-ignore
            this.$emit('update:modelValue', file);
            // @ts-ignore
            this.$emit('upload', file);
            // @ts-ignore
            this.loading = false;
        },
    },
    template: `
        <div class="file-picker">
            <label for="select-file">Chooose a File:</label>
            <input type="file" @change="uploadFile" :ref="ref">
            <div v-if="loading" class="loading-container">
                <div class="loader">&nbsp;</div>
                Processing...
            </div>
        </div>`
})