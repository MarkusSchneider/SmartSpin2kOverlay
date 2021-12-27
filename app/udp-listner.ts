import { Socket, createSocket, RemoteInfo } from "dgram";

export class UdpListner {
    private _socket: Socket | null = null;

    public init(port: number): void {
        this._socket = createSocket('udp4');
        this._socket.bind(port, () => { console.log(`now listening on port: ${port} address: ${this._socket?.address()?.address}`) });
    }

    public onMessage(msgCallback: (msg: string) => void): void {
        this._socket?.on('message', (msg: Buffer, _rinfo: RemoteInfo) => {
            const message = msg.toString('utf8');
            msgCallback(message);
        });
    }
}