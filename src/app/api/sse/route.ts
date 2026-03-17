import { sseEmitter, type SseEvent } from "@/lib/sse";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const encoder = new TextEncoder();
  let cleanup: (() => void) | undefined;

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: SseEvent) => {
        try {
          controller.enqueue(encoder.encode(`data: ${event}\n\n`));
        } catch {
          // stream already closed
        }
      };

      sseEmitter.on("change", send);

      const ping = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": ping\n\n"));
        } catch {
          clearInterval(ping);
        }
      }, 25000);

      cleanup = () => {
        sseEmitter.off("change", send);
        clearInterval(ping);
      };

      request.signal.addEventListener("abort", () => {
        cleanup?.();
        try {
          controller.close();
        } catch {
          // already closed
        }
      });
    },
    cancel() {
      cleanup?.();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
