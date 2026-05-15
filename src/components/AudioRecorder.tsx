import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

interface AudioRecorderProps {
  onRecorded: (uri: string, duration: number) => void;
}

export function AudioRecorder({ onRecorded }: AudioRecorderProps) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const startTime = useRef<number>(0);

  const start = async () => {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY,
    );
    setRecording(recording);
    setIsRecording(true);
    startTime.current = Date.now();
  };

  const stop = async () => {
    if (!recording) return;
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI()!;
    const duration = Math.round((Date.now() - startTime.current) / 1000);
    setRecording(null);
    onRecorded(uri, duration);
  };

  return (
    <TouchableOpacity
      onPress={isRecording ? stop : start}
      style={[styles.btn, isRecording && styles.btnActive]}
    >
      {isRecording ? (
        <View style={styles.row}>
          <View style={styles.redDot} />
          <Text style={styles.txtActive}>Stop</Text>
        </View>
      ) : (
        <Text style={styles.txt}>🎙️</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
  btnActive: { backgroundColor: '#fee2e2' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  redDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'red' },
  txt: { fontSize: 20 },
  txtActive: { fontSize: 12, color: 'red', fontWeight: '600' },
});
