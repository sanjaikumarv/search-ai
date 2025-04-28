import { PromptData } from "@/types";
import { getQueryFromContent, mutation, query } from "./queries";
import axios from "axios";
import { openAiSecretKey, openAiApiUrl, supabaseAnonKey, supabaseUrl } from "./env";



export async function getAllPrompts() {
    try {
        const { data: { data: { prompt_datasCollection: { edges = [] } = {} } = {} } = {} } = await axios.post(supabaseUrl!, {
            query: query
        }, {
            headers: {
                'Content-Type': 'application/json',
                'apikey': supabaseAnonKey
            },
        });
        return edges || []

    } catch (error) {
        console.error('Error fetching prompt data:', error);
        return [];
    }
}

export async function savePrompts(payloadData: PromptData) {
    try {
        const data = await axios.post(supabaseUrl!, {
            query: mutation,
            variables: {
                prompt: payloadData.prompt,
                languages: JSON.stringify(payloadData.languages)
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'apikey': supabaseAnonKey
            },
        });

        return data
    } catch (error) {

        return { data: null, success: false, error };
    }
}

export async function getDataByAI(message: string) {
    try {
        const response = await axios.post(openAiApiUrl, {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: getQueryFromContent(message) }]
        }, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openAiSecretKey}`,
                'Content-Type': 'application/json'
            },
        });
        return JSON.parse(response?.data?.choices[0]?.message?.content)
    } catch {
        window.alert("Unable to generate response");
    }
}
