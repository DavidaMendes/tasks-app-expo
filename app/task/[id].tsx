import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Platform, ScrollView, Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Checkbox from 'expo-checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTaskStore } from '../../src/store/useTaskStore';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const task = useTaskStore((state) => state.tasks.find((t) => t._id === id));
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const [text, setText] = useState('');
  const [completed, setCompleted] = useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [priority, setPriority] = useState<'Baixa' | 'Média' | 'Alta'>('Baixa');

  useEffect(() => {
    if (task) {
      setText(task.text);
      setCompleted(!!task.completed);
      setDueDate(task.dueDate ? new Date(task.dueDate) : null);
    }
  }, [task]);

  if (!task) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Tarefa não encontrada.</Text>
      </View>
    );
  }

  const handleSave = () => {
    updateTask(id, text, completed, dueDate ? dueDate.toISOString() : null, () => {
      router.back();
    });
  };

  const handleDelete = () => {
    Alert.alert('Excluir tarefa', 'Tem certeza que deseja excluir esta tarefa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          deleteTask(id);
          router.back();
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Editar Tarefa</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        maxLength={50}
        placeholder="Nome da tarefa..."
      />

      <Text style={styles.label}>Data limite</Text>
      {Platform.OS === 'web' ? (
        <input
          type="date"
          value={dueDate ? dueDate.toISOString().split('T')[0] : ''}
          onChange={(e: any) => {
            const val = e.target.value;
            if (val) {
              const [y, m, d] = val.split('-');
              setDueDate(new Date(+y, +m - 1, +d));
            } else {
              setDueDate(null);
            }
          }}
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', marginBottom: 16, width: '100%' }}
        />
      ) : (
        <View style={styles.dateRow}>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateBtn}>
            <Text>{dueDate ? dueDate.toLocaleDateString() : 'Selecionar Data'}</Text>
          </TouchableOpacity>
          {dueDate && (
            <TouchableOpacity onPress={() => setDueDate(null)} style={styles.clearDateBtn}>
              <Text style={{ color: '#999' }}>Limpar</Text>
            </TouchableOpacity>
          )}
          {showDatePicker && (
            <DateTimePicker
              value={dueDate || new Date()}
              mode="date"
              display="default"
              onChange={(_, date) => { setShowDatePicker(false); if (date) setDueDate(date); }}
            />
          )}
        </View>
      )}

      <View style={styles.checkRow}>
        <Text style={styles.label}>Concluída</Text>
        <Checkbox
          value={completed}
          onValueChange={setCompleted}
          color={completed ? '#000' : undefined}
          style={{ marginLeft: 16 }}
        />
      </View>

      <Text style={styles.label}>Prioridade</Text>
      <View style={styles.priorityRow}>
        {(['Baixa', 'Média', 'Alta'] as const).map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.priorityBtn, priority === p && {
              backgroundColor: p === 'Baixa' ? '#4caf50' : p === 'Média' ? '#ff9800' : '#f44336',
              borderColor: p === 'Baixa' ? '#4caf50' : p === 'Média' ? '#ff9800' : '#f44336',
            }]}
            onPress={() => setPriority(p)}
          >
            <Text style={[styles.priorityText, priority === p && { color: '#fff', fontWeight: 'bold' }]}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.saveBtn, !text.trim() && styles.saveBtnDisabled]}
        onPress={handleSave}
        disabled={!text.trim()}
      >
        <Text style={styles.saveBtnText}>Salvar alterações</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Text style={styles.deleteBtnText}>Excluir tarefa</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 24, 
    paddingBottom: 48 
  },
  sectionTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 24, 
    textAlign: 'center' 
  },
  label: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#444', 
    marginBottom: 6 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 6, 
    padding: 12, 
    fontSize: 16, 
    marginBottom: 20 
  },
  dateRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    marginBottom: 20 
  },
  dateBtn: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    paddingVertical: 10, 
    paddingHorizontal: 14, 
    borderRadius: 6 
  },
  clearDateBtn: { 
    paddingVertical: 10, 
    paddingHorizontal: 8 
  },
  checkRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  priorityRow: { 
    flexDirection: 'row', 
    gap: 10, 
    marginBottom: 32, 
    flexWrap: 'wrap' 
  },
  priorityBtn: { 
    paddingVertical: 8, 
    paddingHorizontal: 14, 
    borderRadius: 6, 
    borderWidth: 1, 
    borderColor: '#ccc' 
  },
  priorityText: { 
    color: '#333', 
    fontSize: 14 },
  saveBtn: { 
    backgroundColor: '#000', 
    padding: 16, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginBottom: 12 
  },
  saveBtnDisabled: { 
    backgroundColor: '#ccc' 
  },
  saveBtnText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  deleteBtn: { 
    borderWidth: 1, 
    borderColor: '#e53935', 
    padding: 16, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  deleteBtnText: { 
    color: '#e53935', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  notFound: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  notFoundText: { 
    fontSize: 16, 
    color: '#666' 
  },
});