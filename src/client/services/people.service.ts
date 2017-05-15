import * as ng from 'angular-resource';
import {IHttpService} from 'angular';

export interface IPeopleService {
	convertToPerson(data: IFormPerson): IPerson;
	delete(data: Object, callback?: Function): ng.resource.IResource<IPerson>
	get(data: Object, callback?: Function): ng.resource.IResource<IPerson>
	query(data: Object, callback?: Function): ng.resource.IResourceArray<ng.resource.IResource<IPerson>>
	remove(data: Object, callback?: Function): ng.resource.IResource<IPerson>
	save(data: Object, callback?: Function): ng.resource.IResource<IPerson>
	upload(id: string, picture: File, callback?: (url: string) => void): void;
}

export interface IFormPerson {
	address: string;
	name: string;
	phoneNumbers: string;
	picture?: string;
}

export interface IPerson {
	address: string[];
	group: string;
	_id?: string;
	name: string;
	phoneNumbers: string[];
	picture?: string;
}

function stringToArray(str: string) {
	return str ? str.split('\n') : [];
}

export default class PeopleService implements IPeopleService {
	fileReader: FileReader;
	resourceInstance: ng.resource.IResourceClass<ng.resource.IResource<IPerson>>;

	static $inject = ['$http', '$resource'];
	constructor(private $http: IHttpService, private $resource: ng.resource.IResourceService) {
		this.resourceInstance = $resource('/api/people/:id');
		this.fileReader = new FileReader();
	}

	convertToPerson(data: IFormPerson): IPerson {
		let person: IPerson = {
			address: stringToArray(data.address),
			group: null,
			name: data.name,
			phoneNumbers: stringToArray(data.phoneNumbers)
		};
		return person;
	}

	delete(data: Object, callback: Function): ng.resource.IResource<IPerson> {
		return this.resourceInstance.delete(data, callback);
	}

	get(data: Object, callback: Function): ng.resource.IResource<IPerson> {
		return this.resourceInstance.get(data, callback);
	}

	query(data: Object, callback: Function): ng.resource.IResourceArray<ng.resource.IResource<IPerson>> {
		return this.resourceInstance.query(data, callback);
	}

	remove(data: Object, callback: Function): ng.resource.IResource<IPerson> {
		return this.resourceInstance.remove(data, callback);
	}

	save(data: Object, callback: Function): ng.resource.IResource<IPerson> {
		return this.resourceInstance.save(data, callback);
	}

	upload(id: string, file: File, callback: (url: string) => void): void {
		this.fileReader.onload = sendRequest;
		this.fileReader.readAsArrayBuffer(file);

		let self = this;
		function sendRequest() {
			// Get binary data from ArrayBuffer via Uint8Array - see http://stackoverflow.com/questions/25152700
			let binaryData = new Uint8Array(self.fileReader.result);
			self.$http.post(`/api/people/${id}/upload`, binaryData, {
				headers: { 'Content-Type': file.type },
				transformRequest: []
			}).then(callback);
		}
	}
}
