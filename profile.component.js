angular
    .module('app')
    .component('profile', {
        templateUrl: 'profile.component.html',
        controller: function() {
            this.picture = 'default.jpg';
            this.name = 'Ana Swanlund';
            this.surname = 'Swanlund';
            this.phoneNumbers = ['425.881.4024','206.114.8613'];
            this.address = ['429 East Bay Drive', 'Suite 30, Apt 25', 'Fort Collins, Colorado'];
        }
    });