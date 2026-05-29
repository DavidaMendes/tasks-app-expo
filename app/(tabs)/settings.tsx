import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTaskStore } from '../../src/store/useTaskStore';
import { useAuthStore } from '../../src/store/useAuthStore';
import { logoutAPI } from '../../src/utils/auth-api';
 
export default function SettingsScreen() {
  const router = useRouter();
  const tasks = useTaskStore((state) => state.tasks);
  const deleteAllTasks = useTaskStore((state) => state.deleteAllTasks);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
 
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [loggingOut, setLoggingOut] = useState(false);
 
  const handleDeleteAll = () => {
    Alert.alert('Excluir todas as tarefas', 'Esta ação não pode ser desfeita. Confirma?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir tudo', style: 'destructive', onPress: deleteAllTasks },
    ]);
  };
 
  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja encerrar sua sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          setLoggingOut(true);
          try {
            await logoutAPI(); 
          } catch {
          } finally {
            await clearAuth(); 
            deleteAllTasks();  
            router.replace('/login');
          }
        },
      },
    ]);
  };
 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>
 
      {user && (
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>
      )}
 
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
 
      <TouchableOpacity
        style={[styles.logoutBtn, loggingOut && styles.btnDisabled]}
        onPress={handleLogout}
        disabled={loggingOut}
      >
        {loggingOut
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.logoutBtnText}>🚪 Sair (Logout)</Text>
        }
      </TouchableOpacity>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
 
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  userName: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  userEmail: { fontSize: 13, color: '#666', marginTop: 2 },
 
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  cardLabel: { fontSize: 14, color: '#666', marginBottom: 4 },
  cardValue: { fontSize: 36, fontWeight: 'bold', color: '#000' },
 
  syncBtn: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  syncBtnText: { fontSize: 16, fontWeight: 'bold', color: '#000' },
 
  dangerBtn: {
    borderWidth: 1,
    borderColor: '#e53935',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  dangerBtnText: { fontSize: 16, fontWeight: 'bold', color: '#e53935' },
 
  logoutBtn: {
    backgroundColor: '#e53935',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    height: 52,
    justifyContent: 'center',
  },
  btnDisabled: { backgroundColor: '#ccc' },
  logoutBtnText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
});
 