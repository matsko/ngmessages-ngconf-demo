angular.module("MessagesDemo", ['ngMessages'])

  .controller("FormController", ['$http', '$q', '$scope', function($http,   $q,   $scope) {
    var ctrl = this;
    ctrl.serverErrors = [];
    ctrl.initial = true;

    ctrl.submit = function(isValid, data) {
      if (isValid) {
        ctrl.initial = false;
        ctrl.loading = true;
        ctrl.serverErrors.length = 0;
        $http.post('/api/submit', data).then(function(response) {
          var data = response.data;
          if (!data || data.status != 'ok') {
            return $q.reject(response);
          }
          ctrl.completed = true;
        }).catch(function(response) {
          populateErrors(response.data.errors);
        }).finally(function() {
          ctrl.loading = false;
        });
      }
    };

    function populateErrors(errors) {
      var form = $scope.registerForm;
      angular.forEach(errors || [], function(entry) {
        var type = entry.type;
        var field = entry.field;
        var message = entry.message;
        ctrl.serverErrors.push({
          name: field,
          message: message
        });

        var formField = form[field];
        formField.$errorValue = formField.$modelValue;
        formField.$setValidity(field, false);
      });
    }
  }])

  .directive('serverSideValidator', [function() {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        var name = attrs.name;
        scope.$watch(attrs.ngModel, function(value) {
          ngModel.$setValidity(name, ngModel.$errorValue !== value);
        });
      }
    };
  }])
