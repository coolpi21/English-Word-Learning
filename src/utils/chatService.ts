import {Message} from "@/types";

type StreamParams = {
    prompt: string;
    history?: Message[];
    options?: {
        temperature?: number;
        max_tokens?: number;
        // top_p?: number;
        // frequency_penalty?: number;
        // presence_penalty?: number;
    };
};

type Actions = {
    onCompleting: (sug: string) => void;
    onCompleted?: (sug: string) => void;
};

// export const getCompletion = async (params: Props) => {
// 	const resp = await fetch("/api/chat", {
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 		method: "POST",
// 		body: JSON.stringify(params),
// 	});

// 	if (!resp.ok) {
// 		throw new Error(resp.statusText);
// 	}

// 	return await resp.json();
// };

class ChatService {
    private controller: AbortController;
    private static instance: ChatService;
    public actions?: Actions;

    private constructor() {
        this.controller = new AbortController();
    }

    public static getInstance(): ChatService {
        if (!ChatService.instance) {
            ChatService.instance = new ChatService();
        }

        return ChatService.instance;
    }

    public async getStream(params: StreamParams) {
        const {prompt, history = [], options = {}} = params;

        let suggestion = "";
        try {
            const response = await fetch("/api/word", {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    prompt,
                }),
                signal: this.controller.signal,
            });


            const data = response.body;
            if (!data) {
                return;
            }

            const reader = data.getReader();
            const decoder = new TextDecoder("utf-8");

            let done = false;
            while (!done) {
                const {value, done: doneReadingStream} = await reader.read();
                done = doneReadingStream;

                const chunkValue = decoder.decode(value);
                suggestion += chunkValue;
                this.actions?.onCompleting(suggestion);
                await new Promise((resolve) => setTimeout(resolve, 100));
            }
        } catch (error) {
        } finally {
            this.actions?.onCompleted?.(suggestion);
            this.controller = new AbortController();
        }
    }

    public cancel() {
        this.controller.abort();
    }
}

const chatService = ChatService.getInstance();

export default chatService;
