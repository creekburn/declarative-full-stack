import { autoEffect, store as createStore } from '@risingstack/react-easy-state';

const LOCAL_STORAGE_KEY = 'global';

const store = createStore(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}'));

autoEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store));
});

export default store;