/*
 * Play Tones
 *
 * EX From https://github.com/mdn/webaudio-examples/blob/main/audio-buffer/index.html
 * */

// note, frequency w/ a = 440 going up = 2x
notes = [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88];

//440hz = 440PI / seconds
function generateAudioWave(index, note, sampleRate){
	// Math.sin(2*Math.PI): makes 1 cycle b/w 0-1
	// 440 * (2.Math.PI): makes 440 cycles b/w 0-1
	// index/sampleRate: gives the sample position b/w 0-1 second (sampleRate is in seconds)
	let radians = (note * (2*Math.PI) * (index/sampleRate));

	return Math.sin(radians);
}

function randomNote(){
	return notes[(Math.floor(Math.random() * notes.length))];
}

/* fill buffer with notes */
function fillBuffer(channels, samples, buffer){
	
	let noteChange = Math.floor(samples/3);
	//let playNotes = [randomNote(), randomNote(), randomNote()];

	let playNotes = [5, 11, 0];
	console.log('playNotes = ', playNotes);
	let playNoteIndex;

	for(let channel = 0; channel < channels; channel++){
		const channelBuffer = buffer.getChannelData(channel);
		
		playNoteIndex = 0;

		for(let sample = 0; sample < samples; sample++){
			// input value b/w 1 and -1
			// channelBuffer[sample] = Math.random() * 2 - 1;
			if(sample%noteChange == 0)playNoteIndex++;
			//console.log(`${sample} % ${noteChange} = ${sample%noteChange}`);
			//console.log(`playNoteIndex = ${playNoteIndex}`);
			channelBuffer[sample] = generateAudioWave(sample, notes[playNoteIndex], audioCtx.sampleRate);
		}
	}
}

let audioCtx;
let buffer;
const channels = 2;
// number of seconds
const lengthInSeconds = 10;
let length = lengthInSeconds;
// Init audioCtx cuz needs to be done via user input
function initAudioCtx(){
	// Create Context
	audioCtx = new AudioContext();
	console.log(`${audioCtx.sampleRate}Hz`);
	
	// Create Buffer
	length = lengthInSeconds * audioCtx.sampleRate;
	buffer = new AudioBuffer({
		numberOfChannels: channels,
		length: length,
		sampleRate: audioCtx.sampleRate,
	});

	fillBuffer(channels, audioCtx.sampleRate, buffer);
}

function playMelody() {
	if (!audioCtx) initAudioCtx();
	
	const audioSource = audioCtx.createBufferSource();

	audioSource.buffer = buffer;

	audioSource.connect(audioCtx.destination);
	
	audioSource.start();

	audioSource.onended = () => {
		console.log("White noise ended.");
	};
}



