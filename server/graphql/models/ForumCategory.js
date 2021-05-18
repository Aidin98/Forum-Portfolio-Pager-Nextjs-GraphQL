const BaseModel = require("./BaseModel");

class ForumCategory extends BaseModel {
  getAll() {
    return this.Model.find({});
  }

  getBySlug(slug) {
    console.log(slug)
    console.log("kategoria je ", this.Model.find({ slug }).populate("user"));
    return this.Model.findOne({ slug }).populate("user");
  }
}

module.exports = ForumCategory;
