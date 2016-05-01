///<reference path="./bower_components/polymer-ts/polymer-ts.d.ts" />
///<reference path="./typings/browser/ambient/es6-promise/index.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var WebRTCLobbyClient = (function (_super) {
    __extends(WebRTCLobbyClient, _super);
    function WebRTCLobbyClient() {
        _super.apply(this, arguments);
        this.curID = 0;
        this.promises = {};
    }
    WebRTCLobbyClient.prototype.nextID = function () {
        this.curID = (this.curID || 0) + 1;
        return this.curID;
    };
    WebRTCLobbyClient.prototype.send = function (method, params) {
        var _this = this;
        var id = this.nextID();
        var body = {
            method: method,
            params: [params],
            id: id
        };
        var p = new Promise(function (resolve, reject) {
            if (!_this.promises) {
                _this.promises = {};
            }
            _this.promises[id] = {
                resolve: resolve,
                reject: reject
            };
        });
        this.$.socket.send(body);
        return p;
    };
    WebRTCLobbyClient.prototype.message = function (event, data) {
        console.log('data!', data.data);
        var resolver = this.promises[data.data.id];
        delete this.promises[data.data.id];
        if (data.data.error) {
            this.error = data.data.error;
            resolver.reject(data.data.error);
            return;
        }
        resolver.resolve(data.data.result);
    };
    __decorate([
        property({ type: String })
    ], WebRTCLobbyClient.prototype, "url", void 0);
    __decorate([
        property({ type: String, notify: true })
    ], WebRTCLobbyClient.prototype, "error", void 0);
    __decorate([
        property({ type: String })
    ], WebRTCLobbyClient.prototype, "service", void 0);
    return WebRTCLobbyClient;
}(polymer.Base));
