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


export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [data, setData] = useState<PromptData | null>(null)

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
      setData(content)
    } catch (error: any) {
      setIsSearching(false)
      window.alert(error.response.data.message)
    }


  }
  console.log("data", data)


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
      {data &&
        <ArcDiagram data={data} />
      }
    </div>
  )
}

const DynamicPromptUI = ({ data }: { data: PromptData }) => {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 capitalize">{data.prompt}</h1>
      <div className="space-y-6">
        {data.languages.map((item, idx) => (
          <DetailCard key={idx} item={item} />
        ))}
      </div>
    </div>
  );
};

const DetailCard = ({ item }: { item: Language | TechStack }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-2xl shadow-md p-4 bg-white">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">{item.name}</h2>
          <p className="text-sm text-gray-500">{item.category}</p>
          <p className="mt-2 text-gray-700">{item.description}</p>
        </div>
        <button
          className="text-blue-600 font-medium hover:underline"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Hide Details" : "Show Details"}
        </button>
      </div>
    </div>
  );
};

const Section = ({ title, items }: { title: string; items: string[] }) => (
  <div>
    <h3 className="font-semibold mb-1">{title}:</h3>
    <ul className="list-disc list-inside space-y-1 text-gray-700">
      {items.map((text, i) => (
        <li key={i}>{text}</li>
      ))}
    </ul>
  </div>
);

const ResourceSection = ({ resources }: { resources: Resource[] }) => (
  <div>
    <h3 className="font-semibold mb-1">Resources:</h3>
    <ul className="space-y-2">
      {resources.map((res, i) => (
        <li key={i}>
          <a
            href={res.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {res.title}
          </a>
          <p className="text-sm text-gray-600">{res.description}</p>
        </li>
      ))}
    </ul>
  </div>
);
