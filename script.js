document.addEventListener('DOMContentLoaded', function () {
    // create canvas
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    // append canvas to body
    document.body.appendChild(canvas);

    // setting canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var reset, size, number, fill;
    reset = document.querySelector('#Reset-Config');
    size = document.querySelector('#Size');
    number = document.querySelector('#Number');

    // constant
    const config = {
        _size: 3,
        _number: 20,
        _fill: 0.1
    }

    // color of spark
    const colorArray = [
        '#ffffff',
        '#ff0000',
        '#0000ff',
        '#33ff33',
        '#ff9900',
        '#cc0066',
        '#00ff00',
        '#3399ff',
    ];

    /* =============== AUDIO =============== */
    var audio = document.getElementById('audio');
    audio.play();
    /* ===================================== */

    // resize
    document.addEventListener('resize', function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // audio
    document.addEventListener('click', function () {
        audio.play();
    });

    size.addEventListener('change', function () {
        config._size = size.value;
    });
    number.addEventListener('change', function () {
        config._number = number.value;
    });

    reset.addEventListener('click', function () {
        config._size = 3;
        config._number = 20;

        size.value = 3;
        number.value = 20;
    })

    /* =============== FIREWORK =============== */

    // firework constructor
    function Firework() {
        this.radius = config._size;
        this.x = canvas.width / 2;
        this.y = canvas.height;
        this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
        this.velocity = {
            x: Math.random() * 6 - 3,
            y: Math.random() * 3 + 3
        }

        this.maxY = Math.random() * canvas.height / 4 + canvas.height / 10;
        this.life = false;
    }

    Firework.prototype.draw = function (context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    }

    Firework.prototype.maximumY = function () {
        if (this.y <= this.maxY) {
            this.life = true;
            for (var i = 0; i < 10; i++) {
                sparkArray.push(new Spark(this.x, this.y, this.radius, this.color));
            }
        }
        if (this.x <= 0 || this.x >= canvas.width) {    // phao ko ban qua man hinh, khi cham thi no ngay
            this.life = true;
            for (var i = 0; i < 10; i++) {
                sparkArray.push(new Spark(this.x, this.y, this.radius, this.color));
            }
        }
    }

    // thuc hien ban
    Firework.prototype.update = function (context) {
        this.y -= this.velocity.y;
        this.x += this.velocity.x;
        this.maximumY();
        this.draw(context);
    }

    /* ================ SPARK ================ */

    function Spark(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius / 2;
        this.color = color;
        this.velocity = {
            x: Math.random() * 3 - 1,
            y: Math.random() * 3 - 1
        }
        this.friction = 0.015;
        this.life = 150;
    }

    Spark.prototype.draw = function (context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    }

    Spark.prototype.update = function (context) {
        this.velocity.y -= this.friction;
        this.life--;
        this.y -= this.velocity.y;
        this.x += this.velocity.x;
        this.draw(context);
    }

    var fireworkArray = [];
    var sparkArray = [];

    // initialization
    function init() {
        // gioi han 20 qua phao hoa
        if (fireworkArray.length < config._number) {
            fireworkArray.push(new Firework);
        }
    }

    /* ================ MAIN FUNCTION ================ */

    function main() {
        window.requestAnimationFrame(main);  // cu moi giay goi lai ham main 60 lan
        context.fillStyle = `rgba(0, 0, 0, ${config._fill})`;   //de mau den do firework lam hu hinh nen
        context.fillRect(0, 0, canvas.width, canvas.height);

        fireworkArray.forEach(function (fw, index) {   // duyet va lay ra cac phan tu trong mang
            fw.update(context);
            if (fw.life === true) {
                fireworkArray.splice(index, 1);
            }
        });
        sparkArray.forEach(function (s, index) {
            if (s.life <= 0) {
                sparkArray.splice(index, 1);
            }
            s.update(context);
        });
        init();
    }

    main();
});

