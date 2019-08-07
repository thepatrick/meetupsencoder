import { History } from "history";
import { combineReducers } from "redux";
import { Event, Group, Talk } from "../model/Group";
import { groups } from './groups';
import * as mobileOpen from './mobileOpen';

export interface RootState {
	mobileOpen: boolean;
	groups: {
		byId: { [key: string]: Group };
		loading: boolean;
		error?: Error;
	};
	events: {
		byId: { [key: number]: Event };
	};
	talks: {
		byId: { [key: number]: Talk };
	};
}

export default (history: History) =>
	combineReducers({
		...mobileOpen,
		groups,
		// ...todoReducer,
	});
