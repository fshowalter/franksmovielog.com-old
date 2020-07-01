exports.data = {
  layout: "default",
  title: "About",
};

exports.render = ({ content }) => {
  return this.html`
    <main class="grid-main">
      ${content}
    </main>
  `;
};
