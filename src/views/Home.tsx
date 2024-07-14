import SearchInput from "../components/SearchInput";

const Home = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen px-4 gap-y-1 text-center dark:bg-custom-black">
      <h1 className="text-4xl font-bold font-mono tracking-wide text-gray-500 dark:text-white">
        RedditLite
      </h1>
      <h4 className="tracking-widest text-gray-500 dark:text-white">
        Lightweight Reddit Browsing
      </h4>
      <SearchInput />
      <p className="text-sm tracking-wide text-gray-500 dark:text-white mt-4">
        Browse the most popular posts from{" "}
        <a
          href="/r/popular"
          className="font-bold text-blue-500 dark:text-blue-300"
        >
          /r/popular
        </a>
      </p>
    </div>
  );
};

export default Home;
