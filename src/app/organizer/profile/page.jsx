import { redirect } from "next/navigation";

export default function ProfileRootRedirect() {
  redirect("/player/profile/update-user");
}
