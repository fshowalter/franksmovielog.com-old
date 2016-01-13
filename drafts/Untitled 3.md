If you follow Rails development, you might be inclined to think Active Record is having an identity crisis. Aaron Patterson recently commited some sweeing changes, sarcastically dubbed adaquate record which attempted to normalize Active Record’s haphazard api. But the API itself is a symptom of a bigger problem, one that the Rails team seems somewhat recultant to address.

I can’t remember where I heard it, but someone said that ActiveRecord is “a great DSL for talking to the database.” This is true.

The problem is that a lot of other cruft has been grafted on to it. Consider the feature it seems everyone loves to hate, accepts_nested_attributes_for. My whole exposure to the internal debate over ActiveRecord came when I submitted a pull request to add dirty support for nested_attributes. Since the model supports setting them, it seemed logical (and helpful) for those attributes to be reflected in the ActiveModel::Dirty implementation. I’d originally tried to implement this as a gem, but since it required patching Rails private methods, that wasn’t a maintainable option.

The pull request was eventually rejected, which was fine, but the reason was telling. accepts_nested_attributes_for isn’t a popular method with the developers and they want to deprecate it in the future. The replacement? Who knows. There’s been talk of bringing form object into Rails, which is probably the best bet, but the project seems to have stalled.

Still, this debate got me thinking about how I architect my Rails applications, particularly where my pain points have been during upgrades.

The default pattern of putting domain logic inside the model classes may not be the best solution. Instead of thinking of our models as business entities, what if we started thinking of them as rows in a table. The _record_ in active record. If we do that, it drastically slims down the size of our models. Instead of holding business logic, they become entry points for a dsl used to query and persist data to our database.

But where to put our business logic?

Much like I was already doing to avoid callback confusion, I found that moving the domain logic into simple PORO’s drastically simplified my codebase.