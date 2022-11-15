// @ts-ignore
import {defineComponent} from "../../_vue/vue.esm-browser.js";
import Features from "./Features.js";
import TranscriptFormatted from "../analysis/TranscriptFormatted.js";
import {AnalysisStep} from "../../services/AnalysisService.js";

export default defineComponent({
    props: ["selectedId", "analysis", "detailHoverIndex", "alphabet"],
    components: { Features, TranscriptFormatted, },
    emits: ["updateHoverIndex"],
    data() {
        return {
            steps: [] as AnalysisStep[],
        }
    },
    methods: {
        stepFeatureCost(step: AnalysisStep) {
            return `${this.costFormatted(step.cost)} / 24`
        },
        costFormatted(cost: number) {
            let rounded = Math.round(100 * (cost + Number.EPSILON)) / 100
            return `${rounded}`
        },
    },
    async created() {
        this.steps = this.analysis.features.steps;
    },
    template: `
        <div id="detail" v-show="selectedId">
            <table class="feature-steps">
                <thead>
                    <th>Action</th>
                    <th>Cost</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Features</th>
                </thead>
                <tbody>
                    <tr v-for="step, n in steps"
                        @mouseover="$emit('updateHoverIndex', n)"
                        @mouseleave="$emit('updateHoverIndex', null)"
                        :class="['action-' + step.action.toLowerCase()]"
                    >
                    <td>{{step.action}}</td>
                    <td>{{stepFeatureCost(step)}}</td>
                    <td>
                        <span v-if="step.expected">
                            <TranscriptFormatted :transcript="[step.expected]" :alphabet="alphabet" />
                        </span>
                    </td>
                    <td>
                        <span v-if="step.actual">
                            <TranscriptFormatted :transcript="[step.actual]" :alphabet="alphabet" />
                        </span>
                    </td>
                    <td>
                        <ul v-if="step.deltas.length" class="feature-collection with-brackets">
                            <li v-for="delta in step.deltas">
                                <Features :delta="delta" />
                            </li>
                        </ul>
                    </td>
                </tr>

                </tbody>
            </table>
        </div>`
})