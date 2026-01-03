export const validateAudioContent = async (
  audioData: ArrayBuffer,
  audioContext: AudioContext
): Promise<{ isValid: boolean; error?: string }> => {
  try {
    // decodeAudioData detaches the buffer, so we must slice it to create a copy
    const bufferCopy = audioData.slice(0);
    
    // Decode the audio data (converts MP3/WAV to PCM)
    const audioBuffer = await audioContext.decodeAudioData(bufferCopy);
    
    // 1. Check Duration (Must be at least 0.1s)
    if (audioBuffer.duration < 0.1) {
      return { isValid: false, error: `Audio too short (${audioBuffer.duration.toFixed(2)}s)` };
    }

    // 2. Check for Silence
    // We check the PCM data of the first channel
    const channelData = audioBuffer.getChannelData(0);
    let hasSound = false;
    const threshold = 0.005; // Amplitude threshold (0.5% max volume)

    // Check every 10th sample to save performance while maintaining accuracy
    for (let i = 0; i < channelData.length; i += 10) {
      if (Math.abs(channelData[i]) > threshold) {
        hasSound = true;
        break;
      }
    }

    if (!hasSound) {
      return { isValid: false, error: "Audio file contains only silence" };
    }

    return { isValid: true };

  } catch (error: any) {
    return { isValid: false, error: `Validation failed: ${error.message}` };
  }
};