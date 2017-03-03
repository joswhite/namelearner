import * as angular from 'angular-resource';

export default PeopleService;

function PeopleService($resource: angular.resource.IResourceService) {
	return $resource('/api/people/:id');
};

PeopleService.$inject = ['$resource'];