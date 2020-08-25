document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid') // looks for class name
    const flagsLeft = document.querySelector('#flagsLeft')
    const result = document.querySelector('#result')

    let width = 10
    let bombAmount = 10
    let flags = 0
    let squares = []
    let isGameOver = false

    // create board
    function createBoard() {
        flagsLeft.innerHTML = bombAmount

        // get shuffled game array with random bombs
        const bombsArray = Array(bombAmount).fill('bomb')
        const emptyArray = Array(width*width - bombAmount).fill('valid')
        const gameArray = emptyArray.concat(bombsArray)
        const shuffledArray = gameArray.sort(() => Math.random() -0.5)

        // creates 100 squares within grid
        for(let i = 0; i < width*width; i++) {
            const square = document.createElement('div') // creates a square
            square.setAttribute('id', i)
            square.classList.add(shuffledArray[i])
            grid.appendChild(square)
            squares.push(square)

            // normal click
            square.addEventListener('click', function(e) {
                click(square)
            })

            // right click
            square.oncontextmenu = function(e) {
                e.preventDefault()
                addFlag(square)
            }
        }

        // add numbers
        for(let i = 0; i < squares.length; i++) {
            let total = 0

            const isLeftEdge = (i % width === 0)
            const isRightEdge = (i === width - 1)

            if (squares[i].classList.contains('valid')) {
                if(i > 0 && !isLeftEdge && squares [i - 1].classList.contains('bomb')) total++
                
                if(i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++

                if(i > 10 && squares[i - width].classList.contains('bomb')) total++

                if(i > 11 && !isLeftEdge && squares[i - 1  - width].classList.contains('bomb')) total++

                if(i < 98 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++

                if(i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++

                if(i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++

                if(i < 89 && squares[i + width].classList.contains('bomb')) total++

                squares[i].setAttribute('data', total)
                
            }
        }
    }
    createBoard()

    // add flag with right click
    function addFlag(square) {
        if(isGameOver) return
        if(!square.classList.contains('checked') && (flags < bombAmount)) {
            if(!square.classList.contains('flag')) {
                square.classList.add('flag')
                square.innerHTML = '🚩'
                flags++
                flagsLeft.innerHTML = bombAmount - flags
                checkForWin()
            } else {
                square.classList.remove('flag')
                square.innerHTML = ''
                flags--
                flagsLeft.innerHTML = bombAmount - flags
            }
        }
    }

    // click on square actions
    function click(square) {
        let currentId = square.id
        if(isGameOver) return
        if(square.classList.contains('checked') || square.classList.contains('flag')) return
        if(square.classList.contains('bomb')) {
            gameOver(square)            
        } else {
            let total = square.getAttribute('data')
            if(total != 0) {
                square.classList.add('checked') // checked when bombs around
                if(total == 1) {
                    square.classList.add('one')
                } else if(total == 2) {
                    square.classList.add('two')
                } else if(total == 3) {
                    square.classList.add('three')
                } else if(total == 4) {
                    square.classList.add('four')
                } else {
                    square.classList.add('five')
                }
                square.innerHTML = total // shows total of bombs around
                return
            }
            checkSquare(square, currentId)
        }
        square.classList.add('checked') // checked when no bombs around
    }

    // check neighbouring squares on square is clicked
    function checkSquare(square, currentId) {
        const isLeftEdge = (currentId % width === 0)
        const isRightEdge = (currentId % width === width - 1)

        setTimeout(() => {
            // empty squares with no numbers
            
            if(currentId > 0 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1].id
                const newSquare = document.getElementById(newId)
                click(newSquare) // gets checked again.  if it passes, it goes through loop again.  it it returns, loop stops
            }
            if(currentId > 9 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 - width].id
                const newSquare = document.getElementById(newId)
                click(newSquare) 
            }
            if(currentId > 10) {
                const newId = squares[parseInt(currentId - width)].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if(currentId > 11 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 - width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if(currentId < 98 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if(currentId < 90 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 + width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if(currentId < 88 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 + width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if(currentId < 89) {
                const newId = squares[parseInt(currentId) + width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
        }, 10)
    }

    // game over
    function gameOver(square) {
        result.innerHTML = 'Game over!'
        isGameOver = true
        
        // show all bomb locations
        squares.forEach(square => {
            if(square.classList.contains('bomb')) {
                square.innerHTML = '💣'
                square.classList.remove('bomb')
                square.classList.add('checked')
            }
        })
    }

    // check for win
    function checkForWin() {
        let matches = 0

        for(let i =0; i < squares.length; i++) {
            if(squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches++
            }
            if(matches === bombAmount) {
                result.innerHTML = 'You win!'
                isGameOver = true
            }
        }
    }

    // restart the game

    restartButton = document.getElementById("restartButton");
    restartButton.addEventListener("click", gameRestart);

    function gameRestart() {
        window.location = 'easy.html'
    }

    // modal js

    //get modal element
    var modal = document.getElementById('simpleModal');
    //get open modal button
    var infoBtn = document.getElementById('infoBtn');
    //get close button
    var closeBtn = document.getElementsByClassName('closeBtn')[0]; //getElementsByClassName creates an array hence choosing 0

    //listen for open click
    infoBtn.addEventListener('click', openModal);
    //listen for close click
    closeBtn.addEventListener('click', closeModal);
    //listen for outside click
    window.addEventListener('click', outsideClick);

    //function to open modal
    function openModal() {
        modal.style.display = 'block';
    }

    //function to close modal
    function closeModal() {
        modal.style.display = 'none';
    }

    //function to close modal if outside click
    function outsideClick(e) {
        if(e.target == modal) {
            modal.style.display = 'none';
        }
    }
})