// @ts-ignore
import {defineComponent} from "../../_vue/vue.esm-browser.js";
import {AnalysisDelta} from "../../services/AnalysisService";

export default defineComponent({
    props: ["delta"],
    methods: {
        value(value: number) {
            switch (value) {
                case -1:
                    return `–`;
                case +1:
                    return `+`;
                case -0.5:
                    return `–+`;
                case +0.5:
                    return `+–`;
                default:
                    return `${value}`;
            }
        },
        cost(delta: AnalysisDelta) {
            let name = (delta.left || delta.right).replace(/[+\-0]/, '')
            return `Cost for [${name}]: ${delta.cost}`
        }
    },
    template: `
        <span :title="cost(delta)">
            <span v-if="delta.left && delta.right">
                {{delta.left}} &rarr; {{delta.right}} 
            </span>
            <span v-if="delta.left && !delta.right">
                {{delta.left}}
            </span>
            <span v-if="!delta.left && delta.right">
                {{delta.right}}
            </span>
        </span>`

})