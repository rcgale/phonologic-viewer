// @ts-ignore
import {defineComponent} from "../../_vue/vue.esm-browser.js";
import TranscriptFormatted from "./TranscriptFormatted.js";

export default defineComponent({
    props: ["steps", "alphabet", "detailHoverIndex", "labelLeft", "labelRight"],
    components: {TranscriptFormatted},
    template: `
        <div class="transcript-steps-wrapper">
          <div class="transcript-steps" :style="{gridTemplateColumns: 'repeat('+steps.length+', auto)'}">
            <div class="expected">
                <label>{{labelLeft}}</label>
                <span v-for="step, n in steps"
                      class="step-expected"
                      :class="{ highlight: detailHoverIndex === n, 'step-error': step.cost > 0}">
                    <TranscriptFormatted :transcript="step.expected" :alphabet="alphabet" />
                </span>
            </div>
            <div class="actual">
                <label>{{labelRight}}</label>
                <span v-for="step, n in steps"
                      class="step-actual"
                      :class="{ highlight: detailHoverIndex === n, 'step-error': step.cost > 0}">
                        <TranscriptFormatted :transcript="step.actual" :alphabet="alphabet" />
                </span>
            </div>
          </div>
        </div>`
})