

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
        chrome.runtime.sendMessage(count);
		
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
                    grabCourseName(frameDoc);

					//grabProfNames(frameDoc);
				}

				catch(TypeError){
				}
			}

			else{
                count = 1;
                grabCourseName(frameDoc);
				//grabProfNames(frameDoc);
			}	
		}

		else if(frameDoc.getElementsByClassName("SSSTABACTIVE")[0].innerHTML.slice(135, -4) == "Search" &&
			"Class Search Results" == frameDoc.getElementById("DERIVED_REGFRM1_TITLE1").innerHTML && 
			frameDoc.getElementById("DERIVED_CLSMSG_ERROR_TEXT") != null && count == 1){

			var element = frameDoc.getElementById("DERIVED_CLSMSG_ERROR_TEXT");

			try{

                element.parentNode.removeChild(element);
                grabCourseName(frameDoc);
				//grabProfNames(frameDoc);
			}

			catch(TypeError){
			}
		}

		/*
		If conditions are not met, reset flag because it is no longer on the proper dom
		*/
		else if(frameDoc.getElementsByClassName("SSSTABACTIVE")[0].innerHTML.slice(135, -4) != "Search" ||
            "Class Search Results" != frameDoc.getElementById("DERIVED_REGFRM1_TITLE1").innerHTML)
            {
			count = 0;
		    }
	}, 1000);
};

function grabCourseName(frameDoc) {
    // rerpresents the constant portion of the id for the div tag
    var nameNum = {}; // a hashtable of course name and their respective number
    var coursesArray = []; // may not need this will come back to it later
    const globalClass = "SSR_CLSRSLT_WRK_GROUPBOX2$"; // this portion of the  dom remains constant!
    var idx = 0;
    var id = globalClass +idx;
    var classNameParent = frameDoc.getElementById(id).innerHTML;
    while(classNameParent != null)
    {
        var courseName = classNameParent.slice(classNameParent.indexOf('alt="Collapse section'), classNameParent.indexOf(" -"));
        var x = courseName.split(" ");
        if (x.length == 5) {
            var name = x[2]; 
            var num = x[4];
            
            var fullName = name + " " + num;
           
            getCatologueURL(name, num);

        }
        else if (x.length == 6) 
        {
            var name = x[2] + "%20" + x[3];
            var num = x[4];
            var fullName = name + " " + num;
            
           getCatologueURL(name,num);

        }
        
        id = globalClass + (++idx);
        classNameParent = frameDoc.getElementById(id).innerHTML;

    }    
}

function getCatologueURL(className,classNum) 
{
    //first check if the course name is either one whole word or contains a whitespace 
    chrome.runtime.sendMessage(className);
    if (!hasWhiteSpace(className))
    {
        // regular url
        chrome.runtime.sendMessage("contains no whitespace");

        var url = "https://catalogue.ualberta.ca/Course/Details?subjectCode=" + className +"&catalog=" + classNum;
        chrome.runtime.sendMessage(
            {
                extra:"GETURL",
                URL: url,
                method: "GET",
            }, function (response) {
                chrome.runtime.sendMessage(response);

            });


        return;
    }

    else {
        // need to change4
        var url = "https://catalogue.ualberta.ca/Course/Details?subjectCode=" + className + "&catalog=" + classNum;




        chrome.runtime.sendMessage("contains whitespacce");
        return;
    }
}


function hasWhiteSpace(string)
{
    return string.indexOf(' ') >= 0;
}

