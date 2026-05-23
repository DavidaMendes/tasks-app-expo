import { useState } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  StyleSheet, Platform
} from 'react-native';
import Checkbox from 'expo-checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTaskStore } from '../store/useTaskStore';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function AddTaskModal({ visible, onClose }: Props) {
  const addTask = useTaskStore((state) => state.addTask);

  const [text, setText] = useState('');
  const [completed, setCompleted] = useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [priority, setPriority] = useState<'Baixa' | 'Média' | 'Alta'>('Baixa');

  const resetForm = () => {
    setText('');
    setCompleted(false);
    setDueDate(null);
    setPriority('Baixa');
    onClose();
  };

  const handleSave = () => {
    addTask(text, completed, dueDate ? dueDate.toISOString() : null, resetForm);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={resetForm}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Nova Tarefa</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome da tarefa..."
            value={text}
            maxLength={50}
            onChangeText={setText}
          />

          <View style={styles.fieldRow}>
            <Text style={styles.label}>Data limite:</Text>
            {Platform.OS === 'web' ? (
              // @ts-ignore
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
                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', flex: 1, marginLeft: 16 }}
              />
            ) : (
              <View style={{ flex: 1, marginLeft: 16 }}>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateBtn}>
                  <Text>{dueDate ? dueDate.toLocaleDateString() : 'Selecionar Data'}</Text>
                </TouchableOpacity>
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
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.label}>Concluída:</Text>
            <View style={{ marginLeft: 16 }}>
              <Checkbox value={completed} onValueChange={setCompleted} color={completed ? '#000' : undefined} />
            </View>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.label}>Prioridade:</Text>
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
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={resetForm}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, !text.trim() && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={!text.trim()}
            >
              <Text style={styles.saveText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  content: { width: '90%', maxWidth: 400, backgroundColor: '#fff', borderRadius: 8, padding: 24 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, paddingVertical: 10, paddingHorizontal: 12, fontSize: 16, marginBottom: 16 },
  fieldRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  label: { fontSize: 16, fontWeight: 'bold' },
  dateBtn: { borderWidth: 1, borderColor: '#ccc', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 4 },
  priorityRow: { flexDirection: 'row', flex: 1, marginLeft: 16, gap: 8, flexWrap: 'wrap' },
  priorityBtn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 4, borderWidth: 1, borderColor: '#ccc' },
  priorityText: { color: '#333' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8 },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 16 },
  cancelText: { color: '#666', fontSize: 16, fontWeight: 'bold' },
  saveBtn: { backgroundColor: '#000', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 4 },
  saveBtnDisabled: { backgroundColor: '#ccc' },
  saveText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});