export default class Chart {
  constructor(selector) {
    this._selector = document.querySelector(selector);
    this._canvas = this._selector.querySelector('.page__canvas');
    this._ctx = this._canvas.getContext('2d');
  }

  renderChart(data) {
    const maxValue = Math.max(...data.map(slice => slice.value));
    const userScreen = window.innerWidth;
    const barWidth = userScreen < 500 ? 30 : 40;
    const gap = userScreen < 500 ? 12 : 20;
    const startX = 10;
    this._canvas.width = data.length * (barWidth + gap);
    this._canvas.height = userScreen < 500 ? 150 : 230;

    this.canvasWidth = this._canvas.width;
    this.canvasHeight = this._canvas.height;
    this.x = startX;

    data.forEach(slice => {
      const nameHeight = 17;
      const barHeight = (slice.value / maxValue) * (this.canvasHeight * 0.8 - startX);
      this._ctx.fillStyle = '#769e95';
      this._ctx.fillRect(this.x, (this.canvasHeight - barHeight - nameHeight), barWidth, barHeight);

      const textX = this.x + barWidth / 2 - startX;
      const textY = this.canvasHeight - nameHeight + nameHeight;
      this._ctx.fillStyle = '#747474';
      this._ctx.font = `11px 'Noto Sans Display'`;

      //text: dates
      this._ctx.fillText(slice.date, textX, textY - 2);

      //text: values
      this._ctx.fillStyle = '#5e7f78';
      const textWidth = this._ctx.measureText(slice.value).width;
      this._ctx.fillText(slice.value, this.x + barWidth / 2 - textWidth / 2, (this.canvasHeight - barHeight - 20));
      this.x += barWidth + gap;
    });
  }



}
