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
let remainingEvents = 0;
let nextEventTimer = 0;
const EVENT_CONST = 10;
const TIMER_CONST = 30;


let generateRemainingEvents = () =>  Math.floor(Math.random()*EVENT_CONST)+1;
let generateNextEventTime = () => Math.floor(Math.random()*TIMER_CONST)+15;

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
    // Display GameState
    this.displayGameState();
    remainingEvents = generateRemainingEvents();
    nextEventTimer = generateNextEventTime();
    console.log(remainingEvents);
    window.requestAnimationFrame(draw);
  }
  
  frameDraw(){
    this.frame++;
  }
  
  displayGameState(){
    let gameStateBox = document.getElementById("state");
    switch(this.gameState){
      case 0:
        gameStateBox.innerHTML = "Pre-Game";
        break;
      case 1:
        gameStateBox.innerHTML = "Early-Game";
        break;
      case 2:
        gameStateBox.innerHTML = "Mid-Game";
        break;
      case 3:
        gameStateBox.innerHTML = "Late-Game";
        break;
      case 4:
        gameStateBox.innerHTML = "Post-Game";
        break;
    }
  }
  showEvent(){
    program.timerBool=true;
    console.log(`Events: ${remainingEvents}`);
    // Fetch Random Event
    let randomEvent = {};
    randomEvent = this.selectRandomEvent();

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
      if(remainingEvents === 0){
        this.gameState++;
        remainingEvents = generateRemainingEvents();
        this.displayGameState();
      }
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
              fail_modifiers: [0,1,0,0,0,0],
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
        return {
          question: "The Dragon has spawned. You do not have vision on the dragon and the enemy jungler is nowhere to be seen. Do you wish to take it?",
          choices: [
            {
              text: "Take The Dragon",
              risk: 5,
              important_stat: 2,
              success_modifiers: [50,-2,4,0,0,0],
              success_text: "You were able to take the dragon, granting you a buff for your entire party. Success!",
              fail_modifiers: [300,2,-2,1,1,0],
              fail_text: "The enemy team was apparently there. Even though your skills were good and you killed an enemy, you die and they take the dragon."
            },
            {
              text: "Leave the Dragon alone",
              risk: 4,
              important_stat: 2,
              success_modifiers: [0,0,0,0,0,0],
              success_text: "You decide to leave the dragon alone",
              fail_modifiers: [0,1,0,0,0,0],
              fail_text: "The enemy decided to take advantage of your lack of objective taking, and they took it. Whatever."
            },
            {
              text: "Ward the Dragon Pit.",
              risk: 5,
              important_stat: 2,
              success_modifiers: [-75,0,1,0,0,0],
              success_text: "You are able to place a nice delicate pink ward in the enemy pit, feeling successfully happy for doing so!",
              fail_modifiers: [0,4,0,0,1,0],
              fail_text: "As you go to ward the Dragon pit, you get ambused by the enemy team and you die a quick death. Tilting you considerably"
            }
          ]
        };
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
  
  // Counter Management
  if(program.frame % 30 === 0){
    second++;
    nextEventTimer--;
    
  }
  
  // Display Event and Text
  if(nextEventTimer == 0){
    program.timerBool=true;
    nextEventTimer = generateNextEventTime();
    console.log("Timer: ", nextEventTimer);
    remainingEvents--;
    program.showEvent();
  }
  timerBox.innerHTML = second;
  
  if(!program.timerBool)
    window.requestAnimationFrame(draw);
}