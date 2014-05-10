'use strict';

/* Controllers */

angular.module('myApp.controllers', []).controller("appController", ["$scope", "$location", "personaService",
   function($scope, $location, personaService) {
      console.log("appController");
      $scope.state = {};
      $scope.isActive = function(route) {
         return route === $location.path();
      };
      $scope.login = function() {
         console.log("persona login");
         navigator.id.request();
      };
      $scope.logout = function() {
         console.log("persona logout");
         navigator.id.logout();
      };
      var persona = localStorage.getItem("persona");
      if (persona === null) {
         $scope.persona = {};
      } else {
         try {
            $scope.persona = JSON.parse(persona);
            console.log("persona", $scope.persona.email, $scope.persona.assertion.substring(0, 10));
            personaService.login($scope.persona.assertion).then(function(persona) {
               $scope.persona = persona;
               if (persona.email) {
                  localStorage.setItem("persona", JSON.stringify(persona));
                  $scope.$broadcast("loggedIn", persona.email);
               } else {
                  console.warn("login", persona);
                  localStorage.clear("persona");
               }
            });
         } catch (e) {
            console.log(e);
         }
      }
      navigator.id.watch({
         loggedInUser: $scope.persona.email,
         onlogin: function(assertion) {
            $scope.loggingIn = true;
            personaService.login(assertion).then(function(response) {
               $scope.loggingIn = false;
               $scope.persona = response;
               if (response.email) {
                  localStorage.setItem("persona", JSON.stringify($scope.persona));
                  $scope.$broadcast("loggedIn", response.email);
               } else {
                  console.warn("login", response);
               }
            });
         },
         onlogout: function(response) {
            if ($scope.persona) {
               if ($scope.persona.email) {
                  personaService.logout($scope.persona.email);
               } else {
                  console.warn("logout", response);
               }
               $scope.persona = {};
            }
            localStorage.clear("persona");
         }
      });
      if (true) {
         setTimeout(function() {
         }, 500);
      }
   }]);
;
