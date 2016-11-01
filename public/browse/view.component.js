angular.module('app')
	.component('viewComponent', {
		templateUrl: 'browse/view.component.html',
		controller: ['peopleService', function(peopleService) {
			this.person = peopleService.getPerson(1);
			this.update = function(name, phoneNumber, addressLine, index) {
				//alert(JSON.stringify([name, phoneNumber, addressLine, index]));
				if (name != null) { this.view.name = name; }
				else if (phoneNumber != null) { this.view.phoneNumbers[index] = phoneNumber; }
				else if (addressLine != null) { this.view.address[index] = addressLine; }
			}
		}]
	});