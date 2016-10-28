angular.module('app')
	.factory("peopleService", PeopleService);

function PeopleService() {
	var service = {
		getPerson: getPerson
	};
	return service;

	function getPerson(id) {
		return {
			picture: 'default.jpg',
			name: 'Ana Swanlund',
			surname: 'Swanlund',
			phoneNumbers: ['425.881.4024','206.114.8613'],
			address: ['429 East Bay Drive', 'Suite 30, Apt 25', 'Fort Collins, Colorado']
		};
	}
}
