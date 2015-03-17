/*
 * Copyright 2014 Alex Hyrenko <alex.hyrenko@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * BikeJS Library
 * Велосипед для личных нужд
 *
 * @ver 1.0
 * @author Alex Hyrenko
 * @email alex.hyrenko@gmail.com
 */

(function(scope, name) {
    "use strict";

    scope.BikeJS = function (selector) {
        return new BikeJS.Init(selector);
    };

    BikeJS.Modules = {};

    BikeJS.Core = BikeJS.prototype = {
        constructor: BikeJS,
        length: 0,

        getElements: function() {
            return [].slice.call(this);
        },

        each: function(func) {
            return [].forEach.call(this, func);
        },

        filter: function(func) {
            return [].filter.call(this, func);
        },

        pushElements: function(elements) {
            if (elements.length && elements != '') {
                return merge(BikeJS.Core.constructor(), elements);
            }

            return this;
        },

        extend: function () {
            for (var object in this.constructor.Modules) {
                for (var method in this.constructor.Modules[object]) {
                    this[method] = this.constructor.Modules[object][method];
                }
            }
        }
    };

    BikeJS.Init = function(selector) {
        if (!selector) {
            return this;
        }

        if (typeof selector === "string") {
            var elements = document.querySelectorAll(selector);

            return this.pushElements(elements);
        }
        else if (selector instanceof Node) {
            return this.pushElements([selector]);
        }
        else if (selector instanceof Object) {
            var tmp = [];
            this.each.call(selector, function(elem) {
                elem instanceof Node && tmp.push(elem);
            }.bind(this));

            return this.pushElements(tmp);
        }

        return this;
    };

    BikeJS.Modules.Events =  {
        cache: [],
        triggerCache: [],

        ready: function(callback) {
            this.on('DOMContentLoaded', function(e) {
                callback.bind(this)(e);
            }.bind(this));

            return this;
        },

        click: function(callback) {
            this.on('click', callback);

            return this;
        },

        focus: function() {
            this[0].focus();

            return this;
        },

        on: function(event, delegateName, callback) {
            if (this.length) {
                if (typeof delegateName === 'function') {
                    callback = delegateName;
                }
                else {
                    var userCallback = function(e) {
                        e.detail.name === delegateName && callback.call(e.detail.target, e);
                    }.bind(this);
                }

                this.each(function(el) {
                    event = event.split('.');
                    el.addEventListener(event[0], userCallback || callback, false);

                    this.cache.push({
                        name: event.join('.'),
                        handler: callback,
                        node: el
                    });
                }.bind(this));
            }
            else {
                document.addEventListener(event, callback, false);
            }

            return this;
        },

        trigger: function(event, detail) {
            this[0].dispatchEvent(new CustomEvent(event, { detail: detail }));
        },

        watch: function(event, watcher) {
            var delegateEvents = {
                    selectors: [],
                    callbacks: [],
                    default: null
                },
                settings = {
                    dataAttr: 'click',
                    scope: null
                };

            if (watcher && typeof watcher === 'function') {
                var tmp = watcher.call(this), t;
                for (var eventHandler in tmp) if(eventHandler !== 'settings') {
                    if (typeof tmp[eventHandler] !== 'function')
                        throw new Error('`'+ eventHandler +'` is not a function.');
                    t = tmp[eventHandler].call(this);

                    if (eventHandler === 'default') {
                        delegateEvents.default = t;
                    }
                    else {
                        if (t.selector && t.then && typeof t.then === 'function') {
                            delegateEvents.selectors.push([t.selector, t.selector + ' *']);
                            delegateEvents.callbacks.push(t.then);
                        }
                        else throw new Error('`'+ eventHandler +'` invalid params');
                    }
                }

                if (tmp.settings && tmp.settings.scope) {
                    settings.dataAttr = tmp.settings.dataAttr || settings.dataAttr;
                    settings.scope = tmp.settings.scope;

                    delegateEvents.selectors.push(['[data-' + settings.dataAttr + ']', '[data-' + settings.dataAttr + '] *']);
                }
            }

            this.then = function(selector, callback) {
                delegateEvents.selectors.push([selector, selector + ' *']);
                delegateEvents.callbacks.push(callback);

                return this;
            };

            this.on(event, function(e) {
                if (e.target.matches(delegateEvents.selectors)) {
                    for (var i = 0, c = delegateEvents.selectors.length; i < c; i++) {
                        var elem = findElementInParent(e.path, delegateEvents.selectors[i], this[0]);

                        if (elem && elem.dataset[settings.dataAttr]) {
                            settings.scope.$eval(elem.dataset[settings.dataAttr]);
                        }
                        else {
                            elem && delegateEvents.callbacks[i].call(this.pushElements([elem]), e);
                        }
                    }
                }
                else {
                    delegateEvents.default && delegateEvents.default.call(this.pushElements([e.target]));
                }
            }.bind(this));

            return this;
        },

        off: function(event) {
            if (this.length) {
                this.cache = this.cache.filter(function(item) {
                    if (~item.name.indexOf('.') && item.name === event) {
                        item.node.removeEventListener(event.split('.')[0], item.handler, false);

                        return false;
                    }
                    else {
                        var result = true;
                        this.each(function(element) {
                            if (item.name === event && item.node === element) {
                                element.removeEventListener(event, item.handler, false);

                                result = false
                            }
                            else result = true;
                        });

                        return result;
                    }
                }.bind(this));
            }

            return this;
        },

        observe: function(callback, config) {
            if (this.length && typeof callback === 'function') {
                var config = config || { childList: true, subtree: true },
                    observer = new MutationObserver(callback);

                this.each(function(el) {
                    observer.observe(el, config);
                });
            }

            return this;
        },

        unObserve: function() {

        }
    };

    BikeJS.Modules.DOM = {
        html: function(value) {
            if (value) {
                this.each(function(el) {
                    el.innerHTML = value;
                });
            }

            return value ? this : this[0].innerHTML;
        },

        text: function(value) {
            if (value) {
                this.each(function(el) {
                    el.innerText = value;
                });

                return this;
            }

            return this[0].innerText;
        },

        val: function(value) {
            if (value) {
                this.each(function(el) {
                    el.value = value;
                });

                return this;
            }

            return this[0].value;
        },

        append: function(html) {
            this.toElements('insertAdjacentHTML', 'beforeend', html);

            return this;
        },

        afret: function(html) {
            this.toElements('insertAdjacentHTML', 'afterend', html);

            return this;
        },

        prepend: function(html) {
            this.toElements('insertAdjacentHTML', 'afterbegin', html);

            return this;
        },

        before: function(html) {
            this.toElements('insertAdjacentHTML', 'beforebegin', html);

            return this;
        },

        parent: function(className) {
            var _parents = [];
            this.each(function(el) {
                _parents.push(className ? el.parentNode.classList.contains(className) : el.parentNode);
            });

            return this.pushElements(_parents);
        },

        parents: function(selector) {
            var elem = this[0];

            while((elem = elem.parentNode) && elem !== this[0]) {
                if (elem.nodeType === 1) {
                    if (selector && elem.matches(selector)) {
                        return this.pushElements([elem]);
                    }
                }
            }

            return !selector ? this.pushElements(matched) : false;
        },

        next: function() {
            return this.pushElements([this[0].nextSibling.nextSibling]);
        },

        prev: function() {
            return this.pushElements([this[0].previousElementSibling]);
        },

        attr: function(key, value) {
            if (value) {
                this.toElements('setAttribute', key, value);
            }

            return value ? this : this[0].getAttribute(key);
        },

        data: function(key, value) {
            if (value || typeof key === "object") {
                this.each(function(element) {
                    if (typeof key === "object") {
                        for (var obj in key) {
                            element.dataset[obj] = key[obj];
                        }
                    }
                    else {
                        element.dataset[key] = value;
                    }
                });

                return this;
            }

            if (!key) {
                return this[0].dataset;
            }

            return this[0].dataset[key];
        },

        addClass: function(name) {
            this.each(function(el) {
                el.classList.add(name);
            });

            return this;
        },

        hasClass: function(name) {
            return this[0].classList.contains(name);
        },

        toggleClass: function(name) {
            this.each(function(el) {
                el.classList.toggle(name);
            });

            return this;
        },

        removeClass: function(name) {
            this.each(function(el) {
                el.classList.remove(name);
            });

            return this;
        },

        index: function () {
            return [].slice.call(this[0].parentNode.children).indexOf(this[0]);
        },

        find: function(selector) {
            var elements = [].reduce.call(this.getElements(), function matcher(arr, elem) {
                var matches = elem.querySelectorAll(selector);
                if (matches.length) {
                    [].forEach.call(matches, function pusher(item) {
                        arr.push(item);
                    });
                }

                return arr;
            }, []);

            return this.pushElements(elements);
        },

        last: function() {
            return this.pushElements(this.getElements().slice(-1));
        },

        first: function() {
            return this.pushElements([this[0]]);
        },

        eq: function(index) {
            if (typeof index === "number" && this[index]) {
                return this.pushElements([this[index]]);
            }

            return this;
        },

        remove: function() {
            this.each(function(el) {
                el.parentNode.removeChild(el);

                /*if (this._events[el].length) {
                    var events = this._events[el];

                    for (var i = 0; i < events.length; i++) {
                        el.removeEventListener(events[i]['event'], events[i]['func'], false);
                    }

                    events.length = 0;
                }*/
            }.bind(this));

            return this.pushElements([document]);
        },

        toElements: function() {
            if (typeof document.body[arguments[0]] === "function") {
                var args = arguments;

                this.each(function(el) {
                    el[args[0]].apply(el, [].slice.call(args, 1));
                });
            }

            return this;
        },

        children: function() {
            return this.pushElements([this[0].children]);
        }
    };

    BikeJS.Modules.Styles = {
        show: function() {
            this.each(function(el) {
                el.style.display = '';
            });

            return this;
        },

        hide: function() {
            this.each(function(el) {
                el.style.display = 'none';
            });

            return this;
        },

        css: function(style, value) {
            this.each(function(el) {
                el.style[style] = (typeof value !== 'number' ? value : value + 'px');
            });

            return this;
        },

        width: function(value) {
            return value ? this.css('width', (~value.indexOf('px') ? value : value + 'px')) : this[0].clientWidth;
        },

        height: function(value) {
            return value ? this.css('height', ~toString(value).indexOf('px') ? value : value + 'px') : this[0].clientHeight;
        }
    };

    function findElementInParent(collection, classList, parentElement) {
        if (collection && collection.length) {
            for (var i = 0, c = collection.length; i < c; ++i) {
                if (parentElement && collection[i] === parentElement) return false;

                if (collection[i].matches(classList[0])) return collection[i];
            }

            return false;
        }
        else {
            throw new Error('Invalid arguments');
        }
    }

    function merge(first, second) {
        var length = +second.length,
            j = 0,
            i = first.length;

        while ( j < length ) {
            first[i++] = second[j++];
        }

        first.length = i;

        return first;
    };

    BikeJS.Core.extend();

    BikeJS.Init.prototype = BikeJS.Core;

    scope.$ = BikeJS;
})(window);