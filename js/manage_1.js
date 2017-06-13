/**
 * Created by Administrator on 2017/3/9.
 * 这是管理员具体管理的js
 */
angular.module("app.manageModule",['ng'])
	//获取所有未审核的新闻
    .controller("getAllNewsCtr",['$scope','manageNewsService','$routeParams',function ($scope,manageNewsService,$routeParams) {
    	$scope.params  = $routeParams;
    	$scope.status = {
    			status:"未审核"
    	};
    	//分页
    	$scope.toggle = {
				now:false
		};
		$scope.$watch('toggle.now',function(){
//			数据渲染成功后
			if($scope.toggle.now){
				 $(".view_content").css("display","none");
				 page($scope.news,"allAudited");
			}
		});
    	
        manageNewsService.getStatusNews($scope.status,function (data) {
        	console.log($scope.status);
            //$scope.news = data;
            $scope.leng = data.length;
            $scope.news = data;
        });
    }])
    //获取所有审核通过的新闻
    .controller("getAudNesCtr",['$scope','manageNewsService','$routeParams',function ($scope,manageNewsService,$routeParams) {
    	$scope.params  = $routeParams;
    	$scope.status = {
    			status:"审核通过"
    	};
    	$scope.toggle = {
				now:false
		};
		$scope.$watch('toggle.now',function(){
//			数据渲染成功后
			if($scope.toggle.now){
				 $(".view_content").css("display","none");
				 page($scope.news,"audited");
			}
		});
        manageNewsService.getStatusNews($scope.status,function (data) {
            $scope.leng = data.length;
            $scope.news = data;
        });
    }])
    //获取所有审核不通过的新闻
    .controller("getUnAutNewsCtr",['$scope','manageNewsService','$routeParams',function ($scope,manageNewsService,$routeParams) {
    	$scope.params  = $routeParams;
    	$scope.status = {
    			status:"审核未通过"
    	};
    	//分页
    	$scope.toggle = {
				now:false
		};
		$scope.$watch('toggle.now',function(){
			//			数据渲染成功后
			if($scope.toggle.now){
				 $(".view_content").css("display","none");
				 page($scope.news,"unAudited");
			}
		});
        manageNewsService.getStatusNews($scope.status,function (data) {
            $scope.news = data;
            $scope.leng = data.length;
            
        });
    }])
    //审核新闻，修改状态位
    .controller("UpdateStatus",['$scope','$routeParams','manageNewsService','$location',function($scope,$routeParams,manageNewsService,$location){
    	$scope.params = $routeParams;
    	console.log($scope.params);
    	manageNewsService.updateStatus($scope.params,function(data){
    		alert(data);
    		$location.path("/allAudited");
    	});
    }])
    .factory("manageNewsService",['$http','$httpParamSerializer',function ($http,$httpParamSerializer) {
        return{
            //获取状态位不同的新闻；
            getStatusNews:function (status,handler) {
            	var status1 = status;
                var obj = {
                    "status":status1.status
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
            updateStatus:function(data,handler){
            	var da = data;
            	var obj = {
            			'id':da.id,
            			'status':da.status
            	};
            	var obj1 = $httpParamSerializer(obj);
            	$http.post("updStatus.do",obj1,{
            		headers:{
                        "Content-Type":"application/x-www-form-urlencoded"
                    }
            	}).success(function(data){
            		handler(data);
            	});
            }
        }
    }])
    .directive('isReader',function(){
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
		var newLi = "<li class = 'link'><a href='#/"+params+"'>"+i+"</a></li>";
		$(".next").before(newLi);
	}
	//点击页数出现相对应的页数
	$(".link").on("click",function(){
		//改变背景颜色
		$(".page").find("a").removeClass("active_a");
		$(this).find("a").addClass("active_a");
		//显示对应条数
		id = $(this).find("a").eq(0).html();
		 $(".view_content").css("display","none");
		$(".view_content").slice((id-1)*page,id*page).css("display","block");
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
			 $(".view_content").css("display","none");
    			$(".view_content").slice((id-2)*page,(id-1)*page).css("display","block");
			
		 }
	 });
	 //点击下一页
	 $(".next").on("click",function(){
		 if($(".active_a").html()==pages){
			 alert("已是最后一页");
		 }else{
			 id = +$(".active_a").html();
			 $(".link").eq(id).find("a").addClass("active_a").parent(".link").siblings().children("a").removeClass("active_a");
			  $(".view_content").css("display","none");
    		$(".view_content").slice(id*page,(id+1)*page).css("display","block");
			
		 }
	 });
}