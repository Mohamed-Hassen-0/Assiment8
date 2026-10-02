import { model, Schema } from "mongoose";

const notesSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (value) {
          return value!==value.toUpperCase()
        },
        message: (props) => `"${props.value}" must not be entirely uppercase`,
      },
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const NotesModel = model("Note", notesSchema);

export default NotesModel;