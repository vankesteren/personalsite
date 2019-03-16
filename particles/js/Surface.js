class Surface {
    constructor(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }
    fun(x) {
        return this.a * Math.pow(x[0], 2) + 
                this.b * Math.pow(x[1], 2) + 
                this.c * x[0] * x[1];
    }
    grad(x) {
        return [
            2 * this.a * x[0] + this.c * x[1],
            2 * this.b * x[1] + this.c * x[0]
        ];
    }
}
