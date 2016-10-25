angular.module('app')
    .controller('ProfileComponentController', [
        'profileService', 
        function(profileService) {
            this.profile = profileService;
        }
    ])

    .component('profile', {
        templateUrl: 'profile.component.html',
        controller: 'ProfileComponentController',
        controllerAs: '$ctrl'
    });