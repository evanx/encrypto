'use strict';

/* Services */

angular.module('myApp.services', []).value('version', '0.1').factory("personaService", [
   "$http", "$q", function($http, $q) {
      console.log("personaService");
      return {
         login: function(assertion) {
            var deferred = $q.defer();
            $http.post("/app/personaLogin", {
               assertion: assertion,
               timezoneOffset: (-new Date().getTimezoneOffset() / 60)
            }).then(function(response) {
               if (response.errorMessage) {
                  console.warn("personaService login", response.errorMessage);
                  deferred.reject(response.errorMessage);
               } else {
                  console.log("personaService login", response.data.email);
                  deferred.resolve(response.data);
               }
            });
            return deferred.promise;
         },
         logout: function(email) {
            return $http.post("/app/personaLogout", {
               email: email
            }).then(function(response) {
               if (response.errorMessage) {
                  console.warn("personaService logout", response.errorMessage);
               } else {
                  console.log("personaService logout", response);
               }
               return response.data;
            });
         }
      };
   }]).factory("appService", ["$http", "$q", function($http, $q) {
      console.log("appService");
      return {
      }
   }]);
