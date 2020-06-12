exports.data = {
  layout: "default",
  title: "About",
};

exports.render = ({ content }) => {
  return this.html`
    <main>
      ${content}
    </main>
  `;
};
