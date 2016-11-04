angular.module('app')
	.factory("peopleService", ['$http', '$resource', PeopleService]);

function PeopleService($http, $resource) {
	var service = {
		addPerson: addPerson,
		addPeople: addPeople,
		deletePerson: deletePerson,
		getPeople: getPeople,
		getPerson: getPerson,
		updatePerson: updatePerson
	};
	return service;

	//return $resource('/api/people/:id');

	function addPerson() {

	};

	function addPeople() {

	};

	function deletePerson(id) {

	};

	function getPeople() {
		return $http.get('/api/people');
	};

	function getPerson(id) {
		return $http.get('/api/people/4Db');
	};

	function updatePerson(id) {

	};
}
