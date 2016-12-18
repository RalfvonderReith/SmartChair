import {Component, ViewChild, ElementRef, OnInit, NgZone} from '@angular/core';
import {Chair} from "../shared/chair";
import {Params, ActivatedRoute} from "@angular/router";
import {ChairService} from "../shared/chair.service";
import {Observable} from "rxjs/Observable";

@Component({
    selector: 'rotation',
    template: `
        <canvas class="canvas" #rotationCanvas width="150" height="150"></canvas>
        <img src="Arrow.png" style="display: none;" />
    `,
    styles: [`
        .canvas {
          border: 1px solid black;
          padding-left: 15px;
          padding-right: 15px;
        }
        img {
            display: none;
        }
    `],
    providers: [ChairService]
})

export class RotationComponent implements OnInit {

    rotation = 0;
    connection;
    drawReady = false;
    chair: Chair = new Chair('null');

    @ViewChild("rotationCanvas") rotationCanvas: ElementRef;
    @ViewChild('arrowImage') arrowImage: ElementRef;

    constructor(private chairService: ChairService, private route: ActivatedRoute, private zone:NgZone) {
        this.detectChange().subscribe((uuid => {
            if(uuid != this.chair.uuid) {
                this.zone.run(() => {
                    console.log('re-render');
                    this.start();
                });
            }
        }))
    }

    detectChange() {
        let observable = new Observable(observer => {
            this.route.params.forEach((params: Params) => {
                observer.next(params['uuid']);
            });
        });
        return observable;
    }

    ngOnInit() {
        this.start()
    }

    start() {
        this.getChairByID();

        this.getRotation();
    }

    getChairByID() {
        this.route.params.forEach((params: Params) => {
            this.chair.uuid = params['uuid'];
        });
    }

    getRotation() {
        this.connection = this.chairService.getRotation(this.chair.uuid).subscribe(rotation => {
            let rotationJSON = JSON.parse('' + rotation);
            this.rotation = rotationJSON.r[0];
            if(this.drawReady) {
                this.drawCanvasRotation();
            }
        });
    }

    //draw code
    ngAfterViewInit() {
        this.drawReady = true;
    }

    drawCanvasRotation(): void {
        let ctx: CanvasRenderingContext2D = this.rotationCanvas.nativeElement.getContext("2d");
        //some variables to SCALE context correctly to canvas
        ctx.canvas.height = ctx.canvas.width; //keep ratio to 1:1

        ctx.translate(75, 75);
        ctx.rotate(this.rotation); //in radians!
        ctx.drawImage(this.arrowImage.nativeElement, -50, -50);
    }
}