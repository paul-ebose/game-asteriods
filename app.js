const cvs = document.getElementById('gameCanvas')
const ctx = cvs.getContext('2d')


function draw() {
  //
}

function update() {
  //
}

function loop() {
  update()
  draw()
  requestAnimationFrame(loop)
}

loop()
