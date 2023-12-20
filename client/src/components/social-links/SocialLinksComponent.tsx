import React, {FC} from "react";
import {ActionIcon, Button, Group, UnstyledButton} from "@mantine/core";
import {
    IconBrandTiktok,
    IconBrandYoutube,
    IconBrandInstagram,
    IconBrandTwitter,
    IconBrandSoundcloud,
    IconBrandFacebook,
    IconBrandTwitch,
} from "@tabler/icons-react";

interface SocialLinksProps {
    socialLinks: {
        id: string;
        youtube: string;
        soundcloud: string;
        facebook: string;
        twitter: string;
        instagram: string;
        tiktok: string;
        twitch: string;
    };
}

const SocialLinksComponent: FC<SocialLinksProps> = ({socialLinks}) => {
    const nonEmptyLinks = Object.entries(socialLinks)
        .filter(([key, value]) => key !== "id" && value !== "")
        .map(([key, value]) => {
            let IconComponent;
            switch (key) {
                case "youtube":
                    IconComponent = IconBrandYoutube;
                    break;
                case "soundcloud":
                    IconComponent = IconBrandSoundcloud;
                    break;
                case "facebook":
                    IconComponent = IconBrandFacebook;
                    break;
                case "twitter":
                    IconComponent = IconBrandTwitter;
                    break;
                case "instagram":
                    IconComponent = IconBrandInstagram;
                    break;
                case "tiktok":
                    IconComponent = IconBrandTiktok;
                    break;
                case "twitch":
                    IconComponent = IconBrandTwitch;
                    break;
                default:
                    IconComponent = null;
            }

            if (!IconComponent) {
                return null;
            }

            return (
                <>
                    {value && (
                        <Button variant="subtle" radius="xl" component="a" href={value} key={key} target="_blank">
                            <IconComponent/>
                        </Button>
                    )}
                </>

            );
        });

    return <Group w="50%" justify="space-between">{nonEmptyLinks}</Group>;
};

export default SocialLinksComponent;
