import CommunityForum from "../Pages/CommunityForm/components/CommunityForum";

export default function CommunityPage() {
  return (
    <div className="bg-gray-100 min-h-screen pt-16"> {/* Added pt-16 for navbar space */}
      <CommunityForum />
    </div>
  );
}