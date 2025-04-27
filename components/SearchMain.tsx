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
import SearchInput from "./SearchInput"
import { Sidebar } from "./sidebar"
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


export default function SearchMain() {

    const [data, setData] = useState<PromptData | null>(null)

    return (
        <div className="container  p-8 ">
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1">
                    <SearchInput setData={setData} data={data} />
                    {data &&
                        <ArcDiagram data={data} />
                    }
                </div>
            </div>


        </div>
    )
}
