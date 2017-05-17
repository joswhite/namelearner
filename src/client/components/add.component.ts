import { Component } from '../component';
import {IFormPerson, IPeopleService} from '../services/people.service';

@Component({
	stylesheetUrl: require('components/add.component.scss'),
	templateUrl: require('components/add.component.html')
})
export default class AddComponent {
	static $inject = ['PeopleService'];
	constructor(private peopleService: IPeopleService) {}

	addData(formPerson: IFormPerson, pictures: File[]) {
		let person = this.peopleService.convertToPerson(formPerson);
		let savedPerson = this.peopleService.save(person, () => {
			if (!pictures || !pictures[0]) {
				return;
			}

			let id = savedPerson.toJSON()._id;
			this.peopleService.upload(id, pictures[0]);
		});
	}
}
