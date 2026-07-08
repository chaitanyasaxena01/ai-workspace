import {
	convertToModelMessages,
	stepCountIs,
	streamText,
	type UIMessage,
} from "ai";

import { AGENTS, getAgent, type AgentId } from "./agents";
import { resolveModel, type AiEnv } from "./providers";
import { createTools, type NoteStore } from "./tools";

export { AGENTS, AGENT_LIST, getAgent } from "./agents";
export type { AgentDef, AgentId } from "./agents";
export { resolveModel } from "./providers";
export type { AiEnv } from "./providers";
export { createTools } from "./tools";
export type { AgentTools, NoteStore } from "./tools";

export type RunAgentOptions = {
	messages: UIMessage[];
	agentId: string;
	model: string;
	env: AiEnv;
	kv?: NoteStore;
};

/**
 * Run an agent: resolve the model, filter the agent's allowed tools, and
 * stream the result. Returns the `streamText` result so the caller can choose
 * how to serialize it (e.g. `result.toUIMessageStreamResponse()`).
 */
export function runAgent(options: RunAgentOptions) {
	const agent = getAgent(options.agentId) ?? AGENTS.helper;
	const model = resolveModel(options.model, options.env);
	const allTools = createTools(options.kv);
	const tools =
		agent.tools === "*"
			? allTools
			: Object.fromEntries(
					Object.entries(allTools).filter(([name]) =>
						agent.tools.includes(name),
					),
				);

	return streamText({
		model,
		system: agent.system,
		messages: convertToModelMessages(options.messages),
		tools,
		stopWhen: stepCountIs(5),
	});
}
