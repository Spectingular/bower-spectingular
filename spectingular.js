'use strict';

/**
 * @ngdoc directive
 * @name sp.binding.spBindOnce
 *
 * @description
 * Directive for handling one way binding, by destroying the scope within.
 *
 * @example
 <example module="example">
    <file name="index.html">
       <div ng-controller="ctrl">
          <h3>one way binding</h3>
          <span sp-bind-once>
             value 1: {{model.value1}}<br />
             value 2: {{model.value2}}
          </span>
          <h3>two way binding</h3>
          <span>
             value 1: {{model.value1}}<br />
             value 2: {{model.value2}}
          </span><br />
          <h3>change</h3>
          value 1: <input type="text" ng-model="model.value1" /><br />
          value 2: <input type="text" ng-model="model.value2" />
       </div>
    </file>

    <file name="scripts.js">
       angular.module('example', ['sp.binding']).
          controller('ctrl', function($scope) {
             $scope.model = {
                value1 : 'original value 1',
                value2 : 'original value 2'
             };
          });
    </file>
 </example>
 **/

angular.module('sp.binding', []).directive('spBindOnce', ['$timeout', function ($timeout) {
    return {
        scope: true,
        link: function (scope) {
            $timeout(function () {
                scope.$destroy();
            }, 0);
        }
    };
}]);
'use strict';

/**
 * @ngdoc service
 * @name sp.i18n.spProperties
 *
 * @description
 * Service that allows you to provide multi lingual support for properties that can be used
 * for labels etc.
 *
 * @example
 <example module="spPropertiesExample">
    <file name="index.html">
       <div ng-controller="ctrl">
          <h3>1 in english</h3>
          {{enProperty}}
          <h3>1 in dutch</h3>
          {{nlProperty}}
       </div>
    </file>

    <file name="scripts.js">
       angular.module("spPropertiesExample", ['sp.i18n']).
          config(function(spPropertiesProvider) {
             spPropertiesProvider.add('example', {
                'name': 'spectingular',
                '1': 'one'
             }, 'en-us');
             spPropertiesProvider.add('example', {
                'name': 'spectingular',
                '1': 'een'
             }, 'nl-nl');
          }).
          controller('ctrl', function($scope, spProperties) {
             $scope.enProperty = spProperties.property('example', '1', 'en-us');
             $scope.nlProperty = spProperties.property('example', '1', 'nl-nl');
          });
 </file>
 </example>
 **/

angular.module('sp.i18n', []).provider('spProperties', function () {
    /**
     * @ngdoc service
     * @name sp.i18n.spPropertiesProvider
     *
     * @description
     * Provider that allows you to add properties for a given identifier and locale.
     */
    this.propertyStore = {};

    /**
     * @ngdoc method
     * @name sp.i18n.spPropertiesProvider#add
     * @methodOf sp.i18n.spPropertiesProvider
     *
     * @description
     * Adds a property value for the given key and local matching the given identifier
     * @param {String} identifier The identifier that contains all the properties
     * @param {Object} properties The properties
     * @param {String} localeIdentifier The locale identifier
     */
    this.add = function (identifier, properties, localeIdentifier) {
        var propertyStore = this.propertyStore;
        if (angular.isUndefined(propertyStore[identifier])) {
            propertyStore[identifier] = {}
            propertyStore[identifier][localeIdentifier] = {};
        }
        if (angular.isUndefined(propertyStore[identifier][localeIdentifier])) {
            propertyStore[identifier][localeIdentifier] = {};
        }
        angular.forEach(properties, function (value, key) {
            propertyStore[identifier][localeIdentifier][key] = value;
        });
    }
    this.$get = function () {
        var propertyStore = this.propertyStore;
        return {
            /**
             * @ngdoc method
             * @name sp.i18n.spProperties#property
             * @methodOf sp.i18n.spProperties
             *
             * @description
             * Gets the property value for the key matching all the given criteria
             * @param {String} identifier The identifier that contains all the properties
             * @param {String} key The key
             * @param {String} localeIdentifier The locale identifier
             * @returns {String} value The value
             */
            property: function (identifier, key, localeIdentifier) {
                return propertyStore[identifier][localeIdentifier][key];
            },
            /**
             * @ngdoc method
             * @name sp.i18n.spProperties#properties
             * @methodOf sp.i18n.spProperties
             *
             * @description
             * Gets the properties matching the identifier and locale identifier
             * @param {String} identifier The identifier that contains all the properties
             * @param {String} localeIdentifier The locale identifier
             * @returns {Array} valuesThe values
             */
            properties: function (identifier, localeIdentifier) {
                return propertyStore[identifier][localeIdentifier];
            }
        };
    };
});