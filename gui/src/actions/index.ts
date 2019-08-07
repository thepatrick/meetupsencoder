import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { Group } from "../model/Group";

export enum ActionType {
  MOBILEOPEN_OPEN,
  
  GROUPS_LOADING,
  GROUPS_LOADING_ERROR,
  GROUPS_LOADED
}

export interface Action<T> {
  type: ActionType;
  payload: T;
}

export function mobileOpen(open: boolean) {
  return {
    type: ActionType.MOBILEOPEN_OPEN,
    payload: open,
  }
}
const groupsLoading = (loading: boolean) => ({
  type: ActionType.GROUPS_LOADING,
  payload: loading,
});

const groupsLoadingError = (error: Error) => ({
  type: ActionType.GROUPS_LOADING_ERROR,
  payload: error,
});

const groupsLoaded = (groups: Group[]) => ({
  type: ActionType.GROUPS_LOADED,
  payload: groups,
});

export function groupsLoad() {
  return async(dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(groupsLoading(true))
    try {
      const response = await fetch('/api/v1/group', { credentials: "include" });
      const data: Group[] = await response.json();
      dispatch(groupsLoading(false));
      dispatch(groupsLoaded(data));
    } catch (err) {
      dispatch(groupsLoading(false));
      dispatch(groupsLoadingError(err));
    }
  }
}