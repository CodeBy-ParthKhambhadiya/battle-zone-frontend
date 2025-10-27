import { redirect } from "next/navigation";

export default function ProfileRootRedirect() {
  redirect("/organizer/profile/update-user");
}
