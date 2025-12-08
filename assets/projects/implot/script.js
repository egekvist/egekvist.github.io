// Example interactive plot using Implot (replace with your actual code)

// For demonstration, we just create a simple interactive canvas
const container = document.getElementById("plot-container");

// Create canvas
const canvas = document.createElement("canvas");
canvas.width = container.offsetWidth;
canvas.height = 400;
canvas.style.border = "1px solid #ccc";
container.appendChild(canvas);

const ctx = canvas.getContext("2d");

// Draw simple interactive sine wave
let phase = 0;
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x++) {
        const y = 200 + 100 * Math.sin((x / 50) + phase);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.stroke();

    phase += 0.05;
    requestAnimationFrame(draw);
}
draw();
