import {NextRequest, NextResponse} from "next/server";
import {type MessageList} from "@/types";
import {
    createParser,
    ParsedEvent,
    ReconnectInterval,
} from "eventsource-parser";
import {MAX_TOKEN, TEMPERATURE} from "@/constant";

export const runtime = 'edge'

type StreamPayload = {
    model: string;
    messages: MessageList;
    temperature?: number;
    stream: boolean;
    max_tokens?: number;
};

export async function POST(req: NextRequest) {
    const {prompt, history = [], options = {}} = await req.json();

    const {max_tokens, temperature} = options
    const data = {
        model: "gpt-3.5-turbo",
        messages: [
            // {
            //     role: "system",
            //     content: options.prompt,
            // },
            // ...history,
            {
                role: "user",
                content: prompt,
            },
        ],
        stream: true,
        temperature: Number(temperature) || TEMPERATURE,
        max_tokens: Number(max_tokens) || MAX_TOKEN
    };

    const stream = await requestStream(data as any);
    return new Response(stream);
    // return NextResponse.json({msg: "hello world"})
}

async function requestStream(payload: StreamPayload) {
    let counter = 0;
    const resp = await fetch(
        "https://proxy-1.ultrasamscai.com/v1/chat/completions",
        {
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(payload),
        }
    );

    if (resp.status !== 200) {
        return resp.body;
    }

    return createStream(resp, counter);
}

function createStream(response: Response, counter: number) {
    const decoder = new TextDecoder("utf-8");
    const encoder = new TextEncoder();
    return new ReadableStream({
        async start(controller) {
            const onParse = (event: ParsedEvent | ReconnectInterval) => {
                if (event.type === "event") {
                    const data = event.data;
                    // console.log("data", data);
                    if (data === "[DONE]") {
                        controller.close();
                        return;
                    }
                    try {
                        const json = JSON.parse(data);
                        const text = json.choices[0]?.delta?.content || "";
                        if (counter < 2 && (text.match(/\n/) || []).length) {
                            return;
                        }
                        const q = encoder.encode(text);
                        controller.enqueue(q);
                        counter++;
                    } catch (error) {
                    }
                }
            };
            const parser = createParser(onParse);

            for await (const chunk of response.body as any) {
                parser.feed(decoder.decode(chunk));
            }
        },
    });
}