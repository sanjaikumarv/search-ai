/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronRight, Search, FolderOpen, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PromptData } from "@/types"
import SearchInput from "./SearchInput"
// import { getCollections } from "@/app/actions/search-actions"

export function Sidebar({ prompts, setData, fetchData }: { prompts: PromptData[]; setData: React.Dispatch<React.SetStateAction<PromptData | null>>, fetchData: () => Promise<void> }) {
  return (
    <div className="w-[350px] border-r h-screen flex flex-col">
      <SearchInput fetchData={fetchData} setData={setData} />
      <div className="px-4 pt-4">
        <h2 className="font-semibold">Collections</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 max-h-[550px] overflow-y-scroll">
          {prompts.map(({ node: collection }: any) => (
            <div key={collection.id} className="mb-2">
              <div
                className="flex items-center p-2 rounded-md hover:bg-muted cursor-pointer"
                onClick={() => setData({ prompt: collection.prompt, languages: JSON.parse(collection.languages) })}
              >
                {prompts[collection.id] ? (
                  <ChevronDown className="h-4 w-4 mr-1" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-1" />
                )}
                {prompts[collection.id] ? (
                  <FolderOpen className="h-4 w-4 mr-2" />
                ) : (
                  <Folder className="h-4 w-4 mr-2" />
                )}
                <span className="text-sm truncate">{collection.prompt.length > 30 ? `${collection.prompt.slice(0, 30)}...` : collection.prompt}</span>
              </div>

              {prompts[collection.id] && <CollectionTree collectionId={collection.id} />}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

function CollectionTree({ collectionId }: { collectionId: string }) {
  const [items, setItems] = useState<any[]>([])
  const pathname = usePathname()

  useEffect(() => {
    const fetchItems = async () => {
      const itemsData = await fetch(`/api/collections/${collectionId}/items`).then((res) => res.json())
      setItems(itemsData)
    }

    fetchItems()
  }, [collectionId])

  return (
    <div className="ml-6 mt-1 space-y-1">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/collections/${collectionId}/items/${item.id}`}
          className={`block p-2 text-sm rounded-md hover:bg-muted ${pathname === `/collections/${collectionId}/items/${item.id}` ? "bg-muted" : ""
            }`}
        >
          <div className="truncate">{item.query}</div>
        </Link>
      ))}
    </div>
  )
}
