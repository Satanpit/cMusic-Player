Player.directive('toggle', function() {
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
});

Player.directive('playlist', function() {
    return {
        link: function($scope, element) {
            element.on('click', function(e) {
                var elem = e.target;

                if (elem.classList.contains('artist')) {

                }
                else {
                    var audio = element[0].parentNode.children.item('audio');
                    console.log(elem);
                }
            });
        }
    }
});