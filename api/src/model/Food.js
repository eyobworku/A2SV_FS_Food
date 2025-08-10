const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Food",
  tableName: "foods",
  columns: {
    id: {
      primary: true,
      type: "integer",
      generated: true,
    },
    name: {
      type: "text",
    },
    rating: {
      type: "float",
      nullable: true,
    },
    food_image: {
      type: "text",
      nullable: true,
    },
    resturant: {
      type: "text",
      nullable: true,
    },
    resturant_image: {
      type: "text",
      nullable: true,
    },
    resturant_status: {
      type: "text",
      enum: ["open", "closed"],
      nullable: false,
      default: "open",
    },
  },
});
