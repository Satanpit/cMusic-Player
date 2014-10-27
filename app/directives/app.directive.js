function ToggleDirective() {
    "use strict";

    return {
        scope: {
            toggle: '='
        },
        link: function(scope, element) {
            scope.$watch("toggle", function(value) {
                element.toggleClass('active', value);
            });

            element.on('click', function() {
                scope.$apply(function() {
                    scope.toggle = !scope.toggle;
                });
            });
        }
    }
}

function EventsToggleMenu() {
    "use strict";

    return {
        link: function(scope, element) {
            element.on('click', function() {
                var showed = $('.event-options.show'),
                    parent = element.parent();

                if (parent.hasClass('show')) {
                    parent.removeClass('show');
                }
                else {
                    showed.removeClass('show');
                    parent.addClass('show');
                }
            });
        }
    }
}

function ScrollBarDirective() {
    "use strict";

    return {
        scope: {
            offset: '=uiScrollbarOffset',
            observe: '=uiScrollbarObserve'
        },

        link: function(scope, element) {
            var block = $(element[0]),
                children = element[0].children[0],
                observe = scope.observe || true,
                offset = scope.offset || {
                    top: 20,
                    bottom: 20
                };

            block.afret('<div class="ui-scrollbar"><div></div></div>');

            var scrollBarParent = block.parent().find('.ui-scrollbar'),
                scrollBarContent = scrollBarParent.find('div');

            scrollBarParent.css('top', block[0].offsetTop + offset.top);
            scrollBarContent.height(Math.max(children.scrollHeight, children.clientHeight) - (offset.top + offset.bottom));

            observe && block.observe(function() {
                scrollBarContent.height(Math.max(children.scrollHeight, children.clientHeight) - (offset.top + offset.bottom));
            });

            block.on('scroll.scrollbar', function(e) {
                scrollBarParent[0].scrollTop = e.target.scrollTop;
            });

            scrollBarParent.on('scroll.scrollbar', function(e) {
                block[0].scrollTop = e.target.scrollTop;
            });

            block.on('mouseenter.scrollbar', function() {
                scrollBarParent.addClass('show');
            }).on('mouseleave.scrollbar', function(e) {
                (e.toElement == null || !e.toElement.classList.contains('ui-scrollbar')) && scrollBarParent.removeClass('show');
            });
        }
    }
}

function ImageDirective(Utils) {
    "use strict";

    return {
        restrict:'EA',
        replace: true,
        template: '<img>',

        link: function(scope, element, attr) {
            attr.$observe('imageSrc', function(src) {
                Utils.loadBlobImage(src).then(function(response) {
                    element[0].src = response;
                });
            });
        }
    }
}

function LoaderDirective() {

}

function PlaylistDirective() {
    "use strict";

    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        templateUrl: 'views/main/playlistView.html',

        link: function(scope, element, attr) {
            /*element.on('click', function(e) {
                var elem = e.target;

                if (elem.classList.contains('artist')) {

                }
                else {
                    $scope.play(elem.dataset.url);
                }
            });*/
        }
    }
}