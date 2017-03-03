angular.module('app')
	.component('editComponent', {
		templateUrl: 'modify/edit.component.html',
		controller: ['PersonService', function(peopleService) {
			this.name = this.people.name;
		}],
		bindings: {
			person: '<',
			onUpdate: '&'
		}
	});