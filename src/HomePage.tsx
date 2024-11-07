import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Text, Button, ProgressBar, TextInput } from 'react-native-paper';

export default function HomePage() {
  const [time, setTime] = useState<number>(0);
  const [initialTime, setInitialTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [inputTime, setInputTime] = useState<string>('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const progress = initialTime > 0 ? time / initialTime : 1;

  const startTimer = () => {
    if (time === 0) {
      Alert.alert("Defina um tempo antes de iniciar");
      return;
    }
    setIsRunning(true);
    timerRef.current = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          setIsRunning(false);
          Alert.alert("O tempo acabou!");
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      setIsRunning(false);
    }
  };

  const resetTimer = () => {
    stopTimer();
    setTime(initialTime);
  };

  const handleSetTime = () => {
    const seconds = parseInt(inputTime) * 60;
    if (isNaN(seconds) || seconds <= 0) {
      Alert.alert("Por favor, insira um número válido.");
      return;
    }
    setTime(seconds);
    setInitialTime(seconds);
    setInputTime('');
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Timer</Text>
      <Text style={styles.timerText}>{formatTime(time)}</Text>

      <ProgressBar progress={progress} color="#4CAF50" style={styles.progressBar} />

      <TextInput
        style={styles.input}
        placeholder="Defina o tempo (em minutos)"
        keyboardType="numeric"
        value={inputTime}
        onChangeText={setInputTime}
      />
      <Button style={styles.setTimeButton} onPress={handleSetTime}>
        <Text style={styles.buttonText}>Definir Tempo</Text>
      </Button>

      <View style={styles.buttonContainer}>
        <Button style={styles.button} onPress={isRunning ? stopTimer : startTimer}>
          <Text style={styles.buttonText}>{isRunning ? 'Parar' : 'Iniciar'}</Text>
        </Button>
        <Button style={styles.button} onPress={resetTimer} disabled={!time}>
          <Text style={styles.buttonText}>Resetar</Text>
        </Button>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  progressBar: {
    width: '80%',
    height: 10,
    marginVertical: 20,
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    textAlign: 'center',
    fontSize: 18,
  },
  setTimeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
});
