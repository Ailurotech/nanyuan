import React from "react";
import Link from "next/link";

interface InstagramEmbedProps {
  url: string;
  href?: string;
}

const InstagramEmbed: React.FC<InstagramEmbedProps> = ({ url, href }) => {
  return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      {href ? (
        <Link href={href}>
          <img
            src={url}
            alt="Instagram post"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Link>
      ) : (
        <img
          src={url}
          alt="Instagram post"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
    </div>
  );
};

export default InstagramEmbed;
