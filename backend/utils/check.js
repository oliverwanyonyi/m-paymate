const { User } = require('../models'); 


const checkExistingEmail = async (email) => {
  try {
    console.log(User,email);
   
    const existingUser = await User.findOne({
      where: {
        email,
      },
    });

    console.log("gdfghyi "+existingUser,User);


    return !!existingUser;
  } catch (error) {
    throw new Error('Error checking for existing email: ' + error.message);
  }
};


const checkExistingUsername = async (username) => {
  try {
    
    const existingUser = await User.findOne({
      where: {
        username,
      },
    });

    return !!existingUser;
  } catch (error) {
    throw new Error('Error checking for existing username: ' + error.message);
  }
};

module.exports= {checkExistingEmail,checkExistingUsername}