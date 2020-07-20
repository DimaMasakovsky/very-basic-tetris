document.addEventListener('DOMContentLoaded', () => {

  const grid = document.querySelector('.grid');
  const minigrid = document.querySelector('.mini-grid');
  const scoreDisplay = document.querySelector('#score');
  const startBtn = document.querySelector('#start-button');

  const width = 10;
  let nextRandom = 0;
  let score = 0;
  let timerId;

  /*
    User greeting! 
  */
  const usernameSpan = document.querySelector('#username');
  const changeUsernameBtn = document.querySelector('#changeUsername'); 
  let username = ""; 

  function changeUsername() { 
    let username = prompt("Hi! What's your name?", "Stranger");
    localStorage.setItem("username", username); 
    usernameSpan.innerHTML = localStorage.getItem("username");  
  }

  if (!localStorage.getItem("username")) {
    changeUsername();  
  } else { 
    usernameSpan.innerHTML = localStorage.getItem("username");  
  }
   
  changeUsernameBtn.addEventListener('click', () => { 
    changeUsername();    
  });

 
 

  /**
   * Add subelements to element
   * @param {Element} parentElement Element to add children to
   * @param {Integer} count         Amount of child elements to add
   * @param {Element} childToClone  Child element to clone
   */
  function addChildrenClones(parentElement, count, childToClone) {
    for (i = 0; i < count; i++)
      parentElement.appendChild(childToClone.cloneNode(true));
  }

  gridElement = document.createElement("div");
  takenElement = document.createElement("div");
  takenElement.classList.add('taken');
  addChildrenClones(grid, 200, gridElement);
  addChildrenClones(grid, 10, takenElement);
  addChildrenClones(minigrid, 16, gridElement);

  const displaySquares = document.querySelectorAll('.mini-grid div')
  let squares = Array.from(document.querySelectorAll('.grid div'));

  const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]

  const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]

  const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]

  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];



  let currentRotation = 0;
  //new randomly select a tetromino 
  let currentPosition = 4; 
  let random = Math.floor(Math.random()*theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  // draw
  function draw() { 
    current.forEach(index => { 
      squares[currentPosition + index].classList.add('tetromino');
    })
  }
  //undraw 
  function undraw() { 
    current.forEach(index => { 
      squares[currentPosition + index].classList.remove('tetromino');
    })
  }

  //set controls 
  function control(e) { 
    switch (e.keyCode) { 
      case 37: 
        moveLeft(); 
        break;
      case 38: 
        rotateTetromino();
        break;
      case 39: 
        moveRight(); 
        break;
      case 40: 
        moveDown(); 
        break;
      default: 
        moveDown();
    }
  }
  document.addEventListener('keyup', control);
  //movedown 
  function moveDown() {
    undraw(); 
    currentPosition +=width;
    draw();
    freeze();
    displayShape();
  }

  //freeze 
  function freeze() { 
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) { 
      current.forEach(index => squares[currentPosition + index].classList.add('taken'));
       
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
    }
  }

  function moveLeft() { 
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
    if (!isAtLeftEdge) currentPosition -= 1;
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) currentPosition += 1;
    draw();  
  }
  function moveRight() { 
    undraw(); 
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === (width -1));
    if (!isAtRightEdge) currentPosition++;
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) currentPosition--; 
    draw();
  }

  //rotate 
  function rotateTetromino() { 
    undraw();
    currentRotation++;
    if (currentRotation === current.length) currentRotation = 0;
    current = theTetrominoes[random][currentRotation];
    draw();
  }

  const displayWidth = 4;
  let displayIndex = 0;

  const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
    [0, 1, displayWidth, displayWidth+1], //oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
  ];

  function displayShape() { 
    displaySquares.forEach(square => {
      square.classList.remove('tetromino');
    })
    upNextTetrominoes[nextRandom].forEach(index =>{
      displaySquares[displayIndex + index].classList.add('tetromino');
    })
  }

  //button 
  startBtn.addEventListener('click', ()=> {
    if (timerId) {
      clearInterval(timerId); 
      timerId = null;
    } else { 
      draw();
      timerId = setInterval(moveDown, 1000);
      nextRandom = Math.floor(Math.random()*theTetrominoes.length);
      displayShape();
    }
  })
  function addScore() { 
    for (let i = 0; i <= 199; i+= width) { 
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

      if (row.every(index => squares[index].classList.contains('taken'))) { 
        score += 10;
        scoreDisplay.innerHTML = score; 
        row.forEach(index => { 
          squares[index].classList.remove('taken');
          squares[index].classList.remove('tetromino');
        })
        const squaresRemoved = squares.splice(i, width); 
        squares = squaresRemoved.concat(squares);
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }
  function gameOver() { 
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) { 
      scoreDisplay.innerHTML = 'end';
      clearInterval(timerId);
    }
  }




})