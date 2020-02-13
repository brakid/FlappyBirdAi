class PipePair {
  constructor(x, y, height, context) {
    this.x = x;
    this.y = y;
    this.width = 30 / 2;
    this.size = 70 / 2;
    this.height = height;
    this.context = context;
  }

  next() {
    this.x -= 1;
  }

  getBoundaries() { // left, bottom, right, top
    return [this.x - this.width, this.y - this.size, this.x + this.width, this.y + this.size];
  }

  draw() {
    this.context.fillStyle = "lime";

    this.context.fillRect(this.x - this.width, 0, this.width * 2, this.height - (this.y + this.size));
    this.context.fillRect(this.x - this.width, this.height - (this.y - this.size), this.width * 2, this.height);
  }
}