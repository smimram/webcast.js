export declare const version = "1.0.1";
export declare class Socket {
    socket: WebSocket;
    constructor({ mediaRecorder, url: rawUrl, info, }: {
        mediaRecorder: MediaRecorder;
        url: string;
        info: Record<string, unknown>;
    });
    isConnected(): boolean;
    sendMetadata(data: Record<string, unknown>): void;
}
declare global {
    interface Window {
        Webcast: {
            Socket: typeof Socket;
            version: string;
        };
    }
}
