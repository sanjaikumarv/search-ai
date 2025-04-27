export type Resource = {
    title: string;
    url: string;
    description: string;
};

export type TechStack = {
    name: string;
    description: string;
    isRoot: boolean;
    category: string;
    codeExample: string;
    details: string[];
    useCases: string[];
    resources: Resource[];
};

export type Language = {
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

export type PromptData = {
    prompt: string;
    languages: Language[];
};
