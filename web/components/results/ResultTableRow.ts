// @ts-ignore
import { defineComponent } from "../../_vue/vue.esm-browser.js";
import AlignedSteps from "../analysis/AlignedSteps.js";

export default defineComponent({
    components: {AlignedSteps},
    props: {
        analysis: Object,
        alphabet: String,
        highlight: Boolean,
        labelLeft: String,
        labelRight: String
    },
    template: `
      <tr v-if="analysis && analysis.features">
          <td class="column-utterance-id">
            <button @click="$emit('select')" class="select-utterance-button">{{ analysis.id }}</button>
          </td>
          <td class="column-transcript">
            <AlignedSteps
                :steps="analysis.features.steps"
                :alphabet="alphabet"
                :label-left="labelLeft"
                :label-right="labelRight"/>
          </td>
          <td class="column-error-metric">
            {{ analysis.features.errorRateFormatted }}
          </td>
          <td class="column-error-counts">
            {{ analysis.features.distanceFormatted }}
          </td>
          <td class="column-error-metric">
            {{ analysis.phonemes.errorRateFormatted }}
          </td>
          <td class="column-error-counts">
            {{ analysis.phonemes.distanceFormatted }}
          </td>
      </tr>`
})