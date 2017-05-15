import * as ng from 'angular-resource';
import {IPerson} from '../../server/models/person';
import {IHttpService} from 'angular';

export interface IPeopleService {
	delete(data: Object, callback?: Function): ng.resource.IResource<IPerson>
	get(data: Object, callback?: Function): ng.resource.IResource<IPerson>
	query(data: Object, callback?: Function): ng.resource.IResourceArray<ng.resource.IResource<IPerson>>
	remove(data: Object, callback?: Function): ng.resource.IResource<IPerson>
	save(data: Object, callback?: Function): ng.resource.IResource<IPerson>
	upload(id: string, picture: File, callback: (url: string) => void): void;
}

export default class PeopleService implements IPeopleService {
	fileReader: FileReader;
	resourceInstance: ng.resource.IResourceClass<ng.resource.IResource<IPerson>>;

	static $inject = ['$http', '$resource'];
	constructor(private $http: IHttpService, private $resource: ng.resource.IResourceService) {
		this.resourceInstance = $resource('/api/people/:id');
		this.fileReader = new FileReader();
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
