import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTaskStore } from '../../src/store/useTaskStore';

export default function SettingsScreen() {
  const tasks = useTaskStore((state) => state.tasks);
  const deleteAllTasks = useTaskStore((state) => state.deleteAllTasks);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);

  const handleDeleteAll = () => {
    Alert.alert('Excluir todas as tarefas', 'Esta ação não pode ser desfeita. Confirma?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir tudo', style: 'destructive', onPress: deleteAllTasks },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Total de tarefas salvas</Text>
        <Text style={styles.cardValue}>{tasks.length}</Text>
      </View>

      <TouchableOpacity style={styles.syncBtn} onPress={fetchTasks}>
        <Text style={styles.syncBtnText}>🔄 Sincronizar com servidor</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.dangerBtn} onPress={handleDeleteAll}>
        <Text style={styles.dangerBtnText}>🗑 Excluir todas as tarefas</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 32, textAlign: 'center' },
  card: { backgroundColor: '#f5f5f5', borderRadius: 8, padding: 20, marginBottom: 16, alignItems: 'center' },
  cardLabel: { fontSize: 14, color: '#666', marginBottom: 4 },
  cardValue: { fontSize: 36, fontWeight: 'bold', color: '#000' },
  syncBtn: { borderWidth: 1, borderColor: '#000', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  syncBtnText: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  dangerBtn: { borderWidth: 1, borderColor: '#e53935', padding: 16, borderRadius: 8, alignItems: 'center' },
  dangerBtnText: { fontSize: 16, fontWeight: 'bold', color: '#e53935' },
});