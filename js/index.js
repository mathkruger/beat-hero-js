import { Conductor } from "./modules/conductor.js";
import { MusicPlayer } from "./modules/music-player.js";


const app = {
    startButton : document.getElementById("start-button"),
    gameCanvas  : document.getElementsByTagName("canvas")[0],
    eventHub    : document.getElementById("event-hub"),
    barSpace    : 100,
    songConfig  : {
        bpm: 80,
        beats: 4
    },
    notes       : [
        {
            color: "green",
            button: "a",
        },
        {
            color: "red",
            button: "s",
        },
        {
            color: "yellow",
            button: "d",
        },
        {
            color: "blue",
            button: "f",
        }
    ],
    notesToDraw : [],
    score: 0,
    lastKeyPressed: {
        key: null,
        time: null,
    },

    initialize() {
        this.listen();
    },

    listen() {
        this.startButton.addEventListener("click", () => {
            this.startGame();
        });

        this.eventHub.addEventListener("onbeat", (e) => {
            this.update(e.detail.currentBeat);
        });

        window.addEventListener("keyup", (e) => {
            this.lastKeyPressed = {
                key: e.key.toLowerCase(),
                time: new Date().getTime(),
            };
        });
    },

    startGame() {
        this.notesToDraw = this.chooseNotes();
        this.drawGameBoard();
        this.drawNotes();

        Conductor.initialize({
            ...this.songConfig,
            eventHub: this.eventHub
        });

        setTimeout(() => {
            // MusicPlayer.play();
            Conductor.start();
        }, Conductor.msTempo * 3);

        // MusicPlayer.initialize("/songs/lofi.wav", () => {

        // });
    },

    drawGameBoard(activeBar) {
        const context  = this.gameCanvas.getContext("2d");

        context.fillStyle = "black";
        context.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);

        context.strokeStyle = "white";
        context.lineWidth = 5;

        for(let i = 0; i < this.songConfig.beats; i++) {
            if (activeBar == i + 1) {
                context.strokeStyle = "yellow";
            } else {
                context.strokeStyle = "white";
            }

            const yPos = this.barSpace * (i + 1);
            context.beginPath();
            context.moveTo(0, yPos);
            context.lineTo(this.gameCanvas.width, yPos);
            context.stroke();
        }
    },

    drawNotes() {
        const context = this.gameCanvas.getContext("2d");

        this.notesToDraw.forEach(note => {
            const width = 30;
            const height = 30;
            const xPos = (this.gameCanvas.width / 2) - (width / 2);
            const yPos = (this.barSpace * note.bar) - (height / 2);

            context.fillStyle = note.note.color;
            context.fillRect(xPos, yPos, width, height);
        });
    },

    drawScore() {
        const context = this.gameCanvas.getContext("2d");

        context.font = "12 Comic Sans";
        context.fillStyle = "white";
        context.fillText("Score: " + this.score, 10, this.gameCanvas.height - 30);
    },

    chooseNotes() {
        const notesToShow = [];

        [1, 2].forEach(i => {
            let randomBar  = Math.floor(Math.random() * (4 - 1 + 1) + 1);
            const randomNote = Math.floor(Math.random() * (4 - 1 + 1) + 1);

            while (notesToShow.find(x => x.bar === randomBar)) {
                randomBar  = Math.floor(Math.random() * (4 - 1 + 1) + 1)
            }

            notesToShow.push({
                bar: randomBar,
                note: this.notes[randomNote - 1]
            });
        });

        return notesToShow;
    },

    checkHit(bar) {
        const expected = this.notesToDraw.find(x => x.bar === bar);
        const now = new Date().getTime();
        const diff = Math.abs(this.lastKeyPressed.time - now);

        console.log(expected, this.lastKeyPressed, diff);

        // if (this.lastKeyPressed != null) {
        //     if (this.lastKeyPressed.key === expected.note.key) {
    
        //         if (diff <= 300) {
        //             this.score += 300;
        //         }
                
        //     }
            
        //     this.notesToDraw = this.notesToDraw.filter(x => x != expected);
        // }

        // this.lastKeyPressed = null;

    },

    update(bar) {
        this.drawGameBoard(bar);
        this.checkHit(bar);
        this.drawNotes();
        this.drawScore();

        if (bar === this.songConfig.beats) {
            this.notesToDraw = this.chooseNotes();
        }
    }
}

app.initialize();
