import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [3, "Min char is 3 "],
      maxLength: [20, "Max char is 20 "],
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return /^01[0125][0-9]{8}$/.test(value);
        },
        message: (proops) => `${proops.value} is not valid Egyption Number `,
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 60,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

const UserModel = model("User",userSchema)

export default UserModel