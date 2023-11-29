const board = (function () {
    const layout = [['-', '-', '-'], ['-', '-', '-'], ['-', '-', '-']];

    const to2D = index => [Math.trunc(index / 3), index % 3];

    const reset = () => layout.map(row => row.fill('-'));

    const print = () => console.log(layout.flat().join('').replace(/.{3}/g, '$&\n'));

    const checkDraw = () => !layout.flat().includes('-');

    // const emptyIndices = () => [...layout.flat().join('').matchAll(/-/g)].map(elem => elem['index']);

    function checkWin() {
        const reStraight = /xxx|ooo/;
        const reDiagonalLR = /x...x...x|o...o...o/;
        const reDiagonalRL = /..x.x.x..|..o.o.o../;

        //row and col
        for (let index = 0; index < layout.length; index++) {
            const hor = layout[index].join('').match(reStraight);
            const ver = layout.map((row) => row[index]).join('').match(reStraight);

            if (ver || hor) { return true; }
        }

        //diagonal
        const flat = layout.flat().join('');
        if (flat.match(reDiagonalLR) || flat.match(reDiagonalRL)) { return true; }

        return false;
    }

    function place(index, sign) {
        const [row, col] = to2D(index);
        if (layout[row][col] == '-') {
            layout[row][col] = sign;
            return true;
        }
        return false;
    }

    return { place, checkWin, checkDraw, reset, print };
})();

const game = (function () {
    let player = 'x';

    const changePlayer = () => player = player == 'x' ? 'o' : 'x';

    const reset = () => player = 'x';

    const getPlayer = () => player;

    function playTurn(index) {
        const valid = board.place(index, player);
        if (valid) {
            const win = board.checkWin();
            if (win) {
                return 1;
            }

            const draw = board.checkDraw();
            if (draw) {
                return 0;
            }

            changePlayer();
        }
        return -1;
    }

    return { playTurn, reset, getPlayer };

})();

(function () {
    const cells = document.querySelectorAll('table#gameboard td');
    const table = document.querySelector('table#gameboard');
    cells.forEach(cell => cell.addEventListener('click', write));

    function reset(event) {
        event.stopPropagation();
        cells.forEach(cell => cell.textContent = '');
        table.removeEventListener('click', reset, true);
        game.reset();
        board.reset();
    }

    function write(event) {
        event.stopPropagation();

        const index = this.dataset.index;
        
        this.textContent = this.textContent == '' ? game.getPlayer() : this.textContent;

        const end = game.playTurn(index);
        
        if (end != -1) {
            const score = document.getElementById(game.getPlayer());
            const draw = document.getElementById('draw');
            if (end) {
                score.textContent = parseInt(score.textContent) + 1;
            } else {
                draw.textContent = parseInt(draw.textContent) + 1;
            }

            table.addEventListener('click', reset, true);
        }
    }
})();