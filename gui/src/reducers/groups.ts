import { combineReducers } from "redux";
import { Action, ActionType } from "../actions";
import { Group } from "../model/Group";
import createReducer from "./createReducer";

const byId = createReducer<{ [key: string]: Group }>({}, {
  [ActionType.GROUPS_LOADED](state: { [key: string]: Group }, action: Action<Group[]>) {
    return action.payload.reduce((collect: { [key: string]: Group }, group: Group) => {
      collect[group.groupId] = group;
      return collect;
    }, {});
  }
});

const loading = createReducer<boolean>(false, {
  [ActionType.GROUPS_LOADING](state: boolean, action: Action<boolean>) {
    return action.payload;
  },

  [ActionType.GROUPS_LOADING_ERROR](state: Error | null, action: Action<Error>) {
    if (action.payload !== null) {
      return false;
    }

    return state;
  },

  [ActionType.GROUPS_LOADED](state: { [key: string]: Group }, action: Action<Group[]>) {
    return false;
  },
});

const error = createReducer<Error | null>(null, {
  [ActionType.GROUPS_LOADING_ERROR](state: Error | null, action: Action<Error>) {
    return action.payload;
  },

  [ActionType.GROUPS_LOADED](state: { [key: string]: Group }, action: Action<Group[]>) {
    return null;
  },
});

export const groups = combineReducers({
  byId,
  loading,
  error,
});
