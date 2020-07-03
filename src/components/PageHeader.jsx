import React from "react"

export default function PageHeader({ header, slug }) {
  return (
    <Header>
      <Heading>{header}</Heading>
      <Slug>{slug}</Slug>
    </Header>
  )
}
