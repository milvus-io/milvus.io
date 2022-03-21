import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import HorizontalBlogCard from "../../components/card/HorizontalBlogCard";

export default function HomeContent(props) {
  const { homeData, newestBlog = [], trans, isMobile, isCollapse } = props;
  useEffect(() => {
    const banner = document.querySelector(".doc-h1-wrapper");
    if (!banner) {
      return;
    }
    if (isMobile) {
      banner.style.width = "100vw";
      return;
    }
    // original width: calc(100vw - 286px);
    const originalWidth = "calc(100vw - 286px)";
    const expandedWidth = "calc(100vw - 20px)";
    const width = isCollapse ? expandedWidth : originalWidth;
    banner.style.width = width;
  }, [isCollapse, isMobile]);
  return (
    <>
      <div
        className="doc-home-html-Wrapper doc-style"
        dangerouslySetInnerHTML={{ __html: homeData }}
      />
      <Typography component="section" className="doc-home-blog">
        <Typography variant="h2" component="h2">
          {trans("v3trans.docs.blogTitle")}
        </Typography>
        <HorizontalBlogCard blogData={newestBlog[0]} />
      </Typography>
    </>
  );
};
