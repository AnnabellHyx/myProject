/**
 * Created by Administrator on 2017/3/8.
 * 发布页面的js
 */

angular.module("app.publishModule",['ng'])
	//用户的详细信息
    .controller("pubMassCtr",['$scope','makeService','$routeParams','$location',function ($scope,makeService,$routeParams,$location) {
        //发布者页面信息
    	//获取到登陆时地址栏的用户id号码
    	var idArr = window.location.search.split("?id=");
    	var id = idArr[1];
    	//获取到当前用户的详细信息
    	makeService.getMassage(function(data){
    		$scope.massage = data[id-1];
    		if($scope.massage.imageId!=""){
    			$("#photo1 img").attr("src",$scope.massage.imageId);
    		}
    		
    	});
    	
    	//更改头像
    	
		$(".exPhoto").off("click");
		$(".exPhoto").on("click",function(){
			if($(".exPhoto").html()=="更换头像"){
				$(".choseTu").css("display","block");
				$(this).html("确定");
			}else{
				$(".choseTu").css("display","none");
				$(this).html("更换头像");
				
			}    		
    		var imgs = Array.prototype.slice.call($('.choseTu>img'),0);
    		imgs.forEach(function(item,index){
    			item.onclick=function(){
    				$("#photo1 img").attr("src",$(item).attr("src"));
    			};
    		});
    		
    	});
		//修改信息
		
		$scope.updateMass=function(){
			//判断该标签内的值
			if($("#btnX").html()=="修改"){
				//修改输入框中的
				$(".mass_tab input").removeAttr("readonly");
				//显示更改头像的选择框
				$(".exPhoto").css("display","block");
				$("#btnX").html("确定");
			}else{
				var mass=$scope.massage;
				mass['imageId'] = $("#photo1 img").attr("src");
				//确定的时候要保存页面的值
				makeService.updateMassages(mass,function(data){
					alert(data);
				});
				$("#btnX").html("修改");
				//隐藏选择框
				$(".exPhoto").css("display","none");
				$(".mass_tab input").attr("readonly","true");
			}
		}
    	
    }])
    //发布者的发布历史
    .controller("pubPubCtr",['$scope','$routeParams','commenService','makeService','$rootScope','$location',function ($scope,$routeParams,commenService,makeService,$rootScope,$location) {
        //动态加载新闻类型；
        $scope.params = $routeParams;
        console.log($scope.params);
        $scope.news = {
        		userId:""
        };
        commenService.getAllType(function (data) {
            $scope.types=data;
        });
        commenService.getAllKinds(function (data) {
            $scope.kinds=data;
        });
        //
      
        
        
      //获取到登陆时地址栏的用户id号码
    	var idArr = window.location.search.split("?id=");
    	var id = idArr[1];
    	$scope.news.userId = id;
    	//复用查询语句
    	$scope.data=[''];
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
    			var newLi = "<li class = 'link'><a href='#/publishPub/ctId/"+params.ct+"/ntId/"+params.nt+"'>"+i+"</a></li>";
    			$(".next").before(newLi);
    		}
    		//点击页数出现相对应的页数
    		$(".link").on("click",function(){
    			//console.log($scope.params);
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
    	$scope.toggle = {
				now:false
		};
		$scope.$watch('toggle.now',function(){
//			数据渲染成功后
			if($scope.toggle.now){
				 $(".view_content").css("display","none");
				
				 page( $scope.newss,$scope.params);
			}
		});

    	if($scope.params.ct==0 && $scope.params.nt==0){
    		//获取当前用户发表的所有新闻
    		 makeService.getNews($scope.news,function (data) {
    			 $scope.leng = data.length;	 
    			 $scope.newss= data;
    		 });
    	}else if($scope.params.ct!=0 && $scope.params.nt==0){
    		makeService.getNews($scope.news,function (data) {
    			
    			$scope.newss= [];
    			var id = $scope.params.ct;
            	var newsType = $scope.types[id-1].realName;
            	for(var key in data){
        			if(data[key].newsType==newsType){
        				$scope.newss.push(data[key]);
        			}
        		}
            	//$scope.data = $scope.newss;
            	$scope.leng = $scope.newss.length;
            	 //分页 默认第一页
            	
            	
   		 	});
    	}else if($scope.params.ct==0 && $scope.params.nt!=0){
    		makeService.getNews($scope.news,function (data) {
    			$scope.newss= [];
    			var id = $scope.params.nt;
    			var newsHot = $scope.kinds[id-1].realName;
    			for(var key in data){
        			if(data[key].newsHot==newsHot){
        				$scope.newss.push(data[key]);
        			}
        		}
    			//$scope.data = $scope.newss;
    			$scope.leng = $scope.newss.length;
    			 //分页 默认第一页
    			
   		 	});
    	}else if($scope.params.ct!=0 && $scope.params.nt!=0){
    		makeService.getNews($scope.news,function (data) {
    			$scope.newss= [];
    			var id = $scope.params.ct;
            	var newsType = $scope.types[id-1].realName;
    			var id = $scope.params.nt;
    			var newsHot = $scope.kinds[id-1].realName;
    			for(var key in data){
        			if(data[key].newsHot==newsHot && data[key].newsType==newsType){
        				$scope.newss.push(data[key]);
        			}
        		}
    			//$scope.data = $scope.newss;
    			$scope.leng = $scope.newss.length;
    			 //分页  默认第一页
    			
   		 	});
    	}
    	//分页操作

    }])
    //删除新闻的操作
    .controller("delPubCtr",['$scope','$routeParams','makeService','$location',function($scope,$routeParams,makeService,$location){
    	var flag = confirm("确定删除吗?");
    	if(flag){
    		makeService.delNews($routeParams.id,function(data){
    			alert(data);
    		});
    	}
    	$location.path("/publishPub/ctId/0/ntId/0");
    }])
    //添加新闻的详细页
    .controller("addNewCtr",['$scope','makeService','$location',function ($scope,makeService,$location) {
    	$scope.newsContent = {
    			userId:"",
        		newsType:"",
        		newsHot:"",
        		newsTitle:"",
        		newsTag:"",
        		content:"",
        		time:"",
        		status:"未审核",
        		newsImg:""
        };
    	//获取用户id
    	var idArr = window.location.search.split("?id=");
    	var id = idArr[1];
    	$scope.newsContent.userId=id;
    	//获取新闻类型
    	$(".typesName").on("change",function(){
    		var typesName = $(this).val();
    		$scope.newsContent.newsType=typesName;
    	});
    	//获取新闻热度
    	$(".importType").on("change",function(){
    		var importType = $(this).val();
    		$scope.newsContent.newsHot=importType;
    	});
    	//获取发布者当前发布时间
    	function showTime(){
    		   var mydate = new Date();
    		   var str = "" + mydate.getFullYear() + "-";
    		   str += (mydate.getMonth()+1) + "-";
    		   str += mydate.getDate();
    		   $scope.newsContent.time=str;
    	}
        //保存并继续事件
        $scope.saveAndCon = function () {
        	showTime();
        	var data = $("#news_file").val();
        	var opt = {
        			 type:'post',            
					  datatype:'json',
					  data:data,
					  url:'up.action', 
					  success: function(data) {
						  var data1 = data.split("images\\");
						  $scope.newsContent.newsImg = "images/"+data1[1];
						//保存新闻
						  makeService.saveNews($scope.newsContent,function (data) {
				                 alert(data);
				                 $scope.newsContent = {
				             			userId:"",
				                 		newsType:"",
				                 		newsHot:"",
				                 		newsTitle:"",
				                 		newsTag:"",
				                 		content:"",
				                 		time:"",
				                 		status:"未审核",
				                 		newsImg:""
				                 };
				         });
						 
					  }
        	};
        	$("#fileForm").ajaxSubmit(opt);
        };
       //保存并返回事件
        $scope.saveAndClose = function () {
        	var idArr = window.location.search.split("?id=");
        	var id = idArr[1];
        	$scope.newsContent.userId=id;
        	showTime();
        	//上传图片
        	var data = $("#news_file").val();
        	var opt = {
        			 type:'post',            
					  datatype:'json',
					  data:data,
					  url:'up.action', 
					  success: function(data) {
						  var data1 = data.split("images\\");
						  $scope.newsContent.newsImg = "images/"+data1[1];
						//保存新闻
						  makeService.saveNews($scope.newsContent,function (data) {
				                 alert(data);
				                 $location.path("/publishPub/ctId/0/ntId/0");
				         });
					  }
        	};
        	$("#fileForm").ajaxSubmit(opt);
        };

    }])
    //分页控制器
    
    .factory("commenService",['$http',function ($http) {
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
                    )
            }
        }
    }])
    .factory("makeService",['$http','$httpParamSerializer',function ($http,$httpParamSerializer) {
        return {
            //获取所有的用户信息
            getMassage:function (handler) {
                $http.get("GetMassages.do").success(
                        function (data) {
                            handler(data);
                        }
                    );
            },
            //获取该登录用户发布的新闻
            getNews: function(news,handler){
            	var user = news;
            	var id = {
            		'userId':user.userId
            	};
            	id = $httpParamSerializer(id);
            	$http.post("GetUserIdNews.do",id,{
            		headers:{
                        "Content-Type":"application/x-www-form-urlencoded"
                    }
            	}).success(function(data){
            		handler(data);
            	});
            },
            //保存新闻，然后返回保存成功！
            saveNews: function (newsContent,handler) {
            	var news = newsContent;
                var newsCon = {
                	'userId':news.userId,
                	'newsType':news.newsType,
                	'newsHot':news.newsHot,
                	'newsTitle':news.newsTitle,
                	'newsTag':news.newsTag,
                	'content':news.content,
                	'time':news.time,
                	'status':news.status,
                	'newsNum':'0',
                	'newsImg':news.newsImg
                };
                //将json数据转换成表单格式的数据
                newsCon = $httpParamSerializer(newsCon);
                $http.post("SaveNews.do",newsCon,{
                    headers:{
                        "Content-Type":"application/x-www-form-urlencoded"
                    }
                }).success(
                    function (data) {
                        handler(data);
                })
            },
            //删除新闻的方法
            delNews: function(id,handler){
      
            	var obj = {
            		'id':id
            	};
            	obj = $httpParamSerializer(obj);
            	$http.post("delNews.do",obj,{
            		headers:{
                        "Content-Type":"application/x-www-form-urlencoded"
                    }
            	}).success(function(data){
            		handler(data);
            	});
            },
            //更新用户信息
            updateMassages:function(cont,handler){
            	var obj1 = {
            		'id':cont.id,
            		'username':cont.username,
            		'age':cont.age,
            		'address':cont.address,
            		'word':cont.word,
            		'explain':cont.explain,
            		'email':cont.email,
            		'imageId':cont.imageId
            	};
            	obj1 = $httpParamSerializer(obj1);
            	$http.post("UpdateMass.do",obj1,{
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


