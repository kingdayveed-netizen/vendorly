import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";

interface ProfileAvatarProps {
  profileImage?: string;
  fullName: string;
  isUploading: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  getImageUrl: (path: string | undefined) => string | undefined;
  getInitials: (name: string) => string;
}

export const ProfileAvatar = ({
  profileImage,
  fullName,
  isUploading,
  onImageUpload,
  getImageUrl,
  getInitials,
}: ProfileAvatarProps) => {
  return (
    <div className="relative">
      <div className="relative">
        <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
          <AvatarImage src={getImageUrl(profileImage)} className="h-full w-full object-cover"/>
          <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
            {getInitials(fullName)}
          </AvatarFallback>
        </Avatar>

        {/* Loading Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}
      </div>

      <label
        htmlFor="profile-image"
        className={`absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-lg border-2 border-background ${
          isUploading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isUploading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Camera className="h-3.5 w-3.5" />
        )}
        <input
          type="file"
          id="profile-image"
          className="hidden"
          accept="image/*"
          onChange={onImageUpload}
          disabled={isUploading}
        />
      </label>
    </div>
  );
};