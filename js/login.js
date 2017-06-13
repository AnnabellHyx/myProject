angular.module("app.login",['ng'])
	.controller("loginCtr",['$scope','loginService',function($scope,loginService){
		$scope.user = {
			username:"",
			password:""
		};
		$.idcode.setCode();   //加载生成验证码方法
		$scope.loginAction = function(){
			//先判断验证码是否正确
	        var IsBy = $.idcode.validateCode();  //调用返回值，返回值结果为true或者false
	        if(IsBy){
	        	loginService.getAllMassage(function(data){
					var user = $scope.user;	
					var userRoot = data.filter(function(item,index){
						return item.username==user.username;
					});	
					if(userRoot!=""){
						if(userRoot[0].password==user.password){
							
							if(userRoot[0].identify=="用户"){
								window.location="index.html";
								//将用户信息保存在session中
					    		sessionStorage.setItem("username",user.username);
					    		sessionStorage.setItem("userId",userRoot[0].id);
							}else if(userRoot[0].identify=="发布者"){
								window.location="publish.html?id="+userRoot[0].id;
							}else if(userRoot[0].identify=="管理员"){
								window.location="manage.html";
							}
						}else{
							alert("密码不匹配，请重新填写！");
							$scope.user = {
									username:"",
									password:""
							};
						}
					}else{
						alert("此用户不存在，请点击注册！");
						$scope.user = {
								username:"",
								password:""
						};
					}				
				});
	        }else {
	            alert("验证码不正确，请刷新重试");
	        }
		  
		};
	}])
	.factory("loginService",['$http',function($http){
		return {
			getAllMassage:function(handler){
				$http.get("GetMassages.do").success(function(data){
					handler(data);
				});
			}
		};
	}]);