import { redirect } from "next/navigation";

export default function ProfileRootRedirect() {
  redirect("/admin/profile/update-user");
}
