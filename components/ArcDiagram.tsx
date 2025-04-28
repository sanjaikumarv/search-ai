/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { ExternalLink, ChevronRight } from "lucide-react"
import { Language, PromptData, Resource, TechStack } from "@/types"

// Define the Node type with the required properties
type Node = {
    id: string
    name: string
    category: string
    description: string
    codeExample?: string
    children?: Node[]
    data?: Language | TechStack
}


export default function ArcDiagram({ data }: { data: PromptData }) {
    // eslint-disable-next-line react-hooks/exhaustive-deps


    const svgRef = useRef<SVGSVGElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const detailsPanelRef = useRef<HTMLDivElement>(null)
    const [selectedNode, setSelectedNode] = useState<Node | null>(null)
    const [dimensions, setDimensions] = useState({ width: 340, height: 700 })
    // Process data to create hierarchical structure
    const processData = (data: PromptData): Node => {
        // Create root node
        const root: Node = {
            id: "root",
            name: data.prompt || "Technology Stack",
            category: "Root",
            description: "Root of the technology stack",
            children: [],
        }

        // Process languages
        if (data.languages && data.languages.length > 0) {
            root.children = data.languages.map((lang, langIndex) => {
                const langNode: Node = {
                    id: `lang_${langIndex}`,
                    name: lang.name || `Language ${langIndex + 1}`,
                    category: lang.category || "Language",
                    codeExample: lang.codeExample || "",
                    description: lang.description || "",
                    children: [],
                    data: lang,
                }

                // Process tech stacks
                if (lang.techStacks && lang.techStacks.length > 0) {
                    langNode.children = lang.techStacks.map((tech, techIndex) => {
                        const techNode: Node = {
                            id: `tech_${langIndex}_${techIndex}`,
                            name: tech.name || `Technology ${techIndex + 1}`,
                            codeExample: lang.codeExample || "",
                            category: tech.category || "Technology",
                            description: tech.description || "",
                            data: tech,
                        }
                        return techNode
                    })
                }

                return langNode
            })
        }

        return root
    }

    // Handle node selection
    const handleNodeClick = (node: Node) => {
        setSelectedNode(node)
    }

    // Handle zoom in

    const closeDetailsPanel = () => {
        setSelectedNode(null)
    }

    // Draw the diagram
    useEffect(() => {
        if (!svgRef.current) return

        // Clear previous diagram
        d3.select(svgRef.current).selectAll("*").remove()

        // Process data
        const hierarchyData = processData(data)

        // Set up SVG
        const svg = d3.select(svgRef.current)
        const width = dimensions.width
        const height = dimensions.height
        const margin = { top: 40, right: 40, bottom: 40, left: 40 }
        const innerWidth = width - margin.left - margin.right
        const innerHeight = height - margin.top - margin.bottom

        // Create a group for the diagram with zoom transform
        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top}) scale(${1})`)

        // Create tree layout - vertical orientation
        const treeLayout = d3.tree<Node>().size([innerWidth / 1, innerHeight / 1])

        // Create hierarchy
        const root = d3.hierarchy(hierarchyData) as d3.HierarchyNode<Node>

        // Assign x and y positions
        treeLayout(root)

        // Node dimensions
        const nodeWidth = 180
        const nodeHeight = 60

        // Draw links as curved paths
        g.selectAll(".link")
            .data(root.links())
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("d", (d) => {
                // Start at the bottom of the source node
                const sourceX = d.source.x
                const sourceY = (d.source.y ?? 0) + nodeHeight / 2

                // End at the top of the target node
                const targetX = d.target.x
                const targetY = (d.target.y ?? 0) - nodeHeight / 2

                // Control points for the curve
                const midY = (sourceY + targetY) / 2

                // Create an S-curve path
                return `
          M ${sourceX},${sourceY}
          C ${sourceX},${midY} ${targetX},${midY} ${targetX},${targetY}
        `
            })
            .attr("fill", "none")
            .attr("stroke", "#999")
            .attr("stroke-width", 1.5)
            .attr("stroke-dasharray", (d) => {
                // Make some links dashed based on some condition
                // For example, links to nodes with even indices
                const targetIndex = d.target.data.id.split("_").pop() || "0"
                return Number.parseInt(targetIndex) % 2 === 0 ? "5,5" : "none"
            })

        // Create node groups
        const nodeGroups = g
            .selectAll(".node")
            .data(root.descendants())
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", (d) => `translate(${(d.x ?? 0) - nodeWidth / 2},${(d.y ?? 0) - nodeHeight / 2})`)
            .style("cursor", "pointer")
            .on("click", (event, d) => {
                event.stopPropagation()
                handleNodeClick(d.data)
            })
            .attr("opacity", () => {
                return 1
            })

        // Add rectangles for nodes
        nodeGroups
            .append("rect")
            .attr("width", nodeWidth)
            .attr("height", nodeHeight)
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("fill", (d) => {
                if (selectedNode && selectedNode.id === d.data.id) {
                    return "#e0f2fe" // Light blue background for selected node
                }
                return "white"
            })
            .attr("stroke", (d) => {
                if (selectedNode && selectedNode.id === d.data.id) {
                    return "#0ea5e9" // Blue border for selected node
                }
                return "#fff"
            })
            .attr("stroke-width", (d) => {
                if (selectedNode && selectedNode.id === d.data.id) {
                    return 2
                }
                return 1
            })

        // Add text for nodes
        nodeGroups
            .append("text")
            .attr("x", nodeWidth / 2)
            .attr("y", nodeHeight / 2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("font-size", "14px")
            .attr("font-weight", "500")
            .attr("fill", "#333")
            .text((d) => d.data.name)
            .each(function (d) {
                // Handle multi-line text if needed
                const text = d3.select(this)
                const words = d.data.name.split(" ")

                if (words.length > 3) {
                    text.text("")

                    // First line
                    const firstLine = words.slice(0, Math.ceil(words.length / 2)).join(" ")
                    text
                        .append("tspan")
                        .attr("x", nodeWidth / 2)
                        .attr("dy", "-0.5em")
                        .text(firstLine)

                    // Second line
                    const secondLine = words.slice(Math.ceil(words.length / 2)).join(" ")
                    text
                        .append("tspan")
                        .attr("x", nodeWidth / 2)
                        .attr("dy", "1.2em")
                        .text(secondLine)
                }
            })

        // Add small circles at connection points
        g.selectAll(".connection-point")
            .data(root.links())
            .enter()
            .append("circle")
            .attr("class", "connection-point")
            .attr("cx", (d) => d.source.x ?? 0)
            .attr("cy", (d) => d.source.y ?? 0 + nodeHeight / 2)
            .attr("r", 3)
            .attr("fill", "#999")

        g.selectAll(".connection-point-target")
            .data(root.links())
            .enter()
            .append("circle")
            .attr("class", "connection-point-target")
            .attr("cx", (d) => d.target.x ?? 0)
            .attr("cy", (d) => d.target.y ?? 0 - nodeHeight / 2)
            .attr("r", 3)
            .attr("fill", "#999")
    }, [data, dimensions, selectedNode, 1])

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            const container = containerRef.current
            if (container) {
                const containerWidth = container.clientWidth
                // For the flex layout, we'll use about 60% of the width for the diagram
                const diagramWidth = Math.floor(containerWidth * 0.58)

                setDimensions({
                    width: diagramWidth,
                    height: Math.max(700, diagramWidth * 0.9),
                })
            }
        }

        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // If details panel exists and is open
            if (detailsPanelRef.current && selectedNode) {
                // Check if click was outside the details panel and not on an SVG element (diagram)
                if (!detailsPanelRef.current.contains(event.target as any) && !(event.target instanceof SVGElement)) {
                    closeDetailsPanel()
                }
            }
        }

        // Add event listener when selectedNode exists
        if (selectedNode) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        // Clean up event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [selectedNode])


    // Get category color
    const getCategoryColor = (category: string) => {
        switch (category) {
            case "Programming Language":
                return "bg-purple-100 text-purple-800 border-purple-200"
            case "IDE":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "UI Framework":
                return "bg-green-100 text-green-800 border-green-200"
            case "Framework":
                return "bg-green-100 text-green-800 border-green-200"
            case "Library":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "Tool":
                return "bg-orange-100 text-orange-800 border-orange-200"
            case "Platform":
                return "bg-red-100 text-red-800 border-red-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    return (
        <div className="" ref={containerRef}>
            <div className="max-w-7xl mx-auto">
                {/* Left side - Diagram */}
                <div className="">

                    {/* Diagram */}
                    <div className="rounded-lg shadow-lg ">
                        <svg
                            ref={svgRef}
                            width={dimensions.width}
                            height={dimensions.height}
                            className=" rounded-lg w-inherit mx-auto p-4"
                            style={{ background: "#1a1a1a" }}
                        />
                    </div>
                </div>

                {/* Right side - Details panel */}
                <div ref={detailsPanelRef} className="w-full  overflow-y-scroll fixed md:w-2/5  top-0 right-0 bg-white rounded-bl-lg rounded-tl-lg shadow-lg ">
                    {selectedNode && selectedNode.data && (
                        <div className="h-screen overflow-visible">
                            {/* Header */}
                            <div className="p-4 border-b bg-gray-50">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">{selectedNode.name}</h2>
                                        <span
                                            className={`inline-block px-3 py-1 text-xs font-medium rounded-full mt-1 border ${getCategoryColor(
                                                selectedNode.category,
                                            )}`}
                                        >
                                            {selectedNode.category}
                                        </span>
                                    </div>
                                </div>
                            </div>


                            {/* Content */}
                            <div className="p-6 overflow-y-auto flex-1">
                                <p className="text-gray-700 leading-relaxed">{selectedNode.description}</p>

                                {selectedNode.data.details &&
                                    selectedNode.data.details.length > 0 &&
                                    selectedNode.data.details[0] !== "" && (
                                        <div className="mt-6">
                                            <h3 className="font-semibold text-gray-800 flex items-center text-base">
                                                <ChevronRight className="w-5 h-5 mr-1 text-blue-500" />
                                                Key Features
                                            </h3>
                                            <ul className="mt-2 pl-5 list-disc space-y-1">
                                                {selectedNode.data.details.map((detail: string, i: number) => (
                                                    <li key={i} className="text-gray-600">
                                                        {detail}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                {selectedNode.data.useCases &&
                                    selectedNode.data.useCases.length > 0 &&
                                    selectedNode.data.useCases[0] !== "" && (
                                        <div className="mt-6">
                                            <h3 className="font-semibold text-gray-800 flex items-center text-base">
                                                <ChevronRight className="w-5 h-5 mr-1 text-blue-500" />
                                                Use Cases
                                            </h3>
                                            <ul className="mt-2 pl-5 list-disc space-y-1">
                                                {selectedNode.data.useCases.map((useCase: string, i: number) => (
                                                    <li key={i} className="text-gray-600">
                                                        {useCase}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                {selectedNode.codeExample &&
                                    <div className="p-4">
                                        <h5 className="font-bold text-gray-800 mt-2">Code Example:</h5>
                                        <pre className="bg-gray-800 max-h-[300px] overflow-auto text-white p-4 rounded-lg overflow-x-auto">
                                            <code>{selectedNode.codeExample}</code>
                                        </pre>
                                    </div>
                                }

                                {selectedNode.data.resources &&
                                    selectedNode.data.resources.length > 0 &&
                                    selectedNode.data.resources[0].title !== "" && (
                                        <div className="mt-6">
                                            <h3 className="font-semibold text-gray-800 flex items-center text-base">
                                                <ChevronRight className="w-5 h-5 mr-1 text-blue-500" />
                                                Resources
                                            </h3>
                                            <ul className="mt-3 space-y-3">
                                                {selectedNode.data.resources.map((resource: Resource, i: number) => (
                                                    <li key={i} className="bg-gray-50 p-3 rounded-md border border-gray-100">
                                                        <a
                                                            href={resource.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:underline font-medium flex items-center"
                                                        >
                                                            {resource.title}
                                                            <ExternalLink className="w-3 h-3 ml-1" />
                                                        </a>
                                                        <p className="text-sm text-gray-500 mt-1">{resource.description}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
