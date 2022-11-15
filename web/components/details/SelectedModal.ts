// @ts-ignore
import {defineComponent} from "../../_vue/vue.esm-browser.js";
import TranscriptDiff from "./TranscriptDiff.js";
import Details from "./Details.js";

export default defineComponent({
    props: ["selectedId", "analysis", "alphabet"],
    components: { TranscriptDiff, Details, },
    emits: ["deselect"],
    data() {
        return {
            detailHoverIndex: null,
        }
    },
    template: `
      <div id="selected-modal" v-show="selectedId">
        <div id="selected-analysis" v-if="selectedId && analysis">
            <button class="close-selected" @click="$emit('deselect')">✕</button> 
            <h2>{{selectedId}}</h2>
            <TranscriptDiff
                :key="selectedId"
                :analysis="analysis"
                :alphabet="alphabet"
                :detailHoverIndex="detailHoverIndex"
                />
<!--            <AudioPlayer :utteranceId="selectedId" />-->
        </div>
        <Details 
            v-if="selectedId && analysis"
            :key="selectedId"
            :selectedId="selectedId"
            :analysis="analysis"
            :alphabet="alphabet"
            :detailHoverIndex="detailHoverIndex"
            @updateHoverIndex="(idx) => detailHoverIndex = idx"
            />
    </div>`
})