// --------------------------------------------
// globals ==================================== 
// --------------------------------------------
const defaultHeaderFields = ['header', 'title', 'name']
const defaultMaxResultCount = 100
let config = {}
let allFields = []
let allItems = []
let activeFilters = {fields: {}, strings: []}
let filteredItems = []
// --------------------------------------------
// init process =============================== 
// --------------------------------------------
// find an element to put our catalog into
preparePage()

reportStatus('loading configuration...')
let configLoader = fetch('./jcudl-config.json')
configLoader.then( (cfgResponse) => {
    reportStatus('parsing configuration...')
    let cfgParser = cfgResponse.json()
    cfgParser.then( (cfg) => {
        // here we have the config loaded from the JSON file
        config = cfg

        // now we have config, we can load the items --------------
        let itemLoader = fetch(config?.dataUrl || './jcudl-data.json')
        itemLoader.then( (itemResponse) => {
            reportStatus('parsing data...')
            let itemParser = itemResponse.json()
            itemParser.then( (items) => {
                reportStatus('preparing page...')
                // here we have the items loaded from the JSON file
                allItems = items
                buildFilters()
                applyFilters()
                buildResultList()
            }).catch( err => {
                reportError('could not load list of items.')
            })
        }).catch( err => {
            reportError('could not load list of items.')
        })
        // done loading items --------------------------------------

    }).catch( err => {
        reportError('could not parse configuration file.')
    })
}).catch( err => {
    reportError('could not load configuration file.')
})
// --------------------------------------------
// Utility functions ========================== 
// --------------------------------------------
// compact function for making a DOM element
function makeNode(tag, className, ...content) {
    let node = document.createElement(tag)
    node.className = className
    node.append(...content)
    return node
}
// --------------------------------------------
function fetchConfig(url) {
    let configLoader = fetch(url)
    configLoader.then( (configResponse) => {
        let configParser = configResponse.json()
        configParser.then( (cfg) => {
            config.fields = cfg.fields
            config.hideValues = cfg.hideValues
            config.noFilter = cfg.noFilter
            config.hideFromSearch = cfg.hideFromSearch
        }).catch( err => {
            reportError('could not load configuration file.')
        })
    }).catch( err => {
        reportError('could not load configuration file.')
    })
}
// --------------------------------------------
function getFieldLabel(fieldId) {
    return config.fields[fieldId]?.label || fieldId.replaceAll('_', ' ')
}
// --------------------------------------------
function findUsefulField(item, fieldId) {
    const itemKeys = Object.keys(item)
    downcaseItemKeys = itemKeys.map( k => k.toLowerCase() )
    fieldIndex = downcaseItemKeys.indexOf(fieldId.toLowerCase())
    if (fieldIndex > -1) {
        if (item[itemKeys[fieldIndex]].toString().length > 0) {
            return itemKeys[fieldIndex]
        }
    }
    return false
}
// --------------------------------------------
// make a display field with a label and value 
// (unless it should not show the label, or 
// should be hidden entirely)
function makeField(fieldId, fieldValue, labelled, format) {

    fieldInfo = config.fields[fieldId]

    // if the display format says not to show it, return nothing
    if (fieldInfo?.display === 'hide') return ''

    // if the value is a hideValue, then return nothing
    if (config.hideValues.includes(fieldValue)) return ''

    let field
    let className = ['field', format].join(' ')
    if (labelled) {
        // label is the override from the config, or the fieldId with underscores replaced by spaces
        label = getFieldLabel(fieldId)
        let fieldLabel = makeNode('dt', 'fieldLabel', label)
        let fieldContent = makeNode('dd', 'fieldValue', fieldValue)
        field = makeNode('dl', className, fieldLabel, fieldContent)
    } else {
        field = makeNode('p', className, fieldValue)
    }
    return field
}
// --------------------------------------------
function reportStatus(msg) {
    let res = document.querySelector('section.results')
    res.innerHTML = ''
    res.appendChild( makeNode('div', 'message status', msg) )
}
// --------------------------------------------
function reportError(err) {
    let res = document.querySelector('section.results')
    res.innerHTML = ''
    res.appendChild( makeNode('div', 'message error', err) )
}
// --------------------------------------------
// convenience function to add a filter to the 
// active filters list. If there's no field given,
// assume it's a string search filter
function addFilter(value, field) {
    if (field) {
        activeFilters.fields[field] = activeFilters.fields[field] || []
        activeFilters.fields[field].push(value)
    } else {
        activeFilters.strings.push(value)
    }
}
// --------------------------------------------
// convenience function to remove a filter from
// the active filters list. If there's no field 
// given, assume it's a string search filter
function removeFilter(value, field) {
    if (field) {
        activeFilters.fields[field] = activeFilters.fields[field].filter(f => f !== value)
        if (activeFilters.fields[field].length < 1) {
            delete activeFilters.fields[field]
        }
    } else {
        activeFilters.strings = activeFilters.strings.filter(f => f !== value)
    }
}
// --------------------------------------------
// construction of page elements ==============
// --------------------------------------------
// go through the fields we want to filter
// by, and make page elememnts for them
function preparePage() {
    // find the element to put our catalog into
    const catalogElement = document.querySelector('#jcudl-catalog')

    // if we have a catalog element, move our filters and results sections into it
    if (catalogElement) {
        const filtersElement = makeNode('section', 'filters')
        const birthStatusElement = makeNode('div', 'message status', 'Initialising...')
        const resultsElement = makeNode('section', 'results', birthStatusElement)
        catalogElement.append(filtersElement)
        catalogElement.append(resultsElement)
    } else {
        console.error('jcudl: JCU Digital Catalog could not find a #jcudl-catalog element.')
    }
}
// --------------------------------------------
function buildFilters() {

    // get every field in any item
    allFields = []
    allItems.forEach( item => {
        for (var field in item) {
            if (!allFields.includes(field)) {
                allFields.push(field)
            }
        }
    })

    const filtersElement = document.querySelector('section.filters')
    filtersElement.innerHTML = ''

    const currentFilters = makeNode('div', 'currentFilters')
    filtersElement.append( currentFilters )

    filtersElement.append( makeNode('div', 'filtersHeader', 'Filter by') )

    allFields.forEach( fieldId => {
        buildFilter(fieldId)
    })

    // dev mode: add links to our files, to make refreshes easier

    let configLink = makeNode('a', 'faded smaller', 'config')
    configLink.setAttribute('href', './jcudl-config.json')
    configLink.setAttribute('target', '_blank')

    let jsLink = makeNode('a', 'faded smaller', 'script')
    jsLink.setAttribute('href', './jcudl.js')
    jsLink.setAttribute('target', '_blank')

    let cssLink = makeNode('a', 'faded smaller', 'style')
    cssLink.setAttribute('href', './jcudl-style.css')
    cssLink.setAttribute('target', '_blank')

    let devModeLinks = makeNode('div', 'devlinks center faded smaller', jsLink, " ", configLink, " ", cssLink)
    filtersElement.append(devModeLinks)
}
// --------------------------------------------
// make page elements for a single filter
function buildFilter(fieldId) {

    // if the config says not to filter by this, skip it
    if (config.noFilter.includes(fieldId)) return

    // if the config says not to filter on this field, skip it
    if (config.fields[fieldId]?.filter === 'none') return

    // get field's domain from all items list
    let domain = []

    allItems.forEach( item => {
        let fieldValue = item[fieldId]
        // sometimes fields are arrays of values, make anything
        // that's NOT an array into one
        if (!(fieldValue instanceof Array)) {
            fieldValue = [fieldValue]
        }
        fieldValue.forEach( val => {
            if (!domain.includes(val)) {
                domain.push(val)
            }
        })
    })
    // sorrt alphabetically but put "empty" values at the start of the list
    domain.sort( (a, b) => {
        // TODO: does this need to handle "both empty"?
        if (config.hideValues.includes(a)) return -1
        if (config.hideValues.includes(b)) return 1
        // otherwise sort alphabetically
        return a.localeCompare(b)
    })

    let filterLabel = makeNode('b', 'filterLabel', getFieldLabel(fieldId))
    let filterToggle = makeNode('button', 'filterToggle clickable')
    filterToggle.addEventListener('click', (event) => {
        // when the toggle is clicked, add or remove 
        // the "closed" class on the parent filter
        event.target.closest('.filter').classList.toggle('closed')

    }) 
    let filterHead = makeNode('div', 'filterHead', filterLabel, filterToggle)
    let filterList = makeNode('div', 'filterList', ...(domain.map( domItem => buildCheckboxItem(domItem, fieldId))))

    let filterElement = makeNode('div', 'filter closed', filterHead, filterList)

    document.querySelector('section.filters').append(filterElement)
}
// --------------------------------------------
// make a checkbox item for one possible
// value for a given field's filter
function buildCheckboxItem(value, field) {
    let cb = makeNode('input')
    cb.setAttribute('type', 'checkbox')

    cb.addEventListener('change', (event) => {
        if (event.target.checked) {
            addFilter(value, field)
        } else {
            removeFilter(value, field)
        }
        applyFilters()
        buildResultList()
    })

    let label = makeNode('label', '', cb, value)
    let item = makeNode('div', 'filterItem', label)
    return item
}
// --------------------------------------------
// make page elements for the active filters
function buildFilterDisplay() {

    // first, field filters
    for (var field in activeFilters.fields) {
        let activeFilterFieldElement = document.querySelector(`.activeFilter[field=${field}]`)
        let values = activeFilters.fields[field]
        filteredItems = filteredItems.filter( item => {
            // if the item doesn't have the field, filter it out
            if (!item[field]) return false
            // if the item has the field, but it's not an array, make it an array
            let itemValues = item[field]
            if (!(itemValues instanceof Array)) {
                itemValues = [itemValues]
            }
            // if any of the item's values for the field are in the list of filter values, keep it
            return itemValues.some( val => values.includes(val) )
        })
    }

}
// --------------------------------------------
// filter the list of all items by whatever is
// selected in the filter list
function applyFilters() {

    filteredItems = allItems

    console.log(activeFilters)
    if (Object.keys(activeFilters.fields).length < 1) {
        filteredItems = allItems
    } else {
        // if we have any active filters, we need to apply them
        filteredItems = []
        let field, values
        allItems.every( item => {
            for (field in activeFilters.fields) {
                values = activeFilters.fields[field]
                // if the item doesn't have the field, we don't want it
                if (!item[field]) continue;
                // if the item has the field, but it's not an array, make it an array
                let itemValues = item[field]
                if (!(itemValues instanceof Array)) {
                    itemValues = [itemValues]
                }
                // if any of the item's values for the field are in the list of filter values, keep it
                if (itemValues.some( val => values.includes(val) )) {
                    filteredItems.push(item)
                    break
                }
            }
            // we're using .every() so that we can break by returning false
            // use <= so we get one extra item (we won't show it, but if there's
            // more than the max, we can tell the user about the cap)
            return (filteredItems.length <= (config.maxResultCount || defaultMaxResultCount))
        })
    }
}
// --------------------------------------------
// go through the filtered list of results and
// make page elements for them all
function buildResultList() {
    let resultElement = document.querySelector('section.results')
    resultElement.innerHTML = ""

    if (filteredItems.length < 1) {
        reportStatus('no items to display')
    }

    // do we have more results than our display cap?
    const displayCap = config.maxResultCount || defaultMaxResultCount
    let capMessage = `showing all ${filteredItems.length} results`
    if (filteredItems.length === 1) {
        capMessage = `showing the only result`
    }
    if (filteredItems.length > displayCap) {
        capMessage = `showing first ${displayCap} results`
        filteredItems = filteredItems.slice(0, displayCap)
    }

    filteredItems.forEach( item => {
        resultElement.append(buildResult(item))
    })

    resultElement.append( makeNode('div', 'message count', capMessage) )
}
// --------------------------------------------
// make page elements for a single result item 
function buildResult(item) {

    // header
    let header = makeNode('div', 'header clickable')

    // if we can do an icon, that's the first thing into the header
    let iconFieldName = config.iconField || findUsefulField(item, 'icon')
    let iconClickUrl = config.iconUrl || findUsefulField(item, 'url')
    if (iconFieldName) {
        let icon = makeNode('div', 'icon', item[iconFieldName])
        if (iconClickUrl 
                && iconClickUrl.toString().length > 0 
                && item[iconClickUrl] 
                && item[iconClickUrl].toString().length > 0
            ) {
            icon.classList.add('clickable')
            icon.addEventListener('click', (event) => {
                window.open(item[iconClickUrl], '_blank')
            })
        }
        header.append(icon)
    }

    let fieldIdList = Object.keys(config.fields)

    // are there any fields nominated for the header?
    let headerFields = fieldIdList.filter( fieldId => config.fields[fieldId].display?.includes('header') )

    if (headerFields.length === 0) {
        // if the config doesn't help find header fields, look at
        // each of our default header field names in turn
        defaultHeaderFields.forEach( fieldId => {
             let headerField = findUsefulField(item, fieldId)
             if (headerField) { 
                headerFields.push(headerField)
            }
        })
        // if we didn't have config'd headers and also didn't find
        // any default header fieldnames, use the item's first field
        if (headerFields.length === 0) {
            headerFields.push(Object.keys(item)[0])
        }
    }

    headerFields.forEach( fieldId => {
        cfg = config.fields[fieldId] || { display: '', format: '' }
        let field = makeField(fieldId, item[fieldId], !cfg.display.includes('unlabel'), cfg.format)
        header.append( makeNode('p', '', field) )
    })



    header.addEventListener('click', (event) => {
        // when the title is clicked, add or remove 
        // the "closed" class on the parent result
        event.target.closest('.result').classList.toggle('closed')
    })

    // "normal" details
    const quietFields = config?.quietFields || []

    let details = makeNode('div', 'details')
    for (var fieldKey in item) {
        if (!quietFields.includes(fieldKey) && !headerFields.includes(fieldKey)) {
            let fieldValue = item[fieldKey]
            let field = makeField(fieldKey, item[fieldKey], true)
            details.append(field)
        }
    }

    // "quiet" details
    let hasQuiet = true
    let quietDetails = makeNode('div', 'quiet')
    for (var fieldKey in item) {
        if (quietFields.includes(fieldKey)) {
            let fieldValue = item[fieldKey]
            let field = makeField(fieldKey, item[fieldKey], true)
            quietDetails.append(field)
        }
    }

    let showQuiet = ''
    if (hasQuiet) {
        const quietLabel = config?.quietLabel || 'more >'
        const quietLabelFormat = config?.quietLabelFormat || 'faded italic center'
        showQuiet = makeNode('p', 'quietLabel clickable ' + quietLabelFormat, quietLabel)
        showQuiet.addEventListener('click', (event) => {
            // when the showQuiet is clicked, add or remove 
            // the "terse" class on the parent result
            event.target.closest('.result').classList.toggle('terse')
        })
        details.append(showQuiet)
    }

    result = makeNode('div', 'result closed terse', header, details, quietDetails)

    return result
}
