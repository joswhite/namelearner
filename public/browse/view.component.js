angular.module('app')
	.component('viewComponent', {
		templateUrl: 'browse/view.component.html',
		controller: ['peopleService', function(peopleService) {
			/*this.person = peopleService.get({ id: '581b936ea1c97717a88128cb' });*/
			var self = this;
			window.newObj = this;
			peopleService.getPeople().then(
				function(people) {
					self.person = people.data[0];
					console.log(self.person, people.data[0]);
					console.log('of' + JSON.stringify(people));
				}, function(error) {
					throw error;
				}
			)

			this.update = function(name, phoneNumber, addressLine, index) {
				//alert(JSON.stringify([name, phoneNumber, addressLine, index]));
				if (name != null) { this.view.name = name; }
				else if (phoneNumber != null) { this.view.phoneNumbers[index] = phoneNumber; }
				else if (addressLine != null) { this.view.address[index] = addressLine; }
			}
		}]
	});