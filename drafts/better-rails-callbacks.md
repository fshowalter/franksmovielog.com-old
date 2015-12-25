ActiveRecord ships with lots of hooks into its lifecycle. They allow you to inject code into the persistance process. 

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

That’s a lot of hooks. But it seems strightforward, right?

The reality is more of a mess. Callbacks can be scattered throughout a model and across included modules. Consider the following model.

class Post < ActiveRecord::Base
	include NotifyViaEmail

	belongs_to :user
	has_many :tags, through: :posts_tags

end

The problem comes when you go back to the model, or when you onboard a new developer and you’re left trying to figure out: What happens when I save this record. If your team is diciplined enough, you could follow a convention and place all your callback declarations in a single point, but this still requires you to memorize the Rails callback order.

I’ve found that a simpler solution almost always works.

class SaveUser

  class << self do

    def call(user)

     ActiveRecord::Base.transaction do

      stuff_to_do_before_validation(user)

      stuff_to_do_before_save(user)

      user.save!

      stuff_to_do_after_save(user)

      end

    end

   private

   def stuff_to_do_before_validation(user)

     …

   end 

 

  def stuff_to_do_before_save(user)

    …

   end

 

  def stuff_to_do_after_save(user)

  end

end

 

Call them service objects, POROs or whatever, the point is everything is explicitely spelled out in ordinary Ruby. Your model code is cleaner, and everything is easier to debug.