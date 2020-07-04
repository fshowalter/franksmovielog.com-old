import React from "react"

function delay(func, wait, ...args) {
  return setTimeout(function delayWrap() {
    return func(...args)
  }, wait)
}

function underscoreDebounce(func, wait) {
  let result
  let timeout = null

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

export default function DebouncedInput({ value, placeholder, onChange }) {
  const debouncedHandleChange = underscoreDebounce(onChange, 150)

  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={e => debouncedHandleChange(e.target.value)}
    />
  )
}
