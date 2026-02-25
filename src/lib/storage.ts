import { StorageData } from '../types';

export const storage = {
  async get<K extends keyof StorageData>(
    keys: K[]
  ): Promise<Pick<StorageData, K>> {
    return new Promise((resolve) => {
      chrome.storage.sync.get(keys, (result) => {
        resolve(result as Pick<StorageData, K>);
      });
    });
  },

  async set(data: Partial<StorageData>): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.sync.set(data, () => {
        resolve();
      });
    });
  },
};
