debugger;
var orginAddEvent = window.addEventListener;
window.addEventListener = function(){
    alert('addEvent');
    orginAddEvent.apply(this,arguments);
}

