class WebSockets {
    users = [];
    connection(client: {
        on: (
            arg0: string,
            arg1: {
                (): void;
                (userId: any): void;
                (room: any, otherUserId?: string): void;
                (room: any): void;
            }
        ) => void;
        id: any;
        join: (arg0: any) => void;
        leave: (arg0: any) => void;
    }) {
        // event fired when the chat room is disconnected
        client.on('disconnect', () => {
            this.users = this.users.filter((user) => user.socketId !== client.id);
        });
        // add identity of user mapped to the socket id
        client.on('identity', (userId: any) => {
            this.users.push({
                socketId: client.id,
                userId: userId
            });
        });
        // subscribe person to chat & other user as well
        client.on('subscribe', (room: any, otherUserId = '') => {
            this.subscribeOtherUser(room, otherUserId);
            client.join(room);
        });
        // mute a chat room
        client.on('unsubscribe', (room: any) => {
            client.leave(room);
        });
    }

    subscribeOtherUser(room: any, otherUserId: string) {
        const userSockets = this.users.filter((user) => user.userId === otherUserId);
        userSockets.map((userInfo) => {
            const socketConn = global.io.sockets.connected(userInfo.socketId);
            if (socketConn) {
                socketConn.join(room);
            }
        });
    }
}

export default new WebSockets();
