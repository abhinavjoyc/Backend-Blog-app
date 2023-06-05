const router = require("express").Router();
const category = require("../models/category");


router.post("/",async(req,res)=>{
   const newCat  = new category(req.body);
   try{
    const savedCat = await newCat.save();
    res.status(200).json(savedCat);

   } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error", message: err.message });
  }
})




router.get("/",async(req,res)=>{
    try{
     const cats = await category.find()
     res.status(200).json(cats);
    } catch (err) {
     console.error(err);
     res.status(500).json({ error: "Internal Server Error", message: err.message });
   }
 })
 
 





module.exports = router;