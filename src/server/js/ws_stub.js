/** This module defines a websocket stub and a pipe.
 *  @author Vivien Kraus
 */

"use strict";

/** A websocket stub, that is intended to work like the websockets in
 * the 'ws' node package, except that it doesn't send anything on the
 * network (the packets are stacked in packetsToSend) and you have to
 * call simulateOpen, simulateReceive and simulateClose yourself when
 * the socket is supposed to be connected, when it receives data, and
 * when it is closed.
 */
export default class WsStub {
    /** Constructor
     */
    constructor () {
        /** User-defined callbacks 
         */
        this.callbacks = {
            'open': function () {},
            'close': function () {},
            'message': function (data, flags) {}
        };
        /** Stack of packets that you have to send virtually. */
        this.packetsToSend = [];
        /** Set to true once simulateClose has been called. */
        this.hasToClose = false;
        /** Registers user-defined callbacks.
         *
         * @param {param} Either 'open', 'close' or 'message'
         *
         * @param {f} A function, which type depends on param: no args
         * for 'open' and 'close', 2 for 'message' (the structured
         * data and an object with fields binary (bool: always true,
         * and masked: always true).) */
        this.on = function (param, f) {
            this.callbacks[param] = f;
        };
        this.send = function (data) {
            this.packetsToSend.push (data);
        };
        this.close = function () {
            this.hasToClose = true;
        };
        this.simulateOpen = function () {
            this.callbacks.open ();
        };
        this.simulateReceive = function (data) {
            this.callbacks.message
            (data, {binary: true, masked: true});
        };
        this.simulateClose = function () {
            this.callbacks.close ();
            };
    }
}

/** A websocket stub that has a peer. */
export default class SocketPipe extends WsStub {
    constructor () {
        super ();
        /** This peer will receive the data that this has sent. */
        this.peer = null;
        /** Call this to actually transfer the sent data to the
         * peer. */
        this.communicate = function () {
            if (this.peer) {
                var i;
                var len = this.packetsToSend.length;
                for (i = 0; i < len; i++) {
                    this.peer.simulateReceive
                    (this.packetsToSend[i]);
                }
                this.packetsToSend = [];
            }
            else this.simulateClose ();
        };
    }
}

/** A pair of sockets.  The output of a is the input of b and vice
 * versa. */
export default class Pipe {
    constructor () {
        this.a = new SocketPipe ();
        this.b = new SocketPipe ();
        this.a.peer = this.b;
        this.b.peer = this.a;
        /** Both sockets are now connected (don't forget to call
         * that function) */
        this.open = function () {
            this.a.simulateOpen ();
            this.b.simulateOpen ();
        }
        /** Transfer data, from a to b first. */
        this.communicate = function () {
            this.a.communicate ();
            this.b.communicate ();
        }
        this.close = function () {
            this.a.simulateClose ();
            this.b.simulateClose ();
        }
    }
}

console.log ('Testing the fake websocket pipe :-)');

var pipe = new Pipe ();

pipe.a.on ('open', function () {
    pipe.a.send ('Hello, who\'s there?');
    console.log ('-> A is connected :-)');
});
pipe.b.on ('open', function () {
    pipe.a.send ('Hello, who\'s there?');
    console.log ('-> B is connected :-)');
});
pipe.a.on ('close', function () {
    console.log ('-> A lost the connection :-(');
});
pipe.b.on ('close', function () {
    console.log ('-> B lost the connection :-(');
});
pipe.a.on ('message', function (data, flags) {
    pipe.a.send ('B: '
                 + data + ' '
                 + '(binary: ' + flags.binary
                 + ', masked: ' + flags.masked + ')');
    console.log ('-> Incoming message from B: ' + data);
});
pipe.b.on ('message', function (data, flags) {
    pipe.b.send ('A: '
                 + data + ' '
                 + '(binary: ' + flags.binary
                 + ', masked: ' + flags.masked + ')');
    console.log ('-> Incoming message from A: ' + data);
});

pipe.open ();
pipe.communicate ();
pipe.close ();
