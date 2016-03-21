/**
 * @author Next Sphere Technologies
 * storage javascript.
 * 
 * Holds all javascript Objects that need to be stored and error handled which can be used across xiim application. 
 * 
 */

//Holds all javascript Objects that need to be stored and error handled.
window.model = {};

//Stores an object for later.
function registerModelObject(name, control) {
//    debug("registerModelObject:<name>:" + name + ":<control>:" + control);
    window.model[name] = control;
}

//  Gets the JavaScript object for the named Grid Control object.
function getModelObject(gridControlName) {
	var url = window.model[gridControlName];
	if(url == undefined){
	 url = $("#meta-serviceUrl").val();
	}
	return url;
   // return window.model[gridControlName];
}
