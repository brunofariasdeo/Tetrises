document.addEventListener('DOMContentLoaded',() => {

    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const restartBtn = document.querySelector('#restart-button')
    const width=10
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = [
        'orange',
        'blue',
        'red',
        'green',
        'purple'
    ]
    let highestScore = 0
    const highScoreDisplay = document.querySelector('#highest-score')

    //The Tetrominoes
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

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    let currentPosition = 4
    let currentRotation = 0

    // Randomly select a Tetromino and its first rotation
    let random = Math.floor(Math.random()*theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation]

    // Draw the Tetromino
    function draw(){
        current.forEach(index => {
            squares[currentPosition+index].classList.add('tetromino')
            squares[currentPosition+index].style.backgroundColor = colors[random] 
        })
    }

    function undraw(){
        current.forEach(index => {
            squares[currentPosition+index].classList.remove('tetromino')
            squares[currentPosition+index].style.backgroundColor = ''
        })
    }

    function control(e){
        if(e.keyCode === 37){
            moveLeft()
        }
        else if (e.keyCode === 19){
            rotate()
        }
        else if (e.keyCode === 39){
            moveRight()
        }
        else if (e.keyCode === 40){
            moveDown()
        }
    }
    document.addEventListener('keyup', control)

    function moveDown(){
        undraw()
        currentPosition+= width
        draw()
        freeze()
    }

    //Freeze function
    function freeze(){
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
            current.forEach(index=>squares[currentPosition + index].classList.add('taken'))
            //Start a new tetromino falling
            
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

    //Move the tetromino left, unless is at the edge or there is a blockage
    function moveLeft(){
        undraw()
        const isAtLeftEdge = current.some(index=>(currentPosition+index) % width === 0)

        if(!isAtLeftEdge){
            currentPosition -=1
        }

        if(current.some(index=>squares[currentPosition + index].classList.contains('taken'))){
            currentPosition += 1
        }

        draw()
    }

    //Move the tetromino right, unless is at the edge or there is a blockage
    function moveRight(){
        undraw()
        const isAtRightEdge = current.some(index=>(currentPosition+index).toString().substr(-1) === '9')

        if(!isAtRightEdge){
            currentPosition +=1
        }

        if(current.some(index=>squares[currentPosition + index].classList.contains('taken'))){
            currentPosition -= 1
        }

        draw()
    }

    //Rotate the tetromino
    function rotate(){
        undraw()
        currentRotation++

        if (currentRotation === current.length){
            currentRotation = 0
        }

        current = theTetrominoes[random][currentRotation]
        draw()
    }

    //Show up next tetormino in mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 0
    

    //The Tetrominos without rotations
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1 , 2], //l
        [0, displayWidth, displayWidth+1, displayWidth*2+1], //z
        [1, displayWidth, displayWidth+1, displayWidth+2], //t
        [0, 1, displayWidth, displayWidth+1], //o
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //i
    ]

    //Display the shape in the mini-grid display
    function displayShape(){
        //Remove any trace of a tetromino from the entire grid
        displaySquares.forEach(square=>{
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })

        upNextTetrominoes[nextRandom].forEach( index =>{
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares [displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    //Add functionality to the start button
    startBtn.addEventListener('click', () =>{
        startGame()
    })

    //Add functionality to the restart button
    restartBtn.addEventListener('click', () =>{
        undraw()

        squares.forEach(index => {
            if (index.classList.contains('tetromino')){
                index.classList.remove('tetromino')
                index.style.removeProperty('background-color');
                index.removeAttribute("class")
                index.classList.add('grid-div')
            }        
        })

        checkHighestScore()
        
        // index.classList.remove('tetromino')
        // index.removeAttribute("class")
        console.log(index)
        // squares[currentPosition+index].style.backgroundColor = ''
        startGame()
        })
    
    function startGame(){
        if (timerId){
            clearInterval(timerId)
            timerId = null
        }
        else{
            draw()
            timerId = setInterval(moveDown, 200)
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            displayShape()
        }
    }

    //Add score
    function addScore(){
        for (let i=0; i<199; i+= width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if(row.every(index => squares[index].classList.contains('taken'))){
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })

                const squaresRemoved = squares.splice(i,width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    function gameOver(){
        if(current.some(index => squares[currentPosition+index].classList.contains('taken'))){
            checkHighestScore()
            scoreDisplay.innerHTML = '☠️'
            clearInterval(timerId)
        }
    }

    function checkHighestScore(){
        if (score >= highestScore){
            highestScore = score;
            highScoreDisplay.innerHTML = highestScore
            scoreDisplay.innerHTML = 0
        }
        else{
            scoreDisplay.innerHTML = 0
        }
    }

})