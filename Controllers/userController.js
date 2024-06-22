const user = require("../Models/userModel.js");


const userPost = (req, res) =>{
    let user = new User(req.body);

    if (user.body){
        user.save()
        .then(()=>{
            res.status(201);
            res.json(teacher);
        })
        .catch((err)=>{
            res.status(442);
            res.json({
                error:'There was an errorsaving the user'
            });

        });
        


    } else{
        res.status(422);
        res.json({ error:'The data was not provided for user'});
    }
};


module.exports= {
    userPost
}