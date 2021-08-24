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
addEvent(document, "potentialvisilitychange", function(event) { //trigger the function when the visibility change detected
  //console.log("potentialVisilityChange: potentialHidden="+document.potentialHidden+", document.potentiallyHiddenSince="+document.potentiallyHiddenSince);
  if(document.potentialHidden==true){
    vflag()
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
if (hidden!=null && visibilityChange!=null) {
  addEvent(document, visibilityChange, function(event) { //trigger the function when the tabswitch or app switch detected
    //console.log(visibilityChange+": "+hidden+"="+document[hidden]);   
    if(document[hidden]){
      tflag()
    }
  });
}

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
        // page visibility change threshold raiched => raise the even
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

    /*
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
    */
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

potentialPageVisibility.pageVisibilityChangeThreshold=2; // 2 seconds for testing
potentialPageVisibility.init();

var tf=0
var vf=0

function tflag(){
  tf+=1
  console.log(tf)
}

function vflag(){
  vf+=1
  console.log(vf)
}

//---Timer---


// Set the date we're counting down to
end_time="Aug 24, 2021 15:00:00" //pass the variable from backend when the times end
var countDownDate = new Date(end_time).getTime();
// Update the count down every 1 second
var x = setInterval(function() {

  // Get today's date and time
    var now = new Date().getTime();
  // Find the distance between now and the count down date
    var distance =countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
    document.getElementById("timer").innerHTML = minutes + "m " + seconds + "s ";

  // If the count down is finished, write some text
    if (distance < 0) {
        clearInterval(x);
        document.getElementById("demo").innerHTML = "0m 0s";
        console.log("Times UP")
        document.getElementById('san').click()
    }
}, 1000);