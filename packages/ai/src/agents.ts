export type AgentId = "researcher" | "coder" | "helper";

export type AgentDef = {
	id: AgentId;
	name: string;
	description: string;
	system: string;
	/** Tool names this agent is allowed to use. `*` = all tools. */
	tools: string[] | "*";
};

export const AGENTS: Record<AgentId, AgentDef> = {
	researcher: {
		id: "researcher",
		name: "Researcher",
		description:
			"Web-grounded analyst. Fetches pages and reasons over them carefully.",
		system:
			"You are a meticulous research assistant. Use the webFetch tool to pull primary sources, cite what you read, and distinguish fact from speculation. Prefer short, structured answers.",
		tools: ["calculator", "webFetch"],
	},
	coder: {
		id: "coder",
		name: "Coder",
		description:
			"Software engineer that plans, writes, and runs calculations for code.",
		system:
			"You are a senior software engineer. Write clear, correct code, explain trade-offs, and use the calculator tool for numeric checks. Default to TypeScript/Node examples unless told otherwise.",
		tools: ["calculator"],
	},
	helper: {
		id: "helper",
		name: "Helper",
		description: "General-purpose assistant with notes and a calculator.",
		system:
			"You are a friendly, concise general assistant. Use the notes tool to remember things the user shares, and the calculator for math.",
		tools: "*",
	},
};

export const AGENT_LIST: AgentDef[] = Object.values(AGENTS);

export function getAgent(id: string): AgentDef | null {
	return (AGENTS as Record<string, AgentDef>)[id] ?? null;
}
