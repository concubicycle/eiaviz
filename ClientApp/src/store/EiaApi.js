import update from 'immutability-helper';


const RequestActions = resourceName => ({
    REQUEST: `${resourceName}_REQUEST`,
    FAILURE: `${resourceName}_FAILURE`,
    SUCCESS: `${resourceName}_SUCCESS`,
})

const CategoryRequest = RequestActions('CAT')
const SeriesRequest = RequestActions('SERIES')
const ExpandCategory = 'EXPAND_CATEGORY';

const catRequest = (id, key, actions) => {
    return (dispatch, getState) => {

        const cached = getState().eiaApi.categoryById[id];
        if (cached && cached.loaded) {
            dispatch({ type: actions.SUCCESS, id, json: cached })
            return;
        }

        fetch(`https://api.eia.gov/category/?api_key=${key}&category_id=${id}`)
            .then(resp => resp.json())
            .then(json => dispatch({ type: actions.SUCCESS, id, json }))
            .catch(err => dispatch({ type: actions.FAILURE, err }))
    }
}

const seriesRequest = (id, key, actions) => {
    return (dispatch, getState) => {


        fetch(`https://api.eia.gov/series/?api_key=${key}&series_id=${id}`)
            .catch(err => dispatch({ type: actions.FAILURE, err }))
            .then(resp => resp.json())
            .then(json => dispatch({ type: actions.SUCCESS, id, json }))
    }
}

export const actions = {
    getCategory: (id, key) => catRequest(id, key, CategoryRequest),
    getSeries: (id, key) => seriesRequest(id, key, SeriesRequest),
    expand: (id) => ({ type: ExpandCategory, id })
}


const categoryRoot = {
    category_id: 371,
    childseries: [],
    childcategories: [],
    expanded: true
}

const initialState = {
    apiKey: 'insert yours here',
    categoryRoot: categoryRoot,
    categoryById: {
        371: categoryRoot
    },
    seriesById: {
    }
}

export const reducer = (state, action) => {
    state = state || initialState;

    state = customReducer(state, action)

    switch (action.type) {
        case CategoryRequest.REQUEST: {
            return {
                ...state
            }
        }
        case CategoryRequest.FAILURE: {
            return {
                ...state
            }
        }
        case CategoryRequest.SUCCESS: {
            const cached = state.categoryById[action.id]

            const newCat = {
                ...cached,
                ...action.json.category,
                loaded: true
            }

            const categoryById = update(state.categoryById, {
                [action.id]: { $set: newCat }
            })
            state = update(state, {
                categoryById: { $set: categoryById }
            })

            const tree = buildTree(state, state.categoryRoot)
            state = update(state, {
                categoryRoot: { $set: tree }
            })

            return state
        }

        case SeriesRequest.REQUEST: {
            return {
                ...state
            }
        }
        case SeriesRequest.FAILURE: {
            return {
                ...state
            }
        }
        case SeriesRequest.SUCCESS: {
            let series = state.seriesById[action.id]
            if (!series) {
                series = action.json
            }
            return update(state, {
                seriesById: {
                    [action.id]: { $set: series }
                }
            })
        }


    }

    return state;
};

export const selectors = {
    categoryRoot: state => {
        return state.eiaApi.categoryRoot
    },
    apiKey: state => state.eiaApi.apiKey,
}

function buildTree(state, catCursor) {
    catCursor = state.categoryById[catCursor.category_id] || catCursor

    if (!catCursor.childcategories || catCursor.childcategories.length == 0) {
        return {
            ...catCursor
        }
    }

    return {
        ...catCursor,
        childcategories: catCursor.childcategories.map(cc => {
            const cat = state.categoryById[cc.category_id] || cc
            const hydrated = buildTree(state, cat);
            return { ...hydrated }
        }),
        childseries: { ...catCursor.childseries }
    }
}

function customReducer(state, action) {
    switch (action.type) {
        case ExpandCategory:
            var cat = state.categoryById[action.id];

            if (!cat)
                cat = { category_id: action.id, expanded: true }
            else
                cat = { ...cat, expanded: !cat.expanded }

            const categoryById = update(state.categoryById, {
                [action.id]: { $set: cat }
            })

            const upd = buildTreeUpdateObject(cat.category_id, state.categoryRoot, { expanded: { $set: !cat.expanded } })
            return update(state, {
                categoryRoot: upd,
                categoryById: { $set: categoryById }
            })
        default:
            return state;
    }
}

function buildTreeUpdateObject(targetCatId, cat, object) {
    if (cat.category_id == targetCatId) {
        return object
    } else if (cat.childcategories == null || cat.childcategories.length == 0) {
        return null;
    }

    for (let i = 0; i < cat.childcategories.length; i++) {
        const c = cat.childcategories[i];

        const updateobj = buildTreeUpdateObject(targetCatId, c, object)

        if (updateobj != null) {
            return { childcategories: { [i]: updateobj } }
        }
    }

    return null;
}
