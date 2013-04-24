;(function (name, definition) {
    if (typeof define == 'function') define(definition);
    else if (typeof module != 'undefined') module.exports = definition();
    else this[name] = definition();
})('ResponsiveRequestsCollection', function () {

    /*
        w>320, h<=960, w>320&&h>480
    */

    var context = this,
        win = window,
        RR;
    
    RR = function (alias, fns, conf) {
        if (arguments.length == 2) {
            this.alias = null;
            this.fns = alias;
            this.conf = fns;
        } else if (arguments.length == 3) {
            this.alias = alias;
            this.fns = fns;
            this.conf = conf;
        }
        
        this._requested = {};
        this._invokedKeys = {};
        this._translateFn = this._translate();
        
        if (this.alias) {
            for (var k in this.conf) {
                var arr = this.conf[k],
                    newArr = [];
                for (var i = 0; i < arr.length; i ++) {
                    newArr[i] = this.alias[arr[i]];
                }
                this.conf[k] = newArr;
            }
            for (var k in this.fns) {
                var nk = this.alias[k];
                this.fns[nk] = this.fns[k];
            }
        }
        
        this._bind();
        this._tryInvoke();
    };
    
    RR.prototype = {
        _bind: function () {
            var me = this;
            win.addEventListener('resize', function () {
                me._tryInvoke();
            });
        },
        _translate: function () {
            var ret = {};
            for (var k in this.conf) {
                ret[k] = new Function('w', 'h', 'return ('+ k +')');
            }
            
            return ret;
        },
        _tryInvoke: function () {
            var ret = this._match();

            for (var i = 0; i < ret.length; i ++) {
                var key = ret[i];
                for (var j = 0; j < this.conf[key].length; j ++) {
                    var kk = this.conf[key][j];
                    //console.log(kk, this.fns)
                    var fn = this.fns[kk];
                    if (!this._requested[kk]) {
                        fn.call(null);
                        this._requested[kk] = 1;
                    }
                }
                this._invokedKeys[key] = 1;
            }
        },
        _match: function () {
            var ret = [];
            for (var k in this.conf) {
                if (!this._invokedKeys[k] && this._translateFn[k](Math.max(document.body.clientWidth, document.documentElement.clientWidth), Math.max(document.body.clientHeight, document.documentElement.clientHeight))) {
                    ret.push(k);
                }
            }
            return ret;
        }
        
    };
    
    context.ResponsiveRequestsCollection = RR;
    return RR;

});