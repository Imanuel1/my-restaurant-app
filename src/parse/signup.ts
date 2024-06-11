import Parse from "parse";

export const createUserWithRole = async (
  username: string,
  email: string,
  password: string,
  userData?: any
) => {
  const user = new Parse.User();
  user.setUsername(username);
  user.setEmail(email);
  user.setPassword(password);

  // Set additional user data (optional)
  if (userData) {
    Object.assign(user, userData);
  }

  const acl = new Parse.ACL();
  acl.setPublicReadAccess(false); // Disable public read access

  // Grant read/write access to the user itself
  acl.setReadAccess(user, true);
  acl.setWriteAccess(user, true);

  // Create the "client" role if it doesn't exist yet
  const roleQuery = new Parse.Query(Parse.Role);
  roleQuery.equalTo("name", userData?.role || "client");
  const role = await roleQuery.first();

  if (!role) {
    const clientRole = new Parse.Role(userData?.role || "client", acl);
    await clientRole.save();
  }

  // Assign the "client" role to the user
  user.setACL(acl);
  user.set("roles", [role]);

  try {
    await user.signUp();
    console.log("User created successfully!");
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

export const parseSignUp = async (
  username: string,
  email: string,
  password: string
): Promise<Parse.User | null> => {
  try {
    const user = new Parse.User();
    user.setUsername(username);
    user.setEmail(email);
    user.setPassword(password);

    const createdUser = await user.signUp();
    alert(
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

    console.log("role", role);
    user.set("role", role);
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
      alert("Success! No user is logged in anymore!");
    }
    // Update state variable holding current user - context!!!

    return true;
  } catch (error: any) {
    alert(`Error! ${error.message}`);
    return false;
  }
};
