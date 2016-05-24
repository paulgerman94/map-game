/** This module defines an extension for a connected websocket.
 *  @author Vivien Kraus
 */

"use strict";

import WsStub from './ws_stub';
import Pipe from './ws_stub';

/** A hat on a connected websocket that can call a remote function
 * (provided that the other end knows the function...) and can
 * register a service (so that the other end can call it).  What is
 * known on both sides should be determined just after the connection,
 * depending whether the end is the server-side or client-side.  For
 * instance, the client side can register a service 'notify' which
 * will be called by the server.
 */
export default class RpcEndpoint {
    constructor (ws) {
        var nextId = 0;
        var returns = [];
        var errors = [];
        var services = [];
        /** Call a function on the other end of the socket. 
         * 
         * @param {fname} the name of the function to call on the
         * other end.
         * 
         * @param {arg} the argument of the function.
         *
         * @param {ret} a function that will be called with the return
         * value once the other end has responded.
         *
         * @param {err} a function that will be called if the function
         * is not known on the other end.  The argument will be a
         * string that describes the error (for now there is only the
         * aforementioned error).
         * */
        this.remote = function (fname, arg, ret, err) {
            var id = nextId ++;
            ws.send ({
                'type': 'request',
                'id': id,
                'f': fname,
                'arg': arg
            });
            returns[id] = ret;
            errors[id] = err;
        };
        /** Register a function on this end of the socket, that will
         * be callable by the other end. 
         *
         * @param fname The function name that the other end can call.
         *
         * @param f The function to call to deliver the service.  f
         * will be called with the supplied foreign argument and a
         * function to call back once the service is done, with the
         * return value.
         */
        this.registerService = function (fname, f) {
            services[fname] = f;
        };
        ws.on ('message', function (data, flags) {
            if ("type" in data && data.type == 'request'
                && "id" in data
                && "f" in data
                && "arg" in data) {
                var f = services[data.f];
                if (typeof f == 'function') {
                    f (data.arg, function (ret) {
                        ws.send ({
                            'type': 'response',
                            'id': data.id,
                            'ret': ret
                        });
                    });
                }
                else {
                    ws.send ({
                        'type': 'response',
                        'id': data.id,
                        'err': 'no such function'
                    });
                }
            }
            else if ("type" in data && data.type == 'response'
                     && "id" in data
                     && "ret" in data) {
                var f = returns[data.id];
                f (data.ret);
                delete returns[data.id];
                delete errors[data.id];
            }
            else if ("type" in data && data.type == 'response'
                     && "id" in data
                     && "err" in data) {
                var f = errors[data.id];
                f (data.err);
                delete returns[data.id];
                delete errors[data.id];
            }
            else {
                console.log ('Error!');
                console.log (data);
            }
        });
        ws.on ('close', function () {
            returns = [];
            errors = [];
            services = [];
        });
    }
}

/** Example RPC endpoint that provides a 'capitalize' service (1
 * argument: a string, returns a string). */
class CapitalizerEndpoint extends RpcEndpoint {
    constructor (ws) {
        super (ws);
        this.registerService ('capitalize', function (str, ret) {
            let cap = str.toUpperCase ();
            console.log ('-> Capitalizer: `' + str
                         + '\' => `' + cap + '\'');
            /** The service returns immediately, but it's not a
             * requirement. */
            ret (cap);
        });
    }
}

/** Example RPC endpoint that has a shortcut to call the capitalize
 * service on the other end. */
class CapClientEndpoint extends RpcEndpoint {
    constructor (ws) {
        super (ws);
        this.capitalize = function (str, ret, err) {
            console.log ('-> Client: asking for capitalization of `'
                         + str + '\'');
            this.remote ('capitalize', str, ret, err);
        }
    }
}

console.log ('Testing the RPC websocket endpoint that succeeds :-)');

var pipe = new Pipe ();

var workerEndpoint = new CapitalizerEndpoint (pipe.a);
/** Warning: "client" doesn't mean client-side, it only means a dumb
 * end that doesn't know how to capitalize a string. */
var clientEndpoint = new CapClientEndpoint (pipe.b);

/** 2 functions are passed: */
clientEndpoint.capitalize ('Hello world!', function (str) {
    console.log ('-> Server replies: `' + str + '\'');
}, function (err) {
    console.log ('-> Something went wrong: `' + err + '\'');
});

pipe.open ();
pipe.communicate ();
pipe.communicate ();
pipe.close ();

console.log ('Testing the RPC websocket endpoint that fails :-)');

var failingPipe = new Pipe ();
var failingWorkerEndpoint =
    new RpcEndpoint (failingPipe.a);
var failingClientEndpoint =
    new CapClientEndpoint (failingPipe.b);

failingClientEndpoint.capitalize ('Hello world!', function (str) {
    console.log ('-> Server replies: `' + str + '\'');
}, function (err) {
    console.log ('-> Something went wrong: `' + err + '\'');
});

failingPipe.open ();
failingPipe.communicate ();
failingPipe.communicate ();
failingPipe.close ();
