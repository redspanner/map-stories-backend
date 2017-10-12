const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const Schema = mongoose.Schema;

const editorSchema = new Schema({
  // _id: Schema.Types.ObjectId, //in documentation (http://mongoosejs.com/docs/populate.html) but causes error, why?
  name: String,
  avatar: String,
});

const Editor = mongoose.model('Editor', editorSchema);

Editor.createEditor = async (editorData) => {
  const newEditor = new Editor ({
    // _id: new ObjectId(),
    name: editorData.name,
    avatar: editorData.avatar,
  });
  await newEditor.save();
};

Editor.searchEditors = async (query) => {
  return await Editor.find({'name' : new RegExp(query, 'gi')});
};

module.exports = Editor;
