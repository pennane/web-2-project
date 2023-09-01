import * as R from "ramda";
import { Db, MongoClient } from "mongodb";
import { CollectionSettings } from "../collections/models";
import { CONFIG_OBJECT } from "./config";
import { GAME_COLLECTION_SETTINGS } from "../collections/Game";
import { PLAYED_GAME_COLLECTION_SETTINGS } from "../collections/PlayedGame";
import { USER_COLLECTION_SETTINGS } from "../collections/User";
import { USER_STATS_COLLECTION_SETTINGS } from "../collections/UserStats";

const connectDb = async () => {
  const client = new MongoClient(CONFIG_OBJECT.MONGO_CONNECTION_STRING);

  await client.connect();

  const db = client.db(CONFIG_OBJECT.MONGO_DB_NAME);

  return db;
};

const createCollections = async (
  db: Db,
  collectionSettingsMap: Record<string, CollectionSettings<any>>
) => {
  const collectionSettings = Object.values(collectionSettingsMap);
  for (const settings of collectionSettings) {
    await db.createCollection(settings.name);
  }
};

const createAndDropIndexes = async (
  db: Db,
  collectionSettingsMap: Record<string, CollectionSettings<any>>
) => {
  const collectionSettings = Object.values(collectionSettingsMap);

  for (const settings of collectionSettings) {
    const collection = settings.collectionGetter(db);
    for (const index of settings.indexSpecs) {
      await collection.createIndex(index.specification, index.options);
    }
    const existingIndexes = await collection.listIndexes().toArray();
    for (const index of existingIndexes) {
      if (index.name === "_id_") {
        continue;
      }
      const isIndexDesired = settings.indexSpecs.some(
        (desiredSpec) => desiredSpec.options.name === index.name
      );

      if (!isIndexDesired) {
        console.log(
          `Dropping unwanted "${settings.name}" index: ${index.name}`
        );
        await collection.dropIndex(index.name);
      }
    }
  }
};

export const initializeMongo = async () => {
  const db = await connectDb();

  const collectionSettings = {
    user: USER_COLLECTION_SETTINGS,
    game: GAME_COLLECTION_SETTINGS,
    playedGame: PLAYED_GAME_COLLECTION_SETTINGS,
    userStats: USER_STATS_COLLECTION_SETTINGS,
  } as const;

  const collections = R.map(
    (settings) => settings.collectionGetter(db),
    collectionSettings
  ) as {
    [name in keyof typeof collectionSettings]: ReturnType<
      (typeof collectionSettings)[name]["collectionGetter"]
    >;
  };

  await createCollections(db, collectionSettings);

  await createAndDropIndexes(db, collectionSettings);

  return { db, collections };
};