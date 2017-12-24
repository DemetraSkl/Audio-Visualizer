function SoundWave(data) {

    this.data = data;
    this.dataNum = fftSize / 2;

    this.draw = function() { 

        context.fillStyle = 'black';
        context.fillRect(0, canvas.height * 5 / 7, canvas.width, canvas.height * 2 / 7);

        context.strokeStyle = "#67e822";

        context.lineWidth = 5;
        context.beginPath();

        var x = 0;
        var dx = canvas.width / this.dataNum;
        var i = 0;
        for (let n of this.data) {
            i++;
            var y = n + 5 + canvas.height * 5 / 7;

            if (i === 0) {
                context.moveTo(x, y);
            } else {
                context.lineTo(x, y); // y * 5 / 6 + 200
            }
            x += dx;
        }

        context.stroke();

    }

}