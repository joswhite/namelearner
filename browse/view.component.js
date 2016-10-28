// angular.module('app')
// 	.component('view', {
// 		template: '<div>It\'s working!</div>',
// 		controller: [function() {/*['peopleService', function(peopleService) {*/
// 			/*this.view = peopleService.getPerson(1);
// 			this.update = function(name, phoneNumber, addressLine, index) {
// 				//alert(JSON.stringify([name, phoneNumber, addressLine, index]));
// 				if (name != null) { this.view.name = name; }
// 				else if (phoneNumber != null) { this.view.phoneNumbers[index] = phoneNumber; }
// 				else if (addressLine != null) { this.view.address[index] = addressLine; }
// 			}*/
// 		}]
// 	});

angular.module('app').component('view', {
	template:  '<h3>{{$ctrl.greeting}} Solar System!</h3>' +
	'<button ng-click="$ctrl.toggleGreeting()">toggle greeting</button>',

	controller: function() {
		this.greeting = 'hello';

		this.toggleGreeting = function() {
			this.greeting = (this.greeting == 'hello') ? 'whats up' : 'hello'
		}
	}
});
