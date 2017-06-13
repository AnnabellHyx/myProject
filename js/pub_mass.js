$(function(){
	//更改头像
	if($(".exPhoto").html()){
		$(".exPhoto").off("click");
		$(".exPhoto").on("click",function(){
    		$(".choseTu").css("display","block");
    		$(this).html("确定");
    		var imgs = Array.prototype.slice.call($('.choseTu>img'),0);
    		imgs.forEach(function(item,index){
    			item.onclick=function(){
    				$("#photo1 img").attr("src",$(item).attr("src"));
    			};
    		});
    		$(this).on("click",function(){
    			$(".choseTu").css("display","none");
    			$(this).html("更换头像");
    		});
    	});	
	}
});