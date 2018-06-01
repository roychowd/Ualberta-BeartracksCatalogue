chrome.runtime.onMessage.addListener(function (response, sender, sendResponse) { 
    
    if (response.extra == "GETURL") {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {

            if (this.status == 200) 
            {
                var resp = this.responseText;
                sendResponse(resp);
            }
        }

        xhr.open(response.method, response.URL, true);
        xhr.send();

        return true;
    }
    else  { 
        console.log(response);
        return true;
    }
    //return true;
});
