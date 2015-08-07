angular.module('starter.controllers', [])

.controller('MenuCtrl', function($state, $scope, $rootScope, $location) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    console.log($location.url());

    

    $scope.login = function() {
        $state.go('app.login');
    };

    $scope.adsQuery = function() {
        $state.go('app.adsQuery');
    };

    $scope.terms = function() {
        $state.go('app.terms');
    };

    $scope.setting = function() {
        $state.go('app.setting');
    };






})
.controller('settingCtrl', function($state, $scope, $rootScope, $ionicModal, $ionicPlatform, $cordovaImagePicker, $cordovaFileTransfer, $http) {

    $scope.gotoMain = function() {
        $state.go('app.main');
    };

    $scope.logout = function(){
        $rootScope.isLogin = false;
        $rootScope.userInfo = '';
        $scope.gotoMain();
    };

    $ionicModal.fromTemplateUrl('templates/userSetting/userInfo.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.userInfoModal = modal;
    });
    $scope.openUserInfoModal = function() {
        $scope.userInfoModal.show();
    };
    $scope.closeUserInfoModal = function() {
        $scope.userInfoModal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.userInfoModal.remove();
    });
    // Execute action on hide modal
    $scope.$on('userInfoModal.hidden', function() {
        // Execute action
    });
    
    // Execute action on remove modal
    $scope.$on('userInfoModal.removed', function() {
        // Execute action
    });

    $scope.imgSetting = function(){



        

        $ionicPlatform.ready(function() {

            var ipOptions = {
                maximumImagesCount: 1
            };

            

            //console.log('testing');

            $cordovaImagePicker.getPictures(ipOptions)
            .then(function (results) {
                for (var i = 0; i < results.length; i++) {
                    console.log('Image URI: ' + results[i]);
                    $scope.filePath = results[i];

                    
                }

                
                var server = "http://52.69.2.200/happ/testingUserSetting/"+$rootScope.userInfo.login+"/img";
                var filePath = $scope.filePath;
                var ftOptions = {};
                //console.log($rootScope.userInfo.login);

                $cordovaFileTransfer.upload(server, filePath, ftOptions)
                .then(function(result) {
                    // Success!
                    $http.post('http://52.69.2.200/happ/testing', {
                        status: 'login',
                        login: $rootScope.loginData.userID,
                        password: $rootScope.loginData.userPW
                    })
                    .success(function(data, status, headers, config) {
                        $rootScope.userInfo = data;
                        $rootScope.imgExist = true;
                        $scope.imageURL =  "http://52.69.2.200/uploads/"+data.img;
                    })
                    .error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
                }, function(err) {
                    // Error
                }, function (progress) {
                    // constant progress updates
                });


            }, function(error) {
                // error getting photos
            });









        });
    }    




})
.controller('loginCtrl', function($scope, $rootScope, $state, $ionicModal, $timeout, $http) {
    $rootScope.loginData = {};
    $scope.validCheck = 'calm';
    


    $scope.doLogin = function() {
        var emailV = $rootScope.loginData.userID.split('@');
        //console.log('Doing login', $rootScope.loginData);
        if(emailV.length == 1 || $rootScope.loginData.userPW == ''){
            $scope.validCheck = 'assertive';
        } else {
            $http.post('http://52.69.2.200/happ/testing', {
                status: 'login',
                login: $rootScope.loginData.userID,
                password: $rootScope.loginData.userPW
            })
            .success(function(data, status, headers, config) {
                if(data){
                    $state.go('app.main');
                    $rootScope.isLogin = true;
                    $rootScope.userInfo = data;
                    $rootScope.userID = $rootScope.loginData.userID;
                    $rootScope.userName = $rootScope.userInfo.name;
                    if($rootScope.userInfo.img == '' || $rootScope.userInfo.img == null){
                        $rootScope.imgExist = false;
                    } else {
                        $rootScope.imgExist = true;
                    }
                    $scope.validCheck = 'calm';
                } else {
                    $scope.validCheck = 'assertive';
                }
            })
            .error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        }
    };




    

    $ionicModal.fromTemplateUrl('templates/menu/reRegister.html', {
        scope: $scope,
        animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modalReRegister = modal;
    });

    $scope.reRegister = function() {
        $scope.modalReRegister.show();
    }

    $scope.closeReRegister = function() {
        $scope.modalReRegister.hide();
    };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modalReRegister.remove();
    });

    $scope.reRegisterData = {};
    $scope.doReRegister = function() {
        console.log('Doing reRegister', $scope.reRegisterData);

    };






    $ionicModal.fromTemplateUrl('templates/menu/register.html', {
        scope: $scope,
        animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modalRegister = modal;
    });

    $scope.register = function() {
        $scope.modalRegister.show();
    };

    $scope.closeRegister = function() {
        $scope.modalRegister.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modalRegister.remove();
    });        

    $scope.registerData = {};
    $scope.regiValidCheck = 'calm';
    $scope.doRegister = function() {
        //console.log('Doing register', $scope.registerData);
        var regiEmailV = $scope.registerData.userID.split('@');
        if(regiEmailV.length == 2 && $scope.registerData.userPW == $scope.registerData.userPWC){
            $scope.regiValidCheck = 'calm';


            $http.post('http://52.69.2.200/happ/testingUserID', {
                login: $scope.registerData.userID
            })
            .success(function(data, status, headers, config) {
                if(data){
                    $scope.regiValidCheck = 'assertive';
                } else {
                    $scope.regiValidCheck = 'calm';

                    $http.post('http://52.69.2.200/happ/testing', {
                        status: 'register',
                        name: $scope.registerData.userName,
                        login: $scope.registerData.userID,
                        password: $scope.registerData.userPW
                    })
                    .success(function(data, status, headers, config) {
                        if(data){
                            $state.go('app.main');
                            $rootScope.isLogin = true;
                            $timeout(function() {
                                $scope.closeRegister();
                            }, 1000);

                        } else {
                            $scope.regiValidCheck = 'assertive';
                        }
                    })
                    .error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
                }
            })
            .error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });






        } else {
            $scope.regiValidCheck = 'assertive';
        }
    };











})

.controller('adsQueryCtrl', function($scope, $http, $timeout) {
    $scope.adsQueryData = {};
    $scope.doAdsQuery = function() {
        console.log('Doing adsQuery', $scope.adsQueryData);

        $http.post('http://52.69.2.200/query', {
            login: $scope.adsQueryData.userEmail,
            subject: $scope.adsQueryData.title,
            context: $scope.adsQueryData.content
        })
        .success(function(data, status, headers, config) {
            
            $timeout(function() {
                $state.go('app.login');
            }, 1000);
        })
        .error(function(data, status, headers, config) {

        });        
    };




})
.controller('MainCtrl', function ($scope) {



    var widthSize = $(window).width();
    var heightSize = $(window).height();
    //console.log(heightSize);
    var vHight = widthSize * 375 / 1000;

    $scope.sStyle = "width:"+widthSize+"px; height:"+heightSize+"px;";

    $scope.vStyle = "height:"+vHight+"px;"

})
.controller('SportsCtrl', function ($scope, $location, $http, $ionicTabsDelegate, $ionicLoading) {
    $scope.showLoading = function() {
        $ionicLoading.show({
            template: '로딩...'
        });
    };
    $scope.hideLoading = function(){
        $ionicLoading.hide();
    };

    var locationArr = $location.url().split('/');

    //Selected Sports
    $scope.curSports = locationArr[3];


    $scope.showLoading();

    $http.get('http://52.69.2.200/'+ $scope.curSports +'/competitions')
    .success(function(data, status, headers, config) {
        $scope.competitionItems = data;
        $scope.hideLoading();
    })
    .error(function(data, status, headers, config) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    });

    $scope.competitions = function() {
        $ionicTabsDelegate.select(0);

        $scope.showLoading();

        $http.get('http://52.69.2.200/'+ $scope.curSports +'/competitions')
        .success(function(data, status, headers, config) {
            $scope.competitionItems = data;
            $scope.hideLoading();
        })
        .error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        });
    };

    $scope.courts = function() {
        $ionicTabsDelegate.select(1);

        $scope.showLoading();


        $scope.items = null;
        $http.get('http://52.69.2.200/'+ $scope.curSports +'/courts')
        .success(function(data, status, headers, config) {
            $scope.courtItems = data;
            $scope.hideLoading();
        })
        .error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        });
    }

    $scope.clubs = function() {
        $ionicTabsDelegate.select(2);

        $scope.showLoading();


        $http.get('http://52.69.2.200/'+ $scope.curSports +'/clubs')
        .success(function(data, status, headers, config) {
            $scope.clubItems = data;
            $scope.hideLoading();
        })
        .error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        });
    }
})
.controller('DetailCtrl', function ($scope, $rootScope, $location, $http, $sce, $ionicLoading) {
    $scope.showLoading = function() {
        $ionicLoading.show({
            template: '로딩...'
        });
    };
    $scope.hideLoading = function(){
        $ionicLoading.hide();
    };

    $scope.showLoading();


    var locationArr = $location.url().split('/');
    $rootScope.curSport = locationArr[3]; //name of the sports
    $rootScope.curCategory = locationArr[4]; //competitions | courts | clubs
    $rootScope.curId = locationArr[5]; //ID of the item

    console.log($rootScope.curCategory);


    $scope.contentActive = '';
    $scope.basicInfoActive = 'active';
    $scope.imageActive = '';

    $scope.templates = {
        "content" : "templates/sports/sportsTemplates/"+$rootScope.curCategory+"/content.html",
        "basicInfo" : "templates/sports/sportsTemplates/"+$rootScope.curCategory+"/basicInfo.html",
        "images" : "templates/sports/sportsTemplates/"+$rootScope.curCategory+"/images.html" 
    };

    $scope.activeInclude = $scope.templates.basicInfo;


    $http.get('http://52.69.2.200/happ/testingDetails/'+$rootScope.curCategory+'/'+$rootScope.curId)
    .success(function(data, status, headers, config) {
        $scope.item = data;

        if($rootScope.curCategory == 'competitions'){
            $scope.item[0].eventInfo = $sce.trustAsHtml($scope.item[0].eventInfo);
            $scope.imageURL =  "http://52.69.2.200/uploads/"+$scope.item[0].eventImg;
            $scope.mainTitle = $scope.item[0].eventTitle;
        } else if ($rootScope.curCategory == 'clubs'){
            $scope.item[0].clubInfo = $sce.trustAsHtml($scope.item[0].clubInfo);
            $scope.imageURL =  "http://52.69.2.200/uploads/"+$scope.item[0].clubImg; 
            $scope.mainTitle = $scope.item[0].clubTitle;
        } else {
            $scope.item[0].courtInfo = $sce.trustAsHtml($scope.item[0].courtInfo);
            $scope.imageURL =  "http://52.69.2.200/uploads/"+$scope.item[0].courtImg;
            $scope.mainTitle = $scope.item[0].courtTitle; 
        }   
        //console.log(data);        
        $scope.hideLoading();
    })
    .error(function(data, status, headers, config) {

    }); 



    $scope.contentClick = function() {
        $scope.contentActive = 'active';
        $scope.basicInfoActive = '';
        $scope.imageActive = '';
        $scope.activeInclude = $scope.templates.content;
    };
    $scope.infoClick = function() {
        $scope.contentActive = '';
        $scope.basicInfoActive = 'active';
        $scope.imageActive = '';
        $scope.activeInclude = $scope.templates.basicInfo;

    };
    $scope.imgClick = function() {
        $scope.contentActive = '';
        $scope.basicInfoActive = '';
        $scope.imageActive = 'active';
        $scope.activeInclude = $scope.templates.images;
    }


});
