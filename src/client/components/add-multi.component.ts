import { Component } from '../component';

@Component({
    stylesheetUrl: require('components/add-multi.component.scss'),
    templateUrl: require('components/add-multi.component.html')
})
export default class AddMultiComponent {
    static $inject = ['PeopleService'];
    constructor(private peopleService: any) {}

    addData(form) {
        if (form.jsonData) {
            this.addJSONData(form.jsonData);
        }
        else {
            let person = {
                name: form.name,
                phoneNumbers: form.phoneNumbers,
                address: form.address,
                picture: form.picture
            };
            this.addPerson(person);
        }
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
