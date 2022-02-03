import { User } from "eris";

class PrefabCreationManager {
  private instances: Map<string, Prefab> = new Map();

  public createInstance(sender: User, prefab: Prefab) {
    return this.instances.set(sender.id, prefab).get(sender.id)!;
  }

  public deleteInstance(sender: User) {
    return this.instances.delete(sender.id);
  }

  public getInstance(sender: User) {
    return this.instances.get(sender.id);
  }

  public setImage(sender: User, imageUrl: string) {
    return this.instances.set(sender.id, {
      ...this.instances.get(sender.id)!,
      imageUrl,
    });
  }
}

export type Prefab = {
  characterId?: number;
  subgroupId?: number;
  groupId?: number;
  maxCards?: number;
  rarity?: number;
  imageUrl?: string;
  isEdit?: { prefabId: number };
};

export const prefabCreationManager = new PrefabCreationManager();
