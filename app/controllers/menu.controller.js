Player.controller('MenuCtrl', function($scope) {

    $scope.toggleShow = function() {
        this.isMenuShow = !this.isMenuShow;
    }
});