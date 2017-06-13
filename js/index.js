/**
 * Created by Administrator on 2017/3/9.
 * 这是首页的js
 */

$(function () {
	
    var page= 1;
    var i = 6;//每版四个图片
//向右滚动
    $(".rightI").click(function(){ //点击事件
        var v_wrap = $(this).parents(".foot-one"); // 根据当前点击的元素获取到父元素
        var v_show = v_wrap.find(".UlImg"); //找到视频展示的区域
        var v_cont = v_wrap.find(".center-p"); //找到视频展示区域的外围区域
        var v_width = v_cont.width();
        var len = v_show.find("li").length; //我的视频图片个数
        var page_count = Math.ceil(len/i); //只要不是整数，就往大的方向取最小的整数
        if(!v_show.is(":animated")){
            if(page == page_count){
                v_show.animate({left:'0px'},"slow");
                page =1;
            }else{
                v_show.animate({left:'-='+v_width},"slow");
                page++;
            }
        }
    });
//向左滚动
    $(".leftI").click(function(){ //点击事件
        var v_wrap = $(this).parents(".foot-one"); // 根据当前点击的元素获取到父元素
        var v_show = v_wrap.find(".UlImg"); //找到视频展示的区域
        var v_cont = v_wrap.find(".center-p"); //找到视频展示区域的外围区域
        var v_width = v_cont.width();
        var len = v_show.find("li").length; //我的视频图片个数
        var page_count = Math.ceil(len/i); //只要不是整数，就往大的方向取最小的整数
        if(!v_show.is(":animated")){
            if(page == 1){
                v_show.animate({left:'-='+ v_width*(page_count-1)},"slow");
                page =page_count;
            }else{
                v_show.animate({left:'+='+ v_width},"slow");
                page--;
            }
        }
    });

    //关键字绑定
    $(".keyword>span").on("click",function () {
        var html = $(this).html();
        $(".sousuoIn>input").val(html);
    });
    
    
});

//angular代码
angular.module("app",['ng'])
	.controller("indexCtr",['$scope','indexMakeService',function ($scope,indexMakeService) {
		//注册登录页面跳转
		$scope.register = function () {
			window.location.href="register.html";
		};
		$scope.login=function () {
			window.location.href="login.html";
		};
		//导航栏动态展示
		indexMakeService.getAllType(function(data){
			$scope.types = data;
			//具体内容页跳转
			
		});
		$scope.action = function(id){
			console.log($(this));
			//跳转在相应的新闻类型页面
			window.location.href="list.html?id="+id;
		};
		indexMakeService.getKindNews(function(data){
			var kind1 = "要点";
			var kind2 = "热点";
			$scope.kindyaos = [];
			$scope.kindres = [];
			for(var key in data){
				if(data[key].newsHot==kind1){
					$scope.kindyaos.push(data[key]);
				}else if(data[key].newsHot==kind2){
					$scope.kindres.push(data[key]);
				}
			}
		});
		function showTime(){
 		   var mydate = new Date();
 		   var str = "" + mydate.getFullYear() + "年";
 		   str += (mydate.getMonth()+1) + "月";
 		   str += mydate.getDate() + "日";
 		  return str;
		}
		//更改页面信息，展示欢迎谁登录以及现在的日期
		if(sessionStorage.getItem("username")){
			$(".caozuo").css("display","none");
			$(".loginIndex").css("display","block");
			$(".welcomeName").find("span").html(sessionStorage.getItem("username"));
			//获取当前日期
			var date = showTime();
			$(".welcomeDate").find("span").html(date);
		}
		
		
	}])
	.factory("indexMakeService",['$http','$httpParamSerializer',function($http,$httpParamSerializer){
		return {
			//获取所有栏目信息
            getAllType:function (handler) {
                $http.get("json/types.json")
                    .success(
                        function (data) {
                            handler(data);
                        }
                    );
            },
            //获取所有新闻热度
            getAllKinds:function (handler) {
                $http.get("json/kinds.json")
                    .success(
                        function (data) {
                            handler(data);
                        }
                    );
            },
            //获取要点新闻，获取热点新闻
            getKindNews:function(handler){
            	var obj = {
                        "status":"审核通过"
                    };
                    obj = $httpParamSerializer(obj);
                    $http.post("GetStatus.do",obj,{
                        headers:{
                            "Content-Type":"application/x-www-form-urlencoded"
                        }
                    }).success(function (data) {
                        handler(data);
                    });
            }
            
		}
	}]);