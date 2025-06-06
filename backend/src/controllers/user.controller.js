const { default: FriendRequest } = require("../models/FriendRequests");
const User = require("../models/User");

async function myReccommendations(req, res) {
    try{

        const userID = req.user.id;
        const user = req.user;

        const myReccommendations = await User.find({
            $and:[
                {_id:{$ne :userID}},
                {_id:{$nin:user.friends}},
                {isOnBoard:true},
            ]
        })

        return res.status(200).json({myReccommendations});
    }
        catch(err){
        return res.status(500).json({message:"Internal Server Error"});
        console.error("Error in myReccommendations:", err);
    }

}


async function myFriends(req, res) {
    try{
        const user = await User.findById(req.user.id).select("friends").populate("friends","fullname native_language learning_language profilepic");
        res.status(200).json(user.friends);
    }
    catch(err){
        return res.status(500).json({message:"Internal Server Error"});
        console.error("Error in myFriends:", err);
    }
}


async function sendFriendRequests(req , res) {
    try{
        const user = req.user.id;
        const{id:recipient_id} = req.params ;

        if(user === recipient_id){
            return res.status(400).json({message:"You cannot send friend request to yourself"});
        }

        const recipient = await User.findById(recipient_id);
        if(!recipient){
            return res.status(400).json({message: "User Not Found !!"})
        }

        if(recipient.friends.includes(user)){
            return res.status(400).json({message:"You are already Friend with this User"});
        }

        const existinguser = await FriendRequest.findOne({
            $or:[
                {sender:user , recipient:recipient_id},
                {sender:recipient_id , recipient:user},
            ],
        });

        if(existinguser){
            return res.status(400).json({message:"A Friend Request Already Exists from thsi user!!!"});
        }


        const FriendRequest = await FriendRequest.create({
            sender: user ,
            recipient:recipient_id,
        });

        return res.status(200).json({FriendRequest});

    }
    catch(err){
        return res.status(500).json({message:"Internal Server Error"});
        console.error("Error in sendFriendReuests:", err);
}
}


async function acceptFriendRequests(req, res) {
    try{
        const user = req.user.id ;
        const {id:request_id} = req.params;

        const FriendRequest = await FriendRequest.findById(request_id);

        if(!FriendRequest){
            return res.status(400).json({message:"Friend Request Not Found"});
        }

        if(FriendRequest.recipient.toString() !== user){
            return res.status(400).json({message:"You are not the recipient of this Friend Request"});
        }


        // to change the status of the Friend Request to accepted
        FriendRequest.status = "accepted";
        await FriendRequest.save();


        // to update the both reciepient and sender  friends list 
        await User.findByIdAndUpdate( user,
            {$addToSet:{frineds:FriendRequest.sender}},
        );

        await User.findByIdAndUpdate( FriendRequest.sender,
            {$addToSet:{friends:user}},
        );

        return res.status(200).json({message:"Friend Request Accepted Successfully"});

    }
    catch(err){
        return res.status(500).json({message:"Internal Server Error"});
        console.error("Error in acceptFriendRequests:", err);
    }
}


async function getFriendRequests(req , res) {
    try{
        const user = req.user.id ;

        const incomingreqs = await FriendRequest.find({
            recipient:user,
            status:"pending",
        }).populate("sender" , "fullName profilepic native_language learning_language");
    
    
       const acceptedreqs = await FriendRequest.find({
        recipient: user,
        status: "accepted",
       }).populate("recipient", "fullName profilepic");

       return res.status(200).json({
            incomingreqs,
            acceptedreqs
        });

    }
    catch(err){
        return res.status(500).json({message:"Internal Server Error"});
        console.error("Error in getFriendRequests:", err);
    }
}


async function OutgoingFriendRequests(req, res) {
    try{

        const user = req.user.id ;

       const outgoingreqs =  await FriendRequest.find({
        sender:user,
        status:"pending",
       }).populate("sender", "fullanem profilepic native_language learning_language");

       return res.status(200).json({outgoingreqs});
    }
    catch(err){
        return res.status(500).json({message:"Internal Server Error"});
        console.error("Error in OutgouingFriendRequests:", err);
    }
}



module.exports= {myReccommendations , myFriends , sendFriendRequests , acceptFriendRequests , getFriendRequests , OutgoingFriendRequests} ; 
