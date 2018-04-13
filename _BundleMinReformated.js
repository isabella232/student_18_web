!function (e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.cothority = t() : e.cothority = t()
}("undefined" != typeof self ? self : this, function () {
    return function (e) {
        var t = {};

        function r(i) {
            if (t[i]) return t[i].exports;
            var n = t[i] = {i: i, l: !1, exports: {}};
            return e[i].call(n.exports, n, n.exports, r), n.l = !0, n.exports
        }

        return r.m = e, r.c = t, r.d = function (e, t, i) {
            r.o(e, t) || Object.defineProperty(e, t, {configurable: !1, enumerable: !0, get: i})
        }, r.n = function (e) {
            var t = e && e.__esModule ? function () {
                return e.default
            } : function () {
                return e
            };
            return r.d(t, "a", t), t
        }, r.o = function (e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }, r.p = "", r(r.s = 37)
    }([function (e, t, r) {
        "use strict";
        var i, n, o = e.exports = r(2), s = r(29);
        o.codegen = r(55), o.fetch = r(56), o.path = r(57), o.fs = o.inquire("fs"), o.toArray = function (e) {
            if (e) {
                for (var t = Object.keys(e), r = new Array(t.length), i = 0; i < t.length;) r[i] = e[t[i++]];
                return r
            }
            return []
        }, o.toObject = function (e) {
            for (var t = {}, r = 0; r < e.length;) {
                var i = e[r++], n = e[r++];
                void 0 !== n && (t[i] = n)
            }
            return t
        };
        var a = /\\/g, f = /"/g;
        o.isReserved = function (e) {
            return /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/.test(e)
        }, o.safeProp = function (e) {
            return !/^[$\w_]+$/.test(e) || o.isReserved(e) ? '["' + e.replace(a, "\\\\").replace(f, '\\"') + '"]' : "." + e
        }, o.ucFirst = function (e) {
            return e.charAt(0).toUpperCase() + e.substring(1)
        };
        var c = /_([a-z])/g;
        o.camelCase = function (e) {
            return e.substring(0, 1) + e.substring(1).replace(c, function (e, t) {
                return t.toUpperCase()
            })
        }, o.compareFieldsById = function (e, t) {
            return e.id - t.id
        }, o.decorateType = function (e, t) {
            if (e.$type) return t && e.$type.name !== t && (o.decorateRoot.remove(e.$type), e.$type.name = t, o.decorateRoot.add(e.$type)), e.$type;
            i || (i = r(11));
            var n = new i(t || e.name);
            return o.decorateRoot.add(n), n.ctor = e, Object.defineProperty(e, "$type", {
                value: n,
                enumerable: !1
            }), Object.defineProperty(e.prototype, "$type", {value: n, enumerable: !1}), n
        };
        var u = 0;
        o.decorateEnum = function (e) {
            if (e.$type) return e.$type;
            n || (n = r(1));
            var t = new n("Enum" + u++, e);
            return o.decorateRoot.add(t), Object.defineProperty(e, "$type", {value: t, enumerable: !1}), t
        }, Object.defineProperty(o, "decorateRoot", {
            get: function () {
                return s.decorated || (s.decorated = new (r(16)))
            }
        })
    }, function (e, t, r) {
        "use strict";
        e.exports = s;
        var i = r(4);
        ((s.prototype = Object.create(i.prototype)).constructor = s).className = "Enum";
        var n = r(6), o = r(0);

        function s(e, t, r, n, o) {
            if (i.call(this, e, r), t && "object" != typeof t) throw TypeError("values must be an object");
            if (this.valuesById = {}, this.values = Object.create(this.valuesById), this.comment = n, this.comments = o || {}, this.reserved = void 0, t) for (var s = Object.keys(t), a = 0; a < s.length; ++a) "number" == typeof t[s[a]] && (this.valuesById[this.values[s[a]] = t[s[a]]] = s[a])
        }

        s.fromJSON = function (e, t) {
            var r = new s(e, t.values, t.options, t.comment, t.comments);
            return r.reserved = t.reserved, r
        }, s.prototype.toJSON = function (e) {
            var t = !!e && Boolean(e.keepComments);
            return o.toObject(["options", this.options, "values", this.values, "reserved", this.reserved && this.reserved.length ? this.reserved : void 0, "comment", t ? this.comment : void 0, "comments", t ? this.comments : void 0])
        }, s.prototype.add = function (e, t, r) {
            if (!o.isString(e)) throw TypeError("name must be a string");
            if (!o.isInteger(t)) throw TypeError("id must be an integer");
            if (void 0 !== this.values[e]) throw Error("duplicate name '" + e + "' in " + this);
            if (this.isReservedId(t)) throw Error("id " + t + " is reserved in " + this);
            if (this.isReservedName(e)) throw Error("name '" + e + "' is reserved in " + this);
            if (void 0 !== this.valuesById[t]) {
                if (!this.options || !this.options.allow_alias) throw Error("duplicate id " + t + " in " + this);
                this.values[e] = t
            } else this.valuesById[this.values[e] = t] = e;
            return this.comments[e] = r || null, this
        }, s.prototype.remove = function (e) {
            if (!o.isString(e)) throw TypeError("name must be a string");
            var t = this.values[e];
            if (null == t) throw Error("name '" + e + "' does not exist in " + this);
            return delete this.valuesById[t], delete this.values[e], delete this.comments[e], this
        }, s.prototype.isReservedId = function (e) {
            return n.isReservedId(this.reserved, e)
        }, s.prototype.isReservedName = function (e) {
            return n.isReservedName(this.reserved, e)
        }
    }, function (e, t, r) {
        "use strict";
        (function (e) {
            var i = t;

            function n(e, t, r) {
                for (var i = Object.keys(t), n = 0; n < i.length; ++n) void 0 !== e[i[n]] && r || (e[i[n]] = t[i[n]]);
                return e
            }

            function o(e) {
                function t(e, r) {
                    if (!(this instanceof t)) return new t(e, r);
                    Object.defineProperty(this, "message", {
                        get: function () {
                            return e
                        }
                    }), Error.captureStackTrace ? Error.captureStackTrace(this, t) : Object.defineProperty(this, "stack", {value: (new Error).stack || ""}), r && n(this, r)
                }

                return (t.prototype = Object.create(Error.prototype)).constructor = t, Object.defineProperty(t.prototype, "name", {
                    get: function () {
                        return e
                    }
                }), t.prototype.toString = function () {
                    return this.name + ": " + this.message
                }, t
            }

            i.asPromise = r(26), i.base64 = r(46), i.EventEmitter = r(47), i.float = r(48), i.inquire = r(27), i.utf8 = r(49), i.pool = r(50), i.LongBits = r(51), i.emptyArray = Object.freeze ? Object.freeze([]) : [], i.emptyObject = Object.freeze ? Object.freeze({}) : {}, i.isNode = Boolean(e.process && e.process.versions && e.process.versions.node), i.isInteger = Number.isInteger || function (e) {
                return "number" == typeof e && isFinite(e) && Math.floor(e) === e
            }, i.isString = function (e) {
                return "string" == typeof e || e instanceof String
            }, i.isObject = function (e) {
                return e && "object" == typeof e
            }, i.isset = i.isSet = function (e, t) {
                var r = e[t];
                return !(null == r || !e.hasOwnProperty(t)) && ("object" != typeof r || (Array.isArray(r) ? r.length : Object.keys(r).length) > 0)
            }, i.Buffer = function () {
                try {
                    var e = i.inquire("buffer").Buffer;
                    return e.prototype.utf8Write ? e : null
                } catch (e) {
                    return null
                }
            }(), i._Buffer_from = null, i._Buffer_allocUnsafe = null, i.newBuffer = function (e) {
                return "number" == typeof e ? i.Buffer ? i._Buffer_allocUnsafe(e) : new i.Array(e) : i.Buffer ? i._Buffer_from(e) : "undefined" == typeof Uint8Array ? e : new Uint8Array(e)
            }, i.Array = "undefined" != typeof Uint8Array ? Uint8Array : Array, i.Long = e.dcodeIO && e.dcodeIO.Long || i.inquire("long"), i.key2Re = /^true|false|0|1$/, i.key32Re = /^-?(?:0|[1-9][0-9]*)$/, i.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/, i.longToHash = function (e) {
                return e ? i.LongBits.from(e).toHash() : i.LongBits.zeroHash
            }, i.longFromHash = function (e, t) {
                var r = i.LongBits.fromHash(e);
                return i.Long ? i.Long.fromBits(r.lo, r.hi, t) : r.toNumber(Boolean(t))
            }, i.merge = n, i.lcFirst = function (e) {
                return e.charAt(0).toLowerCase() + e.substring(1)
            }, i.newError = o, i.ProtocolError = o("ProtocolError"), i.oneOfGetter = function (e) {
                for (var t = {}, r = 0; r < e.length; ++r) t[e[r]] = 1;
                return function () {
                    for (var e = Object.keys(this), r = e.length - 1; r > -1; --r) if (1 === t[e[r]] && void 0 !== this[e[r]] && null !== this[e[r]]) return e[r]
                }
            }, i.oneOfSetter = function (e) {
                return function (t) {
                    for (var r = 0; r < e.length; ++r) e[r] !== t && delete this[e[r]]
                }
            }, i.toJSONOptions = {longs: String, enums: String, bytes: String, json: !0}, i._configure = function () {
                var e = i.Buffer;
                e ? (i._Buffer_from = e.from !== Uint8Array.from && e.from || function (t, r) {
                    return new e(t, r)
                }, i._Buffer_allocUnsafe = e.allocUnsafe || function (t) {
                    return new e(t)
                }) : i._Buffer_from = i._Buffer_allocUnsafe = null
            }
        }).call(t, r(7))
    }, function (e, t, r) {
        "use strict";
        e.exports = c;
        var i = r(4);
        ((c.prototype = Object.create(i.prototype)).constructor = c).className = "Field";
        var n, o = r(1), s = r(5), a = r(0), f = /^required|optional|repeated$/;

        function c(e, t, r, n, o, c, u) {
            if (a.isObject(n) ? (u = o, c = n, n = o = void 0) : a.isObject(o) && (u = c, c = o, o = void 0), i.call(this, e, c), !a.isInteger(t) || t < 0) throw TypeError("id must be a non-negative integer");
            if (!a.isString(r)) throw TypeError("type must be a string");
            if (void 0 !== n && !f.test(n = n.toString().toLowerCase())) throw TypeError("rule must be a string rule");
            if (void 0 !== o && !a.isString(o)) throw TypeError("extend must be a string");
            this.rule = n && "optional" !== n ? n : void 0, this.type = r, this.id = t, this.extend = o || void 0, this.required = "required" === n, this.optional = !this.required, this.repeated = "repeated" === n, this.map = !1, this.message = null, this.partOf = null, this.typeDefault = null, this.defaultValue = null, this.long = !!a.Long && void 0 !== s.long[r], this.bytes = "bytes" === r, this.resolvedType = null, this.extensionField = null, this.declaringField = null, this._packed = null, this.comment = u
        }

        c.fromJSON = function (e, t) {
            return new c(e, t.id, t.type, t.rule, t.extend, t.options, t.comment)
        }, Object.defineProperty(c.prototype, "packed", {
            get: function () {
                return null === this._packed && (this._packed = !1 !== this.getOption("packed")), this._packed
            }
        }), c.prototype.setOption = function (e, t, r) {
            return "packed" === e && (this._packed = null), i.prototype.setOption.call(this, e, t, r)
        }, c.prototype.toJSON = function (e) {
            var t = !!e && Boolean(e.keepComments);
            return a.toObject(["rule", "optional" !== this.rule && this.rule || void 0, "type", this.type, "id", this.id, "extend", this.extend, "options", this.options, "comment", t ? this.comment : void 0])
        }, c.prototype.resolve = function () {
            if (this.resolved) return this;
            if (void 0 === (this.typeDefault = s.defaults[this.type]) && (this.resolvedType = (this.declaringField ? this.declaringField.parent : this.parent).lookupTypeOrEnum(this.type), this.resolvedType instanceof n ? this.typeDefault = null : this.typeDefault = this.resolvedType.values[Object.keys(this.resolvedType.values)[0]]), this.options && null != this.options.default && (this.typeDefault = this.options.default, this.resolvedType instanceof o && "string" == typeof this.typeDefault && (this.typeDefault = this.resolvedType.values[this.typeDefault])), this.options && (!0 !== this.options.packed && (void 0 === this.options.packed || !this.resolvedType || this.resolvedType instanceof o) || delete this.options.packed, Object.keys(this.options).length || (this.options = void 0)), this.long) this.typeDefault = a.Long.fromNumber(this.typeDefault, "u" === this.type.charAt(0)), Object.freeze && Object.freeze(this.typeDefault); else if (this.bytes && "string" == typeof this.typeDefault) {
                var e;
                a.base64.test(this.typeDefault) ? a.base64.decode(this.typeDefault, e = a.newBuffer(a.base64.length(this.typeDefault)), 0) : a.utf8.write(this.typeDefault, e = a.newBuffer(a.utf8.length(this.typeDefault)), 0), this.typeDefault = e
            }
            return this.map ? this.defaultValue = a.emptyObject : this.repeated ? this.defaultValue = a.emptyArray : this.defaultValue = this.typeDefault, this.parent instanceof n && (this.parent.ctor.prototype[this.name] = this.defaultValue), i.prototype.resolve.call(this)
        }, c.d = function (e, t, r, i) {
            return "function" == typeof t ? t = a.decorateType(t).name : t && "object" == typeof t && (t = a.decorateEnum(t).name), function (n, o) {
                a.decorateType(n.constructor).add(new c(o, e, t, r, {default: i}))
            }
        }, c._configure = function (e) {
            n = e
        }
    }, function (e, t, r) {
        "use strict";
        e.exports = o, o.className = "ReflectionObject";
        var i, n = r(0);

        function o(e, t) {
            if (!n.isString(e)) throw TypeError("name must be a string");
            if (t && !n.isObject(t)) throw TypeError("options must be an object");
            this.options = t, this.name = e, this.parent = null, this.resolved = !1, this.comment = null, this.filename = null
        }

        Object.defineProperties(o.prototype, {
            root: {
                get: function () {
                    for (var e = this; null !== e.parent;) e = e.parent;
                    return e
                }
            }, fullName: {
                get: function () {
                    for (var e = [this.name], t = this.parent; t;) e.unshift(t.name), t = t.parent;
                    return e.join(".")
                }
            }
        }), o.prototype.toJSON = function () {
            throw Error()
        }, o.prototype.onAdd = function (e) {
            this.parent && this.parent !== e && this.parent.remove(this), this.parent = e, this.resolved = !1;
            var t = e.root;
            t instanceof i && t._handleAdd(this)
        }, o.prototype.onRemove = function (e) {
            var t = e.root;
            t instanceof i && t._handleRemove(this), this.parent = null, this.resolved = !1
        }, o.prototype.resolve = function () {
            return this.resolved ? this : (this.root instanceof i && (this.resolved = !0), this)
        }, o.prototype.getOption = function (e) {
            if (this.options) return this.options[e]
        }, o.prototype.setOption = function (e, t, r) {
            return r && this.options && void 0 !== this.options[e] || ((this.options || (this.options = {}))[e] = t), this
        }, o.prototype.setOptions = function (e, t) {
            if (e) for (var r = Object.keys(e), i = 0; i < r.length; ++i) this.setOption(r[i], e[r[i]], t);
            return this
        }, o.prototype.toString = function () {
            var e = this.constructor.className, t = this.fullName;
            return t.length ? e + " " + t : e
        }, o._configure = function (e) {
            i = e
        }
    }, function (e, t, r) {
        "use strict";
        var i = t, n = r(0),
            o = ["double", "float", "int32", "uint32", "sint32", "fixed32", "sfixed32", "int64", "uint64", "sint64", "fixed64", "sfixed64", "bool", "string", "bytes"];

        function s(e, t) {
            var r = 0, i = {};
            for (t |= 0; r < e.length;) i[o[r + t]] = e[r++];
            return i
        }

        i.basic = s([1, 5, 0, 0, 0, 5, 5, 0, 0, 0, 1, 1, 0, 2, 2]), i.defaults = s([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, !1, "", n.emptyArray, null]), i.long = s([0, 0, 0, 1, 1], 7), i.mapKey = s([0, 0, 0, 5, 5, 0, 0, 0, 1, 1, 0, 2], 2), i.packed = s([1, 5, 0, 0, 0, 5, 5, 0, 0, 0, 1, 1, 0])
    }, function (e, t, r) {
        "use strict";
        e.exports = u;
        var i = r(4);
        ((u.prototype = Object.create(i.prototype)).constructor = u).className = "Namespace";
        var n, o, s = r(1), a = r(3), f = r(0);

        function c(e, t) {
            if (e && e.length) {
                for (var r = {}, i = 0; i < e.length; ++i) r[e[i].name] = e[i].toJSON(t);
                return r
            }
        }

        function u(e, t) {
            i.call(this, e, t), this.nested = void 0, this._nestedArray = null
        }

        function h(e) {
            return e._nestedArray = null, e
        }

        u.fromJSON = function (e, t) {
            return new u(e, t.options).addJSON(t.nested)
        }, u.arrayToJSON = c, u.isReservedId = function (e, t) {
            if (e) for (var r = 0; r < e.length; ++r) if ("string" != typeof e[r] && e[r][0] <= t && e[r][1] >= t) return !0;
            return !1
        }, u.isReservedName = function (e, t) {
            if (e) for (var r = 0; r < e.length; ++r) if (e[r] === t) return !0;
            return !1
        }, Object.defineProperty(u.prototype, "nestedArray", {
            get: function () {
                return this._nestedArray || (this._nestedArray = f.toArray(this.nested))
            }
        }), u.prototype.toJSON = function (e) {
            return f.toObject(["options", this.options, "nested", c(this.nestedArray, e)])
        }, u.prototype.addJSON = function (e) {
            if (e) for (var t, r = Object.keys(e), i = 0; i < r.length; ++i) t = e[r[i]], this.add((void 0 !== t.fields ? n.fromJSON : void 0 !== t.values ? s.fromJSON : void 0 !== t.methods ? o.fromJSON : void 0 !== t.id ? a.fromJSON : u.fromJSON)(r[i], t));
            return this
        }, u.prototype.get = function (e) {
            return this.nested && this.nested[e] || null
        }, u.prototype.getEnum = function (e) {
            if (this.nested && this.nested[e] instanceof s) return this.nested[e].values;
            throw Error("no such enum: " + e)
        }, u.prototype.add = function (e) {
            if (!(e instanceof a && void 0 !== e.extend || e instanceof n || e instanceof s || e instanceof o || e instanceof u)) throw TypeError("object must be a valid nested object");
            if (this.nested) {
                var t = this.get(e.name);
                if (t) {
                    if (!(t instanceof u && e instanceof u) || t instanceof n || t instanceof o) throw Error("duplicate name '" + e.name + "' in " + this);
                    for (var r = t.nestedArray, i = 0; i < r.length; ++i) e.add(r[i]);
                    this.remove(t), this.nested || (this.nested = {}), e.setOptions(t.options, !0)
                }
            } else this.nested = {};
            return this.nested[e.name] = e, e.onAdd(this), h(this)
        }, u.prototype.remove = function (e) {
            if (!(e instanceof i)) throw TypeError("object must be a ReflectionObject");
            if (e.parent !== this) throw Error(e + " is not a member of " + this);
            return delete this.nested[e.name], Object.keys(this.nested).length || (this.nested = void 0), e.onRemove(this), h(this)
        }, u.prototype.define = function (e, t) {
            if (f.isString(e)) e = e.split("."); else if (!Array.isArray(e)) throw TypeError("illegal path");
            if (e && e.length && "" === e[0]) throw Error("path must be relative");
            for (var r = this; e.length > 0;) {
                var i = e.shift();
                if (r.nested && r.nested[i]) {
                    if (!((r = r.nested[i]) instanceof u)) throw Error("path conflicts with non-namespace objects")
                } else r.add(r = new u(i))
            }
            return t && r.addJSON(t), r
        }, u.prototype.resolveAll = function () {
            for (var e = this.nestedArray, t = 0; t < e.length;) e[t] instanceof u ? e[t++].resolveAll() : e[t++].resolve();
            return this.resolve()
        }, u.prototype.lookup = function (e, t, r) {
            if ("boolean" == typeof t ? (r = t, t = void 0) : t && !Array.isArray(t) && (t = [t]), f.isString(e) && e.length) {
                if ("." === e) return this.root;
                e = e.split(".")
            } else if (!e.length) return this;
            if ("" === e[0]) return this.root.lookup(e.slice(1), t);
            var i = this.get(e[0]);
            if (i) {
                if (1 === e.length) {
                    if (!t || t.indexOf(i.constructor) > -1) return i
                } else if (i instanceof u && (i = i.lookup(e.slice(1), t, !0))) return i
            } else for (var n = 0; n < this.nestedArray.length; ++n) if (this._nestedArray[n] instanceof u && (i = this._nestedArray[n].lookup(e, t, !0))) return i;
            return null === this.parent || r ? null : this.parent.lookup(e, t)
        }, u.prototype.lookupType = function (e) {
            var t = this.lookup(e, [n]);
            if (!t) throw Error("no such type: " + e);
            return t
        }, u.prototype.lookupEnum = function (e) {
            var t = this.lookup(e, [s]);
            if (!t) throw Error("no such Enum '" + e + "' in " + this);
            return t
        }, u.prototype.lookupTypeOrEnum = function (e) {
            var t = this.lookup(e, [n, s]);
            if (!t) throw Error("no such Type or Enum '" + e + "' in " + this);
            return t
        }, u.prototype.lookupService = function (e) {
            var t = this.lookup(e, [o]);
            if (!t) throw Error("no such Service '" + e + "' in " + this);
            return t
        }, u._configure = function (e, t) {
            n = e, o = t
        }
    }, function (e, t) {
        var r;
        r = function () {
            return this
        }();
        try {
            r = r || Function("return this")() || (0, eval)("this")
        } catch (e) {
            "object" == typeof window && (r = window)
        }
        e.exports = r
    }, function (e, t, r) {
        "use strict";
        e.exports = s;
        var i = r(4);
        ((s.prototype = Object.create(i.prototype)).constructor = s).className = "OneOf";
        var n = r(3), o = r(0);

        function s(e, t, r, n) {
            if (Array.isArray(t) || (r = t, t = void 0), i.call(this, e, r), void 0 !== t && !Array.isArray(t)) throw TypeError("fieldNames must be an Array");
            this.oneof = t || [], this.fieldsArray = [], this.comment = n
        }

        function a(e) {
            if (e.parent) for (var t = 0; t < e.fieldsArray.length; ++t) e.fieldsArray[t].parent || e.parent.add(e.fieldsArray[t])
        }

        s.fromJSON = function (e, t) {
            return new s(e, t.oneof, t.options, t.comment)
        }, s.prototype.toJSON = function (e) {
            var t = !!e && Boolean(e.keepComments);
            return o.toObject(["options", this.options, "oneof", this.oneof, "comment", t ? this.comment : void 0])
        }, s.prototype.add = function (e) {
            if (!(e instanceof n)) throw TypeError("field must be a Field");
            return e.parent && e.parent !== this.parent && e.parent.remove(e), this.oneof.push(e.name), this.fieldsArray.push(e), e.partOf = this, a(this), this
        }, s.prototype.remove = function (e) {
            if (!(e instanceof n)) throw TypeError("field must be a Field");
            var t = this.fieldsArray.indexOf(e);
            if (t < 0) throw Error(e + " is not a member of " + this);
            return this.fieldsArray.splice(t, 1), (t = this.oneof.indexOf(e.name)) > -1 && this.oneof.splice(t, 1), e.partOf = null, this
        }, s.prototype.onAdd = function (e) {
            i.prototype.onAdd.call(this, e);
            for (var t = 0; t < this.oneof.length; ++t) {
                var r = e.get(this.oneof[t]);
                r && !r.partOf && (r.partOf = this, this.fieldsArray.push(r))
            }
            a(this)
        }, s.prototype.onRemove = function (e) {
            for (var t, r = 0; r < this.fieldsArray.length; ++r) (t = this.fieldsArray[r]).parent && t.parent.remove(t);
            i.prototype.onRemove.call(this, e)
        }, s.d = function () {
            for (var e = new Array(arguments.length), t = 0; t < arguments.length;) e[t] = arguments[t++];
            return function (t, r) {
                o.decorateType(t.constructor).add(new s(r, e)), Object.defineProperty(t, r, {
                    get: o.oneOfGetter(e),
                    set: o.oneOfSetter(e)
                })
            }
        }
    }, function (e, t, r) {
        "use strict";
        e.exports = u;
        var i, n = r(2), o = n.LongBits, s = n.base64, a = n.utf8;

        function f(e, t, r) {
            this.fn = e, this.len = t, this.next = void 0, this.val = r
        }

        function c() {
        }

        function u() {
            this.len = 0, this.head = new f(c, 0, 0), this.tail = this.head, this.states = null
        }

        function h(e, t, r) {
            t[r] = 255 & e
        }

        function d(e, t) {
            this.len = e, this.next = void 0, this.val = t
        }

        function l(e, t, r) {
            for (; e.hi;) t[r++] = 127 & e.lo | 128, e.lo = (e.lo >>> 7 | e.hi << 25) >>> 0, e.hi >>>= 7;
            for (; e.lo > 127;) t[r++] = 127 & e.lo | 128, e.lo = e.lo >>> 7;
            t[r++] = e.lo
        }

        function p(e, t, r) {
            t[r] = 255 & e, t[r + 1] = e >>> 8 & 255, t[r + 2] = e >>> 16 & 255, t[r + 3] = e >>> 24
        }

        u.create = n.Buffer ? function () {
            return (u.create = function () {
                return new i
            })()
        } : function () {
            return new u
        }, u.alloc = function (e) {
            return new n.Array(e)
        }, n.Array !== Array && (u.alloc = n.pool(u.alloc, n.Array.prototype.subarray)), u.prototype._push = function (e, t, r) {
            return this.tail = this.tail.next = new f(e, t, r), this.len += t, this
        }, d.prototype = Object.create(f.prototype), d.prototype.fn = function (e, t, r) {
            for (; e > 127;) t[r++] = 127 & e | 128, e >>>= 7;
            t[r] = e
        }, u.prototype.uint32 = function (e) {
            return this.len += (this.tail = this.tail.next = new d((e >>>= 0) < 128 ? 1 : e < 16384 ? 2 : e < 2097152 ? 3 : e < 268435456 ? 4 : 5, e)).len, this
        }, u.prototype.int32 = function (e) {
            return e < 0 ? this._push(l, 10, o.fromNumber(e)) : this.uint32(e)
        }, u.prototype.sint32 = function (e) {
            return this.uint32((e << 1 ^ e >> 31) >>> 0)
        }, u.prototype.uint64 = function (e) {
            var t = o.from(e);
            return this._push(l, t.length(), t)
        }, u.prototype.int64 = u.prototype.uint64, u.prototype.sint64 = function (e) {
            var t = o.from(e).zzEncode();
            return this._push(l, t.length(), t)
        }, u.prototype.bool = function (e) {
            return this._push(h, 1, e ? 1 : 0)
        }, u.prototype.fixed32 = function (e) {
            return this._push(p, 4, e >>> 0)
        }, u.prototype.sfixed32 = u.prototype.fixed32, u.prototype.fixed64 = function (e) {
            var t = o.from(e);
            return this._push(p, 4, t.lo)._push(p, 4, t.hi)
        }, u.prototype.sfixed64 = u.prototype.fixed64, u.prototype.float = function (e) {
            return this._push(n.float.writeFloatLE, 4, e)
        }, u.prototype.double = function (e) {
            return this._push(n.float.writeDoubleLE, 8, e)
        };
        var b = n.Array.prototype.set ? function (e, t, r) {
            t.set(e, r)
        } : function (e, t, r) {
            for (var i = 0; i < e.length; ++i) t[r + i] = e[i]
        };
        u.prototype.bytes = function (e) {
            var t = e.length >>> 0;
            if (!t) return this._push(h, 1, 0);
            if (n.isString(e)) {
                var r = u.alloc(t = s.length(e));
                s.decode(e, r, 0), e = r
            }
            return this.uint32(t)._push(b, t, e)
        }, u.prototype.string = function (e) {
            var t = a.length(e);
            return t ? this.uint32(t)._push(a.write, t, e) : this._push(h, 1, 0)
        }, u.prototype.fork = function () {
            return this.states = new function (e) {
                this.head = e.head, this.tail = e.tail, this.len = e.len, this.next = e.states
            }(this), this.head = this.tail = new f(c, 0, 0), this.len = 0, this
        }, u.prototype.reset = function () {
            return this.states ? (this.head = this.states.head, this.tail = this.states.tail, this.len = this.states.len, this.states = this.states.next) : (this.head = this.tail = new f(c, 0, 0), this.len = 0), this
        }, u.prototype.ldelim = function () {
            var e = this.head, t = this.tail, r = this.len;
            return this.reset().uint32(r), r && (this.tail.next = e.next, this.tail = t, this.len += r), this
        }, u.prototype.finish = function () {
            for (var e = this.head.next, t = this.constructor.alloc(this.len), r = 0; e;) e.fn(e.val, t, r), r += e.len, e = e.next;
            return t
        }, u._configure = function (e) {
            i = e
        }
    }, function (e, t, r) {
        "use strict";
        e.exports = f;
        var i, n = r(2), o = n.LongBits, s = n.utf8;

        function a(e, t) {
            return RangeError("index out of range: " + e.pos + " + " + (t || 1) + " > " + e.len)
        }

        function f(e) {
            this.buf = e, this.pos = 0, this.len = e.length
        }

        var c, u = "undefined" != typeof Uint8Array ? function (e) {
            if (e instanceof Uint8Array || Array.isArray(e)) return new f(e);
            throw Error("illegal buffer")
        } : function (e) {
            if (Array.isArray(e)) return new f(e);
            throw Error("illegal buffer")
        };

        function h() {
            var e = new o(0, 0), t = 0;
            if (!(this.len - this.pos > 4)) {
                for (; t < 3; ++t) {
                    if (this.pos >= this.len) throw a(this);
                    if (e.lo = (e.lo | (127 & this.buf[this.pos]) << 7 * t) >>> 0, this.buf[this.pos++] < 128) return e
                }
                return e.lo = (e.lo | (127 & this.buf[this.pos++]) << 7 * t) >>> 0, e
            }
            for (; t < 4; ++t) if (e.lo = (e.lo | (127 & this.buf[this.pos]) << 7 * t) >>> 0, this.buf[this.pos++] < 128) return e;
            if (e.lo = (e.lo | (127 & this.buf[this.pos]) << 28) >>> 0, e.hi = (e.hi | (127 & this.buf[this.pos]) >> 4) >>> 0, this.buf[this.pos++] < 128) return e;
            if (t = 0, this.len - this.pos > 4) {
                for (; t < 5; ++t) if (e.hi = (e.hi | (127 & this.buf[this.pos]) << 7 * t + 3) >>> 0, this.buf[this.pos++] < 128) return e
            } else for (; t < 5; ++t) {
                if (this.pos >= this.len) throw a(this);
                if (e.hi = (e.hi | (127 & this.buf[this.pos]) << 7 * t + 3) >>> 0, this.buf[this.pos++] < 128) return e
            }
            throw Error("invalid varint encoding")
        }

        function d(e, t) {
            return (e[t - 4] | e[t - 3] << 8 | e[t - 2] << 16 | e[t - 1] << 24) >>> 0
        }

        function l() {
            if (this.pos + 8 > this.len) throw a(this, 8);
            return new o(d(this.buf, this.pos += 4), d(this.buf, this.pos += 4))
        }

        f.create = n.Buffer ? function (e) {
            return (f.create = function (e) {
                return n.Buffer.isBuffer(e) ? new i(e) : u(e)
            })(e)
        } : u, f.prototype._slice = n.Array.prototype.subarray || n.Array.prototype.slice, f.prototype.uint32 = (c = 4294967295, function () {
            if (c = (127 & this.buf[this.pos]) >>> 0, this.buf[this.pos++] < 128) return c;
            if (c = (c | (127 & this.buf[this.pos]) << 7) >>> 0, this.buf[this.pos++] < 128) return c;
            if (c = (c | (127 & this.buf[this.pos]) << 14) >>> 0, this.buf[this.pos++] < 128) return c;
            if (c = (c | (127 & this.buf[this.pos]) << 21) >>> 0, this.buf[this.pos++] < 128) return c;
            if (c = (c | (15 & this.buf[this.pos]) << 28) >>> 0, this.buf[this.pos++] < 128) return c;
            if ((this.pos += 5) > this.len) throw this.pos = this.len, a(this, 10);
            return c
        }), f.prototype.int32 = function () {
            return 0 | this.uint32()
        }, f.prototype.sint32 = function () {
            var e = this.uint32();
            return e >>> 1 ^ -(1 & e) | 0
        }, f.prototype.bool = function () {
            return 0 !== this.uint32()
        }, f.prototype.fixed32 = function () {
            if (this.pos + 4 > this.len) throw a(this, 4);
            return d(this.buf, this.pos += 4)
        }, f.prototype.sfixed32 = function () {
            if (this.pos + 4 > this.len) throw a(this, 4);
            return 0 | d(this.buf, this.pos += 4)
        }, f.prototype.float = function () {
            if (this.pos + 4 > this.len) throw a(this, 4);
            var e = n.float.readFloatLE(this.buf, this.pos);
            return this.pos += 4, e
        }, f.prototype.double = function () {
            if (this.pos + 8 > this.len) throw a(this, 4);
            var e = n.float.readDoubleLE(this.buf, this.pos);
            return this.pos += 8, e
        }, f.prototype.bytes = function () {
            var e = this.uint32(), t = this.pos, r = this.pos + e;
            if (r > this.len) throw a(this, e);
            return this.pos += e, Array.isArray(this.buf) ? this.buf.slice(t, r) : t === r ? new this.buf.constructor(0) : this._slice.call(this.buf, t, r)
        }, f.prototype.string = function () {
            var e = this.bytes();
            return s.read(e, 0, e.length)
        }, f.prototype.skip = function (e) {
            if ("number" == typeof e) {
                if (this.pos + e > this.len) throw a(this, e);
                this.pos += e
            } else do {
                if (this.pos >= this.len) throw a(this)
            } while (128 & this.buf[this.pos++]);
            return this
        }, f.prototype.skipType = function (e) {
            switch (e) {
                case 0:
                    this.skip();
                    break;
                case 1:
                    this.skip(8);
                    break;
                case 2:
                    this.skip(this.uint32());
                    break;
                case 3:
                    for (; ;) {
                        if (4 == (e = 7 & this.uint32())) break;
                        this.skipType(e)
                    }
                    break;
                case 5:
                    this.skip(4);
                    break;
                default:
                    throw Error("invalid wire type " + e + " at offset " + this.pos)
            }
            return this
        }, f._configure = function (e) {
            i = e;
            var t = n.Long ? "toLong" : "toNumber";
            n.merge(f.prototype, {
                int64: function () {
                    return h.call(this)[t](!1)
                }, uint64: function () {
                    return h.call(this)[t](!0)
                }, sint64: function () {
                    return h.call(this).zzDecode()[t](!1)
                }, fixed64: function () {
                    return l.call(this)[t](!0)
                }, sfixed64: function () {
                    return l.call(this)[t](!1)
                }
            })
        }
    }, function (e, t, r) {
        "use strict";
        e.exports = m;
        var i = r(6);
        ((m.prototype = Object.create(i.prototype)).constructor = m).className = "Type";
        var n = r(1), o = r(8), s = r(3), a = r(12), f = r(13), c = r(15), u = r(10), h = r(9), d = r(0), l = r(30),
            p = r(31), b = r(32), y = r(33), v = r(34);

        function m(e, t) {
            i.call(this, e, t), this.fields = {}, this.oneofs = void 0, this.extensions = void 0, this.reserved = void 0, this.group = void 0, this._fieldsById = null, this._fieldsArray = null, this._oneofsArray = null, this._ctor = null
        }

        function g(e) {
            return e._fieldsById = e._fieldsArray = e._oneofsArray = null, delete e.encode, delete e.decode, delete e.verify, e
        }

        Object.defineProperties(m.prototype, {
            fieldsById: {
                get: function () {
                    if (this._fieldsById) return this._fieldsById;
                    this._fieldsById = {};
                    for (var e = Object.keys(this.fields), t = 0; t < e.length; ++t) {
                        var r = this.fields[e[t]], i = r.id;
                        if (this._fieldsById[i]) throw Error("duplicate id " + i + " in " + this);
                        this._fieldsById[i] = r
                    }
                    return this._fieldsById
                }
            }, fieldsArray: {
                get: function () {
                    return this._fieldsArray || (this._fieldsArray = d.toArray(this.fields))
                }
            }, oneofsArray: {
                get: function () {
                    return this._oneofsArray || (this._oneofsArray = d.toArray(this.oneofs))
                }
            }, ctor: {
                get: function () {
                    return this._ctor || (this.ctor = m.generateConstructor(this)())
                }, set: function (e) {
                    var t = e.prototype;
                    t instanceof c || ((e.prototype = new c).constructor = e, d.merge(e.prototype, t)), e.$type = e.prototype.$type = this, d.merge(e, c, !0), this._ctor = e;
                    for (var r = 0; r < this.fieldsArray.length; ++r) this._fieldsArray[r].resolve();
                    var i = {};
                    for (r = 0; r < this.oneofsArray.length; ++r) i[this._oneofsArray[r].resolve().name] = {
                        get: d.oneOfGetter(this._oneofsArray[r].oneof),
                        set: d.oneOfSetter(this._oneofsArray[r].oneof)
                    };
                    r && Object.defineProperties(e.prototype, i)
                }
            }
        }), m.generateConstructor = function (e) {
            for (var t, r = d.codegen(["p"], e.name), i = 0; i < e.fieldsArray.length; ++i) (t = e._fieldsArray[i]).map ? r("this%s={}", d.safeProp(t.name)) : t.repeated && r("this%s=[]", d.safeProp(t.name));
            return r("if(p)for(var ks=Object.keys(p),i=0;i<ks.length;++i)if(p[ks[i]]!=null)")("this[ks[i]]=p[ks[i]]")
        }, m.fromJSON = function (e, t) {
            var r = new m(e, t.options);
            r.extensions = t.extensions, r.reserved = t.reserved;
            for (var c = Object.keys(t.fields), u = 0; u < c.length; ++u) r.add((void 0 !== t.fields[c[u]].keyType ? a.fromJSON : s.fromJSON)(c[u], t.fields[c[u]]));
            if (t.oneofs) for (c = Object.keys(t.oneofs), u = 0; u < c.length; ++u) r.add(o.fromJSON(c[u], t.oneofs[c[u]]));
            if (t.nested) for (c = Object.keys(t.nested), u = 0; u < c.length; ++u) {
                var h = t.nested[c[u]];
                r.add((void 0 !== h.id ? s.fromJSON : void 0 !== h.fields ? m.fromJSON : void 0 !== h.values ? n.fromJSON : void 0 !== h.methods ? f.fromJSON : i.fromJSON)(c[u], h))
            }
            return t.extensions && t.extensions.length && (r.extensions = t.extensions), t.reserved && t.reserved.length && (r.reserved = t.reserved), t.group && (r.group = !0), t.comment && (r.comment = t.comment), r
        }, m.prototype.toJSON = function (e) {
            var t = i.prototype.toJSON.call(this, e), r = !!e && Boolean(e.keepComments);
            return d.toObject(["options", t && t.options || void 0, "oneofs", i.arrayToJSON(this.oneofsArray, e), "fields", i.arrayToJSON(this.fieldsArray.filter(function (e) {
                return !e.declaringField
            }), e) || {}, "extensions", this.extensions && this.extensions.length ? this.extensions : void 0, "reserved", this.reserved && this.reserved.length ? this.reserved : void 0, "group", this.group || void 0, "nested", t && t.nested || void 0, "comment", r ? this.comment : void 0])
        }, m.prototype.resolveAll = function () {
            for (var e = this.fieldsArray, t = 0; t < e.length;) e[t++].resolve();
            var r = this.oneofsArray;
            for (t = 0; t < r.length;) r[t++].resolve();
            return i.prototype.resolveAll.call(this)
        }, m.prototype.get = function (e) {
            return this.fields[e] || this.oneofs && this.oneofs[e] || this.nested && this.nested[e] || null
        }, m.prototype.add = function (e) {
            if (this.get(e.name)) throw Error("duplicate name '" + e.name + "' in " + this);
            if (e instanceof s && void 0 === e.extend) {
                if (this._fieldsById ? this._fieldsById[e.id] : this.fieldsById[e.id]) throw Error("duplicate id " + e.id + " in " + this);
                if (this.isReservedId(e.id)) throw Error("id " + e.id + " is reserved in " + this);
                if (this.isReservedName(e.name)) throw Error("name '" + e.name + "' is reserved in " + this);
                return e.parent && e.parent.remove(e), this.fields[e.name] = e, e.message = this, e.onAdd(this), g(this)
            }
            return e instanceof o ? (this.oneofs || (this.oneofs = {}), this.oneofs[e.name] = e, e.onAdd(this), g(this)) : i.prototype.add.call(this, e)
        }, m.prototype.remove = function (e) {
            if (e instanceof s && void 0 === e.extend) {
                if (!this.fields || this.fields[e.name] !== e) throw Error(e + " is not a member of " + this);
                return delete this.fields[e.name], e.parent = null, e.onRemove(this), g(this)
            }
            if (e instanceof o) {
                if (!this.oneofs || this.oneofs[e.name] !== e) throw Error(e + " is not a member of " + this);
                return delete this.oneofs[e.name], e.parent = null, e.onRemove(this), g(this)
            }
            return i.prototype.remove.call(this, e)
        }, m.prototype.isReservedId = function (e) {
            return i.isReservedId(this.reserved, e)
        }, m.prototype.isReservedName = function (e) {
            return i.isReservedName(this.reserved, e)
        }, m.prototype.create = function (e) {
            return new this.ctor(e)
        }, m.prototype.setup = function () {
            for (var e = this.fullName, t = [], r = 0; r < this.fieldsArray.length; ++r) t.push(this._fieldsArray[r].resolve().resolvedType);
            this.encode = l(this)({Writer: h, types: t, util: d}), this.decode = p(this)({
                Reader: u,
                types: t,
                util: d
            }), this.verify = b(this)({types: t, util: d}), this.fromObject = y.fromObject(this)({
                types: t,
                util: d
            }), this.toObject = y.toObject(this)({types: t, util: d});
            var i = v[e];
            if (i) {
                var n = Object.create(this);
                n.fromObject = this.fromObject, this.fromObject = i.fromObject.bind(n), n.toObject = this.toObject, this.toObject = i.toObject.bind(n)
            }
            return this
        }, m.prototype.encode = function (e, t) {
            return this.setup().encode(e, t)
        }, m.prototype.encodeDelimited = function (e, t) {
            return this.encode(e, t && t.len ? t.fork() : t).ldelim()
        }, m.prototype.decode = function (e, t) {
            return this.setup().decode(e, t)
        }, m.prototype.decodeDelimited = function (e) {
            return e instanceof u || (e = u.create(e)), this.decode(e, e.uint32())
        }, m.prototype.verify = function (e) {
            return this.setup().verify(e)
        }, m.prototype.fromObject = function (e) {
            return this.setup().fromObject(e)
        }, m.prototype.toObject = function (e, t) {
            return this.setup().toObject(e, t)
        }, m.d = function (e) {
            return function (t) {
                d.decorateType(t, e)
            }
        }
    }, function (e, t, r) {
        "use strict";
        e.exports = s;
        var i = r(3);
        ((s.prototype = Object.create(i.prototype)).constructor = s).className = "MapField";
        var n = r(5), o = r(0);

        function s(e, t, r, n, s, a) {
            if (i.call(this, e, t, n, void 0, void 0, s, a), !o.isString(r)) throw TypeError("keyType must be a string");
            this.keyType = r, this.resolvedKeyType = null, this.map = !0
        }

        s.fromJSON = function (e, t) {
            return new s(e, t.id, t.keyType, t.type, t.options, t.comment)
        }, s.prototype.toJSON = function (e) {
            var t = !!e && Boolean(e.keepComments);
            return o.toObject(["keyType", this.keyType, "type", this.type, "id", this.id, "extend", this.extend, "options", this.options, "comment", t ? this.comment : void 0])
        }, s.prototype.resolve = function () {
            if (this.resolved) return this;
            if (void 0 === n.mapKey[this.keyType]) throw Error("invalid key type: " + this.keyType);
            return i.prototype.resolve.call(this)
        }, s.d = function (e, t, r) {
            return "function" == typeof r ? r = o.decorateType(r).name : r && "object" == typeof r && (r = o.decorateEnum(r).name), function (i, n) {
                o.decorateType(i.constructor).add(new s(n, e, t, r))
            }
        }
    }, function (e, t, r) {
        "use strict";
        e.exports = a;
        var i = r(6);
        ((a.prototype = Object.create(i.prototype)).constructor = a).className = "Service";
        var n = r(14), o = r(0), s = r(28);

        function a(e, t) {
            i.call(this, e, t), this.methods = {}, this._methodsArray = null
        }

        function f(e) {
            return e._methodsArray = null, e
        }

        a.fromJSON = function (e, t) {
            var r = new a(e, t.options);
            if (t.methods) for (var i = Object.keys(t.methods), o = 0; o < i.length; ++o) r.add(n.fromJSON(i[o], t.methods[i[o]]));
            return t.nested && r.addJSON(t.nested), r.comment = t.comment, r
        }, a.prototype.toJSON = function (e) {
            var t = i.prototype.toJSON.call(this, e), r = !!e && Boolean(e.keepComments);
            return o.toObject(["options", t && t.options || void 0, "methods", i.arrayToJSON(this.methodsArray, e) || {}, "nested", t && t.nested || void 0, "comment", r ? this.comment : void 0])
        }, Object.defineProperty(a.prototype, "methodsArray", {
            get: function () {
                return this._methodsArray || (this._methodsArray = o.toArray(this.methods))
            }
        }), a.prototype.get = function (e) {
            return this.methods[e] || i.prototype.get.call(this, e)
        }, a.prototype.resolveAll = function () {
            for (var e = this.methodsArray, t = 0; t < e.length; ++t) e[t].resolve();
            return i.prototype.resolve.call(this)
        }, a.prototype.add = function (e) {
            if (this.get(e.name)) throw Error("duplicate name '" + e.name + "' in " + this);
            return e instanceof n ? (this.methods[e.name] = e, e.parent = this, f(this)) : i.prototype.add.call(this, e)
        }, a.prototype.remove = function (e) {
            if (e instanceof n) {
                if (this.methods[e.name] !== e) throw Error(e + " is not a member of " + this);
                return delete this.methods[e.name], e.parent = null, f(this)
            }
            return i.prototype.remove.call(this, e)
        }, a.prototype.create = function (e, t, r) {
            for (var i, n = new s.Service(e, t, r), a = 0; a < this.methodsArray.length; ++a) {
                var f = o.lcFirst((i = this._methodsArray[a]).resolve().name).replace(/[^$\w_]/g, "");
                n[f] = o.codegen(["r", "c"], o.isReserved(f) ? f + "_" : f)("return this.rpcCall(m,q,s,r,c)")({
                    m: i,
                    q: i.resolvedRequestType.ctor,
                    s: i.resolvedResponseType.ctor
                })
            }
            return n
        }
    }, function (e, t, r) {
        "use strict";
        e.exports = o;
        var i = r(4);
        ((o.prototype = Object.create(i.prototype)).constructor = o).className = "Method";
        var n = r(0);

        function o(e, t, r, o, s, a, f, c) {
            if (n.isObject(s) ? (f = s, s = a = void 0) : n.isObject(a) && (f = a, a = void 0), void 0 !== t && !n.isString(t)) throw TypeError("type must be a string");
            if (!n.isString(r)) throw TypeError("requestType must be a string");
            if (!n.isString(o)) throw TypeError("responseType must be a string");
            i.call(this, e, f), this.type = t || "rpc", this.requestType = r, this.requestStream = !!s || void 0, this.responseType = o, this.responseStream = !!a || void 0, this.resolvedRequestType = null, this.resolvedResponseType = null, this.comment = c
        }

        o.fromJSON = function (e, t) {
            return new o(e, t.type, t.requestType, t.responseType, t.requestStream, t.responseStream, t.options, t.comment)
        }, o.prototype.toJSON = function (e) {
            var t = !!e && Boolean(e.keepComments);
            return n.toObject(["type", "rpc" !== this.type && this.type || void 0, "requestType", this.requestType, "requestStream", this.requestStream, "responseType", this.responseType, "responseStream", this.responseStream, "options", this.options, "comment", t ? this.comment : void 0])
        }, o.prototype.resolve = function () {
            return this.resolved ? this : (this.resolvedRequestType = this.parent.lookupType(this.requestType), this.resolvedResponseType = this.parent.lookupType(this.responseType), i.prototype.resolve.call(this))
        }
    }, function (e, t, r) {
        "use strict";
        e.exports = n;
        var i = r(2);

        function n(e) {
            if (e) for (var t = Object.keys(e), r = 0; r < t.length; ++r) this[t[r]] = e[t[r]]
        }

        n.create = function (e) {
            return this.$type.create(e)
        }, n.encode = function (e, t) {
            return this.$type.encode(e, t)
        }, n.encodeDelimited = function (e, t) {
            return this.$type.encodeDelimited(e, t)
        }, n.decode = function (e) {
            return this.$type.decode(e)
        }, n.decodeDelimited = function (e) {
            return this.$type.decodeDelimited(e)
        }, n.verify = function (e) {
            return this.$type.verify(e)
        }, n.fromObject = function (e) {
            return this.$type.fromObject(e)
        }, n.toObject = function (e, t) {
            return this.$type.toObject(e, t)
        }, n.prototype.toJSON = function () {
            return this.$type.toObject(this, i.toJSONOptions)
        }
    }, function (e, t, r) {
        "use strict";
        e.exports = h;
        var i = r(6);
        ((h.prototype = Object.create(i.prototype)).constructor = h).className = "Root";
        var n, o, s, a = r(3), f = r(1), c = r(8), u = r(0);

        function h(e) {
            i.call(this, "", e), this.deferred = [], this.files = []
        }

        function d() {
        }

        h.fromJSON = function (e, t) {
            return t || (t = new h), e.options && t.setOptions(e.options), t.addJSON(e.nested)
        }, h.prototype.resolvePath = u.path.resolve, h.prototype.load = function e(t, r, i) {
            "function" == typeof r && (i = r, r = void 0);
            var n = this;
            if (!i) return u.asPromise(e, n, t, r);
            var a = i === d;

            function f(e, t) {
                if (i) {
                    var r = i;
                    if (i = null, a) throw e;
                    r(e, t)
                }
            }

            function c(e, t) {
                try {
                    if (u.isString(t) && "{" === t.charAt(0) && (t = JSON.parse(t)), u.isString(t)) {
                        o.filename = e;
                        var i, s = o(t, n, r), c = 0;
                        if (s.imports) for (; c < s.imports.length; ++c) (i = n.resolvePath(e, s.imports[c])) && h(i);
                        if (s.weakImports) for (c = 0; c < s.weakImports.length; ++c) (i = n.resolvePath(e, s.weakImports[c])) && h(i, !0)
                    } else n.setOptions(t.options).addJSON(t.nested)
                } catch (e) {
                    f(e)
                }
                a || l || f(null, n)
            }

            function h(e, t) {
                var r = e.lastIndexOf("google/protobuf/");
                if (r > -1) {
                    var o = e.substring(r);
                    o in s && (e = o)
                }
                if (!(n.files.indexOf(e) > -1)) if (n.files.push(e), e in s) a ? c(e, s[e]) : (++l, setTimeout(function () {
                    --l, c(e, s[e])
                })); else if (a) {
                    var h;
                    try {
                        h = u.fs.readFileSync(e).toString("utf8")
                    } catch (e) {
                        return void(t || f(e))
                    }
                    c(e, h)
                } else ++l, u.fetch(e, function (r, o) {
                    --l, i && (r ? t ? l || f(null, n) : f(r) : c(e, o))
                })
            }

            var l = 0;
            u.isString(t) && (t = [t]);
            for (var p, b = 0; b < t.length; ++b) (p = n.resolvePath("", t[b])) && h(p);
            if (a) return n;
            l || f(null, n)
        }, h.prototype.loadSync = function (e, t) {
            if (!u.isNode) throw Error("not supported");
            return this.load(e, t, d)
        }, h.prototype.resolveAll = function () {
            if (this.deferred.length) throw Error("unresolvable extensions: " + this.deferred.map(function (e) {
                return "'extend " + e.extend + "' in " + e.parent.fullName
            }).join(", "));
            return i.prototype.resolveAll.call(this)
        };
        var l = /^[A-Z]/;

        function p(e, t) {
            var r = t.parent.lookup(t.extend);
            if (r) {
                var i = new a(t.fullName, t.id, t.type, t.rule, void 0, t.options);
                return i.declaringField = t, t.extensionField = i, r.add(i), !0
            }
            return !1
        }

        h.prototype._handleAdd = function (e) {
            if (e instanceof a) void 0 === e.extend || e.extensionField || p(0, e) || this.deferred.push(e); else if (e instanceof f) l.test(e.name) && (e.parent[e.name] = e.values); else if (!(e instanceof c)) {
                if (e instanceof n) for (var t = 0; t < this.deferred.length;) p(0, this.deferred[t]) ? this.deferred.splice(t, 1) : ++t;
                for (var r = 0; r < e.nestedArray.length; ++r) this._handleAdd(e._nestedArray[r]);
                l.test(e.name) && (e.parent[e.name] = e)
            }
        }, h.prototype._handleRemove = function (e) {
            if (e instanceof a) {
                if (void 0 !== e.extend) if (e.extensionField) e.extensionField.parent.remove(e.extensionField), e.extensionField = null; else {
                    var t = this.deferred.indexOf(e);
                    t > -1 && this.deferred.splice(t, 1)
                }
            } else if (e instanceof f) l.test(e.name) && delete e.parent[e.name]; else if (e instanceof i) {
                for (var r = 0; r < e.nestedArray.length; ++r) this._handleRemove(e._nestedArray[r]);
                l.test(e.name) && delete e.parent[e.name]
            }
        }, h._configure = function (e, t, r) {
            n = e, o = t, s = r
        }
    }, function (e, t) {
        var r = Array.prototype.slice;

        function i(e) {
            var t = this, i = r.call(arguments, 1);
            return new Promise(function (r, s) {
                if ("function" == typeof e && (e = e.apply(t, i)), !e || "function" != typeof e.next) return r(e);

                function a(t) {
                    var r;
                    try {
                        r = e.next(t)
                    } catch (e) {
                        return s(e)
                    }
                    c(r)
                }

                function f(t) {
                    var r;
                    try {
                        r = e.throw(t)
                    } catch (e) {
                        return s(e)
                    }
                    c(r)
                }

                function c(e) {
                    if (e.done) return r(e.value);
                    var i = n.call(t, e.value);
                    return i && o(i) ? i.then(a, f) : f(new TypeError('You may only yield a function, promise, generator, array, or object, but the following object was passed: "' + String(e.value) + '"'))
                }

                a()
            })
        }

        function n(e) {
            return e ? o(e) ? e : function (e) {
                var t = e.constructor;
                return !!t && ("GeneratorFunction" === t.name || "GeneratorFunction" === t.displayName || s(t.prototype))
            }(e) || s(e) ? i.call(this, e) : "function" == typeof e ? function (e) {
                var t = this;
                return new Promise(function (i, n) {
                    e.call(t, function (e, t) {
                        if (e) return n(e);
                        arguments.length > 2 && (t = r.call(arguments, 1)), i(t)
                    })
                })
            }.call(this, e) : Array.isArray(e) ? function (e) {
                return Promise.all(e.map(n, this))
            }.call(this, e) : Object == e.constructor ? function (e) {
                for (var t = new e.constructor, r = Object.keys(e), i = [], s = 0; s < r.length; s++) {
                    var a = r[s], f = n.call(this, e[a]);
                    f && o(f) ? c(f, a) : t[a] = e[a]
                }
                return Promise.all(i).then(function () {
                    return t
                });

                function c(e, r) {
                    t[r] = void 0, i.push(e.then(function (e) {
                        t[r] = e
                    }))
                }
            }.call(this, e) : e : e
        }

        function o(e) {
            return "function" == typeof e.then
        }

        function s(e) {
            return "function" == typeof e.next && "function" == typeof e.throw
        }

        e.exports = i.default = i.co = i, i.wrap = function (e) {
            return t.__generatorFunction__ = e, t;

            function t() {
                return i.call(this, e.apply(this, arguments))
            }
        }
    }, function (e, t, r) {
        "use strict";
        const i = r(65), n = r(66).Root.fromJSON(i);
        e.exports.root = n
    }, function (e, t, r) {
        "use strict";
        const i = r(22), n = r(23), o = (r(17), r(24), r(36)), s = r(20);

        class a {
            constructor(e, t, r, i) {
                if (!(t instanceof o.Point)) throw new TypeError;
                if (!(e instanceof o.Group)) throw new TypeError;
                this.group = e, this.pub = t, this.addr = r, this._description = i;
                const a = "https://dedis.epfl.ch/id/" + s.uint8ArrayToHex(this.pub.marshalBinary());
                this._id = new n(5, "ns:URL", a).export();
                let f = r.split("://");
                if (2 != f.length) throw new Error("invalid address: " + r);
                let c = f[1].split(":");
                c[1] = parseInt(c[1]) + 1, this.wsAddr = "ws://" + c.join(":")
            }

            static fromHexPublic(e, t, r, i) {
                var n = s.hexToUint8Array(t), o = e.point();
                return o.unmarshalBinary(n), new a(e, o, r, i)
            }

            get public() {
                return this.pub
            }

            get websocketAddr() {
                return this.wsAddr
            }

            get tcpAddr() {
                return this.addr
            }

            get id() {
                return this._id
            }

            get description() {
                return this._description
            }

            toString() {
                return this.tcpAddr
            }
        }

        class f {
            constructor(e, t, r) {
                this.group = e, this._identities = t, this._id = r
            }

            random() {
                const e = Math.floor(Math.random() * (this.length() - 1));
                return this._identities[e]
            }

            get identities() {
                return this._identities
            }

            get(e) {
                if (e >= this.identitis.length) throw new Error("identity idx too high");
                return this.identities[e]
            }

            get length() {
                return this._identities.length
            }

            get id() {
                return this._id
            }

            aggregateKey() {
                const e = this.group.point().null();
                for (var t = 0; t < this.length; t++) e.add(e, this.identities[t].public);
                return e
            }

            static fromTOML(e) {
                if ("string" != typeof e) throw new TypeError;
                const t = i.parse(e);
                var r = void 0 === t.Suite ? "edwards25519" : t.Suite;
                r = o.curve.newCurve(r);
                const n = t.servers.map(e => a.fromHexPublic(r, e.Public, e.Address, e.description));
                return new f(r, n)
            }

            static fromProtobuf(e) {
                var t = void 0 === e.Suite ? "edwards25519" : e.Suite;
                t = o.curve.newCurve(t);
                const r = e.list.map(e => {
                    var r = t.point();
                    return r.unmarshalBinary(new Uint8Array(e.public)), new a(t, r, e.address, e.description)
                });
                return new f(t, r)
            }
        }

        e.exports = {Roster: f, ServerIdentity: a}
    }, function (e, t, r) {
        "use strict";
        const i = r(67);
        e.exports.uint8ArrayToHex = i.uint8ArrayToHex, e.exports.hexToUint8Array = i.hexToUint8Array, e.exports.uint8ArrayCompare = i.uint8ArrayCompare, e.exports.getSetBits = i.getSetBits, e.exports.getBitmaskLength = i.getBitmaskLength
    }, function (e, t, r) {
        "use strict";
        const i = r(39), n = i.Socket, o = i.RosterSocket;
        e.exports = {Socket: n, RosterSocket: o}
    }, function (e, t) {
        (function () {
            var e, r, i, n, o, s, a, f, c, u, h, d, l, p, b;
            b = this, f = function (e) {
                var t, r, n, a;
                for (b.parsed = {}, b.index = -1, b.line = 1, b.currentCharacter = "", b.currentObject = b.parsed, b.currentKey = "", b.tableKeys = [], (r = e.toString().replace(/\r\n/g, "\n").split("\n")).push(""), n = 0, a = r.length; n < a; n++) t = r[n], t = p(t);
                for (b.text = r.join("\n"); d();) switch (b.currentCharacter) {
                    case" ":
                        d();
                        break;
                    case"#":
                        i();
                        break;
                    case"[":
                        s();
                        break;
                    default:
                        o()
                }
                return b.parsed
            }, e = function (e) {
                throw new Error(e)
            }, d = function (t) {
                return function (r) {
                    return r && r !== a() && e("Syntax error on line " + t.line), "\n" === t.currentCharacter && t.line++, t.index++, t.currentCharacter = t.text.charAt(t.index)
                }
            }(this), a = function (e) {
                return function () {
                    return e.text.charAt(e.index + 1)
                }
            }(this), l = function () {
                var e;
                if (" " === a() || "\t" === a()) {
                    for (e = []; d() && (" " === a() || "\t" === a());) e.push(void 0);
                    return e
                }
            }, p = function (e) {
                return e.replace(/^[\s]+/, "").replace(/[\s]+$/, "")
            }, i = function (e) {
                return function () {
                    var t;
                    for (t = []; d() && "\n" !== e.currentCharacter && "\n" !== a();) t.push(void 0);
                    return t
                }
            }(this), h = function (t) {
                return function () {
                    var r, i, n, o, s;
                    if (n = "", '"' !== a()) for (; d();) {
                        if ("\\" === t.currentCharacter) if (d(), "u" === t.currentCharacter) {
                            for (o = 0, s = 1; s <= 4 && (i = parseInt(d(), 16), isFinite(i)); ++s) o = 16 * o + i;
                            n += String.fromCharCode(o)
                        } else {
                            switch (r = "", t.currentCharacter) {
                                case"b":
                                    r = "\b";
                                    break;
                                case"t":
                                    r = "\t";
                                    break;
                                case"n":
                                    r = "\n";
                                    break;
                                case"f":
                                    r = "\f";
                                    break;
                                case"r":
                                    r = "\r";
                                    break;
                                case'"':
                                    r = '"';
                                    break;
                                case"/":
                                    r = "/";
                                    break;
                                case"\\":
                                    r = "\\";
                                    break;
                                default:
                                    e("Whatever you're trying to escape on line " + t.line + " isn't supported. Try adding it in Unicode (\\uXXXX).")
                            }
                            n += r
                        } else n += t.currentCharacter;
                        if ('"' === a()) break
                    }
                    return d(), {type: "string", value: n}
                }
            }(this), u = function (t) {
                return function () {
                    var r, i, n;
                    if (r = t.currentCharacter, /[.Z:T\d-]/.test(a())) for (; d() && (r += t.currentCharacter, /[.Z:T\d-]/.test(a()));) ;
                    return /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})Z$/.test(r) ? (n = "date", i = new Date(r)) : /^-?(\d+)?\.\d+$/.test(r) ? (n = "float", i = parseFloat(r)) : /^-?\d+$/.test(r) ? (n = "integer", i = parseInt(r)) : e("Invalid primitive type on line " + t.line), {
                        type: n,
                        value: i
                    }
                }
            }(this), c = function (t) {
                return function () {
                    var r;
                    switch (t.currentCharacter.toLowerCase()) {
                        case"t":
                            d("r"), d("u"), d("e"), r = !0;
                            break;
                        case"f":
                            d("a"), d("l"), d("s"), d("e"), r = !1;
                            break;
                        default:
                            e("Invalid primitive type on line " + t.line)
                    }
                    return {type: "boolean", value: r}
                }
            }(this), n = function (t) {
                return function () {
                    var i, n, o;
                    for (i = [], n = null, l(); d();) if ((o = r()) && (n || (n = o.type), o.type !== n && e("Array on line " + t.line + " is mixing data types! That is a TOML no-no."), i.push(o.value), l(), d()), "," === t.currentCharacter || "\n" === t.currentCharacter) l(); else if ("]" === t.currentCharacter) break;
                    return {type: "array", value: i}
                }
            }(this), s = function (t) {
                return function () {
                    var r, i, n, o, s, f, c, u, h, b, y;
                    if (l(), d(), r = !1, "[" === t.currentCharacter && (r = !0, l(), d()), n = t.currentCharacter, "]" !== a()) for (; d() && ("[" !== t.currentCharacter && "#" !== t.currentCharacter ? n += t.currentCharacter : e("Improper table declaration on line " + t.line), "]" !== a());) ;
                    for (d(), l(), n = p(n), r && (d(), l()), "\n" !== a() && "#" !== a() && e("Improper table declaration on line " + t.line), f = n.split("."), t.currentObject = t.parsed, i = c = 0, h = f.length; c < h; i = ++c) if (s = f[i], o = !1, (s = p(s)).length <= 0 && e("Improper table declaration on line " + t.line), i === f.length - 1 && (o = !0), null == t.currentObject[s]) r && o ? (t.currentObject[s] = [{}], t.currentObject = t.currentObject[s][0]) : (t.currentObject[s] = {}, t.currentObject = t.currentObject[s]); else if (r) o ? (Array.isArray(t.currentObject[s]) || e("Check your tables and keys! You're attempting an overwrite on line " + t.line + "!"), t.currentObject[s].push({}), t.currentObject = t.currentObject[s][t.currentObject[s].length - 1]) : Array.isArray(t.currentObject[s]) ? t.currentObject = t.currentObject[s][t.currentObject[s].length - 1] : t.currentObject = t.currentObject[s]; else {
                        for (u = 0, b = (y = t.tableKeys).length; u < b; u++) y[u] === n && e("Check your tables and keys! You're attempting an overwrite on line " + t.line + "!");
                        t.currentObject = t.currentObject[s], Array.isArray(t.currentObject) && (t.currentObject = t.currentObject[t.currentObject.length - 1])
                    }
                    return t.tableKeys.push(n), t.currentKey = n
                }
            }(this), o = function (t) {
                return function () {
                    var i, n;
                    if (/[\w~!@#$^&*()_+-`1234567890\[\]\\|\/?><.,;:']/i.test(t.currentCharacter)) {
                        if (i = t.currentCharacter, "=" !== a()) for (; d() && (i += t.currentCharacter, "=" !== a());) ;
                        if (l(), i = p(i), "=" === d() && (l(), d(), n = r()), n || e("Syntax error on line " + t.line), null != t.currentObject[i] && e("Trying to overwrite previously set value on line " + t.line), t.currentObject[i] = n.value, t.tableKeys.push(t.currentKey + "." + i), l(), "\n" !== a() && "#" !== a()) return e("Syntax error on line " + t.line)
                    }
                }
            }(this), r = function (t) {
                return function () {
                    var r, o;
                    switch (r = null, t.currentCharacter) {
                        case"#":
                            i();
                            break;
                        case'"':
                            r = h();
                            break;
                        case"'":
                            e("Check the string on line " + t.line + "! TOML does not support single-quoted strings.");
                            break;
                        case"[":
                            r = n();
                            break;
                        case"-":
                            r = u();
                            break;
                        case"]":
                            break;
                        case"\n":
                            l();
                            break;
                        default:
                            "0" <= (o = t.currentCharacter) && o <= "9" ? r = u() : null === (r = c()) && e("Invalid primitive type on line " + t.line)
                    }
                    return r
                }
            }(this), void 0 === Array.isArray && (Array.isArray = function (e) {
                return "[object] Array" === Object.toString.call(e)
            }), null != t ? t.parse = f : (this.topl = {}, this.topl.parse = f)
        }).call(this)
    }, function (e, t, r) {
        (function (i) {
            var n, o;
            o = function () {
                var e = function (e, t, r, i, n, o) {
                        for (var s = function (e, t) {
                            var r = e.toString(16);
                            return r.length < 2 && (r = "0" + r), t && (r = r.toUpperCase()), r
                        }, a = t; a <= r; a++) n[o++] = s(e[a], i);
                        return n
                    }, t = function (e, t, r, i, n) {
                        for (var o = t; o <= r; o += 2) i[n++] = parseInt(e.substr(o, 2), 16)
                    },
                    r = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#".split(""),
                    n = [0, 68, 0, 84, 83, 82, 72, 0, 75, 76, 70, 65, 0, 63, 62, 69, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 64, 0, 73, 66, 74, 71, 81, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 77, 0, 78, 67, 0, 0, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 79, 0, 80, 0, 0],
                    o = function (e, t) {
                        var r = {ibits: 8, obits: 8, obigendian: !0};
                        for (var i in t) void 0 !== r[i] && (r[i] = t[i]);
                        for (var n, o, s, a = [], f = 0, c = 0, u = 0, h = e.length; 0 === c && (o = e.charCodeAt(f++)), n = o >> r.ibits - (c + 8) & 255, c = (c + 8) % r.ibits, r.obigendian ? 0 === u ? s = n << r.obits - 8 : s |= n << r.obits - 8 - u : 0 === u ? s = n : s |= n << u, !(0 === (u = (u + 8) % r.obits) && (a.push(s), f >= h));) ;
                        return a
                    }, s = function (e, t) {
                        var r = {ibits: 32, ibigendian: !0};
                        for (var i in t) void 0 !== r[i] && (r[i] = t[i]);
                        var n = "", o = 4294967295;
                        r.ibits < 32 && (o = (1 << r.ibits) - 1);
                        for (var s = e.length, a = 0; a < s; a++) for (var f = e[a] & o, c = 0; c < r.ibits; c += 8) r.ibigendian ? n += String.fromCharCode(f >> r.ibits - 8 - c & 255) : n += String.fromCharCode(f >> c & 255);
                        return n
                    }, a = function (e, t, r, i, n, o, s, a) {
                        return [a, s, o, n, i, r, t, e]
                    }, f = function () {
                        return a(0, 0, 0, 0, 0, 0, 0, 0)
                    }, c = function (e) {
                        return e.slice(0)
                    }, u = function (e) {
                        for (var t = f(), r = 0; r < 8; r++) t[r] = Math.floor(e % 256), e /= 256;
                        return t
                    }, h = function (e) {
                        for (var t = 0, r = 7; r >= 0; r--) t *= 256, t += e[r];
                        return Math.floor(t)
                    }, d = function (e, t) {
                        for (var r = 0, i = 0; i < 8; i++) r += e[i] + t[i], e[i] = Math.floor(r % 256), r = Math.floor(r / 256);
                        return r
                    }, l = function (e, t) {
                        for (var r = 0; r < 8; r++) e[r] &= t[r];
                        return e
                    }, p = function (e, t) {
                        var r = f();
                        if (t % 8 != 0) throw new Error("ui64_rorn: only bit rotations supported with a multiple of digit bits");
                        for (var i = Math.floor(t / 8), n = 0; n < i; n++) {
                            for (var o = 6; o >= 0; o--) r[o + 1] = r[o];
                            for (r[0] = e[0], o = 0; o < 7; o++) e[o] = e[o + 1];
                            e[o] = 0
                        }
                        return h(r)
                    }, b = function (e, t) {
                        if (t > 64) throw new Error("ui64_ror: invalid number of bits to shift");
                        var r, i = new Array(16);
                        for (r = 0; r < 8; r++) i[r + 8] = e[r], i[r] = 0;
                        var n = Math.floor(t / 8), o = t % 8;
                        for (r = n; r < 15; r++) i[r - n] = 255 & (i[r] >>> o | i[r + 1] << 8 - o);
                        for (i[15 - n] = i[15] >>> o & 255, r = 15 - n + 1; r < 16; r++) i[r] = 0;
                        for (r = 0; r < 8; r++) e[r] = i[r + 8];
                        return i.slice(0, 8)
                    }, y = function (e, t) {
                        for (var r = 0; r < 8; r++) e[r] ^= t[r]
                    }, v = function (e, t) {
                        var r = (65535 & e) + (65535 & t);
                        return (e >> 16) + (t >> 16) + (r >> 16) << 16 | 65535 & r
                    }, m = function (e, t) {
                        return e << t & 4294967295 | e >>> 32 - t & 4294967295
                    }, g = function (e) {
                        return s(function (e, t) {
                            function r(e, t, r, i) {
                                return e < 20 ? t & r | ~t & i : e < 40 ? t ^ r ^ i : e < 60 ? t & r | t & i | r & i : t ^ r ^ i
                            }

                            function i(e) {
                                return e < 20 ? 1518500249 : e < 40 ? 1859775393 : e < 60 ? -1894007588 : -899497514
                            }

                            e[t >> 5] |= 128 << 24 - t % 32, e[15 + (t + 64 >> 9 << 4)] = t;
                            for (var n = Array(80), o = 1732584193, s = -271733879, a = -1732584194, f = 271733878, c = -1009589776, u = 0; u < e.length; u += 16) {
                                for (var h = o, d = s, l = a, p = f, b = c, y = 0; y < 80; y++) {
                                    n[y] = y < 16 ? e[u + y] : m(n[y - 3] ^ n[y - 8] ^ n[y - 14] ^ n[y - 16], 1);
                                    var g = v(v(m(o, 5), r(y, s, a, f)), v(v(c, n[y]), i(y)));
                                    c = f, f = a, a = m(s, 30), s = o, o = g
                                }
                                o = v(o, h), s = v(s, d), a = v(a, l), f = v(f, p), c = v(c, b)
                            }
                            return [o, s, a, f, c]
                        }(o(e, {ibits: 8, obits: 32, obigendian: !0}), 8 * e.length), {ibits: 32, ibigendian: !0})
                    }, w = function (e) {
                        return s(function (e, t) {
                            function r(e, t, r, i, n, o) {
                                return v(m(v(v(t, e), v(i, o)), n), r)
                            }

                            function i(e, t, i, n, o, s, a) {
                                return r(t & i | ~t & n, e, t, o, s, a)
                            }

                            function n(e, t, i, n, o, s, a) {
                                return r(t & n | i & ~n, e, t, o, s, a)
                            }

                            function o(e, t, i, n, o, s, a) {
                                return r(t ^ i ^ n, e, t, o, s, a)
                            }

                            function s(e, t, i, n, o, s, a) {
                                return r(i ^ (t | ~n), e, t, o, s, a)
                            }

                            e[t >> 5] |= 128 << t % 32, e[14 + (t + 64 >>> 9 << 4)] = t;
                            for (var a = 1732584193, f = -271733879, c = -1732584194, u = 271733878, h = 0; h < e.length; h += 16) {
                                var d = a, l = f, p = c, b = u;
                                f = s(f = s(f = s(f = s(f = o(f = o(f = o(f = o(f = n(f = n(f = n(f = n(f = i(f = i(f = i(f = i(f, c = i(c, u = i(u, a = i(a, f, c, u, e[h + 0], 7, -680876936), f, c, e[h + 1], 12, -389564586), a, f, e[h + 2], 17, 606105819), u, a, e[h + 3], 22, -1044525330), c = i(c, u = i(u, a = i(a, f, c, u, e[h + 4], 7, -176418897), f, c, e[h + 5], 12, 1200080426), a, f, e[h + 6], 17, -1473231341), u, a, e[h + 7], 22, -45705983), c = i(c, u = i(u, a = i(a, f, c, u, e[h + 8], 7, 1770035416), f, c, e[h + 9], 12, -1958414417), a, f, e[h + 10], 17, -42063), u, a, e[h + 11], 22, -1990404162), c = i(c, u = i(u, a = i(a, f, c, u, e[h + 12], 7, 1804603682), f, c, e[h + 13], 12, -40341101), a, f, e[h + 14], 17, -1502002290), u, a, e[h + 15], 22, 1236535329), c = n(c, u = n(u, a = n(a, f, c, u, e[h + 1], 5, -165796510), f, c, e[h + 6], 9, -1069501632), a, f, e[h + 11], 14, 643717713), u, a, e[h + 0], 20, -373897302), c = n(c, u = n(u, a = n(a, f, c, u, e[h + 5], 5, -701558691), f, c, e[h + 10], 9, 38016083), a, f, e[h + 15], 14, -660478335), u, a, e[h + 4], 20, -405537848), c = n(c, u = n(u, a = n(a, f, c, u, e[h + 9], 5, 568446438), f, c, e[h + 14], 9, -1019803690), a, f, e[h + 3], 14, -187363961), u, a, e[h + 8], 20, 1163531501), c = n(c, u = n(u, a = n(a, f, c, u, e[h + 13], 5, -1444681467), f, c, e[h + 2], 9, -51403784), a, f, e[h + 7], 14, 1735328473), u, a, e[h + 12], 20, -1926607734), c = o(c, u = o(u, a = o(a, f, c, u, e[h + 5], 4, -378558), f, c, e[h + 8], 11, -2022574463), a, f, e[h + 11], 16, 1839030562), u, a, e[h + 14], 23, -35309556), c = o(c, u = o(u, a = o(a, f, c, u, e[h + 1], 4, -1530992060), f, c, e[h + 4], 11, 1272893353), a, f, e[h + 7], 16, -155497632), u, a, e[h + 10], 23, -1094730640), c = o(c, u = o(u, a = o(a, f, c, u, e[h + 13], 4, 681279174), f, c, e[h + 0], 11, -358537222), a, f, e[h + 3], 16, -722521979), u, a, e[h + 6], 23, 76029189), c = o(c, u = o(u, a = o(a, f, c, u, e[h + 9], 4, -640364487), f, c, e[h + 12], 11, -421815835), a, f, e[h + 15], 16, 530742520), u, a, e[h + 2], 23, -995338651), c = s(c, u = s(u, a = s(a, f, c, u, e[h + 0], 6, -198630844), f, c, e[h + 7], 10, 1126891415), a, f, e[h + 14], 15, -1416354905), u, a, e[h + 5], 21, -57434055), c = s(c, u = s(u, a = s(a, f, c, u, e[h + 12], 6, 1700485571), f, c, e[h + 3], 10, -1894986606), a, f, e[h + 10], 15, -1051523), u, a, e[h + 1], 21, -2054922799), c = s(c, u = s(u, a = s(a, f, c, u, e[h + 8], 6, 1873313359), f, c, e[h + 15], 10, -30611744), a, f, e[h + 6], 15, -1560198380), u, a, e[h + 13], 21, 1309151649), c = s(c, u = s(u, a = s(a, f, c, u, e[h + 4], 6, -145523070), f, c, e[h + 11], 10, -1120210379), a, f, e[h + 2], 15, 718787259), u, a, e[h + 9], 21, -343485551), a = v(a, d), f = v(f, l), c = v(c, p), u = v(u, b)
                            }
                            return [a, f, c, u]
                        }(o(e, {ibits: 8, obits: 32, obigendian: !1}), 8 * e.length), {ibits: 32, ibigendian: !1})
                    }, _ = function (e) {
                        this.mul = a(88, 81, 244, 45, 76, 149, 127, 45), this.inc = a(20, 5, 123, 126, 247, 103, 129, 79), this.mask = a(0, 0, 0, 0, 255, 255, 255, 255), this.state = c(this.inc), this.next(), l(this.state, this.mask), e = u(void 0 !== e ? e >>> 0 : 4294967295 * Math.random() >>> 0), function (e, t) {
                            for (var r = 0; r < 8; r++) e[r] |= t[r]
                        }(this.state, e), this.next()
                    };
                _.prototype.next = function () {
                    var e = c(this.state);
                    !function (e, t) {
                        var r, i, n, o = new Array(16);
                        for (r = 0; r < 16; r++) o[r] = 0;
                        for (r = 0; r < 8; r++) {
                            for (n = 0, i = 0; i < 8; i++) n += e[r] * t[i] + o[r + i], o[r + i] = n % 256, n /= 256;
                            for (; i < 16 - r; i++) n += o[r + i], o[r + i] = n % 256, n /= 256
                        }
                        for (r = 0; r < 8; r++) e[r] = o[r];
                        o.slice(8, 8)
                    }(this.state, this.mul), d(this.state, this.inc);
                    var t = c(e);
                    b(t, 18), y(t, e), b(t, 27);
                    var r = c(e);
                    b(r, 59), l(t, this.mask);
                    var i = h(r), n = c(t);
                    return function (e, t) {
                        if (t > 64) throw new Error("ui64_rol: invalid number of bits to shift");
                        var r, i = new Array(16);
                        for (r = 0; r < 8; r++) i[r + 8] = 0, i[r] = e[r];
                        var n = Math.floor(t / 8), o = t % 8;
                        for (r = 7 - n; r > 0; r--) i[r + n] = 255 & (i[r] << o | i[r - 1] >>> 8 - o);
                        for (i[0 + n] = i[0] << o & 255, r = 0 + n - 1; r >= 0; r--) i[r] = 0;
                        for (r = 0; r < 8; r++) e[r] = i[r];
                        i.slice(8, 8)
                    }(n, 32 - i), b(t, i), y(t, n), h(t)
                };
                var S = new _, k = function (e, t) {
                    for (var r = [], i = 0; i < e; i++) r[i] = S.next() % t;
                    return r
                }, A = 0, E = 0, x = function () {
                    if (1 === arguments.length && "string" == typeof arguments[0]) this.parse.apply(this, arguments); else if (arguments.length >= 1 && "number" == typeof arguments[0]) this.make.apply(this, arguments); else {
                        if (arguments.length >= 1) throw new Error("UUID: constructor: invalid arguments");
                        for (var e = 0; e < 16; e++) this[e] = 0
                    }
                };
                return (x.prototype = "undefined" != typeof Uint8Array ? new Uint8Array(16) : i ? new i(16) : new Array(16)).constructor = x, x.prototype.make = function (e) {
                    var t;
                    if (1 === e) {
                        var r = (new Date).getTime();
                        r !== A ? E = 0 : E++, A = r;
                        var i, n = u(r);
                        !function (e, t) {
                            for (var r = 0, i = 0; i < 8; i++) r += e[i] * t, e[i] = Math.floor(r % 256), r = Math.floor(r / 256)
                        }(n, 1e4), d(n, a(1, 178, 29, 210, 19, 129, 64, 0)), E > 0 && d(n, u(E)), i = p(n, 8), this[3] = 255 & i, i = p(n, 8), this[2] = 255 & i, i = p(n, 8), this[1] = 255 & i, i = p(n, 8), this[0] = 255 & i, i = p(n, 8), this[5] = 255 & i, i = p(n, 8), this[4] = 255 & i, i = p(n, 8), this[7] = 255 & i, i = p(n, 8), this[6] = 15 & i;
                        var o = k(2, 255);
                        this[8] = o[0], this[9] = o[1];
                        var s = k(6, 255);
                        for (s[0] |= 1, s[0] |= 2, t = 0; t < 6; t++) this[10 + t] = s[t]
                    } else if (4 === e) {
                        var f = k(16, 255);
                        for (t = 0; t < 16; t++) this[t] = f[t]
                    } else {
                        if (3 !== e && 5 !== e) throw new Error("UUID: make: invalid version");
                        var c = "",
                            h = "object" == typeof arguments[1] && arguments[1] instanceof x ? arguments[1] : (new x).parse(arguments[1]);
                        for (t = 0; t < 16; t++) c += String.fromCharCode(h[t]);
                        c += arguments[2];
                        var l = 3 === e ? w(c) : g(c);
                        for (t = 0; t < 16; t++) this[t] = l.charCodeAt(t)
                    }
                    return this[6] &= 15, this[6] |= e << 4, this[8] &= 63, this[8] |= 128, this
                }, x.prototype.format = function (t) {
                    var i, n;
                    return "z85" === t ? i = function (e, t) {
                        if (t % 4 != 0) throw new Error("z85_encode: invalid input length (multiple of 4 expected)");
                        for (var i = "", n = 0, o = 0; n < t;) if (o = 256 * o + e[n++], n % 4 == 0) {
                            for (var s = 52200625; s >= 1;) {
                                var a = Math.floor(o / s) % 85;
                                i += r[a], s /= 85
                            }
                            o = 0
                        }
                        return i
                    }(this, 16) : "b16" === t ? (n = Array(32), e(this, 0, 15, !0, n, 0), i = n.join("")) : void 0 !== t && "std" !== t || (n = new Array(36), e(this, 0, 3, !1, n, 0), n[8] = "-", e(this, 4, 5, !1, n, 9), n[13] = "-", e(this, 6, 7, !1, n, 14), n[18] = "-", e(this, 8, 9, !1, n, 19), n[23] = "-", e(this, 10, 15, !1, n, 24), i = n.join("")), i
                }, x.prototype.toString = function (e) {
                    return this.format(e)
                }, x.prototype.parse = function (e, r) {
                    if ("string" != typeof e) throw new Error("UUID: parse: invalid argument (type string expected)");
                    if ("z85" === r) !function (e, t) {
                        var r = e.length;
                        if (r % 5 != 0) throw new Error("z85_decode: invalid input length (multiple of 5 expected)");
                        void 0 === t && (t = new Array(4 * r / 5));
                        for (var i = 0, o = 0, s = 0; i < r;) {
                            var a = e.charCodeAt(i++) - 32;
                            if (a < 0 || a >= n.length) break;
                            if (s = 85 * s + n[a], i % 5 == 0) {
                                for (var f = 16777216; f >= 1;) t[o++] = Math.trunc(s / f % 256), f /= 256;
                                s = 0
                            }
                        }
                    }(e, this); else if ("b16" === r) t(e, 0, 35, this, 0); else if (void 0 === r || "std" === r) {
                        var i = {
                            nil: "00000000-0000-0000-0000-000000000000",
                            "ns:DNS": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
                            "ns:URL": "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
                            "ns:OID": "6ba7b812-9dad-11d1-80b4-00c04fd430c8",
                            "ns:X500": "6ba7b814-9dad-11d1-80b4-00c04fd430c8"
                        };
                        if (void 0 !== i[e]) e = i[e]; else if (!e.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)) throw new Error('UUID: parse: invalid string representation (expected "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx")');
                        t(e, 0, 7, this, 0), t(e, 9, 12, this, 4), t(e, 14, 17, this, 6), t(e, 19, 22, this, 8), t(e, 24, 35, this, 10)
                    }
                    return this
                }, x.prototype.export = function () {
                    for (var e = Array(16), t = 0; t < 16; t++) e[t] = this[t];
                    return e
                }, x.prototype.import = function (e) {
                    if (!("object" == typeof e && e instanceof Array)) throw new Error("UUID: import: invalid argument (type Array expected)");
                    if (16 !== e.length) throw new Error("UUID: import: invalid argument (Array of length 16 expected)");
                    for (var t = 0; t < 16; t++) {
                        if ("number" != typeof e[t]) throw new Error("UUID: import: invalid array element #" + t + " (type Number expected)");
                        if (!isFinite(e[t]) || Math.floor(e[t]) !== e[t]) throw new Error("UUID: import: invalid array element #" + t + " (Number with integer value expected)");
                        if (!(e[t] >= 0 && e[t] <= 255)) throw new Error("UUID: import: invalid array element #" + t + " (Number with integer value in range 0...255 expected)");
                        this[t] = e[t]
                    }
                    return this
                }, x.prototype.compare = function (e) {
                    if ("object" != typeof e) throw new Error("UUID: compare: invalid argument (type UUID expected)");
                    if (!(e instanceof x)) throw new Error("UUID: compare: invalid argument (type UUID expected)");
                    for (var t = 0; t < 16; t++) {
                        if (this[t] < e[t]) return -1;
                        if (this[t] > e[t]) return 1
                    }
                    return 0
                }, x.prototype.fold = function (e) {
                    if (void 0 === e) throw new Error("UUID: fold: invalid argument (number of fold operations expected)");
                    if (e < 1 || e > 4) throw new Error("UUID: fold: invalid argument (1-4 fold operations expected)");
                    for (var t = 16 / Math.pow(2, e), r = new Array(t), i = 0; i < t; i++) {
                        for (var n = 0, o = 0; i + o < 16; o += t) n ^= this[i + o];
                        r[i] = n
                    }
                    return r
                }, x.PCG = _, x
            }, void 0 === (n = function () {
                return o()
            }.call(t, r, t, e)) || (e.exports = n)
        }).call(t, r(40).Buffer)
    }, function (e, t, r) {
        "use strict";
        e.exports = r(44)
    }, function (e, t, r) {
        "use strict";
        var i = e.exports = r(45);
        i.build = "light", i.load = function (e, t, r) {
            return "function" == typeof t ? (r = t, t = new i.Root) : t || (t = new i.Root), t.load(e, r)
        }, i.loadSync = function (e, t) {
            return t || (t = new i.Root), t.loadSync(e)
        }, i.encoder = r(30), i.decoder = r(31), i.verifier = r(32), i.converter = r(33), i.ReflectionObject = r(4), i.Namespace = r(6), i.Root = r(16), i.Enum = r(1), i.Type = r(11), i.Field = r(3), i.OneOf = r(8), i.MapField = r(12), i.Service = r(13), i.Method = r(14), i.Message = r(15), i.wrappers = r(34), i.types = r(5), i.util = r(0), i.ReflectionObject._configure(i.Root), i.Namespace._configure(i.Type, i.Service), i.Root._configure(i.Type), i.Field._configure(i.Type)
    }, function (e, t, r) {
        "use strict";
        e.exports = function (e, t) {
            var r = new Array(arguments.length - 1), i = 0, n = 2, o = !0;
            for (; n < arguments.length;) r[i++] = arguments[n++];
            return new Promise(function (n, s) {
                r[i] = function (e) {
                    if (o) if (o = !1, e) s(e); else {
                        for (var t = new Array(arguments.length - 1), r = 0; r < t.length;) t[r++] = arguments[r];
                        n.apply(null, t)
                    }
                };
                try {
                    e.apply(t || null, r)
                } catch (e) {
                    o && (o = !1, s(e))
                }
            })
        }
    }, function (module, exports, __webpack_require__) {
        "use strict";

        function inquire(moduleName) {
            try {
                var mod = eval("quire".replace(/^/, "re"))(moduleName);
                if (mod && (mod.length || Object.keys(mod).length)) return mod
            } catch (e) {
            }
            return null
        }

        module.exports = inquire
    }, function (e, t, r) {
        "use strict";
        t.Service = r(54)
    }, function (e, t, r) {
        "use strict";
        e.exports = {}
    }, function (e, t, r) {
        "use strict";
        e.exports = function (e) {
            for (var t, r = o.codegen(["m", "w"], e.name + "$encode")("if(!w)")("w=Writer.create()"), a = e.fieldsArray.slice().sort(o.compareFieldsById), f = 0; f < a.length; ++f) {
                var c = a[f].resolve(), u = e._fieldsArray.indexOf(c),
                    h = c.resolvedType instanceof i ? "int32" : c.type, d = n.basic[h];
                t = "m" + o.safeProp(c.name), c.map ? (r("if(%s!=null&&m.hasOwnProperty(%j)){", t, c.name)("for(var ks=Object.keys(%s),i=0;i<ks.length;++i){", t)("w.uint32(%i).fork().uint32(%i).%s(ks[i])", (c.id << 3 | 2) >>> 0, 8 | n.mapKey[c.keyType], c.keyType), void 0 === d ? r("types[%i].encode(%s[ks[i]],w.uint32(18).fork()).ldelim().ldelim()", u, t) : r(".uint32(%i).%s(%s[ks[i]]).ldelim()", 16 | d, h, t), r("}")("}")) : c.repeated ? (r("if(%s!=null&&%s.length){", t, t), c.packed && void 0 !== n.packed[h] ? r("w.uint32(%i).fork()", (c.id << 3 | 2) >>> 0)("for(var i=0;i<%s.length;++i)", t)("w.%s(%s[i])", h, t)("w.ldelim()") : (r("for(var i=0;i<%s.length;++i)", t), void 0 === d ? s(r, c, u, t + "[i]") : r("w.uint32(%i).%s(%s[i])", (c.id << 3 | d) >>> 0, h, t)), r("}")) : (c.optional && r("if(%s!=null&&m.hasOwnProperty(%j))", t, c.name), void 0 === d ? s(r, c, u, t) : r("w.uint32(%i).%s(%s)", (c.id << 3 | d) >>> 0, h, t))
            }
            return r("return w")
        };
        var i = r(1), n = r(5), o = r(0);

        function s(e, t, r, i) {
            return t.resolvedType.group ? e("types[%i].encode(%s,w.uint32(%i)).uint32(%i)", r, i, (t.id << 3 | 3) >>> 0, (t.id << 3 | 4) >>> 0) : e("types[%i].encode(%s,w.uint32(%i).fork()).ldelim()", r, i, (t.id << 3 | 2) >>> 0)
        }
    }, function (e, t, r) {
        "use strict";
        e.exports = function (e) {
            var t = o.codegen(["r", "l"], e.name + "$decode")("if(!(r instanceof Reader))")("r=Reader.create(r)")("var c=l===undefined?r.len:r.pos+l,m=new this.ctor" + (e.fieldsArray.filter(function (e) {
                return e.map
            }).length ? ",k" : ""))("while(r.pos<c){")("var t=r.uint32()");
            e.group && t("if((t&7)===4)")("break");
            t("switch(t>>>3){");
            for (var r = 0; r < e.fieldsArray.length; ++r) {
                var a = e._fieldsArray[r].resolve(), f = a.resolvedType instanceof i ? "int32" : a.type,
                    c = "m" + o.safeProp(a.name);
                t("case %i:", a.id), a.map ? (t("r.skip().pos++")("if(%s===util.emptyObject)", c)("%s={}", c)("k=r.%s()", a.keyType)("r.pos++"), void 0 !== n.long[a.keyType] ? void 0 === n.basic[f] ? t('%s[typeof k==="object"?util.longToHash(k):k]=types[%i].decode(r,r.uint32())', c, r) : t('%s[typeof k==="object"?util.longToHash(k):k]=r.%s()', c, f) : void 0 === n.basic[f] ? t("%s[k]=types[%i].decode(r,r.uint32())", c, r) : t("%s[k]=r.%s()", c, f)) : a.repeated ? (t("if(!(%s&&%s.length))", c, c)("%s=[]", c), void 0 !== n.packed[f] && t("if((t&7)===2){")("var c2=r.uint32()+r.pos")("while(r.pos<c2)")("%s.push(r.%s())", c, f)("}else"), void 0 === n.basic[f] ? t(a.resolvedType.group ? "%s.push(types[%i].decode(r))" : "%s.push(types[%i].decode(r,r.uint32()))", c, r) : t("%s.push(r.%s())", c, f)) : void 0 === n.basic[f] ? t(a.resolvedType.group ? "%s=types[%i].decode(r)" : "%s=types[%i].decode(r,r.uint32())", c, r) : t("%s=r.%s()", c, f), t("break")
            }
            for (t("default:")("r.skipType(t&7)")("break")("}")("}"), r = 0; r < e._fieldsArray.length; ++r) {
                var u = e._fieldsArray[r];
                u.required && t("if(!m.hasOwnProperty(%j))", u.name)("throw util.ProtocolError(%j,{instance:m})", s(u))
            }
            return t("return m")
        };
        var i = r(1), n = r(5), o = r(0);

        function s(e) {
            return "missing required '" + e.name + "'"
        }
    }, function (e, t, r) {
        "use strict";
        e.exports = function (e) {
            var t = n.codegen(["m"], e.name + "$verify")('if(typeof m!=="object"||m===null)')("return%j", "object expected"),
                r = e.oneofsArray, i = {};
            r.length && t("var p={}");
            for (var f = 0; f < e.fieldsArray.length; ++f) {
                var c = e._fieldsArray[f].resolve(), u = "m" + n.safeProp(c.name);
                if (c.optional && t("if(%s!=null&&m.hasOwnProperty(%j)){", u, c.name), c.map) t("if(!util.isObject(%s))", u)("return%j", o(c, "object"))("var k=Object.keys(%s)", u)("for(var i=0;i<k.length;++i){"), a(t, c, "k[i]"), s(t, c, f, u + "[k[i]]")("}"); else if (c.repeated) t("if(!Array.isArray(%s))", u)("return%j", o(c, "array"))("for(var i=0;i<%s.length;++i){", u), s(t, c, f, u + "[i]")("}"); else {
                    if (c.partOf) {
                        var h = n.safeProp(c.partOf.name);
                        1 === i[c.partOf.name] && t("if(p%s===1)", h)("return%j", c.partOf.name + ": multiple values"), i[c.partOf.name] = 1, t("p%s=1", h)
                    }
                    s(t, c, f, u)
                }
                c.optional && t("}")
            }
            return t("return null")
        };
        var i = r(1), n = r(0);

        function o(e, t) {
            return e.name + ": " + t + (e.repeated && "array" !== t ? "[]" : e.map && "object" !== t ? "{k:" + e.keyType + "}" : "") + " expected"
        }

        function s(e, t, r, n) {
            if (t.resolvedType) if (t.resolvedType instanceof i) {
                e("switch(%s){", n)("default:")("return%j", o(t, "enum value"));
                for (var s = Object.keys(t.resolvedType.values), a = 0; a < s.length; ++a) e("case %i:", t.resolvedType.values[s[a]]);
                e("break")("}")
            } else e("{")("var e=types[%i].verify(%s);", r, n)("if(e)")("return%j+e", t.name + ".")("}"); else switch (t.type) {
                case"int32":
                case"uint32":
                case"sint32":
                case"fixed32":
                case"sfixed32":
                    e("if(!util.isInteger(%s))", n)("return%j", o(t, "integer"));
                    break;
                case"int64":
                case"uint64":
                case"sint64":
                case"fixed64":
                case"sfixed64":
                    e("if(!util.isInteger(%s)&&!(%s&&util.isInteger(%s.low)&&util.isInteger(%s.high)))", n, n, n, n)("return%j", o(t, "integer|Long"));
                    break;
                case"float":
                case"double":
                    e('if(typeof %s!=="number")', n)("return%j", o(t, "number"));
                    break;
                case"bool":
                    e('if(typeof %s!=="boolean")', n)("return%j", o(t, "boolean"));
                    break;
                case"string":
                    e("if(!util.isString(%s))", n)("return%j", o(t, "string"));
                    break;
                case"bytes":
                    e('if(!(%s&&typeof %s.length==="number"||util.isString(%s)))', n, n, n)("return%j", o(t, "buffer"))
            }
            return e
        }

        function a(e, t, r) {
            switch (t.keyType) {
                case"int32":
                case"uint32":
                case"sint32":
                case"fixed32":
                case"sfixed32":
                    e("if(!util.key32Re.test(%s))", r)("return%j", o(t, "integer key"));
                    break;
                case"int64":
                case"uint64":
                case"sint64":
                case"fixed64":
                case"sfixed64":
                    e("if(!util.key64Re.test(%s))", r)("return%j", o(t, "integer|Long key"));
                    break;
                case"bool":
                    e("if(!util.key2Re.test(%s))", r)("return%j", o(t, "boolean key"))
            }
            return e
        }
    }, function (e, t, r) {
        "use strict";
        var i = t, n = r(1), o = r(0);

        function s(e, t, r, i) {
            if (t.resolvedType) if (t.resolvedType instanceof n) {
                e("switch(d%s){", i);
                for (var o = t.resolvedType.values, s = Object.keys(o), a = 0; a < s.length; ++a) t.repeated && o[s[a]] === t.typeDefault && e("default:"), e("case%j:", s[a])("case %i:", o[s[a]])("m%s=%j", i, o[s[a]])("break");
                e("}")
            } else e('if(typeof d%s!=="object")', i)("throw TypeError(%j)", t.fullName + ": object expected")("m%s=types[%i].fromObject(d%s)", i, r, i); else {
                var f = !1;
                switch (t.type) {
                    case"double":
                    case"float":
                        e("m%s=Number(d%s)", i, i);
                        break;
                    case"uint32":
                    case"fixed32":
                        e("m%s=d%s>>>0", i, i);
                        break;
                    case"int32":
                    case"sint32":
                    case"sfixed32":
                        e("m%s=d%s|0", i, i);
                        break;
                    case"uint64":
                        f = !0;
                    case"int64":
                    case"sint64":
                    case"fixed64":
                    case"sfixed64":
                        e("if(util.Long)")("(m%s=util.Long.fromValue(d%s)).unsigned=%j", i, i, f)('else if(typeof d%s==="string")', i)("m%s=parseInt(d%s,10)", i, i)('else if(typeof d%s==="number")', i)("m%s=d%s", i, i)('else if(typeof d%s==="object")', i)("m%s=new util.LongBits(d%s.low>>>0,d%s.high>>>0).toNumber(%s)", i, i, i, f ? "true" : "");
                        break;
                    case"bytes":
                        e('if(typeof d%s==="string")', i)("util.base64.decode(d%s,m%s=util.newBuffer(util.base64.length(d%s)),0)", i, i, i)("else if(d%s.length)", i)("m%s=d%s", i, i);
                        break;
                    case"string":
                        e("m%s=String(d%s)", i, i);
                        break;
                    case"bool":
                        e("m%s=Boolean(d%s)", i, i)
                }
            }
            return e
        }

        function a(e, t, r, i) {
            if (t.resolvedType) t.resolvedType instanceof n ? e("d%s=o.enums===String?types[%i].values[m%s]:m%s", i, r, i, i) : e("d%s=types[%i].toObject(m%s,o)", i, r, i); else {
                var o = !1;
                switch (t.type) {
                    case"double":
                    case"float":
                        e("d%s=o.json&&!isFinite(m%s)?String(m%s):m%s", i, i, i, i);
                        break;
                    case"uint64":
                        o = !0;
                    case"int64":
                    case"sint64":
                    case"fixed64":
                    case"sfixed64":
                        e('if(typeof m%s==="number")', i)("d%s=o.longs===String?String(m%s):m%s", i, i, i)("else")("d%s=o.longs===String?util.Long.prototype.toString.call(m%s):o.longs===Number?new util.LongBits(m%s.low>>>0,m%s.high>>>0).toNumber(%s):m%s", i, i, i, i, o ? "true" : "", i);
                        break;
                    case"bytes":
                        e("d%s=o.bytes===String?util.base64.encode(m%s,0,m%s.length):o.bytes===Array?Array.prototype.slice.call(m%s):m%s", i, i, i, i, i);
                        break;
                    default:
                        e("d%s=m%s", i, i)
                }
            }
            return e
        }

        i.fromObject = function (e) {
            var t = e.fieldsArray,
                r = o.codegen(["d"], e.name + "$fromObject")("if(d instanceof this.ctor)")("return d");
            if (!t.length) return r("return new this.ctor");
            r("var m=new this.ctor");
            for (var i = 0; i < t.length; ++i) {
                var a = t[i].resolve(), f = o.safeProp(a.name);
                a.map ? (r("if(d%s){", f)('if(typeof d%s!=="object")', f)("throw TypeError(%j)", a.fullName + ": object expected")("m%s={}", f)("for(var ks=Object.keys(d%s),i=0;i<ks.length;++i){", f), s(r, a, i, f + "[ks[i]]")("}")("}")) : a.repeated ? (r("if(d%s){", f)("if(!Array.isArray(d%s))", f)("throw TypeError(%j)", a.fullName + ": array expected")("m%s=[]", f)("for(var i=0;i<d%s.length;++i){", f), s(r, a, i, f + "[i]")("}")("}")) : (a.resolvedType instanceof n || r("if(d%s!=null){", f), s(r, a, i, f), a.resolvedType instanceof n || r("}"))
            }
            return r("return m")
        }, i.toObject = function (e) {
            var t = e.fieldsArray.slice().sort(o.compareFieldsById);
            if (!t.length) return o.codegen()("return {}");
            for (var r = o.codegen(["m", "o"], e.name + "$toObject")("if(!o)")("o={}")("var d={}"), i = [], s = [], f = [], c = 0; c < t.length; ++c) t[c].partOf || (t[c].resolve().repeated ? i : t[c].map ? s : f).push(t[c]);
            if (i.length) {
                for (r("if(o.arrays||o.defaults){"), c = 0; c < i.length; ++c) r("d%s=[]", o.safeProp(i[c].name));
                r("}")
            }
            if (s.length) {
                for (r("if(o.objects||o.defaults){"), c = 0; c < s.length; ++c) r("d%s={}", o.safeProp(s[c].name));
                r("}")
            }
            if (f.length) {
                for (r("if(o.defaults){"), c = 0; c < f.length; ++c) {
                    var u = f[c], h = o.safeProp(u.name);
                    u.resolvedType instanceof n ? r("d%s=o.enums===String?%j:%j", h, u.resolvedType.valuesById[u.typeDefault], u.typeDefault) : u.long ? r("if(util.Long){")("var n=new util.Long(%i,%i,%j)", u.typeDefault.low, u.typeDefault.high, u.typeDefault.unsigned)("d%s=o.longs===String?n.toString():o.longs===Number?n.toNumber():n", h)("}else")("d%s=o.longs===String?%j:%i", h, u.typeDefault.toString(), u.typeDefault.toNumber()) : u.bytes ? r("d%s=o.bytes===String?%j:%s", h, String.fromCharCode.apply(String, u.typeDefault), "[" + Array.prototype.slice.call(u.typeDefault).join(",") + "]") : r("d%s=%j", h, u.typeDefault)
                }
                r("}")
            }
            var d = !1;
            for (c = 0; c < t.length; ++c) {
                u = t[c];
                var l = e._fieldsArray.indexOf(u);
                h = o.safeProp(u.name);
                u.map ? (d || (d = !0, r("var ks2")), r("if(m%s&&(ks2=Object.keys(m%s)).length){", h, h)("d%s={}", h)("for(var j=0;j<ks2.length;++j){"), a(r, u, l, h + "[ks2[j]]")("}")) : u.repeated ? (r("if(m%s&&m%s.length){", h, h)("d%s=[]", h)("for(var j=0;j<m%s.length;++j){", h), a(r, u, l, h + "[j]")("}")) : (r("if(m%s!=null&&m.hasOwnProperty(%j)){", h, u.name), a(r, u, l, h), u.partOf && r("if(o.oneofs)")("d%s=%j", o.safeProp(u.partOf.name), u.name)), r("}")
            }
            return r("return d")
        }
    }, function (e, t, r) {
        "use strict";
        var i = t, n = r(15);
        i[".google.protobuf.Any"] = {
            fromObject: function (e) {
                if (e && e["@type"]) {
                    var t = this.lookup(e["@type"]);
                    if (t) {
                        var r = "." === e["@type"].charAt(0) ? e["@type"].substr(1) : e["@type"];
                        return this.create({type_url: "/" + r, value: t.encode(t.fromObject(e)).finish()})
                    }
                }
                return this.fromObject(e)
            }, toObject: function (e, t) {
                if (t && t.json && e.type_url && e.value) {
                    var r = e.type_url.substring(e.type_url.lastIndexOf("/") + 1), i = this.lookup(r);
                    i && (e = i.decode(e.value))
                }
                if (!(e instanceof this.ctor) && e instanceof n) {
                    var o = e.$type.toObject(e, t);
                    return o["@type"] = e.$type.fullName, o
                }
                return this.toObject(e, t)
            }
        }
    }, function (e, t, r) {
        "use strict";
        e.exports = l;
        var i = /[\s{}=;:[\],'"()<>]/g, n = /(?:"([^"\\]*(?:\\.[^"\\]*)*)")/g, o = /(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g,
            s = /^ *[*/]+ */, a = /^\s*\*?\/*/, f = /\n/g, c = /\s/, u = /\\(.?)/g,
            h = {0: "\0", r: "\r", n: "\n", t: "\t"};

        function d(e) {
            return e.replace(u, function (e, t) {
                switch (t) {
                    case"\\":
                    case"":
                        return t;
                    default:
                        return h[t] || ""
                }
            })
        }

        function l(e, t) {
            e = e.toString();
            var r = 0, u = e.length, h = 1, l = null, p = null, b = 0, y = !1, v = [], m = null;

            function g(e) {
                return Error("illegal " + e + " (line " + h + ")")
            }

            function w(t) {
                return e.charAt(t)
            }

            function _(r, i) {
                l = e.charAt(r++), b = h, y = !1;
                var n, o = r - (t ? 2 : 3);
                do {
                    if (--o < 0 || "\n" === (n = e.charAt(o))) {
                        y = !0;
                        break
                    }
                } while (" " === n || "\t" === n);
                for (var c = e.substring(r, i).split(f), u = 0; u < c.length; ++u) c[u] = c[u].replace(t ? a : s, "").trim();
                p = c.join("\n").trim()
            }

            function S(t) {
                var r = k(t), i = e.substring(t, r);
                return /^\s*\/{1,2}/.test(i)
            }

            function k(e) {
                for (var t = e; t < u && "\n" !== w(t);) t++;
                return t
            }

            function A() {
                if (v.length > 0) return v.shift();
                if (m) return function () {
                    var t = "'" === m ? o : n;
                    t.lastIndex = r - 1;
                    var i = t.exec(e);
                    if (!i) throw g("string");
                    return r = t.lastIndex, E(m), m = null, d(i[1])
                }();
                var s, a, f, l, p;
                do {
                    if (r === u) return null;
                    for (s = !1; c.test(f = w(r));) if ("\n" === f && ++h, ++r === u) return null;
                    if ("/" === w(r)) {
                        if (++r === u) throw g("comment");
                        if ("/" === w(r)) if (t) {
                            if (l = r, p = !1, S(r)) {
                                p = !0;
                                do {
                                    if ((r = k(r)) === u) break;
                                    r++
                                } while (S(r))
                            } else r = Math.min(u, k(r) + 1);
                            p && _(l, r), h++, s = !0
                        } else {
                            for (p = "/" === w(l = r + 1); "\n" !== w(++r);) if (r === u) return null;
                            ++r, p && _(l, r - 1), ++h, s = !0
                        } else {
                            if ("*" !== (f = w(r))) return "/";
                            l = r + 1, p = t || "*" === w(l);
                            do {
                                if ("\n" === f && ++h, ++r === u) throw g("comment");
                                a = f, f = w(r)
                            } while ("*" !== a || "/" !== f);
                            ++r, p && _(l, r - 2), s = !0
                        }
                    }
                } while (s);
                var b = r;
                if (i.lastIndex = 0, !i.test(w(b++))) for (; b < u && !i.test(w(b));) ++b;
                var y = e.substring(r, r = b);
                return '"' !== y && "'" !== y || (m = y), y
            }

            function E(e) {
                v.push(e)
            }

            function x() {
                if (!v.length) {
                    var e = A();
                    if (null === e) return null;
                    E(e)
                }
                return v[0]
            }

            return Object.defineProperty({
                next: A, peek: x, push: E, skip: function (e, t) {
                    var r = x();
                    if (r === e) return A(), !0;
                    if (!t) throw g("token '" + r + "', '" + e + "' expected");
                    return !1
                }, cmnt: function (e) {
                    var r = null;
                    return void 0 === e ? b === h - 1 && (t || "*" === l || y) && (r = p) : (b < e && x(), b !== e || y || !t && "/" !== l || (r = p)), r
                }
            }, "line", {
                get: function () {
                    return h
                }
            })
        }

        l.unescape = d
    }, function (module, exports, __webpack_require__) {
        var t;
        "undefined" != typeof self && self, t = function () {
            return function (e) {
                var t = {};

                function r(i) {
                    if (t[i]) return t[i].exports;
                    var n = t[i] = {i: i, l: !1, exports: {}};
                    return e[i].call(n.exports, n, n.exports, r), n.l = !0, n.exports
                }

                return r.m = e, r.c = t, r.d = function (e, t, i) {
                    r.o(e, t) || Object.defineProperty(e, t, {configurable: !1, enumerable: !0, get: i})
                }, r.n = function (e) {
                    var t = e && e.__esModule ? function () {
                        return e.default
                    } : function () {
                        return e
                    };
                    return r.d(t, "a", t), t
                }, r.o = function (e, t) {
                    return Object.prototype.hasOwnProperty.call(e, t)
                }, r.p = "", r(r.s = 78)
            }([function (e, t) {
                "function" == typeof Object.create ? e.exports = function (e, t) {
                    e.super_ = t, e.prototype = Object.create(t.prototype, {
                        constructor: {
                            value: e,
                            enumerable: !1,
                            writable: !0,
                            configurable: !0
                        }
                    })
                } : e.exports = function (e, t) {
                    e.super_ = t;
                    var r = function () {
                    };
                    r.prototype = t.prototype, e.prototype = new r, e.prototype.constructor = e
                }
            }, function (e, t, r) {
                var i = r(3), n = i.Buffer;

                function o(e, t) {
                    for (var r in e) t[r] = e[r]
                }

                function s(e, t, r) {
                    return n(e, t, r)
                }

                n.from && n.alloc && n.allocUnsafe && n.allocUnsafeSlow ? e.exports = i : (o(i, t), t.Buffer = s), o(n, s), s.from = function (e, t, r) {
                    if ("number" == typeof e) throw new TypeError("Argument must not be a number");
                    return n(e, t, r)
                }, s.alloc = function (e, t, r) {
                    if ("number" != typeof e) throw new TypeError("Argument must be a number");
                    var i = n(e);
                    return void 0 !== t ? "string" == typeof r ? i.fill(t, r) : i.fill(t) : i.fill(0), i
                }, s.allocUnsafe = function (e) {
                    if ("number" != typeof e) throw new TypeError("Argument must be a number");
                    return n(e)
                }, s.allocUnsafeSlow = function (e) {
                    if ("number" != typeof e) throw new TypeError("Argument must be a number");
                    return i.SlowBuffer(e)
                }
            }, function (e, t, r) {
                (function (e) {
                    !function (e, t) {
                        "use strict";

                        function i(e, t) {
                            if (!e) throw new Error(t || "Assertion failed")
                        }

                        function n(e, t) {
                            e.super_ = t;
                            var r = function () {
                            };
                            r.prototype = t.prototype, e.prototype = new r, e.prototype.constructor = e
                        }

                        function o(e, t, r) {
                            if (o.isBN(e)) return e;
                            this.negative = 0, this.words = null, this.length = 0, this.red = null, null !== e && ("le" !== t && "be" !== t || (r = t, t = 10), this._init(e || 0, t || 10, r || "be"))
                        }

                        var s;
                        "object" == typeof e ? e.exports = o : t.BN = o, o.BN = o, o.wordSize = 26;
                        try {
                            s = r(83).Buffer
                        } catch (e) {
                        }

                        function a(e, t, r) {
                            for (var i = 0, n = Math.min(e.length, r), o = t; o < n; o++) {
                                var s = e.charCodeAt(o) - 48;
                                i <<= 4, i |= s >= 49 && s <= 54 ? s - 49 + 10 : s >= 17 && s <= 22 ? s - 17 + 10 : 15 & s
                            }
                            return i
                        }

                        function f(e, t, r, i) {
                            for (var n = 0, o = Math.min(e.length, r), s = t; s < o; s++) {
                                var a = e.charCodeAt(s) - 48;
                                n *= i, n += a >= 49 ? a - 49 + 10 : a >= 17 ? a - 17 + 10 : a
                            }
                            return n
                        }

                        o.isBN = function (e) {
                            return e instanceof o || null !== e && "object" == typeof e && e.constructor.wordSize === o.wordSize && Array.isArray(e.words)
                        }, o.max = function (e, t) {
                            return e.cmp(t) > 0 ? e : t
                        }, o.min = function (e, t) {
                            return e.cmp(t) < 0 ? e : t
                        }, o.prototype._init = function (e, t, r) {
                            if ("number" == typeof e) return this._initNumber(e, t, r);
                            if ("object" == typeof e) return this._initArray(e, t, r);
                            "hex" === t && (t = 16), i(t === (0 | t) && t >= 2 && t <= 36);
                            var n = 0;
                            "-" === (e = e.toString().replace(/\s+/g, ""))[0] && n++, 16 === t ? this._parseHex(e, n) : this._parseBase(e, t, n), "-" === e[0] && (this.negative = 1), this.strip(), "le" === r && this._initArray(this.toArray(), t, r)
                        }, o.prototype._initNumber = function (e, t, r) {
                            e < 0 && (this.negative = 1, e = -e), e < 67108864 ? (this.words = [67108863 & e], this.length = 1) : e < 4503599627370496 ? (this.words = [67108863 & e, e / 67108864 & 67108863], this.length = 2) : (i(e < 9007199254740992), this.words = [67108863 & e, e / 67108864 & 67108863, 1], this.length = 3), "le" === r && this._initArray(this.toArray(), t, r)
                        }, o.prototype._initArray = function (e, t, r) {
                            if (i("number" == typeof e.length), e.length <= 0) return this.words = [0], this.length = 1, this;
                            this.length = Math.ceil(e.length / 3), this.words = new Array(this.length);
                            for (var n = 0; n < this.length; n++) this.words[n] = 0;
                            var o, s, a = 0;
                            if ("be" === r) for (n = e.length - 1, o = 0; n >= 0; n -= 3) s = e[n] | e[n - 1] << 8 | e[n - 2] << 16, this.words[o] |= s << a & 67108863, this.words[o + 1] = s >>> 26 - a & 67108863, (a += 24) >= 26 && (a -= 26, o++); else if ("le" === r) for (n = 0, o = 0; n < e.length; n += 3) s = e[n] | e[n + 1] << 8 | e[n + 2] << 16, this.words[o] |= s << a & 67108863, this.words[o + 1] = s >>> 26 - a & 67108863, (a += 24) >= 26 && (a -= 26, o++);
                            return this.strip()
                        }, o.prototype._parseHex = function (e, t) {
                            this.length = Math.ceil((e.length - t) / 6), this.words = new Array(this.length);
                            for (var r = 0; r < this.length; r++) this.words[r] = 0;
                            var i, n, o = 0;
                            for (r = e.length - 6, i = 0; r >= t; r -= 6) n = a(e, r, r + 6), this.words[i] |= n << o & 67108863, this.words[i + 1] |= n >>> 26 - o & 4194303, (o += 24) >= 26 && (o -= 26, i++);
                            r + 6 !== t && (n = a(e, t, r + 6), this.words[i] |= n << o & 67108863, this.words[i + 1] |= n >>> 26 - o & 4194303), this.strip()
                        }, o.prototype._parseBase = function (e, t, r) {
                            this.words = [0], this.length = 1;
                            for (var i = 0, n = 1; n <= 67108863; n *= t) i++;
                            i--, n = n / t | 0;
                            for (var o = e.length - r, s = o % i, a = Math.min(o, o - s) + r, c = 0, u = r; u < a; u += i) c = f(e, u, u + i, t), this.imuln(n), this.words[0] + c < 67108864 ? this.words[0] += c : this._iaddn(c);
                            if (0 !== s) {
                                var h = 1;
                                for (c = f(e, u, e.length, t), u = 0; u < s; u++) h *= t;
                                this.imuln(h), this.words[0] + c < 67108864 ? this.words[0] += c : this._iaddn(c)
                            }
                        }, o.prototype.copy = function (e) {
                            e.words = new Array(this.length);
                            for (var t = 0; t < this.length; t++) e.words[t] = this.words[t];
                            e.length = this.length, e.negative = this.negative, e.red = this.red
                        }, o.prototype.clone = function () {
                            var e = new o(null);
                            return this.copy(e), e
                        }, o.prototype._expand = function (e) {
                            for (; this.length < e;) this.words[this.length++] = 0;
                            return this
                        }, o.prototype.strip = function () {
                            for (; this.length > 1 && 0 === this.words[this.length - 1];) this.length--;
                            return this._normSign()
                        }, o.prototype._normSign = function () {
                            return 1 === this.length && 0 === this.words[0] && (this.negative = 0), this
                        }, o.prototype.inspect = function () {
                            return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">"
                        };
                        var c = ["", "0", "00", "000", "0000", "00000", "000000", "0000000", "00000000", "000000000", "0000000000", "00000000000", "000000000000", "0000000000000", "00000000000000", "000000000000000", "0000000000000000", "00000000000000000", "000000000000000000", "0000000000000000000", "00000000000000000000", "000000000000000000000", "0000000000000000000000", "00000000000000000000000", "000000000000000000000000", "0000000000000000000000000"],
                            u = [0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
                            h = [0, 0, 33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216, 43046721, 1e7, 19487171, 35831808, 62748517, 7529536, 11390625, 16777216, 24137569, 34012224, 47045881, 64e6, 4084101, 5153632, 6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149, 243e5, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176];

                        function d(e, t, r) {
                            r.negative = t.negative ^ e.negative;
                            var i = e.length + t.length | 0;
                            r.length = i, i = i - 1 | 0;
                            var n = 0 | e.words[0], o = 0 | t.words[0], s = n * o, a = 67108863 & s,
                                f = s / 67108864 | 0;
                            r.words[0] = a;
                            for (var c = 1; c < i; c++) {
                                for (var u = f >>> 26, h = 67108863 & f, d = Math.min(c, t.length - 1), l = Math.max(0, c - e.length + 1); l <= d; l++) {
                                    var p = c - l | 0;
                                    u += (s = (n = 0 | e.words[p]) * (o = 0 | t.words[l]) + h) / 67108864 | 0, h = 67108863 & s
                                }
                                r.words[c] = 0 | h, f = 0 | u
                            }
                            return 0 !== f ? r.words[c] = 0 | f : r.length--, r.strip()
                        }

                        o.prototype.toString = function (e, t) {
                            var r;
                            if (t = 0 | t || 1, 16 === (e = e || 10) || "hex" === e) {
                                r = "";
                                for (var n = 0, o = 0, s = 0; s < this.length; s++) {
                                    var a = this.words[s], f = (16777215 & (a << n | o)).toString(16);
                                    r = 0 != (o = a >>> 24 - n & 16777215) || s !== this.length - 1 ? c[6 - f.length] + f + r : f + r, (n += 2) >= 26 && (n -= 26, s--)
                                }
                                for (0 !== o && (r = o.toString(16) + r); r.length % t != 0;) r = "0" + r;
                                return 0 !== this.negative && (r = "-" + r), r
                            }
                            if (e === (0 | e) && e >= 2 && e <= 36) {
                                var d = u[e], l = h[e];
                                r = "";
                                var p = this.clone();
                                for (p.negative = 0; !p.isZero();) {
                                    var b = p.modn(l).toString(e);
                                    r = (p = p.idivn(l)).isZero() ? b + r : c[d - b.length] + b + r
                                }
                                for (this.isZero() && (r = "0" + r); r.length % t != 0;) r = "0" + r;
                                return 0 !== this.negative && (r = "-" + r), r
                            }
                            i(!1, "Base should be between 2 and 36")
                        }, o.prototype.toNumber = function () {
                            var e = this.words[0];
                            return 2 === this.length ? e += 67108864 * this.words[1] : 3 === this.length && 1 === this.words[2] ? e += 4503599627370496 + 67108864 * this.words[1] : this.length > 2 && i(!1, "Number can only safely store up to 53 bits"), 0 !== this.negative ? -e : e
                        }, o.prototype.toJSON = function () {
                            return this.toString(16)
                        }, o.prototype.toBuffer = function (e, t) {
                            return i(void 0 !== s), this.toArrayLike(s, e, t)
                        }, o.prototype.toArray = function (e, t) {
                            return this.toArrayLike(Array, e, t)
                        }, o.prototype.toArrayLike = function (e, t, r) {
                            var n = this.byteLength(), o = r || Math.max(1, n);
                            i(n <= o, "byte array longer than desired length"), i(o > 0, "Requested array length <= 0"), this.strip();
                            var s, a, f = "le" === t, c = new e(o), u = this.clone();
                            if (f) {
                                for (a = 0; !u.isZero(); a++) s = u.andln(255), u.iushrn(8), c[a] = s;
                                for (; a < o; a++) c[a] = 0
                            } else {
                                for (a = 0; a < o - n; a++) c[a] = 0;
                                for (a = 0; !u.isZero(); a++) s = u.andln(255), u.iushrn(8), c[o - a - 1] = s
                            }
                            return c
                        }, Math.clz32 ? o.prototype._countBits = function (e) {
                            return 32 - Math.clz32(e)
                        } : o.prototype._countBits = function (e) {
                            var t = e, r = 0;
                            return t >= 4096 && (r += 13, t >>>= 13), t >= 64 && (r += 7, t >>>= 7), t >= 8 && (r += 4, t >>>= 4), t >= 2 && (r += 2, t >>>= 2), r + t
                        }, o.prototype._zeroBits = function (e) {
                            if (0 === e) return 26;
                            var t = e, r = 0;
                            return 0 == (8191 & t) && (r += 13, t >>>= 13), 0 == (127 & t) && (r += 7, t >>>= 7), 0 == (15 & t) && (r += 4, t >>>= 4), 0 == (3 & t) && (r += 2, t >>>= 2), 0 == (1 & t) && r++, r
                        }, o.prototype.bitLength = function () {
                            var e = this.words[this.length - 1], t = this._countBits(e);
                            return 26 * (this.length - 1) + t
                        }, o.prototype.zeroBits = function () {
                            if (this.isZero()) return 0;
                            for (var e = 0, t = 0; t < this.length; t++) {
                                var r = this._zeroBits(this.words[t]);
                                if (e += r, 26 !== r) break
                            }
                            return e
                        }, o.prototype.byteLength = function () {
                            return Math.ceil(this.bitLength() / 8)
                        }, o.prototype.toTwos = function (e) {
                            return 0 !== this.negative ? this.abs().inotn(e).iaddn(1) : this.clone()
                        }, o.prototype.fromTwos = function (e) {
                            return this.testn(e - 1) ? this.notn(e).iaddn(1).ineg() : this.clone()
                        }, o.prototype.isNeg = function () {
                            return 0 !== this.negative
                        }, o.prototype.neg = function () {
                            return this.clone().ineg()
                        }, o.prototype.ineg = function () {
                            return this.isZero() || (this.negative ^= 1), this
                        }, o.prototype.iuor = function (e) {
                            for (; this.length < e.length;) this.words[this.length++] = 0;
                            for (var t = 0; t < e.length; t++) this.words[t] = this.words[t] | e.words[t];
                            return this.strip()
                        }, o.prototype.ior = function (e) {
                            return i(0 == (this.negative | e.negative)), this.iuor(e)
                        }, o.prototype.or = function (e) {
                            return this.length > e.length ? this.clone().ior(e) : e.clone().ior(this)
                        }, o.prototype.uor = function (e) {
                            return this.length > e.length ? this.clone().iuor(e) : e.clone().iuor(this)
                        }, o.prototype.iuand = function (e) {
                            var t;
                            t = this.length > e.length ? e : this;
                            for (var r = 0; r < t.length; r++) this.words[r] = this.words[r] & e.words[r];
                            return this.length = t.length, this.strip()
                        }, o.prototype.iand = function (e) {
                            return i(0 == (this.negative | e.negative)), this.iuand(e)
                        }, o.prototype.and = function (e) {
                            return this.length > e.length ? this.clone().iand(e) : e.clone().iand(this)
                        }, o.prototype.uand = function (e) {
                            return this.length > e.length ? this.clone().iuand(e) : e.clone().iuand(this)
                        }, o.prototype.iuxor = function (e) {
                            var t, r;
                            this.length > e.length ? (t = this, r = e) : (t = e, r = this);
                            for (var i = 0; i < r.length; i++) this.words[i] = t.words[i] ^ r.words[i];
                            if (this !== t) for (; i < t.length; i++) this.words[i] = t.words[i];
                            return this.length = t.length, this.strip()
                        }, o.prototype.ixor = function (e) {
                            return i(0 == (this.negative | e.negative)), this.iuxor(e)
                        }, o.prototype.xor = function (e) {
                            return this.length > e.length ? this.clone().ixor(e) : e.clone().ixor(this)
                        }, o.prototype.uxor = function (e) {
                            return this.length > e.length ? this.clone().iuxor(e) : e.clone().iuxor(this)
                        }, o.prototype.inotn = function (e) {
                            i("number" == typeof e && e >= 0);
                            var t = 0 | Math.ceil(e / 26), r = e % 26;
                            this._expand(t), r > 0 && t--;
                            for (var n = 0; n < t; n++) this.words[n] = 67108863 & ~this.words[n];
                            return r > 0 && (this.words[n] = ~this.words[n] & 67108863 >> 26 - r), this.strip()
                        }, o.prototype.notn = function (e) {
                            return this.clone().inotn(e)
                        }, o.prototype.setn = function (e, t) {
                            i("number" == typeof e && e >= 0);
                            var r = e / 26 | 0, n = e % 26;
                            return this._expand(r + 1), this.words[r] = t ? this.words[r] | 1 << n : this.words[r] & ~(1 << n), this.strip()
                        }, o.prototype.iadd = function (e) {
                            var t, r, i;
                            if (0 !== this.negative && 0 === e.negative) return this.negative = 0, t = this.isub(e), this.negative ^= 1, this._normSign();
                            if (0 === this.negative && 0 !== e.negative) return e.negative = 0, t = this.isub(e), e.negative = 1, t._normSign();
                            this.length > e.length ? (r = this, i = e) : (r = e, i = this);
                            for (var n = 0, o = 0; o < i.length; o++) t = (0 | r.words[o]) + (0 | i.words[o]) + n, this.words[o] = 67108863 & t, n = t >>> 26;
                            for (; 0 !== n && o < r.length; o++) t = (0 | r.words[o]) + n, this.words[o] = 67108863 & t, n = t >>> 26;
                            if (this.length = r.length, 0 !== n) this.words[this.length] = n, this.length++; else if (r !== this) for (; o < r.length; o++) this.words[o] = r.words[o];
                            return this
                        }, o.prototype.add = function (e) {
                            var t;
                            return 0 !== e.negative && 0 === this.negative ? (e.negative = 0, t = this.sub(e), e.negative ^= 1, t) : 0 === e.negative && 0 !== this.negative ? (this.negative = 0, t = e.sub(this), this.negative = 1, t) : this.length > e.length ? this.clone().iadd(e) : e.clone().iadd(this)
                        }, o.prototype.isub = function (e) {
                            if (0 !== e.negative) {
                                e.negative = 0;
                                var t = this.iadd(e);
                                return e.negative = 1, t._normSign()
                            }
                            if (0 !== this.negative) return this.negative = 0, this.iadd(e), this.negative = 1, this._normSign();
                            var r, i, n = this.cmp(e);
                            if (0 === n) return this.negative = 0, this.length = 1, this.words[0] = 0, this;
                            n > 0 ? (r = this, i = e) : (r = e, i = this);
                            for (var o = 0, s = 0; s < i.length; s++) o = (t = (0 | r.words[s]) - (0 | i.words[s]) + o) >> 26, this.words[s] = 67108863 & t;
                            for (; 0 !== o && s < r.length; s++) o = (t = (0 | r.words[s]) + o) >> 26, this.words[s] = 67108863 & t;
                            if (0 === o && s < r.length && r !== this) for (; s < r.length; s++) this.words[s] = r.words[s];
                            return this.length = Math.max(this.length, s), r !== this && (this.negative = 1), this.strip()
                        }, o.prototype.sub = function (e) {
                            return this.clone().isub(e)
                        };
                        var l = function (e, t, r) {
                            var i, n, o, s = e.words, a = t.words, f = r.words, c = 0, u = 0 | s[0], h = 8191 & u,
                                d = u >>> 13, l = 0 | s[1], p = 8191 & l, b = l >>> 13, y = 0 | s[2], v = 8191 & y,
                                m = y >>> 13, g = 0 | s[3], w = 8191 & g, _ = g >>> 13, S = 0 | s[4], k = 8191 & S,
                                A = S >>> 13, E = 0 | s[5], x = 8191 & E, M = E >>> 13, B = 0 | s[6], R = 8191 & B,
                                I = B >>> 13, T = 0 | s[7], j = 8191 & T, O = T >>> 13, P = 0 | s[8], C = 8191 & P,
                                q = P >>> 13, U = 0 | s[9], N = 8191 & U, D = U >>> 13, L = 0 | a[0], z = 8191 & L,
                                F = L >>> 13, K = 0 | a[1], Y = 8191 & K, H = K >>> 13, V = 0 | a[2], J = 8191 & V,
                                G = V >>> 13, W = 0 | a[3], $ = 8191 & W, X = W >>> 13, Z = 0 | a[4], Q = 8191 & Z,
                                ee = Z >>> 13, te = 0 | a[5], re = 8191 & te, ie = te >>> 13, ne = 0 | a[6],
                                oe = 8191 & ne, se = ne >>> 13, ae = 0 | a[7], fe = 8191 & ae, ce = ae >>> 13,
                                ue = 0 | a[8], he = 8191 & ue, de = ue >>> 13, le = 0 | a[9], pe = 8191 & le,
                                be = le >>> 13;
                            r.negative = e.negative ^ t.negative, r.length = 19;
                            var ye = (c + (i = Math.imul(h, z)) | 0) + ((8191 & (n = (n = Math.imul(h, F)) + Math.imul(d, z) | 0)) << 13) | 0;
                            c = ((o = Math.imul(d, F)) + (n >>> 13) | 0) + (ye >>> 26) | 0, ye &= 67108863, i = Math.imul(p, z), n = (n = Math.imul(p, F)) + Math.imul(b, z) | 0, o = Math.imul(b, F);
                            var ve = (c + (i = i + Math.imul(h, Y) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, H) | 0) + Math.imul(d, Y) | 0)) << 13) | 0;
                            c = ((o = o + Math.imul(d, H) | 0) + (n >>> 13) | 0) + (ve >>> 26) | 0, ve &= 67108863, i = Math.imul(v, z), n = (n = Math.imul(v, F)) + Math.imul(m, z) | 0, o = Math.imul(m, F), i = i + Math.imul(p, Y) | 0, n = (n = n + Math.imul(p, H) | 0) + Math.imul(b, Y) | 0, o = o + Math.imul(b, H) | 0;
                            var me = (c + (i = i + Math.imul(h, J) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, G) | 0) + Math.imul(d, J) | 0)) << 13) | 0;
                            c = ((o = o + Math.imul(d, G) | 0) + (n >>> 13) | 0) + (me >>> 26) | 0, me &= 67108863, i = Math.imul(w, z), n = (n = Math.imul(w, F)) + Math.imul(_, z) | 0, o = Math.imul(_, F), i = i + Math.imul(v, Y) | 0, n = (n = n + Math.imul(v, H) | 0) + Math.imul(m, Y) | 0, o = o + Math.imul(m, H) | 0, i = i + Math.imul(p, J) | 0, n = (n = n + Math.imul(p, G) | 0) + Math.imul(b, J) | 0, o = o + Math.imul(b, G) | 0;
                            var ge = (c + (i = i + Math.imul(h, $) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, X) | 0) + Math.imul(d, $) | 0)) << 13) | 0;
                            c = ((o = o + Math.imul(d, X) | 0) + (n >>> 13) | 0) + (ge >>> 26) | 0, ge &= 67108863, i = Math.imul(k, z), n = (n = Math.imul(k, F)) + Math.imul(A, z) | 0, o = Math.imul(A, F), i = i + Math.imul(w, Y) | 0, n = (n = n + Math.imul(w, H) | 0) + Math.imul(_, Y) | 0, o = o + Math.imul(_, H) | 0, i = i + Math.imul(v, J) | 0, n = (n = n + Math.imul(v, G) | 0) + Math.imul(m, J) | 0, o = o + Math.imul(m, G) | 0, i = i + Math.imul(p, $) | 0, n = (n = n + Math.imul(p, X) | 0) + Math.imul(b, $) | 0, o = o + Math.imul(b, X) | 0;
                            var we = (c + (i = i + Math.imul(h, Q) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, ee) | 0) + Math.imul(d, Q) | 0)) << 13) | 0;
                            c = ((o = o + Math.imul(d, ee) | 0) + (n >>> 13) | 0) + (we >>> 26) | 0, we &= 67108863, i = Math.imul(x, z), n = (n = Math.imul(x, F)) + Math.imul(M, z) | 0, o = Math.imul(M, F), i = i + Math.imul(k, Y) | 0, n = (n = n + Math.imul(k, H) | 0) + Math.imul(A, Y) | 0, o = o + Math.imul(A, H) | 0, i = i + Math.imul(w, J) | 0, n = (n = n + Math.imul(w, G) | 0) + Math.imul(_, J) | 0, o = o + Math.imul(_, G) | 0, i = i + Math.imul(v, $) | 0, n = (n = n + Math.imul(v, X) | 0) + Math.imul(m, $) | 0, o = o + Math.imul(m, X) | 0, i = i + Math.imul(p, Q) | 0, n = (n = n + Math.imul(p, ee) | 0) + Math.imul(b, Q) | 0, o = o + Math.imul(b, ee) | 0;
                            var _e = (c + (i = i + Math.imul(h, re) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, ie) | 0) + Math.imul(d, re) | 0)) << 13) | 0;
                            c = ((o = o + Math.imul(d, ie) | 0) + (n >>> 13) | 0) + (_e >>> 26) | 0, _e &= 67108863, i = Math.imul(R, z), n = (n = Math.imul(R, F)) + Math.imul(I, z) | 0, o = Math.imul(I, F), i = i + Math.imul(x, Y) | 0, n = (n = n + Math.imul(x, H) | 0) + Math.imul(M, Y) | 0, o = o + Math.imul(M, H) | 0, i = i + Math.imul(k, J) | 0, n = (n = n + Math.imul(k, G) | 0) + Math.imul(A, J) | 0, o = o + Math.imul(A, G) | 0, i = i + Math.imul(w, $) | 0, n = (n = n + Math.imul(w, X) | 0) + Math.imul(_, $) | 0, o = o + Math.imul(_, X) | 0, i = i + Math.imul(v, Q) | 0, n = (n = n + Math.imul(v, ee) | 0) + Math.imul(m, Q) | 0, o = o + Math.imul(m, ee) | 0, i = i + Math.imul(p, re) | 0, n = (n = n + Math.imul(p, ie) | 0) + Math.imul(b, re) | 0, o = o + Math.imul(b, ie) | 0;
                            var Se = (c + (i = i + Math.imul(h, oe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, se) | 0) + Math.imul(d, oe) | 0)) << 13) | 0;
                            c = ((o = o + Math.imul(d, se) | 0) + (n >>> 13) | 0) + (Se >>> 26) | 0, Se &= 67108863, i = Math.imul(j, z), n = (n = Math.imul(j, F)) + Math.imul(O, z) | 0, o = Math.imul(O, F), i = i + Math.imul(R, Y) | 0, n = (n = n + Math.imul(R, H) | 0) + Math.imul(I, Y) | 0, o = o + Math.imul(I, H) | 0, i = i + Math.imul(x, J) | 0, n = (n = n + Math.imul(x, G) | 0) + Math.imul(M, J) | 0, o = o + Math.imul(M, G) | 0, i = i + Math.imul(k, $) | 0, n = (n = n + Math.imul(k, X) | 0) + Math.imul(A, $) | 0, o = o + Math.imul(A, X) | 0, i = i + Math.imul(w, Q) | 0, n = (n = n + Math.imul(w, ee) | 0) + Math.imul(_, Q) | 0, o = o + Math.imul(_, ee) | 0, i = i + Math.imul(v, re) | 0, n = (n = n + Math.imul(v, ie) | 0) + Math.imul(m, re) | 0, o = o + Math.imul(m, ie) | 0, i = i + Math.imul(p, oe) | 0, n = (n = n + Math.imul(p, se) | 0) + Math.imul(b, oe) | 0, o = o + Math.imul(b, se) | 0;
                            var ke = (c + (i = i + Math.imul(h, fe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, ce) | 0) + Math.imul(d, fe) | 0)) << 13) | 0;
                            c = ((o = o + Math.imul(d, ce) | 0) + (n >>> 13) | 0) + (ke >>> 26) | 0, ke &= 67108863, i = Math.imul(C, z), n = (n = Math.imul(C, F)) + Math.imul(q, z) | 0, o = Math.imul(q, F), i = i + Math.imul(j, Y) | 0, n = (n = n + Math.imul(j, H) | 0) + Math.imul(O, Y) | 0, o = o + Math.imul(O, H) | 0, i = i + Math.imul(R, J) | 0, n = (n = n + Math.imul(R, G) | 0) + Math.imul(I, J) | 0, o = o + Math.imul(I, G) | 0, i = i + Math.imul(x, $) | 0, n = (n = n + Math.imul(x, X) | 0) + Math.imul(M, $) | 0, o = o + Math.imul(M, X) | 0, i = i + Math.imul(k, Q) | 0, n = (n = n + Math.imul(k, ee) | 0) + Math.imul(A, Q) | 0, o = o + Math.imul(A, ee) | 0, i = i + Math.imul(w, re) | 0, n = (n = n + Math.imul(w, ie) | 0) + Math.imul(_, re) | 0, o = o + Math.imul(_, ie) | 0, i = i + Math.imul(v, oe) | 0, n = (n = n + Math.imul(v, se) | 0) + Math.imul(m, oe) | 0, o = o + Math.imul(m, se) | 0, i = i + Math.imul(p, fe) | 0, n = (n = n + Math.imul(p, ce) | 0) + Math.imul(b, fe) | 0, o = o + Math.imul(b, ce) | 0;
                            var Ae = (c + (i = i + Math.imul(h, he) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, de) | 0) + Math.imul(d, he) | 0)) << 13) | 0;
                            c = ((o = o + Math.imul(d, de) | 0) + (n >>> 13) | 0) + (Ae >>> 26) | 0, Ae &= 67108863, i = Math.imul(N, z), n = (n = Math.imul(N, F)) + Math.imul(D, z) | 0, o = Math.imul(D, F), i = i + Math.imul(C, Y) | 0, n = (n = n + Math.imul(C, H) | 0) + Math.imul(q, Y) | 0, o = o + Math.imul(q, H) | 0, i = i + Math.imul(j, J) | 0, n = (n = n + Math.imul(j, G) | 0) + Math.imul(O, J) | 0, o = o + Math.imul(O, G) | 0, i = i + Math.imul(R, $) | 0, n = (n = n + Math.imul(R, X) | 0) + Math.imul(I, $) | 0, o = o + Math.imul(I, X) | 0, i = i + Math.imul(x, Q) | 0, n = (n = n + Math.imul(x, ee) | 0) + Math.imul(M, Q) | 0, o = o + Math.imul(M, ee) | 0, i = i + Math.imul(k, re) | 0, n = (n = n + Math.imul(k, ie) | 0) + Math.imul(A, re) | 0, o = o + Math.imul(A, ie) | 0, i = i + Math.imul(w, oe) | 0, n = (n = n + Math.imul(w, se) | 0) + Math.imul(_, oe) | 0, o = o + Math.imul(_, se) | 0, i = i + Math.imul(v, fe) | 0, n = (n = n + Math.imul(v, ce) | 0) + Math.imul(m, fe) | 0, o = o + Math.imul(m, ce) | 0, i = i + Math.imul(p, he) | 0, n = (n = n + Math.imul(p, de) | 0) + Math.imul(b, he) | 0, o = o + Math.imul(b, de) | 0;
                            var Ee = (c + (i = i + Math.imul(h, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, be) | 0) + Math.imul(d, pe) | 0)) << 13) | 0;
                            c = ((o = o + Math.imul(d, be) | 0) + (n >>> 13) | 0) + (Ee >>> 26) | 0, Ee &= 67108863, i = Math.imul(N, Y), n = (n = Math.imul(N, H)) + Math.imul(D, Y) | 0, o = Math.imul(D, H), i = i + Math.imul(C, J) | 0, n = (n = n + Math.imul(C, G) | 0) + Math.imul(q, J) | 0, o = o + Math.imul(q, G) | 0, i = i + Math.imul(j, $) | 0, n = (n = n + Math.imul(j, X) | 0) + Math.imul(O, $) | 0, o = o + Math.imul(O, X) | 0, i = i + Math.imul(R, Q) | 0, n = (n = n + Math.imul(R, ee) | 0) + Math.imul(I, Q) | 0, o = o + Math.imul(I, ee) | 0, i = i + Math.imul(x, re) | 0, n = (n = n + Math.imul(x, ie) | 0) + Math.imul(M, re) | 0, o = o + Math.imul(M, ie) | 0, i = i + Math.imul(k, oe) | 0, n = (n = n + Math.imul(k, se) | 0) + Math.imul(A, oe) | 0, o = o + Math.imul(A, se) | 0, i = i + Math.imul(w, fe) | 0, n = (n = n + Math.imul(w, ce) | 0) + Math.imul(_, fe) | 0, o = o + Math.imul(_, ce) | 0, i = i + Math.imul(v, he) | 0, n = (n = n + Math.imul(v, de) | 0) + Math.imul(m, he) | 0, o = o + Math.imul(m, de) | 0;
                            var xe = (c + (i = i + Math.imul(p, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(p, be) | 0) + Math.imul(b, pe) | 0)) << 13) | 0;
                            c = ((o = o + Math.imul(b, be) | 0) + (n >>> 13) | 0) + (xe >>> 26) | 0, xe &= 67108863, i = Math.imul(N, J), n = (n = Math.imul(N, G)) + Math.imul(D, J) | 0, o = Math.imul(D, G), i = i + Math.imul(C, $) | 0, n = (n = n + Math.imul(C, X) | 0) + Math.imul(q, $) | 0, o = o + Math.imul(q, X) | 0, i = i + Math.imul(j, Q) | 0, n = (n = n + Math.imul(j, ee) | 0) + Math.imul(O, Q) | 0, o = o + Math.imul(O, ee) | 0, i = i + Math.imul(R, re) | 0, n = (n = n + Math.imul(R, ie) | 0) + Math.imul(I, re) | 0, o = o + Math.imul(I, ie) | 0, i = i + Math.imul(x, oe) | 0, n = (n = n + Math.imul(x, se) | 0) + Math.imul(M, oe) | 0, o = o + Math.imul(M, se) | 0, i = i + Math.imul(k, fe) | 0, n = (n = n + Math.imul(k, ce) | 0) + Math.imul(A, fe) | 0, o = o + Math.imul(A, ce) | 0, i = i + Math.imul(w, he) | 0, n = (n = n + Math.imul(w, de) | 0) + Math.imul(_, he) | 0, o = o + Math.imul(_, de) | 0;
                            var Me = (c + (i = i + Math.imul(v, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(v, be) | 0) + Math.imul(m, pe) | 0)) << 13) | 0;
                            c = ((o = o + Math.imul(m, be) | 0) + (n >>> 13) | 0) + (Me >>> 26) | 0, Me &= 67108863, i = Math.imul(N, $), n = (n = Math.imul(N, X)) + Math.imul(D, $) | 0, o = Math.imul(D, X), i = i + Math.imul(C, Q) | 0, n = (n = n + Math.imul(C, ee) | 0) + Math.imul(q, Q) | 0, o = o + Math.imul(q, ee) | 0, i = i + Math.imul(j, re) | 0, n = (n = n + Math.imul(j, ie) | 0) + Math.imul(O, re) | 0, o = o + Math.imul(O, ie) | 0, i = i + Math.imul(R, oe) | 0, n = (n = n + Math.imul(R, se) | 0) + Math.imul(I, oe) | 0, o = o + Math.imul(I, se) | 0, i = i + Math.imul(x, fe) | 0, n = (n = n + Math.imul(x, ce) | 0) + Math.imul(M, fe) | 0, o = o + Math.imul(M, ce) | 0, i = i + Math.imul(k, he) | 0, n = (n = n + Math.imul(k, de) | 0) + Math.imul(A, he) | 0, o = o + Math.imul(A, de) | 0;
                            var Be = (c + (i = i + Math.imul(w, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(w, be) | 0) + Math.imul(_, pe) | 0)) << 13) | 0;
                            c = ((o = o + Math.imul(_, be) | 0) + (n >>> 13) | 0) + (Be >>> 26) | 0, Be &= 67108863, i = Math.imul(N, Q), n = (n = Math.imul(N, ee)) + Math.imul(D, Q) | 0, o = Math.imul(D, ee), i = i + Math.imul(C, re) | 0, n = (n = n + Math.imul(C, ie) | 0) + Math.imul(q, re) | 0, o = o + Math.imul(q, ie) | 0, i = i + Math.imul(j, oe) | 0, n = (n = n + Math.imul(j, se) | 0) + Math.imul(O, oe) | 0, o = o + Math.imul(O, se) | 0, i = i + Math.imul(R, fe) | 0, n = (n = n + Math.imul(R, ce) | 0) + Math.imul(I, fe) | 0, o = o + Math.imul(I, ce) | 0, i = i + Math.imul(x, he) | 0, n = (n = n + Math.imul(x, de) | 0) + Math.imul(M, he) | 0, o = o + Math.imul(M, de) | 0;
                            var Re = (c + (i = i + Math.imul(k, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(k, be) | 0) + Math.imul(A, pe) | 0)) << 13) | 0;
                            c = ((o = o + Math.imul(A, be) | 0) + (n >>> 13) | 0) + (Re >>> 26) | 0, Re &= 67108863, i = Math.imul(N, re), n = (n = Math.imul(N, ie)) + Math.imul(D, re) | 0, o = Math.imul(D, ie), i = i + Math.imul(C, oe) | 0, n = (n = n + Math.imul(C, se) | 0) + Math.imul(q, oe) | 0, o = o + Math.imul(q, se) | 0, i = i + Math.imul(j, fe) | 0, n = (n = n + Math.imul(j, ce) | 0) + Math.imul(O, fe) | 0, o = o + Math.imul(O, ce) | 0, i = i + Math.imul(R, he) | 0, n = (n = n + Math.imul(R, de) | 0) + Math.imul(I, he) | 0, o = o + Math.imul(I, de) | 0;
                            var Ie = (c + (i = i + Math.imul(x, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(x, be) | 0) + Math.imul(M, pe) | 0)) << 13) | 0;
                            c = ((o = o + Math.imul(M, be) | 0) + (n >>> 13) | 0) + (Ie >>> 26) | 0, Ie &= 67108863, i = Math.imul(N, oe), n = (n = Math.imul(N, se)) + Math.imul(D, oe) | 0, o = Math.imul(D, se), i = i + Math.imul(C, fe) | 0, n = (n = n + Math.imul(C, ce) | 0) + Math.imul(q, fe) | 0, o = o + Math.imul(q, ce) | 0, i = i + Math.imul(j, he) | 0, n = (n = n + Math.imul(j, de) | 0) + Math.imul(O, he) | 0, o = o + Math.imul(O, de) | 0;
                            var Te = (c + (i = i + Math.imul(R, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(R, be) | 0) + Math.imul(I, pe) | 0)) << 13) | 0;
                            c = ((o = o + Math.imul(I, be) | 0) + (n >>> 13) | 0) + (Te >>> 26) | 0, Te &= 67108863, i = Math.imul(N, fe), n = (n = Math.imul(N, ce)) + Math.imul(D, fe) | 0, o = Math.imul(D, ce), i = i + Math.imul(C, he) | 0, n = (n = n + Math.imul(C, de) | 0) + Math.imul(q, he) | 0, o = o + Math.imul(q, de) | 0;
                            var je = (c + (i = i + Math.imul(j, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(j, be) | 0) + Math.imul(O, pe) | 0)) << 13) | 0;
                            c = ((o = o + Math.imul(O, be) | 0) + (n >>> 13) | 0) + (je >>> 26) | 0, je &= 67108863, i = Math.imul(N, he), n = (n = Math.imul(N, de)) + Math.imul(D, he) | 0, o = Math.imul(D, de);
                            var Oe = (c + (i = i + Math.imul(C, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(C, be) | 0) + Math.imul(q, pe) | 0)) << 13) | 0;
                            c = ((o = o + Math.imul(q, be) | 0) + (n >>> 13) | 0) + (Oe >>> 26) | 0, Oe &= 67108863;
                            var Pe = (c + (i = Math.imul(N, pe)) | 0) + ((8191 & (n = (n = Math.imul(N, be)) + Math.imul(D, pe) | 0)) << 13) | 0;
                            return c = ((o = Math.imul(D, be)) + (n >>> 13) | 0) + (Pe >>> 26) | 0, Pe &= 67108863, f[0] = ye, f[1] = ve, f[2] = me, f[3] = ge, f[4] = we, f[5] = _e, f[6] = Se, f[7] = ke, f[8] = Ae, f[9] = Ee, f[10] = xe, f[11] = Me, f[12] = Be, f[13] = Re, f[14] = Ie, f[15] = Te, f[16] = je, f[17] = Oe, f[18] = Pe, 0 !== c && (f[19] = c, r.length++), r
                        };

                        function p(e, t, r) {
                            return (new b).mulp(e, t, r)
                        }

                        function b(e, t) {
                            this.x = e, this.y = t
                        }

                        Math.imul || (l = d), o.prototype.mulTo = function (e, t) {
                            var r = this.length + e.length;
                            return 10 === this.length && 10 === e.length ? l(this, e, t) : r < 63 ? d(this, e, t) : r < 1024 ? function (e, t, r) {
                                r.negative = t.negative ^ e.negative, r.length = e.length + t.length;
                                for (var i = 0, n = 0, o = 0; o < r.length - 1; o++) {
                                    var s = n;
                                    n = 0;
                                    for (var a = 67108863 & i, f = Math.min(o, t.length - 1), c = Math.max(0, o - e.length + 1); c <= f; c++) {
                                        var u = o - c, h = (0 | e.words[u]) * (0 | t.words[c]), d = 67108863 & h;
                                        a = 67108863 & (d = d + a | 0), n += (s = (s = s + (h / 67108864 | 0) | 0) + (d >>> 26) | 0) >>> 26, s &= 67108863
                                    }
                                    r.words[o] = a, i = s, s = n
                                }
                                return 0 !== i ? r.words[o] = i : r.length--, r.strip()
                            }(this, e, t) : p(this, e, t)
                        }, b.prototype.makeRBT = function (e) {
                            for (var t = new Array(e), r = o.prototype._countBits(e) - 1, i = 0; i < e; i++) t[i] = this.revBin(i, r, e);
                            return t
                        }, b.prototype.revBin = function (e, t, r) {
                            if (0 === e || e === r - 1) return e;
                            for (var i = 0, n = 0; n < t; n++) i |= (1 & e) << t - n - 1, e >>= 1;
                            return i
                        }, b.prototype.permute = function (e, t, r, i, n, o) {
                            for (var s = 0; s < o; s++) i[s] = t[e[s]], n[s] = r[e[s]]
                        }, b.prototype.transform = function (e, t, r, i, n, o) {
                            this.permute(o, e, t, r, i, n);
                            for (var s = 1; s < n; s <<= 1) for (var a = s << 1, f = Math.cos(2 * Math.PI / a), c = Math.sin(2 * Math.PI / a), u = 0; u < n; u += a) for (var h = f, d = c, l = 0; l < s; l++) {
                                var p = r[u + l], b = i[u + l], y = r[u + l + s], v = i[u + l + s], m = h * y - d * v;
                                v = h * v + d * y, y = m, r[u + l] = p + y, i[u + l] = b + v, r[u + l + s] = p - y, i[u + l + s] = b - v, l !== a && (m = f * h - c * d, d = f * d + c * h, h = m)
                            }
                        }, b.prototype.guessLen13b = function (e, t) {
                            var r = 1 | Math.max(t, e), i = 1 & r, n = 0;
                            for (r = r / 2 | 0; r; r >>>= 1) n++;
                            return 1 << n + 1 + i
                        }, b.prototype.conjugate = function (e, t, r) {
                            if (!(r <= 1)) for (var i = 0; i < r / 2; i++) {
                                var n = e[i];
                                e[i] = e[r - i - 1], e[r - i - 1] = n, n = t[i], t[i] = -t[r - i - 1], t[r - i - 1] = -n
                            }
                        }, b.prototype.normalize13b = function (e, t) {
                            for (var r = 0, i = 0; i < t / 2; i++) {
                                var n = 8192 * Math.round(e[2 * i + 1] / t) + Math.round(e[2 * i] / t) + r;
                                e[i] = 67108863 & n, r = n < 67108864 ? 0 : n / 67108864 | 0
                            }
                            return e
                        }, b.prototype.convert13b = function (e, t, r, n) {
                            for (var o = 0, s = 0; s < t; s++) o += 0 | e[s], r[2 * s] = 8191 & o, o >>>= 13, r[2 * s + 1] = 8191 & o, o >>>= 13;
                            for (s = 2 * t; s < n; ++s) r[s] = 0;
                            i(0 === o), i(0 == (-8192 & o))
                        }, b.prototype.stub = function (e) {
                            for (var t = new Array(e), r = 0; r < e; r++) t[r] = 0;
                            return t
                        }, b.prototype.mulp = function (e, t, r) {
                            var i = 2 * this.guessLen13b(e.length, t.length), n = this.makeRBT(i), o = this.stub(i),
                                s = new Array(i), a = new Array(i), f = new Array(i), c = new Array(i),
                                u = new Array(i), h = new Array(i), d = r.words;
                            d.length = i, this.convert13b(e.words, e.length, s, i), this.convert13b(t.words, t.length, c, i), this.transform(s, o, a, f, i, n), this.transform(c, o, u, h, i, n);
                            for (var l = 0; l < i; l++) {
                                var p = a[l] * u[l] - f[l] * h[l];
                                f[l] = a[l] * h[l] + f[l] * u[l], a[l] = p
                            }
                            return this.conjugate(a, f, i), this.transform(a, f, d, o, i, n), this.conjugate(d, o, i), this.normalize13b(d, i), r.negative = e.negative ^ t.negative, r.length = e.length + t.length, r.strip()
                        }, o.prototype.mul = function (e) {
                            var t = new o(null);
                            return t.words = new Array(this.length + e.length), this.mulTo(e, t)
                        }, o.prototype.mulf = function (e) {
                            var t = new o(null);
                            return t.words = new Array(this.length + e.length), p(this, e, t)
                        }, o.prototype.imul = function (e) {
                            return this.clone().mulTo(e, this)
                        }, o.prototype.imuln = function (e) {
                            i("number" == typeof e), i(e < 67108864);
                            for (var t = 0, r = 0; r < this.length; r++) {
                                var n = (0 | this.words[r]) * e, o = (67108863 & n) + (67108863 & t);
                                t >>= 26, t += n / 67108864 | 0, t += o >>> 26, this.words[r] = 67108863 & o
                            }
                            return 0 !== t && (this.words[r] = t, this.length++), this
                        }, o.prototype.muln = function (e) {
                            return this.clone().imuln(e)
                        }, o.prototype.sqr = function () {
                            return this.mul(this)
                        }, o.prototype.isqr = function () {
                            return this.imul(this.clone())
                        }, o.prototype.pow = function (e) {
                            var t = function (e) {
                                for (var t = new Array(e.bitLength()), r = 0; r < t.length; r++) {
                                    var i = r / 26 | 0, n = r % 26;
                                    t[r] = (e.words[i] & 1 << n) >>> n
                                }
                                return t
                            }(e);
                            if (0 === t.length) return new o(1);
                            for (var r = this, i = 0; i < t.length && 0 === t[i]; i++, r = r.sqr()) ;
                            if (++i < t.length) for (var n = r.sqr(); i < t.length; i++, n = n.sqr()) 0 !== t[i] && (r = r.mul(n));
                            return r
                        }, o.prototype.iushln = function (e) {
                            i("number" == typeof e && e >= 0);
                            var t, r = e % 26, n = (e - r) / 26, o = 67108863 >>> 26 - r << 26 - r;
                            if (0 !== r) {
                                var s = 0;
                                for (t = 0; t < this.length; t++) {
                                    var a = this.words[t] & o, f = (0 | this.words[t]) - a << r;
                                    this.words[t] = f | s, s = a >>> 26 - r
                                }
                                s && (this.words[t] = s, this.length++)
                            }
                            if (0 !== n) {
                                for (t = this.length - 1; t >= 0; t--) this.words[t + n] = this.words[t];
                                for (t = 0; t < n; t++) this.words[t] = 0;
                                this.length += n
                            }
                            return this.strip()
                        }, o.prototype.ishln = function (e) {
                            return i(0 === this.negative), this.iushln(e)
                        }, o.prototype.iushrn = function (e, t, r) {
                            var n;
                            i("number" == typeof e && e >= 0), n = t ? (t - t % 26) / 26 : 0;
                            var o = e % 26, s = Math.min((e - o) / 26, this.length), a = 67108863 ^ 67108863 >>> o << o,
                                f = r;
                            if (n -= s, n = Math.max(0, n), f) {
                                for (var c = 0; c < s; c++) f.words[c] = this.words[c];
                                f.length = s
                            }
                            if (0 === s) ; else if (this.length > s) for (this.length -= s, c = 0; c < this.length; c++) this.words[c] = this.words[c + s]; else this.words[0] = 0, this.length = 1;
                            var u = 0;
                            for (c = this.length - 1; c >= 0 && (0 !== u || c >= n); c--) {
                                var h = 0 | this.words[c];
                                this.words[c] = u << 26 - o | h >>> o, u = h & a
                            }
                            return f && 0 !== u && (f.words[f.length++] = u), 0 === this.length && (this.words[0] = 0, this.length = 1), this.strip()
                        }, o.prototype.ishrn = function (e, t, r) {
                            return i(0 === this.negative), this.iushrn(e, t, r)
                        }, o.prototype.shln = function (e) {
                            return this.clone().ishln(e)
                        }, o.prototype.ushln = function (e) {
                            return this.clone().iushln(e)
                        }, o.prototype.shrn = function (e) {
                            return this.clone().ishrn(e)
                        }, o.prototype.ushrn = function (e) {
                            return this.clone().iushrn(e)
                        }, o.prototype.testn = function (e) {
                            i("number" == typeof e && e >= 0);
                            var t = e % 26, r = (e - t) / 26, n = 1 << t;
                            return !(this.length <= r || !(this.words[r] & n))
                        }, o.prototype.imaskn = function (e) {
                            i("number" == typeof e && e >= 0);
                            var t = e % 26, r = (e - t) / 26;
                            if (i(0 === this.negative, "imaskn works only with positive numbers"), this.length <= r) return this;
                            if (0 !== t && r++, this.length = Math.min(r, this.length), 0 !== t) {
                                var n = 67108863 ^ 67108863 >>> t << t;
                                this.words[this.length - 1] &= n
                            }
                            return this.strip()
                        }, o.prototype.maskn = function (e) {
                            return this.clone().imaskn(e)
                        }, o.prototype.iaddn = function (e) {
                            return i("number" == typeof e), i(e < 67108864), e < 0 ? this.isubn(-e) : 0 !== this.negative ? 1 === this.length && (0 | this.words[0]) < e ? (this.words[0] = e - (0 | this.words[0]), this.negative = 0, this) : (this.negative = 0, this.isubn(e), this.negative = 1, this) : this._iaddn(e)
                        }, o.prototype._iaddn = function (e) {
                            this.words[0] += e;
                            for (var t = 0; t < this.length && this.words[t] >= 67108864; t++) this.words[t] -= 67108864, t === this.length - 1 ? this.words[t + 1] = 1 : this.words[t + 1]++;
                            return this.length = Math.max(this.length, t + 1), this
                        }, o.prototype.isubn = function (e) {
                            if (i("number" == typeof e), i(e < 67108864), e < 0) return this.iaddn(-e);
                            if (0 !== this.negative) return this.negative = 0, this.iaddn(e), this.negative = 1, this;
                            if (this.words[0] -= e, 1 === this.length && this.words[0] < 0) this.words[0] = -this.words[0], this.negative = 1; else for (var t = 0; t < this.length && this.words[t] < 0; t++) this.words[t] += 67108864, this.words[t + 1] -= 1;
                            return this.strip()
                        }, o.prototype.addn = function (e) {
                            return this.clone().iaddn(e)
                        }, o.prototype.subn = function (e) {
                            return this.clone().isubn(e)
                        }, o.prototype.iabs = function () {
                            return this.negative = 0, this
                        }, o.prototype.abs = function () {
                            return this.clone().iabs()
                        }, o.prototype._ishlnsubmul = function (e, t, r) {
                            var n, o, s = e.length + r;
                            this._expand(s);
                            var a = 0;
                            for (n = 0; n < e.length; n++) {
                                o = (0 | this.words[n + r]) + a;
                                var f = (0 | e.words[n]) * t;
                                a = ((o -= 67108863 & f) >> 26) - (f / 67108864 | 0), this.words[n + r] = 67108863 & o
                            }
                            for (; n < this.length - r; n++) a = (o = (0 | this.words[n + r]) + a) >> 26, this.words[n + r] = 67108863 & o;
                            if (0 === a) return this.strip();
                            for (i(-1 === a), a = 0, n = 0; n < this.length; n++) a = (o = -(0 | this.words[n]) + a) >> 26, this.words[n] = 67108863 & o;
                            return this.negative = 1, this.strip()
                        }, o.prototype._wordDiv = function (e, t) {
                            var r = (this.length, e.length), i = this.clone(), n = e, s = 0 | n.words[n.length - 1];
                            0 != (r = 26 - this._countBits(s)) && (n = n.ushln(r), i.iushln(r), s = 0 | n.words[n.length - 1]);
                            var a, f = i.length - n.length;
                            if ("mod" !== t) {
                                (a = new o(null)).length = f + 1, a.words = new Array(a.length);
                                for (var c = 0; c < a.length; c++) a.words[c] = 0
                            }
                            var u = i.clone()._ishlnsubmul(n, 1, f);
                            0 === u.negative && (i = u, a && (a.words[f] = 1));
                            for (var h = f - 1; h >= 0; h--) {
                                var d = 67108864 * (0 | i.words[n.length + h]) + (0 | i.words[n.length + h - 1]);
                                for (d = Math.min(d / s | 0, 67108863), i._ishlnsubmul(n, d, h); 0 !== i.negative;) d--, i.negative = 0, i._ishlnsubmul(n, 1, h), i.isZero() || (i.negative ^= 1);
                                a && (a.words[h] = d)
                            }
                            return a && a.strip(), i.strip(), "div" !== t && 0 !== r && i.iushrn(r), {
                                div: a || null,
                                mod: i
                            }
                        }, o.prototype.divmod = function (e, t, r) {
                            return i(!e.isZero()), this.isZero() ? {
                                div: new o(0),
                                mod: new o(0)
                            } : 0 !== this.negative && 0 === e.negative ? (a = this.neg().divmod(e, t), "mod" !== t && (n = a.div.neg()), "div" !== t && (s = a.mod.neg(), r && 0 !== s.negative && s.iadd(e)), {
                                div: n,
                                mod: s
                            }) : 0 === this.negative && 0 !== e.negative ? (a = this.divmod(e.neg(), t), "mod" !== t && (n = a.div.neg()), {
                                div: n,
                                mod: a.mod
                            }) : 0 != (this.negative & e.negative) ? (a = this.neg().divmod(e.neg(), t), "div" !== t && (s = a.mod.neg(), r && 0 !== s.negative && s.isub(e)), {
                                div: a.div,
                                mod: s
                            }) : e.length > this.length || this.cmp(e) < 0 ? {
                                div: new o(0),
                                mod: this
                            } : 1 === e.length ? "div" === t ? {
                                div: this.divn(e.words[0]),
                                mod: null
                            } : "mod" === t ? {
                                div: null,
                                mod: new o(this.modn(e.words[0]))
                            } : {div: this.divn(e.words[0]), mod: new o(this.modn(e.words[0]))} : this._wordDiv(e, t);
                            var n, s, a
                        }, o.prototype.div = function (e) {
                            return this.divmod(e, "div", !1).div
                        }, o.prototype.mod = function (e) {
                            return this.divmod(e, "mod", !1).mod
                        }, o.prototype.umod = function (e) {
                            return this.divmod(e, "mod", !0).mod
                        }, o.prototype.divRound = function (e) {
                            var t = this.divmod(e);
                            if (t.mod.isZero()) return t.div;
                            var r = 0 !== t.div.negative ? t.mod.isub(e) : t.mod, i = e.ushrn(1), n = e.andln(1),
                                o = r.cmp(i);
                            return o < 0 || 1 === n && 0 === o ? t.div : 0 !== t.div.negative ? t.div.isubn(1) : t.div.iaddn(1)
                        }, o.prototype.modn = function (e) {
                            i(e <= 67108863);
                            for (var t = (1 << 26) % e, r = 0, n = this.length - 1; n >= 0; n--) r = (t * r + (0 | this.words[n])) % e;
                            return r
                        }, o.prototype.idivn = function (e) {
                            i(e <= 67108863);
                            for (var t = 0, r = this.length - 1; r >= 0; r--) {
                                var n = (0 | this.words[r]) + 67108864 * t;
                                this.words[r] = n / e | 0, t = n % e
                            }
                            return this.strip()
                        }, o.prototype.divn = function (e) {
                            return this.clone().idivn(e)
                        }, o.prototype.egcd = function (e) {
                            i(0 === e.negative), i(!e.isZero());
                            var t = this, r = e.clone();
                            t = 0 !== t.negative ? t.umod(e) : t.clone();
                            for (var n = new o(1), s = new o(0), a = new o(0), f = new o(1), c = 0; t.isEven() && r.isEven();) t.iushrn(1), r.iushrn(1), ++c;
                            for (var u = r.clone(), h = t.clone(); !t.isZero();) {
                                for (var d = 0, l = 1; 0 == (t.words[0] & l) && d < 26; ++d, l <<= 1) ;
                                if (d > 0) for (t.iushrn(d); d-- > 0;) (n.isOdd() || s.isOdd()) && (n.iadd(u), s.isub(h)), n.iushrn(1), s.iushrn(1);
                                for (var p = 0, b = 1; 0 == (r.words[0] & b) && p < 26; ++p, b <<= 1) ;
                                if (p > 0) for (r.iushrn(p); p-- > 0;) (a.isOdd() || f.isOdd()) && (a.iadd(u), f.isub(h)), a.iushrn(1), f.iushrn(1);
                                t.cmp(r) >= 0 ? (t.isub(r), n.isub(a), s.isub(f)) : (r.isub(t), a.isub(n), f.isub(s))
                            }
                            return {a: a, b: f, gcd: r.iushln(c)}
                        }, o.prototype._invmp = function (e) {
                            i(0 === e.negative), i(!e.isZero());
                            var t = this, r = e.clone();
                            t = 0 !== t.negative ? t.umod(e) : t.clone();
                            for (var n, s = new o(1), a = new o(0), f = r.clone(); t.cmpn(1) > 0 && r.cmpn(1) > 0;) {
                                for (var c = 0, u = 1; 0 == (t.words[0] & u) && c < 26; ++c, u <<= 1) ;
                                if (c > 0) for (t.iushrn(c); c-- > 0;) s.isOdd() && s.iadd(f), s.iushrn(1);
                                for (var h = 0, d = 1; 0 == (r.words[0] & d) && h < 26; ++h, d <<= 1) ;
                                if (h > 0) for (r.iushrn(h); h-- > 0;) a.isOdd() && a.iadd(f), a.iushrn(1);
                                t.cmp(r) >= 0 ? (t.isub(r), s.isub(a)) : (r.isub(t), a.isub(s))
                            }
                            return (n = 0 === t.cmpn(1) ? s : a).cmpn(0) < 0 && n.iadd(e), n
                        }, o.prototype.gcd = function (e) {
                            if (this.isZero()) return e.abs();
                            if (e.isZero()) return this.abs();
                            var t = this.clone(), r = e.clone();
                            t.negative = 0, r.negative = 0;
                            for (var i = 0; t.isEven() && r.isEven(); i++) t.iushrn(1), r.iushrn(1);
                            for (; ;) {
                                for (; t.isEven();) t.iushrn(1);
                                for (; r.isEven();) r.iushrn(1);
                                var n = t.cmp(r);
                                if (n < 0) {
                                    var o = t;
                                    t = r, r = o
                                } else if (0 === n || 0 === r.cmpn(1)) break;
                                t.isub(r)
                            }
                            return r.iushln(i)
                        }, o.prototype.invm = function (e) {
                            return this.egcd(e).a.umod(e)
                        }, o.prototype.isEven = function () {
                            return 0 == (1 & this.words[0])
                        }, o.prototype.isOdd = function () {
                            return 1 == (1 & this.words[0])
                        }, o.prototype.andln = function (e) {
                            return this.words[0] & e
                        }, o.prototype.bincn = function (e) {
                            i("number" == typeof e);
                            var t = e % 26, r = (e - t) / 26, n = 1 << t;
                            if (this.length <= r) return this._expand(r + 1), this.words[r] |= n, this;
                            for (var o = n, s = r; 0 !== o && s < this.length; s++) {
                                var a = 0 | this.words[s];
                                o = (a += o) >>> 26, a &= 67108863, this.words[s] = a
                            }
                            return 0 !== o && (this.words[s] = o, this.length++), this
                        }, o.prototype.isZero = function () {
                            return 1 === this.length && 0 === this.words[0]
                        }, o.prototype.cmpn = function (e) {
                            var t, r = e < 0;
                            if (0 !== this.negative && !r) return -1;
                            if (0 === this.negative && r) return 1;
                            if (this.strip(), this.length > 1) t = 1; else {
                                r && (e = -e), i(e <= 67108863, "Number is too big");
                                var n = 0 | this.words[0];
                                t = n === e ? 0 : n < e ? -1 : 1
                            }
                            return 0 !== this.negative ? 0 | -t : t
                        }, o.prototype.cmp = function (e) {
                            if (0 !== this.negative && 0 === e.negative) return -1;
                            if (0 === this.negative && 0 !== e.negative) return 1;
                            var t = this.ucmp(e);
                            return 0 !== this.negative ? 0 | -t : t
                        }, o.prototype.ucmp = function (e) {
                            if (this.length > e.length) return 1;
                            if (this.length < e.length) return -1;
                            for (var t = 0, r = this.length - 1; r >= 0; r--) {
                                var i = 0 | this.words[r], n = 0 | e.words[r];
                                if (i !== n) {
                                    i < n ? t = -1 : i > n && (t = 1);
                                    break
                                }
                            }
                            return t
                        }, o.prototype.gtn = function (e) {
                            return 1 === this.cmpn(e)
                        }, o.prototype.gt = function (e) {
                            return 1 === this.cmp(e)
                        }, o.prototype.gten = function (e) {
                            return this.cmpn(e) >= 0
                        }, o.prototype.gte = function (e) {
                            return this.cmp(e) >= 0
                        }, o.prototype.ltn = function (e) {
                            return -1 === this.cmpn(e)
                        }, o.prototype.lt = function (e) {
                            return -1 === this.cmp(e)
                        }, o.prototype.lten = function (e) {
                            return this.cmpn(e) <= 0
                        }, o.prototype.lte = function (e) {
                            return this.cmp(e) <= 0
                        }, o.prototype.eqn = function (e) {
                            return 0 === this.cmpn(e)
                        }, o.prototype.eq = function (e) {
                            return 0 === this.cmp(e)
                        }, o.red = function (e) {
                            return new S(e)
                        }, o.prototype.toRed = function (e) {
                            return i(!this.red, "Already a number in reduction context"), i(0 === this.negative, "red works only with positives"), e.convertTo(this)._forceRed(e)
                        }, o.prototype.fromRed = function () {
                            return i(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this)
                        }, o.prototype._forceRed = function (e) {
                            return this.red = e, this
                        }, o.prototype.forceRed = function (e) {
                            return i(!this.red, "Already a number in reduction context"), this._forceRed(e)
                        }, o.prototype.redAdd = function (e) {
                            return i(this.red, "redAdd works only with red numbers"), this.red.add(this, e)
                        }, o.prototype.redIAdd = function (e) {
                            return i(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, e)
                        }, o.prototype.redSub = function (e) {
                            return i(this.red, "redSub works only with red numbers"), this.red.sub(this, e)
                        }, o.prototype.redISub = function (e) {
                            return i(this.red, "redISub works only with red numbers"), this.red.isub(this, e)
                        }, o.prototype.redShl = function (e) {
                            return i(this.red, "redShl works only with red numbers"), this.red.shl(this, e)
                        }, o.prototype.redMul = function (e) {
                            return i(this.red, "redMul works only with red numbers"), this.red._verify2(this, e), this.red.mul(this, e)
                        }, o.prototype.redIMul = function (e) {
                            return i(this.red, "redMul works only with red numbers"), this.red._verify2(this, e), this.red.imul(this, e)
                        }, o.prototype.redSqr = function () {
                            return i(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this)
                        }, o.prototype.redISqr = function () {
                            return i(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this)
                        }, o.prototype.redSqrt = function () {
                            return i(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this)
                        }, o.prototype.redInvm = function () {
                            return i(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this)
                        }, o.prototype.redNeg = function () {
                            return i(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this)
                        }, o.prototype.redPow = function (e) {
                            return i(this.red && !e.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, e)
                        };
                        var y = {k256: null, p224: null, p192: null, p25519: null};

                        function v(e, t) {
                            this.name = e, this.p = new o(t, 16), this.n = this.p.bitLength(), this.k = new o(1).iushln(this.n).isub(this.p), this.tmp = this._tmp()
                        }

                        function m() {
                            v.call(this, "k256", "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f")
                        }

                        function g() {
                            v.call(this, "p224", "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001")
                        }

                        function w() {
                            v.call(this, "p192", "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff")
                        }

                        function _() {
                            v.call(this, "25519", "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed")
                        }

                        function S(e) {
                            if ("string" == typeof e) {
                                var t = o._prime(e);
                                this.m = t.p, this.prime = t
                            } else i(e.gtn(1), "modulus must be greater than 1"), this.m = e, this.prime = null
                        }

                        function k(e) {
                            S.call(this, e), this.shift = this.m.bitLength(), this.shift % 26 != 0 && (this.shift += 26 - this.shift % 26), this.r = new o(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv)
                        }

                        v.prototype._tmp = function () {
                            var e = new o(null);
                            return e.words = new Array(Math.ceil(this.n / 13)), e
                        }, v.prototype.ireduce = function (e) {
                            var t, r = e;
                            do {
                                this.split(r, this.tmp), t = (r = (r = this.imulK(r)).iadd(this.tmp)).bitLength()
                            } while (t > this.n);
                            var i = t < this.n ? -1 : r.ucmp(this.p);
                            return 0 === i ? (r.words[0] = 0, r.length = 1) : i > 0 ? r.isub(this.p) : r.strip(), r
                        }, v.prototype.split = function (e, t) {
                            e.iushrn(this.n, 0, t)
                        }, v.prototype.imulK = function (e) {
                            return e.imul(this.k)
                        }, n(m, v), m.prototype.split = function (e, t) {
                            for (var r = Math.min(e.length, 9), i = 0; i < r; i++) t.words[i] = e.words[i];
                            if (t.length = r, e.length <= 9) return e.words[0] = 0, void(e.length = 1);
                            var n = e.words[9];
                            for (t.words[t.length++] = 4194303 & n, i = 10; i < e.length; i++) {
                                var o = 0 | e.words[i];
                                e.words[i - 10] = (4194303 & o) << 4 | n >>> 22, n = o
                            }
                            n >>>= 22, e.words[i - 10] = n, 0 === n && e.length > 10 ? e.length -= 10 : e.length -= 9
                        }, m.prototype.imulK = function (e) {
                            e.words[e.length] = 0, e.words[e.length + 1] = 0, e.length += 2;
                            for (var t = 0, r = 0; r < e.length; r++) {
                                var i = 0 | e.words[r];
                                t += 977 * i, e.words[r] = 67108863 & t, t = 64 * i + (t / 67108864 | 0)
                            }
                            return 0 === e.words[e.length - 1] && (e.length--, 0 === e.words[e.length - 1] && e.length--), e
                        }, n(g, v), n(w, v), n(_, v), _.prototype.imulK = function (e) {
                            for (var t = 0, r = 0; r < e.length; r++) {
                                var i = 19 * (0 | e.words[r]) + t, n = 67108863 & i;
                                i >>>= 26, e.words[r] = n, t = i
                            }
                            return 0 !== t && (e.words[e.length++] = t), e
                        }, o._prime = function (e) {
                            if (y[e]) return y[e];
                            var t;
                            if ("k256" === e) t = new m; else if ("p224" === e) t = new g; else if ("p192" === e) t = new w; else {
                                if ("p25519" !== e) throw new Error("Unknown prime " + e);
                                t = new _
                            }
                            return y[e] = t, t
                        }, S.prototype._verify1 = function (e) {
                            i(0 === e.negative, "red works only with positives"), i(e.red, "red works only with red numbers")
                        }, S.prototype._verify2 = function (e, t) {
                            i(0 == (e.negative | t.negative), "red works only with positives"), i(e.red && e.red === t.red, "red works only with red numbers")
                        }, S.prototype.imod = function (e) {
                            return this.prime ? this.prime.ireduce(e)._forceRed(this) : e.umod(this.m)._forceRed(this)
                        }, S.prototype.neg = function (e) {
                            return e.isZero() ? e.clone() : this.m.sub(e)._forceRed(this)
                        }, S.prototype.add = function (e, t) {
                            this._verify2(e, t);
                            var r = e.add(t);
                            return r.cmp(this.m) >= 0 && r.isub(this.m), r._forceRed(this)
                        }, S.prototype.iadd = function (e, t) {
                            this._verify2(e, t);
                            var r = e.iadd(t);
                            return r.cmp(this.m) >= 0 && r.isub(this.m), r
                        }, S.prototype.sub = function (e, t) {
                            this._verify2(e, t);
                            var r = e.sub(t);
                            return r.cmpn(0) < 0 && r.iadd(this.m), r._forceRed(this)
                        }, S.prototype.isub = function (e, t) {
                            this._verify2(e, t);
                            var r = e.isub(t);
                            return r.cmpn(0) < 0 && r.iadd(this.m), r
                        }, S.prototype.shl = function (e, t) {
                            return this._verify1(e), this.imod(e.ushln(t))
                        }, S.prototype.imul = function (e, t) {
                            return this._verify2(e, t), this.imod(e.imul(t))
                        }, S.prototype.mul = function (e, t) {
                            return this._verify2(e, t), this.imod(e.mul(t))
                        }, S.prototype.isqr = function (e) {
                            return this.imul(e, e.clone())
                        }, S.prototype.sqr = function (e) {
                            return this.mul(e, e)
                        }, S.prototype.sqrt = function (e) {
                            if (e.isZero()) return e.clone();
                            var t = this.m.andln(3);
                            if (i(t % 2 == 1), 3 === t) {
                                var r = this.m.add(new o(1)).iushrn(2);
                                return this.pow(e, r)
                            }
                            for (var n = this.m.subn(1), s = 0; !n.isZero() && 0 === n.andln(1);) s++, n.iushrn(1);
                            i(!n.isZero());
                            var a = new o(1).toRed(this), f = a.redNeg(), c = this.m.subn(1).iushrn(1),
                                u = this.m.bitLength();
                            for (u = new o(2 * u * u).toRed(this); 0 !== this.pow(u, c).cmp(f);) u.redIAdd(f);
                            for (var h = this.pow(u, n), d = this.pow(e, n.addn(1).iushrn(1)), l = this.pow(e, n), p = s; 0 !== l.cmp(a);) {
                                for (var b = l, y = 0; 0 !== b.cmp(a); y++) b = b.redSqr();
                                i(y < p);
                                var v = this.pow(h, new o(1).iushln(p - y - 1));
                                d = d.redMul(v), h = v.redSqr(), l = l.redMul(h), p = y
                            }
                            return d
                        }, S.prototype.invm = function (e) {
                            var t = e._invmp(this.m);
                            return 0 !== t.negative ? (t.negative = 0, this.imod(t).redNeg()) : this.imod(t)
                        }, S.prototype.pow = function (e, t) {
                            if (t.isZero()) return new o(1).toRed(this);
                            if (0 === t.cmpn(1)) return e.clone();
                            var r = new Array(16);
                            r[0] = new o(1).toRed(this), r[1] = e;
                            for (var i = 2; i < r.length; i++) r[i] = this.mul(r[i - 1], e);
                            var n = r[0], s = 0, a = 0, f = t.bitLength() % 26;
                            for (0 === f && (f = 26), i = t.length - 1; i >= 0; i--) {
                                for (var c = t.words[i], u = f - 1; u >= 0; u--) {
                                    var h = c >> u & 1;
                                    n !== r[0] && (n = this.sqr(n)), 0 !== h || 0 !== s ? (s <<= 1, s |= h, (4 == ++a || 0 === i && 0 === u) && (n = this.mul(n, r[s]), a = 0, s = 0)) : a = 0
                                }
                                f = 26
                            }
                            return n
                        }, S.prototype.convertTo = function (e) {
                            var t = e.umod(this.m);
                            return t === e ? t.clone() : t
                        }, S.prototype.convertFrom = function (e) {
                            var t = e.clone();
                            return t.red = null, t
                        }, o.mont = function (e) {
                            return new k(e)
                        }, n(k, S), k.prototype.convertTo = function (e) {
                            return this.imod(e.ushln(this.shift))
                        }, k.prototype.convertFrom = function (e) {
                            var t = this.imod(e.mul(this.rinv));
                            return t.red = null, t
                        }, k.prototype.imul = function (e, t) {
                            if (e.isZero() || t.isZero()) return e.words[0] = 0, e.length = 1, e;
                            var r = e.imul(t), i = r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),
                                n = r.isub(i).iushrn(this.shift), o = n;
                            return n.cmp(this.m) >= 0 ? o = n.isub(this.m) : n.cmpn(0) < 0 && (o = n.iadd(this.m)), o._forceRed(this)
                        }, k.prototype.mul = function (e, t) {
                            if (e.isZero() || t.isZero()) return new o(0)._forceRed(this);
                            var r = e.mul(t), i = r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),
                                n = r.isub(i).iushrn(this.shift), s = n;
                            return n.cmp(this.m) >= 0 ? s = n.isub(this.m) : n.cmpn(0) < 0 && (s = n.iadd(this.m)), s._forceRed(this)
                        }, k.prototype.invm = function (e) {
                            return this.imod(e._invmp(this.m).mul(this.r2))._forceRed(this)
                        }
                    }(void 0 === e || e, this)
                }).call(t, r(82)(e))
            }, function (e, t, r) {
                "use strict";
                (function (e) {
                    var i = r(84), n = r(85), o = r(41);

                    function s() {
                        return f.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823
                    }

                    function a(e, t) {
                        if (s() < t) throw new RangeError("Invalid typed array length");
                        return f.TYPED_ARRAY_SUPPORT ? (e = new Uint8Array(t)).__proto__ = f.prototype : (null === e && (e = new f(t)), e.length = t), e
                    }

                    function f(e, t, r) {
                        if (!(f.TYPED_ARRAY_SUPPORT || this instanceof f)) return new f(e, t, r);
                        if ("number" == typeof e) {
                            if ("string" == typeof t) throw new Error("If encoding is specified then the first argument must be a string");
                            return h(this, e)
                        }
                        return c(this, e, t, r)
                    }

                    function c(e, t, r, i) {
                        if ("number" == typeof t) throw new TypeError('"value" argument must not be a number');
                        return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer ? function (e, t, r, i) {
                            if (t.byteLength, r < 0 || t.byteLength < r) throw new RangeError("'offset' is out of bounds");
                            if (t.byteLength < r + (i || 0)) throw new RangeError("'length' is out of bounds");
                            return t = void 0 === r && void 0 === i ? new Uint8Array(t) : void 0 === i ? new Uint8Array(t, r) : new Uint8Array(t, r, i), f.TYPED_ARRAY_SUPPORT ? (e = t).__proto__ = f.prototype : e = d(e, t), e
                        }(e, t, r, i) : "string" == typeof t ? function (e, t, r) {
                            if ("string" == typeof r && "" !== r || (r = "utf8"), !f.isEncoding(r)) throw new TypeError('"encoding" must be a valid string encoding');
                            var i = 0 | p(t, r), n = (e = a(e, i)).write(t, r);
                            return n !== i && (e = e.slice(0, n)), e
                        }(e, t, r) : function (e, t) {
                            if (f.isBuffer(t)) {
                                var r = 0 | l(t.length);
                                return 0 === (e = a(e, r)).length ? e : (t.copy(e, 0, 0, r), e)
                            }
                            if (t) {
                                if ("undefined" != typeof ArrayBuffer && t.buffer instanceof ArrayBuffer || "length" in t) return "number" != typeof t.length || (i = t.length) != i ? a(e, 0) : d(e, t);
                                if ("Buffer" === t.type && o(t.data)) return d(e, t.data)
                            }
                            var i;
                            throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")
                        }(e, t)
                    }

                    function u(e) {
                        if ("number" != typeof e) throw new TypeError('"size" argument must be a number');
                        if (e < 0) throw new RangeError('"size" argument must not be negative')
                    }

                    function h(e, t) {
                        if (u(t), e = a(e, t < 0 ? 0 : 0 | l(t)), !f.TYPED_ARRAY_SUPPORT) for (var r = 0; r < t; ++r) e[r] = 0;
                        return e
                    }

                    function d(e, t) {
                        var r = t.length < 0 ? 0 : 0 | l(t.length);
                        e = a(e, r);
                        for (var i = 0; i < r; i += 1) e[i] = 255 & t[i];
                        return e
                    }

                    function l(e) {
                        if (e >= s()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + s().toString(16) + " bytes");
                        return 0 | e
                    }

                    function p(e, t) {
                        if (f.isBuffer(e)) return e.length;
                        if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)) return e.byteLength;
                        "string" != typeof e && (e = "" + e);
                        var r = e.length;
                        if (0 === r) return 0;
                        for (var i = !1; ;) switch (t) {
                            case"ascii":
                            case"latin1":
                            case"binary":
                                return r;
                            case"utf8":
                            case"utf-8":
                            case void 0:
                                return L(e).length;
                            case"ucs2":
                            case"ucs-2":
                            case"utf16le":
                            case"utf-16le":
                                return 2 * r;
                            case"hex":
                                return r >>> 1;
                            case"base64":
                                return z(e).length;
                            default:
                                if (i) return L(e).length;
                                t = ("" + t).toLowerCase(), i = !0
                        }
                    }

                    function b(e, t, r) {
                        var i = e[t];
                        e[t] = e[r], e[r] = i
                    }

                    function y(e, t, r, i, n) {
                        if (0 === e.length) return -1;
                        if ("string" == typeof r ? (i = r, r = 0) : r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648), r = +r, isNaN(r) && (r = n ? 0 : e.length - 1), r < 0 && (r = e.length + r), r >= e.length) {
                            if (n) return -1;
                            r = e.length - 1
                        } else if (r < 0) {
                            if (!n) return -1;
                            r = 0
                        }
                        if ("string" == typeof t && (t = f.from(t, i)), f.isBuffer(t)) return 0 === t.length ? -1 : v(e, t, r, i, n);
                        if ("number" == typeof t) return t &= 255, f.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? n ? Uint8Array.prototype.indexOf.call(e, t, r) : Uint8Array.prototype.lastIndexOf.call(e, t, r) : v(e, [t], r, i, n);
                        throw new TypeError("val must be string, number or Buffer")
                    }

                    function v(e, t, r, i, n) {
                        var o, s = 1, a = e.length, f = t.length;
                        if (void 0 !== i && ("ucs2" === (i = String(i).toLowerCase()) || "ucs-2" === i || "utf16le" === i || "utf-16le" === i)) {
                            if (e.length < 2 || t.length < 2) return -1;
                            s = 2, a /= 2, f /= 2, r /= 2
                        }

                        function c(e, t) {
                            return 1 === s ? e[t] : e.readUInt16BE(t * s)
                        }

                        if (n) {
                            var u = -1;
                            for (o = r; o < a; o++) if (c(e, o) === c(t, -1 === u ? 0 : o - u)) {
                                if (-1 === u && (u = o), o - u + 1 === f) return u * s
                            } else -1 !== u && (o -= o - u), u = -1
                        } else for (r + f > a && (r = a - f), o = r; o >= 0; o--) {
                            for (var h = !0, d = 0; d < f; d++) if (c(e, o + d) !== c(t, d)) {
                                h = !1;
                                break
                            }
                            if (h) return o
                        }
                        return -1
                    }

                    function m(e, t, r, i) {
                        r = Number(r) || 0;
                        var n = e.length - r;
                        i ? (i = Number(i)) > n && (i = n) : i = n;
                        var o = t.length;
                        if (o % 2 != 0) throw new TypeError("Invalid hex string");
                        i > o / 2 && (i = o / 2);
                        for (var s = 0; s < i; ++s) {
                            var a = parseInt(t.substr(2 * s, 2), 16);
                            if (isNaN(a)) return s;
                            e[r + s] = a
                        }
                        return s
                    }

                    function g(e, t, r, i) {
                        return F(L(t, e.length - r), e, r, i)
                    }

                    function w(e, t, r, i) {
                        return F(function (e) {
                            for (var t = [], r = 0; r < e.length; ++r) t.push(255 & e.charCodeAt(r));
                            return t
                        }(t), e, r, i)
                    }

                    function _(e, t, r, i) {
                        return w(e, t, r, i)
                    }

                    function S(e, t, r, i) {
                        return F(z(t), e, r, i)
                    }

                    function k(e, t, r, i) {
                        return F(function (e, t) {
                            for (var r, i, n, o = [], s = 0; s < e.length && !((t -= 2) < 0); ++s) i = (r = e.charCodeAt(s)) >> 8, n = r % 256, o.push(n), o.push(i);
                            return o
                        }(t, e.length - r), e, r, i)
                    }

                    function A(e, t, r) {
                        return 0 === t && r === e.length ? i.fromByteArray(e) : i.fromByteArray(e.slice(t, r))
                    }

                    function E(e, t, r) {
                        r = Math.min(e.length, r);
                        for (var i = [], n = t; n < r;) {
                            var o, s, a, f, c = e[n], u = null, h = c > 239 ? 4 : c > 223 ? 3 : c > 191 ? 2 : 1;
                            if (n + h <= r) switch (h) {
                                case 1:
                                    c < 128 && (u = c);
                                    break;
                                case 2:
                                    128 == (192 & (o = e[n + 1])) && (f = (31 & c) << 6 | 63 & o) > 127 && (u = f);
                                    break;
                                case 3:
                                    o = e[n + 1], s = e[n + 2], 128 == (192 & o) && 128 == (192 & s) && (f = (15 & c) << 12 | (63 & o) << 6 | 63 & s) > 2047 && (f < 55296 || f > 57343) && (u = f);
                                    break;
                                case 4:
                                    o = e[n + 1], s = e[n + 2], a = e[n + 3], 128 == (192 & o) && 128 == (192 & s) && 128 == (192 & a) && (f = (15 & c) << 18 | (63 & o) << 12 | (63 & s) << 6 | 63 & a) > 65535 && f < 1114112 && (u = f)
                            }
                            null === u ? (u = 65533, h = 1) : u > 65535 && (u -= 65536, i.push(u >>> 10 & 1023 | 55296), u = 56320 | 1023 & u), i.push(u), n += h
                        }
                        return function (e) {
                            var t = e.length;
                            if (t <= x) return String.fromCharCode.apply(String, e);
                            for (var r = "", i = 0; i < t;) r += String.fromCharCode.apply(String, e.slice(i, i += x));
                            return r
                        }(i)
                    }

                    t.Buffer = f, t.SlowBuffer = function (e) {
                        return +e != e && (e = 0), f.alloc(+e)
                    }, t.INSPECT_MAX_BYTES = 50, f.TYPED_ARRAY_SUPPORT = void 0 !== e.TYPED_ARRAY_SUPPORT ? e.TYPED_ARRAY_SUPPORT : function () {
                        try {
                            var e = new Uint8Array(1);
                            return e.__proto__ = {
                                __proto__: Uint8Array.prototype, foo: function () {
                                    return 42
                                }
                            }, 42 === e.foo() && "function" == typeof e.subarray && 0 === e.subarray(1, 1).byteLength
                        } catch (e) {
                            return !1
                        }
                    }(), t.kMaxLength = s(), f.poolSize = 8192, f._augment = function (e) {
                        return e.__proto__ = f.prototype, e
                    }, f.from = function (e, t, r) {
                        return c(null, e, t, r)
                    }, f.TYPED_ARRAY_SUPPORT && (f.prototype.__proto__ = Uint8Array.prototype, f.__proto__ = Uint8Array, "undefined" != typeof Symbol && Symbol.species && f[Symbol.species] === f && Object.defineProperty(f, Symbol.species, {
                        value: null,
                        configurable: !0
                    })), f.alloc = function (e, t, r) {
                        return function (e, t, r, i) {
                            return u(t), t <= 0 ? a(e, t) : void 0 !== r ? "string" == typeof i ? a(e, t).fill(r, i) : a(e, t).fill(r) : a(e, t)
                        }(null, e, t, r)
                    }, f.allocUnsafe = function (e) {
                        return h(null, e)
                    }, f.allocUnsafeSlow = function (e) {
                        return h(null, e)
                    }, f.isBuffer = function (e) {
                        return !(null == e || !e._isBuffer)
                    }, f.compare = function (e, t) {
                        if (!f.isBuffer(e) || !f.isBuffer(t)) throw new TypeError("Arguments must be Buffers");
                        if (e === t) return 0;
                        for (var r = e.length, i = t.length, n = 0, o = Math.min(r, i); n < o; ++n) if (e[n] !== t[n]) {
                            r = e[n], i = t[n];
                            break
                        }
                        return r < i ? -1 : i < r ? 1 : 0
                    }, f.isEncoding = function (e) {
                        switch (String(e).toLowerCase()) {
                            case"hex":
                            case"utf8":
                            case"utf-8":
                            case"ascii":
                            case"latin1":
                            case"binary":
                            case"base64":
                            case"ucs2":
                            case"ucs-2":
                            case"utf16le":
                            case"utf-16le":
                                return !0;
                            default:
                                return !1
                        }
                    }, f.concat = function (e, t) {
                        if (!o(e)) throw new TypeError('"list" argument must be an Array of Buffers');
                        if (0 === e.length) return f.alloc(0);
                        var r;
                        if (void 0 === t) for (t = 0, r = 0; r < e.length; ++r) t += e[r].length;
                        var i = f.allocUnsafe(t), n = 0;
                        for (r = 0; r < e.length; ++r) {
                            var s = e[r];
                            if (!f.isBuffer(s)) throw new TypeError('"list" argument must be an Array of Buffers');
                            s.copy(i, n), n += s.length
                        }
                        return i
                    }, f.byteLength = p, f.prototype._isBuffer = !0, f.prototype.swap16 = function () {
                        var e = this.length;
                        if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
                        for (var t = 0; t < e; t += 2) b(this, t, t + 1);
                        return this
                    }, f.prototype.swap32 = function () {
                        var e = this.length;
                        if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
                        for (var t = 0; t < e; t += 4) b(this, t, t + 3), b(this, t + 1, t + 2);
                        return this
                    }, f.prototype.swap64 = function () {
                        var e = this.length;
                        if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
                        for (var t = 0; t < e; t += 8) b(this, t, t + 7), b(this, t + 1, t + 6), b(this, t + 2, t + 5), b(this, t + 3, t + 4);
                        return this
                    }, f.prototype.toString = function () {
                        var e = 0 | this.length;
                        return 0 === e ? "" : 0 === arguments.length ? E(this, 0, e) : function (e, t, r) {
                            var i = !1;
                            if ((void 0 === t || t < 0) && (t = 0), t > this.length) return "";
                            if ((void 0 === r || r > this.length) && (r = this.length), r <= 0) return "";
                            if ((r >>>= 0) <= (t >>>= 0)) return "";
                            for (e || (e = "utf8"); ;) switch (e) {
                                case"hex":
                                    return R(this, t, r);
                                case"utf8":
                                case"utf-8":
                                    return E(this, t, r);
                                case"ascii":
                                    return M(this, t, r);
                                case"latin1":
                                case"binary":
                                    return B(this, t, r);
                                case"base64":
                                    return A(this, t, r);
                                case"ucs2":
                                case"ucs-2":
                                case"utf16le":
                                case"utf-16le":
                                    return I(this, t, r);
                                default:
                                    if (i) throw new TypeError("Unknown encoding: " + e);
                                    e = (e + "").toLowerCase(), i = !0
                            }
                        }.apply(this, arguments)
                    }, f.prototype.equals = function (e) {
                        if (!f.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
                        return this === e || 0 === f.compare(this, e)
                    }, f.prototype.inspect = function () {
                        var e = "", r = t.INSPECT_MAX_BYTES;
                        return this.length > 0 && (e = this.toString("hex", 0, r).match(/.{2}/g).join(" "), this.length > r && (e += " ... ")), "<Buffer " + e + ">"
                    }, f.prototype.compare = function (e, t, r, i, n) {
                        if (!f.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
                        if (void 0 === t && (t = 0), void 0 === r && (r = e ? e.length : 0), void 0 === i && (i = 0), void 0 === n && (n = this.length), t < 0 || r > e.length || i < 0 || n > this.length) throw new RangeError("out of range index");
                        if (i >= n && t >= r) return 0;
                        if (i >= n) return -1;
                        if (t >= r) return 1;
                        if (this === e) return 0;
                        for (var o = (n >>>= 0) - (i >>>= 0), s = (r >>>= 0) - (t >>>= 0), a = Math.min(o, s), c = this.slice(i, n), u = e.slice(t, r), h = 0; h < a; ++h) if (c[h] !== u[h]) {
                            o = c[h], s = u[h];
                            break
                        }
                        return o < s ? -1 : s < o ? 1 : 0
                    }, f.prototype.includes = function (e, t, r) {
                        return -1 !== this.indexOf(e, t, r)
                    }, f.prototype.indexOf = function (e, t, r) {
                        return y(this, e, t, r, !0)
                    }, f.prototype.lastIndexOf = function (e, t, r) {
                        return y(this, e, t, r, !1)
                    }, f.prototype.write = function (e, t, r, i) {
                        if (void 0 === t) i = "utf8", r = this.length, t = 0; else if (void 0 === r && "string" == typeof t) i = t, r = this.length, t = 0; else {
                            if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                            t |= 0, isFinite(r) ? (r |= 0, void 0 === i && (i = "utf8")) : (i = r, r = void 0)
                        }
                        var n = this.length - t;
                        if ((void 0 === r || r > n) && (r = n), e.length > 0 && (r < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
                        i || (i = "utf8");
                        for (var o = !1; ;) switch (i) {
                            case"hex":
                                return m(this, e, t, r);
                            case"utf8":
                            case"utf-8":
                                return g(this, e, t, r);
                            case"ascii":
                                return w(this, e, t, r);
                            case"latin1":
                            case"binary":
                                return _(this, e, t, r);
                            case"base64":
                                return S(this, e, t, r);
                            case"ucs2":
                            case"ucs-2":
                            case"utf16le":
                            case"utf-16le":
                                return k(this, e, t, r);
                            default:
                                if (o) throw new TypeError("Unknown encoding: " + i);
                                i = ("" + i).toLowerCase(), o = !0
                        }
                    }, f.prototype.toJSON = function () {
                        return {type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0)}
                    };
                    var x = 4096;

                    function M(e, t, r) {
                        var i = "";
                        r = Math.min(e.length, r);
                        for (var n = t; n < r; ++n) i += String.fromCharCode(127 & e[n]);
                        return i
                    }

                    function B(e, t, r) {
                        var i = "";
                        r = Math.min(e.length, r);
                        for (var n = t; n < r; ++n) i += String.fromCharCode(e[n]);
                        return i
                    }

                    function R(e, t, r) {
                        var i = e.length;
                        (!t || t < 0) && (t = 0), (!r || r < 0 || r > i) && (r = i);
                        for (var n = "", o = t; o < r; ++o) n += D(e[o]);
                        return n
                    }

                    function I(e, t, r) {
                        for (var i = e.slice(t, r), n = "", o = 0; o < i.length; o += 2) n += String.fromCharCode(i[o] + 256 * i[o + 1]);
                        return n
                    }

                    function T(e, t, r) {
                        if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
                        if (e + t > r) throw new RangeError("Trying to access beyond buffer length")
                    }

                    function j(e, t, r, i, n, o) {
                        if (!f.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
                        if (t > n || t < o) throw new RangeError('"value" argument is out of bounds');
                        if (r + i > e.length) throw new RangeError("Index out of range")
                    }

                    function O(e, t, r, i) {
                        t < 0 && (t = 65535 + t + 1);
                        for (var n = 0, o = Math.min(e.length - r, 2); n < o; ++n) e[r + n] = (t & 255 << 8 * (i ? n : 1 - n)) >>> 8 * (i ? n : 1 - n)
                    }

                    function P(e, t, r, i) {
                        t < 0 && (t = 4294967295 + t + 1);
                        for (var n = 0, o = Math.min(e.length - r, 4); n < o; ++n) e[r + n] = t >>> 8 * (i ? n : 3 - n) & 255
                    }

                    function C(e, t, r, i, n, o) {
                        if (r + i > e.length) throw new RangeError("Index out of range");
                        if (r < 0) throw new RangeError("Index out of range")
                    }

                    function q(e, t, r, i, o) {
                        return o || C(e, 0, r, 4), n.write(e, t, r, i, 23, 4), r + 4
                    }

                    function U(e, t, r, i, o) {
                        return o || C(e, 0, r, 8), n.write(e, t, r, i, 52, 8), r + 8
                    }

                    f.prototype.slice = function (e, t) {
                        var r, i = this.length;
                        if ((e = ~~e) < 0 ? (e += i) < 0 && (e = 0) : e > i && (e = i), (t = void 0 === t ? i : ~~t) < 0 ? (t += i) < 0 && (t = 0) : t > i && (t = i), t < e && (t = e), f.TYPED_ARRAY_SUPPORT) (r = this.subarray(e, t)).__proto__ = f.prototype; else {
                            var n = t - e;
                            r = new f(n, void 0);
                            for (var o = 0; o < n; ++o) r[o] = this[o + e]
                        }
                        return r
                    }, f.prototype.readUIntLE = function (e, t, r) {
                        e |= 0, t |= 0, r || T(e, t, this.length);
                        for (var i = this[e], n = 1, o = 0; ++o < t && (n *= 256);) i += this[e + o] * n;
                        return i
                    }, f.prototype.readUIntBE = function (e, t, r) {
                        e |= 0, t |= 0, r || T(e, t, this.length);
                        for (var i = this[e + --t], n = 1; t > 0 && (n *= 256);) i += this[e + --t] * n;
                        return i
                    }, f.prototype.readUInt8 = function (e, t) {
                        return t || T(e, 1, this.length), this[e]
                    }, f.prototype.readUInt16LE = function (e, t) {
                        return t || T(e, 2, this.length), this[e] | this[e + 1] << 8
                    }, f.prototype.readUInt16BE = function (e, t) {
                        return t || T(e, 2, this.length), this[e] << 8 | this[e + 1]
                    }, f.prototype.readUInt32LE = function (e, t) {
                        return t || T(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3]
                    }, f.prototype.readUInt32BE = function (e, t) {
                        return t || T(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3])
                    }, f.prototype.readIntLE = function (e, t, r) {
                        e |= 0, t |= 0, r || T(e, t, this.length);
                        for (var i = this[e], n = 1, o = 0; ++o < t && (n *= 256);) i += this[e + o] * n;
                        return i >= (n *= 128) && (i -= Math.pow(2, 8 * t)), i
                    }, f.prototype.readIntBE = function (e, t, r) {
                        e |= 0, t |= 0, r || T(e, t, this.length);
                        for (var i = t, n = 1, o = this[e + --i]; i > 0 && (n *= 256);) o += this[e + --i] * n;
                        return o >= (n *= 128) && (o -= Math.pow(2, 8 * t)), o
                    }, f.prototype.readInt8 = function (e, t) {
                        return t || T(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e]
                    }, f.prototype.readInt16LE = function (e, t) {
                        t || T(e, 2, this.length);
                        var r = this[e] | this[e + 1] << 8;
                        return 32768 & r ? 4294901760 | r : r
                    }, f.prototype.readInt16BE = function (e, t) {
                        t || T(e, 2, this.length);
                        var r = this[e + 1] | this[e] << 8;
                        return 32768 & r ? 4294901760 | r : r
                    }, f.prototype.readInt32LE = function (e, t) {
                        return t || T(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24
                    }, f.prototype.readInt32BE = function (e, t) {
                        return t || T(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]
                    }, f.prototype.readFloatLE = function (e, t) {
                        return t || T(e, 4, this.length), n.read(this, e, !0, 23, 4)
                    }, f.prototype.readFloatBE = function (e, t) {
                        return t || T(e, 4, this.length), n.read(this, e, !1, 23, 4)
                    }, f.prototype.readDoubleLE = function (e, t) {
                        return t || T(e, 8, this.length), n.read(this, e, !0, 52, 8)
                    }, f.prototype.readDoubleBE = function (e, t) {
                        return t || T(e, 8, this.length), n.read(this, e, !1, 52, 8)
                    }, f.prototype.writeUIntLE = function (e, t, r, i) {
                        e = +e, t |= 0, r |= 0, i || j(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
                        var n = 1, o = 0;
                        for (this[t] = 255 & e; ++o < r && (n *= 256);) this[t + o] = e / n & 255;
                        return t + r
                    }, f.prototype.writeUIntBE = function (e, t, r, i) {
                        e = +e, t |= 0, r |= 0, i || j(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
                        var n = r - 1, o = 1;
                        for (this[t + n] = 255 & e; --n >= 0 && (o *= 256);) this[t + n] = e / o & 255;
                        return t + r
                    }, f.prototype.writeUInt8 = function (e, t, r) {
                        return e = +e, t |= 0, r || j(this, e, t, 1, 255, 0), f.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), this[t] = 255 & e, t + 1
                    }, f.prototype.writeUInt16LE = function (e, t, r) {
                        return e = +e, t |= 0, r || j(this, e, t, 2, 65535, 0), f.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : O(this, e, t, !0), t + 2
                    }, f.prototype.writeUInt16BE = function (e, t, r) {
                        return e = +e, t |= 0, r || j(this, e, t, 2, 65535, 0), f.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : O(this, e, t, !1), t + 2
                    }, f.prototype.writeUInt32LE = function (e, t, r) {
                        return e = +e, t |= 0, r || j(this, e, t, 4, 4294967295, 0), f.TYPED_ARRAY_SUPPORT ? (this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e) : P(this, e, t, !0), t + 4
                    }, f.prototype.writeUInt32BE = function (e, t, r) {
                        return e = +e, t |= 0, r || j(this, e, t, 4, 4294967295, 0), f.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : P(this, e, t, !1), t + 4
                    }, f.prototype.writeIntLE = function (e, t, r, i) {
                        if (e = +e, t |= 0, !i) {
                            var n = Math.pow(2, 8 * r - 1);
                            j(this, e, t, r, n - 1, -n)
                        }
                        var o = 0, s = 1, a = 0;
                        for (this[t] = 255 & e; ++o < r && (s *= 256);) e < 0 && 0 === a && 0 !== this[t + o - 1] && (a = 1), this[t + o] = (e / s >> 0) - a & 255;
                        return t + r
                    }, f.prototype.writeIntBE = function (e, t, r, i) {
                        if (e = +e, t |= 0, !i) {
                            var n = Math.pow(2, 8 * r - 1);
                            j(this, e, t, r, n - 1, -n)
                        }
                        var o = r - 1, s = 1, a = 0;
                        for (this[t + o] = 255 & e; --o >= 0 && (s *= 256);) e < 0 && 0 === a && 0 !== this[t + o + 1] && (a = 1), this[t + o] = (e / s >> 0) - a & 255;
                        return t + r
                    }, f.prototype.writeInt8 = function (e, t, r) {
                        return e = +e, t |= 0, r || j(this, e, t, 1, 127, -128), f.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1
                    }, f.prototype.writeInt16LE = function (e, t, r) {
                        return e = +e, t |= 0, r || j(this, e, t, 2, 32767, -32768), f.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : O(this, e, t, !0), t + 2
                    }, f.prototype.writeInt16BE = function (e, t, r) {
                        return e = +e, t |= 0, r || j(this, e, t, 2, 32767, -32768), f.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : O(this, e, t, !1), t + 2
                    }, f.prototype.writeInt32LE = function (e, t, r) {
                        return e = +e, t |= 0, r || j(this, e, t, 4, 2147483647, -2147483648), f.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24) : P(this, e, t, !0), t + 4
                    }, f.prototype.writeInt32BE = function (e, t, r) {
                        return e = +e, t |= 0, r || j(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), f.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : P(this, e, t, !1), t + 4
                    }, f.prototype.writeFloatLE = function (e, t, r) {
                        return q(this, e, t, !0, r)
                    }, f.prototype.writeFloatBE = function (e, t, r) {
                        return q(this, e, t, !1, r)
                    }, f.prototype.writeDoubleLE = function (e, t, r) {
                        return U(this, e, t, !0, r)
                    }, f.prototype.writeDoubleBE = function (e, t, r) {
                        return U(this, e, t, !1, r)
                    }, f.prototype.copy = function (e, t, r, i) {
                        if (r || (r = 0), i || 0 === i || (i = this.length), t >= e.length && (t = e.length), t || (t = 0), i > 0 && i < r && (i = r), i === r) return 0;
                        if (0 === e.length || 0 === this.length) return 0;
                        if (t < 0) throw new RangeError("targetStart out of bounds");
                        if (r < 0 || r >= this.length) throw new RangeError("sourceStart out of bounds");
                        if (i < 0) throw new RangeError("sourceEnd out of bounds");
                        i > this.length && (i = this.length), e.length - t < i - r && (i = e.length - t + r);
                        var n, o = i - r;
                        if (this === e && r < t && t < i) for (n = o - 1; n >= 0; --n) e[n + t] = this[n + r]; else if (o < 1e3 || !f.TYPED_ARRAY_SUPPORT) for (n = 0; n < o; ++n) e[n + t] = this[n + r]; else Uint8Array.prototype.set.call(e, this.subarray(r, r + o), t);
                        return o
                    }, f.prototype.fill = function (e, t, r, i) {
                        if ("string" == typeof e) {
                            if ("string" == typeof t ? (i = t, t = 0, r = this.length) : "string" == typeof r && (i = r, r = this.length), 1 === e.length) {
                                var n = e.charCodeAt(0);
                                n < 256 && (e = n)
                            }
                            if (void 0 !== i && "string" != typeof i) throw new TypeError("encoding must be a string");
                            if ("string" == typeof i && !f.isEncoding(i)) throw new TypeError("Unknown encoding: " + i)
                        } else "number" == typeof e && (e &= 255);
                        if (t < 0 || this.length < t || this.length < r) throw new RangeError("Out of range index");
                        if (r <= t) return this;
                        var o;
                        if (t >>>= 0, r = void 0 === r ? this.length : r >>> 0, e || (e = 0), "number" == typeof e) for (o = t; o < r; ++o) this[o] = e; else {
                            var s = f.isBuffer(e) ? e : L(new f(e, i).toString()), a = s.length;
                            for (o = 0; o < r - t; ++o) this[o + t] = s[o % a]
                        }
                        return this
                    };
                    var N = /[^+\/0-9A-Za-z-_]/g;

                    function D(e) {
                        return e < 16 ? "0" + e.toString(16) : e.toString(16)
                    }

                    function L(e, t) {
                        var r;
                        t = t || 1 / 0;
                        for (var i = e.length, n = null, o = [], s = 0; s < i; ++s) {
                            if ((r = e.charCodeAt(s)) > 55295 && r < 57344) {
                                if (!n) {
                                    if (r > 56319) {
                                        (t -= 3) > -1 && o.push(239, 191, 189);
                                        continue
                                    }
                                    if (s + 1 === i) {
                                        (t -= 3) > -1 && o.push(239, 191, 189);
                                        continue
                                    }
                                    n = r;
                                    continue
                                }
                                if (r < 56320) {
                                    (t -= 3) > -1 && o.push(239, 191, 189), n = r;
                                    continue
                                }
                                r = 65536 + (n - 55296 << 10 | r - 56320)
                            } else n && (t -= 3) > -1 && o.push(239, 191, 189);
                            if (n = null, r < 128) {
                                if ((t -= 1) < 0) break;
                                o.push(r)
                            } else if (r < 2048) {
                                if ((t -= 2) < 0) break;
                                o.push(r >> 6 | 192, 63 & r | 128)
                            } else if (r < 65536) {
                                if ((t -= 3) < 0) break;
                                o.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128)
                            } else {
                                if (!(r < 1114112)) throw new Error("Invalid code point");
                                if ((t -= 4) < 0) break;
                                o.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128)
                            }
                        }
                        return o
                    }

                    function z(e) {
                        return i.toByteArray(function (e) {
                            if ((e = function (e) {
                                    return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "")
                                }(e).replace(N, "")).length < 2) return "";
                            for (; e.length % 4 != 0;) e += "=";
                            return e
                        }(e))
                    }

                    function F(e, t, r, i) {
                        for (var n = 0; n < i && !(n + r >= t.length || n >= e.length); ++n) t[n + r] = e[n];
                        return n
                    }
                }).call(t, r(7))
            }, function (e, t, r) {
                "use strict";
                var i = t;
                i.version = r(130).version, i.utils = r(131), i.rand = r(61), i.curve = r(25), i.curves = r(136), i.ec = r(144), i.eddsa = r(148)
            }, function (e, t) {
                function r(e, t) {
                    if (!e) throw new Error(t || "Assertion failed")
                }

                e.exports = r, r.equal = function (e, t, r) {
                    if (e != t) throw new Error(r || "Assertion failed: " + e + " != " + t)
                }
            }, function (e, t, r) {
                "use strict";
                var i = r(5), n = r(0);

                function o(e) {
                    return (e >>> 24 | e >>> 8 & 65280 | e << 8 & 16711680 | (255 & e) << 24) >>> 0
                }

                function s(e) {
                    return 1 === e.length ? "0" + e : e
                }

                function a(e) {
                    return 7 === e.length ? "0" + e : 6 === e.length ? "00" + e : 5 === e.length ? "000" + e : 4 === e.length ? "0000" + e : 3 === e.length ? "00000" + e : 2 === e.length ? "000000" + e : 1 === e.length ? "0000000" + e : e
                }

                t.inherits = n, t.toArray = function (e, t) {
                    if (Array.isArray(e)) return e.slice();
                    if (!e) return [];
                    var r = [];
                    if ("string" == typeof e) if (t) {
                        if ("hex" === t) for ((e = e.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 && (e = "0" + e), i = 0; i < e.length; i += 2) r.push(parseInt(e[i] + e[i + 1], 16))
                    } else for (var i = 0; i < e.length; i++) {
                        var n = e.charCodeAt(i), o = n >> 8, s = 255 & n;
                        o ? r.push(o, s) : r.push(s)
                    } else for (i = 0; i < e.length; i++) r[i] = 0 | e[i];
                    return r
                }, t.toHex = function (e) {
                    for (var t = "", r = 0; r < e.length; r++) t += s(e[r].toString(16));
                    return t
                }, t.htonl = o, t.toHex32 = function (e, t) {
                    for (var r = "", i = 0; i < e.length; i++) {
                        var n = e[i];
                        "little" === t && (n = o(n)), r += a(n.toString(16))
                    }
                    return r
                }, t.zero2 = s, t.zero8 = a, t.join32 = function (e, t, r, n) {
                    var o = r - t;
                    i(o % 4 == 0);
                    for (var s = new Array(o / 4), a = 0, f = t; a < s.length; a++, f += 4) {
                        var c;
                        c = "big" === n ? e[f] << 24 | e[f + 1] << 16 | e[f + 2] << 8 | e[f + 3] : e[f + 3] << 24 | e[f + 2] << 16 | e[f + 1] << 8 | e[f], s[a] = c >>> 0
                    }
                    return s
                }, t.split32 = function (e, t) {
                    for (var r = new Array(4 * e.length), i = 0, n = 0; i < e.length; i++, n += 4) {
                        var o = e[i];
                        "big" === t ? (r[n] = o >>> 24, r[n + 1] = o >>> 16 & 255, r[n + 2] = o >>> 8 & 255, r[n + 3] = 255 & o) : (r[n + 3] = o >>> 24, r[n + 2] = o >>> 16 & 255, r[n + 1] = o >>> 8 & 255, r[n] = 255 & o)
                    }
                    return r
                }, t.rotr32 = function (e, t) {
                    return e >>> t | e << 32 - t
                }, t.rotl32 = function (e, t) {
                    return e << t | e >>> 32 - t
                }, t.sum32 = function (e, t) {
                    return e + t >>> 0
                }, t.sum32_3 = function (e, t, r) {
                    return e + t + r >>> 0
                }, t.sum32_4 = function (e, t, r, i) {
                    return e + t + r + i >>> 0
                }, t.sum32_5 = function (e, t, r, i, n) {
                    return e + t + r + i + n >>> 0
                }, t.sum64 = function (e, t, r, i) {
                    var n = e[t], o = i + e[t + 1] >>> 0, s = (o < i ? 1 : 0) + r + n;
                    e[t] = s >>> 0, e[t + 1] = o
                }, t.sum64_hi = function (e, t, r, i) {
                    return (t + i >>> 0 < t ? 1 : 0) + e + r >>> 0
                }, t.sum64_lo = function (e, t, r, i) {
                    return t + i >>> 0
                }, t.sum64_4_hi = function (e, t, r, i, n, o, s, a) {
                    var f = 0, c = t;
                    return f += (c = c + i >>> 0) < t ? 1 : 0, f += (c = c + o >>> 0) < o ? 1 : 0, e + r + n + s + (f += (c = c + a >>> 0) < a ? 1 : 0) >>> 0
                }, t.sum64_4_lo = function (e, t, r, i, n, o, s, a) {
                    return t + i + o + a >>> 0
                }, t.sum64_5_hi = function (e, t, r, i, n, o, s, a, f, c) {
                    var u = 0, h = t;
                    return u += (h = h + i >>> 0) < t ? 1 : 0, u += (h = h + o >>> 0) < o ? 1 : 0, u += (h = h + a >>> 0) < a ? 1 : 0, e + r + n + s + f + (u += (h = h + c >>> 0) < c ? 1 : 0) >>> 0
                }, t.sum64_5_lo = function (e, t, r, i, n, o, s, a, f, c) {
                    return t + i + o + a + c >>> 0
                }, t.rotr64_hi = function (e, t, r) {
                    return (t << 32 - r | e >>> r) >>> 0
                }, t.rotr64_lo = function (e, t, r) {
                    return (e << 32 - r | t >>> r) >>> 0
                }, t.shr64_hi = function (e, t, r) {
                    return e >>> r
                }, t.shr64_lo = function (e, t, r) {
                    return (e << 32 - r | t >>> r) >>> 0
                }
            }, function (e, t) {
                var r;
                r = function () {
                    return this
                }();
                try {
                    r = r || Function("return this")() || (0, eval)("this")
                } catch (e) {
                    "object" == typeof window && (r = window)
                }
                e.exports = r
            }, function (e, t) {
                var r, i, n = e.exports = {};

                function o() {
                    throw new Error("setTimeout has not been defined")
                }

                function s() {
                    throw new Error("clearTimeout has not been defined")
                }

                function a(e) {
                    if (r === setTimeout) return setTimeout(e, 0);
                    if ((r === o || !r) && setTimeout) return r = setTimeout, setTimeout(e, 0);
                    try {
                        return r(e, 0)
                    } catch (t) {
                        try {
                            return r.call(null, e, 0)
                        } catch (t) {
                            return r.call(this, e, 0)
                        }
                    }
                }

                !function () {
                    try {
                        r = "function" == typeof setTimeout ? setTimeout : o
                    } catch (e) {
                        r = o
                    }
                    try {
                        i = "function" == typeof clearTimeout ? clearTimeout : s
                    } catch (e) {
                        i = s
                    }
                }();
                var f, c = [], u = !1, h = -1;

                function d() {
                    u && f && (u = !1, f.length ? c = f.concat(c) : h = -1, c.length && l())
                }

                function l() {
                    if (!u) {
                        var e = a(d);
                        u = !0;
                        for (var t = c.length; t;) {
                            for (f = c, c = []; ++h < t;) f && f[h].run();
                            h = -1, t = c.length
                        }
                        f = null, u = !1, function (e) {
                            if (i === clearTimeout) return clearTimeout(e);
                            if ((i === s || !i) && clearTimeout) return i = clearTimeout, clearTimeout(e);
                            try {
                                i(e)
                            } catch (t) {
                                try {
                                    return i.call(null, e)
                                } catch (t) {
                                    return i.call(this, e)
                                }
                            }
                        }(e)
                    }
                }

                function p(e, t) {
                    this.fun = e, this.array = t
                }

                function b() {
                }

                n.nextTick = function (e) {
                    var t = new Array(arguments.length - 1);
                    if (arguments.length > 1) for (var r = 1; r < arguments.length; r++) t[r - 1] = arguments[r];
                    c.push(new p(e, t)), 1 !== c.length || u || a(l)
                }, p.prototype.run = function () {
                    this.fun.apply(null, this.array)
                }, n.title = "browser", n.browser = !0, n.env = {}, n.argv = [], n.version = "", n.versions = {}, n.on = b, n.addListener = b, n.once = b, n.off = b, n.removeListener = b, n.removeAllListeners = b, n.emit = b, n.prependListener = b, n.prependOnceListener = b, n.listeners = function (e) {
                    return []
                }, n.binding = function (e) {
                    throw new Error("process.binding is not supported")
                }, n.cwd = function () {
                    return "/"
                }, n.chdir = function (e) {
                    throw new Error("process.chdir is not supported")
                }, n.umask = function () {
                    return 0
                }
            }, function (e, t, r) {
                var i = r(1).Buffer, n = r(21).Transform, o = r(33).StringDecoder;

                function s(e) {
                    n.call(this), this.hashMode = "string" == typeof e, this.hashMode ? this[e] = this._finalOrDigest : this.final = this._finalOrDigest, this._final && (this.__final = this._final, this._final = null), this._decoder = null, this._encoding = null
                }

                r(0)(s, n), s.prototype.update = function (e, t, r) {
                    "string" == typeof e && (e = i.from(e, t));
                    var n = this._update(e);
                    return this.hashMode ? this : (r && (n = this._toString(n, r)), n)
                }, s.prototype.setAutoPadding = function () {
                }, s.prototype.getAuthTag = function () {
                    throw new Error("trying to get auth tag in unsupported state")
                }, s.prototype.setAuthTag = function () {
                    throw new Error("trying to set auth tag in unsupported state")
                }, s.prototype.setAAD = function () {
                    throw new Error("trying to set aad in unsupported state")
                }, s.prototype._transform = function (e, t, r) {
                    var i;
                    try {
                        this.hashMode ? this._update(e) : this.push(this._update(e))
                    } catch (e) {
                        i = e
                    } finally {
                        r(i)
                    }
                }, s.prototype._flush = function (e) {
                    var t;
                    try {
                        this.push(this.__final())
                    } catch (e) {
                        t = e
                    }
                    e(t)
                }, s.prototype._finalOrDigest = function (e) {
                    var t = this.__final() || i.alloc(0);
                    return e && (t = this._toString(t, e, !0)), t
                }, s.prototype._toString = function (e, t, r) {
                    if (this._decoder || (this._decoder = new o(t), this._encoding = t), this._encoding !== t) throw new Error("can't switch encodings");
                    var i = this._decoder.write(e);
                    return r && (i += this._decoder.end()), i
                }, e.exports = s
            }, function (e, t) {
                e.exports = {
                    Point: class {
                        constructor() {
                        }

                        equal() {
                            throw new Error("Not implemented")
                        }

                        null() {
                            throw new Error("Not implemented")
                        }

                        base() {
                            throw new Error("Not implemented")
                        }

                        pick(e) {
                            throw new Error("Not implemented")
                        }

                        set() {
                            throw new Error("Not implemented")
                        }

                        clone() {
                            throw new Error("Not implemented")
                        }

                        embedLen() {
                            throw new Error("Not implemented")
                        }

                        embed(e, t) {
                            throw new Error("Not implemented")
                        }

                        data() {
                            throw new Error("Not implemented")
                        }

                        add(e, t) {
                            throw new Error("Not implemented")
                        }

                        sub(e, t) {
                            throw new Error("Not implemented")
                        }

                        neg(e) {
                            throw new Error("Not implemented")
                        }

                        mul(e, t) {
                            throw new Error("Not implemented")
                        }

                        marshalBinary() {
                            throw new Error("Not implemented")
                        }

                        unmarshalBinary(e) {
                            throw new Error("Not implemented")
                        }
                    }, Scalar: class {
                        marshalBinary() {
                            throw new Error("Not implemented")
                        }

                        unmarshalBinary(e) {
                            throw new Error("Not implemented")
                        }

                        equal() {
                            throw new Error("Not implemented")
                        }

                        set(e) {
                            throw new Error("Not implemented")
                        }

                        clone() {
                            throw new Error("Not implemented")
                        }

                        zero() {
                            throw new Error("Not implemented")
                        }

                        add(e, t) {
                            throw new Error("Not implemented")
                        }

                        sub(e, t) {
                            throw new Error("Not implemented")
                        }

                        neg(e) {
                            throw new Error("Not implemented")
                        }

                        div(e, t) {
                            throw new Error("Not implemented")
                        }

                        inv(e) {
                            throw new Error("Not implemented")
                        }

                        inv(e) {
                            throw new Error("Not implemented")
                        }

                        pick(e) {
                            throw new Error("Not implemented")
                        }

                        setBytes(e) {
                            throw new Error("Not implemented")
                        }
                    }, Group: class {
                        constructor() {
                        }

                        scalarLen() {
                            throw new Error("Not implemented")
                        }

                        scalar() {
                            throw new Error("Not implemented")
                        }

                        pointLen() {
                            throw new Error("Not implemented")
                        }

                        point() {
                            throw new Error("Not implemented")
                        }
                    }
                }
            }, function (e, t, r) {
                "use strict";
                t.randomBytes = t.rng = t.pseudoRandomBytes = t.prng = r(13), t.createHash = t.Hash = r(15), t.createHmac = t.Hmac = r(48);
                var i = r(103), n = Object.keys(i),
                    o = ["sha1", "sha224", "sha256", "sha384", "sha512", "md5", "rmd160"].concat(n);
                t.getHashes = function () {
                    return o
                };
                var s = r(50);
                t.pbkdf2 = s.pbkdf2, t.pbkdf2Sync = s.pbkdf2Sync;
                var a = r(105);
                t.Cipher = a.Cipher, t.createCipher = a.createCipher, t.Cipheriv = a.Cipheriv, t.createCipheriv = a.createCipheriv, t.Decipher = a.Decipher, t.createDecipher = a.createDecipher, t.Decipheriv = a.Decipheriv, t.createDecipheriv = a.createDecipheriv, t.getCiphers = a.getCiphers, t.listCiphers = a.listCiphers;
                var f = r(124);
                t.DiffieHellmanGroup = f.DiffieHellmanGroup, t.createDiffieHellmanGroup = f.createDiffieHellmanGroup, t.getDiffieHellman = f.getDiffieHellman, t.createDiffieHellman = f.createDiffieHellman, t.DiffieHellman = f.DiffieHellman;
                var c = r(128);
                t.createSign = c.createSign, t.Sign = c.Sign, t.createVerify = c.createVerify, t.Verify = c.Verify, t.createECDH = r(166);
                var u = r(167);
                t.publicEncrypt = u.publicEncrypt, t.privateEncrypt = u.privateEncrypt, t.publicDecrypt = u.publicDecrypt, t.privateDecrypt = u.privateDecrypt;
                var h = r(170);
                t.randomFill = h.randomFill, t.randomFillSync = h.randomFillSync, t.createCredentials = function () {
                    throw new Error(["sorry, createCredentials is not implemented yet", "we accept pull requests", "https://github.com/crypto-browserify/crypto-browserify"].join("\n"))
                }, t.constants = {
                    DH_CHECK_P_NOT_SAFE_PRIME: 2,
                    DH_CHECK_P_NOT_PRIME: 1,
                    DH_UNABLE_TO_CHECK_GENERATOR: 4,
                    DH_NOT_SUITABLE_GENERATOR: 8,
                    NPN_ENABLED: 1,
                    ALPN_ENABLED: 1,
                    RSA_PKCS1_PADDING: 1,
                    RSA_SSLV23_PADDING: 2,
                    RSA_NO_PADDING: 3,
                    RSA_PKCS1_OAEP_PADDING: 4,
                    RSA_X931_PADDING: 5,
                    RSA_PKCS1_PSS_PADDING: 6,
                    POINT_CONVERSION_COMPRESSED: 2,
                    POINT_CONVERSION_UNCOMPRESSED: 4,
                    POINT_CONVERSION_HYBRID: 6
                }
            }, function (e, t, r) {
                "use strict";
                var i = r(22), n = Object.keys || function (e) {
                    var t = [];
                    for (var r in e) t.push(r);
                    return t
                };
                e.exports = h;
                var o = r(16);
                o.inherits = r(0);
                var s = r(42), a = r(32);
                o.inherits(h, s);
                for (var f = n(a.prototype), c = 0; c < f.length; c++) {
                    var u = f[c];
                    h.prototype[u] || (h.prototype[u] = a.prototype[u])
                }

                function h(e) {
                    if (!(this instanceof h)) return new h(e);
                    s.call(this, e), a.call(this, e), e && !1 === e.readable && (this.readable = !1), e && !1 === e.writable && (this.writable = !1), this.allowHalfOpen = !0, e && !1 === e.allowHalfOpen && (this.allowHalfOpen = !1), this.once("end", d)
                }

                function d() {
                    this.allowHalfOpen || this._writableState.ended || i(l, this)
                }

                function l(e) {
                    e.end()
                }

                Object.defineProperty(h.prototype, "destroyed", {
                    get: function () {
                        return void 0 !== this._readableState && void 0 !== this._writableState && this._readableState.destroyed && this._writableState.destroyed
                    }, set: function (e) {
                        void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed = e, this._writableState.destroyed = e)
                    }
                }), h.prototype._destroy = function (e, t) {
                    this.push(null), this.end(), i(t, e)
                }
            }, function (e, t, r) {
                "use strict";
                (function (t, i) {
                    var n = r(1).Buffer, o = t.crypto || t.msCrypto;
                    o && o.getRandomValues ? e.exports = function (e, r) {
                        if (e > 65536) throw new Error("requested too many random bytes");
                        var s = new t.Uint8Array(e);
                        e > 0 && o.getRandomValues(s);
                        var a = n.from(s.buffer);
                        return "function" == typeof r ? i.nextTick(function () {
                            r(null, a)
                        }) : a
                    } : e.exports = function () {
                        throw new Error("Secure random number generation is not supported by this browser.\nUse Chrome, Firefox or Internet Explorer 11")
                    }
                }).call(t, r(7), r(8))
            }, function (e, t, r) {
                var i = r(1).Buffer;

                function n(e, t) {
                    this._block = i.alloc(e), this._finalSize = t, this._blockSize = e, this._len = 0
                }

                n.prototype.update = function (e, t) {
                    "string" == typeof e && (t = t || "utf8", e = i.from(e, t));
                    for (var r = this._block, n = this._blockSize, o = e.length, s = this._len, a = 0; a < o;) {
                        for (var f = s % n, c = Math.min(o - a, n - f), u = 0; u < c; u++) r[f + u] = e[a + u];
                        a += c, (s += c) % n == 0 && this._update(r)
                    }
                    return this._len += o, this
                }, n.prototype.digest = function (e) {
                    var t = this._len % this._blockSize;
                    this._block[t] = 128, this._block.fill(0, t + 1), t >= this._finalSize && (this._update(this._block), this._block.fill(0));
                    var r = 8 * this._len;
                    if (r <= 4294967295) this._block.writeUInt32BE(r, this._blockSize - 4); else {
                        var i = (4294967295 & r) >>> 0, n = (r - i) / 4294967296;
                        this._block.writeUInt32BE(n, this._blockSize - 8), this._block.writeUInt32BE(i, this._blockSize - 4)
                    }
                    this._update(this._block);
                    var o = this._hash();
                    return e ? o.toString(e) : o
                }, n.prototype._update = function () {
                    throw new Error("_update must be implemented by subclass")
                }, e.exports = n
            }, function (e, t, r) {
                "use strict";
                (function (t) {
                    var i = r(0), n = r(28), o = r(29), s = r(34), a = r(9);

                    function f(e) {
                        a.call(this, "digest"), this._hash = e, this.buffers = []
                    }

                    function c(e) {
                        a.call(this, "digest"), this._hash = e
                    }

                    i(f, a), f.prototype._update = function (e) {
                        this.buffers.push(e)
                    }, f.prototype._final = function () {
                        var e = t.concat(this.buffers), r = this._hash(e);
                        return this.buffers = null, r
                    }, i(c, a), c.prototype._update = function (e) {
                        this._hash.update(e)
                    }, c.prototype._final = function () {
                        return this._hash.digest()
                    }, e.exports = function (e) {
                        return "md5" === (e = e.toLowerCase()) ? new f(n) : new c("rmd160" === e || "ripemd160" === e ? new o : s(e))
                    }
                }).call(t, r(3).Buffer)
            }, function (e, t, r) {
                (function (e) {
                    function r(e) {
                        return Object.prototype.toString.call(e)
                    }

                    t.isArray = function (e) {
                        return Array.isArray ? Array.isArray(e) : "[object Array]" === r(e)
                    }, t.isBoolean = function (e) {
                        return "boolean" == typeof e
                    }, t.isNull = function (e) {
                        return null === e
                    }, t.isNullOrUndefined = function (e) {
                        return null == e
                    }, t.isNumber = function (e) {
                        return "number" == typeof e
                    }, t.isString = function (e) {
                        return "string" == typeof e
                    }, t.isSymbol = function (e) {
                        return "symbol" == typeof e
                    }, t.isUndefined = function (e) {
                        return void 0 === e
                    }, t.isRegExp = function (e) {
                        return "[object RegExp]" === r(e)
                    }, t.isObject = function (e) {
                        return "object" == typeof e && null !== e
                    }, t.isDate = function (e) {
                        return "[object Date]" === r(e)
                    }, t.isError = function (e) {
                        return "[object Error]" === r(e) || e instanceof Error
                    }, t.isFunction = function (e) {
                        return "function" == typeof e
                    }, t.isPrimitive = function (e) {
                        return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == typeof e || void 0 === e
                    }, t.isBuffer = e.isBuffer
                }).call(t, r(3).Buffer)
            }, function (e, t, r) {
                (function (t) {
                    e.exports = function (e, r) {
                        for (var i = Math.min(e.length, r.length), n = new t(i), o = 0; o < i; ++o) n[o] = e[o] ^ r[o];
                        return n
                    }
                }).call(t, r(3).Buffer)
            }, function (e, t, r) {
                "use strict";
                var i = r(6), n = r(5);

                function o() {
                    this.pending = null, this.pendingTotal = 0, this.blockSize = this.constructor.blockSize, this.outSize = this.constructor.outSize, this.hmacStrength = this.constructor.hmacStrength, this.padLength = this.constructor.padLength / 8, this.endian = "big", this._delta8 = this.blockSize / 8, this._delta32 = this.blockSize / 32
                }

                t.BlockHash = o, o.prototype.update = function (e, t) {
                    if (e = i.toArray(e, t), this.pending ? this.pending = this.pending.concat(e) : this.pending = e, this.pendingTotal += e.length, this.pending.length >= this._delta8) {
                        var r = (e = this.pending).length % this._delta8;
                        this.pending = e.slice(e.length - r, e.length), 0 === this.pending.length && (this.pending = null), e = i.join32(e, 0, e.length - r, this.endian);
                        for (var n = 0; n < e.length; n += this._delta32) this._update(e, n, n + this._delta32)
                    }
                    return this
                }, o.prototype.digest = function (e) {
                    return this.update(this._pad()), n(null === this.pending), this._digest(e)
                }, o.prototype._pad = function () {
                    var e = this.pendingTotal, t = this._delta8, r = t - (e + this.padLength) % t,
                        i = new Array(r + this.padLength);
                    i[0] = 128;
                    for (var n = 1; n < r; n++) i[n] = 0;
                    if (e <<= 3, "big" === this.endian) {
                        for (var o = 8; o < this.padLength; o++) i[n++] = 0;
                        i[n++] = 0, i[n++] = 0, i[n++] = 0, i[n++] = 0, i[n++] = e >>> 24 & 255, i[n++] = e >>> 16 & 255, i[n++] = e >>> 8 & 255, i[n++] = 255 & e
                    } else for (i[n++] = 255 & e, i[n++] = e >>> 8 & 255, i[n++] = e >>> 16 & 255, i[n++] = e >>> 24 & 255, i[n++] = 0, i[n++] = 0, i[n++] = 0, i[n++] = 0, o = 8; o < this.padLength; o++) i[n++] = 0;
                    return i
                }
            }, function (e, t, r) {
                var i = t;
                i.bignum = r(2), i.define = r(152).define, i.base = r(20), i.constants = r(67), i.decoders = r(158), i.encoders = r(160)
            }, function (e, t, r) {
                var i = t;
                i.Reporter = r(155).Reporter, i.DecoderBuffer = r(66).DecoderBuffer, i.EncoderBuffer = r(66).EncoderBuffer, i.Node = r(156)
            }, function (e, t, r) {
                e.exports = n;
                var i = r(30).EventEmitter;

                function n() {
                    i.call(this)
                }

                r(0)(n, i), n.Readable = r(31), n.Writable = r(94), n.Duplex = r(95), n.Transform = r(96), n.PassThrough = r(97), n.Stream = n, n.prototype.pipe = function (e, t) {
                    var r = this;

                    function n(t) {
                        e.writable && !1 === e.write(t) && r.pause && r.pause()
                    }

                    function o() {
                        r.readable && r.resume && r.resume()
                    }

                    r.on("data", n), e.on("drain", o), e._isStdio || t && !1 === t.end || (r.on("end", a), r.on("close", f));
                    var s = !1;

                    function a() {
                        s || (s = !0, e.end())
                    }

                    function f() {
                        s || (s = !0, "function" == typeof e.destroy && e.destroy())
                    }

                    function c(e) {
                        if (u(), 0 === i.listenerCount(this, "error")) throw e
                    }

                    function u() {
                        r.removeListener("data", n), e.removeListener("drain", o), r.removeListener("end", a), r.removeListener("close", f), r.removeListener("error", c), e.removeListener("error", c), r.removeListener("end", u), r.removeListener("close", u), e.removeListener("close", u)
                    }

                    return r.on("error", c), e.on("error", c), r.on("end", u), r.on("close", u), e.on("close", u), e.emit("pipe", r), e
                }
            }, function (e, t, r) {
                "use strict";
                (function (t) {
                    !t.version || 0 === t.version.indexOf("v0.") || 0 === t.version.indexOf("v1.") && 0 !== t.version.indexOf("v1.8.") ? e.exports = function (e, r, i, n) {
                        if ("function" != typeof e) throw new TypeError('"callback" argument must be a function');
                        var o, s, a = arguments.length;
                        switch (a) {
                            case 0:
                            case 1:
                                return t.nextTick(e);
                            case 2:
                                return t.nextTick(function () {
                                    e.call(null, r)
                                });
                            case 3:
                                return t.nextTick(function () {
                                    e.call(null, r, i)
                                });
                            case 4:
                                return t.nextTick(function () {
                                    e.call(null, r, i, n)
                                });
                            default:
                                for (o = new Array(a - 1), s = 0; s < o.length;) o[s++] = arguments[s];
                                return t.nextTick(function () {
                                    e.apply(null, o)
                                })
                        }
                    } : e.exports = t.nextTick
                }).call(t, r(8))
            }, function (e, t, r) {
                var i = r(1).Buffer, n = r(106);
                e.exports = function (e, t, r, o) {
                    if (i.isBuffer(e) || (e = i.from(e, "binary")), t && (i.isBuffer(t) || (t = i.from(t, "binary")), 8 !== t.length)) throw new RangeError("salt should be Buffer with 8 byte length");
                    for (var s = r / 8, a = i.alloc(s), f = i.alloc(o || 0), c = i.alloc(0); s > 0 || o > 0;) {
                        var u = new n;
                        u.update(c), u.update(e), t && u.update(t), c = u.digest();
                        var h = 0;
                        if (s > 0) {
                            var d = a.length - s;
                            h = Math.min(s, c.length), c.copy(a, d, 0, h), s -= h
                        }
                        if (h < c.length && o > 0) {
                            var l = f.length - o, p = Math.min(o, c.length - h);
                            c.copy(f, l, h, h + p), o -= p
                        }
                    }
                    return c.fill(0), {key: a, iv: f}
                }
            }, function (e, t, r) {
                var i = r(1).Buffer;

                function n(e) {
                    i.isBuffer(e) || (e = i.from(e));
                    for (var t = e.length / 4 | 0, r = new Array(t), n = 0; n < t; n++) r[n] = e.readUInt32BE(4 * n);
                    return r
                }

                function o(e) {
                    for (; 0 < e.length; e++) e[0] = 0
                }

                function s(e, t, r, i, n) {
                    for (var o, s, a, f, c = r[0], u = r[1], h = r[2], d = r[3], l = e[0] ^ t[0], p = e[1] ^ t[1], b = e[2] ^ t[2], y = e[3] ^ t[3], v = 4, m = 1; m < n; m++) o = c[l >>> 24] ^ u[p >>> 16 & 255] ^ h[b >>> 8 & 255] ^ d[255 & y] ^ t[v++], s = c[p >>> 24] ^ u[b >>> 16 & 255] ^ h[y >>> 8 & 255] ^ d[255 & l] ^ t[v++], a = c[b >>> 24] ^ u[y >>> 16 & 255] ^ h[l >>> 8 & 255] ^ d[255 & p] ^ t[v++], f = c[y >>> 24] ^ u[l >>> 16 & 255] ^ h[p >>> 8 & 255] ^ d[255 & b] ^ t[v++], l = o, p = s, b = a, y = f;
                    return o = (i[l >>> 24] << 24 | i[p >>> 16 & 255] << 16 | i[b >>> 8 & 255] << 8 | i[255 & y]) ^ t[v++], s = (i[p >>> 24] << 24 | i[b >>> 16 & 255] << 16 | i[y >>> 8 & 255] << 8 | i[255 & l]) ^ t[v++], a = (i[b >>> 24] << 24 | i[y >>> 16 & 255] << 16 | i[l >>> 8 & 255] << 8 | i[255 & p]) ^ t[v++], f = (i[y >>> 24] << 24 | i[l >>> 16 & 255] << 16 | i[p >>> 8 & 255] << 8 | i[255 & b]) ^ t[v++], [o >>>= 0, s >>>= 0, a >>>= 0, f >>>= 0]
                }

                var a = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54], f = function () {
                    for (var e = new Array(256), t = 0; t < 256; t++) e[t] = t < 128 ? t << 1 : t << 1 ^ 283;
                    for (var r = [], i = [], n = [[], [], [], []], o = [[], [], [], []], s = 0, a = 0, f = 0; f < 256; ++f) {
                        var c = a ^ a << 1 ^ a << 2 ^ a << 3 ^ a << 4;
                        c = c >>> 8 ^ 255 & c ^ 99, r[s] = c, i[c] = s;
                        var u = e[s], h = e[u], d = e[h], l = 257 * e[c] ^ 16843008 * c;
                        n[0][s] = l << 24 | l >>> 8, n[1][s] = l << 16 | l >>> 16, n[2][s] = l << 8 | l >>> 24, n[3][s] = l, l = 16843009 * d ^ 65537 * h ^ 257 * u ^ 16843008 * s, o[0][c] = l << 24 | l >>> 8, o[1][c] = l << 16 | l >>> 16, o[2][c] = l << 8 | l >>> 24, o[3][c] = l, 0 === s ? s = a = 1 : (s = u ^ e[e[e[d ^ u]]], a ^= e[e[a]])
                    }
                    return {SBOX: r, INV_SBOX: i, SUB_MIX: n, INV_SUB_MIX: o}
                }();

                function c(e) {
                    this._key = n(e), this._reset()
                }

                c.blockSize = 16, c.keySize = 32, c.prototype.blockSize = c.blockSize, c.prototype.keySize = c.keySize, c.prototype._reset = function () {
                    for (var e = this._key, t = e.length, r = t + 6, i = 4 * (r + 1), n = [], o = 0; o < t; o++) n[o] = e[o];
                    for (o = t; o < i; o++) {
                        var s = n[o - 1];
                        o % t == 0 ? (s = s << 8 | s >>> 24, s = f.SBOX[s >>> 24] << 24 | f.SBOX[s >>> 16 & 255] << 16 | f.SBOX[s >>> 8 & 255] << 8 | f.SBOX[255 & s], s ^= a[o / t | 0] << 24) : t > 6 && o % t == 4 && (s = f.SBOX[s >>> 24] << 24 | f.SBOX[s >>> 16 & 255] << 16 | f.SBOX[s >>> 8 & 255] << 8 | f.SBOX[255 & s]), n[o] = n[o - t] ^ s
                    }
                    for (var c = [], u = 0; u < i; u++) {
                        var h = i - u, d = n[h - (u % 4 ? 0 : 4)];
                        c[u] = u < 4 || h <= 4 ? d : f.INV_SUB_MIX[0][f.SBOX[d >>> 24]] ^ f.INV_SUB_MIX[1][f.SBOX[d >>> 16 & 255]] ^ f.INV_SUB_MIX[2][f.SBOX[d >>> 8 & 255]] ^ f.INV_SUB_MIX[3][f.SBOX[255 & d]]
                    }
                    this._nRounds = r, this._keySchedule = n, this._invKeySchedule = c
                }, c.prototype.encryptBlockRaw = function (e) {
                    return s(e = n(e), this._keySchedule, f.SUB_MIX, f.SBOX, this._nRounds)
                }, c.prototype.encryptBlock = function (e) {
                    var t = this.encryptBlockRaw(e), r = i.allocUnsafe(16);
                    return r.writeUInt32BE(t[0], 0), r.writeUInt32BE(t[1], 4), r.writeUInt32BE(t[2], 8), r.writeUInt32BE(t[3], 12), r
                }, c.prototype.decryptBlock = function (e) {
                    var t = (e = n(e))[1];
                    e[1] = e[3], e[3] = t;
                    var r = s(e, this._invKeySchedule, f.INV_SUB_MIX, f.INV_SBOX, this._nRounds), o = i.allocUnsafe(16);
                    return o.writeUInt32BE(r[0], 0), o.writeUInt32BE(r[3], 4), o.writeUInt32BE(r[2], 8), o.writeUInt32BE(r[1], 12), o
                }, c.prototype.scrub = function () {
                    o(this._keySchedule), o(this._invKeySchedule), o(this._key)
                }, e.exports.AES = c
            }, function (e, t, r) {
                "use strict";
                var i = t;
                i.base = r(132), i.short = r(133), i.mont = r(134), i.edwards = r(135)
            }, function (e, t, r) {
                (function (t) {
                    var i = r(151), n = r(163), o = r(164), s = r(35), a = r(50);

                    function f(e) {
                        var r;
                        "object" != typeof e || t.isBuffer(e) || (r = e.passphrase, e = e.key), "string" == typeof e && (e = new t(e));
                        var f, c, u = o(e, r), h = u.tag, d = u.data;
                        switch (h) {
                            case"CERTIFICATE":
                                c = i.certificate.decode(d, "der").tbsCertificate.subjectPublicKeyInfo;
                            case"PUBLIC KEY":
                                switch (c || (c = i.PublicKey.decode(d, "der")), f = c.algorithm.algorithm.join(".")) {
                                    case"1.2.840.113549.1.1.1":
                                        return i.RSAPublicKey.decode(c.subjectPublicKey.data, "der");
                                    case"1.2.840.10045.2.1":
                                        return c.subjectPrivateKey = c.subjectPublicKey, {type: "ec", data: c};
                                    case"1.2.840.10040.4.1":
                                        return c.algorithm.params.pub_key = i.DSAparam.decode(c.subjectPublicKey.data, "der"), {
                                            type: "dsa",
                                            data: c.algorithm.params
                                        };
                                    default:
                                        throw new Error("unknown key id " + f)
                                }
                                throw new Error("unknown key type " + h);
                            case"ENCRYPTED PRIVATE KEY":
                                d = function (e, r) {
                                    var i = e.algorithm.decrypt.kde.kdeparams.salt,
                                        o = parseInt(e.algorithm.decrypt.kde.kdeparams.iters.toString(), 10),
                                        f = n[e.algorithm.decrypt.cipher.algo.join(".")],
                                        c = e.algorithm.decrypt.cipher.iv, u = e.subjectPrivateKey,
                                        h = parseInt(f.split("-")[1], 10) / 8, d = a.pbkdf2Sync(r, i, o, h),
                                        l = s.createDecipheriv(f, d, c), p = [];
                                    return p.push(l.update(u)), p.push(l.final()), t.concat(p)
                                }(d = i.EncryptedPrivateKey.decode(d, "der"), r);
                            case"PRIVATE KEY":
                                switch (f = (c = i.PrivateKey.decode(d, "der")).algorithm.algorithm.join(".")) {
                                    case"1.2.840.113549.1.1.1":
                                        return i.RSAPrivateKey.decode(c.subjectPrivateKey, "der");
                                    case"1.2.840.10045.2.1":
                                        return {
                                            curve: c.algorithm.curve,
                                            privateKey: i.ECPrivateKey.decode(c.subjectPrivateKey, "der").privateKey
                                        };
                                    case"1.2.840.10040.4.1":
                                        return c.algorithm.params.priv_key = i.DSAparam.decode(c.subjectPrivateKey, "der"), {
                                            type: "dsa",
                                            params: c.algorithm.params
                                        };
                                    default:
                                        throw new Error("unknown key id " + f)
                                }
                                throw new Error("unknown key type " + h);
                            case"RSA PUBLIC KEY":
                                return i.RSAPublicKey.decode(d, "der");
                            case"RSA PRIVATE KEY":
                                return i.RSAPrivateKey.decode(d, "der");
                            case"DSA PRIVATE KEY":
                                return {type: "dsa", params: i.DSAPrivateKey.decode(d, "der")};
                            case"EC PRIVATE KEY":
                                return {
                                    curve: (d = i.ECPrivateKey.decode(d, "der")).parameters.value,
                                    privateKey: d.privateKey
                                };
                            default:
                                throw new Error("unknown key type " + h)
                        }
                    }

                    e.exports = f, f.signature = i.signature
                }).call(t, r(3).Buffer)
            }, function (e, t, r) {
                "use strict";
                const i = r(2), n = r(11), o = r(74), s = r(10);

                class a extends s.Scalar {
                    constructor(e, t) {
                        super(), this.ref = {
                            arr: new i(0, 16).toRed(t),
                            red: t,
                            curve: e
                        }, this.inspect = this.toString.bind(this), this.string = this.toString.bind(this)
                    }

                    equal(e) {
                        return 0 == this.ref.arr.fromRed().cmp(e.ref.arr.fromRed())
                    }

                    set(e) {
                        return this.ref = e.ref, this
                    }

                    clone() {
                        return new a(this.ref.curve, this.ref.red).setBytes(new Uint8Array(this.ref.arr.fromRed().toArray("be")))
                    }

                    zero() {
                        return this.ref.arr = new i(0, 16).toRed(this.ref.red), this
                    }

                    add(e, t) {
                        return this.ref.arr = e.ref.arr.redAdd(t.ref.arr), this
                    }

                    sub(e, t) {
                        return this.ref.arr = e.ref.arr.redSub(t.ref.arr), this
                    }

                    neg(e) {
                        return this.ref.arr = e.ref.arr.redNeg(), this
                    }

                    one() {
                        return this.ref.arr = new i(1, 16).toRed(this.ref.red), this
                    }

                    mul(e, t) {
                        return this.ref.arr = e.ref.arr.redMul(t.ref.arr), this
                    }

                    div(e, t) {
                        return this.ref.arr = e.ref.arr.redMul(t.ref.arr.redInvm()), this
                    }

                    inv(e) {
                        return this.ref.arr = e.ref.arr.redInvm(), this
                    }

                    setBytes(e) {
                        if (e.constructor !== Uint8Array) throw new TypeError("b should be a Uint8Array");
                        return this.ref.arr = new i(e, 16, "be").toRed(this.ref.red), this
                    }

                    bytes() {
                        return new Uint8Array(this.ref.arr.fromRed().toArray("be"))
                    }

                    toString() {
                        let e = this.ref.arr.fromRed().toArray("be");
                        return Array.from(e, e => ("0" + (255 & e).toString(16)).slice(-2)).join("")
                    }

                    pick(e) {
                        e = e || n.randomBytes;
                        let t = o.int(this.ref.curve.curve.n, e);
                        return this.setBytes(t), this
                    }

                    marshalSize() {
                        return this.ref.curve.scalarLen()
                    }

                    marshalBinary() {
                        return new Uint8Array(this.ref.arr.fromRed().toArray("be", this.ref.curve.scalarLen()))
                    }

                    unmarshalBinary(e) {
                        if (e.constructor !== Uint8Array) throw new TypeError("bytes should be a Uint8Array");
                        if (e.length !== this.marshalSize()) throw new Error("bytes.length != marshalSize");
                        if (new i(e, 16).cmp(this.ref.curve.curve.n) > 0) throw new Error("bytes > q");
                        this.setBytes(e)
                    }
                }

                e.exports = a
            }, function (e, t, r) {
                "use strict";
                var i = r(86);

                function n(e, t) {
                    e[t >> 5] |= 128 << t % 32, e[14 + (t + 64 >>> 9 << 4)] = t;
                    for (var r = 1732584193, i = -271733879, n = -1732584194, o = 271733878, h = 0; h < e.length; h += 16) {
                        var d = r, l = i, p = n, b = o;
                        i = c(i = c(i = c(i = c(i = f(i = f(i = f(i = f(i = a(i = a(i = a(i = a(i = s(i = s(i = s(i = s(i, n = s(n, o = s(o, r = s(r, i, n, o, e[h + 0], 7, -680876936), i, n, e[h + 1], 12, -389564586), r, i, e[h + 2], 17, 606105819), o, r, e[h + 3], 22, -1044525330), n = s(n, o = s(o, r = s(r, i, n, o, e[h + 4], 7, -176418897), i, n, e[h + 5], 12, 1200080426), r, i, e[h + 6], 17, -1473231341), o, r, e[h + 7], 22, -45705983), n = s(n, o = s(o, r = s(r, i, n, o, e[h + 8], 7, 1770035416), i, n, e[h + 9], 12, -1958414417), r, i, e[h + 10], 17, -42063), o, r, e[h + 11], 22, -1990404162), n = s(n, o = s(o, r = s(r, i, n, o, e[h + 12], 7, 1804603682), i, n, e[h + 13], 12, -40341101), r, i, e[h + 14], 17, -1502002290), o, r, e[h + 15], 22, 1236535329), n = a(n, o = a(o, r = a(r, i, n, o, e[h + 1], 5, -165796510), i, n, e[h + 6], 9, -1069501632), r, i, e[h + 11], 14, 643717713), o, r, e[h + 0], 20, -373897302), n = a(n, o = a(o, r = a(r, i, n, o, e[h + 5], 5, -701558691), i, n, e[h + 10], 9, 38016083), r, i, e[h + 15], 14, -660478335), o, r, e[h + 4], 20, -405537848), n = a(n, o = a(o, r = a(r, i, n, o, e[h + 9], 5, 568446438), i, n, e[h + 14], 9, -1019803690), r, i, e[h + 3], 14, -187363961), o, r, e[h + 8], 20, 1163531501), n = a(n, o = a(o, r = a(r, i, n, o, e[h + 13], 5, -1444681467), i, n, e[h + 2], 9, -51403784), r, i, e[h + 7], 14, 1735328473), o, r, e[h + 12], 20, -1926607734), n = f(n, o = f(o, r = f(r, i, n, o, e[h + 5], 4, -378558), i, n, e[h + 8], 11, -2022574463), r, i, e[h + 11], 16, 1839030562), o, r, e[h + 14], 23, -35309556), n = f(n, o = f(o, r = f(r, i, n, o, e[h + 1], 4, -1530992060), i, n, e[h + 4], 11, 1272893353), r, i, e[h + 7], 16, -155497632), o, r, e[h + 10], 23, -1094730640), n = f(n, o = f(o, r = f(r, i, n, o, e[h + 13], 4, 681279174), i, n, e[h + 0], 11, -358537222), r, i, e[h + 3], 16, -722521979), o, r, e[h + 6], 23, 76029189), n = f(n, o = f(o, r = f(r, i, n, o, e[h + 9], 4, -640364487), i, n, e[h + 12], 11, -421815835), r, i, e[h + 15], 16, 530742520), o, r, e[h + 2], 23, -995338651), n = c(n, o = c(o, r = c(r, i, n, o, e[h + 0], 6, -198630844), i, n, e[h + 7], 10, 1126891415), r, i, e[h + 14], 15, -1416354905), o, r, e[h + 5], 21, -57434055), n = c(n, o = c(o, r = c(r, i, n, o, e[h + 12], 6, 1700485571), i, n, e[h + 3], 10, -1894986606), r, i, e[h + 10], 15, -1051523), o, r, e[h + 1], 21, -2054922799), n = c(n, o = c(o, r = c(r, i, n, o, e[h + 8], 6, 1873313359), i, n, e[h + 15], 10, -30611744), r, i, e[h + 6], 15, -1560198380), o, r, e[h + 13], 21, 1309151649), n = c(n, o = c(o, r = c(r, i, n, o, e[h + 4], 6, -145523070), i, n, e[h + 11], 10, -1120210379), r, i, e[h + 2], 15, 718787259), o, r, e[h + 9], 21, -343485551), r = u(r, d), i = u(i, l), n = u(n, p), o = u(o, b)
                    }
                    return [r, i, n, o]
                }

                function o(e, t, r, i, n, o) {
                    return u((s = u(u(t, e), u(i, o))) << (a = n) | s >>> 32 - a, r);
                    var s, a
                }

                function s(e, t, r, i, n, s, a) {
                    return o(t & r | ~t & i, e, t, n, s, a)
                }

                function a(e, t, r, i, n, s, a) {
                    return o(t & i | r & ~i, e, t, n, s, a)
                }

                function f(e, t, r, i, n, s, a) {
                    return o(t ^ r ^ i, e, t, n, s, a)
                }

                function c(e, t, r, i, n, s, a) {
                    return o(r ^ (t | ~i), e, t, n, s, a)
                }

                function u(e, t) {
                    var r = (65535 & e) + (65535 & t);
                    return (e >> 16) + (t >> 16) + (r >> 16) << 16 | 65535 & r
                }

                e.exports = function (e) {
                    return i(e, n)
                }
            }, function (e, t, r) {
                "use strict";
                (function (t) {
                    var i = r(0), n = r(87);

                    function o() {
                        n.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520
                    }

                    function s(e, t) {
                        return e << t | e >>> 32 - t
                    }

                    function a(e, t, r, i, n, o, a, f) {
                        return s(e + (t ^ r ^ i) + o + a | 0, f) + n | 0
                    }

                    function f(e, t, r, i, n, o, a, f) {
                        return s(e + (t & r | ~t & i) + o + a | 0, f) + n | 0
                    }

                    function c(e, t, r, i, n, o, a, f) {
                        return s(e + ((t | ~r) ^ i) + o + a | 0, f) + n | 0
                    }

                    function u(e, t, r, i, n, o, a, f) {
                        return s(e + (t & i | r & ~i) + o + a | 0, f) + n | 0
                    }

                    function h(e, t, r, i, n, o, a, f) {
                        return s(e + (t ^ (r | ~i)) + o + a | 0, f) + n | 0
                    }

                    i(o, n), o.prototype._update = function () {
                        for (var e = new Array(16), t = 0; t < 16; ++t) e[t] = this._block.readInt32LE(4 * t);
                        var r = this._a, i = this._b, n = this._c, o = this._d, d = this._e;
                        d = a(d, r = a(r, i, n, o, d, e[0], 0, 11), i, n = s(n, 10), o, e[1], 0, 14), i = a(i = s(i, 10), n = a(n, o = a(o, d, r, i, n, e[2], 0, 15), d, r = s(r, 10), i, e[3], 0, 12), o, d = s(d, 10), r, e[4], 0, 5), o = a(o = s(o, 10), d = a(d, r = a(r, i, n, o, d, e[5], 0, 8), i, n = s(n, 10), o, e[6], 0, 7), r, i = s(i, 10), n, e[7], 0, 9), r = a(r = s(r, 10), i = a(i, n = a(n, o, d, r, i, e[8], 0, 11), o, d = s(d, 10), r, e[9], 0, 13), n, o = s(o, 10), d, e[10], 0, 14), n = a(n = s(n, 10), o = a(o, d = a(d, r, i, n, o, e[11], 0, 15), r, i = s(i, 10), n, e[12], 0, 6), d, r = s(r, 10), i, e[13], 0, 7), d = f(d = s(d, 10), r = a(r, i = a(i, n, o, d, r, e[14], 0, 9), n, o = s(o, 10), d, e[15], 0, 8), i, n = s(n, 10), o, e[7], 1518500249, 7), i = f(i = s(i, 10), n = f(n, o = f(o, d, r, i, n, e[4], 1518500249, 6), d, r = s(r, 10), i, e[13], 1518500249, 8), o, d = s(d, 10), r, e[1], 1518500249, 13), o = f(o = s(o, 10), d = f(d, r = f(r, i, n, o, d, e[10], 1518500249, 11), i, n = s(n, 10), o, e[6], 1518500249, 9), r, i = s(i, 10), n, e[15], 1518500249, 7), r = f(r = s(r, 10), i = f(i, n = f(n, o, d, r, i, e[3], 1518500249, 15), o, d = s(d, 10), r, e[12], 1518500249, 7), n, o = s(o, 10), d, e[0], 1518500249, 12), n = f(n = s(n, 10), o = f(o, d = f(d, r, i, n, o, e[9], 1518500249, 15), r, i = s(i, 10), n, e[5], 1518500249, 9), d, r = s(r, 10), i, e[2], 1518500249, 11), d = f(d = s(d, 10), r = f(r, i = f(i, n, o, d, r, e[14], 1518500249, 7), n, o = s(o, 10), d, e[11], 1518500249, 13), i, n = s(n, 10), o, e[8], 1518500249, 12), i = c(i = s(i, 10), n = c(n, o = c(o, d, r, i, n, e[3], 1859775393, 11), d, r = s(r, 10), i, e[10], 1859775393, 13), o, d = s(d, 10), r, e[14], 1859775393, 6), o = c(o = s(o, 10), d = c(d, r = c(r, i, n, o, d, e[4], 1859775393, 7), i, n = s(n, 10), o, e[9], 1859775393, 14), r, i = s(i, 10), n, e[15], 1859775393, 9), r = c(r = s(r, 10), i = c(i, n = c(n, o, d, r, i, e[8], 1859775393, 13), o, d = s(d, 10), r, e[1], 1859775393, 15), n, o = s(o, 10), d, e[2], 1859775393, 14), n = c(n = s(n, 10), o = c(o, d = c(d, r, i, n, o, e[7], 1859775393, 8), r, i = s(i, 10), n, e[0], 1859775393, 13), d, r = s(r, 10), i, e[6], 1859775393, 6), d = c(d = s(d, 10), r = c(r, i = c(i, n, o, d, r, e[13], 1859775393, 5), n, o = s(o, 10), d, e[11], 1859775393, 12), i, n = s(n, 10), o, e[5], 1859775393, 7), i = u(i = s(i, 10), n = u(n, o = c(o, d, r, i, n, e[12], 1859775393, 5), d, r = s(r, 10), i, e[1], 2400959708, 11), o, d = s(d, 10), r, e[9], 2400959708, 12), o = u(o = s(o, 10), d = u(d, r = u(r, i, n, o, d, e[11], 2400959708, 14), i, n = s(n, 10), o, e[10], 2400959708, 15), r, i = s(i, 10), n, e[0], 2400959708, 14), r = u(r = s(r, 10), i = u(i, n = u(n, o, d, r, i, e[8], 2400959708, 15), o, d = s(d, 10), r, e[12], 2400959708, 9), n, o = s(o, 10), d, e[4], 2400959708, 8), n = u(n = s(n, 10), o = u(o, d = u(d, r, i, n, o, e[13], 2400959708, 9), r, i = s(i, 10), n, e[3], 2400959708, 14), d, r = s(r, 10), i, e[7], 2400959708, 5), d = u(d = s(d, 10), r = u(r, i = u(i, n, o, d, r, e[15], 2400959708, 6), n, o = s(o, 10), d, e[14], 2400959708, 8), i, n = s(n, 10), o, e[5], 2400959708, 6), i = h(i = s(i, 10), n = u(n, o = u(o, d, r, i, n, e[6], 2400959708, 5), d, r = s(r, 10), i, e[2], 2400959708, 12), o, d = s(d, 10), r, e[4], 2840853838, 9), o = h(o = s(o, 10), d = h(d, r = h(r, i, n, o, d, e[0], 2840853838, 15), i, n = s(n, 10), o, e[5], 2840853838, 5), r, i = s(i, 10), n, e[9], 2840853838, 11), r = h(r = s(r, 10), i = h(i, n = h(n, o, d, r, i, e[7], 2840853838, 6), o, d = s(d, 10), r, e[12], 2840853838, 8), n, o = s(o, 10), d, e[2], 2840853838, 13), n = h(n = s(n, 10), o = h(o, d = h(d, r, i, n, o, e[10], 2840853838, 12), r, i = s(i, 10), n, e[14], 2840853838, 5), d, r = s(r, 10), i, e[1], 2840853838, 12), d = h(d = s(d, 10), r = h(r, i = h(i, n, o, d, r, e[3], 2840853838, 13), n, o = s(o, 10), d, e[8], 2840853838, 14), i, n = s(n, 10), o, e[11], 2840853838, 11), i = h(i = s(i, 10), n = h(n, o = h(o, d, r, i, n, e[6], 2840853838, 8), d, r = s(r, 10), i, e[15], 2840853838, 5), o, d = s(d, 10), r, e[13], 2840853838, 6), o = s(o, 10);
                        var l = this._a, p = this._b, b = this._c, y = this._d, v = this._e;
                        v = h(v, l = h(l, p, b, y, v, e[5], 1352829926, 8), p, b = s(b, 10), y, e[14], 1352829926, 9), p = h(p = s(p, 10), b = h(b, y = h(y, v, l, p, b, e[7], 1352829926, 9), v, l = s(l, 10), p, e[0], 1352829926, 11), y, v = s(v, 10), l, e[9], 1352829926, 13), y = h(y = s(y, 10), v = h(v, l = h(l, p, b, y, v, e[2], 1352829926, 15), p, b = s(b, 10), y, e[11], 1352829926, 15), l, p = s(p, 10), b, e[4], 1352829926, 5), l = h(l = s(l, 10), p = h(p, b = h(b, y, v, l, p, e[13], 1352829926, 7), y, v = s(v, 10), l, e[6], 1352829926, 7), b, y = s(y, 10), v, e[15], 1352829926, 8), b = h(b = s(b, 10), y = h(y, v = h(v, l, p, b, y, e[8], 1352829926, 11), l, p = s(p, 10), b, e[1], 1352829926, 14), v, l = s(l, 10), p, e[10], 1352829926, 14), v = u(v = s(v, 10), l = h(l, p = h(p, b, y, v, l, e[3], 1352829926, 12), b, y = s(y, 10), v, e[12], 1352829926, 6), p, b = s(b, 10), y, e[6], 1548603684, 9), p = u(p = s(p, 10), b = u(b, y = u(y, v, l, p, b, e[11], 1548603684, 13), v, l = s(l, 10), p, e[3], 1548603684, 15), y, v = s(v, 10), l, e[7], 1548603684, 7), y = u(y = s(y, 10), v = u(v, l = u(l, p, b, y, v, e[0], 1548603684, 12), p, b = s(b, 10), y, e[13], 1548603684, 8), l, p = s(p, 10), b, e[5], 1548603684, 9), l = u(l = s(l, 10), p = u(p, b = u(b, y, v, l, p, e[10], 1548603684, 11), y, v = s(v, 10), l, e[14], 1548603684, 7), b, y = s(y, 10), v, e[15], 1548603684, 7), b = u(b = s(b, 10), y = u(y, v = u(v, l, p, b, y, e[8], 1548603684, 12), l, p = s(p, 10), b, e[12], 1548603684, 7), v, l = s(l, 10), p, e[4], 1548603684, 6), v = u(v = s(v, 10), l = u(l, p = u(p, b, y, v, l, e[9], 1548603684, 15), b, y = s(y, 10), v, e[1], 1548603684, 13), p, b = s(b, 10), y, e[2], 1548603684, 11), p = c(p = s(p, 10), b = c(b, y = c(y, v, l, p, b, e[15], 1836072691, 9), v, l = s(l, 10), p, e[5], 1836072691, 7), y, v = s(v, 10), l, e[1], 1836072691, 15), y = c(y = s(y, 10), v = c(v, l = c(l, p, b, y, v, e[3], 1836072691, 11), p, b = s(b, 10), y, e[7], 1836072691, 8), l, p = s(p, 10), b, e[14], 1836072691, 6), l = c(l = s(l, 10), p = c(p, b = c(b, y, v, l, p, e[6], 1836072691, 6), y, v = s(v, 10), l, e[9], 1836072691, 14), b, y = s(y, 10), v, e[11], 1836072691, 12), b = c(b = s(b, 10), y = c(y, v = c(v, l, p, b, y, e[8], 1836072691, 13), l, p = s(p, 10), b, e[12], 1836072691, 5), v, l = s(l, 10), p, e[2], 1836072691, 14), v = c(v = s(v, 10), l = c(l, p = c(p, b, y, v, l, e[10], 1836072691, 13), b, y = s(y, 10), v, e[0], 1836072691, 13), p, b = s(b, 10), y, e[4], 1836072691, 7), p = f(p = s(p, 10), b = f(b, y = c(y, v, l, p, b, e[13], 1836072691, 5), v, l = s(l, 10), p, e[8], 2053994217, 15), y, v = s(v, 10), l, e[6], 2053994217, 5), y = f(y = s(y, 10), v = f(v, l = f(l, p, b, y, v, e[4], 2053994217, 8), p, b = s(b, 10), y, e[1], 2053994217, 11), l, p = s(p, 10), b, e[3], 2053994217, 14), l = f(l = s(l, 10), p = f(p, b = f(b, y, v, l, p, e[11], 2053994217, 14), y, v = s(v, 10), l, e[15], 2053994217, 6), b, y = s(y, 10), v, e[0], 2053994217, 14), b = f(b = s(b, 10), y = f(y, v = f(v, l, p, b, y, e[5], 2053994217, 6), l, p = s(p, 10), b, e[12], 2053994217, 9), v, l = s(l, 10), p, e[2], 2053994217, 12), v = f(v = s(v, 10), l = f(l, p = f(p, b, y, v, l, e[13], 2053994217, 9), b, y = s(y, 10), v, e[9], 2053994217, 12), p, b = s(b, 10), y, e[7], 2053994217, 5), p = a(p = s(p, 10), b = f(b, y = f(y, v, l, p, b, e[10], 2053994217, 15), v, l = s(l, 10), p, e[14], 2053994217, 8), y, v = s(v, 10), l, e[12], 0, 8), y = a(y = s(y, 10), v = a(v, l = a(l, p, b, y, v, e[15], 0, 5), p, b = s(b, 10), y, e[10], 0, 12), l, p = s(p, 10), b, e[4], 0, 9), l = a(l = s(l, 10), p = a(p, b = a(b, y, v, l, p, e[1], 0, 12), y, v = s(v, 10), l, e[5], 0, 5), b, y = s(y, 10), v, e[8], 0, 14), b = a(b = s(b, 10), y = a(y, v = a(v, l, p, b, y, e[7], 0, 6), l, p = s(p, 10), b, e[6], 0, 8), v, l = s(l, 10), p, e[2], 0, 13), v = a(v = s(v, 10), l = a(l, p = a(p, b, y, v, l, e[13], 0, 6), b, y = s(y, 10), v, e[14], 0, 5), p, b = s(b, 10), y, e[0], 0, 15), p = a(p = s(p, 10), b = a(b, y = a(y, v, l, p, b, e[3], 0, 13), v, l = s(l, 10), p, e[9], 0, 11), y, v = s(v, 10), l, e[11], 0, 11), y = s(y, 10);
                        var m = this._b + n + y | 0;
                        this._b = this._c + o + v | 0, this._c = this._d + d + l | 0, this._d = this._e + r + p | 0, this._e = this._a + i + b | 0, this._a = m
                    }, o.prototype._digest = function () {
                        this._block[this._blockOffset++] = 128, this._blockOffset > 56 && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update();
                        var e = new t(20);
                        return e.writeInt32LE(this._a, 0), e.writeInt32LE(this._b, 4), e.writeInt32LE(this._c, 8), e.writeInt32LE(this._d, 12), e.writeInt32LE(this._e, 16), e
                    }, e.exports = o
                }).call(t, r(3).Buffer)
            }, function (e, t) {
                function r() {
                    this._events = this._events || {}, this._maxListeners = this._maxListeners || void 0
                }

                function i(e) {
                    return "function" == typeof e
                }

                function n(e) {
                    return "object" == typeof e && null !== e
                }

                function o(e) {
                    return void 0 === e
                }

                e.exports = r, r.EventEmitter = r, r.prototype._events = void 0, r.prototype._maxListeners = void 0, r.defaultMaxListeners = 10, r.prototype.setMaxListeners = function (e) {
                    if ("number" != typeof e || e < 0 || isNaN(e)) throw TypeError("n must be a positive number");
                    return this._maxListeners = e, this
                }, r.prototype.emit = function (e) {
                    var t, r, s, a, f, c;
                    if (this._events || (this._events = {}), "error" === e && (!this._events.error || n(this._events.error) && !this._events.error.length)) {
                        if ((t = arguments[1]) instanceof Error) throw t;
                        var u = new Error('Uncaught, unspecified "error" event. (' + t + ")");
                        throw u.context = t, u
                    }
                    if (o(r = this._events[e])) return !1;
                    if (i(r)) switch (arguments.length) {
                        case 1:
                            r.call(this);
                            break;
                        case 2:
                            r.call(this, arguments[1]);
                            break;
                        case 3:
                            r.call(this, arguments[1], arguments[2]);
                            break;
                        default:
                            a = Array.prototype.slice.call(arguments, 1), r.apply(this, a)
                    } else if (n(r)) for (a = Array.prototype.slice.call(arguments, 1), s = (c = r.slice()).length, f = 0; f < s; f++) c[f].apply(this, a);
                    return !0
                }, r.prototype.addListener = function (e, t) {
                    var s;
                    if (!i(t)) throw TypeError("listener must be a function");
                    return this._events || (this._events = {}), this._events.newListener && this.emit("newListener", e, i(t.listener) ? t.listener : t), this._events[e] ? n(this._events[e]) ? this._events[e].push(t) : this._events[e] = [this._events[e], t] : this._events[e] = t, n(this._events[e]) && !this._events[e].warned && (s = o(this._maxListeners) ? r.defaultMaxListeners : this._maxListeners) && s > 0 && this._events[e].length > s && (this._events[e].warned = !0, console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[e].length), "function" == typeof console.trace && console.trace()), this
                }, r.prototype.on = r.prototype.addListener, r.prototype.once = function (e, t) {
                    if (!i(t)) throw TypeError("listener must be a function");
                    var r = !1;

                    function n() {
                        this.removeListener(e, n), r || (r = !0, t.apply(this, arguments))
                    }

                    return n.listener = t, this.on(e, n), this
                }, r.prototype.removeListener = function (e, t) {
                    var r, o, s, a;
                    if (!i(t)) throw TypeError("listener must be a function");
                    if (!this._events || !this._events[e]) return this;
                    if (s = (r = this._events[e]).length, o = -1, r === t || i(r.listener) && r.listener === t) delete this._events[e], this._events.removeListener && this.emit("removeListener", e, t); else if (n(r)) {
                        for (a = s; a-- > 0;) if (r[a] === t || r[a].listener && r[a].listener === t) {
                            o = a;
                            break
                        }
                        if (o < 0) return this;
                        1 === r.length ? (r.length = 0, delete this._events[e]) : r.splice(o, 1), this._events.removeListener && this.emit("removeListener", e, t)
                    }
                    return this
                }, r.prototype.removeAllListeners = function (e) {
                    var t, r;
                    if (!this._events) return this;
                    if (!this._events.removeListener) return 0 === arguments.length ? this._events = {} : this._events[e] && delete this._events[e], this;
                    if (0 === arguments.length) {
                        for (t in this._events) "removeListener" !== t && this.removeAllListeners(t);
                        return this.removeAllListeners("removeListener"), this._events = {}, this
                    }
                    if (i(r = this._events[e])) this.removeListener(e, r); else if (r) for (; r.length;) this.removeListener(e, r[r.length - 1]);
                    return delete this._events[e], this
                }, r.prototype.listeners = function (e) {
                    return this._events && this._events[e] ? i(this._events[e]) ? [this._events[e]] : this._events[e].slice() : []
                }, r.prototype.listenerCount = function (e) {
                    if (this._events) {
                        var t = this._events[e];
                        if (i(t)) return 1;
                        if (t) return t.length
                    }
                    return 0
                }, r.listenerCount = function (e, t) {
                    return e.listenerCount(t)
                }
            }, function (e, t, r) {
                (t = e.exports = r(42)).Stream = t, t.Readable = t, t.Writable = r(32), t.Duplex = r(12), t.Transform = r(45), t.PassThrough = r(93)
            }, function (e, t, r) {
                "use strict";
                (function (t, i, n) {
                    var o = r(22);

                    function s(e) {
                        var t = this;
                        this.next = null, this.entry = null, this.finish = function () {
                            !function (e, t, r) {
                                var i = e.entry;
                                for (e.entry = null; i;) {
                                    var n = i.callback;
                                    t.pendingcb--, n(void 0), i = i.next
                                }
                                t.corkedRequestsFree ? t.corkedRequestsFree.next = e : t.corkedRequestsFree = e
                            }(t, e)
                        }
                    }

                    e.exports = m;
                    var a, f = !t.browser && ["v0.10", "v0.9."].indexOf(t.version.slice(0, 5)) > -1 ? i : o;
                    m.WritableState = v;
                    var c = r(16);
                    c.inherits = r(0);
                    var u, h = {deprecate: r(92)}, d = r(43), l = r(1).Buffer, p = n.Uint8Array || function () {
                    }, b = r(44);

                    function y() {
                    }

                    function v(e, t) {
                        a = a || r(12), e = e || {}, this.objectMode = !!e.objectMode, t instanceof a && (this.objectMode = this.objectMode || !!e.writableObjectMode);
                        var i = e.highWaterMark, n = this.objectMode ? 16 : 16384;
                        this.highWaterMark = i || 0 === i ? i : n, this.highWaterMark = Math.floor(this.highWaterMark), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
                        var c = !1 === e.decodeStrings;
                        this.decodeStrings = !c, this.defaultEncoding = e.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function (e) {
                            !function (e, t) {
                                var r = e._writableState, i = r.sync, n = r.writecb;
                                if (function (e) {
                                        e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0
                                    }(r), t) !function (e, t, r, i, n) {
                                    --t.pendingcb, r ? (o(n, i), o(A, e, t), e._writableState.errorEmitted = !0, e.emit("error", i)) : (n(i), e._writableState.errorEmitted = !0, e.emit("error", i), A(e, t))
                                }(e, r, i, t, n); else {
                                    var s = S(r);
                                    s || r.corked || r.bufferProcessing || !r.bufferedRequest || _(e, r), i ? f(w, e, r, s, n) : w(e, r, s, n)
                                }
                            }(t, e)
                        }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new s(this)
                    }

                    function m(e) {
                        if (a = a || r(12), !(u.call(m, this) || this instanceof a)) return new m(e);
                        this._writableState = new v(e, this), this.writable = !0, e && ("function" == typeof e.write && (this._write = e.write), "function" == typeof e.writev && (this._writev = e.writev), "function" == typeof e.destroy && (this._destroy = e.destroy), "function" == typeof e.final && (this._final = e.final)), d.call(this)
                    }

                    function g(e, t, r, i, n, o, s) {
                        t.writelen = i, t.writecb = s, t.writing = !0, t.sync = !0, r ? e._writev(n, t.onwrite) : e._write(n, o, t.onwrite), t.sync = !1
                    }

                    function w(e, t, r, i) {
                        r || function (e, t) {
                            0 === t.length && t.needDrain && (t.needDrain = !1, e.emit("drain"))
                        }(e, t), t.pendingcb--, i(), A(e, t)
                    }

                    function _(e, t) {
                        t.bufferProcessing = !0;
                        var r = t.bufferedRequest;
                        if (e._writev && r && r.next) {
                            var i = t.bufferedRequestCount, n = new Array(i), o = t.corkedRequestsFree;
                            o.entry = r;
                            for (var a = 0, f = !0; r;) n[a] = r, r.isBuf || (f = !1), r = r.next, a += 1;
                            n.allBuffers = f, g(e, t, !0, t.length, n, "", o.finish), t.pendingcb++, t.lastBufferedRequest = null, o.next ? (t.corkedRequestsFree = o.next, o.next = null) : t.corkedRequestsFree = new s(t)
                        } else {
                            for (; r;) {
                                var c = r.chunk, u = r.encoding, h = r.callback;
                                if (g(e, t, !1, t.objectMode ? 1 : c.length, c, u, h), r = r.next, t.writing) break
                            }
                            null === r && (t.lastBufferedRequest = null)
                        }
                        t.bufferedRequestCount = 0, t.bufferedRequest = r, t.bufferProcessing = !1
                    }

                    function S(e) {
                        return e.ending && 0 === e.length && null === e.bufferedRequest && !e.finished && !e.writing
                    }

                    function k(e, t) {
                        e._final(function (r) {
                            t.pendingcb--, r && e.emit("error", r), t.prefinished = !0, e.emit("prefinish"), A(e, t)
                        })
                    }

                    function A(e, t) {
                        var r = S(t);
                        return r && (function (e, t) {
                            t.prefinished || t.finalCalled || ("function" == typeof e._final ? (t.pendingcb++, t.finalCalled = !0, o(k, e, t)) : (t.prefinished = !0, e.emit("prefinish")))
                        }(e, t), 0 === t.pendingcb && (t.finished = !0, e.emit("finish"))), r
                    }

                    c.inherits(m, d), v.prototype.getBuffer = function () {
                        for (var e = this.bufferedRequest, t = []; e;) t.push(e), e = e.next;
                        return t
                    }, function () {
                        try {
                            Object.defineProperty(v.prototype, "buffer", {
                                get: h.deprecate(function () {
                                    return this.getBuffer()
                                }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
                            })
                        } catch (e) {
                        }
                    }(), "function" == typeof Symbol && Symbol.hasInstance && "function" == typeof Function.prototype[Symbol.hasInstance] ? (u = Function.prototype[Symbol.hasInstance], Object.defineProperty(m, Symbol.hasInstance, {
                        value: function (e) {
                            return !!u.call(this, e) || e && e._writableState instanceof v
                        }
                    })) : u = function (e) {
                        return e instanceof this
                    }, m.prototype.pipe = function () {
                        this.emit("error", new Error("Cannot pipe, not readable"))
                    }, m.prototype.write = function (e, t, r) {
                        var i, n = this._writableState, s = !1,
                            a = (i = e, (l.isBuffer(i) || i instanceof p) && !n.objectMode);
                        return a && !l.isBuffer(e) && (e = function (e) {
                            return l.from(e)
                        }(e)), "function" == typeof t && (r = t, t = null), a ? t = "buffer" : t || (t = n.defaultEncoding), "function" != typeof r && (r = y), n.ended ? function (e, t) {
                            var r = new Error("write after end");
                            e.emit("error", r), o(t, r)
                        }(this, r) : (a || function (e, t, r, i) {
                            var n = !0, s = !1;
                            return null === r ? s = new TypeError("May not write null values to stream") : "string" == typeof r || void 0 === r || t.objectMode || (s = new TypeError("Invalid non-string/buffer chunk")), s && (e.emit("error", s), o(i, s), n = !1), n
                        }(this, n, e, r)) && (n.pendingcb++, s = function (e, t, r, i, n, o) {
                            if (!r) {
                                var s = function (e, t, r) {
                                    return e.objectMode || !1 === e.decodeStrings || "string" != typeof t || (t = l.from(t, r)), t
                                }(t, i, n);
                                i !== s && (r = !0, n = "buffer", i = s)
                            }
                            var a = t.objectMode ? 1 : i.length;
                            t.length += a;
                            var f = t.length < t.highWaterMark;
                            if (f || (t.needDrain = !0), t.writing || t.corked) {
                                var c = t.lastBufferedRequest;
                                t.lastBufferedRequest = {
                                    chunk: i,
                                    encoding: n,
                                    isBuf: r,
                                    callback: o,
                                    next: null
                                }, c ? c.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest, t.bufferedRequestCount += 1
                            } else g(e, t, !1, a, i, n, o);
                            return f
                        }(this, n, a, e, t, r)), s
                    }, m.prototype.cork = function () {
                        this._writableState.corked++
                    }, m.prototype.uncork = function () {
                        var e = this._writableState;
                        e.corked && (e.corked--, e.writing || e.corked || e.finished || e.bufferProcessing || !e.bufferedRequest || _(this, e))
                    }, m.prototype.setDefaultEncoding = function (e) {
                        if ("string" == typeof e && (e = e.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((e + "").toLowerCase()) > -1)) throw new TypeError("Unknown encoding: " + e);
                        return this._writableState.defaultEncoding = e, this
                    }, m.prototype._write = function (e, t, r) {
                        r(new Error("_write() is not implemented"))
                    }, m.prototype._writev = null, m.prototype.end = function (e, t, r) {
                        var i = this._writableState;
                        "function" == typeof e ? (r = e, e = null, t = null) : "function" == typeof t && (r = t, t = null), null != e && this.write(e, t), i.corked && (i.corked = 1, this.uncork()), i.ending || i.finished || function (e, t, r) {
                            t.ending = !0, A(e, t), r && (t.finished ? o(r) : e.once("finish", r)), t.ended = !0, e.writable = !1
                        }(this, i, r)
                    }, Object.defineProperty(m.prototype, "destroyed", {
                        get: function () {
                            return void 0 !== this._writableState && this._writableState.destroyed
                        }, set: function (e) {
                            this._writableState && (this._writableState.destroyed = e)
                        }
                    }), m.prototype.destroy = b.destroy, m.prototype._undestroy = b.undestroy, m.prototype._destroy = function (e, t) {
                        this.end(), t(e)
                    }
                }).call(t, r(8), r(90).setImmediate, r(7))
            }, function (e, t, r) {
                "use strict";
                var i = r(1).Buffer, n = i.isEncoding || function (e) {
                    switch ((e = "" + e) && e.toLowerCase()) {
                        case"hex":
                        case"utf8":
                        case"utf-8":
                        case"ascii":
                        case"binary":
                        case"base64":
                        case"ucs2":
                        case"ucs-2":
                        case"utf16le":
                        case"utf-16le":
                        case"raw":
                            return !0;
                        default:
                            return !1
                    }
                };

                function o(e) {
                    var t;
                    switch (this.encoding = function (e) {
                        var t = function (e) {
                            if (!e) return "utf8";
                            for (var t; ;) switch (e) {
                                case"utf8":
                                case"utf-8":
                                    return "utf8";
                                case"ucs2":
                                case"ucs-2":
                                case"utf16le":
                                case"utf-16le":
                                    return "utf16le";
                                case"latin1":
                                case"binary":
                                    return "latin1";
                                case"base64":
                                case"ascii":
                                case"hex":
                                    return e;
                                default:
                                    if (t) return;
                                    e = ("" + e).toLowerCase(), t = !0
                            }
                        }(e);
                        if ("string" != typeof t && (i.isEncoding === n || !n(e))) throw new Error("Unknown encoding: " + e);
                        return t || e
                    }(e), this.encoding) {
                        case"utf16le":
                            this.text = f, this.end = c, t = 4;
                            break;
                        case"utf8":
                            this.fillLast = a, t = 4;
                            break;
                        case"base64":
                            this.text = u, this.end = h, t = 3;
                            break;
                        default:
                            return this.write = d, void(this.end = l)
                    }
                    this.lastNeed = 0, this.lastTotal = 0, this.lastChar = i.allocUnsafe(t)
                }

                function s(e) {
                    return e <= 127 ? 0 : e >> 5 == 6 ? 2 : e >> 4 == 14 ? 3 : e >> 3 == 30 ? 4 : -1
                }

                function a(e) {
                    var t = this.lastTotal - this.lastNeed, r = function (e, t, r) {
                        if (128 != (192 & t[0])) return e.lastNeed = 0, "�".repeat(r);
                        if (e.lastNeed > 1 && t.length > 1) {
                            if (128 != (192 & t[1])) return e.lastNeed = 1, "�".repeat(r + 1);
                            if (e.lastNeed > 2 && t.length > 2 && 128 != (192 & t[2])) return e.lastNeed = 2, "�".repeat(r + 2)
                        }
                    }(this, e, t);
                    return void 0 !== r ? r : this.lastNeed <= e.length ? (e.copy(this.lastChar, t, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal)) : (e.copy(this.lastChar, t, 0, e.length), void(this.lastNeed -= e.length))
                }

                function f(e, t) {
                    if ((e.length - t) % 2 == 0) {
                        var r = e.toString("utf16le", t);
                        if (r) {
                            var i = r.charCodeAt(r.length - 1);
                            if (i >= 55296 && i <= 56319) return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = e[e.length - 2], this.lastChar[1] = e[e.length - 1], r.slice(0, -1)
                        }
                        return r
                    }
                    return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = e[e.length - 1], e.toString("utf16le", t, e.length - 1)
                }

                function c(e) {
                    var t = e && e.length ? this.write(e) : "";
                    if (this.lastNeed) {
                        var r = this.lastTotal - this.lastNeed;
                        return t + this.lastChar.toString("utf16le", 0, r)
                    }
                    return t
                }

                function u(e, t) {
                    var r = (e.length - t) % 3;
                    return 0 === r ? e.toString("base64", t) : (this.lastNeed = 3 - r, this.lastTotal = 3, 1 === r ? this.lastChar[0] = e[e.length - 1] : (this.lastChar[0] = e[e.length - 2], this.lastChar[1] = e[e.length - 1]), e.toString("base64", t, e.length - r))
                }

                function h(e) {
                    var t = e && e.length ? this.write(e) : "";
                    return this.lastNeed ? t + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : t
                }

                function d(e) {
                    return e.toString(this.encoding)
                }

                function l(e) {
                    return e && e.length ? this.write(e) : ""
                }

                t.StringDecoder = o, o.prototype.write = function (e) {
                    if (0 === e.length) return "";
                    var t, r;
                    if (this.lastNeed) {
                        if (void 0 === (t = this.fillLast(e))) return "";
                        r = this.lastNeed, this.lastNeed = 0
                    } else r = 0;
                    return r < e.length ? t ? t + this.text(e, r) : this.text(e, r) : t || ""
                }, o.prototype.end = function (e) {
                    var t = e && e.length ? this.write(e) : "";
                    return this.lastNeed ? t + "�".repeat(this.lastTotal - this.lastNeed) : t
                }, o.prototype.text = function (e, t) {
                    var r = function (e, t, r) {
                        var i = t.length - 1;
                        if (i < r) return 0;
                        var n = s(t[i]);
                        return n >= 0 ? (n > 0 && (e.lastNeed = n - 1), n) : --i < r ? 0 : (n = s(t[i])) >= 0 ? (n > 0 && (e.lastNeed = n - 2), n) : --i < r ? 0 : (n = s(t[i])) >= 0 ? (n > 0 && (2 === n ? n = 0 : e.lastNeed = n - 3), n) : 0
                    }(this, e, t);
                    if (!this.lastNeed) return e.toString("utf8", t);
                    this.lastTotal = r;
                    var i = e.length - (r - this.lastNeed);
                    return e.copy(this.lastChar, 0, i), e.toString("utf8", t, i)
                }, o.prototype.fillLast = function (e) {
                    if (this.lastNeed <= e.length) return e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
                    e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e.length), this.lastNeed -= e.length
                }
            }, function (e, t, r) {
                (t = e.exports = function (e) {
                    e = e.toLowerCase();
                    var r = t[e];
                    if (!r) throw new Error(e + " is not supported (we accept pull requests)");
                    return new r
                }).sha = r(98), t.sha1 = r(99), t.sha224 = r(100), t.sha256 = r(46), t.sha384 = r(101), t.sha512 = r(47)
            }, function (e, t, r) {
                var i = r(108), n = r(116), o = r(56);
                t.createCipher = t.Cipher = i.createCipher, t.createCipheriv = t.Cipheriv = i.createCipheriv, t.createDecipher = t.Decipher = n.createDecipher, t.createDecipheriv = t.Decipheriv = n.createDecipheriv, t.listCiphers = t.getCiphers = function () {
                    return Object.keys(o)
                }
            }, function (e, t, r) {
                var i = {
                    ECB: r(109),
                    CBC: r(110),
                    CFB: r(111),
                    CFB8: r(112),
                    CFB1: r(113),
                    OFB: r(114),
                    CTR: r(54),
                    GCM: r(54)
                }, n = r(56);
                for (var o in n) n[o].module = i[n[o].mode];
                e.exports = n
            }, function (e, t, r) {
                "use strict";
                t.utils = r(118), t.Cipher = r(119), t.DES = r(120), t.CBC = r(121), t.EDE = r(122)
            }, function (e, t, r) {
                (function (t) {
                    var i = r(2), n = r(13);

                    function o(e, r) {
                        var n = function (e) {
                                var t = s(e);
                                return {
                                    blinder: t.toRed(i.mont(e.modulus)).redPow(new i(e.publicExponent)).fromRed(),
                                    unblinder: t.invm(e.modulus)
                                }
                            }(r), o = r.modulus.byteLength(),
                            a = (i.mont(r.modulus), new i(e).mul(n.blinder).umod(r.modulus)),
                            f = a.toRed(i.mont(r.prime1)), c = a.toRed(i.mont(r.prime2)), u = r.coefficient,
                            h = r.prime1, d = r.prime2, l = f.redPow(r.exponent1), p = c.redPow(r.exponent2);
                        l = l.fromRed(), p = p.fromRed();
                        var b = l.isub(p).imul(u).umod(h);
                        return b.imul(d), p.iadd(b), new t(p.imul(n.unblinder).umod(r.modulus).toArray(!1, o))
                    }

                    function s(e) {
                        for (var t = e.modulus.byteLength(), r = new i(n(t)); r.cmp(e.modulus) >= 0 || !r.umod(e.prime1) || !r.umod(e.prime2);) r = new i(n(t));
                        return r
                    }

                    e.exports = o, o.getr = s
                }).call(t, r(3).Buffer)
            }, function (e, t, r) {
                var i = t;
                i.utils = r(6), i.common = r(18), i.sha = r(137), i.ripemd = r(141), i.hmac = r(142), i.sha1 = i.sha.sha1, i.sha256 = i.sha.sha256, i.sha224 = i.sha.sha224, i.sha384 = i.sha.sha384, i.sha512 = i.sha.sha512, i.ripemd160 = i.ripemd.ripemd160
            }, function (e, t, r) {
                "use strict";
                const i = r(2), n = r(11), o = r(74), s = r(10);

                class a extends s.Scalar {
                    constructor(e, t) {
                        super(), this.ref = {
                            arr: new i(0, 16).toRed(t),
                            curve: e,
                            red: t
                        }, this.inspect = this.toString.bind(this), this.string = this.toString.bind(this)
                    }

                    equal(e) {
                        return 0 == this.ref.arr.fromRed().cmp(e.ref.arr.fromRed())
                    }

                    set(e) {
                        return this.ref = e.ref, this
                    }

                    clone() {
                        return new a(this.ref.curve, this.ref.red).setBytes(new Uint8Array(this.ref.arr.fromRed().toArray("le")))
                    }

                    zero() {
                        return this.ref.arr = new i(0, 16).toRed(this.ref.red), this
                    }

                    add(e, t) {
                        return this.ref.arr = e.ref.arr.redAdd(t.ref.arr), this
                    }

                    sub(e, t) {
                        return this.ref.arr = e.ref.arr.redSub(t.ref.arr), this
                    }

                    neg(e) {
                        return this.ref.arr = e.ref.arr.redNeg(), this
                    }

                    one() {
                        return this.ref.arr = new i(1, 16).toRed(this.ref.red), this
                    }

                    mul(e, t) {
                        return this.ref.arr = e.ref.arr.redMul(t.ref.arr), this
                    }

                    div(e, t) {
                        return this.ref.arr = e.ref.arr.redMul(t.ref.arr.redInvm()), this
                    }

                    inv(e) {
                        return this.ref.arr = e.ref.arr.redInvm(), this
                    }

                    setBytes(e) {
                        if (e.constructor !== Uint8Array) throw new TypeError;
                        return this.ref.arr = new i(e, 16, "le").toRed(this.ref.red), this
                    }

                    bytes() {
                        return new Uint8Array(this.ref.arr.fromRed().toArray("be"))
                    }

                    toString() {
                        let e = this.ref.arr.fromRed().toArray("le", 32);
                        return Array.from(e, e => ("0" + (255 & e).toString(16)).slice(-2)).join("")
                    }

                    pick(e) {
                        return e = e || n.randomBytes, bytes = o.int(this.ref.curve.curve.n, e), this.ref.arr = new i(bytes, 16).toRed(this.ref.red), this
                    }

                    marshalSize() {
                        return 32
                    }

                    marshalBinary() {
                        return new Uint8Array(this.ref.arr.fromRed().toArray("le", 32))
                    }

                    unmarshalBinary(e) {
                        if (e.constructor !== Uint8Array) throw new TypeError("bytes should be Uint8Array");
                        if (e.length > this.marshalSize()) throw new Error("bytes.length > marshalSize");
                        this.ref.arr = new i(e, 16, "le").toRed(this.ref.red)
                    }
                }

                e.exports = a
            }, function (e, t) {
                var r = {}.toString;
                e.exports = Array.isArray || function (e) {
                    return "[object Array]" == r.call(e)
                }
            }, function (e, t, r) {
                "use strict";
                (function (t, i) {
                    var n = r(22);
                    e.exports = g;
                    var o, s = r(41);
                    g.ReadableState = m, r(30).EventEmitter;
                    var a = function (e, t) {
                        return e.listeners(t).length
                    }, f = r(43), c = r(1).Buffer, u = t.Uint8Array || function () {
                    }, h = r(16);
                    h.inherits = r(0);
                    var d = r(88), l = void 0;
                    l = d && d.debuglog ? d.debuglog("stream") : function () {
                    };
                    var p, b = r(89), y = r(44);
                    h.inherits(g, f);
                    var v = ["error", "close", "destroy", "pause", "resume"];

                    function m(e, t) {
                        o = o || r(12), e = e || {}, this.objectMode = !!e.objectMode, t instanceof o && (this.objectMode = this.objectMode || !!e.readableObjectMode);
                        var i = e.highWaterMark, n = this.objectMode ? 16 : 16384;
                        this.highWaterMark = i || 0 === i ? i : n, this.highWaterMark = Math.floor(this.highWaterMark), this.buffer = new b, this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.destroyed = !1, this.defaultEncoding = e.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, e.encoding && (p || (p = r(33).StringDecoder), this.decoder = new p(e.encoding), this.encoding = e.encoding)
                    }

                    function g(e) {
                        if (o = o || r(12), !(this instanceof g)) return new g(e);
                        this._readableState = new m(e, this), this.readable = !0, e && ("function" == typeof e.read && (this._read = e.read), "function" == typeof e.destroy && (this._destroy = e.destroy)), f.call(this)
                    }

                    function w(e, t, r, i, n) {
                        var o, s = e._readableState;
                        return null === t ? (s.reading = !1, function (e, t) {
                            if (!t.ended) {
                                if (t.decoder) {
                                    var r = t.decoder.end();
                                    r && r.length && (t.buffer.push(r), t.length += t.objectMode ? 1 : r.length)
                                }
                                t.ended = !0, A(e)
                            }
                        }(e, s)) : (n || (o = function (e, t) {
                            var r, i;
                            return i = t, c.isBuffer(i) || i instanceof u || "string" == typeof t || void 0 === t || e.objectMode || (r = new TypeError("Invalid non-string/buffer chunk")), r
                        }(s, t)), o ? e.emit("error", o) : s.objectMode || t && t.length > 0 ? ("string" == typeof t || s.objectMode || Object.getPrototypeOf(t) === c.prototype || (t = function (e) {
                            return c.from(e)
                        }(t)), i ? s.endEmitted ? e.emit("error", new Error("stream.unshift() after end event")) : _(e, s, t, !0) : s.ended ? e.emit("error", new Error("stream.push() after EOF")) : (s.reading = !1, s.decoder && !r ? (t = s.decoder.write(t), s.objectMode || 0 !== t.length ? _(e, s, t, !1) : x(e, s)) : _(e, s, t, !1))) : i || (s.reading = !1)), function (e) {
                            return !e.ended && (e.needReadable || e.length < e.highWaterMark || 0 === e.length)
                        }(s)
                    }

                    function _(e, t, r, i) {
                        t.flowing && 0 === t.length && !t.sync ? (e.emit("data", r), e.read(0)) : (t.length += t.objectMode ? 1 : r.length, i ? t.buffer.unshift(r) : t.buffer.push(r), t.needReadable && A(e)), x(e, t)
                    }

                    Object.defineProperty(g.prototype, "destroyed", {
                        get: function () {
                            return void 0 !== this._readableState && this._readableState.destroyed
                        }, set: function (e) {
                            this._readableState && (this._readableState.destroyed = e)
                        }
                    }), g.prototype.destroy = y.destroy, g.prototype._undestroy = y.undestroy, g.prototype._destroy = function (e, t) {
                        this.push(null), t(e)
                    }, g.prototype.push = function (e, t) {
                        var r, i = this._readableState;
                        return i.objectMode ? r = !0 : "string" == typeof e && ((t = t || i.defaultEncoding) !== i.encoding && (e = c.from(e, t), t = ""), r = !0), w(this, e, t, !1, r)
                    }, g.prototype.unshift = function (e) {
                        return w(this, e, null, !0, !1)
                    }, g.prototype.isPaused = function () {
                        return !1 === this._readableState.flowing
                    }, g.prototype.setEncoding = function (e) {
                        return p || (p = r(33).StringDecoder), this._readableState.decoder = new p(e), this._readableState.encoding = e, this
                    };
                    var S = 8388608;

                    function k(e, t) {
                        return e <= 0 || 0 === t.length && t.ended ? 0 : t.objectMode ? 1 : e != e ? t.flowing && t.length ? t.buffer.head.data.length : t.length : (e > t.highWaterMark && (t.highWaterMark = function (e) {
                            return e >= S ? e = S : (e--, e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, e |= e >>> 8, e |= e >>> 16, e++), e
                        }(e)), e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0, 0))
                    }

                    function A(e) {
                        var t = e._readableState;
                        t.needReadable = !1, t.emittedReadable || (l("emitReadable", t.flowing), t.emittedReadable = !0, t.sync ? n(E, e) : E(e))
                    }

                    function E(e) {
                        l("emit readable"), e.emit("readable"), I(e)
                    }

                    function x(e, t) {
                        t.readingMore || (t.readingMore = !0, n(M, e, t))
                    }

                    function M(e, t) {
                        for (var r = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark && (l("maybeReadMore read 0"), e.read(0), r !== t.length);) r = t.length;
                        t.readingMore = !1
                    }

                    function B(e) {
                        l("readable nexttick read 0"), e.read(0)
                    }

                    function R(e, t) {
                        t.reading || (l("resume read 0"), e.read(0)), t.resumeScheduled = !1, t.awaitDrain = 0, e.emit("resume"), I(e), t.flowing && !t.reading && e.read(0)
                    }

                    function I(e) {
                        var t = e._readableState;
                        for (l("flow", t.flowing); t.flowing && null !== e.read();) ;
                    }

                    function T(e, t) {
                        return 0 === t.length ? null : (t.objectMode ? r = t.buffer.shift() : !e || e >= t.length ? (r = t.decoder ? t.buffer.join("") : 1 === t.buffer.length ? t.buffer.head.data : t.buffer.concat(t.length), t.buffer.clear()) : r = function (e, t, r) {
                            var i;
                            return e < t.head.data.length ? (i = t.head.data.slice(0, e), t.head.data = t.head.data.slice(e)) : i = e === t.head.data.length ? t.shift() : r ? function (e, t) {
                                var r = t.head, i = 1, n = r.data;
                                for (e -= n.length; r = r.next;) {
                                    var o = r.data, s = e > o.length ? o.length : e;
                                    if (s === o.length ? n += o : n += o.slice(0, e), 0 == (e -= s)) {
                                        s === o.length ? (++i, r.next ? t.head = r.next : t.head = t.tail = null) : (t.head = r, r.data = o.slice(s));
                                        break
                                    }
                                    ++i
                                }
                                return t.length -= i, n
                            }(e, t) : function (e, t) {
                                var r = c.allocUnsafe(e), i = t.head, n = 1;
                                for (i.data.copy(r), e -= i.data.length; i = i.next;) {
                                    var o = i.data, s = e > o.length ? o.length : e;
                                    if (o.copy(r, r.length - e, 0, s), 0 == (e -= s)) {
                                        s === o.length ? (++n, i.next ? t.head = i.next : t.head = t.tail = null) : (t.head = i, i.data = o.slice(s));
                                        break
                                    }
                                    ++n
                                }
                                return t.length -= n, r
                            }(e, t), i
                        }(e, t.buffer, t.decoder), r);
                        var r
                    }

                    function j(e) {
                        var t = e._readableState;
                        if (t.length > 0) throw new Error('"endReadable()" called on non-empty stream');
                        t.endEmitted || (t.ended = !0, n(O, t, e))
                    }

                    function O(e, t) {
                        e.endEmitted || 0 !== e.length || (e.endEmitted = !0, t.readable = !1, t.emit("end"))
                    }

                    function P(e, t) {
                        for (var r = 0, i = e.length; r < i; r++) if (e[r] === t) return r;
                        return -1
                    }

                    g.prototype.read = function (e) {
                        l("read", e), e = parseInt(e, 10);
                        var t = this._readableState, r = e;
                        if (0 !== e && (t.emittedReadable = !1), 0 === e && t.needReadable && (t.length >= t.highWaterMark || t.ended)) return l("read: emitReadable", t.length, t.ended), 0 === t.length && t.ended ? j(this) : A(this), null;
                        if (0 === (e = k(e, t)) && t.ended) return 0 === t.length && j(this), null;
                        var i, n = t.needReadable;
                        return l("need readable", n), (0 === t.length || t.length - e < t.highWaterMark) && l("length less than watermark", n = !0), t.ended || t.reading ? l("reading or ended", n = !1) : n && (l("do read"), t.reading = !0, t.sync = !0, 0 === t.length && (t.needReadable = !0), this._read(t.highWaterMark), t.sync = !1, t.reading || (e = k(r, t))), null === (i = e > 0 ? T(e, t) : null) ? (t.needReadable = !0, e = 0) : t.length -= e, 0 === t.length && (t.ended || (t.needReadable = !0), r !== e && t.ended && j(this)), null !== i && this.emit("data", i), i
                    }, g.prototype._read = function (e) {
                        this.emit("error", new Error("_read() is not implemented"))
                    }, g.prototype.pipe = function (e, t) {
                        var r = this, o = this._readableState;
                        switch (o.pipesCount) {
                            case 0:
                                o.pipes = e;
                                break;
                            case 1:
                                o.pipes = [o.pipes, e];
                                break;
                            default:
                                o.pipes.push(e)
                        }
                        o.pipesCount += 1, l("pipe count=%d opts=%j", o.pipesCount, t);
                        var f = t && !1 === t.end || e === i.stdout || e === i.stderr ? m : c;

                        function c() {
                            l("onend"), e.end()
                        }

                        o.endEmitted ? n(f) : r.once("end", f), e.on("unpipe", function t(i, n) {
                            l("onunpipe"), i === r && n && !1 === n.hasUnpiped && (n.hasUnpiped = !0, l("cleanup"), e.removeListener("close", y), e.removeListener("finish", v), e.removeListener("drain", u), e.removeListener("error", b), e.removeListener("unpipe", t), r.removeListener("end", c), r.removeListener("end", m), r.removeListener("data", p), h = !0, !o.awaitDrain || e._writableState && !e._writableState.needDrain || u())
                        });
                        var u = function (e) {
                            return function () {
                                var t = e._readableState;
                                l("pipeOnDrain", t.awaitDrain), t.awaitDrain && t.awaitDrain--, 0 === t.awaitDrain && a(e, "data") && (t.flowing = !0, I(e))
                            }
                        }(r);
                        e.on("drain", u);
                        var h = !1, d = !1;

                        function p(t) {
                            l("ondata"), d = !1, !1 !== e.write(t) || d || ((1 === o.pipesCount && o.pipes === e || o.pipesCount > 1 && -1 !== P(o.pipes, e)) && !h && (l("false write response, pause", r._readableState.awaitDrain), r._readableState.awaitDrain++, d = !0), r.pause())
                        }

                        function b(t) {
                            l("onerror", t), m(), e.removeListener("error", b), 0 === a(e, "error") && e.emit("error", t)
                        }

                        function y() {
                            e.removeListener("finish", v), m()
                        }

                        function v() {
                            l("onfinish"), e.removeListener("close", y), m()
                        }

                        function m() {
                            l("unpipe"), r.unpipe(e)
                        }

                        return r.on("data", p), function (e, t, r) {
                            if ("function" == typeof e.prependListener) return e.prependListener(t, r);
                            e._events && e._events[t] ? s(e._events[t]) ? e._events[t].unshift(r) : e._events[t] = [r, e._events[t]] : e.on(t, r)
                        }(e, "error", b), e.once("close", y), e.once("finish", v), e.emit("pipe", r), o.flowing || (l("pipe resume"), r.resume()), e
                    }, g.prototype.unpipe = function (e) {
                        var t = this._readableState, r = {hasUnpiped: !1};
                        if (0 === t.pipesCount) return this;
                        if (1 === t.pipesCount) return e && e !== t.pipes ? this : (e || (e = t.pipes), t.pipes = null, t.pipesCount = 0, t.flowing = !1, e && e.emit("unpipe", this, r), this);
                        if (!e) {
                            var i = t.pipes, n = t.pipesCount;
                            t.pipes = null, t.pipesCount = 0, t.flowing = !1;
                            for (var o = 0; o < n; o++) i[o].emit("unpipe", this, r);
                            return this
                        }
                        var s = P(t.pipes, e);
                        return -1 === s ? this : (t.pipes.splice(s, 1), t.pipesCount -= 1, 1 === t.pipesCount && (t.pipes = t.pipes[0]), e.emit("unpipe", this, r), this)
                    }, g.prototype.on = function (e, t) {
                        var r = f.prototype.on.call(this, e, t);
                        if ("data" === e) !1 !== this._readableState.flowing && this.resume(); else if ("readable" === e) {
                            var i = this._readableState;
                            i.endEmitted || i.readableListening || (i.readableListening = i.needReadable = !0, i.emittedReadable = !1, i.reading ? i.length && A(this) : n(B, this))
                        }
                        return r
                    }, g.prototype.addListener = g.prototype.on, g.prototype.resume = function () {
                        var e = this._readableState;
                        return e.flowing || (l("resume"), e.flowing = !0, function (e, t) {
                            t.resumeScheduled || (t.resumeScheduled = !0, n(R, e, t))
                        }(this, e)), this
                    }, g.prototype.pause = function () {
                        return l("call pause flowing=%j", this._readableState.flowing), !1 !== this._readableState.flowing && (l("pause"), this._readableState.flowing = !1, this.emit("pause")), this
                    }, g.prototype.wrap = function (e) {
                        var t = this._readableState, r = !1, i = this;
                        for (var n in e.on("end", function () {
                            if (l("wrapped end"), t.decoder && !t.ended) {
                                var e = t.decoder.end();
                                e && e.length && i.push(e)
                            }
                            i.push(null)
                        }), e.on("data", function (n) {
                            l("wrapped data"), t.decoder && (n = t.decoder.write(n)), (!t.objectMode || null != n) && (t.objectMode || n && n.length) && (i.push(n) || (r = !0, e.pause()))
                        }), e) void 0 === this[n] && "function" == typeof e[n] && (this[n] = function (t) {
                            return function () {
                                return e[t].apply(e, arguments)
                            }
                        }(n));
                        for (var o = 0; o < v.length; o++) e.on(v[o], i.emit.bind(i, v[o]));
                        return i._read = function (t) {
                            l("wrapped _read", t), r && (r = !1, e.resume())
                        }, i
                    }, g._fromList = T
                }).call(t, r(7), r(8))
            }, function (e, t, r) {
                e.exports = r(30).EventEmitter
            }, function (e, t, r) {
                "use strict";
                var i = r(22);

                function n(e, t) {
                    e.emit("error", t)
                }

                e.exports = {
                    destroy: function (e, t) {
                        var r = this, o = this._readableState && this._readableState.destroyed,
                            s = this._writableState && this._writableState.destroyed;
                        o || s ? t ? t(e) : !e || this._writableState && this._writableState.errorEmitted || i(n, this, e) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(e || null, function (e) {
                            !t && e ? (i(n, r, e), r._writableState && (r._writableState.errorEmitted = !0)) : t && t(e)
                        }))
                    }, undestroy: function () {
                        this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1)
                    }
                }
            }, function (e, t, r) {
                "use strict";
                e.exports = o;
                var i = r(12), n = r(16);

                function o(e) {
                    if (!(this instanceof o)) return new o(e);
                    i.call(this, e), this._transformState = new function (e) {
                        this.afterTransform = function (t, r) {
                            return function (e, t, r) {
                                var i = e._transformState;
                                i.transforming = !1;
                                var n = i.writecb;
                                if (!n) return e.emit("error", new Error("write callback called multiple times"));
                                i.writechunk = null, i.writecb = null, null != r && e.push(r), n(t);
                                var o = e._readableState;
                                o.reading = !1, (o.needReadable || o.length < o.highWaterMark) && e._read(o.highWaterMark)
                            }(e, t, r)
                        }, this.needTransform = !1, this.transforming = !1, this.writecb = null, this.writechunk = null, this.writeencoding = null
                    }(this);
                    var t = this;
                    this._readableState.needReadable = !0, this._readableState.sync = !1, e && ("function" == typeof e.transform && (this._transform = e.transform), "function" == typeof e.flush && (this._flush = e.flush)), this.once("prefinish", function () {
                        "function" == typeof this._flush ? this._flush(function (e, r) {
                            s(t, e, r)
                        }) : s(t)
                    })
                }

                function s(e, t, r) {
                    if (t) return e.emit("error", t);
                    null != r && e.push(r);
                    var i = e._writableState, n = e._transformState;
                    if (i.length) throw new Error("Calling transform done when ws.length != 0");
                    if (n.transforming) throw new Error("Calling transform done when still transforming");
                    return e.push(null)
                }

                n.inherits = r(0), n.inherits(o, i), o.prototype.push = function (e, t) {
                    return this._transformState.needTransform = !1, i.prototype.push.call(this, e, t)
                }, o.prototype._transform = function (e, t, r) {
                    throw new Error("_transform() is not implemented")
                }, o.prototype._write = function (e, t, r) {
                    var i = this._transformState;
                    if (i.writecb = r, i.writechunk = e, i.writeencoding = t, !i.transforming) {
                        var n = this._readableState;
                        (i.needTransform || n.needReadable || n.length < n.highWaterMark) && this._read(n.highWaterMark)
                    }
                }, o.prototype._read = function (e) {
                    var t = this._transformState;
                    null !== t.writechunk && t.writecb && !t.transforming ? (t.transforming = !0, this._transform(t.writechunk, t.writeencoding, t.afterTransform)) : t.needTransform = !0
                }, o.prototype._destroy = function (e, t) {
                    var r = this;
                    i.prototype._destroy.call(this, e, function (e) {
                        t(e), r.emit("close")
                    })
                }
            }, function (e, t, r) {
                var i = r(0), n = r(14), o = r(1).Buffer,
                    s = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298],
                    a = new Array(64);

                function f() {
                    this.init(), this._w = a, n.call(this, 64, 56)
                }

                function c(e, t, r) {
                    return r ^ e & (t ^ r)
                }

                function u(e, t, r) {
                    return e & t | r & (e | t)
                }

                function h(e) {
                    return (e >>> 2 | e << 30) ^ (e >>> 13 | e << 19) ^ (e >>> 22 | e << 10)
                }

                function d(e) {
                    return (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7)
                }

                function l(e) {
                    return (e >>> 7 | e << 25) ^ (e >>> 18 | e << 14) ^ e >>> 3
                }

                i(f, n), f.prototype.init = function () {
                    return this._a = 1779033703, this._b = 3144134277, this._c = 1013904242, this._d = 2773480762, this._e = 1359893119, this._f = 2600822924, this._g = 528734635, this._h = 1541459225, this
                }, f.prototype._update = function (e) {
                    for (var t, r = this._w, i = 0 | this._a, n = 0 | this._b, o = 0 | this._c, a = 0 | this._d, f = 0 | this._e, p = 0 | this._f, b = 0 | this._g, y = 0 | this._h, v = 0; v < 16; ++v) r[v] = e.readInt32BE(4 * v);
                    for (; v < 64; ++v) r[v] = 0 | (((t = r[v - 2]) >>> 17 | t << 15) ^ (t >>> 19 | t << 13) ^ t >>> 10) + r[v - 7] + l(r[v - 15]) + r[v - 16];
                    for (var m = 0; m < 64; ++m) {
                        var g = y + d(f) + c(f, p, b) + s[m] + r[m] | 0, w = h(i) + u(i, n, o) | 0;
                        y = b, b = p, p = f, f = a + g | 0, a = o, o = n, n = i, i = g + w | 0
                    }
                    this._a = i + this._a | 0, this._b = n + this._b | 0, this._c = o + this._c | 0, this._d = a + this._d | 0, this._e = f + this._e | 0, this._f = p + this._f | 0, this._g = b + this._g | 0, this._h = y + this._h | 0
                }, f.prototype._hash = function () {
                    var e = o.allocUnsafe(32);
                    return e.writeInt32BE(this._a, 0), e.writeInt32BE(this._b, 4), e.writeInt32BE(this._c, 8), e.writeInt32BE(this._d, 12), e.writeInt32BE(this._e, 16), e.writeInt32BE(this._f, 20), e.writeInt32BE(this._g, 24), e.writeInt32BE(this._h, 28), e
                }, e.exports = f
            }, function (e, t, r) {
                var i = r(0), n = r(14), o = r(1).Buffer,
                    s = [1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591],
                    a = new Array(160);

                function f() {
                    this.init(), this._w = a, n.call(this, 128, 112)
                }

                function c(e, t, r) {
                    return r ^ e & (t ^ r)
                }

                function u(e, t, r) {
                    return e & t | r & (e | t)
                }

                function h(e, t) {
                    return (e >>> 28 | t << 4) ^ (t >>> 2 | e << 30) ^ (t >>> 7 | e << 25)
                }

                function d(e, t) {
                    return (e >>> 14 | t << 18) ^ (e >>> 18 | t << 14) ^ (t >>> 9 | e << 23)
                }

                function l(e, t) {
                    return (e >>> 1 | t << 31) ^ (e >>> 8 | t << 24) ^ e >>> 7
                }

                function p(e, t) {
                    return (e >>> 1 | t << 31) ^ (e >>> 8 | t << 24) ^ (e >>> 7 | t << 25)
                }

                function b(e, t) {
                    return (e >>> 19 | t << 13) ^ (t >>> 29 | e << 3) ^ e >>> 6
                }

                function y(e, t) {
                    return (e >>> 19 | t << 13) ^ (t >>> 29 | e << 3) ^ (e >>> 6 | t << 26)
                }

                function v(e, t) {
                    return e >>> 0 < t >>> 0 ? 1 : 0
                }

                i(f, n), f.prototype.init = function () {
                    return this._ah = 1779033703, this._bh = 3144134277, this._ch = 1013904242, this._dh = 2773480762, this._eh = 1359893119, this._fh = 2600822924, this._gh = 528734635, this._hh = 1541459225, this._al = 4089235720, this._bl = 2227873595, this._cl = 4271175723, this._dl = 1595750129, this._el = 2917565137, this._fl = 725511199, this._gl = 4215389547, this._hl = 327033209, this
                }, f.prototype._update = function (e) {
                    for (var t = this._w, r = 0 | this._ah, i = 0 | this._bh, n = 0 | this._ch, o = 0 | this._dh, a = 0 | this._eh, f = 0 | this._fh, m = 0 | this._gh, g = 0 | this._hh, w = 0 | this._al, _ = 0 | this._bl, S = 0 | this._cl, k = 0 | this._dl, A = 0 | this._el, E = 0 | this._fl, x = 0 | this._gl, M = 0 | this._hl, B = 0; B < 32; B += 2) t[B] = e.readInt32BE(4 * B), t[B + 1] = e.readInt32BE(4 * B + 4);
                    for (; B < 160; B += 2) {
                        var R = t[B - 30], I = t[B - 30 + 1], T = l(R, I), j = p(I, R),
                            O = b(R = t[B - 4], I = t[B - 4 + 1]), P = y(I, R), C = t[B - 14], q = t[B - 14 + 1],
                            U = t[B - 32], N = t[B - 32 + 1], D = j + q | 0, L = T + C + v(D, j) | 0;
                        L = (L = L + O + v(D = D + P | 0, P) | 0) + U + v(D = D + N | 0, N) | 0, t[B] = L, t[B + 1] = D
                    }
                    for (var z = 0; z < 160; z += 2) {
                        L = t[z], D = t[z + 1];
                        var F = u(r, i, n), K = u(w, _, S), Y = h(r, w), H = h(w, r), V = d(a, A), J = d(A, a),
                            G = s[z], W = s[z + 1], $ = c(a, f, m), X = c(A, E, x), Z = M + J | 0,
                            Q = g + V + v(Z, M) | 0;
                        Q = (Q = (Q = Q + $ + v(Z = Z + X | 0, X) | 0) + G + v(Z = Z + W | 0, W) | 0) + L + v(Z = Z + D | 0, D) | 0;
                        var ee = H + K | 0, te = Y + F + v(ee, H) | 0;
                        g = m, M = x, m = f, x = E, f = a, E = A, a = o + Q + v(A = k + Z | 0, k) | 0, o = n, k = S, n = i, S = _, i = r, _ = w, r = Q + te + v(w = Z + ee | 0, Z) | 0
                    }
                    this._al = this._al + w | 0, this._bl = this._bl + _ | 0, this._cl = this._cl + S | 0, this._dl = this._dl + k | 0, this._el = this._el + A | 0, this._fl = this._fl + E | 0, this._gl = this._gl + x | 0, this._hl = this._hl + M | 0, this._ah = this._ah + r + v(this._al, w) | 0, this._bh = this._bh + i + v(this._bl, _) | 0, this._ch = this._ch + n + v(this._cl, S) | 0, this._dh = this._dh + o + v(this._dl, k) | 0, this._eh = this._eh + a + v(this._el, A) | 0, this._fh = this._fh + f + v(this._fl, E) | 0, this._gh = this._gh + m + v(this._gl, x) | 0, this._hh = this._hh + g + v(this._hl, M) | 0
                }, f.prototype._hash = function () {
                    var e = o.allocUnsafe(64);

                    function t(t, r, i) {
                        e.writeInt32BE(t, i), e.writeInt32BE(r, i + 4)
                    }

                    return t(this._ah, this._al, 0), t(this._bh, this._bl, 8), t(this._ch, this._cl, 16), t(this._dh, this._dl, 24), t(this._eh, this._el, 32), t(this._fh, this._fl, 40), t(this._gh, this._gl, 48), t(this._hh, this._hl, 56), e
                }, e.exports = f
            }, function (e, t, r) {
                "use strict";
                var i = r(0), n = r(102), o = r(9), s = r(1).Buffer, a = r(28), f = r(29), c = r(34), u = s.alloc(128);

                function h(e, t) {
                    o.call(this, "digest"), "string" == typeof t && (t = s.from(t));
                    var r = "sha512" === e || "sha384" === e ? 128 : 64;
                    this._alg = e, this._key = t, t.length > r ? t = ("rmd160" === e ? new f : c(e)).update(t).digest() : t.length < r && (t = s.concat([t, u], r));
                    for (var i = this._ipad = s.allocUnsafe(r), n = this._opad = s.allocUnsafe(r), a = 0; a < r; a++) i[a] = 54 ^ t[a], n[a] = 92 ^ t[a];
                    this._hash = "rmd160" === e ? new f : c(e), this._hash.update(i)
                }

                i(h, o), h.prototype._update = function (e) {
                    this._hash.update(e)
                }, h.prototype._final = function () {
                    var e = this._hash.digest();
                    return ("rmd160" === this._alg ? new f : c(this._alg)).update(this._opad).update(e).digest()
                }, e.exports = function (e, t) {
                    return "rmd160" === (e = e.toLowerCase()) || "ripemd160" === e ? new h("rmd160", t) : "md5" === e ? new n(a, t) : new h(e, t)
                }
            }, function (e, t) {
                e.exports = {
                    sha224WithRSAEncryption: {
                        sign: "rsa",
                        hash: "sha224",
                        id: "302d300d06096086480165030402040500041c"
                    },
                    "RSA-SHA224": {sign: "ecdsa/rsa", hash: "sha224", id: "302d300d06096086480165030402040500041c"},
                    sha256WithRSAEncryption: {
                        sign: "rsa",
                        hash: "sha256",
                        id: "3031300d060960864801650304020105000420"
                    },
                    "RSA-SHA256": {sign: "ecdsa/rsa", hash: "sha256", id: "3031300d060960864801650304020105000420"},
                    sha384WithRSAEncryption: {
                        sign: "rsa",
                        hash: "sha384",
                        id: "3041300d060960864801650304020205000430"
                    },
                    "RSA-SHA384": {sign: "ecdsa/rsa", hash: "sha384", id: "3041300d060960864801650304020205000430"},
                    sha512WithRSAEncryption: {
                        sign: "rsa",
                        hash: "sha512",
                        id: "3051300d060960864801650304020305000440"
                    },
                    "RSA-SHA512": {sign: "ecdsa/rsa", hash: "sha512", id: "3051300d060960864801650304020305000440"},
                    "RSA-SHA1": {sign: "rsa", hash: "sha1", id: "3021300906052b0e03021a05000414"},
                    "ecdsa-with-SHA1": {sign: "ecdsa", hash: "sha1", id: ""},
                    sha256: {sign: "ecdsa", hash: "sha256", id: ""},
                    sha224: {sign: "ecdsa", hash: "sha224", id: ""},
                    sha384: {sign: "ecdsa", hash: "sha384", id: ""},
                    sha512: {sign: "ecdsa", hash: "sha512", id: ""},
                    "DSA-SHA": {sign: "dsa", hash: "sha1", id: ""},
                    "DSA-SHA1": {sign: "dsa", hash: "sha1", id: ""},
                    DSA: {sign: "dsa", hash: "sha1", id: ""},
                    "DSA-WITH-SHA224": {sign: "dsa", hash: "sha224", id: ""},
                    "DSA-SHA224": {sign: "dsa", hash: "sha224", id: ""},
                    "DSA-WITH-SHA256": {sign: "dsa", hash: "sha256", id: ""},
                    "DSA-SHA256": {sign: "dsa", hash: "sha256", id: ""},
                    "DSA-WITH-SHA384": {sign: "dsa", hash: "sha384", id: ""},
                    "DSA-SHA384": {sign: "dsa", hash: "sha384", id: ""},
                    "DSA-WITH-SHA512": {sign: "dsa", hash: "sha512", id: ""},
                    "DSA-SHA512": {sign: "dsa", hash: "sha512", id: ""},
                    "DSA-RIPEMD160": {sign: "dsa", hash: "rmd160", id: ""},
                    ripemd160WithRSA: {sign: "rsa", hash: "rmd160", id: "3021300906052b2403020105000414"},
                    "RSA-RIPEMD160": {sign: "rsa", hash: "rmd160", id: "3021300906052b2403020105000414"},
                    md5WithRSAEncryption: {sign: "rsa", hash: "md5", id: "3020300c06082a864886f70d020505000410"},
                    "RSA-MD5": {sign: "rsa", hash: "md5", id: "3020300c06082a864886f70d020505000410"}
                }
            }, function (e, t, r) {
                t.pbkdf2 = r(104), t.pbkdf2Sync = r(53)
            }, function (e, t) {
                var r = Math.pow(2, 30) - 1;
                e.exports = function (e, t) {
                    if ("number" != typeof e) throw new TypeError("Iterations not a number");
                    if (e < 0) throw new TypeError("Bad iterations");
                    if ("number" != typeof t) throw new TypeError("Key length not a number");
                    if (t < 0 || t > r || t != t) throw new TypeError("Bad key length")
                }
            }, function (e, t, r) {
                (function (t) {
                    var r;
                    r = t.browser ? "utf-8" : parseInt(t.version.split(".")[0].slice(1), 10) >= 6 ? "utf-8" : "binary", e.exports = r
                }).call(t, r(8))
            }, function (e, t, r) {
                var i = r(28), n = r(29), o = r(34), s = r(51), a = r(52), f = r(1).Buffer, c = f.alloc(128),
                    u = {md5: 16, sha1: 20, sha224: 28, sha256: 32, sha384: 48, sha512: 64, rmd160: 20, ripemd160: 20};

                function h(e, t, r) {
                    var s = function (e) {
                        return "rmd160" === e || "ripemd160" === e ? n : "md5" === e ? i : function (t) {
                            return o(e).update(t).digest()
                        }
                    }(e), a = "sha512" === e || "sha384" === e ? 128 : 64;
                    t.length > a ? t = s(t) : t.length < a && (t = f.concat([t, c], a));
                    for (var h = f.allocUnsafe(a + u[e]), d = f.allocUnsafe(a + u[e]), l = 0; l < a; l++) h[l] = 54 ^ t[l], d[l] = 92 ^ t[l];
                    var p = f.allocUnsafe(a + r + 4);
                    h.copy(p, 0, 0, a), this.ipad1 = p, this.ipad2 = h, this.opad = d, this.alg = e, this.blocksize = a, this.hash = s, this.size = u[e]
                }

                h.prototype.run = function (e, t) {
                    return e.copy(t, this.blocksize), this.hash(t).copy(this.opad, this.blocksize), this.hash(this.opad)
                }, e.exports = function (e, t, r, i, n) {
                    f.isBuffer(e) || (e = f.from(e, a)), f.isBuffer(t) || (t = f.from(t, a)), s(r, i);
                    var o = new h(n = n || "sha1", e, t.length), c = f.allocUnsafe(i), d = f.allocUnsafe(t.length + 4);
                    t.copy(d, 0, 0, t.length);
                    for (var l = 0, p = u[n], b = Math.ceil(i / p), y = 1; y <= b; y++) {
                        d.writeUInt32BE(y, t.length);
                        for (var v = o.run(d, o.ipad1), m = v, g = 1; g < r; g++) {
                            m = o.run(m, o.ipad2);
                            for (var w = 0; w < p; w++) v[w] ^= m[w]
                        }
                        v.copy(c, l), l += p
                    }
                    return c
                }
            }, function (e, t, r) {
                var i = r(17), n = r(1).Buffer, o = r(55);

                function s(e) {
                    var t = e._cipher.encryptBlockRaw(e._prev);
                    return o(e._prev), t
                }

                t.encrypt = function (e, t) {
                    var r = Math.ceil(t.length / 16), o = e._cache.length;
                    e._cache = n.concat([e._cache, n.allocUnsafe(16 * r)]);
                    for (var a = 0; a < r; a++) {
                        var f = s(e), c = o + 16 * a;
                        e._cache.writeUInt32BE(f[0], c + 0), e._cache.writeUInt32BE(f[1], c + 4), e._cache.writeUInt32BE(f[2], c + 8), e._cache.writeUInt32BE(f[3], c + 12)
                    }
                    var u = e._cache.slice(0, t.length);
                    return e._cache = e._cache.slice(t.length), i(t, u)
                }
            }, function (e, t) {
                e.exports = function (e) {
                    for (var t, r = e.length; r--;) {
                        if (255 !== (t = e.readUInt8(r))) {
                            t++, e.writeUInt8(t, r);
                            break
                        }
                        e.writeUInt8(0, r)
                    }
                }
            }, function (e, t) {
                e.exports = {
                    "aes-128-ecb": {cipher: "AES", key: 128, iv: 0, mode: "ECB", type: "block"},
                    "aes-192-ecb": {cipher: "AES", key: 192, iv: 0, mode: "ECB", type: "block"},
                    "aes-256-ecb": {cipher: "AES", key: 256, iv: 0, mode: "ECB", type: "block"},
                    "aes-128-cbc": {cipher: "AES", key: 128, iv: 16, mode: "CBC", type: "block"},
                    "aes-192-cbc": {cipher: "AES", key: 192, iv: 16, mode: "CBC", type: "block"},
                    "aes-256-cbc": {cipher: "AES", key: 256, iv: 16, mode: "CBC", type: "block"},
                    aes128: {cipher: "AES", key: 128, iv: 16, mode: "CBC", type: "block"},
                    aes192: {cipher: "AES", key: 192, iv: 16, mode: "CBC", type: "block"},
                    aes256: {cipher: "AES", key: 256, iv: 16, mode: "CBC", type: "block"},
                    "aes-128-cfb": {cipher: "AES", key: 128, iv: 16, mode: "CFB", type: "stream"},
                    "aes-192-cfb": {cipher: "AES", key: 192, iv: 16, mode: "CFB", type: "stream"},
                    "aes-256-cfb": {cipher: "AES", key: 256, iv: 16, mode: "CFB", type: "stream"},
                    "aes-128-cfb8": {cipher: "AES", key: 128, iv: 16, mode: "CFB8", type: "stream"},
                    "aes-192-cfb8": {cipher: "AES", key: 192, iv: 16, mode: "CFB8", type: "stream"},
                    "aes-256-cfb8": {cipher: "AES", key: 256, iv: 16, mode: "CFB8", type: "stream"},
                    "aes-128-cfb1": {cipher: "AES", key: 128, iv: 16, mode: "CFB1", type: "stream"},
                    "aes-192-cfb1": {cipher: "AES", key: 192, iv: 16, mode: "CFB1", type: "stream"},
                    "aes-256-cfb1": {cipher: "AES", key: 256, iv: 16, mode: "CFB1", type: "stream"},
                    "aes-128-ofb": {cipher: "AES", key: 128, iv: 16, mode: "OFB", type: "stream"},
                    "aes-192-ofb": {cipher: "AES", key: 192, iv: 16, mode: "OFB", type: "stream"},
                    "aes-256-ofb": {cipher: "AES", key: 256, iv: 16, mode: "OFB", type: "stream"},
                    "aes-128-ctr": {cipher: "AES", key: 128, iv: 16, mode: "CTR", type: "stream"},
                    "aes-192-ctr": {cipher: "AES", key: 192, iv: 16, mode: "CTR", type: "stream"},
                    "aes-256-ctr": {cipher: "AES", key: 256, iv: 16, mode: "CTR", type: "stream"},
                    "aes-128-gcm": {cipher: "AES", key: 128, iv: 12, mode: "GCM", type: "auth"},
                    "aes-192-gcm": {cipher: "AES", key: 192, iv: 12, mode: "GCM", type: "auth"},
                    "aes-256-gcm": {cipher: "AES", key: 256, iv: 12, mode: "GCM", type: "auth"}
                }
            }, function (e, t, r) {
                var i = r(24), n = r(1).Buffer, o = r(9), s = r(0), a = r(115), f = r(17), c = r(55);

                function u(e, t, r, s) {
                    o.call(this);
                    var f = n.alloc(4, 0);
                    this._cipher = new i.AES(t);
                    var u = this._cipher.encryptBlock(f);
                    this._ghash = new a(u), r = function (e, t, r) {
                        if (12 === t.length) return e._finID = n.concat([t, n.from([0, 0, 0, 1])]), n.concat([t, n.from([0, 0, 0, 2])]);
                        var i = new a(r), o = t.length, s = o % 16;
                        i.update(t), s && (s = 16 - s, i.update(n.alloc(s, 0))), i.update(n.alloc(8, 0));
                        var f = 8 * o, u = n.alloc(8);
                        u.writeUIntBE(f, 0, 8), i.update(u), e._finID = i.state;
                        var h = n.from(e._finID);
                        return c(h), h
                    }(this, r, u), this._prev = n.from(r), this._cache = n.allocUnsafe(0), this._secCache = n.allocUnsafe(0), this._decrypt = s, this._alen = 0, this._len = 0, this._mode = e, this._authTag = null, this._called = !1
                }

                s(u, o), u.prototype._update = function (e) {
                    if (!this._called && this._alen) {
                        var t = 16 - this._alen % 16;
                        t < 16 && (t = n.alloc(t, 0), this._ghash.update(t))
                    }
                    this._called = !0;
                    var r = this._mode.encrypt(this, e);
                    return this._decrypt ? this._ghash.update(e) : this._ghash.update(r), this._len += e.length, r
                }, u.prototype._final = function () {
                    if (this._decrypt && !this._authTag) throw new Error("Unsupported state or unable to authenticate data");
                    var e = f(this._ghash.final(8 * this._alen, 8 * this._len), this._cipher.encryptBlock(this._finID));
                    if (this._decrypt && function (e, t) {
                            var r = 0;
                            e.length !== t.length && r++;
                            for (var i = Math.min(e.length, t.length), n = 0; n < i; ++n) r += e[n] ^ t[n];
                            return r
                        }(e, this._authTag)) throw new Error("Unsupported state or unable to authenticate data");
                    this._authTag = e, this._cipher.scrub()
                }, u.prototype.getAuthTag = function () {
                    if (this._decrypt || !n.isBuffer(this._authTag)) throw new Error("Attempting to get auth tag in unsupported state");
                    return this._authTag
                }, u.prototype.setAuthTag = function (e) {
                    if (!this._decrypt) throw new Error("Attempting to set auth tag in unsupported state");
                    this._authTag = e
                }, u.prototype.setAAD = function (e) {
                    if (this._called) throw new Error("Attempting to set AAD in unsupported state");
                    this._ghash.update(e), this._alen += e.length
                }, e.exports = u
            }, function (e, t, r) {
                var i = r(24), n = r(1).Buffer, o = r(9);

                function s(e, t, r, s) {
                    o.call(this), this._cipher = new i.AES(t), this._prev = n.from(r), this._cache = n.allocUnsafe(0), this._secCache = n.allocUnsafe(0), this._decrypt = s, this._mode = e
                }

                r(0)(s, o), s.prototype._update = function (e) {
                    return this._mode.encrypt(this, e, this._decrypt)
                }, s.prototype._final = function () {
                    this._cipher.scrub()
                }, e.exports = s
            }, function (e, t, r) {
                var i = r(13);
                e.exports = v, v.simpleSieve = b, v.fermatTest = y;
                var n = r(2), o = new n(24), s = new (r(60)), a = new n(1), f = new n(2), c = new n(5),
                    u = (new n(16), new n(8), new n(10)), h = new n(3), d = (new n(7), new n(11)), l = new n(4),
                    p = (new n(12), null);

                function b(e) {
                    for (var t = function () {
                        if (null !== p) return p;
                        var e = [];
                        e[0] = 2;
                        for (var t = 1, r = 3; r < 1048576; r += 2) {
                            for (var i = Math.ceil(Math.sqrt(r)), n = 0; n < t && e[n] <= i && r % e[n] != 0; n++) ;
                            t !== n && e[n] <= i || (e[t++] = r)
                        }
                        return p = e, e
                    }(), r = 0; r < t.length; r++) if (0 === e.modn(t[r])) return 0 === e.cmpn(t[r]);
                    return !0
                }

                function y(e) {
                    var t = n.mont(e);
                    return 0 === f.toRed(t).redPow(e.subn(1)).fromRed().cmpn(1)
                }

                function v(e, t) {
                    if (e < 16) return new n(2 === t || 5 === t ? [140, 123] : [140, 39]);
                    var r, p;
                    for (t = new n(t); ;) {
                        for (r = new n(i(Math.ceil(e / 8))); r.bitLength() > e;) r.ishrn(1);
                        if (r.isEven() && r.iadd(a), r.testn(1) || r.iadd(f), t.cmp(f)) {
                            if (!t.cmp(c)) for (; r.mod(u).cmp(h);) r.iadd(l)
                        } else for (; r.mod(o).cmp(d);) r.iadd(l);
                        if (b(p = r.shrn(1)) && b(r) && y(p) && y(r) && s.test(p) && s.test(r)) return r
                    }
                }
            }, function (e, t, r) {
                var i = r(2), n = r(61);

                function o(e) {
                    this.rand = e || new n.Rand
                }

                e.exports = o, o.create = function (e) {
                    return new o(e)
                }, o.prototype._randbelow = function (e) {
                    var t = e.bitLength(), r = Math.ceil(t / 8);
                    do {
                        var n = new i(this.rand.generate(r))
                    } while (n.cmp(e) >= 0);
                    return n
                }, o.prototype._randrange = function (e, t) {
                    var r = t.sub(e);
                    return e.add(this._randbelow(r))
                }, o.prototype.test = function (e, t, r) {
                    var n = e.bitLength(), o = i.mont(e), s = new i(1).toRed(o);
                    t || (t = Math.max(1, n / 48 | 0));
                    for (var a = e.subn(1), f = 0; !a.testn(f); f++) ;
                    for (var c = e.shrn(f), u = a.toRed(o); t > 0; t--) {
                        var h = this._randrange(new i(2), a);
                        r && r(h);
                        var d = h.toRed(o).redPow(c);
                        if (0 !== d.cmp(s) && 0 !== d.cmp(u)) {
                            for (var l = 1; l < f; l++) {
                                if (0 === (d = d.redSqr()).cmp(s)) return !1;
                                if (0 === d.cmp(u)) break
                            }
                            if (l === f) return !1
                        }
                    }
                    return !0
                }, o.prototype.getDivisor = function (e, t) {
                    var r = e.bitLength(), n = i.mont(e), o = new i(1).toRed(n);
                    t || (t = Math.max(1, r / 48 | 0));
                    for (var s = e.subn(1), a = 0; !s.testn(a); a++) ;
                    for (var f = e.shrn(a), c = s.toRed(n); t > 0; t--) {
                        var u = this._randrange(new i(2), s), h = e.gcd(u);
                        if (0 !== h.cmpn(1)) return h;
                        var d = u.toRed(n).redPow(f);
                        if (0 !== d.cmp(o) && 0 !== d.cmp(c)) {
                            for (var l = 1; l < a; l++) {
                                if (0 === (d = d.redSqr()).cmp(o)) return d.fromRed().subn(1).gcd(e);
                                if (0 === d.cmp(c)) break
                            }
                            if (l === a) return (d = d.redSqr()).fromRed().subn(1).gcd(e)
                        }
                    }
                    return !1
                }
            }, function (e, t, r) {
                var i;

                function n(e) {
                    this.rand = e
                }

                if (e.exports = function (e) {
                        return i || (i = new n(null)), i.generate(e)
                    }, e.exports.Rand = n, n.prototype.generate = function (e) {
                        return this._rand(e)
                    }, n.prototype._rand = function (e) {
                        if (this.rand.getBytes) return this.rand.getBytes(e);
                        for (var t = new Uint8Array(e), r = 0; r < t.length; r++) t[r] = this.rand.getByte();
                        return t
                    }, "object" == typeof self) self.crypto && self.crypto.getRandomValues ? n.prototype._rand = function (e) {
                    var t = new Uint8Array(e);
                    return self.crypto.getRandomValues(t), t
                } : self.msCrypto && self.msCrypto.getRandomValues ? n.prototype._rand = function (e) {
                    var t = new Uint8Array(e);
                    return self.msCrypto.getRandomValues(t), t
                } : "object" == typeof window && (n.prototype._rand = function () {
                    throw new Error("Not implemented yet")
                }); else try {
                    var o = r(125);
                    if ("function" != typeof o.randomBytes) throw new Error("Not supported");
                    n.prototype._rand = function (e) {
                        return o.randomBytes(e)
                    }
                } catch (e) {
                }
            }, function (e, t, r) {
                "use strict";
                var i = t;

                function n(e) {
                    return 1 === e.length ? "0" + e : e
                }

                function o(e) {
                    for (var t = "", r = 0; r < e.length; r++) t += n(e[r].toString(16));
                    return t
                }

                i.toArray = function (e, t) {
                    if (Array.isArray(e)) return e.slice();
                    if (!e) return [];
                    var r = [];
                    if ("string" != typeof e) {
                        for (var i = 0; i < e.length; i++) r[i] = 0 | e[i];
                        return r
                    }
                    if ("hex" === t) for ((e = e.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 && (e = "0" + e), i = 0; i < e.length; i += 2) r.push(parseInt(e[i] + e[i + 1], 16)); else for (i = 0; i < e.length; i++) {
                        var n = e.charCodeAt(i), o = n >> 8, s = 255 & n;
                        o ? r.push(o, s) : r.push(s)
                    }
                    return r
                }, i.zero2 = n, i.toHex = o, i.encode = function (e, t) {
                    return "hex" === t ? o(e) : e
                }
            }, function (e, t, r) {
                "use strict";
                var i = r(6).rotr32;

                function n(e, t, r) {
                    return e & t ^ ~e & r
                }

                function o(e, t, r) {
                    return e & t ^ e & r ^ t & r
                }

                function s(e, t, r) {
                    return e ^ t ^ r
                }

                t.ft_1 = function (e, t, r, i) {
                    return 0 === e ? n(t, r, i) : 1 === e || 3 === e ? s(t, r, i) : 2 === e ? o(t, r, i) : void 0
                }, t.ch32 = n, t.maj32 = o, t.p32 = s, t.s0_256 = function (e) {
                    return i(e, 2) ^ i(e, 13) ^ i(e, 22)
                }, t.s1_256 = function (e) {
                    return i(e, 6) ^ i(e, 11) ^ i(e, 25)
                }, t.g0_256 = function (e) {
                    return i(e, 7) ^ i(e, 18) ^ e >>> 3
                }, t.g1_256 = function (e) {
                    return i(e, 17) ^ i(e, 19) ^ e >>> 10
                }
            }, function (e, t, r) {
                "use strict";
                var i = r(6), n = r(18), o = r(63), s = r(5), a = i.sum32, f = i.sum32_4, c = i.sum32_5, u = o.ch32,
                    h = o.maj32, d = o.s0_256, l = o.s1_256, p = o.g0_256, b = o.g1_256, y = n.BlockHash,
                    v = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298];

                function m() {
                    if (!(this instanceof m)) return new m;
                    y.call(this), this.h = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], this.k = v, this.W = new Array(64)
                }

                i.inherits(m, y), e.exports = m, m.blockSize = 512, m.outSize = 256, m.hmacStrength = 192, m.padLength = 64, m.prototype._update = function (e, t) {
                    for (var r = this.W, i = 0; i < 16; i++) r[i] = e[t + i];
                    for (; i < r.length; i++) r[i] = f(b(r[i - 2]), r[i - 7], p(r[i - 15]), r[i - 16]);
                    var n = this.h[0], o = this.h[1], y = this.h[2], v = this.h[3], m = this.h[4], g = this.h[5],
                        w = this.h[6], _ = this.h[7];
                    for (s(this.k.length === r.length), i = 0; i < r.length; i++) {
                        var S = c(_, l(m), u(m, g, w), this.k[i], r[i]), k = a(d(n), h(n, o, y));
                        _ = w, w = g, g = m, m = a(v, S), v = y, y = o, o = n, n = a(S, k)
                    }
                    this.h[0] = a(this.h[0], n), this.h[1] = a(this.h[1], o), this.h[2] = a(this.h[2], y), this.h[3] = a(this.h[3], v), this.h[4] = a(this.h[4], m), this.h[5] = a(this.h[5], g), this.h[6] = a(this.h[6], w), this.h[7] = a(this.h[7], _)
                }, m.prototype._digest = function (e) {
                    return "hex" === e ? i.toHex32(this.h, "big") : i.split32(this.h, "big")
                }
            }, function (e, t, r) {
                "use strict";
                var i = r(6), n = r(18), o = r(5), s = i.rotr64_hi, a = i.rotr64_lo, f = i.shr64_hi, c = i.shr64_lo,
                    u = i.sum64, h = i.sum64_hi, d = i.sum64_lo, l = i.sum64_4_hi, p = i.sum64_4_lo, b = i.sum64_5_hi,
                    y = i.sum64_5_lo, v = n.BlockHash,
                    m = [1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591];

                function g() {
                    if (!(this instanceof g)) return new g;
                    v.call(this), this.h = [1779033703, 4089235720, 3144134277, 2227873595, 1013904242, 4271175723, 2773480762, 1595750129, 1359893119, 2917565137, 2600822924, 725511199, 528734635, 4215389547, 1541459225, 327033209], this.k = m, this.W = new Array(160)
                }

                function w(e, t, r, i, n) {
                    var o = e & r ^ ~e & n;
                    return o < 0 && (o += 4294967296), o
                }

                function _(e, t, r, i, n, o) {
                    var s = t & i ^ ~t & o;
                    return s < 0 && (s += 4294967296), s
                }

                function S(e, t, r, i, n) {
                    var o = e & r ^ e & n ^ r & n;
                    return o < 0 && (o += 4294967296), o
                }

                function k(e, t, r, i, n, o) {
                    var s = t & i ^ t & o ^ i & o;
                    return s < 0 && (s += 4294967296), s
                }

                function A(e, t) {
                    var r = s(e, t, 28) ^ s(t, e, 2) ^ s(t, e, 7);
                    return r < 0 && (r += 4294967296), r
                }

                function E(e, t) {
                    var r = a(e, t, 28) ^ a(t, e, 2) ^ a(t, e, 7);
                    return r < 0 && (r += 4294967296), r
                }

                function x(e, t) {
                    var r = s(e, t, 14) ^ s(e, t, 18) ^ s(t, e, 9);
                    return r < 0 && (r += 4294967296), r
                }

                function M(e, t) {
                    var r = a(e, t, 14) ^ a(e, t, 18) ^ a(t, e, 9);
                    return r < 0 && (r += 4294967296), r
                }

                function B(e, t) {
                    var r = s(e, t, 1) ^ s(e, t, 8) ^ f(e, t, 7);
                    return r < 0 && (r += 4294967296), r
                }

                function R(e, t) {
                    var r = a(e, t, 1) ^ a(e, t, 8) ^ c(e, t, 7);
                    return r < 0 && (r += 4294967296), r
                }

                function I(e, t) {
                    var r = s(e, t, 19) ^ s(t, e, 29) ^ f(e, t, 6);
                    return r < 0 && (r += 4294967296), r
                }

                function T(e, t) {
                    var r = a(e, t, 19) ^ a(t, e, 29) ^ c(e, t, 6);
                    return r < 0 && (r += 4294967296), r
                }

                i.inherits(g, v), e.exports = g, g.blockSize = 1024, g.outSize = 512, g.hmacStrength = 192, g.padLength = 128, g.prototype._prepareBlock = function (e, t) {
                    for (var r = this.W, i = 0; i < 32; i++) r[i] = e[t + i];
                    for (; i < r.length; i += 2) {
                        var n = I(r[i - 4], r[i - 3]), o = T(r[i - 4], r[i - 3]), s = r[i - 14], a = r[i - 13],
                            f = B(r[i - 30], r[i - 29]), c = R(r[i - 30], r[i - 29]), u = r[i - 32], h = r[i - 31];
                        r[i] = l(n, o, s, a, f, c, u, h), r[i + 1] = p(n, o, s, a, f, c, u, h)
                    }
                }, g.prototype._update = function (e, t) {
                    this._prepareBlock(e, t);
                    var r = this.W, i = this.h[0], n = this.h[1], s = this.h[2], a = this.h[3], f = this.h[4],
                        c = this.h[5], l = this.h[6], p = this.h[7], v = this.h[8], m = this.h[9], g = this.h[10],
                        B = this.h[11], R = this.h[12], I = this.h[13], T = this.h[14], j = this.h[15];
                    o(this.k.length === r.length);
                    for (var O = 0; O < r.length; O += 2) {
                        var P = T, C = j, q = x(v, m), U = M(v, m), N = w(v, 0, g, 0, R), D = _(0, m, 0, B, 0, I),
                            L = this.k[O], z = this.k[O + 1], F = r[O], K = r[O + 1],
                            Y = b(P, C, q, U, N, D, L, z, F, K), H = y(P, C, q, U, N, D, L, z, F, K);
                        P = A(i, n), C = E(i, n), q = S(i, 0, s, 0, f), U = k(0, n, 0, a, 0, c);
                        var V = h(P, C, q, U), J = d(P, C, q, U);
                        T = R, j = I, R = g, I = B, g = v, B = m, v = h(l, p, Y, H), m = d(p, p, Y, H), l = f, p = c, f = s, c = a, s = i, a = n, i = h(Y, H, V, J), n = d(Y, H, V, J)
                    }
                    u(this.h, 0, i, n), u(this.h, 2, s, a), u(this.h, 4, f, c), u(this.h, 6, l, p), u(this.h, 8, v, m), u(this.h, 10, g, B), u(this.h, 12, R, I), u(this.h, 14, T, j)
                }, g.prototype._digest = function (e) {
                    return "hex" === e ? i.toHex32(this.h, "big") : i.split32(this.h, "big")
                }
            }, function (e, t, r) {
                var i = r(0), n = r(20).Reporter, o = r(3).Buffer;

                function s(e, t) {
                    n.call(this, t), o.isBuffer(e) ? (this.base = e, this.offset = 0, this.length = e.length) : this.error("Input not Buffer")
                }

                function a(e, t) {
                    if (Array.isArray(e)) this.length = 0, this.value = e.map(function (e) {
                        return e instanceof a || (e = new a(e, t)), this.length += e.length, e
                    }, this); else if ("number" == typeof e) {
                        if (!(0 <= e && e <= 255)) return t.error("non-byte EncoderBuffer value");
                        this.value = e, this.length = 1
                    } else if ("string" == typeof e) this.value = e, this.length = o.byteLength(e); else {
                        if (!o.isBuffer(e)) return t.error("Unsupported type: " + typeof e);
                        this.value = e, this.length = e.length
                    }
                }

                i(s, n), t.DecoderBuffer = s, s.prototype.save = function () {
                    return {offset: this.offset, reporter: n.prototype.save.call(this)}
                }, s.prototype.restore = function (e) {
                    var t = new s(this.base);
                    return t.offset = e.offset, t.length = this.offset, this.offset = e.offset, n.prototype.restore.call(this, e.reporter), t
                }, s.prototype.isEmpty = function () {
                    return this.offset === this.length
                }, s.prototype.readUInt8 = function (e) {
                    return this.offset + 1 <= this.length ? this.base.readUInt8(this.offset++, !0) : this.error(e || "DecoderBuffer overrun")
                }, s.prototype.skip = function (e, t) {
                    if (!(this.offset + e <= this.length)) return this.error(t || "DecoderBuffer overrun");
                    var r = new s(this.base);
                    return r._reporterState = this._reporterState, r.offset = this.offset, r.length = this.offset + e, this.offset += e, r
                }, s.prototype.raw = function (e) {
                    return this.base.slice(e ? e.offset : this.offset, this.length)
                }, t.EncoderBuffer = a, a.prototype.join = function (e, t) {
                    return e || (e = new o(this.length)), t || (t = 0), 0 === this.length ? e : (Array.isArray(this.value) ? this.value.forEach(function (r) {
                        r.join(e, t), t += r.length
                    }) : ("number" == typeof this.value ? e[t] = this.value : "string" == typeof this.value ? e.write(this.value, t) : o.isBuffer(this.value) && this.value.copy(e, t), t += this.length), e)
                }
            }, function (e, t, r) {
                var i = t;
                i._reverse = function (e) {
                    var t = {};
                    return Object.keys(e).forEach(function (r) {
                        (0 | r) == r && (r |= 0);
                        var i = e[r];
                        t[i] = r
                    }), t
                }, i.der = r(157)
            }, function (e, t, r) {
                var i = r(0), n = r(19), o = n.base, s = n.bignum, a = n.constants.der;

                function f(e) {
                    this.enc = "der", this.name = e.name, this.entity = e, this.tree = new c, this.tree._init(e.body)
                }

                function c(e) {
                    o.Node.call(this, "der", e)
                }

                function u(e, t) {
                    var r = e.readUInt8(t);
                    if (e.isError(r)) return r;
                    var i = a.tagClass[r >> 6], n = 0 == (32 & r);
                    if (31 == (31 & r)) {
                        var o = r;
                        for (r = 0; 128 == (128 & o);) {
                            if (o = e.readUInt8(t), e.isError(o)) return o;
                            r <<= 7, r |= 127 & o
                        }
                    } else r &= 31;
                    return {cls: i, primitive: n, tag: r, tagStr: a.tag[r]}
                }

                function h(e, t, r) {
                    var i = e.readUInt8(r);
                    if (e.isError(i)) return i;
                    if (!t && 128 === i) return null;
                    if (0 == (128 & i)) return i;
                    var n = 127 & i;
                    if (n > 4) return e.error("length octect is too long");
                    i = 0;
                    for (var o = 0; o < n; o++) {
                        i <<= 8;
                        var s = e.readUInt8(r);
                        if (e.isError(s)) return s;
                        i |= s
                    }
                    return i
                }

                e.exports = f, f.prototype.decode = function (e, t) {
                    return e instanceof o.DecoderBuffer || (e = new o.DecoderBuffer(e, t)), this.tree._decode(e, t)
                }, i(c, o.Node), c.prototype._peekTag = function (e, t, r) {
                    if (e.isEmpty()) return !1;
                    var i = e.save(), n = u(e, 'Failed to peek tag: "' + t + '"');
                    return e.isError(n) ? n : (e.restore(i), n.tag === t || n.tagStr === t || n.tagStr + "of" === t || r)
                }, c.prototype._decodeTag = function (e, t, r) {
                    var i = u(e, 'Failed to decode tag of "' + t + '"');
                    if (e.isError(i)) return i;
                    var n = h(e, i.primitive, 'Failed to get length of "' + t + '"');
                    if (e.isError(n)) return n;
                    if (!r && i.tag !== t && i.tagStr !== t && i.tagStr + "of" !== t) return e.error('Failed to match tag: "' + t + '"');
                    if (i.primitive || null !== n) return e.skip(n, 'Failed to match body of: "' + t + '"');
                    var o = e.save(),
                        s = this._skipUntilEnd(e, 'Failed to skip indefinite length body: "' + this.tag + '"');
                    return e.isError(s) ? s : (n = e.offset - o.offset, e.restore(o), e.skip(n, 'Failed to match body of: "' + t + '"'))
                }, c.prototype._skipUntilEnd = function (e, t) {
                    for (; ;) {
                        var r = u(e, t);
                        if (e.isError(r)) return r;
                        var i, n = h(e, r.primitive, t);
                        if (e.isError(n)) return n;
                        if (i = r.primitive || null !== n ? e.skip(n) : this._skipUntilEnd(e, t), e.isError(i)) return i;
                        if ("end" === r.tagStr) break
                    }
                }, c.prototype._decodeList = function (e, t, r, i) {
                    for (var n = []; !e.isEmpty();) {
                        var o = this._peekTag(e, "end");
                        if (e.isError(o)) return o;
                        var s = r.decode(e, "der", i);
                        if (e.isError(s) && o) break;
                        n.push(s)
                    }
                    return n
                }, c.prototype._decodeStr = function (e, t) {
                    if ("bitstr" === t) {
                        var r = e.readUInt8();
                        return e.isError(r) ? r : {unused: r, data: e.raw()}
                    }
                    if ("bmpstr" === t) {
                        var i = e.raw();
                        if (i.length % 2 == 1) return e.error("Decoding of string type: bmpstr length mismatch");
                        for (var n = "", o = 0; o < i.length / 2; o++) n += String.fromCharCode(i.readUInt16BE(2 * o));
                        return n
                    }
                    if ("numstr" === t) {
                        var s = e.raw().toString("ascii");
                        return this._isNumstr(s) ? s : e.error("Decoding of string type: numstr unsupported characters")
                    }
                    if ("octstr" === t) return e.raw();
                    if ("objDesc" === t) return e.raw();
                    if ("printstr" === t) {
                        var a = e.raw().toString("ascii");
                        return this._isPrintstr(a) ? a : e.error("Decoding of string type: printstr unsupported characters")
                    }
                    return /str$/.test(t) ? e.raw().toString() : e.error("Decoding of string type: " + t + " unsupported")
                }, c.prototype._decodeObjid = function (e, t, r) {
                    for (var i, n = [], o = 0; !e.isEmpty();) {
                        var s = e.readUInt8();
                        o <<= 7, o |= 127 & s, 0 == (128 & s) && (n.push(o), o = 0)
                    }
                    128 & s && n.push(o);
                    var a = n[0] / 40 | 0, f = n[0] % 40;
                    if (i = r ? n : [a, f].concat(n.slice(1)), t) {
                        var c = t[i.join(" ")];
                        void 0 === c && (c = t[i.join(".")]), void 0 !== c && (i = c)
                    }
                    return i
                }, c.prototype._decodeTime = function (e, t) {
                    var r = e.raw().toString();
                    if ("gentime" === t) var i = 0 | r.slice(0, 4), n = 0 | r.slice(4, 6), o = 0 | r.slice(6, 8),
                        s = 0 | r.slice(8, 10), a = 0 | r.slice(10, 12), f = 0 | r.slice(12, 14); else {
                        if ("utctime" !== t) return e.error("Decoding " + t + " time is not supported yet");
                        i = 0 | r.slice(0, 2), n = 0 | r.slice(2, 4), o = 0 | r.slice(4, 6), s = 0 | r.slice(6, 8), a = 0 | r.slice(8, 10), f = 0 | r.slice(10, 12), i = i < 70 ? 2e3 + i : 1900 + i
                    }
                    return Date.UTC(i, n - 1, o, s, a, f, 0)
                }, c.prototype._decodeNull = function (e) {
                    return null
                }, c.prototype._decodeBool = function (e) {
                    var t = e.readUInt8();
                    return e.isError(t) ? t : 0 !== t
                }, c.prototype._decodeInt = function (e, t) {
                    var r = e.raw(), i = new s(r);
                    return t && (i = t[i.toString(10)] || i), i
                }, c.prototype._use = function (e, t) {
                    return "function" == typeof e && (e = e(t)), e._getDecoder("der").tree
                }
            }, function (e, t, r) {
                var i = r(0), n = r(3).Buffer, o = r(19), s = o.base, a = o.constants.der;

                function f(e) {
                    this.enc = "der", this.name = e.name, this.entity = e, this.tree = new c, this.tree._init(e.body)
                }

                function c(e) {
                    s.Node.call(this, "der", e)
                }

                function u(e) {
                    return e < 10 ? "0" + e : e
                }

                e.exports = f, f.prototype.encode = function (e, t) {
                    return this.tree._encode(e, t).join()
                }, i(c, s.Node), c.prototype._encodeComposite = function (e, t, r, i) {
                    var o, s = function (e, t, r, i) {
                        var n;
                        if ("seqof" === e ? e = "seq" : "setof" === e && (e = "set"), a.tagByName.hasOwnProperty(e)) n = a.tagByName[e]; else {
                            if ("number" != typeof e || (0 | e) !== e) return i.error("Unknown tag: " + e);
                            n = e
                        }
                        return n >= 31 ? i.error("Multi-octet tag encoding unsupported") : (t || (n |= 32), n | a.tagClassByName[r || "universal"] << 6)
                    }(e, t, r, this.reporter);
                    if (i.length < 128) return (o = new n(2))[0] = s, o[1] = i.length, this._createEncoderBuffer([o, i]);
                    for (var f = 1, c = i.length; c >= 256; c >>= 8) f++;
                    (o = new n(2 + f))[0] = s, o[1] = 128 | f, c = 1 + f;
                    for (var u = i.length; u > 0; c--, u >>= 8) o[c] = 255 & u;
                    return this._createEncoderBuffer([o, i])
                }, c.prototype._encodeStr = function (e, t) {
                    if ("bitstr" === t) return this._createEncoderBuffer([0 | e.unused, e.data]);
                    if ("bmpstr" === t) {
                        for (var r = new n(2 * e.length), i = 0; i < e.length; i++) r.writeUInt16BE(e.charCodeAt(i), 2 * i);
                        return this._createEncoderBuffer(r)
                    }
                    return "numstr" === t ? this._isNumstr(e) ? this._createEncoderBuffer(e) : this.reporter.error("Encoding of string type: numstr supports only digits and space") : "printstr" === t ? this._isPrintstr(e) ? this._createEncoderBuffer(e) : this.reporter.error("Encoding of string type: printstr supports only latin upper and lower case letters, digits, space, apostrophe, left and rigth parenthesis, plus sign, comma, hyphen, dot, slash, colon, equal sign, question mark") : /str$/.test(t) ? this._createEncoderBuffer(e) : "objDesc" === t ? this._createEncoderBuffer(e) : this.reporter.error("Encoding of string type: " + t + " unsupported")
                }, c.prototype._encodeObjid = function (e, t, r) {
                    if ("string" == typeof e) {
                        if (!t) return this.reporter.error("string objid given, but no values map found");
                        if (!t.hasOwnProperty(e)) return this.reporter.error("objid not found in values map");
                        e = t[e].split(/[\s\.]+/g);
                        for (var i = 0; i < e.length; i++) e[i] |= 0
                    } else if (Array.isArray(e)) for (e = e.slice(), i = 0; i < e.length; i++) e[i] |= 0;
                    if (!Array.isArray(e)) return this.reporter.error("objid() should be either array or string, got: " + JSON.stringify(e));
                    if (!r) {
                        if (e[1] >= 40) return this.reporter.error("Second objid identifier OOB");
                        e.splice(0, 2, 40 * e[0] + e[1])
                    }
                    var o = 0;
                    for (i = 0; i < e.length; i++) {
                        var s = e[i];
                        for (o++; s >= 128; s >>= 7) o++
                    }
                    var a = new n(o), f = a.length - 1;
                    for (i = e.length - 1; i >= 0; i--) for (s = e[i], a[f--] = 127 & s; (s >>= 7) > 0;) a[f--] = 128 | 127 & s;
                    return this._createEncoderBuffer(a)
                }, c.prototype._encodeTime = function (e, t) {
                    var r, i = new Date(e);
                    return "gentime" === t ? r = [u(i.getFullYear()), u(i.getUTCMonth() + 1), u(i.getUTCDate()), u(i.getUTCHours()), u(i.getUTCMinutes()), u(i.getUTCSeconds()), "Z"].join("") : "utctime" === t ? r = [u(i.getFullYear() % 100), u(i.getUTCMonth() + 1), u(i.getUTCDate()), u(i.getUTCHours()), u(i.getUTCMinutes()), u(i.getUTCSeconds()), "Z"].join("") : this.reporter.error("Encoding " + t + " time is not supported yet"), this._encodeStr(r, "octstr")
                }, c.prototype._encodeNull = function () {
                    return this._createEncoderBuffer("")
                }, c.prototype._encodeInt = function (e, t) {
                    if ("string" == typeof e) {
                        if (!t) return this.reporter.error("String int or enum given, but no values map");
                        if (!t.hasOwnProperty(e)) return this.reporter.error("Values map doesn't contain: " + JSON.stringify(e));
                        e = t[e]
                    }
                    if ("number" != typeof e && !n.isBuffer(e)) {
                        var r = e.toArray();
                        !e.sign && 128 & r[0] && r.unshift(0), e = new n(r)
                    }
                    if (n.isBuffer(e)) {
                        var i = e.length;
                        0 === e.length && i++;
                        var o = new n(i);
                        return e.copy(o), 0 === e.length && (o[0] = 0), this._createEncoderBuffer(o)
                    }
                    if (e < 128) return this._createEncoderBuffer(e);
                    if (e < 256) return this._createEncoderBuffer([0, e]);
                    i = 1;
                    for (var s = e; s >= 256; s >>= 8) i++;
                    for (s = (o = new Array(i)).length - 1; s >= 0; s--) o[s] = 255 & e, e >>= 8;
                    return 128 & o[0] && o.unshift(0), this._createEncoderBuffer(new n(o))
                }, c.prototype._encodeBool = function (e) {
                    return this._createEncoderBuffer(e ? 255 : 0)
                }, c.prototype._use = function (e, t) {
                    return "function" == typeof e && (e = e(t)), e._getEncoder("der").tree
                }, c.prototype._skipDefault = function (e, t, r) {
                    var i, n = this._baseState;
                    if (null === n.default) return !1;
                    var o = e.join();
                    if (void 0 === n.defaultBuffer && (n.defaultBuffer = this._encodeValue(n.default, t, r).join()), o.length !== n.defaultBuffer.length) return !1;
                    for (i = 0; i < o.length; i++) if (o[i] !== n.defaultBuffer[i]) return !1;
                    return !0
                }
            }, function (e, t) {
                e.exports = {
                    "1.3.132.0.10": "secp256k1",
                    "1.3.132.0.33": "p224",
                    "1.2.840.10045.3.1.1": "p192",
                    "1.2.840.10045.3.1.7": "p256",
                    "1.3.132.0.34": "p384",
                    "1.3.132.0.35": "p521"
                }
            }, function (e, t, r) {
                (function (t) {
                    var i = r(15);

                    function n(e) {
                        var r = new t(4);
                        return r.writeUInt32BE(e, 0), r
                    }

                    e.exports = function (e, r) {
                        for (var o, s = new t(""), a = 0; s.length < r;) o = n(a++), s = t.concat([s, i("sha1").update(e).update(o).digest()]);
                        return s.slice(0, r)
                    }
                }).call(t, r(3).Buffer)
            }, function (e, t) {
                e.exports = function (e, t) {
                    for (var r = e.length, i = -1; ++i < r;) e[i] ^= t[i];
                    return e
                }
            }, function (e, t, r) {
                (function (t) {
                    var i = r(2);
                    e.exports = function (e, r) {
                        return new t(e.toRed(i.mont(r.modulus)).redPow(new i(r.publicExponent)).fromRed().toArray())
                    }
                }).call(t, r(3).Buffer)
            }, function (e, t, r) {
                const i = r(2), n = r(75);

                function o(e, t, r) {
                    let i = r(e + 7 >> 3), n = 7 & e;
                    return 0 != n && (i[0] &= ~(255 << n)), t && (i[0] |= 0 !== n ? 1 << n - 1 : 128), Uint8Array.from(i)
                }

                e.exports = {
                    bits: o, int: function (e, t) {
                        let r, s = e.bitLength();
                        for (; ;) if (bytes = o(s, !1, t), (r = new i(bytes)).cmp(n.zeroBN) > 0 && r.cmp(e) < 0) return bytes
                    }
                }
            }, function (e, t, r) {
                "use strict";
                const i = {zeroBN: new (r(2))(0)};
                e.exports = i
            }, function (e, t, r) {
                "use strict";
                const i = r(2), n = r(11), o = r(27), s = r(75), a = r(10);

                class f extends a.Point {
                    constructor(e, t, r) {
                        super();
                        let n = t || null, o = r || null;
                        void 0 !== t && t.constructor === Uint8Array && (n = new i(t, 16, "le")), void 0 !== r && r.constructor === Uint8Array && (o = new i(r, 16, "le")), this.ref = {
                            curve: e,
                            point: e.curve.point(n, o)
                        }, this.string = this.toString.bind(this), this.inspect = this.toString.bind(this)
                    }

                    toString() {
                        return this.ref.point.inf ? "(0,0)" : "(" + this.ref.point.x.fromRed().toString(10) + "," + this.ref.point.y.fromRed().toString(10) + ")"
                    }

                    equal(e) {
                        return !(this.ref.point.isInfinity() ^ e.ref.point.isInfinity() || !(this.ref.point.isInfinity() & e.ref.point.isInfinity()) && (0 !== this.ref.point.x.cmp(e.ref.point.x) || 0 !== this.ref.point.y.cmp(e.ref.point.y)))
                    }

                    set(e) {
                        return this.ref = e.ref, this
                    }

                    clone() {
                        const e = this.ref.point;
                        return new f(this.ref.curve, e.x, e.y)
                    }

                    null() {
                        return this.ref.point = this.ref.curve.curve.point(null, null), this
                    }

                    base() {
                        const e = this.ref.curve.curve.g;
                        return this.ref.point = this.ref.curve.curve.point(e.x, e.y), this
                    }

                    embedLen() {
                        return this.ref.curve.curve.p.bitLength() - 8 - 8 >> 3
                    }

                    embed(e, t) {
                        if (e.constructor !== Uint8Array) throw new TypeError("data should be Uint8Array");
                        let r = this.ref.curve._coordLen(), o = this.embedLen();
                        if (e.length > o) throw new Error("data.length > dl");
                        for (o > e.length && (o = e.length), t = t || n.randomBytes; ;) {
                            const n = this.ref.curve.curve.p.bitLength();
                            let s = t(n >> 3), a = Uint8Array.from(s), c = 7 & n;
                            0 != c && (a[0] &= ~(255 << c)), o > 0 && (a[r - 1] = o, a.set(e, r - o - 1));
                            let u = new i(a, 16, "be");
                            if (u.cmp(this.ref.curve.curve.p) > 0) continue;
                            let h = u.toRed(this.ref.curve.curve.red), d = h.redMul(this.ref.curve.curve.a),
                                l = h.redSqr().redMul(h).redAdd(d).redAdd(this.ref.curve.curve.b), p = l.redSqrt();
                            if (0 != (128 & t(1)[0]) && (p = this.ref.curve.curve.p.sub(p).toRed(this.ref.curve.curve.red)), 0 === p.redSqr().cmp(l)) return new f(this.ref.curve, h, p)
                        }
                    }

                    data() {
                        const e = this.ref.curve._coordLen();
                        let t = Uint8Array.from(this.ref.point.x.fromRed().toArray("be", e));
                        const r = t[e - 1];
                        if (r > this.embedLen()) throw new Error("invalid embed data length");
                        return t.slice(e - r - 1, e - 1)
                    }

                    add(e, t) {
                        const r = e.ref.point;
                        return this.ref.point = this.ref.curve.curve.point(r.x, r.y).add(t.ref.point), this
                    }

                    sub(e, t) {
                        const r = e.ref.point;
                        return this.ref.point = this.ref.curve.curve.point(r.x, r.y).add(t.ref.point.neg()), this
                    }

                    neg(e) {
                        return this.ref.point = e.ref.point.neg(), this
                    }

                    mul(e, t) {
                        if (e.constructor !== o) throw new TypeError("s should be a Scalar");
                        t = t || null;
                        const r = e.ref.arr.fromRed();
                        return this.ref.point = null !== t ? t.ref.point.mul(r) : this.ref.curve.curve.g.mul(r), this
                    }

                    pick(e) {
                        return this.embed(new Uint8Array, e)
                    }

                    marshalSize() {
                        return this.ref.curve.pointLen()
                    }

                    marshalBinary() {
                        const e = this.ref.curve._coordLen();
                        let t = new Uint8Array(this.ref.curve.pointLen());
                        t[0] = 4;
                        let r = this.ref.point.x.fromRed().toArray("be");
                        t.set(r, 1 + e - r.length);
                        let i = this.ref.point.y.fromRed().toArray("be");
                        return t.set(i, 1 + 2 * e - i.length), t
                    }

                    unmarshalBinary(e) {
                        if (e.constructor !== Uint8Array) throw new TypeError("bytes should be a Uint8Array");
                        const t = this.ref.curve._coordLen();
                        if (e.length != 1 + 2 * t) throw new Error;
                        if (4 != e[0]) throw new Error("unmarshalBinary only accepts uncompressed point");
                        let r = new i(e.slice(1, 1 + t), 16), n = new i(e.slice(1 + t), 16);
                        if (0 === r.cmp(s.zeroBN) && 0 === n.cmp(s.zeroBN)) return this.ref.point = this.ref.curve.curve.point(null, null), this;
                        if (this.ref.point = this.ref.curve.curve.point(r, n), !this.ref.curve.curve.validate(this.ref.point)) throw new Error("point is not on curve")
                    }
                }

                e.exports = f
            }, function (e, t, r) {
                "use strict";
                const i = r(2), n = r(11), o = r(40), s = r(10);

                class a extends s.Point {
                    constructor(e, t, r, n, o) {
                        super();
                        let s = t, a = r, f = n, c = o;
                        void 0 !== t && t.constructor === Uint8Array && (s = new i(t, 16, "le")), void 0 !== r && r.constructor === Uint8Array && (a = new i(r, 16, "le")), void 0 !== n && n.constructor === Uint8Array && (f = new i(n, 16, "le")), void 0 !== o && o.constructor === Uint8Array && (c = new i(o, 16, "le")), this.ref = {
                            point: e.curve.point(s, a, f, c),
                            curve: e
                        }, this.string = this.toString.bind(this), this.inspect = this.toString.bind(this)
                    }

                    toString() {
                        const e = this.marshalBinary();
                        return Array.from(e, e => ("0" + (255 & e).toString(16)).slice(-2)).join("")
                    }

                    equal(e) {
                        const t = this.marshalBinary(), r = e.marshalBinary();
                        for (var i = 0; i < 32; i++) if (t[i] !== r[i]) return !1;
                        return !0
                    }

                    set(e) {
                        return this.ref = e.ref, this
                    }

                    clone() {
                        const e = this.ref.point;
                        return new a(this.ref.curve, e.x, e.y, e.z, e.t)
                    }

                    null() {
                        return this.ref.point = this.ref.curve.curve.point(0, 1, 1, 0), this
                    }

                    base() {
                        return this.ref.point = this.ref.curve.curve.point(this.ref.curve.curve.g.getX(), this.ref.curve.curve.g.getY()), this
                    }

                    embedLen() {
                        return Math.floor(239 / 8)
                    }

                    embed(e, t) {
                        if (e.constructor !== Uint8Array) throw new TypeError("data should be Uint8Array");
                        let r = this.embedLen();
                        if (e.length > r) throw new Error("data.length > embedLen");
                        r > e.length && (r = e.length), t = t || n.randomBytes;
                        let o = new a(this.ref.curve);
                        for (; ;) {
                            let n = t(32), s = Uint8Array.from(n);
                            r > 0 && (s[0] = r, s.set(e, 1)), new i(s, 16, "le");
                            try {
                                o.unmarshalBinary(s)
                            } catch (e) {
                                continue
                            }
                            if (0 == r) {
                                if (o.ref.point = o.ref.point.mul(new i(8)), o.ref.point.isInfinity()) continue;
                                return o
                            }
                            let a = o.clone();
                            if (a.ref.point = a.ref.point.mul(this.ref.curve.curve.n), a.ref.point.isInfinity()) return o
                        }
                    }

                    data() {
                        const e = this.marshalBinary(), t = e[0];
                        if (t > this.embedLen()) throw new Error("invalid embedded data length");
                        return e.slice(1, t + 1)
                    }

                    add(e, t) {
                        const r = e.ref.point;
                        return this.ref.point = this.ref.curve.curve.point(r.x, r.y, r.z, r.t).add(t.ref.point), this
                    }

                    sub(e, t) {
                        const r = e.ref.point;
                        return this.ref.point = this.ref.curve.curve.point(r.x, r.y, r.z, r.t).add(t.ref.point.neg()), this
                    }

                    neg(e) {
                        return this.ref.point = e.ref.point.neg(), this
                    }

                    mul(e, t) {
                        if (e.constructor !== o) throw new TypeError("s should be a Scalar");
                        t = t || null;
                        const r = e.ref.arr.fromRed();
                        return this.ref.point = null !== t ? t.ref.point.mul(r) : this.ref.curve.curve.g.mul(r), this
                    }

                    pick(e) {
                        return this.embed(new Uint8Array, e)
                    }

                    marshalSize() {
                        return 32
                    }

                    marshalBinary() {
                        this.ref.point.normalize();
                        const e = this.ref.point.getY().toArray("le", 32);
                        return e[31] ^= (this.ref.point.x.isOdd() ? 1 : 0) << 7, Uint8Array.from(e)
                    }

                    unmarshalBinary(e) {
                        if (e.constructor !== Uint8Array) throw new TypeError("bytes should be a Uint8Array");
                        const t = new Uint8Array(32);
                        t.set(e, 0);
                        const r = t[31] >> 7 == 1;
                        t[31] &= 127;
                        let n = new i(t, 16, "le");
                        if (n.cmp(this.ref.curve.curve.p) >= 0) throw new Error("bytes > p");
                        this.ref.point = this.ref.curve.curve.pointFromY(n, r)
                    }
                }

                e.exports = a
            }, function (e, t, r) {
                "use strict";
                const i = t;
                i.curve = r(79), i.sign = r(174);
                const n = r(10);
                i.Group = n.Group, i.Point = n.Point, i.Scalar = n.Scalar
            }, function (e, t, r) {
                "use strict";
                const i = r(80), n = r(172), o = {};
                o.edwards25519 = n.Curve, o.p256 = i.Curve.bind(i.Params.p256), e.exports = {
                    nist: i,
                    edwards25519: n,
                    availableCurves: function () {
                        return Object.keys(o)
                    },
                    newCurve: function (e) {
                        if (!(e in o)) throw new Error("curve not known");
                        return new o[e]
                    }
                }
            }, function (e, t, r) {
                "use strict";
                const i = r(81), n = r(76), o = r(27), s = r(171);
                e.exports = {Curve: i, Point: n, Scalar: o, Params: s}
            }, function (e, t, r) {
                "use strict";
                const i = r(27), n = r(76), o = (r(11), r(4)), s = r(2), a = r(10);
                e.exports = class extends a.Group {
                    constructor(e) {
                        super();
                        let {name: t, bitSize: r, gx: i, gy: n} = e, a = function (e, t) {
                            var r = {};
                            for (var i in e) t.indexOf(i) >= 0 || Object.prototype.hasOwnProperty.call(e, i) && (r[i] = e[i]);
                            return r
                        }(e, ["name", "bitSize", "gx", "gy"]);
                        this.name = t, a.g = [new s(i, 16, "le"), new s(n, 16, "le")];
                        for (let e in a) "g" !== e && (a[e] = new s(a[e], 16, "le"));
                        this.curve = new o.curve.short(a), this.bitSize = r, this.redN = s.red(a.n)
                    }

                    string() {
                        return this.name
                    }

                    _coordLen() {
                        return this.bitSize + 7 >> 3
                    }

                    scalarLen() {
                        return this.curve.n.bitLength() + 7 >> 3
                    }

                    scalar() {
                        return new i(this, this.redN)
                    }

                    pointLen() {
                        return 2 * this._coordLen() + 1
                    }

                    point() {
                        return new n(this)
                    }
                }
            }, function (e, t) {
                e.exports = function (e) {
                    return e.webpackPolyfill || (e.deprecate = function () {
                    }, e.paths = [], e.children || (e.children = []), Object.defineProperty(e, "loaded", {
                        enumerable: !0,
                        get: function () {
                            return e.l
                        }
                    }), Object.defineProperty(e, "id", {
                        enumerable: !0, get: function () {
                            return e.i
                        }
                    }), e.webpackPolyfill = 1), e
                }
            }, function (e, t) {
            }, function (e, t, r) {
                "use strict";
                t.byteLength = function (e) {
                    return 3 * e.length / 4 - c(e)
                }, t.toByteArray = function (e) {
                    var t, r, i, s, a, f = e.length;
                    s = c(e), a = new o(3 * f / 4 - s), r = s > 0 ? f - 4 : f;
                    var u = 0;
                    for (t = 0; t < r; t += 4) i = n[e.charCodeAt(t)] << 18 | n[e.charCodeAt(t + 1)] << 12 | n[e.charCodeAt(t + 2)] << 6 | n[e.charCodeAt(t + 3)], a[u++] = i >> 16 & 255, a[u++] = i >> 8 & 255, a[u++] = 255 & i;
                    return 2 === s ? (i = n[e.charCodeAt(t)] << 2 | n[e.charCodeAt(t + 1)] >> 4, a[u++] = 255 & i) : 1 === s && (i = n[e.charCodeAt(t)] << 10 | n[e.charCodeAt(t + 1)] << 4 | n[e.charCodeAt(t + 2)] >> 2, a[u++] = i >> 8 & 255, a[u++] = 255 & i), a
                }, t.fromByteArray = function (e) {
                    for (var t, r = e.length, n = r % 3, o = "", s = [], a = 0, f = r - n; a < f; a += 16383) s.push(u(e, a, a + 16383 > f ? f : a + 16383));
                    return 1 === n ? (t = e[r - 1], o += i[t >> 2], o += i[t << 4 & 63], o += "==") : 2 === n && (t = (e[r - 2] << 8) + e[r - 1], o += i[t >> 10], o += i[t >> 4 & 63], o += i[t << 2 & 63], o += "="), s.push(o), s.join("")
                };
                for (var i = [], n = [], o = "undefined" != typeof Uint8Array ? Uint8Array : Array, s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", a = 0, f = s.length; a < f; ++a) i[a] = s[a], n[s.charCodeAt(a)] = a;

                function c(e) {
                    var t = e.length;
                    if (t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
                    return "=" === e[t - 2] ? 2 : "=" === e[t - 1] ? 1 : 0
                }

                function u(e, t, r) {
                    for (var n, o, s = [], a = t; a < r; a += 3) n = (e[a] << 16) + (e[a + 1] << 8) + e[a + 2], s.push(i[(o = n) >> 18 & 63] + i[o >> 12 & 63] + i[o >> 6 & 63] + i[63 & o]);
                    return s.join("")
                }

                n["-".charCodeAt(0)] = 62, n["_".charCodeAt(0)] = 63
            }, function (e, t) {
                t.read = function (e, t, r, i, n) {
                    var o, s, a = 8 * n - i - 1, f = (1 << a) - 1, c = f >> 1, u = -7, h = r ? n - 1 : 0,
                        d = r ? -1 : 1, l = e[t + h];
                    for (h += d, o = l & (1 << -u) - 1, l >>= -u, u += a; u > 0; o = 256 * o + e[t + h], h += d, u -= 8) ;
                    for (s = o & (1 << -u) - 1, o >>= -u, u += i; u > 0; s = 256 * s + e[t + h], h += d, u -= 8) ;
                    if (0 === o) o = 1 - c; else {
                        if (o === f) return s ? NaN : 1 / 0 * (l ? -1 : 1);
                        s += Math.pow(2, i), o -= c
                    }
                    return (l ? -1 : 1) * s * Math.pow(2, o - i)
                }, t.write = function (e, t, r, i, n, o) {
                    var s, a, f, c = 8 * o - n - 1, u = (1 << c) - 1, h = u >> 1,
                        d = 23 === n ? Math.pow(2, -24) - Math.pow(2, -77) : 0, l = i ? 0 : o - 1, p = i ? 1 : -1,
                        b = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
                    for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (a = isNaN(t) ? 1 : 0, s = u) : (s = Math.floor(Math.log(t) / Math.LN2), t * (f = Math.pow(2, -s)) < 1 && (s--, f *= 2), (t += s + h >= 1 ? d / f : d * Math.pow(2, 1 - h)) * f >= 2 && (s++, f /= 2), s + h >= u ? (a = 0, s = u) : s + h >= 1 ? (a = (t * f - 1) * Math.pow(2, n), s += h) : (a = t * Math.pow(2, h - 1) * Math.pow(2, n), s = 0)); n >= 8; e[r + l] = 255 & a, l += p, a /= 256, n -= 8) ;
                    for (s = s << n | a, c += n; c > 0; e[r + l] = 255 & s, l += p, s /= 256, c -= 8) ;
                    e[r + l - p] |= 128 * b
                }
            }, function (e, t, r) {
                "use strict";
                (function (t) {
                    var r = new t(4);
                    r.fill(0), e.exports = function (e, i) {
                        var n = i(function (e) {
                            if (e.length % 4 != 0) {
                                var i = e.length + (4 - e.length % 4);
                                e = t.concat([e, r], i)
                            }
                            for (var n = new Array(e.length >>> 2), o = 0, s = 0; o < e.length; o += 4, s++) n[s] = e.readInt32LE(o);
                            return n
                        }(e), 8 * e.length);
                        e = new t(16);
                        for (var o = 0; o < n.length; o++) e.writeInt32LE(n[o], o << 2, !0);
                        return e
                    }
                }).call(t, r(3).Buffer)
            }, function (e, t, r) {
                "use strict";
                (function (t) {
                    var i = r(21).Transform;

                    function n(e) {
                        i.call(this), this._block = new t(e), this._blockSize = e, this._blockOffset = 0, this._length = [0, 0, 0, 0], this._finalized = !1
                    }

                    r(0)(n, i), n.prototype._transform = function (e, r, i) {
                        var n = null;
                        try {
                            "buffer" !== r && (e = new t(e, r)), this.update(e)
                        } catch (e) {
                            n = e
                        }
                        i(n)
                    }, n.prototype._flush = function (e) {
                        var t = null;
                        try {
                            this.push(this._digest())
                        } catch (e) {
                            t = e
                        }
                        e(t)
                    }, n.prototype.update = function (e, r) {
                        if (!t.isBuffer(e) && "string" != typeof e) throw new TypeError("Data must be a string or a buffer");
                        if (this._finalized) throw new Error("Digest already called");
                        t.isBuffer(e) || (e = new t(e, r || "binary"));
                        for (var i = this._block, n = 0; this._blockOffset + e.length - n >= this._blockSize;) {
                            for (var o = this._blockOffset; o < this._blockSize;) i[o++] = e[n++];
                            this._update(), this._blockOffset = 0
                        }
                        for (; n < e.length;) i[this._blockOffset++] = e[n++];
                        for (var s = 0, a = 8 * e.length; a > 0; ++s) this._length[s] += a, (a = this._length[s] / 4294967296 | 0) > 0 && (this._length[s] -= 4294967296 * a);
                        return this
                    }, n.prototype._update = function (e) {
                        throw new Error("_update is not implemented")
                    }, n.prototype.digest = function (e) {
                        if (this._finalized) throw new Error("Digest already called");
                        this._finalized = !0;
                        var t = this._digest();
                        return void 0 !== e && (t = t.toString(e)), t
                    }, n.prototype._digest = function () {
                        throw new Error("_digest is not implemented")
                    }, e.exports = n
                }).call(t, r(3).Buffer)
            }, function (e, t) {
            }, function (e, t, r) {
                "use strict";
                var i = r(1).Buffer;
                e.exports = function () {
                    function e() {
                        !function (e, t) {
                            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                        }(this, e), this.head = null, this.tail = null, this.length = 0
                    }

                    return e.prototype.push = function (e) {
                        var t = {data: e, next: null};
                        this.length > 0 ? this.tail.next = t : this.head = t, this.tail = t, ++this.length
                    }, e.prototype.unshift = function (e) {
                        var t = {data: e, next: this.head};
                        0 === this.length && (this.tail = t), this.head = t, ++this.length
                    }, e.prototype.shift = function () {
                        if (0 !== this.length) {
                            var e = this.head.data;
                            return 1 === this.length ? this.head = this.tail = null : this.head = this.head.next, --this.length, e
                        }
                    }, e.prototype.clear = function () {
                        this.head = this.tail = null, this.length = 0
                    }, e.prototype.join = function (e) {
                        if (0 === this.length) return "";
                        for (var t = this.head, r = "" + t.data; t = t.next;) r += e + t.data;
                        return r
                    }, e.prototype.concat = function (e) {
                        if (0 === this.length) return i.alloc(0);
                        if (1 === this.length) return this.head.data;
                        for (var t, r, n = i.allocUnsafe(e >>> 0), o = this.head, s = 0; o;) t = n, r = s, o.data.copy(t, r), s += o.data.length, o = o.next;
                        return n
                    }, e
                }()
            }, function (e, t, r) {
                (function (e) {
                    var i = Function.prototype.apply;

                    function n(e, t) {
                        this._id = e, this._clearFn = t
                    }

                    t.setTimeout = function () {
                        return new n(i.call(setTimeout, window, arguments), clearTimeout)
                    }, t.setInterval = function () {
                        return new n(i.call(setInterval, window, arguments), clearInterval)
                    }, t.clearTimeout = t.clearInterval = function (e) {
                        e && e.close()
                    }, n.prototype.unref = n.prototype.ref = function () {
                    }, n.prototype.close = function () {
                        this._clearFn.call(window, this._id)
                    }, t.enroll = function (e, t) {
                        clearTimeout(e._idleTimeoutId), e._idleTimeout = t
                    }, t.unenroll = function (e) {
                        clearTimeout(e._idleTimeoutId), e._idleTimeout = -1
                    }, t._unrefActive = t.active = function (e) {
                        clearTimeout(e._idleTimeoutId);
                        var t = e._idleTimeout;
                        t >= 0 && (e._idleTimeoutId = setTimeout(function () {
                            e._onTimeout && e._onTimeout()
                        }, t))
                    }, r(91), t.setImmediate = "undefined" != typeof self && self.setImmediate || void 0 !== e && e.setImmediate || this && this.setImmediate, t.clearImmediate = "undefined" != typeof self && self.clearImmediate || void 0 !== e && e.clearImmediate || this && this.clearImmediate
                }).call(t, r(7))
            }, function (e, t, r) {
                (function (e, t) {
                    !function (e, r) {
                        "use strict";
                        if (!e.setImmediate) {
                            var i, n, o, s, a, f = 1, c = {}, u = !1, h = e.document,
                                d = Object.getPrototypeOf && Object.getPrototypeOf(e);
                            d = d && d.setTimeout ? d : e, "[object process]" === {}.toString.call(e.process) ? i = function (e) {
                                t.nextTick(function () {
                                    p(e)
                                })
                            } : function () {
                                if (e.postMessage && !e.importScripts) {
                                    var t = !0, r = e.onmessage;
                                    return e.onmessage = function () {
                                        t = !1
                                    }, e.postMessage("", "*"), e.onmessage = r, t
                                }
                            }() ? (s = "setImmediate$" + Math.random() + "$", a = function (t) {
                                t.source === e && "string" == typeof t.data && 0 === t.data.indexOf(s) && p(+t.data.slice(s.length))
                            }, e.addEventListener ? e.addEventListener("message", a, !1) : e.attachEvent("onmessage", a), i = function (t) {
                                e.postMessage(s + t, "*")
                            }) : e.MessageChannel ? ((o = new MessageChannel).port1.onmessage = function (e) {
                                p(e.data)
                            }, i = function (e) {
                                o.port2.postMessage(e)
                            }) : h && "onreadystatechange" in h.createElement("script") ? (n = h.documentElement, i = function (e) {
                                var t = h.createElement("script");
                                t.onreadystatechange = function () {
                                    p(e), t.onreadystatechange = null, n.removeChild(t), t = null
                                }, n.appendChild(t)
                            }) : i = function (e) {
                                setTimeout(p, 0, e)
                            }, d.setImmediate = function (e) {
                                "function" != typeof e && (e = new Function("" + e));
                                for (var t = new Array(arguments.length - 1), r = 0; r < t.length; r++) t[r] = arguments[r + 1];
                                var n = {callback: e, args: t};
                                return c[f] = n, i(f), f++
                            }, d.clearImmediate = l
                        }

                        function l(e) {
                            delete c[e]
                        }

                        function p(e) {
                            if (u) setTimeout(p, 0, e); else {
                                var t = c[e];
                                if (t) {
                                    u = !0;
                                    try {
                                        !function (e) {
                                            var t = e.callback, i = e.args;
                                            switch (i.length) {
                                                case 0:
                                                    t();
                                                    break;
                                                case 1:
                                                    t(i[0]);
                                                    break;
                                                case 2:
                                                    t(i[0], i[1]);
                                                    break;
                                                case 3:
                                                    t(i[0], i[1], i[2]);
                                                    break;
                                                default:
                                                    t.apply(r, i)
                                            }
                                        }(t)
                                    } finally {
                                        l(e), u = !1
                                    }
                                }
                            }
                        }
                    }("undefined" == typeof self ? void 0 === e ? this : e : self)
                }).call(t, r(7), r(8))
            }, function (e, t, r) {
                (function (t) {
                    function r(e) {
                        try {
                            if (!t.localStorage) return !1
                        } catch (e) {
                            return !1
                        }
                        var r = t.localStorage[e];
                        return null != r && "true" === String(r).toLowerCase()
                    }

                    e.exports = function (e, t) {
                        if (r("noDeprecation")) return e;
                        var i = !1;
                        return function () {
                            if (!i) {
                                if (r("throwDeprecation")) throw new Error(t);
                                r("traceDeprecation") ? console.trace(t) : console.warn(t), i = !0
                            }
                            return e.apply(this, arguments)
                        }
                    }
                }).call(t, r(7))
            }, function (e, t, r) {
                "use strict";
                e.exports = o;
                var i = r(45), n = r(16);

                function o(e) {
                    if (!(this instanceof o)) return new o(e);
                    i.call(this, e)
                }

                n.inherits = r(0), n.inherits(o, i), o.prototype._transform = function (e, t, r) {
                    r(null, e)
                }
            }, function (e, t, r) {
                e.exports = r(32)
            }, function (e, t, r) {
                e.exports = r(12)
            }, function (e, t, r) {
                e.exports = r(31).Transform
            }, function (e, t, r) {
                e.exports = r(31).PassThrough
            }, function (e, t, r) {
                var i = r(0), n = r(14), o = r(1).Buffer, s = [1518500249, 1859775393, -1894007588, -899497514],
                    a = new Array(80);

                function f() {
                    this.init(), this._w = a, n.call(this, 64, 56)
                }

                function c(e) {
                    return e << 30 | e >>> 2
                }

                function u(e, t, r, i) {
                    return 0 === e ? t & r | ~t & i : 2 === e ? t & r | t & i | r & i : t ^ r ^ i
                }

                i(f, n), f.prototype.init = function () {
                    return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this
                }, f.prototype._update = function (e) {
                    for (var t, r = this._w, i = 0 | this._a, n = 0 | this._b, o = 0 | this._c, a = 0 | this._d, f = 0 | this._e, h = 0; h < 16; ++h) r[h] = e.readInt32BE(4 * h);
                    for (; h < 80; ++h) r[h] = r[h - 3] ^ r[h - 8] ^ r[h - 14] ^ r[h - 16];
                    for (var d = 0; d < 80; ++d) {
                        var l = ~~(d / 20), p = 0 | ((t = i) << 5 | t >>> 27) + u(l, n, o, a) + f + r[d] + s[l];
                        f = a, a = o, o = c(n), n = i, i = p
                    }
                    this._a = i + this._a | 0, this._b = n + this._b | 0, this._c = o + this._c | 0, this._d = a + this._d | 0, this._e = f + this._e | 0
                }, f.prototype._hash = function () {
                    var e = o.allocUnsafe(20);
                    return e.writeInt32BE(0 | this._a, 0), e.writeInt32BE(0 | this._b, 4), e.writeInt32BE(0 | this._c, 8), e.writeInt32BE(0 | this._d, 12), e.writeInt32BE(0 | this._e, 16), e
                }, e.exports = f
            }, function (e, t, r) {
                var i = r(0), n = r(14), o = r(1).Buffer, s = [1518500249, 1859775393, -1894007588, -899497514],
                    a = new Array(80);

                function f() {
                    this.init(), this._w = a, n.call(this, 64, 56)
                }

                function c(e) {
                    return e << 5 | e >>> 27
                }

                function u(e) {
                    return e << 30 | e >>> 2
                }

                function h(e, t, r, i) {
                    return 0 === e ? t & r | ~t & i : 2 === e ? t & r | t & i | r & i : t ^ r ^ i
                }

                i(f, n), f.prototype.init = function () {
                    return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this
                }, f.prototype._update = function (e) {
                    for (var t, r = this._w, i = 0 | this._a, n = 0 | this._b, o = 0 | this._c, a = 0 | this._d, f = 0 | this._e, d = 0; d < 16; ++d) r[d] = e.readInt32BE(4 * d);
                    for (; d < 80; ++d) r[d] = (t = r[d - 3] ^ r[d - 8] ^ r[d - 14] ^ r[d - 16]) << 1 | t >>> 31;
                    for (var l = 0; l < 80; ++l) {
                        var p = ~~(l / 20), b = c(i) + h(p, n, o, a) + f + r[l] + s[p] | 0;
                        f = a, a = o, o = u(n), n = i, i = b
                    }
                    this._a = i + this._a | 0, this._b = n + this._b | 0, this._c = o + this._c | 0, this._d = a + this._d | 0, this._e = f + this._e | 0
                }, f.prototype._hash = function () {
                    var e = o.allocUnsafe(20);
                    return e.writeInt32BE(0 | this._a, 0), e.writeInt32BE(0 | this._b, 4), e.writeInt32BE(0 | this._c, 8), e.writeInt32BE(0 | this._d, 12), e.writeInt32BE(0 | this._e, 16), e
                }, e.exports = f
            }, function (e, t, r) {
                var i = r(0), n = r(46), o = r(14), s = r(1).Buffer, a = new Array(64);

                function f() {
                    this.init(), this._w = a, o.call(this, 64, 56)
                }

                i(f, n), f.prototype.init = function () {
                    return this._a = 3238371032, this._b = 914150663, this._c = 812702999, this._d = 4144912697, this._e = 4290775857, this._f = 1750603025, this._g = 1694076839, this._h = 3204075428, this
                }, f.prototype._hash = function () {
                    var e = s.allocUnsafe(28);
                    return e.writeInt32BE(this._a, 0), e.writeInt32BE(this._b, 4), e.writeInt32BE(this._c, 8), e.writeInt32BE(this._d, 12), e.writeInt32BE(this._e, 16), e.writeInt32BE(this._f, 20), e.writeInt32BE(this._g, 24), e
                }, e.exports = f
            }, function (e, t, r) {
                var i = r(0), n = r(47), o = r(14), s = r(1).Buffer, a = new Array(160);

                function f() {
                    this.init(), this._w = a, o.call(this, 128, 112)
                }

                i(f, n), f.prototype.init = function () {
                    return this._ah = 3418070365, this._bh = 1654270250, this._ch = 2438529370, this._dh = 355462360, this._eh = 1731405415, this._fh = 2394180231, this._gh = 3675008525, this._hh = 1203062813, this._al = 3238371032, this._bl = 914150663, this._cl = 812702999, this._dl = 4144912697, this._el = 4290775857, this._fl = 1750603025, this._gl = 1694076839, this._hl = 3204075428, this
                }, f.prototype._hash = function () {
                    var e = s.allocUnsafe(48);

                    function t(t, r, i) {
                        e.writeInt32BE(t, i), e.writeInt32BE(r, i + 4)
                    }

                    return t(this._ah, this._al, 0), t(this._bh, this._bl, 8), t(this._ch, this._cl, 16), t(this._dh, this._dl, 24), t(this._eh, this._el, 32), t(this._fh, this._fl, 40), e
                }, e.exports = f
            }, function (e, t, r) {
                "use strict";
                var i = r(0), n = r(1).Buffer, o = r(9), s = n.alloc(128), a = 64;

                function f(e, t) {
                    o.call(this, "digest"), "string" == typeof t && (t = n.from(t)), this._alg = e, this._key = t, t.length > a ? t = e(t) : t.length < a && (t = n.concat([t, s], a));
                    for (var r = this._ipad = n.allocUnsafe(a), i = this._opad = n.allocUnsafe(a), f = 0; f < a; f++) r[f] = 54 ^ t[f], i[f] = 92 ^ t[f];
                    this._hash = [r]
                }

                i(f, o), f.prototype._update = function (e) {
                    this._hash.push(e)
                }, f.prototype._final = function () {
                    var e = this._alg(n.concat(this._hash));
                    return this._alg(n.concat([this._opad, e]))
                }, e.exports = f
            }, function (e, t, r) {
                e.exports = r(49)
            }, function (e, t, r) {
                (function (t, i) {
                    var n, o = r(51), s = r(52), a = r(53), f = r(1).Buffer, c = t.crypto && t.crypto.subtle, u = {
                        sha: "SHA-1",
                        "sha-1": "SHA-1",
                        sha1: "SHA-1",
                        sha256: "SHA-256",
                        "sha-256": "SHA-256",
                        sha384: "SHA-384",
                        "sha-384": "SHA-384",
                        "sha-512": "SHA-512",
                        sha512: "SHA-512"
                    }, h = [];

                    function d(e, t, r, i, n) {
                        return c.importKey("raw", e, {name: "PBKDF2"}, !1, ["deriveBits"]).then(function (e) {
                            return c.deriveBits({name: "PBKDF2", salt: t, iterations: r, hash: {name: n}}, e, i << 3)
                        }).then(function (e) {
                            return f.from(e)
                        })
                    }

                    e.exports = function (e, r, l, p, b, y) {
                        if (f.isBuffer(e) || (e = f.from(e, s)), f.isBuffer(r) || (r = f.from(r, s)), o(l, p), "function" == typeof b && (y = b, b = void 0), "function" != typeof y) throw new Error("No callback provided to pbkdf2");
                        var v = u[(b = b || "sha1").toLowerCase()];
                        if (!v || "function" != typeof t.Promise) return i.nextTick(function () {
                            var t;
                            try {
                                t = a(e, r, l, p, b)
                            } catch (e) {
                                return y(e)
                            }
                            y(null, t)
                        });
                        !function (e, t) {
                            e.then(function (e) {
                                i.nextTick(function () {
                                    t(null, e)
                                })
                            }, function (e) {
                                i.nextTick(function () {
                                    t(e)
                                })
                            })
                        }(function (e) {
                            if (t.process && !t.process.browser) return Promise.resolve(!1);
                            if (!c || !c.importKey || !c.deriveBits) return Promise.resolve(!1);
                            if (void 0 !== h[e]) return h[e];
                            var r = d(n = n || f.alloc(8), n, 10, 128, e).then(function () {
                                return !0
                            }).catch(function () {
                                return !1
                            });
                            return h[e] = r, r
                        }(v).then(function (t) {
                            return t ? d(e, r, l, p, v) : a(e, r, l, p, b)
                        }), y)
                    }
                }).call(t, r(7), r(8))
            }, function (e, t, r) {
                var i = r(23), n = r(35), o = r(117), s = r(123), a = r(36);

                function f(e, t, r) {
                    if (e = e.toLowerCase(), a[e]) return n.createCipheriv(e, t, r);
                    if (s[e]) return new o({key: t, iv: r, mode: e});
                    throw new TypeError("invalid suite type")
                }

                function c(e, t, r) {
                    if (e = e.toLowerCase(), a[e]) return n.createDecipheriv(e, t, r);
                    if (s[e]) return new o({key: t, iv: r, mode: e, decrypt: !0});
                    throw new TypeError("invalid suite type")
                }

                t.createCipher = t.Cipher = function (e, t) {
                    var r, n;
                    if (e = e.toLowerCase(), a[e]) r = a[e].key, n = a[e].iv; else {
                        if (!s[e]) throw new TypeError("invalid suite type");
                        r = 8 * s[e].key, n = s[e].iv
                    }
                    var o = i(t, !1, r, n);
                    return f(e, o.key, o.iv)
                }, t.createCipheriv = t.Cipheriv = f, t.createDecipher = t.Decipher = function (e, t) {
                    var r, n;
                    if (e = e.toLowerCase(), a[e]) r = a[e].key, n = a[e].iv; else {
                        if (!s[e]) throw new TypeError("invalid suite type");
                        r = 8 * s[e].key, n = s[e].iv
                    }
                    var o = i(t, !1, r, n);
                    return c(e, o.key, o.iv)
                }, t.createDecipheriv = t.Decipheriv = c, t.listCiphers = t.getCiphers = function () {
                    return Object.keys(s).concat(n.getCiphers())
                }
            }, function (e, t, r) {
                "use strict";
                (function (t) {
                    var i = r(0), n = r(107), o = new Array(16);

                    function s() {
                        n.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878
                    }

                    function a(e, t) {
                        return e << t | e >>> 32 - t
                    }

                    function f(e, t, r, i, n, o, s) {
                        return a(e + (t & r | ~t & i) + n + o | 0, s) + t | 0
                    }

                    function c(e, t, r, i, n, o, s) {
                        return a(e + (t & i | r & ~i) + n + o | 0, s) + t | 0
                    }

                    function u(e, t, r, i, n, o, s) {
                        return a(e + (t ^ r ^ i) + n + o | 0, s) + t | 0
                    }

                    function h(e, t, r, i, n, o, s) {
                        return a(e + (r ^ (t | ~i)) + n + o | 0, s) + t | 0
                    }

                    i(s, n), s.prototype._update = function () {
                        for (var e = o, t = 0; t < 16; ++t) e[t] = this._block.readInt32LE(4 * t);
                        var r = this._a, i = this._b, n = this._c, s = this._d;
                        i = h(i = h(i = h(i = h(i = u(i = u(i = u(i = u(i = c(i = c(i = c(i = c(i = f(i = f(i = f(i = f(i, n = f(n, s = f(s, r = f(r, i, n, s, e[0], 3614090360, 7), i, n, e[1], 3905402710, 12), r, i, e[2], 606105819, 17), s, r, e[3], 3250441966, 22), n = f(n, s = f(s, r = f(r, i, n, s, e[4], 4118548399, 7), i, n, e[5], 1200080426, 12), r, i, e[6], 2821735955, 17), s, r, e[7], 4249261313, 22), n = f(n, s = f(s, r = f(r, i, n, s, e[8], 1770035416, 7), i, n, e[9], 2336552879, 12), r, i, e[10], 4294925233, 17), s, r, e[11], 2304563134, 22), n = f(n, s = f(s, r = f(r, i, n, s, e[12], 1804603682, 7), i, n, e[13], 4254626195, 12), r, i, e[14], 2792965006, 17), s, r, e[15], 1236535329, 22), n = c(n, s = c(s, r = c(r, i, n, s, e[1], 4129170786, 5), i, n, e[6], 3225465664, 9), r, i, e[11], 643717713, 14), s, r, e[0], 3921069994, 20), n = c(n, s = c(s, r = c(r, i, n, s, e[5], 3593408605, 5), i, n, e[10], 38016083, 9), r, i, e[15], 3634488961, 14), s, r, e[4], 3889429448, 20), n = c(n, s = c(s, r = c(r, i, n, s, e[9], 568446438, 5), i, n, e[14], 3275163606, 9), r, i, e[3], 4107603335, 14), s, r, e[8], 1163531501, 20), n = c(n, s = c(s, r = c(r, i, n, s, e[13], 2850285829, 5), i, n, e[2], 4243563512, 9), r, i, e[7], 1735328473, 14), s, r, e[12], 2368359562, 20), n = u(n, s = u(s, r = u(r, i, n, s, e[5], 4294588738, 4), i, n, e[8], 2272392833, 11), r, i, e[11], 1839030562, 16), s, r, e[14], 4259657740, 23), n = u(n, s = u(s, r = u(r, i, n, s, e[1], 2763975236, 4), i, n, e[4], 1272893353, 11), r, i, e[7], 4139469664, 16), s, r, e[10], 3200236656, 23), n = u(n, s = u(s, r = u(r, i, n, s, e[13], 681279174, 4), i, n, e[0], 3936430074, 11), r, i, e[3], 3572445317, 16), s, r, e[6], 76029189, 23), n = u(n, s = u(s, r = u(r, i, n, s, e[9], 3654602809, 4), i, n, e[12], 3873151461, 11), r, i, e[15], 530742520, 16), s, r, e[2], 3299628645, 23), n = h(n, s = h(s, r = h(r, i, n, s, e[0], 4096336452, 6), i, n, e[7], 1126891415, 10), r, i, e[14], 2878612391, 15), s, r, e[5], 4237533241, 21), n = h(n, s = h(s, r = h(r, i, n, s, e[12], 1700485571, 6), i, n, e[3], 2399980690, 10), r, i, e[10], 4293915773, 15), s, r, e[1], 2240044497, 21), n = h(n, s = h(s, r = h(r, i, n, s, e[8], 1873313359, 6), i, n, e[15], 4264355552, 10), r, i, e[6], 2734768916, 15), s, r, e[13], 1309151649, 21), n = h(n, s = h(s, r = h(r, i, n, s, e[4], 4149444226, 6), i, n, e[11], 3174756917, 10), r, i, e[2], 718787259, 15), s, r, e[9], 3951481745, 21), this._a = this._a + r | 0, this._b = this._b + i | 0, this._c = this._c + n | 0, this._d = this._d + s | 0
                    }, s.prototype._digest = function () {
                        this._block[this._blockOffset++] = 128, this._blockOffset > 56 && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update();
                        var e = new t(16);
                        return e.writeInt32LE(this._a, 0), e.writeInt32LE(this._b, 4), e.writeInt32LE(this._c, 8), e.writeInt32LE(this._d, 12), e
                    }, e.exports = s
                }).call(t, r(3).Buffer)
            }, function (e, t, r) {
                "use strict";
                var i = r(1).Buffer, n = r(21).Transform;

                function o(e) {
                    n.call(this), this._block = i.allocUnsafe(e), this._blockSize = e, this._blockOffset = 0, this._length = [0, 0, 0, 0], this._finalized = !1
                }

                r(0)(o, n), o.prototype._transform = function (e, t, r) {
                    var i = null;
                    try {
                        this.update(e, t)
                    } catch (e) {
                        i = e
                    }
                    r(i)
                }, o.prototype._flush = function (e) {
                    var t = null;
                    try {
                        this.push(this.digest())
                    } catch (e) {
                        t = e
                    }
                    e(t)
                }, o.prototype.update = function (e, t) {
                    if (function (e, t) {
                            if (!i.isBuffer(e) && "string" != typeof e) throw new TypeError("Data must be a string or a buffer")
                        }(e), this._finalized) throw new Error("Digest already called");
                    i.isBuffer(e) || (e = i.from(e, t));
                    for (var r = this._block, n = 0; this._blockOffset + e.length - n >= this._blockSize;) {
                        for (var o = this._blockOffset; o < this._blockSize;) r[o++] = e[n++];
                        this._update(), this._blockOffset = 0
                    }
                    for (; n < e.length;) r[this._blockOffset++] = e[n++];
                    for (var s = 0, a = 8 * e.length; a > 0; ++s) this._length[s] += a, (a = this._length[s] / 4294967296 | 0) > 0 && (this._length[s] -= 4294967296 * a);
                    return this
                }, o.prototype._update = function () {
                    throw new Error("_update is not implemented")
                }, o.prototype.digest = function (e) {
                    if (this._finalized) throw new Error("Digest already called");
                    this._finalized = !0;
                    var t = this._digest();
                    void 0 !== e && (t = t.toString(e)), this._block.fill(0), this._blockOffset = 0;
                    for (var r = 0; r < 4; ++r) this._length[r] = 0;
                    return t
                }, o.prototype._digest = function () {
                    throw new Error("_digest is not implemented")
                }, e.exports = o
            }, function (e, t, r) {
                var i = r(36), n = r(57), o = r(1).Buffer, s = r(58), a = r(9), f = r(24), c = r(23);

                function u(e, t, r) {
                    a.call(this), this._cache = new d, this._cipher = new f.AES(t), this._prev = o.from(r), this._mode = e, this._autopadding = !0
                }

                r(0)(u, a), u.prototype._update = function (e) {
                    var t, r;
                    this._cache.add(e);
                    for (var i = []; t = this._cache.get();) r = this._mode.encrypt(this, t), i.push(r);
                    return o.concat(i)
                };
                var h = o.alloc(16, 16);

                function d() {
                    this.cache = o.allocUnsafe(0)
                }

                function l(e, t, r) {
                    var a = i[e.toLowerCase()];
                    if (!a) throw new TypeError("invalid suite type");
                    if ("string" == typeof t && (t = o.from(t)), t.length !== a.key / 8) throw new TypeError("invalid key length " + t.length);
                    if ("string" == typeof r && (r = o.from(r)), "GCM" !== a.mode && r.length !== a.iv) throw new TypeError("invalid iv length " + r.length);
                    return "stream" === a.type ? new s(a.module, t, r) : "auth" === a.type ? new n(a.module, t, r) : new u(a.module, t, r)
                }

                u.prototype._final = function () {
                    var e = this._cache.flush();
                    if (this._autopadding) return e = this._mode.encrypt(this, e), this._cipher.scrub(), e;
                    if (!e.equals(h)) throw this._cipher.scrub(), new Error("data not multiple of block length")
                }, u.prototype.setAutoPadding = function (e) {
                    return this._autopadding = !!e, this
                }, d.prototype.add = function (e) {
                    this.cache = o.concat([this.cache, e])
                }, d.prototype.get = function () {
                    if (this.cache.length > 15) {
                        var e = this.cache.slice(0, 16);
                        return this.cache = this.cache.slice(16), e
                    }
                    return null
                }, d.prototype.flush = function () {
                    for (var e = 16 - this.cache.length, t = o.allocUnsafe(e), r = -1; ++r < e;) t.writeUInt8(e, r);
                    return o.concat([this.cache, t])
                }, t.createCipheriv = l, t.createCipher = function (e, t) {
                    var r = i[e.toLowerCase()];
                    if (!r) throw new TypeError("invalid suite type");
                    var n = c(t, !1, r.key, r.iv);
                    return l(e, n.key, n.iv)
                }
            }, function (e, t) {
                t.encrypt = function (e, t) {
                    return e._cipher.encryptBlock(t)
                }, t.decrypt = function (e, t) {
                    return e._cipher.decryptBlock(t)
                }
            }, function (e, t, r) {
                var i = r(17);
                t.encrypt = function (e, t) {
                    var r = i(t, e._prev);
                    return e._prev = e._cipher.encryptBlock(r), e._prev
                }, t.decrypt = function (e, t) {
                    var r = e._prev;
                    e._prev = t;
                    var n = e._cipher.decryptBlock(t);
                    return i(n, r)
                }
            }, function (e, t, r) {
                var i = r(1).Buffer, n = r(17);

                function o(e, t, r) {
                    var o = t.length, s = n(t, e._cache);
                    return e._cache = e._cache.slice(o), e._prev = i.concat([e._prev, r ? t : s]), s
                }

                t.encrypt = function (e, t, r) {
                    for (var n, s = i.allocUnsafe(0); t.length;) {
                        if (0 === e._cache.length && (e._cache = e._cipher.encryptBlock(e._prev), e._prev = i.allocUnsafe(0)), !(e._cache.length <= t.length)) {
                            s = i.concat([s, o(e, t, r)]);
                            break
                        }
                        n = e._cache.length, s = i.concat([s, o(e, t.slice(0, n), r)]), t = t.slice(n)
                    }
                    return s
                }
            }, function (e, t, r) {
                var i = r(1).Buffer;

                function n(e, t, r) {
                    var n = e._cipher.encryptBlock(e._prev)[0] ^ t;
                    return e._prev = i.concat([e._prev.slice(1), i.from([r ? t : n])]), n
                }

                t.encrypt = function (e, t, r) {
                    for (var o = t.length, s = i.allocUnsafe(o), a = -1; ++a < o;) s[a] = n(e, t[a], r);
                    return s
                }
            }, function (e, t, r) {
                var i = r(1).Buffer;

                function n(e, t, r) {
                    for (var i, n, s = -1, a = 0; ++s < 8;) i = t & 1 << 7 - s ? 128 : 0, a += (128 & (n = e._cipher.encryptBlock(e._prev)[0] ^ i)) >> s % 8, e._prev = o(e._prev, r ? i : n);
                    return a
                }

                function o(e, t) {
                    var r = e.length, n = -1, o = i.allocUnsafe(e.length);
                    for (e = i.concat([e, i.from([t])]); ++n < r;) o[n] = e[n] << 1 | e[n + 1] >> 7;
                    return o
                }

                t.encrypt = function (e, t, r) {
                    for (var o = t.length, s = i.allocUnsafe(o), a = -1; ++a < o;) s[a] = n(e, t[a], r);
                    return s
                }
            }, function (e, t, r) {
                (function (e) {
                    var i = r(17);

                    function n(e) {
                        return e._prev = e._cipher.encryptBlock(e._prev), e._prev
                    }

                    t.encrypt = function (t, r) {
                        for (; t._cache.length < r.length;) t._cache = e.concat([t._cache, n(t)]);
                        var o = t._cache.slice(0, r.length);
                        return t._cache = t._cache.slice(r.length), i(r, o)
                    }
                }).call(t, r(3).Buffer)
            }, function (e, t, r) {
                var i = r(1).Buffer, n = i.alloc(16, 0);

                function o(e) {
                    var t = i.allocUnsafe(16);
                    return t.writeUInt32BE(e[0] >>> 0, 0), t.writeUInt32BE(e[1] >>> 0, 4), t.writeUInt32BE(e[2] >>> 0, 8), t.writeUInt32BE(e[3] >>> 0, 12), t
                }

                function s(e) {
                    this.h = e, this.state = i.alloc(16, 0), this.cache = i.allocUnsafe(0)
                }

                s.prototype.ghash = function (e) {
                    for (var t = -1; ++t < e.length;) this.state[t] ^= e[t];
                    this._multiply()
                }, s.prototype._multiply = function () {
                    for (var e, t, r, i = [(e = this.h).readUInt32BE(0), e.readUInt32BE(4), e.readUInt32BE(8), e.readUInt32BE(12)], n = [0, 0, 0, 0], s = -1; ++s < 128;) {
                        for (0 != (this.state[~~(s / 8)] & 1 << 7 - s % 8) && (n[0] ^= i[0], n[1] ^= i[1], n[2] ^= i[2], n[3] ^= i[3]), r = 0 != (1 & i[3]), t = 3; t > 0; t--) i[t] = i[t] >>> 1 | (1 & i[t - 1]) << 31;
                        i[0] = i[0] >>> 1, r && (i[0] = i[0] ^ 225 << 24)
                    }
                    this.state = o(n)
                }, s.prototype.update = function (e) {
                    var t;
                    for (this.cache = i.concat([this.cache, e]); this.cache.length >= 16;) t = this.cache.slice(0, 16), this.cache = this.cache.slice(16), this.ghash(t)
                }, s.prototype.final = function (e, t) {
                    return this.cache.length && this.ghash(i.concat([this.cache, n], 16)), this.ghash(o([0, e, 0, t])), this.state
                }, e.exports = s
            }, function (e, t, r) {
                var i = r(57), n = r(1).Buffer, o = r(36), s = r(58), a = r(9), f = r(24), c = r(23);

                function u(e, t, r) {
                    a.call(this), this._cache = new h, this._last = void 0, this._cipher = new f.AES(t), this._prev = n.from(r), this._mode = e, this._autopadding = !0
                }

                function h() {
                    this.cache = n.allocUnsafe(0)
                }

                function d(e, t, r) {
                    var a = o[e.toLowerCase()];
                    if (!a) throw new TypeError("invalid suite type");
                    if ("string" == typeof r && (r = n.from(r)), "GCM" !== a.mode && r.length !== a.iv) throw new TypeError("invalid iv length " + r.length);
                    if ("string" == typeof t && (t = n.from(t)), t.length !== a.key / 8) throw new TypeError("invalid key length " + t.length);
                    return "stream" === a.type ? new s(a.module, t, r, !0) : "auth" === a.type ? new i(a.module, t, r, !0) : new u(a.module, t, r)
                }

                r(0)(u, a), u.prototype._update = function (e) {
                    var t, r;
                    this._cache.add(e);
                    for (var i = []; t = this._cache.get(this._autopadding);) r = this._mode.decrypt(this, t), i.push(r);
                    return n.concat(i)
                }, u.prototype._final = function () {
                    var e = this._cache.flush();
                    if (this._autopadding) return function (e) {
                        for (var t = e[15], r = -1; ++r < t;) if (e[r + (16 - t)] !== t) throw new Error("unable to decrypt data");
                        if (16 !== t) return e.slice(0, 16 - t)
                    }(this._mode.decrypt(this, e));
                    if (e) throw new Error("data not multiple of block length")
                }, u.prototype.setAutoPadding = function (e) {
                    return this._autopadding = !!e, this
                }, h.prototype.add = function (e) {
                    this.cache = n.concat([this.cache, e])
                }, h.prototype.get = function (e) {
                    var t;
                    if (e) {
                        if (this.cache.length > 16) return t = this.cache.slice(0, 16), this.cache = this.cache.slice(16), t
                    } else if (this.cache.length >= 16) return t = this.cache.slice(0, 16), this.cache = this.cache.slice(16), t;
                    return null
                }, h.prototype.flush = function () {
                    if (this.cache.length) return this.cache
                }, t.createDecipher = function (e, t) {
                    var r = o[e.toLowerCase()];
                    if (!r) throw new TypeError("invalid suite type");
                    var i = c(t, !1, r.key, r.iv);
                    return d(e, i.key, i.iv)
                }, t.createDecipheriv = d
            }, function (e, t, r) {
                (function (t) {
                    var i = r(9), n = r(37), o = r(0), s = {
                        "des-ede3-cbc": n.CBC.instantiate(n.EDE),
                        "des-ede3": n.EDE,
                        "des-ede-cbc": n.CBC.instantiate(n.EDE),
                        "des-ede": n.EDE,
                        "des-cbc": n.CBC.instantiate(n.DES),
                        "des-ecb": n.DES
                    };

                    function a(e) {
                        i.call(this);
                        var r, n = e.mode.toLowerCase(), o = s[n];
                        r = e.decrypt ? "decrypt" : "encrypt";
                        var a = e.key;
                        "des-ede" !== n && "des-ede-cbc" !== n || (a = t.concat([a, a.slice(0, 8)]));
                        var f = e.iv;
                        this._des = o.create({key: a, iv: f, type: r})
                    }

                    s.des = s["des-cbc"], s.des3 = s["des-ede3-cbc"], e.exports = a, o(a, i), a.prototype._update = function (e) {
                        return new t(this._des.update(e))
                    }, a.prototype._final = function () {
                        return new t(this._des.final())
                    }
                }).call(t, r(3).Buffer)
            }, function (e, t, r) {
                "use strict";
                t.readUInt32BE = function (e, t) {
                    return (e[0 + t] << 24 | e[1 + t] << 16 | e[2 + t] << 8 | e[3 + t]) >>> 0
                }, t.writeUInt32BE = function (e, t, r) {
                    e[0 + r] = t >>> 24, e[1 + r] = t >>> 16 & 255, e[2 + r] = t >>> 8 & 255, e[3 + r] = 255 & t
                }, t.ip = function (e, t, r, i) {
                    for (var n = 0, o = 0, s = 6; s >= 0; s -= 2) {
                        for (var a = 0; a <= 24; a += 8) n <<= 1, n |= t >>> a + s & 1;
                        for (a = 0; a <= 24; a += 8) n <<= 1, n |= e >>> a + s & 1
                    }
                    for (s = 6; s >= 0; s -= 2) {
                        for (a = 1; a <= 25; a += 8) o <<= 1, o |= t >>> a + s & 1;
                        for (a = 1; a <= 25; a += 8) o <<= 1, o |= e >>> a + s & 1
                    }
                    r[i + 0] = n >>> 0, r[i + 1] = o >>> 0
                }, t.rip = function (e, t, r, i) {
                    for (var n = 0, o = 0, s = 0; s < 4; s++) for (var a = 24; a >= 0; a -= 8) n <<= 1, n |= t >>> a + s & 1, n <<= 1, n |= e >>> a + s & 1;
                    for (s = 4; s < 8; s++) for (a = 24; a >= 0; a -= 8) o <<= 1, o |= t >>> a + s & 1, o <<= 1, o |= e >>> a + s & 1;
                    r[i + 0] = n >>> 0, r[i + 1] = o >>> 0
                }, t.pc1 = function (e, t, r, i) {
                    for (var n = 0, o = 0, s = 7; s >= 5; s--) {
                        for (var a = 0; a <= 24; a += 8) n <<= 1, n |= t >> a + s & 1;
                        for (a = 0; a <= 24; a += 8) n <<= 1, n |= e >> a + s & 1
                    }
                    for (a = 0; a <= 24; a += 8) n <<= 1, n |= t >> a + s & 1;
                    for (s = 1; s <= 3; s++) {
                        for (a = 0; a <= 24; a += 8) o <<= 1, o |= t >> a + s & 1;
                        for (a = 0; a <= 24; a += 8) o <<= 1, o |= e >> a + s & 1
                    }
                    for (a = 0; a <= 24; a += 8) o <<= 1, o |= e >> a + s & 1;
                    r[i + 0] = n >>> 0, r[i + 1] = o >>> 0
                }, t.r28shl = function (e, t) {
                    return e << t & 268435455 | e >>> 28 - t
                };
                var i = [14, 11, 17, 4, 27, 23, 25, 0, 13, 22, 7, 18, 5, 9, 16, 24, 2, 20, 12, 21, 1, 8, 15, 26, 15, 4, 25, 19, 9, 1, 26, 16, 5, 11, 23, 8, 12, 7, 17, 0, 22, 3, 10, 14, 6, 20, 27, 24];
                t.pc2 = function (e, t, r, n) {
                    for (var o = 0, s = 0, a = i.length >>> 1, f = 0; f < a; f++) o <<= 1, o |= e >>> i[f] & 1;
                    for (f = a; f < i.length; f++) s <<= 1, s |= t >>> i[f] & 1;
                    r[n + 0] = o >>> 0, r[n + 1] = s >>> 0
                }, t.expand = function (e, t, r) {
                    var i = 0, n = 0;
                    i = (1 & e) << 5 | e >>> 27;
                    for (var o = 23; o >= 15; o -= 4) i <<= 6, i |= e >>> o & 63;
                    for (o = 11; o >= 3; o -= 4) n |= e >>> o & 63, n <<= 6;
                    n |= (31 & e) << 1 | e >>> 31, t[r + 0] = i >>> 0, t[r + 1] = n >>> 0
                };
                var n = [14, 0, 4, 15, 13, 7, 1, 4, 2, 14, 15, 2, 11, 13, 8, 1, 3, 10, 10, 6, 6, 12, 12, 11, 5, 9, 9, 5, 0, 3, 7, 8, 4, 15, 1, 12, 14, 8, 8, 2, 13, 4, 6, 9, 2, 1, 11, 7, 15, 5, 12, 11, 9, 3, 7, 14, 3, 10, 10, 0, 5, 6, 0, 13, 15, 3, 1, 13, 8, 4, 14, 7, 6, 15, 11, 2, 3, 8, 4, 14, 9, 12, 7, 0, 2, 1, 13, 10, 12, 6, 0, 9, 5, 11, 10, 5, 0, 13, 14, 8, 7, 10, 11, 1, 10, 3, 4, 15, 13, 4, 1, 2, 5, 11, 8, 6, 12, 7, 6, 12, 9, 0, 3, 5, 2, 14, 15, 9, 10, 13, 0, 7, 9, 0, 14, 9, 6, 3, 3, 4, 15, 6, 5, 10, 1, 2, 13, 8, 12, 5, 7, 14, 11, 12, 4, 11, 2, 15, 8, 1, 13, 1, 6, 10, 4, 13, 9, 0, 8, 6, 15, 9, 3, 8, 0, 7, 11, 4, 1, 15, 2, 14, 12, 3, 5, 11, 10, 5, 14, 2, 7, 12, 7, 13, 13, 8, 14, 11, 3, 5, 0, 6, 6, 15, 9, 0, 10, 3, 1, 4, 2, 7, 8, 2, 5, 12, 11, 1, 12, 10, 4, 14, 15, 9, 10, 3, 6, 15, 9, 0, 0, 6, 12, 10, 11, 1, 7, 13, 13, 8, 15, 9, 1, 4, 3, 5, 14, 11, 5, 12, 2, 7, 8, 2, 4, 14, 2, 14, 12, 11, 4, 2, 1, 12, 7, 4, 10, 7, 11, 13, 6, 1, 8, 5, 5, 0, 3, 15, 15, 10, 13, 3, 0, 9, 14, 8, 9, 6, 4, 11, 2, 8, 1, 12, 11, 7, 10, 1, 13, 14, 7, 2, 8, 13, 15, 6, 9, 15, 12, 0, 5, 9, 6, 10, 3, 4, 0, 5, 14, 3, 12, 10, 1, 15, 10, 4, 15, 2, 9, 7, 2, 12, 6, 9, 8, 5, 0, 6, 13, 1, 3, 13, 4, 14, 14, 0, 7, 11, 5, 3, 11, 8, 9, 4, 14, 3, 15, 2, 5, 12, 2, 9, 8, 5, 12, 15, 3, 10, 7, 11, 0, 14, 4, 1, 10, 7, 1, 6, 13, 0, 11, 8, 6, 13, 4, 13, 11, 0, 2, 11, 14, 7, 15, 4, 0, 9, 8, 1, 13, 10, 3, 14, 12, 3, 9, 5, 7, 12, 5, 2, 10, 15, 6, 8, 1, 6, 1, 6, 4, 11, 11, 13, 13, 8, 12, 1, 3, 4, 7, 10, 14, 7, 10, 9, 15, 5, 6, 0, 8, 15, 0, 14, 5, 2, 9, 3, 2, 12, 13, 1, 2, 15, 8, 13, 4, 8, 6, 10, 15, 3, 11, 7, 1, 4, 10, 12, 9, 5, 3, 6, 14, 11, 5, 0, 0, 14, 12, 9, 7, 2, 7, 2, 11, 1, 4, 14, 1, 7, 9, 4, 12, 10, 14, 8, 2, 13, 0, 15, 6, 12, 10, 9, 13, 0, 15, 3, 3, 5, 5, 6, 8, 11];
                t.substitute = function (e, t) {
                    for (var r = 0, i = 0; i < 4; i++) r <<= 4, r |= n[64 * i + (e >>> 18 - 6 * i & 63)];
                    for (i = 0; i < 4; i++) r <<= 4, r |= n[256 + 64 * i + (t >>> 18 - 6 * i & 63)];
                    return r >>> 0
                };
                var o = [16, 25, 12, 11, 3, 20, 4, 15, 31, 17, 9, 6, 27, 14, 1, 22, 30, 24, 8, 18, 0, 5, 29, 23, 13, 19, 2, 26, 10, 21, 28, 7];
                t.permute = function (e) {
                    for (var t = 0, r = 0; r < o.length; r++) t <<= 1, t |= e >>> o[r] & 1;
                    return t >>> 0
                }, t.padSplit = function (e, t, r) {
                    for (var i = e.toString(2); i.length < t;) i = "0" + i;
                    for (var n = [], o = 0; o < t; o += r) n.push(i.slice(o, o + r));
                    return n.join(" ")
                }
            }, function (e, t, r) {
                "use strict";
                var i = r(5);

                function n(e) {
                    this.options = e, this.type = this.options.type, this.blockSize = 8, this._init(), this.buffer = new Array(this.blockSize), this.bufferOff = 0
                }

                e.exports = n, n.prototype._init = function () {
                }, n.prototype.update = function (e) {
                    return 0 === e.length ? [] : "decrypt" === this.type ? this._updateDecrypt(e) : this._updateEncrypt(e)
                }, n.prototype._buffer = function (e, t) {
                    for (var r = Math.min(this.buffer.length - this.bufferOff, e.length - t), i = 0; i < r; i++) this.buffer[this.bufferOff + i] = e[t + i];
                    return this.bufferOff += r, r
                }, n.prototype._flushBuffer = function (e, t) {
                    return this._update(this.buffer, 0, e, t), this.bufferOff = 0, this.blockSize
                }, n.prototype._updateEncrypt = function (e) {
                    var t = 0, r = 0, i = (this.bufferOff + e.length) / this.blockSize | 0,
                        n = new Array(i * this.blockSize);
                    0 !== this.bufferOff && (t += this._buffer(e, t), this.bufferOff === this.buffer.length && (r += this._flushBuffer(n, r)));
                    for (var o = e.length - (e.length - t) % this.blockSize; t < o; t += this.blockSize) this._update(e, t, n, r), r += this.blockSize;
                    for (; t < e.length; t++, this.bufferOff++) this.buffer[this.bufferOff] = e[t];
                    return n
                }, n.prototype._updateDecrypt = function (e) {
                    for (var t = 0, r = 0, i = Math.ceil((this.bufferOff + e.length) / this.blockSize) - 1, n = new Array(i * this.blockSize); i > 0; i--) t += this._buffer(e, t), r += this._flushBuffer(n, r);
                    return t += this._buffer(e, t), n
                }, n.prototype.final = function (e) {
                    var t, r;
                    return e && (t = this.update(e)), r = "encrypt" === this.type ? this._finalEncrypt() : this._finalDecrypt(), t ? t.concat(r) : r
                }, n.prototype._pad = function (e, t) {
                    if (0 === t) return !1;
                    for (; t < e.length;) e[t++] = 0;
                    return !0
                }, n.prototype._finalEncrypt = function () {
                    if (!this._pad(this.buffer, this.bufferOff)) return [];
                    var e = new Array(this.blockSize);
                    return this._update(this.buffer, 0, e, 0), e
                }, n.prototype._unpad = function (e) {
                    return e
                }, n.prototype._finalDecrypt = function () {
                    i.equal(this.bufferOff, this.blockSize, "Not enough data to decrypt");
                    var e = new Array(this.blockSize);
                    return this._flushBuffer(e, 0), this._unpad(e)
                }
            }, function (e, t, r) {
                "use strict";
                var i = r(5), n = r(0), o = r(37), s = o.utils, a = o.Cipher;

                function f(e) {
                    a.call(this, e);
                    var t = new function () {
                        this.tmp = new Array(2), this.keys = null
                    };
                    this._desState = t, this.deriveKeys(t, e.key)
                }

                n(f, a), e.exports = f, f.create = function (e) {
                    return new f(e)
                };
                var c = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];
                f.prototype.deriveKeys = function (e, t) {
                    e.keys = new Array(32), i.equal(t.length, this.blockSize, "Invalid key length");
                    var r = s.readUInt32BE(t, 0), n = s.readUInt32BE(t, 4);
                    s.pc1(r, n, e.tmp, 0), r = e.tmp[0], n = e.tmp[1];
                    for (var o = 0; o < e.keys.length; o += 2) {
                        var a = c[o >>> 1];
                        r = s.r28shl(r, a), n = s.r28shl(n, a), s.pc2(r, n, e.keys, o)
                    }
                }, f.prototype._update = function (e, t, r, i) {
                    var n = this._desState, o = s.readUInt32BE(e, t), a = s.readUInt32BE(e, t + 4);
                    s.ip(o, a, n.tmp, 0), o = n.tmp[0], a = n.tmp[1], "encrypt" === this.type ? this._encrypt(n, o, a, n.tmp, 0) : this._decrypt(n, o, a, n.tmp, 0), o = n.tmp[0], a = n.tmp[1], s.writeUInt32BE(r, o, i), s.writeUInt32BE(r, a, i + 4)
                }, f.prototype._pad = function (e, t) {
                    for (var r = e.length - t, i = t; i < e.length; i++) e[i] = r;
                    return !0
                }, f.prototype._unpad = function (e) {
                    for (var t = e[e.length - 1], r = e.length - t; r < e.length; r++) i.equal(e[r], t);
                    return e.slice(0, e.length - t)
                }, f.prototype._encrypt = function (e, t, r, i, n) {
                    for (var o = t, a = r, f = 0; f < e.keys.length; f += 2) {
                        var c = e.keys[f], u = e.keys[f + 1];
                        s.expand(a, e.tmp, 0), c ^= e.tmp[0], u ^= e.tmp[1];
                        var h = s.substitute(c, u), d = a;
                        a = (o ^ s.permute(h)) >>> 0, o = d
                    }
                    s.rip(a, o, i, n)
                }, f.prototype._decrypt = function (e, t, r, i, n) {
                    for (var o = r, a = t, f = e.keys.length - 2; f >= 0; f -= 2) {
                        var c = e.keys[f], u = e.keys[f + 1];
                        s.expand(o, e.tmp, 0), c ^= e.tmp[0], u ^= e.tmp[1];
                        var h = s.substitute(c, u), d = o;
                        o = (a ^ s.permute(h)) >>> 0, a = d
                    }
                    s.rip(o, a, i, n)
                }
            }, function (e, t, r) {
                "use strict";
                var i = r(5), n = r(0), o = {};
                t.instantiate = function (e) {
                    function t(t) {
                        e.call(this, t), this._cbcInit()
                    }

                    n(t, e);
                    for (var r = Object.keys(o), i = 0; i < r.length; i++) {
                        var s = r[i];
                        t.prototype[s] = o[s]
                    }
                    return t.create = function (e) {
                        return new t(e)
                    }, t
                }, o._cbcInit = function () {
                    var e = new function (e) {
                        i.equal(e.length, 8, "Invalid IV length"), this.iv = new Array(8);
                        for (var t = 0; t < this.iv.length; t++) this.iv[t] = e[t]
                    }(this.options.iv);
                    this._cbcState = e
                }, o._update = function (e, t, r, i) {
                    var n = this._cbcState, o = this.constructor.super_.prototype, s = n.iv;
                    if ("encrypt" === this.type) {
                        for (var a = 0; a < this.blockSize; a++) s[a] ^= e[t + a];
                        for (o._update.call(this, s, 0, r, i), a = 0; a < this.blockSize; a++) s[a] = r[i + a]
                    } else {
                        for (o._update.call(this, e, t, r, i), a = 0; a < this.blockSize; a++) r[i + a] ^= s[a];
                        for (a = 0; a < this.blockSize; a++) s[a] = e[t + a]
                    }
                }
            }, function (e, t, r) {
                "use strict";
                var i = r(5), n = r(0), o = r(37), s = o.Cipher, a = o.DES;

                function f(e) {
                    s.call(this, e);
                    var t = new function (e, t) {
                        i.equal(t.length, 24, "Invalid key length");
                        var r = t.slice(0, 8), n = t.slice(8, 16), o = t.slice(16, 24);
                        this.ciphers = "encrypt" === e ? [a.create({
                            type: "encrypt",
                            key: r
                        }), a.create({type: "decrypt", key: n}), a.create({
                            type: "encrypt",
                            key: o
                        })] : [a.create({type: "decrypt", key: o}), a.create({
                            type: "encrypt",
                            key: n
                        }), a.create({type: "decrypt", key: r})]
                    }(this.type, this.options.key);
                    this._edeState = t
                }

                n(f, s), e.exports = f, f.create = function (e) {
                    return new f(e)
                }, f.prototype._update = function (e, t, r, i) {
                    var n = this._edeState;
                    n.ciphers[0]._update(e, t, r, i), n.ciphers[1]._update(r, i, r, i), n.ciphers[2]._update(r, i, r, i)
                }, f.prototype._pad = a.prototype._pad, f.prototype._unpad = a.prototype._unpad
            }, function (e, t) {
                t["des-ecb"] = {key: 8, iv: 0}, t["des-cbc"] = t.des = {
                    key: 8,
                    iv: 8
                }, t["des-ede3-cbc"] = t.des3 = {key: 24, iv: 8}, t["des-ede3"] = {
                    key: 24,
                    iv: 0
                }, t["des-ede-cbc"] = {key: 16, iv: 8}, t["des-ede"] = {key: 16, iv: 0}
            }, function (e, t, r) {
                (function (e) {
                    var i = r(59), n = r(126), o = r(127), s = {binary: !0, hex: !0, base64: !0};
                    t.DiffieHellmanGroup = t.createDiffieHellmanGroup = t.getDiffieHellman = function (t) {
                        var r = new e(n[t].prime, "hex"), i = new e(n[t].gen, "hex");
                        return new o(r, i)
                    }, t.createDiffieHellman = t.DiffieHellman = function t(r, n, a, f) {
                        return e.isBuffer(n) || void 0 === s[n] ? t(r, "binary", n, a) : (n = n || "binary", f = f || "binary", a = a || new e([2]), e.isBuffer(a) || (a = new e(a, f)), "number" == typeof r ? new o(i(r, a), a, !0) : (e.isBuffer(r) || (r = new e(r, n)), new o(r, a, !0)))
                    }
                }).call(t, r(3).Buffer)
            }, function (e, t) {
            }, function (e, t) {
                e.exports = {
                    modp1: {
                        gen: "02",
                        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a63a3620ffffffffffffffff"
                    },
                    modp2: {
                        gen: "02",
                        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece65381ffffffffffffffff"
                    },
                    modp5: {
                        gen: "02",
                        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca237327ffffffffffffffff"
                    },
                    modp14: {
                        gen: "02",
                        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aacaa68ffffffffffffffff"
                    },
                    modp15: {
                        gen: "02",
                        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a93ad2caffffffffffffffff"
                    },
                    modp16: {
                        gen: "02",
                        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c934063199ffffffffffffffff"
                    },
                    modp17: {
                        gen: "02",
                        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dcc4024ffffffffffffffff"
                    },
                    modp18: {
                        gen: "02",
                        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dbe115974a3926f12fee5e438777cb6a932df8cd8bec4d073b931ba3bc832b68d9dd300741fa7bf8afc47ed2576f6936ba424663aab639c5ae4f5683423b4742bf1c978238f16cbe39d652de3fdb8befc848ad922222e04a4037c0713eb57a81a23f0c73473fc646cea306b4bcbc8862f8385ddfa9d4b7fa2c087e879683303ed5bdd3a062b3cf5b3a278a66d2a13f83f44f82ddf310ee074ab6a364597e899a0255dc164f31cc50846851df9ab48195ded7ea1b1d510bd7ee74d73faf36bc31ecfa268359046f4eb879f924009438b481c6cd7889a002ed5ee382bc9190da6fc026e479558e4475677e9aa9e3050e2765694dfc81f56e880b96e7160c980dd98edd3dfffffffffffffffff"
                    }
                }
            }, function (e, t, r) {
                (function (t) {
                    var i = r(2), n = new (r(60)), o = new i(24), s = new i(11), a = new i(10), f = new i(3),
                        c = new i(7), u = r(59), h = r(13);

                    function d(e, r) {
                        return r = r || "utf8", t.isBuffer(e) || (e = new t(e, r)), this._pub = new i(e), this
                    }

                    function l(e, r) {
                        return r = r || "utf8", t.isBuffer(e) || (e = new t(e, r)), this._priv = new i(e), this
                    }

                    e.exports = b;
                    var p = {};

                    function b(e, t, r) {
                        this.setGenerator(t), this.__prime = new i(e), this._prime = i.mont(this.__prime), this._primeLen = e.length, this._pub = void 0, this._priv = void 0, this._primeCode = void 0, r ? (this.setPublicKey = d, this.setPrivateKey = l) : this._primeCode = 8
                    }

                    function y(e, r) {
                        var i = new t(e.toArray());
                        return r ? i.toString(r) : i
                    }

                    Object.defineProperty(b.prototype, "verifyError", {
                        enumerable: !0, get: function () {
                            return "number" != typeof this._primeCode && (this._primeCode = function (e, t) {
                                var r = t.toString("hex"), i = [r, e.toString(16)].join("_");
                                if (i in p) return p[i];
                                var h, d = 0;
                                if (e.isEven() || !u.simpleSieve || !u.fermatTest(e) || !n.test(e)) return d += 1, d += "02" === r || "05" === r ? 8 : 4, p[i] = d, d;
                                switch (n.test(e.shrn(1)) || (d += 2), r) {
                                    case"02":
                                        e.mod(o).cmp(s) && (d += 8);
                                        break;
                                    case"05":
                                        (h = e.mod(a)).cmp(f) && h.cmp(c) && (d += 8);
                                        break;
                                    default:
                                        d += 4
                                }
                                return p[i] = d, d
                            }(this.__prime, this.__gen)), this._primeCode
                        }
                    }), b.prototype.generateKeys = function () {
                        return this._priv || (this._priv = new i(h(this._primeLen))), this._pub = this._gen.toRed(this._prime).redPow(this._priv).fromRed(), this.getPublicKey()
                    }, b.prototype.computeSecret = function (e) {
                        var r = (e = (e = new i(e)).toRed(this._prime)).redPow(this._priv).fromRed(),
                            n = new t(r.toArray()), o = this.getPrime();
                        if (n.length < o.length) {
                            var s = new t(o.length - n.length);
                            s.fill(0), n = t.concat([s, n])
                        }
                        return n
                    }, b.prototype.getPublicKey = function (e) {
                        return y(this._pub, e)
                    }, b.prototype.getPrivateKey = function (e) {
                        return y(this._priv, e)
                    }, b.prototype.getPrime = function (e) {
                        return y(this.__prime, e)
                    }, b.prototype.getGenerator = function (e) {
                        return y(this._gen, e)
                    }, b.prototype.setGenerator = function (e, r) {
                        return r = r || "utf8", t.isBuffer(e) || (e = new t(e, r)), this.__gen = e, this._gen = new i(e), this
                    }
                }).call(t, r(3).Buffer)
            }, function (e, t, r) {
                (function (t) {
                    var i = r(15), n = r(21), o = r(0), s = r(129), a = r(165), f = r(49);

                    function c(e) {
                        n.Writable.call(this);
                        var t = f[e];
                        if (!t) throw new Error("Unknown message digest");
                        this._hashType = t.hash, this._hash = i(t.hash), this._tag = t.id, this._signType = t.sign
                    }

                    function u(e) {
                        n.Writable.call(this);
                        var t = f[e];
                        if (!t) throw new Error("Unknown message digest");
                        this._hash = i(t.hash), this._tag = t.id, this._signType = t.sign
                    }

                    function h(e) {
                        return new c(e)
                    }

                    function d(e) {
                        return new u(e)
                    }

                    Object.keys(f).forEach(function (e) {
                        f[e].id = new t(f[e].id, "hex"), f[e.toLowerCase()] = f[e]
                    }), o(c, n.Writable), c.prototype._write = function (e, t, r) {
                        this._hash.update(e), r()
                    }, c.prototype.update = function (e, r) {
                        return "string" == typeof e && (e = new t(e, r)), this._hash.update(e), this
                    }, c.prototype.sign = function (e, t) {
                        this.end();
                        var r = this._hash.digest(), i = s(r, e, this._hashType, this._signType, this._tag);
                        return t ? i.toString(t) : i
                    }, o(u, n.Writable), u.prototype._write = function (e, t, r) {
                        this._hash.update(e), r()
                    }, u.prototype.update = function (e, r) {
                        return "string" == typeof e && (e = new t(e, r)), this._hash.update(e), this
                    }, u.prototype.verify = function (e, r, i) {
                        "string" == typeof r && (r = new t(r, i)), this.end();
                        var n = this._hash.digest();
                        return a(r, n, e, this._signType, this._tag)
                    }, e.exports = {Sign: h, Verify: d, createSign: h, createVerify: d}
                }).call(t, r(3).Buffer)
            }, function (e, t, r) {
                (function (t) {
                    var i = r(48), n = r(38), o = r(4).ec, s = r(2), a = r(26), f = r(70);

                    function c(e, r, n, o) {
                        if ((e = new t(e.toArray())).length < r.byteLength()) {
                            var s = new t(r.byteLength() - e.length);
                            s.fill(0), e = t.concat([s, e])
                        }
                        var a = n.length, f = function (e, r) {
                            e = (e = u(e, r)).mod(r);
                            var i = new t(e.toArray());
                            if (i.length < r.byteLength()) {
                                var n = new t(r.byteLength() - i.length);
                                n.fill(0), i = t.concat([n, i])
                            }
                            return i
                        }(n, r), c = new t(a);
                        c.fill(1);
                        var h = new t(a);
                        return h.fill(0), h = i(o, h).update(c).update(new t([0])).update(e).update(f).digest(), c = i(o, h).update(c).digest(), {
                            k: h = i(o, h).update(c).update(new t([1])).update(e).update(f).digest(),
                            v: c = i(o, h).update(c).digest()
                        }
                    }

                    function u(e, t) {
                        var r = new s(e), i = (e.length << 3) - t.bitLength();
                        return i > 0 && r.ishrn(i), r
                    }

                    function h(e, r, n) {
                        var o, s;
                        do {
                            for (o = new t(0); 8 * o.length < e.bitLength();) r.v = i(n, r.k).update(r.v).digest(), o = t.concat([o, r.v]);
                            s = u(o, e), r.k = i(n, r.k).update(r.v).update(new t([0])).digest(), r.v = i(n, r.k).update(r.v).digest()
                        } while (-1 !== s.cmp(e));
                        return s
                    }

                    function d(e, t, r, i) {
                        return e.toRed(s.mont(r)).redPow(t).fromRed().mod(i)
                    }

                    e.exports = function (e, r, i, l, p) {
                        var b = a(r);
                        if (b.curve) {
                            if ("ecdsa" !== l && "ecdsa/rsa" !== l) throw new Error("wrong private key type");
                            return function (e, r) {
                                var i = f[r.curve.join(".")];
                                if (!i) throw new Error("unknown curve " + r.curve.join("."));
                                var n = new o(i).keyFromPrivate(r.privateKey).sign(e);
                                return new t(n.toDER())
                            }(e, b)
                        }
                        if ("dsa" === b.type) {
                            if ("dsa" !== l) throw new Error("wrong private key type");
                            return function (e, r, i) {
                                for (var n, o = r.params.priv_key, a = r.params.p, f = r.params.q, l = r.params.g, p = new s(0), b = u(e, f).mod(f), y = !1, v = c(o, f, e, i); !1 === y;) p = d(l, n = h(f, v, i), a, f), 0 === (y = n.invm(f).imul(b.add(o.mul(p))).mod(f)).cmpn(0) && (y = !1, p = new s(0));
                                return function (e, r) {
                                    e = e.toArray(), r = r.toArray(), 128 & e[0] && (e = [0].concat(e)), 128 & r[0] && (r = [0].concat(r));
                                    var i = [48, e.length + r.length + 4, 2, e.length];
                                    return i = i.concat(e, [2, r.length], r), new t(i)
                                }(p, y)
                            }(e, b, i)
                        }
                        if ("rsa" !== l && "ecdsa/rsa" !== l) throw new Error("wrong private key type");
                        e = t.concat([p, e]);
                        for (var y = b.modulus.byteLength(), v = [0, 1]; e.length + v.length + 1 < y;) v.push(255);
                        v.push(0);
                        for (var m = -1; ++m < e.length;) v.push(e[m]);
                        return n(v, b)
                    }, e.exports.getKey = c, e.exports.makeKey = h
                }).call(t, r(3).Buffer)
            }, function (e, t) {
                e.exports = {
                    _args: [["elliptic@6.4.0", "/Users/gaurav/epfl/cothority/external/js/kyber"]],
                    _from: "elliptic@6.4.0",
                    _id: "elliptic@6.4.0",
                    _inBundle: !1,
                    _integrity: "sha1-ysmvh2LIWDYYcAPI3+GT5eLq5d8=",
                    _location: "/elliptic",
                    _phantomChildren: {},
                    _requested: {
                        type: "version",
                        registry: !0,
                        raw: "elliptic@6.4.0",
                        name: "elliptic",
                        escapedName: "elliptic",
                        rawSpec: "6.4.0",
                        saveSpec: null,
                        fetchSpec: "6.4.0"
                    },
                    _requiredBy: ["/", "/browserify-sign", "/create-ecdh"],
                    _resolved: "https://registry.npmjs.org/elliptic/-/elliptic-6.4.0.tgz",
                    _spec: "6.4.0",
                    _where: "/Users/gaurav/epfl/cothority/external/js/kyber",
                    author: {name: "Fedor Indutny", email: "fedor@indutny.com"},
                    bugs: {url: "https://github.com/indutny/elliptic/issues"},
                    dependencies: {
                        "bn.js": "^4.4.0",
                        brorand: "^1.0.1",
                        "hash.js": "^1.0.0",
                        "hmac-drbg": "^1.0.0",
                        inherits: "^2.0.1",
                        "minimalistic-assert": "^1.0.0",
                        "minimalistic-crypto-utils": "^1.0.0"
                    },
                    description: "EC cryptography",
                    devDependencies: {
                        brfs: "^1.4.3",
                        coveralls: "^2.11.3",
                        grunt: "^0.4.5",
                        "grunt-browserify": "^5.0.0",
                        "grunt-cli": "^1.2.0",
                        "grunt-contrib-connect": "^1.0.0",
                        "grunt-contrib-copy": "^1.0.0",
                        "grunt-contrib-uglify": "^1.0.1",
                        "grunt-mocha-istanbul": "^3.0.1",
                        "grunt-saucelabs": "^8.6.2",
                        istanbul: "^0.4.2",
                        jscs: "^2.9.0",
                        jshint: "^2.6.0",
                        mocha: "^2.1.0"
                    },
                    files: ["lib"],
                    homepage: "https://github.com/indutny/elliptic",
                    keywords: ["EC", "Elliptic", "curve", "Cryptography"],
                    license: "MIT",
                    main: "lib/elliptic.js",
                    name: "elliptic",
                    repository: {type: "git", url: "git+ssh://git@github.com/indutny/elliptic.git"},
                    scripts: {
                        jscs: "jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js",
                        jshint: "jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js",
                        lint: "npm run jscs && npm run jshint",
                        test: "npm run lint && npm run unit",
                        unit: "istanbul test _mocha --reporter=spec test/index.js",
                        version: "grunt dist && git add dist/"
                    },
                    version: "6.4.0"
                }
            }, function (e, t, r) {
                "use strict";
                var i = t, n = r(2), o = r(5), s = r(62);
                i.assert = o, i.toArray = s.toArray, i.zero2 = s.zero2, i.toHex = s.toHex, i.encode = s.encode, i.getNAF = function (e, t) {
                    for (var r = [], i = 1 << t + 1, n = e.clone(); n.cmpn(1) >= 0;) {
                        var o;
                        if (n.isOdd()) {
                            var s = n.andln(i - 1);
                            o = s > (i >> 1) - 1 ? (i >> 1) - s : s, n.isubn(o)
                        } else o = 0;
                        r.push(o);
                        for (var a = 0 !== n.cmpn(0) && 0 === n.andln(i - 1) ? t + 1 : 1, f = 1; f < a; f++) r.push(0);
                        n.iushrn(a)
                    }
                    return r
                }, i.getJSF = function (e, t) {
                    var r = [[], []];
                    e = e.clone(), t = t.clone();
                    for (var i = 0, n = 0; e.cmpn(-i) > 0 || t.cmpn(-n) > 0;) {
                        var o, s, a, f = e.andln(3) + i & 3, c = t.andln(3) + n & 3;
                        3 === f && (f = -1), 3 === c && (c = -1), o = 0 == (1 & f) ? 0 : 3 != (a = e.andln(7) + i & 7) && 5 !== a || 2 !== c ? f : -f, r[0].push(o), s = 0 == (1 & c) ? 0 : 3 != (a = t.andln(7) + n & 7) && 5 !== a || 2 !== f ? c : -c, r[1].push(s), 2 * i === o + 1 && (i = 1 - i), 2 * n === s + 1 && (n = 1 - n), e.iushrn(1), t.iushrn(1)
                    }
                    return r
                }, i.cachedProperty = function (e, t, r) {
                    var i = "_" + t;
                    e.prototype[t] = function () {
                        return void 0 !== this[i] ? this[i] : this[i] = r.call(this)
                    }
                }, i.parseBytes = function (e) {
                    return "string" == typeof e ? i.toArray(e, "hex") : e
                }, i.intFromLE = function (e) {
                    return new n(e, "hex", "le")
                }
            }, function (e, t, r) {
                "use strict";
                var i = r(2), n = r(4).utils, o = n.getNAF, s = n.getJSF, a = n.assert;

                function f(e, t) {
                    this.type = e, this.p = new i(t.p, 16), this.red = t.prime ? i.red(t.prime) : i.mont(this.p), this.zero = new i(0).toRed(this.red), this.one = new i(1).toRed(this.red), this.two = new i(2).toRed(this.red), this.n = t.n && new i(t.n, 16), this.g = t.g && this.pointFromJSON(t.g, t.gRed), this._wnafT1 = new Array(4), this._wnafT2 = new Array(4), this._wnafT3 = new Array(4), this._wnafT4 = new Array(4);
                    var r = this.n && this.p.div(this.n);
                    !r || r.cmpn(100) > 0 ? this.redN = null : (this._maxwellTrick = !0, this.redN = this.n.toRed(this.red))
                }

                function c(e, t) {
                    this.curve = e, this.type = t, this.precomputed = null
                }

                e.exports = f, f.prototype.point = function () {
                    throw new Error("Not implemented")
                }, f.prototype.validate = function () {
                    throw new Error("Not implemented")
                }, f.prototype._fixedNafMul = function (e, t) {
                    a(e.precomputed);
                    var r = e._getDoubles(), i = o(t, 1), n = (1 << r.step + 1) - (r.step % 2 == 0 ? 2 : 1);
                    n /= 3;
                    for (var s = [], f = 0; f < i.length; f += r.step) {
                        var c = 0;
                        for (t = f + r.step - 1; t >= f; t--) c = (c << 1) + i[t];
                        s.push(c)
                    }
                    for (var u = this.jpoint(null, null, null), h = this.jpoint(null, null, null), d = n; d > 0; d--) {
                        for (f = 0; f < s.length; f++) (c = s[f]) === d ? h = h.mixedAdd(r.points[f]) : c === -d && (h = h.mixedAdd(r.points[f].neg()));
                        u = u.add(h)
                    }
                    return u.toP()
                }, f.prototype._wnafMul = function (e, t) {
                    var r = 4, i = e._getNAFPoints(r);
                    r = i.wnd;
                    for (var n = i.points, s = o(t, r), f = this.jpoint(null, null, null), c = s.length - 1; c >= 0; c--) {
                        for (t = 0; c >= 0 && 0 === s[c]; c--) t++;
                        if (c >= 0 && t++, f = f.dblp(t), c < 0) break;
                        var u = s[c];
                        a(0 !== u), f = "affine" === e.type ? u > 0 ? f.mixedAdd(n[u - 1 >> 1]) : f.mixedAdd(n[-u - 1 >> 1].neg()) : u > 0 ? f.add(n[u - 1 >> 1]) : f.add(n[-u - 1 >> 1].neg())
                    }
                    return "affine" === e.type ? f.toP() : f
                }, f.prototype._wnafMulAdd = function (e, t, r, i, n) {
                    for (var a = this._wnafT1, f = this._wnafT2, c = this._wnafT3, u = 0, h = 0; h < i; h++) {
                        var d = (E = t[h])._getNAFPoints(e);
                        a[h] = d.wnd, f[h] = d.points
                    }
                    for (h = i - 1; h >= 1; h -= 2) {
                        var l = h - 1, p = h;
                        if (1 === a[l] && 1 === a[p]) {
                            var b = [t[l], null, null, t[p]];
                            0 === t[l].y.cmp(t[p].y) ? (b[1] = t[l].add(t[p]), b[2] = t[l].toJ().mixedAdd(t[p].neg())) : 0 === t[l].y.cmp(t[p].y.redNeg()) ? (b[1] = t[l].toJ().mixedAdd(t[p]), b[2] = t[l].add(t[p].neg())) : (b[1] = t[l].toJ().mixedAdd(t[p]), b[2] = t[l].toJ().mixedAdd(t[p].neg()));
                            var y = [-3, -1, -5, -7, 0, 7, 5, 1, 3], v = s(r[l], r[p]);
                            u = Math.max(v[0].length, u), c[l] = new Array(u), c[p] = new Array(u);
                            for (var m = 0; m < u; m++) {
                                var g = 0 | v[0][m], w = 0 | v[1][m];
                                c[l][m] = y[3 * (g + 1) + (w + 1)], c[p][m] = 0, f[l] = b
                            }
                        } else c[l] = o(r[l], a[l]), c[p] = o(r[p], a[p]), u = Math.max(c[l].length, u), u = Math.max(c[p].length, u)
                    }
                    var _ = this.jpoint(null, null, null), S = this._wnafT4;
                    for (h = u; h >= 0; h--) {
                        for (var k = 0; h >= 0;) {
                            var A = !0;
                            for (m = 0; m < i; m++) S[m] = 0 | c[m][h], 0 !== S[m] && (A = !1);
                            if (!A) break;
                            k++, h--
                        }
                        if (h >= 0 && k++, _ = _.dblp(k), h < 0) break;
                        for (m = 0; m < i; m++) {
                            var E, x = S[m];
                            0 !== x && (x > 0 ? E = f[m][x - 1 >> 1] : x < 0 && (E = f[m][-x - 1 >> 1].neg()), _ = "affine" === E.type ? _.mixedAdd(E) : _.add(E))
                        }
                    }
                    for (h = 0; h < i; h++) f[h] = null;
                    return n ? _ : _.toP()
                }, f.BasePoint = c, c.prototype.eq = function () {
                    throw new Error("Not implemented")
                }, c.prototype.validate = function () {
                    return this.curve.validate(this)
                }, f.prototype.decodePoint = function (e, t) {
                    e = n.toArray(e, t);
                    var r = this.p.byteLength();
                    if ((4 === e[0] || 6 === e[0] || 7 === e[0]) && e.length - 1 == 2 * r) return 6 === e[0] ? a(e[e.length - 1] % 2 == 0) : 7 === e[0] && a(e[e.length - 1] % 2 == 1), this.point(e.slice(1, 1 + r), e.slice(1 + r, 1 + 2 * r));
                    if ((2 === e[0] || 3 === e[0]) && e.length - 1 === r) return this.pointFromX(e.slice(1, 1 + r), 3 === e[0]);
                    throw new Error("Unknown point format")
                }, c.prototype.encodeCompressed = function (e) {
                    return this.encode(e, !0)
                }, c.prototype._encode = function (e) {
                    var t = this.curve.p.byteLength(), r = this.getX().toArray("be", t);
                    return e ? [this.getY().isEven() ? 2 : 3].concat(r) : [4].concat(r, this.getY().toArray("be", t))
                }, c.prototype.encode = function (e, t) {
                    return n.encode(this._encode(t), e)
                }, c.prototype.precompute = function (e) {
                    if (this.precomputed) return this;
                    var t = {doubles: null, naf: null, beta: null};
                    return t.naf = this._getNAFPoints(8), t.doubles = this._getDoubles(4, e), t.beta = this._getBeta(), this.precomputed = t, this
                }, c.prototype._hasDoubles = function (e) {
                    if (!this.precomputed) return !1;
                    var t = this.precomputed.doubles;
                    return !!t && t.points.length >= Math.ceil((e.bitLength() + 1) / t.step)
                }, c.prototype._getDoubles = function (e, t) {
                    if (this.precomputed && this.precomputed.doubles) return this.precomputed.doubles;
                    for (var r = [this], i = this, n = 0; n < t; n += e) {
                        for (var o = 0; o < e; o++) i = i.dbl();
                        r.push(i)
                    }
                    return {step: e, points: r}
                }, c.prototype._getNAFPoints = function (e) {
                    if (this.precomputed && this.precomputed.naf) return this.precomputed.naf;
                    for (var t = [this], r = (1 << e) - 1, i = 1 === r ? null : this.dbl(), n = 1; n < r; n++) t[n] = t[n - 1].add(i);
                    return {wnd: e, points: t}
                }, c.prototype._getBeta = function () {
                    return null
                }, c.prototype.dblp = function (e) {
                    for (var t = this, r = 0; r < e; r++) t = t.dbl();
                    return t
                }
            }, function (e, t, r) {
                "use strict";
                var i = r(25), n = r(4), o = r(2), s = r(0), a = i.base, f = n.utils.assert;

                function c(e) {
                    a.call(this, "short", e), this.a = new o(e.a, 16).toRed(this.red), this.b = new o(e.b, 16).toRed(this.red), this.tinv = this.two.redInvm(), this.zeroA = 0 === this.a.fromRed().cmpn(0), this.threeA = 0 === this.a.fromRed().sub(this.p).cmpn(-3), this.endo = this._getEndomorphism(e), this._endoWnafT1 = new Array(4), this._endoWnafT2 = new Array(4)
                }

                function u(e, t, r, i) {
                    a.BasePoint.call(this, e, "affine"), null === t && null === r ? (this.x = null, this.y = null, this.inf = !0) : (this.x = new o(t, 16), this.y = new o(r, 16), i && (this.x.forceRed(this.curve.red), this.y.forceRed(this.curve.red)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.inf = !1)
                }

                function h(e, t, r, i) {
                    a.BasePoint.call(this, e, "jacobian"), null === t && null === r && null === i ? (this.x = this.curve.one, this.y = this.curve.one, this.z = new o(0)) : (this.x = new o(t, 16), this.y = new o(r, 16), this.z = new o(i, 16)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.zOne = this.z === this.curve.one
                }

                s(c, a), e.exports = c, c.prototype._getEndomorphism = function (e) {
                    if (this.zeroA && this.g && this.n && 1 === this.p.modn(3)) {
                        var t, r;
                        if (e.beta) t = new o(e.beta, 16).toRed(this.red); else {
                            var i = this._getEndoRoots(this.p);
                            t = (t = i[0].cmp(i[1]) < 0 ? i[0] : i[1]).toRed(this.red)
                        }
                        if (e.lambda) r = new o(e.lambda, 16); else {
                            var n = this._getEndoRoots(this.n);
                            0 === this.g.mul(n[0]).x.cmp(this.g.x.redMul(t)) ? r = n[0] : (r = n[1], f(0 === this.g.mul(r).x.cmp(this.g.x.redMul(t))))
                        }
                        return {
                            beta: t, lambda: r, basis: e.basis ? e.basis.map(function (e) {
                                return {a: new o(e.a, 16), b: new o(e.b, 16)}
                            }) : this._getEndoBasis(r)
                        }
                    }
                }, c.prototype._getEndoRoots = function (e) {
                    var t = e === this.p ? this.red : o.mont(e), r = new o(2).toRed(t).redInvm(), i = r.redNeg(),
                        n = new o(3).toRed(t).redNeg().redSqrt().redMul(r);
                    return [i.redAdd(n).fromRed(), i.redSub(n).fromRed()]
                }, c.prototype._getEndoBasis = function (e) {
                    for (var t, r, i, n, s, a, f, c, u, h = this.n.ushrn(Math.floor(this.n.bitLength() / 2)), d = e, l = this.n.clone(), p = new o(1), b = new o(0), y = new o(0), v = new o(1), m = 0; 0 !== d.cmpn(0);) {
                        var g = l.div(d);
                        c = l.sub(g.mul(d)), u = y.sub(g.mul(p));
                        var w = v.sub(g.mul(b));
                        if (!i && c.cmp(h) < 0) t = f.neg(), r = p, i = c.neg(), n = u; else if (i && 2 == ++m) break;
                        f = c, l = d, d = c, y = p, p = u, v = b, b = w
                    }
                    s = c.neg(), a = u;
                    var _ = i.sqr().add(n.sqr());
                    return s.sqr().add(a.sqr()).cmp(_) >= 0 && (s = t, a = r), i.negative && (i = i.neg(), n = n.neg()), s.negative && (s = s.neg(), a = a.neg()), [{
                        a: i,
                        b: n
                    }, {a: s, b: a}]
                }, c.prototype._endoSplit = function (e) {
                    var t = this.endo.basis, r = t[0], i = t[1], n = i.b.mul(e).divRound(this.n),
                        o = r.b.neg().mul(e).divRound(this.n), s = n.mul(r.a), a = o.mul(i.a), f = n.mul(r.b),
                        c = o.mul(i.b);
                    return {k1: e.sub(s).sub(a), k2: f.add(c).neg()}
                }, c.prototype.pointFromX = function (e, t) {
                    (e = new o(e, 16)).red || (e = e.toRed(this.red));
                    var r = e.redSqr().redMul(e).redIAdd(e.redMul(this.a)).redIAdd(this.b), i = r.redSqrt();
                    if (0 !== i.redSqr().redSub(r).cmp(this.zero)) throw new Error("invalid point");
                    var n = i.fromRed().isOdd();
                    return (t && !n || !t && n) && (i = i.redNeg()), this.point(e, i)
                }, c.prototype.validate = function (e) {
                    if (e.inf) return !0;
                    var t = e.x, r = e.y, i = this.a.redMul(t), n = t.redSqr().redMul(t).redIAdd(i).redIAdd(this.b);
                    return 0 === r.redSqr().redISub(n).cmpn(0)
                }, c.prototype._endoWnafMulAdd = function (e, t, r) {
                    for (var i = this._endoWnafT1, n = this._endoWnafT2, o = 0; o < e.length; o++) {
                        var s = this._endoSplit(t[o]), a = e[o], f = a._getBeta();
                        s.k1.negative && (s.k1.ineg(), a = a.neg(!0)), s.k2.negative && (s.k2.ineg(), f = f.neg(!0)), i[2 * o] = a, i[2 * o + 1] = f, n[2 * o] = s.k1, n[2 * o + 1] = s.k2
                    }
                    for (var c = this._wnafMulAdd(1, i, n, 2 * o, r), u = 0; u < 2 * o; u++) i[u] = null, n[u] = null;
                    return c
                }, s(u, a.BasePoint), c.prototype.point = function (e, t, r) {
                    return new u(this, e, t, r)
                }, c.prototype.pointFromJSON = function (e, t) {
                    return u.fromJSON(this, e, t)
                }, u.prototype._getBeta = function () {
                    if (this.curve.endo) {
                        var e = this.precomputed;
                        if (e && e.beta) return e.beta;
                        var t = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
                        if (e) {
                            var r = this.curve, i = function (e) {
                                return r.point(e.x.redMul(r.endo.beta), e.y)
                            };
                            e.beta = t, t.precomputed = {
                                beta: null,
                                naf: e.naf && {wnd: e.naf.wnd, points: e.naf.points.map(i)},
                                doubles: e.doubles && {step: e.doubles.step, points: e.doubles.points.map(i)}
                            }
                        }
                        return t
                    }
                }, u.prototype.toJSON = function () {
                    return this.precomputed ? [this.x, this.y, this.precomputed && {
                        doubles: this.precomputed.doubles && {
                            step: this.precomputed.doubles.step,
                            points: this.precomputed.doubles.points.slice(1)
                        },
                        naf: this.precomputed.naf && {
                            wnd: this.precomputed.naf.wnd,
                            points: this.precomputed.naf.points.slice(1)
                        }
                    }] : [this.x, this.y]
                }, u.fromJSON = function (e, t, r) {
                    "string" == typeof t && (t = JSON.parse(t));
                    var i = e.point(t[0], t[1], r);
                    if (!t[2]) return i;

                    function n(t) {
                        return e.point(t[0], t[1], r)
                    }

                    var o = t[2];
                    return i.precomputed = {
                        beta: null,
                        doubles: o.doubles && {step: o.doubles.step, points: [i].concat(o.doubles.points.map(n))},
                        naf: o.naf && {wnd: o.naf.wnd, points: [i].concat(o.naf.points.map(n))}
                    }, i
                }, u.prototype.inspect = function () {
                    return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + ">"
                }, u.prototype.isInfinity = function () {
                    return this.inf
                }, u.prototype.add = function (e) {
                    if (this.inf) return e;
                    if (e.inf) return this;
                    if (this.eq(e)) return this.dbl();
                    if (this.neg().eq(e)) return this.curve.point(null, null);
                    if (0 === this.x.cmp(e.x)) return this.curve.point(null, null);
                    var t = this.y.redSub(e.y);
                    0 !== t.cmpn(0) && (t = t.redMul(this.x.redSub(e.x).redInvm()));
                    var r = t.redSqr().redISub(this.x).redISub(e.x), i = t.redMul(this.x.redSub(r)).redISub(this.y);
                    return this.curve.point(r, i)
                }, u.prototype.dbl = function () {
                    if (this.inf) return this;
                    var e = this.y.redAdd(this.y);
                    if (0 === e.cmpn(0)) return this.curve.point(null, null);
                    var t = this.curve.a, r = this.x.redSqr(), i = e.redInvm(),
                        n = r.redAdd(r).redIAdd(r).redIAdd(t).redMul(i), o = n.redSqr().redISub(this.x.redAdd(this.x)),
                        s = n.redMul(this.x.redSub(o)).redISub(this.y);
                    return this.curve.point(o, s)
                }, u.prototype.getX = function () {
                    return this.x.fromRed()
                }, u.prototype.getY = function () {
                    return this.y.fromRed()
                }, u.prototype.mul = function (e) {
                    return e = new o(e, 16), this._hasDoubles(e) ? this.curve._fixedNafMul(this, e) : this.curve.endo ? this.curve._endoWnafMulAdd([this], [e]) : this.curve._wnafMul(this, e)
                }, u.prototype.mulAdd = function (e, t, r) {
                    var i = [this, t], n = [e, r];
                    return this.curve.endo ? this.curve._endoWnafMulAdd(i, n) : this.curve._wnafMulAdd(1, i, n, 2)
                }, u.prototype.jmulAdd = function (e, t, r) {
                    var i = [this, t], n = [e, r];
                    return this.curve.endo ? this.curve._endoWnafMulAdd(i, n, !0) : this.curve._wnafMulAdd(1, i, n, 2, !0)
                }, u.prototype.eq = function (e) {
                    return this === e || this.inf === e.inf && (this.inf || 0 === this.x.cmp(e.x) && 0 === this.y.cmp(e.y))
                }, u.prototype.neg = function (e) {
                    if (this.inf) return this;
                    var t = this.curve.point(this.x, this.y.redNeg());
                    if (e && this.precomputed) {
                        var r = this.precomputed, i = function (e) {
                            return e.neg()
                        };
                        t.precomputed = {
                            naf: r.naf && {wnd: r.naf.wnd, points: r.naf.points.map(i)},
                            doubles: r.doubles && {step: r.doubles.step, points: r.doubles.points.map(i)}
                        }
                    }
                    return t
                }, u.prototype.toJ = function () {
                    return this.inf ? this.curve.jpoint(null, null, null) : this.curve.jpoint(this.x, this.y, this.curve.one)
                }, s(h, a.BasePoint), c.prototype.jpoint = function (e, t, r) {
                    return new h(this, e, t, r)
                }, h.prototype.toP = function () {
                    if (this.isInfinity()) return this.curve.point(null, null);
                    var e = this.z.redInvm(), t = e.redSqr(), r = this.x.redMul(t), i = this.y.redMul(t).redMul(e);
                    return this.curve.point(r, i)
                }, h.prototype.neg = function () {
                    return this.curve.jpoint(this.x, this.y.redNeg(), this.z)
                }, h.prototype.add = function (e) {
                    if (this.isInfinity()) return e;
                    if (e.isInfinity()) return this;
                    var t = e.z.redSqr(), r = this.z.redSqr(), i = this.x.redMul(t), n = e.x.redMul(r),
                        o = this.y.redMul(t.redMul(e.z)), s = e.y.redMul(r.redMul(this.z)), a = i.redSub(n),
                        f = o.redSub(s);
                    if (0 === a.cmpn(0)) return 0 !== f.cmpn(0) ? this.curve.jpoint(null, null, null) : this.dbl();
                    var c = a.redSqr(), u = c.redMul(a), h = i.redMul(c),
                        d = f.redSqr().redIAdd(u).redISub(h).redISub(h),
                        l = f.redMul(h.redISub(d)).redISub(o.redMul(u)), p = this.z.redMul(e.z).redMul(a);
                    return this.curve.jpoint(d, l, p)
                }, h.prototype.mixedAdd = function (e) {
                    if (this.isInfinity()) return e.toJ();
                    if (e.isInfinity()) return this;
                    var t = this.z.redSqr(), r = this.x, i = e.x.redMul(t), n = this.y,
                        o = e.y.redMul(t).redMul(this.z), s = r.redSub(i), a = n.redSub(o);
                    if (0 === s.cmpn(0)) return 0 !== a.cmpn(0) ? this.curve.jpoint(null, null, null) : this.dbl();
                    var f = s.redSqr(), c = f.redMul(s), u = r.redMul(f),
                        h = a.redSqr().redIAdd(c).redISub(u).redISub(u),
                        d = a.redMul(u.redISub(h)).redISub(n.redMul(c)), l = this.z.redMul(s);
                    return this.curve.jpoint(h, d, l)
                }, h.prototype.dblp = function (e) {
                    if (0 === e) return this;
                    if (this.isInfinity()) return this;
                    if (!e) return this.dbl();
                    if (this.curve.zeroA || this.curve.threeA) {
                        for (var t = this, r = 0; r < e; r++) t = t.dbl();
                        return t
                    }
                    var i = this.curve.a, n = this.curve.tinv, o = this.x, s = this.y, a = this.z,
                        f = a.redSqr().redSqr(), c = s.redAdd(s);
                    for (r = 0; r < e; r++) {
                        var u = o.redSqr(), h = c.redSqr(), d = h.redSqr(),
                            l = u.redAdd(u).redIAdd(u).redIAdd(i.redMul(f)), p = o.redMul(h),
                            b = l.redSqr().redISub(p.redAdd(p)), y = p.redISub(b), v = l.redMul(y);
                        v = v.redIAdd(v).redISub(d);
                        var m = c.redMul(a);
                        r + 1 < e && (f = f.redMul(d)), o = b, a = m, c = v
                    }
                    return this.curve.jpoint(o, c.redMul(n), a)
                }, h.prototype.dbl = function () {
                    return this.isInfinity() ? this : this.curve.zeroA ? this._zeroDbl() : this.curve.threeA ? this._threeDbl() : this._dbl()
                }, h.prototype._zeroDbl = function () {
                    var e, t, r;
                    if (this.zOne) {
                        var i = this.x.redSqr(), n = this.y.redSqr(), o = n.redSqr(),
                            s = this.x.redAdd(n).redSqr().redISub(i).redISub(o);
                        s = s.redIAdd(s);
                        var a = i.redAdd(i).redIAdd(i), f = a.redSqr().redISub(s).redISub(s), c = o.redIAdd(o);
                        c = (c = c.redIAdd(c)).redIAdd(c), e = f, t = a.redMul(s.redISub(f)).redISub(c), r = this.y.redAdd(this.y)
                    } else {
                        var u = this.x.redSqr(), h = this.y.redSqr(), d = h.redSqr(),
                            l = this.x.redAdd(h).redSqr().redISub(u).redISub(d);
                        l = l.redIAdd(l);
                        var p = u.redAdd(u).redIAdd(u), b = p.redSqr(), y = d.redIAdd(d);
                        y = (y = y.redIAdd(y)).redIAdd(y), e = b.redISub(l).redISub(l), t = p.redMul(l.redISub(e)).redISub(y), r = (r = this.y.redMul(this.z)).redIAdd(r)
                    }
                    return this.curve.jpoint(e, t, r)
                }, h.prototype._threeDbl = function () {
                    var e, t, r;
                    if (this.zOne) {
                        var i = this.x.redSqr(), n = this.y.redSqr(), o = n.redSqr(),
                            s = this.x.redAdd(n).redSqr().redISub(i).redISub(o);
                        s = s.redIAdd(s);
                        var a = i.redAdd(i).redIAdd(i).redIAdd(this.curve.a), f = a.redSqr().redISub(s).redISub(s);
                        e = f;
                        var c = o.redIAdd(o);
                        c = (c = c.redIAdd(c)).redIAdd(c), t = a.redMul(s.redISub(f)).redISub(c), r = this.y.redAdd(this.y)
                    } else {
                        var u = this.z.redSqr(), h = this.y.redSqr(), d = this.x.redMul(h),
                            l = this.x.redSub(u).redMul(this.x.redAdd(u));
                        l = l.redAdd(l).redIAdd(l);
                        var p = d.redIAdd(d), b = (p = p.redIAdd(p)).redAdd(p);
                        e = l.redSqr().redISub(b), r = this.y.redAdd(this.z).redSqr().redISub(h).redISub(u);
                        var y = h.redSqr();
                        y = (y = (y = y.redIAdd(y)).redIAdd(y)).redIAdd(y), t = l.redMul(p.redISub(e)).redISub(y)
                    }
                    return this.curve.jpoint(e, t, r)
                }, h.prototype._dbl = function () {
                    var e = this.curve.a, t = this.x, r = this.y, i = this.z, n = i.redSqr().redSqr(), o = t.redSqr(),
                        s = r.redSqr(), a = o.redAdd(o).redIAdd(o).redIAdd(e.redMul(n)), f = t.redAdd(t),
                        c = (f = f.redIAdd(f)).redMul(s), u = a.redSqr().redISub(c.redAdd(c)), h = c.redISub(u),
                        d = s.redSqr();
                    d = (d = (d = d.redIAdd(d)).redIAdd(d)).redIAdd(d);
                    var l = a.redMul(h).redISub(d), p = r.redAdd(r).redMul(i);
                    return this.curve.jpoint(u, l, p)
                }, h.prototype.trpl = function () {
                    if (!this.curve.zeroA) return this.dbl().add(this);
                    var e = this.x.redSqr(), t = this.y.redSqr(), r = this.z.redSqr(), i = t.redSqr(),
                        n = e.redAdd(e).redIAdd(e), o = n.redSqr(), s = this.x.redAdd(t).redSqr().redISub(e).redISub(i),
                        a = (s = (s = (s = s.redIAdd(s)).redAdd(s).redIAdd(s)).redISub(o)).redSqr(), f = i.redIAdd(i);
                    f = (f = (f = f.redIAdd(f)).redIAdd(f)).redIAdd(f);
                    var c = n.redIAdd(s).redSqr().redISub(o).redISub(a).redISub(f), u = t.redMul(c);
                    u = (u = u.redIAdd(u)).redIAdd(u);
                    var h = this.x.redMul(a).redISub(u);
                    h = (h = h.redIAdd(h)).redIAdd(h);
                    var d = this.y.redMul(c.redMul(f.redISub(c)).redISub(s.redMul(a)));
                    d = (d = (d = d.redIAdd(d)).redIAdd(d)).redIAdd(d);
                    var l = this.z.redAdd(s).redSqr().redISub(r).redISub(a);
                    return this.curve.jpoint(h, d, l)
                }, h.prototype.mul = function (e, t) {
                    return e = new o(e, t), this.curve._wnafMul(this, e)
                }, h.prototype.eq = function (e) {
                    if ("affine" === e.type) return this.eq(e.toJ());
                    if (this === e) return !0;
                    var t = this.z.redSqr(), r = e.z.redSqr();
                    if (0 !== this.x.redMul(r).redISub(e.x.redMul(t)).cmpn(0)) return !1;
                    var i = t.redMul(this.z), n = r.redMul(e.z);
                    return 0 === this.y.redMul(n).redISub(e.y.redMul(i)).cmpn(0)
                }, h.prototype.eqXToP = function (e) {
                    var t = this.z.redSqr(), r = e.toRed(this.curve.red).redMul(t);
                    if (0 === this.x.cmp(r)) return !0;
                    for (var i = e.clone(), n = this.curve.redN.redMul(t); ;) {
                        if (i.iadd(this.curve.n), i.cmp(this.curve.p) >= 0) return !1;
                        if (r.redIAdd(n), 0 === this.x.cmp(r)) return !0
                    }
                    return !1
                }, h.prototype.inspect = function () {
                    return this.isInfinity() ? "<EC JPoint Infinity>" : "<EC JPoint x: " + this.x.toString(16, 2) + " y: " + this.y.toString(16, 2) + " z: " + this.z.toString(16, 2) + ">"
                }, h.prototype.isInfinity = function () {
                    return 0 === this.z.cmpn(0)
                }
            }, function (e, t, r) {
                "use strict";
                var i = r(25), n = r(2), o = r(0), s = i.base, a = r(4).utils;

                function f(e) {
                    s.call(this, "mont", e), this.a = new n(e.a, 16).toRed(this.red), this.b = new n(e.b, 16).toRed(this.red), this.i4 = new n(4).toRed(this.red).redInvm(), this.two = new n(2).toRed(this.red), this.a24 = this.i4.redMul(this.a.redAdd(this.two))
                }

                function c(e, t, r) {
                    s.BasePoint.call(this, e, "projective"), null === t && null === r ? (this.x = this.curve.one, this.z = this.curve.zero) : (this.x = new n(t, 16), this.z = new n(r, 16), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)))
                }

                o(f, s), e.exports = f, f.prototype.validate = function (e) {
                    var t = e.normalize().x, r = t.redSqr(), i = r.redMul(t).redAdd(r.redMul(this.a)).redAdd(t);
                    return 0 === i.redSqrt().redSqr().cmp(i)
                }, o(c, s.BasePoint), f.prototype.decodePoint = function (e, t) {
                    return this.point(a.toArray(e, t), 1)
                }, f.prototype.point = function (e, t) {
                    return new c(this, e, t)
                }, f.prototype.pointFromJSON = function (e) {
                    return c.fromJSON(this, e)
                }, c.prototype.precompute = function () {
                }, c.prototype._encode = function () {
                    return this.getX().toArray("be", this.curve.p.byteLength())
                }, c.fromJSON = function (e, t) {
                    return new c(e, t[0], t[1] || e.one)
                }, c.prototype.inspect = function () {
                    return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">"
                }, c.prototype.isInfinity = function () {
                    return 0 === this.z.cmpn(0)
                }, c.prototype.dbl = function () {
                    var e = this.x.redAdd(this.z).redSqr(), t = this.x.redSub(this.z).redSqr(), r = e.redSub(t),
                        i = e.redMul(t), n = r.redMul(t.redAdd(this.curve.a24.redMul(r)));
                    return this.curve.point(i, n)
                }, c.prototype.add = function () {
                    throw new Error("Not supported on Montgomery curve")
                }, c.prototype.diffAdd = function (e, t) {
                    var r = this.x.redAdd(this.z), i = this.x.redSub(this.z), n = e.x.redAdd(e.z),
                        o = e.x.redSub(e.z).redMul(r), s = n.redMul(i), a = t.z.redMul(o.redAdd(s).redSqr()),
                        f = t.x.redMul(o.redISub(s).redSqr());
                    return this.curve.point(a, f)
                }, c.prototype.mul = function (e) {
                    for (var t = e.clone(), r = this, i = this.curve.point(null, null), n = []; 0 !== t.cmpn(0); t.iushrn(1)) n.push(t.andln(1));
                    for (var o = n.length - 1; o >= 0; o--) 0 === n[o] ? (r = r.diffAdd(i, this), i = i.dbl()) : (i = r.diffAdd(i, this), r = r.dbl());
                    return i
                }, c.prototype.mulAdd = function () {
                    throw new Error("Not supported on Montgomery curve")
                }, c.prototype.jumlAdd = function () {
                    throw new Error("Not supported on Montgomery curve")
                }, c.prototype.eq = function (e) {
                    return 0 === this.getX().cmp(e.getX())
                }, c.prototype.normalize = function () {
                    return this.x = this.x.redMul(this.z.redInvm()), this.z = this.curve.one, this
                }, c.prototype.getX = function () {
                    return this.normalize(), this.x.fromRed()
                }
            }, function (e, t, r) {
                "use strict";
                var i = r(25), n = r(4), o = r(2), s = r(0), a = i.base, f = n.utils.assert;

                function c(e) {
                    this.twisted = 1 != (0 | e.a), this.mOneA = this.twisted && -1 == (0 | e.a), this.extended = this.mOneA, a.call(this, "edwards", e), this.a = new o(e.a, 16).umod(this.red.m), this.a = this.a.toRed(this.red), this.c = new o(e.c, 16).toRed(this.red), this.c2 = this.c.redSqr(), this.d = new o(e.d, 16).toRed(this.red), this.dd = this.d.redAdd(this.d), f(!this.twisted || 0 === this.c.fromRed().cmpn(1)), this.oneC = 1 == (0 | e.c)
                }

                function u(e, t, r, i, n) {
                    a.BasePoint.call(this, e, "projective"), null === t && null === r && null === i ? (this.x = this.curve.zero, this.y = this.curve.one, this.z = this.curve.one, this.t = this.curve.zero, this.zOne = !0) : (this.x = new o(t, 16), this.y = new o(r, 16), this.z = i ? new o(i, 16) : this.curve.one, this.t = n && new o(n, 16), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.t && !this.t.red && (this.t = this.t.toRed(this.curve.red)), this.zOne = this.z === this.curve.one, this.curve.extended && !this.t && (this.t = this.x.redMul(this.y), this.zOne || (this.t = this.t.redMul(this.z.redInvm()))))
                }

                s(c, a), e.exports = c, c.prototype._mulA = function (e) {
                    return this.mOneA ? e.redNeg() : this.a.redMul(e)
                }, c.prototype._mulC = function (e) {
                    return this.oneC ? e : this.c.redMul(e)
                }, c.prototype.jpoint = function (e, t, r, i) {
                    return this.point(e, t, r, i)
                }, c.prototype.pointFromX = function (e, t) {
                    (e = new o(e, 16)).red || (e = e.toRed(this.red));
                    var r = e.redSqr(), i = this.c2.redSub(this.a.redMul(r)),
                        n = this.one.redSub(this.c2.redMul(this.d).redMul(r)), s = i.redMul(n.redInvm()),
                        a = s.redSqrt();
                    if (0 !== a.redSqr().redSub(s).cmp(this.zero)) throw new Error("invalid point");
                    var f = a.fromRed().isOdd();
                    return (t && !f || !t && f) && (a = a.redNeg()), this.point(e, a)
                }, c.prototype.pointFromY = function (e, t) {
                    (e = new o(e, 16)).red || (e = e.toRed(this.red));
                    var r = e.redSqr(), i = r.redSub(this.one), n = r.redMul(this.d).redAdd(this.one),
                        s = i.redMul(n.redInvm());
                    if (0 === s.cmp(this.zero)) {
                        if (t) throw new Error("invalid point");
                        return this.point(this.zero, e)
                    }
                    var a = s.redSqrt();
                    if (0 !== a.redSqr().redSub(s).cmp(this.zero)) throw new Error("invalid point");
                    return a.isOdd() !== t && (a = a.redNeg()), this.point(a, e)
                }, c.prototype.validate = function (e) {
                    if (e.isInfinity()) return !0;
                    e.normalize();
                    var t = e.x.redSqr(), r = e.y.redSqr(), i = t.redMul(this.a).redAdd(r),
                        n = this.c2.redMul(this.one.redAdd(this.d.redMul(t).redMul(r)));
                    return 0 === i.cmp(n)
                }, s(u, a.BasePoint), c.prototype.pointFromJSON = function (e) {
                    return u.fromJSON(this, e)
                }, c.prototype.point = function (e, t, r, i) {
                    return new u(this, e, t, r, i)
                }, u.fromJSON = function (e, t) {
                    return new u(e, t[0], t[1], t[2])
                }, u.prototype.inspect = function () {
                    return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">"
                }, u.prototype.isInfinity = function () {
                    return 0 === this.x.cmpn(0) && 0 === this.y.cmp(this.z)
                }, u.prototype._extDbl = function () {
                    var e = this.x.redSqr(), t = this.y.redSqr(), r = this.z.redSqr();
                    r = r.redIAdd(r);
                    var i = this.curve._mulA(e), n = this.x.redAdd(this.y).redSqr().redISub(e).redISub(t),
                        o = i.redAdd(t), s = o.redSub(r), a = i.redSub(t), f = n.redMul(s), c = o.redMul(a),
                        u = n.redMul(a), h = s.redMul(o);
                    return this.curve.point(f, c, h, u)
                }, u.prototype._projDbl = function () {
                    var e, t, r, i = this.x.redAdd(this.y).redSqr(), n = this.x.redSqr(), o = this.y.redSqr();
                    if (this.curve.twisted) {
                        var s = (c = this.curve._mulA(n)).redAdd(o);
                        if (this.zOne) e = i.redSub(n).redSub(o).redMul(s.redSub(this.curve.two)), t = s.redMul(c.redSub(o)), r = s.redSqr().redSub(s).redSub(s); else {
                            var a = this.z.redSqr(), f = s.redSub(a).redISub(a);
                            e = i.redSub(n).redISub(o).redMul(f), t = s.redMul(c.redSub(o)), r = s.redMul(f)
                        }
                    } else {
                        var c = n.redAdd(o);
                        a = this.curve._mulC(this.c.redMul(this.z)).redSqr(), f = c.redSub(a).redSub(a), e = this.curve._mulC(i.redISub(c)).redMul(f), t = this.curve._mulC(c).redMul(n.redISub(o)), r = c.redMul(f)
                    }
                    return this.curve.point(e, t, r)
                }, u.prototype.dbl = function () {
                    return this.isInfinity() ? this : this.curve.extended ? this._extDbl() : this._projDbl()
                }, u.prototype._extAdd = function (e) {
                    var t = this.y.redSub(this.x).redMul(e.y.redSub(e.x)),
                        r = this.y.redAdd(this.x).redMul(e.y.redAdd(e.x)), i = this.t.redMul(this.curve.dd).redMul(e.t),
                        n = this.z.redMul(e.z.redAdd(e.z)), o = r.redSub(t), s = n.redSub(i), a = n.redAdd(i),
                        f = r.redAdd(t), c = o.redMul(s), u = a.redMul(f), h = o.redMul(f), d = s.redMul(a);
                    return this.curve.point(c, u, d, h)
                }, u.prototype._projAdd = function (e) {
                    var t, r, i = this.z.redMul(e.z), n = i.redSqr(), o = this.x.redMul(e.x), s = this.y.redMul(e.y),
                        a = this.curve.d.redMul(o).redMul(s), f = n.redSub(a), c = n.redAdd(a),
                        u = this.x.redAdd(this.y).redMul(e.x.redAdd(e.y)).redISub(o).redISub(s),
                        h = i.redMul(f).redMul(u);
                    return this.curve.twisted ? (t = i.redMul(c).redMul(s.redSub(this.curve._mulA(o))), r = f.redMul(c)) : (t = i.redMul(c).redMul(s.redSub(o)), r = this.curve._mulC(f).redMul(c)), this.curve.point(h, t, r)
                }, u.prototype.add = function (e) {
                    return this.isInfinity() ? e : e.isInfinity() ? this : this.curve.extended ? this._extAdd(e) : this._projAdd(e)
                }, u.prototype.mul = function (e) {
                    return this._hasDoubles(e) ? this.curve._fixedNafMul(this, e) : this.curve._wnafMul(this, e)
                }, u.prototype.mulAdd = function (e, t, r) {
                    return this.curve._wnafMulAdd(1, [this, t], [e, r], 2, !1)
                }, u.prototype.jmulAdd = function (e, t, r) {
                    return this.curve._wnafMulAdd(1, [this, t], [e, r], 2, !0)
                }, u.prototype.normalize = function () {
                    if (this.zOne) return this;
                    var e = this.z.redInvm();
                    return this.x = this.x.redMul(e), this.y = this.y.redMul(e), this.t && (this.t = this.t.redMul(e)), this.z = this.curve.one, this.zOne = !0, this
                }, u.prototype.neg = function () {
                    return this.curve.point(this.x.redNeg(), this.y, this.z, this.t && this.t.redNeg())
                }, u.prototype.getX = function () {
                    return this.normalize(), this.x.fromRed()
                }, u.prototype.getY = function () {
                    return this.normalize(), this.y.fromRed()
                }, u.prototype.eq = function (e) {
                    return this === e || 0 === this.getX().cmp(e.getX()) && 0 === this.getY().cmp(e.getY())
                }, u.prototype.eqXToP = function (e) {
                    var t = e.toRed(this.curve.red).redMul(this.z);
                    if (0 === this.x.cmp(t)) return !0;
                    for (var r = e.clone(), i = this.curve.redN.redMul(this.z); ;) {
                        if (r.iadd(this.curve.n), r.cmp(this.curve.p) >= 0) return !1;
                        if (t.redIAdd(i), 0 === this.x.cmp(t)) return !0
                    }
                    return !1
                }, u.prototype.toP = u.prototype.normalize, u.prototype.mixedAdd = u.prototype.add
            }, function (e, t, r) {
                "use strict";
                var i, n = t, o = r(39), s = r(4), a = s.utils.assert;

                function f(e) {
                    "short" === e.type ? this.curve = new s.curve.short(e) : "edwards" === e.type ? this.curve = new s.curve.edwards(e) : this.curve = new s.curve.mont(e), this.g = this.curve.g, this.n = this.curve.n, this.hash = e.hash, a(this.g.validate(), "Invalid curve"), a(this.g.mul(this.n).isInfinity(), "Invalid curve, G*N != O")
                }

                function c(e, t) {
                    Object.defineProperty(n, e, {
                        configurable: !0, enumerable: !0, get: function () {
                            var r = new f(t);
                            return Object.defineProperty(n, e, {configurable: !0, enumerable: !0, value: r}), r
                        }
                    })
                }

                n.PresetCurve = f, c("p192", {
                    type: "short",
                    prime: "p192",
                    p: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff",
                    a: "ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc",
                    b: "64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1",
                    n: "ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831",
                    hash: o.sha256,
                    gRed: !1,
                    g: ["188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012", "07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811"]
                }), c("p224", {
                    type: "short",
                    prime: "p224",
                    p: "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001",
                    a: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe",
                    b: "b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4",
                    n: "ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d",
                    hash: o.sha256,
                    gRed: !1,
                    g: ["b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21", "bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34"]
                }), c("p256", {
                    type: "short",
                    prime: null,
                    p: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff",
                    a: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc",
                    b: "5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b",
                    n: "ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551",
                    hash: o.sha256,
                    gRed: !1,
                    g: ["6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296", "4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5"]
                }), c("p384", {
                    type: "short",
                    prime: null,
                    p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff",
                    a: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc",
                    b: "b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef",
                    n: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973",
                    hash: o.sha384,
                    gRed: !1,
                    g: ["aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7", "3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f"]
                }), c("p521", {
                    type: "short",
                    prime: null,
                    p: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff",
                    a: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc",
                    b: "00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00",
                    n: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409",
                    hash: o.sha512,
                    gRed: !1,
                    g: ["000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66", "00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650"]
                }), c("curve25519", {
                    type: "mont",
                    prime: "p25519",
                    p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
                    a: "76d06",
                    b: "1",
                    n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
                    hash: o.sha256,
                    gRed: !1,
                    g: ["9"]
                }), c("ed25519", {
                    type: "edwards",
                    prime: "p25519",
                    p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
                    a: "-1",
                    c: "1",
                    d: "52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3",
                    n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
                    hash: o.sha256,
                    gRed: !1,
                    g: ["216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a", "6666666666666666666666666666666666666666666666666666666666666658"]
                });
                try {
                    i = r(143)
                } catch (e) {
                    i = void 0
                }
                c("secp256k1", {
                    type: "short",
                    prime: "k256",
                    p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f",
                    a: "0",
                    b: "7",
                    n: "ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141",
                    h: "1",
                    hash: o.sha256,
                    beta: "7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee",
                    lambda: "5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72",
                    basis: [{
                        a: "3086d221a7d46bcde86c90e49284eb15",
                        b: "-e4437ed6010e88286f547fa90abfe4c3"
                    }, {a: "114ca50f7a8e2f3f657c1108d9d44cfd8", b: "3086d221a7d46bcde86c90e49284eb15"}],
                    gRed: !1,
                    g: ["79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8", i]
                })
            }, function (e, t, r) {
                "use strict";
                t.sha1 = r(138), t.sha224 = r(139), t.sha256 = r(64), t.sha384 = r(140), t.sha512 = r(65)
            }, function (e, t, r) {
                "use strict";
                var i = r(6), n = r(18), o = r(63), s = i.rotl32, a = i.sum32, f = i.sum32_5, c = o.ft_1,
                    u = n.BlockHash, h = [1518500249, 1859775393, 2400959708, 3395469782];

                function d() {
                    if (!(this instanceof d)) return new d;
                    u.call(this), this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.W = new Array(80)
                }

                i.inherits(d, u), e.exports = d, d.blockSize = 512, d.outSize = 160, d.hmacStrength = 80, d.padLength = 64, d.prototype._update = function (e, t) {
                    for (var r = this.W, i = 0; i < 16; i++) r[i] = e[t + i];
                    for (; i < r.length; i++) r[i] = s(r[i - 3] ^ r[i - 8] ^ r[i - 14] ^ r[i - 16], 1);
                    var n = this.h[0], o = this.h[1], u = this.h[2], d = this.h[3], l = this.h[4];
                    for (i = 0; i < r.length; i++) {
                        var p = ~~(i / 20), b = f(s(n, 5), c(p, o, u, d), l, r[i], h[p]);
                        l = d, d = u, u = s(o, 30), o = n, n = b
                    }
                    this.h[0] = a(this.h[0], n), this.h[1] = a(this.h[1], o), this.h[2] = a(this.h[2], u), this.h[3] = a(this.h[3], d), this.h[4] = a(this.h[4], l)
                }, d.prototype._digest = function (e) {
                    return "hex" === e ? i.toHex32(this.h, "big") : i.split32(this.h, "big")
                }
            }, function (e, t, r) {
                "use strict";
                var i = r(6), n = r(64);

                function o() {
                    if (!(this instanceof o)) return new o;
                    n.call(this), this.h = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428]
                }

                i.inherits(o, n), e.exports = o, o.blockSize = 512, o.outSize = 224, o.hmacStrength = 192, o.padLength = 64, o.prototype._digest = function (e) {
                    return "hex" === e ? i.toHex32(this.h.slice(0, 7), "big") : i.split32(this.h.slice(0, 7), "big")
                }
            }, function (e, t, r) {
                "use strict";
                var i = r(6), n = r(65);

                function o() {
                    if (!(this instanceof o)) return new o;
                    n.call(this), this.h = [3418070365, 3238371032, 1654270250, 914150663, 2438529370, 812702999, 355462360, 4144912697, 1731405415, 4290775857, 2394180231, 1750603025, 3675008525, 1694076839, 1203062813, 3204075428]
                }

                i.inherits(o, n), e.exports = o, o.blockSize = 1024, o.outSize = 384, o.hmacStrength = 192, o.padLength = 128, o.prototype._digest = function (e) {
                    return "hex" === e ? i.toHex32(this.h.slice(0, 12), "big") : i.split32(this.h.slice(0, 12), "big")
                }
            }, function (e, t, r) {
                "use strict";
                var i = r(6), n = r(18), o = i.rotl32, s = i.sum32, a = i.sum32_3, f = i.sum32_4, c = n.BlockHash;

                function u() {
                    if (!(this instanceof u)) return new u;
                    c.call(this), this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.endian = "little"
                }

                function h(e, t, r, i) {
                    return e <= 15 ? t ^ r ^ i : e <= 31 ? t & r | ~t & i : e <= 47 ? (t | ~r) ^ i : e <= 63 ? t & i | r & ~i : t ^ (r | ~i)
                }

                function d(e) {
                    return e <= 15 ? 0 : e <= 31 ? 1518500249 : e <= 47 ? 1859775393 : e <= 63 ? 2400959708 : 2840853838
                }

                function l(e) {
                    return e <= 15 ? 1352829926 : e <= 31 ? 1548603684 : e <= 47 ? 1836072691 : e <= 63 ? 2053994217 : 0
                }

                i.inherits(u, c), t.ripemd160 = u, u.blockSize = 512, u.outSize = 160, u.hmacStrength = 192, u.padLength = 64, u.prototype._update = function (e, t) {
                    for (var r = this.h[0], i = this.h[1], n = this.h[2], c = this.h[3], u = this.h[4], m = r, g = i, w = n, _ = c, S = u, k = 0; k < 80; k++) {
                        var A = s(o(f(r, h(k, i, n, c), e[p[k] + t], d(k)), y[k]), u);
                        r = u, u = c, c = o(n, 10), n = i, i = A, A = s(o(f(m, h(79 - k, g, w, _), e[b[k] + t], l(k)), v[k]), S), m = S, S = _, _ = o(w, 10), w = g, g = A
                    }
                    A = a(this.h[1], n, _), this.h[1] = a(this.h[2], c, S), this.h[2] = a(this.h[3], u, m), this.h[3] = a(this.h[4], r, g), this.h[4] = a(this.h[0], i, w), this.h[0] = A
                }, u.prototype._digest = function (e) {
                    return "hex" === e ? i.toHex32(this.h, "little") : i.split32(this.h, "little")
                };
                var p = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13],
                    b = [5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11],
                    y = [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6],
                    v = [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11]
            }, function (e, t, r) {
                "use strict";
                var i = r(6), n = r(5);

                function o(e, t, r) {
                    if (!(this instanceof o)) return new o(e, t, r);
                    this.Hash = e, this.blockSize = e.blockSize / 8, this.outSize = e.outSize / 8, this.inner = null, this.outer = null, this._init(i.toArray(t, r))
                }

                e.exports = o, o.prototype._init = function (e) {
                    e.length > this.blockSize && (e = (new this.Hash).update(e).digest()), n(e.length <= this.blockSize);
                    for (var t = e.length; t < this.blockSize; t++) e.push(0);
                    for (t = 0; t < e.length; t++) e[t] ^= 54;
                    for (this.inner = (new this.Hash).update(e), t = 0; t < e.length; t++) e[t] ^= 106;
                    this.outer = (new this.Hash).update(e)
                }, o.prototype.update = function (e, t) {
                    return this.inner.update(e, t), this
                }, o.prototype.digest = function (e) {
                    return this.outer.update(this.inner.digest()), this.outer.digest(e)
                }
            }, function (e, t) {
                e.exports = {
                    doubles: {
                        step: 4,
                        points: [["e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a", "f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821"], ["8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508", "11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf"], ["175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739", "d3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695"], ["363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640", "4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9"], ["8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c", "4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36"], ["723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda", "96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f"], ["eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa", "5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999"], ["100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0", "cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09"], ["e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d", "9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d"], ["feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d", "e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088"], ["da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1", "9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d"], ["53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0", "5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8"], ["8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047", "10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a"], ["385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862", "283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453"], ["6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7", "7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160"], ["3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd", "56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0"], ["85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83", "7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6"], ["948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a", "53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589"], ["6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8", "bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17"], ["e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d", "4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda"], ["e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725", "7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd"], ["213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754", "4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2"], ["4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c", "17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6"], ["fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6", "6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f"], ["76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39", "c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01"], ["c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891", "893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3"], ["d895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b", "febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f"], ["b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03", "2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7"], ["e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d", "eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78"], ["a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070", "7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1"], ["90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4", "e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150"], ["8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da", "662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82"], ["e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11", "1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc"], ["8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e", "efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b"], ["e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41", "2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51"], ["b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef", "67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45"], ["d68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8", "db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120"], ["324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d", "648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84"], ["4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96", "35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d"], ["9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd", "ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d"], ["6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5", "9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8"], ["a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266", "40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8"], ["7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71", "34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac"], ["928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac", "c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f"], ["85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751", "1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962"], ["ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e", "493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907"], ["827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241", "c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec"], ["eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3", "be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d"], ["e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f", "4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414"], ["1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19", "aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd"], ["146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be", "b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0"], ["fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9", "6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811"], ["da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2", "8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1"], ["a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13", "7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c"], ["174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c", "ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73"], ["959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba", "2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd"], ["d2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151", "e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405"], ["64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073", "d99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589"], ["8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458", "38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e"], ["13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b", "69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27"], ["bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366", "d3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1"], ["8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa", "40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482"], ["8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0", "620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945"], ["dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787", "7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573"], ["f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e", "ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82"]]
                    },
                    naf: {
                        wnd: 7,
                        points: [["f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9", "388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672"], ["2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4", "d8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6"], ["5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc", "6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da"], ["acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe", "cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37"], ["774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb", "d984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b"], ["f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8", "ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81"], ["d7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e", "581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58"], ["defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34", "4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77"], ["2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c", "85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a"], ["352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5", "321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c"], ["2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f", "2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67"], ["9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714", "73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402"], ["daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729", "a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55"], ["c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db", "2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482"], ["6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4", "e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82"], ["1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5", "b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396"], ["605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479", "2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49"], ["62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d", "80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf"], ["80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f", "1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a"], ["7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb", "d0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7"], ["d528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9", "eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933"], ["49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963", "758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a"], ["77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74", "958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6"], ["f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530", "e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37"], ["463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b", "5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e"], ["f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247", "cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6"], ["caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1", "cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476"], ["2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120", "4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40"], ["7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435", "91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61"], ["754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18", "673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683"], ["e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8", "59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5"], ["186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb", "3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b"], ["df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f", "55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417"], ["5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143", "efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868"], ["290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba", "e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a"], ["af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45", "f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6"], ["766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a", "744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996"], ["59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e", "c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e"], ["f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8", "e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d"], ["7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c", "30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2"], ["948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519", "e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e"], ["7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab", "100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437"], ["3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca", "ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311"], ["d3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf", "8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4"], ["1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610", "68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575"], ["733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4", "f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d"], ["15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c", "d56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d"], ["a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940", "edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629"], ["e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980", "a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06"], ["311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3", "66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374"], ["34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf", "9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee"], ["f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63", "4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1"], ["d7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448", "fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b"], ["32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf", "5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661"], ["7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5", "8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6"], ["ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6", "8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e"], ["16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5", "5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d"], ["eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99", "f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc"], ["78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51", "f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4"], ["494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5", "42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c"], ["a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5", "204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b"], ["c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997", "4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913"], ["841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881", "73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154"], ["5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5", "39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865"], ["36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66", "d2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc"], ["336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726", "ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224"], ["8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede", "6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e"], ["1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94", "60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6"], ["85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31", "3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511"], ["29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51", "b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b"], ["a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252", "ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2"], ["4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5", "cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c"], ["d24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b", "6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3"], ["ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4", "322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d"], ["af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f", "6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700"], ["e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889", "2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4"], ["591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246", "b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196"], ["11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984", "998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4"], ["3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a", "b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257"], ["cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030", "bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13"], ["c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197", "6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096"], ["c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593", "c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38"], ["a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef", "21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f"], ["347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38", "60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448"], ["da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a", "49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a"], ["c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111", "5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4"], ["4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502", "7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437"], ["3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea", "be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7"], ["cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26", "8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d"], ["b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986", "39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a"], ["d4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e", "62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54"], ["48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4", "25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77"], ["dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda", "ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517"], ["6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859", "cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10"], ["e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f", "f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125"], ["eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c", "6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e"], ["13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942", "fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1"], ["ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a", "1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2"], ["b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80", "5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423"], ["ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d", "438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8"], ["8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1", "cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758"], ["52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63", "c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375"], ["e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352", "6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d"], ["7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193", "ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec"], ["5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00", "9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0"], ["32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58", "ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c"], ["e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7", "d3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4"], ["8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8", "c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f"], ["4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e", "67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649"], ["3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d", "cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826"], ["674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b", "299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5"], ["d32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f", "f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87"], ["30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6", "462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b"], ["be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297", "62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc"], ["93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a", "7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c"], ["b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c", "ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f"], ["d5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52", "4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a"], ["d3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb", "bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46"], ["463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065", "bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f"], ["7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917", "603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03"], ["74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9", "cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08"], ["30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3", "553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8"], ["9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57", "712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373"], ["176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66", "ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3"], ["75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8", "9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8"], ["809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721", "9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1"], ["1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180", "4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9"]]
                    }
                }
            }, function (e, t, r) {
                "use strict";
                var i = r(2), n = r(145), o = r(4), s = o.utils.assert, a = r(146), f = r(147);

                function c(e) {
                    if (!(this instanceof c)) return new c(e);
                    "string" == typeof e && (s(o.curves.hasOwnProperty(e), "Unknown curve " + e), e = o.curves[e]), e instanceof o.curves.PresetCurve && (e = {curve: e}), this.curve = e.curve.curve, this.n = this.curve.n, this.nh = this.n.ushrn(1), this.g = this.curve.g, this.g = e.curve.g, this.g.precompute(e.curve.n.bitLength() + 1), this.hash = e.hash || e.curve.hash
                }

                e.exports = c, c.prototype.keyPair = function (e) {
                    return new a(this, e)
                }, c.prototype.keyFromPrivate = function (e, t) {
                    return a.fromPrivate(this, e, t)
                }, c.prototype.keyFromPublic = function (e, t) {
                    return a.fromPublic(this, e, t)
                }, c.prototype.genKeyPair = function (e) {
                    e || (e = {});
                    for (var t = new n({
                        hash: this.hash,
                        pers: e.pers,
                        persEnc: e.persEnc || "utf8",
                        entropy: e.entropy || o.rand(this.hash.hmacStrength),
                        entropyEnc: e.entropy && e.entropyEnc || "utf8",
                        nonce: this.n.toArray()
                    }), r = this.n.byteLength(), s = this.n.sub(new i(2)); ;) {
                        var a = new i(t.generate(r));
                        if (!(a.cmp(s) > 0)) return a.iaddn(1), this.keyFromPrivate(a)
                    }
                }, c.prototype._truncateToN = function (e, t) {
                    var r = 8 * e.byteLength() - this.n.bitLength();
                    return r > 0 && (e = e.ushrn(r)), !t && e.cmp(this.n) >= 0 ? e.sub(this.n) : e
                }, c.prototype.sign = function (e, t, r, o) {
                    "object" == typeof r && (o = r, r = null), o || (o = {}), t = this.keyFromPrivate(t, r), e = this._truncateToN(new i(e, 16));
                    for (var s = this.n.byteLength(), a = t.getPrivate().toArray("be", s), c = e.toArray("be", s), u = new n({
                        hash: this.hash,
                        entropy: a,
                        nonce: c,
                        pers: o.pers,
                        persEnc: o.persEnc || "utf8"
                    }), h = this.n.sub(new i(1)), d = 0; ; d++) {
                        var l = o.k ? o.k(d) : new i(u.generate(this.n.byteLength()));
                        if (!((l = this._truncateToN(l, !0)).cmpn(1) <= 0 || l.cmp(h) >= 0)) {
                            var p = this.g.mul(l);
                            if (!p.isInfinity()) {
                                var b = p.getX(), y = b.umod(this.n);
                                if (0 !== y.cmpn(0)) {
                                    var v = l.invm(this.n).mul(y.mul(t.getPrivate()).iadd(e));
                                    if (0 !== (v = v.umod(this.n)).cmpn(0)) {
                                        var m = (p.getY().isOdd() ? 1 : 0) | (0 !== b.cmp(y) ? 2 : 0);
                                        return o.canonical && v.cmp(this.nh) > 0 && (v = this.n.sub(v), m ^= 1), new f({
                                            r: y,
                                            s: v,
                                            recoveryParam: m
                                        })
                                    }
                                }
                            }
                        }
                    }
                }, c.prototype.verify = function (e, t, r, n) {
                    e = this._truncateToN(new i(e, 16)), r = this.keyFromPublic(r, n);
                    var o = (t = new f(t, "hex")).r, s = t.s;
                    if (o.cmpn(1) < 0 || o.cmp(this.n) >= 0) return !1;
                    if (s.cmpn(1) < 0 || s.cmp(this.n) >= 0) return !1;
                    var a, c = s.invm(this.n), u = c.mul(e).umod(this.n), h = c.mul(o).umod(this.n);
                    return this.curve._maxwellTrick ? !(a = this.g.jmulAdd(u, r.getPublic(), h)).isInfinity() && a.eqXToP(o) : !(a = this.g.mulAdd(u, r.getPublic(), h)).isInfinity() && 0 === a.getX().umod(this.n).cmp(o)
                }, c.prototype.recoverPubKey = function (e, t, r, n) {
                    s((3 & r) === r, "The recovery param is more than two bits"), t = new f(t, n);
                    var o = this.n, a = new i(e), c = t.r, u = t.s, h = 1 & r, d = r >> 1;
                    if (c.cmp(this.curve.p.umod(this.curve.n)) >= 0 && d) throw new Error("Unable to find sencond key candinate");
                    c = d ? this.curve.pointFromX(c.add(this.curve.n), h) : this.curve.pointFromX(c, h);
                    var l = t.r.invm(o), p = o.sub(a).mul(l).umod(o), b = u.mul(l).umod(o);
                    return this.g.mulAdd(p, c, b)
                }, c.prototype.getKeyRecoveryParam = function (e, t, r, i) {
                    if (null !== (t = new f(t, i)).recoveryParam) return t.recoveryParam;
                    for (var n = 0; n < 4; n++) {
                        var o;
                        try {
                            o = this.recoverPubKey(e, t, n)
                        } catch (e) {
                            continue
                        }
                        if (o.eq(r)) return n
                    }
                    throw new Error("Unable to find valid recovery factor")
                }
            }, function (e, t, r) {
                "use strict";
                var i = r(39), n = r(62), o = r(5);

                function s(e) {
                    if (!(this instanceof s)) return new s(e);
                    this.hash = e.hash, this.predResist = !!e.predResist, this.outLen = this.hash.outSize, this.minEntropy = e.minEntropy || this.hash.hmacStrength, this._reseed = null, this.reseedInterval = null, this.K = null, this.V = null;
                    var t = n.toArray(e.entropy, e.entropyEnc || "hex"), r = n.toArray(e.nonce, e.nonceEnc || "hex"),
                        i = n.toArray(e.pers, e.persEnc || "hex");
                    o(t.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits"), this._init(t, r, i)
                }

                e.exports = s, s.prototype._init = function (e, t, r) {
                    var i = e.concat(t).concat(r);
                    this.K = new Array(this.outLen / 8), this.V = new Array(this.outLen / 8);
                    for (var n = 0; n < this.V.length; n++) this.K[n] = 0, this.V[n] = 1;
                    this._update(i), this._reseed = 1, this.reseedInterval = 281474976710656
                }, s.prototype._hmac = function () {
                    return new i.hmac(this.hash, this.K)
                }, s.prototype._update = function (e) {
                    var t = this._hmac().update(this.V).update([0]);
                    e && (t = t.update(e)), this.K = t.digest(), this.V = this._hmac().update(this.V).digest(), e && (this.K = this._hmac().update(this.V).update([1]).update(e).digest(), this.V = this._hmac().update(this.V).digest())
                }, s.prototype.reseed = function (e, t, r, i) {
                    "string" != typeof t && (i = r, r = t, t = null), e = n.toArray(e, t), r = n.toArray(r, i), o(e.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits"), this._update(e.concat(r || [])), this._reseed = 1
                }, s.prototype.generate = function (e, t, r, i) {
                    if (this._reseed > this.reseedInterval) throw new Error("Reseed is required");
                    "string" != typeof t && (i = r, r = t, t = null), r && (r = n.toArray(r, i || "hex"), this._update(r));
                    for (var o = []; o.length < e;) this.V = this._hmac().update(this.V).digest(), o = o.concat(this.V);
                    var s = o.slice(0, e);
                    return this._update(r), this._reseed++, n.encode(s, t)
                }
            }, function (e, t, r) {
                "use strict";
                var i = r(2), n = r(4).utils.assert;

                function o(e, t) {
                    this.ec = e, this.priv = null, this.pub = null, t.priv && this._importPrivate(t.priv, t.privEnc), t.pub && this._importPublic(t.pub, t.pubEnc)
                }

                e.exports = o, o.fromPublic = function (e, t, r) {
                    return t instanceof o ? t : new o(e, {pub: t, pubEnc: r})
                }, o.fromPrivate = function (e, t, r) {
                    return t instanceof o ? t : new o(e, {priv: t, privEnc: r})
                }, o.prototype.validate = function () {
                    var e = this.getPublic();
                    return e.isInfinity() ? {
                        result: !1,
                        reason: "Invalid public key"
                    } : e.validate() ? e.mul(this.ec.curve.n).isInfinity() ? {result: !0, reason: null} : {
                        result: !1,
                        reason: "Public key * N != O"
                    } : {result: !1, reason: "Public key is not a point"}
                }, o.prototype.getPublic = function (e, t) {
                    return "string" == typeof e && (t = e, e = null), this.pub || (this.pub = this.ec.g.mul(this.priv)), t ? this.pub.encode(t, e) : this.pub
                }, o.prototype.getPrivate = function (e) {
                    return "hex" === e ? this.priv.toString(16, 2) : this.priv
                }, o.prototype._importPrivate = function (e, t) {
                    this.priv = new i(e, t || 16), this.priv = this.priv.umod(this.ec.curve.n)
                }, o.prototype._importPublic = function (e, t) {
                    if (e.x || e.y) return "mont" === this.ec.curve.type ? n(e.x, "Need x coordinate") : "short" !== this.ec.curve.type && "edwards" !== this.ec.curve.type || n(e.x && e.y, "Need both x and y coordinate"), void(this.pub = this.ec.curve.point(e.x, e.y));
                    this.pub = this.ec.curve.decodePoint(e, t)
                }, o.prototype.derive = function (e) {
                    return e.mul(this.priv).getX()
                }, o.prototype.sign = function (e, t, r) {
                    return this.ec.sign(e, this, t, r)
                }, o.prototype.verify = function (e, t) {
                    return this.ec.verify(e, t, this)
                }, o.prototype.inspect = function () {
                    return "<Key priv: " + (this.priv && this.priv.toString(16, 2)) + " pub: " + (this.pub && this.pub.inspect()) + " >"
                }
            }, function (e, t, r) {
                "use strict";
                var i = r(2), n = r(4).utils, o = n.assert;

                function s(e, t) {
                    if (e instanceof s) return e;
                    this._importDER(e, t) || (o(e.r && e.s, "Signature without r or s"), this.r = new i(e.r, 16), this.s = new i(e.s, 16), void 0 === e.recoveryParam ? this.recoveryParam = null : this.recoveryParam = e.recoveryParam)
                }

                function a(e, t) {
                    var r = e[t.place++];
                    if (!(128 & r)) return r;
                    for (var i = 15 & r, n = 0, o = 0, s = t.place; o < i; o++, s++) n <<= 8, n |= e[s];
                    return t.place = s, n
                }

                function f(e) {
                    for (var t = 0, r = e.length - 1; !e[t] && !(128 & e[t + 1]) && t < r;) t++;
                    return 0 === t ? e : e.slice(t)
                }

                function c(e, t) {
                    if (t < 128) e.push(t); else {
                        var r = 1 + (Math.log(t) / Math.LN2 >>> 3);
                        for (e.push(128 | r); --r;) e.push(t >>> (r << 3) & 255);
                        e.push(t)
                    }
                }

                e.exports = s, s.prototype._importDER = function (e, t) {
                    e = n.toArray(e, t);
                    var r = new function () {
                        this.place = 0
                    };
                    if (48 !== e[r.place++]) return !1;
                    if (a(e, r) + r.place !== e.length) return !1;
                    if (2 !== e[r.place++]) return !1;
                    var o = a(e, r), s = e.slice(r.place, o + r.place);
                    if (r.place += o, 2 !== e[r.place++]) return !1;
                    var f = a(e, r);
                    if (e.length !== f + r.place) return !1;
                    var c = e.slice(r.place, f + r.place);
                    return 0 === s[0] && 128 & s[1] && (s = s.slice(1)), 0 === c[0] && 128 & c[1] && (c = c.slice(1)), this.r = new i(s), this.s = new i(c), this.recoveryParam = null, !0
                }, s.prototype.toDER = function (e) {
                    var t = this.r.toArray(), r = this.s.toArray();
                    for (128 & t[0] && (t = [0].concat(t)), 128 & r[0] && (r = [0].concat(r)), t = f(t), r = f(r); !(r[0] || 128 & r[1]);) r = r.slice(1);
                    var i = [2];
                    c(i, t.length), (i = i.concat(t)).push(2), c(i, r.length);
                    var o = i.concat(r), s = [48];
                    return c(s, o.length), s = s.concat(o), n.encode(s, e)
                }
            }, function (e, t, r) {
                "use strict";
                var i = r(39), n = r(4), o = n.utils, s = o.assert, a = o.parseBytes, f = r(149), c = r(150);

                function u(e) {
                    if (s("ed25519" === e, "only tested with ed25519 so far"), !(this instanceof u)) return new u(e);
                    e = n.curves[e].curve, this.curve = e, this.g = e.g, this.g.precompute(e.n.bitLength() + 1), this.pointClass = e.point().constructor, this.encodingLength = Math.ceil(e.n.bitLength() / 8), this.hash = i.sha512
                }

                e.exports = u, u.prototype.sign = function (e, t) {
                    e = a(e);
                    var r = this.keyFromSecret(t), i = this.hashInt(r.messagePrefix(), e), n = this.g.mul(i),
                        o = this.encodePoint(n), s = this.hashInt(o, r.pubBytes(), e).mul(r.priv()),
                        f = i.add(s).umod(this.curve.n);
                    return this.makeSignature({R: n, S: f, Rencoded: o})
                }, u.prototype.verify = function (e, t, r) {
                    e = a(e), t = this.makeSignature(t);
                    var i = this.keyFromPublic(r), n = this.hashInt(t.Rencoded(), i.pubBytes(), e),
                        o = this.g.mul(t.S());
                    return t.R().add(i.pub().mul(n)).eq(o)
                }, u.prototype.hashInt = function () {
                    for (var e = this.hash(), t = 0; t < arguments.length; t++) e.update(arguments[t]);
                    return o.intFromLE(e.digest()).umod(this.curve.n)
                }, u.prototype.keyFromPublic = function (e) {
                    return f.fromPublic(this, e)
                }, u.prototype.keyFromSecret = function (e) {
                    return f.fromSecret(this, e)
                }, u.prototype.makeSignature = function (e) {
                    return e instanceof c ? e : new c(this, e)
                }, u.prototype.encodePoint = function (e) {
                    var t = e.getY().toArray("le", this.encodingLength);
                    return t[this.encodingLength - 1] |= e.getX().isOdd() ? 128 : 0, t
                }, u.prototype.decodePoint = function (e) {
                    var t = (e = o.parseBytes(e)).length - 1, r = e.slice(0, t).concat(-129 & e[t]),
                        i = 0 != (128 & e[t]), n = o.intFromLE(r);
                    return this.curve.pointFromY(n, i)
                }, u.prototype.encodeInt = function (e) {
                    return e.toArray("le", this.encodingLength)
                }, u.prototype.decodeInt = function (e) {
                    return o.intFromLE(e)
                }, u.prototype.isPoint = function (e) {
                    return e instanceof this.pointClass
                }
            }, function (e, t, r) {
                "use strict";
                var i = r(4).utils, n = i.assert, o = i.parseBytes, s = i.cachedProperty;

                function a(e, t) {
                    this.eddsa = e, this._secret = o(t.secret), e.isPoint(t.pub) ? this._pub = t.pub : this._pubBytes = o(t.pub)
                }

                a.fromPublic = function (e, t) {
                    return t instanceof a ? t : new a(e, {pub: t})
                }, a.fromSecret = function (e, t) {
                    return t instanceof a ? t : new a(e, {secret: t})
                }, a.prototype.secret = function () {
                    return this._secret
                }, s(a, "pubBytes", function () {
                    return this.eddsa.encodePoint(this.pub())
                }), s(a, "pub", function () {
                    return this._pubBytes ? this.eddsa.decodePoint(this._pubBytes) : this.eddsa.g.mul(this.priv())
                }), s(a, "privBytes", function () {
                    var e = this.eddsa, t = this.hash(), r = e.encodingLength - 1, i = t.slice(0, e.encodingLength);
                    return i[0] &= 248, i[r] &= 127, i[r] |= 64, i
                }), s(a, "priv", function () {
                    return this.eddsa.decodeInt(this.privBytes())
                }), s(a, "hash", function () {
                    return this.eddsa.hash().update(this.secret()).digest()
                }), s(a, "messagePrefix", function () {
                    return this.hash().slice(this.eddsa.encodingLength)
                }), a.prototype.sign = function (e) {
                    return n(this._secret, "KeyPair can only verify"), this.eddsa.sign(e, this)
                }, a.prototype.verify = function (e, t) {
                    return this.eddsa.verify(e, t, this)
                }, a.prototype.getSecret = function (e) {
                    return n(this._secret, "KeyPair is public only"), i.encode(this.secret(), e)
                }, a.prototype.getPublic = function (e) {
                    return i.encode(this.pubBytes(), e)
                }, e.exports = a
            }, function (e, t, r) {
                "use strict";
                var i = r(2), n = r(4).utils, o = n.assert, s = n.cachedProperty, a = n.parseBytes;

                function f(e, t) {
                    this.eddsa = e, "object" != typeof t && (t = a(t)), Array.isArray(t) && (t = {
                        R: t.slice(0, e.encodingLength),
                        S: t.slice(e.encodingLength)
                    }), o(t.R && t.S, "Signature without R or S"), e.isPoint(t.R) && (this._R = t.R), t.S instanceof i && (this._S = t.S), this._Rencoded = Array.isArray(t.R) ? t.R : t.Rencoded, this._Sencoded = Array.isArray(t.S) ? t.S : t.Sencoded
                }

                s(f, "S", function () {
                    return this.eddsa.decodeInt(this.Sencoded())
                }), s(f, "R", function () {
                    return this.eddsa.decodePoint(this.Rencoded())
                }), s(f, "Rencoded", function () {
                    return this.eddsa.encodePoint(this.R())
                }), s(f, "Sencoded", function () {
                    return this.eddsa.encodeInt(this.S())
                }), f.prototype.toBytes = function () {
                    return this.Rencoded().concat(this.Sencoded())
                }, f.prototype.toHex = function () {
                    return n.encode(this.toBytes(), "hex").toUpperCase()
                }, e.exports = f
            }, function (e, t, r) {
                "use strict";
                var i = r(19);
                t.certificate = r(162);
                var n = i.define("RSAPrivateKey", function () {
                    this.seq().obj(this.key("version").int(), this.key("modulus").int(), this.key("publicExponent").int(), this.key("privateExponent").int(), this.key("prime1").int(), this.key("prime2").int(), this.key("exponent1").int(), this.key("exponent2").int(), this.key("coefficient").int())
                });
                t.RSAPrivateKey = n;
                var o = i.define("RSAPublicKey", function () {
                    this.seq().obj(this.key("modulus").int(), this.key("publicExponent").int())
                });
                t.RSAPublicKey = o;
                var s = i.define("SubjectPublicKeyInfo", function () {
                    this.seq().obj(this.key("algorithm").use(a), this.key("subjectPublicKey").bitstr())
                });
                t.PublicKey = s;
                var a = i.define("AlgorithmIdentifier", function () {
                    this.seq().obj(this.key("algorithm").objid(), this.key("none").null_().optional(), this.key("curve").objid().optional(), this.key("params").seq().obj(this.key("p").int(), this.key("q").int(), this.key("g").int()).optional())
                }), f = i.define("PrivateKeyInfo", function () {
                    this.seq().obj(this.key("version").int(), this.key("algorithm").use(a), this.key("subjectPrivateKey").octstr())
                });
                t.PrivateKey = f;
                var c = i.define("EncryptedPrivateKeyInfo", function () {
                    this.seq().obj(this.key("algorithm").seq().obj(this.key("id").objid(), this.key("decrypt").seq().obj(this.key("kde").seq().obj(this.key("id").objid(), this.key("kdeparams").seq().obj(this.key("salt").octstr(), this.key("iters").int())), this.key("cipher").seq().obj(this.key("algo").objid(), this.key("iv").octstr()))), this.key("subjectPrivateKey").octstr())
                });
                t.EncryptedPrivateKey = c;
                var u = i.define("DSAPrivateKey", function () {
                    this.seq().obj(this.key("version").int(), this.key("p").int(), this.key("q").int(), this.key("g").int(), this.key("pub_key").int(), this.key("priv_key").int())
                });
                t.DSAPrivateKey = u, t.DSAparam = i.define("DSAparam", function () {
                    this.int()
                });
                var h = i.define("ECPrivateKey", function () {
                    this.seq().obj(this.key("version").int(), this.key("privateKey").octstr(), this.key("parameters").optional().explicit(0).use(d), this.key("publicKey").optional().explicit(1).bitstr())
                });
                t.ECPrivateKey = h;
                var d = i.define("ECParameters", function () {
                    this.choice({namedCurve: this.objid()})
                });
                t.signature = i.define("signature", function () {
                    this.seq().obj(this.key("r").int(), this.key("s").int())
                })
            }, function (e, t, r) {
                var i = r(19), n = r(0);

                function o(e, t) {
                    this.name = e, this.body = t, this.decoders = {}, this.encoders = {}
                }

                t.define = function (e, t) {
                    return new o(e, t)
                }, o.prototype._createNamed = function (e) {
                    var t;
                    try {
                        t = r(153).runInThisContext("(function " + this.name + "(entity) {\n  this._initNamed(entity);\n})")
                    } catch (e) {
                        t = function (e) {
                            this._initNamed(e)
                        }
                    }
                    return n(t, e), t.prototype._initNamed = function (t) {
                        e.call(this, t)
                    }, new t(this)
                }, o.prototype._getDecoder = function (e) {
                    return e = e || "der", this.decoders.hasOwnProperty(e) || (this.decoders[e] = this._createNamed(i.decoders[e])), this.decoders[e]
                }, o.prototype.decode = function (e, t, r) {
                    return this._getDecoder(t).decode(e, r)
                }, o.prototype._getEncoder = function (e) {
                    return e = e || "der", this.encoders.hasOwnProperty(e) || (this.encoders[e] = this._createNamed(i.encoders[e])), this.encoders[e]
                }, o.prototype.encode = function (e, t, r) {
                    return this._getEncoder(t).encode(e, r)
                }
            }, function (module, exports, __webpack_require__) {
                var indexOf = __webpack_require__(154), Object_keys = function (e) {
                        if (Object.keys) return Object.keys(e);
                        var t = [];
                        for (var r in e) t.push(r);
                        return t
                    }, forEach = function (e, t) {
                        if (e.forEach) return e.forEach(t);
                        for (var r = 0; r < e.length; r++) t(e[r], r, e)
                    }, defineProp = function () {
                        try {
                            return Object.defineProperty({}, "_", {}), function (e, t, r) {
                                Object.defineProperty(e, t, {writable: !0, enumerable: !1, configurable: !0, value: r})
                            }
                        } catch (e) {
                            return function (e, t, r) {
                                e[t] = r
                            }
                        }
                    }(),
                    globals = ["Array", "Boolean", "Date", "Error", "EvalError", "Function", "Infinity", "JSON", "Math", "NaN", "Number", "Object", "RangeError", "ReferenceError", "RegExp", "String", "SyntaxError", "TypeError", "URIError", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "undefined", "unescape"];

                function Context() {
                }

                Context.prototype = {};
                var Script = exports.Script = function (e) {
                    if (!(this instanceof Script)) return new Script(e);
                    this.code = e
                };
                Script.prototype.runInContext = function (e) {
                    if (!(e instanceof Context)) throw new TypeError("needs a 'context' argument.");
                    var t = document.createElement("iframe");
                    t.style || (t.style = {}), t.style.display = "none", document.body.appendChild(t);
                    var r = t.contentWindow, i = r.eval, n = r.execScript;
                    !i && n && (n.call(r, "null"), i = r.eval), forEach(Object_keys(e), function (t) {
                        r[t] = e[t]
                    }), forEach(globals, function (t) {
                        e[t] && (r[t] = e[t])
                    });
                    var o = Object_keys(r), s = i.call(r, this.code);
                    return forEach(Object_keys(r), function (t) {
                        (t in e || -1 === indexOf(o, t)) && (e[t] = r[t])
                    }), forEach(globals, function (t) {
                        t in e || defineProp(e, t, r[t])
                    }), document.body.removeChild(t), s
                }, Script.prototype.runInThisContext = function () {
                    return eval(this.code)
                }, Script.prototype.runInNewContext = function (e) {
                    var t = Script.createContext(e), r = this.runInContext(t);
                    return forEach(Object_keys(t), function (r) {
                        e[r] = t[r]
                    }), r
                }, forEach(Object_keys(Script.prototype), function (e) {
                    exports[e] = Script[e] = function (t) {
                        var r = Script(t);
                        return r[e].apply(r, [].slice.call(arguments, 1))
                    }
                }), exports.createScript = function (e) {
                    return exports.Script(e)
                }, exports.createContext = Script.createContext = function (e) {
                    var t = new Context;
                    return "object" == typeof e && forEach(Object_keys(e), function (r) {
                        t[r] = e[r]
                    }), t
                }
            }, function (e, t) {
                var r = [].indexOf;
                e.exports = function (e, t) {
                    if (r) return e.indexOf(t);
                    for (var i = 0; i < e.length; ++i) if (e[i] === t) return i;
                    return -1
                }
            }, function (e, t, r) {
                var i = r(0);

                function n(e) {
                    this._reporterState = {obj: null, path: [], options: e || {}, errors: []}
                }

                function o(e, t) {
                    this.path = e, this.rethrow(t)
                }

                t.Reporter = n, n.prototype.isError = function (e) {
                    return e instanceof o
                }, n.prototype.save = function () {
                    var e = this._reporterState;
                    return {obj: e.obj, pathLen: e.path.length}
                }, n.prototype.restore = function (e) {
                    var t = this._reporterState;
                    t.obj = e.obj, t.path = t.path.slice(0, e.pathLen)
                }, n.prototype.enterKey = function (e) {
                    return this._reporterState.path.push(e)
                }, n.prototype.exitKey = function (e) {
                    var t = this._reporterState;
                    t.path = t.path.slice(0, e - 1)
                }, n.prototype.leaveKey = function (e, t, r) {
                    var i = this._reporterState;
                    this.exitKey(e), null !== i.obj && (i.obj[t] = r)
                }, n.prototype.path = function () {
                    return this._reporterState.path.join("/")
                }, n.prototype.enterObject = function () {
                    var e = this._reporterState, t = e.obj;
                    return e.obj = {}, t
                }, n.prototype.leaveObject = function (e) {
                    var t = this._reporterState, r = t.obj;
                    return t.obj = e, r
                }, n.prototype.error = function (e) {
                    var t, r = this._reporterState, i = e instanceof o;
                    if (t = i ? e : new o(r.path.map(function (e) {
                            return "[" + JSON.stringify(e) + "]"
                        }).join(""), e.message || e, e.stack), !r.options.partial) throw t;
                    return i || r.errors.push(t), t
                }, n.prototype.wrapResult = function (e) {
                    var t = this._reporterState;
                    return t.options.partial ? {result: this.isError(e) ? null : e, errors: t.errors} : e
                }, i(o, Error), o.prototype.rethrow = function (e) {
                    if (this.message = e + " at: " + (this.path || "(shallow)"), Error.captureStackTrace && Error.captureStackTrace(this, o), !this.stack) try {
                        throw new Error(this.message)
                    } catch (e) {
                        this.stack = e.stack
                    }
                    return this
                }
            }, function (e, t, r) {
                var i = r(20).Reporter, n = r(20).EncoderBuffer, o = r(20).DecoderBuffer, s = r(5),
                    a = ["seq", "seqof", "set", "setof", "objid", "bool", "gentime", "utctime", "null_", "enum", "int", "objDesc", "bitstr", "bmpstr", "charstr", "genstr", "graphstr", "ia5str", "iso646str", "numstr", "octstr", "printstr", "t61str", "unistr", "utf8str", "videostr"],
                    f = ["key", "obj", "use", "optional", "explicit", "implicit", "def", "choice", "any", "contains"].concat(a);

                function c(e, t) {
                    var r = {};
                    this._baseState = r, r.enc = e, r.parent = t || null, r.children = null, r.tag = null, r.args = null, r.reverseArgs = null, r.choice = null, r.optional = !1, r.any = !1, r.obj = !1, r.use = null, r.useDecoder = null, r.key = null, r.default = null, r.explicit = null, r.implicit = null, r.contains = null, r.parent || (r.children = [], this._wrap())
                }

                e.exports = c;
                var u = ["enc", "parent", "children", "tag", "args", "reverseArgs", "choice", "optional", "any", "obj", "use", "alteredUse", "key", "default", "explicit", "implicit", "contains"];
                c.prototype.clone = function () {
                    var e = this._baseState, t = {};
                    u.forEach(function (r) {
                        t[r] = e[r]
                    });
                    var r = new this.constructor(t.parent);
                    return r._baseState = t, r
                }, c.prototype._wrap = function () {
                    var e = this._baseState;
                    f.forEach(function (t) {
                        this[t] = function () {
                            var r = new this.constructor(this);
                            return e.children.push(r), r[t].apply(r, arguments)
                        }
                    }, this)
                }, c.prototype._init = function (e) {
                    var t = this._baseState;
                    s(null === t.parent), e.call(this), t.children = t.children.filter(function (e) {
                        return e._baseState.parent === this
                    }, this), s.equal(t.children.length, 1, "Root node can have only one child")
                }, c.prototype._useArgs = function (e) {
                    var t = this._baseState, r = e.filter(function (e) {
                        return e instanceof this.constructor
                    }, this);
                    e = e.filter(function (e) {
                        return !(e instanceof this.constructor)
                    }, this), 0 !== r.length && (s(null === t.children), t.children = r, r.forEach(function (e) {
                        e._baseState.parent = this
                    }, this)), 0 !== e.length && (s(null === t.args), t.args = e, t.reverseArgs = e.map(function (e) {
                        if ("object" != typeof e || e.constructor !== Object) return e;
                        var t = {};
                        return Object.keys(e).forEach(function (r) {
                            r == (0 | r) && (r |= 0);
                            var i = e[r];
                            t[i] = r
                        }), t
                    }))
                }, ["_peekTag", "_decodeTag", "_use", "_decodeStr", "_decodeObjid", "_decodeTime", "_decodeNull", "_decodeInt", "_decodeBool", "_decodeList", "_encodeComposite", "_encodeStr", "_encodeObjid", "_encodeTime", "_encodeNull", "_encodeInt", "_encodeBool"].forEach(function (e) {
                    c.prototype[e] = function () {
                        var t = this._baseState;
                        throw new Error(e + " not implemented for encoding: " + t.enc)
                    }
                }), a.forEach(function (e) {
                    c.prototype[e] = function () {
                        var t = this._baseState, r = Array.prototype.slice.call(arguments);
                        return s(null === t.tag), t.tag = e, this._useArgs(r), this
                    }
                }), c.prototype.use = function (e) {
                    s(e);
                    var t = this._baseState;
                    return s(null === t.use), t.use = e, this
                }, c.prototype.optional = function () {
                    return this._baseState.optional = !0, this
                }, c.prototype.def = function (e) {
                    var t = this._baseState;
                    return s(null === t.default), t.default = e, t.optional = !0, this
                }, c.prototype.explicit = function (e) {
                    var t = this._baseState;
                    return s(null === t.explicit && null === t.implicit), t.explicit = e, this
                }, c.prototype.implicit = function (e) {
                    var t = this._baseState;
                    return s(null === t.explicit && null === t.implicit), t.implicit = e, this
                }, c.prototype.obj = function () {
                    var e = this._baseState, t = Array.prototype.slice.call(arguments);
                    return e.obj = !0, 0 !== t.length && this._useArgs(t), this
                }, c.prototype.key = function (e) {
                    var t = this._baseState;
                    return s(null === t.key), t.key = e, this
                }, c.prototype.any = function () {
                    return this._baseState.any = !0, this
                }, c.prototype.choice = function (e) {
                    var t = this._baseState;
                    return s(null === t.choice), t.choice = e, this._useArgs(Object.keys(e).map(function (t) {
                        return e[t]
                    })), this
                }, c.prototype.contains = function (e) {
                    var t = this._baseState;
                    return s(null === t.use), t.contains = e, this
                }, c.prototype._decode = function (e, t) {
                    var r = this._baseState;
                    if (null === r.parent) return e.wrapResult(r.children[0]._decode(e, t));
                    var i, n = r.default, s = !0, a = null;
                    if (null !== r.key && (a = e.enterKey(r.key)), r.optional) {
                        var f = null;
                        if (null !== r.explicit ? f = r.explicit : null !== r.implicit ? f = r.implicit : null !== r.tag && (f = r.tag), null !== f || r.any) {
                            if (s = this._peekTag(e, f, r.any), e.isError(s)) return s
                        } else {
                            var c = e.save();
                            try {
                                null === r.choice ? this._decodeGeneric(r.tag, e, t) : this._decodeChoice(e, t), s = !0
                            } catch (e) {
                                s = !1
                            }
                            e.restore(c)
                        }
                    }
                    if (r.obj && s && (i = e.enterObject()), s) {
                        if (null !== r.explicit) {
                            var u = this._decodeTag(e, r.explicit);
                            if (e.isError(u)) return u;
                            e = u
                        }
                        var h = e.offset;
                        if (null === r.use && null === r.choice) {
                            r.any && (c = e.save());
                            var d = this._decodeTag(e, null !== r.implicit ? r.implicit : r.tag, r.any);
                            if (e.isError(d)) return d;
                            r.any ? n = e.raw(c) : e = d
                        }
                        if (t && t.track && null !== r.tag && t.track(e.path(), h, e.length, "tagged"), t && t.track && null !== r.tag && t.track(e.path(), e.offset, e.length, "content"), n = r.any ? n : null === r.choice ? this._decodeGeneric(r.tag, e, t) : this._decodeChoice(e, t), e.isError(n)) return n;
                        if (r.any || null !== r.choice || null === r.children || r.children.forEach(function (r) {
                                r._decode(e, t)
                            }), r.contains && ("octstr" === r.tag || "bitstr" === r.tag)) {
                            var l = new o(n);
                            n = this._getUse(r.contains, e._reporterState.obj)._decode(l, t)
                        }
                    }
                    return r.obj && s && (n = e.leaveObject(i)), null === r.key || null === n && !0 !== s ? null !== a && e.exitKey(a) : e.leaveKey(a, r.key, n), n
                }, c.prototype._decodeGeneric = function (e, t, r) {
                    var i = this._baseState;
                    return "seq" === e || "set" === e ? null : "seqof" === e || "setof" === e ? this._decodeList(t, e, i.args[0], r) : /str$/.test(e) ? this._decodeStr(t, e, r) : "objid" === e && i.args ? this._decodeObjid(t, i.args[0], i.args[1], r) : "objid" === e ? this._decodeObjid(t, null, null, r) : "gentime" === e || "utctime" === e ? this._decodeTime(t, e, r) : "null_" === e ? this._decodeNull(t, r) : "bool" === e ? this._decodeBool(t, r) : "objDesc" === e ? this._decodeStr(t, e, r) : "int" === e || "enum" === e ? this._decodeInt(t, i.args && i.args[0], r) : null !== i.use ? this._getUse(i.use, t._reporterState.obj)._decode(t, r) : t.error("unknown tag: " + e)
                }, c.prototype._getUse = function (e, t) {
                    var r = this._baseState;
                    return r.useDecoder = this._use(e, t), s(null === r.useDecoder._baseState.parent), r.useDecoder = r.useDecoder._baseState.children[0], r.implicit !== r.useDecoder._baseState.implicit && (r.useDecoder = r.useDecoder.clone(), r.useDecoder._baseState.implicit = r.implicit), r.useDecoder
                }, c.prototype._decodeChoice = function (e, t) {
                    var r = this._baseState, i = null, n = !1;
                    return Object.keys(r.choice).some(function (o) {
                        var s = e.save(), a = r.choice[o];
                        try {
                            var f = a._decode(e, t);
                            if (e.isError(f)) return !1;
                            i = {type: o, value: f}, n = !0
                        } catch (t) {
                            return e.restore(s), !1
                        }
                        return !0
                    }, this), n ? i : e.error("Choice not matched")
                }, c.prototype._createEncoderBuffer = function (e) {
                    return new n(e, this.reporter)
                }, c.prototype._encode = function (e, t, r) {
                    var i = this._baseState;
                    if (null === i.default || i.default !== e) {
                        var n = this._encodeValue(e, t, r);
                        if (void 0 !== n && !this._skipDefault(n, t, r)) return n
                    }
                }, c.prototype._encodeValue = function (e, t, r) {
                    var n = this._baseState;
                    if (null === n.parent) return n.children[0]._encode(e, t || new i);
                    var o = null;
                    if (this.reporter = t, n.optional && void 0 === e) {
                        if (null === n.default) return;
                        e = n.default
                    }
                    var s = null, a = !1;
                    if (n.any) o = this._createEncoderBuffer(e); else if (n.choice) o = this._encodeChoice(e, t); else if (n.contains) s = this._getUse(n.contains, r)._encode(e, t), a = !0; else if (n.children) s = n.children.map(function (r) {
                        if ("null_" === r._baseState.tag) return r._encode(null, t, e);
                        if (null === r._baseState.key) return t.error("Child should have a key");
                        var i = t.enterKey(r._baseState.key);
                        if ("object" != typeof e) return t.error("Child expected, but input is not object");
                        var n = r._encode(e[r._baseState.key], t, e);
                        return t.leaveKey(i), n
                    }, this).filter(function (e) {
                        return e
                    }), s = this._createEncoderBuffer(s); else if ("seqof" === n.tag || "setof" === n.tag) {
                        if (!n.args || 1 !== n.args.length) return t.error("Too many args for : " + n.tag);
                        if (!Array.isArray(e)) return t.error("seqof/setof, but data is not Array");
                        var f = this.clone();
                        f._baseState.implicit = null, s = this._createEncoderBuffer(e.map(function (r) {
                            var i = this._baseState;
                            return this._getUse(i.args[0], e)._encode(r, t)
                        }, f))
                    } else null !== n.use ? o = this._getUse(n.use, r)._encode(e, t) : (s = this._encodePrimitive(n.tag, e), a = !0);
                    if (!n.any && null === n.choice) {
                        var c = null !== n.implicit ? n.implicit : n.tag,
                            u = null === n.implicit ? "universal" : "context";
                        null === c ? null === n.use && t.error("Tag could be omitted only for .use()") : null === n.use && (o = this._encodeComposite(c, a, u, s))
                    }
                    return null !== n.explicit && (o = this._encodeComposite(n.explicit, !1, "context", o)), o
                }, c.prototype._encodeChoice = function (e, t) {
                    var r = this._baseState, i = r.choice[e.type];
                    return i || s(!1, e.type + " not found in " + JSON.stringify(Object.keys(r.choice))), i._encode(e.value, t)
                }, c.prototype._encodePrimitive = function (e, t) {
                    var r = this._baseState;
                    if (/str$/.test(e)) return this._encodeStr(t, e);
                    if ("objid" === e && r.args) return this._encodeObjid(t, r.reverseArgs[0], r.args[1]);
                    if ("objid" === e) return this._encodeObjid(t, null, null);
                    if ("gentime" === e || "utctime" === e) return this._encodeTime(t, e);
                    if ("null_" === e) return this._encodeNull();
                    if ("int" === e || "enum" === e) return this._encodeInt(t, r.args && r.reverseArgs[0]);
                    if ("bool" === e) return this._encodeBool(t);
                    if ("objDesc" === e) return this._encodeStr(t, e);
                    throw new Error("Unsupported tag: " + e)
                }, c.prototype._isNumstr = function (e) {
                    return /^[0-9 ]*$/.test(e)
                }, c.prototype._isPrintstr = function (e) {
                    return /^[A-Za-z0-9 '\(\)\+,\-\.\/:=\?]*$/.test(e)
                }
            }, function (e, t, r) {
                var i = r(67);
                t.tagClass = {
                    0: "universal",
                    1: "application",
                    2: "context",
                    3: "private"
                }, t.tagClassByName = i._reverse(t.tagClass), t.tag = {
                    0: "end",
                    1: "bool",
                    2: "int",
                    3: "bitstr",
                    4: "octstr",
                    5: "null_",
                    6: "objid",
                    7: "objDesc",
                    8: "external",
                    9: "real",
                    10: "enum",
                    11: "embed",
                    12: "utf8str",
                    13: "relativeOid",
                    16: "seq",
                    17: "set",
                    18: "numstr",
                    19: "printstr",
                    20: "t61str",
                    21: "videostr",
                    22: "ia5str",
                    23: "utctime",
                    24: "gentime",
                    25: "graphstr",
                    26: "iso646str",
                    27: "genstr",
                    28: "unistr",
                    29: "charstr",
                    30: "bmpstr"
                }, t.tagByName = i._reverse(t.tag)
            }, function (e, t, r) {
                var i = t;
                i.der = r(68), i.pem = r(159)
            }, function (e, t, r) {
                var i = r(0), n = r(3).Buffer, o = r(68);

                function s(e) {
                    o.call(this, e), this.enc = "pem"
                }

                i(s, o), e.exports = s, s.prototype.decode = function (e, t) {
                    for (var r = e.toString().split(/[\r\n]+/g), i = t.label.toUpperCase(), s = /^-----(BEGIN|END) ([^-]+)-----$/, a = -1, f = -1, c = 0; c < r.length; c++) {
                        var u = r[c].match(s);
                        if (null !== u && u[2] === i) {
                            if (-1 !== a) {
                                if ("END" !== u[1]) break;
                                f = c;
                                break
                            }
                            if ("BEGIN" !== u[1]) break;
                            a = c
                        }
                    }
                    if (-1 === a || -1 === f) throw new Error("PEM section not found for: " + i);
                    var h = r.slice(a + 1, f).join("");
                    h.replace(/[^a-z0-9\+\/=]+/gi, "");
                    var d = new n(h, "base64");
                    return o.prototype.decode.call(this, d, t)
                }
            }, function (e, t, r) {
                var i = t;
                i.der = r(69), i.pem = r(161)
            }, function (e, t, r) {
                var i = r(0), n = r(69);

                function o(e) {
                    n.call(this, e), this.enc = "pem"
                }

                i(o, n), e.exports = o, o.prototype.encode = function (e, t) {
                    for (var r = n.prototype.encode.call(this, e).toString("base64"), i = ["-----BEGIN " + t.label + "-----"], o = 0; o < r.length; o += 64) i.push(r.slice(o, o + 64));
                    return i.push("-----END " + t.label + "-----"), i.join("\n")
                }
            }, function (e, t, r) {
                "use strict";
                var i = r(19), n = i.define("Time", function () {
                    this.choice({utcTime: this.utctime(), generalTime: this.gentime()})
                }), o = i.define("AttributeTypeValue", function () {
                    this.seq().obj(this.key("type").objid(), this.key("value").any())
                }), s = i.define("AlgorithmIdentifier", function () {
                    this.seq().obj(this.key("algorithm").objid(), this.key("parameters").optional())
                }), a = i.define("SubjectPublicKeyInfo", function () {
                    this.seq().obj(this.key("algorithm").use(s), this.key("subjectPublicKey").bitstr())
                }), f = i.define("RelativeDistinguishedName", function () {
                    this.setof(o)
                }), c = i.define("RDNSequence", function () {
                    this.seqof(f)
                }), u = i.define("Name", function () {
                    this.choice({rdnSequence: this.use(c)})
                }), h = i.define("Validity", function () {
                    this.seq().obj(this.key("notBefore").use(n), this.key("notAfter").use(n))
                }), d = i.define("Extension", function () {
                    this.seq().obj(this.key("extnID").objid(), this.key("critical").bool().def(!1), this.key("extnValue").octstr())
                }), l = i.define("TBSCertificate", function () {
                    this.seq().obj(this.key("version").explicit(0).int(), this.key("serialNumber").int(), this.key("signature").use(s), this.key("issuer").use(u), this.key("validity").use(h), this.key("subject").use(u), this.key("subjectPublicKeyInfo").use(a), this.key("issuerUniqueID").implicit(1).bitstr().optional(), this.key("subjectUniqueID").implicit(2).bitstr().optional(), this.key("extensions").explicit(3).seqof(d).optional())
                }), p = i.define("X509Certificate", function () {
                    this.seq().obj(this.key("tbsCertificate").use(l), this.key("signatureAlgorithm").use(s), this.key("signatureValue").bitstr())
                });
                e.exports = p
            }, function (e, t) {
                e.exports = {
                    "2.16.840.1.101.3.4.1.1": "aes-128-ecb",
                    "2.16.840.1.101.3.4.1.2": "aes-128-cbc",
                    "2.16.840.1.101.3.4.1.3": "aes-128-ofb",
                    "2.16.840.1.101.3.4.1.4": "aes-128-cfb",
                    "2.16.840.1.101.3.4.1.21": "aes-192-ecb",
                    "2.16.840.1.101.3.4.1.22": "aes-192-cbc",
                    "2.16.840.1.101.3.4.1.23": "aes-192-ofb",
                    "2.16.840.1.101.3.4.1.24": "aes-192-cfb",
                    "2.16.840.1.101.3.4.1.41": "aes-256-ecb",
                    "2.16.840.1.101.3.4.1.42": "aes-256-cbc",
                    "2.16.840.1.101.3.4.1.43": "aes-256-ofb",
                    "2.16.840.1.101.3.4.1.44": "aes-256-cfb"
                }
            }, function (e, t, r) {
                (function (t) {
                    var i = /Proc-Type: 4,ENCRYPTED\n\r?DEK-Info: AES-((?:128)|(?:192)|(?:256))-CBC,([0-9A-H]+)\n\r?\n\r?([0-9A-z\n\r\+\/\=]+)\n\r?/m,
                        n = /^-----BEGIN ((?:.* KEY)|CERTIFICATE)-----\n/m,
                        o = /^-----BEGIN ((?:.* KEY)|CERTIFICATE)-----\n\r?([0-9A-z\n\r\+\/\=]+)\n\r?-----END \1-----$/m,
                        s = r(23), a = r(35);
                    e.exports = function (e, r) {
                        var f, c = e.toString(), u = c.match(i);
                        if (u) {
                            var h = "aes" + u[1], d = new t(u[2], "hex"),
                                l = new t(u[3].replace(/\r?\n/g, ""), "base64"),
                                p = s(r, d.slice(0, 8), parseInt(u[1], 10)).key, b = [],
                                y = a.createDecipheriv(h, p, d);
                            b.push(y.update(l)), b.push(y.final()), f = t.concat(b)
                        } else {
                            var v = c.match(o);
                            f = new t(v[2].replace(/\r?\n/g, ""), "base64")
                        }
                        return {tag: c.match(n)[1], data: f}
                    }
                }).call(t, r(3).Buffer)
            }, function (e, t, r) {
                (function (t) {
                    var i = r(2), n = r(4).ec, o = r(26), s = r(70);

                    function a(e, t) {
                        if (e.cmpn(0) <= 0) throw new Error("invalid sig");
                        if (e.cmp(t) >= t) throw new Error("invalid sig")
                    }

                    e.exports = function (e, r, f, c, u) {
                        var h = o(f);
                        if ("ec" === h.type) {
                            if ("ecdsa" !== c && "ecdsa/rsa" !== c) throw new Error("wrong public key type");
                            return function (e, t, r) {
                                var i = s[r.data.algorithm.curve.join(".")];
                                if (!i) throw new Error("unknown curve " + r.data.algorithm.curve.join("."));
                                var o = new n(i), a = r.data.subjectPrivateKey.data;
                                return o.verify(t, e, a)
                            }(e, r, h)
                        }
                        if ("dsa" === h.type) {
                            if ("dsa" !== c) throw new Error("wrong public key type");
                            return function (e, t, r) {
                                var n = r.data.p, s = r.data.q, f = r.data.g, c = r.data.pub_key,
                                    u = o.signature.decode(e, "der"), h = u.s, d = u.r;
                                a(h, s), a(d, s);
                                var l = i.mont(n), p = h.invm(s);
                                return 0 === f.toRed(l).redPow(new i(t).mul(p).mod(s)).fromRed().mul(c.toRed(l).redPow(d.mul(p).mod(s)).fromRed()).mod(n).mod(s).cmp(d)
                            }(e, r, h)
                        }
                        if ("rsa" !== c && "ecdsa/rsa" !== c) throw new Error("wrong public key type");
                        r = t.concat([u, r]);
                        for (var d = h.modulus.byteLength(), l = [1], p = 0; r.length + l.length + 2 < d;) l.push(255), p++;
                        l.push(0);
                        for (var b = -1; ++b < r.length;) l.push(r[b]);
                        l = new t(l);
                        var y = i.mont(h.modulus);
                        e = (e = new i(e).toRed(y)).redPow(new i(h.publicExponent)), e = new t(e.fromRed().toArray());
                        var v = p < 8 ? 1 : 0;
                        for (d = Math.min(e.length, l.length), e.length !== l.length && (v = 1), b = -1; ++b < d;) v |= e[b] ^ l[b];
                        return 0 === v
                    }
                }).call(t, r(3).Buffer)
            }, function (e, t, r) {
                (function (t) {
                    var i = r(4), n = r(2);
                    e.exports = function (e) {
                        return new s(e)
                    };
                    var o = {
                        secp256k1: {name: "secp256k1", byteLength: 32},
                        secp224r1: {name: "p224", byteLength: 28},
                        prime256v1: {name: "p256", byteLength: 32},
                        prime192v1: {name: "p192", byteLength: 24},
                        ed25519: {name: "ed25519", byteLength: 32},
                        secp384r1: {name: "p384", byteLength: 48},
                        secp521r1: {name: "p521", byteLength: 66}
                    };

                    function s(e) {
                        this.curveType = o[e], this.curveType || (this.curveType = {name: e}), this.curve = new i.ec(this.curveType.name), this.keys = void 0
                    }

                    function a(e, r, i) {
                        Array.isArray(e) || (e = e.toArray());
                        var n = new t(e);
                        if (i && n.length < i) {
                            var o = new t(i - n.length);
                            o.fill(0), n = t.concat([o, n])
                        }
                        return r ? n.toString(r) : n
                    }

                    o.p224 = o.secp224r1, o.p256 = o.secp256r1 = o.prime256v1, o.p192 = o.secp192r1 = o.prime192v1, o.p384 = o.secp384r1, o.p521 = o.secp521r1, s.prototype.generateKeys = function (e, t) {
                        return this.keys = this.curve.genKeyPair(), this.getPublicKey(e, t)
                    }, s.prototype.computeSecret = function (e, r, i) {
                        return r = r || "utf8", t.isBuffer(e) || (e = new t(e, r)), a(this.curve.keyFromPublic(e).getPublic().mul(this.keys.getPrivate()).getX(), i, this.curveType.byteLength)
                    }, s.prototype.getPublicKey = function (e, t) {
                        var r = this.keys.getPublic("compressed" === t, !0);
                        return "hybrid" === t && (r[r.length - 1] % 2 ? r[0] = 7 : r[0] = 6), a(r, e)
                    }, s.prototype.getPrivateKey = function (e) {
                        return a(this.keys.getPrivate(), e)
                    }, s.prototype.setPublicKey = function (e, r) {
                        return r = r || "utf8", t.isBuffer(e) || (e = new t(e, r)), this.keys._importPublic(e), this
                    }, s.prototype.setPrivateKey = function (e, r) {
                        r = r || "utf8", t.isBuffer(e) || (e = new t(e, r));
                        var i = new n(e);
                        return i = i.toString(16), this.keys._importPrivate(i), this
                    }
                }).call(t, r(3).Buffer)
            }, function (e, t, r) {
                t.publicEncrypt = r(168), t.privateDecrypt = r(169), t.privateEncrypt = function (e, r) {
                    return t.publicEncrypt(e, r, !0)
                }, t.publicDecrypt = function (e, r) {
                    return t.privateDecrypt(e, r, !0)
                }
            }, function (e, t, r) {
                (function (t) {
                    var i = r(26), n = r(13), o = r(15), s = r(71), a = r(72), f = r(2), c = r(73), u = r(38);
                    e.exports = function (e, r, h) {
                        var d;
                        d = e.padding ? e.padding : h ? 1 : 4;
                        var l, p = i(e);
                        if (4 === d) l = function (e, r) {
                            var i = e.modulus.byteLength(), c = r.length, u = o("sha1").update(new t("")).digest(),
                                h = u.length, d = 2 * h;
                            if (c > i - d - 2) throw new Error("message too long");
                            var l = new t(i - c - d - 2);
                            l.fill(0);
                            var p = i - h - 1, b = n(h), y = a(t.concat([u, l, new t([1]), r], p), s(b, p)),
                                v = a(b, s(y, h));
                            return new f(t.concat([new t([0]), v, y], i))
                        }(p, r); else if (1 === d) l = function (e, r, i) {
                            var o, s = r.length, a = e.modulus.byteLength();
                            if (s > a - 11) throw new Error("message too long");
                            return i ? (o = new t(a - s - 3)).fill(255) : o = function (e, r) {
                                for (var i, o = new t(e), s = 0, a = n(2 * e), f = 0; s < e;) f === a.length && (a = n(2 * e), f = 0), (i = a[f++]) && (o[s++] = i);
                                return o
                            }(a - s - 3), new f(t.concat([new t([0, i ? 1 : 2]), o, new t([0]), r], a))
                        }(p, r, h); else {
                            if (3 !== d) throw new Error("unknown padding");
                            if ((l = new f(r)).cmp(p.modulus) >= 0) throw new Error("data too long for modulus")
                        }
                        return h ? u(l, p) : c(l, p)
                    }
                }).call(t, r(3).Buffer)
            }, function (e, t, r) {
                (function (t) {
                    var i = r(26), n = r(71), o = r(72), s = r(2), a = r(38), f = r(15), c = r(73);
                    e.exports = function (e, r, u) {
                        var h;
                        h = e.padding ? e.padding : u ? 1 : 4;
                        var d, l = i(e), p = l.modulus.byteLength();
                        if (r.length > p || new s(r).cmp(l.modulus) >= 0) throw new Error("decryption error");
                        d = u ? c(new s(r), l) : a(r, l);
                        var b = new t(p - d.length);
                        if (b.fill(0), d = t.concat([b, d], p), 4 === h) return function (e, r) {
                            e.modulus;
                            var i = e.modulus.byteLength(), s = (r.length, f("sha1").update(new t("")).digest()),
                                a = s.length;
                            if (0 !== r[0]) throw new Error("decryption error");
                            var c = r.slice(1, a + 1), u = r.slice(a + 1), h = o(c, n(u, a)), d = o(u, n(h, i - a - 1));
                            if (function (e, r) {
                                    e = new t(e), r = new t(r);
                                    var i = 0, n = e.length;
                                    e.length !== r.length && (i++, n = Math.min(e.length, r.length));
                                    for (var o = -1; ++o < n;) i += e[o] ^ r[o];
                                    return i
                                }(s, d.slice(0, a))) throw new Error("decryption error");
                            for (var l = a; 0 === d[l];) l++;
                            if (1 !== d[l++]) throw new Error("decryption error");
                            return d.slice(l)
                        }(l, d);
                        if (1 === h) return function (e, t, r) {
                            for (var i = t.slice(0, 2), n = 2, o = 0; 0 !== t[n++];) if (n >= t.length) {
                                o++;
                                break
                            }
                            var s = t.slice(2, n - 1);
                            if (t.slice(n - 1, n), ("0002" !== i.toString("hex") && !r || "0001" !== i.toString("hex") && r) && o++, s.length < 8 && o++, o) throw new Error("decryption error");
                            return t.slice(n)
                        }(0, d, u);
                        if (3 === h) return d;
                        throw new Error("unknown padding")
                    }
                }).call(t, r(3).Buffer)
            }, function (e, t, r) {
                "use strict";
                (function (e, i) {
                    function n() {
                        throw new Error("secure random number generation not supported by this browser\nuse chrome, FireFox or Internet Explorer 11")
                    }

                    var o = r(1), s = r(13), a = o.Buffer, f = o.kMaxLength, c = e.crypto || e.msCrypto,
                        u = Math.pow(2, 32) - 1;

                    function h(e, t) {
                        if ("number" != typeof e || e != e) throw new TypeError("offset must be a number");
                        if (e > u || e < 0) throw new TypeError("offset must be a uint32");
                        if (e > f || e > t) throw new RangeError("offset out of range")
                    }

                    function d(e, t, r) {
                        if ("number" != typeof e || e != e) throw new TypeError("size must be a number");
                        if (e > u || e < 0) throw new TypeError("size must be a uint32");
                        if (e + t > r || e > f) throw new RangeError("buffer too small")
                    }

                    function l(e, t, r, n) {
                        if (i.browser) {
                            var o = e.buffer, a = new Uint8Array(o, t, r);
                            return c.getRandomValues(a), n ? void i.nextTick(function () {
                                n(null, e)
                            }) : e
                        }
                        if (!n) return s(r).copy(e, t), e;
                        s(r, function (r, i) {
                            if (r) return n(r);
                            i.copy(e, t), n(null, e)
                        })
                    }

                    c && c.getRandomValues || !i.browser ? (t.randomFill = function (t, r, i, n) {
                        if (!(a.isBuffer(t) || t instanceof e.Uint8Array)) throw new TypeError('"buf" argument must be a Buffer or Uint8Array');
                        if ("function" == typeof r) n = r, r = 0, i = t.length; else if ("function" == typeof i) n = i, i = t.length - r; else if ("function" != typeof n) throw new TypeError('"cb" argument must be a function');
                        return h(r, t.length), d(i, r, t.length), l(t, r, i, n)
                    }, t.randomFillSync = function (t, r, i) {
                        if (void 0 === r && (r = 0), !(a.isBuffer(t) || t instanceof e.Uint8Array)) throw new TypeError('"buf" argument must be a Buffer or Uint8Array');
                        return h(r, t.length), void 0 === i && (i = t.length - r), d(i, r, t.length), l(t, r, i)
                    }) : (t.randomFill = n, t.randomFillSync = n)
                }).call(t, r(7), r(8))
            }, function (e, t, r) {
                "use strict";
                const i = r(2);
                e.exports = {
                    p256: {
                        name: "P256",
                        bitSize: 256,
                        p: new i("ffffffffffffffffffffffff00000000000000000000000001000000ffffffff", 16, "le"),
                        a: new i("fcffffffffffffffffffffff00000000000000000000000001000000ffffffff", 16, "le"),
                        b: new i("4b60d2273e3cce3bf6b053ccb0061d65bc86987655bdebb3e7933aaad835c65a", 16, "le"),
                        n: new i("512563fcc2cab9f3849e17a7adfae6bcffffffffffffffff00000000ffffffff", 16, "le"),
                        gx: new i("96c298d84539a1f4a033eb2d817d0377f240a463e5e6bcf847422ce1f2d1176b", 16, "le"),
                        gy: new i("f551bf376840b6cbce5e316b5733ce2b169e0f7c4aebe78e9b7f1afee242e34f", 16, "le")
                    }
                }
            }, function (e, t, r) {
                "use strict";
                const i = r(173), n = r(77), o = r(40);
                e.exports = {Curve: i, Point: n, Scalar: o}
            }, function (e, t, r) {
                "use strict";
                const i = r(40), n = r(77), o = r(11), s = new (0, r(4).eddsa)("ed25519"), a = r(2).red(s.curve.n),
                    f = r(10);
                e.exports = class extends f.Group {
                    constructor() {
                        super(), this.curve = s.curve, this.orderRed = a
                    }

                    string() {
                        return "Ed25519"
                    }

                    scalarLen() {
                        return 32
                    }

                    scalar() {
                        return new i(this, this.orderRed)
                    }

                    pointLen() {
                        return 32
                    }

                    point() {
                        return new n(this)
                    }

                    newKey() {
                        let e = o.randomBytes(32), t = o.createHash("sha512");
                        t.update(e);
                        let r = Uint8Array.from(t.digest());
                        return r[0] &= 248, r[31] &= 63, r[31] &= 64, this.scalar().setBytes(r)
                    }
                }
            }, function (e, t, r) {
                "use strict";
                const i = r(175);
                e.exports = {schnorr: i}
            }, function (e, t, r) {
                const i = r(10), n = r(11);

                function o(e, ...t) {
                    const r = n.createHash("sha512");
                    for (let e of t) r.update(e);
                    const i = e.scalar();
                    return i.setBytes(Uint8Array.from(r.digest())), i
                }

                e.exports.sign = function (e, t, r) {
                    if (!(e instanceof i.Group)) throw"first argument must be a suite";
                    if (!(t instanceof i.Scalar)) throw"second argument must be a scalar";
                    if (r.constructor !== Uint8Array) throw"third argument must be Uint8Array";
                    const n = e.scalar().pick(), s = e.point().mul(n, null).marshalBinary(),
                        a = o(e, s, e.point().mul(t, null).marshalBinary(), r), f = e.scalar().mul(t, a);
                    f.add(f, n);
                    const c = f.marshalBinary(), u = new Uint8Array(s.length + c.length);
                    return u.set(s), u.set(c, s.length), u
                }, e.exports.verify = function (e, t, r, n) {
                    if (!(e instanceof i.Group)) throw"first argument must be a suite";
                    if (!(t instanceof i.Point)) throw"second argument must be a point";
                    if (r.constructor !== Uint8Array) throw"third argument must be a Uint8Array";
                    if (n.constructor !== Uint8Array) throw"fourth argument must be a Uint8Array";
                    const s = e.pointLen(), a = s + e.scalarLen();
                    if (n.length != a) return !1;
                    const f = n.slice(0, s), c = e.point();
                    c.unmarshalBinary(f);
                    const u = n.slice(s, n.lengh), h = e.scalar();
                    h.unmarshalBinary(u);
                    const d = o(e, f, t.marshalBinary(), r), l = e.point().mul(h, null), p = e.point().mul(d, t);
                    return p.add(p, c), !!p.equal(l)
                }, e.exports.hashSchnorr = o
            }])
        }, module.exports = t()
    }, function (e, t, r) {
        "use strict";
        const i = r(38);
        e.exports = i
    }, function (e, t, r) {
        "use strict";
        const i = r(21), n = r(18), o = r(20), s = r(68), a = r(19);
        e.exports = {
            net: i,
            misc: o,
            skipchain: s,
            protobuf: n
        }, e.exports.Roster = a.Roster, e.exports.ServerIdentity = a.ServerIdentity
    }, function (e, t, r) {
        "use strict";
        r(22), r(23);
        const i = r(24), n = r(17), o = r(60), s = r(64), a = r(18).root;
        r(19);

        function f(e, t) {
            if ("object" != typeof i) throw new TypeError;
            this.url = e + "/" + t, this.protobuf = a, this.send = ((e, t, r) => new Promise((i, n) => {
                const o = this.url + "/" + e;
                console.log("net.Socket: new WebSocket(" + o + ")");
                const a = new s(this.url + "/" + e);
                a.binaryType = "arraybuffer";
                const f = this.protobuf.lookup(e);
                void 0 === f && n(new Error("Model " + e + " not found"));
                const c = this.protobuf.lookup(t);
                void 0 === c && n(new Error("Model " + t + " not found")), a.onopen = (() => {
                    const e = f.create(r), t = f.encode(e).finish();
                    a.send(t)
                }), a.onmessage = (e => {
                    a.close();
                    const t = new Uint8Array(e.data), r = c.decode(t);
                    i(r)
                }), a.onclose = (e => {
                    e.wasClean || n(new Error(e.reason))
                }), a.onerror = (e => {
                    n(new Error("could not connect to " + this.url + ":" + e))
                })
            }))
        }

        e.exports.Socket = f, e.exports.RosterSocket = class {
            constructor(e, t) {
                this.addresses = e.identities.map(e => e.websocketAddr), this.service = t, this.lastGoodServer = null
            }

            send(e, t, r) {
                return n.wrap(function* (r, i, n, s) {
                    e = r, t = i, n = n;
                    var a = s.addresses, c = s.service;
                    o(a), s.lastGoodServer && a.unshift(s.lastGoodServer);
                    for (var u = 0; u < a.length; u++) {
                        var h = a[u];
                        try {
                            return s = new f(h, c), console.log("RosterSocket: trying out " + h + "/" + c), n = yield s.send(e, t, n), s.lastGoodServer = h, Promise.resolve(n)
                        } catch (e) {
                            console.log("rostersocket: " + e);
                            continue
                        }
                    }
                    return Promise.reject("no conodes are available")
                })(e, t, r, this)
            }
        }
    }, function (e, t, r) {
        "use strict";
        (function (e) {
            var i = r(41), n = r(42), o = r(43);

            function s() {
                return f.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823
            }

            function a(e, t) {
                if (s() < t) throw new RangeError("Invalid typed array length");
                return f.TYPED_ARRAY_SUPPORT ? (e = new Uint8Array(t)).__proto__ = f.prototype : (null === e && (e = new f(t)), e.length = t), e
            }

            function f(e, t, r) {
                if (!(f.TYPED_ARRAY_SUPPORT || this instanceof f)) return new f(e, t, r);
                if ("number" == typeof e) {
                    if ("string" == typeof t) throw new Error("If encoding is specified then the first argument must be a string");
                    return h(this, e)
                }
                return c(this, e, t, r)
            }

            function c(e, t, r, i) {
                if ("number" == typeof t) throw new TypeError('"value" argument must not be a number');
                return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer ? function (e, t, r, i) {
                    if (t.byteLength, r < 0 || t.byteLength < r) throw new RangeError("'offset' is out of bounds");
                    if (t.byteLength < r + (i || 0)) throw new RangeError("'length' is out of bounds");
                    t = void 0 === r && void 0 === i ? new Uint8Array(t) : void 0 === i ? new Uint8Array(t, r) : new Uint8Array(t, r, i);
                    f.TYPED_ARRAY_SUPPORT ? (e = t).__proto__ = f.prototype : e = d(e, t);
                    return e
                }(e, t, r, i) : "string" == typeof t ? function (e, t, r) {
                    "string" == typeof r && "" !== r || (r = "utf8");
                    if (!f.isEncoding(r)) throw new TypeError('"encoding" must be a valid string encoding');
                    var i = 0 | p(t, r), n = (e = a(e, i)).write(t, r);
                    n !== i && (e = e.slice(0, n));
                    return e
                }(e, t, r) : function (e, t) {
                    if (f.isBuffer(t)) {
                        var r = 0 | l(t.length);
                        return 0 === (e = a(e, r)).length ? e : (t.copy(e, 0, 0, r), e)
                    }
                    if (t) {
                        if ("undefined" != typeof ArrayBuffer && t.buffer instanceof ArrayBuffer || "length" in t) return "number" != typeof t.length || (i = t.length) != i ? a(e, 0) : d(e, t);
                        if ("Buffer" === t.type && o(t.data)) return d(e, t.data)
                    }
                    var i;
                    throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")
                }(e, t)
            }

            function u(e) {
                if ("number" != typeof e) throw new TypeError('"size" argument must be a number');
                if (e < 0) throw new RangeError('"size" argument must not be negative')
            }

            function h(e, t) {
                if (u(t), e = a(e, t < 0 ? 0 : 0 | l(t)), !f.TYPED_ARRAY_SUPPORT) for (var r = 0; r < t; ++r) e[r] = 0;
                return e
            }

            function d(e, t) {
                var r = t.length < 0 ? 0 : 0 | l(t.length);
                e = a(e, r);
                for (var i = 0; i < r; i += 1) e[i] = 255 & t[i];
                return e
            }

            function l(e) {
                if (e >= s()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + s().toString(16) + " bytes");
                return 0 | e
            }

            function p(e, t) {
                if (f.isBuffer(e)) return e.length;
                if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)) return e.byteLength;
                "string" != typeof e && (e = "" + e);
                var r = e.length;
                if (0 === r) return 0;
                for (var i = !1; ;) switch (t) {
                    case"ascii":
                    case"latin1":
                    case"binary":
                        return r;
                    case"utf8":
                    case"utf-8":
                    case void 0:
                        return L(e).length;
                    case"ucs2":
                    case"ucs-2":
                    case"utf16le":
                    case"utf-16le":
                        return 2 * r;
                    case"hex":
                        return r >>> 1;
                    case"base64":
                        return z(e).length;
                    default:
                        if (i) return L(e).length;
                        t = ("" + t).toLowerCase(), i = !0
                }
            }

            function b(e, t, r) {
                var i = e[t];
                e[t] = e[r], e[r] = i
            }

            function y(e, t, r, i, n) {
                if (0 === e.length) return -1;
                if ("string" == typeof r ? (i = r, r = 0) : r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648), r = +r, isNaN(r) && (r = n ? 0 : e.length - 1), r < 0 && (r = e.length + r), r >= e.length) {
                    if (n) return -1;
                    r = e.length - 1
                } else if (r < 0) {
                    if (!n) return -1;
                    r = 0
                }
                if ("string" == typeof t && (t = f.from(t, i)), f.isBuffer(t)) return 0 === t.length ? -1 : v(e, t, r, i, n);
                if ("number" == typeof t) return t &= 255, f.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? n ? Uint8Array.prototype.indexOf.call(e, t, r) : Uint8Array.prototype.lastIndexOf.call(e, t, r) : v(e, [t], r, i, n);
                throw new TypeError("val must be string, number or Buffer")
            }

            function v(e, t, r, i, n) {
                var o, s = 1, a = e.length, f = t.length;
                if (void 0 !== i && ("ucs2" === (i = String(i).toLowerCase()) || "ucs-2" === i || "utf16le" === i || "utf-16le" === i)) {
                    if (e.length < 2 || t.length < 2) return -1;
                    s = 2, a /= 2, f /= 2, r /= 2
                }

                function c(e, t) {
                    return 1 === s ? e[t] : e.readUInt16BE(t * s)
                }

                if (n) {
                    var u = -1;
                    for (o = r; o < a; o++) if (c(e, o) === c(t, -1 === u ? 0 : o - u)) {
                        if (-1 === u && (u = o), o - u + 1 === f) return u * s
                    } else -1 !== u && (o -= o - u), u = -1
                } else for (r + f > a && (r = a - f), o = r; o >= 0; o--) {
                    for (var h = !0, d = 0; d < f; d++) if (c(e, o + d) !== c(t, d)) {
                        h = !1;
                        break
                    }
                    if (h) return o
                }
                return -1
            }

            function m(e, t, r, i) {
                r = Number(r) || 0;
                var n = e.length - r;
                i ? (i = Number(i)) > n && (i = n) : i = n;
                var o = t.length;
                if (o % 2 != 0) throw new TypeError("Invalid hex string");
                i > o / 2 && (i = o / 2);
                for (var s = 0; s < i; ++s) {
                    var a = parseInt(t.substr(2 * s, 2), 16);
                    if (isNaN(a)) return s;
                    e[r + s] = a
                }
                return s
            }

            function g(e, t, r, i) {
                return F(L(t, e.length - r), e, r, i)
            }

            function w(e, t, r, i) {
                return F(function (e) {
                    for (var t = [], r = 0; r < e.length; ++r) t.push(255 & e.charCodeAt(r));
                    return t
                }(t), e, r, i)
            }

            function _(e, t, r, i) {
                return w(e, t, r, i)
            }

            function S(e, t, r, i) {
                return F(z(t), e, r, i)
            }

            function k(e, t, r, i) {
                return F(function (e, t) {
                    for (var r, i, n, o = [], s = 0; s < e.length && !((t -= 2) < 0); ++s) r = e.charCodeAt(s), i = r >> 8, n = r % 256, o.push(n), o.push(i);
                    return o
                }(t, e.length - r), e, r, i)
            }

            function A(e, t, r) {
                return 0 === t && r === e.length ? i.fromByteArray(e) : i.fromByteArray(e.slice(t, r))
            }

            function E(e, t, r) {
                r = Math.min(e.length, r);
                for (var i = [], n = t; n < r;) {
                    var o, s, a, f, c = e[n], u = null, h = c > 239 ? 4 : c > 223 ? 3 : c > 191 ? 2 : 1;
                    if (n + h <= r) switch (h) {
                        case 1:
                            c < 128 && (u = c);
                            break;
                        case 2:
                            128 == (192 & (o = e[n + 1])) && (f = (31 & c) << 6 | 63 & o) > 127 && (u = f);
                            break;
                        case 3:
                            o = e[n + 1], s = e[n + 2], 128 == (192 & o) && 128 == (192 & s) && (f = (15 & c) << 12 | (63 & o) << 6 | 63 & s) > 2047 && (f < 55296 || f > 57343) && (u = f);
                            break;
                        case 4:
                            o = e[n + 1], s = e[n + 2], a = e[n + 3], 128 == (192 & o) && 128 == (192 & s) && 128 == (192 & a) && (f = (15 & c) << 18 | (63 & o) << 12 | (63 & s) << 6 | 63 & a) > 65535 && f < 1114112 && (u = f)
                    }
                    null === u ? (u = 65533, h = 1) : u > 65535 && (u -= 65536, i.push(u >>> 10 & 1023 | 55296), u = 56320 | 1023 & u), i.push(u), n += h
                }
                return function (e) {
                    var t = e.length;
                    if (t <= x) return String.fromCharCode.apply(String, e);
                    var r = "", i = 0;
                    for (; i < t;) r += String.fromCharCode.apply(String, e.slice(i, i += x));
                    return r
                }(i)
            }

            t.Buffer = f, t.SlowBuffer = function (e) {
                +e != e && (e = 0);
                return f.alloc(+e)
            }, t.INSPECT_MAX_BYTES = 50, f.TYPED_ARRAY_SUPPORT = void 0 !== e.TYPED_ARRAY_SUPPORT ? e.TYPED_ARRAY_SUPPORT : function () {
                try {
                    var e = new Uint8Array(1);
                    return e.__proto__ = {
                        __proto__: Uint8Array.prototype, foo: function () {
                            return 42
                        }
                    }, 42 === e.foo() && "function" == typeof e.subarray && 0 === e.subarray(1, 1).byteLength
                } catch (e) {
                    return !1
                }
            }(), t.kMaxLength = s(), f.poolSize = 8192, f._augment = function (e) {
                return e.__proto__ = f.prototype, e
            }, f.from = function (e, t, r) {
                return c(null, e, t, r)
            }, f.TYPED_ARRAY_SUPPORT && (f.prototype.__proto__ = Uint8Array.prototype, f.__proto__ = Uint8Array, "undefined" != typeof Symbol && Symbol.species && f[Symbol.species] === f && Object.defineProperty(f, Symbol.species, {
                value: null,
                configurable: !0
            })), f.alloc = function (e, t, r) {
                return function (e, t, r, i) {
                    return u(t), t <= 0 ? a(e, t) : void 0 !== r ? "string" == typeof i ? a(e, t).fill(r, i) : a(e, t).fill(r) : a(e, t)
                }(null, e, t, r)
            }, f.allocUnsafe = function (e) {
                return h(null, e)
            }, f.allocUnsafeSlow = function (e) {
                return h(null, e)
            }, f.isBuffer = function (e) {
                return !(null == e || !e._isBuffer)
            }, f.compare = function (e, t) {
                if (!f.isBuffer(e) || !f.isBuffer(t)) throw new TypeError("Arguments must be Buffers");
                if (e === t) return 0;
                for (var r = e.length, i = t.length, n = 0, o = Math.min(r, i); n < o; ++n) if (e[n] !== t[n]) {
                    r = e[n], i = t[n];
                    break
                }
                return r < i ? -1 : i < r ? 1 : 0
            }, f.isEncoding = function (e) {
                switch (String(e).toLowerCase()) {
                    case"hex":
                    case"utf8":
                    case"utf-8":
                    case"ascii":
                    case"latin1":
                    case"binary":
                    case"base64":
                    case"ucs2":
                    case"ucs-2":
                    case"utf16le":
                    case"utf-16le":
                        return !0;
                    default:
                        return !1
                }
            }, f.concat = function (e, t) {
                if (!o(e)) throw new TypeError('"list" argument must be an Array of Buffers');
                if (0 === e.length) return f.alloc(0);
                var r;
                if (void 0 === t) for (t = 0, r = 0; r < e.length; ++r) t += e[r].length;
                var i = f.allocUnsafe(t), n = 0;
                for (r = 0; r < e.length; ++r) {
                    var s = e[r];
                    if (!f.isBuffer(s)) throw new TypeError('"list" argument must be an Array of Buffers');
                    s.copy(i, n), n += s.length
                }
                return i
            }, f.byteLength = p, f.prototype._isBuffer = !0, f.prototype.swap16 = function () {
                var e = this.length;
                if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
                for (var t = 0; t < e; t += 2) b(this, t, t + 1);
                return this
            }, f.prototype.swap32 = function () {
                var e = this.length;
                if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
                for (var t = 0; t < e; t += 4) b(this, t, t + 3), b(this, t + 1, t + 2);
                return this
            }, f.prototype.swap64 = function () {
                var e = this.length;
                if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
                for (var t = 0; t < e; t += 8) b(this, t, t + 7), b(this, t + 1, t + 6), b(this, t + 2, t + 5), b(this, t + 3, t + 4);
                return this
            }, f.prototype.toString = function () {
                var e = 0 | this.length;
                return 0 === e ? "" : 0 === arguments.length ? E(this, 0, e) : function (e, t, r) {
                    var i = !1;
                    if ((void 0 === t || t < 0) && (t = 0), t > this.length) return "";
                    if ((void 0 === r || r > this.length) && (r = this.length), r <= 0) return "";
                    if ((r >>>= 0) <= (t >>>= 0)) return "";
                    for (e || (e = "utf8"); ;) switch (e) {
                        case"hex":
                            return R(this, t, r);
                        case"utf8":
                        case"utf-8":
                            return E(this, t, r);
                        case"ascii":
                            return M(this, t, r);
                        case"latin1":
                        case"binary":
                            return B(this, t, r);
                        case"base64":
                            return A(this, t, r);
                        case"ucs2":
                        case"ucs-2":
                        case"utf16le":
                        case"utf-16le":
                            return I(this, t, r);
                        default:
                            if (i) throw new TypeError("Unknown encoding: " + e);
                            e = (e + "").toLowerCase(), i = !0
                    }
                }.apply(this, arguments)
            }, f.prototype.equals = function (e) {
                if (!f.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
                return this === e || 0 === f.compare(this, e)
            }, f.prototype.inspect = function () {
                var e = "", r = t.INSPECT_MAX_BYTES;
                return this.length > 0 && (e = this.toString("hex", 0, r).match(/.{2}/g).join(" "), this.length > r && (e += " ... ")), "<Buffer " + e + ">"
            }, f.prototype.compare = function (e, t, r, i, n) {
                if (!f.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
                if (void 0 === t && (t = 0), void 0 === r && (r = e ? e.length : 0), void 0 === i && (i = 0), void 0 === n && (n = this.length), t < 0 || r > e.length || i < 0 || n > this.length) throw new RangeError("out of range index");
                if (i >= n && t >= r) return 0;
                if (i >= n) return -1;
                if (t >= r) return 1;
                if (this === e) return 0;
                for (var o = (n >>>= 0) - (i >>>= 0), s = (r >>>= 0) - (t >>>= 0), a = Math.min(o, s), c = this.slice(i, n), u = e.slice(t, r), h = 0; h < a; ++h) if (c[h] !== u[h]) {
                    o = c[h], s = u[h];
                    break
                }
                return o < s ? -1 : s < o ? 1 : 0
            }, f.prototype.includes = function (e, t, r) {
                return -1 !== this.indexOf(e, t, r)
            }, f.prototype.indexOf = function (e, t, r) {
                return y(this, e, t, r, !0)
            }, f.prototype.lastIndexOf = function (e, t, r) {
                return y(this, e, t, r, !1)
            }, f.prototype.write = function (e, t, r, i) {
                if (void 0 === t) i = "utf8", r = this.length, t = 0; else if (void 0 === r && "string" == typeof t) i = t, r = this.length, t = 0; else {
                    if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                    t |= 0, isFinite(r) ? (r |= 0, void 0 === i && (i = "utf8")) : (i = r, r = void 0)
                }
                var n = this.length - t;
                if ((void 0 === r || r > n) && (r = n), e.length > 0 && (r < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
                i || (i = "utf8");
                for (var o = !1; ;) switch (i) {
                    case"hex":
                        return m(this, e, t, r);
                    case"utf8":
                    case"utf-8":
                        return g(this, e, t, r);
                    case"ascii":
                        return w(this, e, t, r);
                    case"latin1":
                    case"binary":
                        return _(this, e, t, r);
                    case"base64":
                        return S(this, e, t, r);
                    case"ucs2":
                    case"ucs-2":
                    case"utf16le":
                    case"utf-16le":
                        return k(this, e, t, r);
                    default:
                        if (o) throw new TypeError("Unknown encoding: " + i);
                        i = ("" + i).toLowerCase(), o = !0
                }
            }, f.prototype.toJSON = function () {
                return {type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0)}
            };
            var x = 4096;

            function M(e, t, r) {
                var i = "";
                r = Math.min(e.length, r);
                for (var n = t; n < r; ++n) i += String.fromCharCode(127 & e[n]);
                return i
            }

            function B(e, t, r) {
                var i = "";
                r = Math.min(e.length, r);
                for (var n = t; n < r; ++n) i += String.fromCharCode(e[n]);
                return i
            }

            function R(e, t, r) {
                var i = e.length;
                (!t || t < 0) && (t = 0), (!r || r < 0 || r > i) && (r = i);
                for (var n = "", o = t; o < r; ++o) n += D(e[o]);
                return n
            }

            function I(e, t, r) {
                for (var i = e.slice(t, r), n = "", o = 0; o < i.length; o += 2) n += String.fromCharCode(i[o] + 256 * i[o + 1]);
                return n
            }

            function T(e, t, r) {
                if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
                if (e + t > r) throw new RangeError("Trying to access beyond buffer length")
            }

            function j(e, t, r, i, n, o) {
                if (!f.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
                if (t > n || t < o) throw new RangeError('"value" argument is out of bounds');
                if (r + i > e.length) throw new RangeError("Index out of range")
            }

            function O(e, t, r, i) {
                t < 0 && (t = 65535 + t + 1);
                for (var n = 0, o = Math.min(e.length - r, 2); n < o; ++n) e[r + n] = (t & 255 << 8 * (i ? n : 1 - n)) >>> 8 * (i ? n : 1 - n)
            }

            function P(e, t, r, i) {
                t < 0 && (t = 4294967295 + t + 1);
                for (var n = 0, o = Math.min(e.length - r, 4); n < o; ++n) e[r + n] = t >>> 8 * (i ? n : 3 - n) & 255
            }

            function C(e, t, r, i, n, o) {
                if (r + i > e.length) throw new RangeError("Index out of range");
                if (r < 0) throw new RangeError("Index out of range")
            }

            function q(e, t, r, i, o) {
                return o || C(e, 0, r, 4), n.write(e, t, r, i, 23, 4), r + 4
            }

            function U(e, t, r, i, o) {
                return o || C(e, 0, r, 8), n.write(e, t, r, i, 52, 8), r + 8
            }

            f.prototype.slice = function (e, t) {
                var r, i = this.length;
                if ((e = ~~e) < 0 ? (e += i) < 0 && (e = 0) : e > i && (e = i), (t = void 0 === t ? i : ~~t) < 0 ? (t += i) < 0 && (t = 0) : t > i && (t = i), t < e && (t = e), f.TYPED_ARRAY_SUPPORT) (r = this.subarray(e, t)).__proto__ = f.prototype; else {
                    var n = t - e;
                    r = new f(n, void 0);
                    for (var o = 0; o < n; ++o) r[o] = this[o + e]
                }
                return r
            }, f.prototype.readUIntLE = function (e, t, r) {
                e |= 0, t |= 0, r || T(e, t, this.length);
                for (var i = this[e], n = 1, o = 0; ++o < t && (n *= 256);) i += this[e + o] * n;
                return i
            }, f.prototype.readUIntBE = function (e, t, r) {
                e |= 0, t |= 0, r || T(e, t, this.length);
                for (var i = this[e + --t], n = 1; t > 0 && (n *= 256);) i += this[e + --t] * n;
                return i
            }, f.prototype.readUInt8 = function (e, t) {
                return t || T(e, 1, this.length), this[e]
            }, f.prototype.readUInt16LE = function (e, t) {
                return t || T(e, 2, this.length), this[e] | this[e + 1] << 8
            }, f.prototype.readUInt16BE = function (e, t) {
                return t || T(e, 2, this.length), this[e] << 8 | this[e + 1]
            }, f.prototype.readUInt32LE = function (e, t) {
                return t || T(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3]
            }, f.prototype.readUInt32BE = function (e, t) {
                return t || T(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3])
            }, f.prototype.readIntLE = function (e, t, r) {
                e |= 0, t |= 0, r || T(e, t, this.length);
                for (var i = this[e], n = 1, o = 0; ++o < t && (n *= 256);) i += this[e + o] * n;
                return i >= (n *= 128) && (i -= Math.pow(2, 8 * t)), i
            }, f.prototype.readIntBE = function (e, t, r) {
                e |= 0, t |= 0, r || T(e, t, this.length);
                for (var i = t, n = 1, o = this[e + --i]; i > 0 && (n *= 256);) o += this[e + --i] * n;
                return o >= (n *= 128) && (o -= Math.pow(2, 8 * t)), o
            }, f.prototype.readInt8 = function (e, t) {
                return t || T(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e]
            }, f.prototype.readInt16LE = function (e, t) {
                t || T(e, 2, this.length);
                var r = this[e] | this[e + 1] << 8;
                return 32768 & r ? 4294901760 | r : r
            }, f.prototype.readInt16BE = function (e, t) {
                t || T(e, 2, this.length);
                var r = this[e + 1] | this[e] << 8;
                return 32768 & r ? 4294901760 | r : r
            }, f.prototype.readInt32LE = function (e, t) {
                return t || T(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24
            }, f.prototype.readInt32BE = function (e, t) {
                return t || T(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]
            }, f.prototype.readFloatLE = function (e, t) {
                return t || T(e, 4, this.length), n.read(this, e, !0, 23, 4)
            }, f.prototype.readFloatBE = function (e, t) {
                return t || T(e, 4, this.length), n.read(this, e, !1, 23, 4)
            }, f.prototype.readDoubleLE = function (e, t) {
                return t || T(e, 8, this.length), n.read(this, e, !0, 52, 8)
            }, f.prototype.readDoubleBE = function (e, t) {
                return t || T(e, 8, this.length), n.read(this, e, !1, 52, 8)
            }, f.prototype.writeUIntLE = function (e, t, r, i) {
                (e = +e, t |= 0, r |= 0, i) || j(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
                var n = 1, o = 0;
                for (this[t] = 255 & e; ++o < r && (n *= 256);) this[t + o] = e / n & 255;
                return t + r
            }, f.prototype.writeUIntBE = function (e, t, r, i) {
                (e = +e, t |= 0, r |= 0, i) || j(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
                var n = r - 1, o = 1;
                for (this[t + n] = 255 & e; --n >= 0 && (o *= 256);) this[t + n] = e / o & 255;
                return t + r
            }, f.prototype.writeUInt8 = function (e, t, r) {
                return e = +e, t |= 0, r || j(this, e, t, 1, 255, 0), f.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), this[t] = 255 & e, t + 1
            }, f.prototype.writeUInt16LE = function (e, t, r) {
                return e = +e, t |= 0, r || j(this, e, t, 2, 65535, 0), f.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : O(this, e, t, !0), t + 2
            }, f.prototype.writeUInt16BE = function (e, t, r) {
                return e = +e, t |= 0, r || j(this, e, t, 2, 65535, 0), f.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : O(this, e, t, !1), t + 2
            }, f.prototype.writeUInt32LE = function (e, t, r) {
                return e = +e, t |= 0, r || j(this, e, t, 4, 4294967295, 0), f.TYPED_ARRAY_SUPPORT ? (this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e) : P(this, e, t, !0), t + 4
            }, f.prototype.writeUInt32BE = function (e, t, r) {
                return e = +e, t |= 0, r || j(this, e, t, 4, 4294967295, 0), f.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : P(this, e, t, !1), t + 4
            }, f.prototype.writeIntLE = function (e, t, r, i) {
                if (e = +e, t |= 0, !i) {
                    var n = Math.pow(2, 8 * r - 1);
                    j(this, e, t, r, n - 1, -n)
                }
                var o = 0, s = 1, a = 0;
                for (this[t] = 255 & e; ++o < r && (s *= 256);) e < 0 && 0 === a && 0 !== this[t + o - 1] && (a = 1), this[t + o] = (e / s >> 0) - a & 255;
                return t + r
            }, f.prototype.writeIntBE = function (e, t, r, i) {
                if (e = +e, t |= 0, !i) {
                    var n = Math.pow(2, 8 * r - 1);
                    j(this, e, t, r, n - 1, -n)
                }
                var o = r - 1, s = 1, a = 0;
                for (this[t + o] = 255 & e; --o >= 0 && (s *= 256);) e < 0 && 0 === a && 0 !== this[t + o + 1] && (a = 1), this[t + o] = (e / s >> 0) - a & 255;
                return t + r
            }, f.prototype.writeInt8 = function (e, t, r) {
                return e = +e, t |= 0, r || j(this, e, t, 1, 127, -128), f.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1
            }, f.prototype.writeInt16LE = function (e, t, r) {
                return e = +e, t |= 0, r || j(this, e, t, 2, 32767, -32768), f.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : O(this, e, t, !0), t + 2
            }, f.prototype.writeInt16BE = function (e, t, r) {
                return e = +e, t |= 0, r || j(this, e, t, 2, 32767, -32768), f.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : O(this, e, t, !1), t + 2
            }, f.prototype.writeInt32LE = function (e, t, r) {
                return e = +e, t |= 0, r || j(this, e, t, 4, 2147483647, -2147483648), f.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24) : P(this, e, t, !0), t + 4
            }, f.prototype.writeInt32BE = function (e, t, r) {
                return e = +e, t |= 0, r || j(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), f.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : P(this, e, t, !1), t + 4
            }, f.prototype.writeFloatLE = function (e, t, r) {
                return q(this, e, t, !0, r)
            }, f.prototype.writeFloatBE = function (e, t, r) {
                return q(this, e, t, !1, r)
            }, f.prototype.writeDoubleLE = function (e, t, r) {
                return U(this, e, t, !0, r)
            }, f.prototype.writeDoubleBE = function (e, t, r) {
                return U(this, e, t, !1, r)
            }, f.prototype.copy = function (e, t, r, i) {
                if (r || (r = 0), i || 0 === i || (i = this.length), t >= e.length && (t = e.length), t || (t = 0), i > 0 && i < r && (i = r), i === r) return 0;
                if (0 === e.length || 0 === this.length) return 0;
                if (t < 0) throw new RangeError("targetStart out of bounds");
                if (r < 0 || r >= this.length) throw new RangeError("sourceStart out of bounds");
                if (i < 0) throw new RangeError("sourceEnd out of bounds");
                i > this.length && (i = this.length), e.length - t < i - r && (i = e.length - t + r);
                var n, o = i - r;
                if (this === e && r < t && t < i) for (n = o - 1; n >= 0; --n) e[n + t] = this[n + r]; else if (o < 1e3 || !f.TYPED_ARRAY_SUPPORT) for (n = 0; n < o; ++n) e[n + t] = this[n + r]; else Uint8Array.prototype.set.call(e, this.subarray(r, r + o), t);
                return o
            }, f.prototype.fill = function (e, t, r, i) {
                if ("string" == typeof e) {
                    if ("string" == typeof t ? (i = t, t = 0, r = this.length) : "string" == typeof r && (i = r, r = this.length), 1 === e.length) {
                        var n = e.charCodeAt(0);
                        n < 256 && (e = n)
                    }
                    if (void 0 !== i && "string" != typeof i) throw new TypeError("encoding must be a string");
                    if ("string" == typeof i && !f.isEncoding(i)) throw new TypeError("Unknown encoding: " + i)
                } else "number" == typeof e && (e &= 255);
                if (t < 0 || this.length < t || this.length < r) throw new RangeError("Out of range index");
                if (r <= t) return this;
                var o;
                if (t >>>= 0, r = void 0 === r ? this.length : r >>> 0, e || (e = 0), "number" == typeof e) for (o = t; o < r; ++o) this[o] = e; else {
                    var s = f.isBuffer(e) ? e : L(new f(e, i).toString()), a = s.length;
                    for (o = 0; o < r - t; ++o) this[o + t] = s[o % a]
                }
                return this
            };
            var N = /[^+\/0-9A-Za-z-_]/g;

            function D(e) {
                return e < 16 ? "0" + e.toString(16) : e.toString(16)
            }

            function L(e, t) {
                var r;
                t = t || 1 / 0;
                for (var i = e.length, n = null, o = [], s = 0; s < i; ++s) {
                    if ((r = e.charCodeAt(s)) > 55295 && r < 57344) {
                        if (!n) {
                            if (r > 56319) {
                                (t -= 3) > -1 && o.push(239, 191, 189);
                                continue
                            }
                            if (s + 1 === i) {
                                (t -= 3) > -1 && o.push(239, 191, 189);
                                continue
                            }
                            n = r;
                            continue
                        }
                        if (r < 56320) {
                            (t -= 3) > -1 && o.push(239, 191, 189), n = r;
                            continue
                        }
                        r = 65536 + (n - 55296 << 10 | r - 56320)
                    } else n && (t -= 3) > -1 && o.push(239, 191, 189);
                    if (n = null, r < 128) {
                        if ((t -= 1) < 0) break;
                        o.push(r)
                    } else if (r < 2048) {
                        if ((t -= 2) < 0) break;
                        o.push(r >> 6 | 192, 63 & r | 128)
                    } else if (r < 65536) {
                        if ((t -= 3) < 0) break;
                        o.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128)
                    } else {
                        if (!(r < 1114112)) throw new Error("Invalid code point");
                        if ((t -= 4) < 0) break;
                        o.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128)
                    }
                }
                return o
            }

            function z(e) {
                return i.toByteArray(function (e) {
                    if ((e = function (e) {
                            return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "")
                        }(e).replace(N, "")).length < 2) return "";
                    for (; e.length % 4 != 0;) e += "=";
                    return e
                }(e))
            }

            function F(e, t, r, i) {
                for (var n = 0; n < i && !(n + r >= t.length || n >= e.length); ++n) t[n + r] = e[n];
                return n
            }
        }).call(t, r(7))
    }, function (e, t, r) {
        "use strict";
        t.byteLength = function (e) {
            return 3 * e.length / 4 - c(e)
        }, t.toByteArray = function (e) {
            var t, r, i, s, a, f = e.length;
            s = c(e), a = new o(3 * f / 4 - s), r = s > 0 ? f - 4 : f;
            var u = 0;
            for (t = 0; t < r; t += 4) i = n[e.charCodeAt(t)] << 18 | n[e.charCodeAt(t + 1)] << 12 | n[e.charCodeAt(t + 2)] << 6 | n[e.charCodeAt(t + 3)], a[u++] = i >> 16 & 255, a[u++] = i >> 8 & 255, a[u++] = 255 & i;
            2 === s ? (i = n[e.charCodeAt(t)] << 2 | n[e.charCodeAt(t + 1)] >> 4, a[u++] = 255 & i) : 1 === s && (i = n[e.charCodeAt(t)] << 10 | n[e.charCodeAt(t + 1)] << 4 | n[e.charCodeAt(t + 2)] >> 2, a[u++] = i >> 8 & 255, a[u++] = 255 & i);
            return a
        }, t.fromByteArray = function (e) {
            for (var t, r = e.length, n = r % 3, o = "", s = [], a = 0, f = r - n; a < f; a += 16383) s.push(u(e, a, a + 16383 > f ? f : a + 16383));
            1 === n ? (t = e[r - 1], o += i[t >> 2], o += i[t << 4 & 63], o += "==") : 2 === n && (t = (e[r - 2] << 8) + e[r - 1], o += i[t >> 10], o += i[t >> 4 & 63], o += i[t << 2 & 63], o += "=");
            return s.push(o), s.join("")
        };
        for (var i = [], n = [], o = "undefined" != typeof Uint8Array ? Uint8Array : Array, s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", a = 0, f = s.length; a < f; ++a) i[a] = s[a], n[s.charCodeAt(a)] = a;

        function c(e) {
            var t = e.length;
            if (t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
            return "=" === e[t - 2] ? 2 : "=" === e[t - 1] ? 1 : 0
        }

        function u(e, t, r) {
            for (var n, o, s = [], a = t; a < r; a += 3) n = (e[a] << 16) + (e[a + 1] << 8) + e[a + 2], s.push(i[(o = n) >> 18 & 63] + i[o >> 12 & 63] + i[o >> 6 & 63] + i[63 & o]);
            return s.join("")
        }

        n["-".charCodeAt(0)] = 62, n["_".charCodeAt(0)] = 63
    }, function (e, t) {
        t.read = function (e, t, r, i, n) {
            var o, s, a = 8 * n - i - 1, f = (1 << a) - 1, c = f >> 1, u = -7, h = r ? n - 1 : 0, d = r ? -1 : 1,
                l = e[t + h];
            for (h += d, o = l & (1 << -u) - 1, l >>= -u, u += a; u > 0; o = 256 * o + e[t + h], h += d, u -= 8) ;
            for (s = o & (1 << -u) - 1, o >>= -u, u += i; u > 0; s = 256 * s + e[t + h], h += d, u -= 8) ;
            if (0 === o) o = 1 - c; else {
                if (o === f) return s ? NaN : 1 / 0 * (l ? -1 : 1);
                s += Math.pow(2, i), o -= c
            }
            return (l ? -1 : 1) * s * Math.pow(2, o - i)
        }, t.write = function (e, t, r, i, n, o) {
            var s, a, f, c = 8 * o - n - 1, u = (1 << c) - 1, h = u >> 1,
                d = 23 === n ? Math.pow(2, -24) - Math.pow(2, -77) : 0, l = i ? 0 : o - 1, p = i ? 1 : -1,
                b = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
            for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (a = isNaN(t) ? 1 : 0, s = u) : (s = Math.floor(Math.log(t) / Math.LN2), t * (f = Math.pow(2, -s)) < 1 && (s--, f *= 2), (t += s + h >= 1 ? d / f : d * Math.pow(2, 1 - h)) * f >= 2 && (s++, f /= 2), s + h >= u ? (a = 0, s = u) : s + h >= 1 ? (a = (t * f - 1) * Math.pow(2, n), s += h) : (a = t * Math.pow(2, h - 1) * Math.pow(2, n), s = 0)); n >= 8; e[r + l] = 255 & a, l += p, a /= 256, n -= 8) ;
            for (s = s << n | a, c += n; c > 0; e[r + l] = 255 & s, l += p, s /= 256, c -= 8) ;
            e[r + l - p] |= 128 * b
        }
    }, function (e, t) {
        var r = {}.toString;
        e.exports = Array.isArray || function (e) {
            return "[object Array]" == r.call(e)
        }
    }, function (e, t, r) {
        "use strict";
        var i = e.exports = r(25);
        i.build = "full", i.tokenize = r(35), i.parse = r(58), i.common = r(59), i.Root._configure(i.Type, i.parse, i.common)
    }, function (e, t, r) {
        "use strict";
        var i = t;

        function n() {
            i.Reader._configure(i.BufferReader), i.util._configure()
        }

        i.build = "minimal", i.Writer = r(9), i.BufferWriter = r(52), i.Reader = r(10), i.BufferReader = r(53), i.util = r(2), i.rpc = r(28), i.roots = r(29), i.configure = n, i.Writer._configure(i.BufferWriter), n()
    }, function (e, t, r) {
        "use strict";
        var i = t;
        i.length = function (e) {
            var t = e.length;
            if (!t) return 0;
            for (var r = 0; --t % 4 > 1 && "=" === e.charAt(t);) ++r;
            return Math.ceil(3 * e.length) / 4 - r
        };
        for (var n = new Array(64), o = new Array(123), s = 0; s < 64;) o[n[s] = s < 26 ? s + 65 : s < 52 ? s + 71 : s < 62 ? s - 4 : s - 59 | 43] = s++;
        i.encode = function (e, t, r) {
            for (var i, o = null, s = [], a = 0, f = 0; t < r;) {
                var c = e[t++];
                switch (f) {
                    case 0:
                        s[a++] = n[c >> 2], i = (3 & c) << 4, f = 1;
                        break;
                    case 1:
                        s[a++] = n[i | c >> 4], i = (15 & c) << 2, f = 2;
                        break;
                    case 2:
                        s[a++] = n[i | c >> 6], s[a++] = n[63 & c], f = 0
                }
                a > 8191 && ((o || (o = [])).push(String.fromCharCode.apply(String, s)), a = 0)
            }
            return f && (s[a++] = n[i], s[a++] = 61, 1 === f && (s[a++] = 61)), o ? (a && o.push(String.fromCharCode.apply(String, s.slice(0, a))), o.join("")) : String.fromCharCode.apply(String, s.slice(0, a))
        };
        i.decode = function (e, t, r) {
            for (var i, n = r, s = 0, a = 0; a < e.length;) {
                var f = e.charCodeAt(a++);
                if (61 === f && s > 1) break;
                if (void 0 === (f = o[f])) throw Error("invalid encoding");
                switch (s) {
                    case 0:
                        i = f, s = 1;
                        break;
                    case 1:
                        t[r++] = i << 2 | (48 & f) >> 4, i = f, s = 2;
                        break;
                    case 2:
                        t[r++] = (15 & i) << 4 | (60 & f) >> 2, i = f, s = 3;
                        break;
                    case 3:
                        t[r++] = (3 & i) << 6 | f, s = 0
                }
            }
            if (1 === s) throw Error("invalid encoding");
            return r - n
        }, i.test = function (e) {
            return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(e)
        }
    }, function (e, t, r) {
        "use strict";

        function i() {
            this._listeners = {}
        }

        e.exports = i, i.prototype.on = function (e, t, r) {
            return (this._listeners[e] || (this._listeners[e] = [])).push({fn: t, ctx: r || this}), this
        }, i.prototype.off = function (e, t) {
            if (void 0 === e) this._listeners = {}; else if (void 0 === t) this._listeners[e] = []; else for (var r = this._listeners[e], i = 0; i < r.length;) r[i].fn === t ? r.splice(i, 1) : ++i;
            return this
        }, i.prototype.emit = function (e) {
            var t = this._listeners[e];
            if (t) {
                for (var r = [], i = 1; i < arguments.length;) r.push(arguments[i++]);
                for (i = 0; i < t.length;) t[i].fn.apply(t[i++].ctx, r)
            }
            return this
        }
    }, function (e, t, r) {
        "use strict";

        function i(e) {
            return "undefined" != typeof Float32Array ? function () {
                var t = new Float32Array([-0]), r = new Uint8Array(t.buffer), i = 128 === r[3];

                function n(e, i, n) {
                    t[0] = e, i[n] = r[0], i[n + 1] = r[1], i[n + 2] = r[2], i[n + 3] = r[3]
                }

                function o(e, i, n) {
                    t[0] = e, i[n] = r[3], i[n + 1] = r[2], i[n + 2] = r[1], i[n + 3] = r[0]
                }

                function s(e, i) {
                    return r[0] = e[i], r[1] = e[i + 1], r[2] = e[i + 2], r[3] = e[i + 3], t[0]
                }

                function a(e, i) {
                    return r[3] = e[i], r[2] = e[i + 1], r[1] = e[i + 2], r[0] = e[i + 3], t[0]
                }

                e.writeFloatLE = i ? n : o, e.writeFloatBE = i ? o : n, e.readFloatLE = i ? s : a, e.readFloatBE = i ? a : s
            }() : function () {
                function t(e, t, r, i) {
                    var n = t < 0 ? 1 : 0;
                    if (n && (t = -t), 0 === t) e(1 / t > 0 ? 0 : 2147483648, r, i); else if (isNaN(t)) e(2143289344, r, i); else if (t > 3.4028234663852886e38) e((n << 31 | 2139095040) >>> 0, r, i); else if (t < 1.1754943508222875e-38) e((n << 31 | Math.round(t / 1.401298464324817e-45)) >>> 0, r, i); else {
                        var o = Math.floor(Math.log(t) / Math.LN2);
                        e((n << 31 | o + 127 << 23 | 8388607 & Math.round(t * Math.pow(2, -o) * 8388608)) >>> 0, r, i)
                    }
                }

                function r(e, t, r) {
                    var i = e(t, r), n = 2 * (i >> 31) + 1, o = i >>> 23 & 255, s = 8388607 & i;
                    return 255 === o ? s ? NaN : n * (1 / 0) : 0 === o ? 1.401298464324817e-45 * n * s : n * Math.pow(2, o - 150) * (s + 8388608)
                }

                e.writeFloatLE = t.bind(null, n), e.writeFloatBE = t.bind(null, o), e.readFloatLE = r.bind(null, s), e.readFloatBE = r.bind(null, a)
            }(), "undefined" != typeof Float64Array ? function () {
                var t = new Float64Array([-0]), r = new Uint8Array(t.buffer), i = 128 === r[7];

                function n(e, i, n) {
                    t[0] = e, i[n] = r[0], i[n + 1] = r[1], i[n + 2] = r[2], i[n + 3] = r[3], i[n + 4] = r[4], i[n + 5] = r[5], i[n + 6] = r[6], i[n + 7] = r[7]
                }

                function o(e, i, n) {
                    t[0] = e, i[n] = r[7], i[n + 1] = r[6], i[n + 2] = r[5], i[n + 3] = r[4], i[n + 4] = r[3], i[n + 5] = r[2], i[n + 6] = r[1], i[n + 7] = r[0]
                }

                function s(e, i) {
                    return r[0] = e[i], r[1] = e[i + 1], r[2] = e[i + 2], r[3] = e[i + 3], r[4] = e[i + 4], r[5] = e[i + 5], r[6] = e[i + 6], r[7] = e[i + 7], t[0]
                }

                function a(e, i) {
                    return r[7] = e[i], r[6] = e[i + 1], r[5] = e[i + 2], r[4] = e[i + 3], r[3] = e[i + 4], r[2] = e[i + 5], r[1] = e[i + 6], r[0] = e[i + 7], t[0]
                }

                e.writeDoubleLE = i ? n : o, e.writeDoubleBE = i ? o : n, e.readDoubleLE = i ? s : a, e.readDoubleBE = i ? a : s
            }() : function () {
                function t(e, t, r, i, n, o) {
                    var s = i < 0 ? 1 : 0;
                    if (s && (i = -i), 0 === i) e(0, n, o + t), e(1 / i > 0 ? 0 : 2147483648, n, o + r); else if (isNaN(i)) e(0, n, o + t), e(2146959360, n, o + r); else if (i > 1.7976931348623157e308) e(0, n, o + t), e((s << 31 | 2146435072) >>> 0, n, o + r); else {
                        var a;
                        if (i < 2.2250738585072014e-308) e((a = i / 5e-324) >>> 0, n, o + t), e((s << 31 | a / 4294967296) >>> 0, n, o + r); else {
                            var f = Math.floor(Math.log(i) / Math.LN2);
                            1024 === f && (f = 1023), e(4503599627370496 * (a = i * Math.pow(2, -f)) >>> 0, n, o + t), e((s << 31 | f + 1023 << 20 | 1048576 * a & 1048575) >>> 0, n, o + r)
                        }
                    }
                }

                function r(e, t, r, i, n) {
                    var o = e(i, n + t), s = e(i, n + r), a = 2 * (s >> 31) + 1, f = s >>> 20 & 2047,
                        c = 4294967296 * (1048575 & s) + o;
                    return 2047 === f ? c ? NaN : a * (1 / 0) : 0 === f ? 5e-324 * a * c : a * Math.pow(2, f - 1075) * (c + 4503599627370496)
                }

                e.writeDoubleLE = t.bind(null, n, 0, 4), e.writeDoubleBE = t.bind(null, o, 4, 0), e.readDoubleLE = r.bind(null, s, 0, 4), e.readDoubleBE = r.bind(null, a, 4, 0)
            }(), e
        }

        function n(e, t, r) {
            t[r] = 255 & e, t[r + 1] = e >>> 8 & 255, t[r + 2] = e >>> 16 & 255, t[r + 3] = e >>> 24
        }

        function o(e, t, r) {
            t[r] = e >>> 24, t[r + 1] = e >>> 16 & 255, t[r + 2] = e >>> 8 & 255, t[r + 3] = 255 & e
        }

        function s(e, t) {
            return (e[t] | e[t + 1] << 8 | e[t + 2] << 16 | e[t + 3] << 24) >>> 0
        }

        function a(e, t) {
            return (e[t] << 24 | e[t + 1] << 16 | e[t + 2] << 8 | e[t + 3]) >>> 0
        }

        e.exports = i(i)
    }, function (e, t, r) {
        "use strict";
        var i = t;
        i.length = function (e) {
            for (var t = 0, r = 0, i = 0; i < e.length; ++i) (r = e.charCodeAt(i)) < 128 ? t += 1 : r < 2048 ? t += 2 : 55296 == (64512 & r) && 56320 == (64512 & e.charCodeAt(i + 1)) ? (++i, t += 4) : t += 3;
            return t
        }, i.read = function (e, t, r) {
            if (r - t < 1) return "";
            for (var i, n = null, o = [], s = 0; t < r;) (i = e[t++]) < 128 ? o[s++] = i : i > 191 && i < 224 ? o[s++] = (31 & i) << 6 | 63 & e[t++] : i > 239 && i < 365 ? (i = ((7 & i) << 18 | (63 & e[t++]) << 12 | (63 & e[t++]) << 6 | 63 & e[t++]) - 65536, o[s++] = 55296 + (i >> 10), o[s++] = 56320 + (1023 & i)) : o[s++] = (15 & i) << 12 | (63 & e[t++]) << 6 | 63 & e[t++], s > 8191 && ((n || (n = [])).push(String.fromCharCode.apply(String, o)), s = 0);
            return n ? (s && n.push(String.fromCharCode.apply(String, o.slice(0, s))), n.join("")) : String.fromCharCode.apply(String, o.slice(0, s))
        }, i.write = function (e, t, r) {
            for (var i, n, o = r, s = 0; s < e.length; ++s) (i = e.charCodeAt(s)) < 128 ? t[r++] = i : i < 2048 ? (t[r++] = i >> 6 | 192, t[r++] = 63 & i | 128) : 55296 == (64512 & i) && 56320 == (64512 & (n = e.charCodeAt(s + 1))) ? (i = 65536 + ((1023 & i) << 10) + (1023 & n), ++s, t[r++] = i >> 18 | 240, t[r++] = i >> 12 & 63 | 128, t[r++] = i >> 6 & 63 | 128, t[r++] = 63 & i | 128) : (t[r++] = i >> 12 | 224, t[r++] = i >> 6 & 63 | 128, t[r++] = 63 & i | 128);
            return r - o
        }
    }, function (e, t, r) {
        "use strict";
        e.exports = function (e, t, r) {
            var i = r || 8192, n = i >>> 1, o = null, s = i;
            return function (r) {
                if (r < 1 || r > n) return e(r);
                s + r > i && (o = e(i), s = 0);
                var a = t.call(o, s, s += r);
                return 7 & s && (s = 1 + (7 | s)), a
            }
        }
    }, function (e, t, r) {
        "use strict";
        e.exports = n;
        var i = r(2);

        function n(e, t) {
            this.lo = e >>> 0, this.hi = t >>> 0
        }

        var o = n.zero = new n(0, 0);
        o.toNumber = function () {
            return 0
        }, o.zzEncode = o.zzDecode = function () {
            return this
        }, o.length = function () {
            return 1
        };
        var s = n.zeroHash = "\0\0\0\0\0\0\0\0";
        n.fromNumber = function (e) {
            if (0 === e) return o;
            var t = e < 0;
            t && (e = -e);
            var r = e >>> 0, i = (e - r) / 4294967296 >>> 0;
            return t && (i = ~i >>> 0, r = ~r >>> 0, ++r > 4294967295 && (r = 0, ++i > 4294967295 && (i = 0))), new n(r, i)
        }, n.from = function (e) {
            if ("number" == typeof e) return n.fromNumber(e);
            if (i.isString(e)) {
                if (!i.Long) return n.fromNumber(parseInt(e, 10));
                e = i.Long.fromString(e)
            }
            return e.low || e.high ? new n(e.low >>> 0, e.high >>> 0) : o
        }, n.prototype.toNumber = function (e) {
            if (!e && this.hi >>> 31) {
                var t = 1 + ~this.lo >>> 0, r = ~this.hi >>> 0;
                return t || (r = r + 1 >>> 0), -(t + 4294967296 * r)
            }
            return this.lo + 4294967296 * this.hi
        }, n.prototype.toLong = function (e) {
            return i.Long ? new i.Long(0 | this.lo, 0 | this.hi, Boolean(e)) : {
                low: 0 | this.lo,
                high: 0 | this.hi,
                unsigned: Boolean(e)
            }
        };
        var a = String.prototype.charCodeAt;
        n.fromHash = function (e) {
            return e === s ? o : new n((a.call(e, 0) | a.call(e, 1) << 8 | a.call(e, 2) << 16 | a.call(e, 3) << 24) >>> 0, (a.call(e, 4) | a.call(e, 5) << 8 | a.call(e, 6) << 16 | a.call(e, 7) << 24) >>> 0)
        }, n.prototype.toHash = function () {
            return String.fromCharCode(255 & this.lo, this.lo >>> 8 & 255, this.lo >>> 16 & 255, this.lo >>> 24, 255 & this.hi, this.hi >>> 8 & 255, this.hi >>> 16 & 255, this.hi >>> 24)
        }, n.prototype.zzEncode = function () {
            var e = this.hi >> 31;
            return this.hi = ((this.hi << 1 | this.lo >>> 31) ^ e) >>> 0, this.lo = (this.lo << 1 ^ e) >>> 0, this
        }, n.prototype.zzDecode = function () {
            var e = -(1 & this.lo);
            return this.lo = ((this.lo >>> 1 | this.hi << 31) ^ e) >>> 0, this.hi = (this.hi >>> 1 ^ e) >>> 0, this
        }, n.prototype.length = function () {
            var e = this.lo, t = (this.lo >>> 28 | this.hi << 4) >>> 0, r = this.hi >>> 24;
            return 0 === r ? 0 === t ? e < 16384 ? e < 128 ? 1 : 2 : e < 2097152 ? 3 : 4 : t < 16384 ? t < 128 ? 5 : 6 : t < 2097152 ? 7 : 8 : r < 128 ? 9 : 10
        }
    }, function (e, t, r) {
        "use strict";
        e.exports = s;
        var i = r(9);
        (s.prototype = Object.create(i.prototype)).constructor = s;
        var n = r(2), o = n.Buffer;

        function s() {
            i.call(this)
        }

        s.alloc = function (e) {
            return (s.alloc = n._Buffer_allocUnsafe)(e)
        };
        var a = o && o.prototype instanceof Uint8Array && "set" === o.prototype.set.name ? function (e, t, r) {
            t.set(e, r)
        } : function (e, t, r) {
            if (e.copy) e.copy(t, r, 0, e.length); else for (var i = 0; i < e.length;) t[r++] = e[i++]
        };

        function f(e, t, r) {
            e.length < 40 ? n.utf8.write(e, t, r) : t.utf8Write(e, r)
        }

        s.prototype.bytes = function (e) {
            n.isString(e) && (e = n._Buffer_from(e, "base64"));
            var t = e.length >>> 0;
            return this.uint32(t), t && this._push(a, t, e), this
        }, s.prototype.string = function (e) {
            var t = o.byteLength(e);
            return this.uint32(t), t && this._push(f, t, e), this
        }
    }, function (e, t, r) {
        "use strict";
        e.exports = o;
        var i = r(10);
        (o.prototype = Object.create(i.prototype)).constructor = o;
        var n = r(2);

        function o(e) {
            i.call(this, e)
        }

        n.Buffer && (o.prototype._slice = n.Buffer.prototype.slice), o.prototype.string = function () {
            var e = this.uint32();
            return this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + e, this.len))
        }
    }, function (e, t, r) {
        "use strict";
        e.exports = n;
        var i = r(2);

        function n(e, t, r) {
            if ("function" != typeof e) throw TypeError("rpcImpl must be a function");
            i.EventEmitter.call(this), this.rpcImpl = e, this.requestDelimited = Boolean(t), this.responseDelimited = Boolean(r)
        }

        (n.prototype = Object.create(i.EventEmitter.prototype)).constructor = n, n.prototype.rpcCall = function e(t, r, n, o, s) {
            if (!o) throw TypeError("request must be specified");
            var a = this;
            if (!s) return i.asPromise(e, a, t, r, n, o);
            if (a.rpcImpl) try {
                return a.rpcImpl(t, r[a.requestDelimited ? "encodeDelimited" : "encode"](o).finish(), function (e, r) {
                    if (e) return a.emit("error", e, t), s(e);
                    if (null !== r) {
                        if (!(r instanceof n)) try {
                            r = n[a.responseDelimited ? "decodeDelimited" : "decode"](r)
                        } catch (e) {
                            return a.emit("error", e, t), s(e)
                        }
                        return a.emit("data", r, t), s(null, r)
                    }
                    a.end(!0)
                })
            } catch (e) {
                return a.emit("error", e, t), void setTimeout(function () {
                    s(e)
                }, 0)
            } else setTimeout(function () {
                s(Error("already ended"))
            }, 0)
        }, n.prototype.end = function (e) {
            return this.rpcImpl && (e || this.rpcImpl(null, null, null), this.rpcImpl = null, this.emit("end").off()), this
        }
    }, function (e, t, r) {
        "use strict";

        function i(e, t) {
            "string" == typeof e && (t = e, e = void 0);
            var r = [];

            function n(e) {
                if ("string" != typeof e) {
                    var t = o();
                    if (i.verbose && console.log("codegen: " + t), t = "return " + t, e) {
                        for (var s = Object.keys(e), a = new Array(s.length + 1), f = new Array(s.length), c = 0; c < s.length;) a[c] = s[c], f[c] = e[s[c++]];
                        return a[c] = t, Function.apply(null, a).apply(null, f)
                    }
                    return Function(t)()
                }
                for (var u = new Array(arguments.length - 1), h = 0; h < u.length;) u[h] = arguments[++h];
                if (h = 0, e = e.replace(/%([%dfijs])/g, function (e, t) {
                        var r = u[h++];
                        switch (t) {
                            case"d":
                            case"f":
                                return String(Number(r));
                            case"i":
                                return String(Math.floor(r));
                            case"j":
                                return JSON.stringify(r);
                            case"s":
                                return String(r)
                        }
                        return "%"
                    }), h !== u.length) throw Error("parameter count mismatch");
                return r.push(e), n
            }

            function o(i) {
                return "function " + (i || t || "") + "(" + (e && e.join(",") || "") + "){\n  " + r.join("\n  ") + "\n}"
            }

            return n.toString = o, n
        }

        e.exports = i, i.verbose = !1
    }, function (e, t, r) {
        "use strict";
        e.exports = o;
        var i = r(26), n = r(27)("fs");

        function o(e, t, r) {
            return "function" == typeof t ? (r = t, t = {}) : t || (t = {}), r ? !t.xhr && n && n.readFile ? n.readFile(e, function (i, n) {
                return i && "undefined" != typeof XMLHttpRequest ? o.xhr(e, t, r) : i ? r(i) : r(null, t.binary ? n : n.toString("utf8"))
            }) : o.xhr(e, t, r) : i(o, this, e, t)
        }

        o.xhr = function (e, t, r) {
            var i = new XMLHttpRequest;
            i.onreadystatechange = function () {
                if (4 === i.readyState) {
                    if (0 !== i.status && 200 !== i.status) return r(Error("status " + i.status));
                    if (t.binary) {
                        var e = i.response;
                        if (!e) {
                            e = [];
                            for (var n = 0; n < i.responseText.length; ++n) e.push(255 & i.responseText.charCodeAt(n))
                        }
                        return r(null, "undefined" != typeof Uint8Array ? new Uint8Array(e) : e)
                    }
                    return r(null, i.responseText)
                }
            }, t.binary && ("overrideMimeType" in i && i.overrideMimeType("text/plain; charset=x-user-defined"), i.responseType = "arraybuffer"), i.open("GET", e), i.send()
        }
    }, function (e, t, r) {
        "use strict";
        var i = t, n = i.isAbsolute = function (e) {
            return /^(?:\/|\w+:)/.test(e)
        }, o = i.normalize = function (e) {
            var t = (e = e.replace(/\\/g, "/").replace(/\/{2,}/g, "/")).split("/"), r = n(e), i = "";
            r && (i = t.shift() + "/");
            for (var o = 0; o < t.length;) ".." === t[o] ? o > 0 && ".." !== t[o - 1] ? t.splice(--o, 2) : r ? t.splice(o, 1) : ++o : "." === t[o] ? t.splice(o, 1) : ++o;
            return i + t.join("/")
        };
        i.resolve = function (e, t, r) {
            return r || (t = o(t)), n(t) ? t : (r || (e = o(e)), (e = e.replace(/(?:\/|^)[^/]+$/, "")).length ? o(e + "/" + t) : t)
        }
    }, function (e, t, r) {
        "use strict";
        e.exports = A, A.filename = null, A.defaults = {keepCase: !1};
        var i = r(35), n = r(16), o = r(11), s = r(3), a = r(12), f = r(8), c = r(1), u = r(13), h = r(14), d = r(5),
            l = r(0), p = /^[1-9][0-9]*$/, b = /^-?[1-9][0-9]*$/, y = /^0[x][0-9a-fA-F]+$/, v = /^-?0[x][0-9a-fA-F]+$/,
            m = /^0[0-7]+$/, g = /^-?0[0-7]+$/, w = /^(?![eE])[0-9]*(?:\.[0-9]*)?(?:[eE][+-]?[0-9]+)?$/,
            _ = /^[a-zA-Z_][a-zA-Z_0-9]*$/, S = /^(?:\.?[a-zA-Z_][a-zA-Z_0-9]*)+$/,
            k = /^(?:\.[a-zA-Z][a-zA-Z_0-9]*)+$/;

        function A(e, t, r) {
            t instanceof n || (r = t, t = new n), r || (r = A.defaults);
            var E, x, M, B, R, I = i(e, r.alternateCommentMode || !1), T = I.next, j = I.push, O = I.peek, P = I.skip,
                C = I.cmnt, q = !0, U = !1, N = t, D = r.keepCase ? function (e) {
                    return e
                } : l.camelCase;

            function L(e, t, r) {
                var i = A.filename;
                return r || (A.filename = null), Error("illegal " + (t || "token") + " '" + e + "' (" + (i ? i + ", " : "") + "line " + I.line + ")")
            }

            function z() {
                var e, t = [];
                do {
                    if ('"' !== (e = T()) && "'" !== e) throw L(e);
                    t.push(T()), P(e), e = O()
                } while ('"' === e || "'" === e);
                return t.join("")
            }

            function F(e) {
                var t = T();
                switch (t) {
                    case"'":
                    case'"':
                        return j(t), z();
                    case"true":
                    case"TRUE":
                        return !0;
                    case"false":
                    case"FALSE":
                        return !1
                }
                try {
                    return function (e, t) {
                        var r = 1;
                        "-" === e.charAt(0) && (r = -1, e = e.substring(1));
                        switch (e) {
                            case"inf":
                            case"INF":
                            case"Inf":
                                return r * (1 / 0);
                            case"nan":
                            case"NAN":
                            case"Nan":
                            case"NaN":
                                return NaN;
                            case"0":
                                return 0
                        }
                        if (p.test(e)) return r * parseInt(e, 10);
                        if (y.test(e)) return r * parseInt(e, 16);
                        if (m.test(e)) return r * parseInt(e, 8);
                        if (w.test(e)) return r * parseFloat(e);
                        throw L(e, "number", t)
                    }(t, !0)
                } catch (r) {
                    if (e && S.test(t)) return t;
                    throw L(t, "value")
                }
            }

            function K(e, t) {
                var r, i;
                do {
                    !t || '"' !== (r = O()) && "'" !== r ? e.push([i = Y(T()), P("to", !0) ? Y(T()) : i]) : e.push(z())
                } while (P(",", !0));
                P(";")
            }

            function Y(e, t) {
                switch (e) {
                    case"max":
                    case"MAX":
                    case"Max":
                        return 536870911;
                    case"0":
                        return 0
                }
                if (!t && "-" === e.charAt(0)) throw L(e, "id");
                if (b.test(e)) return parseInt(e, 10);
                if (v.test(e)) return parseInt(e, 16);
                if (g.test(e)) return parseInt(e, 8);
                throw L(e, "id")
            }

            function H() {
                if (void 0 !== E) throw L("package");
                if (E = T(), !S.test(E)) throw L(E, "name");
                N = N.define(E), P(";")
            }

            function V() {
                var e, t = O();
                switch (t) {
                    case"weak":
                        e = M || (M = []), T();
                        break;
                    case"public":
                        T();
                    default:
                        e = x || (x = [])
                }
                t = z(), P(";"), e.push(t)
            }

            function J() {
                if (P("="), B = z(), !(U = "proto3" === B) && "proto2" !== B) throw L(B, "syntax");
                P(";")
            }

            function G(e, t) {
                switch (t) {
                    case"option":
                        return X(e, t), P(";"), !0;
                    case"message":
                        return function (e, t) {
                            if (!_.test(t = T())) throw L(t, "type name");
                            var r = new o(t);
                            W(r, function (e) {
                                if (!G(r, e)) switch (e) {
                                    case"map":
                                        !function (e) {
                                            P("<");
                                            var t = T();
                                            if (void 0 === d.mapKey[t]) throw L(t, "type");
                                            P(",");
                                            var r = T();
                                            if (!S.test(r)) throw L(r, "type");
                                            P(">");
                                            var i = T();
                                            if (!_.test(i)) throw L(i, "name");
                                            P("=");
                                            var n = new a(D(i), Y(T()), t, r);
                                            W(n, function (e) {
                                                if ("option" !== e) throw L(e);
                                                X(n, e), P(";")
                                            }, function () {
                                                ee(n)
                                            }), e.add(n)
                                        }(r);
                                        break;
                                    case"required":
                                    case"optional":
                                    case"repeated":
                                        $(r, e);
                                        break;
                                    case"oneof":
                                        !function (e, t) {
                                            if (!_.test(t = T())) throw L(t, "name");
                                            var r = new f(D(t));
                                            W(r, function (e) {
                                                "option" === e ? (X(r, e), P(";")) : (j(e), $(r, "optional"))
                                            }), e.add(r)
                                        }(r, e);
                                        break;
                                    case"extensions":
                                        K(r.extensions || (r.extensions = []));
                                        break;
                                    case"reserved":
                                        K(r.reserved || (r.reserved = []), !0);
                                        break;
                                    default:
                                        if (!U || !S.test(e)) throw L(e);
                                        j(e), $(r, "optional")
                                }
                            }), e.add(r)
                        }(e, t), !0;
                    case"enum":
                        return function (e, t) {
                            if (!_.test(t = T())) throw L(t, "name");
                            var r = new c(t);
                            W(r, function (e) {
                                switch (e) {
                                    case"option":
                                        X(r, e), P(";");
                                        break;
                                    case"reserved":
                                        K(r.reserved || (r.reserved = []), !0);
                                        break;
                                    default:
                                        !function (e, t) {
                                            if (!_.test(t)) throw L(t, "name");
                                            P("=");
                                            var r = Y(T(), !0), i = {};
                                            W(i, function (e) {
                                                if ("option" !== e) throw L(e);
                                                X(i, e), P(";")
                                            }, function () {
                                                ee(i)
                                            }), e.add(t, r, i.comment)
                                        }(r, e)
                                }
                            }), e.add(r)
                        }(e, t), !0;
                    case"service":
                        return function (e, t) {
                            if (!_.test(t = T())) throw L(t, "service name");
                            var r = new u(t);
                            W(r, function (e) {
                                if (!G(r, e)) {
                                    if ("rpc" !== e) throw L(e);
                                    !function (e, t) {
                                        var r = t;
                                        if (!_.test(t = T())) throw L(t, "name");
                                        var i, n, o, s, a = t;
                                        P("("), P("stream", !0) && (n = !0);
                                        if (!S.test(t = T())) throw L(t);
                                        i = t, P(")"), P("returns"), P("("), P("stream", !0) && (s = !0);
                                        if (!S.test(t = T())) throw L(t);
                                        o = t, P(")");
                                        var f = new h(a, r, i, o, n, s);
                                        W(f, function (e) {
                                            if ("option" !== e) throw L(e);
                                            X(f, e), P(";")
                                        }), e.add(f)
                                    }(r, e)
                                }
                            }), e.add(r)
                        }(e, t), !0;
                    case"extend":
                        return function (e, t) {
                            if (!S.test(t = T())) throw L(t, "reference");
                            var r = t;
                            W(null, function (t) {
                                switch (t) {
                                    case"required":
                                    case"repeated":
                                    case"optional":
                                        $(e, t, r);
                                        break;
                                    default:
                                        if (!U || !S.test(t)) throw L(t);
                                        j(t), $(e, "optional", r)
                                }
                            })
                        }(e, t), !0
                }
                return !1
            }

            function W(e, t, r) {
                var i = I.line;
                if (e && (e.comment = C(), e.filename = A.filename), P("{", !0)) {
                    for (var n; "}" !== (n = T());) t(n);
                    P(";", !0)
                } else r && r(), P(";"), e && "string" != typeof e.comment && (e.comment = C(i))
            }

            function $(e, t, r) {
                var i = T();
                if ("group" !== i) {
                    if (!S.test(i)) throw L(i, "type");
                    var n = T();
                    if (!_.test(n)) throw L(n, "name");
                    n = D(n), P("=");
                    var a = new s(n, Y(T()), i, t, r);
                    W(a, function (e) {
                        if ("option" !== e) throw L(e);
                        X(a, e), P(";")
                    }, function () {
                        ee(a)
                    }), e.add(a), U || !a.repeated || void 0 === d.packed[i] && void 0 !== d.basic[i] || a.setOption("packed", !1, !0)
                } else !function (e, t) {
                    var r = T();
                    if (!_.test(r)) throw L(r, "name");
                    var i = l.lcFirst(r);
                    r === i && (r = l.ucFirst(r));
                    P("=");
                    var n = Y(T()), a = new o(r);
                    a.group = !0;
                    var f = new s(i, n, r, t);
                    f.filename = A.filename, W(a, function (e) {
                        switch (e) {
                            case"option":
                                X(a, e), P(";");
                                break;
                            case"required":
                            case"optional":
                            case"repeated":
                                $(a, e);
                                break;
                            default:
                                throw L(e)
                        }
                    }), e.add(a).add(f)
                }(e, t)
            }

            function X(e, t) {
                var r = P("(", !0);
                if (!S.test(t = T())) throw L(t, "name");
                var i = t;
                r && (P(")"), i = "(" + i + ")", t = O(), k.test(t) && (i += t, T())), P("="), Z(e, i)
            }

            function Z(e, t) {
                if (P("{", !0)) do {
                    if (!_.test(R = T())) throw L(R, "name");
                    "{" === O() ? Z(e, t + "." + R) : (P(":"), "{" === O() ? Z(e, t + "." + R) : Q(e, t + "." + R, F(!0)))
                } while (!P("}", !0)); else Q(e, t, F(!0))
            }

            function Q(e, t, r) {
                e.setOption && e.setOption(t, r)
            }

            function ee(e) {
                if (P("[", !0)) {
                    do {
                        X(e, "option")
                    } while (P(",", !0));
                    P("]")
                }
                return e
            }

            for (; null !== (R = T());) switch (R) {
                case"package":
                    if (!q) throw L(R);
                    H();
                    break;
                case"import":
                    if (!q) throw L(R);
                    V();
                    break;
                case"syntax":
                    if (!q) throw L(R);
                    J();
                    break;
                case"option":
                    if (!q) throw L(R);
                    X(N, R), P(";");
                    break;
                default:
                    if (G(N, R)) {
                        q = !1;
                        continue
                    }
                    throw L(R)
            }
            return A.filename = null, {package: E, imports: x, weakImports: M, syntax: B, root: t}
        }
    }, function (e, t, r) {
        "use strict";
        e.exports = o;
        var i, n = /\/|\./;

        function o(e, t) {
            n.test(e) || (e = "google/protobuf/" + e + ".proto", t = {nested: {google: {nested: {protobuf: {nested: t}}}}}), o[e] = t
        }

        o("any", {
            Any: {
                fields: {
                    type_url: {type: "string", id: 1},
                    value: {type: "bytes", id: 2}
                }
            }
        }), o("duration", {
            Duration: i = {
                fields: {
                    seconds: {type: "int64", id: 1},
                    nanos: {type: "int32", id: 2}
                }
            }
        }), o("timestamp", {Timestamp: i}), o("empty", {Empty: {fields: {}}}), o("struct", {
            Struct: {
                fields: {
                    fields: {
                        keyType: "string",
                        type: "Value",
                        id: 1
                    }
                }
            },
            Value: {
                oneofs: {kind: {oneof: ["nullValue", "numberValue", "stringValue", "boolValue", "structValue", "listValue"]}},
                fields: {
                    nullValue: {type: "NullValue", id: 1},
                    numberValue: {type: "double", id: 2},
                    stringValue: {type: "string", id: 3},
                    boolValue: {type: "bool", id: 4},
                    structValue: {type: "Struct", id: 5},
                    listValue: {type: "ListValue", id: 6}
                }
            },
            NullValue: {values: {NULL_VALUE: 0}},
            ListValue: {fields: {values: {rule: "repeated", type: "Value", id: 1}}}
        }), o("wrappers", {
            DoubleValue: {fields: {value: {type: "double", id: 1}}},
            FloatValue: {fields: {value: {type: "float", id: 1}}},
            Int64Value: {fields: {value: {type: "int64", id: 1}}},
            UInt64Value: {fields: {value: {type: "uint64", id: 1}}},
            Int32Value: {fields: {value: {type: "int32", id: 1}}},
            UInt32Value: {fields: {value: {type: "uint32", id: 1}}},
            BoolValue: {fields: {value: {type: "bool", id: 1}}},
            StringValue: {fields: {value: {type: "string", id: 1}}},
            BytesValue: {fields: {value: {type: "bytes", id: 1}}}
        }), o("field_mask", {
            FieldMask: {
                fields: {
                    paths: {
                        rule: "repeated",
                        type: "string",
                        id: 1
                    }
                }
            }
        }), o.get = function (e) {
            return o[e] || null
        }
    }, function (e, t, r) {
        var i = r(61);
        e.exports = function (e) {
            var t, r, n = e.length, o = new Uint8Array(n);
            for (i(o); n > 1;) t = o[n - 1] % n, r = e[--n], e[n] = e[t], e[t] = r;
            return e
        }
    }, function (e, t, r) {
        var i = r(62), n = r(63);
        e.exports = function (e) {
            if (i.crypto && i.crypto.getRandomValues) return i.crypto.getRandomValues(e);
            if ("object" == typeof i.msCrypto && "function" == typeof i.msCrypto.getRandomValues) return i.msCrypto.getRandomValues(e);
            if (n.randomBytes) {
                if (!(e instanceof Uint8Array)) throw new TypeError("expected Uint8Array");
                if (e.length > 65536) {
                    var t = new Error;
                    throw t.code = 22, t.message = "Failed to execute 'getRandomValues' on 'Crypto': The ArrayBufferView's byte length (" + e.length + ") exceeds the number of bytes of entropy available via this API (65536).", t.name = "QuotaExceededError", t
                }
                var r = n.randomBytes(e.length);
                return e.set(r), e
            }
            throw new Error("No secure random number generator available.")
        }
    }, function (e, t, r) {
        (function (t) {
            var r;
            r = "undefined" != typeof window ? window : void 0 !== t ? t : "undefined" != typeof self ? self : {}, e.exports = r
        }).call(t, r(7))
    }, function (e, t) {
    }, function (e, t, r) {
        (function (t) {
            e.exports = t.WebSocket
        }).call(t, r(7))
    }, function (e, t) {
        e.exports = {
            options: {java_package: "ch.epfl.dedis.proto", java_outer_classname: "SkipchainProto"},
            nested: {
                cothority: {},
                Device: {fields: {point: {rule: "required", type: "bytes", id: 1}}},
                SchnorrSig: {
                    fields: {
                        challenge: {rule: "required", type: "bytes", id: 1},
                        response: {rule: "required", type: "bytes", id: 2}
                    }
                },
                ID: {fields: {id: {rule: "required", type: "bytes", id: 1}}},
                Data: {
                    fields: {
                        threshold: {rule: "required", type: "sint32", id: 1},
                        device: {keyType: "string", type: "Device", id: 2},
                        storage: {keyType: "string", type: "string", id: 3},
                        votes: {keyType: "string", type: "bytes", id: 4}
                    }
                },
                StoreKeys: {
                    fields: {
                        type: {rule: "required", type: "sint32", id: 1},
                        final: {type: "FinalStatement", id: 2},
                        publics: {rule: "repeated", type: "bytes", id: 3},
                        sig: {rule: "required", type: "bytes", id: 4}
                    }
                },
                CreateIdentity: {
                    fields: {
                        data: {type: "Data", id: 1},
                        roster: {type: "Roster", id: 2},
                        type: {rule: "required", type: "sint32", id: 3},
                        public: {rule: "required", type: "bytes", id: 4},
                        schnorrSig: {rule: "required", type: "bytes", id: 5},
                        sig: {rule: "required", type: "bytes", id: 6},
                        nonce: {rule: "required", type: "bytes", id: 7}
                    }
                },
                CreateIdentityReply: {fields: {root: {type: "SkipBlock", id: 1}, data: {type: "SkipBlock", id: 2}}},
                DataUpdate: {fields: {id: {rule: "required", type: "bytes", id: 1}}},
                DataUpdateReply: {fields: {data: {type: "Data", id: 1}}},
                ProposeSend: {fields: {id: {rule: "required", type: "bytes", id: 1}, data: {type: "Data", id: 2}}},
                ProposeUpdate: {fields: {id: {rule: "required", type: "bytes", id: 1}}},
                ProposeUpdateReply: {fields: {data: {type: "Data", id: 1}}},
                ProposeVote: {
                    fields: {
                        id: {rule: "required", type: "bytes", id: 1},
                        signer: {rule: "required", type: "string", id: 2},
                        signature: {type: "bytes", id: 3}
                    }
                },
                ProposeVoteReply: {fields: {data: {type: "SkipBlock", id: 1}}},
                PropagateIdentity: {
                    fields: {
                        tag: {rule: "required", type: "string", id: 1},
                        public: {rule: "required", type: "bytes", id: 2}
                    }
                },
                UpdateSkipBlock: {
                    fields: {
                        id: {rule: "required", type: "ID", id: 1},
                        latest: {type: "SkipBlock", id: 2}
                    }
                },
                Authenticate: {
                    fields: {
                        nonce: {rule: "required", type: "bytes", id: 1},
                        ctx: {rule: "required", type: "bytes", id: 2}
                    }
                },
                FinalStatement: {
                    fields: {
                        desc: {rule: "required", type: "PopDesc", id: 1},
                        attendees: {rule: "repeated", type: "bytes", id: 2},
                        signature: {rule: "required", type: "bytes", id: 3},
                        merged: {rule: "required", type: "bool", id: 4}
                    }
                },
                FinalStatementToml: {
                    fields: {
                        desc: {rule: "required", type: "PopDescToml", id: 1},
                        attendees: {rule: "repeated", type: "string", id: 2},
                        signature: {rule: "required", type: "string", id: 3},
                        merged: {rule: "required", type: "bool", id: 4}
                    }
                },
                PopDesc: {
                    fields: {
                        name: {rule: "required", type: "string", id: 1},
                        dateTime: {rule: "required", type: "string", id: 2},
                        location: {rule: "required", type: "string", id: 3},
                        roster: {rule: "required", type: "Roster", id: 4},
                        parties: {type: "ShortDesc", id: 5}
                    }
                },
                PopDescToml: {
                    fields: {
                        name: {rule: "required", type: "string", id: 1},
                        dateTime: {rule: "required", type: "string", id: 2},
                        location: {rule: "required", type: "string", id: 3},
                        roster: {rule: "repeated", type: "string", id: 4},
                        parties: {rule: "repeated", type: "bytes", id: 5}
                    }
                },
                ShortDesc: {
                    fields: {
                        location: {rule: "required", type: "string", id: 1},
                        roster: {rule: "required", type: "Roster", id: 2}
                    }
                },
                ShortDescToml: {
                    fields: {
                        location: {rule: "required", type: "string", id: 1},
                        roster: {rule: "repeated", type: "string", id: 2}
                    }
                },
                Roster: {
                    fields: {
                        id: {type: "bytes", id: 1},
                        list: {rule: "repeated", type: "ServerIdentity", id: 2, options: {packed: !1}},
                        aggregate: {rule: "required", type: "bytes", id: 3}
                    }
                },
                ServerIdentity: {
                    fields: {
                        public: {rule: "required", type: "bytes", id: 1},
                        id: {rule: "required", type: "bytes", id: 2},
                        address: {rule: "required", type: "string", id: 3},
                        description: {rule: "required", type: "string", id: 4}
                    }
                },
                SkipBlock: {
                    fields: {
                        index: {type: "int32", id: 1},
                        height: {type: "int32", id: 2},
                        maxHeight: {rule: "required", type: "int32", id: 3},
                        baseHeight: {rule: "required", type: "int32", id: 4},
                        backlinks: {type: "bytes", id: 5},
                        verifiers: {type: "bytes", id: 6},
                        parent: {type: "bytes", id: 7},
                        genesis: {type: "bytes", id: 8},
                        data: {rule: "required", type: "bytes", id: 9},
                        roster: {rule: "required", type: "Roster", id: 10},
                        hash: {type: "bytes", id: 11},
                        forward: {rule: "repeated", type: "BlockLink", id: 12, options: {packed: !1}},
                        children: {rule: "repeated", type: "BlockLink", id: 13, options: {packed: !1}}
                    }
                },
                SkipBlockMap: {fields: {skipblocks: {keyType: "string", type: "SkipBlock", id: 1}}},
                SkipBlockDataEntry: {
                    fields: {
                        key: {rule: "required", type: "string", id: 1},
                        data: {rule: "required", type: "bytes", id: 2}
                    }
                },
                SkipBlockData: {
                    fields: {
                        entries: {
                            rule: "repeated",
                            type: "SkipBlockDataEntry",
                            id: 1,
                            options: {packed: !1}
                        }
                    }
                },
                BlockLink: {
                    fields: {
                        hash: {rule: "required", type: "bytes", id: 1},
                        signature: {rule: "required", type: "bytes", id: 2},
                        exceptions: {rule: "repeated", type: "Exception", id: 3, options: {packed: !1}}
                    }
                },
                Exception: {
                    fields: {
                        index: {rule: "required", type: "uint32", id: 1},
                        commitment: {rule: "required", type: "bytes", id: 2}
                    }
                },
                GetBlock: {fields: {id: {rule: "required", type: "bytes", id: 1}}},
                GetSingleBlock: {fields: {id: {rule: "required", type: "bytes", id: 1}}},
                GetSingleBlockByIndex: {
                    fields: {
                        genesis: {rule: "required", type: "bytes", id: 1},
                        index: {rule: "required", type: "int32", id: 2}
                    }
                },
                GetBlockReply: {fields: {skipblock: {rule: "required", type: "SkipBlock", id: 1}}},
                LatestBlockRequest: {fields: {latestId: {rule: "required", type: "bytes", id: 1}}},
                LatestBlockResponse: {
                    fields: {
                        update: {
                            rule: "repeated",
                            type: "SkipBlock",
                            id: 1,
                            options: {packed: !1}
                        }
                    }
                },
                StoreSkipBlockRequest: {
                    fields: {
                        latestId: {rule: "required", type: "bytes", id: 1},
                        newBlock: {rule: "required", type: "SkipBlock", id: 2}
                    }
                },
                StoreSkipBlockResponse: {
                    fields: {
                        previous: {rule: "required", type: "SkipBlock", id: 1},
                        latest: {rule: "required", type: "SkipBlock", id: 2}
                    }
                },
                PropagateSkipBlock: {fields: {skipblock: {rule: "required", type: "SkipBlock", id: 1}}},
                PropagateSkipBlocks: {
                    fields: {
                        skipblocks: {
                            rule: "repeated",
                            type: "SkipBlock",
                            id: 1,
                            options: {packed: !1}
                        }
                    }
                },
                ForwardSignature: {
                    fields: {
                        targetHeight: {rule: "required", type: "int32", id: 1},
                        previous: {rule: "required", type: "bytes", id: 2},
                        newest: {rule: "required", type: "SkipBlock", id: 3},
                        forwardLink: {rule: "required", type: "BlockLink", id: 4}
                    }
                },
                Election: {
                    fields: {
                        name: {rule: "required", type: "string", id: 1},
                        creator: {rule: "required", type: "uint32", id: 2},
                        users: {rule: "repeated", type: "uint32", id: 3, options: {packed: !1}},
                        id: {rule: "required", type: "bytes", id: 4},
                        roster: {rule: "required", type: "Roster", id: 5},
                        key: {rule: "required", type: "bytes", id: 6},
                        stage: {rule: "required", type: "uint32", id: 8},
                        description: {type: "string", id: 9},
                        end: {type: "string", id: 10}
                    }
                },
                Ballot: {
                    fields: {
                        user: {rule: "required", type: "uint32", id: 1},
                        alpha: {rule: "required", type: "bytes", id: 2},
                        beta: {rule: "required", type: "bytes", id: 3}
                    }
                },
                Box: {fields: {ballots: {rule: "repeated", type: "Ballot", id: 1, options: {packed: !1}}}},
                Ping: {fields: {nonce: {rule: "required", type: "uint32", id: 1}}},
                Link: {
                    fields: {
                        pin: {rule: "required", type: "string", id: 1},
                        roster: {rule: "required", type: "Roster", id: 2},
                        key: {rule: "required", type: "bytes", id: 3},
                        admins: {rule: "repeated", type: "uint32", id: 4, options: {packed: !1}}
                    }
                },
                LinkReply: {fields: {master: {type: "bytes", id: 1}}},
                Login: {
                    fields: {
                        id: {rule: "required", type: "bytes", id: 1},
                        user: {rule: "required", type: "uint32", id: 2},
                        signature: {rule: "required", type: "bytes", id: 3}
                    }
                },
                LoginReply: {
                    fields: {
                        token: {rule: "required", type: "string", id: 1},
                        admin: {rule: "required", type: "bool", id: 2},
                        elections: {rule: "repeated", type: "Election", id: 3, options: {packed: !1}}
                    }
                },
                Open: {
                    fields: {
                        token: {rule: "required", type: "string", id: 1},
                        election: {rule: "required", type: "Election", id: 2},
                        id: {rule: "required", type: "bytes", id: 3}
                    }
                },
                OpenReply: {
                    fields: {
                        id: {rule: "required", type: "bytes", id: 1},
                        key: {rule: "required", type: "bytes", id: 2}
                    }
                },
                Cast: {
                    fields: {
                        token: {rule: "required", type: "string", id: 1},
                        id: {rule: "required", type: "bytes", id: 2},
                        ballot: {rule: "required", type: "Ballot", id: 3}
                    }
                },
                CastReply: {fields: {}},
                Shuffle: {
                    fields: {
                        token: {rule: "required", type: "string", id: 1},
                        id: {rule: "required", type: "bytes", id: 2}
                    }
                },
                ShuffleReply: {fields: {}},
                Decrypt: {
                    fields: {
                        token: {rule: "required", type: "string", id: 1},
                        id: {rule: "required", type: "bytes", id: 2}
                    }
                },
                DecryptReply: {fields: {}},
                GetBox: {
                    fields: {
                        token: {rule: "required", type: "string", id: 1},
                        id: {rule: "required", type: "bytes", id: 2}
                    }
                },
                GetBoxReply: {fields: {box: {rule: "repeated", type: "Box", id: 1, options: {packed: !1}}}},
                GetMixes: {
                    fields: {
                        token: {rule: "required", type: "string", id: 1},
                        id: {rule: "required", type: "bytes", id: 2}
                    }
                },
                Mix: {
                    fields: {
                        ballots: {rule: "repeated", type: "Ballot", id: 1, options: {packed: !1}},
                        proof: {rule: "required", type: "bytes", id: 2},
                        node: {rule: "required", type: "string", id: 3}
                    }
                },
                GetMixesReply: {fields: {mixes: {rule: "repeated", type: "Mix", id: 1, options: {packed: !1}}}},
                Partial: {
                    fields: {
                        points: {rule: "repeated", type: "bytes", id: 1},
                        flag: {rule: "required", type: "bool", id: 2},
                        node: {rule: "required", type: "string", id: 3}
                    }
                },
                GetPartials: {
                    fields: {
                        token: {rule: "required", type: "string", id: 1},
                        id: {rule: "required", type: "bytes", id: 2}
                    }
                },
                GetPartialsReply: {
                    fields: {
                        partials: {
                            rule: "repeated",
                            type: "Partial",
                            id: 1,
                            options: {packed: !1}
                        }
                    }
                },
                Reconstruct: {
                    fields: {
                        token: {rule: "required", type: "string", id: 1},
                        id: {rule: "required", type: "bytes", id: 2}
                    }
                },
                ReconstructReply: {fields: {points: {rule: "repeated", type: "bytes", id: 1}}},
                CheckConfig: {
                    fields: {
                        popHash: {rule: "required", type: "bytes", id: 1},
                        attendees: {rule: "required", type: "bytes", id: 2}
                    }
                },
                CheckConfigReply: {
                    fields: {
                        popStatus: {rule: "required", type: "sint32", id: 1},
                        popHash: {rule: "required", type: "bytes", id: 2},
                        attendees: {rule: "required", type: "bytes", id: 3}
                    }
                },
                MergeConfig: {
                    fields: {
                        final: {rule: "required", type: "FinalStatement", id: 1},
                        id: {rule: "required", type: "bytes", id: 2}
                    }
                },
                MergeConfigReply: {
                    fields: {
                        popStatus: {rule: "required", type: "sint32", id: 1},
                        popHash: {rule: "required", type: "bytes", id: 2},
                        final: {rule: "required", type: "FinalStatement", id: 3}
                    }
                },
                StoreConfig: {
                    fields: {
                        desc: {rule: "required", type: "PopDesc", id: 1},
                        signature: {rule: "required", type: "bytes", id: 2}
                    }
                },
                StoreConfigReply: {fields: {id: {rule: "required", type: "bytes", id: 1}}},
                FinalizeRequest: {
                    fields: {
                        descId: {rule: "required", type: "bytes", id: 1},
                        attendees: {rule: "repeated", type: "bytes", id: 2},
                        signature: {rule: "required", type: "bytes", id: 3}
                    }
                },
                FinalizeResponse: {fields: {final: {type: "FinalStatement", id: 1}}},
                FetchRequest: {fields: {id: {rule: "required", type: "bytes", id: 1}}},
                MergeRequest: {
                    fields: {
                        id: {rule: "required", type: "bytes", id: 1},
                        signature: {rule: "required", type: "bytes", id: 2}
                    }
                },
                PinRequest: {
                    fields: {
                        pin: {rule: "required", type: "string", id: 1},
                        public: {rule: "required", type: "bytes", id: 2}
                    }
                },
                PopToken: {
                    fields: {
                        final: {rule: "required", type: "FinalStatement", id: 1},
                        private: {rule: "required", type: "bytes", id: 2},
                        public: {rule: "required", type: "bytes", id: 3}
                    }
                },
                PopTokenToml: {
                    fields: {
                        final: {rule: "required", type: "FinalStatementToml", id: 1},
                        private: {rule: "required", type: "string", id: 2},
                        public: {rule: "required", type: "string", id: 3}
                    }
                },
                ClockRequest: {fields: {roster: {rule: "required", type: "Roster", id: 1}}},
                ClockResponse: {
                    fields: {
                        time: {rule: "required", type: "double", id: 1},
                        children: {rule: "required", type: "sint32", id: 2}
                    }
                },
                CountRequest: {fields: {}},
                CountResponse: {fields: {count: {rule: "required", type: "sint32", id: 1}}},
                KeyPair: {
                    fields: {
                        public: {rule: "required", type: "bytes", id: 1},
                        private: {rule: "required", type: "bytes", id: 2},
                        publicComplete: {type: "bytes", id: 3}
                    }
                },
                RandomRequest: {fields: {}},
                RandomResponse: {
                    fields: {
                        r: {rule: "required", type: "bytes", id: 1},
                        t: {rule: "required", type: "Transcript", id: 2}
                    },
                    nested: {
                        Transcript: {
                            fields: {
                                nodes: {rule: "required", type: "sint32", id: 1},
                                groups: {rule: "required", type: "sint32", id: 2},
                                purpose: {rule: "required", type: "string", id: 3},
                                time: {rule: "required", type: "fixed64", id: 4}
                            }
                        }
                    }
                },
                SignatureRequest: {
                    fields: {
                        message: {rule: "required", type: "bytes", id: 1},
                        roster: {rule: "required", type: "Roster", id: 2}
                    }
                },
                SignatureResponse: {
                    fields: {
                        hash: {rule: "required", type: "bytes", id: 1},
                        signature: {rule: "required", type: "bytes", id: 2}
                    }
                },
                Request: {fields: {}},
                Response: {
                    fields: {
                        system: {keyType: "string", type: "Status", id: 1},
                        server: {rule: "required", type: "ServerIdentity", id: 2}
                    }, nested: {Status: {fields: {field: {keyType: "string", type: "string", id: 1}}}}
                },
                GetUpdateChain: {fields: {latestId: {rule: "required", type: "bytes", id: 1}}},
                GetUpdateChainReply: {
                    fields: {
                        update: {
                            rule: "repeated",
                            type: "SkipBlock",
                            id: 1,
                            options: {packed: !1}
                        }
                    }
                },
                GetAllSkipchains: {fields: {}},
                GetAllSkipchainsReply: {
                    fields: {
                        skipchains: {
                            rule: "repeated",
                            type: "SkipBlock",
                            id: 1,
                            options: {packed: !1}
                        }
                    }
                }
            }
        }
    }, function (e, t, r) {
        "use strict";
        e.exports = r(25)
    }, function (e, t, r) {
        "use strict";
        t.uint8ArrayToHex = function (e) {
            if (e.constructor !== Uint8Array) throw new TypeError;
            return Array.from(e).map((e, t) => ("00" + e.toString(16)).slice(-2)).join("")
        }, t.hexToUint8Array = function (e) {
            if ("string" != typeof e) throw new TypeError;
            return new Uint8Array(Math.ceil(e.length / 2)).map((t, r) => parseInt(e.substr(2 * r, 2), 16))
        }, t.uint8ArrayCompare = function (e, t, r) {
            if (e.constructor !== Uint8Array) throw TypeError;
            if (t.constructor !== Uint8Array) throw TypeError;
            return e.length == t.length && (r ? function (e, t) {
                throw new Error("not implemented yet")
            }() : function (e, t) {
                for (var r = 0; r < e.length; r++) if (e[r] != t[r]) return !1;
                return !0
            }(e, t))
        }, t.getSetBits = function (e) {
            if (e.constructor !== Uint8Array) throw TypeError;
            const t = e.length, r = t << 3, i = [];
            for (var n = 0; n < r; n++) {
                var o = n >> 3, s = 1 << (7 & n);
                if (o < t && 0 != (e[o] & s)) {
                    var a = n % 8;
                    a = 7 - a + (o << 3), i.push(a)
                }
            }
            return i.sort((e, t) => e - t)
        }, t.getBitmaskLength = function (e) {
            if (e.constructor !== Uint8Array) throw TypeError;
            return e.length << 3
        }
    }, function (e, t, r) {
        "use strict";
        const i = r(69);
        e.exports.Client = i.Client
    }, function (e, t, r) {
        "use strict";
        const i = r(21), n = (r(18), r(20)), o = r(19), s = (r(36), r(17)), a = "Skipchain";
        e.exports.Client = class {
            constructor(e, t, r) {
                this.lastRoster = t, this.lastID = n.hexToUint8Array(r), this.group = e
            }

            get latestID() {
                return n.uint8ArrayToHex(this.lastID)
            }

            getLatestBlock() {
                return s.wrap(function* (e) {
                    const t = {latestId: e.lastID}, r = e.lastRoster.length;
                    for (var n = 0; n < r;) {
                        e.socket = new i.RosterSocket(e.lastRoster, a);
                        var s, f = null;
                        try {
                            f = yield e.socket.send("GetUpdateChain", "GetUpdateChainReply", t)
                        } catch (e) {
                            return Promise.reject(e)
                        }
                        try {
                            s = e.verifyUpdateChainReply(f)
                        } catch (e) {
                            n++;
                            continue
                        }
                        if (e.lastRoster = o.Roster.fromProtobuf(s.roster), e.lastID = s.hash, !s.forward || 0 == s.forward.length) return Promise.resolve(s)
                    }
                    return Promise.reject(n + " occured retrieving the latest block...")
                })(this)
            }

            verifyUpdateChainReply(e) {
                console.log("Verifying update...");
                const t = e.update;
                if (0 == t.length) throw new Error("no block returned in the chain");
                const r = t[0], i = new Uint8Array(r.hash);
                if (!n.uint8ArrayCompare(i, this.lastID)) throw new Error("the first ID is not the one we have");
                if (1 == t.length) return r;
                for (var s = r, a = 1; a < t.length; a++) {
                    const e = t[a], r = s.forward;
                    if (0 == r.length) throw new Error("No forward links included in the skipblocks");
                    r[r.length - 1], e.hash, o.Roster.fromProtobuf(s.roster), s = e
                }
                return s
            }

            verifyForwardLink(e, t, r) {
                r.signature.length;
                const i = group.pointLen();
                if (group.scalarLen(), r && r.signature.length < i + scalarLen) return new Error("signature length invalid");
                const n = r.signature.slice(i + scalarLen, r.signature.length);
                if (getBitmaskLength(n), bitmaskLength > e.length) return new Error("bitmask length invalid");
                const o = (e.length - 1) / 3;
                if (bitmaskLength > o) return new Error("nb of signers absent above threshold");
                const s = e.aggregateKey();
                getSetBits(n).forEach(t => {
                    s.sub(s, e.get(t))
                });
                const a = this.group.point().null();
                if (r.exceptions) {
                    const t = r.exceptions.length;
                    for (var f = 0; f < t; f++) {
                        var c = r.exceptions[f];
                        s.sub(s, e.get(c.index));
                        var u = group.point();
                        u.unmarshalBinary(c.commitment), a.add(a, u)
                    }
                }
                const h = group.point();
                h.unmarshalBinary(r.signature.slice(0, i));
                const d = h.clone();
                d.sub(d, commitment);
                const l = group.scalar();
                l.unmarshalBinary(r.signature.slice(i, i + scalarLen)), publicKey.marshalBinary();
                const p = schnorr.hashSchnorr(suite, h.marshalBinary(), s.marshalBinary(), t),
                    b = suite.point().mul(l, null), y = suite.point().mul(p, publicKey);
                return y.add(y, d), y.equal(b) ? null : new Error("invalid signature")
            }
        }
    }])
});