import Parse from "parse";

export const createUserWithRole = async (
  username: string,
  email: string,
  password: string,
  userData?: any
) => {
  try {
    const user = new Parse.User();
    user.setUsername(username);
    user.setEmail(email);
    user.setPassword(password);

    // Set additional user data (optional)
    if (userData) {
      Object.assign(user, userData);
    }
    const acl = new Parse.ACL();
    acl.setPublicReadAccess(userData?.role === "manager" ? true : false); // Disable public read access

    // Grant read/write access to the user itself
    // acl.setReadAccess(user.id, true);
    // acl.setWriteAccess(user.id, true);

    // Create the "client" role if it doesn't exist yet
    const roleQuery = new Parse.Query(Parse.Role);
    roleQuery.equalTo("name", userData?.role || "client");
    let role = await roleQuery.first();

    if (!role) {
      role = new Parse.Role(userData?.role || "client", acl);
      await role.save();
    }

    // Assign the "client" role to the user
    user.setACL(acl);
    user.set("roles", [role]);
    user.set("role", role?.attributes?.name);
    user.save();

    // await user.signUp();
    console.log("User created successfully!");
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

function convertDateFormat(dateString: string): string {
  // Split the date string by the separator (".")
  const dateParts = dateString.split(".");

  // Check for valid input format (3 parts)
  if (dateParts.length !== 3) {
    throw new Error("Invalid date format. Expected 'DD.MM.YYYY'.");
  }

  // Swap day and month positions and join with a new separator ("/")
  return `${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`;
}

export const parseSignUp = async (
  username: string,
  email: string,
  birthday: string,
  password: string
): Promise<Parse.User | null> => {
  try {
    const user = new Parse.User();
    user.setUsername(username);
    user.setEmail(email);
    user.setPassword(password);

    user.set("birthday", convertDateFormat(birthday));

    const createdUser = await user.signUp();
    console.error(
      `Success! User ${createdUser.getUsername()} was successfully created!`
    );
    const acl = new Parse.ACL();
    acl.setPublicReadAccess(false); // Disable public read access

    // Grant read/write access to the user itself
    acl.setReadAccess(createdUser.id, true);
    acl.setWriteAccess(createdUser.id, true);

    // Create the "client" role if it doesn't exist yet
    const roleQuery = new Parse.Query(Parse.Role);
    roleQuery.equalTo("name", "client");
    let role = await roleQuery.first();

    if (!role) {
      role = new Parse.Role("client", acl);
      await role.save();
    }

    user.set("role", role?.attributes?.name);
    user.save();
    // Assign the "client" role to the user
    createdUser.setACL(acl);
    createdUser.set("roles", [role]);

    createdUser.setPassword(password);
    await createdUser.logIn();
    console.log("do login after signup", createdUser);

    return createdUser;
  } catch (error) {
    return null;
  }
};

export const parseLogin = async (
  username: string,
  password: string
): Promise<Parse.User | null> => {
  try {
    const loggedInUser: Parse.User = await Parse.User.logIn(username, password);
    return loggedInUser;
  } catch (error) {
    console.error(
      `login with username ${username} and password ${password} was failed :`,
      error
    );
    return null;
  }
};

export const parseLogout = async (): Promise<boolean> => {
  try {
    await Parse.User.logOut();
    // To verify that current user is now empty, currentAsync can be used
    const currentUser: Parse.User | undefined = Parse.User.current();
    if (currentUser === null) {
      console.error("Success! No user is logged in anymore!");
    }
    // Update state variable holding current user - context!!!

    return true;
  } catch (error: any) {
    console.error(`Error! ${error.message}`);
    return false;
  }
};