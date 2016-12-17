/*function  makeVisible(){
    var skillSet = document.getElementById("skillset");
    var goals = document.getElementById("goals");
    var my_journey = document.getElementById("my_journey");

    if(id == "skillset_button"){
       //.document.getElementsByClassName("all_about_me").style.visibility = "hidden";
        skillSet.id = "visible_about_me";
        goals.id = "invisible_about_me";
        myJourney.id = "invisible_about_me";

    }else if(id == "goals_button"){
        skillSet.id = "invisible_about_me";
        myJourney.id ="invisible_about_me";
        goals.id = "visible_about_me";
    }else if( id == "my_journey_button"){
        myJourney.id = "visible_about_me";
        skillSet.id = "invisible_about_me";
        goals.id = "invisible_about_me";
    }
}*/

if(navigator.userAgent.indexOf("Opera Mini")> -1){
   var body = document.getElementByTagName(body);
   body[0].style.backgroundImage = "none";
}
function makeVisible(id){

    var skillset = document.getElementById("skillset");
    var goals = document.getElementById("goals");
    var myJourney = document.getElementById("my_journey");

    if(id == "back_button"){
        skillset.style.visibility = "hidden";
        goals.style.visibility = "hidden";
        myJourney.style.visibility = "hidden"
    }
    if(id == "skillset_button"){
        skillset.style.visibility = "visible";
        skillset.style.zIndex = "1"
        goals.style.visibility = "hidden"
        myJourney.style.visibility = "hidden";
        goals.style.zIndex = "-1";
        myJourney.style.zindex = "-1";
    }else if(id == "goals_button"){
        skillset.style.visibility = "hidden";
        goals.style.visibility = "visible";
        myJourney.style.visibility = "hidden";

        skillset.style.zIndex = "-1";
        goals.style.zIndex = "1";
        myJourney.style.zindex = "-1";
    }else if(id == "my_journey_button"){
        skillset.style.visibility = "hidden";
        goals.style.visibility = "hidden";
        myJourney.style.visibility = "visible";
        
        skillset.style.zIndex = "-1";
        goals.style.zIndex = "-1";
        myJourney.style.zindex = "1";
    }

}