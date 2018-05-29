window.onload = function () {

	// flag for knowing what way to implement results
	var count = 0;
	/*
	Interval every second to make sure to grab the dom of the page. Dom changes a lot, and sometimes it does not modify
	the dom itself, but changes the whole page without changing of the url. So couldnt get MutationObserver to work.
	If more time, figure out how to work it correctly.  
	*/
	setInterval(function(){

		var frame = document.getElementsByName("TargetContent")[0];
        var frameDoc = frame.contentDocument || frame.contentWindow.document;
        chrome.runtime.sendMessage(frameDoc);
		
		//flag is 0, then its the first time the dom has loaded
		if(frameDoc.getElementsByClassName("SSSTABACTIVE")[0].innerHTML.slice(135, -4) == "Search" &&
			"Class Search Results" == frameDoc.getElementById("DERIVED_REGFRM1_TITLE1").innerHTML && count == 0){

			/*
			if that element exists, then it is a edit of when Add to builder or watchlist was clicked.
			This solves bug of loading results twice when labs are added.
			*/
			if(frameDoc.getElementById("DERIVED_CLSMSG_ERROR_TEXT") != null){

				var element = frameDoc.getElementById("DERIVED_CLSMSG_ERROR_TEXT");

				try{
					/*
					remove that element so that it knows to stop implementing results, otherwise
					will go on forever
					*/

					element.parentNode.removeChild(element);
					count = 1;

					//grabProfNames(frameDoc);
				}

				catch(TypeError){
				}
			}

			else{
				count = 1;
				//grabProfNames(frameDoc);
			}	
		}

		else if(frameDoc.getElementsByClassName("SSSTABACTIVE")[0].innerHTML.slice(135, -4) == "Search" &&
			"Class Search Results" == frameDoc.getElementById("DERIVED_REGFRM1_TITLE1").innerHTML && 
			frameDoc.getElementById("DERIVED_CLSMSG_ERROR_TEXT") != null && count == 1){

			var element = frameDoc.getElementById("DERIVED_CLSMSG_ERROR_TEXT");

			try{

				element.parentNode.removeChild(element);
				//grabProfNames(frameDoc);
			}

			catch(TypeError){
			}
		}

		/*
		If conditions are not met, reset flag because it is no longer on the proper dom
		*/
		else if(frameDoc.getElementsByClassName("SSSTABACTIVE")[0].innerHTML.slice(135, -4) != "Search" ||
			"Class Search Results" != frameDoc.getElementById("DERIVED_REGFRM1_TITLE1").innerHTML){
			count = 0;
		}
	}, 1000);
};