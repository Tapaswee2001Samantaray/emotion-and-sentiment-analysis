import axios from 'axios';

export class TextAnalysisService {
    private static URL: string = "https://api.apilayer.com";
    private static apiKey: string = "ZXG2b3LhGVh7BDTk515nMptDr2T35w3w";

    public static showEmotions(raw: string) {
        let emotionURL = `${this.URL}/text_to_emotion`;

        const config = {
            headers: {
                apiKey: this.apiKey
            }
        }
        
        return axios.post(emotionURL, raw, config);
    }

    public static showSentiment(raw: string) {
        let sentimentURL = `${this.URL}/sentiment/analysis`;

        const config = {
            headers: {
                apiKey: this.apiKey
            }
        }
        
        return axios.post(sentimentURL, raw, config);
    }
}