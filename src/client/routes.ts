export default [
    '$stateProvider',
    '$urlRouterProvider',
    (
        $stateProvider: angular.ui.IStateProvider,
        $urlRouterProvider: angular.ui.IUrlRouterProvider
    ) => {
        $urlRouterProvider.otherwise('/login');

        $stateProvider.state({
            name: 'welcome',
            url: '/welcome',
            template: '<h2 style="color:red;">Sorry, Welcome Page not implemented!</h2>'
        });
        $stateProvider.state({
            name: 'login',
            url: '/login',
            template: '<h2 style="color:red;">Sorry, Login Page not implemented!</h2>'
        });
        $stateProvider.state({
            name: 'test',
            url: '/test',
            template: '<h2 style="color:red;">Sorry, Test Yourself not implemented!</h2>'
        });
        $stateProvider.state({
            name: 'search',
            url: '/search',
            template: '<h2 style="color:red;">Sorry, Search People not implemented!</h2>'
        });
        $stateProvider.state('view', { url: '/view', component: 'viewComponent' });
        $stateProvider.state({
            name: 'edit',
            url: '/edit',
            template: '<h2 style="color:red;">Sorry, Edit Person not implemented!</h2>'
        });
        $stateProvider.state('new', { url: '/new', component: 'addComponent' });
        $stateProvider.state('new-multi', { url: '/new-multi', component: 'addMultiComponent' });
        $stateProvider.state({
            name: 'users',
            url: '/users',
            abstract: true
        });
    }];
