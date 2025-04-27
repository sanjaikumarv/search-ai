export const mutation = `
            mutation InsertPrompt($prompt: String!, $languages: JSON!) {
                insertIntoprompt_datasCollection(
                    objects: [{
                        prompt: $prompt,
                        languages: $languages
                    }]
                ) {
                    records {
                        id
                        prompt
                        languages
                    }
                }
            }
        `;
