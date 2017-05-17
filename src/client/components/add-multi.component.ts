import { Component } from '../component';
import {IFormPerson, IPeopleService} from '../services/people.service';
import {IPerson} from '../../server/models/person';

@Component({
    stylesheetUrl: require('components/add-multi.component.scss'),
    templateUrl: require('components/add-multi.component.html')
})
export default class AddMultiComponent {
    static $inject = ['PeopleService'];
    constructor(private peopleService: IPeopleService) {}

    addData(people: IFormPerson[], pictures: File[]) {
        // Organize pictures into object
        let organizedPictures: {[key: string]: File} = {};
        for (let index = 0; index < pictures.length; index++) {
            let picture = pictures[index];
            let photoName = picture.name.split('.')[0]; // Remove extensions to match data from downloadInfo.ts
            organizedPictures[photoName] = picture;
        }

        // Upload each person, then their picture
        let personIndex = 0;
        let nextPerson = null;
        let nextPicture = null;
        let self = this;
        addNextPerson();

        function addNextPerson() {
            if (personIndex >= people.length) {
                return alert('Images finished uploading!');
            }

            nextPerson = self.peopleService.convertToPerson(people[personIndex]);
            nextPicture = organizedPictures[people[personIndex].picture];
            self.addPerson(nextPerson, nextPicture, addNextPerson);
            personIndex++;
        }
    }

    addPerson(person: IPerson, picture: File, callback: Function) {
        let savedPerson = this.peopleService.save(person, () => {
            let id = savedPerson.toJSON()._id;

            if (!picture) {
                return callback();
            }

            this.peopleService.upload(id, picture, (url: string) => {
                callback();
            });
        });
    }
}
