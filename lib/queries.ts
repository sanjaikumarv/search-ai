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


export const query = `
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

export const getQueryFromContent = (inputQuery: string) => `
    ${inputQuery}
  
    I need all technology details about ${inputQuery}.
  
    Keys = Technology names  
    Values = A detailed description (at least 4-5 lines) explaining:
    - What the tech stack is
    - Why it's important
    - How it's used
    - Reference docs link
  
    Please respond **only in JSON format**.
  
    Example JSON response format:
  
    {
      "prompt": "",
      "languages": [
        {
          "name": "",
          "description": "",
          "isRoot": true,
          "category": "",
          "codeExample": "",
          "details": [
            "",
            "",
            "",
            "",
            ""
          ],
          "useCases": [
            "",
            "",
            "",
            "",
            ""
          ],
          "resources": [
            {
              "title": "",
              "url": "",
              "description": ""
            }
          ],
           "techStacks": [
            {
              "name": "",
              "description": "",
              "isRoot": true,
              "category": "",
              "codeExample": "",
              "details": [
                "",
                "",
                "",
                "",
                ""
              ],
              "useCases": [
                "",
                "",
                "",
                "",
                ""
              ],
              "resources": [
                {
                  "title": "",
                  "url": "",
                  "description": ""
                }
              ]
            }
          ] 
        }
      ]
    }
  
    I need this type of JSON response.

   I need my query related all languages and language related all tech stacks.

    and need some code example from the codeExample json key in string format.

    Provide detailed all language information corresponding to my ${inputQuery}.

    if ${inputQuery} not related to any data or languages please given empty json".
  `;