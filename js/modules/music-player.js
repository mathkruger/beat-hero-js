const MusicPlayer = {
    path: null,
    player: new Audio(),

    initialize(path, initCallBack) {
        this.path = path;
        this.player = new Audio(this.path);
        this.player.addEventListener("loadedmetadata", initCallBack);
    },

    isPaused() {
        return this.player.paused;
    },

    play() {
        this.player.play();
    },

    pause() {
        this.player.pause();
    },
};

export {
    MusicPlayer
}