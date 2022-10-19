export interface TranscriptPair {
    id: string
    transcripts: [string, string]
}

export interface TranscriptCollection {
    filename: string
    labels: [string, string]
    rows: TranscriptPair[]
}

export class TranscriptService {
    static async getTranscripts(file: File): Promise<TranscriptCollection> {
        const requestBody = {
            filename: file.name,
            content: await file.text(),
        }
        return await fetch("/api/transcripts/", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        }).then((r) => r.json()).then(data => {
            let index = Object.keys(data.rows);
            return {
                filename: data.filename,
                labels: data.labels,
                rows: index.map(idx => ({id: idx, transcripts: data.rows[idx]} as TranscriptPair))
            } as TranscriptCollection;
        });
    }
}

export default TranscriptService;