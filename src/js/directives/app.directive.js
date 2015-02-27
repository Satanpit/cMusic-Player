"use strict";

function ToggleDirective() {
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

function ClickDelegateDirective() {
    return {
        restrict: 'A',

        link: function(scope, element) {
            var elem;

            $(element).on('click', function(e) {
                if (e.target.matches(['[data-click]', '[data-click] *'])) {
                    elem = !angular.isUndefined(e.target.dataset['click']) ? e.target : e.target.parentNode;

                    if (angular.isUndefined(elem.dataset['click'])) {
                        for (var i = 0, c = elem.path.length; i < c; ++i) {
                            if (elem.path[i] === this[0]) return false;

                            if (!angular.isUndefined(elem.path[i].dataset['click'])) {
                                elem = elem.path[i];
                                return false;
                            }
                        }
                    }

                    if (elem) {
                        if (!angular.isUndefined(elem.dataset['clickName'])) {
                            $(this).trigger('delegate', {
                                name: elem.dataset['clickName'] || 'default',
                                target: elem
                            })
                        }

                        !angular.isUndefined(elem.dataset['click']) && scope.$apply(elem.dataset['click']);
                    }
                }
            });
        }
    }
}

function ScrollBarDirective() {
    return {
        scope: {
            offset: '=uiScrollbarOffset',
            observe: '=uiScrollbarObserve',
            shadowBox: '@uiScrollbarShadowBox'
        },

        link: function(scope, element) {
            var block = $(element),
                children = element[0].children[0],
                observe = scope.observe || true,
                offset = scope.offset || {
                    top: 20,
                    bottom: 20
                };

            if (scope.shadowBox) {
                var shadowBox = $(scope.shadowBox);
            }

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

                if (shadowBox) {
                    e.target.scrollTop > 0 ? shadowBox.addClass('shadow') : shadowBox.removeClass('shadow');
                }

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
    return {
        restrict:'EA',
        replace: true,
        template: '<img>',

        link: function(scope, element, attr) {
            attr.$observe('src', function(src) {
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
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        templateUrl: 'templates/main/playlistView.html',

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