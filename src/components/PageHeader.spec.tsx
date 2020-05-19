import React from "react";
import renderer from "react-test-renderer";

import PageHeader from "./PageHeader";

describe("PageHeader", () => {
  it("matches snapshot", () => {
    expect.assertions(1);
    const tree = renderer
      .create(<PageHeader heading="Test Page Header" slug="Test Slug" />)
      .toJSON();
    expect(tree).toMatchInlineSnapshot(`
      <header
        className="css-lvwljr"
      >
        <h1
          className="css-5u44ot"
        >
          Test Page Header
        </h1>
        <div
          className="css-1ek2tat"
        >
          Test Slug
        </div>
      </header>
    `);
  });
});
