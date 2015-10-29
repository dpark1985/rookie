angular.module('starter.controllers', [])

.controller('MenuCtrl', function ($state, $scope) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //    console.log(e);
    //});

    

    $scope.login = function() {
        $state.go('app.login');
    };

    $scope.noti = function() {
        $state.go('app.noti');
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

    $scope.company = function() {
        $state.go('app.company');
    };



})
.controller('settingCtrl', function(
    $state, 
    $scope, 
    $http, 
    $state,
    $rootScope, 
    $ionicModal,
    $ionicPopup, 
    $ionicPlatform, 
    $cordovaImagePicker, 
    $cordovaFileTransfer
    ) 
{

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
        $scope.userSince = $rootScope.userInfo.since.split(' ')[0] + 
        ' ' + $rootScope.userInfo.since.split(' ')[1] + 
        ' ' + $rootScope.userInfo.since.split(' ')[2] + 
        ' ' + $rootScope.userInfo.since.split(' ')[3] + ' ';
    };
    $scope.closeUserInfoModal = function() {
        $scope.userInfoModal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.userInfoModal.remove();
    });

    $ionicModal.fromTemplateUrl('templates/userSetting/pwChange.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.pwChangeModal = modal;
    });
    $scope.openPwChangeModal = function() {
        $scope.pwChangeModal.show();
    };
    $scope.closePwChangeModal = function() {
        $scope.pwChangeModal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.pwChangeModal.remove();
    });


    $scope.imgSetting = function(){
        $ionicPlatform.ready(function() {

            var ipOptions = {
                maximumImagesCount: 1
            };

            $cordovaImagePicker.getPictures(ipOptions)
            .then(function (results) {
                console.log(results[0]);
                if(results){

                    for (var i = 0; i < results.length; i++) {
                        //console.log('Image URI: ' + results[i]);
                        $scope.filePath = results[i];                    
                    }

                    var server = "http://52.69.2.200/happ/testingUserSetting/"+$rootScope.userInfo.login+"/img";
                    var filePath = $scope.filePath;
                    var ftOptions = {};

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
                            $scope.imageURL =  "http://52.69.2.200/"+data.img;
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



                } else {

                }


            }, function(error) {
                // error getting photos
            });
        });
    };

    $scope.showWithdrawConfirm = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: '회원탈퇴',
            template: '회원탈퇴를 하시면 모든 기록이 삭제됩니다.<br /> 진행할까요?',
            cancelText: '취소', // String (default: 'Cancel'). The text of the Cancel button.
            okText: '탈퇴', // String (default: 'OK'). The text of the OK button.
            okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
        });
        confirmPopup.then(function(res) {
            if(res) {
                $http.post('http://52.69.2.200/happ/testing', {
                    status: 'withdraw',
                    login: $rootScope.userInfo.login
                })
                .success(function(data, status, headers, config) {
                    //console.log(data);
                    $rootScope.isLogin = false;
                    $scope.userInfoModal.hide();
                    $state.go('app.main');
                })
                .error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                }); 
            } else {
                //console.log('You are not sure');
            }
        });
    };

    $scope.pwData = {};
    $scope.pwConfirm = "";
    $scope.curPW = "";
    $scope.changePW = function(){
        if($scope.pwData.newPW != $scope.pwData.newPWC){
            $scope.pwConfirm = "assertive";
        } else {
            $scope.pwConfirm = "";
            $http.post("http://52.69.2.200/happ/testingUserSetting/"+$rootScope.userInfo.login+"/pwchange", {
                login: $rootScope.userInfo.login,
                curPW: $scope.pwData.curPW,
                newPW: $scope.pwData.newPW
            })
            .success(function(data, status, headers, config) {
                if(data.n == '0'){
                    $scope.curPW = "assertive";
                } else {
                    $scope.closePwChangeModal();
                    $scope.curPW = "";
                }
            })
            .error(function(data, status, headers, config) {
                
            }); 
        }
    };








})


.controller('loginCtrl', function ($scope, $rootScope, $state, $ionicModal, $timeout, $http) {
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
                    $rootScope.userID = $rootScope.userInfo.login;
                    $rootScope.userName = $rootScope.userInfo.name;
                    if($rootScope.userInfo.img == '' || $rootScope.userInfo.img == null){
                        $rootScope.imgExist = false;
                    } else {
                        $rootScope.imgExist = true;
                        $rootScope.userInfo.img = $rootScope.userInfo.img.replace("public/", "");
                    }
                    $scope.validCheck = 'calm';

                    //console.log($rootScope.userInfo);

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
        $http.post('http://52.69.2.200/happ/testing', {
            status: 'pwreset',
            login: $scope.reRegisterData.userID
        })
        .success(function(data, status, headers, config) {
            $scope.closeReRegister();
        })
        .error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

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
             

                            $http.post('http://52.69.2.200/happ/testing', {
                                status: 'login',
                                login: $scope.registerData.userID,
                                password: $scope.registerData.userPW
                            })
                            .success(function(data, status, headers, config) {
                  
                                
                                $rootScope.isLogin = true;
                                $rootScope.userInfo = data;
                                $rootScope.userID = $rootScope.userInfo.login;
                                $rootScope.userName = $rootScope.userInfo.name;
                                if($rootScope.userInfo.img == '' || $rootScope.userInfo.img == null){
                                    $rootScope.imgExist = false;
                                } else {
                                    $rootScope.imgExist = true;
                                }
                            })
                            .error(function(data, status, headers, config) {
                                // called asynchronously if an error occurs
                                // or server returns response with an error status.
                            });

                            $state.go('app.main');
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

.controller('adsQueryCtrl', function ($scope, $http, $timeout) {
    $scope.adsQueryData = {};
    $scope.doAdsQuery = function() {
        //console.log('Doing adsQuery', $scope.adsQueryData);

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

.controller('notiCtrl', function ($scope, $http, $timeout, $ionicModal) {
    $http.get('http://52.69.2.200/noti/all')
    .success(function(data, status, headers, config) {
        $scope.items = data;
    })
    .error(function(data, status, headers, config) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    });

    $ionicModal.fromTemplateUrl('templates/menu/notiDetail.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function(id) {
        $scope.modal.show();
        console.log(id);

        $http.get('http://52.69.2.200/noti/'+id)
        .success(function(data, status, headers, config) {
            $scope.data = data;
        })
        .error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        });


    };

    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

    // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
        // Execute action
    });

    // Execute action on remove modal
        $scope.$on('modal.removed', function() {
        // Execute action
    });


})

.controller('companyCtrl', function ($scope) {

})

.controller('MainCtrl', function ($scope, $state, $http, $ionicLoading, $ionicSlideBoxDelegate, $timeout) {

/*
    $scope.showLoading = function() {
        $ionicLoading.show({
            template: '로딩...'
        });
    };
*/

    $scope.hideLoading = function(){
        $ionicLoading.hide();
    };

    $scope.goToNoti = function() {
        $state.go('app.noti');
    }

/*
    $scope.showLoading();

    $scope.items = null;
    $http.get('http://52.69.2.200/noti/active')
    .success(function(data, status, headers, config) {
        $timeout(function(){
            $scope.items = data;
            $ionicSlideBoxDelegate.update();
            $scope.hideLoading();
        }, 1000);
    })
    .error(function(data, status, headers, config) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    });
*/

})

.controller('SportsCtrl', function ($scope, $rootScope, $location, $http, $ionicTabsDelegate, $ionicLoading) {
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
    $rootScope.curSports = locationArr[3];


    $scope.showLoading();

    //$scope.platform = ionic.Platform;
    //console.log($scope.platform);
    //onsole.log($scope.platform.isAndroid());


    $http.get('http://52.69.2.200/happ/model/'+ $rootScope.curSports +'/competitions')
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

        $http.get('http://52.69.2.200/happ/model/'+ $rootScope.curSports +'/competitions')
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
        $http.get('http://52.69.2.200/happ/model/'+ $rootScope.curSports +'/courts')
        .success(function(data, status, headers, config) {
            $scope.courtItems = data;
            for (x in $scope.courtItems){
                $scope.courtItems[x].courtImg = $scope.courtItems[x].courtImg.replace('public/uploads', '');
            }


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


        $http.get('http://52.69.2.200/happ/model/'+ $rootScope.curSports +'/clubs')
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
.controller('DetailCtrl', function ($scope, $rootScope, $location, $http, $sce, $ionicLoading, $ionicPopup) {
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

    //console.log($rootScope.curCategory);


    $scope.contentActive = '';
    $scope.basicInfoActive = 'active';
    $scope.imageActive = '';

    $scope.templates = {
        "content" : "templates/sports/sportsTemplates/"+$rootScope.curCategory+"/content.html",
        "basicInfo" : "templates/sports/sportsTemplates/"+$rootScope.curCategory+"/basicInfo.html",
        "images" : "templates/sports/sportsTemplates/"+$rootScope.curCategory+"/images.html" 
    };

    $scope.activeInclude = $scope.templates.basicInfo;


    $http.get('http://52.69.2.200/happ/model/'+$rootScope.curSports+'/'+$rootScope.curCategory+'/'+$rootScope.curId)
    .success(function(data, status, headers, config) {
        $scope.item = data;
        console.log($scope.item);

        if($rootScope.curCategory == 'competitions'){
            $scope.item[0].eventInfo = $sce.trustAsHtml($scope.item[0].eventInfo);
            $scope.imageURL =  $scope.item[0].eventImg.replace('public/', '');
            $scope.mainTitle = $scope.item[0].eventTitle;
        } else if ($rootScope.curCategory == 'clubs'){
            $scope.item[0].clubInfo = $sce.trustAsHtml($scope.item[0].clubInfo);
            $scope.imageURL =  $scope.item[0].clubImg.replace('public/uploads', ''); 
            $scope.mainTitle = $scope.item[0].clubTitle;
        } else {
            $scope.item[0].courtInfo = $sce.trustAsHtml($scope.item[0].courtInfo);
            $scope.imageURL =  'http://52.69.2.200/uploads/'+$scope.item[0].courtImg.replace('public/uploads', '');;
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
    };

    $scope.report = function() {
        $scope.data = {}

        $scope.reportList = [
            {text: "부적절한 이미지 사용", checked: false},
            {text: "내용 불충분", checked: false},
            {text: "정보 불량", checked: false}
        ];

        // An elaborate, custom popup
        var reportPopup = $ionicPopup.show({
            template: '<ion-checkbox ng-repeat="item in reportList" ng-model="item.checked" ng-checked="item.checked">{{ item.text }}</ion-checkbox>',
            title: '수정 요청',
            subTitle: '해당 데이터의 수정을 요청할 수 있습니다.',
            scope: $scope,
            buttons: [
                {   text: '취소',
                    onTap: function(e){
                        reportPopup.close();
                    }
                },
                {
                    text: '<b>리포트</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        console.log($scope.reportList);

                        $http.post('http://52.69.2.200/happ/testingDetails/'+$rootScope.curCategory+'/'+$rootScope.curId, {
                            reports: $scope.reportList
                        })
                        .success(function(data, status, headers, config) {

                        })
                        .error(function(data, status, headers, config) {
                            
                        }); 

                        reportPopup.close();
                    }
                }
            ]   
        });

    };


});
