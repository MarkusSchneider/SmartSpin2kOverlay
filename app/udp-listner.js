"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UdpListner = void 0;
var dgram_1 = require("dgram");
var UdpListner = /** @class */ (function () {
    function UdpListner() {
        this._socket = null;
    }
    UdpListner.prototype.init = function (port) {
        var _this = this;
        this._socket = (0, dgram_1.createSocket)('udp4');
        this._socket.bind(port, function () { var _a, _b; console.log("now listening on port: " + port + " address: " + ((_b = (_a = _this._socket) === null || _a === void 0 ? void 0 : _a.address()) === null || _b === void 0 ? void 0 : _b.address)); });
    };
    UdpListner.prototype.onMessage = function (msgCallback) {
        var _a;
        (_a = this._socket) === null || _a === void 0 ? void 0 : _a.on('message', function (msg, _rinfo) {
            var message = msg.toString('utf8');
            msgCallback(message);
        });
    };
    return UdpListner;
}());
exports.UdpListner = UdpListner;
//# sourceMappingURL=udp-listner.js.map