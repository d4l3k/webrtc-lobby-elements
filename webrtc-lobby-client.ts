///<reference path="./bower_components/polymer-ts/polymer-ts.d.ts" />
///<reference path="./typings/browser/ambient/es6-promise/index.d.ts" />

interface Data {
  data: RPCResponse
}

interface RPCResponse {
  error: any
  id: number
  result: any
}

type Resolver = {
  resolve: (data: any)=>void
  reject: (error: any)=>void
}

interface Window { msCrypto: Crypto; }

class WebRTCLobbyClient extends polymer.Base {
  @property({type: String}) url: string;

  @property({type: String, notify: true}) error: string;

  @property({type: String}) service: string;

  private curID: number = 0;
  private promises: { [id: number]: Resolver; } = {};

  nextID(): number {
    this.curID = (this.curID || 0) + 1;
    return this.curID;
  }

  send(method: string, params: any): Promise<any> {
    const id = this.nextID();

    const body = {
      method: method,
      params: [params],
      id: id
    }
    const p = new Promise((resolve: (data: any)=>void, reject: (error: any)=>void)=>{
      if (!this.promises) {
        this.promises = {};
      }
      this.promises[id] = {
        resolve: resolve,
        reject: reject
      }
    });
    this.$.socket.send(body);
    return p;
  }

  message(event: any, data: Data) {
    console.log('data!', data.data);
    const resolver = this.promises[data.data.id];
    delete this.promises[data.data.id];
    if (data.data.error) {
      this.error = data.data.error;
      resolver.reject(data.data.error);
      return;
    }
    resolver.resolve(data.data.result);
  }
}
