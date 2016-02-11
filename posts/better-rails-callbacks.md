---
title: "Better Rails Callbacks"
date: 2015-12-31T01:07:02Z
kind: article
link: http://blogs.sequoiainc.com/better-rails-callbacks/
location: Sequoia Blogs
---

ActiveRecord ships with lots of hooks into its lifecycle. They allow you to inject code into the persistence process.

Consider the hooks available when creating a new record:

1. `before_validation`
* `after_validation`
* `before_save`
* `around_save`
* `before_create`
* `around_create`
* `after_create`
* `after_save`
* `after_commit/after_rollback`

That’s a lot of hooks. But it seems straightforward, right?

The reality is more of a mess. Callbacks can be scattered throughout a model and across included modules. Consider the following model.

```
class Post < ActiveRecord::Base
  include Auditable

  belongs_to :user
  has_may :subscribers
  has_many :tags, through: :posts_tags

  validates :title, presence: true
  validates :body, presence: true

  after_save :notify_subscribers

  def notify_subscribers
    notification = Notification.new(
      text: “Post ${post.title} updated”)

    subscribers.each do |subscriber|
      notification.send(subscriber)
    end
  end

  before_validation do |post|
    post.title.try(:’strip!’)
    post.body.try(:’strip!’)
  end
end
```

What happens when you save a Post? You’ve got to read through the entire file to find all the callback hooks. If your team is disciplined enough, you could follow a convention and place all your callback declarations in a single point, but this still doesn’t cover included modules. Plus, you still must remember the Rails callback order.

There’s a better way.

```
class SavePost
  class << self do
    def call(post)
      ActiveRecord::Base.transaction do
        trim_fields(post)
        post.save!
        create_audit_record(post)
        notify_subscribers(post)
      end
    end

    private

    def trim_fields(post)
      post.title.try(:’strip!’)
      post.body.try(:’strip!’)
    end

    def create_audit_record(post)
      created_or_updated = post.new_record? ? 'created' : 'updated'

      AuditRecord.create(
        text: "Post #{post.title} #{created_or_updated}.")
    end

    def notify_subscribers(post)
      notification = Notification.new(
        text: "Post #{post.title} updated.")

      post.subscribers.each do |subscriber|
        notification.send(subscriber)
      end
    end
  end
end
```

Call them service objects, POROs or whatever, the point is everything is explicitly spelled out in ordinary Ruby. By extracting the logic involved in saving a post, we've made it easier to reason about. A side-effect is that our model is now focused on hydrating and persisting instances to the database, resulting in cleaner model code::

```
class Post < ActiveRecord::Base
  belongs_to :user
  has_may :subscribers
  has_many :tags, through: :posts_tags

  validates :title, presence: true
  validates :body, presence: true
end
```

To utilize your new class, simply replace `post.save` with `SavePost.call(post)`. It may seem taboo to stray from _The Rails Way_ but trust me, your future self will be grateful.


