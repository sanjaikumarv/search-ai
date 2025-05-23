
"use client"

import type React from "react"

import { useEffect, useState } from "react"
import ArcDiagram from "@/components/ArcDiagram"
import { Sidebar } from "./sidebar"
import { getAllPrompts } from "@/lib/db.utils"
import { PromptData } from "@/types"


export default function SearchMain() {

    const [data, setData] = useState<PromptData | null>(null)
    const [prompts, setPrompts] = useState<PromptData[] | null>(null)

    async function fetchData() {
        const data = await getAllPrompts();
        setPrompts(data || []);
        const lastData = data?.[data.length - 1]?.node
        setData({ prompt: lastData.prompt, languages: JSON.parse(lastData.languages) })
    }
    useEffect(() => {
        fetchData()
    }, [])


    return (
        <div>
            <div className="flex h-screen">
                <Sidebar fetchData={fetchData} prompts={prompts || []} setData={setData} />
                <div className="flex-1 mt-5">
                    {data &&
                        <ArcDiagram data={data} />
                    }
                </div>
            </div>
        </div>
    )
}
