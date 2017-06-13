/**
 * Created by Administrator on 2017/3/9.
 * 这是管理员管理管理页面的js
 */
$(function () {
    //点击展开
    $(".left_type>ul").slideUp("fast");
    $(".left_type>div").off("click");
    $(".left_type>div").on("click",function () {
        $(".left_type>ul").slideUp();
        $(this).next().slideDown();
    });
    $(".left_type>div").eq(0).trigger("click");
    //点击变背景色
    $(".left_type a").on("click",function () {
        $(".left_type a").removeClass("active");
        $(this).addClass("active");
    });
    $(".left_type a").eq(0).trigger("click");
});

angular.module("app",['ng','ngRoute','app.manageModule'])
    .config(["$routeProvider",function ($routeProvider) {
        $routeProvider.when("/allAudited",{
            templateUrl:"tpl/manage/unallaudited.html",
            controller:"getAllNewsCtr"
        }).when("/audited",{
            templateUrl:"tpl/manage/audited.html",
            controller:"getAudNesCtr"
        }).when("/unAudited",{
            templateUrl:"tpl/manage/unaudited.html",
            controller:"getUnAutNewsCtr"
        }).when("/allAudited/id/:id/status/:status",{
            templateUrl:"tpl/manage/unallaudited.html",
            controller:"UpdateStatus"
        });
    }]);