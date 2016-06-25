SystemJS.config({
  paths: {
    "server/": "dist/server/js/"
  },
  nodeConfig: {
    "paths": {
      "map-game/": "dist/client/js/"
    }
  },
  devConfig: {
    "map": {
      "babel-runtime": "npm:babel-runtime@5.8.38"
    }
  },
  packages: {
    "map-game/": {
      "main": "index.js"
    },
    "server/": {
      "main": "index.js",
      "defaultExtension": "js"
    },
    "npm:snapsvg@0.4.0": {
      "map": {
        "eve": "npm:eve@0.4.2"
      }
    },
    "github:kdex/react-burger-menu@1.7.4": {
      "map": {
        "browserify-optional": "npm:browserify-optional@1.0.0",
        "classnames": "npm:classnames@2.2.4",
        "imports-loader": "npm:imports-loader@0.6.5",
        "radium": "npm:radium@0.17.1",
        "react": "npm:react@15.1.0",
        "react-dom": "npm:react-dom@15.1.0"
      }
    },
    "npm:ast-transform@0.0.0": {
      "map": {
        "escodegen": "npm:escodegen@1.2.0",
        "esprima": "npm:esprima@1.0.4",
        "through": "npm:through@2.3.8"
      }
    },
    "npm:browser-resolve@1.11.1": {
      "map": {
        "resolve": "npm:resolve@1.1.7"
      }
    },
    "npm:browserify-optional@1.0.0": {
      "map": {
        "ast-transform": "npm:ast-transform@0.0.0",
        "ast-types": "npm:ast-types@0.7.8",
        "browser-resolve": "npm:browser-resolve@1.11.1"
      }
    },
    "npm:escodegen@1.2.0": {
      "map": {
        "esprima": "npm:esprima@1.0.4",
        "estraverse": "npm:estraverse@1.5.1",
        "esutils": "npm:esutils@1.0.0"
      }
    },
    "npm:imports-loader@0.6.5": {
      "map": {
        "loader-utils": "npm:loader-utils@0.2.14",
        "source-map": "npm:source-map@0.1.43"
      }
    },
    "npm:loader-utils@0.2.14": {
      "map": {
        "big.js": "npm:big.js@3.1.3",
        "emojis-list": "npm:emojis-list@1.0.1",
        "json5": "npm:json5@0.5.0",
        "object-assign": "npm:object-assign@4.0.1"
      }
    },
    "npm:brace-expansion@1.1.3": {
      "map": {
        "balanced-match": "npm:balanced-match@0.3.0",
        "concat-map": "npm:concat-map@0.0.1"
      }
    },
    "npm:glob@7.0.3": {
      "map": {
        "inflight": "npm:inflight@1.0.4",
        "inherits": "npm:inherits@2.0.1",
        "minimatch": "npm:minimatch@3.0.0",
        "once": "npm:once@1.3.3",
        "path-is-absolute": "npm:path-is-absolute@1.0.0"
      }
    },
    "npm:inflight@1.0.4": {
      "map": {
        "once": "npm:once@1.3.3",
        "wrappy": "npm:wrappy@1.0.1"
      }
    },
    "npm:minimatch@3.0.0": {
      "map": {
        "brace-expansion": "npm:brace-expansion@1.1.3"
      }
    },
    "npm:once@1.3.3": {
      "map": {
        "wrappy": "npm:wrappy@1.0.1"
      }
    },
    "npm:radium@0.17.1": {
      "map": {
        "array-find": "npm:array-find@1.0.0",
        "exenv": "npm:exenv@1.2.1",
        "inline-style-prefixer": "npm:inline-style-prefixer@1.0.3",
        "rimraf": "npm:rimraf@2.5.2"
      }
    },
    "npm:rimraf@2.5.2": {
      "map": {
        "glob": "npm:glob@7.0.3"
      }
    },
    "npm:lodash.isequal@4.1.4": {
      "map": {
        "lodash._root": "npm:lodash._root@3.0.1",
        "lodash._stack": "npm:lodash._stack@4.1.3",
        "lodash.keys": "npm:lodash.keys@4.0.6"
      }
    },
    "npm:react-draggable@1.3.7": {
      "map": {
        "classnames": "npm:classnames@2.2.4"
      }
    },
    "npm:react-grid-layout@0.12.1": {
      "map": {
        "lodash.isequal": "npm:lodash.isequal@4.1.4",
        "react-draggable": "npm:react-draggable@1.3.7",
        "react-resizable": "npm:react-resizable@1.3.3"
      }
    },
    "npm:react-resizable@1.3.3": {
      "map": {
        "react-draggable": "npm:react-draggable@1.3.7"
      }
    },
    "npm:inline-style-prefixer@1.0.3": {
      "map": {
        "bowser": "npm:bowser@1.0.0",
        "inline-style-prefix-all": "npm:inline-style-prefix-all@1.0.5"
      }
    },
    "npm:readable-stream@1.0.34": {
      "map": {
        "core-util-is": "npm:core-util-is@1.0.2",
        "inherits": "npm:inherits@2.0.1",
        "isarray": "npm:isarray@0.0.1",
        "string_decoder": "npm:string_decoder@0.10.31",
        "stream-browserify": "npm:stream-browserify@1.0.0"
      }
    },
    "npm:react-flexr@2.1.0-beta": {
      "map": {
        "react": "npm:react@15.1.0",
        "stilr": "npm:stilr@1.2.4"
      }
    },
    "npm:brfs@1.4.3": {
      "map": {
        "quote-stream": "npm:quote-stream@1.0.2",
        "resolve": "npm:resolve@1.1.7",
        "static-module": "npm:static-module@1.3.1",
        "through2": "npm:through2@2.0.1"
      }
    },
    "npm:browserify-versionify@1.0.6": {
      "map": {
        "find-root": "npm:find-root@0.1.2",
        "through2": "npm:through2@0.6.3"
      }
    },
    "npm:duplexer2@0.0.2": {
      "map": {
        "readable-stream": "npm:readable-stream@1.1.14"
      }
    },
    "npm:escodegen@0.0.28": {
      "map": {
        "esprima": "npm:esprima@1.0.4",
        "estraverse": "npm:estraverse@1.3.2"
      }
    },
    "npm:escodegen@1.3.3": {
      "map": {
        "esprima": "npm:esprima@1.1.1",
        "estraverse": "npm:estraverse@1.5.1",
        "esutils": "npm:esutils@1.0.0"
      }
    },
    "npm:falafel@1.2.0": {
      "map": {
        "acorn": "npm:acorn@1.2.2",
        "foreach": "npm:foreach@2.0.5",
        "isarray": "npm:isarray@0.0.1",
        "object-keys": "npm:object-keys@1.0.9"
      }
    },
    "npm:has@1.0.1": {
      "map": {
        "function-bind": "npm:function-bind@1.1.0"
      }
    },
    "npm:pixi.js@3.0.11": {
      "map": {
        "async": "npm:async@1.5.2",
        "brfs": "npm:brfs@1.4.3",
        "browserify-versionify": "npm:browserify-versionify@1.0.6",
        "earcut": "npm:earcut@2.1.1",
        "eventemitter3": "npm:eventemitter3@1.2.0",
        "object-assign": "npm:object-assign@4.1.0",
        "resource-loader": "npm:resource-loader@1.6.5"
      }
    },
    "npm:quote-stream@0.0.0": {
      "map": {
        "minimist": "npm:minimist@0.0.8",
        "through2": "npm:through2@0.4.2"
      }
    },
    "npm:quote-stream@1.0.2": {
      "map": {
        "buffer-equal": "npm:buffer-equal@0.0.1",
        "minimist": "npm:minimist@1.2.0",
        "through2": "npm:through2@2.0.1"
      }
    },
    "npm:readable-stream@2.0.6": {
      "map": {
        "core-util-is": "npm:core-util-is@1.0.2",
        "inherits": "npm:inherits@2.0.1",
        "isarray": "npm:isarray@1.0.0",
        "process-nextick-args": "npm:process-nextick-args@1.0.7",
        "string_decoder": "npm:string_decoder@0.10.31",
        "util-deprecate": "npm:util-deprecate@1.0.2"
      }
    },
    "npm:static-eval@0.2.4": {
      "map": {
        "escodegen": "npm:escodegen@0.0.28"
      }
    },
    "npm:static-module@1.3.1": {
      "map": {
        "concat-stream": "npm:concat-stream@1.4.10",
        "duplexer2": "npm:duplexer2@0.0.2",
        "escodegen": "npm:escodegen@1.3.3",
        "falafel": "npm:falafel@1.2.0",
        "has": "npm:has@1.0.1",
        "object-inspect": "npm:object-inspect@0.4.0",
        "quote-stream": "npm:quote-stream@0.0.0",
        "readable-stream": "npm:readable-stream@1.0.34",
        "shallow-copy": "npm:shallow-copy@0.0.1",
        "static-eval": "npm:static-eval@0.2.4",
        "through2": "npm:through2@0.4.2"
      }
    },
    "npm:stilr@1.2.4": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.9.2",
        "react": "npm:react@15.1.0"
      }
    },
    "npm:through2@0.4.2": {
      "map": {
        "readable-stream": "npm:readable-stream@1.0.34",
        "xtend": "npm:xtend@2.1.2"
      }
    },
    "npm:through2@0.6.3": {
      "map": {
        "readable-stream": "npm:readable-stream@1.0.34",
        "xtend": "npm:xtend@4.0.1"
      }
    },
    "npm:through2@2.0.1": {
      "map": {
        "readable-stream": "npm:readable-stream@2.0.6",
        "xtend": "npm:xtend@4.0.1"
      }
    },
    "npm:xtend@2.1.2": {
      "map": {
        "object-keys": "npm:object-keys@0.4.0"
      }
    },
    "npm:resource-loader@1.6.5": {
      "map": {
        "async": "npm:async@0.9.2",
        "eventemitter3": "npm:eventemitter3@1.2.0"
      }
    },
    "npm:warning@3.0.0": {
      "map": {
        "loose-envify": "npm:loose-envify@1.2.0"
      }
    },
    "npm:react-leaflet@0.11.7": {
      "map": {
        "warning": "npm:warning@3.0.0",
        "lodash": "npm:lodash@4.13.1"
      }
    }
  },
  map: {
    "snapsvg": "npm:snapsvg@0.4.0",
    "react-burger-menu": "github:kdex/react-burger-menu@1.7.4",
    "classnames": "npm:classnames@2.2.4",
    "flexboxgrid": "npm:flexboxgrid@6.3.0",
    "react-flexbox-grid": "npm:react-flexbox-grid@0.9.6",
    "react-grid-layout": "npm:react-grid-layout@0.12.1",
    "react-leaflet": "npm:react-leaflet@0.11.7",
    "react-flexr": "npm:react-flexr@2.1.0-beta",
    "Polymer/polymer": "github:Polymer/polymer@1.5.0",
    "pixi.js": "npm:pixi.js@3.0.11"
  }
});

SystemJS.config({
  packageConfigPaths: [
    "npm:@*/*.json",
    "npm:*.json",
    "github:*/*.json"
  ],
  map: {
    "history": "npm:history@2.1.2",
    "leaflet": "npm:leaflet@1.0.0-rc.1",
    "email-regex": "npm:email-regex@1.0.0",
    "crystal-event-emitter": "npm:crystal-event-emitter@1.1.3",
    "babel-types": "npm:babel-types@6.7.7",
    "flux": "npm:flux@2.1.1",
    "assert": "github:jspm/nodelibs-assert@0.2.0-alpha",
    "babel-polyfill": "npm:babel-polyfill@6.9.1",
    "bcrypt": "npm:bcrypt@0.8.7",
    "bcrypt-nodejs": "npm:bcrypt-nodejs@0.0.3",
    "buffer": "github:jspm/nodelibs-buffer@0.2.0-alpha",
    "chalk": "npm:chalk@1.1.3",
    "child_process": "github:jspm/nodelibs-child_process@0.2.0-alpha",
    "constants": "github:jspm/nodelibs-constants@0.2.0-alpha",
    "core-js": "npm:core-js@1.2.6",
    "crypto": "github:jspm/nodelibs-crypto@0.2.0-alpha",
    "dns": "github:jspm/nodelibs-dns@0.2.0-alpha",
    "domain": "github:jspm/nodelibs-domain@0.2.0-alpha",
    "events": "github:jspm/nodelibs-events@0.2.0-alpha",
    "fetch": "npm:whatwg-fetch@0.9.0",
    "fs": "github:jspm/nodelibs-fs@0.2.0-alpha",
    "http": "github:jspm/nodelibs-http@0.2.0-alpha",
    "https": "github:jspm/nodelibs-https@0.2.0-alpha",
    "ip-regex": "npm:ip-regex@1.0.3",
    "json": "github:systemjs/plugin-json@0.1.2",
    "jsonwebtoken": "npm:jsonwebtoken@5.7.0",
    "material-ui": "npm:material-ui@0.15.0",
    "module": "github:jspm/nodelibs-module@0.2.0-alpha",
    "net": "github:jspm/nodelibs-net@0.2.0-alpha",
    "os": "github:jspm/nodelibs-os@0.2.0-alpha",
    "path": "github:jspm/nodelibs-path@0.2.0-alpha",
    "pg": "npm:pg@4.5.6",
    "pg-native": "npm:pg-native@1.10.0",
    "pg-promise": "npm:pg-promise@2.9.5",
    "pgtools": "npm:pgtools@0.0.2",
    "plugin-babel": "npm:systemjs-plugin-babel@0.0.9",
    "process": "github:jspm/nodelibs-process@0.2.0-alpha",
    "react": "npm:react@15.1.0",
    "react-dom": "npm:react-dom@15.1.0",
    "react-router": "npm:react-router@2.5.1",
    "react-tap-event-plugin": "npm:react-tap-event-plugin@1.0.0",
    "source-map": "npm:source-map@0.1.43",
    "stream": "github:jspm/nodelibs-stream@0.2.0-alpha",
    "string_decoder": "github:jspm/nodelibs-string_decoder@0.2.0-alpha",
    "tls": "github:jspm/nodelibs-tls@0.2.0-alpha",
    "tty": "github:jspm/nodelibs-tty@0.2.0-alpha",
    "url": "github:jspm/nodelibs-url@0.2.0-alpha",
    "util": "github:jspm/nodelibs-util@0.2.0-alpha",
    "vm": "github:jspm/nodelibs-vm@0.2.0-alpha",
    "ws-promise-client": "npm:ws-promise-client@4.0.0",
    "zlib": "github:jspm/nodelibs-zlib@0.2.0-alpha"
  },
  packages: {
    "npm:babel-types@6.7.7": {
      "map": {
        "babel-runtime": "npm:babel-runtime@5.8.38",
        "babel-traverse": "npm:babel-traverse@6.10.4",
        "esutils": "npm:esutils@2.0.2",
        "lodash": "npm:lodash@3.10.1",
        "to-fast-properties": "npm:to-fast-properties@1.0.2"
      }
    },
    "npm:babel-code-frame@6.8.0": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.9.2",
        "chalk": "npm:chalk@1.1.3",
        "esutils": "npm:esutils@2.0.2",
        "js-tokens": "npm:js-tokens@1.0.3"
      }
    },
    "npm:babel-messages@6.8.0": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.9.2"
      }
    },
    "npm:loose-envify@1.2.0": {
      "map": {
        "js-tokens": "npm:js-tokens@1.0.3"
      }
    },
    "npm:readable-stream@2.1.4": {
      "map": {
        "buffer-shims": "npm:buffer-shims@1.0.0",
        "core-util-is": "npm:core-util-is@1.0.2",
        "inherits": "npm:inherits@2.0.1",
        "isarray": "npm:isarray@1.0.0",
        "process-nextick-args": "npm:process-nextick-args@1.0.7",
        "string_decoder": "npm:string_decoder@0.10.31",
        "util-deprecate": "npm:util-deprecate@1.0.2"
      }
    },
    "npm:readable-stream@1.1.14": {
      "map": {
        "core-util-is": "npm:core-util-is@1.0.2",
        "inherits": "npm:inherits@2.0.1",
        "isarray": "npm:isarray@0.0.1",
        "stream-browserify": "npm:stream-browserify@1.0.0",
        "string_decoder": "npm:string_decoder@0.10.31"
      }
    },
    "npm:react-tap-event-plugin@1.0.0": {
      "map": {
        "fbjs": "npm:fbjs@0.2.1"
      }
    },
    "npm:recompose@0.17.0": {
      "map": {
        "hoist-non-react-statics": "npm:hoist-non-react-statics@1.2.0",
        "lodash": "npm:lodash@4.13.1"
      }
    },
    "npm:fbemitter@2.0.2": {
      "map": {
        "fbjs": "npm:fbjs@0.7.2"
      }
    },
    "npm:fbjs@0.1.0-alpha.7": {
      "map": {
        "core-js": "npm:core-js@1.2.6",
        "promise": "npm:promise@7.1.1",
        "whatwg-fetch": "npm:whatwg-fetch@0.9.0"
      }
    },
    "npm:fbjs@0.7.2": {
      "map": {
        "core-js": "npm:core-js@1.2.6",
        "isomorphic-fetch": "npm:isomorphic-fetch@2.2.1",
        "loose-envify": "npm:loose-envify@1.2.0",
        "promise": "npm:promise@7.1.1",
        "ua-parser-js": "npm:ua-parser-js@0.7.10"
      }
    },
    "npm:flux@2.1.1": {
      "map": {
        "fbemitter": "npm:fbemitter@2.0.2",
        "fbjs": "npm:fbjs@0.1.0-alpha.7",
        "immutable": "npm:immutable@3.8.1"
      }
    },
    "github:jspm/nodelibs-buffer@0.2.0-alpha": {
      "map": {
        "buffer-browserify": "npm:buffer@4.7.0"
      }
    },
    "github:jspm/nodelibs-crypto@0.2.0-alpha": {
      "map": {
        "crypto-browserify": "npm:crypto-browserify@3.11.0"
      }
    },
    "github:jspm/nodelibs-domain@0.2.0-alpha": {
      "map": {
        "domain-browserify": "npm:domain-browser@1.1.7"
      }
    },
    "github:jspm/nodelibs-http@0.2.0-alpha": {
      "map": {
        "http-browserify": "npm:stream-http@2.3.0"
      }
    },
    "github:jspm/nodelibs-os@0.2.0-alpha": {
      "map": {
        "os-browserify": "npm:os-browserify@0.2.1"
      }
    },
    "github:jspm/nodelibs-stream@0.2.0-alpha": {
      "map": {
        "stream-browserify": "npm:stream-browserify@2.0.1"
      }
    },
    "github:jspm/nodelibs-string_decoder@0.2.0-alpha": {
      "map": {
        "string_decoder-browserify": "npm:string_decoder@0.10.31"
      }
    },
    "github:jspm/nodelibs-url@0.2.0-alpha": {
      "map": {
        "url-browserify": "npm:url@0.11.0"
      }
    },
    "github:jspm/nodelibs-zlib@0.2.0-alpha": {
      "map": {
        "zlib-browserify": "npm:browserify-zlib@0.1.4"
      }
    },
    "npm:base64url@1.0.6": {
      "map": {
        "concat-stream": "npm:concat-stream@1.4.10",
        "meow": "npm:meow@2.0.0"
      }
    },
    "npm:browserify-aes@1.0.6": {
      "map": {
        "buffer-xor": "npm:buffer-xor@1.0.3",
        "cipher-base": "npm:cipher-base@1.0.2",
        "create-hash": "npm:create-hash@1.1.2",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.0",
        "inherits": "npm:inherits@2.0.1"
      }
    },
    "npm:browserify-cipher@1.0.0": {
      "map": {
        "browserify-aes": "npm:browserify-aes@1.0.6",
        "browserify-des": "npm:browserify-des@1.0.0",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.0"
      }
    },
    "npm:browserify-des@1.0.0": {
      "map": {
        "cipher-base": "npm:cipher-base@1.0.2",
        "des.js": "npm:des.js@1.0.0",
        "inherits": "npm:inherits@2.0.1"
      }
    },
    "npm:browserify-rsa@4.0.1": {
      "map": {
        "bn.js": "npm:bn.js@4.11.4",
        "randombytes": "npm:randombytes@2.0.3"
      }
    },
    "npm:browserify-sign@4.0.0": {
      "map": {
        "bn.js": "npm:bn.js@4.11.4",
        "browserify-rsa": "npm:browserify-rsa@4.0.1",
        "create-hash": "npm:create-hash@1.1.2",
        "create-hmac": "npm:create-hmac@1.1.4",
        "elliptic": "npm:elliptic@6.3.1",
        "inherits": "npm:inherits@2.0.1",
        "parse-asn1": "npm:parse-asn1@5.0.0"
      }
    },
    "npm:browserify-zlib@0.1.4": {
      "map": {
        "pako": "npm:pako@0.2.8",
        "readable-stream": "npm:readable-stream@2.1.4"
      }
    },
    "npm:camelcase-keys@1.0.0": {
      "map": {
        "camelcase": "npm:camelcase@1.2.1",
        "map-obj": "npm:map-obj@1.0.1"
      }
    },
    "npm:chalk@1.1.3": {
      "map": {
        "ansi-styles": "npm:ansi-styles@2.2.1",
        "escape-string-regexp": "npm:escape-string-regexp@1.0.5",
        "has-ansi": "npm:has-ansi@2.0.0",
        "strip-ansi": "npm:strip-ansi@3.0.1",
        "supports-color": "npm:supports-color@2.0.0"
      }
    },
    "npm:cipher-base@1.0.2": {
      "map": {
        "inherits": "npm:inherits@2.0.1"
      }
    },
    "npm:concat-stream@1.4.10": {
      "map": {
        "inherits": "npm:inherits@2.0.1",
        "readable-stream": "npm:readable-stream@1.1.14",
        "typedarray": "npm:typedarray@0.0.6"
      }
    },
    "npm:create-ecdh@4.0.0": {
      "map": {
        "bn.js": "npm:bn.js@4.11.4",
        "elliptic": "npm:elliptic@6.3.1"
      }
    },
    "npm:create-hash@1.1.2": {
      "map": {
        "cipher-base": "npm:cipher-base@1.0.2",
        "inherits": "npm:inherits@2.0.1",
        "ripemd160": "npm:ripemd160@1.0.1",
        "sha.js": "npm:sha.js@2.4.5"
      }
    },
    "npm:create-hmac@1.1.4": {
      "map": {
        "create-hash": "npm:create-hash@1.1.2",
        "inherits": "npm:inherits@2.0.1"
      }
    },
    "npm:crypto-browserify@3.11.0": {
      "map": {
        "browserify-cipher": "npm:browserify-cipher@1.0.0",
        "browserify-sign": "npm:browserify-sign@4.0.0",
        "create-ecdh": "npm:create-ecdh@4.0.0",
        "create-hash": "npm:create-hash@1.1.2",
        "create-hmac": "npm:create-hmac@1.1.4",
        "diffie-hellman": "npm:diffie-hellman@5.0.2",
        "inherits": "npm:inherits@2.0.1",
        "pbkdf2": "npm:pbkdf2@3.0.4",
        "public-encrypt": "npm:public-encrypt@4.0.0",
        "randombytes": "npm:randombytes@2.0.3"
      }
    },
    "npm:debug@2.2.0": {
      "map": {
        "ms": "npm:ms@0.7.1"
      }
    },
    "npm:des.js@1.0.0": {
      "map": {
        "inherits": "npm:inherits@2.0.1",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
      }
    },
    "npm:diffie-hellman@5.0.2": {
      "map": {
        "bn.js": "npm:bn.js@4.11.4",
        "miller-rabin": "npm:miller-rabin@4.0.0",
        "randombytes": "npm:randombytes@2.0.3"
      }
    },
    "npm:encoding@0.1.12": {
      "map": {
        "iconv-lite": "npm:iconv-lite@0.4.13"
      }
    },
    "npm:evp_bytestokey@1.0.0": {
      "map": {
        "create-hash": "npm:create-hash@1.1.2"
      }
    },
    "npm:fbjs@0.2.1": {
      "map": {
        "core-js": "npm:core-js@1.2.6",
        "promise": "npm:promise@7.1.1",
        "whatwg-fetch": "npm:whatwg-fetch@0.9.0"
      }
    },
    "npm:has-ansi@2.0.0": {
      "map": {
        "ansi-regex": "npm:ansi-regex@2.0.0"
      }
    },
    "npm:hash.js@1.0.3": {
      "map": {
        "inherits": "npm:inherits@2.0.1"
      }
    },
    "npm:indent-string@1.2.2": {
      "map": {
        "get-stdin": "npm:get-stdin@4.0.1",
        "minimist": "npm:minimist@1.2.0",
        "repeating": "npm:repeating@1.1.3"
      }
    },
    "npm:invariant@2.2.1": {
      "map": {
        "loose-envify": "npm:loose-envify@1.2.0"
      }
    },
    "npm:is-finite@1.0.1": {
      "map": {
        "number-is-nan": "npm:number-is-nan@1.0.0"
      }
    },
    "npm:isomorphic-fetch@2.2.1": {
      "map": {
        "node-fetch": "npm:node-fetch@1.5.3",
        "whatwg-fetch": "npm:whatwg-fetch@0.9.0"
      }
    },
    "npm:jsonwebtoken@5.7.0": {
      "map": {
        "jws": "npm:jws@3.1.3",
        "ms": "npm:ms@0.7.1",
        "xtend": "npm:xtend@4.0.1"
      }
    },
    "npm:jwa@1.1.3": {
      "map": {
        "base64url": "npm:base64url@1.0.6",
        "buffer-equal-constant-time": "npm:buffer-equal-constant-time@1.0.1",
        "ecdsa-sig-formatter": "npm:ecdsa-sig-formatter@1.0.7"
      }
    },
    "npm:jws@3.1.3": {
      "map": {
        "base64url": "npm:base64url@1.0.6",
        "jwa": "npm:jwa@1.1.3"
      }
    },
    "npm:lodash.throttle@4.0.1": {
      "map": {
        "lodash.debounce": "npm:lodash.debounce@4.0.6"
      }
    },
    "npm:meow@2.0.0": {
      "map": {
        "camelcase-keys": "npm:camelcase-keys@1.0.0",
        "indent-string": "npm:indent-string@1.2.2",
        "minimist": "npm:minimist@1.2.0",
        "object-assign": "npm:object-assign@1.0.0"
      }
    },
    "npm:miller-rabin@4.0.0": {
      "map": {
        "bn.js": "npm:bn.js@4.11.4",
        "brorand": "npm:brorand@1.0.5"
      }
    },
    "npm:parse-asn1@5.0.0": {
      "map": {
        "asn1.js": "npm:asn1.js@4.6.2",
        "browserify-aes": "npm:browserify-aes@1.0.6",
        "create-hash": "npm:create-hash@1.1.2",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.0",
        "pbkdf2": "npm:pbkdf2@3.0.4"
      }
    },
    "npm:pbkdf2@3.0.4": {
      "map": {
        "create-hmac": "npm:create-hmac@1.1.4"
      }
    },
    "npm:pg-native@1.10.0": {
      "map": {
        "libpq": "npm:libpq@1.8.3",
        "pg-types": "npm:pg-types@1.6.0",
        "readable-stream": "npm:readable-stream@1.0.31"
      }
    },
    "npm:pg-promise@2.9.5": {
      "map": {
        "pg": "npm:pg@4.5.6",
        "pg-minify": "npm:pg-minify@0.1.5",
        "spex": "npm:spex@0.4.6"
      }
    },
    "npm:pgpass@0.0.3": {
      "map": {
        "split": "npm:split@0.3.3"
      }
    },
    "npm:pgtools@0.0.2": {
      "map": {
        "bluebird": "npm:bluebird@2.10.2",
        "pg": "npm:pg@4.5.6"
      }
    },
    "npm:promise@7.1.1": {
      "map": {
        "asap": "npm:asap@2.0.4"
      }
    },
    "npm:public-encrypt@4.0.0": {
      "map": {
        "bn.js": "npm:bn.js@4.11.4",
        "browserify-rsa": "npm:browserify-rsa@4.0.1",
        "create-hash": "npm:create-hash@1.1.2",
        "parse-asn1": "npm:parse-asn1@5.0.0",
        "randombytes": "npm:randombytes@2.0.3"
      }
    },
    "npm:query-string@3.0.3": {
      "map": {
        "strict-uri-encode": "npm:strict-uri-encode@1.1.0"
      }
    },
    "npm:readable-stream@1.0.31": {
      "map": {
        "core-util-is": "npm:core-util-is@1.0.2",
        "inherits": "npm:inherits@2.0.1",
        "isarray": "npm:isarray@0.0.1",
        "string_decoder": "npm:string_decoder@0.10.31"
      }
    },
    "npm:repeating@1.1.3": {
      "map": {
        "is-finite": "npm:is-finite@1.0.1"
      }
    },
    "npm:sha.js@2.4.5": {
      "map": {
        "inherits": "npm:inherits@2.0.1"
      }
    },
    "npm:source-map@0.1.43": {
      "map": {
        "amdefine": "npm:amdefine@1.0.0"
      }
    },
    "npm:split@0.3.3": {
      "map": {
        "through": "npm:through@2.3.8"
      }
    },
    "npm:stream-browserify@1.0.0": {
      "map": {
        "inherits": "npm:inherits@2.0.1",
        "readable-stream": "npm:readable-stream@1.1.14"
      }
    },
    "npm:stream-browserify@2.0.1": {
      "map": {
        "inherits": "npm:inherits@2.0.1",
        "readable-stream": "npm:readable-stream@2.1.4"
      }
    },
    "npm:stream-http@2.3.0": {
      "map": {
        "builtin-status-codes": "npm:builtin-status-codes@2.0.0",
        "inherits": "npm:inherits@2.0.1",
        "readable-stream": "npm:readable-stream@2.1.4",
        "to-arraybuffer": "npm:to-arraybuffer@1.0.1",
        "xtend": "npm:xtend@4.0.1"
      }
    },
    "npm:strip-ansi@3.0.1": {
      "map": {
        "ansi-regex": "npm:ansi-regex@2.0.0"
      }
    },
    "npm:url@0.11.0": {
      "map": {
        "punycode": "npm:punycode@1.3.2",
        "querystring": "npm:querystring@0.2.0"
      }
    },
    "npm:warning@2.1.0": {
      "map": {
        "loose-envify": "npm:loose-envify@1.2.0"
      }
    },
    "npm:history@2.1.2": {
      "map": {
        "invariant": "npm:invariant@2.2.1",
        "warning": "npm:warning@2.1.0",
        "query-string": "npm:query-string@3.0.3",
        "deep-equal": "npm:deep-equal@1.0.1"
      }
    },
    "npm:react@15.1.0": {
      "map": {
        "fbjs": "npm:fbjs@0.8.3",
        "object-assign": "npm:object-assign@4.1.0",
        "loose-envify": "npm:loose-envify@1.2.0"
      }
    },
    "npm:fbjs@0.8.3": {
      "map": {
        "immutable": "npm:immutable@3.8.1",
        "object-assign": "npm:object-assign@4.1.0",
        "isomorphic-fetch": "npm:isomorphic-fetch@2.2.1",
        "core-js": "npm:core-js@1.2.6",
        "loose-envify": "npm:loose-envify@1.2.0",
        "ua-parser-js": "npm:ua-parser-js@0.7.10",
        "promise": "npm:promise@7.1.1"
      }
    },
    "npm:lodash.merge@4.4.0": {
      "map": {
        "lodash._baseclone": "npm:lodash._baseclone@4.5.7",
        "lodash.keysin": "npm:lodash.keysin@4.1.4",
        "lodash.rest": "npm:lodash.rest@4.0.3",
        "lodash.isplainobject": "npm:lodash.isplainobject@4.0.4",
        "lodash._root": "npm:lodash._root@3.0.1"
      }
    },
    "npm:pg-types@1.11.0": {
      "map": {
        "postgres-array": "npm:postgres-array@1.0.0",
        "postgres-interval": "npm:postgres-interval@1.0.2",
        "ap": "npm:ap@0.2.0",
        "postgres-date": "npm:postgres-date@1.0.2",
        "postgres-bytea": "npm:postgres-bytea@1.0.0"
      }
    },
    "npm:postgres-interval@1.0.2": {
      "map": {
        "xtend": "npm:xtend@4.0.1"
      }
    },
    "npm:inline-style-prefixer@1.0.4": {
      "map": {
        "inline-style-prefix-all": "npm:inline-style-prefix-all@2.0.2",
        "bowser": "npm:bowser@1.3.0"
      }
    },
    "npm:node-fetch@1.5.3": {
      "map": {
        "encoding": "npm:encoding@0.1.12",
        "is-stream": "npm:is-stream@1.1.0"
      }
    },
    "npm:babel-polyfill@6.9.1": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.9.2",
        "core-js": "npm:core-js@2.4.0",
        "regenerator-runtime": "npm:regenerator-runtime@0.9.5"
      }
    },
    "npm:babel-runtime@6.9.2": {
      "map": {
        "regenerator-runtime": "npm:regenerator-runtime@0.9.5",
        "core-js": "npm:core-js@2.4.0"
      }
    },
    "npm:websocket@1.0.23": {
      "map": {
        "nan": "npm:nan@2.3.5",
        "debug": "npm:debug@2.2.0",
        "typedarray-to-buffer": "npm:typedarray-to-buffer@3.1.2",
        "yaeti": "npm:yaeti@0.0.4"
      }
    },
    "npm:typedarray-to-buffer@3.1.2": {
      "map": {
        "is-typedarray": "npm:is-typedarray@1.0.0"
      }
    },
    "npm:material-ui@0.15.0": {
      "map": {
        "react-addons-transition-group": "npm:react-addons-transition-group@15.1.0",
        "recompose": "npm:recompose@0.17.0",
        "lodash.merge": "npm:lodash.merge@4.4.0",
        "react-addons-update": "npm:react-addons-update@15.1.0",
        "react-addons-create-fragment": "npm:react-addons-create-fragment@15.1.0",
        "simple-assign": "npm:simple-assign@0.1.0",
        "lodash.throttle": "npm:lodash.throttle@4.0.1",
        "react-event-listener": "npm:react-event-listener@0.1.2",
        "keycode": "npm:keycode@2.1.2",
        "warning": "npm:warning@2.1.0",
        "inline-style-prefixer": "npm:inline-style-prefixer@1.0.4"
      }
    },
    "npm:asn1.js@4.6.2": {
      "map": {
        "inherits": "npm:inherits@2.0.1",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0",
        "bn.js": "npm:bn.js@4.11.4"
      }
    },
    "npm:pg@4.5.6": {
      "map": {
        "packet-reader": "npm:packet-reader@0.2.0",
        "semver": "npm:semver@4.3.6",
        "pg-connection-string": "npm:pg-connection-string@0.1.3",
        "buffer-writer": "npm:buffer-writer@1.0.1",
        "pgpass": "npm:pgpass@0.0.3",
        "pg-types": "npm:pg-types@1.11.0",
        "generic-pool": "npm:generic-pool@2.4.2"
      }
    },
    "npm:bcrypt@0.8.7": {
      "map": {
        "bindings": "npm:bindings@1.2.1",
        "nan": "npm:nan@2.3.5"
      }
    },
    "npm:elliptic@6.3.1": {
      "map": {
        "bn.js": "npm:bn.js@4.11.4",
        "inherits": "npm:inherits@2.0.1",
        "brorand": "npm:brorand@1.0.5",
        "hash.js": "npm:hash.js@1.0.3"
      }
    },
    "npm:babel-types@6.10.2": {
      "map": {
        "babel-traverse": "npm:babel-traverse@6.10.4",
        "lodash": "npm:lodash@4.13.1",
        "to-fast-properties": "npm:to-fast-properties@1.0.2",
        "babel-runtime": "npm:babel-runtime@6.9.2",
        "esutils": "npm:esutils@2.0.2"
      }
    },
    "npm:ecdsa-sig-formatter@1.0.7": {
      "map": {
        "base64-url": "npm:base64-url@1.2.2"
      }
    },
    "npm:buffer@4.7.0": {
      "map": {
        "ieee754": "npm:ieee754@1.1.6",
        "base64-js": "npm:base64-js@1.1.2",
        "isarray": "npm:isarray@1.0.0"
      }
    },
    "npm:ws-promise-client@4.0.0": {
      "map": {
        "websocket": "npm:websocket@1.0.23",
        "ws-rpc-client": "npm:ws-rpc-client@2.0.1",
        "crystal-event-emitter": "npm:crystal-event-emitter@1.1.3",
        "babel-runtime": "npm:babel-runtime@6.9.2"
      }
    },
    "npm:react-router@2.5.1": {
      "map": {
        "history": "npm:history@2.1.2",
        "warning": "npm:warning@2.1.0",
        "hoist-non-react-statics": "npm:hoist-non-react-statics@1.2.0",
        "invariant": "npm:invariant@2.2.1",
        "loose-envify": "npm:loose-envify@1.2.0"
      }
    },
    "npm:babel-traverse@6.10.4": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.9.2",
        "babel-types": "npm:babel-types@6.10.2",
        "invariant": "npm:invariant@2.2.1",
        "lodash": "npm:lodash@4.13.1",
        "babylon": "npm:babylon@6.8.2",
        "debug": "npm:debug@2.2.0",
        "babel-messages": "npm:babel-messages@6.8.0",
        "babel-code-frame": "npm:babel-code-frame@6.8.0",
        "globals": "npm:globals@8.18.0"
      }
    },
    "npm:libpq@1.8.3": {
      "map": {
        "nan": "npm:nan@2.3.5",
        "bindings": "npm:bindings@1.2.1"
      }
    },
    "npm:ws-rpc-client@2.0.1": {
      "map": {
        "crystal-event-emitter": "npm:crystal-event-emitter@1.1.3",
        "babel-runtime": "npm:babel-runtime@6.9.2",
        "uuid": "npm:uuid@2.0.2"
      }
    },
    "npm:babylon@6.8.2": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.9.2"
      }
    }
  }
});
