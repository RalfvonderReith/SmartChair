/// <reference path="../typings/socket-io.d.ts" />
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var io = require("socket.io-client");
var PressureComponent = (function () {
    function PressureComponent() {
        this.pressure = {};
        this.socket = null;
        this.drawReady = false;
        for (var i = 0; i < 10; i++) {
            this.pressure[i] = '' + i;
        }
        this.socket = io('http://localhost:8000');
        this.socket.emit('connect', 'hi');
        this.socket.on('message', function (message) {
            this.socket.emit('message', 'Hello Server, Im fine');
            console.log(message);
        }.bind(this));
        this.socket.on('pressure', function (message) {
            this.updatePressure(JSON.parse(message));
        }.bind(this));
    }
    PressureComponent.prototype.updatePressure = function (pressureJSON) {
        if (!pressureJSON)
            return;
        for (var i in pressureJSON.p) {
            this.pressure[i] = pressureJSON.p[i];
        }
        if (this.drawReady) {
            this.drawCanvasPressure();
        }
    };
    //draw code
    PressureComponent.prototype.ngAfterViewInit = function () {
        this.drawReady = true;
    };
    PressureComponent.prototype.drawCanvasPressure = function () {
        var ctx = this.pressureCanvas.nativeElement.getContext("2d");
        //some variables to scale context correctly to canvas
        ctx.canvas.height = 2 * ctx.canvas.width; //keep ratio to 2:3
        var disY = ctx.canvas.height / 6;
        var disX = ctx.canvas.width / 3;
        var radius = (disY > disX ? disX : disY) / 3;
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000000';
        //draw chair outlines
        drawRoundRect(disX / 2, disY / 2, 2 * disX, 3 * disY, radius);
        drawRoundRect(disX / 2, 3 * disY + disY / 2, 2 * disX, 2 * disY, radius);
        drawRoundRect(0, 3 * disY + disY / 2, disX / 2, 1.8 * disY, radius);
        drawRoundRect(ctx.canvas.width - disX / 2, 3 * disY + disY / 2, disX / 2, 1.8 * disY, radius);
        drawCircle(1, 1, this.pressure[4]);
        drawCircle(2, 1, this.pressure[5]);
        drawCircle(1, 2, this.pressure[6]);
        drawCircle(2, 2, this.pressure[7]);
        drawCircle(1, 3, this.pressure[8]);
        drawCircle(2, 3, this.pressure[9]);
        drawCircle(1, 4, this.pressure[0]);
        drawCircle(2, 4, this.pressure[1]);
        drawCircle(1, 5, this.pressure[2]);
        drawCircle(2, 5, this.pressure[3]);
        function drawRoundRect(x, y, w, h, r) {
            if (w < 2 * r)
                r = w / 2;
            if (h < 2 * r)
                r = h / 2;
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.arcTo(x + w, y, x + w, y + h, r);
            ctx.arcTo(x + w, y + h, x, y + h, r);
            ctx.arcTo(x, y + h, x, y, r);
            ctx.arcTo(x, y, x + w, y, r);
            ctx.closePath();
            ctx.stroke();
        }
        function drawCircle(posX, posY, color) {
            ctx.beginPath();
            ctx.arc(posX * disX, posY * disY, radius, 0, 2 * Math.PI);
            ctx.fillStyle = percentageToHsl(color, 120, 0);
            ctx.fill();
            ctx.stroke();
        }
        /**
         * converts a percentage to a HSL color
         * @param percentage: the percentage value as a float between 0 and 1
         * @param hue0: color at 0%
         * @param hue1: color at 100%
         * @returns {string}: returns the string for a HSL-color
         */
        function percentageToHsl(percentage, hue0, hue1) {
            var hue = (percentage * (hue1 - hue0)) + hue0;
            return 'hsl(' + hue + ', 100%, 50%)';
        }
        //TODO Drucksensoren gehen von 0 bis 1024
    };
    __decorate([
        core_1.ViewChild("pressureCanvas"), 
        __metadata('design:type', core_1.ElementRef)
    ], PressureComponent.prototype, "pressureCanvas", void 0);
    PressureComponent = __decorate([
        core_1.Component({
            selector: 'pressure',
            template: "\n        <canvas class=\"canvas\" #pressureCanvas width=\"150\" height=\"300\"></canvas>\n        <img #source src=\"https://mdn.mozillademos.org/files/5397/rhino.jpg\"\n           width=\"300\" height=\"227\">\n    ",
            styles: ["\n        .canvas {\n          border: 1px solid black;\n          padding-left: 15px;\n          padding-right: 15px;\n        }\n        img {\n            display: none;\n        }\n    "]
        }), 
        __metadata('design:paramtypes', [])
    ], PressureComponent);
    return PressureComponent;
}());
exports.PressureComponent = PressureComponent;
//# sourceMappingURL=pressure.component.js.map