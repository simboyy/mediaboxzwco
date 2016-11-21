'use strict';

angular.module('mediaboxApp', ['mediaboxApp.auth', 'mediaboxApp.admin', 'mediaboxApp.constants', 'ngCookies', 'ngResource', 'ngSanitize', 'ngMessages', 'btford.socket-io', 'ui.router', 'validation.match', 'ngMaterial', 'ngAnimate', 'ngMdIcons', 'angularMoment', 'infinite-scroll', 'materialDatePicker', 'ngFileUpload', 'rzModule', 'darthwade.dwLoading', 'ui.tree', 'ui.odometer', 'oitozero.ngSweetAlert', 'naif.base64', 'ngPintura', 'ngOnload'
//'kendo.directives'
]).config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $urlMatcherFactoryProvider, $mdThemingProvider, $mdIconProvider) {
  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);

  // set the default palette name
  var defaultPalette = 'blue';
  // define a palette to darken the background of components
  var greyBackgroundMap = $mdThemingProvider.extendPalette(defaultPalette, { 'A100': 'fafafa' });

  $mdThemingProvider.definePalette('grey-background', greyBackgroundMap);
  $mdThemingProvider.setDefaultTheme(defaultPalette);

  // customize the theme
  $mdThemingProvider.theme(defaultPalette).primaryPalette(defaultPalette).accentPalette('pink').backgroundPalette('grey-background');

  // var spritePath = 'bower_components/material-design-icons/sprites/svg-sprite/';
  // $mdIconProvider.iconSet('navigation', spritePath + 'svg-sprite-navigation.svg');
  // $mdIconProvider.iconSet('image', spritePath + 'svg-sprite-image.svg');
  // $mdIconProvider.iconSet('action', spritePath + 'svg-sprite-action.svg');
  // $mdIconProvider.iconSet('content', spritePath + 'svg-sprite-content.svg');
  // $mdIconProvider.iconSet('toggle', spritePath + 'svg-sprite-toggle.svg');
  // $mdIconProvider.iconSet('alert', spritePath + 'svg-sprite-alert.svg');
  // $mdIconProvider.iconSet('social', spritePath + 'svg-sprite-social.svg');
  // $mdIconProvider.iconSet('avatar', '../assets/iconsets/avatar-icons.svg', 128);
  // $mdIconProvider.defaultIconSet(spritePath + 'svg-sprite-alert.svg');
}).controller('preLoaderCtrl', function ($scope) {
  $scope.siteLoaded = true;
});
//# sourceMappingURL=app.js.map

'use strict';

angular.module('mediaboxApp.admin', ['mediaboxApp.auth', 'ui.router']);
//# sourceMappingURL=admin.module.js.map

'use strict';

angular.module('mediaboxApp.auth', ['mediaboxApp.constants', 'mediaboxApp.util', 'ngCookies', 'ui.router']).config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});
//# sourceMappingURL=auth.module.js.map

'use strict';

angular.module('mediaboxApp.util', []);
//# sourceMappingURL=util.module.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  // login, signup are used for emergency situations otherwise LoginModal
  $stateProvider.state('login', {
    url: '/login?referrer',
    templateUrl: 'app/account/login/login.html',
    controller: 'LoginController',
    controllerAs: 'login',
    title: 'Login to Mediabox'
  }).state('logout', {
    url: '/logout?referrer',
    referrer: '/',
    template: '',
    controller: function controller($state, Auth) {
      Auth.logout();
      $state.go('/');
    }
  }).state('signup', {
    url: '/signup',
    templateUrl: 'app/account/signup/signup.html',
    controller: 'SignupController',
    controllerAs: 'signup',
    title: 'Signup for Mediabox'
  }).state('forgot', {
    url: '/forgot?email',
    templateUrl: 'app/account/password/forgot.html',
    controller: 'PasswordController',
    controllerAs: 'forgot',
    title: 'Password Recovery'
  }).state('reset', {
    url: '/reset/:token',
    templateUrl: 'app/account/password/reset.html',
    controller: 'PasswordController',
    controllerAs: 'reset',
    title: 'Reset Password'
  }).state('cp', {
    url: '/change-password',
    templateUrl: 'app/account/cp/cp.html',
    controller: 'CpController',
    controllerAs: 'cp',
    title: 'Change Password',
    authenticate: true
  });
}).run(function ($rootScope, Auth) {
  $rootScope.$on('$stateChangeStart', function (event, next, nextParams, current) {
    if (next.name === 'logout' && current && current.name && !current.authenticate) {
      next.referrer = current.name;
    }
  });

  $rootScope.$on('$stateChangeSuccess', function (evt, toState) {
    if (toState.title) {
      window.document.title = toState.title + ' - Mediabox';
    } else if (toState.name != 'crud-table') {
      var input = toState.name;
      input = input.replace(/([A-Z])/g, ' $1');
      input = input[0].toUpperCase() + input.slice(1);
      window.document.title = input + ' - Mediabox';
    }
  });
});
//# sourceMappingURL=account.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CpController = function () {
  function CpController(Auth, Settings, Toast) {
    _classCallCheck(this, CpController);

    this.errors = {};
    this.submitted = false;
    this.Settings = Settings;
    this.Toast = Toast;
    this.Auth = Auth;
  }

  _createClass(CpController, [{
    key: 'changePassword',
    value: function changePassword(form) {
      var _this = this;

      this.submitted = true;

      if (form.$valid) {
        this.loading = true;

        this.Auth.changePassword(this.user.oldPassword, this.user.newPassword).then(function () {
          _this.loading = false;
          _this.message = 'Password successfully changed.';
        }).catch(function () {
          _this.loading = false;
          form.password.$setValidity('mongoose', false);
          _this.errors.other = 'Incorrect password';
          _this.message = '';
        });
      } else {
        this.Toast.show({ type: 'info', text: 'Form is not valid. Check your inputs' });
      }
    }
  }]);

  return CpController;
}();

angular.module('mediaboxApp').controller('CpController', CpController);
//# sourceMappingURL=cp.controller.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LoginController = function () {
  function LoginController(Auth, $state) {
    _classCallCheck(this, LoginController);

    this.user = { email: 'admin@codenx.com', password: 'codenx' };
    this.errors = {};
    this.submitted = false;

    this.Auth = Auth;
    this.$state = $state;
  }

  _createClass(LoginController, [{
    key: 'login',
    value: function login(form) {
      var _this = this;

      this.submitted = true;

      if (form.$valid) {
        this.loading = true;
        this.Auth.login({
          email: this.user.email,
          password: this.user.password
        }).then(function () {
          if (!angular.isUndefined(_this.$state.params.referrer)) {
            _this.$state.go(_this.$state.params.referrer);
          } else {
            _this.$state.go('/');
          }
        }).catch(function (err) {
          _this.errors.other = err.message;
          _this.loading = false;
        });
      }
    }
  }]);

  return LoginController;
}();

angular.module('mediaboxApp').controller('LoginController', LoginController);
//# sourceMappingURL=login.controller.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PasswordController = function () {
  function PasswordController(Auth, $state, $http) {
    _classCallCheck(this, PasswordController);

    this.user = {};
    this.user.email = $state.params.email;
    this.errors = {};
    this.submitted = false;

    this.Auth = Auth;
    this.$state = $state;
    this.$http = $http;
  }

  _createClass(PasswordController, [{
    key: 'reset',
    value: function reset(form) {
      var _this = this;

      this.submitted = true;

      if (form.$valid) {
        this.loading = true;
        this.user.token = this.$state.params.token;
        this.$http.post('api/users/reset/' + this.$state.params.token, this.user).then(function (data) {
          _this.errors.message = data.data.message;
          _this.errors.email = '';
          _this.loading = false;
        }).catch(function (err) {
          _this.errors.message = '';
          _this.errors.email = err.data.message;
          _this.loading = false;
        });
      }
    }
  }, {
    key: 'forgot',
    value: function forgot(form) {
      var _this2 = this;

      this.submitted = true;

      if (form.$valid) {
        this.loading = true;
        this.$http.post('api/users/forgot', this.user).then(function (data) {
          _this2.errors.message = data.data.message;
          _this2.errors.email = '';
          _this2.loading = false;
        }).catch(function (err) {
          _this2.errors.message = '';
          _this2.errors.email = err.data.message;
          _this2.loading = false;
        });
      }
    }
  }]);

  return PasswordController;
}();

angular.module('mediaboxApp').controller('PasswordController', PasswordController);
//# sourceMappingURL=password.controller.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SignupController = function () {
  function SignupController(Auth, $state) {
    _classCallCheck(this, SignupController);

    this.user = {};
    this.errors = {};
    this.submitted = false;
    this.Auth = Auth;
    this.$state = $state;
  }

  _createClass(SignupController, [{
    key: 'register',
    value: function register(form) {
      var _this = this;

      console.log(this.user);
      this.submitted = true;
      if (form.$valid) {
        this.loading = true;
        this.Auth.createUser({
          name: this.user.name,
          email: this.user.email,
          phone: this.user.phone,
          company: this.user.company,
          website: this.user.website,
          role: this.user.role,
          password: this.user.password
        }).then(function () {
          // Account created, redirect to home
          _this.$state.go('/');
        }).catch(function (err) {
          err = err.data;
          // this.errors = {};
          _this.loading = false;
          // Update validity of form fields that match the sequelize errors
          if (err.name) {
            angular.forEach(err.errors, function (field) {
              // console.log('err',field);
              form[field.path].$setValidity('mongoose', false);
              // this.errors[field] = err.message;
            });
          }
        });
      }
    }
  }, {
    key: 'cancel',
    value: function cancel() {
      this.$state.go('login');
    }
  }]);

  return SignupController;
}();

angular.module('mediaboxApp').controller('SignupController', SignupController);
//# sourceMappingURL=signup.controller.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    var AddressController = function () {
        function AddressController(Toast, Address, Settings, socket, $http, $scope, $mdDialog) {
            _classCallCheck(this, AddressController);

            var vm = this;
            this.Address = Address;
            this.addr = {};
            this.$http = $http;
            this.$mdDialog = $mdDialog;
            this.socket = socket;
            this.Toast = Toast;
            this.newAddress = false;
            this.options = {};
            this.Settings = Settings;
            this.getMyAddress();
            $scope.$on('$destroy', function () {
                socket.unsyncUpdates('address');
            });
        }

        _createClass(AddressController, [{
            key: 'getMyAddress',
            value: function getMyAddress() {
                var vm = this;
                vm.Address.my.query(function (res) {
                    vm.address = res;
                    vm.addr = res[0];
                    vm.socket.syncUpdates('address', vm.address);
                });
            }
        }, {
            key: 'switchAddress',
            value: function switchAddress(a) {
                this.addr = a;
            }
        }, {
            key: 'delete',
            value: function _delete(item) {
                var vm = this;
                var confirm = this.$mdDialog.confirm().title('Would you like to delete the address?').textContent('This is unrecoverable').ariaLabel('Confirm delete address').ok('Please do it!').cancel('No. keep');

                this.$mdDialog.show(confirm).then(function () {
                    vm.Address.delete({ id: item._id }, function () {}, function (res) {
                        vm.Toast.show({ type: 'error', text: res });
                    });
                });
            }
        }, {
            key: 'saveAddress',
            value: function saveAddress(data) {
                var vm = this;
                data.country = vm.Settings.country.name;
                vm.loadingAddress = true;
                if (_.has(data, '_id')) {
                    this.Address.update({ id: data._id }, data, function () {
                        vm.loadingAddress = false;
                        vm.getMyAddress();
                    }, function (err) {
                        // If rejected by auth interceptor.service
                        vm.loadingAddress = false;
                    });
                } else {
                    this.Address.save(data, function () {
                        vm.loadingAddress = false;
                        vm.getMyAddress();
                    });
                }
                vm.addressForm(false);
            }
        }, {
            key: 'addressForm',
            value: function addressForm(visible) {
                this.showAddressForm = visible;
            }
        }, {
            key: 'cancelForm',
            value: function cancelForm(addr) {
                this.showAddressForm = false;
                this.addr = this.address[0];
            }
        }]);

        return AddressController;
    }();

    angular.module('mediaboxApp').controller('AddressController', AddressController);
})();
//# sourceMappingURL=address.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('address', {
    url: '/address?id&msg',
    templateUrl: 'app/address/address.html',
    controller: 'AddressController as address',
    authenticate: true
  });
});
//# sourceMappingURL=address.js.map

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var AdminController = function AdminController(User, Settings, appConfig) {
    _classCallCheck(this, AdminController);

    var userRoles = appConfig.userRoles || [];
    this.options = [{ field: 'name' }, { field: 'role', dataType: 'select', options: userRoles }];
    if (Settings.demo) this.options.push({ field: 'null', heading: 'email (Hidden in demo mode)' });else this.options.push({ field: 'email' });

    this.options.push({ field: 'provider', noEdit: true });
  }

  //   delete(user) {
  //     user.$remove();
  //     this.users.splice(this.users.indexOf(user), 1);
  //   }
  ;

  angular.module('mediaboxApp.admin').controller('AdminController', AdminController);
})();
//# sourceMappingURL=admin.controller.js.map

'use strict';

angular.module('mediaboxApp.admin').config(function ($stateProvider) {
  $stateProvider.state('admin', {
    url: '/admin',
    templateUrl: 'app/admin/admin.html',
    controller: 'AdminController as admin',
    authenticate: 'admin'
  });
});
//# sourceMappingURL=admin.router.js.map

"use strict";

(function (angular, undefined) {
	angular.module("mediaboxApp.constants", []).constant("appConfig", {
		"userRoles": ["guest", "user", "manager", "admin"],
		"reviewSettings": {
			"enabled": true,
			"moderate": false
		},
		"wishlist": true,
		"mailOptions": {}
	});
})(angular);
//# sourceMappingURL=app.constant.js.map

'use strict';

angular.module('mediaboxApp').controller('BookCtrl', function ($scope) {
  $scope.options = [{ field: 'image', heading: 'Image', dataType: 'image' }, { field: 'name', title: 'Title', dataType: 'text' }, { field: 'author', dataType: 'text' }, { field: 'category', dataType: 'select', options: ['Fiction', 'Non fiction', 'Inspirational', 'Novel', 'Science', 'Story'] }, { field: 'price', dataType: 'currency' }, { field: 'releaseDate', dataType: 'date' }, { field: 'isbn', heading: 'ISBN', dataType: 'text', noEdit: true }, { field: 'active', heading: 'Availability', dataType: 'boolean' }];
});
//# sourceMappingURL=book.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('book', {
    url: '/book',
    templateUrl: 'app/book/book.html',
    controller: 'BookCtrl',
    authenticate: true,
    title: 'Books Management'
  });
});
//# sourceMappingURL=book.js.map

'use strict';

angular.module('mediaboxApp').controller('BrandCtrl', function ($scope) {
  $scope.options = [{ field: 'name' }, { field: 'brand', dataType: 'number', heading: 'ID' }, { field: 'image', dataType: 'image' }, { field: 'active', dataType: 'boolean' }];
});
//# sourceMappingURL=brand.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('brand', {
    url: '/brand',
    templateUrl: 'app/brand/brand.html',
    controller: 'BrandCtrl',
    authenticate: 'manager'
  });
});
//# sourceMappingURL=brand.js.map

'use strict';

angular.module('mediaboxApp').controller('BrandMGCtrl', function ($scope) {
  $scope.options = [{ field: 'name' }, { field: 'brand', dataType: 'number', heading: 'ID' }, { field: 'image', dataType: 'image' }, { field: 'active', dataType: 'boolean' }];
});
//# sourceMappingURL=brandmg.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('brandmg', {
    url: '/brandmg',
    templateUrl: 'app/brandmg/brandmg.html',
    controller: 'BrandMGCtrl',
    authenticate: 'manager'
  });
});
//# sourceMappingURL=brandmg.js.map

'use strict';

angular.module('mediaboxApp').controller('BrandTVCtrl', function ($scope) {
  $scope.options = [{ field: 'name' }, { field: 'brand', dataType: 'number', heading: 'ID' }, { field: 'image', dataType: 'image' }, { field: 'active', dataType: 'boolean' }];
});
//# sourceMappingURL=brandtv.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('brandtv', {
    url: '/brandtv',
    templateUrl: 'app/brandtv/brandtv.html',
    controller: 'BrandTVCtrl',
    authenticate: 'manager'
  });
});
//# sourceMappingURL=brandtv.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    var CampaignController = function () {
        function CampaignController(Cart, Campaign, Toast, Settings, $state, $stateParams) {
            _classCallCheck(this, CampaignController);

            this.campaignStatusLov = Campaign.status;
            this.Toast = Toast;
            this.Cart = Cart;
            this.Settings = Settings; // Used to get currency symbol
            this.$state = $state;
            this.options = {};
            this.campaigns = Campaign.my.query();
            console.log(this.Campaigns);
        }

        _createClass(CampaignController, [{
            key: 'navigate',
            value: function navigate(params) {
                this.$state.go('single-product', { id: params.sku, slug: params.description }, { reload: false });
            }
        }]);

        return CampaignController;
    }();

    angular.module('mediaboxApp').controller('CampaignController', CampaignController);
})();
//# sourceMappingURL=campaign.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('campaign', {
    url: '/campaign',
    templateUrl: 'app/campaign/campaign.html',
    controller: 'CampaignController as campaign',
    authenticate: true
  });
});
//# sourceMappingURL=campaign.js.map

'use strict';

angular.module('mediaboxApp').controller('CampaignCompletedController', function ($scope, $rootScope, $filter, Cart, Auth, $log, $timeout, $mdSidenav, Campaign, $loading) {
  //clear items added to campaign from cart
  Cart.cart.clearItems();
  Cart.cart.products = 20;

  $loading.start("campaigns");

  //console.log(Cart);

  var vm = this;

  vm.itemsGrid = [];

  vm.toggleLeft = buildDelayedToggler('left');
  vm.toggleRight = buildToggler('right');
  vm.isOpenRight = function () {
    return $mdSidenav('right').isOpen();
  };
  /**
   * Supplies a function that will continue to operate until the
   * time is up.
   */
  function debounce(func, wait, context) {
    var timer;
    return function debounced() {
      var context = $scope,
          args = Array.prototype.slice.call(arguments);
      $timeout.cancel(timer);
      timer = $timeout(function () {
        timer = undefined;
        func.apply(context, args);
      }, wait || 10);
    };
  }
  /**
   * Build handler to open/close a SideNav; when animation finishes
   * report completion in console
   */
  function buildDelayedToggler(navID) {
    return debounce(function () {
      $mdSidenav(navID).toggle().then(function () {
        $log.debug("toggle " + navID + " is done");
      });
    }, 200);
  }
  function buildToggler(navID) {
    return function () {
      $mdSidenav(navID).toggle().then(function () {
        $log.debug("toggle " + navID + " is done");
      });
    };
  }

  vm.items = ['item1', 'item2', 'item3'];

  vm.animationsEnabled = true;

  vm.open = function (campaigns, p, creative, size) {
    console.log(creative);
    $rootScope.toMerge = campaigns;
    $rootScope.toMergeCreative = creative;

    var modalInstance = $modal.open({
      animation: vm.animationsEnabled,
      templateUrl: 'creative.html',
      controller: 'ModalInstanceController',
      size: size,
      resolve: {
        items: function items() {
          return p;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      vm.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  vm.openCreative = function (creative, size) {
    console.log(creative);
    // $rootScope.toMerge = campaigns;
    $rootScope.toMergeCreative = creative;

    var modalInstance = $modal.open({
      animation: vm.animationsEnabled,
      templateUrl: 'preview.html',
      controller: 'ModalInstanceController',
      size: size,
      resolve: {
        items: function items() {
          return creative;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      vm.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  vm.openToggle = function (campaigns, p, creative, size) {

    $rootScope.toMergeItems = p;
    $rootScope.toMergeCampaign = campaigns;
    console.log(campaigns);
    console.log(p);

    $scope.items = campaigns;
  };

  vm.openChat = function (campaigns, p, creative, size) {
    console.log(campaigns._id);
    $rootScope.toDelete = campaigns._id;
    $rootScope.toMerge = campaigns;

    var modalInstance = $modal.open({
      animation: vm.animationsEnabled,
      templateUrl: 'chat.html',
      controller: 'ChatInstanceController',
      size: size,
      resolve: {
        items: function items() {
          return p;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      vm.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  vm.openRequest = function (campaigns, p, creative, size) {
    console.log(campaigns._id);
    $rootScope.toDelete = campaigns._id;
    $rootScope.toMerge = campaigns;

    var modalInstance = $modal.open({
      animation: vm.animationsEnabled,
      templateUrl: 'request.html',
      controller: 'RequestInstanceController',
      size: size,
      resolve: {
        items: function items() {
          return p;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      vm.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  vm.toggleAnimation = function () {
    vm.animationsEnabled = !vm.animationsEnabled;
  };

  vm.cmp = {};
  vm.campaignStatusLov = Campaign.status;
  vm.campaignStatus = [{ name: '', val: 402 }, { name: 'Avail Check', val: 201 }, { name: 'Buy', val: 202 }];

  vm.campaigns = Campaign.my.query({}, function (res) {

    var totalCampaign = res.length;

    // console.log(res.campaignName);
    // for(var i=0;i<res.length;i++){
    //     var subTotal = 0;
    for (var j = 0; j < res.length; j++) {

      var total = 0;

      // console.log();
      // subTotal += res[i].shipping.charge;
      var item = res[j];

      console.log(item.campaignNo);
      //itemsGrid.push(item.items);
      // var x = item.items
      // var x.sub = [];

      for (var i = 0; i < item.items.length; i++) {
        // items[i].total = 0;

        var p = item.items[i].price;
        var q = item.items[i].quantity;
        total += p * q;

        // var x.sub.push(total);
      }

      res[j].totalWeight = total;
      //alert(total);


      //console.log(total);
      $loading.finish("campaigns");
    }
    $loading.finish("campaigns");

    res.totalCampaign = totalCampaign;
    console.log(totalCampaign);

    // }
    // res.total = total;
  });

  vm.getTotal = function (item) {
    // console.log(item);
    var total = 0;

    for (var i = 0; i < item.items.length; i++) {

      // items[i].total = 0;

      var p = item.items[i].price;
      var q = item.items[i].quantity;
      total += p * q;
      // var x.sub.push(total);
    }
    // console.log(total);

    return total;
  };
  var q = {};
  q.where = { $and: [{ 'uid': Auth.getCurrentUser().email }, { 'endDate': { $lt: Date.now() } }, { 'items.status.name': 'Approved' }] };

  vm.mainGridOptions = {
    dataSource: {

      transport: {
        read: function read(options) {
          //options holds the grids current page and filter settings
          Campaign.my.query(q, function (res) {

            options.success(res);
            console.log(res);
          });
        }
      },
      pageSize: 10,
      serverPaging: true,
      serverSorting: true
    },
    toolbar: ['excel', 'pdf'],

    excel: {
      allPages: true,
      proxyURL: "//demos.telerik.com/kendo-ui/service/export",
      fileName: 'Mediabox-campaigns.xlsx',
      filterable: true
    },
    pdf: {
      allPages: true,
      avoidLinks: true,
      paperSize: "A4",
      margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
      landscape: true,
      repeatHeaders: true,
      template: $("#page-template").html(),
      scale: 0.8
    },
    sortable: true,
    pageable: true,
    editable: "popup",

    filterable: true,

    dataBound: function dataBound() {
      this.expandRow(this.tbody.find("tr.k-master-row").first());
    },
    columns: [{ field: "campaignNo", title: "Campaign Id" }, { field: "campaignName", title: "Campaign Name" }, { field: "startDate", title: "Start Date", type: 'datetime', template: "#=  (startDate == null)? '' : kendo.toString(kendo.parseDate(startDate, 'yyyy-MM-dd'), 'MM/dd/yy') #" }, { field: "endDate", title: "End Date", type: 'datetime', template: "#=  (endDate == null)? '' : kendo.toString(kendo.parseDate(endDate, 'yyyy-MM-dd'), 'MM/dd/yy') #" }, { field: "status", title: "Status" }, { field: "totalSpend", title: "Total" }]
  };

  vm.detailGridOptions = function (dataItem) {

    return {
      dataSource: {
        filter: { field: "id", operator: "eq", value: dataItem.id },
        transport: {
          read: function read(options) {
            //options holds the grids current page and filter settings
            var itemsGrid = [];
            var q = {};
            //q.where = { $and: [ { 'uid' : Auth.getCurrentUser().email },{'endDate': { $lt: Date.now()}}, { 'items.status.name':'Approved'} ] };
            q.where = { $and: [{ 'uid': Auth.getCurrentUser().email }] };
            Campaign.my.query(q, function (res) {
              console.log(res);

              var total = 0;
              var totalCampaign = res.length;

              // console.log(res.campaignName);
              // for(var i=0;i<res.length;i++){
              //     var subTotal = 0;
              for (var j = 0; j < res.length; j++) {
                total = 0;
                // console.log();
                // subTotal += res[i].shipping.charge;
                var item = res[j];

                //console.log(item.campaignNo);
                //itemsGrid.push(item.items);
                // var x = item.items
                // var x.sub = [];

                for (var i = 0; i < item.items.length; i++) {

                  var itemGridTemp = {
                    campaignNo: item.campaignNo,
                    id: item._id,
                    advertiser: item.items[i].advertiser,
                    category: item.items[i].category,
                    creative: item.items[i].creative,
                    image: item.items[i].image,
                    messages: item.items[i].messages,
                    mrp: item.items[i].mrp,
                    name: item.items[i].name,
                    price: item.items[i].price,
                    publisher: item.items[i].publisher,
                    quantity: item.items[i].quantity,
                    request: item.items[i].request,
                    size: item.items[i].size,
                    sku: item.items[i].sku,
                    status: item.items[i].status,
                    uid: item.items[i].uid
                  };

                  // items[i].total = 0;

                  var p = item.items[i].price;
                  var q = item.items[i].quantity;
                  total += p * q;
                  res.totalSpend = total;
                  // var x.sub.push(total);

                  vm.itemsGrid.push(itemGridTemp);
                }
                //console.log(total);
              }
              res.total = total;
              res.totalCampaign = totalCampaign;

              //vm.filteredData = $filter('filter')(vm.itemsGrid, {id: dataItem.id})[0];

              var data = [];
              //console.log(vm.itemsGrid);
              for (var i = 0; i < vm.itemsGrid.length; i++) {
                var item = vm.itemsGrid[i];
                if (item.campaignNo == dataItem.campaignNo) {
                  //alert(item.campaignNo);
                  data.push(item);
                }

                //options.success(data);
                console.log(data);

                vm.data = [];
              }

              vm.itemsGrid = [];
            });
          }
        },
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        pageSize: 5,
        filterable: true

      },
      scrollable: false,
      sortable: true,

      pageable: true,
      columns: [
      //{ field: "campaignNo", title:"Campaign #", width: "70px" },
      //{ field: "publisher", title:"Publisher", width: "100px" },
      // { field: "category", title:"Category", width: "50px" },
      { field: "name", title: "Name", width: "70px" }, {
        field: "price",
        title: "Price",
        width: "50px",

        template: function template(dataItem) {
          return "<div></span><span style='display:inline-block;width:75%;text-align:left;white-space:nowrap;'>$" + dataItem.price + "</span></div>";
        } }, { field: "quantity", title: "Quantity", width: "30px" }, {

        title: "Status",
        width: "40px",
        template: function template(dataItem) {
          return "<div ng-show= \"dataItem.status.val=='305'\" class=\"alert alert-success\"><small>Approved</small></div>" +
          // "<div ng-show=\"!dataItem.creative\" class=\"alert alert-danger\" ><small>Needs Creative</small></div>"+
          "<div  ng-show = \"dataItem.status.val=='402'\" class=\"alert alert-danger\" ><small>Pending<small></div>" + "<div  ng-show = \"dataItem.status.val=='300'\" class=\"alert alert-success\" ><small>Ready</small> </div>" + "<div  ng-show = \"dataItem.status.val=='500'\" class=\"alert alert-danger\" ><small>Rejected</small> </div>" + "<div  ng-show = \"dataItem.status.val=='309'\" class=\"alert alert-success\" ><small>Completed</small> </div>";
        }
      }, {
        field: "creative",
        title: "Creative",
        width: "50px",
        template: function template(dataItem) {
          return "<div ng-hide=\"dataItem.creative\">" + "<button  class=\"btn btn-danger\" ng-hide=\"isAdmin()\" ng-click=\"vm.openCreative(dataItem,'md')\" ><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button></div>" + "</div>" + "<div ng-show=\"dataItem.creative\">" + "<button  class=\"btn btn-success\" ng-hide=\"isAdmin()\" ng-click=\"vm.openCreative(dataItem,'md')\" ><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button></div>" + "</div>";
          //return "<div> <button  class=\"btn btn-danger\"  ng-click=\"vm.open(cart.items,item,item.creative,'md')\" ><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button></div>";
        } }, {
        title: "Action",
        width: "50px",
        template: function template(dataItem) {
          return "<div  ng-show= \"dataItem.status.val=='305'\" ><button class=\"btn-success btn-sm btn-success\" ng-click=\"cart.addItem({sku:dataItem.sku, name:dataItem.name,slug:adspace.formart,mrp:dataItem.mrp, weight:dataItem.maxSize,size:dataItem.size,price:dataItem.price , publisher:dataItem.publisher,uid:dataItem.uid,category:dataItem.category,image:dataItem.image,quantity:1} ,true);\" ng-show=\"checkCart(dataItem.name)\"><i class=\"fa fa-shopping-cart\" ></i></button></div>";
          // return "<button class=\"btn-success btn-sm btn-success\" ng-click=\"goToSite(site)\">Buy</button>";
        } }]
    };
  };

  vm.action = function (campaign) {
    // method
    console.log(campaign);
    Campaign.delete({ id: campaign._id }, function () {
      console.log("Campaign deleted");

      Campaign.save(campaign).$promise.then(function () {
        toastr.success("Campaign info saved successfully", "Success");
      });
    });
  };

  vm.changeStatus = function (campaign) {
    Campaign.update({ id: campaign._id }, campaign).$promise.then(function (res) {
      console.log(res);
    }, function (error) {
      // error handler
      console.log(error);
      if (error.data.errors) {
        var err = error.data.errors;
        toastr.error(err[Object.keys(err)].message, err[Object.keys(err)].name);
      } else {
        var msg = error.data.message;
        toastr.error(msg);
      }
    });
  };

  var toNumber = function toNumber(value) {
    value = value * 1;
    return isNaN(value) ? 0 : value;
  };
});
//# sourceMappingURL=campaignCompleted.controller.js.map

'use strict';

angular.module('mediaboxApp').controller('CampaignRunningController', function ($scope, $rootScope, $filter, Cart, Auth, $log, $timeout, $mdSidenav, Campaign, $loading) {
  //clear items added to campaign from cart
  Cart.cart.clearItems();
  Cart.cart.products = 20;

  $loading.start("campaigns");

  //console.log(Cart);

  var vm = this;

  vm.itemsGrid = [];

  vm.toggleLeft = buildDelayedToggler('left');
  vm.toggleRight = buildToggler('right');
  vm.isOpenRight = function () {
    return $mdSidenav('right').isOpen();
  };
  /**
   * Supplies a function that will continue to operate until the
   * time is up.
   */
  function debounce(func, wait, context) {
    var timer;
    return function debounced() {
      var context = $scope,
          args = Array.prototype.slice.call(arguments);
      $timeout.cancel(timer);
      timer = $timeout(function () {
        timer = undefined;
        func.apply(context, args);
      }, wait || 10);
    };
  }
  /**
   * Build handler to open/close a SideNav; when animation finishes
   * report completion in console
   */
  function buildDelayedToggler(navID) {
    return debounce(function () {
      $mdSidenav(navID).toggle().then(function () {
        $log.debug("toggle " + navID + " is done");
      });
    }, 200);
  }
  function buildToggler(navID) {
    return function () {
      $mdSidenav(navID).toggle().then(function () {
        $log.debug("toggle " + navID + " is done");
      });
    };
  }

  vm.items = ['item1', 'item2', 'item3'];

  vm.animationsEnabled = true;

  vm.open = function (campaigns, p, creative, size) {
    console.log(creative);
    $rootScope.toMerge = campaigns;
    $rootScope.toMergeCreative = creative;

    var modalInstance = $modal.open({
      animation: vm.animationsEnabled,
      templateUrl: 'creative.html',
      controller: 'ModalInstanceController',
      size: size,
      resolve: {
        items: function items() {
          return p;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      vm.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  vm.openCreative = function (creative, size) {
    //console.log(creative);
    // $rootScope.toMerge = campaigns;
    $rootScope.toMergeCreative = creative;

    var modalInstance = $modal.open({
      animation: vm.animationsEnabled,
      templateUrl: 'preview.html',
      controller: 'ModalInstanceController',
      size: size,
      resolve: {
        items: function items() {
          return creative;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      vm.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  vm.openToggle = function (campaigns, p, creative, size) {

    $rootScope.toMergeItems = p;
    $rootScope.toMergeCampaign = campaigns;
    console.log(campaigns);
    console.log(p);

    $scope.items = campaigns;
  };

  vm.openChat = function (campaigns, p, creative, size) {
    console.log(campaigns._id);
    $rootScope.toDelete = campaigns._id;
    $rootScope.toMerge = campaigns;

    var modalInstance = $modal.open({
      animation: vm.animationsEnabled,
      templateUrl: 'chat.html',
      controller: 'ChatInstanceController',
      size: size,
      resolve: {
        items: function items() {
          return p;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      vm.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  vm.openRequest = function (campaigns, p, creative, size) {
    console.log(campaigns._id);
    $rootScope.toDelete = campaigns._id;
    $rootScope.toMerge = campaigns;

    var modalInstance = $modal.open({
      animation: vm.animationsEnabled,
      templateUrl: 'request.html',
      controller: 'RequestInstanceController',
      size: size,
      resolve: {
        items: function items() {
          return p;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      vm.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  vm.toggleAnimation = function () {
    vm.animationsEnabled = !vm.animationsEnabled;
  };

  vm.cmp = {};
  vm.campaignStatusLov = Campaign.status;
  vm.campaignStatus = [{ name: '', val: 402 }, { name: 'Avail Check', val: 201 }, { name: 'Buy', val: 202 }];

  vm.campaigns = Campaign.my.query({}, function (res) {

    var totalCampaign = res.length;

    // console.log(res.campaignName);
    // for(var i=0;i<res.length;i++){
    //     var subTotal = 0;
    for (var j = 0; j < res.length; j++) {

      var total = 0;

      // console.log();
      // subTotal += res[i].shipping.charge;
      var item = res[j];

      console.log(item.campaignNo);
      //itemsGrid.push(item.items);
      // var x = item.items
      // var x.sub = [];

      for (var i = 0; i < item.items.length; i++) {
        // items[i].total = 0;

        var p = item.items[i].price;
        var q = item.items[i].quantity;
        total += p * q;

        // var x.sub.push(total);
      }

      res[j].totalWeight = total;
      //alert(total);


      //console.log(total);
      $loading.finish("campaigns");
    }
    $loading.finish("campaigns");

    res.totalCampaign = totalCampaign;
    console.log(totalCampaign);

    // }
    // res.total = total;
  });

  vm.getTotal = function (item) {
    // console.log(item);
    var total = 0;

    for (var i = 0; i < item.items.length; i++) {

      // items[i].total = 0;

      var p = item.items[i].price;
      var q = item.items[i].quantity;
      total += p * q;
      // var x.sub.push(total);
    }
    // console.log(total);

    return total;
  };
  var q = {};
  // q.where = { $and: [ { 'uid' : Auth.getCurrentUser().email },{'startDate': { $lt: Date.now()}} ,{'endDate': { $gt: Date.now()}}, { 'items.status.name':'Approved'} ] };
  q.where = { $and: [{ 'uid': Auth.getCurrentUser().email }] };

  vm.mainGridOptions = {
    dataSource: {

      transport: {
        read: function read(options) {
          //options holds the grids current page and filter settings
          Campaign.my.query(q, function (res) {

            options.success(res);
            console.log(res);
          });
        }
      },
      pageSize: 10,
      serverPaging: true,
      serverSorting: true
    },
    toolbar: ['excel', 'pdf'],

    excel: {
      allPages: true,
      proxyURL: "//demos.telerik.com/kendo-ui/service/export",
      fileName: 'Mediabox-campaigns.xlsx',
      filterable: true
    },
    pdf: {
      allPages: true,
      avoidLinks: true,
      paperSize: "A4",
      margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
      landscape: true,
      repeatHeaders: true,
      template: $("#page-template").html(),
      scale: 0.8
    },
    sortable: true,
    pageable: true,
    editable: "popup",

    filterable: true,

    dataBound: function dataBound() {
      this.expandRow(this.tbody.find("tr.k-master-row").first());
    },
    columns: [{ field: "campaignNo", title: "Campaign Id" }, { field: "campaignName", title: "Campaign Name" }, { field: "startDate", title: "Start Date", type: 'datetime', template: "#=  (startDate == null)? '' : kendo.toString(kendo.parseDate(startDate, 'yyyy-MM-dd'), 'MM/dd/yy') #" }, { field: "endDate", title: "End Date", type: 'datetime', template: "#=  (endDate == null)? '' : kendo.toString(kendo.parseDate(endDate, 'yyyy-MM-dd'), 'MM/dd/yy') #" }, { field: "status", title: "Status" }, { field: "totalSpend", title: "Total" }]
  };

  vm.detailGridOptions = function (dataItem) {

    return {
      dataSource: {
        filter: { field: "id", operator: "eq", value: dataItem.id },
        transport: {
          read: function read(options) {
            //options holds the grids current page and filter settings
            var itemsGrid = [];
            var q = {};
            q.where = { $and: [{ 'uid': Auth.getCurrentUser().email }, { 'startDate': { $lt: Date.now() } }, { 'endDate': { $gt: Date.now() } }, { 'items.status.name': 'Approved' }] };
            Campaign.my.query(q, function (res) {
              console.log(res);

              var total = 0;
              var totalCampaign = res.length;

              // console.log(res.campaignName);
              // for(var i=0;i<res.length;i++){
              //     var subTotal = 0;
              for (var j = 0; j < res.length; j++) {
                total = 0;
                // console.log();
                // subTotal += res[i].shipping.charge;
                var item = res[j];

                //console.log(item.campaignNo);
                //itemsGrid.push(item.items);
                // var x = item.items
                // var x.sub = [];

                for (var i = 0; i < item.items.length; i++) {

                  var itemGridTemp = {
                    campaignNo: item.campaignNo,
                    id: item._id,
                    advertiser: item.items[i].advertiser,
                    category: item.items[i].category,
                    creative: item.items[i].creative,
                    image: item.items[i].image,
                    messages: item.items[i].messages,
                    mrp: item.items[i].mrp,
                    name: item.items[i].name,
                    price: item.items[i].price,
                    publisher: item.items[i].publisher,
                    quantity: item.items[i].quantity,
                    request: item.items[i].request,
                    size: item.items[i].size,
                    sku: item.items[i].sku,
                    status: item.items[i].status,
                    uid: item.items[i].uid
                  };

                  // items[i].total = 0;

                  var p = item.items[i].price;
                  var q = item.items[i].quantity;
                  total += p * q;
                  res.totalSpend = total;
                  // var x.sub.push(total);

                  vm.itemsGrid.push(itemGridTemp);
                }
                //console.log(total);
              }
              res.total = total;
              res.totalCampaign = totalCampaign;

              //vm.filteredData = $filter('filter')(vm.itemsGrid, {id: dataItem.id})[0];

              var data = [];
              //console.log(vm.itemsGrid);
              for (var i = 0; i < vm.itemsGrid.length; i++) {
                var item = vm.itemsGrid[i];
                if (item.campaignNo == dataItem.campaignNo) {
                  //alert(item.campaignNo);
                  data.push(item);
                }

                //options.success(data);
                console.log(data);

                vm.data = [];
              }

              vm.itemsGrid = [];
            });
          }
        },
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        pageSize: 5,
        filterable: true

      },
      scrollable: false,
      sortable: true,

      pageable: true,
      columns: [
      //{ field: "campaignNo", title:"Campaign #", width: "70px" },
      //{ field: "publisher", title:"Publisher", width: "100px" },
      // { field: "category", title:"Category", width: "50px" },
      { field: "name", title: "Name", width: "70px" }, {
        field: "price",
        title: "Price",
        width: "50px",

        template: function template(dataItem) {
          return "<div></span><span style='display:inline-block;width:75%;text-align:left;white-space:nowrap;'>$" + dataItem.price + "</span></div>";
        } }, { field: "quantity", title: "Quantity", width: "30px" }, {

        title: "Status",
        width: "40px",
        template: function template(dataItem) {
          return "<div ng-show= \"dataItem.status.val=='305'\" class=\"alert alert-success\"><small>Approved</small></div>" +
          // "<div ng-show=\"!dataItem.creative\" class=\"alert alert-danger\" ><small>Needs Creative</small></div>"+
          "<div  ng-show = \"dataItem.status.val=='402'\" class=\"alert alert-danger\" ><small>Pending<small></div>" + "<div  ng-show = \"dataItem.status.val=='300'\" class=\"alert alert-success\" ><small>Ready</small> </div>" + "<div  ng-show = \"dataItem.status.val=='500'\" class=\"alert alert-danger\" ><small>Rejected</small> </div>" + "<div  ng-show = \"dataItem.status.val=='309'\" class=\"alert alert-success\" ><small>Completed</small> </div>";
        }
      }, {
        field: "creative",
        title: "Creative",
        width: "50px",
        template: function template(dataItem) {
          return "<div ng-hide=\"dataItem.creative\">" + "<button  class=\"btn btn-danger\"  ng-click=\"vm.openCreative(dataItem,'md')\" ><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button></div>" + "</div>" + "<div ng-show=\"dataItem.creative\">" + "<button  class=\"btn btn-success\"  ng-click=\"vm.openCreative(dataItem,'md')\" ><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button></div>" + "</div>";
          //return "<div> <button  class=\"btn btn-danger\"  ng-click=\"vm.open(cart.items,item,item.creative,'md')\" ><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button></div>";
        } }, {
        title: "Action",
        width: "50px",
        template: function template(dataItem) {
          return "<div  ng-show= \"dataItem.status.val=='305'\" ><button class=\"btn-success btn-sm btn-success\" ng-click=\"cart.addItem({sku:dataItem.sku, name:dataItem.name,slug:adspace.formart,mrp:dataItem.mrp, weight:dataItem.maxSize,size:dataItem.size,price:dataItem.price , publisher:dataItem.publisher,uid:dataItem.uid,category:dataItem.category,image:dataItem.image,quantity:1} ,true);\" ng-show=\"checkCart(dataItem.name)\"><i class=\"fa fa-shopping-cart\" ></i></button></div>";
          // return "<button class=\"btn-success btn-sm btn-success\" ng-click=\"goToSite(site)\">Buy</button>";
        } }]
    };
  };

  vm.action = function (campaign) {
    // method
    console.log(campaign);
    Campaign.delete({ id: campaign._id }, function () {
      console.log("Campaign deleted");

      Campaign.save(campaign).$promise.then(function () {
        toastr.success("Campaign info saved successfully", "Success");
      });
    });
  };

  vm.changeStatus = function (campaign) {
    Campaign.update({ id: campaign._id }, campaign).$promise.then(function (res) {
      console.log(res);
    }, function (error) {
      // error handler
      console.log(error);
      if (error.data.errors) {
        var err = error.data.errors;
        toastr.error(err[Object.keys(err)].message, err[Object.keys(err)].name);
      } else {
        var msg = error.data.message;
        toastr.error(msg);
      }
    });
  };

  var toNumber = function toNumber(value) {
    value = value * 1;
    return isNaN(value) ? 0 : value;
  };
});
//# sourceMappingURL=campaignRunning.controller.js.map

'use strict';

angular.module('mediaboxApp').controller('CampaignScheduledController', function ($scope, $rootScope, $filter, Cart, Auth, $log, $timeout, $mdSidenav, Campaign, $loading) {
  //clear items added to campaign from cart
  Cart.cart.clearItems();
  Cart.cart.products = 20;

  $loading.start("campaigns");

  //console.log(Cart);

  var vm = this;

  vm.itemsGrid = [];

  vm.toggleLeft = buildDelayedToggler('left');
  vm.toggleRight = buildToggler('right');
  vm.isOpenRight = function () {
    return $mdSidenav('right').isOpen();
  };
  /**
   * Supplies a function that will continue to operate until the
   * time is up.
   */
  function debounce(func, wait, context) {
    var timer;
    return function debounced() {
      var context = $scope,
          args = Array.prototype.slice.call(arguments);
      $timeout.cancel(timer);
      timer = $timeout(function () {
        timer = undefined;
        func.apply(context, args);
      }, wait || 10);
    };
  }
  /**
   * Build handler to open/close a SideNav; when animation finishes
   * report completion in console
   */
  function buildDelayedToggler(navID) {
    return debounce(function () {
      $mdSidenav(navID).toggle().then(function () {
        $log.debug("toggle " + navID + " is done");
      });
    }, 200);
  }
  function buildToggler(navID) {
    return function () {
      $mdSidenav(navID).toggle().then(function () {
        $log.debug("toggle " + navID + " is done");
      });
    };
  }

  vm.items = ['item1', 'item2', 'item3'];

  vm.animationsEnabled = true;

  vm.open = function (campaigns, p, creative, size) {
    console.log(creative);
    $rootScope.toMerge = campaigns;
    $rootScope.toMergeCreative = creative;

    var modalInstance = $modal.open({
      animation: vm.animationsEnabled,
      templateUrl: 'creative.html',
      controller: 'ModalInstanceController',
      size: size,
      resolve: {
        items: function items() {
          return p;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      vm.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  vm.openCreative = function (creative, size) {
    console.log(creative);
    // $rootScope.toMerge = campaigns;
    $rootScope.toMergeCreative = creative;

    var modalInstance = $modal.open({
      animation: vm.animationsEnabled,
      templateUrl: 'preview.html',
      controller: 'ModalInstanceController',
      size: size,
      resolve: {
        items: function items() {
          return creative;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      vm.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  vm.openToggle = function (campaigns, p, creative, size) {

    $rootScope.toMergeItems = p;
    $rootScope.toMergeCampaign = campaigns;
    console.log(campaigns);
    console.log(p);

    $scope.items = campaigns;
  };

  vm.openChat = function (campaigns, p, creative, size) {
    console.log(campaigns._id);
    $rootScope.toDelete = campaigns._id;
    $rootScope.toMerge = campaigns;

    var modalInstance = $modal.open({
      animation: vm.animationsEnabled,
      templateUrl: 'chat.html',
      controller: 'ChatInstanceController',
      size: size,
      resolve: {
        items: function items() {
          return p;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      vm.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  vm.openRequest = function (campaigns, p, creative, size) {
    console.log(campaigns._id);
    $rootScope.toDelete = campaigns._id;
    $rootScope.toMerge = campaigns;

    var modalInstance = $modal.open({
      animation: vm.animationsEnabled,
      templateUrl: 'request.html',
      controller: 'RequestInstanceController',
      size: size,
      resolve: {
        items: function items() {
          return p;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      vm.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  vm.toggleAnimation = function () {
    vm.animationsEnabled = !vm.animationsEnabled;
  };

  vm.cmp = {};
  vm.campaignStatusLov = Campaign.status;
  vm.campaignStatus = [{ name: '', val: 402 }, { name: 'Avail Check', val: 201 }, { name: 'Buy', val: 202 }];

  vm.campaigns = Campaign.my.query({}, function (res) {

    var totalCampaign = res.length;

    // console.log(res.campaignName);
    // for(var i=0;i<res.length;i++){
    //     var subTotal = 0;
    for (var j = 0; j < res.length; j++) {

      var total = 0;

      // console.log();
      // subTotal += res[i].shipping.charge;
      var item = res[j];

      //console.log(item.campaignNo);
      //itemsGrid.push(item.items);
      // var x = item.items
      // var x.sub = [];

      for (var i = 0; i < item.items.length; i++) {
        // items[i].total = 0;

        var p = item.items[i].price;
        var q = item.items[i].quantity;
        total += p * q;

        // var x.sub.push(total);
      }

      res[j].totalWeight = total;
      //alert(total);


      //console.log(total);
      $loading.finish("campaigns");
    }
    $loading.finish("campaigns");

    res.totalCampaign = totalCampaign;
    //console.log(totalCampaign);

    // }
    // res.total = total;
  });

  vm.getTotal = function (item) {
    // console.log(item);
    var total = 0;

    for (var i = 0; i < item.items.length; i++) {

      // items[i].total = 0;

      var p = item.items[i].price;
      var q = item.items[i].quantity;
      total += p * q;
      // var x.sub.push(total);
    }
    // console.log(total);

    return total;
  };
  var q = {};
  q.where = { $and: [{ 'uid': Auth.getCurrentUser().email }, { 'startDate': { $gt: Date.now() } }, { 'items.status.name': 'Approved' }] };

  vm.mainGridOptions = {
    dataSource: {

      transport: {
        read: function read(options) {
          //options holds the grids current page and filter settings
          Campaign.my.query(q, function (res) {

            // options.success(res);
            console.log(res);
          });
        }
      },
      pageSize: 10,
      serverPaging: true,
      serverSorting: true
    },
    toolbar: ['excel', 'pdf'],

    excel: {
      allPages: true,
      proxyURL: "//demos.telerik.com/kendo-ui/service/export",
      fileName: 'Mediabox-campaigns.xlsx',
      filterable: true
    },
    pdf: {
      allPages: true,
      avoidLinks: true,
      paperSize: "A4",
      margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
      landscape: true,
      repeatHeaders: true,
      template: $("#page-template").html(),
      scale: 0.8
    },
    sortable: true,
    pageable: true,
    editable: "popup",

    filterable: true,

    dataBound: function dataBound() {
      this.expandRow(this.tbody.find("tr.k-master-row").first());
    },
    columns: [{ field: "campaignNo", title: "Campaign Id" }, { field: "campaignName", title: "Campaign Name" }, { field: "startDate", title: "Start Date", type: 'datetime', template: "#=  (startDate == null)? '' : kendo.toString(kendo.parseDate(startDate, 'yyyy-MM-dd'), 'MM/dd/yy') #" }, { field: "endDate", title: "End Date", type: 'datetime', template: "#=  (endDate == null)? '' : kendo.toString(kendo.parseDate(endDate, 'yyyy-MM-dd'), 'MM/dd/yy') #" }, { field: "status", title: "Status" }, { field: "totalSpend", title: "Total" }]
  };

  vm.detailGridOptions = function (dataItem) {

    return {
      dataSource: {
        filter: { field: "id", operator: "eq", value: dataItem.id },
        transport: {
          read: function read(options) {
            //options holds the grids current page and filter settings
            var itemsGrid = [];
            var q = {};
            q.where = { $and: [{ 'uid': Auth.getCurrentUser().email }, { 'startDate': { $gt: Date.now() } }, { 'items.status.name': 'Approved' }] };
            q.where = { $and: [{ 'uid': Auth.getCurrentUser().email }] };
            Campaign.my.query(q, function (res) {
              console.log(res);

              var total = 0;
              var totalCampaign = res.length;

              // console.log(res.campaignName);
              // for(var i=0;i<res.length;i++){
              //     var subTotal = 0;
              for (var j = 0; j < res.length; j++) {
                total = 0;
                // console.log();
                // subTotal += res[i].shipping.charge;
                var item = res[j];

                //console.log(item.campaignNo);
                //itemsGrid.push(item.items);
                // var x = item.items
                // var x.sub = [];

                for (var i = 0; i < item.items.length; i++) {

                  var itemGridTemp = {
                    campaignNo: item.campaignNo,
                    id: item._id,
                    advertiser: item.items[i].advertiser,
                    category: item.items[i].category,
                    creative: item.items[i].creative,
                    image: item.items[i].image,
                    messages: item.items[i].messages,
                    mrp: item.items[i].mrp,
                    name: item.items[i].name,
                    price: item.items[i].price,
                    publisher: item.items[i].publisher,
                    quantity: item.items[i].quantity,
                    request: item.items[i].request,
                    size: item.items[i].size,
                    sku: item.items[i].sku,
                    status: item.items[i].status,
                    uuid: item.items[i].uid
                  };

                  // items[i].total = 0;

                  var p = item.items[i].price;
                  var q = item.items[i].quantity;
                  total += p * q;
                  res.totalSpend = total;
                  // var x.sub.push(total);

                  vm.itemsGrid.push(itemGridTemp);
                }
                //console.log(total);
              }
              res.total = total;
              res.totalCampaign = totalCampaign;

              //vm.filteredData = $filter('filter')(vm.itemsGrid, {id: dataItem.id})[0];

              var data = [];
              //console.log(vm.itemsGrid);
              for (var i = 0; i < vm.itemsGrid.length; i++) {
                var item = vm.itemsGrid[i];
                if (item.campaignNo == dataItem.campaignNo) {
                  //alert(item.campaignNo);
                  data.push(item);
                }

                //options.success(data);
                console.log(data);

                vm.data = [];
              }

              vm.itemsGrid = [];
            });
          }
        },
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        pageSize: 5,
        filterable: true

      },
      scrollable: false,
      sortable: true,

      pageable: true,
      columns: [
      //{ field: "campaignNo", title:"Campaign #", width: "70px" },
      //{ field: "publisher", title:"Publisher", width: "100px" },
      // { field: "category", title:"Category", width: "50px" },
      { field: "name", title: "Name", width: "70px" }, {
        field: "price",
        title: "Price",
        width: "50px",

        template: function template(dataItem) {
          return "<div></span><span style='display:inline-block;width:75%;text-align:left;white-space:nowrap;'>$" + dataItem.price + "</span></div>";
        } }, { field: "quantity", title: "Quantity", width: "30px" }, {

        title: "Status",
        width: "40px",
        template: function template(dataItem) {
          return "<div ng-show= \"dataItem.status.val=='305'\" class=\"alert alert-success\"><small>Approved</small></div>" +
          // "<div ng-show=\"!dataItem.creative\" class=\"alert alert-danger\" ><small>Needs Creative</small></div>"+
          "<div  ng-show = \"dataItem.status.val=='402'\" class=\"alert alert-danger\" ><small>Pending<small></div>" + "<div  ng-show = \"dataItem.status.val=='300'\" class=\"alert alert-success\" ><small>Ready</small> </div>" + "<div  ng-show = \"dataItem.status.val=='500'\" class=\"alert alert-danger\" ><small>Rejected</small> </div>" + "<div  ng-show = \"dataItem.status.val=='309'\" class=\"alert alert-success\" ><small>Completed</small> </div>";
        }
      }, {
        field: "creative",
        title: "Creative",
        width: "50px",
        template: function template(dataItem) {
          return "<div ng-hide=\"dataItem.creative\">" + "<button  class=\"btn btn-danger\" ng-hide=\"isAdmin()\" ng-click=\"vm.openCreative(dataItem,'md')\" ><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button></div>" + "</div>" + "<div ng-show=\"dataItem.creative\">" + "<button  class=\"btn btn-success\" ng-hide=\"isAdmin()\" ng-click=\"vm.openCreative(dataItem,'md')\" ><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button></div>" + "</div>";
          //return "<div> <button  class=\"btn btn-danger\"  ng-click=\"vm.open(cart.items,item,item.creative,'md')\" ><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button></div>";
        } }, {
        title: "Action",
        width: "50px",
        template: function template(dataItem) {
          return "<div  ng-show= \"dataItem.status.val=='305'\" ><button class=\"btn-success btn-sm btn-success\" ng-click=\"cart.addItem({sku:dataItem.sku, name:dataItem.name,slug:adspace.formart,mrp:dataItem.mrp, weight:dataItem.maxSize,size:dataItem.size,price:dataItem.price , publisher:dataItem.publisher,uid:dataItem.uuid,category:dataItem.category,image:dataItem.image,quantity:1} ,true);\" ng-show=\"checkCart(dataItem.name)\"><i class=\"fa fa-shopping-cart\" ></i></button></div>";
          // return "<button class=\"btn-success btn-sm btn-success\" ng-click=\"goToSite(site)\">Buy</button>";
        } }]
    };
  };

  vm.action = function (campaign) {
    // method
    console.log(campaign);
    Campaign.delete({ id: campaign._id }, function () {
      console.log("Campaign deleted");

      Campaign.save(campaign).$promise.then(function () {
        toastr.success("Campaign info saved successfully", "Success");
      });
    });
  };

  vm.changeStatus = function (campaign) {
    Campaign.update({ id: campaign._id }, campaign).$promise.then(function (res) {
      console.log(res);
    }, function (error) {
      // error handler
      console.log(error);
      if (error.data.errors) {
        var err = error.data.errors;
        toastr.error(err[Object.keys(err)].message, err[Object.keys(err)].name);
      } else {
        var msg = error.data.message;
        toastr.error(msg);
      }
    });
  };

  var toNumber = function toNumber(value) {
    value = value * 1;
    return isNaN(value) ? 0 : value;
  };
});
//# sourceMappingURL=campaignScheduled.controller.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var CampaignsController = function () {
    function CampaignsController(Cart, Country, PaymentMethod, Shipping, Coupon, Campaign, Toast, Settings, $state) {
      _classCallCheck(this, CampaignsController);

      this.campaignStatusLov = Campaign.status;
      this.Campaign = Campaign;
      this.Toast = Toast;
      this.Settings = Settings;
      this.$state = $state;
      this.options = {};
      this.campaigns = Campaign.query();
    }

    _createClass(CampaignsController, [{
      key: 'navigate',
      value: function navigate(params) {
        this.$state.go('single-product', { id: params.sku, slug: params.description }, { reload: false });
      }
    }, {
      key: 'changeStatus',
      value: function changeStatus(campaign) {
        var vm = this;
        var vm = this;
        this.Campaign.update({ id: campaign._id }, campaign).$promise.then(function (res) {}, function (error) {
          // error handler
          if (error.data.errors) {
            vm.Toast.show({
              type: 'error',
              text: error.data.errors.status.message
            });
          } else {
            vm.Toast.show({
              type: 'success',
              text: error.statusText
            });
          }
        });
      }
    }]);

    return CampaignsController;
  }();

  angular.module('mediaboxApp').controller('CampaignsController', CampaignsController);
})();
//# sourceMappingURL=campaigns.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('campaigns', {
    url: '/campaigns',
    templateUrl: 'app/campaigns/campaigns.html',
    controller: 'CampaignsController as campaigns',
    authenticate: 'manager'
  });
});
//# sourceMappingURL=campaigns.js.map

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var CartController = function CartController(ToggleComponent, $filter, Media, Auth, Toast, Campaign, Settings, Cart, SweetAlert, Category, Brand, Product, $state, $stateParams, $mdMedia, $mdDialog) {
    _classCallCheck(this, CartController);

    var vm = this;

    /* autocomplete */
    vm.simulateQuery = true;
    vm.querySearch = querySearch;
    vm.selectedItemChange = selectedItemChange;
    vm.searchTextChange = searchTextChange;
    vm.products = [];
    vm.product = {};
    vm.product.variants = [];
    vm.cart = Cart.cart;
    vm.Settings = Settings;
    vm.$mdMedia = $mdMedia;
    vm.$filter = $filter;
    vm.Media = Media;
    this.Media = Media;
    vm.Toast = Toast;

    console.log(vm.cart);
    // var productId = localStorage !== null ? localStorage.productId : null;

    if ($stateParams.search) // When searched print the search text inside search textbox 
      vm.searchText = $stateParams.name;

    vm.cart.getBestShipper().$promise.then(function (data) {
      vm.shipping = data[0];
      vm.totalPriceAfterShipping = vm.cartTotal + data[0].charge;
    });

    vm.mediaLibrary = function (index) {
      $mdDialog.show({
        template: '<md-dialog aria-label="Media Library" ng-cloak flex="95">\n        <md-toolbar class="md-warn">\n          <div class="md-toolbar-tools">\n            <h2>Media Library</h2>\n            <span flex></span>\n            <md-button class="md-icon-button" ng-click="cancel()">\n              <ng-md-icon icon="close" aria-label="Close dialog"></ng-md-icon>\n            </md-button>\n          </div>\n        </md-toolbar>\n\n        <md-dialog-content>\n            <div class="md-dialog-content"  class="md-whiteframe-z2">\n                <md-grid-list class="media-list" md-cols-xs ="3" md-cols-sm="4" md-cols-md="5" md-cols-lg="7" md-cols-gt-lg="10" md-row-height-gt-md="1:1" md-row-height="4:3" md-gutter="12px" md-gutter-gt-sm="8px" layout="row" layout-align="center center">\n                  <md-grid-tile ng-repeat="i in media" class="md-whiteframe-z2" ng-click="ok(i.path)">\n                    <div class="thumbnail">\n                        <img ng-src="{{i.path}}" draggable="false" alt="{{i.name}}">\n                    </div>\n                    <md-grid-tile-footer><h3>{{i.name}}</h3></md-grid-tile-footer>\n                  </md-grid-tile>\n                </md-grid-list>\n          </div>\n        </md-dialog-content>\n        <md-dialog-actions layout="row">\n          <span flex></span>\n          <md-button ng-click="addNewImage()" class="md-warn md-raised">\n           Add new Image\n          </md-button>\n        </md-dialog-actions>\n      </md-dialog>\n',
        controller: function controller($scope, $mdDialog, $http, socket, $state) {
          // Start query the database for the table
          var vm = this;
          $scope.loading = true;
          $http.get('/api/media/').then(function (res) {
            $scope.loading = false;
            $scope.media = res.data;
            socket.syncUpdates('media', $scope.data);
          }, handleError);

          function handleError(error) {
            // error handler
            $scope.loading = false;
            if (error.status === 403) {
              Toast.show({
                type: 'error',
                text: 'Not authorised to make changes.'
              });
            } else {
              Toast.show({
                type: 'error',
                text: error.status
              });
            }
          }
          $scope.ok = function (path) {
            $mdDialog.hide(path);
          };
          $scope.hide = function () {
            $mdDialog.hide();
          };
          $scope.cancel = function () {
            $mdDialog.cancel();
          };
          $scope.addNewImage = function () {
            $state.go('media');
            //vm.save(vm.product)
            $mdDialog.hide();
          };
        }

      }).then(function (answer) {
        console.log(answer);
        if (index === 1000000) vm.cart.items.push({ size: 'x', creative: answer });else vm.cart.items[index].creative = answer;
      }, function () {});
    };

    function querySearch(input) {
      var data = [];
      if (input) {
        input = input.toLowerCase();
        data = Product.query({ where: { nameLower: { '$regex': input }, active: true }, limit: 10, skip: 0, select: { id: 1, name: 1, slug: 1, 'variants.image': 1 } });
      }
      return data;
    }

    function selectedItemChange(item) {
      $state.go('single-product', { id: item._id, slug: item.slug, search: true, name: item.name }, { reload: false });
    }
    function searchTextChange() {}
    /**
     * Create filter function for a query string
     */

    vm.isLoggedIn = Auth.isLoggedIn;
    vm.openFilter = function () {
      ToggleComponent('filtermenu').open();
    };
    vm.openCart = function () {
      ToggleComponent('cart').open();
      vm.cart.getBestShipper().$promise.then(function (data) {
        vm.shipping = data[0];
        vm.totalPriceAfterShipping = vm.cartTotal + data[0].charge;
      });
    };
    var originatorEv;
    vm.openMenu = function ($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

    vm.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    vm.brands = Brand.query({ active: true });

    vm.isCollapsed = true;
    vm.isCollapsed1 = true;
    vm.getCurrentUser = Auth.getCurrentUser;

    vm.gotoDetail = function (params) {
      $state.go('single-product', { id: params.sku, slug: params.slug }, { reload: false });
    };

    vm.createCampaign = function (cart) {

      var newCampaign = {
        campaignNo: cart.campaignNo,
        cartName: cart.campaignName,
        skuArray: cart.skuArray,
        totalWeight: cart.totalWeight,
        taxRate: cart.taxRate,
        tax: cart.tax,
        campaignName: cart.campaignName,
        objective: cart.objective,
        startDate: cart.startDate,
        endDate: cart.endDate,
        products: cart.products,
        totalSpend: cart.totalSpend,
        spendStats: cart.spendStats,
        shipping: cart.shipping,
        age: cart.age,
        uid: cart.uid,
        income: cart.income,
        items: cart.items

      };

      console.log(newCampaign);

      if (cart.campaignName == "") {

        swal('Oops...', 'Campaign name is required!', 'error');
      } else {

        var mytable = "<table class=\"table table-striped table-responsive\">" + "<tr>" + "<td></td>" + "<td class=\"col-md-1\" style=\"text-align:left\">Publisher</td>" + "<td class=\"col-md-3\" style=\"text-align:left\">Ad Space</td>" + "<td class=\"col-md-3\" style=\"text-align:left\">Dates</td>" + "<td class=\"col-md-2\" style=\"text-align:left\">Price</td>" + "<td class=\"col-md-1\" style=\"text-align:left\">Inserts</td>" + "</tr></tbody>";

        for (var i = 0; i < cart.items.length; i++) {

          mytable += "<tr><td class=\"col-md-1\" style=\"text-align:left\">" + (i + 1) + "</td><td class=\"col-md-2\" style=\"text-align:left\">" + cart.items[i].publisher + "</td>" + "<td class=\"col-md-3\" style=\"text-align:left\">" + cart.items[i].name + "</td>" + "<td class=\"col-md-3\" style=\"text-align:left\">" + cart.items[i].category + "</td>" + "<td class=\"col-md-2\" style=\"text-align:left\">" + vm.Settings.currency.symbol + cart.items[i].price + "</td>" + "<td class=\"col-md-1\" style=\"text-align:left\">" + cart.items[i].quantity + "</td>" + "</tr>";
        }

        mytable += "<tr>" + "<td class=\"col-md-2\" style=\"text-align:left\">Total</td>" + "<td class=\"col-md-4\" style=\"text-align:left\">" + vm.Settings.currency.symbol + cart.getTotalPrice() + "</td>" + "<td class=\"col-md-4\" style=\"text-align:left\">&nbsp;</td>" + "<td class=\"col-md-1\" style=\"text-align:left\">&nbsp;</td>" + "<td class=\"col-md-1\" style=\"text-align:left\">&nbsp;</td>";

        mytable += "</tbody></table>";

        swal({
          title: 'Confirm to continue',
          text: "A proposal will be send to the publisher(s)!",
          type: 'warning',
          html: mytable,
          width: '600px',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, Continue!',
          cancelButtonText: 'No, cancel!',
          confirmButtonClass: 'btn btn-success',
          cancelButtonClass: 'btn btn-danger',
          buttonsStyling: false
        }).then(function (vm) {
          setTimeout(function (vm) {

            swal('Proposal Send!', 'Your proposal has been send ,you will get response from the publisher within 7 working days!', 'success');
            var vm = this;
            Campaign.save(newCampaign).$promise.then(function (res) {

              var vm = this;
              for (var i = 0; i < newCampaign.items.length; i++) {
                var vm = this;
                var item = newCampaign.items[i];

                console.log(item);

                Media.update({ id: item.creative }, { pub: item.uid }).$promise.then(function (res) {}, function (error) {
                  // error handler
                  // 
                  console.log(error);
                  if (error.data.errors) {
                    Toast.show({
                      type: 'error',
                      text: error.data.errors.status.message
                    });
                  } else {
                    Toast.show({
                      type: 'success',
                      text: error.statusText
                    });
                  }
                });
              }

              $state.go('campaign');
              // toastr.success("Campaign created  successfully","Success");
            });
          }, 2000);
        }, function (dismiss) {
          // dismiss can be 'cancel', 'overlay',
          // 'close', and 'timer'
          if (dismiss === 'cancel') {
            swal('Cancelled', 'Process cancelled :)', 'error');
          }
        });
      }
    };

    vm.getQuantity = function (sku) {
      for (var i = 0; i < vm.cart.items.length; i++) {
        if (vm.cart.items[i].sku === sku) {
          return vm.cart.items[i].quantity;
        }
      }
    };

    vm.getQuantity = function (sku) {
      for (var i = 0; i < vm.cart.items.length; i++) {
        if (vm.cart.items[i].sku === sku) {
          return vm.cart.items[i].quantity;
        }
      }
    };
    vm.toggle = function (item, list) {
      //   console.log(item,list);
      if (angular.isUndefined(list)) list = [];
      var idx = list.indexOf(item);
      if (idx > -1) list.splice(idx, 1);else list.push(item);
      vm.filter();
    };

    vm.categories = Category.loaded.query();

    console.log(vm.categories);

    vm.close = function () {
      ToggleComponent('cart').close();
    };
  };

  angular.module('mediaboxApp').controller('CartController', CartController);
})();
//# sourceMappingURL=cart.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('cart', {
    url: '/cart',
    templateUrl: 'app/cart/cart.html',
    controller: 'CartController as cart',
    authenticate: true
  });
});
//# sourceMappingURL=cart.js.map

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var CategoryComponent = function CategoryComponent(Modal) {
    _classCallCheck(this, CategoryComponent);

    this.message = 'Hello';
  };

  angular.module('mediaboxApp').component('category', {
    templateUrl: 'app/category/category.html',
    controller: CategoryComponent
  });
})();
//# sourceMappingURL=category.controller.js.map

'use strict';

// angular.module('mediaboxApp')
//   .config(function ($stateProvider) {
//     $stateProvider
//       .state('category', {
//         url: '/category',
//         template: '<category></category>'
//       });
//   });


angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('category', {
    url: '/category',
    params: { options: null, columns: null },
    views: {
      '': {
        templateUrl: 'app/category/main.html',
        controller: 'CategoriesMainController as main'
      },
      'content@category': {
        url: '/content',
        templateUrl: 'app/category/list.html',
        controller: 'CategoriesListController as list'
      }
    },
    authenticate: 'manager'
  }).state('category-detail', {
    url: '/category-detail/:id',
    onEnter: onEnterUserListDetail, // To open right sidebar
    params: { category: null, categories: null, brands: null, features: null },
    parent: 'category',
    views: {
      '': {
        templateUrl: 'app/category/main.html'
      },
      'detail': {
        templateUrl: 'app/category/detail.html',
        controller: 'CategoriesDetailController as detail'
      }
    },
    authenticate: 'manager'
  }).state('categories-create', {
    url: '/categories-create',
    parent: 'categories',
    params: { data: null },
    views: {
      '': {}
    },
    authenticate: 'manager'
  });
  function resolveIdFromArray($stateParams) {
    return { '_id': $stateParams.id, 'api': $stateParams.api };
  }

  onEnterUserListDetail.$inject = ['$timeout', 'ToggleComponent'];

  function onEnterUserListDetail($timeout, ToggleComponent) {
    $timeout(showDetails, 0, false);

    function showDetails() {
      ToggleComponent('categories.detailView').open();
    }
  }
});
//# sourceMappingURL=category.js.map

'use strict';

(function () {

  function CategoriesDetailController($http, $state, Toast, $stateParams, ToggleComponent, Settings, $mdDialog, socket) {
    var vm = this;
    vm.myDate = new Date();
    vm.header = 'cat';
    vm.cat = {};
    vm.options = {};
    vm.cat.subcat = [];
    vm.cat.newSubCat = {};
    vm.cat.features = [];
    vm.cat.keyFeatures = [];
    vm.unsavedCategory = $stateParams.categories;
    vm.category = angular.copy($stateParams.categories);
    vm.options.categories = angular.copy($stateParams.categories);

    vm.mediaLibrary = function (index) {
      $mdDialog.show({
        template: '<md-dialog aria-label="Media Library" ng-cloak flex="95">\n        <md-toolbar class="md-warn">\n          <div class="md-toolbar-tools">\n            <h2>Media Library</h2>\n            <span flex></span>\n            <md-button class="md-icon-button" ng-click="cancel()">\n              <ng-md-icon icon="close" aria-label="Close dialog"></ng-md-icon>\n            </md-button>\n          </div>\n        </md-toolbar>\n\n        <md-dialog-content>\n            <div class="md-dialog-content"  class="md-whiteframe-z2">\n                <md-grid-list class="media-list" md-cols-xs ="3" md-cols-sm="4" md-cols-md="5" md-cols-lg="7" md-cols-gt-lg="10" md-row-height-gt-md="1:1" md-row-height="4:3" md-gutter="12px" md-gutter-gt-sm="8px" layout="row" layout-align="center center">\n                  <md-grid-tile ng-repeat="i in media" class="md-whiteframe-z2" ng-click="ok(i.path)">\n                \t\t<div class="thumbnail">\n                \t\t\t\t<img ng-src="{{i.path}}" draggable="false" alt="{{i.name}}">\n                \t\t</div>\n                    <md-grid-tile-footer><h3>{{i.name}}</h3></md-grid-tile-footer>\n                  </md-grid-tile>\n                </md-grid-list>\n          </div>\n        </md-dialog-content>\n        <md-dialog-actions layout="row">\n          <span flex></span>\n          <md-button ng-click="addNewImage()" class="md-warn md-raised">\n           Add new Image\n          </md-button>\n        </md-dialog-actions>\n      </md-dialog>\n',
        controller: function controller($scope, $mdDialog, $http, socket, $state) {
          function handleError(error) {
            // error handler
            $scope.loading = false;
            if (error.status === 403) {
              Toast.show({
                type: 'error',
                text: 'Not authorised to make changes.'
              });
            } else {
              Toast.show({
                type: 'error',
                text: error.status
              });
            }
          }

          // Start query the database for the table
          $scope.loading = true;
          $http.get('/api/media/').then(function (res) {
            $scope.loading = false;
            $scope.media = res.data;
            socket.syncUpdates('media', $scope.data);
          }, handleError);

          $scope.ok = function (path) {
            $mdDialog.hide(path);
          };
          $scope.hide = function () {
            $mdDialog.hide();
          };
          $scope.cancel = function () {
            $mdDialog.cancel();
          };
          $scope.addNewImage = function () {
            $state.go('media');
            vm.save(vm.cat);
            $mdDialog.hide();
          };
        }

      }).then(function (answer) {
        vm.cat.subcat[index].image = answer;
      }, function () {});
    };

    // goBack.$inject = ['ToggleComponent'];
    function goBack() {
      ToggleComponent('categories.detailView').close();
      $state.go('^', {}, { location: false });
    }
    vm.goBack = goBack;

    vm.save = function (cat) {
      // refuse to work with invalid data
      if (!cat) {
        Toast.show({
          type: 'error',
          text: 'No cat defined.'
        });
        return;
      }
      if ('newSubCat' in cat) {
        vm.cat.subcat.push(cat.newSubCat);
      }

      function success() {
        vm.cat.newSubCat = {};
        Toast.show({
          type: 'success',
          text: 'Category has been updated'
        });
      };

      function err(err) {
        console.log(err);
        if (cat && err) {}

        Toast.show({
          type: 'warn',
          text: 'Error while updating database'
        });
      };

      $http.patch('/api/categories/' + cat._id, cat).then(success).catch(err);
    };

    vm.deleteFeature = function (index, cat) {
      vm.cat.features.splice(index, 1);
      vm.save(cat);
    };

    vm.deleteKF = function (index, cat) {
      vm.cat.keyFeatures.splice(index, 1);
      vm.save(cat);
    };

    vm.deleteVariants = function (index, cat) {
      vm.cat.subcat.splice(index, 1);
      vm.save(cat);
    };
  }

  angular.module('mediaboxApp').controller('CategoriesDetailController', CategoriesDetailController);
})();
//# sourceMappingURL=detail.controller.js.map

'use strict';

(function () {

  function CategoriesListController($scope, $http, socket, $state, $stateParams, Modal, Toast, Settings, Category, $location, $anchorScroll, $mdDialog) {
    this.cols = [
    // {field: 'image', heading: 'image'},
    { field: 'edit', heading: 'Action' }, { field: 'name', heading: 'name' }, { field: 'status', heading: 'status' }];
    this.header = 'Categories';
    this.sort = {};
    this.$mdDialog = $mdDialog;
    var vm = this;
    vm.loading = true;
    // vm.Cat = Cat;
    // the selected item id
    var _id = null;
    var originatorEv;

    // Tabs
    var selected = null,
        previous = null;
    // this.tabs = tabs;
    $scope.newSubItem = function (scope) {
      var nodeData = scope.$modelValue;
      nodeData.child.push({
        id: nodeData.id * 10 + nodeData.child.length,
        title: nodeData.title + '.' + (nodeData.child.length + 1),
        child: []
      });
    };

    $scope.visible = function (item) {
      return !($scope.query && $scope.query.length > 0 && item.title.indexOf($scope.query) === -1);
    };

    $scope.findNodes = function () {};

    this.getCategories = function () {
      vm.loading = true;
      $http.get('/api/categories').then(function (res) {
        vm.loading = false;
        vm.data = res.data;
        // socket.syncUpdates('category', vm.data);
      }, handleError);
    };

    this.remove = function (scope, node) {
      var confirm = this.$mdDialog.confirm().title('Are you sure to delete the category?').textContent('This is unrecoverable').ariaLabel('Confirm delete category').ok('Please do it!').cancel('No. keep');

      this.$mdDialog.show(confirm).then(function () {
        scope.remove();
        $http.delete('/api/categories/' + node._id, node);
      });
    };

    vm.toggle = function (scope) {
      scope.toggle();
    };

    $scope.treeOptions = {
      dropped: function dropped(event) {
        var sourceNode = event.source.nodeScope;
        var op = event.source.nodesScope.$nodeScope;
        var destNodes = event.dest.nodesScope;
        var sortBefore = event.source.index + 1;
        var sortAfter = event.dest.index + 1;
        var np = destNodes.$parent;
        var me = sourceNode.$modelValue;
        var oldParent = null;
        var newParent = null;
        // var oldParentId = null;
        if (!_.isNull(op)) {
          // If I had a oldParent (If I was already assigned to a oldParent) 
          // Update oldParent's child reference
          oldParent = op.$modelValue;
          $http.put('/api/categories/' + oldParent._id, oldParent).then().catch(err);
        }
        if (!_.isUndefined(np) && !_.isNull(np)) {
          // If I have a newParent now
          // Update my new parent's child reference
          newParent = np.$modelValue;

          $http.put('/api/categories/' + newParent._id, newParent).then().catch(err);
          me.parent = newParent._id;
        }

        $http.put('/api/categories/' + me._id, me).then(vm.getCategories).catch(err);
        // I was recently created or not under any parent
      }

    };

    this.selectedIndex = 2;
    $scope.$watch('selectedIndex', function (current, old) {
      previous = selected;
    });

    // Add new category
    this.addTab = function (category) {
      $http.post('/api/categories', category).then(function (res) {
        vm.loading = false;
        vm.getCategories();
        $location.hash('bottom');
        $anchorScroll();
      }, handleError);
    };

    this.sort.reverse = true;
    this.order = function (predicate) {
      this.sort.reverse = this.sort.predicate === predicate ? !this.sort.reverse : false;
      this.sort.predicate = predicate;
    };

    this.l = 10;
    this.loadMore = function () {
      this.l += 2;
    };

    this.exportData = function (type) {
      var data = JSON.stringify(this.data, undefined, 2);
      var blob;
      if (type === 'txt') {
        // Save as .txt
        blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'cat.txt');
      } else if (type === 'csv') {
        // Save as .csv
        blob = new Blob([document.getElementById('exportable').innerHTML], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
        saveAs(blob, 'cat.csv');
      } else if (type === 'xls') {
        // Save as xls
        blob = new Blob([document.getElementById('exportable').innerHTML], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
        });
        saveAs(blob, 'cat.xls');
      } else {
        // Save as .json
        blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'cat.json');
      }
    };

    this.openMenu = function ($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };
    vm.isSelected = function (cat) {
      return _id === cat._id;
    };

    // Start query the database for categories
    vm.loading = true;
    $http.get('/api/categories').then(function (res) {
      vm.loading = false;
      vm.data = res.data;
    }, handleError);

    // Start query the database for brands
    vm.loading = true;
    $http.get('/api/brands').then(function (res) {
      vm.loading = false;
      vm.brands = res.data;
      socket.syncUpdates('brand', vm.brands);
    }, handleError);

    this.saveSubCategory = function (i, cat) {
      if (cat) {
        i.subcat.push(cat);
      }
      $http.put('/api/categories/' + i._id, i).then(success).catch(err);
    };
    function success(res) {
      var item = vm.cat = res.data;
      Toast.show({ type: 'success', text: 'Category has been updated' });
    }

    function err(err) {
      Toast.show({ type: 'warn', text: 'Error while updating database' });
    }

    this.changeStatus = function (x) {
      $http.put('/api/categories/' + x._id, x).then(success).catch(err);
    };

    this.delete = function (data) {
      var confirm = this.$mdDialog.confirm().title('Are you sure to delete the category?').textContent('This is unrecoverable').ariaLabel('Confirm delete category').ok('Please do it!').cancel('No. keep');

      this.$mdDialog.show(confirm).then(function () {
        $http.delete('/api/categories/' + data._id).then(function () {}, handleError);
      });
    };

    function handleError(error) {
      // error handler
      vm.loading = false;
      if (error.status === 403) {
        Toast.show({ type: 'error', text: 'Not authorised to make changes.' });
      } else if (err.type !== 'demo') {
        Toast.show({ type: 'error', text: error.status });
      }
    }

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('categories');
    });

    this.showInDetails = function (item) {
      _id = item._id;
      $state.go('category-detail', { categories: item }, { location: false });
    };
  }

  angular.module('mediaboxApp').controller('CategoriesListController', CategoriesListController);
})();
//# sourceMappingURL=list.controller.js.map

'use strict';

(function () {

  function CategoriesMainController(Modal, $stateParams) {
    // var options = {api:'cat'};
    // var cols = [{field: 'name', heading:'Name'}];
    // this.create = function(){
    //   Modal.show(cols,options);
    // }
  }

  angular.module('mediaboxApp').controller('CategoriesMainController', CategoriesMainController);
})();
//# sourceMappingURL=main.controller.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    var CheckoutController = function () {
        function CheckoutController(Cart, Country, PaymentMethod, Shipping, Coupon, Order, Pay, Toast, Address, Settings, socket, $scope, Auth, $stateParams, $state, $http, $mdDialog, $window) {
            _classCallCheck(this, CheckoutController);

            var vm = this;
            this.msg = 'No items in cart.';
            this.customer = {};
            this.coupon = {};
            this.Coupon = Coupon;
            this.Shipping = Shipping;
            this.Order = Order;
            this.Pay = Pay;
            this.cart = Cart.cart;
            this.Address = Address;
            this.Auth = Auth;
            this.addr = {};
            this.order = {};
            this.$http = $http;
            this.$mdDialog = $mdDialog;
            this.$window = $window;
            this.socket = socket;
            this.Toast = Toast;
            this.Cart = Cart;
            this.newAddress = false;
            this.options = {};
            this.stripeToken = {
                number: '4242424242424242',
                cvc: '123',
                exp_month: '12',
                exp_year: '2020'
            };
            PaymentMethod.active.query(function (res) {
                vm.paymentOptions = res;
                vm.options.paymentMethod = res[0];
            });
            this.Settings = Settings;
            this.getMyAddress();
            if ($stateParams.id === '404') this.payment = { id: $stateParams.id, msg: JSON.parse($stateParams.msg) };else if ($stateParams.msg) this.payment = { id: $stateParams.id, msg: [{ field: ':', issue: $stateParams.msg }] };

            this.$state = $state;
            $scope.$on('$destroy', function () {
                socket.unsyncUpdates('address');
            });
            // vm.cartTotal = Cart.cart.getTotalPrice();
            // vm.cartCount = Cart.cart.getTotalCount();
            vm.getBestShipper();
        }

        _createClass(CheckoutController, [{
            key: 'getMyAddress',
            value: function getMyAddress() {
                var vm = this;
                vm.Address.my.query(function (res) {
                    vm.address = res;
                    vm.addr = res[0];
                    vm.options.paymentMethod = vm.paymentOptions[0];
                    vm.socket.syncUpdates('address', vm.address);
                });
            }
        }, {
            key: 'switchAddress',
            value: function switchAddress(a) {
                this.options.paymentMethod = this.paymentOptions[0];
                this.addr = a;
                this.getBestShipper();
            }
        }, {
            key: 'delete',
            value: function _delete(item) {
                var vm = this;
                var confirm = this.$mdDialog.confirm().title('Would you like to delete the address?').textContent('This is unrecoverable').ariaLabel('Confirm delete address').ok('Please do it!').cancel('No. keep');

                this.$mdDialog.show(confirm).then(function () {
                    vm.Address.delete({ id: item._id }, function () {}, function (res) {
                        vm.Toast.show({ type: 'error', text: res });
                    });
                });
            }
            // Setting the default country on page load

        }, {
            key: 'getBestShipper',
            value: function getBestShipper() {
                var vm = this;
                vm.Cart.cart.getBestShipper().$promise.then(function (data) {
                    vm.shipping = data[0];
                });
            }
        }, {
            key: 'saveAddress',
            value: function saveAddress(data) {
                var vm = this;
                data.country = vm.Settings.country.name;
                vm.loadingAddress = true;
                if (_.has(data, '_id')) {
                    this.Address.update({ id: data._id }, data, function () {
                        vm.loadingAddress = false;
                        vm.getMyAddress();
                    }, function (err) {
                        // If rejected by auth interceptor.service
                        vm.loadingAddress = false;
                    });
                } else {
                    this.Address.save(data, function () {
                        vm.loadingAddress = false;
                        vm.getMyAddress();
                    });
                }
                vm.addressForm(false);
            }
        }, {
            key: 'addressForm',
            value: function addressForm(visible) {
                this.showAddressForm = visible;
            }
        }, {
            key: 'cancelForm',
            value: function cancelForm(addr) {
                this.showAddressForm = false;
                this.addr = this.address[0];
            }
        }, {
            key: 'checkout',
            value: function checkout(order, o, clearCart) {

                console.log(order);
                console.log(o);

                var vm = this;
                order = _.merge(order, o);
                order.options = {};
                if (!_.has(order, 'phone') || !order.phone) {
                    vm.Toast.show({ type: 'error', text: 'You need to specify an address with phone number' });
                    return;
                }

                if (!_.has(order, 'paymentMethod') || order.paymentMethod.name == undefined || o.paymentMethod.name == null || o.paymentMethod.name == "") {
                    vm.Toast.show({ type: 'error', text: 'Please select a payment method' });
                    return;
                }

                if (this.cart.items.length == 0) {
                    vm.Toast.show({ type: 'error', text: 'Your cart found empty. Please add some items' });
                }
                //order.shipping = vm.shipping.best
                if (!vm.coupon) vm.coupon = { amount: 0 };else if (!vm.coupon.amount) vm.coupon = { amount: 0 };
                order.couponAmount = vm.coupon.amount;
                order.stripeToken = vm.stripeToken;
                order.country_code = vm.Settings.country.code;
                order.currency_code = vm.Settings.currency.code;
                order.exchange_rate = vm.Settings.currency.exchange_rate;
                order.total = vm.cartTotal + this.cart.getHandlingFee() - vm.coupon.amount;
                order.email = this.Auth.getCurrentUser().email;
                order.payment = 'Pending';
                order.items = this.cart.items;
                delete order._id;
                if (true) {
                    this.loading = true;
                    this.cart.checkout(order, clearCart);
                } else {
                    vm.Toast.show({ type: 'error', text: 'Item not available for your location' });
                }
            }
        }, {
            key: 'removeCoupon',
            value: function removeCoupon() {
                this.coupon = {};
            }
        }, {
            key: 'checkCoupon',
            value: function checkCoupon(code, cartValue) {
                var q = {};
                var vm = this;
                // x.where is required else it adds unneccessery colons which can not be parsed by the JSON parser at the Server
                q.where = { code: code, active: true, 'minimumCartValue': { $lte: cartValue } };
                this.Coupon.query(q, function (res) {
                    vm.coupon = res[0];
                });
            }
        }]);

        return CheckoutController;
    }();

    angular.module('mediaboxApp').controller('CheckoutController', CheckoutController);
})();
//# sourceMappingURL=checkout.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('checkout', {
    url: '/checkout?id&msg',
    templateUrl: 'app/checkout/checkout.html',
    controller: 'CheckoutController as checkout',
    authenticate: true
  }).state('payment/prepare', {
    url: '/payment/prepare',
    authenticate: true
  });
});
//# sourceMappingURL=checkout.js.map

'use strict';

angular.module('mediaboxApp').controller('ContactCtrl', function ($scope) {
  $scope.options = [{ field: 'photo', dataType: 'image' }, { field: 'name', noEdit: true }, { field: 'email' }, { field: 'phone' }, { field: 'category', dataType: 'select', options: ['Family', 'Friends', 'Acquaintances', 'Services'] }, { field: 'active', dataType: 'boolean' }];
});
//# sourceMappingURL=contact.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('contact', {
    url: '/contact',
    templateUrl: 'app/contact/contact.html',
    controller: 'ContactCtrl',
    authenticate: true,
    title: 'Contacts Manager'
  });
});
//# sourceMappingURL=contact.js.map

'use strict';

angular.module('mediaboxApp').controller('CountryCtrl', function ($scope) {
  $scope.options = [{ field: 'name' }, { field: 'dial_code' }, { field: 'code' }, { field: 'active', dataType: 'boolean' }];
});
//# sourceMappingURL=country.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('country', {
    url: '/country',
    templateUrl: 'app/country/country.html',
    controller: 'CountryCtrl',
    authenticate: 'manager'
  });
});
//# sourceMappingURL=country.js.map

'use strict';

angular.module('mediaboxApp').controller('CouponCtrl', function ($scope) {
  $scope.options = [{ field: 'code' }, { field: 'amount', dataType: 'currency' }, { field: 'minimumCartValue', dataType: 'number' }, { field: 'info' }, { field: 'type' }, { field: 'active', dataType: 'boolean' }];
});
//# sourceMappingURL=coupon.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('coupon', {
    url: '/coupon',
    templateUrl: 'app/coupon/coupon.html',
    controller: 'CouponCtrl',
    authenticate: 'admin'
  });
});
//# sourceMappingURL=coupon.js.map

'use strict';

angular.module('mediaboxApp').controller('CustomerCtrl', function ($scope) {
  $scope.options = [{ field: 'photo', heading: 'Image', dataType: 'image' }, { field: 'name', noSort: true, noEdit: true }, { field: 'address', dataType: 'textarea' }, { field: 'country', dataType: 'select', options: ['India', 'USA', 'Australlia', 'China', 'Japan'] }, { field: 'active', heading: 'Status', dataType: 'boolean' }];
});
//# sourceMappingURL=customer.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('customer', {
    url: '/customer',
    templateUrl: 'app/customer/customer.html',
    controller: 'CustomerCtrl',
    authenticate: true
  });
});
//# sourceMappingURL=customer.js.map

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var DashboardController = function DashboardController(Settings) {
    _classCallCheck(this, DashboardController);

    this.getColor = function ($index) {
      var _d = ($index + 1) % 11;
      var bg = '';

      switch (_d) {
        case 1:
          bg = 'red';break;
        case 2:
          bg = 'green';break;
        case 3:
          bg = 'darkBlue';break;
        case 4:
          bg = 'blue';break;
        case 5:
          bg = 'yellow';break;
        case 6:
          bg = 'pink';break;
        case 7:
          bg = 'darkBlue';break;
        case 8:
          bg = 'purple';break;
        case 9:
          bg = 'deepBlue';break;
        case 10:
          bg = 'lightPurple';break;
        default:
          bg = 'yellow';break;
      }

      return bg;
    };

    this.pages = [];
    this.pages = Settings.menu.pages;
  };

  angular.module('mediaboxApp').controller('DashboardController', DashboardController);
})();
//# sourceMappingURL=dashboard.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('dashboard', {
    url: '/dashboard',
    templateUrl: 'app/dashboard/dashboard.html',
    controller: 'DashboardController',
    controllerAs: 'dashboard',
    title: 'Shop Dashboard for Admin',
    authenticate: true
  });
});
//# sourceMappingURL=dashboard.js.map

'use strict';

angular.module('mediaboxApp').controller('DocumentationCtrl', function () {
  this.topFeatures = [{ h: 'PayPal Shopping Cart', p: 'Enter your paypal app ID into settings, add products and start selling with no matter of time. This has got inbuilt multi currency support with curency conversion feature', i: 'assets/images/paypal-5a1f3f0ed3.png' }, { h: 'MEAN Stack', p: 'Developed using the most popular MEAN(MongoDB + Express + Angular + Node) which has a RestAPI based architecture with high scallability.', i: 'assets/images/mean.png' }, { h: 'Authentication', p: 'Inbuilt authentication mechanism with role based user access and user management', i: 'assets/images/user-roles-24d315695b.png' }, { h: 'Material Design', p: 'Most of the components are based on Google Material designe guidelines which gives you a responsive, bold and accessible design with great amount of user interactivity', i: 'assets/images/material-design-ae5e96c744.png' }, { h: 'Emails', p: 'Integration of emails at diffent levels like Order Placement, Forgot/Reset password gives a secure as well as informative feeling', i: 'assets/images/email-3fc794f7ea.png' }, { h: 'Modular Code', p: 'The modular application structure gives you enormous ability to modify, test and deploy easily', i: 'assets/images/code-65cc386e89.png' }];
  this.why = [{ h: 'Drag and drop category selection', i: 'playlist_add', c: 'fill: #FF5722' }, { h: 'AngularJS Shopping Cart', i: 'shopping_basket', c: 'fill:#DE140E' }, { h: 'Local + OAUTH login', i: 'lock_outline', c: 'fill: #2196F3' }, { h: 'Email integration', i: 'email', c: 'fill: #FABD0E' }, { h: 'PayPal Checkout', i: 'account_balance_wallet', c: 'fill: #795548' }, { h: 'Material Design', i: 'devices', c: 'fill: #ab47bc' }, { h: 'CRUD Generator', i: 'settings', c: 'fill: #3949ab' }, { h: 'Image uploader', i: 'collections', c: 'fill: #8bc34a' }, { h: 'ReST API based backend', i: 'http', c: 'fill: #26a69a' }];

  this.future = [{ h2: 'Multivendor', p: 'Support for multiple vendors where each vendor will have their own profile to mange their orders' }, { h2: 'Social Media', p: 'Integration of social info profile of each customer' }, { h2: 'Backorders', p: 'Shoppers can order an item even if stock is 0' }, { h2: 'Additional Payment Methods', p: 'Support for more payment methods e.g. Stripe, Credit Card.' }, { h2: 'Inventory Mangement', p: 'The store owner can manage inventory with automated replenishment orders' }, { h2: 'SMS Integration', p: 'SMS for each important transaction performed' }, { h2: 'Hotkeys', p: 'Keyboard Shortcuts for regular tasks' }, { h2: 'Reviews', p: 'Product Reviews and Comments' }, { h2: 'Ratings', p: 'Product Ratings feature' }, { h2: 'Tax Management', p: 'Integrated Tax Manager' }, { h2: 'Theming', p: 'Advanced theming support for the whole website' }, { h2: 'Static Page Management', p: 'Create and edit static pages, such as Contact, About, or Support.' }, { h2: 'Returns and Refunds', p: 'Adminster and manage returns and refunds.' }];

  this.newFeatures = [{ h2: 'Coupons', p: 'Ability yo manage discount coupons on cart total', i: 'settings' }, { h2: 'Media Management', p: 'With integrated drag and drop image upload its easy to manage the images for the whole shop' }, { h2: 'NodeJS Module', p: 'ES6 module structure for serve side programming.' }, { h2: 'Order Management', p: 'PayPal integration with orders' }, { h2: 'User Roles', p: 'Role based user management for both client and server side e.g. User, Manager, Administrator' }, { h2: 'Email Integration', p: 'Now an email is sent as soon as a order is placed or payment failed' }, { h2: 'Material Design', p: 'Mobile Centered Material Designed components with accessibility support' }, { h2: 'New Design Principle', p: 'Flex based page design principle' }, { h2: 'CRUD Table', p: 'Free Material CRUD Table module comes with this Material Shop' }, { h2: 'Image Selector', p: 'Directly select image for a product from the media gallery' }, { h2: 'Cloning', p: 'Now Clone any brand, country, shipping, coupon to save time' }, { h2: 'Multi Level Category', p: 'Drag and drop category management upto 10 levels' }, { h2: 'Multi Currency', p: 'Support for additional currencies beyond US Dollars from a single settings page' }, { h2: 'Forgot Password', p: 'Forgotten password of a user or shop manager can be retrieved with a encryption based email service' }, { h2: 'Contact Page', p: 'A tiny little popup window for anybody to reach the store owner with any grievance or suggestions' }, { h2: 'PayPal', p: 'Now PayPal integration is more powerful with the managed payment status' }, { h2: 'Search', p: 'Auto-suggest, keyword product search.' }];

  this.storeFrontFeatures = [{ h2: 'MEAN', p: 'The MEAN Stack ecommerce with Material Design' }, { h2: 'AngularJS', p: 'A whole ecommerce application created using AngularJS as front end' }, { h2: 'NodeJS', p: 'The backend (server side) is backed with the awesome NodeJS framework for better speed and wide extensions support with a very large community base' }, { h2: 'MongoDB', p: 'The document based No_SQL database used for faster communication and more efficiency' }, { h2: 'Modular', p: 'Industry standard application module structure' }, { h2: 'Single Page', p: 'SPA(Single Page App) created with the power of AngularJS and ui-router' }, { h2: 'One Page Checkout', p: 'Instant and single page advance checkout system' }, { h2: 'SocketIO', p: 'Now every activity by a user or shop manger is reflected in realtime across the web app(without page reloads)' }, { h2: 'Acive/Inactive', p: 'Option to save inactive product for publishing later' }, { h2: 'Product Variants', p: 'Option to add multiple variants of a single product with different price, size and image' }, { h2: 'Product Features', p: 'Additional product details in key/value list' }, { h2: 'Featured Product Details', p: 'More product details in key/value list which need to be highlighted in the product details page' }, { h2: 'Cross Platform', p: 'Cross Platform development setup with efficient with gulp, bower, npm' }, { h2: 'Product Category', p: 'Category wise product details' }, { h2: 'Filters', p: 'Advanced features like Multiple brands selector, Prodcut type filter, price slider' }, { h2: 'OAUTH', p: 'Integrated social media login' }, { h2: 'Passwords', p: 'Reset and Change Password option' }, { h2: 'Infinite Scroll', p: 'Automatically load more products on scroll without the need of pagination' }, { h2: 'SEO friendly', p: 'SEO friendly URLs for each page' }, { h2: 'Assistive Technology', p: 'Ready for screen readers for improved assistive' }, { h2: 'Contact Form', p: 'Email service for queries/suggestions/grievances through popup contact form' }];

  this.storeBackFeatures = [{ h2: 'Manage Backoffice', p: 'Products, Categories, Brand, Order Management from admin panel with easy directives' }, { h2: 'Order Management', p: 'Manage Order and Change Status from admin panel' }, { h2: 'Product Variants', p: 'Facility for Multiple product variants (size, color, price, image)' }, { h2: 'User roles', p: '- Administrator, User, Manager' }, { h2: 'Quality Code', p: 'Secure and quality code - Takes care all single page web app standards' }, { h2: 'Secure', p: 'Securely built and prevent security attacks' }, { h2: 'CRUD Generator', p: 'Generates CRUD(Create, Read, Update, Delete) pages automatically from database.' }, { h2: 'ReST API', p: 'NodeJS based ReST API architecture' }, { h2: 'Date picker', p: 'Integrated material designed date picker for date fields' }, { h2: 'Modular Code', p: 'Code is Modular, Maintainable, Well Structured, Easy to customize, Production Ready' }, { h2: 'HTML Components Generator', p: 'Automatically generates dropdowns, datepickers, number field, toggle switch based on field types' }, { h2: 'Exportable', p: 'Easily export the table as Excel, JSON, txt format' }];
});
//# sourceMappingURL=documentation.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('doc', {
    url: '/doc',
    templateUrl: 'app/documentation/index.html',
    controller: 'DocumentationCtrl as doc'
  }).state('docInstall', {
    url: '/doc/install',
    templateUrl: 'app/documentation/install.html',
    controller: 'DocumentationCtrl as doc'
  }).state('docFeatures', {
    url: '/doc/features',
    templateUrl: 'app/documentation/features.html',
    controller: 'DocumentationCtrl as doc'
  }).state('docUse', {
    url: '/doc/use',
    templateUrl: 'app/documentation/use.html',
    controller: 'DocumentationCtrl as doc'
  });
}).directive('docMenu', function ($state) {
  return {
    restrict: 'E',
    link: function link(scope, element, attrs) {
      scope.page = $state.current.name;
    },
    template: '\n      <md-toolbar class="md-whiteframe-2dp">\n        <div class="md-toolbar-tools navbar" layout="row" layout-align="space-around center">\n          <h3><a ui-sref="/">Material Shop</a></h3>\n        <md-button ui-sref="docInstall" class="md-raised md-default md-button md-ink-ripple" flex="20" ng-hide="page==\'docInstall\'"><ng-md-icon icon="now_widgets"></ng-md-icon>Installation</md-button>\n        <md-button ui-sref="doc" class="md-raised md-default md-button md-ink-ripple" flex="20" ng-hide="page==\'doc\'"><ng-md-icon icon="star"></ng-md-icon>Highlights</md-button>\n        <md-button ui-sref="docFeatures" class="md-raised md-default md-button md-ink-ripple" flex="20" ng-hide="page==\'docFeatures\'"><ng-md-icon icon="spellcheck"></ng-md-icon>Features</md-button>\n        <md-button ui-sref="docUse" class="md-raised md-default md-button md-ink-ripple" flex="20" ng-hide="page==\'docUse\'"><ng-md-icon icon="spellcheck"></ng-md-icon>Store Use</md-button>\n        <md-button ui-sref="/" class="md-raised md-default md-button md-ink-ripple" flex="20" ng-hide="page==\'docBack\'"><ng-md-icon icon="spellcheck"></ng-md-icon>Store Demo</md-button>\n      </div>\n      </md-toolbar>\n      '
  };
}).directive('docNav', function ($state) {
  return {
    restrict: 'E',
    link: function link(scope, element, attrs) {
      scope.page = $state.current.name;
    },
    template: '\n      <md-button ui-sref="docInstall" class="md-raised md-primary md-button md-ink-ripple" ng-hide="page==\'docInstall\'"><ng-md-icon icon="now_widgets"></ng-md-icon>Installation</md-button>\n        <md-button ui-sref="doc" class="md-raised md-primary md-button md-ink-ripple"   ng-hide="page==\'doc\'"><ng-md-icon icon="star"></ng-md-icon>Highlights</md-button>\n        <md-button ui-sref="docFeatures" class="md-raised md-primary md-button md-ink-ripple" ng-hide="page==\'docFeatures\'"><ng-md-icon icon="spellcheck"></ng-md-icon>Features</md-button>\n      '
  };
});
//# sourceMappingURL=documentation.js.map

'use strict';

angular.module('mediaboxApp').controller('FeatureCtrl', function ($scope) {
  $scope.options = [{ field: 'key' }, { field: 'val' }, { field: 'active', dataType: 'boolean' }];
});
//# sourceMappingURL=feature.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('feature', {
    url: '/feature',
    templateUrl: 'app/feature/feature.html',
    controller: 'FeatureCtrl',
    authenticate: 'manager'
  });
});
//# sourceMappingURL=feature.js.map

"use strict";
//# sourceMappingURL=campaign.controller.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var MainController = function () {
    function MainController($scope, $state, $stateParams, $http, $location, Cart, Product, Brand, BrandMG, BrandTV, Category, Feature, Settings, socket, $rootScope, $injector, $loading, $timeout, $mdMedia) {
      _classCallCheck(this, MainController);

      var vm = this;
      // Start query the database for products
      // this.loading = true;
      // if ($stateParams.productSku) { // != null
      //     this.product = this.store.getProduct($stateParams.productSku);
      // }
      // this
      this.$http = $http;
      this.$timeout = $timeout;
      this.$loading = $loading;
      this.$mdMedia = $mdMedia;
      this.$location = $location;
      this.$state = $state;
      this.Product = Product;
      this.product = {};
      this.products = {};
      this.filtered = {};
      this.products.busy = false;
      this.products.end = false;
      this.products.after = 0;
      this.products.items = [];
      this.fl = {};
      this.fl.brands = [];
      this.fl.categories = [];
      this.priceSlider = {};
      this.features = Feature.group.query();
      this.categories = Category.query();
      this.brands = Brand.query({ active: true });
      this.Brand = Brand;
      this.Category = Category;
      this.BrandMG = BrandMG;
      this.BrandTV = BrandTV;
      this.selected = [];
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$injector = $injector;
      this.Settings = Settings;
      // this.fl.brands = this.selected;
      this.sort = this.products.sort = $stateParams.sort;
      this.q = { where: { active: true }, limit: 20 };
      this.f = [];
      this.fl.features = {};
      this.resetPriceRange();

      // This is done at ui-router resolve
      // var id = $stateParams.id;
      // // Storing the product id into localStorage because the _id of the selected product which was passed as a hidden parameter from products won't available on page refresh
      // if (localStorage !== null && JSON !== null && id !== null) {
      //     localStorage.productId = id;
      // }
      // var productId = localStorage !== null ? localStorage.productId : null;

      // if (productId && productId !== 'undefined') { // To avoid product undefined error at Category/slug/id page
      //     this.product = Product.get({id:productId});
      // }


      //Range slider config
      this.priceSlider = {
        min: 0,
        options: {
          floor: 0,
          step: 1,
          translate: function translate(value) {
            return vm.Settings.currency.symbol + value;
          },
          onStart: function onStart() {
            // console.log('start slider......');
          },
          onChange: function onChange() {
            // console.log('change slider......');
          },
          onEnd: function onEnd() {
            // console.log('end slider......');
            vm.filter(vm, 'price');
          }
        }
      };

      if ('page' in $stateParams) {
        this.brands = false;
        console.log($stateParams);
        if ($stateParams.slug === 'magazines' || $stateParams.slug === 'newspapers') {
          this.brands = this.BrandMG.query({ active: true });
          console.log(this.brands);
        } else if ($stateParams.slug === 'banner' || $stateParams.slug === 'social-media') {
          this.brands = this.Brand.query({ active: true });
          console.log(this.brands);
        } else if ($stateParams.slug === 'television' || $stateParams.slug === 'cinema' || $stateParams.slug === 'radio') {
          this.brands = this.BrandTV.query({ active: true });
          console.log(this.brands);
        } else {}

        //this.brands = this.Brand.query({active:true});

        // If category or brand page

        if ($stateParams.page && $stateParams._id) {
          this.products.brand = { _id: $stateParams._id };
          this.breadcrumb = { type: $stateParams.page };
          this.generateBreadCrumb(this, $stateParams.page, $stateParams._id);
          if ($stateParams.page === 'Category') {
            this.fl.categories.push({ _id: $stateParams._id, name: $stateParams.slug });
          } else if ($stateParams.page === 'Brand') {

            this.fl.brands.push({ _id: $stateParams._id, name: $stateParams.slug });
          }
          // this.resetPriceRange(this);
        } else {
          this.q = { sort: this.sort, limit: 20 };
        }
        this.filter(this);
      } else {
        this.q = { limit: 20 };
      }

      this.scroll = function () {
        if (this.products.busy || this.products.end) {
          return;
        }
        this.products.busy = false;
        this.q.skip = this.products.after;
        this.displayProducts(this.q);
      };

      $scope.$on('$destroy', function () {
        socket.unsyncUpdates('product');
      });

      this.selectedFeatures = [];
      this.selectedSubFeatures = [];
    }
    // for the checkboxs


    _createClass(MainController, [{
      key: 'exists',
      value: function exists(item, list) {
        if (angular.isUndefined(list)) list = [];
        return list.indexOf(item) > -1;
        // this.filter(this);
      }
    }, {
      key: 'toggle',
      value: function toggle(item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) list.splice(idx, 1);else list.push(item);
        this.filter(this);
      }
    }, {
      key: 'navigate',
      value: function navigate(page, params) {
        if (page === 'sort') {
          delete params.$$hashKey;
          var paramString = JSON.stringify(params);
          this.$state.go(this.$state.current, { sort: paramString }, { reload: true });
        } else if (params) {
          this.$location.replace().path(page + '/' + params.slug + '/' + params._id);
        } else {
          this.$location.replace().path('/');
        }
      }
    }, {
      key: 'gotoDetail',
      value: function gotoDetail(params) {
        this.$state.go('single-product', { id: params._id, slug: params.slug }, { reload: false });
      }
    }, {
      key: 'gotoCheckout',
      value: function gotoCheckout(params) {
        this.$state.go('checkout');
      }
    }, {
      key: 'generateBreadCrumb',
      value: function generateBreadCrumb(vm, page, id) {
        vm.breadcrumb.items = [];
        var api = vm.$injector.get(page);
        api.get({ id: id }).$promise.then(function (child) {
          vm.breadcrumb.items.push(child);
          if (page === 'Category') {
            vm.breadcrumb.items.push({ name: 'All Categories' });
          } else if (page === 'Brand') {
            vm.breadcrumb.items.push({ name: 'All Brands' });
          }
        });
      }
    }, {
      key: 'filter',
      value: function filter(vm) {
        // var q = {};
        var f = [];
        if (vm.fl.features) {
          _.forEach(vm.fl.features, function (val, key) {
            if (val.length > 0) {
              f.push({ 'features.key': key, 'features.val': { $in: val } });
            }
          });
        }

        if (vm.fl.brands) {
          if (vm.fl.brands.length > 0) {
            var brandIds = [];
            _.forEach(vm.fl.brands, function (brand) {
              brandIds.push(brand._id);
            });
            f.push({ 'brand': { $in: brandIds } });
          }
        }
        if (vm.fl.categories) {
          if (vm.fl.categories.length > 0) {
            var categoryIds = [];
            _.forEach(vm.fl.categories, function (category) {
              categoryIds.push(category._id);
            });
            f.push({ 'category': { $in: categoryIds } });
          }
        }

        f.push({ 'variants.price': { $gt: vm.priceSlider.min, $lt: vm.priceSlider.max } });

        // var vm = this;
        if (f.length > 0) {
          vm.q.where = { $and: f };
        } else {
          vm.q.where = {};
        }

        vm.displayProducts(vm.q, true);
        // vm.resetPriceRange(vm.q);
      }
    }, {
      key: 'sortNow',
      value: function sortNow(sort) {
        this.q.sort = sort;
        this.displayProducts(this.q, true);
      }
    }, {
      key: 'displayProducts',
      value: function displayProducts(q, flush) {
        var products = this.products;
        var filtered = this.filtered;
        var $loading = this.$loading;
        if (flush) {
          q.skip = 0;
          products.items = [];
          products.end = false;
          products.after = 0;
        }
        $loading.start('products');
        products.busy = true;
        var vm = this;
        this.Product.query(q, function (data) {
          var _loop = function _loop() {
            item = data[i];


            console.log(item.category);
            catid = item.category;
            brandid = item.brand;


            vm.$http.get('/api/brands/' + brandid).then(success2).catch(err2);
            function success2(res) {
              console.log(res.data.name);
              item.startDate = res.data.name;
            }

            function err2(err) {
              console.log(err);
              // if (product && err) {
              // }
            }

            vm.$http.get('/api/categories/' + catid).then(success).catch(err);
            function success(res) {
              console.log(res.data.name);
              item.endDate = res.data.name;
            }

            function err(err) {
              console.log(err);
              // if (product && err) {
              // }
            }

            products.items.push(data[i]);
          };

          for (var i = 0; i < data.length; i++) {
            var item;
            var catid;
            var brandid;

            _loop();
          }
          // Products count
          filtered.count = data.length + products.after;
          if (data.length >= 5) {
            products.after = products.after + data.length;
          } else {
            products.end = true;
          }

          products.busy = false;
          $loading.finish('products');
        }, function () {
          products.busy = false;vm.$loading.finish('products');
        }).$promise.then(function () {
          vm.Product.count.query(q, function (res) {
            products.count = res[0].count;
          });
        });
      }
    }, {
      key: 'resetPriceRange',
      value: function resetPriceRange(q) {
        // Could not be implemented. Need to try again later
        var vm = this;
        vm.Product.pr.get(q, function (data) {
          vm.priceSlider.options.floor = data.min;
          vm.priceSlider.min = data.min;
          vm.priceSlider.options.ceil = data.max;
          vm.priceSlider.max = data.max;
        });
      }

      // For Price slider

    }, {
      key: 'currencyFormatting',
      value: function currencyFormatting(value) {
        return this.Settings.currency.symbol + ' ' + value.toString();
      }
    }, {
      key: 'removeFeatures',
      value: function removeFeatures(features, k, f) {
        this.fl.features[k] = _.without(features, f);
        this.filter(this);
      }
    }, {
      key: 'removeBrand',
      value: function removeBrand(brand) {
        var index = this.fl.brands.indexOf(brand);
        if (index > -1) {
          this.fl.brands.splice(index, 1);
          this.filter(this);
        }
      }
    }, {
      key: 'removeCategory',
      value: function removeCategory() {
        this.fl.categories = undefined;
        this.filter();
      }
    }, {
      key: 'handleError',
      value: function handleError(error) {
        // error handler
        this.loading = false;
        if (error.status === 403) {
          Toast.show({
            type: 'error',
            text: 'Not authorised to make changes.'
          });
        } else {
          Toast.show({
            type: 'error',
            text: error.status
          });
        }
      }
    }]);

    return MainController;
  }();

  angular.module('mediaboxApp').controller('MainController', MainController);
})();
//# sourceMappingURL=main.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('/', {
    url: '/',
    templateUrl: 'app/main/main.html',
    controller: 'MainController as main',
    title: 'Mediabox | Discover | Plan | Buy '
  }).state('/Category', {
    url: '/Category',
    templateUrl: 'app/main/test.html',
    controller: 'MainController as main',
    title: 'Categories'
  }).state('/campaign', {
    url: '/campaign',
    templateUrl: 'app/main/campaign.html',
    controller: 'CampaignController as cart',
    title: 'Campaign'

  }).state('single-product', {
    params: { id: null, name: null, slug: null, search: false },
    url: '/p/:slug',
    templateUrl: 'app/main/single-product.html',
    controller: 'SingleProductController as single',
    title: 'Product details',
    resolve: {
      SingleProduct: function SingleProduct($stateParams, Product) {
        // Storing the product id into localStorage because the _id of the selected product which was passed as a hidden parameter from products won't available on page refresh
        var id = $stateParams.id;
        if (localStorage !== null && JSON !== null && id !== null) {
          localStorage.productId = id;
        }
        var productId = localStorage !== null ? localStorage.productId : null;

        if (productId) {
          // != null
          return Product.get({ id: productId });
        }

        // return productId;
      }
    }
  }).state('main', {
    title: 'Mediabox',
    url: '/',
    templateUrl: 'app/main/main.html',
    controller: 'MainController as main',
    params: {
      sort: null
    }
  })
  // When a category selected from the navbar megamenu
  .state('SubProduct', {
    title: 'All products under current category or brand',
    url: '/:page/:slug/:_id',
    templateUrl: 'app/main/main.html',
    controller: 'MainController as main',
    params: {
      id: null,
      sort: null,
      brand: null,
      category: null,
      price1: 0,
      price2: 100000
    }
  });
});
//# sourceMappingURL=main.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    var SingleProductController = function () {
        function SingleProductController($stateParams, $scope, Product, Review, socket, SingleProduct, Auth, Toast, LoginModal, $mdDialog, appConfig) {
            _classCallCheck(this, SingleProductController);

            var vm = this;

            vm.$mdDialog = $mdDialog;
            vm.$scope = $scope;
            vm.currentUser = Auth.getCurrentUser();
            vm.LoginModal = LoginModal;
            vm.Auth = Auth;
            vm.Toast = Toast;
            vm.Review = Review;

            $scope.vm = vm;

            var id = $stateParams.id;
            console.log($stateParams);
            if (localStorage !== null && JSON !== null && id !== null) {
                localStorage.productId = id;
            }
            vm.productId = localStorage !== null ? localStorage.productId : null;

            SingleProduct.$promise.then(function (res) {
                vm.product = res;
                console.log(res.category.name);

                if (res.category.name == "Magazines") {
                    vm.magazines = true;
                } else if (res.category.name == "Television") {
                    vm.television = true;
                } else if (res.category.name == "Radio") {
                    vm.radio = true;
                } else if (res.category.name == "Newspapers") {
                    vm.newspapers = true;
                } else if (res.category.name == "Fliers") {
                    vm.fliers = true;
                } else if (res.category.name == "Cinema") {
                    vm.cinema = true;
                } else if (res.category.name == "Airline") {
                    vm.airline = true;
                } else if (res.category.name == "Instore") {
                    vm.instore = true;
                } else if (res.category.name == "Email Marketing") {
                    vm.emailMarketing = true;
                } else if (res.category.name == "Bulk SMS") {
                    vm.bulkSms = true;
                } else if (res.category.name == "Banner") {
                    vm.banner = true;
                } else if (res.category.name == "Social Media") {
                    vm.socialMedia = true;
                } else if (res.category.name == "Billboards") {
                    vm.billboards = true;
                } else {
                    vm.default = true;
                }

                if (!appConfig.reviewSettings.enabled) {
                    // If the settings says not to enable reviews
                    return;
                }
                vm.q = { pid: SingleProduct._id };
                vm.getReviews();
            });
            vm.i = 0;
            vm.changeIndex = function (i) {
                vm.i = i;
            };
        }

        _createClass(SingleProductController, [{
            key: "preview",
            value: function preview(adspace) {

                console.log(adspace);
                var vm = this;

                if (adspace.image) {

                    vm.name = adspace.name;
                    vm.size = adspace.size;
                    vm.formart = adspace.formart;

                    vm.image = {
                        src: adspace.image,
                        position: {
                            x: -137.5,
                            y: -68
                        },
                        scaling: 1,
                        maxScaling: 5,
                        scaleStep: 0.11,
                        mwScaleStep: 0.09,
                        moveStep: 99,
                        fitOnload: true,
                        progress: 0
                    };

                    this.$scope.$watch('adspace.image', function (newValue) {
                        if (typeof newValue != "string") {
                            console.log(newValue);
                        }
                    });
                } else {
                    vm.name = false;
                    vm.size = false;
                }
            }
        }, {
            key: "getReviews",
            value: function getReviews() {
                var vm = this;
                vm.Review.my.query(vm.q, function (r) {
                    vm.reviews = r;
                    vm.publishtRatings(vm.reviews);
                });
            }
        }, {
            key: "publishtRatings",
            value: function publishtRatings(r) {
                var vm = this;
                var reviewCount = 0;
                var rating = { r5: 0, r4: 0, r3: 0, r2: 0, r1: 0, count: 0, total: 0, avg: 0 };
                r.forEach(function (i) {
                    if (i.message) reviewCount++;
                    if (i.rating) rating.count++;
                    if (i.rating) rating.total = rating.total + i.rating;
                    if (i.rating == 5) rating.r5++;
                    if (i.rating == 4) rating.r4++;
                    if (i.rating == 3) rating.r3++;
                    if (i.rating == 2) rating.r2++;
                    if (i.rating == 1) rating.r1++;
                }, this);
                vm.reviewCount = reviewCount;
                rating.avg = Math.round(rating.total / rating.count * 10) / 10;
                vm.rating = rating;
            }
        }, {
            key: "deleteReview",
            value: function deleteReview(review) {
                var vm = this;
                var confirm = this.$mdDialog.confirm().title('Are you sure to delete your review?').textContent('This is unrecoverable').ariaLabel('Confirm delete review').ok('Please do it!').cancel('No. keep');

                this.$mdDialog.show(confirm).then(function () {
                    vm.Review.delete({ id: review._id }, function () {
                        vm.getReviews();
                    }, function (err) {
                        vm.Toast.show({ type: 'error', text: 'Error while saving your review: ' + err.data });
                    });
                });
            }
        }, {
            key: "myReview",
            value: function myReview(review) {
                if (this.Auth.getCurrentUser().email == review.email) return true;
            }
        }, {
            key: "reviewForm",
            value: function reviewForm() {
                var vm = this;
                if (!vm.Auth.getCurrentUser().name) {
                    vm.LoginModal.show('single-product', true); // Reload the route, else it won't show the wishlist status of the product
                    return;
                }
                vm.$mdDialog.show({
                    templateUrl: 'app/main/review-form.html',
                    controller: NewReviewController
                }).then(function (data) {
                    vm.getReviews();
                    if (vm.reviewSettings.moderate) vm.Toast.show({ type: 'success', text: 'Your review is under moderation. Will be visible to public after approval.' });
                });
                function NewReviewController($scope, $mdDialog, Review, Toast) {
                    var user = vm.Auth.getCurrentUser();
                    $scope.hide = function () {
                        $mdDialog.hide();
                    };
                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    };
                    $scope.save = function (data) {
                        if (!data) {
                            $scope.message = 'Please rate the item from a scale of 1-5';
                            return;
                        }
                        data.pid = vm.product._id;
                        data.pname = vm.product.name;
                        data.pslug = vm.product.slug;
                        data.email = user.email;
                        data.reviewer = user.name;
                        Review.save(data, function () {}, function (err) {
                            Toast.show({ type: 'error', text: 'Error while saving your review: ' + err.data });
                        });
                        $mdDialog.hide(data);
                    };
                }
                NewReviewController.$inject = ['$scope', '$mdDialog', 'Review', 'Toast'];
            }
        }]);

        return SingleProductController;
    }();

    SingleProductController.$inject = ['$stateParams', '$scope', 'Product', 'Review', 'socket', 'SingleProduct', 'Auth', 'Toast', 'LoginModal', '$mdDialog', 'appConfig'];

    angular.module('mediaboxApp').controller('SingleProductController', SingleProductController);
})();
//# sourceMappingURL=single.controller.js.map

'use strict';

angular.module('mediaboxApp').controller('MediaCtrl', function ($scope, Upload, $timeout, $http, socket, $mdDialog, Settings, Toast) {

  $scope.imageDetails = function (img) {
    $mdDialog.show({
      template: '\n    <md-dialog aria-label="Image Details Dialog"  ng-cloak>\n  <md-toolbar>\n    <div class="md-toolbar-tools">\n      <h2>Media Details</h2>\n      <span flex></span>\n      <md-button class="md-icon-button" ng-click="cancel()">\n        <ng-md-icon icon="close" aria-label="Close dialog"></ng-md-icon>\n      </md-button>\n    </div>\n  </md-toolbar>\n  <md-dialog-content>\n    <div class="md-dialog-content">\n      <div layout="row" class="md-whiteframe-z2">\n        <div class="flexbox-container">\n        \t<div>\n            <img ng-src="{{img.path}}" draggable="false" alt="{{img.name}}" class="detail-image"/>\n          </div>\n        \t<div>\n            <ul>\n              <li><strong>Media Name:</strong> {{img.name}}</li>\n              <li><strong>Media Size:</strong> {{img.size}}</li>\n              <li><strong>Media type:</strong> {{img.type}}</li>\n              <li><strong>Media path:</strong> {{img.path}}</li>\n              <li><strong>Date Uploaded:</strong> {{img.created_at}}</li>\n              <li><strong>Uploaded By:</strong> {{img.name}}</li>\n\n            </ul>\n        \t</div>\n        </div>\n      </div>\n  </md-dialog-content>\n  <md-dialog-actions layout="row">\n    <span flex></span>\n    <md-button ng-click="delete(img)" class="md-warn">\n     Delete Permanently\n    </md-button>\n  </md-dialog-actions>\n</md-dialog>\n',
      controller: function controller($scope, $mdDialog) {
        $scope.img = img;
        $scope.delete = function (img) {
          var confirm = $mdDialog.confirm().title('Would you like to delete the media permanently?').textContent('Media once deleted can not be undone.').ariaLabel('Delete Media').ok('Please do it!').cancel('Cancel');
          $mdDialog.show(confirm).then(function () {
            $http.delete('/api/media/' + img._id).then(function () {
              $mdDialog.hide();
            }, handleError);
          }, function () {
            $mdDialog.hide();
          });
        };
        $scope.hide = function () {
          $mdDialog.hide();
        };
        $scope.cancel = function () {
          $mdDialog.cancel();
        };
      }
    }).then(function (answer) {
      $scope.alert = 'You said the information was "' + answer + '".';
    }, function () {
      $scope.alert = 'You cancelled the dialog.';
    });
  };
  // Start query the database for the table
  $scope.loading = true;
  $http.get('/api/media/').then(function (res) {
    console.log(res);
    $scope.loading = false;
    $scope.data = res.data;
    socket.syncUpdates('media', $scope.data);
  }, handleError);

  function handleError(error) {
    // error handler
    $scope.loading = false;
    if (error.status === 403) {
      Toast.show({
        type: 'error',
        text: 'Not authorised to make changes.'
      });
    } else {
      Toast.show({
        type: 'error',
        text: error.status
      });
    }
  }
  $scope.$watch('files', function () {
    $scope.upload($scope.files);
  });
  $scope.$watch('file', function () {
    if ($scope.file != null) {
      $scope.files = [$scope.file];
    }
  });
  $scope.log = '';

  $scope.upload = function (files) {
    if (files && files.length) {
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (!file.$error) {
          Upload.upload({
            url: 'api/media',
            data: {
              username: $scope.username,
              file: file
            }
          }).then(function (resp) {
            $timeout(function () {
              $scope.log = 'file: ' + resp.config.data.file.name + ', Response: ' + JSON.stringify(resp.data) + '\n' + $scope.log;
              $scope.result = resp.data;
            });
          }, function (response) {
            if (response.status > 0) {
              $scope.errorMsg = response.status + ': ' + response.data;
            }
          }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            $scope.log = 'progress: ' + progressPercentage + '% ' + evt.config.data.file.name + '\n' + $scope.log;
            $scope.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
          });
        }
      }
    }
  };
});
//# sourceMappingURL=media.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('media', {
    url: '/media',
    templateUrl: 'app/media/media.html',
    controller: 'MediaCtrl',
    authenticate: true
  });
});
//# sourceMappingURL=media.js.map

'use strict';

angular.module('mediaboxApp').controller('MediasCtrl', function ($scope, Upload, Media, Auth, $timeout, $http, socket, $mdDialog, Settings, Toast) {

  $scope.imageDetails = function (img) {
    $mdDialog.show({
      template: '\n    <md-dialog aria-label="Image Details Dialog"  ng-cloak>\n  <md-toolbar>\n    <div class="md-toolbar-tools">\n      <h2>Media Details</h2>\n      <span flex></span>\n      <md-button class="md-icon-button" ng-click="cancel()">\n        <ng-md-icon icon="close" aria-label="Close dialog"></ng-md-icon>\n      </md-button>\n    </div>\n  </md-toolbar>\n  <md-dialog-content>\n    <div class="md-dialog-content">\n      <div layout="row" class="md-whiteframe-z2">\n        <div class="flexbox-container">\n        \t<div>\n            <img ng-src="{{img.path}}" draggable="false" alt="{{img.name}}" class="detail-image"/>\n          </div>\n        \t<div>\n            <ul>\n              <li><strong>Media Name:</strong> {{img.originalFilename}}</li>\n              <li><strong>Media Size:</strong> {{img.size}}</li>\n              <li><strong>Media type:</strong> {{img.type}}</li>\n              <li><strong>Media path:</strong> {{img.path}}</li>\n              <li><strong>Date Uploaded:</strong> {{img.created_at}}</li>\n              <li><strong>Uploaded By:</strong> {{img.uid}}</li>\n\n            </ul>\n        \t</div>\n        </div>\n      </div>\n  </md-dialog-content>\n  <md-dialog-actions layout="row">\n    <span flex></span>\n    <md-button ng-click="delete(img)" class="md-warn">\n     Delete Permanently\n    </md-button>\n  </md-dialog-actions>\n</md-dialog>\n',
      controller: function controller($scope, Auth, Media, $mdDialog) {
        $scope.img = img;
        $scope.delete = function (img) {
          var confirm = $mdDialog.confirm().title('Would you like to delete the media permanently?').textContent('Media once deleted can not be undone.').ariaLabel('Delete Media').ok('Please do it!').cancel('Cancel');
          $mdDialog.show(confirm).then(function () {
            $http.delete('/api/media/' + img._id).then(function () {
              $mdDialog.hide();
            }, handleError);
          }, function () {
            $mdDialog.hide();
          });
        };
        $scope.hide = function () {
          $mdDialog.hide();
        };
        $scope.cancel = function () {
          $mdDialog.cancel();
        };
      }
    }).then(function (answer) {
      $scope.alert = 'You said the information was "' + answer + '".';
    }, function () {
      $scope.alert = 'You cancelled the dialog.';
    });
  };
  // Start query the database for the table
  $scope.loading = true;

  Media.pub.query(function (res) {
    console.log(res);
    $scope.loading = false;
    $scope.data = res;
    socket.syncUpdates('media', $scope.data);
  });

  function handleError(error) {
    // error handler
    $scope.loading = false;
    if (error.status === 403) {
      Toast.show({
        type: 'error',
        text: 'Not authorised to make changes.'
      });
    } else {
      Toast.show({
        type: 'error',
        text: error.status
      });
    }
  }
  $scope.$watch('files', function () {
    $scope.upload($scope.files);
  });
  $scope.$watch('file', function () {
    if ($scope.file != null) {
      $scope.files = [$scope.file];
    }
  });
  $scope.log = '';

  $scope.upload = function (files) {
    if (files && files.length) {
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (!file.$error) {
          Upload.upload({
            url: 'api/media',
            data: {
              username: $scope.username,
              file: file
            }
          }).then(function (resp) {
            $timeout(function () {
              $scope.log = 'file: ' + resp.config.data.file.name + ', Response: ' + JSON.stringify(resp.data) + '\n' + $scope.log;
              $scope.result = resp.data;
            });
          }, function (response) {
            if (response.status > 0) {
              $scope.errorMsg = response.status + ': ' + response.data;
            }
          }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            $scope.log = 'progress: ' + progressPercentage + '% ' + evt.config.data.file.name + '\n' + $scope.log;
            $scope.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
          });
        }
      }
    }
  };
});
//# sourceMappingURL=medias.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('medias', {
    url: '/medias',
    templateUrl: 'app/medias/medias.html',
    controller: 'MediasCtrl',
    authenticate: 'true'
  });
});
//# sourceMappingURL=medias.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    var OrderController = function () {
        function OrderController(Cart, Order, Toast, Settings, $state, $stateParams) {
            _classCallCheck(this, OrderController);

            this.orderStatusLov = Order.status;
            this.Toast = Toast;
            this.Settings = Settings; // Used to get currency symbol
            this.$state = $state;
            this.options = {};
            this.orders = Order.my.query();
            this.payment = $stateParams;
            if ($stateParams.id) // If payment was successful clear cart
                Cart.cart.clearItems();
        }

        _createClass(OrderController, [{
            key: 'navigate',
            value: function navigate(params) {
                this.$state.go('single-product', { id: params.sku, slug: params.description }, { reload: false });
            }
        }]);

        return OrderController;
    }();

    angular.module('mediaboxApp').controller('OrderController', OrderController);
})();
//# sourceMappingURL=order.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('order', {
    url: '/order?id&msg',
    templateUrl: 'app/order/order.html',
    controller: 'OrderController as order',
    authenticate: true
  });
});
//# sourceMappingURL=order.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var OrdersController = function () {
    function OrdersController(Cart, Country, PaymentMethod, Shipping, Coupon, Order, Toast, Settings, $state) {
      _classCallCheck(this, OrdersController);

      this.orderStatusLov = Order.status;
      this.Order = Order;
      this.Toast = Toast;
      this.Settings = Settings;
      this.$state = $state;
      this.options = {};
      this.orders = Order.query();
    }

    _createClass(OrdersController, [{
      key: 'navigate',
      value: function navigate(params) {
        this.$state.go('single-product', { id: params.sku, slug: params.description }, { reload: false });
      }
    }, {
      key: 'changeStatus',
      value: function changeStatus(order) {
        var vm = this;
        var vm = this;
        this.Order.update({ id: order._id }, order).$promise.then(function (res) {}, function (error) {
          // error handler
          if (error.data.errors) {
            vm.Toast.show({
              type: 'error',
              text: error.data.errors.status.message
            });
          } else {
            vm.Toast.show({
              type: 'success',
              text: error.statusText
            });
          }
        });
      }
    }]);

    return OrdersController;
  }();

  angular.module('mediaboxApp').controller('OrdersController', OrdersController);
})();
//# sourceMappingURL=orders.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('orders', {
    url: '/orders',
    templateUrl: 'app/orders/orders.html',
    controller: 'OrdersController as orders',
    authenticate: 'manager'
  });
});
//# sourceMappingURL=orders.js.map

'use strict';

angular.module('mediaboxApp').controller('PaymentMethodCtrl', function ($scope) {
  $scope.options = [{ field: 'name', dataType: 'select', options: ['PayPal', 'COD', 'Stripe'] }, { field: 'email' }, { field: 'active', dataType: 'boolean' }];
});
//# sourceMappingURL=payment-method.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('payment-method', {
    url: '/payment-method',
    templateUrl: 'app/payment-method/payment-method.html',
    controller: 'PaymentMethodCtrl',
    authenticate: 'admin'
  });
});
//# sourceMappingURL=payment-method.js.map

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var PaymentController = function PaymentController() {
    _classCallCheck(this, PaymentController);
  };

  angular.module('mediaboxApp').controller('PaymentController', PaymentController);
})();
//# sourceMappingURL=payment.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('payment-success', {
    url: '/payment/success',
    templateUrl: 'app/payment/success.html',
    controller: 'PaymentController as payment',
    authenticate: true
  }).state('payment-cancel', {
    url: '/payment/cancel',
    templateUrl: 'app/payment/cancel.html',
    controller: 'PaymentController as payment',
    authenticate: true
  }).state('payment-error', {
    url: '/payment/error',
    templateUrl: 'app/payment/error.html',
    controller: 'PaymentController as payment',
    authenticate: true
  });
});
//# sourceMappingURL=payment.js.map

'use strict';

(function () {

  function ProductsDetailController($http, $state, Toast, $stateParams, ToggleComponent, Settings, $mdDialog, socket, $scope) {
    var vm = this;
    vm.myDate = new Date();
    vm.header = 'product';
    vm.product = {};
    vm.options = {};
    vm.product.variants = [];
    vm.product.newVariant = {};
    vm.product.features = [];
    vm.product.stats = [];
    vm.product.keyFeatures = [];
    vm.unsavedProduct = $stateParams.products;
    vm.product = angular.copy($stateParams.products);
    vm.options.categories = angular.copy($stateParams.categories);
    vm.options.brands = angular.copy($stateParams.brands);
    vm.options.variants = angular.copy($stateParams.variants);
    vm.options.features = angular.copy($stateParams.features);
    vm.options.statistics = angular.copy($stateParams.statistics);
    vm.options.keyFeatures = angular.copy($stateParams.keyFeatures);

    console.log(vm.options.statistics);

    // The whole category hierarchy
    vm.loading = true;
    $http.get('/api/categories/all').then(function (res) {
      vm.loading = false;
      vm.options.categories = res.data;
    }, handleError);

    vm.save = function (product) {

      // refuse to work with invalid data
      if (!product) {
        Toast.show({
          type: 'error',
          text: 'No product defined.'
        });
        return;
      }
      if ('newVariant' in product) {
        vm.product.variants.push(product.newVariant);
      }

      $http.put('/api/products/' + product._id, product).then(success).catch(err);
      function success(res) {
        var item = vm.product = res.data;
        Toast.show({
          type: 'success',
          text: 'Product has been updated'
        });
      }

      function err(err) {
        console.log(err);
        if (product && err) {}

        Toast.show({
          type: 'warn',
          text: 'Error while updating database'
        });
      }
    };

    vm.mediaLibrary = function (index) {
      $mdDialog.show({
        template: '<md-dialog aria-label="Media Library" ng-cloak flex="95">\n        <md-toolbar class="md-warn">\n          <div class="md-toolbar-tools">\n            <h2>Media Library</h2>\n            <span flex></span>\n            <md-button class="md-icon-button" ng-click="cancel()">\n              <ng-md-icon icon="close" aria-label="Close dialog"></ng-md-icon>\n            </md-button>\n          </div>\n        </md-toolbar>\n\n        <md-dialog-content>\n            <div class="md-dialog-content"  class="md-whiteframe-z2">\n                <md-grid-list class="media-list" md-cols-xs ="3" md-cols-sm="4" md-cols-md="5" md-cols-lg="7" md-cols-gt-lg="10" md-row-height-gt-md="1:1" md-row-height="4:3" md-gutter="12px" md-gutter-gt-sm="8px" layout="row" layout-align="center center">\n                  <md-grid-tile ng-repeat="i in media" class="md-whiteframe-z2" ng-click="ok(i.path)">\n                \t\t<div class="thumbnail">\n                \t\t\t\t<img ng-src="{{i.path}}" draggable="false" alt="{{i.name}}">\n                \t\t</div>\n                    <md-grid-tile-footer><h3>{{i.name}}</h3></md-grid-tile-footer>\n                  </md-grid-tile>\n                </md-grid-list>\n          </div>\n        </md-dialog-content>\n        <md-dialog-actions layout="row">\n          <span flex></span>\n          <md-button ng-click="addNewImage()" class="md-warn md-raised">\n           Add new Image\n          </md-button>\n        </md-dialog-actions>\n      </md-dialog>\n',
        controller: function controller($scope, $mdDialog, $http, socket, $state) {
          // Start query the database for the table
          var vm = this;
          $scope.loading = true;
          $http.get('/api/media/').then(function (res) {
            $scope.loading = false;
            $scope.media = res.data;
            socket.syncUpdates('media', $scope.data);
          }, handleError);

          function handleError(error) {
            // error handler
            $scope.loading = false;
            if (error.status === 403) {
              Toast.show({
                type: 'error',
                text: 'Not authorised to make changes.'
              });
            } else {
              Toast.show({
                type: 'error',
                text: error.status
              });
            }
          }
          $scope.ok = function (path) {
            $mdDialog.hide(path);
          };
          $scope.hide = function () {
            $mdDialog.hide();
          };
          $scope.cancel = function () {
            $mdDialog.cancel();
          };
          $scope.addNewImage = function () {
            var vm = this;
            $state.go('media');
            vm.save(vm.product);
            $mdDialog.hide();
          };
        }

      }).then(function (answer) {
        if (index === 1000000) vm.product.variants.push({ size: 'x', image: answer });else vm.product.variants[index].image = answer;
      }, function () {});
    };

    function goBack() {
      ToggleComponent('products.detailView').close();
      $state.go('^', {}, { location: false });
    }
    vm.goBack = goBack;

    vm.deleteFeature = function (index, product) {
      vm.product.features.splice(index, 1);
      vm.save(product);
    };

    vm.deleteStat = function (index, product) {
      vm.product.stats.splice(index, 1);
      vm.save(product);
    };

    vm.deleteKF = function (index, product) {
      vm.product.keyFeatures.splice(index, 1);
      vm.save(product);
    };

    vm.deleteVariants = function (index, product) {
      vm.product.variants.splice(index, 1);
      vm.save(product);
    };
    function handleError(error) {
      // error handler
      vm.loading = false;
      if (error.status === 403) {
        Toast.show({
          type: 'error',
          text: 'Not authorised to make changes.'
        });
      } else {
        Toast.show({
          type: 'error',
          text: error.status
        });
      }
    }
  }

  angular.module('mediaboxApp').controller('ProductsDetailController', ProductsDetailController);
})();
//# sourceMappingURL=detail.controller.js.map

'use strict';

(function () {

  function ProductsListController($scope, $http, socket, $state, $mdDialog, $stateParams, Modal, Toast, Settings) {
    this.cols = [{ field: 'image', heading: 'image' }, { field: 'name', heading: 'name' }, { field: 'active', heading: 'active' }];
    this.header = 'Product';
    this.sort = {};
    this.$mdDialog = $mdDialog;
    var vm = this;
    vm.loading = true;

    // the selected item id
    var _id = null;
    var originatorEv;

    this.sort.predicate = 'name';
    this.sort.reverse = false;
    this.order = function (predicate) {
      this.sort.reverse = this.sort.predicate === predicate ? !this.sort.reverse : false;
      this.sort.predicate = predicate;
    };

    this.l = 10;
    this.loadMore = function () {
      this.l += 2;
    };

    this.exportData = function (type) {
      var data = JSON.stringify(this.data, undefined, 2);
      var blob;
      if (type === 'txt') {
        // Save as .txt
        blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'product.txt');
      } else if (type === 'csv') {
        // Save as .csv
        blob = new Blob([document.getElementById('exportable').innerHTML], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
        saveAs(blob, "product.csv");
      } else if (type === 'xls') {
        // Save as xls
        blob = new Blob([document.getElementById('exportable').innerHTML], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "product.xls");
      } else {
        // Save as .json
        blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'product.json');
      }
    };

    this.openMenu = function ($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };
    vm.isSelected = function (product) {
      return _id === product._id;
    };

    // Start query the database for products
    vm.loading = true;
    $http.get('/api/products').then(function (res) {
      vm.loading = false;
      vm.data = res.data;
      socket.syncUpdates('product', vm.data);
    }, handleError);

    // Start query the database for brands
    vm.loading = true;
    $http.get('/api/brands').then(function (res) {
      vm.loading = false;
      vm.brands = res.data;
      socket.syncUpdates('brand', vm.brands);
    }, handleError);

    // Start query the database for categories
    vm.loading = true;
    $http.get('/api/categories').then(function (res) {
      vm.loading = false;
      vm.categories = res.data;
      socket.syncUpdates('category', vm.categories);
    }, handleError);

    // Start query the database for features
    vm.loading = true;
    $http.get('/api/features').then(function (res) {
      vm.loading = false;
      vm.features = res.data;
      socket.syncUpdates('feature', vm.features);
    }, handleError);

    vm.loading = true;
    $http.get('api/statistics').then(function (res) {
      vm.loading = false;
      vm.statistics = res.data;
      socket.syncUpdates('statistic', vm.statistics);
    }, handleError);

    this.changeStatus = function (x) {
      $http.put('/api/products/' + x._id, { active: x.active }).then(function () {}, handleError);
    };

    this.delete = function (data) {
      var confirm = this.$mdDialog.confirm().title('Would you like to delete the product completely?').textContent('All its details will be deleted as well').ariaLabel('Confirm delete product').ok('Please do it!').cancel('No. keep');

      this.$mdDialog.show(confirm).then(function () {
        $http.delete('/api/products/' + data._id).then(function () {}, handleError);
      });
    };

    function handleError(error) {
      // error handler
      vm.loading = false;
      if (error.status === 403) {
        Toast.show({
          type: 'error',
          text: 'Not authorised to make changes.'
        });
      } else {
        Toast.show({
          type: 'error',
          text: error.status
        });
      }
    }

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('product');
    });

    this.showInDetails = function (item) {
      _id = item._id;
      $state.go('product-detail', { products: item, brands: vm.brands, categories: vm.categories, features: vm.features, statistics: vm.statistics }, { location: false });
    };

    this.gotoDetail = function (params) {
      $state.go('single-product', { id: params._id, slug: params.slug }, { reload: false });
    };
  }

  angular.module('mediaboxApp').controller('ProductsListController', ProductsListController);
})();
//# sourceMappingURL=list.controller.js.map

'use strict';

(function () {

  function ProductsMainController(Modal, $stateParams) {
    var options = { api: 'product' };
    var cols = [{ field: 'sku', heading: 'SKU' }, { field: 'name', heading: 'Name' }, { field: 'description', heading: 'Description', dataType: 'textarea' }];
    this.create = function () {
      Modal.show(cols, options);
    };
  }

  angular.module('mediaboxApp').controller('ProductsMainController', ProductsMainController);
})();
//# sourceMappingURL=main.controller.js.map

'use strict';

angular.module('mediaboxApp').controller('ProductCtrl', function ($scope) {
  $scope.summary = [{ field: 'name' }, { field: 'category' }, { field: 'active' }];
  $scope.details = [{ field: 'name' }, { field: 'category' }, { field: 'brand' }, { field: 'active' }];
});
//# sourceMappingURL=product.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('product', {
    url: '/product',
    params: { options: null, columns: null },
    views: {
      '': {
        templateUrl: 'app/product/main.html',
        controller: 'ProductsMainController as main'
      },
      'content@product': {
        url: '/content',
        templateUrl: 'app/product/list.html',
        controller: 'ProductsListController as list'
      }
    },
    authenticate: 'manager'
  }).state('product-detail', {
    url: '/product-detail/:id',
    onEnter: onEnterUserListDetail, // To open right sidebar
    params: { products: null, categories: null, brands: null, features: null, statistics: null },
    parent: 'product',
    views: {
      '': {
        templateUrl: 'app/product/main.html'
      },
      'detail': {
        templateUrl: 'app/product/detail.html',
        controller: 'ProductsDetailController as detail'
      }
    },
    authenticate: 'manager'
  }).state('products-create', {
    url: '/products-create',
    parent: 'products',
    params: { data: null },
    views: {
      '': {}
    },
    authenticate: 'manager'
  });
  function resolveIdFromArray($stateParams) {
    return { '_id': $stateParams.id, 'api': $stateParams.api };
  }

  onEnterUserListDetail.$inject = ['$timeout', 'ToggleComponent'];

  function onEnterUserListDetail($timeout, ToggleComponent) {
    $timeout(showDetails, 0, false);

    function showDetails() {
      ToggleComponent('products.detailView').open();
    }
  }
});
//# sourceMappingURL=product.js.map

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    var ReviewController = function ReviewController() {
        _classCallCheck(this, ReviewController);

        this.options = [{ field: 'pid', heading: 'Product ID' }, { field: 'pname', heading: 'Product Name' }, { field: 'reviewer' }, { field: 'email' }, { field: 'message' }, { field: 'rating', dataType: 'number' }, { field: 'created', dataType: 'date' }];
    };

    angular.module('mediaboxApp').controller('ReviewController', ReviewController);
})();
//# sourceMappingURL=review.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('review', {
    url: '/review',
    templateUrl: 'app/review/review.html',
    controller: 'ReviewController as review',
    authenticate: true
  });
});
//# sourceMappingURL=review.js.map

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    var ReviewsController = function ReviewsController() {
        _classCallCheck(this, ReviewsController);

        this.options = [{ field: 'pid', heading: 'Product ID' }, { field: 'pname', heading: 'Product Name' }, { field: 'reviewer' }, { field: 'email' }, { field: 'message' }, { field: 'rating', dataType: 'number' }, { field: 'created', dataType: 'date' }, { field: 'active', dataType: 'boolean' }];
    };

    angular.module('mediaboxApp').controller('ReviewsController', ReviewsController);
})();
//# sourceMappingURL=reviews.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('reviews', {
    url: '/reviews',
    templateUrl: 'app/reviews/reviews.html',
    controller: 'ReviewsController as reviews',
    authenticate: true
  });
});
//# sourceMappingURL=reviews.js.map

'use strict';

(function () {
  angular.module('mediaboxApp').constant('Settings', {
    demo: false,
    country: {
      name: 'Zimbabwe',
      code: 'ZW' // must be 2 digit code from the list https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2 
    },
    handlingFee: '5 %',
    currency: {
      code: 'USD', // Paypal currency code *** Please choose from https://developer.paypal.com/docs/classic/api/currency_codes/
      shop_currency: 'USD',
      symbol: '$ ', // Currency symbol to be displayed through out the shop
      exchange_rate: '0.015' // Paypal currency code(USD) / Shop currency (INR) ***  exchange_rate should not be 0 else it will generate divided by 0 error
    },
    paymentStatus: ['Pending', 'Paid', 'created'], // On success from Paypal it stores as created
    orderStatus: ['Payment Pending', 'Order Placed', 'Order Accepted', 'Order Executed', 'Shipped', 'Delivered', 'Cancelled', 'Not in Stock'],

    menu: {
      pages: [// Main menu
      { text: 'Transaction History', url: 'order', authenticate: true, role: 'user', icon: 'account_balance' }, { text: 'Manage Orders', url: 'orders', authenticate: true, role: 'manager', icon: 'shopping_basket' }, { text: 'Campaign Management', url: 'campaigns', authenticate: true, role: 'manager', icon: 'chrome_reader_mode' }, { text: 'Campaigns', url: 'campaign', authenticate: true, role: 'user', icon: 'perm_media' }, { text: 'Profile', url: 'address', authenticate: true, icon: 'directions' }, { text: 'Reviews', url: 'review', authenticate: true, role: 'admin', icon: 'star' }, { text: 'Moderate Reviews', url: 'reviews', authenticate: true, role: 'admin', icon: 'star' }, { text: 'Wishlist', url: 'wish', authenticate: true, role: 'admin', icon: 'favorite' }, { text: 'My Library', url: 'media', authenticate: true, icon: 'photo_library' }, { text: 'Media Library', url: 'medias', authenticate: true, role: 'manager', icon: 'photo_library' }, { text: 'Inventory', url: 'product', authenticate: true, role: 'manager', icon: 'style' }, { text: 'Industry', url: 'brand', authenticate: true, role: 'admin', icon: 'verified_user' }, { text: 'Categories', url: 'category', authenticate: true, role: 'admin', icon: 'subject' }, { text: 'Coupons', url: 'coupon', authenticate: true, role: 'admin', icon: 'receipt' }, { text: 'Features', url: 'feature', authenticate: true, role: 'admin', icon: 'spellcheck' }, { text: 'Payment Methods', url: 'payment-method', authenticate: true, role: 'admin', icon: 'payment' }, { text: 'Shippings', url: 'shipping', authenticate: true, role: 'admin', icon: 'local_shipping' }],
      user: [// Separate panel for user management tasks for both admin and user
      { text: 'Users', url: 'admin', authenticate: true, role: 'admin', icon: 'perm_identity' }, { text: 'Change Password', authenticate: true, url: 'cp', icon: 'settings_applications' }, { text: 'logout', authenticate: true, url: 'logout', icon: 'logout' }]
    }
  });
})();
//# sourceMappingURL=settings.js.map

'use strict';

angular.module('mediaboxApp').controller('ShippingCtrl', function ($scope) {
  $scope.options = [{ field: 'carrier' }, { field: 'country' }, { field: 'charge', dataType: 'currency' }, { field: 'minWeight', dataType: 'number' }, { field: 'maxWeight', dataType: 'number' }, { field: 'freeShipping', dataType: 'currency' }, { field: 'active', dataType: 'boolean' }];
});
//# sourceMappingURL=shipping.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('shipping', {
    url: '/shipping',
    templateUrl: 'app/shipping/shipping.html',
    controller: 'ShippingCtrl',
    authenticate: 'manager'
  });
});
//# sourceMappingURL=shipping.js.map

'use strict';

angular.module('mediaboxApp').controller('StatisticCtrl', function ($scope) {
  $scope.options = [{ field: 'key' }, { field: 'val' }, { field: 'active', dataType: 'boolean' }];
});
//# sourceMappingURL=statistic.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('statistic', {
    url: '/statistic',
    templateUrl: 'app/statistic/statistic.html',
    controller: 'StatisticCtrl',
    authenticate: 'manager'
  });
});
//# sourceMappingURL=statistic.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    var WishController = function () {
        function WishController(Wishlist, $state) {
            _classCallCheck(this, WishController);

            this.Wishlist = Wishlist;
            this.wishes = Wishlist.query();
            this.$state = $state;
        }

        _createClass(WishController, [{
            key: 'remove',
            value: function remove(wish) {
                var vm = this;
                this.Wishlist.delete({ id: wish._id }, function (res) {
                    if (res) {
                        vm.wishes = vm.Wishlist.query();
                    }
                });
            }
        }, {
            key: 'gotoDetail',
            value: function gotoDetail(params) {
                this.$state.go('single-product', { id: params.pid, slug: params.slug }, { reload: false });
            }
        }]);

        return WishController;
    }();

    angular.module('mediaboxApp').controller('WishController', WishController);
})();
//# sourceMappingURL=wish.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('wish', {
    url: '/wish',
    templateUrl: 'app/wish/wish.html',
    controller: 'WishController as wish',
    authenticate: true
  });
});
//# sourceMappingURL=wish.js.map

'use strict';

(function () {
  var NGPCanvas,
      NGPImage,
      NGPImageLoader,
      NGPIndicator,
      module,
      __bind = function __bind(fn, me) {
    return function () {
      return fn.apply(me, arguments);
    };
  };

  module = angular.module('ngPintura', []);

  NGPImageLoader = function () {
    function NGPImageLoader(files, loadedCb, progressCb) {
      var file, _i, _len, _ref;
      this.files = files != null ? files : [];
      this.loadedCb = loadedCb;
      this.progressCb = progressCb;
      this.onload = __bind(this.onload, this);
      this.loaded = 0;
      _ref = this.files;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        file.image = new Image();
        file.image.onload = this.onload;
        file.image.src = file.url;
      }
    }

    NGPImageLoader.prototype.onload = function () {
      this.loaded += 1;
      if (this.progressCb) {
        this.progressCb(this.loaded / this.files.length);
      }
      if (this.loaded >= this.files.length) {
        return this.loadedCb(this.files);
      }
    };

    return NGPImageLoader;
  }();

  NGPCanvas = function () {
    function NGPCanvas() {
      var imageNode, indicatorNode, layerNode, stageNode;
      stageNode = new Konva.Stage({
        container: angular.element('<div>')[0]
      });
      layerNode = new Konva.Layer();
      imageNode = new Konva.Image();
      indicatorNode = new Konva.Rect();
      stageNode.add(layerNode);
      layerNode.add(imageNode);
      layerNode.add(indicatorNode);
      this.progressCb = void 0;
      this.stage = stageNode;
      this.layer = layerNode;
      this.image = new NGPImage(imageNode);
      this.indicator = new NGPIndicator(indicatorNode);
    }

    NGPCanvas.prototype.resize = function (width, height) {
      this.stage.size({
        width: width,
        height: height
      });
      this.indicator.node.position({
        x: width / 2,
        y: height / 2
      });
      return this.image.adjustScaleBounds(this.stage.size());
    };

    NGPCanvas.prototype.imageChange = function (src) {
      this.image.node.visible(false);
      this.indicator.node.visible(true);
      this.indicator.animation.start();
      if (typeof src === 'string') {
        return Konva.Image.fromURL(src, function (_this) {
          return function (newImage) {
            _this.setImage(newImage.image());
            return newImage.destroy();
          };
        }(this));
      } else if (src instanceof Image) {
        return this.setImage(src);
      } else if (src instanceof Array) {
        return this.setCollage(src);
      } else {
        return console.log('src is empty or unknown format:', src);
      }
    };

    NGPCanvas.prototype.setImage = function (newImage) {
      this.image.node.size({
        width: newImage.width,
        height: newImage.height
      });
      this.image.node.image(newImage);
      this.indicator.node.visible(false);
      this.indicator.animation.stop();
      this.image.adjustScaleBounds(this.stage.size());
      this.image.node.visible(true);
      this.image.node.parent.draw();
      return this.image.node.fire(this.image.LOADED);
    };

    NGPCanvas.prototype.setCollage = function (files) {
      var loaded;
      loaded = function (_this) {
        return function (images) {
          var image, rowsX, rowsY, tmpLayer, _i, _len;
          rowsX = 0;
          rowsY = 0;
          tmpLayer = new Konva.Layer();
          for (_i = 0, _len = images.length; _i < _len; _i++) {
            image = images[_i];
            rowsX = Math.max(image.x + 1, rowsX);
            rowsY = Math.max(image.y + 1, rowsY);
            tmpLayer.add(new Konva.Image({
              image: image.image,
              x: image.x * image.image.width,
              y: image.y * image.image.height
            }));
          }
          return tmpLayer.toImage({
            x: 0,
            y: 0,
            width: rowsX * images[0].image.width,
            height: rowsY * images[0].image.height,
            callback: function callback(image) {
              _this.setImage(image);
              return tmpLayer.destroy();
            }
          });
        };
      }(this);
      return new NGPImageLoader(files, loaded, this.progressCb);
    };

    return NGPCanvas;
  }();

  /*
   *
   */

  NGPIndicator = function () {
    function NGPIndicator(node) {
      var _animFn;
      this.node = node;
      this.rotationSpeed = 270;
      this.node.setAttrs({
        width: 50,
        height: 50,
        fill: 'pink',
        stroke: 'white',
        strokeWidth: 4,
        zIndex: 99,
        visible: false,
        offset: {
          x: 25,
          y: 25
        }
      });
      _animFn = function (_this) {
        return function (frame) {
          var angleDiff;
          angleDiff = frame.timeDiff * _this.rotationSpeed / 1000;
          return _this.node.rotate(angleDiff);
        };
      }(this);
      this.animation = new Konva.Animation(_animFn, this.node.parent);
    }

    return NGPIndicator;
  }();

  /*
   *
   */

  NGPImage = function () {
    function NGPImage(node) {
      this.node = node;
      this.LOADED = 'loaded';
      this.node.draggable(true);
      this.minScale = 0.5;
      this.maxScale = 1;
      this.tween = void 0;
      this.tweenDuration = 0.25;
    }

    NGPImage.prototype.adjustScaleBounds = function (viewport) {
      if (!this.node.width() || !this.node.height()) {
        return;
      }
      this.minScale = viewport.width / this.node.width();
      if (viewport.height < this.node.height() * this.minScale) {
        this.minScale = viewport.height / this.node.height();
      }
      return this.minScale = Math.min(this.minScale, 1);
    };

    NGPImage.prototype._fitScale = function (scale) {
      return Math.min(Math.max(scale, this.minScale), this.maxScale);
    };

    NGPImage.prototype._zoomToPointAttrs = function (scale, point) {
      var attrs, imgPoint, scaling;
      scaling = this.node.scaleX() + scale;
      scaling = this._fitScale(scaling);
      imgPoint = this.node.getAbsoluteTransform().copy().invert().point(point);
      return attrs = {
        x: (-imgPoint.x + point.x / scaling) * scaling,
        y: (-imgPoint.y + point.y / scaling) * scaling,
        scaleX: scaling,
        scaleY: scaling
      };
    };

    NGPImage.prototype.zoomToPoint = function (scale, point) {
      this.node.setAttrs(this._zoomToPointAttrs(scale, point));
      return this.node.parent.draw();
    };

    NGPImage.prototype.zoomToPointer = function (scale) {
      return this.zoomToPoint(scale, this.node.getStage().getPointerPosition());
    };

    NGPImage.prototype._stageCenter = function () {
      var center;
      return center = {
        x: this.node.getStage().width() / 2,
        y: this.node.getStage().height() / 2
      };
    };

    NGPImage.prototype.zoomToCenter = function (scale) {
      return this.zoomToPoint(scale, this._stageCenter());
    };

    NGPImage.prototype.zoomToPointTween = function (scale, point, callback) {
      var tweenAttrs;
      tweenAttrs = this._zoomToPointAttrs(scale, point);
      if (scale !== this.node.scaleX() || tweenAttrs.x !== this.node.x() || tweenAttrs.y !== this.node.y()) {
        if (this.tween) {
          this.tween.pause().destroy();
        }
        this.tween = new Konva.Tween(angular.extend(tweenAttrs, {
          node: this.node,
          duration: this.tweenDuration,
          easing: Konva.Easings.EaseOut,
          onFinish: callback
        }));
        return this.tween.play();
      }
    };

    NGPImage.prototype.zoomToCenterTween = function (scale, callback) {
      return this.zoomToPointTween(scale, this._stageCenter(), callback);
    };

    NGPImage.prototype.moveByVectorTween = function (v, callback) {
      var pos;
      pos = this.node.position();
      if (v.x) {
        pos.x += v.x;
      }
      if (v.y) {
        pos.y += v.y;
      }
      if (pos.x !== this.node.x() || pos.y !== this.node.y()) {
        if (this.tween) {
          this.tween.pause().destroy();
        }
        this.tween = new Konva.Tween(angular.extend(pos, {
          node: this.node,
          duration: this.tweenDuration,
          easing: Konva.Easings.EaseOut,
          onFinish: callback
        }));
        return this.tween.play();
      }
    };

    NGPImage.prototype.fitInViewTween = function (callback) {
      var attrs, imgScaled;
      imgScaled = {
        width: this.node.width() * this.minScale,
        height: this.node.height() * this.minScale
      };
      attrs = {
        scaleX: this.minScale,
        scaleY: this.minScale,
        x: imgScaled.width < this.node.getStage().width() ? (this.node.getStage().width() - imgScaled.width) / 2 : 0,
        y: imgScaled.height < this.node.getStage().height() ? (this.node.getStage().height() - imgScaled.height) / 2 : 0
      };
      if (attrs.x !== this.node.x() || attrs.y !== this.node.y() || attrs.scaleX !== this.node.scaleX()) {
        if (this.tween) {
          this.tween.pause().destroy();
        }
        this.tween = new Konva.Tween(angular.extend(attrs, {
          node: this.node,
          duration: this.tweenDuration,
          easing: Konva.Easings.EaseOut,
          onFinish: callback
        }));
        return this.tween.play();
      }
    };

    return NGPImage;
  }();

  module.service('ngPintura', function () {
    return new NGPCanvas();
  });

  /**
   * pintura container
   * creates and shares paperjs scope with child directives
   * creates canvas
   */

  module.directive('ngPintura', ["ngPintura", "$window", function (ngPintura, $window) {
    var directive;
    return directive = {
      transclude: true,
      scope: {
        src: '=ngpSrc',
        scaling: '=ngpScaling',
        position: '=ngpPosition',
        fitOnload: '=ngpfitOnload',
        maxScaling: '=ngpMaxScaling',
        scaleStep: '=ngpScaleStep',
        mwScaleStep: '=ngpMwScaleStep',
        moveStep: '=ngpMoveStep',
        progress: '=ngpProgress'
      },
      link: function link(scope, element, attrs, ctrl, transcludeFn) {
        var applySyncScope, imageChange, imageLoad, maxScalingChange, mouseWheel, positionChange, resizeContainer, scalingChange, setScalingDisabled, syncScope;
        scope.slider = {
          value: void 0,
          fromScaling: function fromScaling(scale) {
            return this.value = parseInt((scale - ngPintura.image.minScale) / (ngPintura.image.maxScale - ngPintura.image.minScale) * 100);
          },
          toScaling: function toScaling() {
            return (ngPintura.image.maxScale - ngPintura.image.minScale) * (this.value / 100) + ngPintura.image.minScale;
          }
        };
        resizeContainer = function resizeContainer() {
          ngPintura.resize(element[0].clientWidth, element[0].clientHeight);
          return setScalingDisabled();
        };
        imageChange = function imageChange() {
          return ngPintura.imageChange(scope.src);
        };
        positionChange = function positionChange() {
          var _ref, _ref1;
          if (((_ref = scope.position) != null ? _ref.x : void 0) && ((_ref1 = scope.position) != null ? _ref1.y : void 0)) {
            ngPintura.image.node.position(scope.position);
            return ngPintura.layer.draw();
          }
        };
        scalingChange = function scalingChange() {
          ngPintura.image.node.scale({
            x: scope.scaling,
            y: scope.scaling
          });
          ngPintura.layer.draw();
          return scope.slider.fromScaling(scope.scaling);
        };
        mouseWheel = function mouseWheel(e) {
          e.evt.preventDefault();
          if (e.evt.wheelDeltaY > 0) {
            ngPintura.image.zoomToPointer(scope.mwScaleStep);
          } else {
            ngPintura.image.zoomToPointer(-scope.mwScaleStep);
          }
          return applySyncScope();
        };
        syncScope = function syncScope() {
          scope.position = ngPintura.image.node.position();
          scope.scaling = ngPintura.image.node.scaleX();
          if (scope.slider.toScaling() !== scope.scaling) {
            return scope.slider.fromScaling(scope.scaling);
          }
        };
        applySyncScope = function applySyncScope() {
          return scope.$apply(syncScope);
        };
        scope.fitInView = function () {
          return ngPintura.image.fitInViewTween(applySyncScope);
        };
        scope.moveUp = function () {
          return ngPintura.image.moveByVectorTween({
            y: scope.moveStep
          }, applySyncScope);
        };
        scope.moveDown = function () {
          return ngPintura.image.moveByVectorTween({
            y: -scope.moveStep
          }, applySyncScope);
        };
        scope.moveRight = function () {
          return ngPintura.image.moveByVectorTween({
            x: -scope.moveStep
          }, applySyncScope);
        };
        scope.moveLeft = function () {
          return ngPintura.image.moveByVectorTween({
            x: scope.moveStep
          }, applySyncScope);
        };
        scope.zoomIn = function () {
          return ngPintura.image.zoomToCenterTween(scope.scaleStep, applySyncScope);
        };
        scope.zoomOut = function () {
          return ngPintura.image.zoomToCenterTween(-scope.scaleStep, applySyncScope);
        };
        scope.sliderChange = function () {
          var scale;
          scale = scope.slider.toScaling() - ngPintura.image.node.scaleX();
          ngPintura.image.zoomToCenter(scale);
          return syncScope();
        };
        setScalingDisabled = function setScalingDisabled() {
          return scope.scalingDisabled = ngPintura.image.minScale >= ngPintura.image.maxScale;
        };
        imageLoad = function imageLoad() {
          if (scope.fitOnload) {
            scope.fitInView();
          }
          return setScalingDisabled();
        };
        maxScalingChange = function maxScalingChange() {
          ngPintura.image.maxScale = scope.maxScaling;
          return setScalingDisabled();
        };
        ngPintura.progressCb = function (progress) {
          return scope.$apply(function () {
            return scope.progress = progress;
          });
        };
        if (scope.maxScaling == null) {
          scope.maxScaling = 1;
        }
        if (scope.scaleStep == null) {
          scope.scaleStep = 0.4;
        }
        if (scope.mwScaleStep == null) {
          scope.mwScaleStep = 0.1;
        }
        if (scope.moveStep == null) {
          scope.moveStep = 100;
        }
        if (scope.fitOnload == null) {
          scope.fitOnload = true;
        }
        element.append(ngPintura.stage.content);
        resizeContainer();
        angular.element($window).on('resize', resizeContainer);
        scope.$watch('src', imageChange);
        scope.$watch('position', positionChange, true);
        scope.$watch('scaling', scalingChange);
        scope.$watch('maxScaling', maxScalingChange);
        ngPintura.image.node.on('dragend', applySyncScope);
        ngPintura.image.node.on('mousewheel', mouseWheel);
        ngPintura.image.node.on(ngPintura.image.LOADED, imageLoad);
        return transcludeFn(scope, function (clonedTranscludedTemplate) {
          return element.append(clonedTranscludedTemplate);
        });
      }
    };
  }]);
}).call(undefined);
//# sourceMappingURL=angular-pintura.js.map

'use strict';

(function () {

  function AuthService($location, $http, $cookies, $q, appConfig, Util, User) {
    var safeCb = Util.safeCb;
    var currentUser = {};
    var userRoles = appConfig.userRoles || [];

    if ($cookies.get('token') && $location.path() !== '/logout') {
      currentUser = User.get();
    }

    var Auth = {

      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional, function(error, user)
       * @return {Promise}
       */
      login: function login(_ref, callback) {
        var email = _ref.email,
            password = _ref.password;

        return $http.post('/auth/local', {
          email: email,
          password: password
        }).then(function (res) {
          $cookies.put('token', res.data.token);
          currentUser = User.get();
          return currentUser.$promise;
        }).then(function (user) {
          safeCb(callback)(null, user);
          return user;
        }).catch(function (err) {
          Auth.logout();
          safeCb(callback)(err.data);
          return $q.reject(err.data);
        });
      },


      /**
       * Delete access token and user info
       */
      logout: function logout() {
        $cookies.remove('token');
        currentUser = {};
      },


      /**
       * Create a new user
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional, function(error, user)
       * @return {Promise}
       */
      createUser: function createUser(user, callback) {
        return User.save(user, function (data) {
          $cookies.put('token', data.token);
          currentUser = User.get();
          return safeCb(callback)(null, user);
        }, function (err) {
          Auth.logout();
          return safeCb(callback)(err);
        }).$promise;
      },


      /**
       * Change password
       *
       * @param  {String}   oldPassword
       * @param  {String}   newPassword
       * @param  {Function} callback    - optional, function(error, user)
       * @return {Promise}
       */
      changePassword: function changePassword(oldPassword, newPassword, callback) {
        return User.changePassword({ id: currentUser._id }, {
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function () {
          return safeCb(callback)(null);
        }, function (err) {
          return safeCb(callback)(err);
        }).$promise;
      },


      /**
       * Gets all available info on a user
       *   (synchronous|asynchronous)
       *
       * @param  {Function|*} callback - optional, funciton(user)
       * @return {Object|Promise}
       */
      getCurrentUser: function getCurrentUser(callback) {
        if (arguments.length === 0) {
          return currentUser;
        }

        var value = currentUser.hasOwnProperty('$promise') ? currentUser.$promise : currentUser;
        return $q.when(value).then(function (user) {
          safeCb(callback)(user);
          return user;
        }, function () {
          safeCb(callback)({});
          return {};
        });
      },


      /**
       * Check if a user is logged in
       *   (synchronous|asynchronous)
       *
       * @param  {Function|*} callback - optional, function(is)
       * @return {Bool|Promise}
       */
      isLoggedIn: function isLoggedIn(callback) {
        if (arguments.length === 0) {
          return currentUser.hasOwnProperty('role');
        }

        return Auth.getCurrentUser(null).then(function (user) {
          var is = user.hasOwnProperty('role');
          safeCb(callback)(is);
          return is;
        });
      },

      isLoggedInAsync: function isLoggedInAsync(cb) {
        if (currentUser.hasOwnProperty('$promise')) {
          currentUser.$promise.then(function () {
            cb(true);
          }).catch(function () {
            cb(false);
          });
        } else if (currentUser.hasOwnProperty('role')) {
          cb(true);
        } else {
          cb(false);
        }
      },

      /**
       * Check if a user has a specified role or higher
       *   (synchronous|asynchronous)
       *
       * @param  {String}     role     - the role to check against
       * @param  {Function|*} callback - optional, function(has)
       * @return {Bool|Promise}
       */
      hasRole: function hasRole(role, callback) {
        var hasRole = function hasRole(r, h) {
          return userRoles.indexOf(r) >= userRoles.indexOf(h);
        };

        if (arguments.length < 2) {
          return hasRole(currentUser.role, role);
        }

        return Auth.getCurrentUser(null).then(function (user) {
          var has = user.hasOwnProperty('role') ? hasRole(user.role, role) : false;
          safeCb(callback)(has);
          return has;
        });
      },


      /**
       * Check if a user is an admin
       *   (synchronous|asynchronous)
       *
       * @param  {Function|*} callback - optional, function(is)
       * @return {Bool|Promise}
       */
      isAdmin: function isAdmin() {
        return Auth.hasRole.apply(Auth, [].concat.apply(['admin'], arguments));
      },


      /**
       * Get auth token
       *
       * @return {String} - a token string used for authenticating
       */
      getToken: function getToken() {
        return $cookies.get('token');
      }
    };

    return Auth;
  }

  angular.module('mediaboxApp.auth').factory('Auth', AuthService);
})();
//# sourceMappingURL=auth.service.js.map

'use strict';

(function () {

  function authInterceptor($q, $cookies, $injector, Util, Settings) {
    var state;

    return {
      // Add authorization token to headers
      request: function request(config) {
        config.headers = config.headers || {};
        if (Settings.demo) {
          if (config.method === 'PATCH' || config.method === 'PUT' || config.method === 'POST' || config.method === 'DELETE') {
            var allowedURL = config.url === '/auth/local' || config.url.match('api/users/*') // Allow login, signup, change-password, forgot, reset ** User Deletion blocked at admin page
            || config.url === '/api/orders' || config.url === '/api/reviews' || config.url === '/api/wishlists' || config.url === '/api/pay/stripe' || config.url === '/api/sendmail' || config.url.match('/api/address/*');
            if (!allowedURL || config.method === 'DELETE' || config.data.role) {
              // Do not allow delete in demo mode
              var response = { type: 'demo', text: 'Demo Mode: Unable to save', message: 'Demo Mode: Unable to save', data: 'Demo Mode: Unable to save' };
              $injector.get('Toast').show(response);
              return $q.reject(response);
            }
          }
        }
        if ($cookies.get('token') && Util.isSameOrigin(config.url)) {
          config.headers.Authorization = 'Bearer ' + $cookies.get('token');
        }
        return config;
      },


      // Intercept 401s and redirect you to login
      responseError: function responseError(response) {
        // console.log('error at auth interceptor', response)
        if (response.status === 401) {
          // $injector.get('Toast').show({type: 'error', text: response.statusText});
          if (response.config.url !== "/auth/local") // If the request is not from login modal page
            $injector.get('LoginModal').show('/'); // Causes circular dependency

          // (state || (state = $injector.get('$state'))).go('login');
          // remove any stale tokens
          $cookies.remove('token');
        }
        return $q.reject(response);
      }
    };
  }

  angular.module('mediaboxApp.auth').factory('authInterceptor', authInterceptor);
})();
//# sourceMappingURL=interceptor.service.js.map

'use strict';

(function () {

  angular.module('mediaboxApp.auth').run(function ($rootScope, $state, $location, Auth, LoginModal, Toast) {
    // Redirect to login if route requires auth and the user is not logged in, or doesn't have required role
    $rootScope.$on('$stateChangeStart', function (event, next) {
      // Routes that does not require login (Public routes)
      if (!next.authenticate) {
        return;
      }
      // Routes that require specific roles
      if (typeof next.authenticate === 'string') {
        Auth.hasRole(next.authenticate, _.noop).then(function (has) {
          if (has) {
            return;
          }
          $state.go('login');
          Toast.show({ type: 'error', text: 'Unauthorized to make changes' });
        });
      } else {
        // Routes that require only authentication without any specific roles
        Auth.isLoggedInAsync(function (is) {
          if (!is) {
            event.preventDefault();
            LoginModal.show(next.name);
          }
        });
      }
    });
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      // this is required if you want to prevent the $UrlRouter reverting the URL to the previous valid location
      Toast.show({ type: 'error', text: 'The requested page has some error' });
      return $location.path(fromState, fromParams);
    });
  });
})();
//# sourceMappingURL=router.decorator.js.map

'use strict';

(function () {

  function UserResource($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    }, {
      changePassword: {
        method: 'PUT',
        params: {
          controller: 'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id: 'me'
        }
      }
    });
  }

  angular.module('mediaboxApp.auth').factory('User', UserResource);
})();
//# sourceMappingURL=user.service.js.map

'use strict';

angular.module('mediaboxApp').directive('input', ['$mdDatePicker', '$timeout', function ($mdDatePicker, $timeout) {
  return {
    restrict: 'E',
    require: '?ngModel',
    templateUrl: 'components/calendar/calendar.html',
    link: function link(scope, element, attrs, ngModel) {
      if ('undefined' !== typeof attrs.type && 'calendar' === attrs.type && ngModel) {
        $timeout(function () {
          var isDate = moment(ngModel.$modelValue).isValid();
          if (isDate) {
            ngModel.$setViewValue(moment(ngModel.$modelValue).format('YYYY-MM-DD'));
            ngModel.$render();
          }
        });
        // ngModel.$setViewValue('2013-12-10');
        // ngModel.$render();
        angular.element(element).on('click', function (ev) {
          var isDate = moment(ngModel.$modelValue).isValid();
          if (!isDate) {
            ngModel.$modelValue = Date.now();
          }
          $mdDatePicker(ev, ngModel.$modelValue).then(function (selectedDate) {
            $timeout(function () {
              var isDate = moment(selectedDate).isValid();
              if (isDate) {
                ngModel.$setViewValue(moment(selectedDate).format('YYYY-MM-DD'));
                ngModel.$render();
              }
            });
          });
        });
      }
    }
  };
}]).controller('DatePickerCtrl', ['$scope', '$mdDialog', 'currentDate', '$mdMedia', function ($scope, $mdDialog, currentDate, $mdMedia) {
  var self = this;
  this.currentDate = currentDate;
  this.currentMoment = moment(self.currentDate);
  this.weekDays = moment.weekdaysMin();

  $scope.$mdMedia = $mdMedia;
  $scope.yearsOptions = [];
  for (var i = 1970; i <= this.currentMoment.year() + 100; i++) {
    $scope.yearsOptions.push(i);
  }
  $scope.year = this.currentMoment.year();

  this.setYear = function () {
    self.currentMoment.year($scope.year);
  };

  this.selectDate = function (dom) {
    self.currentMoment.date(dom);
  };

  this.cancel = function () {
    $mdDialog.cancel();
  };

  this.confirm = function () {
    $mdDialog.hide(this.currentMoment.toDate());
  };

  this.getDaysInMonth = function () {
    var days = self.currentMoment.daysInMonth(),
        firstDay = moment(self.currentMoment).date(1).day();

    var arr = [];
    for (var i = 1; i <= firstDay + days; i++) {
      arr.push(i > firstDay ? i - firstDay : false);
    }
    return arr;
  };

  this.nextMonth = function () {
    self.currentMoment.add(1, 'months');
    $scope.year = self.currentMoment.year();
  };

  this.prevMonth = function () {
    self.currentMoment.subtract(1, 'months');
    $scope.year = self.currentMoment.year();
  };
}]).factory('$mdDatePicker', ['$mdDialog', function ($mdDialog) {
  var datePicker = function datePicker(targetEvent, currentDate) {
    var jsDate = moment(currentDate, 'DD-MMM-YYYY').toDate();
    if (!angular.isDate(jsDate)) {
      currentDate = Date.now();
    }
    return $mdDialog.show({
      controller: 'DatePickerCtrl',
      controllerAs: 'datepicker',
      templateUrl: '/modal.datepicker.html',
      targetEvent: targetEvent,
      locals: {
        currentDate: currentDate
      }
    });
  };

  return datePicker;
}]);
//# sourceMappingURL=calendar.directive.js.map

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var cartButtonsController =
  /*@ngInject*/
  function cartButtonsController(Cart, Auth) {
    _classCallCheck(this, cartButtonsController);

    this.cart = Cart.cart;
    this.Auth = Auth;
    this.addItem = function (product, variant, i) {
      var advertiser = this.Auth.getCurrentUser();
      i = i || 1;

      if (product.campaignName) {

        this.cart.addItem({ sku: variant._id, name: variant.name, slug: variant.formart, mrp: variant.model, image: variant.image, weight: variant.maxSize, size: variant.size, price: variant.price, quantity: 1, vid: variant._id }, i);
      }

      //ng-click="cart.addItem({sku:adspace.sku, name:adspace.name,slug:adspace.formart,mrp:adspace.model, weight:adspace.maxSize,size:adspace.size,price:adspace.price ,status: {name:'New', val:402}, publisher:product.name,advertiser:user,uid:product.uid,category:product.brand.name,image:product.logo[0].base64,quantity:1} ,true);"
      /*
         todo add category to cart
       */
      this.cart.addItem({ sku: variant._id, name: variant.name, slug: variant.formart, mrp: variant.model, weight: variant.maxSize, size: variant.size, price: variant.price, status: { name: 'New', val: 402 }, publisher: product.name, advertiser: this.Auth.getCurrentUser(), uid: product.uid, image: product.logo[0].base64, quantity: 1, vid: variant._id }, i);
    };
  };

  angular.module('mediaboxApp').component('cartButtons', {
    template: '    \n        <section class="md-actions cta" layout="row" layout-align="start end" ng-if="$ctrl.cart.checkCart($ctrl.variant._id, $ctrl.variant._id)">\n            <md-button ng-click="$ctrl.addItem($ctrl.product, $ctrl.variant)" class="md-raised md-primary"\n            aria-label="Add to cart">\n                <ng-md-icon icon="shopping_cart"></ng-md-icon>Add to cart\n            </md-button>\n        </section>\n\n        <section class="md-actions cta" layout="row" layout-align="start center" ng-if="!$ctrl.cart.checkCart($ctrl.variant._id, $ctrl.variant._id)">\n            <md-button class="md-raised md-primary left md-icon-button" \n            ng-click="$ctrl.addItem($ctrl.product, $ctrl.variant,-1)" \n            aria-label="Remove from cart">\n                <ng-md-icon icon="remove"></ng-md-icon>\n            </md-button>\n\n            <md-button class="middle" aria-label="Cart quantity" ui-sref="checkout">Buy {{$ctrl.cart.getQuantity($ctrl.variant._id, $ctrl.variant._id)}}</md-button>\n\n            <md-button class="md-raised md-primary right md-icon-button" ng-click="$ctrl.addItem($ctrl.product, $ctrl.variant,1)" aria-label="Add to cart">\n                <ng-md-icon icon="add"></ng-md-icon>\n            </md-button>\n        </section>\n    ',
    bindings: {
      product: '<', // One way binding towards controller
      variant: '<', // One way binding towards controller
      readOnly: '@?' // String value
    },
    controller: cartButtonsController
  });
})();
//# sourceMappingURL=cart-buttons.component.js.map

'use strict';

angular.module('mediaboxApp').directive('crudTable', function ($http, $state) {
  return {
    templateUrl: 'components/crud-table/main.html',
    restrict: 'E',
    scope: { api: '@', columns: '=options' },
    transclude: true,
    link: function link(scope, element, attrs) {
      var obj = [];
      var columns = scope.columns;
      angular.forEach(columns, function (i) {
        var o = {};
        // Extract sortType from dataType
        if (i.dataType === 'numeric' || i.dataType === 'number' || i.dataType === 'float' || i.dataType === 'integer' || i.dataType === 'currency') {
          i.dataType = 'parseFloat';
          o.sortType = 'parseFloat';
        } else if (i.dataType === 'date' || i.dataType === 'calendar') {
          i.dataType = 'date';
          o.sortType = 'date';
        } else if (i.dataType === 'dropdown' || i.dataType === 'select' || i.dataType === 'option') {
          i.dataType = 'dropdown';
          o.sortType = 'lowercase';
        } else if (i.dataType === 'textarea' || i.dataType === 'multiline') {
          i.dataType = 'textarea';
          o.sortType = 'lowercase';
        } else if (i.dataType === 'image' || i.dataType === 'photo' || i.dataType === 'picture') {
          i.dataType = 'image';
          o.sortType = 'lowercase';
        } else {
          o.sortType = 'lowercase';
        }
        // check heading (Assign heading if not exists)
        if ('heading' in i) {
          o.heading = i.heading;
        } else if ('title' in i) {
          o.heading = i.title;
        } else {
          o.heading = i.field;
        }

        // Assign fields to object
        o.field = i.field;
        // o.sort = attrs.sort; // The field where the sort=true
        o.noSort = i.noSort;
        o.noAdd = i.noAdd;
        o.noEdit = i.noEdit;
        o.dataType = i.dataType;
        o.options = i.options;

        obj.push(o);
      });
      $state.go('crud-table', { api: attrs.api, options: attrs, columns: obj }, { location: false });
    }
  };
});
//# sourceMappingURL=crud-table.js.map

'use strict';

(function () {

  function CrudTableDetailController($http, $state, Toast, $stateParams, ToggleComponent, Settings, $mdDialog, socket, $scope, $filter) {
    var vm = this;
    var api = $stateParams.api;
    // var _id = $stateParams.id;
    vm.myDate = new Date();
    vm.header = api;
    vm.item = angular.copy($stateParams.data);
    vm.columns = $stateParams.columns;
    vm.mediaLibrary = function () {
      $mdDialog.show({
        templateUrl: '/components/crud-table/media-library.html',
        controller: function controller($scope, $mdDialog) {
          // Start query the database for the table
          $scope.loading = true;
          $http.get('/api/media/').then(function (res) {
            $scope.loading = false;
            $scope.media = res.data;
            socket.syncUpdates('media', $scope.data);
          }, handleError);

          function handleError(error) {
            // error handler
            $scope.loading = false;
            if (error.status === 403) {
              Toast.show({
                type: 'error',
                text: 'Not authorised to make changes.'
              });
            } else if (error.status !== 500) {
              Toast.show({
                type: 'error',
                text: error.status
              });
            }
          }
          $scope.ok = function (path) {
            $mdDialog.hide(path);
          };
          $scope.hide = function () {
            $mdDialog.hide();
          };
          $scope.cancel = function () {
            $mdDialog.cancel();
          };
          $scope.addNewImage = function () {
            $state.go('media');
            $mdDialog.hide(path);
          };
        }
      }).then(function (answer) {
        vm.item.image = answer;
      }, function () {});
    };

    function goBack() {
      ToggleComponent('crud-table.detailView').close();
      $state.go('^', {}, { location: false });
    }
    vm.goBack = goBack;

    vm.edit = function (product) {
      // refuse to work with invalid data
      if (!product) {
        return;
      }

      $http.put('/api/' + $filter('pluralize')(api) + '/' + product._id, product).then(success).catch(err);
      function success(res) {
        var item = vm.item = res.data;
        Toast.show({ type: 'success', text: api + ' has been updated' });
      }

      function err(err) {}
    };
  }

  angular.module('mediaboxApp').controller('CrudTableDetailController', CrudTableDetailController);
})();
//# sourceMappingURL=detail.controller.js.map

'use strict';

(function () {

  function CrudTableListController($scope, $http, socket, $state, $stateParams, Modal, Toast, Settings, $filter, $mdDialog) {
    var api = $stateParams.api;
    this.sortPredicate = $stateParams.options.sort;
    var options = $stateParams.options;
    this.cols = $stateParams.columns;
    this.header = api;
    this.sort = {};
    this.$mdDialog = $mdDialog;
    var vm = this;
    vm.loading = true;

    // the selected item id
    var _id = null;
    var originatorEv;

    if (options) {
      if (options.predicate) {
        this.sort.predicate = options.predicate;
      } else {
        this.sort.predicate = this.sortPredicate || 'name';
      }
    }
    this.sort.reverse = true;
    this.order = function (predicate) {
      this.sort.reverse = this.sort.predicate === predicate ? !this.sort.reverse : false;
      this.sort.predicate = predicate;
    };
    this.no = {};
    if ('noadd' in options) {
      this.no.add = true;
    }
    if ('nocopy' in options) {
      this.no.copy = true;
    }
    if ('nodelete' in options) {
      this.no.delete = true;
    }
    if ('noedit' in options) {
      this.no.edit = true;
    }
    if ('nosort' in options) {
      this.no.sort = true;
    }
    if ('nosearch' in options) {
      this.no.filter = true;
    }
    if ('nofilter' in options) {
      this.no.filter = true;
    }
    if ('noexport' in options) {
      this.no.export = true;
    }
    this.l = 10;
    this.loadMore = function () {
      this.l += 2;
    };

    this.exportData = function (type) {
      var data = JSON.stringify(this.data, undefined, 2);
      var blob;
      if (type === 'txt') {
        // Save as .txt
        blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, options.api + '.txt');
      } else if (type === 'csv') {
        // Save as .csv
        blob = new Blob([document.getElementById('exportable').innerHTML], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
        saveAs(blob, options.api + ".csv");
      } else if (type === 'xls') {
        // Save as xls
        blob = new Blob([document.getElementById('exportable').innerHTML], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, options.api + ".xls");
      } else {
        // Save as .json
        blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, options.api + '.json');
      }
    };

    this.openMenu = function ($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };
    vm.isSelected = function (product) {
      return _id === product._id;
    };

    // Start query the database for the table
    vm.loading = true;
    var api2 = $filter('pluralize')(api);

    $http.get('/api/' + api2).then(function (res) {
      vm.loading = false;
      vm.data = res.data;
      socket.syncUpdates(api, vm.data);
    }, handleError);

    this.changeStatus = function (x) {
      $http.put('/api/' + api2 + '/' + x._id, { active: x.active }).then(function () {}, handleError);
    };

    this.copy = function (data) {
      var confirm = this.$mdDialog.confirm().title('Would you like to copy the ' + api + '?').ariaLabel('Confirm to copy ' + api).ok('Yes').cancel('No');
      this.$mdDialog.show(confirm).then(function () {
        var d = angular.copy(data);
        delete d._id;
        $http.post('/api/' + api2, d).then(function (response) {
          Toast.show({
            type: 'success',
            text: 'The ' + options.api + ' copied successfully.'
          });
        }).catch(function (err) {
          if (err.type === 'demo') return;

          Toast.show({
            type: 'warn',
            text: 'Error while duplicating ' + options.api
          });
        });
      });
    };

    this.delete = function (data) {
      var confirm = this.$mdDialog.confirm().title('Would you like to delete the ' + api + '?').ariaLabel('Confirm delete ' + api).ok('Yes').cancel('No');
      this.$mdDialog.show(confirm).then(function () {
        $http.delete('/api/' + api2 + '/' + data._id).then(function () {}, handleError);
      });
    };

    function handleError(error) {
      // error handler
      vm.loading = false;
      if (error.status === 401 || error.status === 403) {
        Toast.show({
          type: 'error',
          text: 'Not authorised to make changes.'
        });
      } else if (error.status === 404) {
        Toast.show({ type: 'error', text: 'The requested resource not found.' });
      } else if (error.status !== 500 && error.type !== 'demo') {
        Toast.show({
          type: 'error',
          text: error.status
        });
      }
    }

    this.showInDetails = function (item) {
      _id = item._id;
      $state.go('detail', { 'data': item }, { location: false });
    };
  }

  angular.module('mediaboxApp').controller('CrudTableListController', CrudTableListController);
})();
//# sourceMappingURL=list.controller.js.map

'use strict';

(function () {

  function CrudTableMainController(Modal, $stateParams) {
    var options = $stateParams.options;
    var cols = $stateParams.columns;
    this.create = function () {
      Modal.show(cols, options);
    };
  }

  angular.module('mediaboxApp').controller('CrudTableMainController', CrudTableMainController);
})();
//# sourceMappingURL=main.controller.js.map

'use strict';

(function () {
  'use strict';

  angular.module('mediaboxApp').config(mainRoute);
  mainRoute.$inject = ['$stateProvider'];
  function mainRoute($stateProvider, $stateParams) {
    $stateProvider.state('crud-table', {
      url: '/crud-table/:api',
      params: { options: null, columns: null },
      views: {
        '': {
          templateUrl: 'components/crud-table/main.html',
          controller: 'CrudTableMainController as main'
        },
        'content@crud-table': {
          url: '/content',
          templateUrl: 'components/crud-table/list.html',
          controller: 'CrudTableListController as list'
        }
      }
    }).state('detail', {
      url: '/detail/:id',
      onEnter: onEnterUserListDetail, // To open right sidebar
      params: { data: null },
      parent: 'crud-table',
      views: {
        '': {
          templateUrl: 'components/crud-table/main.html'
        },
        'detail': {
          templateUrl: 'components/crud-table/detail.html',
          controller: 'CrudTableDetailController as detail'
        }
      }
    }).state('create', {
      url: '/create',
      parent: 'crud-table',
      params: { data: null },
      views: {
        '': {}
      }
    });
  }
  function resolveIdFromArray($stateParams) {
    return { '_id': $stateParams.id, 'api': $stateParams.api };
  }

  onEnterUserListDetail.$inject = ['$timeout', 'ToggleComponent'];

  function onEnterUserListDetail($timeout, ToggleComponent) {
    $timeout(showDetails, 0, false);
    function showDetails() {
      ToggleComponent('crud-table.detailView').open();
    }
  }
})();
//# sourceMappingURL=main.js.map

'use strict';

angular.module('mediaboxApp').directive('noautocomplete', function () {

  return {

    restrict: 'A',

    link: function link(scope, el, attrs) {
      // password fields need one of the same type above it (firefox)
      var type = el.attr('type') || 'text';
      // chrome tries to act smart by guessing on the name.. so replicate a shadow name
      var name = el.attr('name') || '';
      var shadowName = name + '_shadow';
      // trick the browsers to fill this innocent silhouette
      var shadowEl = angular.element('<input type="' + type + '" name="' + shadowName + '" style="display: none">');

      // insert before
      el.parent()[0].insertBefore(shadowEl[0], el[0]);
    }

  };
}).directive('errSrc', function () {
  return {
    link: function link(scope, element, attrs) {
      element.bind('error', function () {
        if (attrs.src !== attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  };
}).directive('onlyNumbers', function () {
  return function (scope, element, attrs) {
    var keyCode = [8, 9, 13, 37, 39, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 110, 190];
    element.bind('keydown', function (event) {
      if (_.indexOf(keyCode, event.which) === -1) {
        scope.$apply(function () {
          scope.$eval(attrs.onlyNum);
          event.preventDefault();
        });
        event.preventDefault();
      }
    });
  };
}).directive('focusMe', function ($timeout, $parse) {
  return {
    link: function link(scope, element, attrs) {
      var model = $parse(attrs.focusMe);
      scope.$watch(model, function (value) {
        if (value === true) {
          $timeout(function () {
            element[0].focus();
          });
        }
      });
      // on blur event:
      element.bind('blur', function () {
        scope.$apply(model.assign(scope, false));
      });
    }
  };
}).directive('ngPrism', ['$interpolate', function ($interpolate) {
  return {
    restrict: 'E',
    template: '<pre><code ng-transclude></code></pre>',
    replace: true,
    transclude: true
  };
}]).directive('validateCart', function (Cart) {
  return {
    restrict: 'A',
    scope: true,
    require: 'ngModel',
    link: function link(scope, elem, attrs, control) {
      var checker = function checker() {
        var cv = Cart.cart.getTotalPrice();
        // if(e2!=null)
        return cv !== 0;
      };
      scope.$watch(checker, function (n) {
        control.$setValidity("validCart", n);
      });
    }
  };
});
//# sourceMappingURL=directive.directive.js.map

'use strict';

function ShoppingCart(cartName, Settings, Shipping, Order, Mail, Pay, appConfig, $state) {
    this.cartName = cartName;
    this.clearCart = false;
    this.checkoutParameters = {};
    this.items = [];
    this.skuArray = [];
    this.variantsArray = [];
    this.totalWeight = 0;
    this.taxRate = 10;
    this.tax = null;
    this.campaignName = "";
    this.objectives = "";
    this.startDate = "";
    this.endDate = "";
    this.products = null;
    this.totalSpend = null;
    this.spendStats = null;
    this.age = [];
    this.income = [];
    // load items from local storage when initializing
    this.loadItems();

    this.Settings = Settings;
    this.Shipping = Shipping;
    this.Order = Order;
    this.Mail = Mail;
    this.Pay = Pay;
    this.appConfig = appConfig;
    this.$state = $state;
}

//----------------------------------------------------------------
// items in the cart
//
function CartItem(sku, name, slug, mrp, price, quantity, image, category, size, weight, status, publisher, advertiser, uid, vid) {
    this.sku = sku;
    this.name = name;
    this.slug = slug;
    this.image = image;
    this.category = category;
    this.size = size;
    this.mrp = mrp;
    this.price = price * 1;
    this.quantity = quantity * 1;
    this.weight = weight;
    this.status = status;
    this.publisher = publisher;
    this.advertiser = advertiser;
    this.uid = uid;
    this.vid = vid;
    this.status = 0;
}

//----------------------------------------------------------------
// checkout parameters (one per supported payment service)
// replaced this.serviceName with serviceName because of jshint complaint
//
function checkoutParameters(serviceName, merchantID, options) {
    this.serviceName = serviceName;
    this.merchantID = merchantID;
    this.options = options;
}

// load items from local storage
ShoppingCart.prototype.loadItems = function () {
    var items = localStorage !== null ? localStorage[this.cartName + '_items'] : null;
    if (items !== null && JSON !== null) {
        try {
            items = JSON.parse(items);
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.sku !== null && item.name !== null && item.price !== null) {
                    item = new CartItem(item.sku, item.name, item.slug, item.mrp, item.price, item.quantity, item.image, item.category, item.size, item.weight, item.status, item.publisher, item.advertiser, item.uid, item.vid);
                    this.items.push(item);
                    this.skuArray.push(item.sku);
                    this.variantsArray.push(item.vid);
                    // this.totalWeight = item.weight;
                }
            }
        } catch (err) {
            // ignore errors while loading...
        }
    }
};

// save items to local storage
ShoppingCart.prototype.saveItems = function () {
    if (localStorage !== null && JSON !== null) {
        localStorage[this.cartName + '_items'] = JSON.stringify(this.items);
    }
};

// adds an item to the cart
ShoppingCart.prototype.addItem = function (product, quantity) {
    quantity = this.toNumber(quantity);
    if (quantity !== 0) {
        // update quantity for existing item
        var found = false;
        for (var i = 0; i < this.items.length && !found; i++) {
            var item = this.items[i];
            if (item.sku === product.sku && item.vid === product.vid) {
                found = true;
                item.quantity = this.toNumber(this.toNumber(item.quantity) + quantity);
                if (item.weight == null) {
                    item.weight = 0;
                }
                item.slug = product.slug;
                if (item.quantity <= 0) {
                    this.items.splice(i, 1);
                    this.skuArray.splice(i, 1);
                    this.variantsArray.splice(i, 1);
                }
            }
        }

        // new item, add now
        if (!found && product.price) {
            var itm = new CartItem(product.sku, product.name, product.slug, product.mrp, product.price, product.quantity, product.image, product.category, product.size, product.weight, product.status, product.publisher, product.advertiser, product.uid, product.vid);
            this.items.push(itm);
            this.skuArray.push(itm.sku);
            this.variantsArray.push(itm.vid);
        }

        // save changes
        this.saveItems();
    }
};

// get the total price for all items currently in the cart
ShoppingCart.prototype.getBestShipper = function () {
    var cartValue = this.getTotalPrice();
    var totalWeight = this.getTotalWeight();

    //return 0;
    return this.Shipping.best.query({ country: this.Settings.country.name, weight: totalWeight, cartValue: cartValue });
};

// get handling fee
ShoppingCart.prototype.getHandlingFee = function () {
    var cartValue = this.getTotalPrice();

    return cartValue * 0.05;
};

// get the total price for all items currently in the cart
ShoppingCart.prototype.getTotalWeight = function (sku) {
    var totalWeight = 0;
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        if (sku === undefined || item.sku === sku) {
            totalWeight += this.toNumber(item.quantity * item.weight);
        }
    }
    return totalWeight;
};

// get the total price for all items currently in the cart
ShoppingCart.prototype.getTotalPrice = function (sku) {
    var total = 0;
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        if (sku === undefined || item.sku === sku) {
            total += this.toNumber(item.quantity * item.price);
        }
    }
    return total;
};

ShoppingCart.prototype.checkCart = function (id, vid) {
    // Returns false when there is item in cart
    if (!_.includes(this.skuArray, id) || !_.includes(this.variantsArray, vid)) {
        return true;
    } else {
        return false;
    }
};
ShoppingCart.prototype.getQuantity = function (sku, vid) {
    // Get quantity based on the combination of product_id and variant_id
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].sku === sku && this.items[i].vid === vid) {
            return this.items[i].quantity;
        }
    }
};

// get the total price for all items currently in the cart
ShoppingCart.prototype.getTotalCount = function (sku) {
    var count = 0;
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        if (sku === undefined || item.sku === sku) {
            count += this.toNumber(item.quantity);
        }
    }
    return count;
};

// clear the cart
ShoppingCart.prototype.clearItems = function () {
    this.items = [];
    this.skuArray = [];
    this.variantsArray = [];
    this.saveItems();
};

ShoppingCart.prototype.toNumber = function (value) {
    value = value * 1;
    return isNaN(value) ? 0 : value;
};

// define checkout parameters
ShoppingCart.prototype.addCheckoutParameters = function (serviceName, merchantID, options) {

    // check parameters
    if (serviceName != "PayPal" && serviceName != "Google" && serviceName != "Stripe" && serviceName != "COD") {
        throw "serviceName must be 'PayPal' or 'Google' or 'Stripe' or 'Cash On Delivery'.";
    }
    if (merchantID == null) {
        throw "A merchantID is required in order to checkout.";
    }

    // save parameters
    this.checkoutParameters[serviceName] = new checkoutParameters(serviceName, merchantID, options);
};

// check out
ShoppingCart.prototype.checkout = function (serviceName, clearCart) {

    serviceName = { name: serviceName.paymentMethod.name, email: serviceName.paymentMethod.email, options: serviceName };

    this.addCheckoutParameters(serviceName.name, serviceName.email, serviceName.options);

    // select serviceName if we have to
    if (serviceName.name == null) {
        var p = this.checkoutParameters[Object.keys(this.checkoutParameters)[0]];
        serviceName = p.serviceName;
    }

    // sanity
    if (serviceName.name == null) {
        throw "Use the 'addCheckoutParameters' method to define at least one checkout service.";
    }

    // go to work
    var parms = this.checkoutParameters[serviceName.name];
    if (parms == null) {
        throw "Cannot get checkout parameters for '" + serviceName.name + "'.";
    }
    switch (parms.serviceName) {
        case "PayPal":
            this.checkoutPayPal(parms, clearCart);
            break;
        case "Google":
            this.checkoutGoogle(parms, clearCart);
            break;
        case "Stripe":
            this.checkoutStripe(parms, clearCart);
            break;
        case "COD":
            this.checkoutCOD(parms, clearCart);
            break;
        default:
            throw "Unknown checkout service: " + parms.serviceName;
    }
};

ShoppingCart.prototype.checkoutPayPal = function (parms, clearCart) {
    var vm = this;
    var opt = parms.options;
    var options = { uid: opt.uid, email: opt.email, recipient_name: opt.name, phone: opt.phone, line1: opt.address, city: opt.city, postal_code: opt.zip, country_code: opt.country_code, discount: opt.couponAmount, shipping: '0', currency_code: opt.currency_code, exchange_rate: opt.exchange_rate };
    var data = {
        cmd: "_cart",
        business: parms.merchantID,
        upload: "1",
        rm: "2",
        charset: "utf-8",
        data: this.items,
        options: options
    };
    var form = $('<form/></form>');
    form.attr("id", "paypalForm");
    form.attr("action", "/api/pay/prepare");
    form.attr("method", "GET");
    form.attr("style", "display:none;");
    this.addFormFields(form, data);
    $("body").append(form);

    // submit form
    this.clearCart = clearCart == null || clearCart;
    form.submit();
    form.remove();
};

// check out using COD
ShoppingCart.prototype.checkoutCOD = function (parms, clearCart) {
    var vm = this;
    var opt = parms.options;
    var data = opt.items;
    var total = Math.round((this.getTotalPrice() + this.getHandlingFee() - opt.couponAmount) * opt.exchange_rate * 100) / 100;
    var subtotal = Math.round((this.getTotalPrice() - opt.couponAmount) * opt.exchange_rate * 100) / 100;

    var items = [];

    if (isNaN(opt.exchange_rate) || opt.exchange_rate === '') // If exchange rate is not a float value, force this to 1
        opt.exchange_rate = 1;
    for (var k = 0; k < data.length; k++) {
        var i = data[k];
        items.push({ sku: i.sku, name: i.name, url: i.image, description: i.slug, price: Math.round(i.price * opt.exchange_rate * 100) / 100, quantity: i.quantity, currency: opt.currency_code });
    }
    if (opt.discount > 0) items.push({ sku: '#', name: 'Coupon Discount', url: '-', description: '-', price: -Math.round(opt.discount * opt.exchange_rate * 100) / 100, quantity: 1, currency: opt.currency_code });

    var orderDetails = {
        uid: opt.uid,
        email: opt.email,
        phone: opt.phone,
        address: { country_code: opt.country_code, postal_code: opt.zip, state: opt.state, city: opt.city, line1: opt.address, recipient_name: opt.name },
        payment: { state: opt.payment },
        amount: { total: total, currency: opt.currency_code, details: { shipping: Math.round(this.getHandlingFee() * 100) / 100, subtotal: subtotal } },
        exchange_rate: opt.exchange_rate,
        items: items,
        status: 'Payment Pending',
        payment_method: 'COD'
    };

    // When order.status is null, the client will replace with the Array[0] of order status at Settings page
    this.Order.save(orderDetails, function (data, err) {
        if (clearCart) vm.clearItems();
        vm.$state.go('order');
    });
};

// check out using Google Wallet
// for details see:
// developers.google.com/checkout/developer/Google_Checkout_Custom_Cart_How_To_HTML
// developers.google.com/checkout/developer/interactive_demo
ShoppingCart.prototype.checkoutGoogle = function (parms, clearCart) {

    // global data
    var data = {};

    // item data
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        var ctr = i + 1;
        data["item_name_" + ctr] = item.sku;
        data["item_description_" + ctr] = item.name;
        data["item_price_" + ctr] = item.price.toFixed(2);
        data["item_quantity_" + ctr] = item.quantity;
        data["item_merchant_id_" + ctr] = parms.merchantID;
    }

    // build form
    var form = $('<form/></form>');
    // NOTE: in production projects, use the checkout.google url below;
    // for debugging/testing, use the sandbox.google url instead.
    //form.attr("action", "https://checkout.google.com/api/checkout/v2/merchantCheckoutForm/Merchant/" + parms.merchantID);
    form.attr("action", "https://sandbox.google.com/checkout/api/checkout/v2/checkoutForm/Merchant/" + parms.merchantID);
    form.attr("method", "POST");
    form.attr("style", "display:none;");
    this.addFormFields(form, data);
    if (!parms.options) {
        parms.options = {};
    }
    this.addFormFields(form, parms.options);
    $("body").append(form);

    // submit form
    this.clearCart = clearCart == null || clearCart;
    form.submit();
    form.remove();
};

// check out using Stripe
// for details see:
// https://stripe.com/docs/checkout
ShoppingCart.prototype.checkoutStripe = function (parms, clearCart) {
    var vm = this;
    var opt = parms.options;
    var data = opt.items;
    var total = Math.round((this.getTotalPrice() + opt.shipping.charge - opt.couponAmount) * opt.exchange_rate * 100) / 100;
    var subtotal = Math.round((this.getTotalPrice() - opt.couponAmount) * opt.exchange_rate * 100) / 100;
    parms.options.total = total;

    var items = [];

    if (isNaN(opt.exchange_rate) || opt.exchange_rate === '') // If exchange rate is not a float value, force this to 1
        opt.exchange_rate = 1;
    for (var k = 0; k < data.length; k++) {
        var i = data[k];
        items.push({ sku: i.sku, name: i.name, url: i.image, description: i.slug, price: Math.round(i.price * opt.exchange_rate * 100) / 100, quantity: i.quantity, currency: opt.currency_code });
    }
    if (opt.discount > 0) items.push({ sku: '#', name: 'Coupon Discount', url: '-', description: '-', price: -Math.round(opt.discount * opt.exchange_rate * 100) / 100, quantity: 1, currency: opt.currency_code });

    parms.options.items = items;
    this.Pay.stripe.save(parms.options, function (res) {
        if (clearCart) vm.clearItems();
        vm.$state.go('order', { id: res.id, msg: 'Stripe payment successful' });
    }, function (err) {
        vm.$state.go('checkout', { id: err.data.id, msg: err.data.message });
    });
};

// utility methods
ShoppingCart.prototype.addFormFields = function (form, data) {
    if (data !== null) {
        $.each(data, function (name, value) {
            if (value !== null) {
                var input = $('<input></input>').attr('type', 'hidden').attr('name', name).val(JSON.stringify(value));
                form.append(input);
            }
        });
    }
};

angular.module('mediaboxApp').factory('Cart', function (Settings, Shipping, Order, Mail, Pay, appConfig, $state) {
    var myCart = new ShoppingCart('mShop', Settings, Shipping, Order, Mail, Pay, appConfig, $state);
    return { cart: myCart };
});
//# sourceMappingURL=cart.service.js.map

'use strict';

angular.module('mediaboxApp').factory('Product', ['$resource', function ($resource) {
  var obj = {};
  obj = $resource('/api/products/:id', null, { 'update': { method: 'PUT' } });
  obj.count = $resource('/api/products/count');
  obj.pr = $resource('/api/products/priceRange');
  return obj;
}]).factory('Shipping', ['$resource', function ($resource) {
  var obj = {};
  obj = $resource('/api/shippings/:id', null, { 'update': { method: 'PUT' } });
  obj.best = $resource('/api/shippings/best', null, { 'update': { method: 'PUT' } });
  return obj;
}]).factory('Category', ['$resource', function ($resource) {
  var obj = {};
  obj = $resource('/api/categories/:id', null, {
    'update': { method: 'PUT' },
    'query': { method: 'GET', isArray: true } });
  obj.loaded = $resource('/api/categories/loaded');
  obj.tree = $resource('/api/categories/tree');
  return obj;
}]).factory('Cat', ['$resource', function ($resource) {
  var obj = {};
  obj = $resource('/api/cats/:id', null, { 'update': { method: 'PUT' } });
  obj.headings = $resource('/api/cats/headings');
  return obj;
}]).factory('Country', ['$resource', function ($resource) {
  var obj = {};
  obj = $resource('/api/countries/:id', null, { 'update': { method: 'PUT' } });
  obj.active = $resource('/api/countries/active', null, { 'update': { method: 'PUT' } });
  return obj;
}]).factory('Brand', ['$resource', '$rootScope', function ($resource, $rootScope) {
  var obj = {};

  var pageFlag = $rootScope.page;

  if (pageFlag == "OnlineStore") {} else if (pageFlag == "magazines") {

    return $resource('/api/brandmgs/:id', null, { 'update': { method: 'PUT' } });
  } else if (pageFlag == "Ticketing") {

    return $resource('/api/brands/:id', null, { 'update': { method: 'PUT' } });
  } else if (pageFlag == "television") {

    return $resource('/api/brandtvs/:id', null, { 'update': { method: 'PUT' } });
  } else {

    return $resource('/api/brands/:id', null, { 'update': { method: 'PUT' } });
  }
}]).factory('BrandMG', ['$resource', function ($resource) {
  return $resource('/api/brandmgs/:id', null, { 'update': { method: 'PUT' } });
}]).factory('BrandTV', ['$resource', function ($resource) {
  return $resource('/api/brandtvs/:id', null, { 'update': { method: 'PUT' } });
}]).factory('Coupon', ['$resource', function ($resource) {
  return $resource('/api/coupons/:id', null, { 'update': { method: 'PUT' } });
}]).factory('Address', ['$resource', function ($resource) {
  var obj = {};
  obj = $resource('/api/address/:id', null, { 'update': { method: 'PUT' } });
  obj.my = $resource('/api/address/my', null);
  return obj;
}]).factory('Feature', ['$resource', function ($resource) {
  var obj = {};
  obj = $resource('/api/features/:id', null, { 'update': { method: 'PUT' } });
  obj.group = $resource('/api/features/group', null, { 'update': { method: 'PUT' } });
  return obj;
}]).factory('Media', ['$resource', function ($resource) {
  var obj = {};
  obj = $resource('/api/media/:id', null, { 'update': { method: 'PUT' } });
  obj.my = $resource('/api/media/my/:id', null, { 'update': { method: 'PUT' } });
  obj.pub = $resource('/api/media/pub/:id', null, { 'update': { method: 'PUT' } });
  return obj;
}]).factory('Statistic', ['$resource', function ($resource) {
  var obj = {};
  obj = $resource('/api/statistics/:id', null, { 'update': { method: 'PUT' } });
  obj.group = $resource('/api/statistics/group', null, { 'update': { method: 'PUT' } });
  return obj;
}]).factory('PaymentMethod', ['$resource', function ($resource) {
  var obj = {};
  obj = $resource('/api/PaymentMethods/:id', null, { 'update': { method: 'PUT' } });
  obj.active = $resource('/api/PaymentMethods/active', null, { 'update': { method: 'PUT' } });
  return obj;
}]).factory('Order', ['$resource', function ($resource) {
  var obj = {};
  obj = $resource('/api/orders/:id', null, { 'update': { method: 'PUT' } });
  obj.my = $resource('/api/orders/my', null, { 'update': { method: 'PUT' } });
  obj.pub = $resource('/api/orders/pub', null, { 'update': { method: 'PUT' } });
  return obj;
}]).factory('Campaign', ['$resource', function ($resource) {
  var obj = {};
  obj = $resource('/api/campaigns/:id', null, { 'update': { method: 'PUT' } });
  obj.my = $resource('/api/campaigns/my', null, { 'update': { method: 'PUT' } });
  obj.pub = $resource('/api/campaigns/pub', null, { 'update': { method: 'PUT' } });
  return obj;
}]).factory('Pay', ['$resource', function ($resource) {
  var obj = {};
  obj = $resource('/api/pay/:id', null, { 'update': { method: 'PUT' } });
  obj.prepare = $resource('/api/pay/prepare');
  obj.stripe = $resource('/api/pay/stripe');
  return obj;
}]).factory('Review', ['$resource', function ($resource) {
  var obj = {};
  obj = $resource('/api/reviews/:id', null, { 'update': { method: 'PUT' } });
  obj.my = $resource('/api/reviews/my');
  return obj;
}]).factory('Wishlist', ['$resource', function ($resource) {
  var obj = {};
  obj = $resource('/api/wishlists/:id', null, { 'update': { method: 'PUT' } });
  obj.my = $resource('/api/wishlists/my');
  return obj;
}]).factory('Mail', ['$resource', function ($resource) {
  return $resource('/api/sendmail/:id');
}]);
//# sourceMappingURL=factory.service.js.map

'use strict';

angular.module('mediaboxApp').filter('localPrice', function (Settings, $filter) {
  return function (input, key) {
    var input = Math.round(input / Settings.currency.exchange_rate * 100) / 100;
    if (!input) {
      return 0;
    }
    if (parseFloat(input) != 0) {
      return $filter('currency')(input, Settings.currency.symbol);
    }
    return $filter('currency')(input);
  };
}).filter('pluralize', function () {
  return function (noun, key) {
    var plural = noun;
    if (noun.substr(noun.length - 2) == 'us') {
      plural = plural.substr(0, plural.length - 2) + 'i';
    } else if (noun.substr(noun.length - 2) == 'ch' || noun.charAt(noun.length - 1) == 'x' || noun.charAt(noun.length - 1) == 's') {
      plural += 'es';
    } else if (noun.charAt(noun.length - 1) == 'y' && ['a', 'e', 'i', 'o', 'u'].indexOf(noun.charAt(noun.length - 2)) == -1) {
      plural = plural.substr(0, plural.length - 1) + 'ies';
    } else if (noun.substr(noun.length - 2) == 'is') {
      plural = plural.substr(0, plural.length - 2) + 'es';
    } else {
      plural += 's';
    }
    return plural;
  };
}).filter('unique', function () {
  return function (input, key) {
    var unique = {};
    var uniqueList = [];
    for (var i = 0; i < input.length; i++) {
      if (typeof unique[input[i][key]] === 'undefined') {
        unique[input[i][key]] = '';
        uniqueList.push(input[i]);
      }
    }
    return uniqueList;
  };
}).filter('labelCase', [function () {
  return function (input) {
    if (!input) {
      return input;
    } else {
      input = input.replace(/([A-Z])/g, ' $1');
      return input[0].toUpperCase() + input.slice(1);
    }
  };
}]).filter('camelCase', [function () {
  return function (input) {
    if (!input) {
      return input;
    } else {
      return input.toLowerCase().replace(/ (\w)/g, function (match, letter) {
        return letter.toUpperCase();
      });
    }
  };
}]).filter('reverse', [function () {
  return function (items) {
    if (items) {
      return items.slice().reverse();
    } else {
      return items;
    }
  };
}]);
//# sourceMappingURL=filters.filter.js.map

'use strict';

angular.module('mediaboxApp').directive('footer', function ($mdDialog, $http, $mdMedia) {
    return {
        templateUrl: 'components/footer/footer.html',
        restrict: 'E',
        link: function link(scope, element) {
            element.addClass('footer');
            scope.addDialog = function () {
                $mdDialog.show({
                    templateUrl: 'components/footer/contact-form.html',
                    controller: function controller($scope, $mdDialog, Toast) {
                        $scope.hide = function () {
                            $mdDialog.hide();
                        };
                        $scope.cancel = function () {
                            $mdDialog.cancel();
                        };
                        $scope.send = function (mail) {
                            $http.post('/api/sendmail', {
                                from: 'Mediabox <admin@mediabox.co.zw>',
                                to: 'support@mediabox.co.zw',
                                subject: 'Message from Mediabox',
                                text: mail.message
                            });
                            $mdDialog.hide(mail);
                            Toast.show({ type: 'success', text: 'Thanks for contacting us.' });
                        };
                    }
                }).then(function (answer) {
                    scope.alert = 'You said the information was "' + answer + '".';
                }, function () {
                    scope.alert = 'You cancelled the dialog.';
                });
            };
            scope.screenIsBig = $mdMedia('gt-sm'); // Erase the parent reference from md-toast the (md-toast bug)
        }
    };
});
//# sourceMappingURL=footer.directive.js.map

'use strict';

(function () {
	'use strict';

	angular.module('mediaboxApp').controller('LeftMenuController', LeftMenuController);

	LeftMenuController.$inject = ['Auth', '$mdSidenav', '$log', '$timeout', '$scope', 'Settings', '$mdMedia'];

	function LeftMenuController(Auth, $mdSidenav, $log, $timeout, $scope, Settings, $mdMedia) {
		var vm = this;
		// $scope.$watch(function() { return $mdMedia('lg'); }, function(big) {
		//   vm.bigScreen = big;
		// });

		vm.logout = Auth.logout;
		vm.isLoggedIn = Auth.isLoggedIn;
		vm.currentUser = Auth.getCurrentUser();
		vm.hasRole = Auth.hasRole;
		vm.menu = Settings.menu;
		vm.toggleLeft = buildDelayedToggler('left');
		vm.toggleRight = buildToggler('right');
		vm.isOpenLeft = function () {
			return $mdSidenav('left').isOpen();
		};
		vm.isOpenRight = function () {
			return $mdSidenav('right').isOpen();
		};
		/**
   * Supplies a function that will continue to operate until the
   * time is up.
   */
		function debounce(func, wait, context) {
			var timer;
			return function debounced() {
				var context = $scope,
				    args = Array.prototype.slice.call(arguments);
				$timeout.cancel(timer);
				timer = $timeout(function () {
					timer = undefined;
					func.apply(context, args);
				}, wait || 10);
			};
		}
		/**
   * Build handler to open/close a SideNav; when animation finishes
   * report completion in console
   */
		function buildDelayedToggler(navID) {
			return debounce(function () {
				$mdSidenav(navID).toggle().then(function () {
					$log.debug('toggle ' + navID + ' is done');
				});
			}, 200);
		}
		function buildToggler(navID) {
			return function () {
				$mdSidenav(navID).toggle().then(function () {
					$log.debug('toggle ' + navID + ' is done');
				});
			};
		}
	}
})();
//# sourceMappingURL=left-menu.controller.js.map

'use strict';

angular.module('mediaboxApp').directive('leftMenu', function () {
  return {
    templateUrl: 'components/left-menu/left-menu.html',
    restrict: 'EA',
    controller: 'LeftMenuController as left',
    link: function link(scope, element, attrs) {}
  };
});
//# sourceMappingURL=left-menu.directive.js.map

'use strict';

(function () {
	'use strict';

	angular.module('mediaboxApp').factory('PageOptions', PageOptions);

	function PageOptions() {
		var obj = {};
		obj.leftmenu = false;
		return obj;
	}
})();
//# sourceMappingURL=left-menu.service.js.map

'use strict';

(function () {
	'use strict';

	angular.module('mediaboxApp').factory('AlphabetColor', function AlphabetColor() {
		var colors = ['#f9a43e', '#59a2be', '#67bf74', '#f58559', '#e4c62e', '#f16364', '#2093cd', '#ad62a7'];
		var numberOfColors = colors.length;

		return getColor;

		function hashCode(str) {
			var hash = 0,
			    length = str.length,
			    i,
			    chr;

			if (length === 0) {
				return hash;
			}

			for (i = 0; i < length; i++) {
				chr = str.charCodeAt(i);
				hash = (hash << 5) - hash + chr;
				hash |= 0; // Convert to 32bit integer
			}

			return hash;
		}

		function getColor(string) {
			var color = Math.abs(hashCode(string.charAt(0))) % numberOfColors;
			return colors[color];
		}
	}).directive('listImage', listImage);

	// AlphabetColor.$inject = ['_'];


	listImage.$inject = ['$mdTheming', 'AlphabetColor'];

	function listImage($mdTheming, AlphabetColor) {
		var templateString = ['<div ng-style="{background: bgColor}">', '<span>{{::firstLetter}}</span>', '</div>'].join('');

		return {
			restrict: 'E',

			template: templateString,

			link: function link($scope, element, attrs) {
				$mdTheming(element);
				$scope.firstLetter = attrs.string.charAt(0);
				$scope.bgColor = AlphabetColor($scope.firstLetter);
			}
		};
	}
})();
//# sourceMappingURL=list-image.directive.js.map

'use strict';

angular.module('mediaboxApp').factory('lodash', function () {

  // add LodashService dependencies to inject
  LodashService.$inject = ['$window'];

  /**
  	 * LodashService constructor
   *
   * @param $window
   * @returns {exports._|*}
   * @constructor
   */
  function LodashService($window) {
    // remove lodash from global object
    var _ = $window._;
    delete $window._;

    // mixin functions
    _.mixin({ 'groupFilter': groupFilter });

    return _;

    /**
     * Group an array of objects into several arrays by the given
     * criteria, each group sorted by groupSort, each group consists
     * of items named groupItemsName.
     *
     * @param data
     * @param criteria
     * @param groupSort
     * @param groupItemsName
     * @returns {*}
     */
    function groupFilter(data, criteria, groupSort, groupItemsName) {
      if (!data || !data.length) {
        return data;
      }

      groupItemsName = groupItemsName || 'items';

      return _.chain(data).sortBy(groupSort).groupBy(criteria).pairs().map(function (currentItem) {
        return _.object(_.zip(['key', groupItemsName], currentItem));
      }).sortBy('key').value();
    }
  }
});
//# sourceMappingURL=lodash.service.js.map

'use strict';

(function () {
    'use strict';

    angular.module('mediaboxApp').factory('LoginModal', LoginModal).factory('CpModal', CpModal).controller('LoginModalController', LoginModalController).controller('SignUpModalController', SignUpModalController).controller('CpModalController', CpModalController).controller('tabsCtrl', tabsCtrl);

    function tabsCtrl($scope) {
        this.onTabSelected = function (tab) {
            this.tab = tab;
        };
    }
    function CpModal($mdDialog) {
        var obj = {};
        obj.show = function () {
            $mdDialog.show({
                controller: 'CpModalController as cp',
                templateUrl: 'components/login-modal/cp.html',
                clickOutsideToClose: false,
                parent: angular.element(document.body)
            }).then(function (answer) {
                // this.status = 'You closed the dialog.';
            }, function () {
                // this.status = 'You cancelled the dialog.';
            });
        };
        return obj;
    }

    function LoginModal($mdDialog, $state) {
        var obj = {};
        obj.show = function (nextRoute, reload) {
            $mdDialog.show({
                // controller: 'LoginModalController as login',
                templateUrl: 'components/login-modal/index.html',
                clickOutsideToClose: false,
                parent: angular.element(document.body),
                openFrom: { top: 500, width: 30, height: 80 },
                closeTo: { left: 1500 }
            }).then(function (answer) {
                $state.go(nextRoute, null, { reload: reload }); // Should be refreshed, else the user info will not be attached
            }, function () {
                // $scope.status = 'You cancelled the dialog.';
            });
        };
        return obj;
    }

    function CpModalController($mdDialog, Toast, Auth, Settings) {
        this.errors = {};
        this.submitted = false;
        this.Settings = Settings;
        this.Toast = Toast;
        this.Auth = Auth;
        this.close = function () {
            $mdDialog.cancel();
        };
        this.changePassword = function (form) {
            var _this = this;

            var vm = this;
            this.loading = true;
            this.submitted = true;
            if (form.$valid) {
                this.Auth.changePassword(this.user.oldPassword, this.user.newPassword).then(function () {
                    _this.message = 'Password successfully changed.';
                    $mdDialog.hide();
                    _this.loading = false;
                }).catch(function () {
                    form.password.$setValidity('mongoose', false);
                    _this.errors.other = 'Incorrect password';
                    _this.message = '';
                    _this.loading = false;
                });
            } else {
                this.Toast.show({ type: 'error', text: 'Error occured while changing password' });
            }
        };
    }
    function SignUpModalController($mdDialog, Auth) {
        this.errors = {};
        this.signupSelected = true;
        this.submitted = false;
        this.Auth = Auth;
        this.close = close;
        this.register = register;
        function close() {
            $mdDialog.cancel();
        }
        function register(form) {
            var _this2 = this;

            this.submitted = true;
            if (form.$valid) {
                this.loading = true;
                this.Auth.createUser({
                    name: this.user.name,
                    email: this.user.email,
                    phone: this.user.phone,
                    company: this.user.company,
                    website: this.user.website,
                    role: this.user.role,
                    password: this.user.password
                }).then(function () {
                    _this2.loading = false;
                    $mdDialog.hide();
                }).catch(function (err) {
                    err = err.data;
                    _this2.errors = {};
                    _this2.loading = false;
                    // Update validity of form fields that match the sequelize errors
                    if (err.name) {
                        angular.forEach(err.errors, function (field) {
                            form[field.path].$setValidity('mongoose', false);
                            _this2.errors[field.path] = field.message;
                        });
                    }
                });
            }
        }
    }
    function LoginModalController($mdDialog, Auth, $state) {
        var vm = this;
        vm.create = createUser;
        vm.login = login;
        vm.close = close;
        vm.goForgot = goForgot;
        vm.user = {};
        vm.errors = {};
        vm.submitted = false;
        vm.Auth = Auth;

        function goForgot(params) {
            close();
            $state.go('forgot', params);
        }
        function close() {
            $mdDialog.cancel();
        }
        function createUser(form) {}
        function login(form) {
            var _this3 = this;

            this.submitted = true;
            if (form.$valid) {
                this.loading = true;
                this.Auth.login({
                    email: this.user.email,
                    password: this.user.password
                }).then(function () {
                    _this3.loading = false;
                    $mdDialog.hide();
                }).catch(function (err) {
                    _this3.errors.other = err.message;
                    _this3.loading = false;
                });
            }
        }
    }
})();
//# sourceMappingURL=modal.service.js.map

"use strict";

(function () {
    "use strict";
    /* global moment, angular */

    var module = angular.module("mdPickers", ["ngMaterial", "ngAnimate", "ngAria"]);

    module.config(["$mdIconProvider", "mdpIconsRegistry", function ($mdIconProvider, mdpIconsRegistry) {
        angular.forEach(mdpIconsRegistry, function (icon, index) {
            $mdIconProvider.icon(icon.id, icon.url);
        });
    }]);

    module.run(["$templateCache", "mdpIconsRegistry", function ($templateCache, mdpIconsRegistry) {
        angular.forEach(mdpIconsRegistry, function (icon, index) {
            $templateCache.put(icon.url, icon.svg);
        });
    }]);
    module.constant("mdpIconsRegistry", [{
        id: 'mdp-chevron-left',
        url: 'mdp-chevron-left.svg',
        svg: '<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'
    }, {
        id: 'mdp-chevron-right',
        url: 'mdp-chevron-right.svg',
        svg: '<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'
    }, {
        id: 'mdp-access-time',
        url: 'mdp-access-time.svg',
        svg: '<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/><path d="M0 0h24v24H0z" fill="none"/><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>'
    }, {
        id: 'mdp-event',
        url: 'mdp-event.svg',
        svg: '<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'
    }]);
    module.directive("ngMessage", ["$mdUtil", function ($mdUtil) {
        return {
            restrict: "EA",
            priority: 101,
            compile: function compile(element) {
                var inputContainer = $mdUtil.getClosest(element, "mdp-time-picker", true) || $mdUtil.getClosest(element, "mdp-date-picker", true);

                // If we are not a child of an input container, don't do anything
                if (!inputContainer) return;

                // Add our animation class
                element.toggleClass('md-input-message-animation', true);

                return {};
            }
        };
    }]);
    /* global moment, angular */

    function DatePickerCtrl($scope, $mdDialog, $mdMedia, $timeout, currentDate, options) {
        var self = this;

        this.date = moment(currentDate);
        this.minDate = options.minDate && moment(options.minDate).isValid() ? moment(options.minDate) : null;
        this.maxDate = options.maxDate && moment(options.maxDate).isValid() ? moment(options.maxDate) : null;
        this.displayFormat = options.displayFormat || "ddd, MMM DD";
        this.dateFilter = angular.isFunction(options.dateFilter) ? options.dateFilter : null;
        this.selectingYear = false;

        // validate min and max date
        if (this.minDate && this.maxDate) {
            if (this.maxDate.isBefore(this.minDate)) {
                this.maxDate = moment(this.minDate).add(1, 'days');
            }
        }

        if (this.date) {
            // check min date
            if (this.minDate && this.date.isBefore(this.minDate)) {
                this.date = moment(this.minDate);
            }

            // check max date
            if (this.maxDate && this.date.isAfter(this.maxDate)) {
                this.date = moment(this.maxDate);
            }
        }

        this.yearItems = {
            currentIndex_: 0,
            PAGE_SIZE: 5,
            START: self.minDate ? self.minDate.year() : 1900,
            END: self.maxDate ? self.maxDate.year() : 0,
            getItemAtIndex: function getItemAtIndex(index) {
                if (this.currentIndex_ < index) this.currentIndex_ = index;

                return this.START + index;
            },
            getLength: function getLength() {
                return Math.min(this.currentIndex_ + Math.floor(this.PAGE_SIZE / 2), Math.abs(this.START - this.END) + 1);
            }
        };

        $scope.$mdMedia = $mdMedia;
        $scope.year = this.date.year();

        this.selectYear = function (year) {
            self.date.year(year);
            $scope.year = year;
            self.selectingYear = false;
            self.animate();
        };

        this.showYear = function () {
            self.yearTopIndex = self.date.year() - self.yearItems.START + Math.floor(self.yearItems.PAGE_SIZE / 2);
            self.yearItems.currentIndex_ = self.date.year() - self.yearItems.START + 1;
            self.selectingYear = true;
        };

        this.showCalendar = function () {
            self.selectingYear = false;
        };

        this.cancel = function () {
            $mdDialog.cancel();
        };

        this.confirm = function () {
            var date = this.date;

            if (this.minDate && this.date.isBefore(this.minDate)) {
                date = moment(this.minDate);
            }

            if (this.maxDate && this.date.isAfter(this.maxDate)) {
                date = moment(this.maxDate);
            }

            $mdDialog.hide(date.toDate());
        };

        this.animate = function () {
            self.animating = true;
            $timeout(angular.noop).then(function () {
                self.animating = false;
            });
        };
    }

    module.provider("$mdpDatePicker", function () {
        var LABEL_OK = "OK",
            LABEL_CANCEL = "Cancel",
            DISPLAY_FORMAT = "ddd, MMM DD";

        this.setDisplayFormat = function (format) {
            DISPLAY_FORMAT = format;
        };

        this.setOKButtonLabel = function (label) {
            LABEL_OK = label;
        };

        this.setCancelButtonLabel = function (label) {
            LABEL_CANCEL = label;
        };

        this.$get = ["$mdDialog", function ($mdDialog) {
            var datePicker = function datePicker(currentDate, options) {
                if (!angular.isDate(currentDate)) currentDate = Date.now();
                if (!angular.isObject(options)) options = {};

                options.displayFormat = DISPLAY_FORMAT;

                return $mdDialog.show({
                    controller: ['$scope', '$mdDialog', '$mdMedia', '$timeout', 'currentDate', 'options', DatePickerCtrl],
                    controllerAs: 'datepicker',
                    clickOutsideToClose: true,
                    template: '<md-dialog aria-label="" class="mdp-datepicker" ng-class="{ \'portrait\': !$mdMedia(\'gt-xs\') }">' + '<md-dialog-content layout="row" layout-wrap>' + '<div layout="column" layout-align="start center">' + '<md-toolbar layout-align="start start" flex class="mdp-datepicker-date-wrapper md-hue-1 md-primary" layout="column">' + '<span class="mdp-datepicker-year" ng-click="datepicker.showYear()" ng-class="{ \'active\': datepicker.selectingYear }">{{ datepicker.date.format(\'YYYY\') }}</span>' + '<span class="mdp-datepicker-date" ng-click="datepicker.showCalendar()" ng-class="{ \'active\': !datepicker.selectingYear }">{{ datepicker.date.format(datepicker.displayFormat) }}</span> ' + '</md-toolbar>' + '</div>' + '<div>' + '<div class="mdp-datepicker-select-year mdp-animation-zoom" layout="column" layout-align="center start" ng-if="datepicker.selectingYear">' + '<md-virtual-repeat-container md-auto-shrink md-top-index="datepicker.yearTopIndex">' + '<div flex md-virtual-repeat="item in datepicker.yearItems" md-on-demand class="repeated-year">' + '<span class="md-button" ng-click="datepicker.selectYear(item)" md-ink-ripple ng-class="{ \'md-primary current\': item == year }">{{ item }}</span>' + '</div>' + '</md-virtual-repeat-container>' + '</div>' + '<mdp-calendar ng-if="!datepicker.selectingYear" class="mdp-animation-zoom" date="datepicker.date" min-date="datepicker.minDate" date-filter="datepicker.dateFilter" max-date="datepicker.maxDate"></mdp-calendar>' + '<md-dialog-actions layout="row">' + '<span flex></span>' + '<md-button ng-click="datepicker.cancel()" aria-label="' + LABEL_CANCEL + '">' + LABEL_CANCEL + '</md-button>' + '<md-button ng-click="datepicker.confirm()" class="md-primary" aria-label="' + LABEL_OK + '">' + LABEL_OK + '</md-button>' + '</md-dialog-actions>' + '</div>' + '</md-dialog-content>' + '</md-dialog>',
                    targetEvent: options.targetEvent,
                    locals: {
                        currentDate: currentDate,
                        options: options
                    },
                    skipHide: true
                });
            };

            return datePicker;
        }];
    });

    function CalendarCtrl($scope) {
        var self = this;
        this.dow = moment.localeData().firstDayOfWeek();

        this.weekDays = [].concat(moment.weekdaysMin().slice(this.dow), moment.weekdaysMin().slice(0, this.dow));

        this.daysInMonth = [];

        this.getDaysInMonth = function () {
            var days = self.date.daysInMonth(),
                firstDay = moment(self.date).date(1).day() - this.dow;

            if (firstDay < 0) firstDay = this.weekDays.length - 1;

            var arr = [];
            for (var i = 1; i <= firstDay + days; i++) {
                var day = null;
                if (i > firstDay) {
                    day = {
                        value: i - firstDay,
                        enabled: self.isDayEnabled(moment(self.date).date(i - firstDay).toDate())
                    };
                }
                arr.push(day);
            }

            return arr;
        };

        this.isDayEnabled = function (day) {
            return (!this.minDate || this.minDate <= day) && (!this.maxDate || this.maxDate >= day) && (!self.dateFilter || !self.dateFilter(day));
        };

        this.selectDate = function (dom) {
            self.date.date(dom);
        };

        this.nextMonth = function () {
            self.date.add(1, 'months');
        };

        this.prevMonth = function () {
            self.date.subtract(1, 'months');
        };

        this.updateDaysInMonth = function () {
            self.daysInMonth = self.getDaysInMonth();
        };

        $scope.$watch(function () {
            return self.date.unix();
        }, function (newValue, oldValue) {
            if (newValue && newValue !== oldValue) self.updateDaysInMonth();
        });

        self.updateDaysInMonth();
    }

    module.directive("mdpCalendar", ["$animate", function ($animate) {
        return {
            restrict: 'E',
            bindToController: {
                "date": "=",
                "minDate": "=",
                "maxDate": "=",
                "dateFilter": "="
            },
            template: '<div class="mdp-calendar">' + '<div layout="row" layout-align="space-between center">' + '<md-button aria-label="previous month" class="md-icon-button" ng-click="calendar.prevMonth()"><md-icon md-svg-icon="mdp-chevron-left"></md-icon></md-button>' + '<div class="mdp-calendar-monthyear" ng-show="!calendar.animating">{{ calendar.date.format("MMMM YYYY") }}</div>' + '<md-button aria-label="next month" class="md-icon-button" ng-click="calendar.nextMonth()"><md-icon md-svg-icon="mdp-chevron-right"></md-icon></md-button>' + '</div>' + '<div layout="row" layout-align="space-around center" class="mdp-calendar-week-days" ng-show="!calendar.animating">' + '<div layout layout-align="center center" ng-repeat="d in calendar.weekDays track by $index">{{ d }}</div>' + '</div>' + '<div layout="row" layout-align="start center" layout-wrap class="mdp-calendar-days" ng-class="{ \'mdp-animate-next\': calendar.animating }" ng-show="!calendar.animating" md-swipe-left="calendar.nextMonth()" md-swipe-right="calendar.prevMonth()">' + '<div layout layout-align="center center" ng-repeat-start="day in calendar.daysInMonth track by $index" ng-class="{ \'mdp-day-placeholder\': !day }">' + '<md-button class="md-icon-button md-raised" aria-label="Select day" ng-if="day" ng-class="{ \'md-accent\': calendar.date.date() == day.value }" ng-click="calendar.selectDate(day.value)" ng-disabled="!day.enabled">{{ day.value }}</md-button>' + '</div>' + '<div flex="100" ng-if="($index + 1) % 7 == 0" ng-repeat-end></div>' + '</div>' + '</div>',
            controller: ["$scope", CalendarCtrl],
            controllerAs: "calendar",
            link: function link(scope, element, attrs, ctrl) {
                var animElements = [element[0].querySelector(".mdp-calendar-week-days"), element[0].querySelector('.mdp-calendar-days'), element[0].querySelector('.mdp-calendar-monthyear')].map(function (a) {
                    return angular.element(a);
                });

                scope.$watch(function () {
                    return ctrl.date.format("YYYYMM");
                }, function (newValue, oldValue) {
                    var direction = null;

                    if (newValue > oldValue) direction = "mdp-animate-next";else if (newValue < oldValue) direction = "mdp-animate-prev";

                    if (direction) {
                        for (var i in animElements) {
                            animElements[i].addClass(direction);
                            $animate.removeClass(animElements[i], direction);
                        }
                    }
                });
            }
        };
    }]);

    function formatValidator(value, format) {
        return !value || angular.isDate(value) || moment(value, format, true).isValid();
    }

    function minDateValidator(value, format, minDate) {
        var minDate = moment(minDate, "YYYY-MM-DD", true);
        var date = angular.isDate(value) ? moment(value) : moment(value, format, true);

        return !value || angular.isDate(value) || !minDate.isValid() || date.isSameOrAfter(minDate);
    }

    function maxDateValidator(value, format, maxDate) {
        var maxDate = moment(maxDate, "YYYY-MM-DD", true);
        var date = angular.isDate(value) ? moment(value) : moment(value, format, true);

        return !value || angular.isDate(value) || !maxDate.isValid() || date.isSameOrBefore(maxDate);
    }

    function filterValidator(value, format, filter) {
        var date = angular.isDate(value) ? moment(value) : moment(value, format, true);

        return !value || angular.isDate(value) || !angular.isFunction(filter) || !filter(date);
    }

    function requiredValidator(value, ngModel) {
        return value;
    }

    module.directive("mdpDatePicker", ["$mdpDatePicker", "$timeout", function ($mdpDatePicker, $timeout) {
        return {
            restrict: 'E',
            require: 'ngModel',
            transclude: true,
            template: function template(element, attrs) {
                var noFloat = angular.isDefined(attrs.mdpNoFloat),
                    placeholder = angular.isDefined(attrs.mdpPlaceholder) ? attrs.mdpPlaceholder : "",
                    openOnClick = angular.isDefined(attrs.mdpOpenOnClick) ? true : false;

                return '<div layout layout-align="start start">' + '<md-button' + (angular.isDefined(attrs.mdpDisabled) ? ' ng-disabled="disabled"' : '') + ' class="md-icon-button" ng-click="showPicker($event)">' + '<md-icon md-svg-icon="mdp-event"></md-icon>' + '</md-button>' + '<md-input-container' + (noFloat ? ' md-no-float' : '') + ' md-is-error="isError()">' + '<input type="{{ ::type }}"' + (angular.isDefined(attrs.mdpDisabled) ? ' ng-disabled="disabled"' : '') + ' aria-label="' + placeholder + '" placeholder="' + placeholder + '"' + (openOnClick ? ' ng-click="showPicker($event)" ' : '') + ' />' + '</md-input-container>' + '</div>';
            },
            scope: {
                "minDate": "=mdpMinDate",
                "maxDate": "=mdpMaxDate",
                "dateFilter": "=mdpDateFilter",
                "dateFormat": "@mdpFormat",
                "placeholder": "@mdpPlaceholder",
                "noFloat": "=mdpNoFloat",
                "openOnClick": "=mdpOpenOnClick",
                "disabled": "=?mdpDisabled"
            },
            link: {
                pre: function pre(scope, element, attrs, ngModel, $transclude) {},
                post: function post(scope, element, attrs, ngModel, $transclude) {
                    var inputElement = angular.element(element[0].querySelector('input')),
                        inputContainer = angular.element(element[0].querySelector('md-input-container')),
                        inputContainerCtrl = inputContainer.controller("mdInputContainer");

                    $transclude(function (clone) {
                        inputContainer.append(clone);
                    });

                    var messages = angular.element(inputContainer[0].querySelector("[ng-messages]"));

                    scope.type = scope.dateFormat ? "text" : "date";
                    scope.dateFormat = scope.dateFormat || "YYYY-MM-DD";
                    scope.model = ngModel;

                    scope.isError = function () {
                        return !ngModel.$pristine && !!ngModel.$invalid;
                    };

                    // update input element if model has changed
                    ngModel.$formatters.unshift(function (value) {
                        var date = angular.isDate(value) && moment(value);
                        if (date && date.isValid()) updateInputElement(date.format(scope.dateFormat));else updateInputElement(null);
                    });

                    ngModel.$validators.format = function (modelValue, viewValue) {
                        return formatValidator(viewValue, scope.dateFormat);
                    };

                    ngModel.$validators.minDate = function (modelValue, viewValue) {
                        return minDateValidator(viewValue, scope.dateFormat, scope.minDate);
                    };

                    ngModel.$validators.maxDate = function (modelValue, viewValue) {
                        return maxDateValidator(viewValue, scope.dateFormat, scope.maxDate);
                    };

                    ngModel.$validators.filter = function (modelValue, viewValue) {
                        return filterValidator(viewValue, scope.dateFormat, scope.dateFilter);
                    };

                    ngModel.$validators.required = function (modelValue, viewValue) {
                        return angular.isUndefined(attrs.required) || !ngModel.$isEmpty(modelValue) || !ngModel.$isEmpty(viewValue);
                    };

                    ngModel.$parsers.unshift(function (value) {
                        var parsed = moment(value, scope.dateFormat, true);
                        if (parsed.isValid()) {
                            if (angular.isDate(ngModel.$modelValue)) {
                                var originalModel = moment(ngModel.$modelValue);
                                originalModel.year(parsed.year());
                                originalModel.month(parsed.month());
                                originalModel.date(parsed.date());

                                parsed = originalModel;
                            }
                            return parsed.toDate();
                        } else return null;
                    });

                    // update input element value
                    function updateInputElement(value) {
                        inputElement[0].value = value;
                        inputContainerCtrl.setHasValue(!ngModel.$isEmpty(value));
                    }

                    function updateDate(date) {
                        var value = moment(date, angular.isDate(date) ? null : scope.dateFormat, true),
                            strValue = value.format(scope.dateFormat);

                        if (value.isValid()) {
                            updateInputElement(strValue);
                            ngModel.$setViewValue(strValue);
                        } else {
                            updateInputElement(date);
                            ngModel.$setViewValue(date);
                        }

                        if (!ngModel.$pristine && messages.hasClass("md-auto-hide") && inputContainer.hasClass("md-input-invalid")) messages.removeClass("md-auto-hide");

                        ngModel.$render();
                    }

                    scope.showPicker = function (ev) {
                        $mdpDatePicker(ngModel.$modelValue, {
                            minDate: scope.minDate,
                            maxDate: scope.maxDate,
                            dateFilter: scope.dateFilter,
                            targetEvent: ev
                        }).then(updateDate);
                    };

                    function onInputElementEvents(event) {
                        if (event.target.value !== ngModel.$viewVaue) updateDate(event.target.value);
                    }

                    inputElement.on("reset input blur", onInputElementEvents);

                    scope.$on("$destroy", function () {
                        inputElement.off("reset input blur", onInputElementEvents);
                    });
                }
            }
        };
    }]);

    module.directive("mdpDatePicker", ["$mdpDatePicker", "$timeout", function ($mdpDatePicker, $timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                "minDate": "@min",
                "maxDate": "@max",
                "dateFilter": "=mdpDateFilter",
                "dateFormat": "@mdpFormat"
            },
            link: function link(scope, element, attrs, ngModel, $transclude) {
                scope.dateFormat = scope.dateFormat || "YYYY-MM-DD";

                ngModel.$validators.format = function (modelValue, viewValue) {
                    return formatValidator(viewValue, scope.format);
                };

                ngModel.$validators.minDate = function (modelValue, viewValue) {
                    return minDateValidator(viewValue, scope.format, scope.minDate);
                };

                ngModel.$validators.maxDate = function (modelValue, viewValue) {
                    return maxDateValidator(viewValue, scope.format, scope.maxDate);
                };

                ngModel.$validators.filter = function (modelValue, viewValue) {
                    return filterValidator(viewValue, scope.format, scope.dateFilter);
                };

                function showPicker(ev) {
                    $mdpDatePicker(ngModel.$modelValue, {
                        minDate: scope.minDate,
                        maxDate: scope.maxDate,
                        dateFilter: scope.dateFilter,
                        targetEvent: ev
                    }).then(function (time) {
                        ngModel.$setViewValue(moment(time).format(scope.format));
                        ngModel.$render();
                    });
                };

                element.on("click", showPicker);

                scope.$on("$destroy", function () {
                    element.off("click", showPicker);
                });
            }
        };
    }]);
    /* global moment, angular */

    function TimePickerCtrl($scope, $mdDialog, time, autoSwitch, $mdMedia) {
        var self = this;
        this.VIEW_HOURS = 1;
        this.VIEW_MINUTES = 2;
        this.currentView = this.VIEW_HOURS;
        this.time = moment(time);
        this.autoSwitch = !!autoSwitch;

        this.clockHours = parseInt(this.time.format("h"));
        this.clockMinutes = parseInt(this.time.minutes());

        $scope.$mdMedia = $mdMedia;

        this.switchView = function () {
            self.currentView = self.currentView == self.VIEW_HOURS ? self.VIEW_MINUTES : self.VIEW_HOURS;
        };

        this.setAM = function () {
            if (self.time.hours() >= 12) self.time.hour(self.time.hour() - 12);
        };

        this.setPM = function () {
            if (self.time.hours() < 12) self.time.hour(self.time.hour() + 12);
        };

        this.cancel = function () {
            $mdDialog.cancel();
        };

        this.confirm = function () {
            $mdDialog.hide(this.time.toDate());
        };
    }

    function ClockCtrl($scope) {
        var TYPE_HOURS = "hours";
        var TYPE_MINUTES = "minutes";
        var self = this;

        this.STEP_DEG = 360 / 12;
        this.steps = [];

        this.CLOCK_TYPES = {
            "hours": {
                range: 12
            },
            "minutes": {
                range: 60
            }
        };

        this.getPointerStyle = function () {
            var divider = 1;
            switch (self.type) {
                case TYPE_HOURS:
                    divider = 12;
                    break;
                case TYPE_MINUTES:
                    divider = 60;
                    break;
            }
            var degrees = Math.round(self.selected * (360 / divider)) - 180;
            return {
                "-webkit-transform": "rotate(" + degrees + "deg)",
                "-ms-transform": "rotate(" + degrees + "deg)",
                "transform": "rotate(" + degrees + "deg)"
            };
        };

        this.setTimeByDeg = function (deg) {
            deg = deg >= 360 ? 0 : deg;
            var divider = 0;
            switch (self.type) {
                case TYPE_HOURS:
                    divider = 12;
                    break;
                case TYPE_MINUTES:
                    divider = 60;
                    break;
            }

            self.setTime(Math.round(divider / 360 * deg));
        };

        this.setTime = function (time, type) {
            this.selected = time;

            switch (self.type) {
                case TYPE_HOURS:
                    if (self.time.format("A") == "PM") time += 12;
                    this.time.hours(time);
                    break;
                case TYPE_MINUTES:
                    if (time > 59) time -= 60;
                    this.time.minutes(time);
                    break;
            }
        };

        this.init = function () {
            self.type = self.type || "hours";
            switch (self.type) {
                case TYPE_HOURS:
                    for (var i = 1; i <= 12; i++) {
                        self.steps.push(i);
                    }self.selected = self.time.hours() || 0;
                    if (self.selected > 12) self.selected -= 12;

                    break;
                case TYPE_MINUTES:
                    for (var i = 5; i <= 55; i += 5) {
                        self.steps.push(i);
                    }self.steps.push(0);
                    self.selected = self.time.minutes() || 0;

                    break;
            }
        };

        this.init();
    }

    module.directive("mdpClock", ["$animate", "$timeout", function ($animate, $timeout) {
        return {
            restrict: 'E',
            bindToController: {
                'type': '@?',
                'time': '=',
                'autoSwitch': '=?'
            },
            replace: true,
            template: '<div class="mdp-clock">' + '<div class="mdp-clock-container">' + '<md-toolbar class="mdp-clock-center md-primary"></md-toolbar>' + '<md-toolbar ng-style="clock.getPointerStyle()" class="mdp-pointer md-primary">' + '<span class="mdp-clock-selected md-button md-raised md-primary"></span>' + '</md-toolbar>' + '<md-button ng-class="{ \'md-primary\': clock.selected == step }" class="md-icon-button md-raised mdp-clock-deg{{ ::(clock.STEP_DEG * ($index + 1)) }}" ng-repeat="step in clock.steps" ng-click="clock.setTime(step)">{{ step }}</md-button>' + '</div>' + '</div>',
            controller: ["$scope", ClockCtrl],
            controllerAs: "clock",
            link: function link(scope, element, attrs, ctrl) {
                var pointer = angular.element(element[0].querySelector(".mdp-pointer")),
                    timepickerCtrl = scope.$parent.timepicker;

                var onEvent = function onEvent(event) {
                    var containerCoords = event.currentTarget.getClientRects()[0];
                    var x = event.currentTarget.offsetWidth / 2 - (event.pageX - containerCoords.left),
                        y = event.pageY - containerCoords.top - event.currentTarget.offsetHeight / 2;

                    var deg = Math.round(Math.atan2(x, y) * (180 / Math.PI));
                    $timeout(function () {
                        ctrl.setTimeByDeg(deg + 180);
                        if (ctrl.autoSwitch && ["mouseup", "click"].indexOf(event.type) !== -1 && timepickerCtrl) timepickerCtrl.switchView();
                    });
                };

                element.on("mousedown", function () {
                    element.on("mousemove", onEvent);
                });

                element.on("mouseup", function (e) {
                    element.off("mousemove");
                });

                element.on("click", onEvent);
                scope.$on("$destroy", function () {
                    element.off("click", onEvent);
                    element.off("mousemove", onEvent);
                });
            }
        };
    }]);

    module.provider("$mdpTimePicker", function () {
        var LABEL_OK = "OK",
            LABEL_CANCEL = "Cancel";

        this.setOKButtonLabel = function (label) {
            LABEL_OK = label;
        };

        this.setCancelButtonLabel = function (label) {
            LABEL_CANCEL = label;
        };

        this.$get = ["$mdDialog", function ($mdDialog) {
            var timePicker = function timePicker(time, options) {
                if (!angular.isDate(time)) time = Date.now();
                if (!angular.isObject(options)) options = {};

                return $mdDialog.show({
                    controller: ['$scope', '$mdDialog', 'time', 'autoSwitch', '$mdMedia', TimePickerCtrl],
                    controllerAs: 'timepicker',
                    clickOutsideToClose: true,
                    template: '<md-dialog aria-label="" class="mdp-timepicker" ng-class="{ \'portrait\': !$mdMedia(\'gt-xs\') }">' + '<md-dialog-content layout-gt-xs="row" layout-wrap>' + '<md-toolbar layout-gt-xs="column" layout-xs="row" layout-align="center center" flex class="mdp-timepicker-time md-hue-1 md-primary">' + '<div class="mdp-timepicker-selected-time">' + '<span ng-class="{ \'active\': timepicker.currentView == timepicker.VIEW_HOURS }" ng-click="timepicker.currentView = timepicker.VIEW_HOURS">{{ timepicker.time.format("h") }}</span>:' + '<span ng-class="{ \'active\': timepicker.currentView == timepicker.VIEW_MINUTES }" ng-click="timepicker.currentView = timepicker.VIEW_MINUTES">{{ timepicker.time.format("mm") }}</span>' + '</div>' + '<div layout="column" class="mdp-timepicker-selected-ampm">' + '<span ng-click="timepicker.setAM()" ng-class="{ \'active\': timepicker.time.hours() < 12 }">AM</span>' + '<span ng-click="timepicker.setPM()" ng-class="{ \'active\': timepicker.time.hours() >= 12 }">PM</span>' + '</div>' + '</md-toolbar>' + '<div>' + '<div class="mdp-clock-switch-container" ng-switch="timepicker.currentView" layout layout-align="center center">' + '<mdp-clock class="mdp-animation-zoom" auto-switch="timepicker.autoSwitch" time="timepicker.time" type="hours" ng-switch-when="1"></mdp-clock>' + '<mdp-clock class="mdp-animation-zoom" auto-switch="timepicker.autoSwitch" time="timepicker.time" type="minutes" ng-switch-when="2"></mdp-clock>' + '</div>' + '<md-dialog-actions layout="row">' + '<span flex></span>' + '<md-button ng-click="timepicker.cancel()" aria-label="' + LABEL_CANCEL + '">' + LABEL_CANCEL + '</md-button>' + '<md-button ng-click="timepicker.confirm()" class="md-primary" aria-label="' + LABEL_OK + '">' + LABEL_OK + '</md-button>' + '</md-dialog-actions>' + '</div>' + '</md-dialog-content>' + '</md-dialog>',
                    targetEvent: options.targetEvent,
                    locals: {
                        time: time,
                        autoSwitch: options.autoSwitch
                    },
                    skipHide: true
                });
            };

            return timePicker;
        }];
    });

    module.directive("mdpTimePicker", ["$mdpTimePicker", "$timeout", function ($mdpTimePicker, $timeout) {
        return {
            restrict: 'E',
            require: 'ngModel',
            transclude: true,
            template: function template(element, attrs) {
                var noFloat = angular.isDefined(attrs.mdpNoFloat),
                    placeholder = angular.isDefined(attrs.mdpPlaceholder) ? attrs.mdpPlaceholder : "",
                    openOnClick = angular.isDefined(attrs.mdpOpenOnClick) ? true : false;

                return '<div layout layout-align="start start">' + '<md-button class="md-icon-button" ng-click="showPicker($event)"' + (angular.isDefined(attrs.mdpDisabled) ? ' ng-disabled="disabled"' : '') + '>' + '<md-icon md-svg-icon="mdp-access-time"></md-icon>' + '</md-button>' + '<md-input-container' + (noFloat ? ' md-no-float' : '') + ' md-is-error="isError()">' + '<input type="{{ ::type }}"' + (angular.isDefined(attrs.mdpDisabled) ? ' ng-disabled="disabled"' : '') + ' aria-label="' + placeholder + '" placeholder="' + placeholder + '"' + (openOnClick ? ' ng-click="showPicker($event)" ' : '') + ' />' + '</md-input-container>' + '</div>';
            },
            scope: {
                "timeFormat": "@mdpFormat",
                "placeholder": "@mdpPlaceholder",
                "autoSwitch": "=?mdpAutoSwitch",
                "disabled": "=?mdpDisabled"
            },
            link: function link(scope, element, attrs, ngModel, $transclude) {
                var inputElement = angular.element(element[0].querySelector('input')),
                    inputContainer = angular.element(element[0].querySelector('md-input-container')),
                    inputContainerCtrl = inputContainer.controller("mdInputContainer");

                $transclude(function (clone) {
                    inputContainer.append(clone);
                });

                var messages = angular.element(inputContainer[0].querySelector("[ng-messages]"));

                scope.type = scope.timeFormat ? "text" : "time";
                scope.timeFormat = scope.timeFormat || "HH:mm";
                scope.autoSwitch = scope.autoSwitch || false;

                scope.$watch(function () {
                    return ngModel.$error;
                }, function (newValue, oldValue) {
                    inputContainerCtrl.setInvalid(!ngModel.$pristine && !!Object.keys(ngModel.$error).length);
                }, true);

                // update input element if model has changed
                ngModel.$formatters.unshift(function (value) {
                    var time = angular.isDate(value) && moment(value);
                    if (time && time.isValid()) updateInputElement(time.format(scope.timeFormat));else updateInputElement(null);
                });

                ngModel.$validators.format = function (modelValue, viewValue) {
                    return !viewValue || angular.isDate(viewValue) || moment(viewValue, scope.timeFormat, true).isValid();
                };

                ngModel.$validators.required = function (modelValue, viewValue) {
                    return angular.isUndefined(attrs.required) || !ngModel.$isEmpty(modelValue) || !ngModel.$isEmpty(viewValue);
                };

                ngModel.$parsers.unshift(function (value) {
                    var parsed = moment(value, scope.timeFormat, true);
                    if (parsed.isValid()) {
                        if (angular.isDate(ngModel.$modelValue)) {
                            var originalModel = moment(ngModel.$modelValue);
                            originalModel.minutes(parsed.minutes());
                            originalModel.hours(parsed.hours());
                            originalModel.seconds(parsed.seconds());

                            parsed = originalModel;
                        }
                        return parsed.toDate();
                    } else return null;
                });

                // update input element value
                function updateInputElement(value) {
                    inputElement[0].value = value;
                    inputContainerCtrl.setHasValue(!ngModel.$isEmpty(value));
                }

                function updateTime(time) {
                    var value = moment(time, angular.isDate(time) ? null : scope.timeFormat, true),
                        strValue = value.format(scope.timeFormat);

                    if (value.isValid()) {
                        updateInputElement(strValue);
                        ngModel.$setViewValue(strValue);
                    } else {
                        updateInputElement(time);
                        ngModel.$setViewValue(time);
                    }

                    if (!ngModel.$pristine && messages.hasClass("md-auto-hide") && inputContainer.hasClass("md-input-invalid")) messages.removeClass("md-auto-hide");

                    ngModel.$render();
                }

                scope.showPicker = function (ev) {
                    $mdpTimePicker(ngModel.$modelValue, {
                        targetEvent: ev,
                        autoSwitch: scope.autoSwitch
                    }).then(function (time) {
                        updateTime(time, true);
                    });
                };

                function onInputElementEvents(event) {
                    if (event.target.value !== ngModel.$viewVaue) updateTime(event.target.value);
                }

                inputElement.on("reset input blur", onInputElementEvents);

                scope.$on("$destroy", function () {
                    inputElement.off("reset input blur", onInputElementEvents);
                });
            }
        };
    }]);

    module.directive("mdpTimePicker", ["$mdpTimePicker", "$timeout", function ($mdpTimePicker, $timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                "timeFormat": "@mdpFormat",
                "autoSwitch": "=?mdpAutoSwitch"
            },
            link: function link(scope, element, attrs, ngModel, $transclude) {
                scope.format = scope.format || "HH:mm";
                function showPicker(ev) {
                    $mdpTimePicker(ngModel.$modelValue, {
                        targetEvent: ev,
                        autoSwitch: scope.autoSwitch
                    }).then(function (time) {
                        ngModel.$setViewValue(moment(time).format(scope.format));
                        ngModel.$render();
                    });
                };

                element.on("click", showPicker);

                scope.$on("$destroy", function () {
                    element.off("click", showPicker);
                });
            }
        };
    }]);
})();
//# sourceMappingURL=mdPickers.js.map

"use strict";

!function () {
  "use strict";
  function t(t, e, a, i, n, r) {
    var o = this;this.date = moment(n), this.minDate = r.minDate && moment(r.minDate).isValid() ? moment(r.minDate) : null, this.maxDate = r.maxDate && moment(r.maxDate).isValid() ? moment(r.maxDate) : null, this.displayFormat = r.displayFormat || "ddd, MMM DD", this.dateFilter = angular.isFunction(r.dateFilter) ? r.dateFilter : null, this.selectingYear = !1, this.minDate && this.maxDate && this.maxDate.isBefore(this.minDate) && (this.maxDate = moment(this.minDate).add(1, "days")), this.date && (this.minDate && this.date.isBefore(this.minDate) && (this.date = moment(this.minDate)), this.maxDate && this.date.isAfter(this.maxDate) && (this.date = moment(this.maxDate))), this.yearItems = { currentIndex_: 0, PAGE_SIZE: 5, START: o.minDate ? o.minDate.year() : 1900, END: o.maxDate ? o.maxDate.year() : 0, getItemAtIndex: function getItemAtIndex(t) {
        return this.currentIndex_ < t && (this.currentIndex_ = t), this.START + t;
      }, getLength: function getLength() {
        return Math.min(this.currentIndex_ + Math.floor(this.PAGE_SIZE / 2), Math.abs(this.START - this.END) + 1);
      } }, t.$mdMedia = a, t.year = this.date.year(), this.selectYear = function (e) {
      o.date.year(e), t.year = e, o.selectingYear = !1, o.animate();
    }, this.showYear = function () {
      o.yearTopIndex = o.date.year() - o.yearItems.START + Math.floor(o.yearItems.PAGE_SIZE / 2), o.yearItems.currentIndex_ = o.date.year() - o.yearItems.START + 1, o.selectingYear = !0;
    }, this.showCalendar = function () {
      o.selectingYear = !1;
    }, this.cancel = function () {
      e.cancel();
    }, this.confirm = function () {
      var t = this.date;this.minDate && this.date.isBefore(this.minDate) && (t = moment(this.minDate)), this.maxDate && this.date.isAfter(this.maxDate) && (t = moment(this.maxDate)), e.hide(t.toDate());
    }, this.animate = function () {
      o.animating = !0, i(angular.noop).then(function () {
        o.animating = !1;
      });
    };
  }function e(t) {
    var e = this;this.dow = moment.localeData().firstDayOfWeek(), this.weekDays = [].concat(moment.weekdaysMin().slice(this.dow), moment.weekdaysMin().slice(0, this.dow)), this.daysInMonth = [], this.getDaysInMonth = function () {
      var t = e.date.daysInMonth(),
          a = moment(e.date).date(1).day() - this.dow;0 > a && (a = this.weekDays.length - 1);for (var i = [], n = 1; a + t >= n; n++) {
        var r = null;n > a && (r = { value: n - a, enabled: e.isDayEnabled(moment(e.date).date(n - a).toDate()) }), i.push(r);
      }return i;
    }, this.isDayEnabled = function (t) {
      return !(this.minDate && !(this.minDate <= t) || this.maxDate && !(this.maxDate >= t) || e.dateFilter && e.dateFilter(t));
    }, this.selectDate = function (t) {
      e.date.date(t);
    }, this.nextMonth = function () {
      e.date.add(1, "months");
    }, this.prevMonth = function () {
      e.date.subtract(1, "months");
    }, this.updateDaysInMonth = function () {
      e.daysInMonth = e.getDaysInMonth();
    }, t.$watch(function () {
      return e.date.unix();
    }, function (t, a) {
      t && t !== a && e.updateDaysInMonth();
    }), e.updateDaysInMonth();
  }function a(t, e) {
    return !t || angular.isDate(t) || moment(t, e, !0).isValid();
  }function i(t, e, a) {
    var a = moment(a, "YYYY-MM-DD", !0),
        i = angular.isDate(t) ? moment(t) : moment(t, e, !0);return !t || angular.isDate(t) || !a.isValid() || i.isSameOrAfter(a);
  }function n(t, e, a) {
    var a = moment(a, "YYYY-MM-DD", !0),
        i = angular.isDate(t) ? moment(t) : moment(t, e, !0);return !t || angular.isDate(t) || !a.isValid() || i.isSameOrBefore(a);
  }function r(t, e, a) {
    var i = angular.isDate(t) ? moment(t) : moment(t, e, !0);return !t || angular.isDate(t) || !angular.isFunction(a) || !a(i);
  }function o(t, e, a, i, n) {
    var r = this;this.VIEW_HOURS = 1, this.VIEW_MINUTES = 2, this.currentView = this.VIEW_HOURS, this.time = moment(a), this.autoSwitch = !!i, this.clockHours = parseInt(this.time.format("h")), this.clockMinutes = parseInt(this.time.minutes()), t.$mdMedia = n, this.switchView = function () {
      r.currentView = r.currentView == r.VIEW_HOURS ? r.VIEW_MINUTES : r.VIEW_HOURS;
    }, this.setAM = function () {
      r.time.hours() >= 12 && r.time.hour(r.time.hour() - 12);
    }, this.setPM = function () {
      r.time.hours() < 12 && r.time.hour(r.time.hour() + 12);
    }, this.cancel = function () {
      e.cancel();
    }, this.confirm = function () {
      e.hide(this.time.toDate());
    };
  }function s(t) {
    var e = "hours",
        a = "minutes",
        i = this;this.STEP_DEG = 30, this.steps = [], this.CLOCK_TYPES = { hours: { range: 12 }, minutes: { range: 60 } }, this.getPointerStyle = function () {
      var t = 1;switch (i.type) {case e:
          t = 12;break;case a:
          t = 60;}var n = Math.round(i.selected * (360 / t)) - 180;return { "-webkit-transform": "rotate(" + n + "deg)", "-ms-transform": "rotate(" + n + "deg)", transform: "rotate(" + n + "deg)" };
    }, this.setTimeByDeg = function (t) {
      t = t >= 360 ? 0 : t;var n = 0;switch (i.type) {case e:
          n = 12;break;case a:
          n = 60;}i.setTime(Math.round(n / 360 * t));
    }, this.setTime = function (t, n) {
      switch (this.selected = t, i.type) {case e:
          "PM" == i.time.format("A") && (t += 12), this.time.hours(t);break;case a:
          t > 59 && (t -= 60), this.time.minutes(t);}
    }, this.init = function () {
      switch (i.type = i.type || "hours", i.type) {case e:
          for (var t = 1; 12 >= t; t++) {
            i.steps.push(t);
          }i.selected = i.time.hours() || 0, i.selected > 12 && (i.selected -= 12);break;case a:
          for (var t = 5; 55 >= t; t += 5) {
            i.steps.push(t);
          }i.steps.push(0), i.selected = i.time.minutes() || 0;}
    }, this.init();
  }var d = angular.module("mdPickers", ["ngMaterial", "ngAnimate", "ngAria"]);d.config(["$mdIconProvider", "mdpIconsRegistry", function (t, e) {
    angular.forEach(e, function (e, a) {
      t.icon(e.id, e.url);
    });
  }]), d.run(["$templateCache", "mdpIconsRegistry", function (t, e) {
    angular.forEach(e, function (e, a) {
      t.put(e.url, e.svg);
    });
  }]), d.constant("mdpIconsRegistry", [{ id: "mdp-chevron-left", url: "mdp-chevron-left.svg", svg: '<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>' }, { id: "mdp-chevron-right", url: "mdp-chevron-right.svg", svg: '<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/><path d="M0 0h24v24H0z" fill="none"/></svg>' }, { id: "mdp-access-time", url: "mdp-access-time.svg", svg: '<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/><path d="M0 0h24v24H0z" fill="none"/><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>' }, { id: "mdp-event", url: "mdp-event.svg", svg: '<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/><path d="M0 0h24v24H0z" fill="none"/></svg>' }]), d.directive("ngMessage", ["$mdUtil", function (t) {
    return { restrict: "EA", priority: 101, compile: function compile(e) {
        var a = t.getClosest(e, "mdp-time-picker", !0) || t.getClosest(e, "mdp-date-picker", !0);if (a) return e.toggleClass("md-input-message-animation", !0), {};
      } };
  }]), d.provider("$mdpDatePicker", function () {
    var e = "OK",
        a = "Cancel",
        i = "ddd, MMM DD";this.setDisplayFormat = function (t) {
      i = t;
    }, this.setOKButtonLabel = function (t) {
      e = t;
    }, this.setCancelButtonLabel = function (t) {
      a = t;
    }, this.$get = ["$mdDialog", function (n) {
      var r = function r(_r, o) {
        return angular.isDate(_r) || (_r = Date.now()), angular.isObject(o) || (o = {}), o.displayFormat = i, n.show({ controller: ["$scope", "$mdDialog", "$mdMedia", "$timeout", "currentDate", "options", t], controllerAs: "datepicker", clickOutsideToClose: !0, template: '<md-dialog aria-label="" class="mdp-datepicker" ng-class="{ \'portrait\': !$mdMedia(\'gt-xs\') }"><md-dialog-content layout="row" layout-wrap><div layout="column" layout-align="start center"><md-toolbar layout-align="start start" flex class="mdp-datepicker-date-wrapper md-hue-1 md-primary" layout="column"><span class="mdp-datepicker-year" ng-click="datepicker.showYear()" ng-class="{ \'active\': datepicker.selectingYear }">{{ datepicker.date.format(\'YYYY\') }}</span><span class="mdp-datepicker-date" ng-click="datepicker.showCalendar()" ng-class="{ \'active\': !datepicker.selectingYear }">{{ datepicker.date.format(datepicker.displayFormat) }}</span> </md-toolbar></div><div><div class="mdp-datepicker-select-year mdp-animation-zoom" layout="column" layout-align="center start" ng-if="datepicker.selectingYear"><md-virtual-repeat-container md-auto-shrink md-top-index="datepicker.yearTopIndex"><div flex md-virtual-repeat="item in datepicker.yearItems" md-on-demand class="repeated-year"><span class="md-button" ng-click="datepicker.selectYear(item)" md-ink-ripple ng-class="{ \'md-primary current\': item == year }">{{ item }}</span></div></md-virtual-repeat-container></div><mdp-calendar ng-if="!datepicker.selectingYear" class="mdp-animation-zoom" date="datepicker.date" min-date="datepicker.minDate" date-filter="datepicker.dateFilter" max-date="datepicker.maxDate"></mdp-calendar><md-dialog-actions layout="row"><span flex></span><md-button ng-click="datepicker.cancel()" aria-label="' + a + '">' + a + '</md-button><md-button ng-click="datepicker.confirm()" class="md-primary" aria-label="' + e + '">' + e + "</md-button></md-dialog-actions></div></md-dialog-content></md-dialog>", targetEvent: o.targetEvent, locals: { currentDate: _r, options: o }, skipHide: !0 });
      };return r;
    }];
  }), d.directive("mdpCalendar", ["$animate", function (t) {
    return { restrict: "E", bindToController: { date: "=", minDate: "=", maxDate: "=", dateFilter: "=" }, template: '<div class="mdp-calendar"><div layout="row" layout-align="space-between center"><md-button aria-label="previous month" class="md-icon-button" ng-click="calendar.prevMonth()"><md-icon md-svg-icon="mdp-chevron-left"></md-icon></md-button><div class="mdp-calendar-monthyear" ng-show="!calendar.animating">{{ calendar.date.format("MMMM YYYY") }}</div><md-button aria-label="next month" class="md-icon-button" ng-click="calendar.nextMonth()"><md-icon md-svg-icon="mdp-chevron-right"></md-icon></md-button></div><div layout="row" layout-align="space-around center" class="mdp-calendar-week-days" ng-show="!calendar.animating"><div layout layout-align="center center" ng-repeat="d in calendar.weekDays track by $index">{{ d }}</div></div><div layout="row" layout-align="start center" layout-wrap class="mdp-calendar-days" ng-class="{ \'mdp-animate-next\': calendar.animating }" ng-show="!calendar.animating" md-swipe-left="calendar.nextMonth()" md-swipe-right="calendar.prevMonth()"><div layout layout-align="center center" ng-repeat-start="day in calendar.daysInMonth track by $index" ng-class="{ \'mdp-day-placeholder\': !day }"><md-button class="md-icon-button md-raised" aria-label="Select day" ng-if="day" ng-class="{ \'md-accent\': calendar.date.date() == day.value }" ng-click="calendar.selectDate(day.value)" ng-disabled="!day.enabled">{{ day.value }}</md-button></div><div flex="100" ng-if="($index + 1) % 7 == 0" ng-repeat-end></div></div></div>', controller: ["$scope", e], controllerAs: "calendar", link: function link(e, a, i, n) {
        var r = [a[0].querySelector(".mdp-calendar-week-days"), a[0].querySelector(".mdp-calendar-days"), a[0].querySelector(".mdp-calendar-monthyear")].map(function (t) {
          return angular.element(t);
        });e.$watch(function () {
          return n.date.format("YYYYMM");
        }, function (e, a) {
          var i = null;if (e > a ? i = "mdp-animate-next" : a > e && (i = "mdp-animate-prev"), i) for (var n in r) {
            r[n].addClass(i), t.removeClass(r[n], i);
          }
        });
      } };
  }]), d.directive("mdpDatePicker", ["$mdpDatePicker", "$timeout", function (t, e) {
    return { restrict: "E", require: "ngModel", transclude: !0, template: function template(t, e) {
        var a = angular.isDefined(e.mdpNoFloat),
            i = angular.isDefined(e.mdpPlaceholder) ? e.mdpPlaceholder : "",
            n = angular.isDefined(e.mdpOpenOnClick) ? !0 : !1;return '<div layout layout-align="start start"><md-button' + (angular.isDefined(e.mdpDisabled) ? ' ng-disabled="disabled"' : "") + ' class="md-icon-button" ng-click="showPicker($event)"><md-icon md-svg-icon="mdp-event"></md-icon></md-button><md-input-container' + (a ? " md-no-float" : "") + ' md-is-error="isError()"><input type="{{ ::type }}"' + (angular.isDefined(e.mdpDisabled) ? ' ng-disabled="disabled"' : "") + ' aria-label="' + i + '" placeholder="' + i + '"' + (n ? ' ng-click="showPicker($event)" ' : "") + " /></md-input-container></div>";
      }, scope: { minDate: "=mdpMinDate", maxDate: "=mdpMaxDate", dateFilter: "=mdpDateFilter", dateFormat: "@mdpFormat", placeholder: "@mdpPlaceholder", noFloat: "=mdpNoFloat", openOnClick: "=mdpOpenOnClick", disabled: "=?mdpDisabled" }, link: { pre: function pre(t, e, a, i, n) {}, post: function post(e, o, s, d, m) {
          function c(t) {
            p[0].value = t, g.setHasValue(!d.$isEmpty(t));
          }function l(t) {
            var a = moment(t, angular.isDate(t) ? null : e.dateFormat, !0),
                i = a.format(e.dateFormat);a.isValid() ? (c(i), d.$setViewValue(i)) : (c(t), d.$setViewValue(t)), !d.$pristine && f.hasClass("md-auto-hide") && h.hasClass("md-input-invalid") && f.removeClass("md-auto-hide"), d.$render();
          }function u(t) {
            t.target.value !== d.$viewVaue && l(t.target.value);
          }var p = angular.element(o[0].querySelector("input")),
              h = angular.element(o[0].querySelector("md-input-container")),
              g = h.controller("mdInputContainer");m(function (t) {
            h.append(t);
          });var f = angular.element(h[0].querySelector("[ng-messages]"));e.type = e.dateFormat ? "text" : "date", e.dateFormat = e.dateFormat || "YYYY-MM-DD", e.model = d, e.isError = function () {
            return !d.$pristine && !!d.$invalid;
          }, d.$formatters.unshift(function (t) {
            var a = angular.isDate(t) && moment(t);c(a && a.isValid() ? a.format(e.dateFormat) : null);
          }), d.$validators.format = function (t, i) {
            return a(i, e.dateFormat);
          }, d.$validators.minDate = function (t, a) {
            return i(a, e.dateFormat, e.minDate);
          }, d.$validators.maxDate = function (t, a) {
            return n(a, e.dateFormat, e.maxDate);
          }, d.$validators.filter = function (t, a) {
            return r(a, e.dateFormat, e.dateFilter);
          }, d.$validators.required = function (t, e) {
            return angular.isUndefined(s.required) || !d.$isEmpty(t) || !d.$isEmpty(e);
          }, d.$parsers.unshift(function (t) {
            var a = moment(t, e.dateFormat, !0);if (a.isValid()) {
              if (angular.isDate(d.$modelValue)) {
                var i = moment(d.$modelValue);i.year(a.year()), i.month(a.month()), i.date(a.date()), a = i;
              }return a.toDate();
            }return null;
          }), e.showPicker = function (a) {
            t(d.$modelValue, { minDate: e.minDate, maxDate: e.maxDate, dateFilter: e.dateFilter, targetEvent: a }).then(l);
          }, p.on("reset input blur", u), e.$on("$destroy", function () {
            p.off("reset input blur", u);
          });
        } } };
  }]), d.directive("mdpDatePicker", ["$mdpDatePicker", "$timeout", function (t, e) {
    return { restrict: "A", require: "ngModel", scope: { minDate: "@min", maxDate: "@max", dateFilter: "=mdpDateFilter", dateFormat: "@mdpFormat" }, link: function link(e, o, s, d, m) {
        function c(a) {
          t(d.$modelValue, { minDate: e.minDate, maxDate: e.maxDate, dateFilter: e.dateFilter, targetEvent: a }).then(function (t) {
            d.$setViewValue(moment(t).format(e.format)), d.$render();
          });
        }e.dateFormat = e.dateFormat || "YYYY-MM-DD", d.$validators.format = function (t, i) {
          return a(i, e.format);
        }, d.$validators.minDate = function (t, a) {
          return i(a, e.format, e.minDate);
        }, d.$validators.maxDate = function (t, a) {
          return n(a, e.format, e.maxDate);
        }, d.$validators.filter = function (t, a) {
          return r(a, e.format, e.dateFilter);
        }, o.on("click", c), e.$on("$destroy", function () {
          o.off("click", c);
        });
      } };
  }]), d.directive("mdpClock", ["$animate", "$timeout", function (t, e) {
    return { restrict: "E", bindToController: { type: "@?", time: "=", autoSwitch: "=?" }, replace: !0, template: '<div class="mdp-clock"><div class="mdp-clock-container"><md-toolbar class="mdp-clock-center md-primary"></md-toolbar><md-toolbar ng-style="clock.getPointerStyle()" class="mdp-pointer md-primary"><span class="mdp-clock-selected md-button md-raised md-primary"></span></md-toolbar><md-button ng-class="{ \'md-primary\': clock.selected == step }" class="md-icon-button md-raised mdp-clock-deg{{ ::(clock.STEP_DEG * ($index + 1)) }}" ng-repeat="step in clock.steps" ng-click="clock.setTime(step)">{{ step }}</md-button></div></div>', controller: ["$scope", s], controllerAs: "clock", link: function link(t, a, i, n) {
        var r = (angular.element(a[0].querySelector(".mdp-pointer")), t.$parent.timepicker),
            o = function o(t) {
          var a = t.currentTarget.getClientRects()[0],
              i = t.currentTarget.offsetWidth / 2 - (t.pageX - a.left),
              o = t.pageY - a.top - t.currentTarget.offsetHeight / 2,
              s = Math.round(Math.atan2(i, o) * (180 / Math.PI));e(function () {
            n.setTimeByDeg(s + 180), n.autoSwitch && -1 !== ["mouseup", "click"].indexOf(t.type) && r && r.switchView();
          });
        };a.on("mousedown", function () {
          a.on("mousemove", o);
        }), a.on("mouseup", function (t) {
          a.off("mousemove");
        }), a.on("click", o), t.$on("$destroy", function () {
          a.off("click", o), a.off("mousemove", o);
        });
      } };
  }]), d.provider("$mdpTimePicker", function () {
    var t = "OK",
        e = "Cancel";this.setOKButtonLabel = function (e) {
      t = e;
    }, this.setCancelButtonLabel = function (t) {
      e = t;
    }, this.$get = ["$mdDialog", function (a) {
      var i = function i(_i, n) {
        return angular.isDate(_i) || (_i = Date.now()), angular.isObject(n) || (n = {}), a.show({ controller: ["$scope", "$mdDialog", "time", "autoSwitch", "$mdMedia", o], controllerAs: "timepicker", clickOutsideToClose: !0, template: '<md-dialog aria-label="" class="mdp-timepicker" ng-class="{ \'portrait\': !$mdMedia(\'gt-xs\') }"><md-dialog-content layout-gt-xs="row" layout-wrap><md-toolbar layout-gt-xs="column" layout-xs="row" layout-align="center center" flex class="mdp-timepicker-time md-hue-1 md-primary"><div class="mdp-timepicker-selected-time"><span ng-class="{ \'active\': timepicker.currentView == timepicker.VIEW_HOURS }" ng-click="timepicker.currentView = timepicker.VIEW_HOURS">{{ timepicker.time.format("h") }}</span>:<span ng-class="{ \'active\': timepicker.currentView == timepicker.VIEW_MINUTES }" ng-click="timepicker.currentView = timepicker.VIEW_MINUTES">{{ timepicker.time.format("mm") }}</span></div><div layout="column" class="mdp-timepicker-selected-ampm"><span ng-click="timepicker.setAM()" ng-class="{ \'active\': timepicker.time.hours() < 12 }">AM</span><span ng-click="timepicker.setPM()" ng-class="{ \'active\': timepicker.time.hours() >= 12 }">PM</span></div></md-toolbar><div><div class="mdp-clock-switch-container" ng-switch="timepicker.currentView" layout layout-align="center center"><mdp-clock class="mdp-animation-zoom" auto-switch="timepicker.autoSwitch" time="timepicker.time" type="hours" ng-switch-when="1"></mdp-clock><mdp-clock class="mdp-animation-zoom" auto-switch="timepicker.autoSwitch" time="timepicker.time" type="minutes" ng-switch-when="2"></mdp-clock></div><md-dialog-actions layout="row"><span flex></span><md-button ng-click="timepicker.cancel()" aria-label="' + e + '">' + e + '</md-button><md-button ng-click="timepicker.confirm()" class="md-primary" aria-label="' + t + '">' + t + "</md-button></md-dialog-actions></div></md-dialog-content></md-dialog>", targetEvent: n.targetEvent, locals: { time: _i, autoSwitch: n.autoSwitch }, skipHide: !0 });
      };return i;
    }];
  }), d.directive("mdpTimePicker", ["$mdpTimePicker", "$timeout", function (t, e) {
    return { restrict: "E", require: "ngModel", transclude: !0, template: function template(t, e) {
        var a = angular.isDefined(e.mdpNoFloat),
            i = angular.isDefined(e.mdpPlaceholder) ? e.mdpPlaceholder : "",
            n = angular.isDefined(e.mdpOpenOnClick) ? !0 : !1;return '<div layout layout-align="start start"><md-button class="md-icon-button" ng-click="showPicker($event)"' + (angular.isDefined(e.mdpDisabled) ? ' ng-disabled="disabled"' : "") + '><md-icon md-svg-icon="mdp-access-time"></md-icon></md-button><md-input-container' + (a ? " md-no-float" : "") + ' md-is-error="isError()"><input type="{{ ::type }}"' + (angular.isDefined(e.mdpDisabled) ? ' ng-disabled="disabled"' : "") + ' aria-label="' + i + '" placeholder="' + i + '"' + (n ? ' ng-click="showPicker($event)" ' : "") + " /></md-input-container></div>";
      }, scope: { timeFormat: "@mdpFormat", placeholder: "@mdpPlaceholder", autoSwitch: "=?mdpAutoSwitch", disabled: "=?mdpDisabled" }, link: function link(e, a, i, n, r) {
        function o(t) {
          m[0].value = t, l.setHasValue(!n.$isEmpty(t));
        }function s(t) {
          var a = moment(t, angular.isDate(t) ? null : e.timeFormat, !0),
              i = a.format(e.timeFormat);a.isValid() ? (o(i), n.$setViewValue(i)) : (o(t), n.$setViewValue(t)), !n.$pristine && u.hasClass("md-auto-hide") && c.hasClass("md-input-invalid") && u.removeClass("md-auto-hide"), n.$render();
        }function d(t) {
          t.target.value !== n.$viewVaue && s(t.target.value);
        }var m = angular.element(a[0].querySelector("input")),
            c = angular.element(a[0].querySelector("md-input-container")),
            l = c.controller("mdInputContainer");r(function (t) {
          c.append(t);
        });var u = angular.element(c[0].querySelector("[ng-messages]"));e.type = e.timeFormat ? "text" : "time", e.timeFormat = e.timeFormat || "HH:mm", e.autoSwitch = e.autoSwitch || !1, e.$watch(function () {
          return n.$error;
        }, function (t, e) {
          l.setInvalid(!n.$pristine && !!Object.keys(n.$error).length);
        }, !0), n.$formatters.unshift(function (t) {
          var a = angular.isDate(t) && moment(t);o(a && a.isValid() ? a.format(e.timeFormat) : null);
        }), n.$validators.format = function (t, a) {
          return !a || angular.isDate(a) || moment(a, e.timeFormat, !0).isValid();
        }, n.$validators.required = function (t, e) {
          return angular.isUndefined(i.required) || !n.$isEmpty(t) || !n.$isEmpty(e);
        }, n.$parsers.unshift(function (t) {
          var a = moment(t, e.timeFormat, !0);if (a.isValid()) {
            if (angular.isDate(n.$modelValue)) {
              var i = moment(n.$modelValue);i.minutes(a.minutes()), i.hours(a.hours()), i.seconds(a.seconds()), a = i;
            }return a.toDate();
          }return null;
        }), e.showPicker = function (a) {
          t(n.$modelValue, { targetEvent: a, autoSwitch: e.autoSwitch }).then(function (t) {
            s(t, !0);
          });
        }, m.on("reset input blur", d), e.$on("$destroy", function () {
          m.off("reset input blur", d);
        });
      } };
  }]), d.directive("mdpTimePicker", ["$mdpTimePicker", "$timeout", function (t, e) {
    return { restrict: "A", require: "ngModel", scope: { timeFormat: "@mdpFormat", autoSwitch: "=?mdpAutoSwitch" }, link: function link(e, a, i, n, r) {
        function o(a) {
          t(n.$modelValue, { targetEvent: a, autoSwitch: e.autoSwitch }).then(function (t) {
            n.$setViewValue(moment(t).format(e.format)), n.$render();
          });
        }e.format = e.format || "HH:mm", a.on("click", o), e.$on("$destroy", function () {
          a.off("click", o);
        });
      } };
  }]);
}();
//# sourceMappingURL=mdPickers.min.js.map
//# sourceMappingURL=mdPickers.min.js.map

'use strict';

(function () {
	'use strict';

	angular.module('mediaboxApp').factory('Modal', Modal).controller('ModalController', ModalController);

	// Modal.$inject = ['$mdDialog', '$state'];
	// ModalController.$inject = ['$mdDialog', 'Toast', '$http', 'options', 'cols', 'Settings', '$filter'];

	function Modal($mdDialog, $state) {

		var obj = {};
		obj.show = function (cols, options) {
			$mdDialog.show({
				controller: 'ModalController as create',
				templateUrl: 'components/modal/create.html',
				clickOutsideToClose: false,
				locals: { cols: cols, options: options }
			}).then(transitionTo, transitionTo);
		};

		return obj;
	}

	function transitionTo(answer) {
		// return $state.go('detail', { location: false });
	}

	function ModalController($mdDialog, Toast, $http, options, cols, Settings, $filter) {
		var vm = this;
		vm.create = createUser;
		vm.close = hideDialog;
		vm.cancel = cancelDialog;
		vm.options = options;
		vm.options.columns = cols;
		vm.title = options.api;
		function createUser(form) {
			// refuse to work with invalid cols
			if (vm.item._id || form && !form.$valid) {
				return;
			}
			// 
			// $http.post('/api/sendmail', {
			// 	from: 'Biri.in <codenxg@gmail.com>',
			//   to: '2lessons@gmail.com',
			//   subject: 'Message from Biri.in',
			//   text: vm.item.title
			// });

			$http.post('/api/' + $filter('pluralize')(options.api), vm.item).then(createUserSuccess).catch(createUserCatch);
			function createUserSuccess(response) {
				var item = vm.item = response.data;
				Toast.show({
					type: 'success',
					text: 'New ' + options.api + ' saved successfully.'
				});
				vm.close();
			}

			function createUserCatch(err) {
				// if (form && err) {
				// 	form.setResponseErrors(err);
				// }

				Toast.show({
					type: 'warn',
					text: 'Error while creating new ' + options.api
				});
			}
		}

		function hideDialog() {
			$mdDialog.hide();
		}

		function cancelDialog() {
			$mdDialog.cancel();
		}
	}
})();
//# sourceMappingURL=modal.service.js.map

'use strict';

/**
 * Removes server error when user updates input
 */

angular.module('mediaboxApp').directive('mongooseError', function () {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function link(scope, element, attrs, ngModel) {
      element.on('keydown', function () {
        return ngModel.$setValidity('mongoose', true);
      });
    }
  };
});
//# sourceMappingURL=mongoose-error.directive.js.map

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NavbarPublicController = function NavbarPublicController(ToggleComponent, Auth, $attrs, Settings, $scope, $rootScope, $location, Cart, Category, Brand, $q, Product, $state, $timeout, $log) {
  _classCallCheck(this, NavbarPublicController);

  var vm = this;

  /* autocomplete */
  vm.simulateQuery = true;
  vm.isDisabled = false;
  vm.products = [];
  vm.querySearch = querySearch;
  vm.selectedItemChange = selectedItemChange;
  vm.searchTextChange = searchTextChange;
  vm.cart = Cart.cart;

  // ******************************
  // Internal methods
  // ******************************
  /**
   * Search for products... use $timeout to simulate
   * remote dataservice call.
   */
  vm.categories = Category();
  vm.Settings = Settings;
  vm.cart.getBestShipper(Settings.country).$promise.then(function (data) {
    vm.shipping = data[0];
    vm.totalPriceAfterShipping = vm.cartTotal + data[0].charge;
  });

  function querySearch(input) {
    var data = [];
    if (input) {
      input = input.toLowerCase();
      data = Product.query({ where: { nameLower: { '$regex': input }, active: true }, limit: 10, skip: 0, select: { id: 1, name: 1, slug: 1 } });
    }
    return data;
  }
  function searchTextChange(text) {
    //   $log.info('Text changed to ' + text);
  }

  function selectedItemChange(item) {
    $state.go('single-product', { id: item._id, slug: item.slug }, { reload: false });
  }

  /**
   * Create filter function for a query string
   */

  vm.isLoggedIn = Auth.isLoggedIn;
  vm.openFilter = function () {
    ToggleComponent('filtermenu').open();
  };
  vm.openCart = function () {
    ToggleComponent('cart').open();
  };
  var originatorEv;
  vm.openMenu = function ($mdOpenMenu, ev) {
    originatorEv = ev;
    $mdOpenMenu(ev);
  };

  vm.menu = [{
    'title': 'Home',
    'link': '/'
  }];

  vm.brands = Brand.query({ active: true });

  vm.isCollapsed = true;
  vm.isCollapsed1 = true;
  vm.getCurrentUser = Auth.getCurrentUser;

  vm.getQuantity = function (sku) {
    for (var i = 0; i < vm.cart.items.length; i++) {
      if (vm.cart.items[i].sku === sku) {
        return vm.cart.items[i].quantity;
      }
    }
  };

  vm.getQuantity = function (sku) {
    for (var i = 0; i < vm.cart.items.length; i++) {
      if (vm.cart.items[i].sku === sku) {
        return vm.cart.items[i].quantity;
      }
    }
  };
  vm.toggle = function (item, list) {
    if (angular.isUndefined(list)) list = [];
    var idx = list.indexOf(item);
    if (idx > -1) list.splice(idx, 1);else list.push(item);
    vm.filter();
  };

  vm.categories = Category.query();

  vm.close = function () {
    ToggleComponent('cart').close();
  };
};

angular.module('mediaboxApp').controller('NavbarPublicController', NavbarPublicController);
//# sourceMappingURL=navbar-public.controller.js.map

'use strict';

angular.module('mediaboxApp').directive('navbarPublic', function () {
  return {
    templateUrl: 'components/navbar-public/navbar-public.html',
    restrict: 'E',
    controller: 'NavbarPublicController',
    controllerAs: 'vm'
  };
});
//# sourceMappingURL=navbar-public.directive.js.map

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NavbarController = function NavbarController(ToggleComponent, Auth, Settings, Cart, Category, Brand, Product, $state, $stateParams, $mdMedia) {
  _classCallCheck(this, NavbarController);

  var vm = this;

  /* autocomplete */
  vm.simulateQuery = true;
  vm.querySearch = querySearch;
  vm.selectedItemChange = selectedItemChange;
  vm.searchTextChange = searchTextChange;
  vm.products = [];
  vm.cart = Cart.cart;
  vm.Settings = Settings;
  vm.$mdMedia = $mdMedia;

  console.log(vm.cart);
  // var productId = localStorage !== null ? localStorage.productId : null;

  if ($stateParams.search) // When searched print the search text inside search textbox 
    vm.searchText = $stateParams.name;

  vm.cart.getBestShipper().$promise.then(function (data) {
    vm.shipping = data[0];
    vm.totalPriceAfterShipping = vm.cartTotal + data[0].charge;
  });
  function querySearch(input) {
    var data = [];
    if (input) {
      input = input.toLowerCase();
      data = Product.query({ where: { nameLower: { '$regex': input }, active: true }, limit: 10, skip: 0, select: { id: 1, name: 1, slug: 1, 'variants.image': 1 } });
    }
    return data;
  }

  function selectedItemChange(item) {
    $state.go('single-product', { id: item._id, slug: item.slug, search: true, name: item.name }, { reload: false });
  }
  function searchTextChange() {}
  /**
   * Create filter function for a query string
   */

  vm.isLoggedIn = Auth.isLoggedIn;
  vm.openFilter = function () {
    ToggleComponent('filtermenu').open();
  };
  vm.openCart = function () {
    ToggleComponent('cart').open();
    vm.cart.getBestShipper().$promise.then(function (data) {
      vm.shipping = data[0];
      vm.totalPriceAfterShipping = vm.cartTotal + data[0].charge;
    });
  };
  var originatorEv;
  vm.openMenu = function ($mdOpenMenu, ev) {
    originatorEv = ev;
    $mdOpenMenu(ev);
  };

  vm.menu = [{
    'title': 'Home',
    'link': '/'
  }];

  vm.brands = Brand.query({ active: true });

  vm.isCollapsed = true;
  vm.isCollapsed1 = true;
  vm.getCurrentUser = Auth.getCurrentUser;

  vm.gotoDetail = function (params) {
    $state.go('single-product', { id: params.sku, slug: params.slug }, { reload: false });
  };

  vm.getQuantity = function (sku) {
    for (var i = 0; i < vm.cart.items.length; i++) {
      if (vm.cart.items[i].sku === sku) {
        return vm.cart.items[i].quantity;
      }
    }
  };

  vm.getQuantity = function (sku) {
    for (var i = 0; i < vm.cart.items.length; i++) {
      if (vm.cart.items[i].sku === sku) {
        return vm.cart.items[i].quantity;
      }
    }
  };
  vm.toggle = function (item, list) {
    //   console.log(item,list);
    if (angular.isUndefined(list)) list = [];
    var idx = list.indexOf(item);
    if (idx > -1) list.splice(idx, 1);else list.push(item);
    vm.filter();
  };

  vm.categories = Category.loaded.query();

  console.log(vm.categories);

  vm.close = function () {
    ToggleComponent('cart').close();
  };
};

angular.module('mediaboxApp').controller('NavbarController', NavbarController);
//# sourceMappingURL=navbar.controller.js.map

'use strict';

angular.module('mediaboxApp').directive('navbar', function () {
  return {
    templateUrl: 'components/navbar/navbar.html',
    restrict: 'E',
    controller: 'NavbarController',
    controllerAs: 'vm'
  };
});
//# sourceMappingURL=navbar.directive.js.map

'use strict';

angular.module('mediaboxApp').controller('OauthButtonsCtrl', function ($window) {
  this.loginOauth = function (provider) {
    if (provider === 'facebook') this.facebookLoading = true;
    if (provider === 'google') this.googleLoading = true;
    if (provider === 'twitter') this.twitterLoading = true;
    $window.location.href = '/auth/' + provider;
  };
});
//# sourceMappingURL=oauth-buttons.controller.js.map

'use strict';

angular.module('mediaboxApp').directive('oauthButtons', function () {
  return {
    templateUrl: 'components/oauth-buttons/oauth-buttons.html',
    restrict: 'EA',
    controller: 'OauthButtonsCtrl',
    controllerAs: 'OauthButtons',
    scope: {
      classes: '@'
    }
  };
});
//# sourceMappingURL=oauth-buttons.directive.js.map

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var ratingComponent =
  /*@ngInject*/
  function ratingComponent($timeout) {
    _classCallCheck(this, ratingComponent);

    var vm = this;
    // if (vm.readOnly === undefined) vm.readOnly = false
    var starsArray = [];
    // Initialize to 5 stars 
    for (var index = 0; index < 5; index++) {
      var starItem = {
        index: index,
        class: 'star-off'
      };
      starsArray.push(starItem);
    }
    vm.starsArray = starsArray;

    // On mousover
    vm.setMouseOverRating = function (rating) {
      if (vm.readOnly) {
        return;
      }
      vm.validateStars(rating);
    };
    // Highlight stars
    vm.validateStars = function (rating) {
      if (!vm.starsArray || vm.starsArray.length === 0) {
        return;
      }
      for (var index = 0; index < vm.starsArray.length; index++) {
        var starItem = vm.starsArray[index];
        if (index <= rating - 1) {
          starItem.class = 'star-on';
        } else {
          starItem.class = 'star-off';
        }
      }
    };

    // On click select star
    vm.setRating = function (rating) {
      if (vm.readOnly) return;
      vm.rating = rating;
      vm.validateStars(vm.rating);
      $timeout(function () {
        vm.onRating({
          rating: vm.rating
        });
      });
    };
  };

  angular.module('mediaboxApp').component('rating', {
    template: '\n    <div class="angular-material-rating" layout="row">  \n      <a class="button star-button" ng-class="item.class"    ng-mouseover="$ctrl.setMouseOverRating($index + 1)"    ng-mouseleave="$ctrl.setMouseOverRating($ctrl.rating)"    ng-click="$ctrl.setRating($index + 1)" ng-repeat="item in $ctrl.starsArray">\n        <ng-md-icon icon="star"></ng-md-icon>  \n      </a>\n    </div>\n    ',
    bindings: {
      message: '<', // Read only
      max: '@?', // String
      rating: '=?', // 2way
      readOnly: '=?', // 2way
      onRating: '&' // Callback
    },
    controller: ratingComponent
  });
})();
//# sourceMappingURL=rating.component.js.map

'use strict';

angular.module('mediaboxApp').directive('remoteUnique', function () {
  return {
    template: '<div></div>',
    restrict: 'EA',
    link: function link(scope, element, attrs) {
      element.text('this is the remoteUnique directive');
    }
  };
});
//# sourceMappingURL=remote-unique.directive.js.map

'use strict';

(function () {
	'use strict';

	// register the service as RepeatInput

	angular.module('mediaboxApp').directive('repeatInput', RepeatInput);

	// add RepeatInput dependencies to inject
	// RepeatInput.$inject = [''];

	/**
  * RepeatInput directive
  */
	function RepeatInput() {
		// directive definition members
		var directive = {
			link: link,
			restrict: 'A',
			require: 'ngModel'
		};

		return directive;

		// directives link definition
		function link(scope, elem, attrs, model) {
			if (!attrs.repeatInput) {
				console.error('repeatInput expects a model as an argument!');
				return;
			}

			scope.$watch(attrs.repeatInput, function (value) {
				// Only compare values if the second ctrl has a value.
				if (model.$viewValue !== undefined && model.$viewValue !== '') {
					model.$setValidity('repeat-input', value === model.$viewValue);
				}
			});

			model.$parsers.push(function (value) {
				// Mute the repeatInput error if the second ctrl is empty.
				if (value === undefined || value === '') {
					model.$setValidity('repeat-input', true);
					return value;
				}

				var isValid = value === scope.$eval(attrs.repeatInput);
				model.$setValidity('repeat-input', isValid);
				return isValid ? value : undefined;
			});
		}
	}
})();
//# sourceMappingURL=repeat-input.directive.js.map

'use strict';

angular.module('mediaboxApp').controller('RightMenuCtrl', function () {});
//# sourceMappingURL=right-menu.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('right-menu', {
    url: '/right-menu',
    templateUrl: 'components/right-menu/right-menu.html',
    controller: 'RightMenuCtrl'
  });
});
//# sourceMappingURL=right-menu.js.map

/* global io */
'use strict';

angular.module('mediaboxApp').factory('socket', function (socketFactory) {
  // socket.io now auto-configures its connection when we ommit a connection url
  var ioSocket = io('', {
    // Send auth token on connection, you will need to DI the Auth service above
    // 'query': 'token=' + Auth.getToken()
    path: '/socket.io-client'
  });

  var socket = socketFactory({ ioSocket: ioSocket });

  return {
    socket: socket,

    /**
     * Register listeners to sync an array with updates on a model
     *
     * Takes the array we want to sync, the model name that socket updates are sent from,
     * and an optional callback function after new items are updated.
     *
     * @param {String} modelName
     * @param {Array} array
     * @param {Function} cb
     */
    syncUpdates: function syncUpdates(modelName, array, cb) {
      cb = cb || angular.noop;

      /**
       * Syncs item creation/updates on 'model:save'
       */
      socket.on(modelName + ':save', function (item) {
        var oldItem = _.find(array, { _id: item._id });
        var index = array.indexOf(oldItem);
        var event = 'created';

        // replace oldItem if it exists
        // otherwise just add item to the collection
        if (oldItem) {
          array.splice(index, 1, item);
          event = 'updated';
        } else {
          array.push(item);
        }

        cb(event, item, array);
      });

      /**
       * Syncs removed items on 'model:remove'
       */
      socket.on(modelName + ':remove', function (item) {
        var event = 'deleted';
        _.remove(array, { _id: item._id });
        cb(event, item, array);
      });
    },


    /**
     * Removes listeners for a models updates on the socket
     *
     * @param modelName
     */
    unsyncUpdates: function unsyncUpdates(modelName) {
      socket.removeAllListeners(modelName + ':save');
      socket.removeAllListeners(modelName + ':remove');
    }
  };
});
//# sourceMappingURL=socket.service.js.map

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var submitButtonComponent =
  /*@ngInject*/
  function submitButtonComponent($timeout) {
    _classCallCheck(this, submitButtonComponent);
  };

  angular.module('mediaboxApp').component('submitButton', {
    template: '\n    <div layout="column" layout-align="center stretch">\n\t    <md-button type="submit" class="md-raised circular-progress-button md-primary" ng-disabled="!$ctrl.form.$valid || $ctrl.loading" aria-label="{{$ctrl.text}}">\n\t\t\t\t<span  layout="row" layout-align="center center">\n\t\t\t\t\t<ng-md-icon icon="lock" ng-hide="$ctrl.loading"></ng-md-icon>\n\t\t\t\t\t<md-progress-circular md-mode="indeterminate" md-diameter="25" ng-show="$ctrl.loading" class="md-accent md-hue-1"></md-progress-circular>\n\t\t\t\t\t<span flex>{{$ctrl.text}}</span>\n\t\t\t\t</span>\n\t    </md-button>\n\t\t</div>\n    ',
    bindings: {
      loading: '<', // Read only
      form: '<', // String
      text: '@?' // 2way
    },
    controller: submitButtonComponent
  });
})();
//# sourceMappingURL=submit-button.component.js.map

'use strict';

/**
 * @ngdoc overview
 * @name toast
 * @requires ui.router
 * @requires ngMaterial
 * @description
 * The materialApp.toast module
 */

/**
 * @ngdoc service
 * @name toast.service:Toast
 * @description
 * Service which wraps $mdToast to simplify usage thereof
 */

(function () {
	'use strict';

	angular.module('mediaboxApp').service('Toast', ToastService).controller('ToastController', ToastController);

	/**
  * @ngdoc function
  * @name toast.service:ToastService
  * @description
  * Provider for the {@link toast.service:Toast Toast-service}
  *
  * AngularJS will instantiate a singleton by calling "new" on this function
  *
  * @param {$mdToast} $mdToast The toast service to use
  * @returns {Object} The service definition for the Toast Service
  */

	ToastService.$inject = ['$mdToast'];

	function ToastService($mdToast) {

		return {
			show: showToast,
			hide: hideToast
		};

		/**
   * @ngdoc function
   * @name showToast
   * @methodOf toast.service:Toast
   * @description
   * Display a toast with the given content. If the content is falsy
   * use vm.message.text instead.
   *
   * @param {String|Object} content The toasts content or message object.
   * If an object, the text property will be used as the toast content.
   *
   * @param {Object} [options] Options object passed to the toast service
   * @returns {Promise} The mdToast promise
   */
		function showToast(content, options) {
			if (!options) {
				options = {
					hideDelay: 3000,
					parent: '.toast-container',
					position: 'bottom',
					controller: 'ToastController',
					controllerAs: 'vm',
					templateUrl: 'components/toast/toast.html',
					locals: {
						type: content.type || 'info',
						text: content.text || content,
						link: content.link || false
					}
				};

				// set defaults for content.type warn
				if (content.type && content.type === 'warn') {
					options.hideDelay = 0;
				} else if (content.type && content.type === 'success') {
					options.hideDelay = 5000;
				}
			}

			return $mdToast.show(options);
		}

		/**
   * @ngdoc function
   * @name hideToast
   * @methodOf toast.service:Toast
   * @description
   * Hide the current toast
   * @returns {Promise} The mdToast promise
   */
		function hideToast() {
			return $mdToast.hide();
		}
	}

	/**
  * @ngdoc controller
  * @name toast.controller:ToastController
  * @description
  * ToastController
  *
  * Controller for the custom toast template
  *
  * @param {$mdToast} $mdToast - The toast service to use
  * @param {$state} $state - The state service to use
  * @param {String} type - Type of the information
  * @param {String} text - The toast message
  * @param {String|Object} link - The link or state config object to navigate to
  * @returns {Object} The service definition for the Toast Service
  */

	ToastController.$inject = ['$mdToast', '$state', 'type', 'text', 'link'];

	function ToastController($mdToast, $state, type, text, link) {
		var vm = this;

		/**
   * @ngdoc property
   * @name text
   * @description
   * Some awesome text
   * @propertyOf toast.controller:ToastController
   */
		vm.text = text;

		/**
   * @ngdoc property
   * @name link
   * @description
   * Some awesome link
   * @propertyOf toast.controller:ToastController
   */
		vm.link = link;

		/**
   * @ngdoc property
   * @name type
   * @description
   * Some awesome type
   * @propertyOf toast.controller:ToastController
   */
		vm.type = type;

		// functions (documented below)
		vm.showItem = showItem;
		vm.close = closeToast;

		/**
   * @ngdoc function
   * @name showItem
   * @description
   * Navigate to the injected state
   * @methodOf toast.controller:ToastController
   * @api private
   */
		function showItem() {
			vm.close();
			$state.go(vm.link.state, vm.link.params);
		}

		/**
   * @ngdoc function
   * @name closeToast
   * @description
   * Close the current toast
   * @methodOf toast.controller:ToastController
   * @api private
   */
		function closeToast() {
			$mdToast.hide();
		}
	}
})();
//# sourceMappingURL=toast.service.js.map

'use strict';

(function () {
	'use strict';

	/**
  * Register the ToggleComponentDirective directive as toggleComponent.
  * Register the directive controller as ToggleComponentController
  * @module materialApp.toggleComponent
  * @name ToggleComponent
  */

	angular.module('mediaboxApp').directive('toggleComponent', ToggleComponentDirective).controller('ToggleComponentController', ToggleComponentController);

	// inject dependencies for the ToggleComponentDirective
	ToggleComponentDirective.$inject = ['$timeout', '$animate', '$parse', '$mdMedia', '$mdConstant', '$q', '$document'];

	/**
  * Directive for components that can be toggled.
  *
  * @ngdoc directive
  * @name ToggleComponentDirective
  * @module materialApp.toggleComponent
  *
  * @param $timeout
  * @param $animate
  * @param $parse
  * @param $mdMedia
  * @param $mdConstant
  * @param $q
  * @param $document
  * @returns {{restrict: string, scope: {isOpen: string}, controller: string, compile: Function}}
  * @constructor
  */
	function ToggleComponentDirective($timeout, $animate, $parse, $mdMedia, $mdConstant, $q, $document) {
		return {
			restrict: 'A',

			scope: {
				isOpen: '=?toggleComponentIsOpen',
				keyDown: '=?toggleComponentOnKeydown'
			},

			controller: 'ToggleComponentController',

			compile: function compile(element) {
				element.addClass('toggle-component-closed');
				element.attr('tabIndex', '-1');
				return postLink;
			}
		};

		/**
   * Directive Post Link function
   */
		function postLink(scope, element, attr, toggleComponentCtrl) {
			var triggeringElement = null;
			var promise = $q.when(true);
			var isLockedOpenParsed = $parse(attr.toggleComponentIsOpen);
			var isLocked = function isLocked() {
				return isLockedOpenParsed(scope.$parent, { $media: $mdMedia });
			};

			element.on('$destroy', toggleComponentCtrl.destroy);
			scope.$watch(isLocked, updateIsLocked);
			scope.$watch('isOpen', updateIsOpen);

			// Publish special accessor for the Controller instance
			toggleComponentCtrl.$toggleOpen = toggleOpen;

			/**
    * Toggle the DOM classes to indicate `locked`
    * @param isLocked
    */
			function updateIsLocked(isLocked, oldValue) {
				if (isLocked === oldValue) {
					element.toggleClass('toggle-component-locked-open', !!isLocked);
				} else {
					$animate[isLocked ? 'addClass' : 'removeClass'](element, 'toggle-component-locked-open');
				}
			}

			/**
    * Toggle the toggleComponent view and attach/detach listeners
    * @param isOpen
    */
			function updateIsOpen(isOpen) {
				var parent = element.parent();

				if (scope.keyDown) {
					parent[isOpen ? 'on' : 'off']('keydown', onKeyDown);
				}

				if (isOpen) {
					triggeringElement = $document[0].activeElement;
				}

				return promise = $q.all([$animate[isOpen ? 'removeClass' : 'addClass'](element, 'toggle-component-closed').then(function setElementFocus() {
					if (scope.isOpen) {
						element.focus();
					}
				})]);
			}

			/**
    * Toggle the toggleComponent view and publish a promise to be resolved when
    * the view animation finishes.
    *
    * @param isOpen
    * @returns {*}
    */
			function toggleOpen(isOpen) {
				if (scope.isOpen === isOpen) {
					return $q.when(true);
				}
				var deferred = $q.defer();
				// Toggle value to force an async `updateIsOpen()` to run
				scope.isOpen = isOpen;
				$timeout(setElementFocus, 0, false);

				return deferred.promise;

				function setElementFocus() {
					// When the current `updateIsOpen()` animation finishes
					promise.then(function (result) {
						if (!scope.isOpen) {
							// reset focus to originating element (if available) upon close
							triggeringElement && triggeringElement.focus();
							triggeringElement = null;
						}

						deferred.resolve(result);
					});
				}
			}

			/**
    * Auto-close toggleComponent when the `escape` key is pressed.
    * @param evt
    */
			function onKeyDown(ev) {
				var isEscape = ev.keyCode === $mdConstant.KEY_CODE.ESCAPE;
				return isEscape ? close(ev) : $q.when(true);
			}

			/**
    * With backdrop `clicks` or `escape` key-press, immediately
    * apply the CSS close transition... Then notify the controller
    * to close() and perform its own actions.
   function close(ev) {
   	ev.preventDefault();
   	ev.stopPropagation();
   	return toggleComponentCtrl.close();
   }
    */
		}
	}

	// inject dependencies for the ToggleComponentController
	ToggleComponentController.$inject = ['$scope', '$element', '$attrs', '$q', '$mdComponentRegistry'];

	/**
  * @private
  * @ngdoc controller
  * @name ToggleComponentController
  * @module materialApp.toggleComponent
  *
  */
	function ToggleComponentController($scope, $element, $attrs, $q, $mdComponentRegistry) {
		var self = this;

		// Use Default internal method until overridden by directive postLink

		self.toggleOpen = function () {
			return $q.when($scope.isOpen);
		};

		self.isOpen = function () {
			return !!$scope.isOpen;
		};

		self.open = function () {
			return self.$toggleOpen(true);
		};

		self.close = function () {
			return self.$toggleOpen(false);
		};

		self.toggle = function () {
			return self.$toggleOpen(!$scope.isOpen);
		};

		self.destroy = $mdComponentRegistry.register(self, $attrs.mdComponentId);
	}
})();
//# sourceMappingURL=toggle-component.directive.js.map

'use strict';

(function () {
	'use strict';

	/**
  * Register the service as ToggleComponent
  * @module materialApp.toggleComponent
  * @name ToggleComponent
  */

	angular.module('mediaboxApp').service('ToggleComponent', ToggleComponentService);

	// add ToggleComponent dependencies to inject
	ToggleComponentService.$inject = ['$mdComponentRegistry', '$log', '$q'];

	/**
  * ToggleComponent constructor
  * AngularJS will instantiate a singleton by calling "new" on this function
  *
  * @ngdoc controller
  * @name ToggleComponentService
  * @module materialApp.toggleComponent
  * @returns {Object} The service definition for the ToggleComponent Service
  */
	function ToggleComponentService($mdComponentRegistry, $log, $q) {
		return function (contentHandle) {
			var errorMsg = "ToggleComponent '" + contentHandle + "' is not available!";
			var instance = $mdComponentRegistry.get(contentHandle);

			if (!instance) {
				$log.error('No content-switch found for handle ' + contentHandle);
			}

			return {
				isOpen: isOpen,
				toggle: toggle,
				open: open,
				close: close
			};

			function isOpen() {
				return instance && instance.isOpen();
			}

			function toggle() {
				return instance ? instance.toggle() : $q.reject(errorMsg);
			}

			function open() {
				return instance ? instance.open() : $q.reject(errorMsg);
			}

			function close() {
				return instance ? instance.close() : $q.reject(errorMsg);
			}
		};
	}
})();
//# sourceMappingURL=toggle-component.service.js.map

'use strict';

angular.module('mediaboxApp').directive('topMenu', function () {
  return {
    templateUrl: 'components/top-menu/top-menu.html',
    restrict: 'E',
    controller: 'TopMenuController',
    controllerAs: 'topmenu'
  };
});
//# sourceMappingURL=top-menu.directive.js.map

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TopMenuController = function TopMenuController(ToggleComponent, Auth, $attrs, Settings, Category, LoginModal, CpModal, $state, $scope, $mdMedia) {
  _classCallCheck(this, TopMenuController);

  var vm = this;
  vm.Auth = Auth;
  vm.showDropdownMenu = false;
  vm.hasRole = Auth.hasRole;
  vm.isLoggedIn = Auth.isLoggedIn;
  vm.isAdmin = Auth.isAdmin;
  vm.$mdMedia = $mdMedia;
  vm.menu = Settings.menu;
  vm.categories = Category();
  var originatorEv;
  vm.openMenu = function ($mdOpenMenu, ev) {
    originatorEv = ev;
    $mdOpenMenu(ev);
  };
  vm.showLogin = function () {
    LoginModal.show($state.current.name);
  };
  vm.showCp = function () {
    CpModal.show();
  };
};

angular.module('mediaboxApp').controller('TopMenuController', TopMenuController);
//# sourceMappingURL=topmenu.controller.js.map

'use strict';

angular.module('mediaboxApp').directive('userAvatar', function () {
  return {
    replace: true,
    template: '<svg class="user-avatar" viewBox="0 0 128 128" height="64" width="64" pointer-events="none" display="block" > <path fill="#FF8A80" d="M0 0h128v128H0z"/> <path fill="#FFE0B2" d="M36.3 94.8c6.4 7.3 16.2 12.1 27.3 12.4 10.7-.3 20.3-4.7 26.7-11.6l.2.1c-17-13.3-12.9-23.4-8.5-28.6 1.3-1.2 2.8-2.5 4.4-3.9l13.1-11c1.5-1.2 2.6-3 2.9-5.1.6-4.4-2.5-8.4-6.9-9.1-1.5-.2-3 0-4.3.6-.3-1.3-.4-2.7-1.6-3.5-1.4-.9-2.8-1.7-4.2-2.5-7.1-3.9-14.9-6.6-23-7.9-5.4-.9-11-1.2-16.1.7-3.3 1.2-6.1 3.2-8.7 5.6-1.3 1.2-2.5 2.4-3.7 3.7l-1.8 1.9c-.3.3-.5.6-.8.8-.1.1-.2 0-.4.2.1.2.1.5.1.6-1-.3-2.1-.4-3.2-.2-4.4.6-7.5 4.7-6.9 9.1.3 2.1 1.3 3.8 2.8 5.1l11 9.3c1.8 1.5 3.3 3.8 4.6 5.7 1.5 2.3 2.8 4.9 3.5 7.6 1.7 6.8-.8 13.4-5.4 18.4-.5.6-1.1 1-1.4 1.7-.2.6-.4 1.3-.6 2-.4 1.5-.5 3.1-.3 4.6.4 3.1 1.8 6.1 4.1 8.2 3.3 3 8 4 12.4 4.5 5.2.6 10.5.7 15.7.2 4.5-.4 9.1-1.2 13-3.4 5.6-3.1 9.6-8.9 10.5-15.2M76.4 46c.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6-.9 0-1.6-.7-1.6-1.6-.1-.9.7-1.6 1.6-1.6zm-25.7 0c.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6-.9 0-1.6-.7-1.6-1.6-.1-.9.7-1.6 1.6-1.6z"/> <path fill="#E0F7FA" d="M105.3 106.1c-.9-1.3-1.3-1.9-1.3-1.9l-.2-.3c-.6-.9-1.2-1.7-1.9-2.4-3.2-3.5-7.3-5.4-11.4-5.7 0 0 .1 0 .1.1l-.2-.1c-6.4 6.9-16 11.3-26.7 11.6-11.2-.3-21.1-5.1-27.5-12.6-.1.2-.2.4-.2.5-3.1.9-6 2.7-8.4 5.4l-.2.2s-.5.6-1.5 1.7c-.9 1.1-2.2 2.6-3.7 4.5-3.1 3.9-7.2 9.5-11.7 16.6-.9 1.4-1.7 2.8-2.6 4.3h109.6c-3.4-7.1-6.5-12.8-8.9-16.9-1.5-2.2-2.6-3.8-3.3-5z"/> <circle fill="#444" cx="76.3" cy="47.5" r="2"/> <circle fill="#444" cx="50.7" cy="47.6" r="2"/> <path fill="#444" d="M48.1 27.4c4.5 5.9 15.5 12.1 42.4 8.4-2.2-6.9-6.8-12.6-12.6-16.4C95.1 20.9 92 10 92 10c-1.4 5.5-11.1 4.4-11.1 4.4H62.1c-1.7-.1-3.4 0-5.2.3-12.8 1.8-22.6 11.1-25.7 22.9 10.6-1.9 15.3-7.6 16.9-10.2z"/> </svg>'
  };
});
//# sourceMappingURL=user-avatar.directive.js.map

'use strict';

(function () {

  /**
   * The Util service is for thin, globally reusable, utility functions
   */
  function UtilService($window) {
    var Util = {
      /**
       * Return a callback or noop function
       *
       * @param  {Function|*} cb - a 'potential' function
       * @return {Function}
       */
      safeCb: function safeCb(cb) {
        return angular.isFunction(cb) ? cb : angular.noop;
      },


      /**
       * Parse a given url with the use of an anchor element
       *
       * @param  {String} url - the url to parse
       * @return {Object}     - the parsed url, anchor element
       */
      urlParse: function urlParse(url) {
        var a = document.createElement('a');
        a.href = url;

        // Special treatment for IE, see http://stackoverflow.com/a/13405933 for details
        if (a.host === '') {
          a.href = a.href;
        }

        return a;
      },


      /**
       * Test whether or not a given url is same origin
       *
       * @param  {String}           url       - url to test
       * @param  {String|String[]}  [origins] - additional origins to test against
       * @return {Boolean}                    - true if url is same origin
       */
      isSameOrigin: function isSameOrigin(url, origins) {
        url = Util.urlParse(url);
        origins = origins && [].concat(origins) || [];
        origins = origins.map(Util.urlParse);
        origins.push($window.location);
        origins = origins.filter(function (o) {
          return url.hostname === o.hostname && url.port === o.port && url.protocol === o.protocol;
        });
        return origins.length >= 1;
      }
    };

    return Util;
  }

  angular.module('mediaboxApp.util').factory('Util', UtilService);
})();
//# sourceMappingURL=util.service.js.map

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var wishComponent =
  /*@ngInject*/
  function wishComponent(Wishlist, Toast, Auth, LoginModal) {
    _classCallCheck(this, wishComponent);

    var vm = this;
    var product = {};
    var variant = {};
    vm.$onChanges = function (changesObj) {
      if (changesObj.product) product = changesObj.product.currentValue;
      if (changesObj.variant) variant = changesObj.variant.currentValue;else variant = '~~~~~~~~~~~~~~~';
      if (product && variant) {
        var q = { where: { 'product._id': product._id, 'variant._id': variant._id } };
        vm.cls = 'md-primary';
        var wishlist = Wishlist.my.query(q, function (data) {
          if (data[0]) vm.cls = 'md-accent';
        });
      }
    };

    // On click select star
    vm.toggleWishlist = function () {
      if (vm.readOnly) return;
      if (!Auth.getCurrentUser().name) {
        LoginModal.show('single-product', true); // Reload = true
        return;
      }
      var p = { product: this.product, variant: this.variant };
      // pid: vm.product._id,
      // pname: vm.product.name,
      // slug: vm.product.slug,
      // image:vm.product.variants[0].image,
      // price:vm.product.variants[0].price,
      // mrp:vm.product.variants[0].mrp,
      // keyFeatures: vm.product.keyFeatures
      // }
      Wishlist.save(p, function (data) {
        if (data._id) {
          Toast.show({ type: 'success', text: 'Added to your wishlist' });
          vm.cls = 'md-accent';
        } else vm.cls = 'md-primary';
      });
    };
  };

  angular.module('mediaboxApp').component('wish', {
    template: '\n    <md-button class="wishlist-component md-mini" aria-label="Add to wishlist" ng-class="$ctrl.cls"\n    ng-click="$ctrl.toggleWishlist()">\n        <ng-md-icon icon="favorite"></ng-md-icon>&nbsp;<span ng-if="$ctrl.cls === \'md-accent\'">Wished</span><span ng-if="$ctrl.cls !== \'md-accent\'">Add To Wishlist</span>\n    </md-button>\n    ',
    bindings: {
      product: '<', // Read only
      variant: '<', // Read only
      pid: '<', // Product ID passed because initially the whole product object will not be ready
      readOnly: '@?' // String value
    },
    controller: wishComponent
  });
})();
//# sourceMappingURL=wish.component.js.map

angular.module("mediaboxApp").run(["$templateCache", function($templateCache) {$templateCache.put("components/calendar/calendar.html","<script type=\"text/ng-template\" id=\"/modal.datepicker.html\">\n\n<md-dialog aria-label=\"\" class=\"md-datepicker\" ng-class=\"{ \'portrait\': !$mdMedia(\'gt-md\') }\">\n  <md-dialog-content layout=\"row\" layout-wrap>\n\n    <div layout=\"column\" layout-align=\"start center\">\n      <md-toolbar layout-align=\"center center\" class=\"md-datepicker-dow md-primary\"><span>{{ datepicker.currentMoment.format(\"dddd\") }}</span></md-toolbar>\n      <md-toolbar layout-align=\"center center\" class=\"md-datepicker-date md-hue-1 md-primary\" layout=\"column\">\n        <div class=\"md-datepicker-month\">{{ datepicker.currentMoment.format(\"MMM\") }}</div>\n        <div class=\"md-datepicker-day\">{{ datepicker.currentMoment.format(\"DD\") }}</div>\n        <md-select class=\"md-datepicker-year\" placeholder=\"{{ datepicker.currentMoment.format(\'YYYY\') }}\" ng-model=\"year\" ng-change=\"datepicker.setYear()\">\n          <md-option ng-value=\"year\" ng-repeat=\"year in yearsOptions\">{{ year }}</md-option>\n        </md-select>\n      </md-toolbar>\n    </div>\n\n    <div layout=\"column\" layout-align=\"start center\" class=\"md-datepicker-calendar\">\n      <div layout=\"row\" layout-align=\"space-between center\" class=\"md-datepicker-monthyear\">\n        <md-button aria-label=\"mese precedente\" class=\"md-icon-button\" ng-click=\"datepicker.prevMonth()\">\n          <ng-md-icon icon=\"chevron_left\"></ng-md-icon>\n        </md-button>\n        {{ datepicker.currentMoment.format(\"MMMM YYYY\") }}\n        <md-button aria-label=\"mese successivo\" class=\"md-icon-button\" ng-click=\"datepicker.nextMonth()\">\n          <ng-md-icon icon=\"chevron_right\"></ng-md-icon>\n        </md-button>\n      </div>\n      <div layout=\"row\" layout-align=\"space-around center\" class=\"md-datepicker-week-days\">\n        <div layout layout-align=\"center center\" ng-repeat=\"d in datepicker.weekDays track by $index\">{{ d }}</div>\n      </div>\n\n      <div layout=\"row\" layout-wrap class=\"md-datepicker-days\">\n        <div layout layout-align=\"center center\" ng-repeat-start=\"n in datepicker.getDaysInMonth() track by $index\">\n          <md-button aria-label=\"seleziona giorno\" ng-if=\"n !== false\" ng-class=\"{\'md-accent\': datepicker.currentMoment.date() == n}\" ng-click=\"datepicker.selectDate(n)\">{{ n }}</md-button>\n        </div>\n        <div flex ng-if=\"($index + 1) % 7 == 0\" ng-repeat-end></div>\n      </div>\n    </div>\n  </md-dialog-content>\n  <div class=\"md-actions\" layout=\"row\">\n    <md-button ng-click=\"datepicker.cancel()\" aria-label=\"cancel\">Cancel</md-button>\n    <md-button ng-click=\"datepicker.confirm()\" aria-label=\"ok\">Select</md-button>\n  </div>\n</md-dialog>\n</script>\n");
$templateCache.put("components/crud-table/detail.html","<md-toolbar class=\"md-hue-1\" id=\"user-detail-toolbar\">\n	<span layout=\"row\" layout-align=\"space-between\" class=\"md-toolbar-tools md-toolbar-tools-top\">\n		<md-button ng-click=\"detail.goBack();\" aria-label=\"Close detail view\">\n			<ng-md-icon icon=\"close\" aria-label=\"Close dialog\"></ng-md-icon>\n		</md-button>\n		<h3>Edit {{detail.header | labelCase}} - {{detail.item._id}}</h3>\n		<md-button aria-label=\"-\">\n		</md-button>\n	</span>\n</md-toolbar>\n<md-content class=\"md-padding\" flex id=\"user-detail-content\">\n	<section class=\"section\" layout=\"column\">\n\n		<span class=\"section-title\">Edit</span>\n\n<form name=\"detailForm\" layout=\"column\" layout-fill layout-align=\"space-between\" ng-submit=\"detail.edit(detail.item);detail.goBack();\" novalidate autocomplete=\"off\">\n		<span layout=\"row\" layout-sm=\"column\" ng-repeat=\"i in detail.columns\" ng-if=\"detail.columns\" ng-switch=\"i.dataType\">\n\n			<md-input-container flex ng-switch-when=\"parseFloat\">\n				<label>{{i.heading | labelCase}}</label>\n				<input name=\"{{i.field}}\" ng-model=\"detail.item[i.field]\" ng-disabled=\"i.noEdit\" only-numbers md-autofocus=\"$index === 0\">\n			</md-input-container>\n\n			<md-input-container md-no-float class=\"md-block\" flex ng-switch-when=\"image\">\n				<label>{{i.heading | labelCase}} URL</label>\n				<input name=\"{{i.field}}\" ng-model=\"detail.item[i.field]\" ng-disabled=\"i.noEdit\" md-autofocus=\"$index === 0\">\n				<ng-md-icon icon=\"insert_photo\" ng-click=\"detail.mediaLibrary()\"></ng-md-icon>\n			</md-input-container>\n\n			<md-input-container flex ng-switch-when=\"boolean\">\n				<section class=\"section slim\" layout=\"column\">\n					<span layout=\"row\" layout-align=\"start center\">\n						<span flex=\"33\"><label>{{i.heading | labelCase}}</label></span>\n						<md-switch name=\"{{i.field}}\" aria-label=\"active\" ng-model=\"detail.item[i.field]\"\n						ng-disabled=\"i.noEdit\"></md-switch>\n					</span>\n				</section>\n				<span flex=\"33\"></span>\n			</md-input-container>\n			<md-input-container flex ng-switch-when=\"date\">\n				<label>{{i.heading | labelCase}}</label>\n				<input name=\"{{i.field}}\" ng-model=\"detail.item[i.field]\" type=\'calendar\' ng-disabled=\"i.noEdit\"/>\n\n			</md-input-container>\n\n			<md-input-container flex ng-switch-when=\"dropdown\" class=\"dropdown\">\n        <label>{{i.heading | labelCase}}</label>\n        <md-select ng-model=\"detail.item[i.field]\">\n          <md-option ng-repeat=\"o in i.options\" value=\"{{o}}\">\n            {{o}}\n          </md-option>\n        </md-select>\n      </md-input-container>\n\n			<md-input-container flex ng-switch-when=\"textarea\">\n        <label>{{i.heading | labelCase}}</label>\n        <textarea name=\"{{i.field}}\" ng-model=\"detail.item[i.field]\" ng-disabled=\"i.field==\'_id\' || i.noEdit\" md-autofocus=\"$index === 0\"></textarea>\n      </md-input-container>\n\n			<md-input-container flex ng-switch-default>\n				<label>{{i.heading | labelCase}}</label>\n				<input name=\"{{i.field}}\" ng-model=\"detail.item[i.field]\" ng-disabled=\"i.field==\'_id\' || i.noEdit\" md-autofocus=\"$index === 0\">\n			</md-input-container>\n\n		</span>\n\n		<md-dialog-actions layout=\"row\">\n			<span flex></span>\n			<md-button ng-disabled=\"detailForm.$invalid\" type=\"submit\" class=\"md-primary md-raised\" aria-label=\"Save changes\">Save</md-button>\n		</md-dialog-actions>\n		</form>\n\n	</section>\n\n	<section class=\"section\" layout=\"column\" ng-hide=\"detail.isRoot\">\n\n		<span class=\"section-title\">Record Information</span>\n		<span layout=\"row\" layout-sm=\"column\" class=\"detail-info\">\n			<span flex=\"45\">Modified</span>\n			<span flex ng-show=\"detail.item.updatedAt\" class=\"subtitle\">\n				<span am-time-ago=\"detail.item.updatedAt\"></span>\n				<md-tooltip>{{detail.item.updatedAt | date:\'dd. MMMM yyyy H:mm\'}}</md-tooltip>\n				{{detail.item.modifiedBy && \'by \' + detail.item.modifiedBy}}\n			</span>\n		</span>\n\n		<span layout=\"row\" layout-sm=\"column\" class=\"detail-info\">\n			<span flex=\"45\">Created</span>\n			<span flex ng-show=\"detail.item.createdAt\" class=\"subtitle\">{{detail.item.createdAt | date:\'dd. MMMM yyyy H:mm\'}}</span>\n		</span>\n\n	</section>\n\n</md-content>\n");
$templateCache.put("components/crud-table/list.html","<a ng-click=\"main.create();\">\n	<md-button  show-gt-xs class=\"md-fab md-accent md-fab-top-left fab-overlap md-button ng-scope md-blue-theme\" aria-label=\"Create a new  {{list.header}}\" ng-if=\"!list.no.add\">\n		<md-tooltip>Add new {{list.header | labelCase}}</md-tooltip>\n        <ng-md-icon icon=\"add\"></ng-md-icon>\n	</md-button>\n</a>\n<md-progress-linear md-mode=\"indeterminate\" ng-show=\"list.loading\"></md-progress-linear>\n\n <!-- Add div For infinite scroll -->\n	<md-card infinite-scroll=\'list.loadMore()\' infinite-scroll-disabled=\'list.busy\' infinite-scroll-distance=\'1\' ng-if=\"list.data.length\">\n		<md-toolbar class=\"md-table-toolbar md-default\" aria-hidden=\"false\"\n		ng-hide=\"list.selected.length || filter.show || list.data.search\">\n      <div class=\"md-toolbar-tools\">\n				<h2 class=\"md-title\">List of {{list.header | labelCase | pluralize}}</h2>\n			  <div flex></div>\n			  <md-button tabindex=\"0\" ng-click=\"filter.show = true;\" class=\"md-icon-button md-button md-default-theme\" ng-show=\"!list.no.filter\"\n				aria-label=\"Open filter box for {{list.header | labelCase  | pluralize}} table\">\n		        <md-tooltip md-direction=\"left\">Filter {{list.header | labelCase | pluralize}}</md-tooltip>\n			    <ng-md-icon icon=\"filter_list\"></ng-md-icon>\n			  </md-button>\n				<md-menu md-position-mode=\"target-right target\" ng-if=\"!list.no.export\">\n	      <md-button aria-label=\"Open options menu\" class=\"md-icon-button\" ng-click=\"list.openMenu($mdOpenMenu, $event)\">\n		    <md-tooltip md-direction=\"left\">Export all {{list.header | labelCase | pluralize}}</md-tooltip>\n	        <ng-md-icon icon=\"inbox\"></ng-md-icon>\n	      </md-button>\n	      <md-menu-content width=\"4\">\n	        <md-menu-item>\n	          <md-button\n							ng-click=\"list.exportData(\'xls\');\"\n							aria-label=\"Export {{list.header | labelCase  | pluralize}} table as Excel\">\n	            <ng-md-icon icon=\"receipt\"></ng-md-icon>\n	            Excel\n	          </md-button>\n	        </md-menu-item>\n					<md-menu-divider></md-menu-divider>\n	        <md-menu-item>\n	          <md-button ng-click=\"list.exportData(\'json\');\" aria-label=\"Export {{list.header | labelCase  | pluralize}} table in JSON format\">\n	            <ng-md-icon icon=\"account_balance_wallet\"></ng-md-icon>\n	            JSON\n	          </md-button>\n	        </md-menu-item>\n	        <md-menu-divider></md-menu-divider>\n	        <md-menu-item>\n	          <md-button ng-click=\"list.exportData(\'txt\');\" aria-label=\"Export {{list.header | labelCase  | pluralize}} table in Text format\">\n	            <ng-md-icon icon=\"text_format\"></ng-md-icon>\n	            Text\n	          </md-button>\n	        </md-menu-item>\n	        <md-menu-divider></md-menu-divider>\n\n	      </md-menu-content>\n	    </md-menu>\n      </div>\n    </md-toolbar>\n\n		<md-toolbar class=\"md-table-toolbar md-default\"\n			ng-show=\"filter.show || list.data.search\"\n			aria-hidden=\"false\">\n      <div class=\"md-toolbar-tools\">\n				<ng-md-icon icon=\"search\"></ng-md-icon>\n				<md-input-container flex class=\"mgt30\">\n		      <label>Filter {{list.header | labelCase  | pluralize}}</label>\n		      <input ng-model=\"list.data.search\" focus-me=\"filter.show\">\n		    </md-input-container>\n				<ng-md-icon icon=\"close\" ng-click=\"filter.show = false; list.data.search = \'\';\" class=\"link\"></ng-md-icon>\n			</div>\n		</md-toolbar>\n\n<div class=\"md-table-container\">\n	<table md-colresize=\"md-colresize\" class=\"md-table\" id=\"exportable\">\n		<thead>\n			<tr class=\"md-table-headers-row\">\n				<th class=\"md-table-header\"></th>\n				<th ng-repeat=\"h in list.cols track by $index\" class=\"md-table-header\">\n					<a href=\"#\" ng-click=\"reverse=!reverse;list.order(h.field)\" ng-if=\"!list.no.sort && !h.noSort\">\n						{{h.heading | labelCase}}\n		    <md-tooltip md-direction=\"top\">Sort by {{h.field | labelCase | pluralize}}</md-tooltip>\n<ng-md-icon 	icon=\"arrow_downward\"\n					options=\'{\"rotation\": \"counterclock\"}\'\n					ng-show=\"reverse && h.field === list.sort.predicate\"\n					class=\"s18\"></ng-md-icon>\n<ng-md-icon 	icon=\"arrow_upwards\"\n					ng-show=\"!reverse && h.field === list.sort.predicate\"\n					options=\'{\"rotation\": \"counterclock\"}\'></ng-md-icon>\n					</a>\n					<a href=\"#\" ng-if=\"list.no.sort || h.noSort\">\n						{{h.heading | labelCase}}\n					</a>\n				</th>\n				<th class=\"md-table-header\"></th>\n				<th class=\"md-table-header\"></th>\n\n			</tr>\n\n		</thead>\n\n		<tbody>\n\n			<tr ng-repeat=\"p in filtered = ((list.data | orderBy:list.sort.predicate:list.sort.reverse) | filter:q | filter:list.data.search | limitTo: list.l) track by p._id\" id=\"{{p._id}}\"\n					class=\"md-table-content-row\"\n					ng-class=\"{\'selected\': list.isSelected(p)}\">\n				<td>\n                    <md-button class=\"md-icon-button\" aria-label=\"More\" ng-click=\"list.showInDetails(p);\" ng-if=\"!list.no.edit\">\n                            <md-tooltip>Edit {{list.header | labelCase}} info</md-tooltip>\n                            <ng-md-icon icon=\"edit\"></ng-md-icon>\n                    </md-button>\n				</td>\n				<td ng-repeat=\"c in list.cols track by $index\" ng-switch=\"c.dataType\">\n					{{c.sort}}\n				<span ng-switch-when=\"boolean\">\n					<md-switch class=\"md-secondary\" ng-model=\"p[c.field]\" ng-change=\"list.changeStatus(p)\" aria-label=\"p[c.field]\"></md-switch>\n				</span>\n				<span ng-switch-when=\"date\">\n					{{p[c.field] | date:\'mediumDate\'}}\n				</span>\n				<span ng-switch-when=\"currency\">\n					{{p[c.field] | currency}}\n				</span>\n				<span ng-switch-when=\"image\">\n					<span ng-if=\"!p[c.field]\"><list-image string=\"{{p.name}}\"></list-image></span>\n					<img ng-if=\"p[c.field]\" ng-src=\"{{p[c.field]}}\" err-SRC=\"/assets/images/material-shop-15b7652109.jpg\" />\n				</span>\n				<span ng-switch-default>\n					{{p[c.field]}}\n				</span>\n			</td>\n\n				<td></td>\n				<td>\n          <md-button class=\"md-icon-button\" aria-label=\"Copy Record\" ng-click=\"list.copy(p);\" ng-if=\"!list.no.copy\">\n          <md-tooltip>Duplicate this {{list.header | labelCase}}</md-tooltip>\n              <ng-md-icon icon=\"content_copy\"></ng-md-icon>\n					</md-button>\n					<md-button class=\"md-icon-button\" aria-label=\"Delete\" ng-click=\"list.delete(p);\" ng-if=\"!list.no.delete\">\n	        	      <md-tooltip>Delete this {{list.header | labelCase}}</md-tooltip>\n                      <ng-md-icon icon=\"delete\"></ng-md-icon>\n					</md-button>\n			</td>\n			</tr>\n		</tbody>\n\n	</table>\n</div>\n <div class=\"md-table-pagination\">\n		<span>Found {{filtered.length}} of {{list.data.length}} {{list.header | labelCase  | pluralize}}</span>\n	</div>\n</md-card>\n<a ng-click=\"main.create();\" ng-if=\"!list.no.add\">\n	<md-button hide-gt-xs ui-sref=\"list.create\" class=\"md-fab md-accent md-fab-bottom-right\" aria-label=\"Create a new {{list.header}}\" ng-if=\"!list.no.add\">\n		<md-tooltip md-direction=\"left\">Add new {{list.header | labelCase}}</md-tooltip>\n		<ng-md-icon icon=\"add\"></ng-md-icon>\n	</md-button>\n</a>\n	<md-card ng-if=\"list.data.length===0 && !list.loading\">\n	  <md-card-content>\n	    <h2>No {{list.header | labelCase}} found</h2>\n	    <p class=\"mgl\" hide-xs ng-if=\"!list.no.add\">\n				There is no {{list.header | labelCase}}!\n	      <a ng-click=\"main.create();\" href=\"\">Create one!</a>\n	    </p>\n	    <p hide-gt-xs ng-if=\"!list.no.add\">\n				There is no {{list.header | labelCase}}!\n	      <a ng-click=\"main.create();\" href=\"\">Create one!</a>\n	    </p>\n	  </md-card-content>\n	</md-card>\n");
$templateCache.put("components/crud-table/main.html","<navbar leftmenu=\"true\"></navbar>\n<left-menu></left-menu>\n<md-content flex layout=\"column\">\n<section layout=\"row\" layout-fill flex>\n\n		<div ui-view=\"content\" layout=\"column\" flex></div>\n\n		<md-content\n			ui-view=\"detail\"\n			id=\"detail-content\"\n			toggle-component\n			md-component-id=\"crud-table.detailView\"\n			layout=\"column\"\n			flex-xs=\"100\"\n			flex-sm = \"50\"\n			flex-md=\"50\"\n			flex-lg=\"33\"\n			flex-gt-lg=\"33\"\n			class=\"md-whiteframe-z1\">\n		</md-content>\n</section>\n\n</md-content>\n<footer></footer>\n");
$templateCache.put("components/crud-table/media-library.html","<md-dialog aria-label=\"Media Library\" ng-cloak flex=\"95\">\n  <md-toolbar class=\"md-warn\">\n    <div class=\"md-toolbar-tools\">\n      <h2>Media Library</h2>\n      <span flex></span>\n      <md-button class=\"md-icon-button\" ng-click=\"cancel()\">\n        <ng-md-icon icon=\"close\" aria-label=\"Close dialog\"></ng-md-icon>\n      </md-button>\n    </div>\n  </md-toolbar>\n\n  <md-dialog-content>\n      <div class=\"md-dialog-content\"  class=\"md-whiteframe-z2\">\n          <md-grid-list class=\"media-list\" md-cols-xs =\"3\" md-cols-sm=\"4\" md-cols-md=\"5\" md-cols-lg=\"7\" md-cols-gt-lg=\"10\" md-row-height-gt-md=\"1:1\" md-row-height=\"4:3\" md-gutter=\"12px\" md-gutter-gt-sm=\"8px\" layout=\"row\" layout-align=\"center center\">\n            <md-grid-tile ng-repeat=\"i in media\" class=\"md-whiteframe-z2\" ng-click=\"ok(i.path)\">\n          		<div class=\"thumbnail\">\n          				<img ng-src=\"{{i.path}}\" draggable=\"false\" alt=\"{{i.name}}\">\n          		</div>\n              <md-grid-tile-footer><h3>{{i.name}}</h3></md-grid-tile-footer>\n            </md-grid-tile>\n          </md-grid-list>\n    </div>\n  </md-dialog-content>\n  <md-dialog-actions layout=\"row\">\n    <span flex></span>\n    <md-button ng-click=\"addNewImage()\" class=\"md-warn md-raised\">\n     Add new Image\n    </md-button>\n  </md-dialog-actions>\n</md-dialog>\n");
$templateCache.put("components/footer/contact-form.html","<div layout=\"row\">\n<md-content flex layout=\"column\">\n<section layout=\"column\" flex layout-align=\"center center\">\n  <h1>Write to us</h1>\n  <form name=\"form\" ng-submit=\"send(contact)\" novalidate>\n  <section class=\"section\" layout=\"column\">\n    <md-input-container md-is-error=\"(form.message.$error.required || form.message.$error.message) && form.message.$dirty\">\n      <label>Message</label>\n      <textarea name=\"contact\" ng-model=\"contact.message\" required md-autofocus></textarea>\n      <div ng-messages=\"form.message.$error\" ng-if=\"form.message.$dirty\">\n        <div ng-message=\"required\">Message required</div>\n      </div>\n    </md-input-container>\n  </section>\n  <div class=\"md-dialog-actions\" layout=\"row\">\n    <md-button type=\"submit\" class=\"md-raised circular-progress-button md-primary\" ng-disabled=\"!form.$valid || vm.loading\" aria-label=\"Send Message\">\n      <span ng-show=\"!vm.loading\"><ng-md-icon icon=\"send\"></ng-md-icon>Send</span>\n      <md-progress-circular md-mode=\"indeterminate\" md-diameter=\"25\" ng-show=\"vm.loading\" class=\"md-accent md-hue-1\"></md-progress-circular><span ng-show=\"vm.loading\">Loading...</span>\n    </md-button>\n    <md-button class=\"btn btn-default btn-lg btn-register\" ng-click=\"cancel()\" aria-label=\"Cancel Send\"> Cancel </md-button>\n  </div>\n  </form>\n</section>\n</md-content>\n</div>\n");
$templateCache.put("components/footer/footer.html","<div class=\"footer\">\n  <div class=\"footer-content\" layout=\"row\" layout-align=\"center center\">\n    <div layout-align=\"start center\">© 2016 MediaBox   <a href=\"\" target=\"_blank\"></a> \n    | <a ng-click=\"addDialog()\" href=\"#\">Quick Contact</a></div>\n  </div>\n</div>\n<!--Container for md-toast-->\n<div class=\"fixed-bottom\"> <div class=\"toast-container\" ng-if=\"screenIsBig\">&nbsp;</div> </div>");
$templateCache.put("components/left-menu/left-menu.html","<md-sidenav layout=\"column\" class=\"md-sidenav-left md-whiteframe-z2\" md-component-id=\"left\" ng-cloak ng-if=\"nav.isLoggedIn()\">\n  <!-- md-is-locked-open=\"$mdMedia(\'gt-md\')\" -->\n      <md-toolbar class=\"md-tall md-hue-2 md-whiteframe-z2\">\n        <span flex></span>\n        <md-list>\n          <md-list-item class=\"md-2-line md-toolbar-tools-bottom\">\n            <user-avatar></user-avatar>\n            <div class=\"md-list-item-text\" layout=\"column\">\n              <span></span>\n              <div>{{left.currentUser.name}}</div>\n              <div>{{left.currentUser.email}}</div>\n            </div>\n          </md-list-item>\n        </md-list>\n      </md-toolbar>\n      <md-list>\n      </md-toolbar>\n      <md-list ng-if=\"left.menu\">\n      <md-item ng-repeat=\"item in left.menu.auth\" ui-sref-active=\"active\" ng-if=\"!left.isLoggedIn()\" ui-sref=\"{{item.url}}\" ng-click=\"left.toggleLeft();\" class=\" md-whiteframe-z2\">\n          <md-item-content md-ink-ripple layout=\"row\" layout-align=\"start center\" >\n            <div class=\"inset\">\n              <ng-md-icon icon=\"{{item.icon}}\"></ng-md-icon>\n            </div>\n            <div class=\"inset\">{{item.text}}</div>\n          </md-item-content>\n        <md-divider ng-if=\"!$last\"></md-divider>\n      </md-item>\n\n<!-- User Pages -->\n      <md-subheader ng-if=\"left.isLoggedIn()\">Pages</md-subheader>\n      <md-item ng-repeat=\"item in left.menu.pages\" ui-sref-active=\"active\" ng-if=\"left.isLoggedIn() && item.authenticate && left.hasRole(item.role)\" ui-sref=\"{{item.url}}\" class=\" md-whiteframe-z2\">\n          <md-item-content md-ink-ripple layout=\"row\" layout-align=\"start center\" >\n            <md-button>\n                <ng-md-icon icon=\"{{item.icon}}\"></ng-md-icon>\n                {{item.text}}\n            </md-button>\n          </md-item-content>\n        <md-divider ng-if=\"!$last || !$first\"></md-divider>\n      </md-item>\n\n<!-- Public Pages -->\n      <md-item ng-repeat=\"item in left.menu.pages\" ui-sref-active=\"active\" ng-if=\"!item.authenticate\" ui-sref=\"{{item.url}}\" class=\" md-whiteframe-z2\">\n          <md-item-content md-ink-ripple layout=\"row\" layout-align=\"start center\" >\n            <md-button>\n                <ng-md-icon icon=\"{{item.icon}}\"></ng-md-icon>\n                {{item.text}}\n            </md-button>\n          </md-item-content>\n        <md-divider ng-if=\"!$last || !$first\"></md-divider>\n      </md-item>\n\n      <md-subheader ng-if=\"left.isLoggedIn()\">Settings</md-subheader>\n      <md-item ng-repeat=\"item in left.menu.admin\" ui-sref-active=\"active\" ng-if=\"left.isLoggedIn()\" ui-sref=\"{{item.url}}\">\n          <md-item-content md-ink-ripple layout=\"row\" layout-align=\"start center\" >\n            <div class=\"inset\">\n              <ng-md-icon icon=\"{{item.icon}}\"></ng-md-icon>\n            </div>\n            <div class=\"inset\">{{item.text}}</div>\n          </md-item-content>\n        <md-divider ng-if=\"!$last\"></md-divider>\n      </md-item>\n    </md-list>\n    </md-sidenav>\n");
$templateCache.put("components/login-modal/cp.html","<md-dialog aria-label=\"Create a new user\" id=\"admin-user-create\" layout=\"column\" \nflex-xs=\"100\" \nflex-sm = \"75\" \nflex-md=\"50\" \nflex-lg=\"33\" \nflex-gt-lg=\"25\" \nmd-whiteframe=\"24\">\n    <md-toolbar class=\"md-accent\" layout=\"row\" layout-align=\"space-between center\">\n      <h3 class=\"md-toolbar-tools\">Change Password</h3>\n        <md-button class=\"md-icon-button\" ng-click=\"cp.close()\" aria-label=\"Close Change Password\"><ng-md-icon icon=\"close\" aria-label=\"Close dialog\"></ng-md-icon></md-button>\n    </md-toolbar>\n<md-content flex layout=\"row\" class=\"content\" layout-align=\"start center\">\n<section layout=\"column\" layout-align=\"start center\" flex>\n	<form name=\"form\" ng-submit=\"cp.changePassword(form)\" novalidate autocomplete=\"off\">\n		<section class=\"section\" layout=\"column\">\n			<md-input-container md-is-error=\"form.password.$error.required && form.password.$dirty\">\n				<label>Current Password</label>\n				<input name=\"password\" type=\"password\" ng-model=\"cp.user.oldPassword\" required md-autofocus mongoose-error ng-minlength=\"3\"/>\n				<div ng-messages=\"form.password.$error\" ng-if=\"form.password.$dirty\">\n					<div ng-message=\"required\">Password is required</div>\n					<div ng-message=\"mongoose\">Password is incorrect</div>\n					<div ng-message=\"minlength\">Password must be at least 3 characters.</div>\n				</div>\n			</md-input-container>\n\n			<md-input-container flex class=\"last\">\n				<label>New Password</label>\n				<input name=\"newPassword\" type=\"password\"  ng-model=\"cp.user.newPassword\" required ng-minlength=\"3\">\n				<div ng-messages=\"form.newPassword.$error\" ng-if=\"form.newPassword.$dirty\">\n					<div ng-message=\"required\">Please repeat the new password</div>\n					<div ng-message=\"minlength\">Password must be at least 3 characters.</div>\n				</div>\n			</md-input-container>\n\n			<p class=\"help-block\" ng-if=\"cp.submitted\"> {{cp.message}} </p>\n		</section>\n		<md-dialog-actions>\n			<submit-button loading=\"vm.loading\" form=\"form\" text=\"Change Password\"></submit-button>\n		</md-dialog-actions>\n\n	</form>\n  </section>\n </md-content>\n</md-dialog>");
$templateCache.put("components/login-modal/index.html","<md-dialog aria-label=\"Create a new user\" id=\"admin-user-create\" layout=\"column\" \nflex-xs=\"100\" \nflex-sm = \"75\" \nflex-md=\"75\" \nflex-lg=\"66\" \nflex-gt-lg=\"50\" \nmd-whiteframe=\"24\">\n<div ng-cloak ng-controller=\"tabsCtrl as tabs\">\n  <md-content layout=\"row\" layout-align=\"end start\">\n    <md-tabs md-dynamic-height md-border-bottom flex md-selected=\"selectedIndex\">\n      <md-tab label=\"Login\" ng-click=\"tabs.onTabSelected(\'login\')\">\n        <md-content ng-controller=\"LoginModalController as vm\" ng-include=\"\'components/login-modal/login.html\'\" class=\"md-padding\" flex></md-content>\n      </md-tab>\n      <md-tab label=\"Signup\" ng-click=\"tabs.onTabSelected(\'signup\')\">\n        <md-content ng-controller=\"SignUpModalController as signup\" class=\"md-padding\" flex> \n          <div ng-if=\"tabs.tab==\'signup\'\" ng-include=\"\'components/login-modal/signup.html\'\"></div>\n        </md-content>\n      </md-tab>\n      <md-tab></md-tab> <!--This is necessary to maintain the Login and Signup alignment-->\n    </md-tabs>\n    <a aria-label=\"Cancel Login\" ng-click=\"vm.close()\" ng-controller=\"LoginModalController as vm\">\n        <ng-md-icon icon=\"close\" aria-label=\"Close dialog\"></ng-md-icon>\n    </a>\n  </md-content>\n</div>\n<oauth-buttons></oauth-buttons>\n</md-dialog>");
$templateCache.put("components/login-modal/login.html","<section layout=\"column\" layout-align=\"start center\">\n	\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n      <div class=\"box\">\n       <p class=\"lead\">Already our customer?</p>\n            <p class=\"text-muted\" translate>\n              Be a master of effiency with the all in one platform for all your advertising content.\n              </p>\n            </p>\n      </div>\n    </div>\n\n    \n    <div class=\"col-md-6\">\n        <div style=\"width: 80%\">\n\n           <p ng-show=\"vm.error\" class=\"md-warn\">{{vm.error.message}}</p>\n\n				<form name=\"form\" ng-submit=\"vm.login(form)\" autocomplete=\"off\" novalidate flex>\n				<section class=\"section\" layout=\"column\">\n					<md-input-container md-is-error=\"(form.email.$error.required || form.email.$error.email) && form.email.$dirty\">\n						<label>Email</label>\n						<input name=\"email\" type=\"email\" ng-model=\"vm.user.email\" required md-autofocus/>\n						<div ng-messages=\"form.email.$error\" ng-if=\"form.email.$dirty\">\n							<div ng-message=\"required\">Email ID is required</div>\n							<div ng-message=\"email\">Please enter valid email address.</div>\n						</div>\n					</md-input-container>\n\n					<md-input-container md-is-error=\"form.password.$error.required && form.password.$dirty\">\n						<label>Password</label>\n						<input name=\"password\" type=\"password\" ng-model=\"vm.user.password\" required/>\n						<div ng-messages=\"form.password.$error\">\n							<div ng-message=\"required\">Password is required</div>\n							\n						</div>\n					</md-input-container>\n\n			    <div class=\"form-group has-error\">\n			    <p class=\"help-block\" ng-show=\"form.email.$error.required && form.password.$error.required && vm.submitted\">\n			       Please enter your email and password.\n			    </p>\n\n			    </div>\n			</section>\n\n			<submit-button loading=\"vm.loading\" form=\"form\" text=\"Secure Login\"></submit-button>\n			<div class=\"err\">{{ vm.errors.other }}<br/>\n			+<a ng-click=\"vm.goForgot({ email: vm.user.email})\" href=\"#\">Forgot Password</a></div>\n				\n	</form>\n        </div>\n    </div>\n    \n  </div>\n\n</section>\n");
$templateCache.put("components/login-modal/signup.html","<section layout=\"column\" layout-align=\"start center\">\n	\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n      <div class=\"box\">\n       <p class=\"lead\">Already our customer?</p>\n            <p class=\"text-muted\" translate>\n              Be a master of effiency with the all in one platform for all your advertising content.\n              </p>\n            </p>\n      </div>\n    </div>\n\n    \n    <div class=\"col-md-6\">\n        <div style=\"width: 80%\">\n<form name=\"form\" ng-submit=\"signup.register(form)\" autocomplete=\"off\" novalidate flex>\n\n			<section class=\"section\" layout=\"column\">\n				<md-input-container md-is-error=\"form.name.$error.required && form.name.$dirty\">\n					<label>Full Name</label>\n					<input name=\"name\" ng-model=\"signup.user.name\" required md-autofocus/>\n					<div ng-messages=\"form.name.$error\" ng-if=\"form.name.$dirty\">\n						<div ng-message=\"required\">Full Name is required</div>\n					</div>\n				</md-input-container>\n\n				<md-input-container flex md-is-error=\"(form.email.$error.email || form.email.$error.required || form.email.$error.mongoose || form.email.$error.remote-unique) && form.email.$dirty\">\n					<label>Email ID</label>\n					<input type=\"email\" name=\"email\" ng-model=\"signup.user.email\"\n								 ng-model-options=\"{updateOn: \'default blur\', debounce: {\'default\': 500, \'blur\': 0}}\"\n								 required mongoose-error>\n					<div ng-messages=\"form.email.$error\" ng-if=\"form.email.$dirty\">\n						<div ng-message=\"email\">Please enter a valid email address.</div>\n						<div ng-message=\"required\">Email is required</div>\n						<div ng-message=\"mongoose\">Email already in use</div>\n					</div>\n				</md-input-container>\n\n				<md-input-container md-is-error=\"form.phone.$error.required && form.phone.$dirty\">\n					<label>Phone</label>\n					<input name=\"phone\" ng-model=\"signup.user.phone\" required md-autofocus/>\n					<div ng-messages=\"form.phone.$error\" ng-if=\"form.phone.$dirty\">\n						<div ng-message=\"required\">Phone is required</div>\n					</div>\n				</md-input-container>\n\n				<md-input-container md-is-error=\"form.company.$error.required && form.company.$dirty\">\n					<label>Company</label>\n					<input name=\"company\" ng-model=\"signup.user.company\" required md-autofocus/>\n					<div ng-messages=\"form.company.$error\" ng-if=\"form.company.$dirty\">\n						<div ng-message=\"required\">Company is required</div>\n					</div>\n				</md-input-container>\n\n				<md-input-container md-is-error=\"form.website.$error.required && form.website.$dirty\">\n					<label>Website</label>\n					<input name=\"website\" ng-model=\"signup.user.website\" required md-autofocus/>\n					<div ng-messages=\"form.website.$error\" ng-if=\"form.website.$dirty\">\n						<div ng-message=\"required\">Website is required</div>\n					</div>\n				</md-input-container>\n				<md-input-container md-is-error=\"form.website.$error.required && form.website.$dirty\">\n				<md-checkbox value=\"user\">\n                    Advertiser\n                </md-checkbox>\n                <md-checkbox  value=\"admin\" ng-model=\"signup.user.role\">\n                    Publisher\n                </md-checkbox>\n				</md-input-container>\n \n\n				<md-input-container md-is-error=\"(form.password.$error.required ||  form.password.$error.mongoose || form.password.$error.minlength) && form.password.$dirty\">\n					<label>Password</label>\n					<input name=\"password\" type=\"password\" ng-model=\"signup.user.password\" required mongoose-error ng-minlength=\"3\"/>\n					<div ng-messages=\"form.password.$error\" ng-if=\"form.password.$dirty\">\n						<div ng-message=\"required\">Password is required</div>\n						<div ng-message=\"mongoose\">{{ errors.password }}</div>\n						<div ng-message=\"minlength\">Password must be at least 3 characters.</div>\n					</div>\n				</md-input-container>\n\n				<md-input-container flex class=\"last\" md-is-error=\"(form.passwordRepeat.$error.required ||  form.passwordRepeat.$error.minlength || form.passwordRepeat.$error.repeat-input) && form.passwordRepeat.$dirty\">\n					<label>Repeat Password</label>\n					<input name=\"passwordRepeat\" type=\"password\"  ng-model=\"signup.user.passwordRepeat\" required repeat-input=\"signup.user.password\" ng-minlength=\"3\">\n					<div ng-messages=\"form.passwordRepeat.$error\" ng-if=\"form.passwordRepeat.$dirty\">\n						<div ng-message=\"required\">Please repeat the new password</div>\n						<div ng-message=\"minlength\">Password must be at least 3 characters.</div>\n						<div ng-message=\"repeat-input\">The passwords do not match</div>\n					</div>\n				</md-input-container>\n\n			</section>\n		<submit-button loading=\"signup.loading\" form=\"form\" text=\"Create your account\"></submit-button>\n	</form>\n        </div>\n    </div>\n    \n  </div>\n\n</section>\n");
$templateCache.put("components/messages/airline.html","Airline Advertising\nTravelling inspires people and removes them from the distractions of their everyday routine. This is the perfect moment for brands to reach and engage with a real audience when they have the time, focus and mind-set to respond. Airline passengers tend to spend money and make decisions in their local community.  A high level of this highly desirable captive audience are the business decision makers because corporate executives often fly out regardless of the ticket cost – it is a matter of convenience because time is money!\nAirport Advertising\nAirport is positioned as a unique and unrivalled platform for advertisers to reach out to a premium audience. The MediaBox offers exciting advertising opportunities at prime locations across all terminals, including award-winning landmarks, digital networks, and dynamic static sites.\nAirport advertising delivers your message to business and leisure travelers. Whether you’re trying to raise awareness about your brand, product or service, or encourage point-of-sale, Airport ads are the way to go. Choose from a variety of traditional and experiential displays and locations that are best suited for your campaign.\nPlace your ad throughout terminals in arrival and departure areas, ticketing areas, baggage claim, gates, concourses and VIP lounges.\n\n");
$templateCache.put("components/messages/cinema.html","Cinema advertising is an excellent medium for premium audience targeting. Today, people are in full control of what they watch. As advertisers, you are constantly battling fragmented audience, declining reach, and ad-skipping technology. Who\'s even watching your ads anymore? That\'s where cinema comes in. Its audience is in full show me what you got mode - staring up at a giant screen in a dark, comfortable movie theater.\nRestaurants, bars and retail outlets surrounding cinema can appeal to consumers with special offers valid directly after the movie, and nearby service providers can connect with people who they know are active participants in the economy.\n\n");
$templateCache.put("components/messages/email.html","Non-traditional marketing strategies rely on new and unorthodox marketing methods. Anything that falls outside the categories of traditional marketing can be considered non-traditional, but the term has typically referred to a more specific range of marketing tactics.\nThe goal of non-traditional advertising is to create striking advertising experiences that capture interest through their creativity and unpredictably. Much of non-traditional marketing involves putting ads in unusual places, or displaying ads in unusual ways, hoping to command the attention of unassuming viewers.\nNon traditional advertising can encompass a variety of efforts and methods of getting your message seen.  Non-traditional advertising works well for people with a limited budget and an audience that could be easily. It’s an effective method of displaying your message and making it more memorable because of the unusual way in which it may be shown. It is useful for a very targeted audience\n");
$templateCache.put("components/messages/magazines.html","Magazine advertising has a wide range of pricing. Smaller regional and local magazines charge less than national magazines with millions of subscribers and may be a better bet for your small business, depending on your industry\nMagazine advertising doesn\'t just vary in size, but also in type. It includes display ads, advertorials, classified and special promotions.\nWhy You Should Advertise In Magazines\n<ul>\n<li>Magazines and magazine ads capture focused attention: the focused process of magazine reading leads to less media multi-tasking, ensuring single minded attention to advertising.</li>\n<li>Magazine status: some magazine titles are well respected in their field, so an advertisement in these will increase your product/service’s prestige by association.</li>\n<li>Magazine advertising is targeted: magazines engage readers in very personal ways. There’s a magazine for every passion and a passion for every magazine. Use magazines to reach your target audience in a meaningful way.</li>\n<li>Magazine advertising is relevant and welcomed: consumers value magazine advertising, reading it almost as much as the editorial itself. The ads are accepted as an essential part of the magazine mix.</li>\n<li>Magazines are credible: consumers trust magazines so much that they are the leading sources of information that readers recommend by word-of-mouth to others.</li>\n<li>Magazines offer a lasting message: ads keep working 24/7. They provide a lasting, durable message with time to study a brand’s benefits. Consumers clip and save magazine ads for future reference.</li>\n<li>Tell The Entire Brand Story - Magazines allow in-depth, detailed communication of the entire brand story.</li>\n<li>Flexibility - Magazines provide opportunities for inserts, supplements, advertorials and a variety of size and positioning options to meet any advertiser‘s specific creative needs.\nWays In Which Magazines Deliver Engagement</li>\n<li>The intimacy between reader and Magazines benefits advertisers. Also the strong positive brand values of the Magazines can transfer onto the advertisements.</li>\n<li>Because advertisements are relevant and valued, ad clutter is not a problem in Magazines.</li>\n<li>Readers take action as a result of seeing advertising in Magazines.</li>\n<li>Targeting with precision and without wastage is a key strength of Magazines.</li>\n<li>Creative formats such as gatefolds, textures, special papers, samples, sponsorship, advertisement features (‘advertorials’), and so on can create additional impact and interaction.</li>\n<li>Advertising in Magazines is a great, cost-effective way to reach an exclusive group of affluent and highly educated managers, owners, professionals and executives.</li>\nEffectiveness Of Magazine Advertising<br>\nThe effectiveness of magazine advertising depends on your advertising and promotion objectives, as well as the budget you have for advertising. Magazine advertising has strengths and weaknesses relative to other ad media. In general, you want to use media that reach your target audience and allow you to present effective messages affordably.\n\n");
$templateCache.put("components/messages/newspapers.html","<p>Advertising in Newspapers gives you an opportunity to reach out to your target audience. In order to get your brand’s advertising message out, you need to reach your consumers a number of times (i.e. frequency). Too little exposure and audiences will fail to notice the advertising. Too much, and recipients will be saturated. The Media Box is uniquely positioned to help you grow your business with highly effective, targeted print media buying.\nNewspapers are the top traditional media source to influence purchase decisions. Newspapers advertising can span across multiple columns - and can even cover full page, half page, quarter page or other custom sizes. They are designed in high resolution colored and black/white formats providing higher visibility for the mass audiences of Newspapers.</p>\n<p>The Journal of Advertising Research found “sound experimental evidence that newspaper advertising can stimulate an immediate response observable in purchasing terms.” In a study of 1200, one and a half days after ads for various brands ran in the newspaper:\n<ul>\n<li>14% more purchases of the brands advertised in the newspaper<li>\n<li>10% greater brand share for the brands advertised in the newspaper</li>\n</ul>\n	\n	\n");
$templateCache.put("components/messages/nontraditional.html","Non-traditional marketing strategies rely on new and unorthodox marketing methods. Anything that falls outside the categories of traditional marketing can be considered non-traditional, but the term has typically referred to a more specific range of marketing tactics.\nThe goal of non-traditional advertising is to create striking advertising experiences that capture interest through their creativity and unpredictably. Much of non-traditional marketing involves putting ads in unusual places, or displaying ads in unusual ways, hoping to command the attention of unassuming viewers.\nNon traditional advertising can encompass a variety of efforts and methods of getting your message seen.  Non-traditional advertising works well for people with a limited budget and an audience that could be easily. It’s an effective method of displaying your message and making it more memorable because of the unusual way in which it may be shown. It is useful for a very targeted audience\n");
$templateCache.put("components/messages/outdoor.html","If you need to make a big impact in your local area, outdoor advertising can raise your company\'s profile and deliver results. Outdoor ads put your message right in front of your potential customers.<nr>\nWhy Outdoor Advertising Works<br>\nOutdoor advertising is highly prominent and does not require the consumer to do anything to access it. You don\'t have to tune in or click onto it or turn a page. At the same time, most people regard it as less intrusive than other methods of advertising. Indeed, a lot of outdoor advertising engages the consumer, providing colour, humour and insight. In locations where it sits in front of a captive audience — on public transport or at waiting places, for instance — it can even be seen as a welcome distraction.<br>\nWhere To Advertise Outdoors<br>\nOutdoor promotion is not just about massive hoardings, pole kiosks, bus shelters etc on the side of the road. There are poster sites and sizes to suit all budgets. Your choice will be driven by how well you understand your target market. If your target market is largely defined by geographical location, a few well-chosen spots and advertising signs in your area could raise your company\'s profile and drive sales.\nOutdoor advertising on the high street catches your potential customers while they are in shopping mode. A good poster campaign can prompt shoppers to buy your products there and then, especially if you are running a promotion as an incentive.\n");
$templateCache.put("components/messages/radio.html","Busy, people are particularly strong radio listeners because of its accessibility while they are on the go – at work, driving, relaxing at home or using the internet.\nAdvantages Of Using Radio Advertising \n<ul><li>Radio’s cost-efficiency allows advertisers to be heard every day and multiple times throughout the day.</li>\n<li>	This average frequency is critically important for delivering rapid advertising response, such as – web visits, store traffic, sales, brand recall and intent-to-purchase.</li>\n<li>	Radio has strong reach across reions and each week attracts a large number of engaged listeners.</li>\n<li>	Busy, mobile people are particularly strong radio listeners because of its accessibility while they are on the go – at work, driving, walking, relaxing at home or using the internet.</li>\n<li>	Radio’s reach provides advertisers’ with cut through, campaign extension, frequency and message reinforcement.</li>\n\n\n");
$templateCache.put("components/messages/tv.html","When Should You Use TV Advertising\n<ul>\n<li>	Repositioning Your Brand: changing perceptions about a brand is a difficult task.  A strong branding effort is required to change the current association, beliefs and feelings about a brand </li>\n<li>	Changing Behavior: not all advertising is about consumption.  Sometimes it’s about trying to persuade people to change what they do. </li>\n<li>	Generate Response: your Brands can use TV\'s ability to drive people to buy directly online or offline.</li>\n<li>	Demonstration: one of TV’s greatest strength is its ability to demonstrate. Sometimes a viewer needs to see a product in action in order to understand fully its benefits.  It is the power of the moving image accompanied by sound that makes TV advertising so powerful.  Demonstration shows viewers how to consume a new product.</li>\n<li>	Customer Retention: it is much easier to retain existing customers than to find new customers. Therefore, it is really important to remind your existing customers why they love your brand. A television campaign is capable of making a customer feel proud of ‘their’ brand, remind them why they bought into the brand in the first place and of all the positive elements of the brand and keep them feeling positive and warm about their choice of brand.  Most of all it protects them against the advances of all those other brands who want to get their hands on your customers.<li>\n<li>	Launching Brands: TV is without doubt the most effective medium for launching brands.  It combines the scale and reach that a new brand needs with impact and persuasiveness.  No other medium can offer both these qualities.</li>\nWhat Environment Should Your TV Ad Be In?<br>\nPart of the planning process is determining which channels give you access to the right programmes and, ultimately, are most effective at reaching your audience.\nIn order to meet your communication objectives efficiently, it is essential that the right mix of channels is bought.\nThere are three measures that are used to describe a channel’s profile:\n<ul><li>	Age</li>\n<li>	Gender</li>\n<li>	Class</li>\nThese can be compared to either the population as a whole, or the overall profile of commercial TV\n\n");
$templateCache.put("components/modal/create.html","<md-dialog aria-label=\"Create a new user\" id=\"admin-user-create\" layout=\"column\" \nflex-xs=\"100\" \nflex-sm = \"50\" \nflex-md=\"50\" \nflex-lg=\"33\" \nflex-gt-lg=\"33\" \nclass=\"md-whiteframe-z1\">\n\n	<md-toolbar class=\"md-accent\">\n		<h3 class=\"md-toolbar-tools\">\n			Create a new {{create.title}}\n		</h3>\n	</md-toolbar>\n		<form name=\"createForm\" layout=\"column\" layout-fill layout-align=\"space-between\" ng-submit=\"create.create(createForm)\" novalidate  autocomplete=\"off\">\n\n	<md-content layout-padding class=\"md-blue-theme\">\n			<section class=\"section\" layout=\"column\">\n				<span layout=\"row\" layout-sm=\"column\" ng-repeat=\"i in create.options.columns\" ng-if=\"create.options.columns\" ng-switch=\"i.dataType\" >\n					<!-- When the field is Integer type restrict it only to float values -->\n					<md-input-container ng-cloak flex ng-switch-when=\"parseFloat\" >\n						<label>{{i.heading | labelCase}}</label>\n						<input name=\"{{i.field}}\" ng-model=\"create.item[i.field]\" ng-disabled=\"i.noAdd\" only-numbers md-autofocus=\"$index===0\">\n					</md-input-container>\n\n					<!-- When the field is Image type add URL postfix to labels -->\n					<md-input-container ng-cloak flex ng-switch-when=\"image\" >\n						<label>{{i.heading | labelCase}} URL</label>\n						<input name=\"{{i.field}}\" ng-model=\"create.item[i.field]\" ng-disabled=\"i.noAdd\" md-autofocus=\"$index===0\">\n					</md-input-container>\n\n					<!-- When boolean type add an switch -->\n					<md-input-container ng-cloak flex ng-switch-when=\"boolean\">\n							<section class=\"section slim\" layout=\"column\">\n								<span layout=\"row\" layout-align=\"start center\">\n									<span flex=\"33\"><label>{{i.heading | labelCase}}</label></span>\n									<md-switch name=\"{{i.field}}\" aria-label=\"active\" ng-model=\"create.item[i.field]\"\n									ng-disabled=\"i.noAdd\"\n									class=\"no-label\"></md-switch>\n								</span>\n							</section>\n							<span flex=\"33\"></span>\n\n					</md-input-container>\n\n					<!-- When datatype is date, integrate an calendar into it -->\n					<div ng-switch-when=\"date\" ng-cloak class=\"full-width\">\n						<mb-datepicker element-id=\'date1\'\n										 input-class=\"testClass\"\n										 input-name=\"testName\"\n										 arrows=\"arrows\"\n										 calendar-header=\"header\"\n										 date=\"date\"\n										 date-format=\"YYYY-MM-DD\"\n										 placeholder=\"{{i.heading | labelCase}}\"\n										 ></mb-datepicker>\n					</div>\n\n					<!-- When the required type is dropdown, add an dropdown menu with select options -->\n					<md-input-container ng-cloak flex ng-switch-when=\"dropdown\" class=\"dropdown\">\n		        <label>{{i.heading | labelCase}}</label>\n		        <md-select ng-model=\"create.item[i.field]\">\n		          <md-option ng-repeat=\"o in i.options\" value=\"{{o}}\">\n		            {{o}}\n		          </md-option>\n		        </md-select>\n		      </md-input-container>\n\n					<!-- When textarea type add an multiline input -->\n					<md-input-container ng-cloak flex ng-switch-when=\"textarea\">\n						<label>{{i.heading | labelCase}}</label>\n						<textarea name=\"{{i.field}}\" ng-model=\"create.item[i.field]\" ng-disabled=\"i.field==\'_id\' || i.noAdd\" md-autofocus=\"$index === 0\"></textarea>\n					</md-input-container>\n\n					<!-- When datatype of field is not defined add textbox instead -->\n					<md-input-container ng-cloak flex ng-switch-default>\n						<label>{{i.heading | labelCase}}</label>\n						<input name=\"{{i.field}}\" ng-model=\"create.item[i.field]\" ng-disabled=\"i.field==\'_id\' || i.noAdd\" md-autofocus=\"$index === 0\">\n					</md-input-container>\n\n			</span>\n			</section>\n	</md-content>\n\n	<md-dialog-actions layout=\"row\">\n		<md-button ng-click=\"create.close()\" aria-label=\"Close Add Modal\">Cancel</md-button>\n		<md-button ng-disabled=\"createForm.$invalid\" type=\"submit\" class=\"md-primary md-raised\" aria-label=\"Insert a new {{create.title}}\"> Create </md-button>\n	</md-dialog-actions>\n		</form>\n\n</md-dialog>\n");
$templateCache.put("components/navbar/cart.html","<md-sidenav class=\"md-sidenav-right md-whiteframe-z2\" md-component-id=\"cart\" style=\"width: 500px\">\n  <md-toolbar class=\"md-theme-light\">\n    <h1 class=\"md-toolbar-tools\">Cart Details</h1>\n  </md-toolbar>\n  <md-content class=\"cart-content\">\n    <form>\n      <div layout=\"row\" layout-align=\"space-between start\" ng-repeat=\"item in vm.cart.items\" class=\"cart-item md-whiteframe-z1\">\n            <img  class=\"md-whiteframe-z1\" width=\"80px\" height=\"100%\" data-ng-src=\"data:image/png;base64,{{item.image}}\" err-SRC=\"/assets/images/50x50-426bbf102a.png\"  alt=\"{{item.name}}\" />\n            <div layout=\"column\" flex style=\"margin-left: 5px\">\n                <div >{{ item.name }} <span ng-if=\"item.size\">(Size: {{item.size}})</span></div>\n                <div>{{ item.price | currency:vm.Settings.currency.symbol }} * {{item.quantity}} = \n                <strong>{{item.price * item.quantity | currency:vm.Settings.currency.symbol}}</strong></div>\n                <div layout=\"row\" layout-align=\"center center\">\n <!--Cart buttons-->\n        <md-button class=\"md-raised md-primary small-button md-icon-button\" \n              ng-click=\"vm.cart.addItem({sku:item.sku, name:item.name, slug:item.slug, mrp:item.mrp, price:item.price, weight:item.weight, vid:item.vid}, -1)\" \n              aria-label=\"Remove from cart\">\n                  <ng-md-icon icon=\"remove\"></ng-md-icon>\n        </md-button>\n        <div class=\"md-raised\"  ng-disabled=\"true\" aria-label=\"Cart quantity\">{{vm.cart.getQuantity(item.sku, item.vid)}}</div>\n        <md-button class=\"md-raised md-primary small-button md-icon-button\" ng-click=\"vm.cart.addItem({sku:item.sku, name:item.name, slug:item.slug, mrp:item.mrp, price:item.price, weight:item.weight, vid:item.vid}, +1)\" aria-label=\"Add to cart\">\n                  <ng-md-icon icon=\"add\"></ng-md-icon>\n        </md-button>\n <!--Cart buttons-->\n\n      </div>\n            </div>\n            <a aria-label=\"Remove {{item.name}} from cart\" ng-click=\"vm.cart.addItem({sku:item.sku, vid: item.vid}, -10000000);vm.openCart()\">\n                <ng-md-icon icon=\"close\" aria-label=\"Close dialog\"></ng-md-icon>\n            </a>\n      </div>\n    </form>\n    <div ng-if=\"vm.cart.getTotalPrice()>0\"><b>Handling Fee:</b> \n      \n      <span >{{vm.Settings.handlingFee}} =>{{vm.cart.getHandlingFee() | currency:vm.Settings.currency.symbol}}</span>\n    </div>\n    <div ng-if=\"vm.cart.getTotalPrice()>0\"><b>Total:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b> {{vm.cart.getTotalPrice()  | currency:vm.Settings.currency.symbol}}</div>\n    <div class=\"md-dialog-actions\" layout=\"row\" layout-align=\"space-between center\">\n        <md-button ui-sref=\"cart\" class=\"md-raised circular-progress-button md-primary\" aria-label=\"Checkout\" ng-disabled=\"vm.cart.items.length <= 0\">\n            <span ng-show=\"!vm.loading\"><ng-md-icon icon=\"local_grocery_store\" hide-xs></ng-md-icon>Configure Campaign →</span>\n            <md-progress-circular md-mode=\"indeterminate\" md-diameter=\"25\" ng-show=\"vm.loading\" class=\"md-accent md-hue-1\"></md-progress-circular><span ng-show=\"vm.loading\">Loading...</span>\n        </md-button>\n        <md-button class=\"btn btn-default btn-lg btn-register\" ng-click=\"vm.close()\"  aria-label=\"Cancel Cart Menu\"> Close </md-button>\n    </div>\n  </md-content>\n</md-sidenav>\n\n\n");
$templateCache.put("components/navbar/navbar.html","<div ng-include=\"\'components/navbar/cart.html\'\"></div>\n<div >\n<!-- *** TOPBAR ***\n_________________________________________________________ -->\n<div id=\"top\">\n    <div class=\"container\">\n         <div class=\"col-md-10 offer\" data-animate=\"fadeInDown\">\n            <a href=\"#\" class=\"btn btn-success btn-sm\" data-animate-hover=\"shake\">Choose</a>  <a href=\"#\"><small> from hundreds of media options listed on Mediabox. Smart filters and Recommendations help you choose the right media option for you.</small></a>\n        </div>\n        <div class=\"col-md-2\" data-animate=\"fadeInDown\">\n           <top-menu ng-if=\"!search.show\"></top-menu> \n        </div>\n    </div>\n   </div>\n\n<!-- *** TOP BAR END *** -->\n\n<!-- *** NAVBAR ***\n_________________________________________________________ -->\n\n<div class=\"navbar navbar-default yamm\" role=\"navigation\" id=\"navbar\">\n    <div class=\"container\">\n  <div class=\"col-md-12\">\n        <div class=\"navbar-header\">\n\n            <a class=\"navbar-brand home\" href=\"index.html\" data-animate-hover=\"bounce\">\n                <img src=\"/assets/img/logo.png\"  class=\"hidden-xs\">\n                <img src=\"/assets/img/logo.png\"  class=\"visible-xs\"><span class=\"sr-only\"></span>\n            </a>\n            <div class=\"navbar-buttons\">\n                <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#navigation\" ng-click=\"isCollapsed1 = !isCollapsed1\">\n                    <span class=\"sr-only\">Toggle navigation</span>\n                    <i class=\"fa fa-align-justify\"></i>\n                </button>\n                \n               \n\n            </div>\n        </div>\n        <!--/.navbar-header -->\n\n        <div class=\"navbar-collapse collapse navbar-static-top megamenu\" id=\"navigation\">\n          <div collapse=\"isCollapsed1\" class=\"navbar-collapse collapse\" id=\"navbar-main2\">\n            <ul class=\"nav navbar-nav navbar-left\" ng-hide=\"isAdmin()\">\n                <li class=\"dropdown yamm-fw\" ng-repeat=\"p in vm.categories\">\n                    <a href=\"Category/{{p.slug}}/{{p._id}}\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" data-hover=\"dropdown\" data-delay=\"200\">{{p.name}} <b class=\"caret\"></b></a>\n                    <ul class=\"dropdown-menu\">\n                        <li>\n                            <div class=\"yamm-content\">\n                                <div class=\"row\">\n                                    <div class=\"col-sm-3\" ng-repeat=\"h in p.child\">\n                                        <!-- <h5>All</h5> -->\n                                        <ul>\n                                            <li><a href=\"/Category/{{h.slug}}/{{h._id}}\">{{h.name}}</a>\n                                            </li>\n                                        </ul>\n                                    </div>\n                                </div>\n                            </div>\n                            <!-- /.yamm-content -->\n                        </li>\n                    </ul>\n                </li>\n            </ul>\n\n          </div>\n        </div>\n        <!--/.nav-collapse -->\n\n        <div class=\"navbar-buttons\">\n              <md-button ng-click=\"vm.openCart()\" class=\"md-raised cart\" ng-if=\"!search.show\">\n                    <ng-md-icon icon=\"shopping_cart\"></ng-md-icon>\n                    <span  show-gt-sm>Cart {{vm.cart.getTotalCount()}} Items  </span>\n                    <span hide show-gt-sm odometer=\"vm.cart.getTotalPrice()\">\n                  </md-button>\n            <!--/.nav-collapse -->\n\n            <!-- <div class=\"navbar-collapse collapse right\" id=\"search-not-mobile\">\n                <button type=\"button\" class=\"btn navbar-btn btn-danger\" data-toggle=\"collapse\" data-target=\"#search\">\n                    <span class=\"sr-only\">Toggle search</span>\n                    <i class=\"fa fa-search\"></i>\n                </button>\n            </div> -->\n\n        </div>\n\n        <div class=\"collapse clearfix\" id=\"search\">\n           <div class=\"search\" layout=\"row\" layout-align=\"center center\" flex ng-if=\"search.show || vm.$mdMedia(\'gt-xs\')\">\n        <div class=\"searchbox\" layout=\"row\" layout-align=\"center center\" flex>\n            <form ng-submit=\"$event.preventDefault()\" flex>\n                <md-autocomplete\n                    ng-cloak\n                    md-selected-item=\"vm.selectedItem\"\n                    md-search-text-change=\"vm.searchTextChange(vm.searchText)\"\n                    md-search-text=\"vm.searchText\"\n                    md-selected-item-change=\"vm.selectedItemChange(item)\"\n                    md-items=\"item in vm.querySearch(vm.searchText)\"\n                    md-item-text=\"item.name\"\n                    md-min-length=\"1\"\n                    placeholder=\"Search for product here\"\n                    md-menu-class=\"navbar-autocomplete\">\n                    <md-item-template>\n                        <img ng-if=\"item.variants[0].image\" \n                        ng-src=\"{{item.variants[0].image}}\" err-SRC=\"/assets/images/material-shop-15b7652109.jpg\"/>\n            <span md-highlight-text=\"vm.searchText\">{{item.name}}</span>\n                    </md-item-template>\n          <md-not-found>\n            No item matching \"{{vm.searchText}}\" were found.\n          </md-not-found>\n                </md-autocomplete>\n            </form>\n\n        </div>\n    </div>\n        </div>\n        <!--/.nav-collapse -->\n\n    </div>\n    <!-- /.container -->\n</div>\n<!-- /#navbar -->\n</div>\n<!-- *** NAVBAR END *** -->\n</div>\n");
$templateCache.put("components/navbar-public/navbar-public.html","<div ng-include=\"\'components/navbar/cart.html\'\"></div>\n<md-toolbar ng-show=\"!showSearch\" class=\"md-whiteframe-2dp\">\n  <div class=\"md-toolbar-tools navbar\" layout=\"row\" layout-align=\"space-between center\">\n    <md-button ng-click=\"vm.openFilter()\" aria-label=\"Left Menu\" ng-hide=\"vm.hideLeftMenu\" hide-gt-md>\n      <ng-md-icon icon=\"menu\"></ng-md-icon>\n    </md-button>\n    <h3><a ui-sref=\"/\">Mediabox</a></h3>\n    <div class=\"search\" hide-xs>\n        <div class=\"searchbox\">\n            <form ng-submit=\"$event.preventDefault()\" flex>\n                <md-autocomplete\n                    md-selected-item=\"vm.selectedItem\"\n                    md-search-text-change=\"vm.searchTextChange(vm.searchText)\"\n                    md-search-text=\"vm.searchText\"\n                    md-selected-item-change=\"vm.selectedItemChange(item)\"\n                    md-items=\"item in vm.querySearch(vm.searchText)\"\n                    md-item-text=\"item.name\"\n                    md-min-length=\"1\"\n                    placeholder=\"Search for anything here\"\n                    md-menu-class=\"navbar-autocomplete\">\n                    <md-item-template>\n                        <img ng-if=\"item.variants[0].image\" \n                        ng-src=\"{{item.variants[0].image}}\" err-SRC=\"/assets/images/material-shop-15b7652109.jpg\"/>\n						<span md-highlight-text=\"ctrl.searchText\" md-highlight-flags=\"^i\">{{item.name}}</span>\n                    </md-item-template>\n					<md-not-found>\n						No item matching \"{{vm.searchText}}\" were found.\n					</md-not-found>\n                </md-autocomplete>\n            </form>\n\n            <md-button aria-label=\"Search\" ng-click=\"showSearch = !showSearch\" class=\"md-raised md-warn\">\n                <ng-md-icon icon=\"search\"></ng-md-icon> Search\n            </md-button>\n        </div>\n    </div>\n    <md-button ng-click=\"vm.openCart()\" aria-label=\"Left Menu\" class=\"md-raised cart\">\n      <ng-md-icon icon=\"shopping_cart\"></ng-md-icon>\n      <span hide-xs>Cart ({{vm.cart.getTotalCount()}}) -</span> {{vm.cart.getTotalPrice() | currency:vm.Settings.currency.symbol}}  \n    </md-button>\n <top-menu></top-menu> \n  </div>\n</md-toolbar>\n\n<div id=\"wrapper\">\n\n	<!-- begin nav -->\n	<nav>\n		<ul id=\"menu\">\n			<li ng-repeat=\"c in vm.categories\"><a href=\"#\">{{c.name}}</a>\n				<div id=\"mega\" style=\"z-index:10000\">\n					\n					<ul ng-repeat=\"h in c.child\">\n						<li><a href=\"/Category/{{h.slug}}/{{h._id}}\" class=\"header\">{{h.name}}</a>\n							\n							<ul>\n								<li ng-repeat=\"i in h.child\"><a href=\"/Category/{{i.slug}}/{{i._id}}\">{{i.name}}</a></li>\n							</ul>\n						\n						</li>\n						<!--<li ng-repeat=\"i in h.subcat\"><a href=\"#\">{{i.name}}</a></li>-->\n						\n					</ul>\n				\n				</div>\n			</li>\n		</ul>\n\n	</nav><!-- /nav -->\n	\n</div><!-- /wrapper -->\n");
$templateCache.put("components/oauth-buttons/oauth-buttons.html","<div flex layout=\"row\" layout-align=\"center\">\n<md-button class=\"md-raised md-primary md-hue-2\" aria-label=\"Connect with Facebook\" ng-click=\"OauthButtons.loginOauth(\'facebook\')\" ng-disabled=\"OauthButtons.facebookLoading\">\n    <span  layout=\"row\" layout-align=\"center center\">\n        <ng-md-icon icon=\"facebook\" ng-hide=\"OauthButtons.facebookLoading\"></ng-md-icon> \n        <md-progress-circular md-mode=\"indeterminate\" md-diameter=\"25\" ng-show=\"OauthButtons.facebookLoading\" class=\"md-accent md-hue-1\"></md-progress-circular>\n        <span hide show-gt-sm>&nbsp;Connect with Facebook</span>\n    </span>\n</md-button>\n<md-button class=\"md-raised md-warn md-hue-2\" aria-label=\"Connect with Google\" ng-click=\"OauthButtons.loginOauth(\'google\')\" ng-disabled=\"OauthButtons.googleLoading\">\n    <span  layout=\"row\" layout-align=\"center center\">\n        <ng-md-icon icon=\"google-plus\" ng-hide=\"OauthButtons.googleLoading\"></ng-md-icon> \n        <md-progress-circular md-mode=\"indeterminate\" md-diameter=\"25\" ng-show=\"OauthButtons.googleLoading\" class=\"md-accent md-hue-1\"></md-progress-circular>\n        <span hide show-gt-sm>&nbsp;Connect with Google</span>\n    </span>\n</md-button>\n<md-button class=\"md-raised md-primary\" aria-label=\"Connect with Twitter\" ng-click=\"OauthButtons.loginOauth(\'twitter\')\" ng-disabled=\"OauthButtons.twitterLoading\">\n    <span  layout=\"row\" layout-align=\"center center\">\n        <ng-md-icon icon=\"twitter\" ng-hide=\"OauthButtons.twitterLoading\"></ng-md-icon>\n        <md-progress-circular md-mode=\"indeterminate\" md-diameter=\"25\" ng-show=\"OauthButtons.twitterLoading\" class=\"md-accent md-hue-1\"></md-progress-circular>\n        <span hide show-gt-sm>&nbsp;Connect with Twitter</span>\n    </span>\n</md-button>\n</div>\n");
$templateCache.put("components/repeat-input/repeat-input.html","<div>this is the repeatInput directive</div>\n");
$templateCache.put("components/right-menu/right-menu.html","<md-sidenav class=\"md-sidenav-right md-whiteframe-z2\" md-component-id=\"right\">\n  <md-toolbar class=\"md-theme-light\">\n    <h1 class=\"md-toolbar-tools\">Sidenav Right</h1>\n  </md-toolbar>\n  <md-content layout-padding>\n    <form>\n      <md-input-container>\n        <label for=\"testInput\">Test input</label>\n        <input type=\"text\" id=\"testInput\"\n               ng-model=\"data\" md-autofocus>\n      </md-input-container>\n    </form>\n    <md-button ng-click=\"close()\" class=\"md-primary\" aria-label=\"Right Menu\">\n      Close Sidenav Right\n    </md-button>\n  </md-content>\n</md-sidenav>\n");
$templateCache.put("components/toast/toast.html","<md-toast>\n	<span flex>{{::vm.text}}</span>\n\n	<md-button class=\"md-primary\"\n						 ng-class=\"{\'md-accent\': vm.type === \'warn\'}\"\n						 ng-if=\"::vm.link\"\n						 ng-click=\"vm.showItem()\"\n						 aria-label=\"{{::vm.text}}\">\n		Show\n	</md-button>\n\n	<span ng-if=\"::vm.link\">|</span>\n\n	<md-button ng-click=\"vm.close()\" aria-label=\"OK\">OK</md-button>\n</md-toast>\n");
$templateCache.put("components/top-menu/top-menu.html","<md-button aria-label=\"Login / Signup\" ng-click=\"topmenu.showLogin()\" ng-if=\"!topmenu.isLoggedIn()\" style=\"color:#fff\">\n    <ng-md-icon icon=\"person\" md-menu-align-target></ng-md-icon>\n    <span hide-xs>Login / Signup</span>\n</md-button>\n\n<!-- Dropdown Menu Starts here -->\n   <md-menu style=\"color:#fff\">\n    <md-button ng-click=\"topmenu.openMenu($mdOpenMenu, $event)\"  ng-show=\"topmenu.isLoggedIn()\">\n      <ng-md-icon icon=\"face\" md-menu-align-target></ng-md-icon>\n      <!--<md-icon class=\"avatar-icon\" md-svg-icon=\"avatar:svg-{{ (0 + 1) % 11 }}\"></md-icon>-->\n      <span hide-xs>{{topmenu.Auth.getCurrentUser().name | labelCase}}</span>\n      <ng-md-icon icon=\"more_vert\"></ng-md-icon>\n    </md-button>\n    <md-menu-content width=\"4\" class=\"navMenu\" ng-show=\"topmenu.menu\">\n<!-- // Auth items -->\n      <md-menu-item ng-repeat=\"item in topmenu.menu.auth\" ui-sref-active=\"active\" ng-if=\"!topmenu.isLoggedIn()\" ui-sref=\"{{item.url}}\">\n        <md-button aria-label=\"{{item.text}}\">\n          <ng-md-icon icon=\"{{item.icon}}\" md-menu-align-target></ng-md-icon>\n          {{item.text}}\n        </md-button>\n      </md-menu-item>\n\n<!-- // Admin Pages -->\n      <md-subheader ng-if=\"topmenu.isLoggedIn()\">Pages</md-subheader>\n      <md-menu-item ng-repeat=\"item in topmenu.menu.pages\" ui-sref-active=\"active\" ng-if=\"topmenu.isLoggedIn() && item.authenticate && topmenu.hasRole(item.role)\" ui-sref=\"{{item.url}}\">\n        <md-button aria-label=\"{{item.text}}\">\n          <ng-md-icon icon=\"{{item.icon}}\" md-menu-align-target></ng-md-icon>\n          {{item.text}}\n        </md-button>\n      </md-menu-item>\n\n<!-- // Public Pages -->\n      <md-menu-item ng-repeat=\"item in topmenu.menu.pages\" ui-sref-active=\"active\" ng-if=\"!item.authenticate\" ui-sref=\"{{item.url}}\">\n        <md-button aria-label=\"{{item.text}}\">\n          <ng-md-icon icon=\"{{item.icon}}\" md-menu-align-target></ng-md-icon>\n          {{item.text}}\n        </md-button>\n      </md-menu-item>\n\n<!-- // User Management -->\n      <md-subheader ng-if=\"topmenu.isLoggedIn()\"> User</md-subheader>\n      <md-menu-item ng-repeat=\"item in topmenu.menu.user\" ui-sref-active=\"active\" ng-if=\"topmenu.isLoggedIn() && topmenu.hasRole(item.role)\" ui-sref=\"{{item.url}}\">\n        <md-button aria-label=\"{{item.text}}\">\n          <ng-md-icon icon=\"{{item.icon}}\" md-menu-align-target></ng-md-icon>\n          {{item.text}}\n        </md-button>\n      </md-menu-item>\n\n    </md-menu-content>\n  </md-menu>\n");
$templateCache.put("components/user-avatar/user-avatar.html","<div>this is the userAvatar directive</div>\n");
$templateCache.put("app/admin/admin.html","<crud-table api=\'user\' options=\'admin.options\' noAdd noCopy></crud-table>\n");
$templateCache.put("app/address/address.html","<navbar></navbar>\n<div flex layout=\"column\" layout-gt-xs=\"row\" layout-align=\"center stretch\">\n\n<div layout=\"column\" layout-gt-sm=\"<column></column>\">\n<!--Address box-->\n<md-card ng-show=\"address.showAddressForm\">\n    <md-card-content>\n	<p ng-show=\"address.error\" class=\"md-warn\">{{address.error.message}}</p>\n	<h3>SELECTED ADDRESS</h3>\n	<form name=\"form\" ng-submit=\"address.saveAddress(address.addr);new.address=false;address.addr = address.address[0];\" novalidate layout=\"column\">\n		<md-input-container md-is-error=\"(form.name.$error.required || form.name.$error.name) && form.name.$dirty\">\n			<label>Name</label>\n			<input name=\"name\" type=\"name\" ng-model=\"address.addr.name\" required autofocus>\n			<div ng-messages=\"form.name.$error\" ng-if=\"form.name.$dirty\">\n				<div ng-message=\"required\">Name is required</div>\n			</div>\n		</md-input-container>\n        \n        <md-input-container md-is-error=\"(form.addr.$error.required || form.addr.$error.addr) && form.addr.$dirty\">\n			<label>Address</label>\n			<input name=\"address\" type=\"address\" ng-model=\"address.addr.address\" required/>\n			<div ng-messages=\"form.address.$error\" ng-if=\"form.address.$dirty\">\n				<div ng-message=\"required\">Address is required</div>\n			</div>\n		</md-input-container>\n        \n        <md-input-container md-is-error=\"(form.city.$error.required || form.city.$error.city) && form.city.$dirty\">\n			<label>City</label>\n			<input name=\"city\" type=\"city\" ng-model=\"address.addr.city\" required/>\n			<div ng-messages=\"form.city.$error\" ng-if=\"form.city.$dirty\">\n				<div ng-message=\"required\">City is required</div>\n			</div>\n		</md-input-container>\n\n        <md-input-container md-is-error=\"(form.zip.$error.required || form.zip.$error.zip) && form.zip.$dirty\">\n			<label>Zip</label>\n			<input name=\"zip\" type=\"zip\" ng-model=\"address.addr.zip\" required only-numbers/>\n			<div ng-messages=\"form.zip.$error\" ng-if=\"form.zip.$dirty\">\n				<div ng-message=\"required\">Zip code is required</div>\n			</div>\n		</md-input-container>\n        \n        <md-input-container md-is-error=\"(form.state.$error.required || form.state.$error.state) && form.state.$dirty\">\n			<label>State</label>\n			<input name=\"state\" type=\"state\" ng-model=\"address.addr.state\" required/>\n			<div ng-messages=\"form.state.$error\" ng-if=\"form.state.$dirty\">\n				<div ng-message=\"required\">State is required</div>\n			</div>\n		</md-input-container>\n        \n        <md-input-container md-is-error=\"(form.phone.$error.required || form.phone.$error.phone) && form.phone.$dirty\">\n			<label>Phone</label>\n			<input name=\"phone\" type=\"phone\" ng-model=\"address.addr.phone\" required/>\n			<div ng-messages=\"form.phone.$error\" ng-if=\"form.phone.$dirty\">\n				<div ng-message=\"required\">Phone number is required</div>\n			</div>\n		</md-input-container>\n\n        <!--<md-input-container md-is-error=\"(form.country.$error.required || form.country.$error.country) && form.country.$dirty\">\n            <label>Country</label>\n            <input ng-model=\"address.addr.country\" ng-value=\"address.Settings.country.name\" disabled/>\n            <div ng-messages=\"form.country.$error\" ng-if=\"form.country.$dirty\">\n				<div ng-message=\"required\">Country required</div>\n			</div>\n		</md-input-container>-->\n\n        <div layout=\"row\">\n            <md-button type=\"submit\" class=\"md-raised md-primary\" \n            ng-disabled=\"!form.$valid || address.loadingAddress\" aria-label=\"Save Address\" layout=\"row\">\n                <ng-md-icon icon=\"save\" ng-hide=\"address.loadingAddress\"></ng-md-icon>\n                <md-progress-circular md-mode=\"indeterminate\" md-diameter=\"25\" ng-show=\"address.loadingAddress\" class=\"md-accent md-hue-1\"></md-progress-circular>\n                Save <span hide show-gt-xs>as Primary Address</span>\n            </md-button>\n            <md-button ng-click=\"address.cancelForm(address.addr);new.address=false;\">Cancel</md-button>\n	   </div>\n       </form>\n    </md-card-content>\n</md-card>\n<div layout=\"column\">\n<md-button class=\"md-raised\" ng-click=\"address.addressForm(true);address.new.address=true; address.addr={country: address.Settings.country.name}\">\n    <ng-md-icon icon=\"location_on\"></ng-md-icon>Add New Address\n</md-button>\n<div layout=\"row\" layout-align=\"start start\" layout-wrap>\n\n<md-card  \nng-repeat=\"a in address.address\" \nng-click=\"new.address=false; address.addressForm(true);address.switchAddress(a)\" \nstyle=\"min-width:300px\" \nng-class=\"{\'selected\':(a==address.addr)} \"\n>\n      <md-card-header layout=\"row\" layout-align=\"space-between start\">\n          <md-card-header-text>\n            <h3>ADDRESS - {{$index+1}}</h3>\n          </md-card-header-text>\n          	<div>\n				  <md-button ng-click=\"address.delete(a)\" aria-label=\"Delete Address\"><ng-md-icon icon=\"delete\"></ng-md-icon></md-button>  \n			</div>				  \n      </md-card-header>\n	  \n      <md-card-content layout=\"column\" layout-align=\"start start\">\n			{{a.name}}<br/>\n            {{a.address}}<br/>\n            {{a.city}}<br/>\n            {{a.state}}<br/>\n            {{a.zip}}<br/>\n            {{a.phone}}\n      </md-card-content>\n      \n</md-card>\n</div><!--Address box-->\n</div>\n</div>\n\n</div>\n<footer></footer>\n");
$templateCache.put("app/book/book.html","<crud-table api=\'book\' options=\'options\'></crud-table>\n");
$templateCache.put("app/brand/brand.html","<crud-table api=\'brand\' options=\'options\'></crud-table>\n");
$templateCache.put("app/brandmg/brandmg.html","<crud-table api=\'BrandMG\' options=\'options\'></crud-table>\n");
$templateCache.put("app/brandtv/brandtv.html","<crud-table api=\'BrandTV\' options=\'options\'></crud-table>\n");
$templateCache.put("app/campaign/campaign.html","<navbar leftmenu=\"true\"></navbar>\n<left-menu></left-menu>\n\n<md-content class=\"content md-padding\" layout=\"column\" layout-align=\"start center\">\n      <section ng-if=\"campaign.campaigns.length >0\" class=\"header\" layout=\"column\" layout-align=\"center center\">\n        <h1>Your Campaigns</h1>\n        <md-input-container flex>\n          <label>Search Campaigns</label>\n          <input name=\"search\" type=\"text\" ng-model=\"campaign.search\" md-autofocus/>\n        </md-input-container>\n      </section>\n\n      <!--When No Campaigns-->\n      <section ng-if=\"campaign.Campaigns.length===0\" class=\"header\" layout=\"column\" layout-align=\"center stretch\">\n        <h1>You have not run anything yet .Start using Mediabox to launch advertising campaigns anywhere .No back and forth</h1>\n        <md-button ui-sref=\"/\" class=\"md-primary md-raised\">\n        <ng-md-icon icon=\"shopping_cart\"></ng-md-icon>Start Now\n\n        </md-buton>\n      </section>\n\n  <section layout=\"column\" class=\"campaigns\">\n  <md-card ng-repeat=\"o in campaign.campaigns | orderBy : \'campaignDate\' : \'reverse\' | filter:order.search\">\n      <md-card-header>\n          <md-card-header-text>\n            <span class=\"\">Campaign PLACED</span>\n            <span class=\"md-subhead\">{{o.created_at | amCalendar}}</span>\n          </md-card-header-text>\n          <md-card-header-text>\n            <span class=\"\">TOTAL</span>\n            <span class=\"md-subhead\">{{o.amount.total | localPrice}}</span>\n          </md-card-header-text>\n          <md-card-header-text hide show-gt-sm>\n            <span class=\"\">SHIP TO</span>\n            <span class=\"md-subhead\">{{o.address.recipient_name}}</span>\n          </md-card-header-text>\n          <md-card-header-text>\n            <span class=\"\">Campaign # </span>\n            <span class=\"md-subhead\">{{o.campaignNo}}</span>\n          </md-card-header-text>\n      </md-card-header>\n      <md-card-content layout=\"column\" layout-gt-sm=\"row\" layout-align=\"space-between\">\n          <md-list flex=40>\n            <div layout=\"row\" ng-repeat=\"i in o.items\">\n              <md-card-avatar>\n                  <img ng-src=\"{{i.url}}\" err-SRC=\"/assets/images/150x150-51101e3000.png\" alt=\"{{i.name}}\" width=\"100px\" hide show-gt-xs>\n              </md-card-avatar>\n              <div class=\"content\">\n              <a >{{i.name}}</a><br/><br/>\n              <b>Amount:&nbsp;&nbsp;</b> {{i.price | currency}} * {{i.quantity}}&nbsp;=&nbsp;{{i.price * i.quantity | currency}}\n              \n              <br/>\n                <cart-buttons variant=\"i\" product=\"o\">\n              </div>\n            </div>\n          </md-list>\n            <md-list class=\"campaign-address\" flex=30>\n                  <ng-md-icon icon=\"local_shipping\"></ng-md-icon>&nbsp;Status\n                  <hr>\n                \n                  <p class=\"md-subhead\">Campaign Status: &nbsp;{{o.status}}</p>\n                  \n           </md-list>\n      </md-card-content>\n  </md-card>\n  </section>\n</md-content>\n<footer></footer>\n");
$templateCache.put("app/campaigns/campaigns.html","<navbar leftmenu=\"true\"></navbar>\n<left-menu></left-menu>\n<md-content flex class=\"content md-padding\" layout=\"column\" layout-align=\"start center\">\n      <section class=\"header\" layout=\"column\" layout-align=\"center center\">\n        <h2>campaigns Management</h2>\n        <md-input-container flex>\n          <label>Search campaigns</label>\n          <input name=\"search\" type=\"text\" ng-model=\"campaigns.search\" md-autofocus/>\n        </md-input-container>\n      </section>\n  <section layout=\"column\" class=\"campaigns\">\n  <md-card ng-repeat=\"o in campaigns.campaigns | orderBy : \'orderDate\' : \'reverse\' | filter:campaigns.search\">\n      <md-card-header layout=\"row\">\n        <div layout=\"row\">\n          <md-card-header-text>\n            <span class=\"\"># {{o.orderNo}}</span>\n            <span class=\"md-subhead\">{{o.created_at | amCalendar}}</span>\n          </md-card-header-text>\n          <md-card-header-text>\n            <span class=\"\">TOTAL</span>\n            <span class=\"md-subhead\">{{o.amount.total | localPrice}}</span>\n          </md-card-header-text>\n        </div>\n        <div layout=\"column\" layout-gt-sm=\"row\" flex>\n          <md-card-header-text>\n            <span class=\"\">Payment </span>\n            <span class=\"md-subhead\">{{o.payment_method}}</span>\n          </md-card-header-text>\n          <md-card-header-text>\n            <span class=\"\">Order Status</span>\n            <span class=\"md-subhead\">\n              <md-select ng-model=\"o.status\" placeholder=\"Order Status\" ng-change=\"campaigns.changeStatus(o)\" flex>\n                <md-option ng-value=\"o\" ng-repeat=\"o in campaigns.Settings.campaignstatus\">{{o}}</md-option>\n              </md-select>\n            </span>\n          </md-card-header-text>\n          <md-card-header-text>\n            <span class=\"\">Payment Status </span>\n            <span class=\"md-subhead\">\n              <md-select ng-model=\"o.payment.state\" placeholder=\"Payment Status\" ng-change=\"campaigns.changeStatus(o)\">\n                <md-option ng-value=\"o\" ng-repeat=\"o in campaigns.Settings.paymentStatus\">{{o}}</md-option>\n              </md-select>\n            </span>\n          </md-card-header-text>\n        </div>\n      </md-card-header>\n      <md-card-content layout=\"column\" layout-gt-sm=\"row\" layout-align=\"space-between\">\n          <md-list flex=40>\n            <div layout=\"row\" ng-repeat=\"i in o.items\">\n              <md-card-avatar>\n                 <img ng-src=\"{{i.url}}\" err-SRC=\"/assets/images/150x150-51101e3000.png\" class=\"md-card-image\" alt=\"{{i.name}}\" width=\"100px\" hide show-gt-xs>\n              </md-card-avatar>\n              \n              <div class=\"content\">\n              <a ng-click=\"campaigns.navigate(i)\">{{i.name}}</a><br/><br/>\n              <b>Amount:&nbsp;&nbsp;</b> {{i.price | localPrice}} * {{i.quantity}}&nbsp;=&nbsp;{{i.price * i.quantity | localPrice}}\n              <div ng-if=\"i.amount.details.shipping>0\"><b>Shipping: </b> {{i.amount.details.shipping | localPrice}}</div>\n              <br/>\n                \n              </div>\n            </div>\n          </md-list>\n                <md-list class=\"md-list-item-text order-address\" flex=30>\n                  <ng-md-icon icon=\"local_shipping\"></ng-md-icon>&nbsp;Address\n                  <hr>\n                  {{o.address.recipient_name}}<br/>\n                  {{o.address.line1}}<br/>\n                  {{o.address.city}}<br/>\n                  {{o.address.postal_code}}<br/>\n                  {{o.address.state}}<br/>\n                  {{o.phone}}<br/>\n                  {{o.address.country_code}}<br/>\n                </md-list>\n      </md-card-content>\n  </md-card>\n  </section>\n</md-content>\n<footer></footer>\n");
$templateCache.put("app/cart/cart.html","<navbar leftmenu=\"true\"></navbar>\n<left-menu></left-menu>\n<md-content  class=\"container \" layout=\"column\">\n      <section class=\"header\" layout=\"column\" >\n        <div class=\"col-sm-12 \">\n                    <div class=\"box\">\n                      <div class=\"row\">\n                            <div  class=\"col-xs-3 stats-graph\">\n                             <md-input-container>\n                              <label>Campaign Name</label>\n                               <input   value=\"{{vm.cart.campaignName}}\" ng-model= \"vm.cart.campaignName\"\\>\n                                </md-input-container>\n                            \n                            </div>\n                            <div  class=\"col-xs-6 stats-graph\">\n                            <h4 class=\"section-header\"></h4>\n                                <div class=\"row\">\n                                  <div class\"col-md-12\">\n                                    <md-input-container>\n                                        <label>Campaign Objective</label>\n                                        <textarea name=\"objectives\" cols=\"50\" rows=\"2\" ng-model=\"vm.cart.objectives\" md-maxlength=\"150\"></textarea>\n                                        <div ng-messages=\"userForm.bio.$error\" ng-show=\"userForm.bio.$dirty\">\n                                          <div ng-message=\"required\">This is required!</div>\n                                          <div ng-message=\"md-maxlength\">That\'s too long!</div>\n                                        </div>\n                                      </md-input-container>\n                                  </div>\n                                 \n                                </div>\n                                \n                                  \n                                 \n                                \n                            </div>\n                           \n                            <div id=\"totalContainer\" class=\"col-xs-3 stats-graph\">\n                                <h4 class=\"section-header\">Total Spend</h4>\n                                  {{vm.cart.getTotalPrice() | currency}} - ({{vm.cart.getTotalCount()}} items)\n</div>\n                               \n                            </div>\n                        </div>\n\n              </div>\n      </section>\n  <section layout=\"column \" padding>\n   \n  <md-content>\n     \n\n     <div class=\"box container\" id=\"details\">\n              <p>\n\n                    <div >\n                    <div class=\"actions-continue\">                   \n\n                        <input type=\"text\" placeholder=\"Filter ...\" class=\"form-control col-md-4\" style=\"width:250px;margin-left:20px;\" ng-model=\"filterCart\" autofocus/>\n\n                         <button value=\"Proceed to Checkout →\" name=\"proceed\" class=\"btn btn-danger pull-right\" ng-click=\"cart.createCampaign(vm.cart);\" ng-disabled=\"vm.cart.getTotalCount() <= 0\" >Create Campaign →</button>\n\n          \n\n                        <div class=\"clearfix\"></div>\n                    </div><br/>\n\n                    <table class=\"cart table table-striped\">\n                        <thead>\n                            <tr>\n                                <th>#</th>\n                                <th>Publisher</th>\n                                <th>Media Option </th>\n                                <th>Start and End Date</th>\n                                <th style=\"width: 150px\">Upload Advert</th>\n                                <th>Price</th>\n                                <th >Inserts</th>\n                                <th>Total</th>\n                                <th>Remove</th>\n                            </tr>\n                        </thead>\n                        <tbody>\n                            <!-- empty cart message -->\n                            <tr ng-hide=\"vm.cart.getTotalCount() > 0\" >\n                                <td class=\"tdCenter\" colspan=\"7\">\n                                    Your MediaCart is empty. &nbsp;&nbsp;<a class=\"btn btn-primary\" href=\"/\" ng-click=\"vm.cancel();\">Build Campaign</a>\n                                </td>\n                            </tr>\n\n                            <tr ng-repeat=\"item in vm.cart.items track by $index \">\n                                <td>{{$index+1}}</td>\n                                <td class=\"product-thumbnail\">\n                                       {{item.publisher}}<br>\n                                    <a>\n                                        <img data-ng-src=\"data:image/png;base64,{{item.image}}\"  alt=\"{{item.publisher}}\" style=\"width: 100px;\">\n                                    </a>\n\n\n                                </td>\n\n                                                                \n                                  <td class=\"product-name\">\n                                  {{item.name}}\n                                </td>\n                                <td class=\"product-name\">\n                                  \n                                <div class=\"col-md-12 demo\">\n                                  \n                                  <div class=\"form-group has-feedback\">\n                                    <label class=\"control-label\">&nbsp;</label>\n                                    <input type=\"text\" class=\"form-control\"  id=\"config-demo\" name=\"daterange\" value=\"\" ng-model=\"item.category\" placeholder=\"Start and End Date\" />\n                                    <i class=\"glyphicon glyphicon-calendar form-control-feedback\"></i>\n                                  </div>\n                                 \n                                </td>\n                                <td>\n                                <md-input-container flex>\n                                <img  style=\"width: 100px;\" ng-src=\"{{item.creative}}\"  err-SRC=\"/assets/images/material-shop-15b7652109.jpg\">\n                               </md-input-container>\n                                <div ng-hide=\"item.creative\">\n                                 <button  class=\"btn btn-danger\" ng-hide=\"isAdmin()\" ng-click=\"cart.mediaLibrary($index)\"><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button>\n\n                                </div>\n\n                                <div ng-show=\"item.creative\">\n                                   <button  class=\"btn btn-success\" ng-hide=\"isAdmin()\" ng-click=\"cart.mediaLibrary($index)\"><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button>\n                                </div>\n\n                                  \n                                 \n                                  \n                                </td>\n\n                                <td>{{item.price | currency}}</td>\n\n                                <td >\n                                   \n                                \n                                \n                                <md-button class=\"md-raised md-primary small-button md-icon-button\" ng-click=\"vm.cart.addItem({sku:item.sku, name:item.name, slug:item.slug, mrp:item.mrp, price:item.price, weight:item.weight, vid:item.vid}, +1)\" aria-label=\"Add to cart\">\n                                          <ng-md-icon icon=\"add\"></ng-md-icon>\n                                </md-button>\n                                <div class=\"md-raised\"  ng-disabled=\"true\" aria-label=\"Cart quantity\">{{vm.cart.getQuantity(item.sku, item.vid)}}</div>\n                                 <md-button class=\"md-raised md-primary small-button md-icon-button\" \n                                      ng-click=\"vm.cart.addItem({sku:item.sku, name:item.name, slug:item.slug, mrp:item.mrp, price:item.price, weight:item.weight, vid:item.vid}, -1)\" \n                                      aria-label=\"Remove from cart\">\n                                          <ng-md-icon icon=\"remove\"></ng-md-icon>\n                                          </md-button>\n                                </td>\n\n                                <td><span><strong>{{item.price * item.quantity | currency}}</strong></span></td>\n\n                                <td class=\"product-actions\">\n                                    <a aria-label=\"Remove {{item.name}} from cart\" ng-click=\"vm.cart.addItem({sku:item.sku, vid: item.vid}, -10000000);\">\n                <ng-md-icon icon=\"close\" aria-label=\"Close dialog\"></ng-md-icon>\n            </a>\n                                </td>\n                            </tr>\n                        </tbody>\n                    </table>\n                </div>\n\n                  <hr>\n               \n          </div>\n   \n  </md-content>\n  </section>\n</md-content>\n<footer></footer>\n\n<script type=\"text/javascript\">\n$(function() {\n    $(\'input[name=\"daterange\"]\').daterangepicker();\n});\n</script>");
$templateCache.put("app/cart/media-library.html","<md-dialog aria-label=\"Media Library\" ng-cloak flex=\"95\">\n  <md-toolbar class=\"md-warn\">\n    <div class=\"md-toolbar-tools\">\n      <h2>Media Library</h2>\n      <span flex></span>\n      <md-button class=\"md-icon-button\" ng-click=\"cancel()\">\n        <ng-md-icon icon=\"close\" aria-label=\"Close dialog\"></ng-md-icon>\n      </md-button>\n    </div>\n  </md-toolbar>\n\n  <md-dialog-content>\n      <div class=\"md-dialog-content\"  class=\"md-whiteframe-z2\">\n          <md-grid-list class=\"media-list\" md-cols-xs =\"3\" md-cols-sm=\"4\" md-cols-md=\"5\" md-cols-lg=\"7\" md-cols-gt-lg=\"10\" md-row-height-gt-md=\"1:1\" md-row-height=\"4:3\" md-gutter=\"12px\" md-gutter-gt-sm=\"8px\" layout=\"row\" layout-align=\"center center\">\n            <md-grid-tile ng-repeat=\"i in media\" class=\"md-whiteframe-z2\" ng-click=\"ok(i.path)\">\n          		<div class=\"thumbnail\">\n          				<img ng-src=\"{{i.path}}\" draggable=\"false\" alt=\"{{i.name}}\">\n          		</div>\n              <md-grid-tile-footer><h3>{{i.name}}</h3></md-grid-tile-footer>\n            </md-grid-tile>\n          </md-grid-list>\n    </div>\n  </md-dialog-content>\n  <md-dialog-actions layout=\"row\">\n    <span flex></span>\n    <md-button ng-click=\"addNewImage()\" class=\"md-warn md-raised\">\n     Add new Image\n    </md-button>\n  </md-dialog-actions>\n</md-dialog>\n");
$templateCache.put("app/category/detail.html","<md-toolbar class=\"md-hue-1\" id=\"user-detail-toolbar\">\n	<span layout=\"row\" layout-align=\"space-between\" class=\"md-toolbar-tools md-toolbar-tools-top\">\n		<md-button ng-click=\"detail.goBack();\" aria-label=\"Close detail view\">\n			<ng-md-icon icon=\"close\" aria-label=\"Close dialog\"></ng-md-icon>\n		</md-button>\n		<h3>Edit {{detail.header | labelCase}} - {{detail.category._id}}</h3>\n		<md-button aria-label=\"-\">\n		</md-button>\n	</span>\n</md-toolbar>\n\n<md-content class=\"md-padding\" flex layout-fill ng-cloak id=\"user-detail-content\">\n  <section layout=\"column\">\n      <span layout=\"row\">\n        <md-input-container flex>\n          <label>Name</label>\n          <input name=\"name\" ng-model=\"detail.category.name\" md-autofocus>\n        </md-input-container>\n\n        <md-input-container flex>\n          <label>Slug</label>\n          <input name=\"slug\" ng-model=\"detail.category.slug\"/>\n        </md-input-container>\n        <md-input-container flex>\n          <label>Category</label>\n          <input name=\"category\" ng-model=\"detail.category.category\"/>\n        </md-input-container>\n      </span>\n  </section>\n	<section class=\"section\" layout=\"row\">\n<form name=\"form\" layout=\"column\" layout-fill layout-align=\"space-between\" ng-submit=\"detail.save(detail.cat);\" novalidate autocomplete=\"off\">\n		<span layout=\"column\" layout-sm=\"column\">\n		  <md-content>\n			    <section>\n			      <md-subheader class=\"md-accent\">Sub Categories </md-subheader>\n\n						<table md-colresize=\"md-colresize\" class=\"md-table\" id=\"exportable\">\n							<thead>\n								<tr class=\"md-table-headers-row\">\n									<th class=\"md-table-header\">#</th>\n									<th class=\"md-table-header\">Name</th>\n									<th class=\"md-table-header\">Active</th>\n									<th class=\"md-table-header\"></th>\n								</tr>\n							</thead>\n\n							<tbody>\n								<tr ng-repeat=\"v in detail.category.child track by $index\" id=\"{{v._id}}\"\n										class=\"md-table-content-row\"\n										ng-class=\"{\'selected\': detail.isSelected(v)}\">\n									<td>{{$index+1}}</td>\n									<td>\n										<md-input-container flex>\n											<input name=\"name\" ng-model=\"v.name\" aria-label=\"Name\"/>\n										</md-input-container>\n									</td>\n                  <td>\n										<md-input-container flex>\n											<md-switch class=\"md-secondary\" ng-model=\"v.active\" aria-label=\"Activate Category\"></md-switch>\n										</md-input-container>\n									</td>\n									<td>\n										<md-button class=\"md-icon-button\" aria-label=\"Delete Feature\"   ng-click=\"detail.deleteVariants($index,cat);\"><ng-md-icon icon=\"delete\"></ng-md-icon></md-button>\n									</td>\n								</tr>\n								<tr class=\"md-table-content-row\"\n										ng-class=\"{\'selected\': detail.isSelected(p)}\">\n									<td>{{$index}}</td>\n									<td>\n										<md-input-container flex>\n											<input name=\"name\" ng-model=\"detail.category.newSubCat.name\" aria-label=\"Variant Weight\" placeholder=\"New Name\"/>\n										</md-input-container>\n									</td>\n									<td>\n									</td>\n								</tr>\n							</tbody>\n			      </table>\n			    </section>\n\n			  </md-content>\n\n		<md-dialog-actions layout=\"row\">\n			<span flex></span>\n			<md-button ng-disabled=\"detailForm.$invalid\" type=\"submit\" class=\"md-primary md-raised\" aria-label=\"Save changes\">Save</md-button>\n		</md-dialog-actions>\n		</form>\n\n	</section>\n\n	<section class=\"section\" layout=\"column\" ng-hide=\"detail.isRoot\">\n\n		<span class=\"section-title\">Record Information</span>\n		<span layout=\"row\" layout-sm=\"column\" class=\"detail-info\">\n			<span flex=\"45\">Modified</span>\n			<span flex ng-show=\"detail.category.updatedAt\" class=\"subtitle\">\n				<span am-time-ago=\"detail.category.updatedAt\"></span>\n				<md-tooltip>{{detail.category.updatedAt | date:\'dd. MMMM yyyy H:mm\'}}</md-tooltip>\n				{{detail.category.modifiedBy && \'by \' + detail.category.modifiedBy}}\n			</span>\n		</span>\n\n		<span layout=\"row\" layout-sm=\"column\" class=\"detail-info\">\n			<span flex=\"45\">Created</span>\n			<span flex ng-show=\"detail.category.createdAt\" class=\"subtitle\">{{detail.category.createdAt | date:\'dd. MMMM yyyy H:mm\'}}</span>\n		</span>\n\n	</section>\n\n</md-content>\n\n<md-button class=\"md-fab md-accent md-fab-bottom-right fab-overlap md-button ng-scope md-blue-theme\" aria-label=\"Save Category\" ng-if=\"form.$dirty\" ng-click=\"detail.save(detail.cat);\">\n	<ng-md-icon icon=\"save\"></ng-md-icon>\n</md-button>\n");
$templateCache.put("app/category/list.html","<style>\n	.b { flex: 1; text-align: center; }\n	.pull-right{\n		margin-left:auto;\n	}\n</style>\n<md-progress-linear md-mode=\"indeterminate\" ng-show=\"list.loading\"></md-progress-linear>\n\n<!-- Nested node template -->\n<script type=\"text/ng-template\" id=\"nodes_renderer.html\">\n  <div ui-tree-handle class=\"tree-node tree-node-content\" layout=\"row\">\n    <a class=\"btn btn-success btn-xs\" ng-if=\"node.child && node.child.length > 0\" data-nodrag ng-click=\"list.toggle(this)\">\n      <ng-md-icon icon=\"chevron_right\" ng-if=\"collapsed\"></ng-md-icon>\n      <ng-md-icon icon=\"expand_more\" ng-if=\"!collapsed\"></ng-md-icon>\n    </a>\n    <div flex>{{node.name}}</div>\n		<a class=\"pull-right btn btn-danger btn-xs\" data-nodrag ng-click=\"list.remove(this,node)\">\n			<ng-md-icon icon=\"delete\"></ng-md-icon>\n		</a>\n  </div>\n  <ol ui-tree-nodes=\"\" ng-model=\"node.child\" ng-class=\"{hidden: collapsed}\">\n    <li ng-repeat=\"node in node.child\" ui-tree-node ng-include=\"\'nodes_renderer.html\'\" ng-show=\"visible(node)\">\n    </li>\n  </ol>\n</script>\n\n\n <!-- Add div For infinite scroll -->\n	<md-card infinite-scroll=\'list.loadMore()\' infinite-scroll-disabled=\'list.busy\' infinite-scroll-distance=\'1\'>\n		<md-toolbar class=\"md-table-toolbar md-default\" aria-hidden=\"false\"\n		ng-hide=\"list.selected.length || filter.show || list.data.search\">\n      <div class=\"md-toolbar-tools\">\n				<h2 class=\"md-title\">List of Categories</h2>\n			  <div flex></div>\n\n\n				<form layout layout-align=\"center\" layout-padding ng-submit=\"list.addTab(category)\" class=\"categoryAddForm\">\n					<div layout=\"row\" flex>\n							<md-input-container class=\"md-block\" layout=\"row\" layout-align=\"center end\">\n							<label >Add New Category</label>\n							<input type=\"text\" ng-model=\"category.name\">\n						</md-input-container>\n							<div>\n								<md-button class=\"md-primary md-raised\" ng-disabled=\"!category\" type=\"submit\">Add</md-button>\n							</div>\n					</div>  \n			</form>\n\n			  <md-button tabindex=\"0\" ng-click=\"filter.show = true;\" class=\"md-icon-button md-button md-default-theme\" ng-show=\"!list.no.filter\"\n				aria-label=\"Open filter box for {{list.header}}s table\">\n			    <ng-md-icon icon=\"filter_list\"></ng-md-icon>\n			  </md-button>\n				<md-menu md-position-mode=\"target-right target\" ng-if=\"!list.no.export\">\n	      <md-button aria-label=\"Open options menu\" class=\"md-icon-button\" ng-click=\"list.openMenu($mdOpenMenu, $event)\">\n	        <ng-md-icon icon=\"inbox\"></ng-md-icon>\n	      </md-button>\n	      <md-menu-content width=\"4\">\n	        <md-menu-item>\n	          <md-button\n							ng-click=\"list.exportData(\'xls\');\"\n							aria-label=\"Export {{list.header}}s table as Excel\">\n	            <ng-md-icon icon=\"receipt\"></ng-md-icon>\n	            Excel\n	          </md-button>\n	        </md-menu-item>\n					<md-menu-divider></md-menu-divider>\n	        <md-menu-item>\n	          <md-button ng-click=\"list.exportData(\'json\');\" aria-label=\"Export {{list.header}}s table in JSON format\">\n	            <ng-md-icon icon=\"account_balance_wallet\"></ng-md-icon>\n	            JSON\n	          </md-button>\n	        </md-menu-item>\n	        <md-menu-divider></md-menu-divider>\n	        <md-menu-item>\n	          <md-button ng-click=\"list.exportData(\'txt\');\" aria-label=\"Export {{list.header}}s table in Text format\">\n	            <ng-md-icon icon=\"text_format\"></ng-md-icon>\n	            Text\n	          </md-button>\n	        </md-menu-item>\n	        <md-menu-divider></md-menu-divider>\n\n	      </md-menu-content>\n	    </md-menu>\n      </div>\n    </md-toolbar>\n\n		<md-toolbar class=\"md-table-toolbar md-default\"\n			ng-show=\"filter.show || list.data.search\"\n			aria-hidden=\"false\">\n      <div class=\"md-toolbar-tools\">\n				<ng-md-icon icon=\"search\"></ng-md-icon>\n				<md-input-container flex class=\"mgt30\">\n		      <label>Filter {{list.header}}</label>\n		      <input ng-model=\"list.data.search\" focus-me=\"filter.show\" ng-change=\"findNodes()\">\n		    </md-input-container>\n				<ng-md-icon icon=\"close\" ng-click=\"filter.show = false; list.data.search = \'\';\" class=\"link\"></ng-md-icon>\n			</div>\n		</md-toolbar>\n\n<div layout=\"row\">\n    <div ui-tree=\"treeOptions\" id=\"tree-root\" flex>\n      <ol ui-tree-nodes=\"\" ng-model=\"list.data\">\n        <li ng-repeat=\"node in list.data\" ui-tree-node ng-include=\"\'nodes_renderer.html\'\" ng-show=\"visible(node)\">{{node}}</li>\n      </ol>\n    </div>\n</div>\n\n<a id=\"bottom\"></a><!--When a new category added, page should scroll to this point-->\n \n <div class=\"md-table-pagination\">\n		<span>Filtered {{filtered.length}} of {{list.data.length}} {{list.header}}s</span>\n	</div>\n</md-card>\n\n<md-card ng-if=\"!list.data.length && !list.loading\">\n	  <md-card-content>\n	    <h2>No {{list.header | labelCase}}s found</h2>\n	    <p class=\"mgl\" hide-xs>\n				There are no {{list.header | labelCase}}s!\n	      <a ng-click=\"main.create();\" href=\"\">Create one!</a>\n	    </p>\n	    <p hide-gt-xs>\n				There are no {{list.header | labelCase}}s!\n	      <a ng-click=\"main.create();\" href=\"\">Create one!</a>\n	    </p>\n	  </md-card-content>\n	</md-card>\n");
$templateCache.put("app/category/main.html","<navbar leftmenu=\"true\"></navbar>\n<left-menu></left-menu>\n<md-content flex layout=\"column\" class=\"content\">\n<section layout=\"row\">\n\n		<div ui-view=\"content\" layout=\"column\" flex></div>\n\n		<md-content\n			ui-view=\"detail\"\n			id=\"detail-content\"\n			toggle-component\n			md-component-id=\"categories.detailView\"\n			layout=\"column\"\n			flex-xs=\"100\"\n			flex-sm = \"90\"\n			flex-md=\"90\"\n			flex-lg=\"50\"\n			flex-gt-lg=\"50\"\n			class=\"md-whiteframe-z1\">\n		</md-content>\n</section>\n</md-content>\n<footer></footer>\n");
$templateCache.put("app/checkout/checkout.html","<navbar></navbar>\n<md-card ng-if=\"checkout.payment.msg\">\n      <md-card-header style=\"background:pink\">\n          <md-card-header-text>\n            <h3 ng-if=\"\">Payment Failed </h3>\n            <span class=\"md-subhead\" >\n                <div ng-if=\"checkout.payment.id\">ID: {{checkout.payment.id}}</div>\n                <b>Error:</b> \n                    <div ng-repeat=\"m in checkout.payment.msg\">{{m.field}} {{m.issue}} </div>\n            </span>\n          </md-card-header-text>\n          \n      </md-card-header>\n</md-card>\n<md-divider></md-divider>\n<div flex layout=\"column\" layout-gt-xs=\"row\" layout-align=\"center stretch\" class=\"checkout\">\n\n<md-card>\n      <md-card-header>\n          <md-card-header-text>\n            <h3>PROCESS ORDER</h3>\n            \n            <span class=\"md-subhead\" ></span>\n          </md-card-header-text>\n          \n      </md-card-header>\n      <md-card-content>\n  <div class=\"md-table-container\">\n      <form name=\"orderForm\" ng-submit=\"checkout.checkout(checkout.addr,checkout.options,true);\" novalidate>\n      \n	<table md-colresize=\"md-colresize\" class=\"md-table\" id=\"exportable\">\n		<tbody>\n\n			<tr class=\"md-table-content-row\" >\n				<td>Order Total:</td>\n			    <td>{{checkout.Cart.cart.getTotalPrice() | currency : checkout.Settings.currency.symbol}}</td>\n			</tr>\n            <tr class=\"md-table-content-row\">\n				<td>Handling Fee: </td>\n			    <td >\n                    5 % - {{checkout.Cart.cart.getHandlingFee()| currency : checkout.Settings.currency.symbol}}\n                </td>\n			</tr>\n            <tr class=\"md-table-content-row\">\n				<td>Total Amount:&nbsp;&nbsp;&nbsp;</td>\n			    <td>{{checkout.Cart.cart.getTotalPrice() + checkout.Cart.cart.getHandlingFee() - checkout.coupon.amount | currency : checkout.Settings.currency.symbol}}</td>\n			</tr>\n            <tr class=\"md-table-content-row\">\n				\n			    <td colspan=\"2\"><h4>Select Payment Method</h4>\n                       <div class=\"row\">\n                            <div class=\"col-md-6 short\">\n                                <div class=\"payment-logo\">\n                                  <img width=\"200px\"  height=\"60px\" data-ng-src=\"./assets/images/paypal-5a1f3f0ed3.png\" alt=\"\">\n                                </div>\n                                <label class=\"payment-label\" for=\"r1\">\n                                                          \n                                    <div class=\"payment-selector\" id=\"isNotMasterCard\">\n                                        <input type=\"radio\" name=\"payment_method_id\"   ng-model=\"checkout.options.paymentMethod.name\" value=\"PayPal\" id=\"r1\"> \n                                    </div>\n                                    <span class=\"payment-type-name\">PayPal</span>\n                                                  \n                                                          \n                                </label>\n\n                            </div>\n                        <div class=\"col-md-6 short\">\n                            <div class=\"payment-logo\">\n                              <img width=\"200px\"  height=\"60px\" data-ng-src=\"./assets/images/paynow-e7bc602c34.png\" alt=\"\">\n                            </div>\n                              <label class=\"payment-label\" for=\"r1\">\n                                                          \n                                  <div class=\"payment-selector\" id=\"isNotMasterCard\">\n                                      <!--<input type=\"radio\" name=\"payment_method_id\"   ng-model=\"checkout.options.paymentMethod.name\" value=\"PayNow\" id=\"r1\"> -->\n                                  </div>\n                                  <span class=\"payment-type-name\">PayNow (coming soon)</span>\n                                                  \n                                                          \n                             </label>\n                        </div>\n                       </div>\n                        <div class=\"row\">\n                        <div class=\"col-md-6 short\">\n                            <div class=\"payment-logo\">\n                              <img width=\"200px\"  height=\"60px\" data-ng-src=\"./assets/images/flocash-c90657c69c.png\" alt=\"\">\n                            </div>\n                           <label class=\"payment-label\" for=\"r1\">\n                                                      \n                                <div class=\"payment-selector\" id=\"isNotMasterCard\">\n                                    <!--<input type=\"radio\" name=\"payment_method_id\"   ng-model=\"checkout.options.paymentMethod.name\" value=\"FloCash\" id=\"r1\">--> \n                                </div>\n                                <span class=\"payment-type-name\">FloCash(coming soon)</span>\n                                              \n                                                      \n                              </label>\n                        </div>\n                        <div class=\"col-md-6 short\">\n                            <div class=\"payment-logo\">\n                              <img width=\"200px\"  height=\"60px\" data-ng-src=\"./assets/images/Stripe.png\" alt=\"\">\n                            </div>\n                            <label class=\"payment-label\" for=\"r1\">\n                                                        \n                                <div class=\"payment-selector\" id=\"isNotMasterCard\">\n                                   <!-- <input type=\"radio\" name=\"payment_method_id\"  ng-model=\"checkout.options.paymentMethod.name\"  value=\"Stripe\" id=\"r1\">--> \n                                </div>\n                                <span class=\"payment-type-name\">Stripe(coming soon)</span>\n                                                \n                                                        \n                            </label>\n                        </div>\n                       </div>\n                \n                    </div><div ng-messages=\"orderForm.paymentMethod.name.$error\" ng-if=\"orderForm.paymentMethod.name.$dirty\">\n                        <div ng-message=\"required\">Payment Method is required</div>\n                    </div>\n</td>\n			</tr>\n            <tr class=\"md-table-content-row\" ng-if=\"checkout.options.paymentMethod.name===\'Stripe\'\">\n				<td>Card No:</td>\n			    <td>\n                    <md-input-container md-is-error=\"(form.number.$error.required || form.number.$error.number) && form.number.$dirty\" md-no-float>\n                        <input name=\"number\" type=\"text\" ng-model=\"checkout.stripeToken.number\"\n                        placeholder=\"Credit Card Number\"\n                        autocomplete=\"off\"\n                        ng-minlength=\"16\"\n                        ng-maxlength=\"16\"/>\n                        <small class=\"errorMessage\" ng-show=\"orderForm.number.$dirty && orderForm.number.$invalid\"> Credit Card number is invalid.\n                        </small>\n                        <div ng-messages=\"orderForm.number.$error\" ng-if=\"orderForm.number.$dirty\">\n                            <div ng-message=\"required\">Number is required</div>\n                        </div>\n                    </md-input-container>\n                </td>\n			</tr>\n            <tr class=\"md-table-content-row\" ng-if=\"checkout.options.paymentMethod.name===\'Stripe\'\">\n				<td>CVC:</td>\n			    <td>\n                    <md-input-container md-is-error=\"(form.cvc.$error.required || form.cvc.$error.cvc) && form.cvc.$dirty\" md-no-float>\n                        <input name=\"cvc\" type=\"text\" ng-model=\"checkout.stripeToken.cvc\"\n                        placeholder=\"Credit Card CVC\"\n                        autocomplete=\"off\"\n                        ng-minlength=\"3\"\n                        ng-maxlength=\"3\"/>\n                        <small class=\"errorMessage\" ng-show=\"orderForm.cvc.$dirty && orderForm.cvc.$invalid\"> Credit Card cvc is invalid.\n                        </small>\n                        <div ng-messages=\"orderForm.cvc.$error\" ng-if=\"orderForm.cvc.$dirty\">\n                            <div ng-message=\"required\">CVC is required</div>\n                        </div>\n                    </md-input-container>\n                </td>\n			</tr>\n            <tr class=\"md-table-content-row\" ng-if=\"checkout.options.paymentMethod.name===\'Stripe\'\">\n				<td>Expiry Month:</td>\n			    <td>\n                    <md-input-container md-is-error=\"(form.exp_month.$error.required || form.exp_month.$error.exp_month) && form.exp_month.$dirty\" md-no-float>\n                        <input name=\"exp_month\" type=\"text\" ng-model=\"checkout.stripeToken.exp_month\"\n                        placeholder=\"Credit Card Expiry Month\"\n                        autocomplete=\"off\"\n                        ng-pattern=\"\'(0[1-9]|1[012])\'\" />\n                        <small class=\"errorMessage\" ng-show=\"orderForm.exp_month.$dirty && orderForm.exp_month.$invalid\"> Credit Card exp_month is invalid.\n                        </small>\n                        <div ng-messages=\"orderForm.exp_month.$error\" ng-if=\"orderForm.exp_month.$dirty\">\n                            <div ng-message=\"required\">Expiry Month is required</div>\n                        </div>\n                    </md-input-container>\n                </td>\n			</tr>\n            <tr class=\"md-table-content-row\" ng-if=\"checkout.options.paymentMethod.name===\'Stripe\'\">\n				<td>Expiry Year:</td>\n			    <td>\n                    <md-input-container md-is-error=\"(form.exp_year.$error.required || form.exp_year.$error.exp_year) && form.exp_year.$dirty\" md-no-float>\n                        <input name=\"exp_year\" type=\"text\" ng-model=\"checkout.stripeToken.exp_year\"\n                        placeholder=\"Credit Card Expiry Month\"\n                        autocomplete=\"off\"\n                        ng-pattern=\"\'^(20)\\\\d{2}$\'\"/>\n                        <small class=\"errorMessage\" ng-show=\"orderForm.exp_year.$dirty && orderForm.exp_year.$invalid\"> Credit Card exp_year is invalid.\n                        </small>\n                        <div ng-messages=\"orderForm.exp_year.$error\" ng-if=\"orderForm.exp_year.$dirty\">\n                            <div ng-message=\"required\">Expiry Year is required</div>\n                        </div>\n                    </md-input-container>\n                </td>\n			</tr>\n            <tr class=\"md-table-content-row\">\n	\n				<td><h3>Discount Coupon:</h3></td>\n			    <td>\n                    <md-input-container md-is-error=\"(form.name.$error.required || form.name.$error.name) && form.name.$dirty\" md-no-float>\n                        <input name=\"coupon\" type=\"text\" ng-model=\"checkout.options.coupon\" ng-change=\"checkout.checkCoupon(checkout.options.coupon, checkout.Cart.cart.getTotalPrice())\"\n                        placeholder=\"Discount Coupon\"\n                        autocomplete=\"off\"/>\n                        <span class=\"text-muted text-success\" ng-if=\"checkout.coupon.code\">{{checkout.coupon.type}} of {{checkout.coupon.amount | currency : checkout.Settings.currency.symbol}} was applied to the cart</span>\n                        <small class=\"errorMessage\" ng-show=\"orderForm.coupon.$dirty && orderForm.coupon.$invalid\"> Discount coupon was expired.\n                        </small>\n                        <div ng-messages=\"orderForm.coupon.$error\" ng-if=\"orderForm.coupon.$dirty\">\n                            <div ng-message=\"required\">Coupon is expired</div>\n                        </div>\n                    </md-input-container>\n                    <input type=\"hidden\" ng-model=\"checkout.cartValid\" validate-cart>\n                    <div class=\"hidden\">{{orderForm.$valid = !(vm.shipping.best[\'charge\'] === undefined)}}</div>\n                </td>\n			</tr>\n		</tbody>\n\n	</table>\n      <br/>\n\n    <div layout=\"column\" layout-align=\"center stretch\">\n        <md-button type=\"submit\" class=\"md-raised circular-progress-button md-primary\" \n        ng-disabled=\"orderForm.number.$invalid || orderForm.exp_month.$invalid || orderForm.exp_year.$invalid || orderForm.cvc.$invalid || checkout.loading || checkout.Cart.cart.getTotalPrice()===0 || !checkout.addr\" aria-label=\"Place Order\" layout=\"row\" layout-align=\"center center\"> \n            <div flex></div>\n            <ng-md-icon icon=\"local_shipping\" ng-hide=\"checkout.loading\"></ng-md-icon>\n            <md-progress-circular md-mode=\"indeterminate\" md-diameter=\"25\" ng-show=\"checkout.loading\" class=\"md-accent md-hue-1\"></md-progress-circular>\n            <span>&nbsp;Place Order</span>\n            <div flex></div>\n        </md-button>\n    </div>\n\n	</form>\n</div>\n</md-card-content>\n</md-card>\n\n<div layout=\"column\" layout-gt-sm=\"row\">\n<!--Address box-->\n\n<md-card ng-show=\"checkout.showAddressForm\">\n    <md-card-content>\n	<p ng-show=\"checkout.error\" class=\"md-warn\">{{checkout.error.message}}</p>\n	<h3>SELECTED ADDRESS</h3>\n	<form name=\"form\" ng-submit=\"checkout.saveAddress(checkout.addr);new.address=false;checkout.addr = checkout.address[0];\" novalidate layout=\"column\">\n		<md-input-container md-is-error=\"(form.name.$error.required || form.name.$error.name) && form.name.$dirty\">\n			<label>Company Name</label>\n			<input name=\"name\" type=\"name\" ng-model=\"checkout.addr.name\" required autofocus>\n			<div ng-messages=\"form.name.$error\" ng-if=\"form.name.$dirty\">\n				<div ng-message=\"required\">Company Name is required</div>\n			</div>\n		</md-input-container>\n        \n        <md-input-container md-is-error=\"(form.addr.$error.required || form.addr.$error.addr) && form.addr.$dirty\">\n			<label>Company Address</label>\n			<input name=\"address\" type=\"address\" ng-model=\"checkout.addr.address\" required/>\n			<div ng-messages=\"form.address.$error\" ng-if=\"form.address.$dirty\">\n				<div ng-message=\"required\">Address is required</div>\n			</div>\n		</md-input-container>\n        \n        <md-input-container md-is-error=\"(form.city.$error.required || form.city.$error.city) && form.city.$dirty\">\n			<label>City</label>\n			<input name=\"city\" type=\"city\" ng-model=\"checkout.addr.city\" required/>\n			<div ng-messages=\"form.city.$error\" ng-if=\"form.city.$dirty\">\n				<div ng-message=\"required\">City is required</div>\n			</div>\n		</md-input-container>\n\n        <md-input-container md-is-error=\"(form.zip.$error.required || form.zip.$error.zip) && form.zip.$dirty\">\n			<label>Zip</label>\n			<input name=\"zip\" type=\"zip\" ng-model=\"checkout.addr.zip\" required only-numbers/>\n			<div ng-messages=\"form.zip.$error\" ng-if=\"form.zip.$dirty\">\n				<div ng-message=\"required\">Zip code is required</div>\n			</div>\n		</md-input-container>\n        \n        <md-input-container md-is-error=\"(form.state.$error.required || form.state.$error.state) && form.state.$dirty\">\n			<label>State</label>\n			<input name=\"state\" type=\"state\" ng-model=\"checkout.addr.state\" required/>\n			<div ng-messages=\"form.state.$error\" ng-if=\"form.state.$dirty\">\n				<div ng-message=\"required\">State is required</div>\n			</div>\n		</md-input-container>\n        \n        <md-input-container md-is-error=\"(form.phone.$error.required || form.phone.$error.phone) && form.phone.$dirty\">\n			<label>Phone</label>\n			<input name=\"phone\" type=\"phone\" ng-model=\"checkout.addr.phone\" required/>\n			<div ng-messages=\"form.phone.$error\" ng-if=\"form.phone.$dirty\">\n				<div ng-message=\"required\">Phone number is required</div>\n			</div>\n		</md-input-container>\n\n        <!--<md-input-container md-is-error=\"(form.country.$error.required || form.country.$error.country) && form.country.$dirty\">\n            <label>Country</label>\n            <input ng-model=\"checkout.addr.country\" ng-value=\"checkout.Settings.country.name\" disabled/>\n            <div ng-messages=\"form.country.$error\" ng-if=\"form.country.$dirty\">\n				<div ng-message=\"required\">Country required</div>\n			</div>\n		</md-input-container>-->\n        <div layout=\"row\">\n            <md-button type=\"submit\" class=\"md-raised md-primary\" \n            ng-disabled=\"!form.$valid || checkout.loadingAddress\" aria-label=\"Save Address\" layout=\"row\">\n                <ng-md-icon icon=\"save\" ng-hide=\"checkout.loadingAddress\"></ng-md-icon>\n                <md-progress-circular md-mode=\"indeterminate\" md-diameter=\"25\" ng-show=\"checkout.loadingAddress\" class=\"md-accent md-hue-1\"></md-progress-circular>\n                Save <span hide show-gt-xs>as Primary Address</span>\n            </md-button>\n            <md-button ng-click=\"checkout.cancelForm(checkout.addr);new.address=false;\">Cancel</md-button>\n	   </div>\n       </form>\n    </md-card-content>\n</md-card>\n<div layout=\"column\">\n<md-button class=\"md-raised\" ng-click=\"checkout.addressForm(true);checkout.new.address=true; checkout.addr={country: checkout.Settings.country.name}\">\n    <ng-md-icon icon=\"location_on\"></ng-md-icon>Add New Address\n</md-button>\n\n<md-card  \nng-repeat=\"a in checkout.address\" \nng-click=\"new.address=false; checkout.addressForm(true);checkout.switchAddress(a)\" \nstyle=\"min-width:300px\" \nng-class=\"{\'selected\':(a==checkout.addr)} \"\n>\n      <md-card-header layout=\"row\" layout-align=\"space-between start\">\n          <md-card-header-text>\n            <h3>BILLING ADDRESS - {{$index+1}}</h3>\n          </md-card-header-text>\n          	<div>\n				  <md-button ng-click=\"checkout.delete(a)\" aria-label=\"Delete Address\"><ng-md-icon icon=\"delete\"></ng-md-icon></md-button>  \n			</div>				  \n      </md-card-header>\n	  \n      <md-card-content layout=\"column\" layout-align=\"start start\">\n			{{a.name}}<br/>\n            {{a.address}}<br/>\n            {{a.city}}<br/>\n            {{a.state}}<br/>\n            {{a.zip}}<br/>\n            {{a.phone}}\n      </md-card-content>\n      \n</md-card>\n</div><!--Address box-->\n</div>\n\n\n</div>\n<footer></footer>\n");
$templateCache.put("app/contact/contact.html","<crud-table api=\'contact\' options=\'options\'></crud-table>\n");
$templateCache.put("app/country/country.html","<crud-table api=\'country\' options=\'options\'></crud-table>\n");
$templateCache.put("app/coupon/coupon.html","<crud-table api=\'coupon\' options=\'options\'></crud-table>\n");
$templateCache.put("app/customer/customer.html","<crud-table api=\'customer\' options=\'options\'></crud-table>\n");
$templateCache.put("app/dashboard/dashboard.html","<navbar leftmenu=\"true\"></navbar>\n<left-menu></left-menu>\n<div layout-align=\"start center\" layout=\"column\">\n<h2 class=\"md-title\">Examples</h2>\n</div>\n<md-grid-list class=\"things-list\" md-cols-xs =\"1\" md-cols-sm=\"2\" md-cols-md=\"3\" md-cols-lg=\"5\" md-cols-gt-lg=\"5\" md-row-height-gt-md=\"1:1\" md-row-height=\"4:3\" md-gutter=\"12px\" md-gutter-gt-sm=\"8px\" layout=\"row\" layout-align=\"center center\">\n  <md-grid-tile ng-repeat=\"p in dashboard.pages\" ng-class=\"dashboard.getColor($index)\" class=\"md-whiteframe-z2\" ui-sref=\"{{p.url}}\">\n    <ng-md-icon icon=\"{{p.icon}}\" size=\"128\"></ng-md-icon>\n    <md-grid-tile-footer><h3>{{p.text}}</h3></md-grid-tile-footer>\n  </md-grid-tile>\n</md-grid-list>\n<footer></footer>\n");
$templateCache.put("app/documentation/back.html","<doc-menu></doc-menu>\n\n<md-content flex layout-padding layout=\"row\">\n<section class=\"doc\" flex>\n\n<h3>::::::::::::::: Store Administration ::::::::::::::</h3>\n<blockquote>\n  <em>Only administrators, managers can access the pages</em>\n</blockquote>\n    <div class=\"post\">\n    <h2 id=\"add-brands\">Manage Brands</h2>\n    <p>Administrators can add, edit, delete, filter brands of their store from this view</p>\n    <div class=\"image\"><a><img src=\"/assets/img/brands.jpg\" class=\"img-responsive\" alt=\"Manage Brands\"></a></div>\n    <hr>\n    </div>\n\n    <div class=\"post\">\n    <h2 id=\"add-categories\">Manage Categories</h2>\n    <p>\n      <ul>\n        <li>Categories are presented in Parent-Child manner in this store for better organisation of products.</li>\n        <li>Store\'s navigation bar at top contains all the categories arranged in parent-child fashion.</li>\n        <div class=\"image\"><a><img src=\"/assets/img/navbar.jpg\" class=\"img-responsive\" alt=\"Manage Categories\"></a></div>\n\n        <li>This view provides facility to add both parent and child categories, edit them, re-arrange category association according to their requirement.</li>\n      </ul>\n     </p>\n    <div class=\"image\"><a><img src=\"/assets/img/categories.jpg\" class=\"img-responsive\" alt=\"Manage Categories\"></a></div>\n    <hr>\n    </div>\n\n    <div class=\"post\">\n    <h2 id=\"add-products\">Manage Products</h2>\n    <p><em>This is the main page for administrators to manage products at store.</em>\n    <ul>\n      <li>The right sidebar lists all the available products with a search box to filter the list.</li>\n      <li>Clicking on a product at the product list will populate the details of the product at the left sidebar</li>\n      <li>The left sidebar has option to change product name, details, brand, category</li>\n      <li>This left sidebar also contains a module to manage product variants which has facility for Size, MRP, Price and Image for that perticular variant</li>\n    </ul>\n    </p>\n    <div class=\"image\"><a><img src=\"/assets/img/products.jpg\" class=\"img-responsive\" alt=\"Add Products\"></a></div>\n    <hr>\n    </div>\n\n    <div class=\"post\">\n    <h2 id=\"manage-users\">Manage Users (Customers)</h2>\n    <p>Using this view administrators can add, remove or edit users of their shopping web application</p>\n    <div class=\"image\"><a><img src=\"/assets/img/customers.jpg\" class=\"img-responsive\" alt=\"Manage customers\"></a></div>\n    <hr>\n    </div>\n</section>\n</md-content>");
$templateCache.put("app/documentation/features.html","<doc-menu></doc-menu>\n\n<md-toolbar layout=\"row\" class=\"md-hue-3\">\n  <div class=\"md-toolbar-tools\">\n    <span>Features</span>\n  </div>\n</md-toolbar>\n\n\n<div layout=\"row\" layout-wrap layout-padding layout-align=\"center space-between\">\n<!--<div class=\"cart-item md-whiteframe-z1\">\n</div>-->\n\n<md-card ng-repeat=\"f in doc.newFeatures\" flex-xs flex-gt-xs=\"50\" flex-gt-md=\"30\" layout-align=\"start start\">\n  <md-card-title>\n    <!--<md-card-title-media>\n      <div class=\"md-media-lg card-media\">\n        <ng-md-icon icon=\"{{f.i}}\" size=\"120\" style=\"fill: #999\"></ng-md-icon>\n      </div>\n    </md-card-title-media>-->\n    <md-card-title-text>\n      <span class=\"md-headline\">{{f.h2}}</span>\n      <span class=\"md-subhead\">{{f.p}}</span>\n    </md-card-title-text>\n  </md-card-title>\n</md-card>\n\n<md-toolbar layout=\"row\" class=\"md-hue-3\">\n  <div class=\"md-toolbar-tools\">\n    <span>Store Front Features</span>\n  </div>\n</md-toolbar>\n<div layout=\"row\" layout-wrap>\n<md-card ng-repeat=\"f in doc.storeFrontFeatures\" flex-xs flex-gt-xs=\"50\" flex-gt-md=\"30\">\n  <md-card-title>\n    <h2>{{f.h2}}</h2>         \n  </md-card-title>\n  <md-card-content>\n    <p>{{f.p}}</p>\n  </md-card-content>\n</md-card>\n</div>\n\n<md-toolbar layout=\"row\" class=\"md-hue-3\">\n  <div class=\"md-toolbar-tools\">\n    <span>Store Back Office Features</span>\n  </div>\n</md-toolbar>\n<div layout=\"row\" layout-wrap>\n<md-card ng-repeat=\"f in doc.storeBackFeatures\" flex-xs flex-gt-xs=\"50\" flex-gt-md=\"30\">\n  <md-card-title>\n    <h2>{{f.h2}}</h2>         \n  </md-card-title>\n  <md-card-content>\n    <p>{{f.p}}</p>\n  </md-card-content>\n</md-card>\n</div>\n\n<md-toolbar layout=\"row\" class=\"md-hue-3\">\n  <div class=\"md-toolbar-tools\">\n    <span>Future</span>\n  </div>\n</md-toolbar>\n<div layout=\"row\" layout-wrap>\n<md-card ng-repeat=\"f in doc.future\" flex-xs flex-gt-xs=\"50\" flex-gt-md=\"30\">\n  <md-card-title>\n    <h2>{{f.h2}}</h2>         \n  </md-card-title>\n  <md-card-content>\n    <p>{{f.p}}</p>\n  </md-card-content>\n</md-card>\n</div>\n");
$templateCache.put("app/documentation/index.html","<div layout=\"row\" layout-align=\"center center\">\n<div class=\"banner banner-floaty\" layout=\"row\" layout-align=\"space-around center\">\n  <doc-nav></doc-nav>\n</div>\n</div>\n<md-content flex layout-padding>\n\n <section class=\"doc\">\n  <div layout=\"row\" layout-align=\"center center\">\n    <h3 class=\"text-headline m100\">What You Get</h3>\n  </div>\n  <md-divider></md-divider>\n<div class=\"highlights\" layout=\"row\" layout-align=\"center center\">\n  <div>\n    <md-list-item ng-repeat=\"w in doc.why\" ng-if=\"$index%2!=0\">\n        <ng-md-icon icon=\"{{w.i}}\" style=\"{{w.c}}\" size=\"30\"></ng-md-icon>\n        <p cl> {{ w.h }} </p>\n    </md-list-item>\n  </div>\n  <div>\n    <md-list-item ng-repeat=\"w in doc.why\" ng-if=\"$index%2==0\">\n        <ng-md-icon icon=\"{{w.i}}\" style=\"{{w.c}}\" size=\"30\"></ng-md-icon>\n        <p cl> {{ w.h }} </p>\n    </md-list-item>\n  </div>\n</div>\n\n<md-divider></md-divider>\n<br/>\n<br/>\n  <div layout=\"column\" layout-align=\"start center\">\n  <div layout=\"row\" layout-xs=\"column\" class=\"home-row layout-xs-column layout-row\" ng-repeat=\"i in doc.topFeatures\">\n    <div ng-if=\"$index%2==0\" class=\"promo-img-container promo-1\">\n      <div><img src=\"{{i.i}}\"></div>\n    </div>\n    <div class=\"text-container\">\n      <div class=\"text-block promo-1-desc l-pad-top-2\">\n        <h3 class=\"text-headline\">{{i.h}}</h3>\n        <p class=\"text-body\"> {{i.p}}</p>\n      </div>\n    </div>\n    <div ng-if=\"$index%2==1\" class=\"promo-img-container promo-1\">\n      <div><img src=\"{{i.i}}\"></div>\n    </div>\n  </div>\n\n</section>\n    </md-content>\n    <doc-menu></doc-menu>");
$templateCache.put("app/documentation/install.html","<doc-menu></doc-menu>\n\n<md-content layout-padding>\n<section class=\"doc\" layout=\"row\">\n  <div flex=\"5\"></div>\n  <div flex=\"95\" layout-align=\"center start\">\n    <h1 class=\"\">Installation Instructions</h1>\n\n    <!-- Requirements-->\n    <div layout=\"row\" layout-xs=\"column\" id=\"req\">\n      <div>\n        <h3>Requirements</h3>\n        <p>We need <a href=\"https://nodejs.org/en/\">Node (To create web server)</a> + <a href=\"https://git-scm.com/\">Git (Version Control System)</a> + <a href=\"https://www.mongodb.com/\">MongoDB (Database)</a> + <a href=\"https://www.python.org/downloads/release/python-2710/\">Python 2.7</a>\n        <br/>\n         Go ahead <b>download and install</b> them</p>\n        <p>We need to start an instance of MongoDB. In my case it was sitting @ \n          <ng-prism class=\"language-javascript\">C:\\Program Files\\MongoDB\\Server\\3.0\\bin\\mongod.exe</ng-prism></p>\n      </div>\n    </div>\n    \n    <!-- Commands-->\n    <div layout=\"row\" layout-xs=\"column\" id=\"cmd\">\n      <div>\n        <h3>Start</h3>\n          <ul>\n            <li><ng-md-icon icon=\"check\"></ng-md-icon>Extract the zip file provided</li>\n            <li><ng-md-icon icon=\"check\"></ng-md-icon>Point your command prompt into that folder</li>\n            <li><ng-md-icon icon=\"check\"></ng-md-icon>Run the following commands</li>\n          </ul> \n<ng-prism class=\"language-javascript\">npm i -g bower gulp-cli\nnpm install\nbower install\ngulp serve\n</ng-prism>\nThis should fire up the serve at <a href=\"http://localhost:9000/\">http://localhost:9000/</a>\n<br>\n<br>\n        <h3>Deploy</h3>\n        <ng-prism class=\"language-javascript\">gulp build</ng-prism>\n        <p>Run the above command which will minify, compress, cdnify, uglify the content and generate the production version files into the <em>dist</em> directory. \n          <br/>Simply copy the content of the dist directory into your production server and your app is live.</p>\n      </div>\n    </div>\n<br/>\n\n    <!-- Settings-->\n    <div layout=\"row\" layout-xs=\"column\" id=\"settings\">\n      <div>\n        <h3>Settings</h3>\n        <p> There are 3 files which need to be configured.<br/>\n          <ul>\n            <li>1. client/app/settings.js</li>\n            <li>2. Rename server/config/local.env.sample.js to server/config/local.env.js</li>\n            <li>3. server/config/environment/shared.js</li>\n          </ul>\n        </p>\n\n<h5>1. settings.js (client/app/settings.js)</h5>\n<ng-prism class=\"language-javascript\">demo: false,\n  country: {\n    name:\'India\', \n    code: \'IN\' // must be 2 digit code from the list https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2 \n  },\n  currency: {\n    code: \'USD\', // Paypal currency code *** Please choose from https://developer.paypal.com/docs/classic/api/currency_codes/\n    shop_currency: \'INR\',\n    symbol: \'Rs \', // Currency symbol to be displayed through out the shop\n    exchange_rate: \'0.015\' // Paypal currency code(USD) / Shop currency (INR) ***  exchange_rate should not be 0 else it will generate divided by 0 error\n  }, \n  paymentStatus: [\'Pending\',\'Paid\',\'created\'], // On success from Paypal it stores as created\n  orderStatus: [\'Payment Pending\',\'Order Placed\',\'Order Accepted\',\'Order Executed\',\'Shipped\',\'Delivered\',\'Cancelled\',\'Not in Stock\']\n</ng-prism>\n\n\n\n<h5>2. local.env.js (server/config/local.env.js)</h5>\n<h6>Requirements</h6>\n\nCreate an account at <a href=\"http://www.sendgrid.com/\">Sendgrid</a> and generate a new API Key\nCreate create a new app at the following websites\n <br/><a href=\"http://developer.paypal.com/\">PayPal Developer \n <br/><a href=\"http://developer.facebook.com/\">Facebook Developer \n <br/><a href=\"https://console.developers.google.com\">Google Developer Console</a> \n <br/><a href=\"https://dev.twitter.com/\">Twitter Developer</a>\n\n<ng-prism class=\"language-javascript\">FACEBOOK_ID:          \'app-id\',\nFACEBOOK_SECRET:      \'secret\',\n\nTWITTER_ID:           \'app-id\',\nTWITTER_SECRET:       \'secret\',\n\nGOOGLE_ID:            \'app-id\',\nGOOGLE_SECRET:        \'secret\',\n\nSENDGRID_APIKEY:      \'YOUR_GENERATED_SENDGRID_API_KEY\',\n\nPAYPAL_MODE :         \'sandbox\', //sandbox or live\nPAYPAL_CLIENT_ID:     \'YOUR_PAYPAL_CLIENT_ID\',\nPAYPAL_CLIENT_SECRET: \'YOUR_PAYPAL_CLIENT_SECRET\'\n</ng-prism>\n\n\n<h5>3(a). User Roles (server/config/environment/shared.js)</h5>\n<ng-prism class=\"language-javascript\">userRoles: [\'guest\', \'user\', \'manager\', \'admin\']</ng-prism>\n<br/>\n<h5>3(b). Email Templates (server/config/environment/shared.js)</h5>\n<ng-prism class=\"language-javascript\">mailOptions : {\n    forgotPassword: function(body){\n      return {\n        from: \'passwordreset@codenx.com\',\n        to: body.to,\n        subject: \'Material Shop Password Reset Request\',\n        text: \'You are receiving this because you (or someone else) have requested the reset of the password for your account.\\n\\n\' +\n          \'Please click on the following link, or paste this into your browser to complete the process:\\n\\n\' +\n          \'http://\' + body.host + \'/reset/\' + body.token + \'\\n\\n\' +\n          \'If you did not request this, please ignore this email and your password will remain unchanged.\\n\'\n      }\n    },\n    resetPassword: function(body){\n      return {\n        from: \'passwordreset@codenx.com\',\n        to: body.to,\n        subject: \'Material Shop Password Changed\',\n        text: \'Hello,\\n\\n\' +\n                \'This is a confirmation that the password for your account \' + body.to + \' has just been changed.\\n\'\n        }\n    },\n    orderPlaced: function(body){\n      return {\n        from: \'CodeNx <admin@codenx.com>\',\n        to: body.to,\n        subject: \'Order Placed Successfully\',\n        text: \"Order No: \"+body.orderNo\n            +\"\\n Status: \"+body.status\n            +\"\\n\\n Payment Method: \"+body.payment_method \n            +\"\\n\\n Payment ID: \"+body.id \n            +\"\\n Amount: \"+body.amount.total + \" \" + body.amount.currency\n            +\"\\n\\n Address: \\n Name: \"+body.address.recipient_name \n            +\"\\n Line: \"+body.address.line1\n            +\"\\n City: \"+body.address.city\n            +\"\\n State: \"+body.address.state\n            +\"\\n Zip: \"+body.address.postal_code\n        }\n    },\n    orderUpdated: function(body){\n      return {\n        from: \'CodeNx <admin@codenx.com>\',\n        to: body.to,\n        subject: \'Your Order Status Updated\',\n        text: \"Order No: \"+body.orderNo\n            +\"\\n Status: \"+body.status\n            +\"\\n\\n Payment Method: \"+body.payment_method \n            +\"\\n\\n Payment ID: \"+body.id \n            +\"\\n Amount: \"+body.amount.total + \" \" + body.amount.currency\n            +\"\\n\\n Address: \\n Name: \"+body.address.recipient_name \n            +\"\\n Line: \"+body.address.line1\n            +\"\\n City: \"+body.address.city\n            +\"\\n State: \"+body.address.state\n            +\"\\n Zip: \"+body.address.postal_code\n        }\n    }\n</ng-prism>\n\n\n      </div>\n</div>\n    </div>\n\n</section>\n</md-content>");
$templateCache.put("app/documentation/use.html","<doc-menu></doc-menu>\n\n<div flex layout-padding layout=\"row\">\n<section class=\"doc\" flex>\n\n<h2>Home</h2>\n<hr>\nThis is the main page of our AngularJS e-commerce store.\nHere we get \n<ul>\n  <li>- List of all products</li>\n  <li>- Filter Products: based on `Price (Price Slider), Brand, Features (Color, Type, Fit, Fabric, Neck)`</li>\n  <li>- Sort: Based on Price and Name</li>\n</ul> \n\n\n\nEach product contains a add to cart button.\nOnce the product is added into the cart, we get the increase or decrease cart quantity option\n\nBy clicking each product we arrive at the product detail page\n\n<h2>Product Details</h2>\nThis page presents the complete details of the product\n<ol>\n  <li>Product name</li>\n  <li>Description</li>\n  <li>Price, MRP</li>\n  <li>Product Image (Including additional images)</li>\n  <li>Brand</li>\n  <li>Category</li>\n  <li>Quantity in cart</li>\n  <li>Size</li>\n  <li>Features</li>\n</ol>\n\n<h2>Search</h2>\n<hr>\n\nThe top navigation bar of the website has a search box which autocompletes with product info while user starts typing. By clicking a suggested item in the search bar, the page navigates to the product details page of the selected product.\n\n<h2>Category</h2>\n<hr>\n\nGet the current category name with all products under it<br/>\nThis page also has all the filter and sort options.\n\n    <h2 id=\"shopping-cart\">Shopping Cart</h2>\n    <p>This store is featured with a shopping cart facility which is easy to use and fast.\n    <ul>\n      <li>Get quick summary of what is there in Cart</li>\n      <li>Modify the cart quantity</li>\n      <li>Checkout using Paypal</li>\n    </ul>\n    </p>\n    <!--<div class=\"image\"><a><img src=\"/assets/images/cart.png\" class=\"img-responsive\" alt=\"Shopping Cart\"></a></div>-->\n    <hr>\n\n<h2>Login / Signup</h2>\n<hr>\n <p>Features like Signup / SignIn / Change Password / Logout is integrated into this application already with high level of security, so that you no longer need to be worry about implementing all those features into the application</p>\n\nA user need <b>not</b> have to navigate to a separate page to login or signup. It comes as a popup which is a huge ui improvement.\n\nThis login popup has a advantage of poping out for any route when a guest user tries to access a restricted page\n\nBoth the login and signup page has the option for connect using facebook, twitter, google as well\n\n<h2>Checkout</h2>\n<hr>\n<ul>\n  <li>The checkout page Displays the Order Amount + Shipping Charge</li>\n  <li>This also has an option discount coupons which is applied if valid.</li>\n  <li>Here the user can choose the Payment options (Cash On Delivery, Paypal)</li>\n  <li>This page automatically choose the best available Shipping Options based on the total order weight and the shipper availability.</li>\n  <li>While checkout the user can choose from any saved address.</li>\n</ul> \n\n\n\n\n\n<h2>Address Management</h2>\n<hr>\nThe address management is integrated into the checkout page to make the checkout experience single view and easy.\nHere the user can store and manage different addresses.\n\n<h2>Order Management</h2>\n<hr>\nThe user has the facility to view the order history.\nAdministrators can change order status + payment status\n<p><em>Users:</em> All the orders placed by the logged in user is available in this view. </p>\n      <p><em>Administrators:</em>  This view presents all orders placed by users with the option to change order status and shipping</p>\n    <!--<div class=\"image\"><a><img src=\"/assets/images/order.png\" class=\"img-responsive\" alt=\"Orders History\"></a></div>-->\n    <hr>\n\n<h2>User Management</h2>\n<hr>\n<em>Users: </em><br/>\nChange Password<br/>\nForgot Password<br/>\n<em>Administrators: </em>User role management \n\n<h2>Media Library</h2>\n<hr>\n<ul>\n  <li>Now the shop has a new media library where the shop managers can upload any image that is to be used in the shopping application</li>\n  <li>Clicking on each image displays the details about it as well as an option to delete it</li>\n</ul> \n\n\n<h2>Products (Role: Managers, Administrators)</h2>\n<hr>\nProduct details can be added, modified and deleted using this page. \nEach product can be associated into a single Brand, Category \nA product can have\n<ul>\n  <li>+ Multiple features</li>\n  <li>+ Multiple key features</li>\n  <li>+ Multiple product images</li>\n</ul>\n<ul>\n  <li>The list contains all the available products with a search box to filter the list.</li>\n  <li>Clicking on a product at the product list will populate the details of the product at the right sidebar</li>\n  <li>The right sidebar has option to change product name, details, brand, category</li>\n  <li>This sidebar also contains a module to manage product images</li>\n</ul>\n\n<h2>Manage Brands</h2>\n<p>Administrators can add, edit, delete, filter brands of their store from this view</p>\n\n<h2>Manage Categories</h2>\n<ul>\n  <li>Categories are presented in Parent-Child manner in this store for better organisation of products.</li>\n  <li>Store\'s navigation bar at top contains all the categories arranged in parent-child fashion.</li>\n  <li>This view provides facility to add both parent and child categories, re-arrange category association according to their requirement.</li>\n</ul>\n    <!--<div class=\"image\"><a><img src=\"/assets/images/store.png\" class=\"img-responsive\" alt=\"Store Front\"></a></div>-->\n    <hr>\n    </div>\n</section>\n</div>");
$templateCache.put("app/feature/feature.html","<crud-table api=\'feature\' options=\'options\'></crud-table>\n");
$templateCache.put("app/main/campaign.html","");
$templateCache.put("app/main/filter-menu.html","<md-sidenav ng-cloak md-is-locked-open=\"$mdMedia(\'gt-md\')\" md-component-id=\"filtermenu\" class=\"filter-menu\">\n    <md-content>\n        <form>\n\n        <div layout-align=\"space-between top\" class=\"md-whiteframe-z1\" layout-padding>\n            <md-card >\n                <h4>Price Range</h4>\n            <md-content>\n                <rzslider \n                rz-slider-model=\"main.priceSlider.min\"\n                rz-slider-high=\"main.priceSlider.max\" \n                rz-slider-options=\"main.priceSlider.options\"\n                ></rzslider>\n\n            </md-content>\n            </md-card>\n            \n            <md-card style=\"height: 500px;\" ng-if=\"main.brands\">\n                <md-input-container>\n                    <input ng-model=\"filterBrands\" placeholder=\"Categories\"/>\n                </md-input-container>\n                <md-content style=\"height: 500px\">\n                <div   ng-repeat=\"item in main.brands | filter:filterBrands\">\n                <md-checkbox\n                    ng-checked=\"main.exists(item, main.fl.brands)\"\n                    ng-click=\"main.toggle(item, main.fl.brands)\">\n                    {{ item.name }}\n                </md-checkbox>\n                </div>\n                </md-content>\n            </md-card>\n                <md-card ng-repeat=\"k in main.features | filter:filterFeatures\">\n                    <md-input-container>\n                        <input ng-model=\"filterFeatures\" placeholder=\"{{k.key}}\"/>\n                    </md-input-container>\n            <md-content>\n                <input ng-init=\"main.fl.features[k.key] = []\" type=\"hidden\"/>\n                <div flex=\"50\" ng-repeat=\"f in k.v | filter:filterFeatures\">\n                    <md-checkbox\n                    ng-checked=\"main.exists(f, main.fl.features[k.key])\"\n                    ng-click=\"main.toggle(f, main.fl.features[k.key])\">\n                        {{ f }}\n                    </md-checkbox>\n                </div>\n            </md-content>\n            </md-card>\n        </div>\n        </form>\n    </md-content>\n  \n    \n    \n</md-sidenav>\n");
$templateCache.put("app/main/main.html","<navbar leftmenu=\"true\"></navbar>\n<div class=\"container\">\n<div layout=\"row\">\n  <div ng-include=\"\'app/main/filter-menu.html\'\"></div>\n  <!--<md-content flex layout=\"column\">-->\n  <section layout=\"column\" layout-fill flex>\n    <div class=\"sort-products md-whiteframe-z2\">\n        <div class=\"products-list-meta\" ng-if=\"main.$mdMedia(\'gt-md\')\" flex>\n            Showing {{main.products.items.length}} products of {{main.products.count}} in: {{vm.Settings.currency.symbol}}<strong>{{main.priceSlider.min}}</strong> &nbsp;-&nbsp; {{vm.Settings.currency.symbol}}<strong>{{main.priceSlider.max}}</strong>\n        </div>\n\n        <section layout=\"row\" layout-align=\"center center\">\n          <div>Sort: &nbsp;</div> \n          <md-button class=\"groupX left\" ng-click=\"main.sortNow(\'variants.price\')\">{{main.Settings.currency.symbol}}<ng-md-icon icon=\"arrow_downward\" style=\"fill:#888\"></ng-md-icon></md-button>\n          <md-button class=\"groupX middle\" ng-click=\"main.sortNow(\'-variants.price\')\">{{main.Settings.currency.symbol}}<ng-md-icon icon=\"arrow_upwards\" style=\"fill:#888\"></ng-md-icon></md-button>\n          <md-button class=\"groupX middle\" ng-click=\"main.sortNow(\'name\')\">A-Z<ng-md-icon icon=\"arrow_downward\" style=\"fill:#888\"></ng-md-icon></md-button>\n          <md-button class=\"groupX right\" ng-click=\"main.sortNow(\'-name\')\">Z-A<ng-md-icon icon=\"arrow_upwards\" style=\"fill:#888\"></ng-md-icon></md-button>\n        </section>\n\n\n    </div>\n\n    <div layout=\"row\">\n      <div ng-repeat=\"b in main.fl.brands\">\n        <md-button class=\"md-raised\" ng-click=\"main.removeBrand(b);\" aria-label=\"Remove Brand Filter\">\n          <ng-md-icon icon=\"verified_user\" md-menu-align-target></ng-md-icon>\n          {{b.name}}\n          <ng-md-icon icon=\"close\" aria-label=\"Close dialog\"></ng-md-icon>\n        </md-button>\n      </div>\n      <md-button ng-show=\"main.fl.categories.length > 0\" class=\"md-raised\">\n        <ng-md-icon icon=\"subject\" md-menu-align-target></ng-md-icon>\n        {{main.fl.categories[0].name}}\n      </md-button>\n    <div ng-repeat=\"(k,features) in main.fl.features\">\n      <md-button ng-show=\"features\" ng-repeat=\"f in features\" class=\"md-raised\" ng-click=\"main.removeFeatures(features,k,f);\" aria-label=\"Remove {{f}} Filter\">\n          <ng-md-icon icon=\"format_shapes\" md-menu-align-target></ng-md-icon>\n          {{f}}\n          <ng-md-icon icon=\"close\" aria-label=\"Close dialog\"></ng-md-icon>\n      </md-button>\n    </div>\n    </div>\n\n      <div style=\"margin-top: 10px\" infinite-scroll=\'main.scroll()\' infinite-scroll-disabled=\'main.products.busy\' infinite-scroll-distance=\'1\' layout-align=\"center center\">\n          <div dw-loading=\"products\" dw-loading-options=\"{text: \'\'}\"></div>\n          <div layout=\"row\" layout-wrap layout-align=\"start start\">\n            <div class=\"col-md-4 col-sm-6\" ng-repeat=\"product in main.products.items\" layout=\"column\" layout-align=\"space-between center\" >\n              <div class=\"product\" style=\"height: 400px\" >\n                   <div class=\"img-logo\"  style=\"margin: 15px\">\n                      <center>\n                  \n                            <img ng-click=\"main.gotoDetail(product)\"   width=\"150px\" height=\"130px\" data-ng-src=\"data:image/png;base64,{{product.logo[0].base64}}\" data-err-src=\"images/png/avatar.png\"/>\n                      \n\n                      </center>\n                   </div>\n                              \n                  <div class=\"text text-center\" style=\"margin-top: 10px;height: 250px\">\n                        <a  href=\"\" ng-click=\"main.gotoDetail(product)\"><h5>{{product.name}}</h5></a><br><a ng-href=\"http://{{product.website}}\"> {{product.website}}</a>\n                              <div style=\"margin: 7px\">\n                                <ol class=\"rounded-list\">\n                                     <li ng-repeat=\"f in product.stats\"><a href=\"#\">{{f.key}} : {{f.val}}</a></li>                    \n                                </ol>\n                              </div>\n                  </div>\n                  <div style=\"text-align:bottom;vertical-align: bottom;text-align: center;margin-bottom: 0px\">\n                     <span><small>Category:<a href=\"/Category/{{product.category.slug}}/{{product.category._id}}\">{{product.endDate}}</a></small>\n                      \n                     </span> \n\n                  </div>\n                                      <!-- /.text -->\n              </div>\n                            <!-- /.product -->\n              \n            </div>\n          </div>\n        </div>\n    </section>\n<!--</md-content>-->\n</div>\n</div>\n<footer></footer>\n");
$templateCache.put("app/main/review-form.html","<div layout=\"row\">\n<md-content flex layout=\"column\">\n<section layout=\"column\" flex layout-align=\"center center\">\n  <h1>Rating & Review</h1>\n  <form name=\"form\" ng-submit=\"save(review)\" novalidate>\n  <section class=\"section\" layout=\"column\">\n    <rating rating=\"review.rating\"></rating><br/>\n    <md-input-container md-is-error=\"(form.message.$error.required || form.message.$error.message) && form.message.$dirty\">\n      <label>Message</label>\n      <textarea name=\"review\" ng-model=\"review.message\" md-autofocus></textarea>\n      <div ng-messages=\"form.message.$error\" ng-if=\"form.message.$dirty\">\n        <div ng-message=\"required\">Message required</div>\n      </div>\n    </md-input-container>\n  </section>\n  <div class=\"md-dialog-actions\" layout=\"column\" layout-align=\"center center\">\n    <div class=\"error\" layout-align=\"center center\">{{message}}</div>\n    <div layout=\"row\">\n      <md-button type=\"submit\" class=\"md-raised circular-progress-button md-primary\" ng-disabled=\"!form.$valid || vm.loading\" aria-label=\"Save Review\">\n        <span ng-show=\"!vm.loading\"><ng-md-icon icon=\"save\"></ng-md-icon>Save</span>\n        <md-progress-circular md-mode=\"indeterminate\" md-diameter=\"25\" ng-show=\"vm.loading\" class=\"md-accent md-hue-1\"></md-progress-circular><span ng-show=\"vm.loading\">Loading...</span>\n      </md-button>\n      <md-button class=\"btn btn-default btn-lg btn-register\" ng-click=\"cancel()\" aria-label=\"Cancel Review\"> Cancel </md-button>\n    </div>\n  </div>\n  </form>\n</section>\n</md-content>\n</div>");
$templateCache.put("app/main/single-product.html","<navbar leftmenu=\"true\"></navbar>\n<div class=\"container\">\n<div layout=\"row\" class=\"wrapper\">\n  <div ng-include=\"\'components/navbar/cart.html\'\"></div>\n  <md-content flex layout=\"column\">\n  <section layout=\"column\" layout-fill flex>\n    <div class=\"sort-products md-whiteframe-z2\">\n        <div>\n            Home > <a ui-sref=\"/\">Publishers</a> > {{single.product.name}}\n        </div>\n    </div>\n    \n    <div class=\"container\">\n    <div class=\"row\">\n      \n\n      <div class=\"col-md-12\" style=\"margin-top: 10px\">\n          <div class=\"row\" id=\"productMain\">\n              <div class=\"col-sm-3\">\n                  <div id=\"mainImage\" style=\"height: 60%\" class=\"md-whiteframe-z1\">\n                      <img  data-ng-src=\"data:image/png;base64,{{single.product.logo[0].base64}}\" err-SRC=\"/assets/images/486x325-226aa4740d.png\" alt=\"{{single.product.name}}\" class=\"img-responsive\">\n                  </div>\n\n                  \n\n              </div>\n              <div class=\"col-sm-9\">\n                  <div class=\"box\">\n                      <h3 class=\"text-center\">{{single.product.name}} </h3>\n                     \n                    <div ng-if=\"single.product.info\">\n                     <h4>Details</h4>\n                     <blockquote>\n                    <p>{{single.product.info }}</p>\n                  </blockquote> \n                   \n                  <div ng-if=\"single.product.stats.length>0\">\n                 \n\n                  <div class=\"row\">\n                    <div class=\"col-xs-6 col-md-2\" ng-repeat=\"f in single.product.stats\">\n                      <div  class=\"mythumbnail\">\n                     <p><h6><center>{{f.key}}</h6></center>  <div><center><h4>{{f.val}}</h4></center></div></p>\n                    </div>\n                  </div>\n                  </div>\n                 \n                  </div>\n\n                  <div class=\"row\">\n                 <md-list layout-gt-xs=\"row\" layout=\"column\">\n                          <md-list-item class=\"md-2-line\" ng-if=\"single.product.brand\">\n                          <ng-md-icon icon=\"verified_user\" md-menu-align-target></ng-md-icon>\n                          <div class=\"md-list-item-text\">\n                          <h3> Category </h3>\n                          <p> {{single.product.brand.name}} </p>\n                          </div>\n                      </md-list-item>\n\n                      <md-list-item class=\"md-2-line\" ng-if=\"single.product.category\">\n                          <ng-md-icon icon=\"subject\" md-menu-align-target></ng-md-icon>\n                          <div class=\"md-list-item-text\">\n                          <h3> Platform </h3>\n                          <p> {{single.product.category.name}} </p>\n                          </div>\n                      </md-list-item>\n                      <md-list-item class=\"md-2-line\" ng-if=\"single.product.category\">\n                         \n                          <div class=\"md-list-item-text\">\n                          <h3>Contact Details</h3>\n                              <p style=\"margin: 10px\"><span > <ng-md-icon icon=\"email\" md-menu-align-target></ng-md-icon>{{single.product.email}}<br></span></p>\n                               <p style=\"margin: 10px\"><span > <ng-md-icon icon=\"perm_phone_msg\" md-menu-align-target></ng-md-icon></span>{{single.product.phone}}</p>\n                          </div>\n                      </md-list-item>\n\n                  </md-list>\n                   </div>\n                  </div>\n\n                   <div class=\"row\">\n                    <div class=\"col-xs-6 col-md-3\" ng-repeat=\"f in single.product.keyFeatures\">\n                      <div >\n                     <p><h6><center>{{f.key}}</h6></center>  <div><center><h6 style= \"color:red\">{{f.val}}</h6></center></div></p>\n                    </div>\n                  </div>\n                  </div>\n\n                      <p class=\"goToDescription\">\n                    <a href=\"#div\" class=\"scroll-to\">Scroll to publisher media options</a>\n                      </p>\n                      \n\n                  </div>\n\n              </div>\n\n          </div>\n\n\n          <div class=\"box\" id=\"div\">\n           <div class=\"row\">\n            <div class=\"col-md-5\">\n            <summary><small>{{single.name}} &nbsp; {{single.formart}} &nbsp;{{single.size}}</small></summary>\n            <div  style=\"height: 450px\">\n            <img ng-hide=\"single.image\" src=\"/assets/img/preview.png\" width=\"100%\" >\n            <div  ng-if=\"single.image\" style=\"height: 330px\">\n\n              <div ng-if=\"single.image.progress &amp;&amp; single.image.progress &lt; 1\" class=\"progress\">\n            <div role=\"progressbar\" aria-valuenow=\"{{single.image.progress}}\" aria-valuemin=\"0\" aria-valuemax=\"1\" style=\"width:{{single.image.progress*100}}%\" class=\"progress-bar\"></div>\n          </div>\n          <ng-pintura ngp-src=\"single.image.src\" ngp-scaling=\"single.image.scaling\" ngp-position=\"single.image.position\" ngp-max-scaling=\"single.image.maxScaling\" ngp-scale-step=\"single.image.scaleStep\" ngp-move-step=\"single.image.moveStep\" ngp-mw-scale-step=\"single.image.mwScaleStep\" ngp-fit-inview = \"single.image.fitInview\" ngp-fit-onload=\"single.image.fitOnload\" ngp-progress=\"single.image.progress\">\n            <div id=\"zoomslider\">\n              <input ng-model=\"slider.value\" ng-change=\"sliderChange()\" orient=\"vertical\" type=\"range\" min=\"0\" max=\"100\" step=\"1\" ng-disabled=\"scalingDisabled\">\n            </div>\n            <button id=\"zoomin\" ng-click=\"zoomIn()\" ng-disabled=\"scalingDisabled\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-plus\"></span></button>\n            <button id=\"zoomout\" ng-click=\"zoomOut()\" ng-disabled=\"scalingDisabled\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-minus\"></span></button>\n            <button id=\"moveup\" ng-click=\"moveUp()\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-chevron-up\"></span></button>\n            <button id=\"movedown\" ng-click=\"moveDown()\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-chevron-down\"></span></button>\n            <button id=\"moveleft\" ng-click=\"moveLeft()\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-chevron-left\"></span></button>\n            <button id=\"moveright\" ng-click=\"moveRight()\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-chevron-right\"></span></button>\n            <button id=\"movecenter\" ng-click =\"fitInView()\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-screenshot\"></span></button>\n          </ng-pintura>\n             </div><br>\n            <p><br/>\n            </p>\n\n            </div>\n            </div>\n            <div class=\"col-md-7\" style=\"height: 420px;overflow:scroll\">\n              <p>\n\n                        <table  class=\"table table-striped\">\n                                    <thead>\n                                    <tr> \n                                        <th></th>\n                                        <th>Media Options </th>\n                                        <th>Pricing</th>\n                                        <th></th>\n                                        \n                                    </tr>\n                                    </thead>\n                                    <tbody>\n                                    <tr data-ng-repeat=\"adspace in single.product.variants\"  ng-click=\"single.preview(adspace)\">\n                                        <td>{{$index+1}}</td>\n                                        <td>{{adspace.name}}<br><span><small>{{adspace.size}} &nbsp;{{adspace.maxSize}}<br/> &nbsp;{{adspace.formart}}</small></span></td>\n                                        <td> {{adspace.price | currency}}<br><small>{{adspace.model}}</small></td>\n                                        <td><small> \n                                        <div layout=\"row\" layout-align=\"start center\">\n                                        <cart-buttons variant=\"adspace\" product=\"single.product\"></cart-buttons>\n                                        \n                                    </div>\n                               \n                              </small></td>\n                                        \n                                    </tr>\n                                    \n                                    </tbody>\n                                </table>\n                 </p>\n            </div>\n           </div>\n              \n                  <hr>\n                  \n          </div>\n\n\n          <!--div-->\n          <div >\n          <div class=\"col-md-12\">\n          <div class=\"col-md-4\">\n            <div layout=\"rows\" layout-align=\"center center\" ng-if=\"single.reviews.length==0 \">\n            <br/><md-divider></md-divider><br/>\n            <md-button ng-click=\"single.reviewForm()\" class=\"md-raised md-primary\">Be the first to review this item</md-button>\n        </div>\n        <div class=\"reviews\" ng-if=\"single.reviews.length>0 \">\n            <!--<h3>Reviews</h3>-->\n            <div class=\"reviews-header\" layout=\"column\" >\n                <div layout=\"column\" >\n                    <div class=\"total-rating\" layout=\"column\"  layout-align=\"space-between\"> \n                        <p>\n                        <div layout=\"row\" layout-align=\"start start\" class=\"total\"> {{single.rating.avg}}<ng-md-icon icon=\"star\"></ng-md-icon></div>\n                        <div>{{single.rating.count}} Ratings</div>\n                        <div>{{single.reviewCount}} Reviews</div></p>\n                    </div>\n                    <div class=\"rating-signal\">\n                        <div layout=\"row\" layout-align=\"start center\">5&nbsp;<ng-md-icon icon=\"star\" style=\"fill:rgb(33,150,243)\"></ng-md-icon> <md-progress-linear md-mode=\"determinate\" value=\"{{single.rating.r5*100 / single.rating.count}}\"></md-progress-linear>{{single.rating.r5}}</div>\n                        <div layout=\"row\" layout-align=\"start center\">4&nbsp;<ng-md-icon icon=\"star\" style=\"fill:rgb(33,150,243)\"></ng-md-icon> <md-progress-linear md-mode=\"determinate\" value=\"{{single.rating.r4*100 / single.rating.count}}\"></md-progress-linear>{{single.rating.r4}}</div>\n                        <div layout=\"row\" layout-align=\"start center\">3&nbsp;<ng-md-icon icon=\"star\" style=\"fill:rgb(33,150,243)\"></ng-md-icon> <md-progress-linear md-mode=\"determinate\" value=\"{{single.rating.r3*100 / single.rating.count}}\"></md-progress-linear>{{single.rating.r3}}</div>\n                        <div layout=\"row\" layout-align=\"start center\">2&nbsp;<ng-md-icon icon=\"star\" style=\"fill:rgb(255,87,34)\"></ng-md-icon> <md-progress-linear class=\"md-warn\" md-mode=\"determinate\" value=\"{{single.rating.r2*100 / single.rating.count}}\"></md-progress-linear>{{single.rating.r2}}</div>\n                        <div layout=\"row\" layout-align=\"start center\">1&nbsp;<ng-md-icon icon=\"star\" style=\"fill:rgb(255,87,34)\"></ng-md-icon> <md-progress-linear class=\"md-warn\" md-mode=\"determinate\" value=\"{{single.rating.r1*100 / single.rating.count}}\"></md-progress-linear>{{single.rating.r1}}</div>\n                    </div>\n                </div>\n                <div flex layout=\"row\" layout-align=\"center center\">\n                    <md-button ng-click=\"single.reviewForm()\" class=\"md-primary md-raised\">Rate & Review</md-button>\n                </div>\n            </div>\n            \n              <md-card ng-repeat=\"review in single.reviews | orderBy: \'-created\'\">\n                  <md-card-header>\n                      <md-card-avatar>\n                          <list-image string=\"{{review.message || review.rating}}\"></list-image>\n                      </md-card-avatar>\n                      <md-card-header-text>\n                          <span class=\"md-subhead\" ng-if=\"review.rating\">\n                              <div class=\"rating-button\">{{review.rating}} <ng-md-icon icon=\"star\" size=\"15\"></ng-md-icon></div>\n                          </span>\n                          <span class=\"md-title\" style=\"white-space: pre;margin-left: 10px;\">{{review.message}}</span>\n                      </md-card-header-text>\n                  </md-card-header>\n                  <!--<md-card-content>Good product within 7000</md-card-content>-->\n                  <md-card-actions layout=\"row\" layout-align=\"space-between center\">\n                      <span layout=\"row\" layout-align=\"start center\">\n                          <ng-md-icon icon=\"person\" size=\"15\"></ng-md-icon>&nbsp;{{review.reviewer}}&nbsp;\n                          <ng-md-icon icon=\"access_time\" size=\"15\"></ng-md-icon>&nbsp;{{review.created | amCalendar}}\n                      </span>\n                          <md-button ng-if=\"single.myReview(review)\" class=\"md-icon-button\" ng-click=\"single.deleteReview(review)\" aria-label=\"Delete Review\">\n                              <ng-md-icon icon=\"delete\" style=\"fill: #aaa\"></ng-md-icon>&nbsp;\n                          </md-button>\n                  </md-card-actions>\n              </md-card>\n        </div>\n        </div>\n        <div class=\"col-md-8\">\n\n          <div class=\"row\">\n             <h3 class=\"col-md-2\">Learn</h3> <img style=\"width:150px;height:100px\" src=\"assets/img/learn.png\" class=\"responsive-img col-md-4\">\n          </div>\n         \n            <div ng-if=\"single.magazines\">\n              <div ng-include=\"\'components/messages/magazines.html\'\" ></div>\n             \n            </div>\n            <div ng-if=\"single.airline\">\n              <div ng-include=\"\'components/messages/airline.html\'\" ></div>\n             \n            </div>\n            <div ng-if=\"single.emailMarketing\">\n              <div ng-include=\"\'components/messages/email.html\'\" ></div>\n             \n            </div>\n            <div ng-if=\"single.cinema\">\n              <div ng-include=\"\'components/messages/cinema.html\'\" ></div>\n             \n            </div>\n            <div ng-if=\"single.newspapers\">\n              <div ng-include=\"\'components/messages/newspapers.html\'\" ></div>\n             \n            </div>\n            <div ng-if=\"single.radio\">\n              <div ng-include=\"\'components/messages/radio.html\'\" ></div>\n             \n            </div>\n\n            <div ng-if=\"single.television\">\n              <div ng-include=\"\'components/messages/tv.html\'\" ></div>\n             \n            </div>\n\n            <div ng-if=\"single.default\">\n              <div ng-include=\"\'components/messages/nontraditional.html\'\" ></div>\n             \n            </div>\n            <div ng-if=\"single.billboards\">\n              <div ng-include=\"\'components/messages/outdoor.html\'\" ></div>\n             \n            </div>\n            <div ng-if=\"single.banner\">\n              <div ng-include=\"\'components/messages/nontraditional.html\'\" ></div>\n             \n            </div>\n            <div ng-if=\"single.socialMedia\">\n              <div ng-include=\"\'components/messages/nontraditional.html\'\" ></div>\n             \n            </div>\n            </div>\n          </div>\n          </div>\n\n    </div>\n</div>\n\n</section>\n</md-content>\n</div>\n</div>\n<footer></footer>\n");
$templateCache.put("app/media/media.html","<navbar leftmenu=\"true\"></navbar>\n<left-menu></left-menu>\n<div class=\"container\">\n<div layout-align=\"start center\" layout=\"column\">\n<h2 class=\"md-title\">Media Library</h2>\n<md-progress-linear md-mode=\"determinate\" value=\"{{progress}}\" class=\"md-warn\" ng-show=\"progress >= 0\"></md-progress-linear>\n<!-- <span class=\"progress\">\n	<div style=\"width:{{progress}}%\" ng-bind=\"progress + \'%\'\"></div>\n</span> -->\n</div>\n<div layout=\"column\">\n	<div ngf-drop ngf-select ng-model=\"files\" class=\"drop-box\"\n			ngf-drag-over-class=\"\'dragover\'\" ngf-multiple=\"true\" ngf-allow-dir=\"true\"\n			accept=\"image/*\"\n			ngf-pattern=\"\'image/*\'\">Drop images here to upload<br/>\n			or <br/>\n		<md-button tabindex=\"0\"\n		class=\"md-button md-default-theme md-warn md-raised\"\n		ngf-multiple=\"true\"\n		aria-label=\"Open file select panel\"\n		ngf-select=\"upload($files)\">\n			<ng-md-icon icon=\"cloud\"></ng-md-icon> Select Files\n		</md-button>\n	</div>\n\n	<div ngf-no-file-drop>File Drag/Drop is not supported for this browser</div>\n\n	<md-grid-list md-cols-xs =\"1\" md-cols-sm=\"3\" md-cols-md=\"5\" md-cols-lg=\"6\" md-cols-gt-lg=\"10\" md-row-height-gt-md=\"1:1\" md-row-height=\"4:3\" md-gutter=\"12px\" md-gutter-gt-sm=\"8px\">\n\n		<md-grid-tile ng-repeat=\"i in data\" class=\"md-whiteframe-z2\" ng-click=\"imageDetails(i)\">\n\n			<div class=\"thumbnail\">\n					<img ng-src=\"{{i.path}}\" draggable=\"false\" alt=\"{{i.name}}\">\n			</div>\n			<md-grid-tile-footer><h3>{{i.name}}</h3></md-grid-tile-footer>\n		</md-grid-tile>\n	</md-grid-list>\n\n	<pre ng-if=\"files[0].$error\">Upload Log: {{f.$error}} {{f.$errorParam}}</pre>\n</div>\n</div>\n<footer></footer>\n");
$templateCache.put("app/medias/medias.html","<navbar leftmenu=\"true\"></navbar>\n<left-menu></left-menu>\n<div class=\"container\">\n<div layout-align=\"start center\" layout=\"column\">\n<h2 class=\"md-title\">Media Library</h2>\n<md-progress-linear md-mode=\"determinate\" value=\"{{progress}}\" class=\"md-warn\" ng-show=\"progress >= 0\"></md-progress-linear>\n<!-- <span class=\"progress\">\n	<div style=\"width:{{progress}}%\" ng-bind=\"progress + \'%\'\"></div>\n</span> -->\n</div>\n<div layout=\"column\">\n	<!-- <div ngf-drop ngf-select ng-model=\"files\" class=\"drop-box\"\n			ngf-drag-over-class=\"\'dragover\'\" ngf-multiple=\"true\" ngf-allow-dir=\"true\"\n			accept=\"image/*\"\n			ngf-pattern=\"\'image/*\'\">Drop images here to upload<br/>\n			or <br/>\n		<md-button tabindex=\"0\"\n		class=\"md-button md-default-theme md-warn md-raised\"\n		ngf-multiple=\"true\"\n		aria-label=\"Open file select panel\"\n		ngf-select=\"upload($files)\">\n			<ng-md-icon icon=\"cloud\"></ng-md-icon> Select Files\n		</md-button>\n	</div>\n\n	<div ngf-no-file-drop>File Drag/Drop is not supported for this browser</div> -->\n\n	<md-grid-list md-cols-xs =\"1\" md-cols-sm=\"3\" md-cols-md=\"5\" md-cols-lg=\"6\" md-cols-gt-lg=\"10\" md-row-height-gt-md=\"1:1\" md-row-height=\"4:3\" md-gutter=\"12px\" md-gutter-gt-sm=\"8px\">\n\n		<md-grid-tile ng-repeat=\"i in data\" class=\"md-whiteframe-z2\" ng-click=\"imageDetails(i)\">\n\n			<div class=\"thumbnail\">\n					<img ng-src=\"{{i.path}}\" draggable=\"false\" alt=\"{{i.name}}\">\n			</div>\n			<md-grid-tile-footer><h3>{{i.name}}</h3></md-grid-tile-footer>\n		</md-grid-tile>\n	</md-grid-list>\n\n	<pre ng-if=\"files[0].$error\">Upload Log: {{f.$error}} {{f.$errorParam}}</pre>\n</div>\n</div>\n<footer></footer>\n");
$templateCache.put("app/order/order.html","<navbar leftmenu=\"true\"></navbar>\n<left-menu></left-menu>\n<md-card>\n      <md-card-header style=\"background:#e2ee22\" ng-if=\"order.payment.id\">\n          <md-card-header-text>\n            <h3>Order placed successfully</h3>\n            <span class=\"md-subhead\" >\n                <span ng-if=\"order.payment.id\">Payment ID: {{order.payment.id}}</span><br/>\n            </span>\n          </md-card-header-text>\n          \n      </md-card-header>\n</md-card>\n<md-content class=\"content md-padding\" layout=\"column\" layout-align=\"start center\">\n      <section ng-if=\"order.orders.length>0\" class=\"header\" layout=\"column\" layout-align=\"center center\">\n        <h1>Your Orders</h1>\n        <md-input-container flex>\n          <label>Search Orders</label>\n          <input name=\"search\" type=\"text\" ng-model=\"order.search\" md-autofocus/>\n        </md-input-container>\n      </section>\n\n      <!--When No Orders-->\n      <section ng-if=\"order.orders.length===0\" class=\"header\" layout=\"column\" layout-align=\"center stretch\">\n        <h1>You have not purchased anything yet</h1>\n        <md-button ui-sref=\"/\" class=\"md-primary md-raised\">\n        <ng-md-icon icon=\"shopping_cart\"></ng-md-icon>Shop Now\n\n        </md-buton>\n      </section>\n\n  <section layout=\"column\" class=\"orders\">\n  <md-card ng-repeat=\"o in order.orders | orderBy : \'orderDate\' : \'reverse\' | filter:order.search\">\n      <md-card-header>\n          <md-card-header-text>\n            <span class=\"\">ORDER PLACED</span>\n            <span class=\"md-subhead\">{{o.created_at | amCalendar}}</span>\n          </md-card-header-text>\n          <md-card-header-text>\n            <span class=\"\">TOTAL</span>\n            <span class=\"md-subhead\">{{o.amount.total | localPrice}}</span>\n          </md-card-header-text>\n          <md-card-header-text hide show-gt-sm>\n            <span class=\"\">SHIP TO</span>\n            <span class=\"md-subhead\">{{o.address.recipient_name}}</span>\n          </md-card-header-text>\n          <md-card-header-text>\n            <span class=\"\">Order # </span>\n            <span class=\"md-subhead\">{{o.orderNo}}</span>\n          </md-card-header-text>\n      </md-card-header>\n      <md-card-content layout=\"column\" layout-gt-sm=\"row\" layout-align=\"space-between\">\n          <md-list flex=40>\n            <div layout=\"row\" ng-repeat=\"i in o.items\">\n              <md-card-avatar>\n                  <img ng-src=\"{{i.url}}\" err-SRC=\"/assets/images/150x150-51101e3000.png\" alt=\"{{i.name}}\" width=\"100px\" hide show-gt-xs>\n              </md-card-avatar>\n              <div class=\"content\">\n              <a ng-click=\"order.navigate(i)\">{{i.name}}</a><br/><br/>\n              <b>Amount:&nbsp;&nbsp;</b> {{i.price | localPrice}} * {{i.quantity}}&nbsp;=&nbsp;{{i.price * i.quantity | localPrice}}\n              <div ng-if=\"i.amount.details.shipping>0\"><b>Shipping: </b> {{i.amount.details.shipping | localPrice}}</div>\n              <br/>\n                \n              </div>\n            </div>\n          </md-list>\n            <md-list class=\"order-address\" flex=30>\n                  <ng-md-icon icon=\"local_shipping\"></ng-md-icon>&nbsp;Address\n                  <hr>\n                  {{o.address.line1}}<br/>\n                  {{o.address.city}}<br/>\n                  {{o.address.postal_code}}<br/>\n                  {{o.address.state}}<br/>\n                  {{o.phone}}<br/>\n                  {{o.address.country_code}}<br/>\n                  <p class=\"md-subhead\">Order Status: &nbsp;{{o.status}}</p>\n           </md-list>\n      </md-card-content>\n  </md-card>\n  </section>\n</md-content>\n<footer></footer>\n");
$templateCache.put("app/orders/orders.html","<navbar leftmenu=\"true\"></navbar>\n<left-menu></left-menu>\n<md-content flex class=\"content md-padding\" layout=\"column\" layout-align=\"start center\">\n      <section class=\"header\" layout=\"column\" layout-align=\"center center\">\n        <h2>Orders Management</h2>\n        <md-input-container flex>\n          <label>Search Orders</label>\n          <input name=\"search\" type=\"text\" ng-model=\"orders.search\" md-autofocus/>\n        </md-input-container>\n      </section>\n  <section layout=\"column\" class=\"orders\">\n  <md-card ng-repeat=\"o in orders.orders | orderBy : \'orderDate\' : \'reverse\' | filter:orders.search\">\n      <md-card-header layout=\"row\">\n        <div layout=\"row\">\n          <md-card-header-text>\n            <span class=\"\"># {{o.orderNo}}</span>\n            <span class=\"md-subhead\">{{o.created_at | amCalendar}}</span>\n          </md-card-header-text>\n          <md-card-header-text>\n            <span class=\"\">TOTAL</span>\n            <span class=\"md-subhead\">{{o.amount.total | localPrice}}</span>\n          </md-card-header-text>\n        </div>\n        <div layout=\"column\" layout-gt-sm=\"row\" flex>\n          <md-card-header-text>\n            <span class=\"\">Payment </span>\n            <span class=\"md-subhead\">{{o.payment_method}}</span>\n          </md-card-header-text>\n          <md-card-header-text>\n            <span class=\"\">Order Status</span>\n            <span class=\"md-subhead\">\n              <md-select ng-model=\"o.status\" placeholder=\"Order Status\" ng-change=\"orders.changeStatus(o)\" flex>\n                <md-option ng-value=\"o\" ng-repeat=\"o in orders.Settings.orderStatus\">{{o}}</md-option>\n              </md-select>\n            </span>\n          </md-card-header-text>\n          <md-card-header-text>\n            <span class=\"\">Payment Status </span>\n            <span class=\"md-subhead\">\n              <md-select ng-model=\"o.payment.state\" placeholder=\"Payment Status\" ng-change=\"orders.changeStatus(o)\">\n                <md-option ng-value=\"o\" ng-repeat=\"o in orders.Settings.paymentStatus\">{{o}}</md-option>\n              </md-select>\n            </span>\n          </md-card-header-text>\n        </div>\n      </md-card-header>\n      <md-card-content layout=\"column\" layout-gt-sm=\"row\" layout-align=\"space-between\">\n          <md-list flex=40>\n            <div layout=\"row\" ng-repeat=\"i in o.items\">\n              <md-card-avatar>\n                 <img ng-src=\"{{i.url}}\" err-SRC=\"/assets/images/150x150-51101e3000.png\" class=\"md-card-image\" alt=\"{{i.name}}\" width=\"100px\" hide show-gt-xs>\n              </md-card-avatar>\n              \n              <div class=\"content\">\n              <a ng-click=\"orders.navigate(i)\">{{i.name}}</a><br/><br/>\n              <b>Amount:&nbsp;&nbsp;</b> {{i.price | localPrice}} * {{i.quantity}}&nbsp;=&nbsp;{{i.price * i.quantity | localPrice}}\n              <div ng-if=\"i.amount.details.shipping>0\"><b>Shipping: </b> {{i.amount.details.shipping | localPrice}}</div>\n              <br/>\n                \n              </div>\n            </div>\n          </md-list>\n                <md-list class=\"md-list-item-text order-address\" flex=30>\n                  <ng-md-icon icon=\"local_shipping\"></ng-md-icon>&nbsp;Address\n                  <hr>\n                  {{o.address.recipient_name}}<br/>\n                  {{o.address.line1}}<br/>\n                  {{o.address.city}}<br/>\n                  {{o.address.postal_code}}<br/>\n                  {{o.address.state}}<br/>\n                  {{o.phone}}<br/>\n                  {{o.address.country_code}}<br/>\n                </md-list>\n      </md-card-content>\n  </md-card>\n  </section>\n</md-content>\n<footer></footer>\n");
$templateCache.put("app/payment/cancel.html","<navbar leftmenu=\"true\"></navbar>\n<left-menu></left-menu>\n<md-content flex class=\"content md-padding\" layout=\"column\" layout-align=\"start center\">\n      <section class=\"header\" layout=\"column\" layout-align=\"center center\">\n        <h2>Payment Process Cancelled</h2>\n      </section>\n</md-content>\n<footer></footer>\n");
$templateCache.put("app/payment/error.html","<navbar leftmenu=\"true\"></navbar>\n<left-menu></left-menu>\n<md-content flex class=\"content md-padding\" layout=\"column\" layout-align=\"start center\">\n      <section class=\"header\" layout=\"column\" layout-align=\"center center\">\n        <h2>Payment Error Occured</h2>\n          <label>Here is more details about the error</label>\n      </section>\n</md-content>\n<footer></footer>\n");
$templateCache.put("app/payment/success.html","<navbar leftmenu=\"true\"></navbar>\n<left-menu></left-menu>\n<md-content flex class=\"content md-padding\" layout=\"column\" layout-align=\"start center\">\n      <section class=\"header\" layout=\"column\" layout-align=\"center center\">\n        <h2>Payment Successful</h2>\n        <md-input-container flex>\n          <label>Search Payments</label>\n          <input name=\"search\" type=\"text\" ng-model=\"payment.search\" md-autofocus/>\n        </md-input-container>\n      </section>\n  <section layout=\"column\" class=\"orders\">\n  <md-card ng-repeat=\"o in payment.orders | orderBy : \'orderDate\' : \'reverse\' | filter:payment.search\">\n      <md-card-header>\n          <md-card-header-text>\n            <span class=\"\">ORDER PLACED</span>\n            <span class=\"md-subhead\">{{o.created_at | amCalendar}}</span>\n          </md-card-header-text>\n          <md-card-header-text>\n            <span class=\"\">TOTAL</span>\n            <span class=\"md-subhead\">{{o.total | currency}}</span>\n          </md-card-header-text>\n          <md-card-header-text>\n            <span class=\"\">SHIP TO</span>\n            <span class=\"md-subhead\">{{o.name}}</span>\n          </md-card-header-text>\n          <md-card-header-text>\n            <span class=\"\">Order # </span>\n            <span class=\"md-subhead\">{{o.orderNo}}</span>\n          </md-card-header-text>\n      </md-card-header>\n      <md-card-content layout=\"row\" layout-align=\"space-between\">\n          <div flex>\n            <div layout=\"row\" ng-repeat=\"i in o.items\">\n              <md-card-avatar>\n                  <img ng-src=\"{{i.image}}\" class=\"md-card-image\" alt=\"i.name\" width=\"100px\">\n              </md-card-avatar>\n              \n              <div class=\"content\">\n              <a ng-click=\"payment.navigate(i)\">{{i.name}}</a><br/>\n              Size: <b>{{i.size}}</b><br/>\n              Amount: <b>{{i.price}} * {{i.quantity}}&nbsp;=&nbsp;{{i.price * i.quantity | currency: payment.Settings.currency.symbol}}</b>\n              <del ng-if=\"i.price!=i.mrp\">{{i.mrp}}</del><br/>\n              <br/>\n                \n              </div>\n            </div>\n          </div>\n          <md-card-actions layout=\"column\" class=\"content\">\n            <md-list flex>\n              <md-list-item class=\"md-2-line\">\n                <div class=\"md-list-item-text\">\n                  <h2 class=\"md-subhead\"><ng-md-icon icon=\"local_shipping\"></ng-md-icon>&nbsp;Address</h2>\n                  <hr>\n                  {{o.address}}<br/>\n                  {{o.city}}<br/>\n                  {{o.zip}}<br/>\n                  {{o.phone}}<br/>\n                </div>\n              </md-list-item>\n\n              <!--<md-list-item>\n                <div class=\"md-list-item-text\">\n                  <p class=\"md-subhead\">Payment Status: &nbsp;</p>\n                </div>\n                  <md-select ng-model=\"o.payment\" placeholder=\"Payment Status\" ng-change=\"payment.changeStatus(o)\">\n                    <md-option ng-value=\"o\" ng-repeat=\"o in payment.Settings.paymentStatus\">{{o}}</md-option>\n                  </md-select>\n              </md-list-item>-->\n\n              <md-list-item>\n                <div class=\"md-list-item-text\">\n                  <p  class=\"md-subhead\">Order Status: &nbsp;</p>\n                </div>\n                  <md-select ng-model=\"o.status\" placeholder=\"Order Status\" ng-change=\"payment.changeStatus(o)\" flex>\n                    <md-option ng-value=\"o\" ng-repeat=\"o in payment.Settings.orderStatus\">{{o}}</md-option>\n                  </md-select>\n              </md-list-item>\n           </md-list>\n          </md-card-actions>\n      </md-card-content>\n  </md-card>\n  </section>\n</md-content>\n<footer></footer>\n");
$templateCache.put("app/payment-method/payment-method.html","<crud-table api=\'PaymentMethod\' options=\'options\'></crud-table>\n");
$templateCache.put("app/product/detail.html","<md-toolbar class=\"md-hue-1\" id=\"user-detail-toolbar\">\n	<span layout=\"row\" layout-align=\"space-between\" class=\"md-toolbar-tools md-toolbar-tools-top\">\n		<md-button ng-click=\"detail.goBack();\" aria-label=\"Close detail view\">\n			<ng-md-icon icon=\"close\" aria-label=\"Close dialog\"></ng-md-icon>\n		</md-button>\n		<h3>Edit {{detail.header | labelCase}}</h3>\n		<md-button aria-label=\"-\">\n		</md-button>\n	</span>\n</md-toolbar>\n<md-content class=\"md-padding\" flex layout-fill ng-cloak id=\"user-detail-content\">\n	<section class=\"section\" layout=\"row\">\n    \n<form name=\"form\" layout=\"column\" layout-fill layout-align=\"space-between\" ng-submit=\"detail.save(detail.product);detail.goBack();\" novalidate autocomplete=\"off\">\n		<span layout=\"column\" layout-sm=\"column\">\n		  <!--<md-content>-->\n				<br/>\n			    <section layout=\"column\">\n							<span layout=\"row\">\n								<!--<md-input-container flex>\n									<label>SKU</label>\n									<input name=\"sku\" ng-model=\"detail.product.sku\" md-autofocus>\n								</md-input-container>-->\n\n								<md-input-container flex>\n									<label>Name</label>\n									<input name=\"name\" ng-model=\"detail.product.name\"/>\n								</md-input-container>\n							</span>\n								<md-input-container flex>\n									<label>Description</label>\n									<textarea name=\"description\" ng-model=\"detail.product.info\" rows=\"2\"></textarea>\n								</md-input-container>\n								<span layout=\"row\">\n									<md-input-container flex>\n										<label>Platform</label>\n										<md-select ng-model=\"detail.product.category\">\n											<md-option ng-repeat=\"o in detail.options.categories\" value=\"{{o._id}}\">\n												{{o.name}} - <b>{{o.parent.name}}</b>\n											</md-option>\n										</md-select>\n										<md-button ui-sref=\"category\"><ng-md-icon icon=\"subject\"></ng-md-icon>New Platform</md-button>\n									</md-input-container>\n									<md-input-container flex>\n										<label>Category</label>\n										<md-select ng-model=\"detail.product.brand\">\n											<md-option ng-repeat=\"o in detail.options.brands\" value=\"{{o._id}}\">\n												{{o.name}}\n											</md-option>\n										</md-select>\n										<md-button ui-sref=\"brand\"><ng-md-icon icon=\"verified_user\"></ng-md-icon>New Category</md-button>\n									</md-input-container>\n								</span>\n								\n\n							<span layout=\"row\">\n								<!-- <md-input-container flex>\n									<label>SKU</label>\n									<input name=\"sku\" ng-model=\"detail.product.sku\" md-autofocus>\n								</md-input-container> -->\n\n								<md-input-container flex>\n									<label>Website</label>\n									<input name=\"sku\" ng-model=\"detail.product.website\" md-autofocus>\n								\n								</md-input-container>\n\n								<md-input-container flex>\n									<label>Logo</label>\n									<input class=\"inputfile\" type=\"file\" ng-model=\"detail.product.logo\" name=\"inputFile\" base-sixty-four-input  maxsize=\"500\" accept=\"image/*\"/>\n											\n\n								</md-input-container>\n\n								<div class=\"product-thumbnail\">\n                                      \n	                           	   <a>\n	                                    <img data-ng-src=\"data:image/png;base64,{{detail.product.logo.base64}}\"  alt=\"{{item.publisher}}\" style=\"width: 50px;\">\n	                                </a>\n\n\n                                </div>\n								\n							</span>\n							<span layout=\"row\">\n								<md-input-container flex>\n									<label>Phone</label>\n									<input name=\"sku\" ng-model=\"detail.product.phone\" md-autofocus>\n								</md-input-container>\n\n								<md-input-container flex>\n									<label>Email</label>\n									<input name=\"sku\" ng-model=\"detail.product.email\" md-autofocus>\n								\n								</md-input-container>\n								\n							</span>\n\n							<md-input-container flex>\n									<label>Terms Of Use</label>\n									<textarea name=\"description\" ng-model=\"detail.product.terms\" rows=\"2\"></textarea>\n								</md-input-container>\n			    </section>\n			    <section>\n			      <md-subheader class=\"md-warn\">General Features</md-subheader> \n						<md-button ui-sref=\"feature\"><ng-md-icon icon=\"spellcheck\"></ng-md-icon>New Feature</md-button>\n						<table md-colresize=\"md-colresize\" class=\"md-table\" id=\"exportable\">\n							<thead>\n								<tr class=\"md-table-headers-row\">\n									<th class=\"md-table-header\">#</th>\n									<th class=\"md-table-header\">Key</th>\n									<th class=\"md-table-header\">Value</th>\n									<th class=\"md-table-header\"></th>\n								</tr>\n							</thead>\n\n							<tbody>\n\n								<tr ng-repeat=\"feature in detail.product.features track by $index\" id=\"{{feature._id}}\"\n										class=\"md-table-content-row\"\n										ng-class=\"{\'selected\': detail.isSelected(p)}\">\n									<td>{{$index+1}}</td>\n									<td>\n										<md-input-container flex>\n											<md-select ng-model=\"feature.key\" aria-label=\"Features Key\">\n												<md-option ng-repeat=\"o in detail.options.features | unique: \'key\'\" value=\"{{o.key}}\">\n													{{o.key}}\n												</md-option>\n											</md-select>\n										</md-input-container>\n									</td>\n									<td>\n										<md-input-container flex>\n											<md-select ng-model=\"feature.val\" aria-label=\"Features Value\">\n												<md-option ng-repeat=\"o in detail.options.features | filter: feature.key | unique: \'val\'\" value=\"{{o.val}}\">\n													{{o.val}}\n												</md-option>\n											</md-select>\n										</md-input-container>\n									</td>\n									<td>\n										<md-button class=\"md-icon-button\" aria-label=\"Delete Feature\" ng-click=\"detail.deleteFeature($index,detail.product);\"><ng-md-icon icon=\"delete\"></ng-md-icon></md-button>\n									</td>\n								</tr>\n								<tr>\n									<td></td>\n									<td>\n										<md-input-container flex>\n											<md-select ng-model=\"detail.product.features[detail.product.features.length].key\" aria-label=\"Features Key\">\n												<md-option ng-repeat=\"o in detail.options.features | unique: \'key\'\" value=\"{{o.key}}\">\n													{{o.key}}\n												</md-option>\n											</md-select>\n										</md-input-container>\n									</td>\n									<td>\n										<md-input-container flex>\n											<md-select ng-model=\"detail.product.features[detail.product.features.length].val\" aria-label=\"Features Value\">\n												<md-option ng-repeat=\"o in detail.options.features | filter: feature.key | unique: \'val\'\" value=\"{{o.val}}\">\n													{{o.val}}\n												</md-option>\n											</md-select>\n										</md-input-container>\n									</td>\n									<td></td>\n								</tr>\n							</tbody>\n			      </table>\n			    </section>\n			    <section>\n			      <md-subheader class=\"md-warn\">Key Features</md-subheader>\n						<a href=\"/feature\" class=\"pull-right\">Create New</a>\n						<table md-colresize=\"md-colresize\" class=\"md-table\" id=\"exportable\">\n							<thead>\n								<tr class=\"md-table-headers-row\">\n									<th class=\"md-table-header\">#</th>\n									<th class=\"md-table-header\">Key</th>\n									<th class=\"md-table-header\">Value</th>\n									<th class=\"md-table-header\"></th>\n								</tr>\n							</thead>\n\n							<tbody>\n\n								<tr ng-repeat=\"feature in detail.product.keyFeatures track by $index\" id=\"{{feature._id}}\"\n										class=\"md-table-content-row\"\n										ng-class=\"{\'selected\': detail.isSelected(p)}\">\n									<td>{{$index+1}}</td>\n									<td>\n										<md-input-container flex>\n											<md-select ng-model=\"feature.key\" aria-label=\"Features Key\">\n												<md-option ng-repeat=\"o in detail.options.features | unique: \'key\'\" value=\"{{o.key}}\">\n													{{o.key}}\n												</md-option>\n											</md-select>\n										</md-input-container>\n									</td>\n									<td>\n										<md-input-container flex>\n											<input name=\"size\" ng-model=\"feature.val\"  aria-label=\"Features Value\"/>\n\n											\n										</md-input-container>\n									</td>\n									<td>\n										<md-button class=\"md-icon-button\" aria-label=\"Delete Feature\" ng-click=\"detail.deleteFeature($index,detail.product);\"><ng-md-icon icon=\"delete\"></ng-md-icon></md-button>\n									</td>\n								</tr>\n								<tr>\n									<td></td>\n									<td>\n										<md-input-container flex>\n											<md-select ng-model=\"detail.product.keyFeatures[detail.product.keyFeatures.length].key\" aria-label=\"Features Key\">\n												<md-option ng-repeat=\"o in detail.options.features | unique: \'key\'\" value=\"{{o.key}}\">\n													{{o.key}}\n												</md-option>\n											</md-select>\n										</md-input-container>\n									</td>\n									<td>\n										<md-input-container flex>\n										<input name=\"size\" ng-model=\"detail.product.keyFeatures[detail.product.keyFeatures.length].val\"  aria-label=\"Features Value\"/>\n											\n										</md-input-container>\n									</td>\n									<td></td>\n								</tr>\n							</tbody>\n			      </table>\n			    </section>\n\n			    <section>\n			      <md-subheader class=\"md-warn\">General Statistics</md-subheader> \n						<md-button ui-sref=\"stat\"><ng-md-icon icon=\"spellcheck\"></ng-md-icon>New entry</md-button>\n						<table md-colresize=\"md-colresize\" class=\"md-table\" id=\"exportable\">\n							<thead>\n								<tr class=\"md-table-headers-row\">\n									<th class=\"md-table-header\">#</th>\n									<th class=\"md-table-header\">Key</th>\n									<th class=\"md-table-header\">Value</th>\n									<th class=\"md-table-header\"></th>\n								</tr>\n							</thead>\n\n							<tbody>\n\n								<tr ng-repeat=\"stat in detail.product.stats track by $index\" id=\"{{stat._id}}\"\n										class=\"md-table-content-row\"\n										ng-class=\"{\'selected\': detail.isSelected(p)}\">\n									<td>{{$index+1}}</td>\n									<td>\n										<md-input-container flex>\n											<md-select ng-model=\"stat.key\" aria-label=\"stats Key\">\n												<md-option ng-repeat=\"o in detail.options.statistics | unique: \'key\'\" value=\"{{o.key}}\">\n													{{o.key}}\n												</md-option>\n											</md-select>\n										</md-input-container>\n									</td>\n									<td>\n										<md-input-container flex>\n										<input name=\"size\" ng-model=\"stat.val\" aria-label=\"Statistics\"/>\n											\n										</md-input-container>\n									</td>\n									<td>\n										<md-button class=\"md-icon-button\" aria-label=\"Delete stat\" ng-click=\"detail.deleteStat($index,detail.product);\"><ng-md-icon icon=\"delete\"></ng-md-icon></md-button>\n									</td>\n								</tr>\n								<tr>\n									<td></td>\n									<td>\n										<md-input-container flex>\n											<md-select ng-model=\"detail.product.stats[detail.product.stats.length].key\" aria-label=\"stats Key\">\n												<md-option ng-repeat=\"o in detail.options.statistics | unique: \'key\'\" value=\"{{o.key}}\">\n													{{o.key}}\n												</md-option>\n											</md-select>\n										</md-input-container>\n									</td>\n									<td>\n										<md-input-container flex>\n\n											<input name=\"statistics\"  ng-model=\"detail.product.stats[detail.product.statistics.length].val\" aria-label=\"Statistics\"/>\n											\n										</md-input-container>\n									</td>\n									<td></td>\n								</tr>\n							</tbody>\n			      </table>\n			    </section>\n			    <section>\n			      <md-subheader class=\"md-accent\">Media Options</md-subheader>\n\n			   						<table md-colresize=\"md-colresize\" class=\"md-table\" id=\"exportable\">\n							<thead>\n								<tr class=\"md-table-headers-row\">\n									<th class=\"md-table-header\">#</th>\n									<th class=\"md-table-header\">Preview</th>\n									<th class=\"md-table-header\">Name</th>\n									<th class=\"md-table-header\">Dimensions</th>\n									<th class=\"md-table-header\">Fomart</th>\n									<th class=\"md-table-header\">Model</th>\n									<th class=\"md-table-header\">Price</th>\n									<th class=\"md-table-header\">Image</th>\n									<th class=\"md-table-header\"></th>\n								</tr>\n							</thead>\n\n							<tbody>\n\n								<tr ng-repeat=\"v in detail.product.variants track by $index\" id=\"{{v._id}}\"\n										class=\"md-table-content-row\"\n										ng-class=\"{\'selected\': detail.isSelected(p)}\">\n									<td>{{$index+1}}</td>\n									<td>\n										<md-input-container flex>\n											<img ng-src=\"{{v.image}}\" alt=\"{{v.name}}\" err-SRC=\"/assets/images/material-shop-15b7652109.jpg\" style=\"height:50px\">\n										</md-input-container>\n									</td>\n									<td>\n										<md-input-container flex>\n											<input name=\"size\" ng-model=\"v.name\" aria-label=\"Media Name\"/>\n\n										</md-input-container>\n									</td>\n									<td>\n										<md-input-container flex>\n											<input name=\"size\" ng-model=\"v.size\" aria-label=\"Dimensions\"/>\n										</md-input-container>\n									</td>\n									<td>\n										<md-input-container flex>\n											<input name=\"weight\" ng-model=\"v.formart\" aria-label=\"Media Formart\"/>\n										</md-input-container>\n									</td>\n									<td>\n										<md-input-container flex>\n											<input name=\"mrp\" ng-model=\"v.model\" aria-label=\"Pricing Model\" />\n										</md-input-container>\n									</td>\n									<td>\n										<md-input-container flex>\n											<input name=\"price\" ng-model=\"v.price\" aria-label=\"Media Selling Price\" only-numbers/>\n										</md-input-container>\n									</td>\n									<td>\n										<md-input-container flex>\n											<input name=\"image\" ng-model=\"v.image\" aria-label=\"Media Preview\"/>\n											<ng-md-icon icon=\"insert_photo\" ng-click=\"detail.mediaLibrary($index)\"></ng-md-icon>\n										</md-input-container>\n									</td>\n									<td>\n										<md-button class=\"md-icon-button\" aria-label=\"Delete Feature\"   ng-click=\"detail.deleteVariants($index,product);\"><ng-md-icon icon=\"delete\"></ng-md-icon></md-button>\n									</td>\n								</tr>\n								<tr class=\"md-table-content-row\"\n										ng-class=\"{\'selected\': detail.isSelected(p)}\">\n									<td>&nbsp;</td>\n									<td>New</td>\n									<td>\n										<md-input-container flex>\n											<input name=\"size\" ng-model=\"detail.product.newVariant.name\" aria-label=\"Media Name\"/>\n										</md-input-container>\n									</td>\n									<td>\n										<md-input-container flex>\n											<input name=\"size\" ng-model=\"detail.product.newVariant.size\" aria-label=\"Media Dimensions\"/>\n										</md-input-container>\n									</td>\n									<td>\n										<md-input-container flex>\n											<input name=\"weight\" ng-model=\"detail.product.newVariant.formart\" aria-label=\"Media Formart\"/>\n										</md-input-container>\n									</td>\n									<td>\n										<md-input-container flex>\n											<input name=\"mrp\" ng-model=\"detail.product.newVariant.model\" aria-label=\"Pricing Model\"/>\n										</md-input-container>\n									</td>\n									<td>\n										<md-input-container flex>\n											<input name=\"price\" ng-model=\"detail.product.newVariant.price\" aria-label=\"Media Selling Price\" only-numbers/>\n										</md-input-container>\n									</td>\n									<td>\n										<md-input-container flex>\n											<input name=\"image\" ng-model=\"detail.product.newVariant.image\" aria-label=\"Variant Image\"/>\n											<ng-md-icon icon=\"insert_photo\" ng-click=\"detail.mediaLibrary(1000000)\"></ng-md-icon>\n										</md-input-container>\n									</td>\n									<td>\n									</td>\n								</tr>\n							</tbody>\n			      </table>\n			    </section>\n\n			  </md-content>\n\n		<md-dialog-actions layout=\"row\">\n			<span flex></span>\n			<md-button ng-disabled=\"detailForm.$invalid\" type=\"submit\" class=\"md-primary md-raised\" aria-label=\"Save changes\">Save</md-button>\n		</md-dialog-actions>\n		</form>\n\n	</section>\n\n	<section class=\"section\" layout=\"column\" ng-hide=\"detail.isRoot\">\n\n		<span class=\"section-title\">Record Information</span>\n		<span layout=\"row\" layout-sm=\"column\" class=\"detail-info\">\n			<span flex>Modified\n				<span am-time-ago=\"detail.product.updated_at\"></span>\n				{{detail.product.updated_at && \'by \' + detail.product.uid}}\n				<md-tooltip>{{detail.product.updated_at | date:\'dd. MMMM yyyy H:mm\'}}</md-tooltip>\n			</span>\n		</span>\n\n		<span layout=\"row\" layout-sm=\"column\" class=\"detail-info\" ng-show=\"detail.product.created_at\">\n			<span flex=\"25\">Created</span>\n			<span flex>{{detail.product.created_at | date:\'dd. MMMM yyyy H:mm\'}}</span>\n		</span>\n\n	</section>\n\n<!--</md-content>-->\n\n<md-button class=\"md-fab md-accent md-fab-bottom-right fab-overlap md-button ng-scope md-blue-theme\" aria-label=\"Save Product\" ng-if=\"form.$dirty\" ng-click=\"detail.save(detail.product);\">\n	<ng-md-icon icon=\"save\"></ng-md-icon>\n</md-button>\n<script type=\"text/javascript\">\n	var inputs = document.querySelectorAll( \'.inputfile\' );\nArray.prototype.forEach.call( inputs, function( input )\n{\n	var label	 = input.nextElementSibling,\n		labelVal = label.innerHTML;\n\n	input.addEventListener( \'change\', function( e )\n	{\n		var fileName = \'\';\n		if( this.files && this.files.length > 1 )\n			fileName = ( this.getAttribute( \'data-multiple-caption\' ) || \'\' ).replace( \'{count}\', this.files.length );\n		else\n			fileName = e.target.value.split( \'\\\\\' ).pop();\n\n		if( fileName )\n			label.querySelector( \'span\' ).innerHTML = fileName;\n		else\n			label.innerHTML = labelVal;\n	});\n});\n</script>\n");
$templateCache.put("app/product/list.html","<a ng-click=\"main.create();\">\n	<md-button  show-gt-xs class=\"md-fab md-accent md-fab-top-left fab-overlap md-button ng-scope md-blue-theme\" aria-label=\"Create a new  {{list.header}}\" ng-if=\"!list.no.add\">\n		<ng-md-icon icon=\"add\"></ng-md-icon>\n	</md-button>\n</a>\n<md-progress-linear md-mode=\"indeterminate\" ng-show=\"list.loading\"></md-progress-linear>\n\n <!-- Add div For infinite scroll -->\n <md-content class=\"scroll products\">\n	<md-card infinite-scroll=\'list.loadMore()\' infinite-scroll-disabled=\'list.busy\' infinite-scroll-distance=\'1\' ng-if=\"list.data.length\">\n		<md-toolbar class=\"md-table-toolbar md-default\" aria-hidden=\"false\"\n		ng-hide=\"list.selected.length || filter.show || list.data.search\">\n      <div class=\"md-toolbar-tools\">\n				<h2 class=\"md-title\">List of {{list.header | labelCase}}s</h2>\n			  <div flex></div>\n			  <md-button tabindex=\"0\" ng-click=\"filter.show = true;\" class=\"md-icon-button md-button md-default-theme\" ng-show=\"!list.no.filter\"\n				aria-label=\"Open filter box for {{list.header}}s table\">\n			    <ng-md-icon icon=\"filter_list\"></ng-md-icon>\n			  </md-button>\n				<md-menu md-position-mode=\"target-right target\" ng-if=\"!list.no.export\">\n	      <md-button aria-label=\"Open options menu\" class=\"md-icon-button\" ng-click=\"list.openMenu($mdOpenMenu, $event)\">\n	        <ng-md-icon icon=\"inbox\"></ng-md-icon>\n	      </md-button>\n	      <md-menu-content width=\"4\">\n	        <md-menu-item>\n	          <md-button\n							ng-click=\"list.exportData(\'xls\');\"\n							aria-label=\"Export {{list.header}}s table as Excel\">\n	            <ng-md-icon icon=\"receipt\"></ng-md-icon>\n	            Excel\n	          </md-button>\n	        </md-menu-item>\n					<md-menu-divider></md-menu-divider>\n	        <md-menu-item>\n	          <md-button ng-click=\"list.exportData(\'json\');\" aria-label=\"Export {{list.header}}s table in JSON format\">\n	            <ng-md-icon icon=\"account_balance_wallet\"></ng-md-icon>\n	            JSON\n	          </md-button>\n	        </md-menu-item>\n	        <md-menu-divider></md-menu-divider>\n	        <md-menu-item>\n	          <md-button ng-click=\"list.exportData(\'txt\');\" aria-label=\"Export {{list.header}}s table in Text format\">\n	            <ng-md-icon icon=\"text_format\"></ng-md-icon>\n	            Text\n	          </md-button>\n	        </md-menu-item>\n	        <md-menu-divider></md-menu-divider>\n\n	      </md-menu-content>\n	    </md-menu>\n      </div>\n    </md-toolbar>\n\n		<md-toolbar class=\"md-table-toolbar md-default\"\n			ng-show=\"filter.show || list.data.search\"\n			aria-hidden=\"false\">\n      <div class=\"md-toolbar-tools\">\n				<ng-md-icon icon=\"search\"></ng-md-icon>\n				<md-input-container flex class=\"mgt30\">\n		      <label>Filter {{list.header}}s</label>\n		      <input ng-model=\"list.data.search\" focus-me=\"filter.show\">\n		    </md-input-container>\n				<ng-md-icon icon=\"close\" ng-click=\"filter.show = false; list.data.search = \'\';\" class=\"link\"></ng-md-icon>\n			</div>\n		</md-toolbar>\n\n<div class=\"md-table-container\">\n	<table md-colresize=\"md-colresize\" class=\"md-table\" id=\"exportable\">\n		<thead>\n			<tr class=\"md-table-headers-row\">\n				<th class=\"md-table-header\"></th>\n				<th ng-repeat=\"h in list.cols track by $index\" class=\"md-table-header\">\n					<a href=\"#\" ng-click=\"reverse=!reverse;list.order(h.field)\" ng-if=\"!list.no.sort && !h.noSort\">\n						{{h.heading | labelCase}}\n<ng-md-icon 	icon=\"arrow_downward\"\n					options=\'{\"rotation\": \"counterclock\"}\'\n					ng-show=\"reverse && h.field === list.sort.predicate\"\n					class=\"s18\"></ng-md-icon>\n<ng-md-icon 	icon=\"arrow_upwards\"\n					ng-show=\"!reverse && h.field === list.sort.predicate\"\n					options=\'{\"rotation\": \"counterclock\"}\'></ng-md-icon>\n					</a>\n					<a href=\"#\" ng-if=\"list.no.sort || h.noSort\">\n						{{h.heading | labelCase}}\n					</a>\n				</th>\n				<th class=\"md-table-header\"></th>\n\n			</tr>\n\n		</thead>\n\n		<tbody>\n\n			<tr ng-repeat=\"p in filtered = ((list.data | orderBy:list.sort.predicate:list.sort.reverse) | filter:q | filter:list.data.search | limitTo: list.l) track by p._id\" id=\"{{p._id}}\"\n					class=\"md-table-content-row\"\n					ng-class=\"{\'selected\': list.isSelected(p)}\">\n				<td>\n					<md-button class=\"md-icon-button\" aria-label=\"More\" ng-click=\"list.showInDetails(p);\" ng-if=\"!list.no.edit\">\n	      	  <ng-md-icon icon=\"edit\"></ng-md-icon>\n	    	  </md-button>\n				</td>\n				<td>\n					<list-image ng-if=\"!p.logo.base64\" string=\"{{p.name}}\"></list-image>\n					<img ng-if=\"p.logo.base64\" data-ng-src=\"data:image/png;base64,{{p.logo.base64}}\" err-SRC=\"/assets/images/material-shop-15b7652109.jpg\" />\n				</td>\n				<td>\n					<a ng-click=\"list.gotoDetail(p)\">{{p.name}}</a>\n				</td>\n\n				<td>\n					<md-switch class=\"md-secondary\" ng-model=\"p.active\" ng-change=\"list.changeStatus(p)\" aria-label=\"p.active\"></md-switch>\n				</td>\n				<td>\n					<md-button class=\"md-icon-button\" aria-label=\"Delete\" ng-click=\"list.delete(p);\" ng-if=\"!list.no.delete\">\n	        	<ng-md-icon icon=\"delete\"></ng-md-icon>\n					</md-button>\n				</td>\n			</tr>\n		</tbody>\n\n	</table>\n</div>\n <div class=\"md-table-pagination\">\n		<span>Filtered {{filtered.length}} of {{list.data.length}} {{list.header}}s</span>\n	</div>\n</md-card>\n </md-content>\n\n<a ng-click=\"main.create();\" ng-if=\"!list.no.add\"> \n	<md-button hide-gt-xs ui-sref=\"list.create\" class=\"md-fab md-accent md-fab-bottom-left\" aria-label=\"Create a new {{list.header}}\" ng-if=\"!list.no.add\">\n		<ng-md-icon icon=\"add\"></ng-md-icon>\n	</md-button>\n</a>\n	<md-card ng-if=\"list.data.length===0 && !list.loading\">\n	  <md-card-content>\n	    <h2>No {{list.header | labelCase}}s found</h2>\n	    <p class=\"mgl\" hide-xs>\n				There are no {{list.header | labelCase}}s!\n	      <a ng-click=\"main.create();\" href=\"\">Create one!</a>\n	    </p>\n	    <p hide-gt-xs>\n				There are no {{list.header | labelCase}}s!\n	      <a ng-click=\"main.create();\" href=\"\">Create one!</a>\n	    </p>\n	  </md-card-content>\n	</md-card>\n");
$templateCache.put("app/product/main.html","<navbar leftmenu=\"true\"></navbar>\n<left-menu></left-menu>\n<md-content flex layout=\"column\" class=\"content\">\n<section layout=\"row\">\n\n		<div ui-view=\"content\" layout=\"column\" flex></div>\n\n		<md-content\n			ui-view=\"detail\"\n			id=\"detail-content\"\n			toggle-component\n			md-component-id=\"products.detailView\"\n			layout=\"column\"\n			flex-xs=\"100\"\n			flex-sm = \"90\"\n			flex-md=\"90\"\n			flex-lg=\"66\"\n			flex-gt-lg=\"66\"\n			class=\"md-whiteframe-z1\">\n		</md-content>\n</section>\n</md-content>\n<footer></footer>\n\n");
$templateCache.put("app/product/media-library.html","<md-dialog aria-label=\"Media Library\" ng-cloak flex=\"95\">\n  <md-toolbar class=\"md-warn\">\n    <div class=\"md-toolbar-tools\">\n      <h2>Media Library</h2>\n      <span flex></span>\n      <md-button class=\"md-icon-button\" ng-click=\"cancel()\">\n        <ng-md-icon icon=\"close\" aria-label=\"Close dialog\"></ng-md-icon>\n      </md-button>\n    </div>\n  </md-toolbar>\n\n  <md-dialog-content>\n      <div class=\"md-dialog-content\"  class=\"md-whiteframe-z2\">\n          <md-grid-list class=\"media-list\" md-cols-xs =\"3\" md-cols-sm=\"4\" md-cols-md=\"5\" md-cols-lg=\"7\" md-cols-gt-lg=\"10\" md-row-height-gt-md=\"1:1\" md-row-height=\"4:3\" md-gutter=\"12px\" md-gutter-gt-sm=\"8px\" layout=\"row\" layout-align=\"center center\">\n            <md-grid-tile ng-repeat=\"i in media\" class=\"md-whiteframe-z2\" ng-click=\"ok(i.path)\">\n          		<div class=\"thumbnail\">\n          				<img ng-src=\"{{i.path}}\" draggable=\"false\" alt=\"{{i.name}}\">\n          		</div>\n              <md-grid-tile-footer><h3>{{i.name}}</h3></md-grid-tile-footer>\n            </md-grid-tile>\n          </md-grid-list>\n    </div>\n  </md-dialog-content>\n  <md-dialog-actions layout=\"row\">\n    <span flex></span>\n    <md-button ng-click=\"addNewImage()\" class=\"md-warn md-raised\">\n     Add new Image\n    </md-button>\n  </md-dialog-actions>\n</md-dialog>\n");
$templateCache.put("app/product/product.html","<products api=\'product\' options=\'summary\' details=\'details\'></products>\n");
$templateCache.put("app/review/review.html","<crud-table api=\'review\' options=\'review.options\' sort=\"created\" noAdd noEdit noCopy></crud-table>\n\n");
$templateCache.put("app/reviews/reviews.html","<crud-table api=\'review\' options=\'reviews.options\' sort=\"created\"></crud-table>\n\n");
$templateCache.put("app/shipping/shipping.html","<crud-table api=\'shipping\' options=\'options\'></crud-table>\n");
$templateCache.put("app/statistic/statistic.html","<crud-table api=\'statistic\' options=\'options\'></crud-table>\n");
$templateCache.put("app/wish/wish.html","<navbar></navbar>\n<div layout=\"column\" layout-align=\"center center\">\n<div layout=\"column\" layout-align=\"center stretch\" flex-xs=\"100\" flex-gt-xs=\"75\" flex-gt-md=\"50\">\n<md-card ng-repeat=\"w in wish.wishes\" class=\"wishlist\" layout=\"row\" layout-align=\"space-between top\">\n    \n    <md-card-title>\n        <md-card-title-media>\n            <div class=\"md-media-lg card-media\">\n                <img src=\"{{w.variant.image}}\" alt=\"{{w.product.name}}\">\n            </div>\n        </md-card-title-media>\n        <md-card-title-text>\n            <div class=\"product-description\">\n                <h2 class=\"name\" ng-click=\"wish.gotoDetail(w)\">{{w.product.name}}</a></h2>\n                <md-divider></md-divider><br/>\n            </div>\n            <div layout=\"row\" class=\"wish-content\">\n                <div class=\"price\" flex=50>\n                    <div class=\"price\">Price: <span class=\"text-muted\">{{w.variant.price | currency : vm.Settings.currency.symbol}}</span></div>\n                    <del ng-if=\"w.variant.price!=w.variant.mrp\">\n                        MRP: {{w.variant.mrp | currency : vm.Settings.currency.symbol}}\n                    </del>   (Size: {{w.variant.size}})\n                    <br/>\n                    <div layout=\"row\" layout-align=\"start center\">    \n                        <cart-buttons pid= \"w.product._id\" variant=\"w.variant\" product=\"w.product\"></cart-buttons>\n                    </div>\n                </div>\n                <div flex>\n                    <div ng-if=\"w.product.keyFeatures.length>0\">\n                        <b>Key Features:</b>\n                        <ul>\n                            <li ng-repeat=\"k in w.product.keyFeatures\"><b>{{k.key}}</b> : {{k.val}}</li>\n                        </ul>\n                    </div>\n                </div>\n            </div>\n        </md-card-title-text>\n    </md-card-title>\n    <a aria-label=\"Remove {{w.product.name}} from wishlist\" ng-click=\"wish.remove(w)\">\n        <ng-md-icon icon=\"close\"></ng-md-icon>\n    </a>\n</md-card>\n</div>\n</div>\n<footer></footer>");
$templateCache.put("app/account/cp/cp.html","<navbar leftmenu=\"true\"></navbar>\n<left-menu></left-menu>\n<md-content flex layout=\"column\" class=\"content\" layout-align=\"start center\">\n<section layout=\"column\" layout-align=\"start center\">\n	<h1>Change Password</h1>\n	<form name=\"form\" ng-submit=\"cp.changePassword(form)\" novalidate autocomplete=\"off\" autocomplete=\"off\">\n		<section class=\"section\" layout=\"column\">\n			<md-input-container md-is-error=\"form.password.$error.required && form.password.$dirty\">\n				<label>Current Password</label>\n				<input name=\"password\" type=\"password\" ng-model=\"cp.user.oldPassword\" required md-autofocus mongoose-error ng-minlength=\"3\"/>\n				<div ng-if=\"form.password.$error.mongoose\" class=\"err\">Password is incorrect</div>\n				<div ng-messages=\"form.password.$error\" ng-if=\"form.password.$dirty\">\n					<div ng-message=\"required\">Password is required</div>\n					<div ng-message=\"mongoose\">Password is incorrect</div>\n					<div ng-message=\"minlength\">Password must be at least 3 characters.</div>\n				</div>\n			</md-input-container>\n\n			<md-input-container flex class=\"last\">\n				<label>New Password</label>\n				<input name=\"newPassword\" type=\"password\"  ng-model=\"cp.user.newPassword\" required ng-minlength=\"3\">\n				<div ng-messages=\"form.newPassword.$error\" ng-if=\"form.newPassword.$dirty\">\n					<div ng-message=\"required\">Please repeat the new password</div>\n					<div ng-message=\"minlength\">Password must be at least 3 characters.</div>\n				</div>\n			</md-input-container>\n\n			<p class=\"help-block success\" ng-if=\"cp.submitted && cp.message\"> {{cp.message}} </p>\n		</section>\n		<submit-button loading=\"cp.loading\" form=\"form\" text=\"Change Password\"></submit-button>\n	</form>\n</section>\n</md-content>\n<footer></footer>");
$templateCache.put("app/account/login/login.html","<navbar></navbar>\n<md-content flex layout=\"column\" class=\"content\" layout-align=\"start center\">\n<section layout=\"column\" layout-align=\"start center\">\n\n	<h1>Login</h1>\n\n	<p ng-show=\"login.error\" class=\"md-warn\">{{login.error.message}}</p>\n\n	<form name=\"form\" ng-submit=\"login.login(form)\" novalidate>\n	<section class=\"section\" layout=\"column\">\n		<md-input-container md-is-error=\"(form.email.$error.required || form.email.$error.email) && form.email.$dirty\">\n			<label>Email</label>\n			<input name=\"email\" type=\"email\" ng-model=\"login.user.email\" required md-autofocus/>\n			<div ng-messages=\"form.email.$error\" ng-if=\"form.email.$dirty\">\n				<div ng-message=\"required\">Email ID is required</div>\n				<div ng-message=\"email\">Please enter valid email address.</div>\n			</div>\n		</md-input-container>\n\n		<md-input-container md-is-error=\"form.password.$error.required && form.password.$dirty\">\n			<label>Password</label>\n			<input name=\"password\" type=\"password\" ng-model=\"login.user.password\" required/>\n			<div ng-messages=\"form.password.$error\">\n				<div ng-message=\"required\">Password is required</div>\n				<div class=\"err\">{{ login.errors.other }}<br/>\n+					<a ui-sref=\"forgot({ email: login.user.email})\" href=\"#\">Forgot Password</a></div>\n			</div>\n		</md-input-container>\n\n    <div class=\"form-group has-error\">\n    <p class=\"help-block\" ng-show=\"form.email.$error.required && form.password.$error.required && login.submitted\">\n       Please enter your email and password.\n    </p>\n\n    </div>\n</section>\n		<div class=\"md-dialog-actions\" layout=\"row\">\n	    <md-button type=\"submit\" class=\"md-raised circular-progress-button md-primary\" ng-disabled=\"!form.$valid || login.loading\" aria-label=\"Login\">\n	      <span ng-show=\"!login.loading\"><ng-md-icon icon=\"perm_identity\"></ng-md-icon>Login</span>\n	      <md-progress-circular md-mode=\"indeterminate\" md-diameter=\"25\" ng-show=\"login.loading\" class=\"md-accent md-hue-1\"></md-progress-circular><span ng-show=\"login.loading\">Loading...</span>\n	    </md-button>\n			<md-button class=\"btn btn-default btn-lg btn-register\" ui-sref=\"signup\" aria-label=\"SignUp\"> Signup </md-button>\n	  </div>\n\n	</form>\n\n</section>\n</md-content>\n<footer></footer>");
$templateCache.put("app/account/password/forgot.html","<navbar></navbar>\n<md-content flex layout=\"column\">\n<section layout=\"column\" flex layout-align=\"center center\">\n	<h1>Forgot Password</h1>\n\n	<p class=\"md-warn message\" ng-show=\"forgot.errors.message\">{{forgot.errors.message}}</p>\n\n	<form name=\"form\" ng-submit=\"forgot.forgot(form)\" novalidate>\n		<section class=\"section\" layout=\"column\">\n			<md-input-container md-is-error=\"(form.email.$error.required || form.email.$error.email || forgot.errors.other) && form.email.$dirty\">\n				<label>Email</label>\n				<input name=\"email\" type=\"email\" ng-model=\"forgot.user.email\" required md-autofocus/>\n				<div ng-messages=\"form.email.$error\" ng-if=\"form.email.$dirty\">\n					<div ng-message=\"required\">Email ID is required</div>\n					<div ng-message=\"email\">Please enter valid email address.</div>\n					<div ng-if=\"forgot.errors.email\">{{forgot.errors.email}}</div>\n				</div>\n			</md-input-container>\n		</section>\n		<div layout=\"column\" layout-align=\"center center\">\n			<md-button type=\"submit\" class=\"md-raised circular-progress-button md-primary\" ng-disabled=\"forgot.loading\" aria-label=\"Forgot password\" layout=\"row\" layout-align=\"center center\">\n				<ng-md-icon icon=\"email\" ng-hide=\"forgot.loading\"></ng-md-icon> \n				<md-progress-circular md-mode=\"indeterminate\" md-diameter=\"25\" ng-show=\"forgot.loading\" class=\"md-accent md-hue-1\"></md-progress-circular>\n				<span>&nbsp;Reset Password</span>\n			</md-button>\n		</div>\n	</form>\n\n</section>\n</md-content>\n<footer></footer>\n");
$templateCache.put("app/account/password/reset.html","<navbar></navbar>\n<md-content flex layout=\"column\">\n<section layout=\"column\" flex layout-align=\"center center\">\n	<h1>Enter New Password</h1>\n\n	<p class=\"md-warn message\" ng-show=\"reset.errors.message\">{{reset.errors.message}}</p>\n\n	<form name=\"form\" ng-submit=\"reset.reset(form)\" novalidate flex>\n	<section class=\"section\" layout=\"column\">\n\n		<md-input-container md-is-error=\"(form.password.$error.required ||  form.password.$error.mongoose || form.password.$error.minlength) && form.password.$dirty\">\n			<label>Password</label>\n			<input name=\"password\" type=\"password\" ng-model=\"reset.user.password\" required mongoose-error ng-minlength=\"3\"/>\n			<div ng-messages=\"form.password.$error\" ng-if=\"form.password.$dirty\">\n				<div ng-message=\"required\">Password is required</div>\n				<div ng-message=\"mongoose\">{{ errors.password }}</div>\n				<div ng-message=\"minlength\">Password must be at least 3 characters.</div>\n			</div>\n		</md-input-container>\n\n		<md-input-container flex class=\"last\" md-is-error=\"(form.passwordRepeat.$error.required ||  form.passwordRepeat.$error.minlength || form.passwordRepeat.$error.repeat-input) && form.passwordRepeat.$dirty\">\n			<label>Repeat Password</label>\n			<input name=\"passwordRepeat\" type=\"password\"  ng-model=\"reset.user.passwordRepeat\" required repeat-input=\"reset.user.password\" ng-minlength=\"3\">\n			<div ng-messages=\"form.passwordRepeat.$error\" ng-if=\"form.passwordRepeat.$dirty\">\n				<div ng-message=\"required\">Please repeat the new password</div>\n				<div ng-message=\"minlength\">Password must be at least 3 characters.</div>\n				<div ng-message=\"repeat-input\">The passwords do not match</div>\n				<div ng-if=\"reset.errors.email\">{{reset.errors.email}}</div>\n			</div>\n		</md-input-container>\n\n    <div class=\"form-group has-error\">\n    <p class=\"help-block\" ng-show=\"form.password.$error.required && form.password.$error.required && reset.submitted\">\n       Please enter your password.\n    </p>\n\n    </div>\n</section>\n\n		<div layout=\"column\" layout-align=\"center center\">\n	    <md-button type=\"submit\" class=\"md-raised circular-progress-button md-primary\" ng-disabled=\"!form.$valid || reset.loading\" aria-label=\"Login\" layout=\"row\" layout-align=\"center center\">\n	      <ng-md-icon icon=\"lock\" ng-show=\"!reset.loading\"></ng-md-icon>\n	      <md-progress-circular md-mode=\"indeterminate\" md-diameter=\"25\" ng-show=\"reset.loading\" class=\"md-accent md-hue-1\"></md-progress-circular>\n		  &nbsp;Save New Password\n	    </md-button>\n	  </div>\n\n	</form>\n\n</section>\n</md-content>\n<footer></footer>\n");
$templateCache.put("app/account/signup/signup.html","<navbar></navbar>\n<md-content flex layout=\"column\" class=\"content\" layout-align=\"start center\">\n<section layout=\"column\" layout-align=\"start center\">\n<h1>Signup</h1>\n\n		<form name=\"form\" ng-submit=\"signup.register(form)\" novalidate>\n\n			<section class=\"section\" layout=\"column\">\n				<md-input-container md-is-error=\"form.name.$error.required && form.name.$dirty\">\n					<label>Name</label>\n					<input name=\"name\" ng-model=\"signup.user.name\" required md-autofocus/>\n					<div ng-messages=\"form.name.$error\" ng-if=\"form.name.$dirty\">\n						<div ng-message=\"required\">Name is required</div>\n					</div>\n				</md-input-container>\n\n				<md-input-container flex md-is-error=\"(form.email.$error.email || form.email.$error.required || form.email.$error.mongoose || form.email.$error.remote-unique) && form.email.$dirty\">\n					<label>Email ID</label>\n					<input type=\"email\" name=\"email\" ng-model=\"signup.user.email\"\n								 ng-model-options=\"{updateOn: \'default blur\', debounce: {\'default\': 500, \'blur\': 0}}\"\n								 required mongoose-error>\n					<div ng-messages=\"form.email.$error\" ng-if=\"form.email.$dirty\">\n						<div ng-message=\"email\">Please enter a valid email address.</div>\n						<div ng-message=\"required\">Email is required</div>\n						<div ng-message=\"mongoose\">Email already in use</div>\n					</div>\n				</md-input-container>\n\n\n				<md-input-container md-is-error=\"(form.password.$error.required ||  form.password.$error.mongoose || form.password.$error.minlength) && form.password.$dirty\">\n					<label>Password</label>\n					<input name=\"password\" type=\"password\" ng-model=\"signup.user.password\" required mongoose-error ng-minlength=\"3\"/>\n					<div ng-messages=\"form.password.$error\" ng-if=\"form.password.$dirty\">\n						<div ng-message=\"required\">Password is required</div>\n						<div ng-message=\"mongoose\">{{ errors.password }}</div>\n						<div ng-message=\"minlength\">Password must be at least 3 characters.</div>\n					</div>\n				</md-input-container>\n\n				<md-input-container flex class=\"last\" md-is-error=\"(form.passwordRepeat.$error.required ||  form.passwordRepeat.$error.minlength || form.passwordRepeat.$error.repeat-input) && form.passwordRepeat.$dirty\">\n					<label>Repeat Password</label>\n					<input name=\"passwordRepeat\" type=\"password\"  ng-model=\"signup.user.passwordRepeat\" required repeat-input=\"signup.user.password\" ng-minlength=\"3\">\n					<div ng-messages=\"form.passwordRepeat.$error\" ng-if=\"form.passwordRepeat.$dirty\">\n						<div ng-message=\"required\">Please repeat the new password</div>\n						<div ng-message=\"minlength\">Password must be at least 3 characters.</div>\n						<div ng-message=\"repeat-input\">The passwords do not match</div>\n					</div>\n				</md-input-container>\n\n			</section>\n\n\n			<div class=\"md-dialog-actions\" layout=\"row\">\n				<span flex></span>\n				<md-button ng-disabled=\"form.$invalid || signup.loading\" class=\"md-primary md-raised circular-progress-button\" type=\"submit\" aria-label=\"SignUp\">\n					<span ng-show=\"!signup.loading\"><ng-md-icon icon=\"input\"></ng-md-icon> Signup</span>\n					<md-progress-circular md-mode=\"indeterminate\" md-diameter=\"25\" ng-show=\"signup.loading\" class=\"md-accent md-hue-1\"></md-progress-circular><span ng-show=\"signup.loading\">Loading...</span>\n				</md-button>\n				<md-button ng-click=\"signup.cancel();\" aria-label=\"Cancel SignUp\">Cancel</md-button>\n			</div>\n</form>\n</section>\n<oauth-buttons></oauth-buttons>\n</md-content>\n<footer></footer>");}]);