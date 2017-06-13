angular.module("app",['ng'])
	.controller("newsCtr",['$scope','newsService',function($scope,newsService){
		//获取地址栏里面的参数
		var idArr = window.location.search.split("?id=");
    	var id = idArr[1];
    	
    
		//跳转在具体的新闻内容处
		newsService.getStatusNews(function(data){
			
			//获取需要的新闻
			newsService.getStatusNews(function(data){
				$scope.news = data.filter(function(item,index){
					return item.id== id ;
				})[0];	
			});
		});
		//点赞

		//点赞功能
		var flag = true;
		$(".praise").on("click",function(){
			if(flag){
					var num = +$(this).children(".number").text(); 
					num +=1;
					var data = {
							'id':$(this).attr("id"),
							'newsNum':num
					};
					newsService.updateNewsNum(data,function(data){
						alert(data);
					});
					$(this).children(".number").text(num);
					
				flag=false;
			}
		});
		
		
		
		
		//显示评论
		newsService.getNewsIdComment(id,function(data){
			$scope.commentss = data;
			
		});
		//保存具体的评论;
		$scope.comment={
			'comments':'',
			'newsId':'',
			'userId':'',
			'time':''
		};
		$scope.comment.newsId = id;
		$scope.comment.userId = sessionStorage.getItem("userId");
		//获取发布者当前发布时间
    	function showTime(){
    		   var mydate = new Date();
    		   var str = "" + mydate.getFullYear() + "-";
    		   str += (mydate.getMonth()+1) + "-";
    		   str += mydate.getDate();
    		   $scope.comment.time=str;
    	}
    	//评论完成操作
		$scope.Finshed=function(){
			showTime();
			console.log($scope.comment);
			newsService.saveComments($scope.comment,function(data){
				alert(data);
				//重置模态框
				$scope.comment.comments='';
				//自动关闭模态框
				$("#formClose").eq(0).trigger("click");
				window.location="news.html?id="+id;
			});
		};
		
	}])
	.factory("newsService",['$http','$httpParamSerializer',function($http,$httpParamSerializer){
		return{
			
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
            //保存评论
            saveComments: function (comment,handler) {
                var comments = {
        			'newsId':comment.newsId,
        			'commentId':comment.userId,
        			'conContent':comment.comments,
        			'commentTime':comment.time
                };
                console.log(comments);
                //将json数据转换成表单格式的数据
                comments = $httpParamSerializer(comments);
                $http.post("SaveComment.do",comments,{
                    headers:{
                        "Content-Type":"application/x-www-form-urlencoded"
                    }
                }).success(
                    function (data) {
                        handler(data);
                })
            },
          //查询评论
            getNewsIdComment:function(id,handler){
            	var obj = {
            			'newsId':id
            	};
            	obj = $httpParamSerializer(obj);
            	$http.post("GetUserComment.do",obj,{
                    headers:{
                        "Content-Type":"application/x-www-form-urlencoded"
                    }
                }).success(function (data) {
                	handler(data);
                });
            },
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
	}]);