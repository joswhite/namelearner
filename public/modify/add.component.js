angular.module('app')
    .component('addComponent', {
        templateUrl: 'modify/add.component.html',
        controller: ['peopleService', function(peopleService, $scope) {
            return {
                addPerson: function(person) {
                    person.address = person.address.split('\n');
                    person.phoneNumbers = person.phoneNumbers.split('\n');
                    peopleService.save(person);
                }
            }
        }]
    });