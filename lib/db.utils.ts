import { PromptData } from "@/types";
import { getQueryFromContent, mutation, query } from "./queries";
import axios from "axios";

export async function getAllPrompts() {

    try {
        const { data: { data: { prompt_datasCollection: { edges = [] } = {} } = {} } = {} } = await axios.post(process.env.NEXT_PUBLIC_SUBABASE_URL!, {
            query: query
        }, {
            headers: {
                'Content-Type': 'application/json',
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ACCESS_KEY
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
        const data = await axios.post(process.env.NEXT_PUBLIC_SUBABASE_URL!, {
            query: mutation,
            variables: {
                prompt: payloadData.prompt,
                languages: JSON.stringify(payloadData.languages)
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ACCESS_KEY!
            },
        });

        return data
    } catch (error) {
        window.alert(error);
        return { data: null, success: false, error };
    }
}

export async function getDataByAI(message: string) {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: getQueryFromContent(message) }]
        }, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
        });
        return JSON.parse(response?.data?.choices[0]?.message?.content) || { prompt: "", languages: [] };
    } catch (error: unknown) {
        if (error instanceof Error && error.message) {
            window.alert(error.message);
        } else {
            window.alert("An unexpected error occurred.");
        }
    }
}
