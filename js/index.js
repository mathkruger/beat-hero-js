import { Conductor } from "./modules/conductor.js";
import { MusicPlayer } from "./modules/music-player.js";


const app = {
    startButton : document.getElementById("start-button"),
    pauseButton : document.getElementById("pause-button"),
    gameCanvas  : document.getElementsByTagName("canvas")[0],
    eventHub    : document.getElementById("event-hub"),

    initialize() {
        this.listen();
    },

    listen() {
        this.startButton.addEventListener("click", () => {
            this.startGame();
        });

        this.pauseButton.addEventListener("click", () => {
            if (!Conductor.isPaused) {
                MusicPlayer.pause();
                Conductor.pause();
            } else {
                MusicPlayer.play();
                Conductor.isPaused = false;
            }
        });

        this.eventHub.addEventListener("onbeat", (e) => {
            this.lighCanvas(e.detail.currentBeat);
        });
    },

    startGame() {
        MusicPlayer.initialize("/songs/badromance.mp3", async () => {
            Conductor.initialize({
                bpm: 119,
                beats: 4,
                songLength: MusicPlayer.player.duration * 1000,
                eventHub: this.eventHub
            });
    
            MusicPlayer.play();
            Conductor.start(3);
        });
    },

    lighCanvas(color) {
        const colors      = ["red", "green", "blue", "yellow"];
        const context     = this.gameCanvas.getContext("2d");

        context.fillStyle = colors[color - 1];
        context.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);

        context.fillStyle = "black";
        context.fillRect(15, 15, this.gameCanvas.width - 30, this.gameCanvas.height - 30);

        context.font = "30px Lucida Console";
        context.fillStyle = "white";

        context.fillText(color, 400 - 15, 300 - 15);
    }
}

app.initialize();
