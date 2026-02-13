import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import useGameStore from '../store/gameStore';
import { FORMS } from '../data/forms';

export default function FormSelector() {
  const forms = useGameStore((state: any) => state.forms);
  const player = useGameStore((state: any) => state.player);
  const switchForm = useGameStore((state: any) => state.switchForm);
  const cores = useGameStore((state: any) => state.cores);
  const absorbCore = useGameStore((state: any) => state.absorbCore);
  const isDead = useGameStore((state: any) => state.isDead);
  const isPaused = useGameStore((state: any) => state.isPaused);
  const isManuallyPaused = useGameStore((state: any) => state.isManuallyPaused);

  return (
    <>
      {/* Form slots in tab bar style */}
      <View style={styles.tabBarContainer}>
        <BlurView intensity={80} tint="dark" style={styles.tabBarBlur}>
          <View style={styles.tabBarContent}>
            {/* Form Slots Row */}
            <View style={styles.formsRow}>
              {forms.map((formId, index) => {
                const form = formId ? FORMS[formId] : null;
                const isActive = player.currentForm === formId;
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.formSlot,
                      isActive && styles.activeSlot,
                    ]}
                    onPress={() => !isDead && !isPaused && !isManuallyPaused && form && switchForm(index)}
                    disabled={isDead || isPaused || isManuallyPaused}
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
                      <View style={styles.emptySlot}>
                        <Text style={styles.emptyText}>Empty</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </BlurView>
      </View>
      
      {/* Available cores to absorb */}
      {cores.length > 0 && (
        <BlurView 
          intensity={isPaused ? 95 : 80} 
          tint="dark" 
          style={[
            styles.coresContainer,
            isPaused && styles.coresContainerPaused
          ]}
        >
          <View style={styles.coresContent}>
            <Text style={[styles.coresTitle, isPaused && styles.coresTitlePaused]}>
              {isPaused ? 'Choose Slot for Core:' : 'Nearby Cores:'}
            </Text>
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
                    onPress={() => !isDead && absorbCore(core.type, slotIdx)}
                    disabled={isDead}
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
        </BlurView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        paddingBottom: 34, // iPhone home indicator space
      },
      default: {
        paddingBottom: 10,
      },
    }),
    pointerEvents: 'box-none',
  },
  tabBarBlur: {
    overflow: 'hidden',
  },
  tabBarContent: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Glassmorphic tint
  },
  formsRow: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
  },
  formSlot: {
    width: 65,
    height: 65,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  activeSlot: {
    backgroundColor: 'rgba(6, 255, 165, 0.15)',
    borderWidth: 2,
    borderColor: '#06FFA5',
  },
  formIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 2,
  },
  formName: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
  },
  emptySlot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 8,
    fontWeight: '500',
  },
  coresContainer: {
    position: 'absolute',
    bottom: 200,
    left: 20,
    right: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  coresContainerPaused: {
    borderWidth: 2,
    borderColor: '#9D4EDD',
    shadowColor: '#9D4EDD',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },
  coresContent: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  coresTitle: {
    color: '#9D4EDD',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  coresTitlePaused: {
    fontSize: 16,
    color: '#06FFA5',
  },
  coreRow: {
    marginBottom: 12,
  },
  coreText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  slotButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  slotButton: {
    backgroundColor: 'rgba(157, 78, 221, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  slotButtonText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
});