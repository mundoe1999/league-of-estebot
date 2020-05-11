// Import Module of Event Games, should be JSON files

/**
 *  Event Structure || These events will be split off from each other in their own JSON file, so gameState is not necessary
 *  Question : String,
 *  
 *  
 *  Choices : 
 *    [
 *      Option: string
 *      risk: integer, // <-- 1 - 10, multiplier for calculating success probability
 *      important_stat: integer // <- Stat requirement to calculate success percentage
 *      success_Modifiers: [],
 *      success_text: String,
 *      fail_modifiers: [],
 *      fail_text: String
 *    ]
 *  
 */


// Fetch Important Elements from main page
var displayBox = document.getElementById("pop-up");
var timerBox = document.getElementById("timer");
let second = 0;

// Main Object for manipulating Events
class Main {
  constructor(){
    this.frame = 0;
    this.timerBool = false;

    // gameState stores the index of which event to record
    //     0          1        2         3        4
    // [ PreGame, EarlyGame, MidGame, LateGame, PostGame]
    this.gameState = 1;
    
    /***
     * 0 -> Gold
     * 1 -> Tilt
     * 2 -> Hype
     * 3 -> Kills
     * 4 -> Deaths
     * 5 -> Assists
     */
    this.stats = [0,0,1,0,0,0]
  }

  startProgram(){
    window.requestAnimationFrame(draw);
  }
  
  frameDraw(){
    this.frame++;
  }

  showEvent(){
    program.timerBool=true;

    // Fetch Random Event
    let randomEvent = {};
    randomEvent = this.selectRandomEvent();
    console.log(randomEvent);

    // Generating Display for the Event

    let question = document.createElement("P");
    question.innerHTML = randomEvent.question;

    let choices = document.createElement("div");

    // generate choice buttons HTML
    randomEvent.choices.forEach((choice, index)=>{
      let choiceHTML = document.createElement("button");
      choiceHTML.innerHTML = choice.text;
      choiceHTML.addEventListener("click", (e)=>this.displayResult(choice))
      choices.appendChild(choiceHTML);
    });
    
    // Append all necessary children
    displayBox.appendChild(question);
    displayBox.appendChild(choices);
    displayBox.style.display = "block";


  }

  displayResult(choice) {
    // Calculate Success rate
    let success_rate = true;
    if(choice.important_stat <= 2){
      let success = (this.stats[2] - (this.stats[1]/2)+1)*Math.random(); // STUB Modify this Success Algorithm
      console.log(this.stats[2] - this.stats[1]/2+1);
      success_rate = (choice.risk-1) <= success;
    }

    // Resetting the Pop-up Box
    displayBox.innerHTML= "";


    let text = document.createElement("P");
    
    // Modify stats and inserts text
    if(success_rate){
      choice.success_modifiers.forEach((stat,i) => this.stats[i] += stat);
      text.innerHTML = choice.success_text;
    } else {
      choice.fail_modifiers.forEach((stat,i) => this.stats[i] += stat);
      text.innerHTML = choice.fail_text;
    }
    // Should generate HTML for the text, and allow the flow of time again
    let continue_button = document.createElement("button");
    continue_button.innerHTML = "Continue.";
    continue_button.addEventListener("click", (e) => {
      // Deletes content of Box
      displayBox.style.display= "none";
      displayBox.innerHTML = "";

      // Continue regularly Scheduled program
      this.timerBool = false;
      second++;
      window.requestAnimationFrame(draw);
    });

    // Append children
    displayBox.appendChild(text);
    displayBox.appendChild(continue_button);

  }
  selectRandomEvent(){
    // Should fetch the question options
    switch(this.gameState) {
      case 0:
        break;
      case 1:
        return {
          question: "You are in the lane, you are doing pretty fine, the enemy's health is slow, do you want to kill?",
          choices: [
            {
              text: "Kill Laner",
              risk: 5,
              important_stat: 2,
              success_modifiers: [400,-1,1,1,0,0],
              success_text: "You successfully kill your laner, hyping you up, and giving you a nice amount of gold!",
              fail_modifiers: [0,0,0,0,0,0],
              fail_text: "You were unable to kill the laner, even though you tried"
            },
            {
              text: "Leave them alone.",
              risk: 0,
              important_stat: 2,
              success_modifiers: [0,0,0,0,0,0],
              success_text: "You let them live... For Now...",
              fail_modifiers: [0,2,0,0,1,0],
              fail_text: "You tried to walk away, but somehow he turns on you and kills you!"
            }
          ]
        };
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
      default:
        break;
    } 
  }


}

var program = new Main();

program.startProgram();

let timerStopped = false;

// Transition changes should happen at randomly set intervals, should generate them whenever program runs


// Main Component for Rendering Elements
function draw(timestamp){
  program.frameDraw();
  
  if(program.frame % 30 === 0){
    console.log(second);
    second++;
    
  }
  
  if(second % 10 === 9 ){
    console.log(second);
    program.timerBool=true;
    program.showEvent();
  }
  timerBox.innerHTML = second;
  
  if(!program.timerBool)
    window.requestAnimationFrame(draw);
}