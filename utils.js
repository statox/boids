function squareIdToIJ(index) {
    return {
        i: index % SQUARES,
        j: Math.floor(index / SQUARES)
    };
}

const squareIJToIndex = (i, j) => {
    return i + SQUARES * j;
}

const squareIdToXY = (index) => {
    const {i, j} = squareIdToIJ(index);
    const square_w = width / SQUARES;
    const square_h = height / SQUARES;
    return {
        x: i * square_w,
        y: j * square_h
    }
}
