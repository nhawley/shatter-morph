import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import useGameStore from '../store/gameStore';
import { FORMS } from '../data/forms';

export default function FormSelector() {
  const forms = useGameStore((state: any) => state.forms);
  const player = useGameStore((state: any) => state.player);
  const switchForm = useGameStore((state: any) => state.switchForm);
  const cores = useGameStore((state: any) => state.cores);
  const absorbCore = useGameStore((state: any) => state.absorbCore);

  return (
    <View style={styles.container}>
      {/* Form slots */}
      <View style={styles.formsRow}>
        {forms.map((formId, index) => {
          const form = formId ? FORMS[formId] : null;
          const isActive = player.currentForm === formId;
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.formSlot,
                form && { backgroundColor: form.color + '40' },
                isActive && styles.activeSlot,
              ]}
              onPress={() => form && switchForm(index)}
            >
              {form ? (
                <>
                  <View
                    style={[
                      styles.formIcon,
                      { backgroundColor: form.color }
                    ]}
                  />
                  <Text style={styles.formName}>{form.name}</Text>
                </>
              ) : (
                <Text style={styles.emptyText}>Empty</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      
      {/* Available cores to absorb */}
      {cores.length > 0 && (
        <View style={styles.coresContainer}>
          <Text style={styles.coresTitle}>Nearby Cores:</Text>
          {cores.slice(0, 3).map((core, idx) => (
            <View key={core.id} style={styles.coreRow}>
              <Text style={styles.coreText}>
                {FORMS[core.type]?.name}
              </Text>
              <View style={styles.slotButtons}>
                {[0, 1, 2].map((slotIdx) => (
                  <TouchableOpacity
                    key={slotIdx}
                    style={styles.slotButton}
                    onPress={() => absorbCore(core.type, slotIdx)}
                  >
                    <Text style={styles.slotButtonText}>
                      Slot {slotIdx + 1}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    right: 20,
    alignItems: 'flex-end',
  },
  formsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  formSlot: {
    width: 80,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeSlot: {
    borderColor: '#06FFA5',
    borderWidth: 3,
  },
  formIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 5,
  },
  formName: {
    color: '#FFF',
    fontSize: 10,
    textAlign: 'center',
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
  },
  coresContainer: {
    marginTop: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 10,
    minWidth: 250,
  },
  coresTitle: {
    color: '#9D4EDD',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  coreRow: {
    marginBottom: 10,
  },
  coreText: {
    color: '#FFF',
    fontSize: 12,
    marginBottom: 5,
  },
  slotButtons: {
    flexDirection: 'row',
    gap: 5,
  },
  slotButton: {
    backgroundColor: 'rgba(157, 78, 221, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  slotButtonText: {
    color: '#FFF',
    fontSize: 10,
  },
});