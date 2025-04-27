/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import ArcDiagram from "@/components/ArcDiagram"
// import { performSearch } from "@/app/actions/search-actions"
type Resource = {
    title: string;
    url: string;
    description: string;
};

type TechStack = {
    name: string;
    description: string;
    isRoot: boolean;
    category: string;
    codeExample: string;
    details: string[];
    useCases: string[];
    resources: Resource[];
};

type Language = {
    name: string;
    description: string;
    isRoot: boolean;
    category: string;
    codeExample: string;
    details: string[];
    useCases: string[];
    resources: Resource[];
    techStacks: TechStack[];
};

type PromptData = {
    prompt: string;
    languages: Language[];
};


export default function SearchInput({ setData, data }: { setData: React.Dispatch<React.SetStateAction<PromptData | null>>, data: PromptData | null }) {
    const [query, setQuery] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const [result, setResult] = useState<string | null>(null)

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return
        const message = `
    ${query}
  
    I need all technology details about ${query}.
  
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
    .
    I need my query related all languages and language related all tech stacks.

    Provide detailed language and tech stack information corresponding to my ${query}.
  `;

        setIsSearching(true)
        setResult(null)
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: message }]
                })
            });
            setIsSearching(false)
            const data = await response.json();
            const content = JSON.parse(data.choices[0].message.content)
            console.log("cntent", content)
            setData(content)
        } catch (error: any) {
            setIsSearching(false)
            window.alert(error.response.data.message)
        }


    }



    return (
        <div className="container  p-8 ">
            <h1 className="text-3xl font-bold mb-8 text-center">AI Search</h1>

            <form onSubmit={handleSearch} className="mb-8 mx-auto max-w-3xl">
                <div className="flex gap-2">
                    <Input
                        type="text"
                        placeholder="Ask anything..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1"
                    />
                    <Button type="submit" disabled={isSearching}>
                        {isSearching ? (
                            <div className="flex items-center">
                                <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                                Searching...
                            </div>
                        ) : (
                            <>
                                <Search className="mr-2 h-4 w-4" />
                                Search
                            </>
                        )}
                    </Button>
                </div>
            </form>

            {result && (
                <div className="space-y-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="prose dark:prose-invert max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, "<br />") }} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

        </div>
    )
}
