// @ts-ignore
import {defineComponent} from "../_vue/vue.esm-browser.js";
import Menu from "./menu/Menu.js";
import ResultTable from "./results/ResultTable.js";
import {Analysis, AnalysisCollection, AnalysisService} from "../services/AnalysisService.js";
import TranscriptService from "../services/TranscriptService.js";
import SelectedModal from "./details/SelectedModal.js";

export default defineComponent({
    components: { Menu, ResultTable, SelectedModal },
    data() {
        return {
            splits: [],
            split: null,
            file: null,
            analyses: new AnalysisCollection([]),
            selectedId: null,
            overallFer: null,
            overallPer: null,
            alphabet: "ipa",
            loading: false,
        }
    },
    computed: {
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
            let parsedFile = await TranscriptService.getTranscripts(file);
            // @ts-ignore
            this.analyses = [];
            // @ts-ignore
            this.analyses = await AnalysisService.getAll(parsedFile.rows);
            // @ts-ignore
            this.loading = false;
        }
    },
    template: `
    <div id="results">
        <Menu 
              :analyses="analyses"
              :loading="loading"
              @upload="receivedFile"
              @setAlphabet="a => alphabet = a" />
        <div id="main-pane-wrapper" class="main-pane">
            <ResultTable
                :key="analyses"
                :loading="loading"
                @show="id => selectedId = id"
                :analyses="analyses"
                :alphabet="alphabet"
                />
        </div>
    </div>
    <SelectedModal 
        @deselect="() => selectedId = null"
        :selectedId="selectedId"
        :analysis="analysis"
        :alphabet="alphabet"
        />`
})