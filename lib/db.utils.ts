import { PromptData } from "@/types";
import { supabase } from "./subabase";

export async function getAllPrompts() {
    try {
        const { data, error } = await supabase
            .from("prompt_datas")
            .select("*")

        if (error) throw error;
        return { data, success: true };
    } catch (error) {
        console.error("Error fetching watch history:", error);
        return { data: [], success: false, error };
    }
}

export async function savePrompts(data: PromptData) {
    try {
        const { data: insertedData, error } = await supabase
            .from("prompt_datas") // Replace with your actual table name
            .insert([
                {
                    prompt: data.prompt,
                    languages: data.languages,
                },
            ])
            .select()

        if (error) throw error
        return { data: insertedData, success: true }
    } catch (error) {
        console.error("Error inserting data:", error)
        return { data: null, success: false, error }
    }
}