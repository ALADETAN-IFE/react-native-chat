import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Audio } from 'expo-av';

interface AudioPlayerProps {
  url: string;
  duration?: number;
}

export function AudioPlayer({ url, duration }: AudioPlayerProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (sound && playing) {
      await sound.pauseAsync();
      setPlaying(false);
      return;
    }

    setLoading(true);
    const { sound: s } = await Audio.Sound.createAsync(
      { uri: url },
      { shouldPlay: true, rate: speed },
    );
    setSound(s);
    setPlaying(true);
    setLoading(false);

    s.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        setPlaying(false);
        s.unloadAsync();
        setSound(null);
      }
    });
  };

  const toggleSpeed = async () => {
    const next = speed === 1 ? 2 : 1;
    setSpeed(next);
    if (sound) await sound.setRateAsync(next, true);
  };

  return (
    <View style={styles.player}>
      <TouchableOpacity onPress={toggle} style={styles.playBtn}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.playIcon}>{playing ? '⏸' : '▶️'}</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.duration}>{duration ? `${duration}s` : '—'}</Text>
      <TouchableOpacity onPress={toggleSpeed} style={styles.speedBtn}>
        <Text style={styles.speedTxt}>{speed}x</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  player: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 4,
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: { fontSize: 16 },
  duration: { color: '#fff', fontSize: 12, minWidth: 28 },
  speedBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  speedTxt: { color: '#fff', fontSize: 11, fontWeight: '700' },
});
