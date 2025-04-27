/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronRight, Search, FolderOpen, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
// import { getCollections } from "@/app/actions/search-actions"

export function Sidebar() {
  const pathname = usePathname()
  const [collections, setCollections] = useState<any[]>([])
  const [openCollections, setOpenCollections] = useState<Record<string, boolean>>({})

  // useEffect(() => {
  //   const fetchCollections = async () => {
  //     const collectionsData = await getCollections()
  //     setCollections(collectionsData)
  //   }

  //   fetchCollections()

  //   // Set up polling to refresh collections every 5 seconds
  //   const interval = setInterval(fetchCollections, 5000)
  //   return () => clearInterval(interval)
  // }, [])

  const toggleCollection = (id: string) => {
    setOpenCollections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div className="w-64 border-r h-screen flex flex-col">
      <div className="p-4 border-b">
        <Link href="/search">
          <Button variant="outline" className="w-full justify-start">
            <Search className="mr-2 h-4 w-4" />
            New Search
          </Button>
        </Link>
      </div>
      <div className="p-4 border-b">
        <h2 className="font-semibold mb-2">Collections</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {collections.map((collection) => (
            <div key={collection.id} className="mb-2">
              <div
                className="flex items-center p-2 rounded-md hover:bg-muted cursor-pointer"
                onClick={() => toggleCollection(collection.id)}
              >
                {openCollections[collection.id] ? (
                  <ChevronDown className="h-4 w-4 mr-1" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-1" />
                )}
                {openCollections[collection.id] ? (
                  <FolderOpen className="h-4 w-4 mr-2" />
                ) : (
                  <Folder className="h-4 w-4 mr-2" />
                )}
                <span className="text-sm truncate">{collection.name}</span>
              </div>

              {openCollections[collection.id] && <CollectionTree collectionId={collection.id} />}
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
          className={`block p-2 text-sm rounded-md hover:bg-muted ${
            pathname === `/collections/${collectionId}/items/${item.id}` ? "bg-muted" : ""
          }`}
        >
          <div className="truncate">{item.query}</div>
        </Link>
      ))}
    </div>
  )
}
