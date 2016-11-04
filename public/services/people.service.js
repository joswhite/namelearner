angular.module('app')
	.factory("peopleService", ['$resource', PeopleService]);

function PeopleService($resource) {
	return $resource('/api/people/:id');
}
