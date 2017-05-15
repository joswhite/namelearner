import { IAttributes, IAugmentedJQuery, IDirective, IParseService, IScope } from 'angular';

class FileInputDirective implements IDirective {
	restrict = 'A';

	constructor(private $parse: IParseService) {}

	link($scope: IScope, iElement: IAugmentedJQuery, iAttributes: IAttributes) {
		let self = this;

		iElement.bind('change', function () {
			let fileList: FileList = iElement[0]['files'];
			self.$parse(iAttributes['fileInput'])
                .assign($scope, fileList);
			$scope.$apply();
		});
	}
}

FileInputDirective.$inject = [ '$parse' ];
export default function FileInputDirectiveFactory($parse: IParseService): IDirective {
	return new FileInputDirective($parse);
};
