import { EventEmitter } from "events";

const g = global as typeof global & { _sseEmitter?: EventEmitter };

if (!g._sseEmitter) {
  g._sseEmitter = new EventEmitter();
  g._sseEmitter.setMaxListeners(500);
}

export const sseEmitter = g._sseEmitter;

export type SseEvent = "processes" | "ocom" | "trackers" | "models" | "tasks";

export function broadcast(event: SseEvent) {
  sseEmitter.emit("change", event);
}
