function linear_regression(X, y) {
    var m = y.length;

    X = math.concat(math.ones(m, 1), X);
    y = math.matrix(y);

    var tr = math.transpose(X);
    var tr_X = math.multiply(tr, X);
    var tr_y = math.multiply(tr, y);
    var theta = math.multiply(math.inv(tr_X), tr_y);

    return function () {
        var args = Array.prototype.slice.call(arguments);
        return math.multiply(math.matrix(math.concat([1], args)), theta);
    }
}

function second_degree_regression(X, y, getTheta) {
    var m = y.length;
    var X_square = math.dotMultiply(X, X);
    X = math.concat(math.ones(m, 1), X, X_square);
    y = math.matrix(y);

    var tr = math.transpose(X);
    var tr_X = math.multiply(tr, X);
    var tr_y = math.multiply(tr, y);
    var theta = math.multiply(math.inv(tr_X), tr_y);
    if (getTheta == null || getTheta == 0 || getTheta == false) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            var args_square = math.dotMultiply(args, args);
            return math.multiply(math.matrix(math.concat([1], args, args_square)), theta);
        }
    }
    return theta._data;
}

function regression_test() {
    var X = [[0], [1], [2]];
    var y = [[2], [4], [8]];
    var f = second_degree_regression(X, y);
    console.log("f(1) = " + f(1));
    console.log("f(2) = " + f(2));
    console.log("f(3) = " + f(3));
    console.log("f(4) = " + f(4));
    console.log("f(5) = " + f(5));
    console.log("f(6) = " + f(6));
    console.log("f(9) = " + f(9));
    console.log("f([[1],[2],[3],[4]]) = " + f([[1], [2], [3], [4]]));
}