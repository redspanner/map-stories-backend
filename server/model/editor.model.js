const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const Schema = mongoose.Schema;

const editorSchema = new Schema({
  name: String,
  email: String,
  token: String,
  picture: String,
});

const Editor = mongoose.model('Editor', editorSchema);

Editor.createEditor = (editorData) => {
  const newEditor = new Editor ({
    name: editorData.name,
    email: editorData.email,
    token: editorData.token,
    picture: editorData.picture,
  });
  return newEditor.save();
};

Editor.searchEditors = (query) => {
  const editors = Editor.find({'name' : new RegExp(query, 'gi')});
  if (editors) {
    return editors;
  }
};


module.exports = Editor;
