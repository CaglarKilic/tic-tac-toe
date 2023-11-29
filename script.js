const board = (function () {
    const layout = [['-', '-', '-'], ['-', '-', '-'], ['-', '-', '-']];

    const to2D = index => [Math.trunc(index / 3), index % 3];

    const reset = () => layout.map(row => row.fill('-'));
    
    const checkDraw = () => !layout.flat().includes('-');

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
        }
    }

    return { place, checkWin, checkDraw, reset};
})();