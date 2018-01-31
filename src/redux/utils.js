import { createAction } from 'redux-actions';

const startedSuffix = '/started';
const successSuffix = '/success';
const errorSuffix = '/error';

export function fetchStarted(baseActionName) {
    return `${baseActionName}${startedSuffix}`;
}

export function fetchSuccess(baseActionName) {
    return `${baseActionName}${successSuffix}`;
}

export function fetchError(baseActionName) {
    return `${baseActionName}${errorSuffix}`;
}

export function fetchActions(baseActionName) {
    return {
        started: createAction(fetchStarted(baseActionName)),
        success: createAction(fetchSuccess(baseActionName)),
        error: createAction(fetchError(baseActionName))
    };
}