// @ts-ignore
import {defineComponent} from "../../_vue/vue.esm-browser.js";
import FilePicker from "./FilePicker.js";

export default defineComponent({
    props: ["analyses", "loading"],
    emits: ["upload", "setAlphabet"],
    components: {FilePicker},
    data() {
        return {
            "alphabet": "ipa",
        }
    },
    template: `
        <div id="top-pane" class="main-pane">
             <div v-if="analyses && analyses.length" id="error-summary">
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
                            <td>{{analyses.ferFormatted}}</td>
                            <td>{{analyses.perFormatted}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div id="menu">
                <div class="menu-item" id="file-picker">
                    <FilePicker @upload="file => $emit('upload', file)"></FilePicker>
                </div>
                <div v-if="analyses && analyses.length" class="menu-item" id="alphabet-picker">
                    <div>Alphabet</div>
                    <input type="radio"
                           name="alphabet"
                           id="radio-ipa"
                           value="ipa"
                           v-model="alphabet"
                           @change="$emit('setAlphabet', alphabet)"/>
                    <label for="radio-ipa">IPA</label>
                    <input
                        type="radio"
                        name="alphabet"
                        id="radio-arpabet"
                        value="arpabet"
                        v-model="alphabet"
                        @change="$emit('setAlphabet', alphabet)" />
                    <label for="radio-arpabet">ARPAbet</label>
                </div>
            </div>
        </div>
    `
});