import { IAttributes, IAugmentedJQuery, IDirective, IParseService, IScope } from 'angular';

class JSONFileInputDirective implements IDirective {
	restrict = 'A';

	constructor(private $parse: IParseService) {}

	link($scope: IScope, instanceElement: IAugmentedJQuery, instanceAttributes: IAttributes) {
		let self = this;
		let fileReader = new FileReader();
		fileReader.onload = () => {
			try {
				let jsonData = JSON.parse(fileReader.result);
				self.$parse(instanceAttributes['jsonFileInput'])
					.assign($scope, jsonData);
				$scope.$apply();
			} catch(exception) {
				console.error(exception);
				alert('Error parsing JSON file! Please try again.');
			}
		};

		instanceElement.bind('change', function () {
			let fileList: FileList = instanceElement[0]['files'];
			let file = fileList[0];
			fileReader.readAsText(file);
		});
	}
}

JSONFileInputDirective.$inject = [ '$parse' ];
export default function JSONFileInputDirectiveFactory($parse: IParseService): IDirective {
	return new JSONFileInputDirective($parse);
};
