import { SignInResultInterface } from "../../../types";
import { UserInterface } from "./auth";

/**
 * Merge user metadata in sign in result object
 */
export function mergeUserMedata(
  signInResult: Partial<SignInResultInterface>,
  user: UserInterface
) {
  return {
    ...signInResult,
    id: user.id,
    emails: user?.user_details?.emails,
    name: user?.username,
    photoUrl: user?.user_details?.profile_url,
    firstName: user?.user_details?.firstname,
    lastName: user?.user_details?.lastname,
    phoneNumber: user?.user_details?.phone_number,
    address: user?.user_details?.address,
  } as SignInResultInterface;
}
