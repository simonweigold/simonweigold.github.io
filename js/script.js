


// H1 ANIMATION

const phrases = [
  "simon weigold",
  "data geek",
  "backend developer",
  "nlp researcher"
];

const typingContainer = document.getElementById('typing-container');

let currentPhraseIndex = 0;
let currentCharIndex = 0;

function typeNextChar() {
  if (currentCharIndex < phrases[currentPhraseIndex].length) {
      typingContainer.textContent += phrases[currentPhraseIndex][currentCharIndex];
      currentCharIndex++;
      setTimeout(typeNextChar, 100); // Delay before the next character is typed
  } else {
      setTimeout(deleteCurrentPhrase, 1000); // Delay before starting to delete text
  }
}

function deleteCurrentPhrase() {
  if (typingContainer.textContent.length > 0) {
      typingContainer.textContent = typingContainer.textContent.substring(0, typingContainer.textContent.length - 1);
      setTimeout(deleteCurrentPhrase, 50); // Delay before the next character is deleted
  } else {
      currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
      currentCharIndex = 0;
      setTimeout(typeNextChar, 500); // Delay before typing the next phrase
  }
}

setTimeout(typeNextChar, 500); // Initial delay before typing starts


// TERMINAL ANIMATION

var TerminalEmulator = {
  init: function(screen) {
    var inst = Object.create(this);
    inst.screen = screen;
    inst.createInput();
    
    return inst;
  },

  createInput: function() {
    var inputField = document.createElement('div');
    var inputWrap = document.createElement('div');
    
    inputField.className = 'terminal_emulator__field';
    inputField.innerHTML = '';
    inputWrap.appendChild(inputField);
    this.screen.appendChild(inputWrap);
    this.field = inputField;
    this.fieldwrap = inputWrap;
  },


  enterInput: function(input) {
    return new Promise( (resolve, reject) => {
    var randomSpeed = (max, min) => { 
      return Math.random() * (max - min) + min; 
    }
      
    var speed = randomSpeed(70, 90);
    var i = 0;
    var str = '';
    var type = () => {
      
      str = str + input[i];
      this.field.innerHTML = str.replace(/ /g, '&nbsp;');
      i++;
      
      setTimeout( () => {
        if( i < input.length){
          if( i % 5 === 0) speed = randomSpeed(80, 120);
          type();
        }else {
          console.log('tick');
          setTimeout( () => {
            console.log('tock');
            resolve();
          }, 400);
          
        } 
      }, speed);
      
      
    };
    
    
    type();
      
    });
  },
  
  enterCommand: function() {
    return new Promise( (resolve, reject ) => {
      var resp = document.createElement('div');
      resp.className = 'terminal_emulator__command';
      resp.innerHTML = this.field.innerHTML;
      this.screen.insertBefore( resp, this.fieldwrap);
      
      this.field.innerHTML = '';
      resolve();
    })
  },

  enterResponse: function(response) {
    
    return new Promise( (resolve, reject ) => {
      var resp = document.createElement('div');
      resp.className = 'terminal_emulator__response';
      resp.innerHTML = response;
      this.screen.insertBefore( resp, this.fieldwrap);
      
      resolve();
    })
  
    
  },
  
  wait : function( time, busy ) {
    busy = (busy === undefined ) ? true : busy;
    return new Promise( (resolve, reject) => {
       if (busy){
         this.field.classList.add('waiting');
       } else {
         this.field.classList.remove('waiting');
       }
       setTimeout( () => {
          resolve();
      }, time);
    });
  },
  
  reset : function() {
    return new Promise( (resolve, reject) => {
      this.field.classList.remove('waiting');
      resolve();
    });
  }

};


/*
 * 
 * This is where the magic happens
 *
 */ 

document.addEventListener('DOMContentLoaded', function() {
  var TerminalEmulator = {
    init: function(screen) {
      var inst = Object.create(this);
      inst.screen = screen;
      inst.createInput();
      return inst;
    },

    createInput: function() {
      var inputField = document.createElement('div');
      var inputWrap = document.createElement('div');
      inputField.className = 'terminal_emulator__field';
      inputField.innerHTML = '';
      inputWrap.appendChild(inputField);
      this.screen.appendChild(inputWrap);
      this.field = inputField;
      this.fieldwrap = inputWrap;
    },

    enterInput: function(input) {
      return new Promise((resolve, reject) => {
        var randomSpeed = (max, min) => {
          return Math.random() * (max - min) + min;
        };

        var speed = randomSpeed(70, 90);
        var i = 0;
        var str = '';
        var type = () => {
          str = str + input[i];
          this.field.innerHTML = str.replace(/ /g, '&nbsp;');
          i++;

          setTimeout(() => {
            if (i < input.length) {
              if (i % 5 === 0) speed = randomSpeed(80, 120);
              type();
            } else {
              setTimeout(() => {
                resolve();
              }, 400);
            }
          }, speed);
        };
        type();
      });
    },

    enterCommand: function() {
      return new Promise((resolve, reject) => {
        var resp = document.createElement('div');
        resp.className = 'terminal_emulator__command';
        resp.innerHTML = this.field.innerHTML;
        this.screen.insertBefore(resp, this.fieldwrap);
        this.field.innerHTML = '';
        resolve();
      });
    },

    enterResponse: function(response) {
      return new Promise((resolve, reject) => {
        var resp = document.createElement('div');
        resp.className = 'terminal_emulator__response';
        resp.innerHTML = response;
        this.screen.insertBefore(resp, this.fieldwrap);
        resolve();
      });
    },

    wait: function(time, busy) {
      return new Promise((resolve, reject) => {
        this.field.classList.toggle('waiting', busy);
        setTimeout(() => {
          resolve();
        }, time);
      });
    },

    reset: function() {
      return new Promise((resolve, reject) => {
        this.field.classList.remove('waiting');
        resolve();
      });
    }
  };

  var TE = TerminalEmulator.init(document.getElementById('screen'));
  TE.wait(1000, false)
    .then(TE.enterInput.bind(TE, 'pip install simon'))
    .then(TE.enterCommand.bind(TE))
    .then(TE.enterResponse.bind(TE, 'Locating nearest Mate source...'))
    .then(TE.wait.bind(TE, 1500))
    .then(TE.enterResponse.bind(TE, 'Attempting to run Python in the cloud...'))
    .then(TE.wait.bind(TE, 1200))
    .then(TE.enterResponse.bind(TE, 'Error: wrong venv selected. Typical!'))
    .then(TE.wait.bind(TE, 800))
    .then(TE.enterResponse.bind(TE, 'Applying machine learning to find the ultimate question of life, the universe, and everything...'))
    .then(TE.wait.bind(TE, 1800))
    .then(TE.enterResponse.bind(TE, 'Prediction complete: 42. What was the question again?'))
    .then(TE.wait.bind(TE, 1200))
    //.then(TE.enterResponse.bind(TE, 'Synchronizing behavioral data with personal thought tracker...'))
    //.then(TE.wait.bind(TE, 900))
    .then(TE.enterResponse.bind(TE, 'Arthur Dent mode activated: Where is my towel?'))
    .then(TE.wait.bind(TE, 1500))
    .then(TE.enterResponse.bind(TE, 'Data Architect and Researcher at your service.'))
    .then(TE.reset.bind(TE));
});
