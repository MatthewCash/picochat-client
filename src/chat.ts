import { ref } from 'vue';

interface ChatMessage {
    text: string;
}

interface FileMessage {
    filename: string;
    data: number[]; // inefficiently represents Vec<u8>
}

type MessageType =
    | ({ type: 'ChatMessage' } & ChatMessage)
    | ({ type: 'FileMessage' } & FileMessage);

interface OutboundSocketMessage {
    destination_name?: string | null;
    content: MessageType;
}

interface InboundSocketMessage {
    destination_name?: string | null;
    sender_name: string;
    content: MessageType;
}

interface IdentifyMessage {
    name: string;
}

let ws: WebSocket | null;

export const wsConnected = ref(false);

export let messages = ref([] as InboundSocketMessage[]);

const sendSystemMessage = (text: string) => {
    messages.value.unshift({
        sender_name: 'SYSTEM',
        content: { type: 'ChatMessage', text }
    });
};

export const connect = (addr: string, username: string) => {
    wsConnected.value = false;
    ws?.close();

    sendSystemMessage(`Connecting to (${addr})`);

    ws = new WebSocket(addr);

    ws.addEventListener('open', () => {
        const identity: IdentifyMessage = {
            name: username
        };
        ws?.send(JSON.stringify(identity));

        sendSystemMessage(`Connected to (${addr}) as [${username}]`);
        wsConnected.value = true;
    });

    ws.addEventListener('close', () => {
        sendSystemMessage(`Disconnected from (${addr})`);
        wsConnected.value = false;
    });

    ws.addEventListener('error', () => {
        sendSystemMessage(`Error in connection to (${addr})`);
        wsConnected.value = false;
    });

    ws.addEventListener('message', msg => {
        const message: InboundSocketMessage = JSON.parse(msg.data);

        messages.value.unshift(message);
    });
};

export const sendChat = (text: string, destination: string | null) => {
    const msg: OutboundSocketMessage = {
        destination_name: destination === '' ? null : destination,
        content: {
            type: 'ChatMessage',
            text
        }
    };

    ws?.send(JSON.stringify(msg));
};

export const uploadFile = (file: File, destination: string) => {
    const reader = new FileReader();

    reader.addEventListener('load', e => {
        const data = Array.from(
            new Uint8Array(e.target?.result as ArrayBuffer)
        );

        const msg: OutboundSocketMessage = {
            destination_name: destination === '' ? null : destination,
            content: {
                type: 'FileMessage',
                filename: file.name,
                data
            }
        };

        ws?.send(JSON.stringify(msg));
    });

    reader.readAsArrayBuffer(file);
};

export const downloadFile = (message: FileMessage) => {
    const blob = new Blob([new Uint8Array(message.data)], {
        type: 'application/octet-stream'
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = message.filename;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
};
