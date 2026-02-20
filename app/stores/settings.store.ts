import { defineStore } from 'pinia';


interface SettingsState {
  distanceUnit: 'km' | 'mi';
  // searchRadius moved to ubicacion.store
  hasCompletedOnboarding: boolean;
  // Web specific or parity fields
  imageCacheEnabled: boolean;
  notificationsEnabled: boolean;
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    distanceUnit: 'km',
    // searchRadius moved to ubicacion.store
    hasCompletedOnboarding: false,
    imageCacheEnabled: true,
    notificationsEnabled: true,
  }),
  actions: {
    setDistanceUnit(unit: 'km' | 'mi') {
      this.distanceUnit = unit;
    },
    // setSearchRadius removed
    setHasCompletedOnboarding(value: boolean) {
      this.hasCompletedOnboarding = value;
    },
    toggleImageCache() {
        this.imageCacheEnabled = !this.imageCacheEnabled;
    },
    toggleNotifications() {
        this.notificationsEnabled = !this.notificationsEnabled;
    }
  },
  persist: true,
});
