///<reference path="./bower_components/polymer-ts/polymer-ts.d.ts" />
///<reference path="./webrtc-lobby-client.ts" />

interface Lobby {
}

interface CreateLobbyResponse {
  Lobbies: Lobby[];
}

@component("webrtc-lobby-host")
class WebRTCLobbyHost extends WebRTCLobbyClient {
  // The address of the lobby server.

  @property({type: String, notify: true}) token: string = this.generateToken();
  @property({type: String}) name: string;
  @property({type: String}) creator: string;
  @property({type: String}) password: string;
  @property({type: Number}) people: number;
  @property({type: Number}) capacity: number;
  @property({type: Boolean}) hidden: boolean;
  @property({type: Object}) location: any;

  open() {
    console.log('open!');

    this.send('lobby.new', {
      Service: this.service,
      ID: this.token,
      Name: this.name,
      Creator: this.creator,
      Hidden: this.hidden,
      RequiresPassword: !!this.password,
      People: this.people,
      Capacity: this.capacity,
      Location: this.location
    }).then((resp: CreateLobbyResponse)=>{});
  }

  static LETTERS = "1234567890abcdefghijklmnopqrstuvwxyz";

  generateToken(length: number = 10): string {
    const crypto = window.crypto || window.msCrypto;
    const buf = new Uint8Array(length);
    crypto.getRandomValues(buf);
    let str = "";
    for (let i = 0; i < buf.length; i++) {
      const n = buf[i];
      str += WebRTCLobbyHost.LETTERS[n % WebRTCLobbyHost.LETTERS.length];
    }
    return str;
  }
}

// after the element is defined, we register it in Polymer
WebRTCLobbyHost.register();
