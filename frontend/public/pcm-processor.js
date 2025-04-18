// pcm-processor.js
class PCMProcessor extends AudioWorkletProcessor {
    process (inputs) {
      // inputs is [ [ Float32Array ] ], one per channel
      const channelData = inputs[0][0];
      if (channelData) {
        // copy so underlying buffer can be reused
        this.port.postMessage(new Float32Array(channelData));
      }
      return true; // keep processor alive
    }
  }
  
  registerProcessor('pcm-processor', PCMProcessor);
  