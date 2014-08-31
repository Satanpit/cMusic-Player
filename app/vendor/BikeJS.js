/**
 * BikeJS Library
 * Велосипед для личных нужд
 *
 * @ver 1.0
 * @author Alex Hyrenko
 * @email alex.hyrenko@gmail.com
 */

(function(scope) {
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

        each: function(elements, func) {
              [].forEach.call(elements, func);
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

        return this;
    };

    BikeJS.Modules.Events =  {
        _events: [],

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

        on: function(event, callback) {
            var elements = this.getElements();

            if (elements.length) {
                this.each(elements, function(el) {
                    el.addEventListener(event, callback, false);

                    if (!this._events[el]) {
                        this._events[el] = [];
                    }

                    this._events[el].push({
                        event: event,
                        func: callback
                    });
                }.bind(this));
            }
            else {
                document.addEventListener(event, callback, false);
            }

            return this;
        },

        off: function(event, callback) {
            var elements = this.getElements();

            if (elements.length) {
                this.each(elements, function(el) {
                    el.removeEventListener(event, callback, false);
                });
            }
            else {
                document.removeEventListener(event, callback, false);
            }

            return this;
        }
    };

    BikeJS.Modules.DOM = {
        html: function(value) {
            if (value) {
                this.each(this.getElements(), function(el) {
                    el.innerHTML = value;
                });
            }

            return value ? this : this[0].innerHTML;
        },

        text: function(value) {
            if (value) {
                this.each(this.getElements(), function(el) {
                    el.innerText = value;
                });

                return this;
            }

            return this[0].innerText;
        },

        val: function(value) {
            if (value) {
                this.each(this.getElements(), function(el) {
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

        parent: function() {
            var _parents = [];
            this.each(this.getElements(), function(el) {
                _parents.push(el.parentNode);
            });

            return this.pushElements(_parents);
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
                this.each(this.getElements(), function(element) {
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
            this.each(this.getElements(), function(el) {
                el.classList.add(name);
            });

            return this;
        },

        hasClass: function(name) {
            return this[0].classList.contains(name);
        },

        toggleClass: function(name) {
            this.each(this.getElements(), function(el) {
                el.classList.toggle(name);
            });

            return this;
        },

        removeClass: function(name) {
            this.each(this.getElements(), function(el) {
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
            this.each(this.getElements(), function(el) {
                el.parentNode.removeChild(el);

                if (this._events[el].length) {
                    var events = this._events[el];

                    for (var i = 0; i < events.length; i++) {
                        el.removeEventListener(events[i]['event'], events[i]['func'], false);
                    }

                    events.length = 0;
                }
            }.bind(this));

            return this.pushElements([document]);
        },

        toElements: function() {
            if (typeof document.body[arguments[0]] === "function") {
                var args = arguments;

                this.each(this.getElements(), function(el) {
                    el[args[0]].apply(el, [].slice.call(args, 1));
                });
            }

            return this;
        }
    };

    BikeJS.Modules.Styles = {
        show: function() {
            this.each(this.getElements(), function(el) {
                el.style.display = '';
            });

            return this;
        },

        hide: function() {
            this.each(this.getElements(), function(el) {
                el.style.display = 'none';
            });

            return this;
        }
    };

    var merge = function(first, second) {
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
})(window);