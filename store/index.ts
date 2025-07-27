import { configureStore, combineReducers } from "@reduxjs/toolkit"
import workoutReducer from "./workoutSlice"
import type { Store } from "@reduxjs/toolkit"
import type { Persistor } from "redux-persist"

const rootReducer = combineReducers({
  workouts: workoutReducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // No need to ignore redux-persist actions if redux-persist is not used
      serializableCheck: false, // Disable for simplicity if not strictly needed, or configure specific checks
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Export persistor as null initially. It will be set in ClientLayout.
export let persistor: Persistor | null = null

// Function to initialize persistence, called only on the client
export const initializePersistor = (clientStore: Store) => {
  if (typeof window !== "undefined" && !persistor) {
    const { persistStore, persistReducer } = require("redux-persist")
    const storage = require("redux-persist/lib/storage").default

    const persistConfig = {
      key: "root",
      version: 1,
      storage,
      whitelist: ["workouts"],
    }

    // Re-create the store with the persisted reducer
    // This is a common pattern when hydrating on the client
    const newStore = configureStore({
      reducer: persistReducer(persistConfig, rootReducer),
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [
              "persist/FLUSH",
              "persist/REHYDRATE",
              "persist/PAUSE",
              "persist/PERSIST",
              "persist/PURGE",
              "persist/REGISTER",
            ],
          },
        }),
    })

    // Replace the existing store's state with the new persisted store's state
    // This is a workaround for Next.js SSR and Redux Persist
    // In a more complex app, you might use a different pattern like a store factory
    Object.assign(clientStore, newStore)

    persistor = persistStore(clientStore)
  }
}
