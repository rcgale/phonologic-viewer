import {TranscriptPair} from "./TranscriptService.js";
import {ApiHelper} from "./ApiHelper.js";

export interface AnalysisDelta {
    left: string
    right: string
    cost: number
}

export interface AnalysisStep {
    expected: string
    actual: string
    cost: number
    action: string
    deltas: AnalysisDelta[]
}

export interface AnalysisDetails {
    distance: number
    expectedLength: number
    steps: Array<AnalysisStep>
    distanceFormatted: string
    errorRateFormatted: string
}

export interface Analysis {
    id: string
    transcriptPair: TranscriptPair
    features: AnalysisDetails
    phonemes: AnalysisDetails
    expected: string
    actual: string
    fer: number
    ferFormatted: string
    per: number
    perFormatted: string
}

export interface AnalysisException extends Analysis {
    id: string
    message: string
}

export class AnalysisCollection extends Array<Analysis> {
    featureDistance: number = NaN;
    featureLength: number = NaN;
    fer: number = NaN;
    ferFormatted: string = "ERROR";
    phonemeDistance: number = NaN;
    phonemeLength: number = NaN;
    per: number = NaN;
    perFormatted: string = "ERROR";
    exceptions: AnalysisException[];

    constructor(items: Analysis[], exceptions: AnalysisException[] = []) {
        super(...Array.from(items));
        this.exceptions = exceptions;
        [
            this.featureDistance,
            this.featureLength,
            this.phonemeDistance,
            this.phonemeLength
        ] = AnalysisCollection.summarize(items);
        if (!exceptions.length) {
            this.fer = this.featureDistance / this.featureLength;
            this.ferFormatted = formatPercent(this.fer);
            this.per = this.phonemeDistance / this.phonemeLength
            this.perFormatted = formatPercent(this.per);
        }
    }

    private static summarize(items: Analysis[]) {
        if (!items.length) {
            return [0, 0, 0, 0];
        }
        return Object.values(
            Array.from(items).map(a => ({
                    featureDistance: a.features.distance,
                    featureLength: a.features.expectedLength,
                    phonemeDistance: a.phonemes.distance,
                    phonemeLength: a.phonemes.expectedLength,
            })).reduce((partial, a) => {
                return {
                    featureDistance: partial.featureDistance + a.featureDistance,
                    featureLength: partial.featureLength + a.featureLength,
                    phonemeDistance: partial.phonemeDistance + a.phonemeDistance,
                    phonemeLength: partial.phonemeLength + a.phonemeLength,
                };
            })
        );
    }
}

const formatPercent = (p: number) => `${(p * 100).toFixed(1)}%`;

export class AnalysisService {
    static async getAll(transcriptPairs: TranscriptPair[]): Promise<Analysis[]> {
        let analysisResults = await Promise.all(
            transcriptPairs.map(
                async tp => {
                    try {
                        return await AnalysisService.getAnalysis(tp);
                    }
                    catch (e: any) {
                        return {id: tp.id, message: e.message} as AnalysisException;
                    }
                }
            )
        );
        // split analyses from exceptions
        const [analyses, exceptions] = analysisResults.reduce(([a, e], item) => {
            return "message" in item
                ?  [a, [...e, item as AnalysisException]]
                : [[...a, item as Analysis], e];
        }, [[], []] as [Analysis[], AnalysisException[]]);
        return new AnalysisCollection(analyses, exceptions);
    }

    private static async getAnalysis(transcriptPair: TranscriptPair): Promise<Analysis> {
        let [leftTranscript, rightTranscript] = transcriptPair.transcripts;
        return await ApiHelper.fetch(
            `/api/analyses/${leftTranscript}/${rightTranscript}/`,
            { cache: "force-cache" }
        ).then(
            r => AnalysisService.adaptAnalysis(transcriptPair.id, r, transcriptPair)
        );
    }

    private static adaptAnalysis(id: string, response: any, transcripts: TranscriptPair): Analysis|AnalysisException {
        let a = response.analysis;
        let fer = a.features.distance / a.features.expected_length;
        let per = a.phonemes.distance / a.phonemes.expected_length;
        return {
            id: id,
            transcriptPair: transcripts,
            features: {
                distance: a.features.distance,
                expectedLength: a.features.expected_length,
                steps: a.features.steps,
                distanceFormatted: `${AnalysisService.costFormatted(a.features.distance)}/${a.features.expected_length}`,
                errorRateFormatted: formatPercent(a.features.error_rate)
            },
            phonemes: {
                distance: a.phonemes.distance,
                expectedLength: a.phonemes.expected_length,
                steps: a.phonemes.steps,
                distanceFormatted: `${a.phonemes.distance}/${a.phonemes.expected_length}`,
                errorRateFormatted: formatPercent(a.phonemes.error_rate)
            },
            expected: a.features.steps.map((s: AnalysisStep) => s.expected).filter((t: string) => t),
            actual: a.features.steps.map((s: AnalysisStep) => s.actual).filter((t: string) => t),
            fer: fer,
            ferFormatted: formatPercent(fer),
            per: per,
            perFormatted: formatPercent(per)
        }
    }

    private static costFormatted(cost: number) {
        let rounded = Math.round(100 * (cost + Number.EPSILON)) / 100
        return `${rounded}`
    }
}
