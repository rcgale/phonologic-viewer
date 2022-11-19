export class ApiHelper {
    static async fetch(input: RequestInfo | URL, init?: RequestInit) {
        return fetch(input, init).then(r => {
            if (!r.ok) {
                return r.json().then(e => { throw Error(e.message)})
            }
            return r.json();
        });
    }
}
