# frozen_string_literal: true
require 'active_support/core_ext/integer/inflections'

helpers do
  def posts
    @posts ||= Dir["#{File.expand_path('../posts/', __FILE__)}/*.md"].each_with_object([]) do |file, posts|
      content = IO.read(file)
      next unless content =~ /\A(---\s*\n.*?\n?)^((---|\.\.\.)\s*$\n?)/m

      data = YAML.load(Regexp.last_match[1])
      data[:content] = $POSTMATCH
      data = OpenStruct.new(data)
      posts << data
    end.sort_by(&:date).reverse
  end

  def slugize(text, replacement: '-')
    slugged = text.encode('UTF-8', invalid: :replace, undef: :replace, replace: '?')
    slugged.gsub!('&', 'and')
    slugged.delete!(':')
    slugged.gsub!(/[^\w_\-#{Regexp.escape(replacement)}]+/i, replacement)
    slugged.gsub!(/#{replacement}{2,}/i, replacement)
    slugged.gsub!(/^#{replacement}|#{replacement}$/i, '')
    URI.escape(slugged.downcase, /[^\w+-]/i)
  end

  def kind_to_verb(kind)
    kind_to_verb_map = {
      'article' => 'published',
      'review' => 'reviewed'
    }

    kind_to_verb_map[kind] || 'published'
  end

  def inline_svg(filename, options = {})
    file = sprockets.find_asset(filename).to_s.force_encoding('UTF-8')
    doc = Nokogiri::HTML::DocumentFragment.parse file
    svg = doc.at_css 'svg'
    svg['class'] = options[:class] if options[:class].present?
    doc.to_html
  end

  def inline_stylesheet(name)
    content_tag :style do
      sprockets["#{name}.css"].to_s
    end
  end

  def inline_javascript(name)
    content_tag :script do
      sprockets["#{name}.js"].to_s
    end
  end
end

# Automatic image dimensions on image_tag helper
activate :automatic_image_sizes

# Reload the browser automatically whenever files change
configure :development do
  activate :livereload
end

set :css_dir, 'stylesheets'
set :js_dir, 'javascripts'
set :images_dir, 'images'

page 'feed.xml', mime_type: 'text/xml'

activate :deploy do |deploy|
  deploy.method = :git
  deploy.build_before = true
end

activate :autoprefixer do |config|
  config.inline = true
  config.browsers = ['last 2 versions', 'Firefox ESR']
end

# Build-specific configuration
configure :build do
  activate :minify_css, inline: true

  activate :minify_javascript, inline: true

  activate :minify_html, remove_input_attributes: false, remove_http_protocol: false

  activate :gzip
end
