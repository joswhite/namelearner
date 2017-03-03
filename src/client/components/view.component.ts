import { Component } from '../component';

@Component({
	stylesheetUrl: require('components/view.component.scss'),
	templateUrl: require('components/view.component.html')
})
export default class ViewComponent {
	private people: any;
	private userId: any;
	static $inject = ['PeopleService', '$stateParams'];
	constructor(private peopleService: any, private $stateParams: any) {
		this.people = peopleService.query();
		this.userId = $stateParams['id'];
		//this.person = peopleService.get({ id: '581b936ea1c97717a88128cb' });
	}

	update(name, phoneNumber, addressLine, index) {
		//alert(JSON.stringify([name, phoneNumber, addressLine, index]));
		// if (name != null) { this.view.name = name; }
		// else if (phoneNumber != null) { this.view.phoneNumbers[index] = phoneNumber; }
		// else if (addressLine != null) { this.view.address[index] = addressLine; }
	}
}
