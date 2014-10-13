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