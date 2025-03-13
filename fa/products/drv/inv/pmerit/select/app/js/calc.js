var Calc;
(function (Calc) {
    var SweepMethod = (function () {
        function SweepMethod(dimension, Xpoints, Ypoints) {
            this.dimension = dimension;
            this.Xpoints = Xpoints;
            this.Ypoints = Ypoints;
            this.matrix = Array();
            for (var i = 0; i < Xpoints.length; i++) {
                this.matrix[i] = Array();
            }
        }
        SweepMethod.prototype.InitMatrix = function (X, Y) {
            for (var i = 0; i <= this.dimension; i++) {
                for (var j = 0; j <= this.dimension; j++) {
                    this.matrix[i][j] = Math.pow(X[i], (this.dimension - j));
                }
                this.matrix[i][(this.dimension + 1)] = Y[i];
            }
        };
        SweepMethod.prototype.Sweep = function () {
            var coefficients = Array();
            this.InitMatrix(this.Xpoints, this.Ypoints);
            var i = 0;
            var j = 0;
            var k = 0;
            var matrix = this.matrix;
            for (i = 0; i <= this.dimension; i++) {
                var dRoot = matrix[i][i];
                matrix[i][i] = 1;
                for (j = (i + 1); j <= (this.dimension + 1); j++) {
                    matrix[i][j] = matrix[i][j] / dRoot;
                }
                for (k = (i + 1); k <= this.dimension; k++) {
                    var dFirst = matrix[k][i];
                    matrix[k][i] = 0;
                    for (j = (i + 1); j <= (this.dimension + 1); j++) {
                        matrix[k][j] = (dFirst * matrix[i][j]) - matrix[k][j];
                    }
                }
            }
            for (i = this.dimension; i >= 0; i--) {
                var dSum = 0;
                if ((i < this.dimension)) {
                    for (j = this.dimension; j >= (i + 1); j--) {
                        dSum = dSum + matrix[i][j] * coefficients[j];
                    }
                }
                coefficients[i] = (matrix[i][this.dimension + 1] - dSum) / matrix[i][i];
            }
            return coefficients;
        };
        SweepMethod.prototype.CulcPolynomialFunction = function (a, x) {
            var ret = 0;
            for (var i = 0; (i <= this.dimension); i++) {
                ret = ret + a[i] * Math.pow(x, (this.dimension - i));
            }
            return ret;
        };
        return SweepMethod;
    })();
    Calc.SweepMethod = SweepMethod;
    var LerpMethod = (function () {
        function LerpMethod(x, x1, x2, y1, y2) {
            this.x = x;
            this.x1 = x1;
            this.x2 = x2;
            this.y1 = y1;
            this.y2 = y2;
        }
        LerpMethod.prototype.Lerp = function () {
            var y;
            if (this.x1 == this.x2) {
                return this.y2;
            }
            y = this.y1 + ((this.y2 - this.y1) / (this.x2 - this.x1)) * (this.x - this.x1);
            return y;
        };
        return LerpMethod;
    })();
    Calc.LerpMethod = LerpMethod;
})(Calc || (Calc = {}));
//# sourceMappingURL=calc.js.map