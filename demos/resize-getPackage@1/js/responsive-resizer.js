;(function (name, definition) {
    if (typeof define == 'function') define(definition);
    else if (typeof module != 'undefined') module.exports = definition();
    else this[name] = definition();
})('ResponsiveResizer', function () {

    /*
        w>320, h<=960, w>320&&h>480
    */

    var context = this,
        win = window,
        RR;
    
    RR = function (conf) {
        this.conf = conf;
        this._translateFn = this._translate();
        this._invokedKeys = {};
        
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
                this.conf[key].call(null);
                this._invokedKeys[key] = 1;
            }
        },
        _match: function () {
            var ret = [];
            for (var k in this.conf) {
                if (!this._invokedKeys[k] && this._translateFn[k]()) {
                    ret.push(k);
                }
            }
            return ret;
        }
        
    };
    
    context.ResponsiveResizer = RR;
    return RR;

});