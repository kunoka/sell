export function saveToLocal (id, key, value) {
  let seller = window.localStorage.__seller__
  if (!seller) {
    seller = {}
    seller[id] = {}
  } else {
    seller = JSON.parse(seller)
    if (!seller[id]) {
      seller[id] = {}
    }
  }
  seller[id][key] = value
  window.localStorage.__seller__ = JSON.stringify(seller)
}

export function loadFromLocal (id, key, def) {
  let seller = window.localStorage.__seller__
  if (!seller) {
    saveToLocal(id, key, def)
    return def
  }
  seller = JSON.parse(seller)
  if (!seller[id]) {
    saveToLocal(id, key, def)
    return def
  }
  if (!seller[id].hasOwnProperty(key)) {
    saveToLocal(id, key, def)
    return def
  }
  return seller[id][key]
}
