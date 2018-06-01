

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
           
            getCatologueURL(frameDoc,name, num,idx,id);

        }
        else if (x.length == 6) 
        {
            var name = x[2] + "%20" + x[3];
            var num = x[5];
            var fullName = name + " " + num;
            
           getCatologueURL(frameDoc,name,num,idx,id,url);

        }
        
        id = globalClass + (++idx);
        classNameParent = frameDoc.getElementById(id).innerHTML;

    }    
}

function getCatologueURL(frameDoc,className,classNum,index,id) 
{
    //first check if the course name is either one whole word or contains a whitespace 
    //chrome.runtime.sendMessage(className);
    
    var url = "https://catalogue.ualberta.ca/Course/Details?subjectCode=" + className +"&catalog=" + classNum;
    chrome.runtime.sendMessage(
        {
            extra:"GETURL",
            URL: url,
            method: "GET",
        }, function (response) {

            // create a dummy div element and retrieve the course description and course 
            var dummyElement = document.createElement("div");
            dummyElement.innerHTML = response;
            var course = dummyElement.getElementsByClassName("info-panel")[0].children[0].innerHTML;
            var courseDescription = dummyElement.getElementsByClassName("info-panel")[0].children[1].innerHTML;
            putDescription(frameDoc,course,courseDescription,index,id,url);
        });
}


function putDescription(frameDoc, course, courseDescription, index,id,url) {

    var newDiv = document.createElement("div");
    var popup = '';
    newDiv.innerHTML = popup;
    var e = frameDoc.getElementById(id);
    e.appendChild(newDiv)
    e.addEventListener("mouseover", function() {

        newDiv.style.display = 'block';
        newDiv.innerHTML = '<div id="popup"><h1>' + course +'</h1><p class="description">' + courseDescription + '</p></div>'//<div><span><a href = "' + url + '">Click here to view</a></span></div>'
        newDiv.style.backgroundColor = 'white';
        newDiv.style.borderWidth = "medium"
        newDiv.style.borderColor = "#00431b";
        newDiv.style.borderStyle = "solid";
        newDiv.style.color = "#00431b";
        newDiv.style.position = "absolute";
        newDiv.style.width = "300px";
        newDiv.style.minHeight = "310px";
        newDiv.style.paddingLeft = "5px"
        newDiv.style.paddingRight = "5px"

	    });
	    e.addEventListener("mouseout", function() {
	    	
					newDiv.style.display = 'none';
	    });

        newDiv.addEventListener("mouseover", function() {
	    	newDiv.style.display = 'block';
	    });

	    newDiv.addEventListener("mouseout", function() {
	    	newDiv.style.display = 'none';
	    });

}