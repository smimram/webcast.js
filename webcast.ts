export const version = "1.0.1"

export class Socket {
  socket: WebSocket

  constructor({
    mediaRecorder,
    url: rawUrl,
    info,
    onError,
    onOpen,
  }: {
    mediaRecorder: MediaRecorder
    url: string
    info: Record<string, unknown>
    onError?: (_: Event) => void
    onOpen?: (_: Event) => void
  }) {
    const parser = document.createElement("a")
    parser.href = rawUrl

    const user = parser.username
    const password = parser.password

    parser.username = parser.password = ""
    const url = parser.href

    this.socket = new WebSocket(url, "webcast")

    if (onError) this.socket.onerror = onError

    const hello = {
      mime: mediaRecorder.mimeType,
      ...(user ? { user } : {}),
      ...(password ? { password } : {}),
      ...info,
    }

    this.socket.onopen = function onopen(event: Event) {
      if (onOpen) onOpen(event)
      this.send(
        JSON.stringify({
          type: "hello",
          data: hello,
        })
      )
    }

    mediaRecorder.ondataavailable = async (e: BlobEvent) => {
      const data = await e.data.arrayBuffer()

      if (this.isConnected()) {
        this.socket.send(data)
      }
    }

    mediaRecorder.onstop = (e: Event) => {
      if (this.isConnected()) {
        this.socket.close()
      }
    }
  }

  isConnected() {
    return this.socket.readyState === WebSocket.OPEN
  }

  sendMetadata(data: Record<string, unknown>) {
    this.socket.send(
      JSON.stringify({
        type: "metadata",
        data,
      })
    )
  }
}

export type WebcastSocket = typeof Socket

declare global {
  interface Window {
    Webcast: { Socket: WebcastSocket; version: string }
  }
}

if (window) {
  window.Webcast = {
    version: "1.0.0",
    Socket,
  }
}
