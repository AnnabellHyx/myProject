/**
 * Created by Administrator on 2017/3/8.
 * 这是发布页的JS
 */
/**
 * 左侧导航动画*/

$(function () {
    /*背景色改变*/
    $(".pub_ul>li>a").on("click",function () {
        $(".pub_ul>li>a").removeClass("active");
        $(this).addClass("active");
    });
    $(".pub_ul>li>a").eq(0).trigger("click");
    
    
});

/*路由配置*/
angular.module("app",['ng','ngRoute','app.publishModule'])
    .controller("pubCtr",["$scope","makeService",function ($scope,makeService) {
    	//获取到登陆时地址栏的用户id号码
    	var idArr = window.location.search.split("?id=");
    	var id = idArr[1];
    	console.log(id);
    	//获取到当前用户的详细信息
    	makeService.getMassage(function(data){
    		$scope.massage = data[id-1];
    		//将用户信息保存在session中
    		sessionStorage.setItem("username",$scope.massage.username);
    		sessionStorage.setItem("userId",$scope.massage.id);
    	});
    	
    }])
    .config(["$routeProvider",function ($routeProvider) {
        $routeProvider.when("/publishMassage",{
            templateUrl:"tpl/pub/publishMassage.html",
            controller:"pubMassCtr"
        }).when("/publishPub/ctId/:ct/ntId/:nt",{
            templateUrl:"tpl/pub/publishPub.html",
            controller:"pubPubCtr"
        }).when("/addNews",{
            templateUrl:"tpl/pub/addNews.html",
            controller:"addNewCtr"
        }).when("/publishPub/id/:id",{
            templateUrl:"tpl/pub/publishPub.html",
            controller:"delPubCtr"
        });
    }]);