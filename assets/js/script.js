
function addEvent(obj, evType, fn, isCapturing){
  if (isCapturing==null) isCapturing=false; 
  if (obj.addEventListener){
        // Firefox
      obj.addEventListener(evType, fn, isCapturing);
      return true;
  } else if (obj.attachEvent){
      // MSIE
      var r = obj.attachEvent('on'+evType, fn);
      return r;
  } else {
      return false;
  }
}

  // register to the potential page visibility change
addEvent(document, "potentialvisilitychange", function(event) {
  //console.log("potentialVisilityChange: potentialHidden="+document.potentialHidden+", document.potentiallyHiddenSince="+document.potentiallyHiddenSince+" s");
  if(document.potentialHidden){
      //console.log(document.potentialHidden)
      flag()
  }
});

  // register to the W3C Page Visibility API
var hidden=null;
var visibilityChange=null;
if (typeof document.mozHidden !== "undefined") {
  hidden="mozHidden";
  visibilityChange="mozvisibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  hidden="msHidden";
  visibilityChange="msvisibilitychange";
} else if (typeof document.webkitHidden!=="undefined") {
  hidden="webkitHidden";
  visibilityChange="webkitvisibilitychange";
} else if (typeof document.hidden !=="hidden") {
  hidden="hidden";
  visibilityChange="visibilitychange";
}

if (hidden!=null && visibilityChange!=null) {  // Tab switch Detection
  addEvent(document, visibilityChange, function(event) {
      if(document[hidden]){
          flag()
      }
  });
}


//-------------------------------------------------------------------

var potentialPageVisibility = {
  pageVisibilityChangeThreshold:3*3600, // in seconds
  init:function() {
      function setAsNotHidden() {
          var dispatchEventRequired=document.potentialHidden;
          document.potentialHidden=false;
          document.potentiallyHiddenSince=0;
          if (dispatchEventRequired) dispatchPageVisibilityChangeEvent();
      }

      function initPotentiallyHiddenDetection() {
          if (!hasFocusLocal) {
          // the window does not has the focus => check for  user activity in the window
          lastActionDate=new Date();
          if (timeoutHandler!=null) {
          clearTimeout(timeoutHandler);
          }
          timeoutHandler = setTimeout(checkPageVisibility, potentialPageVisibility.pageVisibilityChangeThreshold*1000+100); // +100 ms to avoid rounding issues under Firefox
          }
      }

      function dispatchPageVisibilityChangeEvent() {
          unifiedVisilityChangeEventDispatchAllowed=false;
          var evt = document.createEvent("Event");
          evt.initEvent("potentialvisilitychange", true, true);
          document.dispatchEvent(evt);
      }

      function checkPageVisibility() {
          var potentialHiddenDuration=(hasFocusLocal || lastActionDate==null?0:Math.floor((new Date().getTime()-lastActionDate.getTime())/1000));
          document.potentiallyHiddenSince=potentialHiddenDuration;
          if (potentialHiddenDuration>=potentialPageVisibility.pageVisibilityChangeThreshold && !document.potentialHidden) {
            document.potentialHidden=true;
            dispatchPageVisibilityChangeEvent();
          }
      }

      var lastActionDate=null;
      var hasFocusLocal=true;
      var hasMouseOver=true;
      document.potentialHidden=false;
      document.potentiallyHiddenSince=0;
      var timeoutHandler = null;
      
      addEvent(document, "pageshow", function(event) {
          document.getElementById("x").innerHTML+="pageshow/doc:<br>";
      });
      addEvent(document, "pagehide", function(event) {
          document.getElementById("x").innerHTML+="pagehide/doc:<br>";
      });
      addEvent(window, "pageshow", function(event) {
          // raised when the page first shows
      });
      addEvent(window, "pagehide", function(event) {
          // not raised
      });
      addEvent(document, "mousemove", function(event) {
          lastActionDate=new Date();
      });
      addEvent(document, "mouseover", function(event) {
          hasMouseOver=true;
          setAsNotHidden();
      });
      addEvent(document, "mouseout", function(event) {
          hasMouseOver=false;
          initPotentiallyHiddenDetection();
      });
      addEvent(window, "blur", function(event) {
          hasFocusLocal=false;
          initPotentiallyHiddenDetection();
      });
      addEvent(window, "focus", function(event) {
          hasFocusLocal=true;
          setAsNotHidden();
      });
        setAsNotHidden();
  }
}
var warning=0
var lim=2
function flag(){
  warning+=1
  if(warning===lim){
    alert("You once again violated the rule. Sorry you are disqualified from this event")
    //document.getElementById('sandq').click()
  }else{
    alert("You are violated the rule. dont try to malpractice, if you again violate the rule you will be disqualify from Spectrum War")
  }
}
potentialPageVisibility.pageVisibilityChangeThreshold=4; // 4 seconds for testing
potentialPageVisibility.init();
