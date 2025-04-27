"use client"

import type React from "react"
import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getDataByAI, savePrompts } from "@/lib/db.utils"
import { PromptData } from "@/types"

export default function SearchInput({ setData }: { setData: React.Dispatch<React.SetStateAction<PromptData | null>> }) {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setIsSearching(true)
    try {
      const { languages = [], prompt = "" } = await getDataByAI(query)
      await savePrompts({ prompt: query, languages: languages })
      setData({ prompt: prompt, languages: languages })
      setIsSearching(false)
    } catch (error: unknown) {
      setIsSearching(false)
      if (error instanceof Error && error.message) {
        window.alert(error.message);
      } else {
        window.alert("An unexpected error occurred.");
      }
    }
  }



  return (
    <div>
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
    </div>
  )
}
