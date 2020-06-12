exports.data = {
  layout: "default",
  title: "How I Grade",
};

exports.render = ({ content }) => {
  return this.html`
    <main>
      ${content}
    </main>
  `;
};
