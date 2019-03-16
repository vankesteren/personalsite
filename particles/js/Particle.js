class Particle {
    constructor(pos, m, v, surface) {
        this.pos     = pos; // position
        this.m       = [ m, m ];   // mass
        this.v       = v;   // velocity (array of 2)
        this.surface = surface;
        
        // Create an svg circle element for this particle
        let ns = "http://www.w3.org/2000/svg"
        this.element = document.createElementNS(ns, "circle");
        this.element.setAttributeNS(null, "cx", this.pos[0]);
        this.element.setAttributeNS(null, "cy", -this.pos[1]);
        this.element.setAttributeNS(null, "r", "0.5%");
        this.element.setAttributeNS(null, "fill", "rgb(128, 128, 128)");
    }

    // ----------
    // Math stuff
    // ----------
    energy() { 
        return [0.5, 0.5].vecprod(this.m).vecprod(this.v.vecprod(this.v));
    }
    momentum() { 
        return this.m.vecprod(this.v);
    }
    update(t) {
        let step = this.surface.grad(this.pos).vecprod([-t, -t]);
        this.v   = this.v.vecprod(this.m).vecsum(step).vecdiv(this.m);
        this.pos = this.pos.vecsum(this.v);
        this.element.setAttributeNS(null, "cx", this.pos[0]);
        this.element.setAttributeNS(null, "cy", -this.pos[1]);
    };

}