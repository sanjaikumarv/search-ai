"use client"

import type React from "react"
import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getDataByAI, savePrompts } from "@/lib/db.utils"
import { PromptData } from "@/types"

export default function SearchInput({ setData, fetchData }: { setData: React.Dispatch<React.SetStateAction<PromptData | null>>, fetchData: () => Promise<void> }) {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setIsSearching(true)
    try {
      const { languages = [], prompt = "" } = await getDataByAI(query)
      if (languages.length > 0 && !!prompt) {
        await savePrompts({ prompt: query, languages: languages })
        await fetchData()
        setData({ prompt: prompt, languages: languages })
      } else {
        window.alert("No data matching your query")
      }
      setIsSearching(false)
    } catch {
      setIsSearching(false)
      window.alert("Unable to generate response");
    }
  }
  return (
    <div className="mt-5 mx-2">
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
            <div className="flex items-center">
              {isSearching ? (
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" >
                  ...
                </div>
              ) : (
                <div className="">
                  <Search className="h-4 w-4" />
                </div>
              )}
            </div>
          </Button>
        </div>
      </form>
    </div>
  )
}
