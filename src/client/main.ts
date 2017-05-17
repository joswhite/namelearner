import { module } from 'angular';
import AddComponent from './components/add.component';
import AddMultiComponent from './components/add-multi.component';
import JSONFileInputDirectiveFactory from './ux/json-file-input.directive';
import FileInputDirectiveFactory from './ux/file-input.directive';
import { FirstNameFilter, LastNameFilter } from './filters/filters';
import PeopleService from './services/people.service';
import routes from './routes';
import uiRouter from 'angular-ui-router';
import ViewComponent from './components/view.component';

let app = module('app', [uiRouter, 'ngResource']);

app.config(routes);
app.filter('firstName', FirstNameFilter);
app.filter('lastName', LastNameFilter);
app.directive('jsonFileInput', JSONFileInputDirectiveFactory);
app.directive('fileInput', FileInputDirectiveFactory);
app.component('addComponent', AddComponent);
app.component('addMultiComponent', AddMultiComponent);
app.component('viewComponent', ViewComponent);
app.service('PeopleService', PeopleService);
