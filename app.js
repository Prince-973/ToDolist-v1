const express = require("express");
const Bodyparser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
const date = require(__dirname + "/date.js");

app.use(Bodyparser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

mongoose.connect(
  "mongodb+srv://princevaghasiya6847:Prince832004@cluster0.lubi6bg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/todolistDB"
);
const itemSchema = new mongoose.Schema({
  name: String,
});
const items = new mongoose.model("iteam", itemSchema);

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema],
});

const list = new mongoose.model("list", listSchema);

var item = "";
// var items = ["Buy Food", "Cook Food", "Eat Food"];
let works = [];

const item1 = items({
  name: "Welcome To ToDo-List",
});

const item2 = items({
  name: "Hit Add to Add an item",
});

const item3 = items({
  name: "<--- Hit it to Check Iteam",
});

const defualItem = [item1, item2, item3];
// Find all documents in the 'users' collection

app.get("/", (req, res) => {
  items
    .find({}, { name: 1 })
    .then(async (items1) => {
      if (items1.length > 0) {
        res.render("list", { ListTitle: "Today", NewlistItem: items1 });
      } else {
        try {
          // Assuming 'Item' is your Mongoose model for items
          await items.insertMany([item1, item2, item3]);
          console.log("Items are added");
        } catch (err) {
          console.error("Error:", err);
        }
        const allItems = await items.find({});
        res.render("list", { ListTitle: "Today", NewlistItem: allItems });
      }
    })
    .catch((err) => console.error(err));
});

app.post("/", (req, res) => {
  const itemName = req.body.item;
  const listName = req.body.list;
  const NewItem = new items({
    name: itemName,
  });
  if (listName === "Today") {
    NewItem.save();
    res.redirect("/");
  } else {
    list.findOne({ name: listName }).then((document) => {
      if (document) {
        document.items.push(NewItem);
        document.save();
        res.redirect("/" + listName);
        return;
      }
    });
  }
});

app.post("/delete", (req, res) => {
  const del = req.body.deletebox;
  const listname = req.body.listname;
  if (listname === "Today") {
    items
      .findOneAndDelete({ _id: del })
      .then((deletedItem) => {
        if (deletedItem) {
          console.log("Deleted item:", deletedItem);
        } else {
          console.log("Item not found");
        }
        res.redirect("/");
      })
      .catch((err) => {
        console.error("Error:", err);
        res.status(500).send("Internal Server Error");
      });
  } else {
    list
      .findOneAndUpdate({ name: listname }, { $pull: { items: { _id: del } } })
      .then((document) => {
        console.log("Item Been Deleted");
        res.redirect("/" + listname);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
app.get("/:customList", (req, res) => {
  const customeListName = _.capitalize(req.params.customList);

  list
    .findOne({ name: customeListName })
    .then((document) => {
      if (document) {
        res.render("list", {
          ListTitle: customeListName,
          NewlistItem: document.items,
        });
      } else {
        const list1 = new list({
          name: customeListName,
          items: defualItem,
        });
        list1.save();
        res.redirect("/" + customeListName);
      }
    })
    .catch((err) => console.error(err));
});

app.listen(3000, () => {
  console.log("app is Listing on port 3000");
});
