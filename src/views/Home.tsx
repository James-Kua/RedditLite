import SearchInput from "../components/SearchInput";

const Home = () => {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white px-4 gap-y-1">
        <h1 className="text-4xl font-bold font-mono tracking-wide text-gray-500">RedditLite</h1>
        <h4 className="tracking-widest text-gray-500">Lightweight Reddit Browsing</h4>
        <SearchInput />
      </div>
    );
  };
  
  export default Home;
  