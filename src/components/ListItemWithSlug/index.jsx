import React from "react"

export default function ListItemWithSlug({ title, slug, visible }) {
  const style = visible ? undefined : { display: "none" }

  return (
    <li style={style}>
      <div>{title}</div>
      <div>{slug}</div>
    </li>
  )
}
