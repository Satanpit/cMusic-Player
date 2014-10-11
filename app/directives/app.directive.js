function ToggleDirective() {
    "use strict";

    return {
        scope: {
            toggle: '='
        },
        link: function($scope, element) {
            $scope.$watch("toggle", function(value) {
                element.toggleClass('active', value);
            });

            element.on('click', function() {
                $scope.$apply(function() {
                    $scope.toggle = !$scope.toggle;
                });
            });
        }
    }
}

function ImageDirective(Utils) {
    "use strict";

    return {
        restrict:'A',

        link: function(scope, element, attr) {
            attr.$observe('link', function() {
                if(attr.link) {
                    Utils.loadBlobImage(attr.link).then(function(response) {
                        element[0].src = response;
                    });
                }
            });
        }
    }
}

function PlaylistDirective() {
    "use strict";

    return {
        link: function($scope, element) {
            element.on('click', function(e) {
                var elem = e.target;

                if (elem.classList.contains('artist')) {

                }
                else {
                    $scope.play(elem.dataset.url);
                }
            });
        }
    }
}