import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { Group } from "../model/Group";
import { History } from "history";

export enum ActionType {
  MOBILEOPEN_OPEN,
  
  GROUPS_LOADING,
  GROUPS_LOADING_ERROR,
  GROUPS_LOADED,

  GROUP_ADDING,
  GROUP_ADDING_ERROR,
  GROUP_ADDED,
}

export interface Action<T> {
  type: ActionType;
  payload: T;
}

const action = <T>(type: ActionType): ((payload: T) => Action<T>) =>
  (payload) => ({
    type,
    payload,
  });

const authorization = (token: string | undefined) => (
  { Authorization: `Bearer ${token}` }
);

export const mobileOpen = action<boolean>(ActionType.MOBILEOPEN_OPEN);

const groupsLoading = action<boolean>(ActionType.GROUPS_LOADING);
const groupsLoadingError = action<Error | null>(ActionType.GROUPS_LOADING_ERROR);
const groupsLoaded = action<Group[]>(ActionType.GROUPS_LOADED);

export function groupsLoad(token: string | undefined) {
  return async(dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(groupsLoading(true))
    try {
      const response = await fetch('/api/v1/group', {
        headers: { ...authorization(token) }
      });
      const data: Group[] = await response.json();
      dispatch(groupsLoaded(data));
    } catch (err) {
      dispatch(groupsLoadingError(err));
    }
  }
}

const groupAdding = action<boolean>(ActionType.GROUP_ADDING);
const groupAddingError = action<Error | null>(ActionType.GROUP_ADDING_ERROR);
const groupAdded = action<Group>(ActionType.GROUP_ADDED);

export const groupAdd =(history: History<any>,token: string | undefined, brand: string) => (
  async(dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(groupAdding(true));
    try {
      const response = await fetch('/api/v1/group', {
        headers: {
          ...authorization(token),
          'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          brand,
        }),
      });
      const data: Group = await response.json()
      dispatch(groupAdded(data));
      dispatch(groupAddingError(null));
      dispatch(groupAdding(false));
      dispatch(groupsLoad(token));
      history.push(`/group/${data.groupId}`);
    } catch (err) {
      dispatch(groupAddingError(err));
      dispatch(groupAdding(false));
    }
  }
);