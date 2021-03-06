﻿<%@ Page Language="C#" AutoEventWireup="true" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>GSinPV</title>
    <style type="text/css">
    html, body {
	    height: 100%;
	    overflow: auto;
    }
    body {
	    padding: 0;
	    margin: 0;
    }
    #silverlightControlHost {
	    height: 100%;
	    text-align:center;
    }
    </style>
    <script type="text/javascript" src="Silverlight.js"></script>
    <script type="text/javascript">
        var company = "";
        var initialIsDone = false;

        function onSilverlightError(sender, args) {
            var appSource = "";
            if (sender != null && sender != 0) {
              appSource = sender.getHost().Source;
            }
            
            var errorType = args.ErrorType;
            var iErrorCode = args.ErrorCode;

            if (errorType == "ImageError" || errorType == "MediaError") {
              return;
            }

            var errMsg = "Unhandled Error in Silverlight Application " +  appSource + "\n" ;

            errMsg += "Code: "+ iErrorCode + "    \n";
            errMsg += "Category: " + errorType + "       \n";
            errMsg += "Message: " + args.ErrorMessage + "     \n";

            if (errorType == "ParserError") {
                errMsg += "File: " + args.xamlFile + "     \n";
                errMsg += "Line: " + args.lineNumber + "     \n";
                errMsg += "Position: " + args.charPosition + "     \n";
            }
            else if (errorType == "RuntimeError") {           
                if (args.lineNumber != 0) {
                    errMsg += "Line: " + args.lineNumber + "     \n";
                    errMsg += "Position: " +  args.charPosition + "     \n";
                }
                errMsg += "MethodName: " + args.methodName + "     \n";
            }

            throw new Error(errMsg);
        }

        function injectScript(url, name) {
            var head = document.getElementsByTagName("head")[0];
            var script = document.createElement("script");
            script.id = name;
            script.src = url;
            head.appendChild(script);

            if (initialIsDone) {
                company = url.toString().split("getsatisfaction.com/")[1].split("/")[1];
            }
            else {
                initialIsDone = true;
            }
        };

        function handlerCompanies(obj) {
            var silverlight = document.getElementById("silverlight");
            if (silverlight) {
                silverlight.Content.Page.PassCompanyData(JSON.stringify(obj));
            }
        };

        function handlerTopics(obj) {
            var silverlight = document.getElementById("silverlight");
            if (silverlight) {
                silverlight.Content.Page.PassTopicData(JSON.stringify(obj));
            }
        };
        
        function handlerPeople(obj) {
            var silverlight = document.getElementById("silverlight");
            if (silverlight) {
                silverlight.Content.Page.PassPeopleData(JSON.stringify(obj));
            }
        };

        function getMoreData(url, name) {
            var head = document.getElementsByTagName("head")[0];
            var script = document.createElement("script");
            script.id = name;
            script.src = "https://api.getsatisfaction.com/companies/" + company + url;
            head.appendChild(script);
        };

        function handlerMoreTopics(obj) {
            var silverlight = document.getElementById("silverlight");
            if (silverlight) {
                silverlight.Content.Page.AddMoreTopics(JSON.stringify(obj));
            }
        };

        function handlerMorePeople(obj) {
            var silverlight = document.getElementById("silverlight");
            if (silverlight) {
                silverlight.Content.Page.AddMorePeople(JSON.stringify(obj));
            }
        };
</script>
</head>
<body>
    <form id="form1" runat="server" style="height:100%">
    <div id="silverlightControlHost">
        <object data="data:application/x-silverlight-2," type="application/x-silverlight-2" width="100%" height="100%" id="silverlight">
		  <param name="source" value="ClientBin/GSinPV.xap" />
		  <param name="onError" value="onSilverlightError" />
		  <param name="background" value="white" />
		  <param name="minRuntimeVersion" value="5.0.61118.0" />
		  <param name="autoUpgrade" value="true" />
		  <a href="http://go.microsoft.com/fwlink/?LinkID=149156&v=5.0.61118.0" style="text-decoration:none">
 			  <img src="http://go.microsoft.com/fwlink/?LinkId=161376" alt="Get Microsoft Silverlight" style="border-style:none"/>
		  </a>
	    </object><iframe id="_sl_historyFrame" style="visibility:hidden;height:0px;width:0px;border:0px"></iframe></div>
    </form>
</body>
</html>
