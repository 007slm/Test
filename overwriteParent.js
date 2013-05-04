debugger;
var orginLocation = window.location;
window.parent = {};
window.parent.location = orginLocation;
window.parent.top = {};
window.parent.top.location = orginLocation;
