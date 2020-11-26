document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  // Array.from crée un tableau à partir d'un objet ou d'un autre tableau
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')
  const width = 10
  let nextRandom = 0
  let timerId
  let score = 0
  const colors = [ // Sun Safe 3 Color Palette
    '#f3e1ad', // beige
    '#e75480', // bordeau
    '#7ef52d', // green
    '#f09f72', // orange
    '#45b4ec', // bleu
    '#f49ac1', // rose
    '#e1adf3' // violet
  ]
  // console.log(squares);

  // The Tetrominoes et leur rotation
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
  ]
  const lTetrominobis = [
    [0, 1, width + 1, width * 2 + 1],
    [width * 2, width, width + 1, width + 2],
    [1, width + 1, width * 2 + 1, width * 2 + 2],
    [2, width, width + 1, width + 2]
  ]

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
  ]

  const zTetrominobis = [
    [width, width + 1, width * 2 + 1, width * 2 + 2],
    [2, width + 2, width + 1, width * 2 + 1],
    [width, width + 1, width * 2 + 1, width * 2 + 2],
    [2, width + 2, width + 1, width * 2 + 1]
  ]

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ]

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ]

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ]

  const theTetrominoes = [lTetromino, lTetrominobis, zTetromino, zTetrominobis, tTetromino, oTetromino, iTetromino]

  let currentPosition = 4
  let currentRotation = 0

  // Sélectionnons au hasard  un tétromino et voyons sa rotation
  let random = Math.floor(Math.random() * theTetrominoes.length)
  // console.log(random)
  let current = theTetrominoes[random][currentRotation]
  // console.log(theTremoninoes);

  // Dessiner les tetrominos
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
      squares[currentPosition + index].style.backgroundColor = colors[random]
    })
  }
  // Effacer les tetromino
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
      squares[currentPosition + index].style.backgroundColor = ''
    })
  }
  // Déterminer la descente des tétrominos chaque second
  // timerId = setInterval(moveDown, 1000)

  // fonctions directionnelles
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft()
    } else if (e.keyCode === 38) {
      rotate()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if (e.keyCode === 40) {
      moveDown()
    }
  }
  document.addEventListener('keyup', control)

  // moveDown function
  function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()
  }

  // freeze function
  // La méthode some() teste si au moins un élément du tableau passe le test implémenté par la fonction fournie.
  function freeze() {
    // si un des tétrominos obtiens la class taken avec sa nouvelle position
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      // Débuter la descenete d'un nouveau tétromino
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }

  // Déplacer le tétromino à gauche s'il est près du bord ou s'il y  un blocage
  function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if (!isAtLeftEdge) currentPosition -= 1
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1
    }
    draw()
  }

  // Déplacer le tétromino à gauche s'il est près du bord ou s'il y  un blocage
  function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
    if (!isAtRightEdge) currentPosition += 1
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1
    }
    draw()
  }

  // rotate the tetromino
  function rotate() {
    undraw()
    currentRotation++
    if (currentRotation === current.length) { // if the current rotation gets to 4, make it go back to 0
      currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    draw()
  }

  // Montrer les prochain tétrominos
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  const displayIndex = 0

  // Les tétrominos n'auront pas de rotation dans la mini-grid
  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], // lTetromino
    [0, 1, displayWidth + 1, displayWidth * 2 + 1], // lTetrominobis
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // zTetromino
    [displayWidth, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 2 + 2], // zTetrominobis
    [1, displayWidth, displayWidth + 1, displayWidth + 2], // tTetromino
    [0, 1, displayWidth, displayWidth + 1], // oTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] // iTetromino
  ]

  // Faire disparaître la forme dans la mini-grid
  function displayShape() {
    // effacer les traces du tetromino
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
      square.style.backgroundColor = ''
    })
    upNextTetrominoes[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
  }

  // Bouton Start et Pause
  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 1000)
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      displayShape()
    }
  })

  // Compter le score
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]
      /* La méthode every() permet de tester si tous les éléments d'un tableau
      vérifient une condition donnée par une fonction en argument.
      Cette méthode renvoie un booléen pour le résultat du test. */
      if (row.every(index => squares[index].classList.contains('taken'))) {
        score += 10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
        // console.log(squaresRemoved);
      }
    }
  }

  // Game-over
  function gameOver() {
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'end'
      clearInterval(timerId)
    }
  }
})
