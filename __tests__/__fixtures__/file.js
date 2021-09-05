import { actions as formActions, getModel } from 'react-redux-form'
import { t } from 'ttag'
import isObject from 'lodash/isObject'

import { findFilterById, findFilterByType } from './search/filters'

import { browserHistory } from '../Routes'
import * as waterApi from '../waterApi'

import 'url-search-params-polyfill'
import { Debug } from 'webpack-strip-debug-loader'
import isEqual from 'lodash/isEqual'
const {Debug} = require("webpack-strip-debug-loader")

export const SEARCH_AUTO_SUGGEST_BY_TERM = 'SEARCH_AUTO_SUGGEST_BY_TERM'
export const SEARCH_ITEMS = 'SEARCH_ITEMS'

export const SEARCH_SUGGEST_OCCUPATION = 'SEARCH_SUGGEST_OCCUPATION'
export const SEARCH_SUGGEST_MAJOR = 'SEARCH_SUGGEST_MAJOR'
export const SEARCH_SUGGEST_COLLEGE = 'SEARCH_SUGGEST_COLLEGE'

export const SEARCH_RESULTS_INIT = 'SEARCH_RESULTS_INIT'
export const SEARCH_RESULTS_APPEND = 'SEARCH_RESULTS_APPEND'
export const SEARCH_RESULTS_CLEAR = 'SEARCH_RESULTS_CLEAR'
export const ADD_SEARCH_ITEMS = 'ADD_SEARCH_ITEMS'

export const initSearchResults = items => {
  return { type: SEARCH_RESULTS_INIT, items }
}
export const appendSearchResults = items => {
  return { type: SEARCH_RESULTS_APPEND, items }
}
export const clearSearchResults = items => {
  return { type: SEARCH_RESULTS_CLEAR, items }
}

export const suggestCollegesFromInput = term => {
  const encodedTerm = encodeURIComponent(term)

  return waterApi.get(`/api/v1/search/${encodedTerm}`)({
    type: SEARCH_SUGGEST_COLLEGE
  })
}

export const suggestOccupationsFromInput = term => {
  const encodedTerm = encodeURIComponent(term)

  return waterApi.get(`/api/v1/search/${encodedTerm}`)({
    type: SEARCH_SUGGEST_OCCUPATION
  })
}

export const suggestMajorsFromInput = term => {
  const encodedTerm = encodeURIComponent(term)

  return waterApi.get(`/api/v1/search/${encodedTerm}`)({
    type: SEARCH_SUGGEST_MAJOR
  })
}

export const suggestItems = term => {
  const debugLogger = Debug('search:extractFilters')

  debugLogger('Building suggestion for', term)
  const encodedTerm = encodeURIComponent(term)

  debugLogger('AND', encodedTerm)

  return waterApi.get(`/api/v1/search/${encodedTerm}`)({
    type: SEARCH_AUTO_SUGGEST_BY_TERM
  })
}

export const search = term => form => dispatch => {
  const { types } = form
  const data = {
    term,
    types,
    filters: form
  }

  return dispatch(waterApi.post(`/api/v1/search/all`, data)({ type: SEARCH_ITEMS })).then(
    v => {
      dispatch(initSearchResults(v.results))
    }
  )
}

export const loadSubsequentSearchResults = (term, form) => (
  startIdx,
  endIdx
) => dispatch => {
  const debugLogger = Debug('search:loadSubsequentSearchResults')
  const { types } = form
  const data = {
    term,
    types,
    start: startIdx,
    end: endIdx,
    filters: form
  }

  return dispatch(
    waterApi.post(`/api/v1/search/all`, data)({ type: ADD_SEARCH_ITEMS })
  ).then(v => {
    debugLogger('APPENDING', v.results)
    dispatch(appendSearchResults(v.results))
  })
}

export const guessSearchResultType = (resultType, additionalMeta) => {
  const jobOrderTypeTitle = () => {
    if (additionalMeta) {
      if (additionalMeta.internship) {
        return t`Internship`
      }

      if (additionalMeta.apprenticeship) {
        return t`Apprenticeship`
      }
    }

    return t`Job Opening`
  }

  switch (resultType) {
    case 'occupation':
      return {
        className: 'occupation',
        iconClassName: `fal fa-briefcase`,
        title: t`Occupation`
      }
    case 'joborders':
      return {
        className: 'jobopening',
        iconClassName: `water-jobopening`,
        title: jobOrderTypeTitle()
      }
    case 'profiles':
      return {
        className: 'profile',
        iconClassName: `fal fa-briefcase`,
        title: t`Programs`
      }
    case 'moc':
      return {
        className: 'military',
        iconClassName: `water-military`,
        title: t`Military Occupation`
      }
    default:
      return {
        className: resultType.toLowerCase(),
        iconClassName: `water-${resultType.toLowerCase()}`,
        title: resultType.toUpperCase().slice(0, 1) + resultType.toLowerCase().slice(1)
      }
  }
}

export const extractFilters = (modelName, location) => (dispatch, getState) => {
  const debugLogger = Debug('search:extractFilters')
  const model = getModel(getState(), modelName)

  debugLogger('EXTRACTION BEGINNING', location, modelName, model)
  const params = new URLSearchParams(location?.search)

  for (const [key, value] of params.entries()) {
    debugLogger('PAR:', key, value)
  }

  const q = params.has('q') ? { term_filter: params.get('q') } : {}
  const propsToSetForm = {}
  const propsToReturn = {}

  debugLogger('ABOUT TO ITERATE', params.keys())

  for (const k of params.keys()) {
    debugLogger('KEY: ', k)

    if (k == 'ownership') {
      debugLogger('OWN', k, params.getAll(k))
    }

    propsToReturn[k] = params.getAll(k)

    if (k == 'assessment_filter' || k == 'job_listing_type') {
      const newV = {}

      params.getAll(k).forEach(v2 => {
        newV[v2] = true
      })
      propsToSetForm[k] = newV
    } else {
      if (k == 'ownership') {
        debugLogger('OWN', k, params.getAll(k))
      }

      propsToSetForm[k] = params.getAll(k)
    }
  }

  // debugLogger("EXTRACT1", q, propsToSetForm)

  Object.keys(model).forEach(k2 => {
    debugLogger('IN K2', k2, model[k2])
    const itm = model[k2]

    if (!Array.isArray(itm) && isObject(itm)) {
      propsToReturn[k2] = Object.keys(itm).flatMap(k3 => {
        //debugLogger("OBJECT KEYS", k3, k2, itm[k3])
        if (itm[k3]) {
          return [k3]
        }

        return []
      })
      debugLogger(model[k2])
    } else {
      //propsToReturn.append(k, k2)
    }
  })

  const newModel = {
    ...model,
    ...q,
    ...propsToSetForm
  }
  const newReturnModel = {
    ...model,
    ...q,
    ...propsToReturn
  }

  debugLogger('EXTRACT USED TO SET MODEL: ', newModel)
  debugLogger('EXTRACT TO SUBMIT: ', newReturnModel)

  if (Object.keys(newModel).length > 0) {
    dispatch(formActions.reset(modelName))
    debugLogger(`SETTING FORM ${modelName} to`, newModel)
    dispatch(formActions.change(modelName, newModel))
  } else {
    dispatch(formActions.reset(modelName))
    debugLogger(model)
  }

  /*
   *   debugLogger(newModel)
   * debugLogger(model)
   * debugLogger("EXTRACT1", model)
   */
  return newReturnModel
}

/**
 * Post processing of server response because some fields need more info from the server beyond what the queryString
 * provides. For example, selectize components with autocomplete need the choice value in addition to the id provided.
 * @param response
 * @param searchFilterFormName
 * @returns {(function(*): void)|*}
 */
export const setFormFromResponse = (response, searchFilterFormName) => dispatch => {
  const debugLogger = Debug('search:setFormFromResponse')

  debugLogger(
    'SFR: SETTING FORM FROM RESPONSE WITH',
    response,
    'INTO',
    searchFilterFormName
  )
  response?.filters.forEach(filter => {
    debugLogger('SFR: ITERATING OVER FILTER RESPONSE, using filter:', filter)
    const filterHandler = findFilterByType(filter)

    debugLogger('SFR: FOUND FILTER HANDLER', filterHandler)
    dispatch(filterHandler.setFormValue(searchFilterFormName))
  })
}

export const clearQueryParams = (filter, searchFilterFormName) => dispatch => {
  const debugLogger = Debug('search:clearQueryParams')

  debugLogger('About to clear params')

  if (searchFilterFormName) {
    debugLogger('Clearing form')
    debugLogger(dispatch(formActions.reset(searchFilterFormName)))
  }

  const url = window.location.pathname
  const params = new URLSearchParams()
  const { term_filter, ...filters } = filter

  debugLogger(term_filter, filter)

  if (term_filter) {
    params.set('q', term_filter)
  }

  //A bit of a hack, but the select doesn't reset well without having the default by US
  if ('state' in filters) {
    params.set('state', 'US')
  }

  const qs = params.toString()

  browserHistory.replace(`${url}${qs ? `?${qs}` : ``}`)
}

/**
 * This method will attempt to set a query parameter with the offset in the list so the infinite scroll can
 * reset itself on the back button
 *
 * @param location
 * @returns {(function(*=): void)|*}
 */
export const updateUrlWithFirstResultInWindow = location => idx => {
  const debugLogger = Debug('search:updateUrlWithFirstResultInWindow')

  /*
   * const params = new URLSearchParams(location?.search)
   * params.set("first", idx)
   * console.trace()
   */
  debugLogger(`Setting query parameter with offset ${idx}`, location)
  /*
   * if(idx > 0)
   *   browserHistory.replace(`${window.location.pathname}?${params.toString()}`)
   */
}

//Query parameters that we don't want to do any processing with in the test to see if we need to reload
const ignorableKeys = ['comp', 'first']

export const queryStringDiffRequiresReload = (queryString1, queryString2) => {
  const debugLogger = Debug('search:queryStringDiffRequiresReload')

  //    console("Received", queryString1, "comparing to", queryString2)
  if (isEqual(queryString1, queryString2)) {
    debugLogger('Strings passed equality test', queryString1, queryString2)

    return false
  }

  if (!!queryString1 || !!queryString2) {
    debugLogger(
      'At least one query strings evaluats to false',
      queryString1,
      queryString1.includes(queryString2)
    )

    return true
  }

  //They won't be equal since the previous lines checks that.
  if (queryString1.length == 0 || queryString2.length == 0) {
    debugLogger('Not equal, returning true to require reload')

    return true
  }

  const qs1 = new URLSearchParams(queryString1)
  const qs2 = new URLSearchParams(queryString2)

  ignorableKeys.forEach(k => {
    //debugLogger("Removing key:", k)
    qs1.delete(k)
    qs2.delete(k)
  })

  const allKeys = [...new Set([...qs1.keys(), ...qs2.keys()])]
  //debugLogger("Going to compare with keys", allKeys)
  const matches = allKeys.every(k => {
    if (qs1.has(k) && qs2.has(k)) {
      const allQs2Vals = qs1.getAll(k).sort()
      const allQs1Vals = qs2.getAll(k).sort()

      //debugLogger("Comparing: ", k, allQs1Vals, allQs2Vals)
      return (
        allQs1Vals.length === allQs2Vals.length &&
        allQs1Vals.every((v, i) => v === allQs2Vals[i])
      )
      //return allQs1Vals == allQs2Vals;
    }

    return false
  })

  debugLogger('Matched? ', matches)

  return !matches
}

export const updateQueryParams = (form, filtersFromResponse) => {
  const debugLogger = Debug('search:updateQueryParams')
  const url = window.location.pathname
  const { term_filter, q, ...filters } = form

  debugLogger('Removed q from form with value:', q)
  const params = new URLSearchParams()

  if (term_filter) {
    params.set('q', term_filter)
  }

  debugLogger(
    'FILTERS TO QUERYSTRING:',
    filters,
    'FROM',
    form,
    'WITH',
    filtersFromResponse
  )
  Object.keys(filters).forEach(k => {
    const filterHelper = findFilterById(k, filtersFromResponse)

    debugLogger('Using Helper', filterHelper)

    if (ignorableKeys.includes(k)) {
      //do nothing
    } else {
      filterHelper.updateSearchParams(filters[k], k, params)
    }
  })
  const qs = params.toString()

  debugLogger(`About to set URL ${url} with params ${qs}`, params)
  //const qs = (qParam ? [qParam, ...otherParams] : otherParams).join("&")
  browserHistory.replace(`${url}?${qs}`)
}
foo()
debug()
foo()
const debugIt = Debug()
foo()
const debug = Debug("double quotes")
bar()
debugLogger("something happened")
foo()
debugLogger(someFuncCall())
foo()
debug('no newline')