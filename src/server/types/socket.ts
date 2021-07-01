export enum ChatEvent {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    MESSAGE = 'message'
}

export interface ChatMessage {
    user: string;
    message: string;
}
