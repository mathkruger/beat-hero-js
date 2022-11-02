const Conductor = {
    bpm: 0,
    beats: 0,
    songLength: 0,
    eventHub: null,

    currentBeat: 0,
    msTempo: 0,
    songPosition: 0,
    isPaused: false,


    initialize({ bpm, beats, songLength, eventHub }) {
        this.bpm         = bpm;
        this.beats       = beats;
        this.songLength  = songLength;
        this.eventHub    = eventHub;

        this.msTempo     = (60_000 / this.bpm); 
    },

    async start(startBeat = 1) {
        this.currentBeat = startBeat;
        while(this.songPosition <= this.songLength) {
            if (!this.isPaused) {
                if (this.currentBeat > 4) {
                    this.currentBeat = 1;
                }
    
                this.emitEvent();
                
                this.currentBeat++;
                await this.sleep(this.msTempo);
                this.songPosition += this.msTempo;
            }
        }
    },
    
    emitEvent() {
        console.log(this.currentBeat);
        const beatEvent = new CustomEvent("onbeat", {
            detail: {
                currentBeat  : this.currentBeat,
                songPosition : this.songPosition
            }
        });

        this.eventHub.dispatchEvent(beatEvent);
    },

    pause() {
        this.isPaused = true;
    },

    async sleep(duration) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(true);
            }, duration);
        });
    },
};

export {
    Conductor
}