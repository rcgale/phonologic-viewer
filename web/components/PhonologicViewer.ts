// @ts-ignore
import {defineComponent} from "../_vue/vue.esm-browser.js";
import AlignedSteps from "./analysis/AlignedSteps.js";
import Details from "./details/Details.js";
import TranscriptFormatted from "./analysis/TranscriptFormatted.js";
import AudioPlayer from "./details/AudioPlayer.js";
import FilePicker from "./menu/FilePicker.js";
import ResultTable from "./results/ResultTable.js";
import TranscriptDiff from "./details/TranscriptDiff.js";
import {Analysis, AnalysisCollection, AnalysisService} from "../services/AnalysisService.js";
import TranscriptService from "../services/TranscriptService.js";

export default defineComponent({
    components: { AlignedSteps, Details, TranscriptFormatted, AudioPlayer, FilePicker, ResultTable, TranscriptDiff },
    data() {
        return {
            splits: [],
            split: null,
            file: null,
            parsedFile: null,
            analyses: new AnalysisCollection([]),
            selectedId: null,
            overallFer: null,
            overallPer: null,
            alphabet: "ipa",
            loading: false,
        }
    },
    computed: {
        fer(): string {
            // @ts-ignore
            return this.analyses.ferFormatted;
        },
        wer(): string {
            // @ts-ignore
            return this.analyses.ferFormatted;
        },
        analysis(): Analysis {
            // @ts-ignore
            if (!this.selectedId) {
                // @ts-ignore
                return null;
            }
            // @ts-ignore
            let found = this.analyses.filter(a => a.id == this.selectedId);
            // @ts-ignore
            return found.length
                ? found[0]
                : null;
        }
    },
    methods: {
        async receivedFile(file: File) {
            // @ts-ignore
            this.loading = true;
            // @ts-ignore
            this.parsedFile = await TranscriptService.getTranscripts(file);
            // @ts-ignore
            this.analyses = await AnalysisService.getAll(this.parsedFile.rows);
            // @ts-ignore
            this.loading = false;
        },
        showDetails(id: string) {
            // @ts-ignore
            this.selectedId = id;
        },
        deselect() {
            // @ts-ignore
            this.selectedId = null;
        }
    },
    template: `
    <div id="results">
        <div id="top-pane" class="main-pane">
            <h1>
                Phonologic Viewer
            </h1>
            <div v-if="this.analyses && this.analyses.length" id="error-summary">
                <table v-if="!loading">
                    <thead>
                        <tr>
                            <th colspan="2">Overall</th>
                        </tr>
                        <tr>
                            <th>FER</th>
                            <th>PER</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{this.analyses.ferFormatted}}</td>
                            <td>{{this.analyses.perFormatted}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div id="menu">
                <div class="menu-item" id="file-picker">
                    <FilePicker v-model="file" @upload="receivedFile"></FilePicker>
                </div>
                <div class="menu-item" id="alphabet-picker">
                    <div>Alphabet</div>
                    <input type="radio" name="alphabet" id="radio-ipa" value="ipa" v-model="alphabet" />
                    <label for="radio-ipa">IPA</label>
                    <input type="radio" name="alphabet" id="radio-arpabet" value="arpabet" v-model="alphabet" />
                    <label for="radio-arpabet">ARPAbet</label>
                </div>
            </div>
        </div>
        <div id="result-table-wrapper" class="main-pane">
            <ResultTable
                v-if="analyses && analyses.length"
                :key="analyses"
                @show="showDetails"
                :analyses="analyses"
                :alphabet="alphabet"
                :label-left="parsedFile.labels[0]"
                :label-right="parsedFile.labels[1]"/>
            <div v-if="loading" class="loading-container">
                <div class="loader">&nbsp;</div>
                Analyzing...
            </div>
        </div>
    </div>
    <div id="selected-modal" v-show="selectedId">
        <div id="selected-analysis" v-if="selectedId && analysis">
            <button class="close-selected" @click="deselect">✕</button> 
            <h2>{{selectedId}}</h2>
            <TranscriptDiff
                :key="selectedId"
                :analysis="analysis"
                :alphabet="alphabet"
                :detailHoverIndex="detailHoverIndex"
                />
<!--            <AudioPlayer :utteranceId="selectedId" />-->
        </div>
        <div id="detail" v-show="selectedId">
            <Details 
                v-if="selectedId && analysis"
                :key="selectedId"
                :selectedId="selectedId"
                :analysis="analysis"
                :alphabet="alphabet"
                :detailHoverIndex="detailHoverIndex"
                />
        </div>
    </div>`

})