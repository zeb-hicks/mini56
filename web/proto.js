window.addEventListener('load', init);

var cvs = document.createElement('canvas');
var buffer = document.createElement('canvas');
var cg = cvs.getContext('2d');
var g = buffer.getContext('2d');
var lt = performance.now(); // Last loop time.

var sjs = createjs.Sound;

var map = [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
           1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
           1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
           1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
           1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
           1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
           1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
           1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1,
           1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
           1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1,
           1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
           1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1,
           1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 1,
           1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 1,
           1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
           1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
var mapwidth = 32;
var mapheight = 16;
var tilesize = 32;

var keys = [];
var pkeys = [];

var frametimes = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

var spawnpoint = [
    {x: tilesize * 2, y: tilesize * (mapheight - 3), w: tilesize * 2, h: tilesize * 2},
    {x: tilesize * (mapwidth - 2), y: tilesize * (mapheight - 3), w: tilesize * 2, h: tilesize * 2}
];

var gametime = 0;

var speed = 1;
var tspeed = 1;

var players = [];
function Player() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;

    this.team = 0; // Team 0 is blue, team 1 is red.
    this.alive = 1; // Alive
    this.impaled = 0;

    this.state = 0; // State 0 is still. 1 is moving, 2 is jumping, 3 is moving and jumping, 4 is falling, 5 is moving and falling, 6 is popping
    this.onground = true;

    this.jump = false; // Jump is being pressed.
    this.move = false; // Move is being pressed.

    this.squish = 0; // Squish amount.
    this.wobble = 0; // Wobble amount.
    this.jumpstretch = 0; // Stretch from jumping.

    this.input = {
        jump: false,
        move: false
    };

    this.ai = true;

    this.nextBlink = 0;
    this.nextJump = Math.random() * 4;
    this.willJump = false;
    this.holdingJump = false;
}
Player.prototype = {
    update: function(dt) {
        var i, p, pi, px, py, mx, my, ldist, rdist, tdist, bdist, msc, msv, msi, col, splash;

        if (this.ai) {

            if ((this.nextJump -= dt) < 0) {
                this.nextJump += Math.random() * 4 + 1;
                this.vy -= 900;
                this.jumpstretch = 1;
            }

        }

        // this.vy += dt * (this.holdingJump ? 2400 : 5200);
        if (!this.impaled) this.vy += dt * 2400;

        this.vx = Math.max(Math.min(this.vx, 200), -200);
        this.vy = Math.max(Math.min(this.vy, 1200), -1200);

        msc = Math.ceil(Math.max(Math.abs(this.vx * dt) / 8, Math.abs(this.vy * dt) / 5));
        msc = Math.max(msc, 1);
        msi = 0;
        if (msc > 1) {
            msv = 1 / msc;
        } else {
            msv = 1;
        }
        // console.log(msc);
        this.onground = false;

        while (msi++ < msc) {

            if (this.impaled > 0) {
                this.vy += (this.vy * 0.5 - this.vy) * dt * 60;
                this.y += this.vy * dt * msv;
                // console.log(this.vy, this.y);
                if ((this.impaled -= dt) <= 0) {
                    this.impaled = 0;
                    this.die();
                }
                for (pi = 0; pi < 2; pi++) {
                    p = new Particle();
                    p.color = this.team === 0 ? '#06c' : '#c00';
                    p.x = this.x;
                    p.y = this.y;
                    p.vx = Math.random() * 400 - 200;
                    p.vy = Math.random() * 250 - 200;
                    particles.push(p);
                }
                return;
            }

            this.x += this.vx * dt * msv;
            this.y += this.vy * dt * msv;

            px = worldxat(this.x);
            py = worldyat(this.y);

            for (my = -1; my <= 1; my++) {
                for (mx = -1; mx <= 1; mx++) {
                    switch (map[px + mx + (py + my) * mapwidth]) {
                        case 1:
                            var pv = this.vy;
                            col = collidePlayerWith(this, (px + mx) * tilesize, (py + my) * tilesize, tilesize, tilesize);
                            if (Math.abs(pv - this.vy) > 100) splash = true;
                            if (col !== false && col[1] > 0) {
                                this.onground = true;
                            }
                            break;
                        case 4:
                            var pvy = this.vy;
                            col = collidePlayerWith(this, (px + mx) * tilesize, (py + my) * tilesize + 8, tilesize, tilesize - 8);
                            if (!!col) {
                                this.vy = pvy;
                                this.impale();
                            }
                            break;
                    }
                }
            }

            if (splash) {
                this.wobble = 1;
                for (pi = 0; pi < 10; pi++) {
                    p = new Particle();
                    p.color = this.team === 0 ? '#06c' : '#c00';
                    p.x = this.x;
                    p.y = this.y;
                    p.vx = Math.random() * 400 - 200;
                    p.vy = Math.random() * 250 - 200;
                    particles.push(p);
                }
                sjs.play('splat' + Math.floor(Math.random() * 5.99)).volume = 0.2;
            }

            for (i = 0; i < players.length; i++) {
                if (players[i] !== this) {
                    col = collidePlayerWith(this, players[i]);
                    if (col !== false && col[1] > 0) {
                        if (this.team === players[i].team) {
                            // Same team. Now able to jump.
                            // console.log('On the head!');
                            this.onground = true;
                        } else {
                            // Opposite team. Jumped on their head.
                            players[i].squish = 1;
                            players[i].die();
                            this.vy = -900;
                            sjs.play('drip' + Math.floor(Math.random() * 5.99)).volume = 0.6;
                        }
                    }
                }
            }

            if (this.onground) {
                if (this.willJump) {
                    this.vy = -900;
                    this.jumpstretch = 1;
                    this.willJump = false;
                }
            }

        }

        this.wobble = Math.max(this.wobble - dt, 0);
        this.squish = Math.max(this.squish - dt, 0);
        this.jumpstretch = Math.max(this.jumpstretch - dt * 10, 0);
    },
    die: function() {
        var p;
        for (var i = 0; i < 80; i++) {
            p = new Particle();
            p.color = this.team === 0 ? '#06c' : '#c00';
            p.x = this.x;
            p.y = this.y;
            p.vx = Math.random() * 600 - 300;
            p.vy = Math.random() * 350 - 400;
            particles.push(p);
        }

        this.x = spawnpoint[this.team].x;
        this.y = spawnpoint[this.team].y;
        this.vx = 0;
        this.vy = 0;
        this.squish = 1;
    },
    impale: function() {
        // this.
        this.impaled = 1;
        // this.die();
    }
};

var particles = [];
function Particle() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;

    this.drag = 0.99;
    this.mass = 0;

    this.life = 5 + Math.random() * 3;
    this.maxlife = 8;

    this.color = '#fff';

    this.r = Math.random() * 1 + 1;
}
Particle.prototype = {
    update: function(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        this.vx *= this.drag;
        this.vy *= this.drag;

        this.vy += dt * 1200;

        var tx = 0, ty = 0, col, mx, my;
        for (ty = -1; ty <= 1; ty++) {
            for (tx = -1; tx <= 1; tx++) {
                mx = Math.floor(this.x / tilesize) + ty;
                my = Math.floor(this.y / tilesize) + tx;
                switch (map[mx + my * mapwidth]) {
                    case 1:
                        col = boxvsbox(this.x - this.r, this.y - this.r, this.r * 2, this.r * 2, mx * tilesize + tilesize / 2, my * tilesize + tilesize / 2, tilesize, tilesize);
                        if (col !== false) {
                            if (Math.abs(this.vx) + Math.abs(this.vy) > 200) {
                                sjs.play('drip' + Math.floor(Math.random() * 5.99)).volume = 0.05;
                            }
                            this.vx = 0;
                            if (!boxvsbox(this.x - this.r, this.y - this.r + 10, this.r * 2, this.r * 2, mx * tilesize + tilesize / 2, my * tilesize + tilesize / 2, tilesize, tilesize)) {
                                this.vy = 2;
                            } else if (!boxvsbox(this.x - this.r + 3, this.y - this.r + 3, this.r * 2, this.r * 2, mx * tilesize + tilesize / 2, my * tilesize + tilesize / 2, tilesize, tilesize) ||
                                       !boxvsbox(this.x - this.r - 3, this.y - this.r + 3, this.r * 2, this.r * 2, mx * tilesize + tilesize / 2, my * tilesize + tilesize / 2, tilesize, tilesize)) {
                                this.vy = 1;
                            } else {
                                this.vy = 1;
                            }
                        }
                        break;
                    case 4:
                        col = boxvsbox(this.x - this.r, this.y - this.r, this.r * 2, this.r * 2, mx * tilesize + tilesize / 2, my * tilesize + tilesize / 2, tilesize, tilesize);
                        if (col !== false) {
                            if ((((this.x % tilesize) / tilesize) * 4 + ((this.y % tilesize) / tilesize) / 2) % 1 < ((this.y % tilesize) / tilesize)) {
                                if (this.vx > 5) {
                                    if ((this.vx -= dt * 1300) < 5) this.vx = 5;
                                } else if (this.vx < 0) {
                                    if ((this.vx += dt * 1300) > 5) this.vx = 5;
                                }
                                if (this.vy > 5) {
                                    if ((this.vy -= dt * 1300) < 5) this.vy = 5;
                                } else if (this.vy < 0) {
                                    if ((this.vy += dt * 1300) > 5) this.vy = 5;
                                }
                                // this.color = '#ff0';
                            }
                        }
                        break;
                }
            }
        }

        this.life -= dt;
    },
    draw: function(dt) {
        g.globalAlpha = Math.max(this.life, 0.01) / this.maxlife;
        g.fillStyle = this.color;
        g.fillRect(this.x - this.r, this.y - this.r, this.r * 2, this.r * 2);
        g.globalAlpha = 1;
        // if (this.vx > 50 || this.vy > 50) {
        //     g.globalAlpha = 0.5;
        //     g.fillRect(this.x - this.r - this.vx * 0.02, this.y - this.r - this.vy * 0.02, this.r * 2, this.r * 2);
        //     g.globalAlpha = 0.2;
        //     g.fillRect(this.x - this.r - this.vx * 0.04, this.y - this.r - this.vy * 0.04, this.r * 2, this.r * 2);
        //     g.globalAlpha = 1;
        // }
    }
};

function init() {
    cvs.width = buffer.width = tilesize * mapwidth;
    cvs.height = buffer.height = tilesize * mapheight;
    document.body.appendChild(cvs);

    window.addEventListener('keydown', function(e) { keys[e.keyCode] = true; });
    window.addEventListener('keyup', function(e) { keys[e.keyCode] = false; });

    var i, j;
    for (i = 0; i < 8; i++) {
        players.push(new Player());

        while(map[j] !== 1 || map[j-32] !== 0) {
            j = Math.floor(Math.random() * mapwidth * (mapheight - 1)) + mapwidth;
        }
        players[i].x = tilesize * (j % mapwidth) + tilesize / 2;
        players[i].y = tilesize * Math.floor(j / mapwidth) - 5;
        j = 0;
        if (players[i].x > tilesize * mapwidth / 2) players[i].team = 1;
    }
    players[0].ai = false;

    sjs.registerSound('./sfx/drip0.ogg', 'drip0');
    sjs.registerSound('./sfx/drip1.ogg', 'drip1');
    sjs.registerSound('./sfx/drip2.ogg', 'drip2');
    sjs.registerSound('./sfx/drip3.ogg', 'drip3');
    sjs.registerSound('./sfx/drip4.ogg', 'drip4');
    sjs.registerSound('./sfx/drip5.ogg', 'drip5');

    sjs.registerSound('./sfx/splat0.ogg', 'splat0');
    sjs.registerSound('./sfx/splat1.ogg', 'splat1');
    sjs.registerSound('./sfx/splat2.ogg', 'splat2');
    sjs.registerSound('./sfx/splat3.ogg', 'splat3');
    sjs.registerSound('./sfx/splat4.ogg', 'splat4');
    sjs.registerSound('./sfx/splat5.ogg', 'splat5');

    requestAnimationFrame(loop);
}

function loop() {
    // if (keys[32]) {
    //     requestAnimationFrame(loop);
    //     return;
    // }
    var dt = performance.now() - lt;
    lt += dt;
    dt = Math.min(dt, 64);
    dt /= 1000;
    if (keys[32]) {
        tspeed = 0.1
    } else {
        tspeed = 1;
    }
    requestAnimationFrame(loop);

    speed = speed += (tspeed - speed) * dt * 10;

    gametime += dt * speed * 1000;

    g.clearRect(0, 0, cvs.width, cvs.height);

    // var sdt = dt;
    // while (sdt > 0.01) {
    //     sdt -= 0.01;
    //     subloop(0.01);
    // }
    // subloop(sdt);
    subloop(dt * speed);
    draw(dt * speed);
}

function subloop(dt) {
    updateInput(dt);
    updatePlayers(dt);
    updateParticles(dt);
}

function updatePlayers(dt) {
    var i;
    for (i = 0; i < players.length; i++) {
        players[i].update(dt);
    }
}

function collidePlayerWith(player, x, y, w, h) {
    var px = player.x;
    var py = player.y;
    var prx = 8;
    var pry = 5;

    var brx;
    var bry;
    var bx;
    var by;

    if (x instanceof Player) {
        bx = x.x;
        by = x.y;
        brx = 8;
        bry = 5;
    } else {
        brx = w / 2;
        bry = h / 2;
        bx = x + brx;
        by = y + bry;
    }

    if (Math.abs(px - bx) < prx + brx) {
        if (Math.abs(py - by) < pry + bry) {
            // We're overlapping. Let's find the shortest displacement axis.
            var sx = s1d(px-prx,px+prx,bx-brx,bx+brx);
            var sy = s1d(py-pry,py+pry,by-bry,by+bry);
            if (Math.abs(sx) < Math.abs(sy)) {
                // Shorter X separation
                player.x -= sx;
                if (Math.abs(sx) > 0.1) {
                    player.vx = 0;
                    // if (Math.abs(sx) > 1) {
                    //     player.vy *= 0.2;
                    // }
                }
                sy = 0;
            } else {
                // Shorter Y separation
                player.y -= sy;
                if (Math.abs(sy) > 0.1) {
                    player.vy = 0;
                    if (Math.abs(sy) > 1) {
                        player.vx *= 0.2;
                    }
                }
                sx = 0;
            }
            return [sx,sy];
        }
    }
    return false;
}

function s1d(a, b, c, d) {
    if (a > d || b < c) return Number.MAX_VALUE; // Not touching.

    if ((b > d && a < c) || (b < d && a > c)) { // CD inside AB or AB inside CD
        if ((b-a)/2+a>=(d-c)/2+c) { // AB is right of CD
            return a-d;
        } else { // AB is right of CD
            return b-c;
        }
    }

    if (b >= d) {
        return a-d;
    } else {
        return b-c;
    }
}

function worldxat(x) {
    return Math.floor(x / tilesize);
}

function worldyat(y) {
    return Math.floor(y / tilesize);
}

function boxvsbox(ax, ay, aw, ah, bx, by, bw, bh) {
    var dx = Math.abs(ax - bx);
    var dy = Math.abs(ay - by);

    if (dx * 2 < aw + bw) {
        if (dy * 2 < ah + bh) {
            return [(aw + bw) / 2 + (ax - bx), (ah + bh) / 2 + (ay - by)];
        }
    }

    return false;
}

function updateParticles(dt) {
    var i;
    if (particles.length > 2000) {
        particles.splice(0, particles.length - 2000);
    }
    for (i = 0; i < particles.length; i++) {
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
            i--;
        } else {
            particles[i].update(dt);
        }
    }
}

function updateInput(dt) {
    var xd = 0;
    if (!pkeys[38]) {
        if (keys[38]) { // Just pressed jump.
            players[0].holdingJump = true;
            players[0].willJump = true;
        }
    }
    if (pkeys[38]) {
        if (!keys[38]) { // Let go of jump.
            players[0].holdingJump = false;
            players[0].willJump = false;
            if (players[0].vy < 0) {
                players[0].vy *= 0.4;
            }
        }
    }
    if (keys[39]) { // Right key
        // if (players[0].team !== 1) players[0].vx += 200;
        xd += (players[0].onground == true ? 3000 : 1000) * dt;
    }
    if (keys[37]) { // Left key
        // if (players[0].team !== 0) players[0].vx -= 200;
        xd -= (players[0].onground == true ? 3000 : 1000) * dt;
    }
    if (xd === 0) {
        if (players[0].vx > 3000 * dt) {
            // players[0].vx -= 3000 * dt;
            players[0].vx -= (players[0].onground == true ? 3000 : 1000) * dt;
        } else if (players[0].vx < -3000 * dt) {
            // players[0].vx += 3000 * dt;
            players[0].vx += (players[0].onground == true ? 3000 : 1000) * dt;
        } else {
            players[0].vx = 0;
        }
    } else {
        players[0].vx += xd;
    }

    for (var i = 0; i < keys.length; i++) {
        pkeys[i] = keys[i];
    }
}

function draw(dt) {
    var i;

    // g.clearRect(0, 0, cvs.width, cvs.height);

    drawLevel(dt);

    for (i = 0; i < players.length; i++) {
        drawPlayer(players[i], dt);
    }

    drawParticles(dt);

    // cg.fillStyle = 'rgba(0, 0, 0, ' + dt * 30 + ')';
    // cg.fillRect(0, 0, buffer.width, buffer.height);
    cg.globalCompositeOperation = 'copy';
    cg.drawImage(buffer, 0, 0);
}

function drawPlayer(p, dt) {
    var px = Math.round(p.x);
    var py = Math.round(p.y);

    var theta = gametime % 300 / 150 * Math.PI;

    g.fillStyle = p.team === 0 ? '#06c' : '#c00';
    g.fillRect(px - 8 - p.squish - Math.sin(theta) * p.wobble + p.jumpstretch * 6,
               py - 5 - Math.cos(theta) * p.wobble - p.jumpstretch * 12 + p.squish * 8,
               16 + p.squish * 2 + Math.sin(theta) * p.wobble * 2 - p.jumpstretch * 12,
               10 + Math.cos(theta) * p.wobble * 2 + p.jumpstretch * 12 - p.squish * 8);
    g.fillStyle = '#000';
    var i1, i2, i3;
    if (p.team === 0) {
        i1 = 2;
        i2 = 4;
    } else {
        i1 = 6;
        i2 = 0;
    }
    if (p.vy > 50) {
        i3 = 2;
    } else if (p.vy < -50) {
        i3 = -1;
    } else {
        i3 = 0;
    }
    if ((p.nextBlink -= dt) <= 0) {
        if (p.nextBlink < -0.12) {
            p.nextBlink += Math.random() * 3 + 0.2;
        }
        g.fillRect(px - i1, py + 1 + i3, 2, 1);
        g.fillRect(px + i2, py + 1 + i3, 2, 1);
    } else {
        g.fillRect(px - i1, py - 3 + i3, 2, 5);
        g.fillRect(px + i2, py - 3 + i3, 2, 5);
    }
}

function drawParticles(dt) {
    var i;
    for (i = 0; i < particles.length; i++) {
        particles[i].draw(dt);
    }
}

function drawLevel(dt) {
    var x, y, i;
    for (y = 0; y < mapheight; y++) {
        for (x = 0; x < mapwidth; x++) {
            var tid = x + y * mapwidth;
            if (map[x + y * mapwidth] == 1) {
                g.fillStyle = '#fff';
                if (x === 0 || map[tid - 1] !== 1) {
                    g.fillRect(x * tilesize, y * tilesize, 2, tilesize);
                }
                if (y === 0 || map[tid - mapwidth] !== 1) {
                    g.fillRect(x * tilesize, y * tilesize, tilesize, 2);
                }
                if (x === 31 || map[tid + 1] !== 1) {
                    g.fillRect(x * tilesize + (tilesize-2), y * tilesize, 2, tilesize);
                }
                if (y === 15 || map[tid + mapwidth] !== 1) {
                    g.fillRect(x * tilesize, y * tilesize + (tilesize-2), tilesize, 2);
                }
            }
            if (map[x + y * mapwidth] == 4) {
                g.fillStyle = '#fff';
                var x1 = x * tilesize;
                var x2 = x1 + tilesize;
                var y1 = y * tilesize;
                var y2 = y1 + tilesize;
                g.beginPath();
                g.moveTo(x1, y2);
                for (i = 0; i <= 8; i++) {
                    g.lineTo((i/8) * tilesize + x1, (i%2) * tilesize + y1);
                }
                g.lineTo(x2, y2);
                g.fill();
            }
        }
    }
}

function drawHUD(dt) {

}

var Physics = {

};
