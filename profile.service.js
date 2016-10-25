angular.module('app')
    .factory("profileService", [
        function() {
            function addPerson() {

            }

            return {
                addPerson: addPerson,
                picture: 'default.jpg',
                name: 'Ana Swanlund',
                surname: 'Swanlund',
                phoneNumbers: ['425.881.4024','206.114.8613'],
                address: ['429 East Bay Drive', 'Suite 30, Apt 25', 'Fort Collins, Colorado']
            }
        }
    ]);