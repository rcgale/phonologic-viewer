// @ts-ignore
import {defineComponent} from "../../_vue/vue.esm-browser.js";
import AudioPlayer from "./AudioPlayer.js";

export default defineComponent({
    components: {AudioPlayer},
    props: ["analysis", "detailHoverIndex", "alphabet"],
    template: `
    <div id="item" v-if="analysis">
            <AlignedSteps :steps="analysis.features.steps" :alphabet="alphabet" :detailHoverIndex="detailHoverIndex "/>
            <table id="details-error-rates">
                <thead>
                    <tr>
                        <th colspan="2">Utterance</th>
                    </tr>
                    <tr>
                        <th>FER</th>
                        <th>PER</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{analysis.ferFormatted}}</td>
                        <td>{{analysis.perFormatted}}</td>
                    </tr>
                </tbody>
            </table>
    </div>`
})