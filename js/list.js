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

});



angular.module("app",['ng'])
	.controller("listCtr",['$scope','listService',function($scope,listService){
		//当用户没有登录的时候，登录和注册按钮必须可以操作和新闻首页一样
		//注册登录页面跳转
		$scope.register = function () {
			window.location.href="register.html";
		};
		$scope.login=function () {
			window.location.href="login.html";
		};
		
		//查看是否是登录状态
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
		
		//获取地址栏里面的参数
		var idArr = window.location.search.split("?id=");
    	var id = idArr[1];
    	$scope.params = id;
    	//展示详细的内容
    	listService.getAllType(function(data){
    		$scope.types = data;
    		$scope.typeName = data[id-1].realName;
    	});
    	//获取当前类型的新闻
    	listService.getStatusNews(function(data){
    		$scope.newss=[];
    		for(var key in data){
    			if(data[key].newsType==$scope.typeName){
    				$scope.newss.push(data[key]);
    			}
    		}
    	});
    	
		//再判断页面是否能进行评论
    	
		$scope.speak = function(id){
			
			if(sessionStorage.getItem("username")){
				//查找到当前新闻的id,跳转再具体的页面上
				window.location.href="news.html?id="+id;
			}else{
				alert("您还没有登录，请登录！");
			}
		};
		//点赞操作
		$scope.toggle = {
				now:false
		};
		$scope.$watch('toggle.now',function(){
			//			数据渲染成功后
			if($scope.toggle.now){
				//显示新闻并且分页
				$(".news").css("display","none");
				page($scope.newss,$scope.params);
				
				
				//点赞功能
				var flag = true;
				$(".praise").on("click",function(){
					console.log(flag);
					if(flag){
						if(sessionStorage.getItem("username")){
							var num = +$(this).children(".number").text(); 
							num +=1;
							var data = {
									'id':$(this).attr("id"),
									'newsNum':num
							};
							listService.updateNewsNum(data,function(data){
								alert(data);
							});
							$(this).children(".number").text(num);
						}else{
							alert("您还没有登录，请登录！");
						}		
						flag=false;
					}
				});
				
			}
		});
		
		
		
	}]).factory("listService",['$http','$httpParamSerializer',function($http,$httpParamSerializer){
		return{
			//获取所有栏目信息
            getAllType:function (handler) {
                $http.get("json/types.json")
                    .success(
                        function (data) {
                            handler(data);
                        }
                    );
            },
            //获取所有审核通过的新闻
            getStatusNews:function (handler) {
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
            },
            //点赞成功
            updateNewsNum:function(data,handler){
            	 var obj = {
                         "id":data.id,
                         'newsNum':data.newsNum
                     };
                 obj = $httpParamSerializer(obj);
                 $http.post("UpdateNewsNum.do",obj,{
                     headers:{
                         "Content-Type":"application/x-www-form-urlencoded"
                     }
                 }).success(function (data) {
                     handler(data);
                 });
            }
        
		}
	}]).directive('isReader',function(){
		return {
			restrict: 'A',
			scope: {
				over: '=isReader'
			},
			link:function(scope, elm, attr){
				if(scope.$parent.$last){
					scope.over = true;
				}
			}
		};
});

//分页方法
function page(data,params){
	//每一页的条数
	var page = 6;
	//定义页数
	var pages=0;
	//动态添加页码数
	var id ;
	//整除操作,计算页数
	if(data.length%page==0){	
		pages = data.length/page;
	}else{	
		pages = parseInt(data.length/page)+1;
	}
	//动态添加页数
	for(var i =1;i<pages+1;i++){
		var newLi = "<li class = 'link'><a href='list.html?id="+params+"'>"+i+"</a></li>";
		$(".next").before(newLi);
	}
	//点击页数出现相对应的页数
	$(".link").on("click",function(){
		//改变背景颜色
		$(".page").find("a").removeClass("active_a");
		$(this).find("a").addClass("active_a");
		//显示对应条数
		id = $(this).find("a").eq(0).html();
		 $(".news").css("display","none");
		$(".news").slice((id-1)*page,id*page).css("display","block");
	});
	 $(".link").find("a").eq(0).trigger("click");
	 //点击上一页
	 $(".prev").on("click",function(){
		 if($(".active_a").html()==1){
			 alert("已是第一页");
		 }else{
			//改变背景颜色
			 id = +$(".active_a").html();
			 $(".link").eq(id-2).find("a").addClass("active_a").parent(".link").siblings().children("a").removeClass("active_a");
			 $(".news").css("display","none");
    			$(".news").slice((id-2)*page,(id-1)*page).css("display","block");
			
		 }
	 });
	 //点击下一页
	 $(".next").on("click",function(){
		 if($(".active_a").html()==pages){
			 alert("已是最后一页");
		 }else{
			 id = +$(".active_a").html();
			 $(".link").eq(id).find("a").addClass("active_a").parent(".link").siblings().children("a").removeClass("active_a");
			  $(".news").css("display","none");
    		$(".news").slice(id*page,(id+1)*page).css("display","block");
			
		 }
	 });
}