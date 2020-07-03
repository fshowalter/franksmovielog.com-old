import React from "react"

import FilterControl from "../FilterControl/FilterControl"
import Label from "../Label"

const delay = (func, wait, ...args) => {
  return setTimeout(function delayWrap() {
    return func(...args)
  }, wait)
}

function underscoreDebounce(func, wait) {
  let result
  let timeout

  const later = function later(context, args) {
    timeout = null
    if (args) {
      result = func.apply(context, args)
    }
  }

  return function debouncedFunction(...args) {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = delay(later, wait, null, args)
    return result
  }
}

export default function TextFilter({ label, placeholder, handleChange }) {
  const debouncedHandleChange = underscoreDebounce(handleChange, 150)

  return (
    <FilterControl>
      <Label htmlFor={label}>{label}</Label>
      <div>
        <div
          name={label}
          placeholder={placeholder}
          onChange={e => debouncedHandleChange(e.target.value)}
        />
      </div>
    </FilterControl>
  )
}
