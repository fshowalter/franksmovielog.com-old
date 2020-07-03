import React from "react"

export const collator = new Intl.Collator("en", {
  sensitivity: "base",
  ignorePunctuation: true,
  numeric: true,
})

export function sortStringAsc(a, b) {
  if (a > b) {
    return 1
  }

  if (a < b) {
    return -1
  }

  return 0
}

export function sortStringDesc(a, b) {
  return -1 * sortStringAsc(a, b)
}

export default function Sorter({ label, children, collection, onChange }) {
  const handleChange = value => {
    const comparer = children[value]

    const sortedCollection = collection.sort(comparer)

    onChange(sortedCollection)
  }

  return (
    <label>
      {label}
      <select onChange={e => handleChange(e.target.value)}>
        {Object.keys(children).map(optionName => {
          return (
            <option key={optionName} value={optionName}>
              {optionName}
            </option>
          )
        })}
      </select>
    </label>
  )
}
