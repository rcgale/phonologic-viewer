// @ts-ignore
import { defineComponent } from "../../_vue/vue.esm-browser.js";
import AlignedSteps from "../analysis/AlignedSteps.js";
import ResultTableRow from "./ResultTableRow.js";
import ResultTableRowError from "./ResultTableRowError.js";

export default defineComponent({
    components: {AlignedSteps, ResultTableRow, ResultTableRowError},
    props: ["selectedId", "analyses", "alphabet", "labelLeft", "labelRight", "loading"],
    emits: ["show"],
    template: `
        <table v-if="analyses && analyses.length" id="result-table">
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
                    @select="() => $emit('show', analysis.id)"
                    :key="analysis"
                    :analysis="analysis"
                    :alphabet="alphabet"
                    :label-left="analysis.transcriptPair[0]"
                    :label-right="analysis.transcriptPair[1]" />
            </tbody>
        </table>
        <div v-if="loading" class="loading-container">
            <div class="loader">&nbsp;</div>
            Analyzing...
        </div>
    `
})