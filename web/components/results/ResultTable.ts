// @ts-ignore
import { defineComponent } from "../../_vue/vue.esm-browser.js";
import AlignedSteps from "../analysis/AlignedSteps.js";
import ResultTableRow from "./ResultTableRow.js";
import ResultTableRowError from "./ResultTableRowError.js";

export default defineComponent({
    components: {AlignedSteps, ResultTableRow, ResultTableRowError},
    props: ["analyses", "alphabet", "labelLeft", "labelRight"],
    data() {
        return {
            loading: false,
            selectedId: null,
        }
    },
    methods: {
        select(selectedId: string) {
            // @ts-ignore
            this.selectedId = selectedId;
            // @ts-ignore
            this.$emit('show', selectedId);
        },
    },
    template: `
    <div>
        <table v-if="analyses" id="result-table">
            <thead>
                <tr class="header-extra">
                    <th class="column-utterance-id">&nbsp;</th>
                    <th class="column-transcript">&nbsp;</th>
                    <th colspan="2" class="header-features" >Features</th>
                    <th colspan="2" class="header-phonemes" >Phonemes</th>
                </tr>

                <tr class="header-main">
                    <th class="column-utterance-id">Utterance ID</th>
                    <th class="column-transcript">Transcripts</th>
                    <th class="column-error-metric">FER</th>
                    <th class="column-error-counts">Err/Len</th>
                    <th class="column-error-metric">PER</th>
                    <th class="column-error-counts">Err/Len</th>
                </tr>
            </thead>
            <tbody>
                <ResultTableRowError
                    v-for="analysisException in analyses.exceptions"
                    :key="analysisException"
                    :analysisException="analysisException"/>

                <ResultTableRow 
                    v-for="analysis in analyses"
                    :class="{highlight: selectedId === analysis.id}"
                    @select="() => select(analysis.id)"
                    :key="analysis"
                    :analysis="analysis"
                    :alphabet="alphabet"
                    :label-left="labelLeft"
                    :label-right="labelRight"/>
            </tbody>
        </table>
    </div>`
})