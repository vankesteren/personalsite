class Momentum {
    constructor(parent) {
        // The momentum object should be associated with a parent element
        if (typeof parent === "string") {
            this.parent = document.getElementById(parent);
        } else if (typeof parent === "object") {
            this.parent = parent;
        } 
        
        if (typeof this.parent != "object") {
            throw Error("Input parent id or DOM object.")
        }

        // Create an svg element to interact with
        let ns = "http://www.w3.org/2000/svg";
        let vb = "-5 -5 10 10";
        this.svg = document.createElementNS(ns, "svg");
        this.svg.setAttributeNS(null, "class", "mm-svg");
        this.svg.setAttribute("viewBox", vb);
        this.svg.setAttribute("xmlns", ns);
        this.parent.appendChild(this.svg);


        this.surface = new Surface(2, 2, 0.5);

        // animation stuff
        this.anispeed = 0.05;
        

    }

    // ---------------
    // Public methods
    // ---------------
    initParticles(n, prange = 0, vrange = 0, mrange = 0) {
        // Empty particles and DOM elements
        this.particles = [ ];
        while (this.svg.firstChild) {
            this.svg.removeChild(this.svg.firstChild);
        }

        // Generate particles
        for (var i = 0; i < n; i++) {
            let pos = [ ( Math.random() - 0.5 ) * prange, 
                        ( Math.random() - 0.5 ) * prange ];
            let vel = [ ( Math.random() - 0.5 ) * vrange * this.anispeed, 
                        ( Math.random() - 0.5 ) * vrange * this.anispeed];
            let m   = 1 + Math.random() * mrange;
            this.particles.push(new Particle(pos, m, vel, this.surface, this.origin))
        }

        // attach new DOM elements
        this.particles.map((p) => this.svg.appendChild(p.element));

    }

    start(fps = 60) {
        this.timer = setInterval( () => {
            this.particles.map((p) => p.update(1/fps*this.anispeed));
        }, 1000/fps);
    }

    stop() {
        clearInterval(this.timer);
    }
}

