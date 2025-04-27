import { PromptData } from "@/types";
import { mutation } from "./queries";

export async function getAllPrompts() {
    const SUPABASE_URL = "https://gvghohbdgnaesrzjichm.supabase.co/graphql/v1";
    const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ACCESS_KEY!;
    if (!SUPABASE_URL || !SUPABASE_KEY) {
        throw new Error("Supabase URL or Key is not defined in the environment variables.");
    }
    // GraphQL query with pagination
    const query = `
    {
      prompt_datasCollection {
        edges {
          node {
            id
            prompt
            languages
          }
        }
      }
    }
  `;

    try {
        const response = await fetch(SUPABASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY
            },
            body: JSON.stringify({
                query: query
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.data.prompt_datasCollection.edges;

    } catch (error) {
        console.error('Error fetching prompt data:', error);
        throw error;
    }
}

export async function savePrompts(payloadData: PromptData) {
    try {

        const response = await fetch(process.env.NEXT_PUBLIC_SUBABASE_URL!, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ACCESS_KEY!
            },
            body: JSON.stringify({
                query: mutation,
                variables: {
                    prompt: payloadData.prompt,
                    languages: JSON.stringify(payloadData.languages) // Convert the array to a JSON
                }
            })
        });

        const data = await response.json();
        const dataMain = data.data.insertIntoprompt_datasCollection.records[0]

        return {
            data: {
                prompt: dataMain.prompt,
                languages: JSON.parse(dataMain.languages)
            }, success: true
        };
    } catch (error) {
        window.alert(error);
        return { data: null, success: false, error };
    }
}