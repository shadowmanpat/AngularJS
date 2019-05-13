var app = angular.module('myApp', ['ngRoute']);

app.controller('HomeViewController', function($scope) {
    $scope.message = 'Hello from FirstController';
    $scope.appTitle= 'Simple Expenses Tracker';
});

app.config(function($routeProvider) {
    $routeProvider

        .when('/', {
            templateUrl:'views/expenses.html',
            controller: 'ExpensesViewController'
        })
        .when('/expenses',{
            templateUrl:'views/expenses.html',
            controller: 'ExpensesViewController'
        })
        .when('/expenses/new',{
            templateUrl:'views/expensesForm.html',
            controller: 'ExpenseViewController'
        })
        .when('/expenses/edit/:id',{
            templateUrl:'views/expensesForm.html',
            controller: 'ExpenseViewController'
        })

        .when('/blog', {
            templateUrl : 'views/second.html',
            controller : 'SecondController'
        })

        .when('/about', {
            templateUrl : 'views/third.html',
            controller : 'ThirdController'
        })

        .otherwise({redirectTo: '/'});
});
app.controller('FirstController', function($scope) {
    $scope.message = 'Hello from FirstController';
});

app.controller('SecondController', function($scope) {
    $scope.message = 'Hello from SecondController';
});

app.controller('ThirdController', function($scope) {
    $scope.message = 'Hello from ThirdController';
});

// app.config('$routeProvider',function ($routeProvider) {
//     $routeProvider
//         .when('/',{
//             templateUrl:'view/expenses.html',
//             controller: 'ExpensesViewController'
//         })

//
//         )
// });

app.factory('Expenses', function ($http) {
   var service = {};

   $http.get('data/data.json').
       success(function (data) {

           service.entries = data;
       console.log(data);
   }).error(function (data,stasus) {
       alert('error');
   });

    service.entries = [];

    service.save = function (entry) {
        var toUpdate = service.getById(entry.id);
        if (toUpdate){
            $http.post('data/update.json',entry).
                success(function (data) {
                if (data.success){
                    _.extend(toUpdate, entry);
                }
            }).
                error(function (data,status) {
                alert("error");
            })

        } else {
            // entry.id = service.getNewId();
            // service.entries.push(entry);
            $http.post('data/create.json',entry).
                success(function (data) {

                    console.log(data);
                    console.log("success");
                    entry.id = data.newId;
                    service.entries.push(entry);
            }).error(function (data,status) {
                alert('error!')
            })

        }


    };

    service.getById = function(id){
        return _.find(service.entries, function (entry) {
            return entry.id == id;
        })
    }
    service.getNewId = function () {
        if(service.newId){
            service.newId++;
            return service.newId
        }
        else {
            var entryMaxId = _.max(service.entries, function (entry) {
                service.newId = entryMaxId+1;
                return service.newId;
            })
        }
    };
    service.remove = function (entry) {

        $http.post('data/delete.json',{id:entry.id}).
            success(function (data) {
            if(data.success){
                service.entries = _.reject(service.entries, function (element) {
                    return element.id == entry.id;
                });
            }
        }).
            error(function (data,status){
            alert('error');
        })


    };
    return service;
});


app.controller('ExpensesViewController',['$scope','Expenses', function ($scope, Expenses) {
    $scope.expenses = Expenses .entries;

    $scope.remove = function (expense) {
        console.log("watch");
        Expenses.remove(expense);
    };
    $scope.$watch(function() {
        console.log("watch");
        return Expenses.entries;
    }, function(entries) {
        $scope.expenses= entries;
    });
}]);
app.controller('ExpenseViewController',['$scope','$routeParams','$location','Expenses', function ($scope, $routeParams,$location,Expenses) {
    // $scope.someText = 'The world is round ID'+$routeParams.id+" The first"+Expenses.entries[0].description;
    if(!$routeParams.id){
        $scope.expense = {};
    }
    else {
        $scope.expense = _.clone(Expenses.getById($routeParams.id));
    }

    $scope.save = function () {
        // print("save");
        Expenses.save($scope.expense);
        $location.path('/')
    }
}]);
app.directive('naExpense',function () {
    return{
        restrict :'E',
        templateUrl: 'views/expense.html'
    }
});