import { module } from 'angular';
import AddComponent from './components/add.component';
import JSONFileInputDirectiveFactory from './ux/json-file-input.directive';
import { FirstNameFilter, LastNameFilter } from './filters/filters';
import PeopleService from './services/people.service';
import routes from './routes';
import uiRouter from 'angular-ui-router';
import ViewComponent from './components/view.component';

let app = module('app', [uiRouter, 'ngResource']);

app.config(routes);
app.filter('firstName', FirstNameFilter);
app.filter('lastName', LastNameFilter);
app.factory('PeopleService', PeopleService);
app.directive('jsonFileInput', JSONFileInputDirectiveFactory);
app.component('addComponent', AddComponent);
app.component('viewComponent', ViewComponent);
