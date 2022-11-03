const Conductor = {
    bpm: 0,
    beats: 0,
    eventHub: null,

    currentBeat: 0,
    msTempo: 0,


    initialize({ bpm, beats, eventHub }) {
        this.bpm         = bpm;
        this.beats       = beats;
        this.eventHub    = eventHub;

        this.msTempo     = (60_000 / this.bpm); 
    },

    async start(startBeat = 1) {
        this.currentBeat = startBeat;
        while(true) {
            if (this.currentBeat > this.beats) {
                this.currentBeat = 1;
            }
            
            this.emitEvent();
            
            this.currentBeat++;
            await this.sleep(this.msTempo);
        }
    },
    
    emitEvent() {
        const beatEvent = new CustomEvent("onbeat", {
            detail: {
                currentBeat  : this.currentBeat,
            }
        });

        this.eventHub.dispatchEvent(beatEvent);
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