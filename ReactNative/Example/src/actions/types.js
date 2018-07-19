
export type Action =
  { type: 'PUSH_NEW_ROUTE', route: string }
    | { type: 'POP_ROUTE' }
    | { type: 'POP_TO_ROUTE', route: string }
    | { type: 'REPLACE_ROUTE', route: string }
    | { type: 'REPLACE_OR_PUSH_ROUTE', route: string }

    | { type: 'SET_USER', user: object}
    | { type: 'SET_FORMS', params: array}

    | { type: 'RECEIVE_CONFS', listConfs: array}  // 사용자 설정

    | { type: 'REQUEST_JOIN', params: array}
    | { type: 'RECEIVE_JOIN', join: array}
    | { type: 'ERROR_LOADING_JOIN' }

    | { type: 'ERROR_LOADING_BIDS' }

export type Dispatch = (action:Action | Array<Action>) => any;
export type GetState = () => Object;
export type PromiseAction = Promise<Action>;
