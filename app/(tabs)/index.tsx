import { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, SafeAreaView,
  Platform, StatusBar as RNStatusBar, Image, Pressable,
  ActivityIndicator, Modal, Button
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import TaskList from '../../src/components/TaskList';
import { TaskItem } from '../../src/utils/handle-api';
import { globalStyles } from '../../src/styles/global';
import AboutScreen from '../../src/components/AboutScreen';
import { useTaskStore } from '../../src/store/useTaskStore';
import AddTaskModal from '../../src/components/AddTaskModal';

export default function HomeScreen() {
  const router = useRouter();

  const tasks = useTaskStore((state) => state.tasks);
  const loading = useTaskStore((state) => state.loading);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const deleteAllTasks = useTaskStore((state) => state.deleteAllTasks);

  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [logoError, setLogoError] = useState(false);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdate = (task: TaskItem) => {
    router.push(`/task/${task._id}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <View style={styles.headerContainer}>
          {logoError ? (
            <Text style={styles.header}>Gerenciador de Tarefas</Text>
          ) : (
            <Image
              source={require('../../assets/task-app-banner.png')}
              style={styles.logo}
              onError={() => setLogoError(true)}
            />
          )}
          {!logoError && <Text style={styles.header}>Tarefas</Text>}
        </View>

        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>Total de Tarefas: {tasks.length}</Text>
        </View>

        <View style={styles.filterContainer}>
          {(['all', 'completed', 'pending'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterButton,
                filter === f ? styles.filterButtonActive : styles.filterButtonInactive,
              ]}
              onPress={() => setFilter(f)}
            >
              <Text style={filter === f ? styles.filterTextActive : styles.filterTextInactive}>
                {f === 'all' ? 'Todas' : f === 'completed' ? 'Concluídas' : 'Pendentes'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.actionButtonsContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.actionButtonAdd,
              pressed && styles.actionButtonAddPressed,
            ]}
            onPress={() => setAddModalVisible(true)}
          >
            <Text style={styles.actionButtonText}>Nova Tarefa</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.deleteButton,
              pressed && styles.deleteButtonPressed,
            ]}
            onPress={deleteAllTasks}
          >
            <Text style={styles.actionButtonText}>Excluir todas</Text>
          </Pressable>
        </View>

        <View style={styles.aboutButtonContainer}>
          <Button title="Sobre o App" onPress={() => setAboutModalVisible(true)} />
        </View>

        <TaskList filter={filter} onUpdate={handleUpdate} />

        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        )}
      </View>

      <AddTaskModal visible={addModalVisible} onClose={() => setAddModalVisible(false)} />

      <Modal
        visible={aboutModalVisible}
        animationType="slide"
        onRequestClose={() => setAboutModalVisible(false)}
      >
        <AboutScreen onClose={() => setAboutModalVisible(false)} />
      </Modal>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: globalStyles.backgroundColor,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  header: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  counterContainer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    fontSize: globalStyles.bodyFontSize,
    color: '#666',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterButtonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  filterButtonInactive: {
    backgroundColor: 'transparent',
    borderColor: '#000',
  },
  filterTextActive: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  filterTextInactive: {
    color: '#000',
    fontSize: 14,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
  },
  aboutButtonContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  actionButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    flex: 1,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  actionButtonAdd: {
    backgroundColor: globalStyles.primaryColor,
    shadowColor: globalStyles.primaryColor,
  },
  actionButtonAddPressed: {
    backgroundColor: '#333',
    transform: [{ scale: 0.98 }],
    elevation: 1,
    shadowOpacity: 0.1,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    shadowColor: '#ff0000',
  },
  deleteButtonPressed: {
    backgroundColor: '#d9363e',
    transform: [{ scale: 0.98 }],
    elevation: 1,
    shadowOpacity: 0.1,
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 10,
  },
});