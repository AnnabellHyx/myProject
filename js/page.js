$(function(){
	function page(){
    	var show_per_page = 6;
    	//var number_of_pages = Math.ceil(allNum/show_per_page);
    	$('#current_page').val(0);
    	$('#show_per_page').val(show_per_page);
		
		 $('.page .page_link:first').addClass('active_a');
		 $('.view_news').children().css('display', 'none');
         $('.view_news').children().slice(0, show_per_page).css('display', 'block');
         
         function previous(){
             new_page = parseInt($('#current_page').val()) - 1;
             if($('.active_a').prev('.page_link').length==true){
                 go_to_page(new_page);
             }
         } 
         function next(){
             new_page = parseInt($('#current_page').val()) + 1;
             //if there is an item after the current active link run the function
             if($('.active_a').next('.page_link').length==true){
                 go_to_page(new_page);
             }
         }
         function go_to_page(page_num){
             var show_per_page = parseInt($('#show_per_page').val());
             start_from = page_num * show_per_page;
             end_on = start_from + show_per_page;
             $('.view_news').children().css('display', 'none').slice(start_from, end_on).css('display', 'block');
             $(this).addClass('active_a').siblings('.active_a').removeClass('active_a');
             $('#current_page').val(page_num);
         }
    }
	page();
 
});


   