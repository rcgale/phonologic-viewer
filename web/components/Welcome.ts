// @ts-ignore
import {defineComponent} from "../_vue/vue.esm-browser.js";

export default defineComponent({
    data() {
        const csvHeader = "Utterance ID,Human transcript,ASR transcript\n"
        const csvBody =   "MyUtterance01-house,EY HH AW S,HH AW S\n" +
                          "MyUtterance01-comb,K OW M,K OW M\n" +
                          "MyUtterance01-toothbrush,T UW TH B R AH SH,T UW B R AH SH\n"
        let exampleFile = new File([csvHeader, csvBody], "example.csv")
        let exampleDownloadLink = window.URL.createObjectURL(exampleFile);
        return {
            csvHeader: csvHeader,
            csvBody: csvBody,
            exampleFile: exampleFile,
            exampleDownloadLink: exampleDownloadLink,
        }
    },
    emits: ['useDemoFile'],
    template: `
      <div id="welcome" class="main-pane">
      <h1>
        Welcome to PhonoLogic Viewer!
      </h1>
      <p>
        To get started, please use the Browse button above to upload a spreadsheet in .csv or .tsv format. In
        each row, the first column should contain a unique utterance ID, the second column should contain the
        "left" transcript (e.g. an Human Transcript), and the third column should contain the "right" transcript
        (e.g. an ASR transcript). You can choose your own (unique) labels in the header, which will be displayed
        in the resulting analyses. Here's what an example of a data file would look like:
      </p>

      <table id="example-spreadsheet">
        <thead>
        <tr>
          <th v-for="columnName in csvHeader.split(',')">
            {{ columnName }}
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="row in csvBody.split('\\n').filter(r => r.trim())">
          <td v-for="cellText in row.split(',')">{{ cellText }}</td>
        </tr>
        </tbody>
      </table>
      <ul style="margin: 1.5rem auto; width: 16rem;">
        <li>
          <a :href="exampleDownloadLink" download>
            Download example.csv
          </a>
        </li>
        <li>
          <button class="button-as-link" @click="$emit('useDemoFile', exampleFile)">
            Use example.csv
          </button>
        </li>
      </ul>   
       
      

      </div>`
});
