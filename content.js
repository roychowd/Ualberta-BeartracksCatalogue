

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


class Course {
    constructor(name, number, description, nameNumString){
        this.name = name;
        this.number = number;
        this.description = description;
        this.nameNumString = nameNumString;
    }

    getName() {
        return this.name;
    }

    getNameNumString() {
        return this.nameNumString;
    }

    getNumber() {
        return this.number;
    }

    getDescription() {
        return this.description;
    }
}

function grabCourseName(frameDoc) {
    // rerpresents the constant portion of the id for the div tag
    var coursesArray = [];
    chrome.runtime.sendMessage("IDK");
    const globalClass = "SSR_CLSRSLT_WRK_GROUPBOX2$";
    var idx = 0;
    var id = globalClass +idx;
    var classNameParent = frameDoc.getElementById(id).innerHTML;
    while (classNameParent != null)
    {
        var courseName = classNameParent.slice(classNameParent.indexOf('alt="Collapse section'), classNameParent.indexOf(" -"));
        var x = courseName.split(" ")
        
        if (x.length == 5) {
            var concatenatedName = x[2] + " " + x[4];
            var course = new Course(x[2], x[4], " ", concatenatedName);
            coursesArray.push(course);
            chrome.runtime.sendMessage(course.getName());
            chrome.runtime.sendMessage(course.getNumber());
            chrome.runtime.sendMessage(course.getDescription());
            chrome.runtime.sendMessage(course.nameNumString());
        }

        else if (x.length == 6) {
            var concatenatedName = x[3] + " " + x[5];
            var course = new Course(x[3],x[5]," ", concatenatedName);
            coursesArray.push(course);

        }
        id = globalClass + (++idx);
        classNameParent = frameDoc.getElementById(id).innerHTML;
    }

    if (coursesArray.length != 0) {
        chrome.runtime.sendMessage(coursesArray.length);
        for (var i = 0; i < coursesArray.length; i++) {
            chrome.runtime.sendMessage(coursesArray[i].getName());
            chrome.runtime.sendMessage(coursesArray[i].getNumber());
            chrome.runtime.sendMessage(coursesArray[i].getDescription());
            chrome.runtime.sendMessage(coursesArray[i].nameNumString());
        }
    }
    else {
        chrome.runtime.sendMessage("its 0");
    }

    


}


