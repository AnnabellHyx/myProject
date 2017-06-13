/**
 * Created by Administrator on 2017/3/13.
 */
angular.module("app.register",['ng'])
    .controller("registerCtr",['$scope','registerService',function ($scope,registerService) {
        $scope.massages = {
            username:"",
            password:"",
            age:"",
            identify:"",
            address:"",
            word:"",
            explain:"",
            email:"",
            imageId:"images/im/1.jpg"
        };
        
        $scope.registerAction=function(url){
        	var mass = $scope.massages;
        	var type = mass.password.toString();
        	console.log(type);
        	console.log(typeof(type));
        	if(mass.username==""){
        		alert("请输入用户名");
        	}else if(mass.password.length<8){
        		alert(mass.password.length);
        		alert("请输入至少八位密码");
        	}else{
        		registerService.saveMassages(mass,function (data) {
                	alert(data);
                	window.location=url;
                });
        	}  
        };
    }])
    .factory("registerService",['$http','$httpParamSerializer',function ($http,$httpParamSerializer) {
    	return {
        	saveMassages: function(massages,handler){
        		var mass = massages;
            	var obj = {
            			'username':mass.username,
            			'password':mass.password,
            			'age':mass.age,
            			'identify':mass.identify,
            			'address':mass.address,
            			'word':mass.word,
            			'explain':mass.explain,
            			'email':mass.email,
            			'imageId':mass.imageId
            	};
            	obj = $httpParamSerializer(obj);
                $http.post("register.do",obj,{
                    headers:{
                        "Content-Type":"application/x-www-form-urlencoded"
                    }
                }).success(function(data){
                	handler(data);
                });
            }
        };
    }]);