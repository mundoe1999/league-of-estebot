/**
 * Todo:
 * 1. Modify all existing results in json with appropriate riskFactor modifier
 * 2. Convert file to typescript appropriate file for better reading and presentability
 * 3. Convert gameState to enum for better access.
 */

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

// Generate all questions
let pre_game = []
let early_game = []
let mid_game = []
let late_game = []
for(let i = 0; i < question_json.length; i++){
  let question = question_json[i];
  switch (question.phase) {
    case 0:
      pre_game.push(question);
      break;
    case 1:
      early_game.push(question);
      break;
    case 2:
      mid_game.push(question);
      break;
    case 3:
      late_game.push(question);
      break;  
    default:
      break;
  }
}

var displayBox = document.getElementById("pop-up");
var timerBox = document.getElementById("timer");
let second = 0;
let remainingEvents = 0;
let nextEventTimer = 0;
const EVENT_CONST = 4;
const TIMER_CONST = 30;



let generateRemainingEvents = () =>  Math.floor(Math.random()*EVENT_CONST)+1;

let generateNextEventTime = () => Math.floor(Math.random()*TIMER_CONST)+15;

// Main Object for manipulating Events
class Main {
  playerStats = {
    "hype": 0,
    "tilt": 0,
    "gold": 0,
    "kda": [0,0,0]
  }

  constructor(){
    this.frame = 0;
    this.timerBool = false;

    // gameState stores the index of which event to record
    //     0          1        2         3        4
    // [ PreGame, EarlyGame, MidGame, LateGame, PostGame]
    this.gameState = 0;
    
    /***
     * 0 -> Gold
     * 1 -> Tilt
     * 2 -> Hype
     * 3 -> Kills
     * 4 -> Deaths
     * 5 -> Assists
     */
    this.stats = [0,0,0,0,0,0]

    // Champions
    this.champion = {
      name: "",
      stat_modifiers: [1,1,1,1,1,1,0] // Last attribute is an incrementer for success percentages
    }
  }

  startProgram(){
    // Display GameState
    this.displayGameState();
    this.renderStats();
    //remainingEvents = generateRemainingEvents();
    remainingEvents = 1;
    nextEventTimer = 0;
    second = 0;
    this.stats[0] = 0;
    this.stats[3] = 0;
    this.stats[4] = 0;
    this.stats[5] = 0;
    this.frame = 0;
    //this.timerBool = false;
    //this.gameState = 4;

    //nextEventTimer = generateNextEventTime();
    window.requestAnimationFrame(draw);
  }
  
  frameDraw(){
    this.frame++;
    this.renderStats();
  }
  
  renderStats() {
    let stats = document.getElementById("stats");
    // Clear render
    stats.innerHTML = "";


    let head = document.createElement("tr")
    let stat = document.createElement("th");
    stat.innerHTML = "Stat";
    let value = document.createElement("th")
    value.innerHTML = "Value";

    // Append children to container
    stats.appendChild(head)
    head.appendChild(stat);
    head.appendChild(value);



    this.stats.forEach((stat,index) => {
      let container = document.createElement("tr");

      let specific_stat = "";
      switch (index) {
        case 0:
          specific_stat = "Gold: "
          break;
        case 1:
          specific_stat = "Tilt: "
          break;
        case 2:
          specific_stat = "Hype: "
          break;
        case 3:
          specific_stat = "Kills: "
          break;
        case 4:
          specific_stat = "Death: "
          break;
        case 5:
          specific_stat = "Assists: "
          break;

        default:
          break;
      }
  
      // Gets the specified stat
      let statName = document.createElement("td");
      statName.innerHTML = specific_stat;
      let statValue = document.createElement("td")
      statValue.innerHTML = stat;

      // Append children to container
      container.appendChild(statName);
      container.appendChild(statValue);

      // Append to main container
      stats.appendChild(container);
    });
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
      choiceHTML.className = "button-option"
      choiceHTML.innerHTML = choice.text;
      choiceHTML.addEventListener("click", (e)=>this.displayResult(choice))
      choices.appendChild(choiceHTML);
    });
    
    // Append all necessary children
    displayBox.appendChild(question);
    displayBox.appendChild(choices);
    displayBox.style.display = "block";


  }

  successRateCalculator = (riskFactor, hypeModifier, tiltModifier, goldStatus, gameState) => {
    // Rate can be calculated from the following determination
    // Using simple D20 roll rules
    // Hype is a positive modified
    // Tilt is a negative modifier
    // Gold is a positive/negative modifier that is influenced by the current game state
    
    let rollDice = 1+Math.floor(Math.random()*20)
    const gameStateInitializer = {
      "PreGame": 0,
      "EarlyGame": 0, 
      "MidGame": 3, 
      "LateGame": 7,
      "PostGame": 0}
    let gameStateModifier = goldStatus/1000 - (gameStateInitializer[gameState] || 0)
    
    return riskFactor <= (rollDice + hypeModifier - tiltModifier + gameStateModifier)
  }


  displayResult(choice) {
    // Calculate Success rate
    let success_rate = true;
    if(choice.important_stat <= 2){
      let success = (this.stats[2] - (this.stats[1]/2)+1)*Math.random(); // STUB Modify this Success Algorithm
      success_rate = (choice.risk <= 0 || ((choice.risk-1) <= success));
    }

    // Resetting the Pop-up Box
    displayBox.innerHTML= "";


    let text = document.createElement("P");
    
    // Modify stats and inserts text
    if(success_rate){
      choice.success_modifier.forEach((stat,i) => this.stats[i] += stat);
      text.innerHTML = choice.success_text;
    } else {
      choice.fail_modifiers.forEach((stat,i) => this.stats[i] += stat);
      text.innerHTML = choice.fail_text;
    }
    // Should generate HTML for the text, and allow the flow of time again
    let continueButton = document.createElement("button");
    continueButton.innerHTML = "Continue.";

    continueButton.addEventListener("click", (e) => {
      e.preventDefault();
      // Deletes content of Box
      displayBox.style.display= "none";
      displayBox.innerHTML = "";

      // Continue regularly Scheduled program
      if(remainingEvents === 0){
        this.gameState++;
        if(this.gameState === 0 || this.gameState === 3){
          remainingEvents = 1;
        } else {
          remainingEvents = generateRemainingEvents();
        }
        this.displayGameState();
      }
      this.timerBool = false;
      second++;
      // Render any necessary components

      window.requestAnimationFrame(draw);
    });

    // Append children
    displayBox.appendChild(text);
    displayBox.appendChild(continueButton);
    this.renderStats();

  }

  selectRandomEvent(){
    // Should fetch the question options
    let question = {}
    let index = -1;
    switch(this.gameState) {
      case 0:
        index = Math.floor(Math.random()*pre_game.length)
        question = pre_game[index]
        break;
      case 1:
        index = Math.floor(Math.random()*early_game.length)
        question = early_game[index]
        break;
      case 2:
        index = Math.floor(Math.random()*mid_game.length)
        question = mid_game[index]
        break;
      case 3:
        index = Math.floor(Math.random()*late_game.length)
        question = late_game[index]
        break;
      case 4:
        break;
      default:
        break;
    } 
    console.log(question);
    return question;
  }

  // Calculate victory
  victory(){
    let success = (Math.random()*100)
    displayBox.innerHTML= "";
    displayBox.style.display = "block";


    if(success > 50){
      timerBox.innerHTML = "You Win!"
      this.stats[1] -= 4;
      this.stats += 4;
    } else {
      timerBox.innerHTML = "You lose!"
      this.stats[1] += 4;
      this.stats -= 4;
    }

    let play_again = document.createElement("button");
    play_again.innerHTML = "Play Again";
    play_again.addEventListener("click", (e) => {
      // Deletes content of Box
      displayBox.style.display= "none";
      displayBox.innerHTML = "";


      // Render any necessary components
      this.startProgram()
      this.gameState = 0;
      this.displayGameState()

    });
    displayBox.appendChild(play_again);
  }
}

var program = new Main();

console.log(program)
program.startProgram();

// Transition changes should happen at randomly set intervals, should generate them whenever program runs


// Main Component for Rendering Elements
function draw(timestamp){
  program.frameDraw();
  
  // Counter Management
  if(program.frame % 10 === 0){
    second++;
    nextEventTimer--;
    program.stats[0] += Math.floor(Math.random()*27);
  }
  
  if(program.gameState === 4) {
    timerBox.innerHTML = "END";
    console.log(program.victory());
    return;
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