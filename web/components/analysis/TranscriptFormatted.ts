// @ts-ignore
import {defineComponent} from "../../_vue/vue.esm-browser.js";

export default defineComponent({
    props: ["transcript", "alphabet"],
    methods: {
        transcriptFormatted(tokens: string[] | string) {
            if (!tokens) {
                return "";
            }
            // @ts-ignore
            if (!tokens.join) {
                tokens = [tokens as string];
            }
            tokens = (tokens as string[]);

            const arpaToIpa: any = {
                "P": "p", "B": "b", "M": "m", "W": "w", "F": "f", "V": "v", "DH": "ð", "TH": "θ", "T": "t",
                "D": "d", "S": "s", "Z": "z", "N": "n", "L": "l", "DX": "ɾ", "CH": "t͡ʃ", "JH": "d͡ʒ", "SH": "ʃ",
                "ZH": "ʒ", "R": "ɹ", "Y": "j", "K": "k", "G": "ɡ", "NG": "ŋ", "HH": "h", "IY": "i", "UW": "u",
                "IH": "ɪ", "UH": "ʊ", "EH": "ɛ", "EY": "e͡ɪ", "AH": "ʌ", "AO": "ɔ", "OY": "ɔ͡ɪ", "OW": "o͡ʊ",
                "AE": "æ", "AW": "a͡ʊ", "AY": "a͡ɪ", "AA": "ɑ", "ER": "ɝ"
            }
            if ((this as any).alphabet === "ipa") {
                return tokens.map(t => arpaToIpa[t] || t).join("");
            }
            else {
                return tokens.join(" ");
            }
        },
    },
    template: `
    <span class="transcript">{{transcriptFormatted(transcript)}}</span>`
})