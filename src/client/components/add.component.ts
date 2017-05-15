import { Component } from '../component';
import {IPeopleService} from '../services/people.service';

@Component({
	stylesheetUrl: require('components/add.component.scss'),
	templateUrl: require('components/add.component.html')
})
export default class AddComponent {
	static $inject = ['PeopleService'];
	constructor(private peopleService: IPeopleService) {}

	addData(person, picture) {
		let savedPerson = this.peopleService.save(person, () => {
			let id = savedPerson.toJSON()._id;
			this.peopleService.upload(id, picture, (url: string) => {
				console.log(url);
			})
		});
	}

	addPerson(person) {
		person.address = person.address.split('\n');
		person.phoneNumbers = person.phoneNumbers.split('\n');
		this.peopleService.save(person);
	}

	addJSONData(people) {
        this.peopleService.save(people);
	}
}
