import { useEffect, useState } from "react";

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("https://www.reddit.com/r/nus.json")
      .then((response) => response.json())
      .then((data) => {
        setPosts(data.data.children.map((child: { data: any }) => child.data));
      });
  }, []);

  return (
    <div className="w-full mx-auto 2xl:max-w-7xl flex flex-col justify-center py-24 relative p-8">
      {posts.map((post: any) => (
        <div className="prose text-gray-500 prose-sm prose-headings:font-normal prose-headings:text-xl mx-auto max-w-sm w-full" key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.selftext}</p>
        </div>
      ))}
    </div>
  );
};

export default Feed;
